-- ============================================================
-- Ordering & Pricing Feature — 3 new tables
-- Run this in Supabase Dashboard > SQL Editor
-- ============================================================

-- 1. Suppliers table
CREATE TABLE public.suppliers (
  id          UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id     UUID NOT NULL,
  name        TEXT NOT NULL,
  url         TEXT,
  notes       TEXT,
  created_at  TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at  TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.suppliers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own suppliers"
  ON public.suppliers FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own suppliers"
  ON public.suppliers FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own suppliers"
  ON public.suppliers FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own suppliers"
  ON public.suppliers FOR DELETE USING (auth.uid() = user_id);

CREATE TRIGGER update_suppliers_updated_at
  BEFORE UPDATE ON public.suppliers
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


-- 2. Herb pricing table
CREATE TABLE public.herb_pricing (
  id                 UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id            UUID NOT NULL,
  herb_name          TEXT NOT NULL,
  supplier_id        UUID NOT NULL REFERENCES public.suppliers(id) ON DELETE CASCADE,
  price_per_lb       NUMERIC(10,4) NOT NULL,   -- always stored as $/lb
  package_size_g     INTEGER,                  -- NULL for PB (sold by lb); 250 or 500 for Clef
  package_price      NUMERIC(10,2),            -- actual package price for Clef
  supplier_item_code TEXT,
  supplier_item_name TEXT,
  notes              TEXT,
  last_updated       TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at         TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at         TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, herb_name, supplier_id)
);

ALTER TABLE public.herb_pricing ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own herb_pricing"
  ON public.herb_pricing FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own herb_pricing"
  ON public.herb_pricing FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own herb_pricing"
  ON public.herb_pricing FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own herb_pricing"
  ON public.herb_pricing FOR DELETE USING (auth.uid() = user_id);

CREATE TRIGGER update_herb_pricing_updated_at
  BEFORE UPDATE ON public.herb_pricing
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


-- 3. Herb reorder quantities table
CREATE TABLE public.herb_reorder_qty (
  id          UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id     UUID NOT NULL,
  herb_name   TEXT NOT NULL,
  quantity_lb NUMERIC(6,2) NOT NULL DEFAULT 1,
  created_at  TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at  TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, herb_name)
);

ALTER TABLE public.herb_reorder_qty ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own herb_reorder_qty"
  ON public.herb_reorder_qty FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own herb_reorder_qty"
  ON public.herb_reorder_qty FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own herb_reorder_qty"
  ON public.herb_reorder_qty FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own herb_reorder_qty"
  ON public.herb_reorder_qty FOR DELETE USING (auth.uid() = user_id);

CREATE TRIGGER update_herb_reorder_qty_updated_at
  BEFORE UPDATE ON public.herb_reorder_qty
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
