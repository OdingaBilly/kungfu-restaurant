import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { toast } from "sonner";

type Role = "admin" | "manager" | "staff";
const ROLES: Role[] = ["admin", "manager", "staff"];

const AdminStaff = () => {
  const qc = useQueryClient();
  const [pending, setPending] = useState<Record<string, Role>>({});

  const { data: profiles = [] } = useQuery({
    queryKey: ["admin-profiles"],
    queryFn: async () => {
      const { data, error } = await supabase.from("profiles").select("id,full_name,email,phone");
      if (error) throw error; return data;
    },
  });
  const { data: roles = [] } = useQuery({
    queryKey: ["admin-all-roles"],
    queryFn: async () => {
      const { data, error } = await supabase.from("user_roles").select("id,user_id,role");
      if (error) throw error; return data;
    },
  });

  const rolesFor = (uid: string) => roles.filter((r: any) => r.user_id === uid);

  const addRole = useMutation({
    mutationFn: async ({ userId, role }: { userId: string; role: Role }) => {
      const { error } = await supabase.from("user_roles").insert({ user_id: userId, role });
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-all-roles"] }); toast.success("Role granted"); },
    onError: (e: any) => toast.error(e.message.includes("duplicate") ? "User already has that role" : e.message),
  });

  const removeRole = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("user_roles").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-all-roles"] }); toast.success("Role removed"); },
    onError: (e: any) => toast.error(e.message),
  });

  return (
    <AdminLayout title="Staff & Roles">
      <p className="text-sm text-muted-foreground mb-4">
        Grant <strong>admin</strong> (full control incl. roles), <strong>manager</strong> (manage listings & orders), or <strong>staff</strong> roles to registered users.
      </p>
      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Roles</TableHead>
              <TableHead>Grant role</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {profiles.length === 0 ? (
              <TableRow><TableCell colSpan={4} className="text-center py-8 text-muted-foreground">No registered users yet</TableCell></TableRow>
            ) : profiles.map((p: any) => (
              <TableRow key={p.id}>
                <TableCell className="font-medium">{p.full_name || "—"}</TableCell>
                <TableCell>{p.email}</TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1.5">
                    {rolesFor(p.id).length === 0 && <span className="text-xs text-muted-foreground">customer</span>}
                    {rolesFor(p.id).map((r: any) => (
                      <Badge key={r.id} variant="secondary" className="gap-1">
                        {r.role}
                        <button onClick={() => removeRole.mutate(r.id)}><X className="h-3 w-3" /></button>
                      </Badge>
                    ))}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Select value={pending[p.id] ?? ""} onValueChange={(v) => setPending({ ...pending, [p.id]: v as Role })}>
                      <SelectTrigger className="w-32 h-8"><SelectValue placeholder="Role" /></SelectTrigger>
                      <SelectContent>{ROLES.map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}</SelectContent>
                    </Select>
                    <Button size="sm" disabled={!pending[p.id]} onClick={() => addRole.mutate({ userId: p.id, role: pending[p.id] })}>Add</Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </AdminLayout>
  );
};

export default AdminStaff;
