import { useRef, useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { MenuCategory } from "@/data/menuData";

interface CategoryTabsProps {
  categories: MenuCategory[];
  activeCategory: string;
  onCategoryChange: (slug: string) => void;
}

const CategoryTabs = ({ categories, activeCategory, onCategoryChange }: CategoryTabsProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeftShadow, setShowLeftShadow] = useState(false);
  const [showRightShadow, setShowRightShadow] = useState(true);

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setShowLeftShadow(scrollLeft > 0);
    setShowRightShadow(scrollLeft < scrollWidth - clientWidth - 10);
  };

  useEffect(() => {
    handleScroll();
  }, []);

  return (
    <div className="sticky top-16 z-30 bg-background/95 backdrop-blur-md border-b border-border">
      <div className="relative">
        {/* Left shadow */}
        {showLeftShadow && (
          <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
        )}
        
        {/* Right shadow */}
        {showRightShadow && (
          <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />
        )}

        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex gap-2 overflow-x-auto py-4 px-4 scrollbar-hide"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {categories.map((category) => (
            <button
              key={category.slug}
              onClick={() => onCategoryChange(category.slug)}
              className={cn(
                "relative whitespace-nowrap px-5 py-2.5 rounded-full font-medium text-sm transition-all duration-300",
                activeCategory === category.slug
                  ? "bg-primary text-primary-foreground shadow-lg"
                  : "bg-secondary text-foreground/70 hover:bg-secondary/80 hover:text-foreground"
              )}
            >
              {category.name}
              {/* Active brush stroke indicator */}
              {activeCategory === category.slug && (
                <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-8 h-1 bg-primary rounded-full" />
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryTabs;
