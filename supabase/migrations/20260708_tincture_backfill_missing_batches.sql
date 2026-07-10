-- Backfill tincture_batches for any tincture inventory rows that still
-- have no batch record (added before batch tracking was in place).
DO $$
DECLARE
  r RECORD;
  v_batch_number TEXT;
  v_new_id UUID;
BEGIN
  FOR r IN
    SELECT id, herb_id, user_id,
           COALESCE(tincture_started_at, created_at) AS started_at
    FROM public.inventory
    WHERE location = 'tincture'
      AND current_batch_id IS NULL
  LOOP
    -- Skip if this herb already has a live batch (safety guard)
    IF EXISTS (
      SELECT 1 FROM public.tincture_batches
      WHERE herb_id = r.herb_id
        AND user_id = r.user_id
        AND status IN ('macerating', 'active')
    ) THEN
      CONTINUE;
    END IF;

    v_batch_number := public.generate_batch_number(
      r.herb_id, r.user_id,
      EXTRACT(YEAR FROM r.started_at)::INTEGER
    );

    INSERT INTO public.tincture_batches
      (user_id, herb_id, batch_number, batch_date, status)
    VALUES
      (r.user_id, r.herb_id, v_batch_number, r.started_at::DATE, 'macerating')
    RETURNING id INTO v_new_id;

    UPDATE public.inventory
    SET current_batch_id = v_new_id
    WHERE id = r.id;
  END LOOP;
END $$;
