-- Clef des Champs bulk herb price import (Monde Naturel bulk list)
-- Generated: 2026-07-16
-- Replaces prior Clef des Champs pricing with this list
-- Run this in your Supabase SQL Editor

-- Step 1: Insert supplier (skip if exists)
INSERT INTO public.suppliers (user_id, name, url)
VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Clef des Champs', 'https://clefdeschamps.net')
ON CONFLICT (user_id, name) DO NOTHING;

-- Step 2: Clear out old Clef des Champs pricing rows so discontinued items do not linger
DELETE FROM public.herb_pricing
WHERE user_id = 'b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4'
  AND supplier_id = (SELECT id FROM public.suppliers WHERE user_id = 'b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4' AND name = 'Clef des Champs');

-- Step 3: Insert fresh pricing rows
DO $$
DECLARE v_supplier_id UUID;
BEGIN
  SELECT id INTO v_supplier_id FROM public.suppliers
  WHERE user_id = 'b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4' AND name = 'Clef des Champs';

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, package_size_g, package_price, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Anise', v_supplier_id, 20.9106, 500, 23.0500, 'CLC70501', 'Anis (graine)', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, package_size_g = EXCLUDED.package_size_g, package_price = EXCLUDED.package_price, supplier_item_code = EXCLUDED.supplier_item_code, supplier_item_name = EXCLUDED.supplier_item_name, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, package_size_g, package_price, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Ashwagandha', v_supplier_id, 19.2777, 500, 21.2500, 'CLC70496', 'Ashwaganda (racine)', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, package_size_g = EXCLUDED.package_size_g, package_price = EXCLUDED.package_price, supplier_item_code = EXCLUDED.supplier_item_code, supplier_item_name = EXCLUDED.supplier_item_name, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, package_size_g, package_price, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Astragalus', v_supplier_id, 32.4318, 500, 35.7500, 'CLC70509', 'Astragale (racine)', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, package_size_g = EXCLUDED.package_size_g, package_price = EXCLUDED.package_price, supplier_item_code = EXCLUDED.supplier_item_code, supplier_item_name = EXCLUDED.supplier_item_name, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, package_size_g, package_price, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Avena', v_supplier_id, 32.8854, 500, 36.2500, 'CLC70409', 'Avoine (tige verte en fleur)', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, package_size_g = EXCLUDED.package_size_g, package_price = EXCLUDED.package_price, supplier_item_code = EXCLUDED.supplier_item_code, supplier_item_name = EXCLUDED.supplier_item_name, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, package_size_g, package_price, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Basil', v_supplier_id, 14.0614, 500, 15.5000, 'CLC70351', 'Basilic (feuille)', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, package_size_g = EXCLUDED.package_size_g, package_price = EXCLUDED.package_price, supplier_item_code = EXCLUDED.supplier_item_code, supplier_item_name = EXCLUDED.supplier_item_name, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, package_size_g, package_price, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Bay Leaf', v_supplier_id, 54.3403, 250, 29.9500, 'CLC70360', 'Laurier (feuille)', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, package_size_g = EXCLUDED.package_size_g, package_price = EXCLUDED.package_price, supplier_item_code = EXCLUDED.supplier_item_code, supplier_item_name = EXCLUDED.supplier_item_name, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, package_size_g, package_price, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Black Pepper', v_supplier_id, 26.5351, 500, 29.2500, 'CLC70369', 'Poivre noir (entier)', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, package_size_g = EXCLUDED.package_size_g, package_price = EXCLUDED.package_price, supplier_item_code = EXCLUDED.supplier_item_code, supplier_item_name = EXCLUDED.supplier_item_name, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, package_size_g, package_price, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Black Pepper Ground', v_supplier_id, 26.5351, 500, 29.2500, 'CLC70485', 'Poivre noir (moulu)', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, package_size_g = EXCLUDED.package_size_g, package_price = EXCLUDED.package_price, supplier_item_code = EXCLUDED.supplier_item_code, supplier_item_name = EXCLUDED.supplier_item_name, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, package_size_g, package_price, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Black Walnut', v_supplier_id, 19.2777, 500, 21.2500, 'CLC70455', 'Noyer noir (feuilles)', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, package_size_g = EXCLUDED.package_size_g, package_price = EXCLUDED.package_price, supplier_item_code = EXCLUDED.supplier_item_code, supplier_item_name = EXCLUDED.supplier_item_name, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, package_size_g, package_price, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Buckthorn Bark', v_supplier_id, 25.6279, 500, 28.2500, 'CLC70413', 'Bourdaine (écorce)', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, package_size_g = EXCLUDED.package_size_g, package_price = EXCLUDED.package_price, supplier_item_code = EXCLUDED.supplier_item_code, supplier_item_name = EXCLUDED.supplier_item_name, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, package_size_g, package_price, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Burdock', v_supplier_id, 37.4213, 500, 41.2500, 'CLC70410', 'Bardane (racine)', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, package_size_g = EXCLUDED.package_size_g, package_price = EXCLUDED.package_price, supplier_item_code = EXCLUDED.supplier_item_code, supplier_item_name = EXCLUDED.supplier_item_name, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, package_size_g, package_price, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Calendula', v_supplier_id, 28.1227, 250, 15.5000, 'CLC80416', 'Calendule (fleur)', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, package_size_g = EXCLUDED.package_size_g, package_price = EXCLUDED.package_price, supplier_item_code = EXCLUDED.supplier_item_code, supplier_item_name = EXCLUDED.supplier_item_name, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, package_size_g, package_price, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Caraway', v_supplier_id, 15.6489, 500, 17.2500, 'CLC70539', 'Carvi (graine)', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, package_size_g = EXCLUDED.package_size_g, package_price = EXCLUDED.package_price, supplier_item_code = EXCLUDED.supplier_item_code, supplier_item_name = EXCLUDED.supplier_item_name, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, package_size_g, package_price, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Catnip', v_supplier_id, 43.9984, 500, 48.5000, 'CLC70419', 'Cataire (fleurs / feuilles)', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, package_size_g = EXCLUDED.package_size_g, package_price = EXCLUDED.package_price, supplier_item_code = EXCLUDED.supplier_item_code, supplier_item_name = EXCLUDED.supplier_item_name, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, package_size_g, package_price, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Cayenne', v_supplier_id, 26.0815, 500, 28.7500, 'CLC70420', 'Cayenne (fruit en poudre)', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, package_size_g = EXCLUDED.package_size_g, package_price = EXCLUDED.package_price, supplier_item_code = EXCLUDED.supplier_item_code, supplier_item_name = EXCLUDED.supplier_item_name, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, package_size_g, package_price, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Chamomile', v_supplier_id, 32.3865, 250, 17.8500, 'CLC80417', 'Camomille (fleur)', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, package_size_g = EXCLUDED.package_size_g, package_price = EXCLUDED.package_price, supplier_item_code = EXCLUDED.supplier_item_code, supplier_item_name = EXCLUDED.supplier_item_name, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, package_size_g, package_price, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Chickweed', v_supplier_id, 24.7208, 500, 27.2500, 'CLC70452', 'Mouron des oiseaux (herbe)', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, package_size_g = EXCLUDED.package_size_g, package_price = EXCLUDED.package_price, supplier_item_code = EXCLUDED.supplier_item_code, supplier_item_name = EXCLUDED.supplier_item_name, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, package_size_g, package_price, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Chili', v_supplier_id, 27.4423, 500, 30.2500, 'CLC70353', 'Chili fruits (morceaux)', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, package_size_g = EXCLUDED.package_size_g, package_price = EXCLUDED.package_price, supplier_item_code = EXCLUDED.supplier_item_code, supplier_item_name = EXCLUDED.supplier_item_name, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, package_size_g, package_price, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Cinnamon', v_supplier_id, 29.4835, 500, 32.5000, 'CLC70352', 'Cannelle (poudre)', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, package_size_g = EXCLUDED.package_size_g, package_price = EXCLUDED.package_price, supplier_item_code = EXCLUDED.supplier_item_code, supplier_item_name = EXCLUDED.supplier_item_name, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, package_size_g, package_price, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Cinnamon Stick', v_supplier_id, 41.1862, 500, 45.4000, 'CLC70379', 'Cannelle (bâton)', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, package_size_g = EXCLUDED.package_size_g, package_price = EXCLUDED.package_price, supplier_item_code = EXCLUDED.supplier_item_code, supplier_item_name = EXCLUDED.supplier_item_name, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, package_size_g, package_price, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Clove', v_supplier_id, 32.8854, 500, 36.2500, 'CLC70355', 'Clou de girofle (entier)', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, package_size_g = EXCLUDED.package_size_g, package_price = EXCLUDED.package_price, supplier_item_code = EXCLUDED.supplier_item_code, supplier_item_name = EXCLUDED.supplier_item_name, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, package_size_g, package_price, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Coriander', v_supplier_id, 13.8346, 500, 15.2500, 'CLC70357', 'Coriandre (graine)', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, package_size_g = EXCLUDED.package_size_g, package_price = EXCLUDED.package_price, supplier_item_code = EXCLUDED.supplier_item_code, supplier_item_name = EXCLUDED.supplier_item_name, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, package_size_g, package_price, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Cumin Powder', v_supplier_id, 14.2881, 500, 15.7500, 'CLC70540', 'Cumin (poudre)', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, package_size_g = EXCLUDED.package_size_g, package_price = EXCLUDED.package_price, supplier_item_code = EXCLUDED.supplier_item_code, supplier_item_name = EXCLUDED.supplier_item_name, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, package_size_g, package_price, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Cumin Seed', v_supplier_id, 17.0097, 500, 18.7500, 'CLC70536', 'Cumin (graine entière)', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, package_size_g = EXCLUDED.package_size_g, package_price = EXCLUDED.package_price, supplier_item_code = EXCLUDED.supplier_item_code, supplier_item_name = EXCLUDED.supplier_item_name, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, package_size_g, package_price, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Dandelion Root', v_supplier_id, 26.7619, 500, 29.5000, 'CLC70463', 'Pissenlit (racine)', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, package_size_g = EXCLUDED.package_size_g, package_price = EXCLUDED.package_price, supplier_item_code = EXCLUDED.supplier_item_code, supplier_item_name = EXCLUDED.supplier_item_name, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, package_size_g, package_price, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Dill', v_supplier_id, 31.1618, 500, 34.3500, 'CLC70350', 'Aneth (feuille)', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, package_size_g = EXCLUDED.package_size_g, package_price = EXCLUDED.package_price, supplier_item_code = EXCLUDED.supplier_item_code, supplier_item_name = EXCLUDED.supplier_item_name, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, package_size_g, package_price, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Echinacea Augustifolia', v_supplier_id, 77.1106, 250, 42.5000, 'CLC70429', 'Échinacéa angustifolia (racine)', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, package_size_g = EXCLUDED.package_size_g, package_price = EXCLUDED.package_price, supplier_item_code = EXCLUDED.supplier_item_code, supplier_item_name = EXCLUDED.supplier_item_name, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, package_size_g, package_price, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Elderberry', v_supplier_id, 23.1332, 500, 25.5000, 'CLC70472', 'Sureau (baie)', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, package_size_g = EXCLUDED.package_size_g, package_price = EXCLUDED.package_price, supplier_item_code = EXCLUDED.supplier_item_code, supplier_item_name = EXCLUDED.supplier_item_name, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, package_size_g, package_price, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Elderflower', v_supplier_id, 38.3285, 500, 42.2500, 'CLC70520', 'Sureau (fleur)', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, package_size_g = EXCLUDED.package_size_g, package_price = EXCLUDED.package_price, supplier_item_code = EXCLUDED.supplier_item_code, supplier_item_name = EXCLUDED.supplier_item_name, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, package_size_g, package_price, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Eleuthero', v_supplier_id, 32.2050, 500, 35.5000, 'CLC70432', 'Éleuthéro (racine)', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, package_size_g = EXCLUDED.package_size_g, package_price = EXCLUDED.package_price, supplier_item_code = EXCLUDED.supplier_item_code, supplier_item_name = EXCLUDED.supplier_item_name, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, package_size_g, package_price, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Eyebright', v_supplier_id, 29.8010, 500, 32.8500, 'CLC70522', 'Euphraise (herbe)', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, package_size_g = EXCLUDED.package_size_g, package_price = EXCLUDED.package_price, supplier_item_code = EXCLUDED.supplier_item_code, supplier_item_name = EXCLUDED.supplier_item_name, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, package_size_g, package_price, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Fennel', v_supplier_id, 10.2058, 500, 11.2500, 'CLC70436', 'Fenouil (graine entière) B/O INDÉTERMINÉ', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, package_size_g = EXCLUDED.package_size_g, package_price = EXCLUDED.package_price, supplier_item_code = EXCLUDED.supplier_item_code, supplier_item_name = EXCLUDED.supplier_item_name, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, package_size_g, package_price, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Fenugreek', v_supplier_id, 12.2470, 500, 13.5000, 'CLC70506', 'Fenugrec (graines)', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, package_size_g = EXCLUDED.package_size_g, package_price = EXCLUDED.package_price, supplier_item_code = EXCLUDED.supplier_item_code, supplier_item_name = EXCLUDED.supplier_item_name, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, package_size_g, package_price, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Garlic Granules', v_supplier_id, 20.4116, 500, 22.5000, 'CLC70404', 'Ail (granulé)', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, package_size_g = EXCLUDED.package_size_g, package_price = EXCLUDED.package_price, supplier_item_code = EXCLUDED.supplier_item_code, supplier_item_name = EXCLUDED.supplier_item_name, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, package_size_g, package_price, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Garlic Powder', v_supplier_id, 17.9169, 500, 19.7500, 'CLC70400', 'Ail (poudre)', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, package_size_g = EXCLUDED.package_size_g, package_price = EXCLUDED.package_price, supplier_item_code = EXCLUDED.supplier_item_code, supplier_item_name = EXCLUDED.supplier_item_name, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, package_size_g, package_price, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Gentian', v_supplier_id, 43.6356, 500, 48.1000, 'CLC70440', 'Gentiane (racine)', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, package_size_g = EXCLUDED.package_size_g, package_price = EXCLUDED.package_price, supplier_item_code = EXCLUDED.supplier_item_code, supplier_item_name = EXCLUDED.supplier_item_name, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, package_size_g, package_price, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Ginger', v_supplier_id, 19.5045, 500, 21.5000, 'CLC70441', 'Gingembre (poudre)', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, package_size_g = EXCLUDED.package_size_g, package_price = EXCLUDED.package_price, supplier_item_code = EXCLUDED.supplier_item_code, supplier_item_name = EXCLUDED.supplier_item_name, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, package_size_g, package_price, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Goldenrod', v_supplier_id, 27.4423, 500, 30.2500, 'CLC70486', 'Verge d''or (herbe)', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, package_size_g = EXCLUDED.package_size_g, package_price = EXCLUDED.package_price, supplier_item_code = EXCLUDED.supplier_item_code, supplier_item_name = EXCLUDED.supplier_item_name, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, package_size_g, package_price, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Hawthorn', v_supplier_id, 20.6384, 500, 22.7500, 'CLC70408', 'Aubépine bio (fleur / feuille)', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, package_size_g = EXCLUDED.package_size_g, package_price = EXCLUDED.package_price, supplier_item_code = EXCLUDED.supplier_item_code, supplier_item_name = EXCLUDED.supplier_item_name, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, package_size_g, package_price, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Hawthorn Berries', v_supplier_id, 23.1423, 500, 25.5100, 'CLC70407', 'Aubépine bio (baies)', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, package_size_g = EXCLUDED.package_size_g, package_price = EXCLUDED.package_price, supplier_item_code = EXCLUDED.supplier_item_code, supplier_item_name = EXCLUDED.supplier_item_name, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, package_size_g, package_price, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Hibiscus', v_supplier_id, 14.7417, 500, 16.2500, 'CLC70359', 'Hibiscus (fleur)', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, package_size_g = EXCLUDED.package_size_g, package_price = EXCLUDED.package_price, supplier_item_code = EXCLUDED.supplier_item_code, supplier_item_name = EXCLUDED.supplier_item_name, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, package_size_g, package_price, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Horsetail', v_supplier_id, 20.6384, 500, 22.7500, 'CLC70530', 'Prêle (tige stérile)', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, package_size_g = EXCLUDED.package_size_g, package_price = EXCLUDED.package_price, supplier_item_code = EXCLUDED.supplier_item_code, supplier_item_name = EXCLUDED.supplier_item_name, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, package_size_g, package_price, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Juniper', v_supplier_id, 20.6384, 500, 22.7500, 'CLC70439', 'Genevrier (baie)', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, package_size_g = EXCLUDED.package_size_g, package_price = EXCLUDED.package_price, supplier_item_code = EXCLUDED.supplier_item_code, supplier_item_name = EXCLUDED.supplier_item_name, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, package_size_g, package_price, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Kelp', v_supplier_id, 23.3600, 500, 25.7500, 'CLC70570', 'Varech algue (flocons)', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, package_size_g = EXCLUDED.package_size_g, package_price = EXCLUDED.package_price, supplier_item_code = EXCLUDED.supplier_item_code, supplier_item_name = EXCLUDED.supplier_item_name, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, package_size_g, package_price, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Lavender', v_supplier_id, 58.3319, 500, 64.3000, 'CLC70513', 'Lavande (fleur)', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, package_size_g = EXCLUDED.package_size_g, package_price = EXCLUDED.package_price, supplier_item_code = EXCLUDED.supplier_item_code, supplier_item_name = EXCLUDED.supplier_item_name, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, package_size_g, package_price, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Lemon Balm', v_supplier_id, 61.2349, 250, 33.7500, 'CLC80361', 'Mélisse (feuille)', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, package_size_g = EXCLUDED.package_size_g, package_price = EXCLUDED.package_price, supplier_item_code = EXCLUDED.supplier_item_code, supplier_item_name = EXCLUDED.supplier_item_name, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, package_size_g, package_price, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Lemon Peel', v_supplier_id, 56.6990, 500, 62.5000, 'CLC70354', 'Citron (écorce)', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, package_size_g = EXCLUDED.package_size_g, package_price = EXCLUDED.package_price, supplier_item_code = EXCLUDED.supplier_item_code, supplier_item_name = EXCLUDED.supplier_item_name, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, package_size_g, package_price, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Lemongrass', v_supplier_id, 17.0097, 500, 18.7500, 'CLC70510', 'Verveine des Indes (herbe)', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, package_size_g = EXCLUDED.package_size_g, package_price = EXCLUDED.package_price, supplier_item_code = EXCLUDED.supplier_item_code, supplier_item_name = EXCLUDED.supplier_item_name, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, package_size_g, package_price, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Licorice', v_supplier_id, 14.2881, 500, 15.7500, 'CLC70467', 'Réglisse (racine en morceaux)', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, package_size_g = EXCLUDED.package_size_g, package_price = EXCLUDED.package_price, supplier_item_code = EXCLUDED.supplier_item_code, supplier_item_name = EXCLUDED.supplier_item_name, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, package_size_g, package_price, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Linden', v_supplier_id, 38.3285, 500, 42.2500, 'CLC70489', 'Aubier Tilleul (écorce intérieure coupée) bio', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, package_size_g = EXCLUDED.package_size_g, package_price = EXCLUDED.package_price, supplier_item_code = EXCLUDED.supplier_item_code, supplier_item_name = EXCLUDED.supplier_item_name, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, package_size_g, package_price, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Linden Flower', v_supplier_id, 82.5537, 250, 45.5000, 'CLC70534', 'Tilleul (fleur / bractée) B/O INDÉTERMINÉ', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, package_size_g = EXCLUDED.package_size_g, package_price = EXCLUDED.package_price, supplier_item_code = EXCLUDED.supplier_item_code, supplier_item_name = EXCLUDED.supplier_item_name, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, package_size_g, package_price, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Marjoram', v_supplier_id, 25.1744, 500, 27.7500, 'CLC70373', 'Marjolaine (feuille)', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, package_size_g = EXCLUDED.package_size_g, package_price = EXCLUDED.package_price, supplier_item_code = EXCLUDED.supplier_item_code, supplier_item_name = EXCLUDED.supplier_item_name, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, package_size_g, package_price, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Marshmallow', v_supplier_id, 24.7208, 500, 27.2500, 'CLC70445', 'Guimauve (racine)', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, package_size_g = EXCLUDED.package_size_g, package_price = EXCLUDED.package_price, supplier_item_code = EXCLUDED.supplier_item_code, supplier_item_name = EXCLUDED.supplier_item_name, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, package_size_g, package_price, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Meadowsweet', v_supplier_id, 24.7208, 500, 27.2500, 'CLC70531', 'Reine des prés (herbe)', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, package_size_g = EXCLUDED.package_size_g, package_price = EXCLUDED.package_price, supplier_item_code = EXCLUDED.supplier_item_code, supplier_item_name = EXCLUDED.supplier_item_name, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, package_size_g, package_price, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Milk Thistle', v_supplier_id, 22.9064, 500, 25.2500, 'CLC70423', 'Chardon marie (graine)', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, package_size_g = EXCLUDED.package_size_g, package_price = EXCLUDED.package_price, supplier_item_code = EXCLUDED.supplier_item_code, supplier_item_name = EXCLUDED.supplier_item_name, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, package_size_g, package_price, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Mullein', v_supplier_id, 30.3907, 250, 16.7500, 'CLC80451', 'Molène (feuille)', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, package_size_g = EXCLUDED.package_size_g, package_price = EXCLUDED.package_price, supplier_item_code = EXCLUDED.supplier_item_code, supplier_item_name = EXCLUDED.supplier_item_name, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, package_size_g, package_price, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Nettle Leaf', v_supplier_id, 27.1702, 500, 29.9500, 'CLC70457', 'Ortie (feuille)', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, package_size_g = EXCLUDED.package_size_g, package_price = EXCLUDED.package_price, supplier_item_code = EXCLUDED.supplier_item_code, supplier_item_name = EXCLUDED.supplier_item_name, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, package_size_g, package_price, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Nutmeg', v_supplier_id, 50.8023, 500, 56.0000, 'CLC70558', 'Muscade (moulue)', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, package_size_g = EXCLUDED.package_size_g, package_price = EXCLUDED.package_price, supplier_item_code = EXCLUDED.supplier_item_code, supplier_item_name = EXCLUDED.supplier_item_name, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, package_size_g, package_price, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Ocimum', v_supplier_id, 65.2719, 500, 71.9500, 'CLC70544', 'Basilic sacré (feuille)', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, package_size_g = EXCLUDED.package_size_g, package_price = EXCLUDED.package_price, supplier_item_code = EXCLUDED.supplier_item_code, supplier_item_name = EXCLUDED.supplier_item_name, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, package_size_g, package_price, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Onion Flakes', v_supplier_id, 20.4116, 500, 22.5000, 'CLC70365', 'Oignons (flocons)', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, package_size_g = EXCLUDED.package_size_g, package_price = EXCLUDED.package_price, supplier_item_code = EXCLUDED.supplier_item_code, supplier_item_name = EXCLUDED.supplier_item_name, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, package_size_g, package_price, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Oregano', v_supplier_id, 20.6838, 250, 11.4000, 'CLC70366', 'Origan', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, package_size_g = EXCLUDED.package_size_g, package_price = EXCLUDED.package_price, supplier_item_code = EXCLUDED.supplier_item_code, supplier_item_name = EXCLUDED.supplier_item_name, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, package_size_g, package_price, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Paprika', v_supplier_id, 19.2777, 500, 21.2500, 'CLC70367', 'Paprika (poudre)', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, package_size_g = EXCLUDED.package_size_g, package_price = EXCLUDED.package_price, supplier_item_code = EXCLUDED.supplier_item_code, supplier_item_name = EXCLUDED.supplier_item_name, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, package_size_g, package_price, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Parsley', v_supplier_id, 38.5553, 500, 42.5000, 'CLC70368', 'Persil (feuille)', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, package_size_g = EXCLUDED.package_size_g, package_price = EXCLUDED.package_price, supplier_item_code = EXCLUDED.supplier_item_code, supplier_item_name = EXCLUDED.supplier_item_name, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, package_size_g, package_price, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Passion Flower', v_supplier_id, 49.4415, 500, 54.5000, 'CLC70459', 'Passiflore (herbe)', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, package_size_g = EXCLUDED.package_size_g, package_price = EXCLUDED.package_price, supplier_item_code = EXCLUDED.supplier_item_code, supplier_item_name = EXCLUDED.supplier_item_name, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, package_size_g, package_price, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Peppermint', v_supplier_id, 17.6901, 250, 9.7500, 'CLC80450', 'Menthe poivrée (feuille)', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, package_size_g = EXCLUDED.package_size_g, package_price = EXCLUDED.package_price, supplier_item_code = EXCLUDED.supplier_item_code, supplier_item_name = EXCLUDED.supplier_item_name, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, package_size_g, package_price, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Poppy', v_supplier_id, 22.9064, 500, 25.2500, 'CLC70377', 'Pavot (graine)', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, package_size_g = EXCLUDED.package_size_g, package_price = EXCLUDED.package_price, supplier_item_code = EXCLUDED.supplier_item_code, supplier_item_name = EXCLUDED.supplier_item_name, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, package_size_g, package_price, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Psyllium', v_supplier_id, 19.7313, 500, 21.7500, 'CLC70465', 'Psyllium (écorce) (poudre)', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, package_size_g = EXCLUDED.package_size_g, package_price = EXCLUDED.package_price, supplier_item_code = EXCLUDED.supplier_item_code, supplier_item_name = EXCLUDED.supplier_item_name, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, package_size_g, package_price, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Raspberry Leaf', v_supplier_id, 33.3390, 500, 36.7500, 'CLC70437', 'Framboisier (feuille)', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, package_size_g = EXCLUDED.package_size_g, package_price = EXCLUDED.package_price, supplier_item_code = EXCLUDED.supplier_item_code, supplier_item_name = EXCLUDED.supplier_item_name, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, package_size_g, package_price, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Red Clover', v_supplier_id, 40.1429, 500, 44.2500, 'CLC70474', 'Trèfle rouge (fleur / feuille coupées)', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, package_size_g = EXCLUDED.package_size_g, package_price = EXCLUDED.package_price, supplier_item_code = EXCLUDED.supplier_item_code, supplier_item_name = EXCLUDED.supplier_item_name, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, package_size_g, package_price, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Reishi', v_supplier_id, 50.3487, 250, 27.7500, 'CLC70487', 'Reishi (champignon tranché)', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, package_size_g = EXCLUDED.package_size_g, package_price = EXCLUDED.package_price, supplier_item_code = EXCLUDED.supplier_item_code, supplier_item_name = EXCLUDED.supplier_item_name, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, package_size_g, package_price, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Rose', v_supplier_id, 40.3697, 250, 22.2500, 'CLC70214', 'Pétales de roses', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, package_size_g = EXCLUDED.package_size_g, package_price = EXCLUDED.package_price, supplier_item_code = EXCLUDED.supplier_item_code, supplier_item_name = EXCLUDED.supplier_item_name, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, package_size_g, package_price, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Rosehip', v_supplier_id, 29.2567, 500, 32.2500, 'CLC70430', 'Églantier (baie entière)', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, package_size_g = EXCLUDED.package_size_g, package_price = EXCLUDED.package_price, supplier_item_code = EXCLUDED.supplier_item_code, supplier_item_name = EXCLUDED.supplier_item_name, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, package_size_g, package_price, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Rosemary', v_supplier_id, 20.8199, 500, 22.9500, 'CLC70370', 'Romarin (feuille)', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, package_size_g = EXCLUDED.package_size_g, package_price = EXCLUDED.package_price, supplier_item_code = EXCLUDED.supplier_item_code, supplier_item_name = EXCLUDED.supplier_item_name, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, package_size_g, package_price, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Rumex', v_supplier_id, 28.5763, 250, 15.7500, 'CLC70460', 'Patience (racine morceaux)', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, package_size_g = EXCLUDED.package_size_g, package_price = EXCLUDED.package_price, supplier_item_code = EXCLUDED.supplier_item_code, supplier_item_name = EXCLUDED.supplier_item_name, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, package_size_g, package_price, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Sage', v_supplier_id, 28.5763, 500, 31.5000, 'CLC70372', 'Sauge entière (feuille)', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, package_size_g = EXCLUDED.package_size_g, package_price = EXCLUDED.package_price, supplier_item_code = EXCLUDED.supplier_item_code, supplier_item_name = EXCLUDED.supplier_item_name, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, package_size_g, package_price, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Savory', v_supplier_id, 20.4116, 500, 22.5000, 'CLC70371', 'Sarriette (feuille) B/O INDÉTERMINÉ', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, package_size_g = EXCLUDED.package_size_g, package_price = EXCLUDED.package_price, supplier_item_code = EXCLUDED.supplier_item_code, supplier_item_name = EXCLUDED.supplier_item_name, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, package_size_g, package_price, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Schisandra', v_supplier_id, 42.5469, 500, 46.9000, 'CLC70442', 'Schisandra (baie entière)', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, package_size_g = EXCLUDED.package_size_g, package_price = EXCLUDED.package_price, supplier_item_code = EXCLUDED.supplier_item_code, supplier_item_name = EXCLUDED.supplier_item_name, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, package_size_g, package_price, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Scutellaria', v_supplier_id, 61.2349, 500, 67.5000, 'CLC70471', 'Scutellaire (herbe)', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, package_size_g = EXCLUDED.package_size_g, package_price = EXCLUDED.package_price, supplier_item_code = EXCLUDED.supplier_item_code, supplier_item_name = EXCLUDED.supplier_item_name, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, package_size_g, package_price, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Shatavari', v_supplier_id, 22.2260, 500, 24.5000, 'CLC70127', 'Shatavari (racine poudre)', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, package_size_g = EXCLUDED.package_size_g, package_price = EXCLUDED.package_price, supplier_item_code = EXCLUDED.supplier_item_code, supplier_item_name = EXCLUDED.supplier_item_name, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, package_size_g, package_price, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Slippery Elm', v_supplier_id, 65.9976, 500, 72.7500, 'CLC70456', 'Orme rouge (écorce en poudre)', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, package_size_g = EXCLUDED.package_size_g, package_price = EXCLUDED.package_price, supplier_item_code = EXCLUDED.supplier_item_code, supplier_item_name = EXCLUDED.supplier_item_name, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, package_size_g, package_price, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Spearmint', v_supplier_id, 17.6901, 250, 9.7500, 'CLC80525', 'Menthe douce (feuille)', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, package_size_g = EXCLUDED.package_size_g, package_price = EXCLUDED.package_price, supplier_item_code = EXCLUDED.supplier_item_code, supplier_item_name = EXCLUDED.supplier_item_name, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, package_size_g, package_price, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'St John''s Wort', v_supplier_id, 33.5658, 250, 18.5000, 'CLC80526', 'Millepertuis (fleur / feuille)', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, package_size_g = EXCLUDED.package_size_g, package_price = EXCLUDED.package_price, supplier_item_code = EXCLUDED.supplier_item_code, supplier_item_name = EXCLUDED.supplier_item_name, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, package_size_g, package_price, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Thyme', v_supplier_id, 17.4633, 500, 19.2500, 'CLC70374', 'Thym (feuille)', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, package_size_g = EXCLUDED.package_size_g, package_price = EXCLUDED.package_price, supplier_item_code = EXCLUDED.supplier_item_code, supplier_item_name = EXCLUDED.supplier_item_name, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, package_size_g, package_price, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Turmeric', v_supplier_id, 10.2058, 500, 11.2500, 'CLC70375', 'Curcuma (poudre)', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, package_size_g = EXCLUDED.package_size_g, package_price = EXCLUDED.package_price, supplier_item_code = EXCLUDED.supplier_item_code, supplier_item_name = EXCLUDED.supplier_item_name, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, package_size_g, package_price, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Uva Ursi', v_supplier_id, 25.1744, 500, 27.7500, 'CLC70415', 'Busserole (feuille)', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, package_size_g = EXCLUDED.package_size_g, package_price = EXCLUDED.package_price, supplier_item_code = EXCLUDED.supplier_item_code, supplier_item_name = EXCLUDED.supplier_item_name, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, package_size_g, package_price, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Valerian', v_supplier_id, 31.2978, 500, 34.5000, 'CLC70475', 'Valériane (racine) bio', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, package_size_g = EXCLUDED.package_size_g, package_price = EXCLUDED.package_price, supplier_item_code = EXCLUDED.supplier_item_code, supplier_item_name = EXCLUDED.supplier_item_name, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, package_size_g, package_price, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Vitex', v_supplier_id, 17.9169, 500, 19.7500, 'CLC70535', 'Vitex bio (fruit)', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, package_size_g = EXCLUDED.package_size_g, package_price = EXCLUDED.package_price, supplier_item_code = EXCLUDED.supplier_item_code, supplier_item_name = EXCLUDED.supplier_item_name, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, package_size_g, package_price, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'White Willow Bark', v_supplier_id, 13.5624, 500, 14.9500, 'CLC70533', 'Saule blanc (écorce)', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, package_size_g = EXCLUDED.package_size_g, package_price = EXCLUDED.package_price, supplier_item_code = EXCLUDED.supplier_item_code, supplier_item_name = EXCLUDED.supplier_item_name, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, package_size_g, package_price, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Yarrow', v_supplier_id, 18.0983, 500, 19.9500, 'CLC70401', 'Achillée millefeuille (fleur)', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, package_size_g = EXCLUDED.package_size_g, package_price = EXCLUDED.package_price, supplier_item_code = EXCLUDED.supplier_item_code, supplier_item_name = EXCLUDED.supplier_item_name, last_updated = CURRENT_DATE;

END $$;
