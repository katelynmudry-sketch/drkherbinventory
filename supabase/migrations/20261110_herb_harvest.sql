-- Harvest flag: herb is out but will be harvested, so it should not be pulled into the order list.
ALTER TABLE public.herbs ADD COLUMN IF NOT EXISTS harvest boolean NOT NULL DEFAULT false;

NOTIFY pgrst, 'reload schema';
