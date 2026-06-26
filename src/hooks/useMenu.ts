import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { MenuCategory, MenuItem, menuCategories as seedCategories } from "@/data/menuData";

interface DbCategory {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  hero_phrase: string | null;
  sort_order: number;
  upgrades: any;
  flavors: any;
}
interface DbSub {
  id: string;
  category_id: string;
  slug: string;
  name: string;
  sort_order: number;
}
interface DbItem {
  id: string;
  legacy_id: number | null;
  sku: string;
  name: string;
  price: number;
  price_small: number | null;
  price_large: number | null;
  description: string | null;
  calories: number | null;
  tags: string[];
  is_combo: boolean;
  is_vegetarian: boolean;
  is_featured: boolean;
  spice_level: number | null;
  image: string | null;
  is_available: boolean;
  category_id: string;
  subcategory_id: string | null;
  sort_order: number;
}

function mapItem(it: DbItem): MenuItem {
  return {
    id: it.legacy_id ?? 0,
    sku: it.sku,
    name: it.name,
    price: Number(it.price),
    priceSmall: it.price_small != null ? Number(it.price_small) : undefined,
    priceLarge: it.price_large != null ? Number(it.price_large) : undefined,
    description: it.description ?? "",
    calories: it.calories ?? undefined,
    tags: it.tags ?? [],
    isCombo: it.is_combo,
    isVegetarian: it.is_vegetarian,
    isFeatured: it.is_featured,
    spiceLevel: it.spice_level ?? undefined,
    image: it.image ?? undefined,
  };
}

export async function fetchMenuFromDb(includeUnavailable = false): Promise<MenuCategory[]> {
  const [{ data: cats }, { data: subs }, { data: items }] = await Promise.all([
    supabase.from("menu_categories").select("*").order("sort_order"),
    supabase.from("menu_subcategories").select("*").order("sort_order"),
    supabase.from("menu_items").select("*").order("sort_order"),
  ]);

  const categories = (cats ?? []) as DbCategory[];
  const subcategories = (subs ?? []) as DbSub[];
  const allItems = ((items ?? []) as DbItem[]).filter(
    (i) => includeUnavailable || i.is_available
  );

  return categories.map((cat) => {
    const catSubs = subcategories
      .filter((s) => s.category_id === cat.id)
      .sort((a, b) => a.sort_order - b.sort_order);
    const catItems = allItems.filter((i) => i.category_id === cat.id);

    const base: MenuCategory = {
      slug: cat.slug,
      name: cat.name,
      description: cat.description ?? "",
      heroPhrase: cat.hero_phrase ?? undefined,
      upgrades: Array.isArray(cat.upgrades) ? cat.upgrades : [],
      flavors: Array.isArray(cat.flavors) ? cat.flavors : [],
    };

    if (catSubs.length > 0) {
      base.subcategories = catSubs.map((sub) => ({
        slug: sub.slug,
        name: sub.name,
        items: catItems
          .filter((i) => i.subcategory_id === sub.id)
          .sort((a, b) => a.sort_order - b.sort_order)
          .map(mapItem),
      }));
      const looseItems = catItems.filter((i) => !i.subcategory_id);
      if (looseItems.length) base.items = looseItems.map(mapItem);
    } else {
      base.items = catItems
        .sort((a, b) => a.sort_order - b.sort_order)
        .map(mapItem);
    }
    return base;
  });
}

export function useMenu() {
  const query = useQuery({
    queryKey: ["menu"],
    queryFn: () => fetchMenuFromDb(false),
    staleTime: 1000 * 30,
  });
  return {
    ...query,
    categories: query.data && query.data.length > 0 ? query.data : seedCategories,
  };
}
