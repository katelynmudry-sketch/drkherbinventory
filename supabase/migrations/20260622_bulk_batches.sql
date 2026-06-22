-- ============================================================
-- Migration: bulk_batches table
-- Tracks individual raw bulk-herb lots as they arrive in stock.
-- batch_number format: {ABBREV}-BLK-{YEAR}-{SEQ3}  e.g. PEP-BLK-2026-001
-- Mirrors the tincture_batches pattern (20260313_tincture_batches.sql).
-- ============================================================

CREATE TABLE public.bulk_batches (
  id            UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id       UUID NOT NULL,
  herb_id       UUID NOT NULL REFERENCES public.herbs(id) ON DELETE CASCADE,
  batch_number  TEXT NOT NULL,
  received_date DATE NOT NULL DEFAULT CURRENT_DATE,
  status        TEXT NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'depleted')),
  notes         TEXT,
  created_at    TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at    TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),

  UNIQUE (user_id, batch_number)
);

-- Only one available lot per herb per user
CREATE UNIQUE INDEX bulk_batches_one_available_per_herb
  ON public.bulk_batches (user_id, herb_id)
  WHERE status = 'available';

-- Index for lookups by herb
CREATE INDEX bulk_batches_herb_id_idx
  ON public.bulk_batches (herb_id);

ALTER TABLE public.bulk_batches ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own bulk_batches"
  ON public.bulk_batches FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own bulk_batches"
  ON public.bulk_batches FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own bulk_batches"
  ON public.bulk_batches FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own bulk_batches"
  ON public.bulk_batches FOR DELETE USING (auth.uid() = user_id);

CREATE TRIGGER update_bulk_batches_updated_at
  BEFORE UPDATE ON public.bulk_batches
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

ALTER PUBLICATION supabase_realtime ADD TABLE public.bulk_batches;

-- ============================================================
-- DB function: generate next bulk lot batch number for a herb + year
-- Returns e.g. "PEP-BLK-2026-001"
-- ============================================================

CREATE OR REPLACE FUNCTION public.generate_bulk_batch_number(
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

  -- Count existing bulk lots for this herb+year to get next sequence number
  SELECT COALESCE(MAX(
    CAST(split_part(batch_number, '-', 4) AS INTEGER)
  ), 0) + 1
  INTO v_seq
  FROM public.bulk_batches
  WHERE user_id = p_user_id
    AND herb_id = p_herb_id
    AND batch_number LIKE (v_abbrev || '-BLK-' || p_year::TEXT || '-%');

  RETURN v_abbrev || '-BLK-' || p_year::TEXT || '-' || lpad(v_seq::TEXT, 3, '0');
END;
$$;

-- ============================================================
-- Link bulk lots to inventory (current lot per herb's bulk row)
-- and to tincture_batches (which lot fed a given tincture batch)
-- ============================================================

ALTER TABLE public.inventory
  ADD COLUMN IF NOT EXISTS current_bulk_batch_id UUID
    REFERENCES public.bulk_batches(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS inventory_current_bulk_batch_id_idx
  ON public.inventory (current_bulk_batch_id);

ALTER TABLE public.tincture_batches
  ADD COLUMN IF NOT EXISTS bulk_batch_id UUID
    REFERENCES public.bulk_batches(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS tincture_batches_bulk_batch_id_idx
  ON public.tincture_batches (bulk_batch_id);

-- ============================================================
-- Backfill: label all bulk stock that already exists today.
-- One 'available' lot per existing bulk inventory row, dated by
-- when that row was created (closest available approximation of
-- "received date" since no per-arrival history exists yet).
-- ============================================================

DO $$
DECLARE
  r RECORD;
  v_batch_number TEXT;
  v_new_id UUID;
BEGIN
  FOR r IN
    SELECT id, herb_id, user_id, created_at
    FROM public.inventory
    WHERE location = 'bulk'
      AND current_bulk_batch_id IS NULL
  LOOP
    v_batch_number := public.generate_bulk_batch_number(
      r.herb_id, r.user_id, EXTRACT(YEAR FROM r.created_at)::INTEGER
    );

    INSERT INTO public.bulk_batches (user_id, herb_id, batch_number, received_date, status)
    VALUES (r.user_id, r.herb_id, v_batch_number, r.created_at::DATE, 'available')
    RETURNING id INTO v_new_id;

    UPDATE public.inventory
    SET current_bulk_batch_id = v_new_id
    WHERE id = r.id;
  END LOOP;
END $$;
