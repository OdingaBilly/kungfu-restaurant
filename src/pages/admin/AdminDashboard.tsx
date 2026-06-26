import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { UtensilsCrossed, ShoppingBag, DollarSign, EyeOff, Clock } from "lucide-react";
import { Link } from "react-router-dom";

const AdminDashboard = () => {
  const { data: stats } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      const [items, unavailable, orders] = await Promise.all([
        supabase.from("menu_items").select("id", { count: "exact", head: true }),
        supabase.from("menu_items").select("id", { count: "exact", head: true }).eq("is_available", false),
        supabase.from("orders").select("total,status,created_at"),
      ]);
      const allOrders = orders.data ?? [];
      const revenue = allOrders.reduce((s, o) => s + Number(o.total || 0), 0);
      const pending = allOrders.filter((o) => o.status === "pending").length;
      return {
        items: items.count ?? 0,
        unavailable: unavailable.count ?? 0,
        orders: allOrders.length,
        revenue,
        pending,
      };
    },
  });

  const { data: recent = [] } = useQuery({
    queryKey: ["admin-recent-orders"],
    queryFn: async () => {
      const { data } = await supabase
        .from("orders")
        .select("id,customer_name,total,status,created_at")
        .order("created_at", { ascending: false })
        .limit(6);
      return data ?? [];
    },
  });

  const cards = [
    { label: "Active Listings", value: stats?.items ?? "—", icon: UtensilsCrossed, to: "/admin/items" },
    { label: "Hidden Listings", value: stats?.unavailable ?? "—", icon: EyeOff, to: "/admin/items" },
    { label: "Total Orders", value: stats?.orders ?? "—", icon: ShoppingBag, to: "/admin/orders" },
    { label: "Pending Orders", value: stats?.pending ?? "—", icon: Clock, to: "/admin/orders" },
    { label: "Revenue (KES)", value: stats ? stats.revenue.toLocaleString() : "—", icon: DollarSign, to: "/admin/orders" },
  ];

  return (
    <AdminLayout title="Dashboard">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5 mb-8">
        {cards.map((c) => (
          <Link key={c.label} to={c.to}>
            <Card className="hover:border-primary transition-colors">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{c.label}</CardTitle>
                <c.icon className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent><div className="text-3xl font-bold">{c.value}</div></CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <Card>
        <CardHeader><CardTitle>Recent Orders</CardTitle></CardHeader>
        <CardContent>
          {recent.length === 0 ? (
            <p className="text-muted-foreground text-sm">No orders yet.</p>
          ) : (
            <div className="divide-y">
              {recent.map((o) => (
                <div key={o.id} className="flex items-center justify-between py-3">
                  <div>
                    <p className="font-medium">{o.customer_name}</p>
                    <p className="text-xs text-muted-foreground">{new Date(o.created_at).toLocaleString()}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant="secondary">{o.status}</Badge>
                    <span className="font-semibold">KES {Number(o.total).toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </AdminLayout>
  );
};

export default AdminDashboard;
