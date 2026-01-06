// Menu data types and seed data
export interface MenuItem {
  id: number;
  sku?: string;
  name: string;
  price: number;
  priceSmall?: number;
  priceLarge?: number;
  description?: string;
  calories?: number;
  tags?: string[];
  isCombo?: boolean;
  isVegetarian?: boolean;
  isFeatured?: boolean;
  spiceLevel?: number;
  image?: string;
}

export interface MenuSubcategory {
  slug: string;
  name: string;
  items: MenuItem[];
}

export interface MenuCategory {
  slug: string;
  name: string;
  description: string;
  heroPhrase?: string;
  items?: MenuItem[];
  subcategories?: MenuSubcategory[];
  upgrades?: { type: string; name: string; price: number }[];
  flavors?: string[];
}

export const CURRENCY = "KES";

export const RESTAURANT = {
  name: "Kungfu Panda Restaurant",
  tagline: "Calories don't count if you're happy.",
  description: "Serious food. Not-so-serious rules.",
  website: "www.kungfu-restaurant.com",
  phone: "+2547-9702-1412",
  address: "Kungfu Panda Restaurant, Riara Road"
};

export const menuCategories: MenuCategory[] = [
  {
    slug: "burgers",
    name: "Burgers",
    description: "Forged on the grill. Trained in flavor combat.",
    heroPhrase: "Juicy. Bold. Unstoppable.",
    subcategories: [
      {
        slug: "beef-burgers",
        name: "Beef Burgers",
        items: [
          { id: 1, sku: "BUR-BEEF-CLASSIC", name: "Classic Burger", description: "Classic burger, 300ml soda and fries", price: 1050, calories: 750, tags: ["beef", "burger", "fries", "soda"], isCombo: true },
          { id: 2, sku: "BUR-BEEF-PRINCE", name: "The Prince", description: "Cheesy burger with pineapple, mayo, chili/mayo, lettuce, tomatoes, fries and 350ml soda", price: 1050, calories: 820, tags: ["beef", "cheese", "spicy", "fries", "soda"], isCombo: true },
          { id: 3, sku: "BUR-BEEF-DOUBLE", name: "Double Dragon", description: "Two pieces beef, fries, and 350ml soda. Mayo/chili", price: 1300, calories: 950, tags: ["beef", "double", "fries", "soda"], isCombo: true },
          { id: 4, sku: "BUR-BEEF-ELCHICO", name: "El Chico", description: "Comes with fries, and 350ml soda. Mayo/Chili. Ketchup", price: 1150, calories: 800, tags: ["beef", "cheese", "fries", "soda"], isCombo: true },
        ]
      },
      {
        slug: "chicken-burgers",
        name: "Chicken Burgers",
        items: [
          { id: 5, sku: "BUR-CHK-CLASSIC", name: "Classic Burger", description: "Classic chicken burger, 300ml soda and fries", price: 1050, calories: 700, tags: ["chicken", "burger", "fries", "soda"], isCombo: true },
          { id: 6, sku: "BUR-CHK-SPICY", name: "Spicy Chicken Burger", description: "Cheesy and spicy chicken burger, 300ml soda and fries. Mayo/Chili", price: 1050, calories: 720, tags: ["chicken", "spicy", "cheese", "fries", "soda"], isCombo: true, spiceLevel: 2 },
          { id: 7, sku: "BUR-CHK-DOUBLE", name: "Double Dragon", description: "Two pieces chicken, fries, and 350ml soda. Mayo/chili", price: 1300, calories: 880, tags: ["chicken", "double", "fries", "soda"], isCombo: true },
          { id: 8, sku: "BUR-CHK-CHEESY", name: "Cheesy Burger", description: "Burger with lots of cheese. Fries, 350ml soda. Chilli/Mayo", price: 1050, calories: 760, tags: ["chicken", "cheese", "fries", "soda"], isCombo: true },
        ]
      },
      {
        slug: "upgraded-combos",
        name: "Upgraded Burger Combos",
        items: [
          { id: 9, sku: "COM-CLASSIC-BOBA", name: "Classic Burger & Boba", description: "Classic beef burger, fries, and your choice of drink: Milk Tea/Mojito/Fresh Fruit Juice. Extra sauce", price: 1250, calories: 850, tags: ["beef", "combo", "boba", "fries"], isCombo: true },
          { id: 10, sku: "COM-PRINCE-BOBA", name: "The Prince & Boba", description: "Cheesy and spicy chicken burger. Your choice of drink. Extra saucy.", price: 1250, calories: 860, tags: ["chicken", "combo", "boba", "spicy"], isCombo: true },
          { id: 11, sku: "COM-DOUBLE-BOBA", name: "Double Dragon & Boba", description: "Two pieces beef burger, fries, and your choice of drink: Milk Tea/Mojito/Fresh Fruit Juice. Extra sauce", price: 1500, calories: 1050, tags: ["beef", "double", "combo", "boba"], isCombo: true },
          { id: 12, sku: "COM-ELCHICO", name: "El Chico & Your Drink", description: "El Chico, fries, and your choice of drink: Milk Tea/Mojito/Fresh Fruit Juice. Extra saucy", price: 1350, calories: 920, tags: ["beef", "combo", "cheese"], isCombo: true },
          { id: 13, sku: "COM-CHK-CLASSIC", name: "Classic Burger & Drink", description: "Classic chicken burger, fries, and your choice of drink: Milk Tea/Mojito/Fresh Fruit Juice. Extra sauce", price: 1250, calories: 800, tags: ["chicken", "combo"], isCombo: true },
          { id: 14, sku: "COM-CHK-SPICY", name: "Spicy Chicken Burger Combo", description: "Spicy chicken burger with drink made from quality ingredients and fresh taste.", price: 1250, calories: 780, tags: ["chicken", "spicy", "combo"], isCombo: true },
          { id: 15, sku: "COM-CHK-DOUBLE", name: "Double Dragon Combo", description: "Two pieces beef burger, fries, and your choice of drink: Milk Tea/Mojito/Fresh Fruit Juice. Extra saucy", price: 1500, calories: 1020, tags: ["beef", "double", "combo"], isCombo: true },
          { id: 16, sku: "COM-CHK-CHEESY", name: "Cheesy Burger Combo", description: "Chicken burger with lots of cheese. Fries, 350ml soda. Chilli/Mayo. Your drink of choice", price: 1250, calories: 830, tags: ["chicken", "cheese", "combo"], isCombo: true },
        ]
      }
    ]
  },
  {
    slug: "chicken-pieces",
    name: "Chicken Pieces & Value Packs",
    description: "Crunch first. Talk later.",
    heroPhrase: "Crispy Outside. Legendary Inside.",
    items: [
      { id: 17, sku: "CHK-2PC", name: "2 Piecer", description: "1 Wing, 1 drumstick", price: 350, calories: 320, tags: ["chicken", "wings", "drumstick"] },
      { id: 18, sku: "CHK-3PC", name: "3 Piecer", description: "1 drumstick, 2 wings, fries", price: 470, calories: 520, tags: ["chicken", "fries", "value"] },
      { id: 19, sku: "CHK-6PC", name: "6 Piecer", description: "3 drumsticks, 3 wings, fries", price: 1100, calories: 980, tags: ["chicken", "fries", "family"] },
      { id: 20, sku: "CHK-9PC", name: "9 Piecer", description: "4 drumsticks, 5 wings, fries", price: 1500, calories: 1350, tags: ["chicken", "fries", "party"] },
      { id: 21, sku: "CHK-12PC", name: "12 Piecer", description: "5 drumsticks, 7 wings, fries", price: 1950, calories: 1800, tags: ["chicken", "fries", "large"] },
      { id: 22, sku: "VP-2PC", name: "Value Pack 2 Piecer", description: "1 drumstick, 1 wing, fries and extra sauce. 300ml soda", price: 500, calories: 580, tags: ["chicken", "value", "soda"], isCombo: true },
      { id: 23, sku: "VP-3PC", name: "Value Pack 3 Piecer", description: "1 drumstick, 2 wings, fries and extra sauce. 300ml soda", price: 750, calories: 720, tags: ["chicken", "value", "soda"], isCombo: true },
    ]
  },
  {
    slug: "strips-wraps",
    name: "Strips & Wraps",
    description: "Tender strips. Perfect wraps.",
    heroPhrase: "Wrapped in Flavor.",
    items: [
      { id: 24, sku: "STR-2", name: "2 Strips", description: "2 strips and sauce", price: 500, calories: 280, tags: ["chicken", "strips"] },
      { id: 25, sku: "STR-4", name: "4 Strips", description: "4 strips and sauce", price: 750, calories: 480, tags: ["chicken", "strips"] },
      { id: 26, sku: "STR-6", name: "6 Strips", description: "6 strips and sauce", price: 900, calories: 650, tags: ["chicken", "strips"] },
      { id: 27, sku: "STR-8-PACK", name: "8 Strips Pack", description: "Fries, sauce, 3 x 300ml soda and 8 strips", price: 1100, calories: 1100, tags: ["chicken", "strips", "fries", "soda"], isCombo: true },
      { id: 28, sku: "WRP-COMBO", name: "Chicken Wrap Combo", description: "Chicken wraps, 300ml soda and fries", price: 900, calories: 620, tags: ["chicken", "wrap", "combo"], isCombo: true },
      { id: 29, sku: "WRP-ONLY", name: "Wrap Only", description: "Crispy chicken wraps", price: 500, calories: 380, tags: ["chicken", "wrap"] },
    ]
  },
  {
    slug: "street-packs",
    name: "Street Packs",
    description: "Value packs for the hungry warrior.",
    heroPhrase: "Fuel for the Streets.",
    items: [
      { id: 30, sku: "SP-3", name: "Street Pack 3", description: "3 Pieces Original Recipe, 1 Large Fries", price: 350, calories: 600, tags: ["original", "fries"] },
      { id: 31, sku: "SP-6", name: "Street Pack 6", description: "6 Pieces Original Recipe, 1 Large Fries, 1.25L cold soda", price: 750, calories: 1100, tags: ["original", "fries", "soda"], isCombo: true },
      { id: 32, sku: "SP-9", name: "Street Pack 9", description: "9 Pieces Original Recipe, 1 Large Fries, 1.25L cold soda", price: 1100, calories: 1500, tags: ["original", "fries", "soda"], isCombo: true },
      { id: 33, sku: "SP-12", name: "Street Pack 12", description: "12 Pieces Original Recipe, 1 Large Fries, 1.25L cold soda", price: 1500, calories: 1900, tags: ["original", "fries", "soda"], isCombo: true },
      { id: 34, sku: "SP-13", name: "Street Pack 13", description: "2 Pieces Original Recipe, 1 Large Fries", price: 1950, calories: 500, tags: ["original", "fries"] },
      { id: 35, sku: "SP-14", name: "Street Pack 14", description: "2 Pieces Original Recipe, 1 Large Fries, 350ml soda", price: 350, calories: 580, tags: ["original", "fries", "soda"], isCombo: true },
      { id: 36, sku: "SP-15", name: "Street Pack 15", description: "8 Pieces Original Recipe, 1 Large Fries, 1.25L cold soda", price: 470, calories: 1300, tags: ["original", "fries", "soda"], isCombo: true },
      { id: 37, sku: "SP-16", name: "Street Pack 16", description: "12 Pieces Original Recipe, 1 Large Fries, 4 Boba Teas", price: 1100, calories: 2000, tags: ["original", "fries", "boba"], isCombo: true },
      { id: 38, sku: "SP-17", name: "Street Pack 17", description: "12 Pieces Original Recipe, 1 Large Fries, 4 Boba Teas", price: 1500, calories: 2000, tags: ["original", "fries", "boba"], isCombo: true },
    ]
  },
  {
    slug: "taste-of-china",
    name: "Taste of China",
    description: "Authentic Chinese flavors.",
    heroPhrase: "Wok-Fired. Flavor-Driven.",
    subcategories: [
      {
        slug: "soups",
        name: "Soups",
        items: [
          { id: 39, sku: "CN-SOUP-SEAWEED", name: "Seaweed and Egg Soup", description: "紫菜蛋汤", price: 1280, calories: 180, tags: ["soup", "seafood", "egg"] },
          { id: 40, sku: "CN-SOUP-DAYLILY", name: "Daylily and Vermicelli Soup", description: "黄花菜粉丝汤", price: 680, calories: 150, tags: ["soup", "vegetarian"], isVegetarian: true },
          { id: 41, sku: "CN-SOUP-KELP", name: "Kelp and Rib Soup", description: "海带排骨汤", price: 680, calories: 220, tags: ["soup", "pork", "kelp"] },
        ]
      },
      {
        slug: "rice-noodles",
        name: "Rice & Noodles",
        items: [
          { id: 42, sku: "CN-NOODLE-RICE", name: "Stir-fried Rice Noodles", description: "炒米粉", price: 800, calories: 420, tags: ["noodles", "stir-fry"] },
          { id: 43, sku: "CN-RICE-EGG", name: "Fried Rice with Eggs", description: "炒饭", price: 800, calories: 450, tags: ["rice", "egg"] },
          { id: 44, sku: "CN-NOODLE-SOUP", name: "Noodle Soup", description: "汤面", price: 800, calories: 380, tags: ["noodles", "soup"] },
          { id: 45, sku: "CN-VEG-SHIITAKE", name: "Shiitake Mushroom and Bok Choy", description: "香菇油菜", price: 680, calories: 200, tags: ["vegetarian", "stir-fry"], isVegetarian: true },
        ]
      },
      {
        slug: "duck-chicken",
        name: "Duck & Chicken",
        items: [
          { id: 46, sku: "CN-CHK-FREERANGE", name: "Stir-fried Free-range Chicken", description: "炒土鸡", price: 1280, calories: 520, tags: ["chicken", "stir-fry"] },
          { id: 47, sku: "CN-CHK-SALT", name: "Salt Water Chicken", description: "盐水鸡", price: 1280, calories: 480, tags: ["chicken", "boiled"] },
          { id: 48, sku: "CN-CHK-GIBLETS", name: "Spicy-Sour Chicken Giblets", description: "酸辣鸡杂", price: 1280, calories: 350, tags: ["chicken", "spicy", "offal"], spiceLevel: 2 },
          { id: 49, sku: "CN-CHK-ROOSTER", name: "Spicy Rooster Stir-fry", description: "炒叫鸡公", price: 1280, calories: 530, tags: ["chicken", "spicy", "stir-fry"], spiceLevel: 2 },
          { id: 50, sku: "CN-DUCK", name: "Stir-fried Duck", description: "炒鸭子", price: 1880, calories: 580, tags: ["duck", "stir-fry"] },
        ]
      }
    ]
  },
  {
    slug: "chinese-vegetarian-meat",
    name: "Chinese Vegetarian, Beef & Pork",
    description: "From garden fresh to hearty meats.",
    heroPhrase: "Balance in Every Bite.",
    subcategories: [
      {
        slug: "vegetarian",
        name: "Vegetarian Dishes",
        items: [
          { id: 51, sku: "CN-VEG-POTATO-PEPPER", name: "Shredded Potatoes with Green Pepper", description: "尖椒土豆丝", price: 850, calories: 220, tags: ["vegetarian", "potato"], isVegetarian: true },
          { id: 52, sku: "CN-VEG-POTATO-SPICY", name: "Spicy Shredded Potatoes", description: "香辣土豆丝", price: 650, calories: 210, tags: ["vegetarian", "spicy", "potato"], isVegetarian: true, spiceLevel: 1 },
          { id: 53, sku: "CN-VEG-CAULIFLOWER", name: "Large Plate of Cauliflower", description: "大盆花菜", price: 650, calories: 180, tags: ["vegetarian", "cauliflower"], isVegetarian: true },
          { id: 54, sku: "CN-VEG-TOFU", name: "Tofu", description: "豆腐", price: 650, calories: 150, tags: ["vegetarian", "tofu"], isVegetarian: true },
          { id: 55, sku: "CN-VEG-SNOWPEAS", name: "Snow Peas with Bamboo Shoots", description: "荷兰豆炒青笋", price: 650, calories: 160, tags: ["vegetarian", "stir-fry"], isVegetarian: true },
          { id: 56, sku: "CN-VEG-EGGPLANT", name: "Braised Eggplant", description: "红烧茄子", price: 650, calories: 200, tags: ["vegetarian", "eggplant"], isVegetarian: true },
          { id: 57, sku: "CN-VEG-GREENBEANS", name: "Stir-fried Green Beans", description: "炒兰豆", price: 650, calories: 170, tags: ["vegetarian", "green beans"], isVegetarian: true },
          { id: 58, sku: "CN-VEG-TOMATO-EGG", name: "Tomato and Egg Stir-fry", description: "西红柿炒鸡蛋", price: 650, calories: 250, tags: ["vegetarian", "egg", "tomato"], isVegetarian: true },
          { id: 59, sku: "CN-VEG-CHIVES-EGG", name: "Stir-fried Chives with Egg", description: "韭菜鸡蛋", price: 650, calories: 240, tags: ["vegetarian", "egg", "chives"], isVegetarian: true },
        ]
      },
      {
        slug: "beef-pork",
        name: "Beef & Pork Dishes",
        items: [
          { id: 60, sku: "CN-GOAT", name: "Stir-fried Black Goat", description: "生炒黑山羊", price: 2650, calories: 620, tags: ["goat", "stir-fry"] },
          { id: 61, sku: "CN-BEEF", name: "Stir-fried Beef", description: "炒牛肉", price: 1280, calories: 480, tags: ["beef", "stir-fry"] },
          { id: 62, sku: "CN-BEEF-RIBS", name: "Braised Beef Ribs", description: "红烧牛排", price: 1480, calories: 520, tags: ["beef", "braised", "ribs"] },
          { id: 63, sku: "CN-LAMB-CHOPS", name: "Braised Lamb Chops", description: "红烧羊排", price: 1280, calories: 500, tags: ["lamb", "braised"] },
          { id: 64, sku: "CN-BEEF-BRAISED", name: "Braised Beef", description: "卤牛肉", price: 850, calories: 380, tags: ["beef", "braised"] },
          { id: 65, sku: "CN-BEEF-TRIPE", name: "Stir-fried Beef Tripe", description: "炒牛肚", price: 850, calories: 320, tags: ["beef", "offal", "stir-fry"] },
          { id: 66, sku: "CN-PORK-BAMBOO", name: "Stir-fried Bamboo Shoots with Cured Meat", description: "干笋炒腊肉", price: 1280, calories: 450, tags: ["pork", "bamboo", "stir-fry"] },
        ]
      },
      {
        slug: "cold-dishes",
        name: "Cold Dishes",
        items: [
          { id: 67, sku: "CN-COLD-KELP", name: "Cold Dressed Kelp", description: "凉拌海带", price: 180, calories: 80, tags: ["cold", "kelp", "appetizer"] },
          { id: 68, sku: "CN-COLD-CUCUMBER", name: "Cold Cucumber Salad", description: "凉拌黄瓜", price: 180, calories: 60, tags: ["cold", "cucumber", "appetizer"], isVegetarian: true },
          { id: 69, sku: "CN-COLD-EGG", name: "Century Egg Salad", description: "凉拌皮蛋", price: 180, calories: 120, tags: ["cold", "egg", "appetizer"] },
          { id: 70, sku: "CN-COLD-TOMATO", name: "Cold Tomato Salad", description: "凉拌西红柿", price: 180, calories: 70, tags: ["cold", "tomato", "appetizer"], isVegetarian: true },
        ]
      }
    ]
  },
  {
    slug: "chinese-seafood",
    name: "Chinese Seafood & Specials",
    description: "Wok-fired mastery from the East.",
    heroPhrase: "Ocean Treasures.",
    items: [
      { id: 71, sku: "CN-FISH-BRAISE", name: "Braised Fish", description: "Whole fish slow-braised in rich soy sauce with ginger, garlic, scallions, and aromatic spices.", price: 1280, calories: 420, tags: ["fish", "braised", "seafood"] },
      { id: 72, sku: "CN-SHRIMP-GARLIC", name: "Garlic Shrimp", description: "Juicy shrimp sautéed in fragrant garlic, butter, and soy, finished with spring onions and a savory glaze.", price: 1280, calories: 380, tags: ["shrimp", "garlic", "seafood"] },
      { id: 73, sku: "CN-FISH-PEPPER", name: "Stir-fried Fish with Green Peppers", description: "Tender fish fillets wok-fried with crisp green peppers, garlic, soy sauce, and a light chili kick.", price: 1280, calories: 350, tags: ["fish", "stir-fry", "seafood", "spicy"], spiceLevel: 1 },
    ]
  },
  {
    slug: "african",
    name: "African Dishes",
    description: "Hearty, home-style African comfort.",
    heroPhrase: "Culture You Can Taste.",
    items: [
      { id: 74, sku: "AF-UGALI-FISH", name: "Ugali with Fish & Vegetables", description: "Ugali served with fish and vegetables", price: 850, calories: 600, tags: ["ugali", "fish", "vegetables"] },
      { id: 75, sku: "AF-UGALI-BEEF", name: "Ugali with Beef & Vegetables", description: "Ugali served with beef and vegetables", price: 850, calories: 620, tags: ["ugali", "beef", "vegetables"] },
      { id: 76, sku: "AF-CURRY-CHK", name: "Chicken Curry & Rice", description: "Chicken curry served with rice", price: 850, calories: 580, tags: ["chicken", "curry", "rice"] },
      { id: 77, sku: "AF-CHAPATI-BEEF", name: "Chapati with Beef & Vegetables", description: "Chapati served with beef and vegetables", price: 850, calories: 550, tags: ["chapati", "beef", "vegetables"] },
      { id: 78, sku: "AF-AROSTA", name: "Arosta", description: "African roasted meat dish", price: 850, calories: 520, tags: ["roast", "meat", "african"] },
      { id: 79, sku: "AF-MANDI", name: "Chicken Mandi Rice", description: "Fragrant rice with spiced chicken", price: 850, calories: 640, tags: ["chicken", "rice", "mandi"] },
    ]
  },
  {
    slug: "snacks-breakfast",
    name: "Snacks & Breakfast",
    description: "Quick bites to start your day.",
    heroPhrase: "Morning Fuel.",
    items: [
      { id: 80, sku: "SNK-CHIPS", name: "Chippitz", description: "Crispy potato chips", price: 100, calories: 150, tags: ["snack", "chips"] },
      { id: 81, sku: "SNK-HANDLEZI", name: "Handlezi", description: "Traditional snack", price: 100, calories: 120, tags: ["snack", "traditional"] },
      { id: 82, sku: "SNK-PANCAKE", name: "Pancake", description: "Soft breakfast pancake", price: 100, calories: 200, tags: ["breakfast", "pancake"] },
      { id: 83, sku: "SNK-SAMOSA", name: "Samosa", description: "Spiced pastry filled with vegetables or meat", price: 100, calories: 180, tags: ["snack", "pastry"] },
      { id: 84, sku: "SNK-SANDWICH", name: "Sandwich", description: "Fresh sandwich with filling of choice", price: 700, calories: 320, tags: ["breakfast", "sandwich"] },
    ]
  },
  {
    slug: "milk-teas-coffee",
    name: "Milk Teas & Coffee",
    description: "Refresh. Recharge. Repeat.",
    heroPhrase: "Sip the Legend.",
    subcategories: [
      {
        slug: "milk-teas",
        name: "Milk Teas",
        items: [
          { id: 85, sku: "DR-MT-VANILLA", name: "Vanilla Milk Tea", description: "", price: 380, calories: 220, tags: ["milk tea", "vanilla"] },
          { id: 86, sku: "DR-MT-MELON", name: "Hami Melon Milk Tea", description: "", price: 380, calories: 210, tags: ["milk tea", "melon"] },
          { id: 87, sku: "DR-MT-KUMQUAT", name: "Kumquat Milk Tea", description: "", price: 380, calories: 200, tags: ["milk tea", "citrus"] },
          { id: 88, sku: "DR-MT-STRAWBERRY", name: "Strawberry Milk Tea", description: "", price: 380, calories: 230, tags: ["milk tea", "strawberry"] },
          { id: 89, sku: "DR-MT-PEARL", name: "Pearl Milk Tea", description: "", price: 380, calories: 250, tags: ["milk tea", "boba"] },
          { id: 90, sku: "DR-MT-REDBEAN", name: "Red Bean Milk Tea", description: "", price: 380, calories: 240, tags: ["milk tea", "red bean"] },
          { id: 91, sku: "DR-MT-BUBBLE", name: "Bubble Milk Tea", description: "", price: 380, calories: 260, tags: ["milk tea", "bubble"] },
          { id: 92, sku: "DR-MT-CHOCOLATE", name: "Chocolate Milk Tea", description: "", price: 380, calories: 280, tags: ["milk tea", "chocolate"] },
          { id: 93, sku: "DR-MT-BLUEBERRY", name: "Blueberry Milk Tea", description: "", price: 380, calories: 220, tags: ["milk tea", "blueberry"] },
          { id: 94, sku: "DR-MT-PINEAPPLE", name: "Pineapple Milk Tea", description: "", price: 380, calories: 210, tags: ["milk tea", "pineapple"] },
          { id: 95, sku: "DR-MT-BOBA", name: "Boba Milk Tea", description: "", price: 380, calories: 250, tags: ["milk tea", "boba"] },
        ]
      },
      {
        slug: "teas",
        name: "Teas",
        items: [
          { id: 96, sku: "DR-TEA-BLACK", name: "Black Tea", description: "", price: 150, calories: 5, tags: ["tea", "hot"] },
          { id: 97, sku: "DR-TEA-GREEN", name: "Green Tea", description: "", price: 150, calories: 5, tags: ["tea", "hot"] },
          { id: 98, sku: "DR-TEA-MILK", name: "Milk Tea (Plain)", description: "", price: 200, calories: 180, tags: ["milk tea", "plain"] },
        ]
      },
      {
        slug: "coffee",
        name: "Coffee",
        items: [
          { id: 99, sku: "DR-CF-ESPRESSO", name: "Espresso", description: "", price: 200, priceSmall: 200, priceLarge: 250, calories: 10, tags: ["coffee", "espresso"] },
          { id: 100, sku: "DR-CF-FLATWHITE", name: "Flat White", description: "", price: 200, priceSmall: 200, priceLarge: 250, calories: 120, tags: ["coffee", "milky"] },
          { id: 101, sku: "DR-CF-AFFOGATO", name: "Affogato", description: "", price: 250, priceSmall: 250, priceLarge: 300, calories: 180, tags: ["coffee", "dessert"] },
          { id: 102, sku: "DR-CF-AMERICANO", name: "Americano", description: "", price: 230, priceSmall: 230, priceLarge: 270, calories: 15, tags: ["coffee", "black"] },
          { id: 103, sku: "DR-CF-ICED-AMERICANO", name: "Iced Americano", description: "", price: 250, priceSmall: 250, priceLarge: 300, calories: 15, tags: ["coffee", "iced"] },
          { id: 104, sku: "DR-CF-LATTE", name: "Latte", description: "", price: 220, priceSmall: 220, priceLarge: 250, calories: 150, tags: ["coffee", "milky"] },
          { id: 105, sku: "DR-CF-CAPPUCCINO", name: "Cappuccino", description: "", price: 230, priceSmall: 230, priceLarge: 250, calories: 130, tags: ["coffee", "foamy"] },
          { id: 106, sku: "DR-CF-ICED-CAPPUCCINO", name: "Iced Cappuccino", description: "", price: 250, priceSmall: 250, priceLarge: 300, calories: 140, tags: ["coffee", "iced"] },
          { id: 107, sku: "DR-CF-DAWA", name: "Dawa", description: "", price: 250, calories: 160, tags: ["coffee", "special"] },
          { id: 108, sku: "DR-CF-ICED-LATTE", name: "Iced Latte", description: "", price: 300, calories: 160, tags: ["coffee", "iced"] },
          { id: 109, sku: "DR-CF-ICED-DAWA", name: "Iced Dawa", description: "", price: 250, priceSmall: 250, priceLarge: 300, calories: 170, tags: ["coffee", "iced", "special"] },
          { id: 110, sku: "DR-CF-MOCHA", name: "Mocha", description: "", price: 300, calories: 220, tags: ["coffee", "chocolate"] },
          { id: 111, sku: "DR-CF-ICED-MOCHA", name: "Iced Mocha", description: "", price: 300, priceSmall: 300, priceLarge: 350, calories: 230, tags: ["coffee", "iced", "chocolate"] },
          { id: 112, sku: "DR-CF-MACCHIATO", name: "Macchiato", description: "", price: 350, priceSmall: 350, priceLarge: 400, calories: 100, tags: ["coffee", "strong"] },
        ]
      }
    ]
  },
  {
    slug: "shakes-mojito",
    name: "Shakes & Mojito",
    description: "Cool refreshments and indulgent shakes.",
    heroPhrase: "Shake It Up.",
    items: [
      { id: 113, sku: "DR-HOT-CHOC", name: "Hot Chocolate", description: "", price: 300, calories: 280, tags: ["hot", "chocolate"] },
      { id: 114, sku: "DR-MOJ-CLASSIC", name: "Classic Mojito", description: "", price: 400, calories: 180, tags: ["mojito", "mint"] },
      { id: 115, sku: "DR-MOJ-BLUEHAWAII", name: "Blue Hawaii Mojito", description: "", price: 400, calories: 190, tags: ["mojito", "tropical"] },
      { id: 116, sku: "DR-MOJ-FROZEN", name: "Frozen Fruit Mojito", description: "", price: 400, calories: 200, tags: ["mojito", "frozen"] },
      { id: 117, sku: "DR-MOJ-STRAWBERRY", name: "Strawberry Mojito", description: "", price: 400, calories: 210, tags: ["mojito", "strawberry"] },
      { id: 118, sku: "DR-MOJ-PASSION", name: "Passion Mojito", description: "", price: 400, calories: 190, tags: ["mojito", "passion fruit"] },
      { id: 119, sku: "DR-SHK-AMOCAPO", name: "Amocapo Shake", description: "", price: 450, calories: 320, tags: ["shake", "coffee"] },
      { id: 120, sku: "DR-SHK-ESPRESSO", name: "Espresso Shake", description: "", price: 450, calories: 300, tags: ["shake", "coffee"] },
      { id: 121, sku: "DR-SHK-STRAWBERRY", name: "Strawberry Shake", description: "", price: 450, calories: 280, tags: ["shake", "strawberry"] },
      { id: 122, sku: "DR-SHK-CHOCOLATE", name: "Chocolate Shake", description: "", price: 450, calories: 350, tags: ["shake", "chocolate"] },
      { id: 123, sku: "DR-SHK-OREO", name: "Oreo Shake", description: "", price: 450, calories: 380, tags: ["shake", "oreo"] },
      { id: 124, sku: "DR-SHK-CARAMEL", name: "Caramel Shake", description: "", price: 450, calories: 340, tags: ["shake", "caramel"] },
      { id: 125, sku: "DR-SHK-BLUEBERRY", name: "Blueberry Shake", description: "", price: 450, calories: 260, tags: ["shake", "blueberry"] },
      { id: 126, sku: "DR-SHK-BANANA", name: "Banana Shake", description: "", price: 450, calories: 290, tags: ["shake", "banana"] },
      { id: 127, sku: "DR-SHK-MANGO", name: "Mango Shake", description: "", price: 450, calories: 270, tags: ["shake", "mango"] },
    ]
  },
  {
    slug: "juices-lemonade",
    name: "Fresh Fruit Juices & Lemonade",
    description: "Freshly squeezed goodness.",
    heroPhrase: "Nature's Best.",
    subcategories: [
      {
        slug: "lemonades",
        name: "Lemonades",
        items: [
          { id: 128, sku: "DR-LEM-STRAWBERRY", name: "Strawberry Lemonade", description: "", price: 350, calories: 140, tags: ["lemonade", "strawberry"] },
          { id: 129, sku: "DR-LEM-PASSION", name: "Passion Lemonade", description: "", price: 350, calories: 130, tags: ["lemonade", "passion fruit"] },
          { id: 130, sku: "DR-LEM-CLASSIC", name: "Classic Lemonade", description: "", price: 350, calories: 120, tags: ["lemonade", "classic"] },
          { id: 131, sku: "DR-LEM-BLUEBERRY", name: "Blueberry Lemonade", description: "", price: 350, calories: 135, tags: ["lemonade", "blueberry"] },
        ]
      },
      {
        slug: "fresh-juices",
        name: "Fresh Fruit Juices",
        items: [
          { id: 132, sku: "DR-JC-WATERMELON", name: "Watermelon Juice", description: "", price: 300, calories: 110, tags: ["juice", "watermelon"] },
          { id: 133, sku: "DR-JC-ORANGE", name: "Fresh Orange Juice", description: "", price: 300, calories: 120, tags: ["juice", "orange"] },
          { id: 134, sku: "DR-JC-MANGO", name: "Mango Juice", description: "", price: 300, calories: 130, tags: ["juice", "mango"] },
          { id: 135, sku: "DR-JC-APPLE", name: "Apple Juice", description: "", price: 300, calories: 115, tags: ["juice", "apple"] },
          { id: 136, sku: "DR-JC-PINEAPPLE-MINT", name: "Pineapple Mint Juice", description: "", price: 300, calories: 125, tags: ["juice", "pineapple", "mint"] },
          { id: 137, sku: "DR-JC-PINEAPPLE", name: "Pineapple Juice", description: "", price: 300, calories: 125, tags: ["juice", "pineapple"] },
          { id: 138, sku: "DR-JC-AVOCADO", name: "Avocado Juice", description: "", price: 300, calories: 200, tags: ["juice", "avocado"] },
        ]
      }
    ]
  },
  {
    slug: "salads-sauces",
    name: "Salads & Sauces",
    description: "Fresh and flavorful sides.",
    heroPhrase: "Garden Fresh.",
    items: [
      { id: 139, sku: "SLD-FRUIT", name: "Fresh Fruit Salad", description: "Flavorful and Healthy, seasonal fruits", price: 550, calories: 180, tags: ["salad", "fruit", "healthy"], isVegetarian: true },
      { id: 140, sku: "SLD-CORN", name: "Corn Salad / Mexican Salad", description: "Corn or Mexican salads, your choice", price: 550, calories: 220, tags: ["salad", "corn", "mexican"], isVegetarian: true },
      { id: 141, sku: "SLD-CHICKEN", name: "Chicken Salad", description: "Tender and juicy chicken breasts with light and flavorful salads.", price: 600, calories: 320, tags: ["salad", "chicken", "healthy"] },
    ]
  },
  {
    slug: "ice-cream",
    name: "Ice Cream",
    description: "Sweet frozen treats.",
    heroPhrase: "Scoop of Joy.",
    items: [
      { id: 142, sku: "IC-STRAWBERRY", name: "Strawberry Ice Cream Scoop", description: "", price: 150, calories: 120, tags: ["ice cream", "strawberry"] },
      { id: 143, sku: "IC-VANILLA", name: "Vanilla Ice Cream Scoop", description: "", price: 150, calories: 130, tags: ["ice cream", "vanilla"] },
      { id: 144, sku: "IC-CARAMEL", name: "Caramel Ice Cream Scoop", description: "", price: 150, calories: 140, tags: ["ice cream", "caramel"] },
      { id: 145, sku: "IC-CHOCOLATE", name: "Chocolate Ice Cream Scoop", description: "", price: 150, calories: 150, tags: ["ice cream", "chocolate"] },
      { id: 146, sku: "IC-BLUEBERRY", name: "Blueberry Ice Cream Scoop", description: "", price: 150, calories: 125, tags: ["ice cream", "blueberry"] },
    ]
  }
];

// Helper function to get all items from a category (including subcategories)
export function getAllItemsFromCategory(category: MenuCategory): MenuItem[] {
  if (category.items) {
    return category.items;
  }
  if (category.subcategories) {
    return category.subcategories.flatMap(sub => sub.items);
  }
  return [];
}

// Helper function to find an item by ID across all categories
export function findItemById(id: number): MenuItem | undefined {
  for (const category of menuCategories) {
    const items = getAllItemsFromCategory(category);
    const item = items.find(i => i.id === id);
    if (item) return item;
  }
  return undefined;
}
