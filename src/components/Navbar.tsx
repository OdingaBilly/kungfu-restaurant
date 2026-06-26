import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { ShoppingCart, Menu as MenuIcon, X, User as UserIcon, Shield } from "lucide-react";
import logo from "@/assets/logo.jpeg";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { useIsAdmin } from "@/hooks/useIsAdmin";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { itemCount, setIsOpen } = useCart();
  const { user } = useAuth();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "Menu", href: "/menu" },
    { label: "About", href: "/#about" },
    { label: "Contact", href: "/#contact" },
  ];

  const isMenuPage = location.pathname === "/menu";

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-background/95 backdrop-blur-md shadow-lg"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <img
              src={logo}
              alt="Kungfu Panda"
              className="w-12 h-12 object-contain transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6"
            />
            <span className="font-display text-xl tracking-wide hidden sm:block">
              Kungfu <span className="text-primary">Panda</span>
            </span>
          </Link>

          {/* Navigation Links - Desktop */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.href}
                className="nav-link font-medium text-sm uppercase tracking-wider"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right side: Cart + CTA */}
          <div className="flex items-center gap-4">
            {/* Cart button */}
            <button
              onClick={() => setIsOpen(true)}
              className="relative p-2 hover:bg-secondary rounded-full transition-colors"
            >
              <ShoppingCart className="w-5 h-5" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                  {itemCount > 9 ? "9+" : itemCount}
                </span>
              )}
            </button>

            {/* Account button */}
            <Link
              to={user ? "/account" : "/auth"}
              className="relative p-2 hover:bg-secondary rounded-full transition-colors"
              aria-label={user ? "My account" : "Sign in"}
            >
              <UserIcon className="w-5 h-5" />
              {user && <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full" />}
            </Link>

            {/* CTA Button */}
            <Link to="/menu" className="btn-kungfu text-sm px-6 py-3 hidden sm:block">
              Order Now
            </Link>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 hover:bg-secondary rounded-full transition-colors"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <MenuIcon className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-border pt-4 animate-fade-in">
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  to={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="nav-link font-medium text-sm uppercase tracking-wider py-2"
                >
                  {link.label}
                </Link>
              ))}
              <Link
                to="/menu"
                onClick={() => setMobileMenuOpen(false)}
                className="btn-kungfu text-sm px-6 py-3 text-center"
              >
                Order Now
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
