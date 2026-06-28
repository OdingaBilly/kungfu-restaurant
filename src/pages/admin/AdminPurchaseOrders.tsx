import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
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
import { Plus, Trash2, Sparkles, Eye, ClipboardList, Download } from "lucide-react";
import { toast } from "sonner";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

type PoStatus = "draft" | "ordered" | "received" | "cancelled";

interface Line {
  id?: string;
  inventory_item_id: string | null;
  name: string;
  quantity: number;
  unit_cost: number;
}

interface PurchaseOrder {
  id: string;
  supplier_id: string | null;
  status: PoStatus;
  order_date: string | null;
  expected_date: string | null;
  received_date: string | null;
  notes: string | null;
  total: number;
  created_at: string;
}

const STATUS_META: Record<PoStatus, { label: string; variant: "secondary" | "default" | "outline" | "destructive" }> = {
  draft: { label: "Draft", variant: "outline" },
  ordered: { label: "Ordered", variant: "default" },
  received: { label: "Received", variant: "secondary" },
  cancelled: { label: "Cancelled", variant: "destructive" },
};

const today = () => new Date().toISOString().slice(0, 10);

const AdminPurchaseOrders = () => {
  const qc = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [viewId, setViewId] = useState<string | null>(null);

  // editing form state
  const [supplierId, setSupplierId] = useState<string | null>(null);
  const [expectedDate, setExpectedDate] = useState<string>("");
  const [notes, setNotes] = useState<string>("");
  const [lines, setLines] = useState<Line[]>([]);

  const { data: orders = [], isLoading } = useQuery({
    queryKey: ["admin-purchase-orders"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("purchase_orders")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as PurchaseOrder[];
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

  const { data: inventory = [] } = useQuery({
    queryKey: ["admin-inventory"],
    queryFn: async () => {
      const { data, error } = await supabase.from("inventory_items").select("*").order("name");
      if (error) throw error;
      return data as any[];
    },
  });

  const { data: viewLines = [] } = useQuery({
    queryKey: ["po-lines", viewId],
    enabled: !!viewId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("purchase_order_lines")
        .select("*")
        .eq("purchase_order_id", viewId!);
      if (error) throw error;
      return data as Line[];
    },
  });

  const supplierName = (id: string | null) => suppliers.find((s) => s.id === id)?.name ?? "—";

  const resetForm = () => {
    setSupplierId(null);
    setExpectedDate("");
    setNotes("");
    setLines([]);
  };

  const openNew = () => {
    resetForm();
    setDialogOpen(true);
  };

  const addLine = () =>
    setLines((l) => [...l, { inventory_item_id: null, name: "", quantity: 1, unit_cost: 0 }]);

  const updateLine = (idx: number, patch: Partial<Line>) =>
    setLines((l) => l.map((ln, i) => (i === idx ? { ...ln, ...patch } : ln)));

  const removeLine = (idx: number) => setLines((l) => l.filter((_, i) => i !== idx));

  const pickInventory = (idx: number, invId: string) => {
    if (invId === "custom") {
      updateLine(idx, { inventory_item_id: null });
      return;
    }
    const inv = inventory.find((i) => i.id === invId);
    if (inv) {
      updateLine(idx, {
        inventory_item_id: inv.id,
        name: inv.name,
        unit_cost: inv.unit_cost ?? 0,
        quantity: Math.max(1, (inv.reorder_level ?? 0) - (inv.quantity ?? 0)) || 1,
      });
    }
  };

  const autofillLowStock = () => {
    const low = inventory.filter(
      (i) => i.is_active && i.quantity <= i.reorder_level &&
        (!supplierId || i.supplier_id === supplierId)
    );
    if (low.length === 0) {
      toast.info(supplierId ? "No low-stock items for this supplier." : "No low-stock items found.");
      return;
    }
    setLines(
      low.map((i) => ({
        inventory_item_id: i.id,
        name: i.name,
        quantity: Math.max(1, (i.reorder_level ?? 0) - (i.quantity ?? 0)) || 1,
        unit_cost: i.unit_cost ?? 0,
      }))
    );
    toast.success(`Added ${low.length} low-stock item${low.length > 1 ? "s" : ""}`);
  };

  const linesTotal = lines.reduce((s, l) => s + Number(l.quantity || 0) * Number(l.unit_cost || 0), 0);

  const createMutation = useMutation({
    mutationFn: async () => {
      const validLines = lines.filter((l) => l.name.trim());
      if (validLines.length === 0) throw new Error("Add at least one item");
      const { data: poData, error: poErr } = await supabase
        .from("purchase_orders")
        .insert({
          supplier_id: supplierId,
          status: "draft",
          order_date: today(),
          expected_date: expectedDate || null,
          notes: notes || null,
          total: linesTotal,
        })
        .select("id")
        .single();
      if (poErr) throw poErr;
      const { error: lErr } = await supabase.from("purchase_order_lines").insert(
        validLines.map((l) => ({
          purchase_order_id: poData.id,
          inventory_item_id: l.inventory_item_id,
          name: l.name,
          quantity: Number(l.quantity) || 0,
          unit_cost: Number(l.unit_cost) || 0,
        }))
      );
      if (lErr) throw lErr;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-purchase-orders"] });
      setDialogOpen(false);
      resetForm();
      toast.success("Purchase order created");
    },
    onError: (e: any) => toast.error(e.message),
  });

  const statusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: PoStatus }) => {
      const patch: any = { status };
      if (status === "received") patch.received_date = today();
      const { error } = await supabase.from("purchase_orders").update(patch).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-purchase-orders"] });
      toast.success("Status updated");
    },
    onError: (e: any) => toast.error(e.message),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("purchase_orders").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-purchase-orders"] });
      setDeleteId(null);
      toast.success("Purchase order deleted");
    },
    onError: (e: any) => toast.error(e.message),
  });

  return (
    <AdminLayout title="Purchase Orders">
      <div className="flex justify-end mb-4">
        <Button onClick={openNew}>
          <Plus className="h-4 w-4" /> New Purchase Order
        </Button>
      </div>

      <div className="rounded-lg border bg-card overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Supplier</TableHead>
              <TableHead>Ordered</TableHead>
              <TableHead>Expected</TableHead>
              <TableHead>Received</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={7} className="text-muted-foreground">Loading…</TableCell></TableRow>
            ) : orders.length === 0 ? (
              <TableRow><TableCell colSpan={7} className="text-muted-foreground">No purchase orders yet. Generate one from low-stock items.</TableCell></TableRow>
            ) : orders.map((po) => (
              <TableRow key={po.id}>
                <TableCell className="font-medium">{supplierName(po.supplier_id)}</TableCell>
                <TableCell>{po.order_date ?? "—"}</TableCell>
                <TableCell>{po.expected_date ?? "—"}</TableCell>
                <TableCell>{po.received_date ?? "—"}</TableCell>
                <TableCell>KES {Number(po.total).toLocaleString()}</TableCell>
                <TableCell>
                  <Select value={po.status} onValueChange={(v) => statusMutation.mutate({ id: po.id, status: v as PoStatus })}>
                    <SelectTrigger className="w-[130px] h-8">
                      <SelectValue>
                        <Badge variant={STATUS_META[po.status].variant}>{STATUS_META[po.status].label}</Badge>
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {(Object.keys(STATUS_META) as PoStatus[]).map((s) => (
                        <SelectItem key={s} value={s}>{STATUS_META[s].label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="outline" size="sm" onClick={() => setViewId(po.id)}>
                    <Eye className="h-3.5 w-3.5" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => setDeleteId(po.id)}>
                    <Trash2 className="h-3.5 w-3.5 text-destructive" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Create dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader><DialogTitle>New Purchase Order</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Supplier</Label>
                <Select value={supplierId ?? "none"} onValueChange={(v) => setSupplierId(v === "none" ? null : v)}>
                  <SelectTrigger><SelectValue placeholder="Select supplier" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No supplier</SelectItem>
                    {suppliers.map((s) => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Expected delivery</Label>
                <Input type="date" value={expectedDate} onChange={(e) => setExpectedDate(e.target.value)} />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <Label>Items</Label>
              <div className="flex gap-2">
                <Button type="button" variant="secondary" size="sm" onClick={autofillLowStock}>
                  <Sparkles className="h-3.5 w-3.5" /> Fill low-stock
                </Button>
                <Button type="button" variant="outline" size="sm" onClick={addLine}>
                  <Plus className="h-3.5 w-3.5" /> Add row
                </Button>
              </div>
            </div>

            {lines.length === 0 ? (
              <p className="text-sm text-muted-foreground rounded-md border border-dashed p-4 text-center">
                No items yet. Use “Fill low-stock” to auto-generate from inventory below the reorder level.
              </p>
            ) : (
              <div className="space-y-2">
                {lines.map((ln, idx) => (
                  <div key={idx} className="grid grid-cols-12 gap-2 items-end">
                    <div className="col-span-5 space-y-1">
                      <Select
                        value={ln.inventory_item_id ?? "custom"}
                        onValueChange={(v) => pickInventory(idx, v)}
                      >
                        <SelectTrigger className="h-9"><SelectValue placeholder="Item" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="custom">Custom item</SelectItem>
                          {inventory.map((i) => <SelectItem key={i.id} value={i.id}>{i.name}</SelectItem>)}
                        </SelectContent>
                      </Select>
                      {ln.inventory_item_id === null && (
                        <Input
                          className="h-8"
                          placeholder="Item name"
                          value={ln.name}
                          onChange={(e) => updateLine(idx, { name: e.target.value })}
                        />
                      )}
                    </div>
                    <div className="col-span-2 space-y-1">
                      <Label className="text-xs">Qty</Label>
                      <Input className="h-9" type="number" value={ln.quantity}
                        onChange={(e) => updateLine(idx, { quantity: Number(e.target.value) })} />
                    </div>
                    <div className="col-span-3 space-y-1">
                      <Label className="text-xs">Unit cost</Label>
                      <Input className="h-9" type="number" value={ln.unit_cost}
                        onChange={(e) => updateLine(idx, { unit_cost: Number(e.target.value) })} />
                    </div>
                    <div className="col-span-2 flex justify-end">
                      <Button variant="ghost" size="sm" onClick={() => removeLine(idx)}>
                        <Trash2 className="h-3.5 w-3.5 text-destructive" />
                      </Button>
                    </div>
                  </div>
                ))}
                <div className="text-right text-sm font-medium pt-1">
                  Total: KES {linesTotal.toLocaleString()}
                </div>
              </div>
            )}

            <div className="space-y-1.5">
              <Label>Notes</Label>
              <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Delivery instructions, references…" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={() => createMutation.mutate()} disabled={createMutation.isPending}>Create PO</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View dialog */}
      <Dialog open={!!viewId} onOpenChange={(o) => !o && setViewId(null)}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><ClipboardList className="h-5 w-5" /> Purchase Order</DialogTitle>
          </DialogHeader>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Item</TableHead>
                <TableHead>Qty</TableHead>
                <TableHead>Unit cost</TableHead>
                <TableHead className="text-right">Subtotal</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {viewLines.map((l, i) => (
                <TableRow key={i}>
                  <TableCell>{l.name}</TableCell>
                  <TableCell>{l.quantity}</TableCell>
                  <TableCell>KES {Number(l.unit_cost).toLocaleString()}</TableCell>
                  <TableCell className="text-right">KES {(Number(l.quantity) * Number(l.unit_cost)).toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this purchase order?</AlertDialogTitle>
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

export default AdminPurchaseOrders;
