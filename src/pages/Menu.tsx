import { useState, useEffect } from "react";
import { MenuItem } from "@/data/menuData";
import { useMenu } from "@/hooks/useMenu";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CategoryTabs from "@/components/menu/CategoryTabs";
import MenuCategorySection from "@/components/menu/MenuCategorySection";
import QuickViewModal from "@/components/menu/QuickViewModal";
import FloatingCart from "@/components/menu/FloatingCart";
import CartDrawer from "@/components/menu/CartDrawer";

const Menu = () => {
  const { categories: menuCategories } = useMenu();
  const [activeCategory, setActiveCategory] = useState("");
  const [quickViewItem, setQuickViewItem] = useState<MenuItem | null>(null);
  const [quickViewCategory, setQuickViewCategory] = useState<string>("burgers");

  const handleQuickView = (item: MenuItem, categorySlug: string) => {
    setQuickViewItem(item);
    setQuickViewCategory(categorySlug);
  };

  const handleCategoryChange = (slug: string) => {
    setActiveCategory(slug);
    const element = document.getElementById(`category-${slug}`);
    if (element) {
      const offset = 140; // Account for sticky headers
      const top = element.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  // Intersection observer for active category
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const slug = entry.target.id.replace("category-", "");
            setActiveCategory(slug);
          }
        });
      },
      { rootMargin: "-50% 0px -50% 0px" }
    );

    menuCategories.forEach((cat) => {
      const el = document.getElementById(`category-${cat.slug}`);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [menuCategories]);

  useEffect(() => {
    if (!activeCategory && menuCategories[0]) setActiveCategory(menuCategories[0].slug);
  }, [menuCategories, activeCategory]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero */}
      <section className="pt-24 pb-8 px-6 bg-gradient-to-b from-primary/10 to-background">
        <div className="container">
          <h1 className="font-display text-4xl md:text-6xl text-center mb-4">
            Our <span className="text-primary">Menu</span>
          </h1>
          <p className="text-foreground/60 text-center max-w-xl mx-auto">
            Every dish crafted with passion, precision, and a touch of kungfu magic.
          </p>
        </div>
      </section>

      {/* Category Navigation */}
      <CategoryTabs
        categories={menuCategories}
        activeCategory={activeCategory}
        onCategoryChange={handleCategoryChange}
      />

      {/* Menu Content */}
      <div className="container px-6 pb-24">
        {menuCategories.map((category) => (
          <MenuCategorySection
            key={category.slug}
            category={category}
            onQuickView={(item) => handleQuickView(item, category.slug)}
          />
        ))}
      </div>

      <Footer />

      {/* Cart Components */}
      <FloatingCart />
      <CartDrawer />
      
      {/* Quick View Modal */}
      <QuickViewModal
        item={quickViewItem}
        categorySlug={quickViewCategory}
        isOpen={!!quickViewItem}
        onClose={() => setQuickViewItem(null)}
      />
    </div>
  );
};

export default Menu;
