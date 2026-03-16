-- ============================================================
-- Migration: add current_batch_id FK to inventory
-- Used by tincture and backstock (tincture backstock) location
-- rows to reference the active tincture batch for that herb.
-- ============================================================

ALTER TABLE public.inventory
  ADD COLUMN IF NOT EXISTS current_batch_id UUID
    REFERENCES public.tincture_batches(id) ON DELETE SET NULL;

-- Index for lookups by batch
CREATE INDEX IF NOT EXISTS inventory_current_batch_id_idx
  ON public.inventory (current_batch_id);
