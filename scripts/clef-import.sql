-- Clef des Champs bulk herb price import
-- Generated: 2026-02-23T04:24:28.637Z
-- Run this in your Supabase SQL Editor

-- Step 1: Insert supplier
INSERT INTO public.suppliers (user_id, name, url)
VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Clef des Champs', 'https://clefdeschamps.net')
ON CONFLICT (user_id, name) DO NOTHING;

-- Step 2: Insert pricing rows
DO $$
DECLARE v_supplier_id UUID;
BEGIN
  SELECT id INTO v_supplier_id FROM public.suppliers
  WHERE user_id = 'b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4' AND name = 'Clef des Champs';

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, package_size_g, package_price, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Althea', v_supplier_id, 24.7208, 500, 27.2500, '445V-500', 'MARSHMALLOW root organic', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, package_size_g = EXCLUDED.package_size_g, package_price = EXCLUDED.package_price, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, package_size_g, package_price, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Anise', v_supplier_id, 20.9106, 500, 23.0500, '501V-500', 'ANISE seed organic', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, package_size_g = EXCLUDED.package_size_g, package_price = EXCLUDED.package_price, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, package_size_g, package_price, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Ashwagandha', v_supplier_id, 19.2777, 500, 21.2500, '496V-500', 'ASHWAGANDHA root organic', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, package_size_g = EXCLUDED.package_size_g, package_price = EXCLUDED.package_price, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, package_size_g, package_price, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Astragalus', v_supplier_id, 27.3516, 500, 30.1500, '509V-500', 'ASTRAGALUS root organic', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, package_size_g = EXCLUDED.package_size_g, package_price = EXCLUDED.package_price, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, package_size_g, package_price, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Avena', v_supplier_id, 28.3495, 500, 31.2500, '409V-500', 'GREEN OATSTRAW organic', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, package_size_g = EXCLUDED.package_size_g, package_price = EXCLUDED.package_price, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, package_size_g, package_price, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Bacopa', v_supplier_id, 74.8427, 500, 82.5000, '230V-500', 'BACOPA organic', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, package_size_g = EXCLUDED.package_size_g, package_price = EXCLUDED.package_price, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, package_size_g, package_price, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Black Pepper', v_supplier_id, 26.5351, 500, 29.2500, '369V-500', 'BLACK PEPPER whole organic', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, package_size_g = EXCLUDED.package_size_g, package_price = EXCLUDED.package_price, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, package_size_g, package_price, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Black Walnut', v_supplier_id, 19.2777, 500, 21.2500, '455V-500', 'BLACK WALNUT leaf organic', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, package_size_g = EXCLUDED.package_size_g, package_price = EXCLUDED.package_price, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, package_size_g, package_price, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Burdock', v_supplier_id, 37.4213, 500, 41.2500, '410V-500', 'BURDOCK root organic', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, package_size_g = EXCLUDED.package_size_g, package_price = EXCLUDED.package_price, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, package_size_g, package_price, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Calendula', v_supplier_id, 28.1227, 250, 15.5000, '416V-250', 'CALENDULA flower organic', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, package_size_g = EXCLUDED.package_size_g, package_price = EXCLUDED.package_price, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, package_size_g, package_price, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Catnip', v_supplier_id, 43.9984, 500, 48.5000, '419V-500', 'CATNIP flower leaf organic', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, package_size_g = EXCLUDED.package_size_g, package_price = EXCLUDED.package_price, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, package_size_g, package_price, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Chamomile', v_supplier_id, 32.3865, 250, 17.8500, '417V-250', 'CHAMOMILE flower organic', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, package_size_g = EXCLUDED.package_size_g, package_price = EXCLUDED.package_price, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, package_size_g, package_price, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Cinnamon', v_supplier_id, 23.1332, 500, 25.5000, '352V-500', 'CINNAMON pwdr organic', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, package_size_g = EXCLUDED.package_size_g, package_price = EXCLUDED.package_price, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, package_size_g, package_price, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Dandelion Root', v_supplier_id, 26.7619, 500, 29.5000, '463V-500', 'DANDELION root organic', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, package_size_g = EXCLUDED.package_size_g, package_price = EXCLUDED.package_price, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, package_size_g, package_price, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Echinacea Augustifolia', v_supplier_id, 77.1106, 250, 42.5000, '429V-250', 'ECHINACEA ANGUSTIFOLIA organic', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, package_size_g = EXCLUDED.package_size_g, package_price = EXCLUDED.package_price, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, package_size_g, package_price, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Eleuthero', v_supplier_id, 32.2050, 500, 35.5000, '432V-500', 'ELEUTHERO  root organic', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, package_size_g = EXCLUDED.package_size_g, package_price = EXCLUDED.package_price, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, package_size_g, package_price, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Fennel', v_supplier_id, 10.2058, 500, 11.2500, '436V-500', 'FENNEL whole organic', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, package_size_g = EXCLUDED.package_size_g, package_price = EXCLUDED.package_price, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, package_size_g, package_price, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Gentian', v_supplier_id, 43.6356, 500, 48.1000, '440V-500', 'GENTIAN root organic', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, package_size_g = EXCLUDED.package_size_g, package_price = EXCLUDED.package_price, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, package_size_g, package_price, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Ginger', v_supplier_id, 19.5045, 500, 21.5000, '441V-500', 'GINGER pwdr organic', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, package_size_g = EXCLUDED.package_size_g, package_price = EXCLUDED.package_price, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, package_size_g, package_price, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Goldenrod', v_supplier_id, 27.4423, 500, 30.2500, '486V-500', 'GOLDENROD organic', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, package_size_g = EXCLUDED.package_size_g, package_price = EXCLUDED.package_price, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, package_size_g, package_price, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Hawthorn', v_supplier_id, 20.6384, 500, 22.7500, '408V-500', 'HAWTHORN flower leaf organic', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, package_size_g = EXCLUDED.package_size_g, package_price = EXCLUDED.package_price, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, package_size_g, package_price, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Horsetail', v_supplier_id, 20.6384, 500, 22.7500, '530V-500', 'HORSETAIL herb organic', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, package_size_g = EXCLUDED.package_size_g, package_price = EXCLUDED.package_price, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, package_size_g, package_price, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Juniper', v_supplier_id, 20.6384, 500, 22.7500, '439V-500', 'JUNIPER whole organic', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, package_size_g = EXCLUDED.package_size_g, package_price = EXCLUDED.package_price, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, package_size_g, package_price, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Lavender', v_supplier_id, 58.3319, 500, 64.3000, '513V-500', 'LAVENDER flower organic', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, package_size_g = EXCLUDED.package_size_g, package_price = EXCLUDED.package_price, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, package_size_g, package_price, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Lemon Balm', v_supplier_id, 61.2349, 250, 33.7500, '361V-250', 'LEMON BALM leaf organic', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, package_size_g = EXCLUDED.package_size_g, package_price = EXCLUDED.package_price, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, package_size_g, package_price, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Lemongrass', v_supplier_id, 17.0097, 500, 18.7500, '510V-500', 'LEMONGRASS herb organic', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, package_size_g = EXCLUDED.package_size_g, package_price = EXCLUDED.package_price, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, package_size_g, package_price, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Licorice', v_supplier_id, 14.2881, 500, 15.7500, '467V-500', 'LICORICE cut organic', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, package_size_g = EXCLUDED.package_size_g, package_price = EXCLUDED.package_price, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, package_size_g, package_price, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Linden', v_supplier_id, 38.3285, 500, 42.2500, '489V-500', 'LINDEN SAPWOOD Organic', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, package_size_g = EXCLUDED.package_size_g, package_price = EXCLUDED.package_price, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, package_size_g, package_price, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Marshmallow', v_supplier_id, 24.7208, 500, 27.2500, '445V-500', 'MARSHMALLOW root organic', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, package_size_g = EXCLUDED.package_size_g, package_price = EXCLUDED.package_price, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, package_size_g, package_price, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Meadowsweet', v_supplier_id, 24.7208, 500, 27.2500, '531V-500', 'MEADOWSWEET organic', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, package_size_g = EXCLUDED.package_size_g, package_price = EXCLUDED.package_price, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, package_size_g, package_price, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Milk Thistle', v_supplier_id, 22.9064, 500, 25.2500, '423V-500', 'MILK THISTLE seed organic', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, package_size_g = EXCLUDED.package_size_g, package_price = EXCLUDED.package_price, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, package_size_g, package_price, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Mullein', v_supplier_id, 30.3907, 250, 16.7500, '451V-250', 'MULLEIN leaf organic', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, package_size_g = EXCLUDED.package_size_g, package_price = EXCLUDED.package_price, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, package_size_g, package_price, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Ocimum', v_supplier_id, 65.2719, 500, 71.9500, '544V-500', 'HOLY BASIL leaf organic', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, package_size_g = EXCLUDED.package_size_g, package_price = EXCLUDED.package_price, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, package_size_g, package_price, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Orange Peel', v_supplier_id, 38.5553, 500, 42.5000, '378V-500', 'ORANGE peel organic', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, package_size_g = EXCLUDED.package_size_g, package_price = EXCLUDED.package_price, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, package_size_g, package_price, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Oregano', v_supplier_id, 20.6838, 250, 11.4000, '366V-250', 'OREGANO leaf organic', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, package_size_g = EXCLUDED.package_size_g, package_price = EXCLUDED.package_price, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, package_size_g, package_price, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Parsley', v_supplier_id, 38.5553, 500, 42.5000, '368V-500', 'PARSLEY leaf organic', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, package_size_g = EXCLUDED.package_size_g, package_price = EXCLUDED.package_price, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, package_size_g, package_price, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Passion Flower', v_supplier_id, 49.4415, 500, 54.5000, '459V-500', 'PASSIONFLOWER herb organic', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, package_size_g = EXCLUDED.package_size_g, package_price = EXCLUDED.package_price, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, package_size_g, package_price, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Peppermint', v_supplier_id, 17.6901, 250, 9.7500, '450V-250', 'PEPPERMINT organic', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, package_size_g = EXCLUDED.package_size_g, package_price = EXCLUDED.package_price, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, package_size_g, package_price, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Plantain', v_supplier_id, 50.1219, 500, 55.2500, '464V-500', 'PLANTAIN leaf organic', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, package_size_g = EXCLUDED.package_size_g, package_price = EXCLUDED.package_price, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, package_size_g, package_price, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Raspberry Leaf', v_supplier_id, 33.3390, 500, 36.7500, '437V-500', 'RED RASPBERRY leaf organic', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, package_size_g = EXCLUDED.package_size_g, package_price = EXCLUDED.package_price, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, package_size_g, package_price, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Red Clover', v_supplier_id, 34.2462, 500, 37.7500, '474V-500', 'RED CLOVER organic', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, package_size_g = EXCLUDED.package_size_g, package_price = EXCLUDED.package_price, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, package_size_g, package_price, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Rose', v_supplier_id, 40.3697, 250, 22.2500, '214V-250', 'ROSE petal organic', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, package_size_g = EXCLUDED.package_size_g, package_price = EXCLUDED.package_price, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, package_size_g, package_price, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Rosemary', v_supplier_id, 20.8199, 500, 22.9500, '370V-500', 'ROSEMARY leaf organic', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, package_size_g = EXCLUDED.package_size_g, package_price = EXCLUDED.package_price, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, package_size_g, package_price, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Rumex', v_supplier_id, 28.5763, 250, 15.7500, '460V-250', 'YELLOW DOCK root organic', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, package_size_g = EXCLUDED.package_size_g, package_price = EXCLUDED.package_price, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, package_size_g, package_price, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Sage', v_supplier_id, 28.5763, 500, 31.5000, '372V-500', 'SAGE leaf organic', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, package_size_g = EXCLUDED.package_size_g, package_price = EXCLUDED.package_price, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, package_size_g, package_price, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Schisandra', v_supplier_id, 42.5469, 500, 46.9000, '442V-500', 'SCHISANDRA berry organic', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, package_size_g = EXCLUDED.package_size_g, package_price = EXCLUDED.package_price, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, package_size_g, package_price, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Scutellaria', v_supplier_id, 61.2349, 500, 67.5000, '471V-500', 'SKULLCAP herb organic', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, package_size_g = EXCLUDED.package_size_g, package_price = EXCLUDED.package_price, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, package_size_g, package_price, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Shatavari', v_supplier_id, 22.2260, 500, 24.5000, '127V-500', 'SHATAVARI root pwdr organic', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, package_size_g = EXCLUDED.package_size_g, package_price = EXCLUDED.package_price, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, package_size_g, package_price, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Thyme', v_supplier_id, 17.4633, 500, 19.2500, '374V-500', 'THYME leaf organic', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, package_size_g = EXCLUDED.package_size_g, package_price = EXCLUDED.package_price, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, package_size_g, package_price, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Valerian', v_supplier_id, 31.2978, 500, 34.5000, '475V-500', 'VALERIAN root organic', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, package_size_g = EXCLUDED.package_size_g, package_price = EXCLUDED.package_price, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, package_size_g, package_price, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Yarrow', v_supplier_id, 18.0983, 500, 19.9500, '401V-500', 'YARROW organic', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, package_size_g = EXCLUDED.package_size_g, package_price = EXCLUDED.package_price, last_updated = CURRENT_DATE;

END $$;

-- Done: 51 pricing rows