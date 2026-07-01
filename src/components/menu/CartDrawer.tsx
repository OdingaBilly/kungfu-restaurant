import { useMemo } from "react";
import { Plus, Minus, Trash2, ShoppingBag, Truck, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useCart, CURRENCY } from "@/contexts/CartContext";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { menuCategories, getAllItemsFromCategory } from "@/data/menuData";
import { getItemImage } from "@/data/menuImages";

const FREE_DELIVERY_THRESHOLD = 2500;

// Panda personality — message changes with cart state
const getPandaMood = (count: number, total: number) => {
  if (count === 0) return { emoji: "🐼", line: "Your cart is empty", sub: "Feed the panda — add something tasty!" };
  if (total >= FREE_DELIVERY_THRESHOLD)
    return { emoji: "🐼🎉", line: "Free delivery unlocked!", sub: "Now that's kungfu-level ordering." };
  if (count >= 4) return { emoji: "😋", line: "Now we're feasting!", sub: "The panda approves this order." };
  if (count >= 2) return { emoji: "😎", line: "Great picks!", sub: "Almost there — add a little more?" };
  return { emoji: "🥢", line: "Nice start!", sub: "One is never enough, though..." };
};

const CartDrawer = () => {
  const { items, isOpen, setIsOpen, updateQuantity, removeItem, total, clearCart, itemCount, lastAddedSku } =
    useCart();

  const formatPrice = (price: number) => `${CURRENCY} ${price.toLocaleString()}`;

  const getCartItemImage = (sku: string) => {
    for (const category of menuCategories) {
      const catItems = getAllItemsFromCategory(category);
      const item = catItems.find((i) => i.sku === sku);
      if (item) return getItemImage(item.name, category.slug, item.tags);
    }
    return null;
  };

  const mood = useMemo(() => getPandaMood(itemCount, total), [itemCount, total]);
  const remaining = Math.max(0, FREE_DELIVERY_THRESHOLD - total);
  const progress = Math.min(100, (total / FREE_DELIVERY_THRESHOLD) * 100);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent className="w-full sm:max-w-md bg-card border-border flex flex-col p-0">
        <SheetHeader className="border-b border-border p-5">
          <SheetTitle className="font-display text-2xl flex items-center gap-3">
            <motion.span
              key={itemCount}
              initial={{ rotate: -20, scale: 0.7 }}
              animate={{ rotate: 0, scale: 1 }}
              transition={{ type: "spring", stiffness: 400, damping: 12 }}
            >
              <ShoppingBag className="w-6 h-6 text-primary" />
            </motion.span>
            Your Cart
            {itemCount > 0 && (
              <span className="ml-auto text-sm font-body font-normal text-foreground/50">
                {itemCount} {itemCount === 1 ? "item" : "items"}
              </span>
            )}
          </SheetTitle>
        </SheetHeader>

        {/* Panda mood banner */}
        <div className="px-5 pt-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={mood.line}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
              className="flex items-center gap-3 rounded-xl bg-secondary/60 p-3"
            >
              <span className="text-2xl leading-none">{mood.emoji}</span>
              <div className="min-w-0">
                <p className="font-display text-sm text-foreground leading-tight">{mood.line}</p>
                <p className="text-xs text-foreground/60 truncate">{mood.sub}</p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-6">
            <motion.span
              className="text-7xl mb-4"
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 2.4, ease: "easeInOut" }}
            >
              🐼
            </motion.span>
            <h3 className="font-display text-xl mb-2">Hungry panda alert</h3>
            <p className="text-foreground/60 mb-6">Add some delicious items to get started!</p>
            <Link to="/menu" onClick={() => setIsOpen(false)} className="btn-kungfu">
              Explore the Menu
            </Link>
          </div>
        ) : (
          <>
            {/* Free delivery progress */}
            <div className="px-5 pt-4">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="flex items-center gap-1.5 text-foreground/70">
                  <Truck className="w-3.5 h-3.5" />
                  {remaining > 0 ? (
                    <>
                      Add <span className="text-primary font-semibold">{formatPrice(remaining)}</span> for free delivery
                    </>
                  ) : (
                    <span className="text-primary font-semibold flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5" /> Free delivery unlocked!
                    </span>
                  )}
                </span>
              </div>
              <div className="h-2 rounded-full bg-secondary overflow-hidden">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-primary to-accent"
                  initial={false}
                  animate={{ width: `${progress}%` }}
                  transition={{ type: "spring", stiffness: 120, damping: 20 }}
                />
              </div>
            </div>

            {/* Cart items */}
            <div className="flex-1 overflow-y-auto p-5 space-y-3">
              <AnimatePresence initial={false}>
                {items.map((item) => {
                  const image = getCartItemImage(item.sku);
                  const isNew = item.sku === lastAddedSku;
                  return (
                    <motion.div
                      key={item.sku}
                      layout
                      initial={{ opacity: 0, x: 30, scale: 0.95 }}
                      animate={{ opacity: 1, x: 0, scale: 1 }}
                      exit={{ opacity: 0, x: -60, height: 0, marginBottom: 0 }}
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      className={`flex items-center gap-3 p-3 rounded-xl border ${
                        isNew ? "bg-primary/10 border-primary/40" : "bg-secondary border-transparent"
                      }`}
                    >
                      <div className="w-16 h-16 bg-muted rounded-lg overflow-hidden shrink-0">
                        {image ? (
                          <img src={image} alt={item.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <span className="text-2xl opacity-50">🍔</span>
                          </div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-foreground truncate text-sm">{item.name}</h4>
                        <p className="text-primary font-medium text-sm">{formatPrice(item.price)}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <button
                            onClick={() => updateQuantity(item.sku, item.quantity - 1)}
                            aria-label="Decrease quantity"
                            className="p-1.5 bg-muted rounded-full hover:bg-border active:scale-90 transition-all"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <motion.span
                            key={item.quantity}
                            initial={{ scale: 1.4 }}
                            animate={{ scale: 1 }}
                            className="w-6 text-center font-semibold text-sm"
                          >
                            {item.quantity}
                          </motion.span>
                          <button
                            onClick={() => updateQuantity(item.sku, item.quantity + 1)}
                            aria-label="Increase quantity"
                            className="p-1.5 bg-muted rounded-full hover:bg-border active:scale-90 transition-all"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>

                      <button
                        onClick={() => removeItem(item.sku)}
                        aria-label={`Remove ${item.name}`}
                        className="p-2 text-foreground/40 hover:text-destructive active:scale-90 transition-all self-start"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>

            {/* Footer */}
            <div
              className="border-t border-border p-5 space-y-3"
              style={{ paddingBottom: "calc(1.25rem + env(safe-area-inset-bottom))" }}
            >
              <div className="flex items-center justify-between">
                <span className="text-foreground/70">Subtotal</span>
                <motion.span
                  key={total}
                  initial={{ scale: 1.15 }}
                  animate={{ scale: 1 }}
                  className="font-bold text-xl text-primary"
                >
                  {formatPrice(total)}
                </motion.span>
              </div>

              <Link
                to="/checkout"
                onClick={() => setIsOpen(false)}
                className="w-full btn-kungfu text-lg text-center block active:scale-[0.98] transition-transform"
              >
                Checkout — {formatPrice(total)}
              </Link>

              <button
                onClick={clearCart}
                className="w-full text-center text-sm text-foreground/50 hover:text-foreground transition-colors"
              >
                Clear Cart
              </button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default CartDrawer;
