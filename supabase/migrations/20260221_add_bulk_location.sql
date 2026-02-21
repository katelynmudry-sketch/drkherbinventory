-- Fix 1: Add 'bulk' to the allowed location values
-- The original CHECK constraint only had: backstock, tincture, clinic
ALTER TABLE public.inventory
  DROP CONSTRAINT IF EXISTS inventory_location_check;

ALTER TABLE public.inventory
  ADD CONSTRAINT inventory_location_check
  CHECK (location IN ('backstock', 'tincture', 'clinic', 'bulk'));

-- Fix 2: Ensure quantity is numeric (in case the previous migration wasn't run)
ALTER TABLE public.inventory
  ALTER COLUMN quantity TYPE NUMERIC(8,2) USING quantity::NUMERIC(8,2);
