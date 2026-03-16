-- ============================================================
-- Migration: tincture_batches table
-- Tracks individual tincture maceration batches per herb.
-- batch_number format: {ABBREV}-{YEAR}-{SEQ3}  e.g. PEP-2026-001
-- ============================================================

CREATE TABLE public.tincture_batches (
  id                UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id           UUID NOT NULL,
  herb_id           UUID NOT NULL REFERENCES public.herbs(id) ON DELETE CASCADE,
  batch_number      TEXT NOT NULL,
  batch_date        DATE NOT NULL DEFAULT CURRENT_DATE,
  status            TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'archived')),
  notes             TEXT,
  -- Forward-compatible nullable FK for future bulk lot tracking:
  bulk_inventory_id UUID REFERENCES public.inventory(id) ON DELETE SET NULL,
  created_at        TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at        TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),

  UNIQUE (user_id, batch_number)
);

-- Only one active batch per herb per user
CREATE UNIQUE INDEX tincture_batches_one_active_per_herb
  ON public.tincture_batches (user_id, herb_id)
  WHERE status = 'active';

-- Index for lookups by herb
CREATE INDEX tincture_batches_herb_id_idx
  ON public.tincture_batches (herb_id);

ALTER TABLE public.tincture_batches ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own tincture_batches"
  ON public.tincture_batches FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own tincture_batches"
  ON public.tincture_batches FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own tincture_batches"
  ON public.tincture_batches FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own tincture_batches"
  ON public.tincture_batches FOR DELETE USING (auth.uid() = user_id);

CREATE TRIGGER update_tincture_batches_updated_at
  BEFORE UPDATE ON public.tincture_batches
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

ALTER PUBLICATION supabase_realtime ADD TABLE public.tincture_batches;

-- ============================================================
-- DB function: generate next batch number for a herb + year
-- Returns e.g. "PEP-2026-001"
-- ============================================================

CREATE OR REPLACE FUNCTION public.generate_batch_number(
  p_herb_id UUID,
  p_user_id UUID,
  p_year    INTEGER DEFAULT EXTRACT(YEAR FROM CURRENT_DATE)::INTEGER
)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_herb_name TEXT;
  v_abbrev    TEXT;
  v_seq       INTEGER;
BEGIN
  SELECT name INTO v_herb_name
  FROM public.herbs
  WHERE id = p_herb_id AND user_id = p_user_id;

  IF v_herb_name IS NULL THEN
    RAISE EXCEPTION 'Herb not found: %', p_herb_id;
  END IF;

  -- Abbreviation: first 3 chars of herb name, uppercased
  v_abbrev := upper(left(trim(v_herb_name), 3));

  -- Count existing batches for this herb+year to get next sequence number
  SELECT COALESCE(MAX(
    CAST(split_part(batch_number, '-', 3) AS INTEGER)
  ), 0) + 1
  INTO v_seq
  FROM public.tincture_batches
  WHERE user_id = p_user_id
    AND herb_id = p_herb_id
    AND batch_number LIKE (v_abbrev || '-' || p_year::TEXT || '-%');

  RETURN v_abbrev || '-' || p_year::TEXT || '-' || lpad(v_seq::TEXT, 3, '0');
END;
$$;
