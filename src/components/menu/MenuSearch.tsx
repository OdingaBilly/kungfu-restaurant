import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { MenuCategory } from "@/data/menuData";

interface MenuSearchProps {
  query: string;
  onQueryChange: (value: string) => void;
  categories: MenuCategory[];
  activeFilter: string;
  onFilterChange: (slug: string) => void;
}

const MenuSearch = ({
  query,
  onQueryChange,
  categories,
  activeFilter,
  onFilterChange,
}: MenuSearchProps) => {
  return (
    <div className="sticky top-16 z-30 bg-background/95 backdrop-blur-md border-b border-border">
      <div className="container px-4 py-3">
        {/* Search input */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground/40 pointer-events-none" />
          <input
            type="search"
            inputMode="search"
            enterKeyHint="search"
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder="Search dishes, flavors, tags..."
            aria-label="Search the menu"
            className="w-full h-12 rounded-full bg-secondary border border-border pl-12 pr-11 text-base text-foreground placeholder:text-foreground/40 outline-none focus:ring-2 focus:ring-primary transition-shadow"
          />
          {query && (
            <button
              type="button"
              onClick={() => onQueryChange("")}
              aria-label="Clear search"
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-foreground/10 hover:bg-foreground/20 text-foreground transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Category filter chips */}
        <div
          className="flex gap-2 overflow-x-auto mt-3 scrollbar-hide"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          <button
            onClick={() => onFilterChange("all")}
            className={cn(
              "whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-display font-medium transition-all duration-200",
              activeFilter === "all"
                ? "bg-primary text-primary-foreground shadow"
                : "bg-secondary text-foreground/70 hover:text-foreground"
            )}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat.slug}
              onClick={() => onFilterChange(cat.slug)}
              className={cn(
                "whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-display font-medium transition-all duration-200",
                activeFilter === cat.slug
                  ? "bg-primary text-primary-foreground shadow"
                  : "bg-secondary text-foreground/70 hover:text-foreground"
              )}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MenuSearch;
