import { useState } from "react";
import { Plus, Flame } from "lucide-react";
import { MenuItem, CURRENCY } from "@/data/menuData";
import { useCart } from "@/contexts/CartContext";
import { cn } from "@/lib/utils";
import { getItemImage } from "@/data/menuImages";

interface MenuItemCardProps {
  item: MenuItem;
  categorySlug?: string;
  onQuickView: (item: MenuItem) => void;
}

const MenuItemCard = ({ item, categorySlug = "burgers", onQuickView }: MenuItemCardProps) => {
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

  const itemImage = getItemImage(item.name, categorySlug, item.tags);

  return (
    <div
      onClick={() => onQuickView(item)}
      className="group relative bg-card rounded-xl sm:rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_10px_30px_-8px_hsla(0,100%,38%,0.25)]"
    >
      {/* Image with real food photo - compact on mobile */}
      <div className="aspect-square sm:aspect-[4/3] relative overflow-hidden">
        <img 
          src={itemImage} 
          alt={item.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        
        {/* Badges - smaller on mobile */}
        <div className="absolute top-1.5 left-1.5 sm:top-3 sm:left-3 flex gap-1 sm:gap-2 flex-wrap max-w-[90%]">
          {item.isCombo && (
            <span className="bg-primary text-primary-foreground text-[10px] sm:text-xs font-bold uppercase px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-full">
              Combo
            </span>
          )}
          {item.spiceLevel && item.spiceLevel >= 1 && (
            <span className="bg-accent text-accent-foreground text-[10px] sm:text-xs font-bold px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-full flex items-center gap-0.5 sm:gap-1">
              <Flame className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
              <span className="hidden sm:inline">Spicy</span>
            </span>
          )}
          {item.isVegetarian && (
            <span className="bg-green-600 text-white text-[10px] sm:text-xs font-bold px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-full">
              🌱<span className="hidden sm:inline ml-0.5">Veg</span>
            </span>
          )}
        </div>
      </div>

      {/* Content - compact padding on mobile */}
      <div className="p-2.5 sm:p-4">
        <h3 className="font-display font-semibold text-foreground text-sm sm:text-base lg:text-lg mb-0.5 sm:mb-1 group-hover:text-primary transition-colors line-clamp-1">
          {item.name}
        </h3>
        {item.description && (
          <p className="text-foreground/60 text-xs sm:text-sm mb-2 sm:mb-3 line-clamp-1 sm:line-clamp-2">
            {item.description}
          </p>
        )}
        
        <div className="flex items-center justify-between gap-1">
          <span className="text-primary font-bold text-sm sm:text-base lg:text-lg">
            {formatPrice(item.price)}
          </span>
          
          <button
            onClick={handleAddToCart}
            className={cn(
              "flex items-center gap-1 sm:gap-2 bg-primary text-primary-foreground px-2 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-300",
              "hover:shadow-lg hover:scale-105 active:scale-95",
              isAdding && "animate-bounce bg-green-600"
            )}
          >
            <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">{isAdding ? "Added!" : "Add"}</span>
          </button>
        </div>
      </div>

      {/* Hover spray accent */}
      <div className="absolute -inset-1 bg-gradient-radial from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
    </div>
  );
};

export default MenuItemCard;
