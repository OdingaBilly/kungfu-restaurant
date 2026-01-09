import { Link } from "react-router-dom";
import { ArrowRight, Flame, Star } from "lucide-react";
import { menuCategories, getAllItemsFromCategory, CURRENCY } from "@/data/menuData";
import { getItemImage } from "@/data/menuImages";

// Featured dishes with category links
const getFeaturedDishes = () => {
  const featured = [
    { categorySlug: "burgers", itemName: "Double Dragon", tag: "Bestseller" },
    { categorySlug: "taste-of-china", itemName: "Stir-fried Free-range Chicken", tag: "Spicy" },
    { categorySlug: "african", itemName: "Chapati with Beef & Vegetables", tag: null },
    { categorySlug: "chicken-pieces", itemName: "6 Piecer", tag: "Value" },
    { categorySlug: "milk-teas-coffee", itemName: "Boba Milk Tea", tag: "Popular" },
  ];

  return featured.map((f) => {
    const category = menuCategories.find((c) => c.slug === f.categorySlug);
    if (!category) return null;
    
    const items = getAllItemsFromCategory(category);
    const item = items.find((i) => i.name === f.itemName);
    
    if (!item) return null;
    
    return {
      ...item,
      categorySlug: f.categorySlug,
      categoryName: category.name,
      tag: f.tag,
    };
  }).filter(Boolean);
};

const MenuSection = () => {
  const dishes = getFeaturedDishes();

  const formatPrice = (price: number) => `${CURRENCY} ${price.toLocaleString()}`;

  return (
    <section id="menu" className="py-24 bg-background">
      <div className="container px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="text-primary font-medium text-sm uppercase tracking-widest mb-4 block">
            Our Signature Dishes
          </span>
          <h2 className="font-display text-4xl md:text-6xl mb-6">
            Taste the <span className="text-primary">Legend</span>
          </h2>
          <div className="section-divider mb-6" />
          <p className="text-foreground/60 max-w-xl mx-auto">
            Every dish is crafted with passion, precision, and a touch of kungfu magic.
          </p>
        </div>

        {/* Dishes Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {dishes.map((dish, index) => {
            if (!dish) return null;
            
            return (
              <Link
                to={`/menu?category=${dish.categorySlug}`}
                key={dish.id}
                className="card-dish group cursor-pointer animate-fade-in block"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Image */}
                <div className="aspect-[4/5] overflow-hidden">
                  <img
                    src={getItemImage(dish.name, dish.categorySlug, dish.tags)}
                    alt={dish.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                </div>

                {/* Content Overlay */}
                <div className="absolute inset-0 z-10 flex flex-col justify-end p-6">
                  {/* Tags */}
                  <div className="absolute top-4 right-4 flex gap-2">
                    {dish.tag && (
                      <span className="bg-primary text-primary-foreground text-xs font-bold uppercase px-3 py-1 rounded-full flex items-center gap-1">
                        {dish.tag === "Spicy" && <Flame className="w-3 h-3" />}
                        {dish.tag === "Bestseller" && <Star className="w-3 h-3 fill-current" />}
                        {dish.tag}
                      </span>
                    )}
                  </div>

                  {/* Category Badge */}
                  <span className="text-primary/80 text-xs font-medium uppercase tracking-wider mb-2">
                    {dish.categoryName}
                  </span>

                  {/* Info */}
                  <div className="transform transition-transform duration-500 group-hover:translate-y-0 translate-y-2">
                    <h3 className="font-display text-2xl mb-2 text-foreground">{dish.name}</h3>
                    <p className="text-foreground/70 text-sm mb-4 line-clamp-2">
                      {dish.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-primary font-bold text-xl">{formatPrice(dish.price)}</span>
                      <span className="bg-foreground/10 hover:bg-primary text-foreground text-sm font-medium px-4 py-2 rounded-full transition-all duration-300 group-hover:bg-primary group-hover:scale-105 flex items-center gap-2">
                        View Category
                        <ArrowRight className="w-4 h-4" />
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <Link to="/menu" className="btn-kungfu-outline inline-flex items-center gap-2">
            View Full Menu
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default MenuSection;
