import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Plus, Pencil, Trash2, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

interface Item {
  id: string;
  name: string;
  supplier_id: string | null;
  unit: string | null;
  quantity: number;
  reorder_level: number;
  unit_cost: number | null;
  reorder_notes: string | null;
  is_active: boolean;
}

const AdminInventory = () => {
  const qc = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Partial<Item> | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data: items = [], isLoading } = useQuery({
    queryKey: ["admin-inventory"],
    queryFn: async () => {
      const { data, error } = await supabase.from("inventory_items").select("*").order("name");
      if (error) throw error;
      return data as Item[];
    },
  });

  const { data: suppliers = [] } = useQuery({
    queryKey: ["admin-suppliers"],
    queryFn: async () => {
      const { data, error } = await supabase.from("suppliers").select("id,name").order("name");
      if (error) throw error;
      return data as { id: string; name: string }[];
    },
  });

  const supplierName = (id: string | null) => suppliers.find((s) => s.id === id)?.name ?? "—";

  const saveMutation = useMutation({
    mutationFn: async (form: Partial<Item>) => {
      if (!form.name) throw new Error("Item name is required");
      const payload = {
        name: form.name,
        supplier_id: form.supplier_id || null,
        unit: form.unit || null,
        quantity: Number(form.quantity) || 0,
        reorder_level: Number(form.reorder_level) || 0,
        unit_cost: form.unit_cost != null && form.unit_cost !== ("" as any) ? Number(form.unit_cost) : null,
        reorder_notes: form.reorder_notes || null,
        is_active: form.is_active ?? true,
      };
      if (form.id) {
        const { error } = await supabase.from("inventory_items").update(payload).eq("id", form.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("inventory_items").insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-inventory"] });
      setDialogOpen(false); setEditing(null);
      toast.success("Inventory item saved");
    },
    onError: (e: any) => toast.error(e.message),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("inventory_items").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-inventory"] });
      setDeleteId(null);
      toast.success("Item deleted");
    },
    onError: (e: any) => toast.error(e.message),
  });

  return (
    <AdminLayout title="Inventory & Ingredients">
      <div className="flex justify-end mb-4">
        <Button onClick={() => { setEditing({ is_active: true, quantity: 0, reorder_level: 0 }); setDialogOpen(true); }}>
          <Plus className="h-4 w-4" /> New Item
        </Button>
      </div>

      <div className="rounded-lg border bg-card overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Item</TableHead>
              <TableHead>Supplier</TableHead>
              <TableHead>In stock</TableHead>
              <TableHead>Reorder at</TableHead>
              <TableHead>Unit cost</TableHead>
              <TableHead>Reorder notes</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={7} className="text-muted-foreground">Loading…</TableCell></TableRow>
            ) : items.length === 0 ? (
              <TableRow><TableCell colSpan={7} className="text-muted-foreground">No inventory items yet.</TableCell></TableRow>
            ) : items.map((it) => {
              const low = it.quantity <= it.reorder_level;
              return (
                <TableRow key={it.id} className={!it.is_active ? "opacity-50" : ""}>
                  <TableCell className="font-medium">{it.name}</TableCell>
                  <TableCell>{supplierName(it.supplier_id)}</TableCell>
                  <TableCell>
                    <span className="flex items-center gap-1.5">
                      {it.quantity} {it.unit ?? ""}
                      {low && <Badge variant="destructive" className="gap-1"><AlertTriangle className="h-3 w-3" /> Low</Badge>}
                    </span>
                  </TableCell>
                  <TableCell>{it.reorder_level} {it.unit ?? ""}</TableCell>
                  <TableCell>{it.unit_cost != null ? `KES ${it.unit_cost.toLocaleString()}` : "—"}</TableCell>
                  <TableCell className="max-w-[200px] truncate text-muted-foreground">{it.reorder_notes ?? "—"}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm" onClick={() => { setEditing(it); setDialogOpen(true); }}>
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => setDeleteId(it.id)}>
                      <Trash2 className="h-3.5 w-3.5 text-destructive" />
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editing?.id ? "Edit Item" : "New Item"}</DialogTitle></DialogHeader>
          {editing && (
            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label>Name</Label>
                <Input value={editing.name ?? ""} onChange={(e) => setEditing({ ...editing, name: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <Label>Supplier</Label>
                <Select
                  value={editing.supplier_id ?? "none"}
                  onValueChange={(v) => setEditing({ ...editing, supplier_id: v === "none" ? null : v })}
                >
                  <SelectTrigger><SelectValue placeholder="Select supplier" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No supplier</SelectItem>
                    {suppliers.map((s) => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>Unit (kg, L, pcs)</Label>
                  <Input value={editing.unit ?? ""} onChange={(e) => setEditing({ ...editing, unit: e.target.value })} />
                </div>
                <div className="space-y-1.5">
                  <Label>Unit cost (KES)</Label>
                  <Input type="number" value={editing.unit_cost ?? ""} onChange={(e) => setEditing({ ...editing, unit_cost: e.target.value as any })} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>Quantity in stock</Label>
                  <Input type="number" value={editing.quantity ?? 0} onChange={(e) => setEditing({ ...editing, quantity: Number(e.target.value) })} />
                </div>
                <div className="space-y-1.5">
                  <Label>Reorder level</Label>
                  <Input type="number" value={editing.reorder_level ?? 0} onChange={(e) => setEditing({ ...editing, reorder_level: Number(e.target.value) })} />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label>Reorder notes</Label>
                <Textarea value={editing.reorder_notes ?? ""} onChange={(e) => setEditing({ ...editing, reorder_notes: e.target.value })} placeholder="e.g. Order in cases of 12, lead time 3 days" />
              </div>
              <div className="flex items-center gap-2">
                <Switch checked={editing.is_active ?? true} onCheckedChange={(v) => setEditing({ ...editing, is_active: v })} />
                <Label>Active</Label>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={() => editing && saveMutation.mutate(editing)} disabled={saveMutation.isPending}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this item?</AlertDialogTitle>
            <AlertDialogDescription>This cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => deleteId && deleteMutation.mutate(deleteId)}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
};

export default AdminInventory;
