// Category-based image mapping for menu items
import burgerCombo from "@/assets/menu/burger-combo.jpg";
import doubleBurger from "@/assets/menu/double-burger.jpg";
import classicBurger from "@/assets/menu/classic-burger.jpg";
import friedChicken from "@/assets/menu/fried-chicken.jpg";
import chickenStrips from "@/assets/menu/chicken-strips.jpg";
import streetPack from "@/assets/menu/street-pack.jpg";
import chineseNoodles from "@/assets/menu/chinese-noodles.jpg";
import chineseFish from "@/assets/menu/chinese-fish.jpg";
import chineseVegetarian from "@/assets/menu/chinese-vegetarian.jpg";
import chapatiStew from "@/assets/menu/chapati-stew.jpg";
import ugaliFish from "@/assets/menu/ugali-fish.jpg";
import bobaTea from "@/assets/menu/boba-tea.png";
import coffee from "@/assets/menu/coffee.jpg";
import strawberryMojito from "@/assets/menu/strawberry-mojito.jpg";
import lemonade from "@/assets/menu/lemonade.jpg";
import milkshake from "@/assets/menu/milkshake.jpg";
import freshJuice from "@/assets/menu/fresh-juice.jpg";
import iceCream from "@/assets/menu/ice-cream.jpg";
import sandwich from "@/assets/menu/sandwich.jpg";
import snacks from "@/assets/menu/snacks.jpg";
import salad from "@/assets/menu/salad.jpg";

// New Chinese & specialty images
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

// Default images by category slug
export const categoryImages: Record<string, string> = {
  "burgers": classicBurger,
  "chicken-pieces": friedChicken,
  "strips-wraps": chickenStrips,
  "street-packs": streetPack,
  "taste-of-china": kungpaoNoodles,
  "chinese-vegetarian-meat": chineseVegetarian,
  "chinese-seafood": chineseFish,
  "african": chickenCurry,
  "snacks-breakfast": snacks,
  "milk-teas-coffee": taroBoba,
  "shakes-mojito": milkshake,
  "juices-lemonade": freshJuice,
  "salads-sauces": salad,
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
  
  // Strips and wraps
  if (categorySlug === "strips-wraps" || tagsLower.includes("strips") || tagsLower.includes("wrap")) {
    return chickenStrips;
  }
  
  // Street packs
  if (categorySlug === "street-packs") {
    return streetPack;
  }
  
  // Taste of China - Soups, Rice & Noodles, Duck & Chicken
  if (categorySlug === "taste-of-china") {
    // Soups
    if (tagsLower.includes("soup") || nameLower.includes("soup")) {
      return seaweedSoup;
    }
    // Rice & Noodles
    if (tagsLower.includes("noodles") || tagsLower.includes("rice") || nameLower.includes("noodle") || nameLower.includes("rice")) {
      return kungpaoNoodles;
    }
    // Duck & Chicken
    if (tagsLower.includes("duck") || tagsLower.includes("chicken") || nameLower.includes("duck") || nameLower.includes("chicken")) {
      return chineseChicken;
    }
    return kungpaoNoodles;
  }
  
  // Chinese vegetarian, beef & pork
  if (categorySlug === "chinese-vegetarian-meat") {
    // Cold dishes
    if (tagsLower.includes("cold") || tagsLower.includes("appetizer") || nameLower.includes("cold")) {
      return sichuanChicken;
    }
    // Vegetarian dishes
    if (tagsLower.includes("vegetarian") || tagsLower.includes("tofu") || tagsLower.includes("potato") || tagsLower.includes("eggplant")) {
      return chineseVegetarian;
    }
    // Beef & Pork dishes
    if (tagsLower.includes("beef") || tagsLower.includes("pork") || tagsLower.includes("lamb") || tagsLower.includes("goat")) {
      return sichuanChicken;
    }
    return chineseVegetarian;
  }
  
  // Chinese seafood & specials
  if (categorySlug === "chinese-seafood" || tagsLower.includes("seafood") || tagsLower.includes("fish") || tagsLower.includes("shrimp")) {
    return chineseFish;
  }
  
  // African dishes - use chicken curry as first/default
  if (categorySlug === "african") {
    if (nameLower.includes("ugali") && nameLower.includes("fish")) return ugaliFish;
    if (nameLower.includes("chapati")) return chapatiStew;
    if (nameLower.includes("curry") || nameLower.includes("mandi")) return chickenCurry;
    return chickenCurry;
  }
  
  // Drinks - Milk Teas & Coffee
  if (categorySlug === "milk-teas-coffee") {
    // Coffee drinks
    if (tagsLower.includes("coffee") || tagsLower.includes("espresso") || tagsLower.includes("latte") || tagsLower.includes("cappuccino") || tagsLower.includes("mocha") || tagsLower.includes("americano")) {
      return coffee;
    }
    // Specific milk tea flavors
    if (nameLower.includes("vanilla")) return vanillaTea;
    if (nameLower.includes("kumquat") || nameLower.includes("komquat")) return komquatTea;
    if (nameLower.includes("taro") || nameLower.includes("pearl") || nameLower.includes("bubble") || nameLower.includes("boba")) return taroBoba;
    // General milk tea
    if (tagsLower.includes("milk tea") || tagsLower.includes("boba") || tagsLower.includes("bubble")) {
      return taroBoba;
    }
    if (tagsLower.includes("tea")) return vanillaTea;
    return taroBoba;
  }
  
  // Shakes & Mojito
  if (categorySlug === "shakes-mojito") {
    if (tagsLower.includes("mojito") || nameLower.includes("mojito")) {
      return strawberryMojito;
    }
    if (tagsLower.includes("shake")) return milkshake;
    if (nameLower.includes("chocolate")) return milkshake;
    return milkshake;
  }
  
  // Juices & Lemonade
  if (categorySlug === "juices-lemonade") {
    if (tagsLower.includes("lemonade")) return lemonade;
    if (tagsLower.includes("juice")) return freshJuice;
    return freshJuice;
  }
  
  // Snacks & Breakfast
  if (categorySlug === "snacks-breakfast") {
    if (nameLower.includes("sandwich")) return sandwich;
    return snacks;
  }
  
  // Salads
  if (categorySlug === "salads-sauces" || tagsLower.includes("salad")) {
    return salad;
  }
  
  // Ice Cream
  if (categorySlug === "ice-cream" || tagsLower.includes("ice cream")) {
    return iceCream;
  }
  
  // Default to category image
  return categoryImages[categorySlug] || classicBurger;
}
