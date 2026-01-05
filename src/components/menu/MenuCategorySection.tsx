import { MenuCategory, MenuItem } from "@/data/menuData";
import MenuItemCard from "./MenuItemCard";
import TypeWriter from "@/components/TypeWriter";

interface MenuCategorySectionProps {
  category: MenuCategory;
  onQuickView: (item: MenuItem) => void;
}

const MenuCategorySection = ({ category, onQuickView }: MenuCategorySectionProps) => {
  return (
    <section id={`category-${category.slug}`} className="py-12">
      {/* Category Header */}
      <div className="mb-8">
        <h2 className="font-display text-3xl md:text-4xl text-foreground mb-2">
          {category.name}
        </h2>
        <p className="text-foreground/60 mb-3">{category.description}</p>
        {category.heroPhrase && (
          <div className="text-primary font-display text-lg">
            <TypeWriter words={[category.heroPhrase]} />
          </div>
        )}
        <div className="section-divider mt-4 !mx-0" />
      </div>

      {/* Flavors badge row */}
      {category.flavors && (
        <div className="flex flex-wrap gap-2 mb-6">
          <span className="text-foreground/50 text-sm">Flavors:</span>
          {category.flavors.map((flavor) => (
            <span
              key={flavor}
              className="bg-secondary text-foreground/80 text-xs px-3 py-1 rounded-full"
            >
              {flavor}
            </span>
          ))}
        </div>
      )}

      {/* Upgrade banner */}
      {category.upgrades && category.upgrades.length > 0 && (
        <div className="bg-gradient-to-r from-primary/20 to-accent/10 border border-primary/30 rounded-xl p-4 mb-6">
          <span className="text-sm font-medium text-primary">💡 Upgrade available:</span>
          {category.upgrades.map((upgrade) => (
            <span key={upgrade.name} className="text-foreground/80 text-sm ml-2">
              {upgrade.name} (+KES {upgrade.price})
            </span>
          ))}
        </div>
      )}

      {/* Items Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {category.items.map((item, index) => (
          <div
            key={item.sku}
            className="animate-fade-in"
            style={{ animationDelay: `${index * 0.05}s` }}
          >
            <MenuItemCard item={item} onQuickView={onQuickView} />
          </div>
        ))}
      </div>
    </section>
  );
};

export default MenuCategorySection;
