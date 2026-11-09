-- Herb detail screen fields: tincture-making specs per herb.
-- tincture_alcohol is free text so values like '55%/10V', 'fresh 60-70%', 'vinegar' are preserved.
ALTER TABLE public.herbs ADD COLUMN IF NOT EXISTS tincture_alcohol text;
ALTER TABLE public.herbs ADD COLUMN IF NOT EXISTS tincture_ratio text;
ALTER TABLE public.herbs ADD COLUMN IF NOT EXISTS plant_part text;

NOTIFY pgrst, 'reload schema';
