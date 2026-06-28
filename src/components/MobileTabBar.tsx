import { Link, useLocation } from "react-router-dom";
import { Home, UtensilsCrossed, ShoppingBag, User as UserIcon } from "lucide-react";
import { motion } from "framer-motion";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

const MobileTabBar = () => {
  const location = useLocation();
  const { itemCount, setIsOpen } = useCart();
  const { user } = useAuth();

  const isActive = (path: string) =>
    path === "/" ? location.pathname === "/" : location.pathname.startsWith(path);

  const items = [
    { label: "Home", to: "/", icon: Home, active: isActive("/") },
    { label: "Menu", to: "/menu", icon: UtensilsCrossed, active: isActive("/menu") },
    {
      label: "Account",
      to: user ? "/account" : "/auth",
      icon: UserIcon,
      active: isActive("/account") || isActive("/auth"),
    },
  ];

  return (
    <nav
      className="md:hidden fixed bottom-0 inset-x-0 z-50 border-t border-border bg-background/90 backdrop-blur-xl"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="grid grid-cols-4 h-16">
        {items.slice(0, 2).map((item) => (
          <TabLink key={item.label} {...item} />
        ))}

        {/* Cart center button */}
        <button
          onClick={() => setIsOpen(true)}
          className="relative flex flex-col items-center justify-center gap-1 text-foreground/60 active:scale-90 transition-transform"
        >
          <span className="relative">
            <ShoppingBag className="w-6 h-6" />
            {itemCount > 0 && (
              <motion.span
                key={itemCount}
                initial={{ scale: 0.5 }}
                animate={{ scale: 1 }}
                className="absolute -top-1.5 -right-2 bg-primary text-primary-foreground text-[10px] font-bold min-w-4 h-4 px-1 rounded-full flex items-center justify-center"
              >
                {itemCount > 9 ? "9+" : itemCount}
              </motion.span>
            )}
          </span>
          <span className="text-[10px] font-medium uppercase tracking-wide">Cart</span>
        </button>

        {items.slice(2).map((item) => (
          <TabLink key={item.label} {...item} />
        ))}
      </div>
    </nav>
  );
};

const TabLink = ({
  to,
  icon: Icon,
  label,
  active,
}: {
  to: string;
  icon: typeof Home;
  label: string;
  active: boolean;
}) => (
  <Link
    to={to}
    className={cn(
      "relative flex flex-col items-center justify-center gap-1 transition-colors active:scale-90",
      active ? "text-primary" : "text-foreground/60",
    )}
  >
    {active && (
      <motion.span
        layoutId="tabbar-indicator"
        className="absolute top-0 h-0.5 w-8 rounded-full bg-primary"
        transition={{ type: "spring", stiffness: 500, damping: 35 }}
      />
    )}
    <Icon className="w-6 h-6" />
    <span className="text-[10px] font-medium uppercase tracking-wide">{label}</span>
  </Link>
);

export default MobileTabBar;
