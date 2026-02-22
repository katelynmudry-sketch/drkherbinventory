-- Add multi-name fields to herbs table
-- Supports: latin/botanical name, pinyin name (Chinese herbs), preferred display name
-- Run this in your Supabase SQL Editor

ALTER TABLE public.herbs
  ADD COLUMN IF NOT EXISTS latin_name TEXT,
  ADD COLUMN IF NOT EXISTS pinyin_name TEXT,
  ADD COLUMN IF NOT EXISTS preferred_name TEXT
    CHECK (preferred_name IN ('common', 'latin', 'pinyin'));

-- preferred_name = NULL means use the existing `name` column (backward-compatible default)
-- All three columns are optional — no backfill needed
-- The existing `name` column stays as the canonical key for herb_pricing and herb_reorder_qty references
