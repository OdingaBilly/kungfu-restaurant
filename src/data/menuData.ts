// Menu data types and seed data
export interface MenuItem {
  sku: string;
  name: string;
  price: number;
  description?: string;
  isCombo?: boolean;
  isUpgradable?: boolean;
  spiceLevel?: number;
  image?: string;
}

export interface MenuCategory {
  slug: string;
  name: string;
  description: string;
  heroPhrase?: string;
  items: MenuItem[];
  upgrades?: { type: string; name: string; price: number }[];
  flavors?: string[];
}

export const CURRENCY = "KES";

export const menuCategories: MenuCategory[] = [
  {
    slug: "burgers",
    name: "Burgers",
    description: "Forged on the grill. Trained in flavor combat.",
    heroPhrase: "Juicy. Bold. Unstoppable.",
    items: [
      {
        sku: "BUR-BEEF-CLASSIC",
        name: "Classic Beef Burger",
        price: 1050,
        description: "Juicy beef patty, lettuce, tomato, house sauce.",
        isCombo: false,
        isUpgradable: true,
      },
      {
        sku: "BUR-CHK-CLASSIC",
        name: "Classic Chicken Burger",
        price: 1050,
        description: "Crispy chicken, fresh greens, flowing sauces.",
        isCombo: false,
        isUpgradable: true,
      },
      {
        sku: "BUR-CHEESY",
        name: "Cheesy Burger",
        price: 1300,
        description: "Beef, molten cheese, pineapple, fries, 350ml soda.",
        isCombo: true,
      },
      {
        sku: "BUR-SPICY-CHK",
        name: "Spicy Chicken Burger",
        price: 1150,
        description: "Fire-trained chicken with chilli kick.",
        isCombo: true,
        spiceLevel: 3,
      },
      {
        sku: "BUR-DOUBLE-BEEF",
        name: "Double Dragon Beef Burger",
        price: 1250,
        description: "Two beef patties. No mercy.",
        isCombo: true,
      },
      {
        sku: "BUR-DOUBLE-CHK",
        name: "Double Dragon Chicken Burger",
        price: 1050,
        description: "Twin crispy chicken stack.",
        isCombo: true,
      },
    ],
  },
  {
    slug: "burger-combos",
    name: "Burger Combos",
    description: "Balance achieved. Burger meets drink.",
    heroPhrase: "Built Like a Warrior.",
    items: [
      {
        sku: "COM-CLASSIC-BOBA",
        name: "Classic Burger & Boba",
        price: 1250,
        description: "Classic beef burger, fries, boba or juice.",
        isCombo: true,
      },
      {
        sku: "COM-ELCHICO",
        name: "El Chico & Your Drink",
        price: 1350,
        description: "Upgraded beef burger with drink of choice.",
        isCombo: true,
      },
      {
        sku: "COM-DOUBLE-DRAGON",
        name: "Double Dragon & Boba",
        price: 1500,
        description: "Double beef + fries + boba.",
        isCombo: true,
      },
    ],
  },
  {
    slug: "pandas-chicken",
    name: "Panda's Chicken",
    description: "Crunch first. Talk later.",
    heroPhrase: "Crispy Outside. Legendary Inside.",
    items: [
      { sku: "CHK-2PC", name: "2 Piecer", price: 350, description: "2 pieces of crispy fried chicken." },
      { sku: "CHK-3PC", name: "3 Piecer", price: 470, description: "3 pieces of crispy fried chicken." },
      { sku: "CHK-6PC", name: "6 Piecer", price: 1100, description: "6 pieces of crispy fried chicken." },
      { sku: "CHK-9PC", name: "9 Piecer", price: 1500, description: "9 pieces of crispy fried chicken." },
      { sku: "CHK-12PC", name: "12 Piecer", price: 1950, description: "12 pieces of crispy fried chicken." },
    ],
    upgrades: [
      { type: "upgrade", name: "Fries + 300ml Soda + Extra Sauce", price: 270 },
    ],
  },
  {
    slug: "wings",
    name: "Crispy Wings",
    description: "Crunchy wings with bold flavors.",
    heroPhrase: "Dip. Crunch. Repeat.",
    items: [
      { sku: "WNG-4", name: "4 Wings", price: 500, description: "4 crispy wings with your choice of sauce." },
      { sku: "WNG-6", name: "6 Wings", price: 750, description: "6 crispy wings with your choice of sauce." },
      { sku: "WNG-8", name: "8 Wings", price: 900, description: "8 crispy wings with your choice of sauce." },
    ],
    flavors: ["BBQ", "American", "Black Pepper", "Orleans Grilled"],
  },
  {
    slug: "street-packs",
    name: "Street & Lunch Packs",
    description: "Value packs for the hungry warrior.",
    heroPhrase: "Fuel for the Streets.",
    items: [
      { sku: "SP-2", name: "StreetPack 2", price: 530, description: "2pc chicken, fries, and drink." },
      { sku: "SP-3", name: "StreetPack 3", price: 670, description: "3pc chicken, fries, and drink." },
      { sku: "SP-6", name: "StreetPack 6", price: 1650, description: "6pc chicken, fries, and drinks." },
      { sku: "SP-9", name: "StreetPack 9", price: 1940, description: "9pc chicken, fries, and drinks." },
      { sku: "SP-12", name: "StreetPack 12", price: 2350, description: "12pc chicken, fries, and drinks." },
    ],
  },
  {
    slug: "chinese-specials",
    name: "Chinese Seafood & Specials",
    description: "Wok-fired mastery from the East.",
    heroPhrase: "Wok-Fired. Flavor-Driven.",
    items: [
      { sku: "CN-FISH-BRAISE", name: "Braised Fish", price: 1280, description: "Slow-braised fish in rich sauce." },
      { sku: "CN-FISH-PEPPER", name: "Stir-fried Fish with Green Peppers", price: 1280, description: "Wok-tossed fish with fresh peppers." },
      { sku: "CN-SHRIMP-GARLIC", name: "Garlic Shrimp", price: 1280, description: "Succulent shrimp in garlic butter." },
    ],
  },
  {
    slug: "african",
    name: "African Dishes",
    description: "Hearty, home-style African comfort.",
    heroPhrase: "Culture You Can Taste.",
    items: [
      { sku: "AF-UGALI-CHK", name: "Ugali, Chicken & Rice", price: 1250, description: "Traditional ugali with chicken and rice." },
      { sku: "AF-UGALI-FISH", name: "Ugali, Fish & Greens", price: 1150, description: "Ugali with tilapia and sukuma wiki." },
      { sku: "AF-UGALI-BEEF", name: "Ugali, Beef/Chevon & Greens", price: 1000, description: "Ugali with beef or goat and greens." },
    ],
  },
  {
    slug: "drinks",
    name: "Milk Teas, Coffee & Drinks",
    description: "Refresh. Recharge. Repeat.",
    heroPhrase: "Sip the Legend.",
    items: [
      { sku: "DR-MILKTEA", name: "Milk Teas (All Flavors)", price: 380, description: "Creamy milk tea in various flavors." },
      { sku: "DR-MOJITO", name: "Mojitos", price: 400, description: "Refreshing mojito drinks." },
      { sku: "DR-SHAKE", name: "Milkshakes", price: 450, description: "Thick, creamy milkshakes." },
      { sku: "DR-COFFEE", name: "Coffee Range", price: 200, description: "Hot and iced coffee options." },
    ],
  },
];
