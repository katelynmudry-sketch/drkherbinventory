-- Add 'bulk_clinic' as a valid location: a small subset of bulk herbs kept
-- on hand at the clinic itself, separate from the main 'bulk' storage location.
ALTER TABLE public.inventory
  DROP CONSTRAINT IF EXISTS inventory_location_check;

ALTER TABLE public.inventory
  ADD CONSTRAINT inventory_location_check
  CHECK (location IN ('backstock', 'tincture', 'clinic', 'bulk', 'bulk_backstock', 'bulk_clinic'));
