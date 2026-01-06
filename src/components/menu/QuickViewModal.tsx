import { X, Plus, Minus, Flame, ShoppingCart } from "lucide-react";
import { useState } from "react";
import { MenuItem, CURRENCY } from "@/data/menuData";
import { useCart } from "@/contexts/CartContext";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

interface QuickViewModalProps {
  item: MenuItem | null;
  isOpen: boolean;
  onClose: () => void;
}

const QuickViewModal = ({ item, isOpen, onClose }: QuickViewModalProps) => {
  const { addItem, setIsOpen: openCart } = useCart();
  const [quantity, setQuantity] = useState(1);

  if (!item) return null;

  const formatPrice = (price: number) => {
    return `${CURRENCY} ${price.toLocaleString()}`;
  };

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addItem(item);
    }
    setQuantity(1);
    onClose();
    openCart(true);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-lg p-0 overflow-hidden bg-card border-border">
        <VisuallyHidden>
          <DialogTitle>{item.name}</DialogTitle>
        </VisuallyHidden>
        
        {/* Image */}
        <div className="aspect-video bg-gradient-to-br from-secondary to-muted relative">
          <div className="absolute inset-0 flex items-center justify-center opacity-30">
            <span className="text-8xl">🍔</span>
          </div>
          
          {/* Badges */}
          <div className="absolute top-4 left-4 flex gap-2">
            {item.isCombo && (
              <span className="bg-primary text-primary-foreground text-xs font-bold uppercase px-3 py-1.5 rounded-full">
                Combo
              </span>
            )}
            {item.spiceLevel && item.spiceLevel >= 1 && (
              <span className="bg-accent text-accent-foreground text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1">
                <Flame className="w-3 h-3" /> Spicy
              </span>
            )}
            {item.isVegetarian && (
              <span className="bg-green-600 text-white text-xs font-bold px-3 py-1.5 rounded-full">
                🌱 Veg
              </span>
            )}
          </div>

          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-background/80 backdrop-blur-sm p-2 rounded-full hover:bg-background transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <h2 className="font-display text-2xl text-foreground mb-2">{item.name}</h2>
          
          {item.description && (
            <p className="text-foreground/70 mb-4">{item.description}</p>
          )}

          <div className="flex items-center justify-between mb-6">
            <span className="text-primary font-bold text-2xl">
              {formatPrice(item.price)}
            </span>
            
            {item.calories && (
              <span className="text-sm text-foreground/50 bg-secondary px-3 py-1 rounded-full">
                {item.calories} cal
              </span>
            )}
          </div>

          {/* Quantity selector */}
          <div className="flex items-center justify-between gap-4 mb-6">
            <span className="text-foreground/70 text-sm">Quantity</span>
            <div className="flex items-center gap-3 bg-secondary rounded-full p-1">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="p-2 hover:bg-muted rounded-full transition-colors"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-8 text-center font-semibold">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="p-2 hover:bg-muted rounded-full transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Add to cart button */}
          <button
            onClick={handleAddToCart}
            className="w-full btn-kungfu flex items-center justify-center gap-3"
          >
            <ShoppingCart className="w-5 h-5" />
            Add {quantity} to Cart — {formatPrice(item.price * quantity)}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default QuickViewModal;
