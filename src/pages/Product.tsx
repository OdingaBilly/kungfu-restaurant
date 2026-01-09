import { useState, useMemo } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, Minus, ShoppingCart, Flame, Leaf, Clock, Star } from "lucide-react";
import { menuCategories, getAllItemsFromCategory, MenuItem, CURRENCY } from "@/data/menuData";
import { getItemImage } from "@/data/menuImages";
import { useCart } from "@/contexts/CartContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingCart from "@/components/menu/FloatingCart";
import CartDrawer from "@/components/menu/CartDrawer";
import ItemCustomization from "@/components/menu/ItemCustomization";
import { toast } from "sonner";

const Product = () => {
  const { sku } = useParams();
  const navigate = useNavigate();
  const { addItem, setIsOpen } = useCart();

  const [quantity, setQuantity] = useState(1);
  const [spiceLevel, setSpiceLevel] = useState(2);
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);

  // Find product by SKU
  const productData = useMemo(() => {
    for (const category of menuCategories) {
      const items = getAllItemsFromCategory(category);
      const item = items.find((i) => i.sku === sku);
      if (item) {
        return { item, category };
      }
    }
    return null;
  }, [sku]);

  if (!productData) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container px-6 py-24 text-center">
          <span className="text-6xl mb-6 block">🔍</span>
          <h1 className="font-display text-3xl mb-4">Product Not Found</h1>
          <p className="text-foreground/60 mb-8">
            The product you're looking for doesn't exist.
          </p>
          <Link to="/menu" className="btn-kungfu">
            Browse Menu
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const { item, category } = productData;
  const image = getItemImage(item.name, category.slug, item.tags);

  const formatPrice = (price: number) => `${CURRENCY} ${price.toLocaleString()}`;

  // Calculate add-on prices
  const addOnPrices: Record<string, number> = {
    "Extra Sauce": 50,
    "Cheese": 100,
    "Extra Patty": 200,
    "Bacon": 150,
    "Avocado": 100,
    "Egg": 80,
  };

  const addOnsTotal = selectedAddOns.reduce((sum, addOn) => sum + (addOnPrices[addOn] || 0), 0);
  const itemTotal = (item.price + addOnsTotal) * quantity;

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addItem(item);
    }
    toast.success(`${quantity}x ${item.name} added to cart!`);
    setIsOpen(true);
  };

  // Get related items from same category
  const relatedItems = useMemo(() => {
    const items = getAllItemsFromCategory(category);
    return items.filter((i) => i.sku !== item.sku).slice(0, 4);
  }, [category, item.sku]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Breadcrumb */}
      <section className="pt-24 pb-4 px-6">
        <div className="container">
          <div className="flex items-center gap-2 text-sm text-foreground/60">
            <Link to="/" className="hover:text-primary transition-colors">Home</Link>
            <span>/</span>
            <Link to="/menu" className="hover:text-primary transition-colors">Menu</Link>
            <span>/</span>
            <Link to={`/menu?category=${category.slug}`} className="hover:text-primary transition-colors">
              {category.name}
            </Link>
            <span>/</span>
            <span className="text-foreground">{item.name}</span>
          </div>
        </div>
      </section>

      {/* Product Details */}
      <section className="pb-16 px-6">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Image */}
            <div className="relative">
              <div className="aspect-square rounded-3xl overflow-hidden bg-muted">
                <img
                  src={image}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                {item.isVegetarian && (
                  <span className="bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                    <Leaf className="w-3 h-3" />
                    Vegetarian
                  </span>
                )}
                {item.spiceLevel && item.spiceLevel > 2 && (
                  <span className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                    <Flame className="w-3 h-3" />
                    Spicy
                  </span>
                )}
              </div>
            </div>

            {/* Details */}
            <div>
              <Link
                to={`/menu?category=${category.slug}`}
                className="text-primary text-sm font-medium uppercase tracking-wider mb-2 inline-block hover:underline"
              >
                {category.name}
              </Link>
              
              <h1 className="font-display text-4xl md:text-5xl mb-4">{item.name}</h1>
              
              <p className="text-foreground/60 text-lg mb-6">
                {item.description || "A delicious choice from our menu, crafted with the finest ingredients."}
              </p>

              {/* Meta */}
              <div className="flex flex-wrap items-center gap-4 mb-8 text-sm">
                {item.calories && (
                  <span className="bg-muted px-3 py-1.5 rounded-full">
                    🔥 {item.calories} cal
                  </span>
                )}
                <span className="bg-muted px-3 py-1.5 rounded-full flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  15-20 min
                </span>
                <span className="bg-kungfu-gold/20 text-kungfu-gold px-3 py-1.5 rounded-full flex items-center gap-1">
                  <Star className="w-4 h-4 fill-current" />
                  4.8
                </span>
              </div>

              {/* Price */}
              <div className="mb-8">
                <span className="text-primary font-bold text-4xl">{formatPrice(item.price)}</span>
              </div>

              {/* Customization */}
              <div className="mb-8">
                <ItemCustomization
                  spiceLevel={spiceLevel}
                  onSpiceLevelChange={setSpiceLevel}
                  selectedAddOns={selectedAddOns}
                  onAddOnToggle={(id) => {
                    setSelectedAddOns((prev) =>
                      prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]
                    );
                  }}
                />
              </div>

              {/* Quantity & Add to Cart */}
              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center gap-3 bg-muted rounded-full p-2">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 rounded-full bg-background flex items-center justify-center hover:bg-primary/20 transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-8 text-center font-bold text-lg">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 rounded-full bg-background flex items-center justify-center hover:bg-primary/20 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                <button
                  onClick={handleAddToCart}
                  className="flex-1 btn-kungfu flex items-center justify-center gap-3 text-lg"
                >
                  <ShoppingCart className="w-5 h-5" />
                  Add to Cart — {formatPrice(itemTotal)}
                </button>
              </div>

              {/* Add-ons total indicator */}
              {addOnsTotal > 0 && (
                <p className="text-foreground/50 text-sm">
                  Includes {formatPrice(addOnsTotal)} in add-ons
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Related Items */}
      {relatedItems.length > 0 && (
        <section className="py-16 px-6 bg-secondary/30">
          <div className="container">
            <h2 className="font-display text-3xl mb-8">You May Also Like</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {relatedItems.map((related) => (
                <Link
                  key={related.sku}
                  to={`/product/${related.sku}`}
                  className="group bg-card rounded-xl overflow-hidden border border-border hover:border-primary/50 transition-all"
                >
                  <div className="aspect-square overflow-hidden">
                    <img
                      src={getItemImage(related.name, category.slug, related.tags)}
                      alt={related.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-3">
                    <h3 className="font-semibold text-sm line-clamp-1">{related.name}</h3>
                    <p className="text-primary font-bold">{formatPrice(related.price)}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer />
      <FloatingCart />
      <CartDrawer />
    </div>
  );
};

export default Product;
