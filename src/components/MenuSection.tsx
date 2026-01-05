import DishCard from "./DishCard";
import chickenFries from "@/assets/chicken-fries.jpg";
import crispyChicken from "@/assets/crispy-chicken.jpg";
import koreanKatsu from "@/assets/korean-katsu.jpg";
import chapatiStew from "@/assets/chapati-stew.jpg";
import sesameTofu from "@/assets/sesame-tofu.jpg";

const dishes = [
  {
    image: crispyChicken,
    name: "Dragon's Fire Chicken",
    description: "Crispy fried chicken drizzled with our secret honey glaze. Pure flavor explosion.",
    price: "$14.99",
    tag: "Bestseller",
  },
  {
    image: koreanKatsu,
    name: "Kungfu Katsu Bowl",
    description: "Spicy Korean-style crispy cutlet on fluffy rice with chili crunch.",
    price: "$16.99",
    tag: "Spicy",
  },
  {
    image: chapatiStew,
    name: "Warrior's Feast",
    description: "Slow-cooked spiced stew with soft chapati. Comfort food at its finest.",
    price: "$18.99",
  },
  {
    image: sesameTofu,
    name: "Golden Sesame Tofu",
    description: "Crispy tofu in sweet chili glaze, topped with sesame and fresh scallions.",
    price: "$12.99",
    tag: "Vegan",
  },
  {
    image: chickenFries,
    name: "Panda Combo",
    description: "Signature fried chicken with golden fries and our legendary dipping sauce.",
    price: "$13.99",
  },
];

const MenuSection = () => {
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
          {dishes.map((dish, index) => (
            <div
              key={dish.name}
              className="animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <DishCard {...dish} />
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <button className="btn-kungfu-outline">
            View Full Menu
          </button>
        </div>
      </div>
    </section>
  );
};

export default MenuSection;
