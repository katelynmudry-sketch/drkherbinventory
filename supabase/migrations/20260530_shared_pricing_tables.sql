-- ============================================================
-- Shared pricing tables — admin-writable, world-readable
-- No user_id: these are pre-loaded reference data
-- ============================================================

CREATE TABLE public.shared_suppliers (
  id          UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name        TEXT NOT NULL,
  url         TEXT,
  notes       TEXT,
  created_at  TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at  TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.shared_suppliers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view shared suppliers"
  ON public.shared_suppliers FOR SELECT USING (true);

CREATE TRIGGER update_shared_suppliers_updated_at
  BEFORE UPDATE ON public.shared_suppliers
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


CREATE TABLE public.shared_herb_pricing (
  id                 UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  herb_name          TEXT NOT NULL,
  supplier_id        UUID NOT NULL REFERENCES public.shared_suppliers(id) ON DELETE CASCADE,
  price_per_lb       NUMERIC(10,4) NOT NULL,
  package_size_g     INTEGER,
  package_price      NUMERIC(10,2),
  supplier_item_code TEXT,
  supplier_item_name TEXT,
  notes              TEXT,
  last_updated       DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at         TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at         TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(herb_name, supplier_id)
);

ALTER TABLE public.shared_herb_pricing ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view shared herb pricing"
  ON public.shared_herb_pricing FOR SELECT USING (true);

CREATE TRIGGER update_shared_herb_pricing_updated_at
  BEFORE UPDATE ON public.shared_herb_pricing
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
