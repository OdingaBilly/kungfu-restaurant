import { ShoppingCart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart, CURRENCY } from "@/contexts/CartContext";

const FloatingCart = () => {
  const { itemCount, total, setIsOpen } = useCart();

  return (
    <AnimatePresence>
      {itemCount > 0 && (
        <motion.button
          onClick={() => setIsOpen(true)}
          initial={{ opacity: 0, scale: 0.5, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.5, y: 20 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.92 }}
          transition={{ type: "spring", stiffness: 400, damping: 22 }}
          aria-label={`Open cart, ${itemCount} items`}
          className="fixed bottom-20 md:bottom-6 right-6 z-40 flex items-center gap-3 rounded-full bg-primary text-primary-foreground pl-4 pr-5 h-14 shadow-2xl hover:shadow-[0_0_40px_hsla(0,100%,50%,0.5)] transition-shadow"
        >
          <span className="relative">
            <ShoppingCart className="w-6 h-6" />
            <motion.span
              key={itemCount}
              initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 500, damping: 15 }}
              className="absolute -top-2 -right-2 bg-foreground text-background text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center"
            >
              {itemCount > 99 ? "99+" : itemCount}
            </motion.span>
          </span>
          <AnimatePresence mode="popLayout">
            <motion.span
              key={total}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              className="font-display text-sm whitespace-nowrap"
            >
              {CURRENCY} {total.toLocaleString()}
            </motion.span>
          </AnimatePresence>
        </motion.button>
      )}
    </AnimatePresence>
  );
};

export default FloatingCart;
