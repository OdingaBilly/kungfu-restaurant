
-- Profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  phone TEXT,
  email TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Addresses
CREATE TABLE public.addresses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  label TEXT,
  address TEXT NOT NULL,
  landmark TEXT,
  instructions TEXT,
  is_default BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.addresses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own addresses" ON public.addresses FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Orders (user_id nullable for guest checkout)
CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_email TEXT,
  delivery_address TEXT NOT NULL,
  landmark TEXT,
  instructions TEXT,
  payment_method TEXT NOT NULL,
  subtotal NUMERIC(10,2) NOT NULL,
  delivery_fee NUMERIC(10,2) NOT NULL DEFAULT 0,
  total NUMERIC(10,2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  items JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
-- Anyone (incl guests) can create an order; if logged in, user_id must match
CREATE POLICY "Anyone can create orders" ON public.orders FOR INSERT
  WITH CHECK (user_id IS NULL OR auth.uid() = user_id);
CREATE POLICY "Users view own orders" ON public.orders FOR SELECT
  USING (auth.uid() = user_id);

-- Favorites
CREATE TABLE public.favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  item_sku TEXT NOT NULL,
  item_name TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, item_sku)
);
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own favorites" ON public.favorites FOR ALL
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

CREATE TRIGGER profiles_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email, phone)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', ''),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'phone', '')
  );
  RETURN NEW;
END; $$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
