-- ============================================================
-- Premade tinctures: tier pricing reference (shared) + per-user flag list
-- Run this in Supabase Dashboard > SQL Editor
-- ============================================================

-- 1. Tier pricing — shared, world-readable reference data (no user_id)
CREATE TABLE public.tincture_price_tiers (
  id           UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tier_label   TEXT NOT NULL UNIQUE,
  price_100ml  NUMERIC(10,2) NOT NULL,
  price_250ml  NUMERIC(10,2) NOT NULL,
  price_500ml  NUMERIC(10,2) NOT NULL,
  price_1000ml NUMERIC(10,2) NOT NULL,
  created_at   TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.tincture_price_tiers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view tincture price tiers"
  ON public.tincture_price_tiers FOR SELECT USING (true);

-- 2. Herb → tier lookup — shared, world-readable reference data (no user_id)
CREATE TABLE public.tincture_price_herbs (
  id         UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  herb_name  TEXT NOT NULL UNIQUE,
  tier_id    UUID NOT NULL REFERENCES public.tincture_price_tiers(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.tincture_price_herbs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view tincture price herbs"
  ON public.tincture_price_herbs FOR SELECT USING (true);

-- 3. Premade tinctures — personal flag list, full RLS CRUD
CREATE TABLE public.premade_tinctures (
  id              UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id         UUID NOT NULL,
  herb_name       TEXT NOT NULL,
  notes           TEXT,
  default_size_ml INTEGER,
  created_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, herb_name),
  CHECK (default_size_ml IS NULL OR default_size_ml IN (100, 250, 500, 1000))
);

ALTER TABLE public.premade_tinctures ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own premade_tinctures"
  ON public.premade_tinctures FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own premade_tinctures"
  ON public.premade_tinctures FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own premade_tinctures"
  ON public.premade_tinctures FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own premade_tinctures"
  ON public.premade_tinctures FOR DELETE USING (auth.uid() = user_id);

CREATE TRIGGER update_premade_tinctures_updated_at
  BEFORE UPDATE ON public.premade_tinctures
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================================
-- Seed: Herbal Energetics price sheet (Oct 2024 revision)
-- ============================================================

INSERT INTO public.tincture_price_tiers (tier_label, price_100ml, price_250ml, price_500ml, price_1000ml) VALUES
  ('Tier 1', 19.95, 39.95, 64.95, 117.00),
  ('Tier 2', 23.95, 44.95, 69.95, 125.95),
  ('Tier 3', 24.95, 47.95, 79.95, 143.95),
  ('Beth root & Zizyphus spinosa', 31.95, 54.95, 91.95, 164.95),
  ('Buchu & Pulsatilla', 38.95, 57.95, 97.95, 174.50),
  ('Ginseng-Korean & Maitake', 44.95, 75.95, 126.50, 225.90),
  ('Ginseng-American & Pine Pollen', 52.95, 88.95, 149.50, 269.00);

WITH tier1 AS (SELECT id FROM public.tincture_price_tiers WHERE tier_label = 'Tier 1')
INSERT INTO public.tincture_price_herbs (herb_name, tier_id)
SELECT herb_name, tier1.id FROM tier1, (VALUES
  ('Achyranthes root'), ('Agastache'), ('Alfalfa'), ('Anemarrhena'), ('Anise'),
  ('Artichoke'), ('Ashwagandha'), ('Astragalus'), ('Black Walnut'), ('Bladderwrack'),
  ('Boldo'), ('Borage'), ('Buckthorn'), ('Burdock'), ('Butcher''s Broom'),
  ('Calendula'), ('Cascara Sagrada'), ('Cat''s Claw'), ('Chickweed'), ('Cilantro'),
  ('Cinnamon'), ('Cleavers'), ('Coltsfoot'), ('Comfrey leaf'), ('Dandelion leaf'),
  ('Dandelion root'), ('Dulse'), ('Elderberries'), ('Eleuthero'), ('Fennel seed'),
  ('Fenugreek seed'), ('Fo-Ti'), ('Garlic'), ('Ginger'), ('Gingko'),
  ('Goat''s Rue'), ('Goldenrod'), ('Green Tea'), ('Hawthorne berries'), ('Hawthorne leaves & flowers'),
  ('Hawthorne Combo'), ('Hibiscus'), ('Holy Basil'), ('Horse Chestnut'), ('Horsetail'),
  ('Hyssop'), ('Juniper berries'), ('Lemon Balm'), ('Licorice Root'), ('Lovage Root'),
  ('Meadowsweet'), ('Milk Thistle'), ('Moutan'), ('Mucuna'), ('Muira Puama'),
  ('Mullein leaf'), ('Nettle leaf'), ('Noni fruit'), ('Oat seed, milky tops'), ('Olive leaf'),
  ('Oregano'), ('Parsley leaf'), ('Parsley root'), ('Passionflower'), ('Pau D''Arco'),
  ('Peppermint'), ('Perillae leaf'), ('Privet berries'), ('Raspberry leaf'), ('Red Peony'),
  ('Rosemary leaf & flower'), ('Sage'), ('Shatavari'), ('Thyme'), ('Tribulus Fruit'),
  ('Turkey Rhubarb'), ('Turmeric'), ('Vitex/Chaste tree berries'), ('Water Plantain'), ('Willow bark'),
  ('Witch Hazel'), ('Wormwood'), ('Yarrow')
) AS v(herb_name);

WITH tier2 AS (SELECT id FROM public.tincture_price_tiers WHERE tier_label = 'Tier 2')
INSERT INTO public.tincture_price_herbs (herb_name, tier_id)
SELECT herb_name, tier2.id FROM tier2, (VALUES
  ('Angelica root'), ('Atractylodes'), ('Bacopa'), ('Baical Skullcap'), ('Balloon flower'),
  ('Barberry'), ('Bilberry Leaves'), ('Bitter Melon'), ('Bitter Orange'), ('Black Cohosh'),
  ('Blessed thistle'), ('Blue Flag'), ('Blue Vervain'), ('Boneset'), ('Bugleweed'),
  ('Bupleurum'), ('California Poppy'), ('Catnip'), ('Cayenne'), ('Celandine'),
  ('Chamomile'), ('Chapparal'), ('Citrus/Mandarin Peel'), ('Coleus'), ('Comfrey root'),
  ('Corn silk'), ('Cornus fruit'), ('Corydalis'), ('Couchgrass'), ('Cramp Bark'),
  ('Cyperus'), ('Damiana'), ('Devil''s Claw'), ('Dong Quai'), ('Echinacea purpurea'),
  ('Echinacea Combo'), ('Elecampane'), ('Elder flowers'), ('Eucommia'), ('Eyebright'),
  ('Feverfew'), ('Figwort'), ('Forsythia fruit'), ('Frankincense'), ('Gardenia fruit'),
  ('Gentian'), ('Gotu Kola'), ('Gravel root'), ('Grindelia'), ('Guggul'),
  ('Gymnema'), ('Horehound'), ('Horny Goat weed'), ('Horseradish'), ('Hydrangea root'),
  ('Isatis/Indigo Woad'), ('Jamaican Dogwood'), ('Japanese Knotweed'), ('Khella seeds'), ('Kudzu'),
  ('Lady''s Mantle'), ('Lavender'), ('Lily of the Valley'), ('Linden'), ('Lobelia'),
  ('Lomatium'), ('Lycii/Gogi berry'), ('Maca'), ('Magnolia bark'), ('Marshmallow root'),
  ('Mimosa Bark'), ('Mistletoe'), ('Motherwort'), ('Mugwort'), ('Mulberry leaf'),
  ('Myrrh'), ('Nettle root'), ('Nettle seed'), ('Oat straw'), ('Ophiopogon'),
  ('Oregon Grape Root'), ('Pellitory of the Wall'), ('Periwinkle'), ('Pinellia'), ('Poke Root'),
  ('Polygala root'), ('Poria'), ('Prickly Ash Bark'), ('Red Cedar Tips'), ('Red Clover blossoms'),
  ('Red Sage root'), ('Rehmannia'), ('Sarsparilla'), ('Saw Palmetto Berries'), ('Schisandra berries'),
  ('Scrophularia'), ('Shepherd''s Purse'), ('Silers root'), ('Skullcap'), ('Spanish needles'),
  ('Stone Root'), ('Teasel'), ('Uva Ursi'), ('Valerian'), ('Wild Cherry bark'),
  ('Wild Lettuce'), ('White Peony'), ('Yellow Dock'), ('Yohimbe')
) AS v(herb_name);

WITH tier3 AS (SELECT id FROM public.tincture_price_tiers WHERE tier_label = 'Tier 3')
INSERT INTO public.tincture_price_herbs (herb_name, tier_id)
SELECT herb_name, tier3.id FROM tier3, (VALUES
  ('Andrographis'), ('Aconite root'), ('Bilberry Berries'), ('Bilberry Combo'), ('Blue Cohosh'),
  ('Chaga'), ('Chanca piedra'), ('Codonopsis'), ('Coptis'), ('Cordyceps'),
  ('Cranesbill'), ('Damask Rose'), ('Echinacea angustifolia'), ('Fringetree'), ('Honeysuckle'),
  ('Hops'), ('Kava'), ('Partridge berry'), ('Pipssissewa'), ('Rauwolfia'),
  ('Red Root'), ('Reishi'), ('Rhodiola root'), ('Safflowers'), ('Solomon''s Seal'),
  ('St. John''s Wort'), ('Stillingia'), ('Usnea'), ('Wild Indigo'), ('Wild Yam')
) AS v(herb_name);

WITH t AS (SELECT id FROM public.tincture_price_tiers WHERE tier_label = 'Beth root & Zizyphus spinosa')
INSERT INTO public.tincture_price_herbs (herb_name, tier_id)
SELECT herb_name, t.id FROM t, (VALUES ('Beth root'), ('Zizyphus spinosa')) AS v(herb_name);

WITH t AS (SELECT id FROM public.tincture_price_tiers WHERE tier_label = 'Buchu & Pulsatilla')
INSERT INTO public.tincture_price_herbs (herb_name, tier_id)
SELECT herb_name, t.id FROM t, (VALUES ('Buchu'), ('Pulsatilla')) AS v(herb_name);

WITH t AS (SELECT id FROM public.tincture_price_tiers WHERE tier_label = 'Ginseng-Korean & Maitake')
INSERT INTO public.tincture_price_herbs (herb_name, tier_id)
SELECT herb_name, t.id FROM t, (VALUES ('Ginseng - Korean'), ('Maitake')) AS v(herb_name);

WITH t AS (SELECT id FROM public.tincture_price_tiers WHERE tier_label = 'Ginseng-American & Pine Pollen')
INSERT INTO public.tincture_price_herbs (herb_name, tier_id)
SELECT herb_name, t.id FROM t, (VALUES ('Ginseng - American'), ('Pine Pollen')) AS v(herb_name);
