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
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const STATUSES = ["pending", "confirmed", "preparing", "out_for_delivery", "delivered", "cancelled"];
const statusColor: Record<string, string> = {
  pending: "bg-yellow-500/15 text-yellow-700",
  confirmed: "bg-blue-500/15 text-blue-700",
  preparing: "bg-orange-500/15 text-orange-700",
  out_for_delivery: "bg-purple-500/15 text-purple-700",
  delivered: "bg-green-500/15 text-green-700",
  cancelled: "bg-red-500/15 text-red-700",
};

const AdminOrders = () => {
  const qc = useQueryClient();
  const [filter, setFilter] = useState("all");
  const [detail, setDetail] = useState<any | null>(null);

  const { data: orders = [], isLoading } = useQuery({
    queryKey: ["admin-orders"],
    queryFn: async () => {
      const { data, error } = await supabase.from("orders").select("*").order("created_at", { ascending: false });
      if (error) throw error; return data;
    },
  });

  const statusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase.from("orders").update({ status }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-orders"] });
      qc.invalidateQueries({ queryKey: ["admin-stats"] });
      toast.success("Order status updated");
    },
    onError: (e: any) => toast.error(e.message),
  });

  const filtered = filter === "all" ? orders : orders.filter((o: any) => o.status === filter);

  return (
    <AdminLayout title="Orders">
      <div className="flex justify-between items-center mb-4">
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-56"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            {STATUSES.map((s) => <SelectItem key={s} value={s}>{s.replace(/_/g, " ")}</SelectItem>)}
          </SelectContent>
        </Select>
        <span className="text-sm text-muted-foreground">{filtered.length} orders</span>
      </div>

      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Total (KES)</TableHead>
              <TableHead>Payment</TableHead>
              <TableHead>Status</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={7} className="text-center py-8 text-muted-foreground">Loading…</TableCell></TableRow>
            ) : filtered.length === 0 ? (
              <TableRow><TableCell colSpan={7} className="text-center py-8 text-muted-foreground">No orders</TableCell></TableRow>
            ) : filtered.map((o: any) => (
              <TableRow key={o.id} className="cursor-pointer" onClick={() => setDetail(o)}>
                <TableCell className="font-medium">{o.customer_name}</TableCell>
                <TableCell>{o.customer_phone}</TableCell>
                <TableCell className="text-xs">{new Date(o.created_at).toLocaleString()}</TableCell>
                <TableCell className="text-right font-semibold">{Number(o.total).toLocaleString()}</TableCell>
                <TableCell><Badge variant="outline">{o.payment_method}</Badge></TableCell>
                <TableCell onClick={(e) => e.stopPropagation()}>
                  <Select value={o.status} onValueChange={(v) => statusMutation.mutate({ id: o.id, status: v })}>
                    <SelectTrigger className={`w-40 h-8 text-xs ${statusColor[o.status] || ""}`}><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {STATUSES.map((s) => <SelectItem key={s} value={s}>{s.replace(/_/g, " ")}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell><Button variant="ghost" size="sm">View</Button></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={!!detail} onOpenChange={(o) => !o && setDetail(null)}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>Order Details</DialogTitle></DialogHeader>
          {detail && (
            <div className="space-y-3 text-sm">
              <div><span className="text-muted-foreground">Customer:</span> {detail.customer_name}</div>
              <div><span className="text-muted-foreground">Phone:</span> {detail.customer_phone}</div>
              {detail.customer_email && <div><span className="text-muted-foreground">Email:</span> {detail.customer_email}</div>}
              <div><span className="text-muted-foreground">Address:</span> {detail.delivery_address}</div>
              {detail.landmark && <div><span className="text-muted-foreground">Landmark:</span> {detail.landmark}</div>}
              {detail.instructions && <div><span className="text-muted-foreground">Notes:</span> {detail.instructions}</div>}
              <div className="border-t pt-3">
                <p className="font-medium mb-2">Items</p>
                {(Array.isArray(detail.items) ? detail.items : []).map((it: any, i: number) => (
                  <div key={i} className="flex justify-between py-1">
                    <span>{it.quantity ?? 1}× {it.name}</span>
                    <span>KES {Number(it.price ?? 0).toLocaleString()}</span>
                  </div>
                ))}
              </div>
              <div className="border-t pt-3 space-y-1">
                <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>KES {Number(detail.subtotal).toLocaleString()}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Delivery</span><span>KES {Number(detail.delivery_fee).toLocaleString()}</span></div>
                <div className="flex justify-between font-semibold text-base"><span>Total</span><span>KES {Number(detail.total).toLocaleString()}</span></div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default AdminOrders;
