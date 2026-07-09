-- ============================================================
-- Migration: bottle_count on tincture_batches
-- Tracks how many bottles a batch yielded/has on hand. Nullable —
-- null means "not tracked" (old/voice-created batches stay untouched).
-- ============================================================

ALTER TABLE public.tincture_batches
  ADD COLUMN IF NOT EXISTS bottle_count INTEGER;
