-- ============================================================
-- Migration: workspace_config table
-- Stores per-deployment configuration (industry, locations,
-- statuses, voice vocabulary, terminology, feature flags) so the
-- app's locations/statuses/voice commands can be tailored to any
-- industry via onboarding instead of being hardcoded.
--
-- Defaults below reproduce today's herbal-clinic behavior exactly
-- (clinic/backstock/tincture/bulk/bulk_backstock locations,
-- full/low/out/ordered statuses, "herb"/"herbs" terminology).
-- ============================================================

CREATE TABLE public.workspace_config (
  id                    UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id               UUID NOT NULL UNIQUE,
  industry_key          TEXT NOT NULL DEFAULT 'herbal_clinic',
  item_label_singular   TEXT NOT NULL DEFAULT 'herb',
  item_label_plural     TEXT NOT NULL DEFAULT 'herbs',

  locations JSONB NOT NULL DEFAULT '[
    {"id": "backstock", "label": "Backstock", "icon": "package", "synonyms": ["backstock", "back stock"],
     "flags": {"hasMaceration": true, "isBulkWeight": false}},
    {"id": "tincture", "label": "Tinctures", "icon": "droplets", "synonyms": ["tincture", "tinctures"],
     "flags": {"hasMaceration": true, "isBulkWeight": false}},
    {"id": "clinic", "label": "Clinic Stock", "icon": "stethoscope", "synonyms": ["clinic"],
     "flags": {"hasMaceration": false, "isBulkWeight": false, "isPrimaryDispensary": true}},
    {"id": "bulk", "label": "Bulk Herbs", "icon": "package2", "synonyms": ["bulk"],
     "flags": {"hasMaceration": false, "isBulkWeight": true}},
    {"id": "bulk_backstock", "label": "Bulk Backstock", "icon": "package2", "synonyms": ["bulk backstock"],
     "flags": {"hasMaceration": false, "isBulkWeight": true}}
  ]'::jsonb,

  statuses JSONB NOT NULL DEFAULT '[
    {"id": "full", "label": "Full", "color": "green", "synonyms": ["full"], "isThresholdDerived": false},
    {"id": "low", "label": "Low", "color": "yellow", "synonyms": ["low", "running low"], "isThresholdDerived": true},
    {"id": "out", "label": "Out", "color": "red", "synonyms": ["out", "empty", "out of stock"], "isThresholdDerived": true},
    {"id": "ordered", "label": "Ordered", "color": "blue", "synonyms": ["ordered"], "isThresholdDerived": false}
  ]'::jsonb,

  voice_config JSONB NOT NULL DEFAULT '{
    "addVerbs": ["add", "put"],
    "removeVerbs": ["remove", "delete", "take out"],
    "changeVerbs": ["change", "set", "mark", "update"],
    "tabLocations": {"tinctures": ["clinic", "backstock", "tincture"], "bulk": ["bulk"]},
    "defaultLocationByTab": {"bulk": "bulk"},
    "lowStockDefaultLocation": "clinic"
  }'::jsonb,

  features JSONB NOT NULL DEFAULT '{
    "maceration": true,
    "batchTracking": true,
    "supplierPricing": true,
    "bulkWeightCounting": true
  }'::jsonb,

  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.workspace_config ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own workspace_config"
  ON public.workspace_config FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own workspace_config"
  ON public.workspace_config FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own workspace_config"
  ON public.workspace_config FOR UPDATE USING (auth.uid() = user_id);

CREATE TRIGGER update_workspace_config_updated_at
  BEFORE UPDATE ON public.workspace_config
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Seed the existing herbal clinic account with the herbal_clinic preset.
-- All JSONB columns use their defaults above, which match current behavior exactly.
INSERT INTO public.workspace_config (user_id, industry_key)
SELECT id, 'herbal_clinic' FROM auth.users WHERE email = 'katelynmudry@gmail.com'
ON CONFLICT (user_id) DO NOTHING;
