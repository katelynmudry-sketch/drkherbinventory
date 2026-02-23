-- Add 'ordered' to the inventory status CHECK constraint
ALTER TABLE inventory DROP CONSTRAINT IF EXISTS inventory_status_check;
ALTER TABLE inventory ADD CONSTRAINT inventory_status_check
  CHECK (status IN ('full', 'low', 'out', 'ordered'));
