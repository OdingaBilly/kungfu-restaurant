import { Plus, Minus, Trash2, ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";
import { useCart, CURRENCY } from "@/contexts/CartContext";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { menuCategories, getAllItemsFromCategory } from "@/data/menuData";
import { getItemImage } from "@/data/menuImages";

const CartDrawer = () => {
  const { items, isOpen, setIsOpen, updateQuantity, removeItem, total, clearCart } = useCart();

  const formatPrice = (price: number) => {
    return `${CURRENCY} ${price.toLocaleString()}`;
  };

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

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent className="w-full sm:max-w-md bg-card border-border flex flex-col">
        <SheetHeader className="border-b border-border pb-4">
          <SheetTitle className="font-display text-2xl flex items-center gap-3">
            <ShoppingBag className="w-6 h-6 text-primary" />
            Your Cart
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-6">
            <span className="text-6xl mb-4">🐼</span>
            <h3 className="font-display text-xl mb-2">Your cart is empty</h3>
            <p className="text-foreground/60">Add some delicious items to get started!</p>
          </div>
        ) : (
          <>
            {/* Cart items */}
            <div className="flex-1 overflow-y-auto py-4 space-y-4">
              {items.map((item) => {
                const image = getCartItemImage(item.sku);
                return (
                  <div
                    key={item.sku}
                    className="flex items-center gap-4 p-4 bg-secondary rounded-xl"
                  >
                    {/* Item image */}
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
                      <h4 className="font-semibold text-foreground truncate">{item.name}</h4>
                      <p className="text-primary font-medium">{formatPrice(item.price)}</p>
                    </div>

                    {/* Quantity controls */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(item.sku, item.quantity - 1)}
                        className="p-1.5 bg-muted rounded-full hover:bg-border transition-colors"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-6 text-center font-semibold text-sm">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.sku, item.quantity + 1)}
                        className="p-1.5 bg-muted rounded-full hover:bg-border transition-colors"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    {/* Remove button */}
                    <button
                      onClick={() => removeItem(item.sku)}
                      className="p-2 text-foreground/40 hover:text-destructive transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Footer */}
            <div className="border-t border-border pt-4 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-foreground/70">Subtotal</span>
                <span className="font-bold text-xl text-primary">{formatPrice(total)}</span>
              </div>

              <Link
                to="/checkout"
                onClick={() => setIsOpen(false)}
                className="w-full btn-kungfu text-lg text-center block"
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
