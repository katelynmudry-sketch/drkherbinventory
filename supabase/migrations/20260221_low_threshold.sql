-- Add per-herb low-stock threshold (in lbs)
-- Default 0.25 lb: at or below this qty the herb shows as LOW (not OUT)
-- OUT is always quantity = 0 only
-- Set to 0.5 for herbs you go through faster and want earlier warning
ALTER TABLE public.herbs
  ADD COLUMN IF NOT EXISTS low_threshold_lb NUMERIC(4,2) NOT NULL DEFAULT 0.25;
