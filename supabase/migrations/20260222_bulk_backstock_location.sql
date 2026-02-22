-- Add 'bulk_backstock' as a valid location (separate from tincture 'backstock')
ALTER TABLE public.inventory
  DROP CONSTRAINT IF EXISTS inventory_location_check;

ALTER TABLE public.inventory
  ADD CONSTRAINT inventory_location_check
  CHECK (location IN ('backstock', 'tincture', 'clinic', 'bulk', 'bulk_backstock'));

-- Migrate existing bulk backstock records to the new location key.
-- BulkInventorySection always writes a positive quantity, so quantity > 0
-- safely identifies records written by it vs. tincture backstock (quantity IS NULL).
UPDATE public.inventory
  SET location = 'bulk_backstock'
  WHERE location = 'backstock'
    AND quantity IS NOT NULL
    AND quantity > 0;
