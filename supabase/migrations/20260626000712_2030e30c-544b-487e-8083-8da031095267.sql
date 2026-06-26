-- ========== ROLES ==========
CREATE TYPE public.app_role AS ENUM ('admin', 'manager', 'staff');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

CREATE OR REPLACE FUNCTION public.is_admin(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role IN ('admin','manager')
  )
$$;

CREATE POLICY "Users can view own roles" ON public.user_roles
  FOR SELECT TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "Admins manage roles" ON public.user_roles
  FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

-- ========== MENU CATEGORIES ==========
CREATE TABLE public.menu_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  name text NOT NULL,
  description text,
  hero_phrase text,
  sort_order int NOT NULL DEFAULT 0,
  upgrades jsonb NOT NULL DEFAULT '[]'::jsonb,
  flavors jsonb NOT NULL DEFAULT '[]'::jsonb,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.menu_categories TO anon, authenticated;
GRANT ALL ON public.menu_categories TO service_role;
GRANT INSERT, UPDATE, DELETE ON public.menu_categories TO authenticated;

ALTER TABLE public.menu_categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view categories" ON public.menu_categories FOR SELECT USING (true);
CREATE POLICY "Admins insert categories" ON public.menu_categories FOR INSERT TO authenticated WITH CHECK (public.is_admin(auth.uid()));
CREATE POLICY "Admins update categories" ON public.menu_categories FOR UPDATE TO authenticated USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));
CREATE POLICY "Admins delete categories" ON public.menu_categories FOR DELETE TO authenticated USING (public.is_admin(auth.uid()));

-- ========== MENU SUBCATEGORIES ==========
CREATE TABLE public.menu_subcategories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id uuid NOT NULL REFERENCES public.menu_categories(id) ON DELETE CASCADE,
  slug text NOT NULL,
  name text NOT NULL,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (category_id, slug)
);

GRANT SELECT ON public.menu_subcategories TO anon, authenticated;
GRANT ALL ON public.menu_subcategories TO service_role;
GRANT INSERT, UPDATE, DELETE ON public.menu_subcategories TO authenticated;

ALTER TABLE public.menu_subcategories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view subcategories" ON public.menu_subcategories FOR SELECT USING (true);
CREATE POLICY "Admins insert subcategories" ON public.menu_subcategories FOR INSERT TO authenticated WITH CHECK (public.is_admin(auth.uid()));
CREATE POLICY "Admins update subcategories" ON public.menu_subcategories FOR UPDATE TO authenticated USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));
CREATE POLICY "Admins delete subcategories" ON public.menu_subcategories FOR DELETE TO authenticated USING (public.is_admin(auth.uid()));

-- ========== MENU ITEMS ==========
CREATE TABLE public.menu_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  legacy_id int,
  sku text NOT NULL UNIQUE,
  name text NOT NULL,
  price numeric NOT NULL DEFAULT 0,
  price_small numeric,
  price_large numeric,
  description text,
  calories int,
  tags text[] NOT NULL DEFAULT '{}',
  is_combo boolean NOT NULL DEFAULT false,
  is_vegetarian boolean NOT NULL DEFAULT false,
  is_featured boolean NOT NULL DEFAULT false,
  spice_level int,
  image text,
  is_available boolean NOT NULL DEFAULT true,
  category_id uuid NOT NULL REFERENCES public.menu_categories(id) ON DELETE CASCADE,
  subcategory_id uuid REFERENCES public.menu_subcategories(id) ON DELETE SET NULL,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.menu_items TO anon, authenticated;
GRANT ALL ON public.menu_items TO service_role;
GRANT INSERT, UPDATE, DELETE ON public.menu_items TO authenticated;

ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view items" ON public.menu_items FOR SELECT USING (true);
CREATE POLICY "Admins insert items" ON public.menu_items FOR INSERT TO authenticated WITH CHECK (public.is_admin(auth.uid()));
CREATE POLICY "Admins update items" ON public.menu_items FOR UPDATE TO authenticated USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));
CREATE POLICY "Admins delete items" ON public.menu_items FOR DELETE TO authenticated USING (public.is_admin(auth.uid()));

-- ========== ORDERS: allow admins to view & update ==========
CREATE POLICY "Admins view all orders" ON public.orders FOR SELECT TO authenticated USING (public.is_admin(auth.uid()));
CREATE POLICY "Admins update orders" ON public.orders FOR UPDATE TO authenticated USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));

-- ========== updated_at triggers ==========
CREATE TRIGGER trg_menu_categories_updated BEFORE UPDATE ON public.menu_categories FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER trg_menu_subcategories_updated BEFORE UPDATE ON public.menu_subcategories FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER trg_menu_items_updated BEFORE UPDATE ON public.menu_items FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();