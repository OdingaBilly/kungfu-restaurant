import { Sparkles, Clock, ChefHat } from "lucide-react";
import { Link } from "react-router-dom";
import { menuCategories, getAllItemsFromCategory, CURRENCY, MenuItem } from "@/data/menuData";
import { getItemImage } from "@/data/menuImages";
import { useCart } from "@/contexts/CartContext";
import { useMemo } from "react";

// Generate daily suggestions based on the current day
const getDailySuggestions = (): (MenuItem & { categorySlug: string })[] => {
  const allItems: (MenuItem & { categorySlug: string })[] = [];
  
  for (const category of menuCategories) {
    const items = getAllItemsFromCategory(category);
    for (const item of items) {
      allItems.push({ ...item, categorySlug: category.slug });
    }
  }
  
  // Use day of year as seed for pseudo-random selection
  const today = new Date();
  const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
  
  // Shuffle based on day
  const shuffled = [...allItems].sort((a, b) => {
    const hashA = (a.id * dayOfYear) % 1000;
    const hashB = (b.id * dayOfYear) % 1000;
    return hashA - hashB;
  });
  
  return shuffled.slice(0, 3);
};

const DailySuggestionsSection = () => {
  const suggestions = useMemo(() => getDailySuggestions(), []);
  const { addItem, setIsOpen } = useCart();

  const handleQuickAdd = (item: MenuItem) => {
    addItem(item);
    setIsOpen(true);
  };

  const formatPrice = (price: number) => `${CURRENCY} ${price.toLocaleString()}`;

  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-10 w-40 h-40 rounded-full bg-primary blur-3xl" />
        <div className="absolute bottom-20 right-10 w-60 h-60 rounded-full bg-accent blur-3xl" />
      </div>

      <div className="container px-6 relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-accent/20 border border-accent/30 rounded-full px-4 py-2 mb-6">
            <Sparkles className="w-4 h-4 text-accent" />
            <span className="text-sm font-medium">Chef's Daily Picks</span>
          </div>
          <h2 className="font-display text-4xl md:text-5xl mb-4">
            Today's <span className="text-primary">Specials</span>
          </h2>
          <div className="flex items-center justify-center gap-2 text-foreground/50 text-sm mb-4">
            <Clock className="w-4 h-4" />
            <span>{today}</span>
          </div>
          <p className="text-foreground/60 max-w-lg mx-auto">
            Our chef rotates these recommendations daily. Come back tomorrow for new surprises!
          </p>
        </div>

        {/* Suggestions Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {suggestions.map((item, index) => (
            <Link
              to={`/product/${item.sku}`}
              key={item.id}
              className="group relative animate-fade-in block"
              style={{ animationDelay: `${index * 0.15}s` }}
            >
              {/* Card */}
              <div className="bg-gradient-to-br from-card to-secondary/50 rounded-3xl overflow-hidden border border-border hover:border-primary/50 transition-all duration-500 hover:shadow-[0_20px_60px_-15px_hsla(0,100%,38%,0.25)] hover:-translate-y-2">
                {/* Chef Pick Badge */}
                <div className="absolute top-4 right-4 z-10">
                  <div className="bg-background/80 backdrop-blur-sm rounded-full p-2">
                    <ChefHat className="w-5 h-5 text-primary" />
                  </div>
                </div>

                {/* Image */}
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={getItemImage(item.name, item.categorySlug, item.tags)}
                    alt={item.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-display text-xl text-foreground line-clamp-1 flex-1">
                      {item.name}
                    </h3>
                  </div>
                  
                  <p className="text-foreground/50 text-sm mb-4 line-clamp-2 min-h-[40px]">
                    {item.description || "A delicious choice handpicked by our chef"}
                  </p>

                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-primary font-bold text-xl">
                        {formatPrice(item.price)}
                      </span>
                      {item.calories && (
                        <span className="text-foreground/40 text-xs block">
                          {item.calories} cal
                        </span>
                      )}
                    </div>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        handleQuickAdd(item);
                      }}
                      className="btn-kungfu text-sm !px-5 !py-2.5"
                    >
                      Order Now
                    </button>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Explore More */}
        <div className="text-center mt-12">
          <Link
            to="/menu"
            className="btn-kungfu-outline"
          >
            Explore Full Menu
          </Link>
        </div>
      </div>
    </section>
  );
};

export default DailySuggestionsSection;
