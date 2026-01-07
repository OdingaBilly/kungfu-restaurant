// Category-based image mapping for menu items
import burgerCombo from "@/assets/menu/burger-combo.jpg";
import doubleBurger from "@/assets/menu/double-burger.jpg";
import classicBurger from "@/assets/menu/classic-burger.jpg";
import friedChicken from "@/assets/menu/fried-chicken.jpg";
import chickenStrips from "@/assets/menu/chicken-strips.jpg";
import crispyStrips from "@/assets/menu/crispy-strips.jpg";
import streetPack from "@/assets/menu/street-pack.jpg";
import streetPackFull from "@/assets/menu/street-pack-full.jpg";
import chineseNoodles from "@/assets/menu/chinese-noodles.jpg";
import chineseFish from "@/assets/menu/chinese-fish.jpg";
import chineseFishSpicy from "@/assets/menu/chinese-fish-spicy.jpg";
import chapatiStew from "@/assets/menu/chapati-stew.jpg";
import ugaliFish from "@/assets/menu/ugali-fish.jpg";
import bobaTea from "@/assets/menu/boba-tea.png";
import coffee from "@/assets/menu/coffee.jpg";
import coffeeHot from "@/assets/menu/coffee-hot.jpg";
import coffeeLatte from "@/assets/menu/coffee-latte.jpg";
import icedCoffee from "@/assets/menu/iced-coffee.jpg";
import frappeCoffee from "@/assets/menu/frappe-coffee.jpg";
import strawberryMojito from "@/assets/menu/strawberry-mojito.jpg";
import lemonade from "@/assets/menu/lemonade.jpg";
import milkshake from "@/assets/menu/milkshake.jpg";
import freshJuice from "@/assets/menu/fresh-juice.jpg";
import iceCream from "@/assets/menu/ice-cream.jpg";
import sandwich from "@/assets/menu/sandwich.jpg";
import snacks from "@/assets/menu/snacks.jpg";
import salad from "@/assets/menu/salad.jpg";
import cornSalad from "@/assets/menu/corn-salad.jpg";
import fruitSalad from "@/assets/menu/fruit-salad.jpg";

// Snacks & Breakfast
import chapati from "@/assets/menu/chapati.jpg";
import mandazi from "@/assets/menu/mandazi.jpg";

// Chinese & specialty images
import seaweedSoup from "@/assets/menu/seaweed-soup.jpg";
import sichuanChicken from "@/assets/menu/sichuan-chicken.jpg";
import kungpaoNoodles from "@/assets/menu/kungpao-noodles.jpg";
import chineseChicken from "@/assets/menu/chinese-chicken.jpg";
import chickenCurry from "@/assets/menu/chicken-curry.jpg";
import taroBoba from "@/assets/menu/taro-boba.png";
import komquatTea from "@/assets/menu/komquat-tea.png";
import vanillaTea from "@/assets/menu/vanilla-tea.png";
import chicken2pc from "@/assets/menu/chicken-2pc.png";
import chicken3pc from "@/assets/menu/chicken-3pc.png";

// New vegetarian, beef/pork, seafood images
import braisedBeef from "@/assets/menu/braised-beef.jpg";
import vegetableStirFry from "@/assets/menu/vegetable-stir-fry.png";
import beefPeppers from "@/assets/menu/beef-peppers.jpg";
import snowPeas from "@/assets/menu/snow-peas.jpg";
import dumplings from "@/assets/menu/dumplings.jpg";
import eggFriedRice from "@/assets/menu/egg-fried-rice.jpg";
import crayfish from "@/assets/menu/crayfish.jpg";

// Default images by category slug
export const categoryImages: Record<string, string> = {
  "burgers": classicBurger,
  "chicken-pieces": friedChicken,
  "strips-wraps": crispyStrips,
  "street-packs": streetPackFull,
  "taste-of-china": kungpaoNoodles,
  "chinese-vegetarian-meat": vegetableStirFry,
  "chinese-seafood": chineseFishSpicy,
  "african": chickenCurry,
  "snacks-breakfast": mandazi,
  "milk-teas-coffee": coffeeLatte,
  "shakes-mojito": milkshake,
  "juices-lemonade": freshJuice,
  "salads-sauces": cornSalad,
  "ice-cream": iceCream,
};

