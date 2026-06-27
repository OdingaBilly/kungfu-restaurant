import { ReactNode } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  UtensilsCrossed,
  FolderTree,
  ShoppingBag,
  Users,
  LogOut,
  Store,
  Truck,
  Boxes,
  ClipboardList,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import { cn } from "@/lib/utils";

const navItems = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/admin/items", label: "Listings & Pricing", icon: UtensilsCrossed },
  { to: "/admin/categories", label: "Categories", icon: FolderTree },
  { to: "/admin/orders", label: "Orders", icon: ShoppingBag },
  { to: "/admin/suppliers", label: "Suppliers", icon: Truck },
  { to: "/admin/inventory", label: "Inventory", icon: Boxes },
  { to: "/admin/purchase-orders", label: "Purchase Orders", icon: ClipboardList },
  { to: "/admin/staff", label: "Staff & Roles", icon: Users, adminOnly: true },
];

const AdminLayout = ({ title, children }: { title: string; children: ReactNode }) => {
  const { signOut } = useAuth();
  const { isSuperAdmin } = useIsAdmin();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex bg-muted/30">
      <aside className="w-64 shrink-0 bg-card border-r flex flex-col sticky top-0 h-screen">
        <div className="p-5 border-b">
          <NavLink to="/" className="flex items-center gap-2">
            <Store className="h-6 w-6 text-primary" />
            <span className="font-display text-xl">Kungfu Admin</span>
          </NavLink>
        </div>
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {navItems
            .filter((i) => !i.adminOnly || isSuperAdmin)
            .map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-foreground/70 hover:bg-muted hover:text-foreground"
                  )
                }
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </NavLink>
            ))}
        </nav>
        <div className="p-3 border-t space-y-1">
          <button
            onClick={() => navigate("/")}
            className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm text-foreground/70 hover:bg-muted"
          >
            <Store className="h-4 w-4" /> View Site
          </button>
          <button
            onClick={async () => {
              await signOut();
              navigate("/");
            }}
            className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm text-destructive hover:bg-destructive/10"
          >
            <LogOut className="h-4 w-4" /> Sign Out
          </button>
        </div>
      </aside>

      <main className="flex-1 min-w-0">
        <header className="h-16 border-b bg-card flex items-center px-6 sticky top-0 z-10">
          <h1 className="font-display text-2xl">{title}</h1>
        </header>
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
};

export default AdminLayout;
