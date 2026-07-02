import { MenuItem, MenuCategory, getAllItemsFromCategory, menuCategories } from "./menuData";

// Deterministic pseudo-random so every product has stable, unique-feeling data
function seedFrom(str: string): number {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

function pick<T>(seed: number, arr: T[]): T {
  return arr[seed % arr.length];
}

function inRange(seed: number, min: number, max: number): number {
  return min + (seed % (max - min + 1));
}

export interface Nutrient {
  label: string;
  grams: number;
  percent: number; // of visual bar
  color: string;
}

export function getNutrition(item: MenuItem): {
  calories: number;
  nutrients: Nutrient[];
} {
  const cal = item.calories ?? 600;
  // Rough macro split influenced by tags
  const isVeg = item.isVegetarian;
  const spicy = (item.spiceLevel ?? 0) > 1;
  const proteinPct = isVeg ? 0.18 : 0.3;
  const carbPct = 0.42;
  const fatPct = 1 - proteinPct - carbPct;

  const protein = Math.round((cal * proteinPct) / 4);
  const carbs = Math.round((cal * carbPct) / 4);
  const fat = Math.round((cal * fatPct) / 9);
  const fibre = Math.max(2, Math.round((item.tags?.includes("fries") ? 6 : 3) + (isVeg ? 4 : 0)));
  const sodium = inRange(seedFrom(item.sku + "na"), spicy ? 700 : 400, spicy ? 1200 : 900);

  const max = Math.max(protein, carbs, fat);
  return {
    calories: cal,
    nutrients: [
      { label: "Protein", grams: protein, percent: Math.round((protein / max) * 100), color: "hsl(var(--primary))" },
      { label: "Carbs", grams: carbs, percent: Math.round((carbs / max) * 100), color: "hsl(38 92% 50%)" },
      { label: "Fat", grams: fat, percent: Math.round((fat / max) * 100), color: "hsl(220 9% 46%)" },
      { label: "Fibre", grams: fibre, percent: Math.round((fibre / max) * 100), color: "hsl(142 71% 45%)" },
      { label: "Sodium", grams: sodium, percent: 100, color: "hsl(280 65% 60%)" },
    ],
  };
}

const HISTORY_INTROS = [
  "Born in the back-alley woks of night markets,",
  "A recipe smuggled down three generations of kitchen masters,",
  "First fried at dawn for the temple monks,",
  "Perfected during rainy-season street festivals,",
  "Legend says a wandering chef created this after a duel,",
];
const HISTORY_MIDS = [
  "this dish blends fire, patience and a whole lot of attitude.",
  "it earned its stripes by feeding hungry warriors between rounds.",
  "each batch carries the smoky soul of the open flame.",
  "it balances crunch and comfort the way only Panda knows.",
  "the marinade alone takes the discipline of a true black belt.",
];

export function getHistory(item: MenuItem, category: MenuCategory): string {
  const s = seedFrom(item.sku + category.slug);
  return `${pick(s, HISTORY_INTROS)} ${item.name} ${pick(s >> 3, HISTORY_MIDS)}`;
}

export interface ProcessStep {
  emoji: string;
  title: string;
  text: string;
}

export function getProcess(item: MenuItem): ProcessStep[] {
  const spicy = (item.spiceLevel ?? 0) > 1;
  return [
    { emoji: "🧺", title: "Sourced Fresh", text: "Ingredients hand-picked every morning from trusted local suppliers." },
    { emoji: "🔥", title: "Marinated", text: spicy ? "Bathed overnight in our signature chili-soy marinade." : "Rested overnight in our house marinade for deep flavour." },
    { emoji: "🥢", title: "Cooked to Order", text: "Fired in small batches the moment you tap Order — never pre-made." },
    { emoji: "📦", title: "Packed Hot", text: "Sealed steaming and rushed to you so the first bite hits perfect." },
  ];
}

export interface Community {
  rating: number;
  reviews: number;
  ordersThisWeek: number;
  reorderRate: number;
  distribution: number[]; // 5..1 stars percentages
}

export function getCommunity(item: MenuItem): Community {
  const s = seedFrom(item.sku + "community");
  const rating = Math.round((42 + (s % 8)) ) / 10; // 4.2 - 4.9
  const reviews = inRange(s >> 2, 48, 640);
  const ordersThisWeek = inRange(s >> 4, 60, 900);
  const reorderRate = inRange(s >> 5, 62, 94);
  const five = inRange(s, 62, 82);
  const four = inRange(s >> 1, 8, 20);
  const three = Math.max(2, Math.round((100 - five - four) * 0.6));
  const two = Math.max(1, Math.round((100 - five - four - three) * 0.6));
  const one = Math.max(0, 100 - five - four - three - two);
  return { rating, reviews, ordersThisWeek, reorderRate, distribution: [five, four, three, two, one] };
}

const PANDA_LINES = [
  "Panda says: dip it, don't sip it. Extra sauce is non-negotiable. 🐼",
  "Panda approved: pairs dangerously well with a cold drink. 🥤",
  "Trust Panda — order one size up, future-you will thank you. 💪",
  "Panda's move: share it, then regret sharing it. 😅",
  "Panda whispers: the spicy version separates warriors from tourists. 🔥",
];

export function getPandaSuggestion(item: MenuItem): string {
  return pick(seedFrom(item.sku + "panda"), PANDA_LINES);
}

// "What goes along with it" — pull complementary picks from other categories
export function getPairings(currentSku: string): MenuItem[] {
  const wanted = ["drinks", "sides", "desserts", "extras", "beverages"];
  const pool: MenuItem[] = [];
  for (const cat of menuCategories) {
    if (wanted.some((w) => cat.slug.includes(w))) {
      pool.push(...getAllItemsFromCategory(cat));
    }
  }
  const filtered = pool.filter((i) => i.sku !== currentSku);
  const source = filtered.length ? filtered : menuCategories.flatMap(getAllItemsFromCategory).filter((i) => i.sku !== currentSku);
  // Stable shuffle by seed
  const s = seedFrom(currentSku + "pair");
  return [...source].sort((a, b) => seedFrom(a.sku + s) - seedFrom(b.sku + s)).slice(0, 4);
}
