import { useState, useEffect } from "react";
import logo from "@/assets/logo.jpeg";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = ["Menu", "Combos", "About", "Contact"];

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
          <a href="#" className="flex items-center gap-3 group">
            <img
              src={logo}
              alt="Kungfu Panda"
              className="w-12 h-12 object-contain transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6"
            />
            <span className="font-display text-xl tracking-wide hidden sm:block">
              Kungfu <span className="text-primary">Panda</span>
            </span>
          </a>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link}
                href={`#${link.toLowerCase()}`}
                className="nav-link font-medium text-sm uppercase tracking-wider"
              >
                {link}
              </a>
            ))}
          </div>

          {/* CTA Button */}
          <button className="btn-kungfu text-sm px-6 py-3">
            Order Now
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
