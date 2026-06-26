import { useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil, Trash2, Search } from "lucide-react";
import { toast } from "sonner";

interface Cat { id: string; name: string; slug: string }
interface Sub { id: string; name: string; category_id: string }
interface Item {
  id: string; sku: string; name: string; price: number;
  price_small: number | null; price_large: number | null;
  description: string | null; calories: number | null; tags: string[];
  is_combo: boolean; is_vegetarian: boolean; is_featured: boolean;
  spice_level: number | null; is_available: boolean;
  category_id: string; subcategory_id: string | null; sort_order: number;
}

const emptyForm: Partial<Item> = {
  sku: "", name: "", price: 0, description: "", tags: [],
  is_combo: false, is_vegetarian: false, is_featured: false, is_available: true,
};

const AdminItems = () => {
  const qc = useQueryClient();
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Partial<Item> | null>(null);
  const [tagsText, setTagsText] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data: cats = [] } = useQuery({
    queryKey: ["admin-cats"],
    queryFn: async () => {
      const { data, error } = await supabase.from("menu_categories").select("id,name,slug").order("sort_order");
      if (error) throw error; return data as Cat[];
    },
  });
  const { data: subs = [] } = useQuery({
    queryKey: ["admin-subs"],
    queryFn: async () => {
      const { data, error } = await supabase.from("menu_subcategories").select("id,name,category_id").order("sort_order");
      if (error) throw error; return data as Sub[];
    },
  });
  const { data: items = [], isLoading } = useQuery({
    queryKey: ["admin-items"],
    queryFn: async () => {
      const { data, error } = await supabase.from("menu_items").select("*").order("name");
      if (error) throw error; return data as Item[];
    },
  });

  const catName = (id: string) => cats.find((c) => c.id === id)?.name ?? "—";

  const filtered = useMemo(() => {
    return items.filter((i) => {
      const matchSearch = `${i.name} ${i.sku}`.toLowerCase().includes(search.toLowerCase());
      const matchCat = catFilter === "all" || i.category_id === catFilter;
      return matchSearch && matchCat;
    });
  }, [items, search, catFilter]);

  const saveMutation = useMutation({
    mutationFn: async (form: Partial<Item>) => {
      const payload = {
        sku: form.sku, name: form.name, price: Number(form.price) || 0,
        price_small: form.price_small ? Number(form.price_small) : null,
        price_large: form.price_large ? Number(form.price_large) : null,
        description: form.description || null,
        calories: form.calories ? Number(form.calories) : null,
        tags: tagsText.split(",").map((t) => t.trim()).filter(Boolean),
        is_combo: !!form.is_combo, is_vegetarian: !!form.is_vegetarian,
        is_featured: !!form.is_featured, is_available: form.is_available !== false,
        spice_level: form.spice_level ? Number(form.spice_level) : null,
        category_id: form.category_id,
        subcategory_id: form.subcategory_id || null,
      };
      if (!payload.category_id) throw new Error("Pick a category");
      if (!payload.sku || !payload.name) throw new Error("Name and SKU are required");
      if (form.id) {
        const { error } = await supabase.from("menu_items").update(payload).eq("id", form.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("menu_items").insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-items"] });
      qc.invalidateQueries({ queryKey: ["menu"] });
      setDialogOpen(false); setEditing(null);
      toast.success("Listing saved");
    },
    onError: (e: any) => toast.error(e.message || "Failed to save"),
  });

  const toggleMutation = useMutation({
    mutationFn: async ({ id, field, value }: { id: string; field: string; value: boolean }) => {
      const { error } = await supabase.from("menu_items").update({ [field]: value }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-items"] });
      qc.invalidateQueries({ queryKey: ["menu"] });
    },
    onError: (e: any) => toast.error(e.message),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("menu_items").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-items"] });
      qc.invalidateQueries({ queryKey: ["menu"] });
      setDeleteId(null);
      toast.success("Listing deleted");
    },
    onError: (e: any) => toast.error(e.message),
  });

  const openNew = () => { setEditing({ ...emptyForm }); setTagsText(""); setDialogOpen(true); };
  const openEdit = (it: Item) => { setEditing(it); setTagsText((it.tags ?? []).join(", ")); setDialogOpen(true); };

  return (
    <AdminLayout title="Listings & Pricing">
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search name or SKU..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
        <Select value={catFilter} onValueChange={setCatFilter}>
          <SelectTrigger className="w-56"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All categories</SelectItem>
            {cats.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
          </SelectContent>
        </Select>
        <Button onClick={openNew}><Plus className="h-4 w-4" /> New Listing</Button>
      </div>

      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>SKU</TableHead>
              <TableHead>Category</TableHead>
              <TableHead className="text-right">Price (KES)</TableHead>
              <TableHead className="text-center">Featured</TableHead>
              <TableHead className="text-center">Available</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={7} className="text-center py-8 text-muted-foreground">Loading…</TableCell></TableRow>
            ) : filtered.length === 0 ? (
              <TableRow><TableCell colSpan={7} className="text-center py-8 text-muted-foreground">No listings found</TableCell></TableRow>
            ) : filtered.map((it) => (
              <TableRow key={it.id}>
                <TableCell className="font-medium">
                  {it.name}
                  {it.is_combo && <Badge variant="secondary" className="ml-2">Combo</Badge>}
                </TableCell>
                <TableCell className="text-xs text-muted-foreground font-mono">{it.sku}</TableCell>
                <TableCell>{catName(it.category_id)}</TableCell>
                <TableCell className="text-right font-semibold">{Number(it.price).toLocaleString()}</TableCell>
                <TableCell className="text-center">
                  <Switch checked={it.is_featured} onCheckedChange={(v) => toggleMutation.mutate({ id: it.id, field: "is_featured", value: v })} />
                </TableCell>
                <TableCell className="text-center">
                  <Switch checked={it.is_available} onCheckedChange={(v) => toggleMutation.mutate({ id: it.id, field: "is_available", value: v })} />
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" onClick={() => openEdit(it)}><Pencil className="h-4 w-4" /></Button>
                  <Button variant="ghost" size="icon" onClick={() => setDeleteId(it.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editing?.id ? "Edit Listing" : "New Listing"}</DialogTitle></DialogHeader>
          {editing && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5 col-span-2 sm:col-span-1">
                <Label>Name</Label>
                <Input value={editing.name ?? ""} onChange={(e) => setEditing({ ...editing, name: e.target.value })} />
              </div>
              <div className="space-y-1.5 col-span-2 sm:col-span-1">
                <Label>SKU</Label>
                <Input value={editing.sku ?? ""} onChange={(e) => setEditing({ ...editing, sku: e.target.value })} />
              </div>
              <div className="space-y-1.5 col-span-2">
                <Label>Description</Label>
                <Textarea value={editing.description ?? ""} onChange={(e) => setEditing({ ...editing, description: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <Label>Price (KES)</Label>
                <Input type="number" value={editing.price ?? 0} onChange={(e) => setEditing({ ...editing, price: Number(e.target.value) })} />
              </div>
              <div className="space-y-1.5">
                <Label>Calories</Label>
                <Input type="number" value={editing.calories ?? ""} onChange={(e) => setEditing({ ...editing, calories: Number(e.target.value) })} />
              </div>
              <div className="space-y-1.5">
                <Label>Price Small (optional)</Label>
                <Input type="number" value={editing.price_small ?? ""} onChange={(e) => setEditing({ ...editing, price_small: Number(e.target.value) })} />
              </div>
              <div className="space-y-1.5">
                <Label>Price Large (optional)</Label>
                <Input type="number" value={editing.price_large ?? ""} onChange={(e) => setEditing({ ...editing, price_large: Number(e.target.value) })} />
              </div>
              <div className="space-y-1.5">
                <Label>Category</Label>
                <Select value={editing.category_id ?? ""} onValueChange={(v) => setEditing({ ...editing, category_id: v, subcategory_id: null })}>
                  <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>
                    {cats.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Subcategory (optional)</Label>
                <Select value={editing.subcategory_id ?? "none"} onValueChange={(v) => setEditing({ ...editing, subcategory_id: v === "none" ? null : v })}>
                  <SelectTrigger><SelectValue placeholder="None" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    {subs.filter((s) => s.category_id === editing.category_id).map((s) => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Spice level (0-3)</Label>
                <Input type="number" value={editing.spice_level ?? ""} onChange={(e) => setEditing({ ...editing, spice_level: Number(e.target.value) })} />
              </div>
              <div className="space-y-1.5 col-span-2">
                <Label>Tags (comma separated)</Label>
                <Input value={tagsText} onChange={(e) => setTagsText(e.target.value)} />
              </div>
              <div className="flex items-center gap-2"><Switch checked={!!editing.is_combo} onCheckedChange={(v) => setEditing({ ...editing, is_combo: v })} /><Label>Combo</Label></div>
              <div className="flex items-center gap-2"><Switch checked={!!editing.is_vegetarian} onCheckedChange={(v) => setEditing({ ...editing, is_vegetarian: v })} /><Label>Vegetarian</Label></div>
              <div className="flex items-center gap-2"><Switch checked={!!editing.is_featured} onCheckedChange={(v) => setEditing({ ...editing, is_featured: v })} /><Label>Featured</Label></div>
              <div className="flex items-center gap-2"><Switch checked={editing.is_available !== false} onCheckedChange={(v) => setEditing({ ...editing, is_available: v })} /><Label>Available</Label></div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={() => editing && saveMutation.mutate(editing)} disabled={saveMutation.isPending}>
              {saveMutation.isPending ? "Saving…" : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this listing?</AlertDialogTitle>
            <AlertDialogDescription>This permanently removes the item from the menu. This cannot be undone.</AlertDialogDescription>
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

export default AdminItems;
