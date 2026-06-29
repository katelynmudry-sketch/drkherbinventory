-- ============================================================
-- Migration: backfill tincture_batches for tinctures pressed before
-- batch tracking existed (mirrors the bulk_batches backfill in
-- 20260622_bulk_batches.sql). Safe to re-run.
-- ============================================================

-- Fix the same abbreviation-collision bug found in generate_bulk_batch_number:
-- sequence counting was scoped to herb_id, but batch_number uniqueness is
-- per-user, so two herbs sharing a 3-letter abbreviation could collide.
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

  v_abbrev := upper(left(trim(v_herb_name), 3));

  SELECT COALESCE(MAX(
    CAST(split_part(batch_number, '-', 3) AS INTEGER)
  ), 0) + 1
  INTO v_seq
  FROM public.tincture_batches
  WHERE user_id = p_user_id
    AND batch_number LIKE (v_abbrev || '-' || p_year::TEXT || '-%');

  RETURN v_abbrev || '-' || p_year::TEXT || '-' || lpad(v_seq::TEXT, 3, '0');
END;
$$;

-- Macerating: herbs currently in the 'tincture' jar with no batch yet.
DO $$
DECLARE
  r RECORD;
  v_batch_number TEXT;
  v_new_id UUID;
BEGIN
  FOR r IN
    SELECT id, herb_id, user_id, COALESCE(tincture_started_at, created_at) AS started_at
    FROM public.inventory
    WHERE location = 'tincture'
      AND current_batch_id IS NULL
  LOOP
    -- Skip if this herb already has a live (macerating/active) batch
    IF EXISTS (
      SELECT 1 FROM public.tincture_batches
      WHERE herb_id = r.herb_id AND user_id = r.user_id AND status IN ('macerating', 'active')
    ) THEN
      CONTINUE;
    END IF;

    v_batch_number := public.generate_batch_number(
      r.herb_id, r.user_id, EXTRACT(YEAR FROM r.started_at)::INTEGER
    );

    INSERT INTO public.tincture_batches (user_id, herb_id, batch_number, batch_date, status)
    VALUES (r.user_id, r.herb_id, v_batch_number, r.started_at::DATE, 'macerating')
    RETURNING id INTO v_new_id;

    UPDATE public.inventory
    SET current_batch_id = v_new_id
    WHERE id = r.id;
  END LOOP;
END $$;

-- Pressed: herbs already in backstock/clinic with no batch reference yet.
DO $$
DECLARE
  r RECORD;
  v_batch_number TEXT;
  v_new_id UUID;
BEGIN
  FOR r IN
    SELECT herb_id, user_id, MIN(created_at) AS earliest_created_at
    FROM public.inventory
    WHERE location IN ('backstock', 'clinic')
      AND current_batch_id IS NULL
    GROUP BY herb_id, user_id
  LOOP
    -- Skip if this herb already has a live (macerating/active) batch
    IF EXISTS (
      SELECT 1 FROM public.tincture_batches
      WHERE herb_id = r.herb_id AND user_id = r.user_id AND status IN ('macerating', 'active')
    ) THEN
      CONTINUE;
    END IF;

    v_batch_number := public.generate_batch_number(
      r.herb_id, r.user_id, EXTRACT(YEAR FROM r.earliest_created_at)::INTEGER
    );

    INSERT INTO public.tincture_batches (user_id, herb_id, batch_number, batch_date, status, pressed_date)
    VALUES (r.user_id, r.herb_id, v_batch_number, r.earliest_created_at::DATE, 'active', r.earliest_created_at::DATE)
    RETURNING id INTO v_new_id;

    UPDATE public.inventory
    SET current_batch_id = v_new_id
    WHERE herb_id = r.herb_id
      AND user_id = r.user_id
      AND location IN ('backstock', 'clinic')
      AND current_batch_id IS NULL;
  END LOOP;
END $$;
