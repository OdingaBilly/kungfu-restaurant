import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { CURRENCY } from "@/data/menuData";
import { Package, MapPin, User as UserIcon, LogOut, Plus, Trash2, Heart } from "lucide-react";

interface Order {
  id: string;
  created_at: string;
  total: number;
  status: string;
  items: Array<{ name: string; quantity: number; price: number }>;
  delivery_address: string;
  payment_method: string;
}

interface Address {
  id: string;
  label: string | null;
  address: string;
  landmark: string | null;
  instructions: string | null;
  is_default: boolean;
}

interface Profile {
  full_name: string | null;
  phone: string | null;
  email: string | null;
}

interface Favorite {
  id: string;
  item_sku: string;
  item_name: string;
}

const Account = () => {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile>({ full_name: "", phone: "", email: "" });
  const [orders, setOrders] = useState<Order[]>([]);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [savingProfile, setSavingProfile] = useState(false);
  const [newAddr, setNewAddr] = useState({ label: "", address: "", landmark: "", instructions: "" });

  useEffect(() => {
    if (!loading && !user) navigate("/auth?redirect=/account");
  }, [user, loading, navigate]);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const [{ data: p }, { data: o }, { data: a }, { data: f }] = await Promise.all([
        supabase.from("profiles").select("full_name, phone, email").eq("id", user.id).maybeSingle(),
        supabase.from("orders").select("*").eq("user_id", user.id).order("created_at", { ascending: false }),
        supabase.from("addresses").select("*").eq("user_id", user.id).order("created_at", { ascending: false }),
        supabase.from("favorites").select("*").eq("user_id", user.id).order("created_at", { ascending: false }),
      ]);
      if (p) setProfile(p);
      if (o) setOrders(o as any);
      if (a) setAddresses(a);
      if (f) setFavorites(f);
    })();
  }, [user]);

  const formatPrice = (n: number) => `${CURRENCY} ${Number(n).toLocaleString()}`;

  const saveProfile = async () => {
    if (!user) return;
    setSavingProfile(true);
    const { error } = await supabase.from("profiles").update({
      full_name: profile.full_name, phone: profile.phone,
    }).eq("id", user.id);
    setSavingProfile(false);
    if (error) toast.error(error.message); else toast.success("Profile updated");
  };

  const addAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newAddr.address.trim()) return;
    const { data, error } = await supabase.from("addresses").insert({
      user_id: user.id, ...newAddr, is_default: addresses.length === 0,
    }).select().single();
    if (error) { toast.error(error.message); return; }
    setAddresses([data, ...addresses]);
    setNewAddr({ label: "", address: "", landmark: "", instructions: "" });
    toast.success("Address saved");
  };

  const deleteAddress = async (id: string) => {
    const { error } = await supabase.from("addresses").delete().eq("id", id);
    if (error) { toast.error(error.message); return; }
    setAddresses(addresses.filter((a) => a.id !== id));
  };

  const removeFavorite = async (id: string) => {
    await supabase.from("favorites").delete().eq("id", id);
    setFavorites(favorites.filter((f) => f.id !== id));
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <section className="pt-24 pb-8 px-6 bg-gradient-to-b from-primary/10 to-background">
        <div className="container">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="font-display text-3xl md:text-4xl">My Account</h1>
              <p className="text-foreground/60 text-sm mt-1">{profile.email || user.email}</p>
            </div>
            <button onClick={async () => { await signOut(); navigate("/"); }} className="flex items-center gap-2 px-4 py-2 border border-border rounded-xl hover:bg-secondary text-sm">
              <LogOut className="w-4 h-4" /> Sign out
            </button>
          </div>
        </div>
      </section>

      <div className="container px-6 py-8 pb-16">
        <Tabs defaultValue="orders" className="w-full">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 mb-6">
            <TabsTrigger value="orders"><Package className="w-4 h-4 sm:mr-2" /><span className="hidden sm:inline">Orders</span></TabsTrigger>
            <TabsTrigger value="addresses"><MapPin className="w-4 h-4 sm:mr-2" /><span className="hidden sm:inline">Addresses</span></TabsTrigger>
            <TabsTrigger value="favorites"><Heart className="w-4 h-4 sm:mr-2" /><span className="hidden sm:inline">Favorites</span></TabsTrigger>
            <TabsTrigger value="profile"><UserIcon className="w-4 h-4 sm:mr-2" /><span className="hidden sm:inline">Profile</span></TabsTrigger>
          </TabsList>

          <TabsContent value="orders" className="space-y-4">
            {orders.length === 0 ? (
              <div className="bg-card border border-border rounded-2xl p-12 text-center">
                <Package className="w-12 h-12 text-foreground/30 mx-auto mb-4" />
                <p className="text-foreground/60">No orders yet.</p>
                <Link to="/menu" className="btn-kungfu inline-block mt-4">Start ordering</Link>
              </div>
            ) : (
              orders.map((order) => (
                <div key={order.id} className="bg-card border border-border rounded-2xl p-5">
                  <div className="flex flex-wrap justify-between gap-3 mb-3">
                    <div>
                      <p className="font-semibold text-sm">Order #{order.id.slice(0, 8).toUpperCase()}</p>
                      <p className="text-xs text-foreground/50">{new Date(order.created_at).toLocaleString()}</p>
                    </div>
                    <div className="text-right">
                      <span className="inline-block px-2 py-1 bg-primary/20 text-primary text-xs rounded-full uppercase font-semibold">{order.status}</span>
                      <p className="font-bold text-primary mt-1">{formatPrice(order.total)}</p>
                    </div>
                  </div>
                  <div className="text-sm text-foreground/70 space-y-1 border-t border-border pt-3">
                    {order.items.map((it, i) => (
                      <div key={i} className="flex justify-between">
                        <span>{it.quantity}× {it.name}</span>
                        <span>{formatPrice(it.price * it.quantity)}</span>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-foreground/50 mt-3 pt-3 border-t border-border">
                    Delivered to: {order.delivery_address} • Paid via {order.payment_method.toUpperCase()}
                  </p>
                </div>
              ))
            )}
          </TabsContent>

          <TabsContent value="addresses" className="space-y-4">
            <form onSubmit={addAddress} className="bg-card border border-border rounded-2xl p-5 space-y-3">
              <h3 className="font-display text-lg flex items-center gap-2"><Plus className="w-4 h-4" />Add new address</h3>
              <div className="grid sm:grid-cols-2 gap-3">
                <Input placeholder="Label (Home, Work)" value={newAddr.label} onChange={(e) => setNewAddr({ ...newAddr, label: e.target.value })} />
                <Input placeholder="Address *" value={newAddr.address} onChange={(e) => setNewAddr({ ...newAddr, address: e.target.value })} required />
                <Input placeholder="Landmark" value={newAddr.landmark} onChange={(e) => setNewAddr({ ...newAddr, landmark: e.target.value })} />
                <Input placeholder="Delivery instructions" value={newAddr.instructions} onChange={(e) => setNewAddr({ ...newAddr, instructions: e.target.value })} />
              </div>
              <button type="submit" className="btn-kungfu text-sm">Save address</button>
            </form>
            {addresses.length === 0 ? (
              <p className="text-center text-foreground/50 py-6">No saved addresses yet.</p>
            ) : (
              <div className="grid sm:grid-cols-2 gap-4">
                {addresses.map((a) => (
                  <div key={a.id} className="bg-card border border-border rounded-2xl p-4 relative">
                    {a.label && <span className="text-xs uppercase font-bold text-primary">{a.label}</span>}
                    <p className="font-medium">{a.address}</p>
                    {a.landmark && <p className="text-sm text-foreground/60">Near {a.landmark}</p>}
                    {a.instructions && <p className="text-xs text-foreground/50 mt-1">{a.instructions}</p>}
                    <button onClick={() => deleteAddress(a.id)} className="absolute top-3 right-3 p-1 hover:bg-destructive/20 rounded text-destructive">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="favorites" className="space-y-3">
            {favorites.length === 0 ? (
              <div className="bg-card border border-border rounded-2xl p-12 text-center">
                <Heart className="w-12 h-12 text-foreground/30 mx-auto mb-4" />
                <p className="text-foreground/60">No favorites yet. Tap the heart on any dish!</p>
              </div>
            ) : (
              favorites.map((f) => (
                <div key={f.id} className="bg-card border border-border rounded-2xl p-4 flex items-center justify-between">
                  <Link to={`/product/${f.item_sku}`} className="font-medium hover:text-primary">{f.item_name}</Link>
                  <button onClick={() => removeFavorite(f.id)} className="p-2 hover:bg-destructive/20 rounded text-destructive">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </TabsContent>

          <TabsContent value="profile" className="space-y-4">
            <div className="bg-card border border-border rounded-2xl p-5 max-w-xl space-y-4">
              <div className="space-y-2">
                <Label>Full Name</Label>
                <Input value={profile.full_name || ""} onChange={(e) => setProfile({ ...profile, full_name: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Phone</Label>
                <Input value={profile.phone || ""} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input value={profile.email || user.email || ""} disabled />
              </div>
              <button onClick={saveProfile} disabled={savingProfile} className="btn-kungfu disabled:opacity-50">
                {savingProfile ? "Saving..." : "Save changes"}
              </button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
      <Footer />
    </div>
  );
};

export default Account;
