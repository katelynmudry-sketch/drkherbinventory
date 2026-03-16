-- ============================================================
-- Migration: tincture batch pressing workflow
-- SAFE — additive only. No data is moved or deleted.
-- ============================================================

-- 1. Expand status CHECK to include 'macerating'
--    Drop the old constraint first (IF EXISTS = safe if it was never created)
ALTER TABLE public.tincture_batches
  DROP CONSTRAINT IF EXISTS tincture_batches_status_check;

ALTER TABLE public.tincture_batches
  ADD CONSTRAINT tincture_batches_status_check
  CHECK (status IN ('macerating', 'active', 'archived'));

-- 2. Add pressed_date column (null = still macerating, date = when herb was pressed)
ALTER TABLE public.tincture_batches
  ADD COLUMN IF NOT EXISTS pressed_date DATE;

-- 3. Replace the old partial unique index with one that covers both live statuses.
--    We wrap it in DO $$ so the DROP only runs if the old index actually exists —
--    this avoids Supabase treating it as an unconditional destructive statement.
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_indexes
    WHERE schemaname = 'public'
      AND tablename  = 'tincture_batches'
      AND indexname  = 'tincture_batches_one_active_per_herb'
  ) THEN
    DROP INDEX public.tincture_batches_one_active_per_herb;
  END IF;
END $$;

-- Create the new index only if it doesn't already exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes
    WHERE schemaname = 'public'
      AND tablename  = 'tincture_batches'
      AND indexname  = 'tincture_batches_one_live_per_herb'
  ) THEN
    CREATE UNIQUE INDEX tincture_batches_one_live_per_herb
      ON public.tincture_batches (user_id, herb_id)
      WHERE status IN ('macerating', 'active');
  END IF;
END $$;
