import { useState } from "react";
import { Plus, Flame } from "lucide-react";
import { MenuItem, CURRENCY } from "@/data/menuData";
import { useCart } from "@/contexts/CartContext";
import { cn } from "@/lib/utils";

interface MenuItemCardProps {
  item: MenuItem;
  onQuickView: (item: MenuItem) => void;
}

const MenuItemCard = ({ item, onQuickView }: MenuItemCardProps) => {
  const { addItem, setIsOpen } = useCart();
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsAdding(true);
    addItem(item);
    
    setTimeout(() => {
      setIsAdding(false);
      setIsOpen(true);
    }, 400);
  };

  const formatPrice = (price: number) => {
    return `${CURRENCY} ${price.toLocaleString()}`;
  };

  return (
    <div
      onClick={() => onQuickView(item)}
      className="group relative bg-card rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_20px_50px_-12px_hsla(0,100%,38%,0.25)]"
    >
      {/* Image placeholder with gradient */}
      <div className="aspect-[4/3] bg-gradient-to-br from-secondary to-muted relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex gap-2">
          {item.isCombo && (
            <span className="bg-primary text-primary-foreground text-xs font-bold uppercase px-2.5 py-1 rounded-full">
              Combo
            </span>
          )}
          {item.spiceLevel && item.spiceLevel >= 1 && (
            <span className="bg-accent text-accent-foreground text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
              <Flame className="w-3 h-3" /> Spicy
            </span>
          )}
          {item.isVegetarian && (
            <span className="bg-green-600 text-white text-xs font-bold px-2.5 py-1 rounded-full">
              🌱 Veg
            </span>
          )}
        </div>
        
        {/* Placeholder icon */}
        <div className="absolute inset-0 flex items-center justify-center opacity-20">
          <span className="text-6xl">🍔</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-foreground text-lg mb-1 group-hover:text-primary transition-colors">
          {item.name}
        </h3>
        {item.description && (
          <p className="text-foreground/60 text-sm mb-3 line-clamp-2">
            {item.description}
          </p>
        )}
        
        <div className="flex items-center justify-between">
          <span className="text-primary font-bold text-lg">
            {formatPrice(item.price)}
          </span>
          
          <button
            onClick={handleAddToCart}
            className={cn(
              "flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-full text-sm font-medium transition-all duration-300",
              "hover:shadow-lg hover:scale-105 active:scale-95",
              isAdding && "animate-bounce bg-green-600"
            )}
          >
            <Plus className="w-4 h-4" />
            {isAdding ? "Added!" : "Add"}
          </button>
        </div>
      </div>

      {/* Hover spray accent */}
      <div className="absolute -inset-1 bg-gradient-radial from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
    </div>
  );
};

export default MenuItemCard;
