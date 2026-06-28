import { ShoppingCart } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { cn } from "@/lib/utils";

const FloatingCart = () => {
  const { itemCount, setIsOpen } = useCart();

  if (itemCount === 0) return null;

  return (
    <button
      onClick={() => setIsOpen(true)}
      className={cn(
        "fixed bottom-20 md:bottom-6 right-6 z-40 bg-primary text-primary-foreground",
        "w-16 h-16 rounded-full shadow-2xl flex items-center justify-center",
        "transition-all duration-300 hover:scale-110 hover:shadow-[0_0_40px_hsla(0,100%,50%,0.5)]",
        "animate-bounce-subtle"
      )}
    >
      <ShoppingCart className="w-6 h-6" />
      
      {/* Item count badge */}
      <span className="absolute -top-1 -right-1 bg-foreground text-background text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center">
        {itemCount > 99 ? "99+" : itemCount}
      </span>
    </button>
  );
};

export default FloatingCart;
