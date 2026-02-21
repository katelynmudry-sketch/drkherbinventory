-- Change inventory.quantity from INTEGER to NUMERIC(8,2)
-- to support decimal lb values like 0.25, 0.5, 1.5, etc.
-- Run this in Supabase Dashboard > SQL Editor

ALTER TABLE public.inventory
  ALTER COLUMN quantity TYPE NUMERIC(8,2) USING quantity::NUMERIC(8,2);
