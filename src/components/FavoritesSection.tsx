import { Heart, Star, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import { menuCategories, getAllItemsFromCategory, CURRENCY, MenuItem } from "@/data/menuData";
import { getItemImage } from "@/data/menuImages";
import { useCart } from "@/contexts/CartContext";

// Get fan favorites (items with high calories or combos tend to be popular)
const getFavorites = (): (MenuItem & { categorySlug: string })[] => {
  const favorites: (MenuItem & { categorySlug: string })[] = [];
  
  // Hand-picked bestsellers based on menu data
  const favoriteSkus = ["BUR-BEEF-DOUBLE", "CHK-6PC", "CN-CHK-FREERANGE", "DR-SHK-OREO", "SP-9"];
  
  for (const category of menuCategories) {
    const items = getAllItemsFromCategory(category);
    for (const item of items) {
      if (item.sku && favoriteSkus.includes(item.sku)) {
        favorites.push({ ...item, categorySlug: category.slug });
      }
    }
  }
  
  return favorites.slice(0, 4);
};

const FavoritesSection = () => {
  const favorites = getFavorites();
  const { addItem, setIsOpen } = useCart();

  const handleQuickAdd = (item: MenuItem) => {
    addItem(item);
    setIsOpen(true);
  };

  const formatPrice = (price: number) => `${CURRENCY} ${price.toLocaleString()}`;

  return (
    <section className="py-20 bg-gradient-to-b from-background via-secondary/30 to-background">
      <div className="container px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-primary/20 border border-primary/30 rounded-full px-4 py-2 mb-6">
            <Heart className="w-4 h-4 text-primary fill-primary" />
            <span className="text-sm font-medium">Fan Favorites</span>
          </div>
          <h2 className="font-display text-4xl md:text-5xl mb-4">
            Most <span className="text-primary">Loved</span> Dishes
          </h2>
          <p className="text-foreground/60 max-w-lg mx-auto">
            These crowd-pleasers keep customers coming back for more. Tried and tested by thousands!
          </p>
        </div>

        {/* Favorites Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {favorites.map((item, index) => (
            <Link
              to={`/product/${item.sku}`}
              key={item.id}
              className="group relative bg-card rounded-2xl overflow-hidden border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-[0_0_40px_hsla(0,100%,38%,0.15)] block"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Badge */}
              <div className="absolute top-3 left-3 z-10 flex items-center gap-1 bg-kungfu-gold/90 text-black text-xs font-bold px-2 py-1 rounded-full">
                <Star className="w-3 h-3 fill-current" />
                Top Pick
              </div>

              {/* Image */}
              <div className="aspect-square overflow-hidden">
                <img
                  src={getItemImage(item.name, item.categorySlug, item.tags)}
                  alt={item.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="font-display text-lg text-foreground mb-1 line-clamp-1">
                  {item.name}
                </h3>
                <p className="text-foreground/50 text-xs mb-3 line-clamp-2">
                  {item.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-primary font-bold text-lg">
                    {formatPrice(item.price)}
                  </span>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      handleQuickAdd(item);
                    }}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-semibold px-4 py-2 rounded-full transition-all hover:scale-105"
                  >
                    Add
                  </button>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* View All */}
        <div className="text-center mt-10">
          <Link
            to="/menu"
            className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-medium transition-colors"
          >
            <TrendingUp className="w-4 h-4" />
            See what's trending on our full menu
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FavoritesSection;
