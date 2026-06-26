import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Plus, Pencil, Trash2, FolderTree } from "lucide-react";
import { toast } from "sonner";

interface Cat {
  id: string; slug: string; name: string;
  description: string | null; hero_phrase: string | null; sort_order: number;
}

const slugify = (s: string) => s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

const AdminCategories = () => {
  const qc = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Partial<Cat> | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data: cats = [], isLoading } = useQuery({
    queryKey: ["admin-cats-full"],
    queryFn: async () => {
      const { data, error } = await supabase.from("menu_categories").select("*").order("sort_order");
      if (error) throw error; return data as Cat[];
    },
  });
  const { data: counts = {} } = useQuery({
    queryKey: ["admin-cat-counts"],
    queryFn: async () => {
      const { data } = await supabase.from("menu_items").select("category_id");
      const map: Record<string, number> = {};
      (data ?? []).forEach((r: any) => { map[r.category_id] = (map[r.category_id] || 0) + 1; });
      return map;
    },
  });

  const saveMutation = useMutation({
    mutationFn: async (form: Partial<Cat>) => {
      if (!form.name) throw new Error("Name is required");
      const payload = {
        name: form.name,
        slug: form.slug || slugify(form.name),
        description: form.description || null,
        hero_phrase: form.hero_phrase || null,
        sort_order: Number(form.sort_order) || 0,
      };
      if (form.id) {
        const { error } = await supabase.from("menu_categories").update(payload).eq("id", form.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("menu_categories").insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-cats-full"] });
      qc.invalidateQueries({ queryKey: ["menu"] });
      setDialogOpen(false); setEditing(null);
      toast.success("Category saved");
    },
    onError: (e: any) => toast.error(e.message),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("menu_categories").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-cats-full"] });
      qc.invalidateQueries({ queryKey: ["menu"] });
      setDeleteId(null);
      toast.success("Category deleted");
    },
    onError: (e: any) => toast.error(e.message),
  });

  return (
    <AdminLayout title="Categories">
      <div className="flex justify-end mb-4">
        <Button onClick={() => { setEditing({ sort_order: cats.length + 1 }); setDialogOpen(true); }}>
          <Plus className="h-4 w-4" /> New Category
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {isLoading ? <p className="text-muted-foreground">Loading…</p> : cats.map((c) => (
          <Card key={c.id}>
            <CardHeader className="flex flex-row items-start justify-between pb-2">
              <div className="flex items-center gap-2">
                <FolderTree className="h-5 w-5 text-primary" />
                <CardTitle className="text-lg">{c.name}</CardTitle>
              </div>
              <Badge variant="secondary">{counts[c.id] ?? 0} items</Badge>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground line-clamp-2 mb-1">{c.description}</p>
              {c.hero_phrase && <p className="text-xs italic text-primary mb-3">"{c.hero_phrase}"</p>}
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => { setEditing(c); setDialogOpen(true); }}>
                  <Pencil className="h-3.5 w-3.5" /> Edit
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setDeleteId(c.id)}>
                  <Trash2 className="h-3.5 w-3.5 text-destructive" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editing?.id ? "Edit Category" : "New Category"}</DialogTitle></DialogHeader>
          {editing && (
            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label>Name</Label>
                <Input value={editing.name ?? ""} onChange={(e) => setEditing({ ...editing, name: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <Label>Slug (auto if blank)</Label>
                <Input value={editing.slug ?? ""} onChange={(e) => setEditing({ ...editing, slug: e.target.value })} placeholder={editing.name ? slugify(editing.name) : ""} />
              </div>
              <div className="space-y-1.5">
                <Label>Description</Label>
                <Textarea value={editing.description ?? ""} onChange={(e) => setEditing({ ...editing, description: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <Label>Hero phrase</Label>
                <Input value={editing.hero_phrase ?? ""} onChange={(e) => setEditing({ ...editing, hero_phrase: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <Label>Sort order</Label>
                <Input type="number" value={editing.sort_order ?? 0} onChange={(e) => setEditing({ ...editing, sort_order: Number(e.target.value) })} />
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
            <AlertDialogTitle>Delete this category?</AlertDialogTitle>
            <AlertDialogDescription>All items in this category will also be deleted. This cannot be undone.</AlertDialogDescription>
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

export default AdminCategories;
