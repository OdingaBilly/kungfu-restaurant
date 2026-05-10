import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, MapPin, CreditCard, Smartphone, CheckCircle2, Truck, Clock, BookmarkPlus } from "lucide-react";
import { useCart, CURRENCY } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { getItemImage } from "@/data/menuImages";
import { menuCategories, getAllItemsFromCategory } from "@/data/menuData";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";

type PaymentMethod = "mpesa" | "card" | "cash";

interface SavedAddress { id: string; label: string | null; address: string; landmark: string | null; instructions: string | null; }

const Checkout = () => {
  const { items, total, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("mpesa");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [savedAddresses, setSavedAddresses] = useState<SavedAddress[]>([]);
  const [saveAddress, setSaveAddress] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    landmark: "",
    instructions: "",
  });

  const deliveryFee = 150;
  const grandTotal = total + deliveryFee;

  const formatPrice = (price: number) => `${CURRENCY} ${price.toLocaleString()}`;

  // Get item image from menu data
  const getCartItemImage = (sku: string) => {
    for (const category of menuCategories) {
      const items = getAllItemsFromCategory(category);
      const item = items.find((i) => i.sku === sku);
      if (item) {
        return getItemImage(item.name, category.slug, item.tags);
      }
    }
    return null;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // Prefill from profile + load saved addresses for logged-in users
  useEffect(() => {
    if (!user) return;
    (async () => {
      const [{ data: profile }, { data: addrs }] = await Promise.all([
        supabase.from("profiles").select("full_name, phone, email").eq("id", user.id).maybeSingle(),
        supabase.from("addresses").select("id, label, address, landmark, instructions, is_default").eq("user_id", user.id).order("is_default", { ascending: false }),
      ]);
      if (profile) {
        setFormData((prev) => ({
          ...prev,
          name: prev.name || profile.full_name || "",
          phone: prev.phone || profile.phone || "",
          email: prev.email || profile.email || user.email || "",
        }));
      }
      if (addrs && addrs.length) {
        setSavedAddresses(addrs);
        const def = addrs[0];
        setFormData((prev) => ({
          ...prev,
          address: prev.address || def.address,
          landmark: prev.landmark || def.landmark || "",
          instructions: prev.instructions || def.instructions || "",
        }));
      }
    })();
  }, [user]);

  const pickAddress = (id: string) => {
    const a = savedAddresses.find((x) => x.id === id);
    if (!a) return;
    setFormData((prev) => ({ ...prev, address: a.address, landmark: a.landmark || "", instructions: a.instructions || "" }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.address) {
      toast.error("Please fill in all required fields");
      return;
    }
    if (items.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase.from("orders").insert({
        user_id: user?.id ?? null,
        customer_name: formData.name,
        customer_phone: formData.phone,
        customer_email: formData.email || null,
        delivery_address: formData.address,
        landmark: formData.landmark || null,
        instructions: formData.instructions || null,
        payment_method: paymentMethod,
        subtotal: total,
        delivery_fee: deliveryFee,
        total: grandTotal,
        items: items.map((i) => ({ sku: i.sku, name: i.name, price: i.price, quantity: i.quantity })),
      });

      if (error) {
        toast.error(`Could not place order: ${error.message}`);
        setIsSubmitting(false);
        return;
      }

      // Optionally save the address for logged-in users
      if (user && saveAddress && formData.address.trim()) {
        await supabase.from("addresses").insert({
          user_id: user.id,
          address: formData.address,
          landmark: formData.landmark || null,
          instructions: formData.instructions || null,
          is_default: savedAddresses.length === 0,
        });
      }

      setOrderPlaced(true);
      clearCart();
    } finally {
      setIsSubmitting(false);
    }
  };

  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container px-6 py-24">
          <div className="max-w-lg mx-auto text-center">
            <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce">
              <CheckCircle2 className="w-12 h-12 text-green-500" />
            </div>
            <h1 className="font-display text-4xl mb-4">Order Confirmed!</h1>
            <p className="text-foreground/60 mb-8">
              Thank you for your order! We've received it and will start preparing your food right away.
              You'll receive a confirmation SMS shortly.
            </p>
            <div className="bg-card border border-border rounded-2xl p-6 mb-8">
              <div className="flex items-center justify-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-primary" />
                  <span>Est. 30-45 min</span>
                </div>
                <div className="w-px h-4 bg-border" />
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-primary" />
                  <span>Delivery on the way</span>
                </div>
              </div>
            </div>
            <Link to="/menu" className="btn-kungfu">
              Order More
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container px-6 py-24">
          <div className="max-w-lg mx-auto text-center">
            <span className="text-6xl mb-6 block">🛒</span>
            <h1 className="font-display text-3xl mb-4">Your Cart is Empty</h1>
            <p className="text-foreground/60 mb-8">
              Add some delicious items before checking out!
            </p>
            <Link to="/menu" className="btn-kungfu">
              Browse Menu
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Header */}
      <section className="pt-24 pb-8 px-6 bg-gradient-to-b from-primary/10 to-background">
        <div className="container">
          <Link to="/menu" className="inline-flex items-center gap-2 text-foreground/60 hover:text-primary mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to Menu
          </Link>
          <h1 className="font-display text-4xl md:text-5xl">
            <span className="text-primary">Checkout</span>
          </h1>
        </div>
      </section>

      <div className="container px-6 pb-24">
        <form onSubmit={handleSubmit}>
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - Forms */}
            <div className="lg:col-span-2 space-y-8">
              {/* Delivery Address */}
              <div className="bg-card border border-border rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h2 className="font-display text-xl">Delivery Address</h2>
                    <p className="text-foreground/50 text-sm">Where should we deliver?</p>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      name="name"
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      placeholder="0712 345 678"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="sm:col-span-2 space-y-2">
                    <Label htmlFor="email">Email (Optional)</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="john@example.com"
                      value={formData.email}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="sm:col-span-2 space-y-2">
                    <Label htmlFor="address">Delivery Address *</Label>
                    <Input
                      id="address"
                      name="address"
                      placeholder="Street name, building, apartment"
                      value={formData.address}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="landmark">Landmark</Label>
                    <Input
                      id="landmark"
                      name="landmark"
                      placeholder="Near, next to..."
                      value={formData.landmark}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="instructions">Delivery Instructions</Label>
                    <Input
                      id="instructions"
                      name="instructions"
                      placeholder="Gate code, floor, etc."
                      value={formData.instructions}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-card border border-border rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                    <CreditCard className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h2 className="font-display text-xl">Payment Method</h2>
                    <p className="text-foreground/50 text-sm">How would you like to pay?</p>
                  </div>
                </div>

                <RadioGroup
                  value={paymentMethod}
                  onValueChange={(v) => setPaymentMethod(v as PaymentMethod)}
                  className="space-y-3"
                >
                  <label
                    className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      paymentMethod === "mpesa"
                        ? "border-green-500 bg-green-500/10"
                        : "border-border hover:border-border/80"
                    }`}
                  >
                    <RadioGroupItem value="mpesa" id="mpesa" />
                    <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                      <Smartphone className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <span className="font-semibold block">M-Pesa</span>
                      <span className="text-foreground/50 text-sm">Pay via M-Pesa STK push</span>
                    </div>
                    <span className="text-green-500 text-xs font-semibold uppercase">Recommended</span>
                  </label>

                  <label
                    className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      paymentMethod === "card"
                        ? "border-primary bg-primary/10"
                        : "border-border hover:border-border/80"
                    }`}
                  >
                    <RadioGroupItem value="card" id="card" />
                    <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                      <CreditCard className="w-5 h-5 text-primary-foreground" />
                    </div>
                    <div className="flex-1">
                      <span className="font-semibold block">Card Payment</span>
                      <span className="text-foreground/50 text-sm">Visa, Mastercard, etc.</span>
                    </div>
                  </label>

                  <label
                    className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      paymentMethod === "cash"
                        ? "border-kungfu-gold bg-kungfu-gold/10"
                        : "border-border hover:border-border/80"
                    }`}
                  >
                    <RadioGroupItem value="cash" id="cash" />
                    <div className="w-10 h-10 bg-kungfu-gold rounded-lg flex items-center justify-center">
                      <span className="text-black font-bold">💵</span>
                    </div>
                    <div className="flex-1">
                      <span className="font-semibold block">Cash on Delivery</span>
                      <span className="text-foreground/50 text-sm">Pay when your order arrives</span>
                    </div>
                  </label>
                </RadioGroup>
              </div>
            </div>

            {/* Right Column - Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-card border border-border rounded-2xl p-6 sticky top-24">
                <h2 className="font-display text-xl mb-6">Order Summary</h2>
                
                {/* Items */}
                <div className="space-y-4 mb-6 max-h-64 overflow-y-auto">
                  {items.map((item) => {
                    const image = getCartItemImage(item.sku);
                    return (
                      <div key={item.sku} className="flex gap-3">
                        <div className="w-16 h-16 bg-muted rounded-lg overflow-hidden shrink-0">
                          {image ? (
                            <img src={image} alt={item.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-2xl">🍔</div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm truncate">{item.name}</h4>
                          <p className="text-foreground/50 text-xs">Qty: {item.quantity}</p>
                          <p className="text-primary font-semibold text-sm">
                            {formatPrice(item.price * item.quantity)}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Totals */}
                <div className="border-t border-border pt-4 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-foreground/60">Subtotal</span>
                    <span>{formatPrice(total)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-foreground/60">Delivery Fee</span>
                    <span>{formatPrice(deliveryFee)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg pt-2 border-t border-border">
                    <span>Total</span>
                    <span className="text-primary">{formatPrice(grandTotal)}</span>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full btn-kungfu mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Processing...
                    </span>
                  ) : (
                    `Place Order — ${formatPrice(grandTotal)}`
                  )}
                </button>

                <p className="text-center text-foreground/40 text-xs mt-4">
                  By placing this order, you agree to our terms and conditions.
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>

      <Footer />
    </div>
  );
};

export default Checkout;
