-- Fix: add unique constraints that the import scripts rely on
-- Run this in Supabase SQL Editor BEFORE running pb-import.sql / clef-import.sql

-- Suppliers: allow ON CONFLICT (user_id, name)
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'suppliers_user_id_name_key'
  ) THEN
    ALTER TABLE public.suppliers
      ADD CONSTRAINT suppliers_user_id_name_key UNIQUE (user_id, name);
  END IF;
END $$;

-- Herb pricing: drop old constraint if it exists, add correct one
DO $$ BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'herb_pricing_user_id_herb_name_supplier_id_key'
  ) THEN
    ALTER TABLE public.herb_pricing
      DROP CONSTRAINT herb_pricing_user_id_herb_name_supplier_id_key;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'herb_pricing_supplier_id_herb_name_key'
  ) THEN
    ALTER TABLE public.herb_pricing
      ADD CONSTRAINT herb_pricing_supplier_id_herb_name_key UNIQUE (supplier_id, herb_name);
  END IF;
END $$;