// Item-specific image overrides based on keywords in name or tags
export function getItemImage(
  itemName: string, 
  categorySlug: string, 
  tags?: string[]
): string {
  const nameLower = itemName.toLowerCase();
  const tagsLower = tags?.map(t => t.toLowerCase()) || [];
  
  // Burger variations
  if (categorySlug === "burgers" || tagsLower.includes("burger")) {
    if (nameLower.includes("double") || nameLower.includes("dragon")) {
      return doubleBurger;
    }
    if (nameLower.includes("combo") || nameLower.includes("boba")) {
      return burgerCombo;
    }
    return classicBurger;
  }
  
  // Chicken pieces - use new images
  if (categorySlug === "chicken-pieces" || tagsLower.includes("drumstick") || tagsLower.includes("wings")) {
    if (nameLower.includes("2") || nameLower.includes("two")) {
      return chicken2pc;
    }
    if (nameLower.includes("3") || nameLower.includes("three")) {
      return chicken3pc;
    }
    return friedChicken;
  }
  
  // Strips and wraps - use crispy strips image
  if (categorySlug === "strips-wraps" || tagsLower.includes("strips") || tagsLower.includes("wrap")) {
    return crispyStrips;
  }
  
  // Street packs - use full street pack image
  if (categorySlug === "street-packs") {
    return streetPackFull;
  }
  
  // Taste of China - Soups, Rice & Noodles, Duck & Chicken
  if (categorySlug === "taste-of-china") {
    // Soups
    if (tagsLower.includes("soup") || nameLower.includes("soup")) {
      return seaweedSoup;
    }
    // Rice & Noodles - use egg fried rice
    if (tagsLower.includes("rice") || nameLower.includes("rice") || nameLower.includes("fried rice")) {
      return eggFriedRice;
    }
    if (tagsLower.includes("noodles") || nameLower.includes("noodle")) {
      return kungpaoNoodles;
    }
    // Duck & Chicken
    if (tagsLower.includes("duck") || tagsLower.includes("chicken") || nameLower.includes("duck") || nameLower.includes("chicken")) {
      return chineseChicken;
    }
    return kungpaoNoodles;
  }
  
  // Chinese vegetarian, beef & pork - EXTENSIVE UPDATES
  if (categorySlug === "chinese-vegetarian-meat") {
    // Cold dishes - use dumplings
    if (tagsLower.includes("cold") || tagsLower.includes("appetizer") || nameLower.includes("cold") || nameLower.includes("salad")) {
      return dumplings;
    }
    // Snow peas and green beans
    if (nameLower.includes("snow pea") || nameLower.includes("green bean") || nameLower.includes("兰豆") || nameLower.includes("荷兰豆")) {
      return snowPeas;
    }
    // Vegetarian dishes with vegetables
    if (tagsLower.includes("vegetarian") || tagsLower.includes("tofu") || tagsLower.includes("potato") || 
        tagsLower.includes("eggplant") || tagsLower.includes("cauliflower") || nameLower.includes("mushroom") ||
        nameLower.includes("bok choy") || nameLower.includes("油菜") || nameLower.includes("香菇")) {
      return vegetableStirFry;
    }
    // Tomato and egg
    if (nameLower.includes("tomato") || nameLower.includes("西红柿") || nameLower.includes("egg") || nameLower.includes("鸡蛋")) {
      return eggFriedRice;
    }
    // Beef & Pork dishes - use braised beef
    if (tagsLower.includes("beef") || nameLower.includes("beef") || nameLower.includes("牛")) {
      return braisedBeef;
    }
    // Pork and lamb - use beef peppers
    if (tagsLower.includes("pork") || tagsLower.includes("lamb") || tagsLower.includes("goat") || 
        nameLower.includes("pork") || nameLower.includes("lamb") || nameLower.includes("goat") ||
        nameLower.includes("羊") || nameLower.includes("猪") || nameLower.includes("腊肉")) {
      return beefPeppers;
    }
    // Stir-fry with peppers
    if (nameLower.includes("pepper") || nameLower.includes("椒") || nameLower.includes("stir")) {
      return beefPeppers;
    }
    return vegetableStirFry;
  }
  
  // Chinese seafood & specials - NEW IMAGES
  if (categorySlug === "chinese-seafood" || tagsLower.includes("seafood")) {
    // Shrimp or crayfish dishes
    if (tagsLower.includes("shrimp") || nameLower.includes("shrimp") || nameLower.includes("虾") || 
        nameLower.includes("crayfish") || nameLower.includes("prawn")) {
      return crayfish;
    }
    // Fish dishes
    if (tagsLower.includes("fish") || nameLower.includes("fish") || nameLower.includes("鱼")) {
      return chineseFishSpicy;
    }
    return crayfish;
  }
  
  // African dishes - use chicken curry as default
  if (categorySlug === "african") {
    if (nameLower.includes("ugali") && nameLower.includes("fish")) return ugaliFish;
    if (nameLower.includes("chapati")) return chapatiStew;
    if (nameLower.includes("curry") || nameLower.includes("mandi")) return chickenCurry;
    return chickenCurry;
  }
  
  // Drinks - Milk Teas & Coffee - IMPROVED MAPPING with new images
  if (categorySlug === "milk-teas-coffee") {
    // Iced coffee drinks
    if (nameLower.includes("iced") && (tagsLower.includes("coffee") || nameLower.includes("latte") || 
        nameLower.includes("americano") || nameLower.includes("cappuccino") || nameLower.includes("mocha") ||
        nameLower.includes("dawa"))) {
      return icedCoffee;
    }
    // Frappe, mocha, affogato - rich/dessert coffee
    if (nameLower.includes("affogato") || nameLower.includes("frappe") || 
        (nameLower.includes("mocha") && !nameLower.includes("iced"))) {
      return frappeCoffee;
    }
    // Hot lattes, cappuccino, flat white - milky coffee
    if (nameLower.includes("latte") || nameLower.includes("cappuccino") || nameLower.includes("flat white")) {
      return coffeeLatte;
    }
    // Espresso, americano, dawa, macchiato - strong/black coffee
    if (tagsLower.includes("coffee") || nameLower.includes("espresso") || nameLower.includes("americano") ||
        nameLower.includes("macchiato") || nameLower.includes("dawa")) {
      return coffeeHot;
    }
    // Specific milk tea flavors
    if (nameLower.includes("vanilla")) return vanillaTea;
    if (nameLower.includes("kumquat") || nameLower.includes("komquat")) return komquatTea;
    if (nameLower.includes("taro") || nameLower.includes("pearl") || nameLower.includes("bubble") || nameLower.includes("boba")) return taroBoba;
    // Plain tea
    if (tagsLower.includes("tea") && !tagsLower.includes("milk tea")) {
      return vanillaTea;
    }
    // General milk tea
    if (tagsLower.includes("milk tea") || tagsLower.includes("boba") || tagsLower.includes("bubble")) {
      return taroBoba;
    }
    return taroBoba;
  }
  
  // Shakes & Mojito
  if (categorySlug === "shakes-mojito") {
    if (tagsLower.includes("mojito") || nameLower.includes("mojito")) {
      return strawberryMojito;
    }
    if (tagsLower.includes("shake") || tagsLower.includes("chocolate") || nameLower.includes("shake")) {
      return milkshake;
    }
    return milkshake;
  }
  
  // Juices & Lemonade
  if (categorySlug === "juices-lemonade") {
    if (tagsLower.includes("lemonade") || nameLower.includes("lemonade")) return lemonade;
    if (tagsLower.includes("juice") || nameLower.includes("juice")) return freshJuice;
    return freshJuice;
  }
  
  // Snacks & Breakfast - use new images
  if (categorySlug === "snacks-breakfast") {
    if (nameLower.includes("chapati") || nameLower.includes("roti")) return chapati;
    if (nameLower.includes("mandazi") || nameLower.includes("doughnut")) return mandazi;
    if (nameLower.includes("samosa") || nameLower.includes("pastry")) return mandazi;
    if (nameLower.includes("sandwich")) return sandwich;
    return mandazi;
  }
  
  // Salads - use new images
  if (categorySlug === "salads-sauces" || tagsLower.includes("salad")) {
    if (nameLower.includes("fruit")) return fruitSalad;
    if (nameLower.includes("corn") || nameLower.includes("mexican")) return cornSalad;
    if (nameLower.includes("chicken")) return salad;
    return cornSalad;
  }
  
  // Ice Cream
  if (categorySlug === "ice-cream" || tagsLower.includes("ice cream")) {
    return iceCream;
  }
  
  // Default to category image
  return categoryImages[categorySlug] || classicBurger;
}
