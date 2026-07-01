import { useState, useEffect, useMemo } from "react";
import { MenuItem } from "@/data/menuData";
import { useMenu } from "@/hooks/useMenu";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CategoryTabs from "@/components/menu/CategoryTabs";
import MenuSearch from "@/components/menu/MenuSearch";
import MenuCategorySection from "@/components/menu/MenuCategorySection";
import MenuItemCard from "@/components/menu/MenuItemCard";
import QuickViewModal from "@/components/menu/QuickViewModal";
import FloatingCart from "@/components/menu/FloatingCart";
import CartDrawer from "@/components/menu/CartDrawer";
import { SearchX } from "lucide-react";

interface FlatItem {
  item: MenuItem;
  categorySlug: string;
  categoryName: string;
}

const Menu = () => {
  const { categories: menuCategories } = useMenu();
  const [activeCategory, setActiveCategory] = useState("");
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [quickViewItem, setQuickViewItem] = useState<MenuItem | null>(null);
  const [quickViewCategory, setQuickViewCategory] = useState<string>("burgers");

  const isSearching = query.trim().length > 0 || filter !== "all";

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

  // Flatten every item once for fast searching
  const allItems = useMemo<FlatItem[]>(() => {
    const flat: FlatItem[] = [];
    menuCategories.forEach((cat) => {
      const push = (items?: MenuItem[]) =>
        items?.forEach((item) =>
          flat.push({ item, categorySlug: cat.slug, categoryName: cat.name })
        );
      push(cat.items);
      cat.subcategories?.forEach((sub) => push(sub.items));
    });
    return flat;
  }, [menuCategories]);

  const results = useMemo<FlatItem[]>(() => {
    const q = query.trim().toLowerCase();
    return allItems.filter(({ item, categorySlug }) => {
      if (filter !== "all" && categorySlug !== filter) return false;
      if (!q) return true;
      const haystack = [
        item.name,
        item.description ?? "",
        item.sku ?? "",
        ...(item.tags ?? []),
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [allItems, query, filter]);

  // Intersection observer for active category (only while browsing)
  useEffect(() => {
    if (isSearching) return;
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
  }, [menuCategories, isSearching]);

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

      {/* Search + filter */}
      <MenuSearch
        query={query}
        onQueryChange={setQuery}
        categories={menuCategories}
        activeFilter={filter}
        onFilterChange={setFilter}
      />

      {/* Category Navigation (only while browsing full menu) */}
      {!isSearching && (
        <CategoryTabs
          categories={menuCategories}
          activeCategory={activeCategory}
          onCategoryChange={handleCategoryChange}
        />
      )}

      {/* Menu Content */}
      <div className="container px-6 pb-24">
        {isSearching ? (
          results.length > 0 ? (
            <div className="pt-8">
              <p className="text-foreground/60 text-sm mb-6">
                {results.length} {results.length === 1 ? "result" : "results"}
                {query.trim() && (
                  <>
                    {" "}for <span className="text-foreground font-medium">"{query.trim()}"</span>
                  </>
                )}
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 md:gap-5">
                {results.map(({ item, categorySlug }) => (
                  <div key={`${categorySlug}-${item.id}`} className="animate-fade-in">
                    <MenuItemCard
                      item={item}
                      categorySlug={categorySlug}
                      onQuickView={(i) => handleQuickView(i, categorySlug)}
                    />
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-center py-24">
              <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mb-5">
                <SearchX className="w-8 h-8 text-foreground/40" />
              </div>
              <h3 className="font-display text-2xl mb-2">No dishes found</h3>
              <p className="text-foreground/60 max-w-xs mb-6">
                We couldn't find anything matching your search. Try a different keyword or category.
              </p>
              <button
                onClick={() => {
                  setQuery("");
                  setFilter("all");
                }}
                className="btn-kungfu-outline"
              >
                Clear search
              </button>
            </div>
          )
        ) : (
          menuCategories.map((category) => (
            <MenuCategorySection
              key={category.slug}
              category={category}
              onQuickView={(item) => handleQuickView(item, category.slug)}
            />
          ))
        )}
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
