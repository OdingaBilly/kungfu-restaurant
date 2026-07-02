import { useState, useMemo, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Plus, Minus, ShoppingCart, Flame, Leaf, Clock, Star, Users,
  Repeat, ChevronRight, Sparkles,
} from "lucide-react";
import { menuCategories, getAllItemsFromCategory, MenuItem, CURRENCY } from "@/data/menuData";
import { getItemImage } from "@/data/menuImages";
import {
  getNutrition, getHistory, getProcess, getCommunity, getPandaSuggestion, getPairings,
} from "@/data/productInsights";
import { useCart } from "@/contexts/CartContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingCart from "@/components/menu/FloatingCart";
import CartDrawer from "@/components/menu/CartDrawer";
import ItemCustomization from "@/components/menu/ItemCustomization";
import pandaLogo from "@/assets/logo.png";
import { toast } from "sonner";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0 },
};

const Section = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <motion.section
    variants={fadeUp}
    initial="hidden"
    whileInView="show"
    viewport={{ once: true, amount: 0.2 }}
    transition={{ duration: 0.5, ease: "easeOut" }}
    className={className}
  >
    {children}
  </motion.section>
);

const Product = () => {
  const { sku } = useParams();
  const { addItem, setIsOpen } = useCart();

  const [quantity, setQuantity] = useState(1);
  const [spiceLevel, setSpiceLevel] = useState(2);
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setQuantity(1);
    setSelectedAddOns([]);
  }, [sku]);

  const productData = useMemo(() => {
    for (const category of menuCategories) {
      const items = getAllItemsFromCategory(category);
      const item = items.find((i) => i.sku === sku);
      if (item) return { item, category };
    }
    return null;
  }, [sku]);

  if (!productData) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container px-6 py-24 text-center">
          <span className="text-6xl mb-6 block">🔍</span>
          <h1 className="font-display text-3xl mb-4">Product Not Found</h1>
          <p className="text-foreground/60 mb-8">The product you're looking for doesn't exist.</p>
          <Link to="/menu" className="btn-kungfu">Browse Menu</Link>
        </div>
        <Footer />
      </div>
    );
  }

  const { item, category } = productData;
  const image = getItemImage(item.name, category.slug, item.tags);
  const formatPrice = (price: number) => `${CURRENCY} ${price.toLocaleString()}`;

  const nutrition = useMemo(() => getNutrition(item), [item]);
  const history = useMemo(() => getHistory(item, category), [item, category]);
  const process = useMemo(() => getProcess(item), [item]);
  const community = useMemo(() => getCommunity(item), [item]);
  const pandaLine = useMemo(() => getPandaSuggestion(item), [item]);
  const pairings = useMemo(() => getPairings(item.sku), [item.sku]);

  const addOnPrices: Record<string, number> = {
    "Extra Sauce": 50, Cheese: 100, "Extra Patty": 200, Bacon: 150, Avocado: 100, Egg: 80,
  };
  const addOnsTotal = selectedAddOns.reduce((sum, a) => sum + (addOnPrices[a] || 0), 0);
  const itemTotal = (item.price + addOnsTotal) * quantity;

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) addItem(item);
    toast.success(`${quantity}x ${item.name} added to cart!`);
    setIsOpen(true);
  };

  const relatedItems = useMemo(() => {
    const items = getAllItemsFromCategory(category);
    return items.filter((i) => i.sku !== item.sku).slice(0, 4);
  }, [category, item.sku]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Breadcrumb */}
      <section className="pt-24 pb-4 px-4 sm:px-6">
        <div className="container">
          <div className="flex items-center gap-2 text-xs sm:text-sm text-foreground/60 overflow-x-auto whitespace-nowrap">
            <Link to="/" className="hover:text-primary transition-colors">Home</Link>
            <span>/</span>
            <Link to="/menu" className="hover:text-primary transition-colors">Menu</Link>
            <span>/</span>
            <Link to={`/menu?category=${category.slug}`} className="hover:text-primary transition-colors">{category.name}</Link>
            <span>/</span>
            <span className="text-foreground">{item.name}</span>
          </div>
        </div>
      </section>

      {/* Hero / Details */}
      <section className="pb-12 px-4 sm:px-6">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="relative lg:sticky lg:top-24 self-start"
            >
              <div className="aspect-square rounded-3xl overflow-hidden bg-muted shadow-xl">
                <img src={image} alt={item.name} className="w-full h-full object-cover" />
              </div>
              <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                {item.isVegetarian && (
                  <span className="bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                    <Leaf className="w-3 h-3" /> Vegetarian
                  </span>
                )}
                {item.spiceLevel && item.spiceLevel > 2 && (
                  <span className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                    <Flame className="w-3 h-3" /> Spicy
                  </span>
                )}
                {item.isCombo && (
                  <span className="bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full">Combo</span>
                )}
              </div>
              {/* Live order pill */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="absolute bottom-4 left-4 bg-background/90 backdrop-blur-md rounded-full px-4 py-2 flex items-center gap-2 shadow-lg"
              >
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary" />
                </span>
                <span className="text-xs font-semibold">{community.ordersThisWeek} ordered this week</span>
              </motion.div>
            </motion.div>

            {/* Details */}
            <div>
              <Link to={`/menu?category=${category.slug}`} className="text-primary text-sm font-medium uppercase tracking-wider mb-2 inline-block hover:underline">
                {category.name}
              </Link>
              <h1 className="font-display text-3xl sm:text-4xl md:text-5xl mb-3">{item.name}</h1>

              {/* rating summary */}
              <div className="flex items-center gap-3 mb-4 flex-wrap">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <Star key={n} className={`w-4 h-4 ${n <= Math.round(community.rating) ? "fill-kungfu-gold text-kungfu-gold" : "text-muted-foreground/40"}`} />
                  ))}
                </div>
                <span className="font-bold">{community.rating.toFixed(1)}</span>
                <span className="text-foreground/50 text-sm">({community.reviews} reviews)</span>
              </div>

              <p className="text-foreground/60 text-base sm:text-lg mb-6">
                {item.description || "A delicious choice from our menu, crafted with the finest ingredients."}
              </p>

              {/* Meta */}
              <div className="flex flex-wrap items-center gap-3 mb-6 text-sm">
                {item.calories && <span className="bg-muted px-3 py-1.5 rounded-full">🔥 {item.calories} cal</span>}
                <span className="bg-muted px-3 py-1.5 rounded-full flex items-center gap-1"><Clock className="w-4 h-4" /> 15–20 min</span>
                <span className="bg-primary/10 text-primary px-3 py-1.5 rounded-full flex items-center gap-1"><Repeat className="w-4 h-4" /> {community.reorderRate}% reorder</span>
              </div>

              <div className="mb-6">
                <span className="text-primary font-bold text-3xl sm:text-4xl">{formatPrice(item.price)}</span>
                {addOnsTotal > 0 && <span className="text-foreground/50 text-sm ml-2">+ {formatPrice(addOnsTotal)} add-ons</span>}
              </div>

              <div className="mb-6">
                <ItemCustomization
                  spiceLevel={spiceLevel}
                  onSpiceLevelChange={setSpiceLevel}
                  selectedAddOns={selectedAddOns}
                  onAddOnToggle={(id) =>
                    setSelectedAddOns((prev) => (prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]))
                  }
                />
              </div>

              {/* Quantity + Add */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 bg-muted rounded-full p-2">
                  <motion.button whileTap={{ scale: 0.85 }} onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-10 h-10 rounded-full bg-background flex items-center justify-center hover:bg-primary/20 transition-colors">
                    <Minus className="w-4 h-4" />
                  </motion.button>
                  <span className="w-8 text-center font-bold text-lg">{quantity}</span>
                  <motion.button whileTap={{ scale: 0.85 }} onClick={() => setQuantity(quantity + 1)} className="w-10 h-10 rounded-full bg-background flex items-center justify-center hover:bg-primary/20 transition-colors">
                    <Plus className="w-4 h-4" />
                  </motion.button>
                </div>
                <motion.button whileTap={{ scale: 0.96 }} onClick={handleAddToCart} className="flex-1 btn-kungfu flex items-center justify-center gap-2 sm:gap-3 text-base sm:text-lg">
                  <ShoppingCart className="w-5 h-5" />
                  <span className="hidden xs:inline sm:inline">Add —</span> {formatPrice(itemTotal)}
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Panda's Suggestion banner */}
      <Section className="px-4 sm:px-6 mb-12">
        <div className="container">
          <div className="relative overflow-hidden rounded-3xl bg-primary text-primary-foreground p-6 sm:p-8 flex items-center gap-4 sm:gap-6">
            <img src={pandaLogo} alt="Panda" className="w-16 h-16 sm:w-24 sm:h-24 object-contain shrink-0 drop-shadow-lg" />
            <div>
              <div className="flex items-center gap-2 mb-1 text-sm font-bold uppercase tracking-wider opacity-90">
                <Sparkles className="w-4 h-4" /> What Panda Suggests
              </div>
              <p className="font-display text-lg sm:text-2xl leading-tight">{pandaLine}</p>
            </div>
          </div>
        </div>
      </Section>

      {/* History + Process */}
      <Section className="px-4 sm:px-6 mb-12">
        <div className="container grid md:grid-cols-2 gap-6">
          <div className="bg-card border border-border rounded-3xl p-6 sm:p-8">
            <h2 className="font-display text-2xl mb-3 flex items-center gap-2">📜 A Brief History</h2>
            <p className="text-foreground/70 leading-relaxed">{history}</p>
          </div>
          <div className="bg-card border border-border rounded-3xl p-6 sm:p-8">
            <h2 className="font-display text-2xl mb-5 flex items-center gap-2">🥢 Our Process</h2>
            <div className="space-y-4">
              {process.map((step, i) => (
                <motion.div
                  key={step.title}
                  initial={{ opacity: 0, x: -12 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="flex gap-3"
                >
                  <span className="text-2xl shrink-0">{step.emoji}</span>
                  <div>
                    <h3 className="font-semibold">{step.title}</h3>
                    <p className="text-foreground/60 text-sm">{step.text}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* Nutrition */}
      <Section className="px-4 sm:px-6 mb-12">
        <div className="container">
          <div className="bg-card border border-border rounded-3xl p-6 sm:p-8">
            <div className="flex items-baseline justify-between mb-6 flex-wrap gap-2">
              <h2 className="font-display text-2xl flex items-center gap-2">💪 Nutrition</h2>
              <span className="text-primary font-bold text-xl">{nutrition.calories} cal</span>
            </div>
            <div className="grid sm:grid-cols-2 gap-x-8 gap-y-5">
              {nutrition.nutrients.map((n, i) => (
                <div key={n.label}>
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="font-medium">{n.label}</span>
                    <span className="text-foreground/60">{n.grams}{n.label === "Sodium" ? "mg" : "g"}</span>
                  </div>
                  <div className="h-2.5 rounded-full bg-muted overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${n.percent}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.7, delay: i * 0.08, ease: "easeOut" }}
                      className="h-full rounded-full"
                      style={{ backgroundColor: n.color }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <p className="text-foreground/40 text-xs mt-6">* Estimated values. Calories don't count if you're happy. 🐼</p>
          </div>
        </div>
      </Section>

      {/* Community / Ratings */}
      <Section className="px-4 sm:px-6 mb-12">
        <div className="container">
          <div className="bg-card border border-border rounded-3xl p-6 sm:p-8 grid md:grid-cols-[auto,1fr] gap-8 items-center">
            <div className="text-center md:border-r md:border-border md:pr-8">
              <div className="font-display text-5xl text-primary">{community.rating.toFixed(1)}</div>
              <div className="flex items-center justify-center gap-1 my-2">
                {[1, 2, 3, 4, 5].map((n) => (
                  <Star key={n} className={`w-4 h-4 ${n <= Math.round(community.rating) ? "fill-kungfu-gold text-kungfu-gold" : "text-muted-foreground/40"}`} />
                ))}
              </div>
              <p className="text-foreground/50 text-sm flex items-center gap-1 justify-center"><Users className="w-4 h-4" /> {community.reviews} reviews</p>
            </div>
            <div className="space-y-2">
              {community.distribution.map((pct, i) => (
                <div key={i} className="flex items-center gap-3 text-sm">
                  <span className="w-6 text-foreground/60">{5 - i}★</span>
                  <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${pct}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: i * 0.06 }}
                      className="h-full rounded-full bg-kungfu-gold"
                    />
                  </div>
                  <span className="w-9 text-right text-foreground/50">{pct}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* Pairings — goes along with */}
      {pairings.length > 0 && (
        <Section className="px-4 sm:px-6 mb-12">
          <div className="container">
            <h2 className="font-display text-2xl sm:text-3xl mb-6 flex items-center gap-2">🍟 Goes Great With</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
              {pairings.map((p) => (
                <PairCard key={p.sku} item={p} formatPrice={formatPrice} onAdd={() => { addItem(p); toast.success(`${p.name} added!`); setIsOpen(true); }} />
              ))}
            </div>
          </div>
        </Section>
      )}

      {/* Related — based on your pick */}
      {relatedItems.length > 0 && (
        <Section className="py-12 px-4 sm:px-6 bg-secondary/30">
          <div className="container">
            <h2 className="font-display text-2xl sm:text-3xl mb-6">Based On Your Pick</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
              {relatedItems.map((related) => (
                <motion.div key={related.sku} whileHover={{ y: -4 }}>
                  <Link to={`/product/${related.sku}`} className="group block bg-card rounded-2xl overflow-hidden border border-border hover:border-primary/50 transition-all">
                    <div className="aspect-square overflow-hidden">
                      <img src={getItemImage(related.name, category.slug, related.tags)} alt={related.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                    <div className="p-3">
                      <h3 className="font-semibold text-sm line-clamp-1">{related.name}</h3>
                      <div className="flex items-center justify-between mt-1">
                        <p className="text-primary font-bold">{formatPrice(related.price)}</p>
                        <ChevronRight className="w-4 h-4 text-foreground/40 group-hover:text-primary transition-colors" />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </Section>
      )}

      <Footer />
      <FloatingCart />
      <CartDrawer />
    </div>
  );
};

const PairCard = ({ item, formatPrice, onAdd }: { item: MenuItem; formatPrice: (n: number) => string; onAdd: () => void }) => (
  <motion.div whileHover={{ y: -4 }} className="bg-card rounded-2xl overflow-hidden border border-border flex flex-col">
    <Link to={`/product/${item.sku}`} className="aspect-square overflow-hidden group">
      <img src={getItemImage(item.name, "", item.tags)} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
    </Link>
    <div className="p-3 flex flex-col gap-2 flex-1">
      <h3 className="font-semibold text-sm line-clamp-1">{item.name}</h3>
      <p className="text-primary font-bold text-sm">{formatPrice(item.price)}</p>
      <motion.button whileTap={{ scale: 0.94 }} onClick={onAdd} className="mt-auto w-full bg-primary/10 hover:bg-primary hover:text-primary-foreground text-primary text-xs font-semibold py-2 rounded-full transition-colors flex items-center justify-center gap-1">
        <Plus className="w-3.5 h-3.5" /> Add
      </motion.button>
    </div>
  </motion.div>
);

export default Product;
