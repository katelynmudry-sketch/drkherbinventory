-- Organic Connections bulk herb price import (CAD, per 455 g lb)
-- Generated: 2026-11-10T17:04:57.904Z
-- Run this in your Supabase SQL Editor

-- Step 1: Insert supplier
INSERT INTO public.suppliers (user_id, name, url)
VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Organic Connections', 'https://www.organicconnections.ca')
ON CONFLICT (user_id, name) DO NOTHING;

-- Step 2: Insert pricing rows
DO $$
DECLARE v_supplier_id UUID;
BEGIN
  SELECT id INTO v_supplier_id FROM public.suppliers
  WHERE user_id = 'b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4' AND name = 'Organic Connections';

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, package_size_g, package_price, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Agrimony', v_supplier_id, 36.0000, 455, 36.0000, 'C.500', 'Agrimony Herb C/S', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, package_size_g = EXCLUDED.package_size_g, package_price = EXCLUDED.package_price, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, package_size_g, package_price, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Alfalfa', v_supplier_id, 22.2000, 455, 22.2000, 'C.773', 'Alfalfa Leaf Powder', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, package_size_g = EXCLUDED.package_size_g, package_price = EXCLUDED.package_price, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, package_size_g, package_price, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Althea', v_supplier_id, 24.1500, 455, 24.1500, 'C.886', 'Marshmallow Root C/S', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, package_size_g = EXCLUDED.package_size_g, package_price = EXCLUDED.package_price, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, package_size_g, package_price, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Angelica', v_supplier_id, 41.7400, 455, 41.7400, 'C.504', 'Angelica Root C/S', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, package_size_g = EXCLUDED.package_size_g, package_price = EXCLUDED.package_price, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, package_size_g, package_price, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Anise', v_supplier_id, 13.8600, 455, 13.8600, 'C.2615', 'Anise Seed Whole', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, package_size_g = EXCLUDED.package_size_g, package_price = EXCLUDED.package_price, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, package_size_g, package_price, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Artichoke', v_supplier_id, 34.9000, 455, 34.9000, 'C.9110', 'Artichoke Leaf C/S', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, package_size_g = EXCLUDED.package_size_g, package_price = EXCLUDED.package_price, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, package_size_g, package_price, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Ashwagandha', v_supplier_id, 8.4200, 455, 8.4200, 'C.1330', 'Ashwagandha Root Powder', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, package_size_g = EXCLUDED.package_size_g, package_price = EXCLUDED.package_price, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, package_size_g, package_price, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Astragalus', v_supplier_id, 20.7600, 455, 20.7600, 'C.889C', 'Astragalus Root C/S', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, package_size_g = EXCLUDED.package_size_g, package_price = EXCLUDED.package_price, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, package_size_g, package_price, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Avena', v_supplier_id, 32.3000, 227.5, 16.1500, 'C.8465', 'Oatstraw green tops C/S', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, package_size_g = EXCLUDED.package_size_g, package_price = EXCLUDED.package_price, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, package_size_g, package_price, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Bayberry Root Bark', v_supplier_id, 94.7700, 455, 94.7700, 'C.501', 'Bayberry Root Bark C/S', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, package_size_g = EXCLUDED.package_size_g, package_price = EXCLUDED.package_price, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, package_size_g, package_price, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Birch Leaf', v_supplier_id, 21.7700, 455, 21.7700, 'C.9112', 'Birch Leaves C/S', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, package_size_g = EXCLUDED.package_size_g, package_price = EXCLUDED.package_price, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, package_size_g, package_price, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Black Cohosh', v_supplier_id, 66.7200, 455, 66.7200, 'C.2695', 'Black Cohosh Root C/S', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, package_size_g = EXCLUDED.package_size_g, package_price = EXCLUDED.package_price, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, package_size_g, package_price, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Black Pepper', v_supplier_id, 16.9000, 455, 16.9000, 'C.2601', 'Pepper Black 14 Mesh (Coarse Grind)', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, package_size_g = EXCLUDED.package_size_g, package_price = EXCLUDED.package_price, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, package_size_g, package_price, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Blessed Thistle', v_supplier_id, 22.5400, 227.5, 11.2700, 'C.5145', 'Blessed Thistle Herb C/S', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, package_size_g = EXCLUDED.package_size_g, package_price = EXCLUDED.package_price, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, package_size_g, package_price, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Blue Vervain', v_supplier_id, 71.8000, 455, 71.8000, 'C.2559', 'Vervain (Blue) C/S', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, package_size_g = EXCLUDED.package_size_g, package_price = EXCLUDED.package_price, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, package_size_g, package_price, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Boneset', v_supplier_id, 65.3000, 455, 65.3000, 'C.519', 'Boneset Herb C/S', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, package_size_g = EXCLUDED.package_size_g, package_price = EXCLUDED.package_price, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, package_size_g, package_price, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Borage', v_supplier_id, 78.4000, 455, 78.4000, 'C.520', 'Borage C/S', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, package_size_g = EXCLUDED.package_size_g, package_price = EXCLUDED.package_price, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, package_size_g, package_price, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Bugleweed', v_supplier_id, 68.8600, 455, 68.8600, 'C.9156', 'Bugleweed C/S', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, package_size_g = EXCLUDED.package_size_g, package_price = EXCLUDED.package_price, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, package_size_g, package_price, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Burdock', v_supplier_id, 21.2200, 455, 21.2200, 'C.810', 'Burdock Root C/S', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, package_size_g = EXCLUDED.package_size_g, package_price = EXCLUDED.package_price, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, package_size_g, package_price, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Calamus', v_supplier_id, 43.0900, 455, 43.0900, 'C.525', 'Calamus Root C/S', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, package_size_g = EXCLUDED.package_size_g, package_price = EXCLUDED.package_price, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, package_size_g, package_price, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Calendula', v_supplier_id, 18.7400, 227.5, 9.3700, 'C.802', 'Calendula Flowers Whole', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, package_size_g = EXCLUDED.package_size_g, package_price = EXCLUDED.package_price, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, package_size_g, package_price, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'California Poppy', v_supplier_id, 108.4000, 227.5, 54.2000, 'C.2598', 'California Poppy C/S', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, package_size_g = EXCLUDED.package_size_g, package_price = EXCLUDED.package_price, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, package_size_g, package_price, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Cat''s Claw', v_supplier_id, 21.1000, 455, 21.1000, 'C.2528', 'Cat''s Claw Bark C/S', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, package_size_g = EXCLUDED.package_size_g, package_price = EXCLUDED.package_price, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, package_size_g, package_price, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Catnip', v_supplier_id, 27.1500, 455, 27.1500, 'C.777', 'Catnip Leaf & Flower  TBC', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, package_size_g = EXCLUDED.package_size_g, package_price = EXCLUDED.package_price, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, package_size_g, package_price, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Chamomile', v_supplier_id, 18.7400, 227.5, 9.3700, 'C.5312', 'Chamomile Flowers Whole', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, package_size_g = EXCLUDED.package_size_g, package_price = EXCLUDED.package_price, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, package_size_g, package_price, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Cinnamon', v_supplier_id, 11.5200, 455, 11.5200, 'C.396', 'Cinnamon (Cassia Indonesian) Powder', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, package_size_g = EXCLUDED.package_size_g, package_price = EXCLUDED.package_price, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, package_size_g, package_price, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Cleavers', v_supplier_id, 32.5400, 227.5, 16.2700, 'C.5385', 'Cleavers Herb C/S', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, package_size_g = EXCLUDED.package_size_g, package_price = EXCLUDED.package_price, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, package_size_g, package_price, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Comfrey Root', v_supplier_id, 25.6600, 455, 25.6600, 'C.542C', 'Comfrey Root C/S', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, package_size_g = EXCLUDED.package_size_g, package_price = EXCLUDED.package_price, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, package_size_g, package_price, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Couch Grass', v_supplier_id, 45.6500, 455, 45.6500, 'C.9159', 'Couch Grass Root C/S', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, package_size_g = EXCLUDED.package_size_g, package_price = EXCLUDED.package_price, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, package_size_g, package_price, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Damiana', v_supplier_id, 43.8200, 227.5, 21.9100, 'C.5492', 'Damiana Leaf C/S', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, package_size_g = EXCLUDED.package_size_g, package_price = EXCLUDED.package_price, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, package_size_g, package_price, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Dandelion Leaf', v_supplier_id, 31.5000, 227.5, 15.7500, 'C.2524', 'Dandelion Leaf C/S', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, package_size_g = EXCLUDED.package_size_g, package_price = EXCLUDED.package_price, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, package_size_g, package_price, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Dandelion Root', v_supplier_id, 26.0000, 455, 26.0000, 'C.963', 'Dandelion Root C/S', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, package_size_g = EXCLUDED.package_size_g, package_price = EXCLUDED.package_price, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, package_size_g, package_price, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Devil''s Claw', v_supplier_id, 79.9000, 227.5, 39.9500, 'C.5532', 'Devil''s Claw Root C/S', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, package_size_g = EXCLUDED.package_size_g, package_price = EXCLUDED.package_price, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, package_size_g, package_price, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Dong Quai', v_supplier_id, 34.2100, 455, 34.2100, 'C.931', 'Dong Quai Root C/S', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, package_size_g = EXCLUDED.package_size_g, package_price = EXCLUDED.package_price, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, package_size_g, package_price, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Echinacea Augustifolia', v_supplier_id, 40.1000, 455, 40.1000, 'C.761', 'Echinacea Angustifolia Herb C/S', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, package_size_g = EXCLUDED.package_size_g, package_price = EXCLUDED.package_price, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, package_size_g, package_price, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Echinacea Purpurea Leaf', v_supplier_id, 23.4500, 455, 23.4500, 'C.769T', 'Echinacea Purpurea Herb TBC', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, package_size_g = EXCLUDED.package_size_g, package_price = EXCLUDED.package_price, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, package_size_g, package_price, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Echinacea Purpurea Root', v_supplier_id, 39.7700, 455, 39.7700, 'C.811', 'Echinacea Purpurea Root C/S', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, package_size_g = EXCLUDED.package_size_g, package_price = EXCLUDED.package_price, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, package_size_g, package_price, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Eleuthero', v_supplier_id, 29.8200, 455, 29.8200, 'C.976', 'Eleuthero Root C/S', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, package_size_g = EXCLUDED.package_size_g, package_price = EXCLUDED.package_price, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, package_size_g, package_price, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Fennel', v_supplier_id, 14.6000, 455, 14.6000, 'C.2723', 'Fennel Seed Powder', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, package_size_g = EXCLUDED.package_size_g, package_price = EXCLUDED.package_price, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, package_size_g, package_price, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Feverfew', v_supplier_id, 68.7500, 455, 68.7500, 'C.808C', 'Feverfew Herb C/S', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, package_size_g = EXCLUDED.package_size_g, package_price = EXCLUDED.package_price, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, package_size_g, package_price, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Gentian', v_supplier_id, 86.2000, 227.5, 43.1000, 'C.5682', 'Gentian Root C/S', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, package_size_g = EXCLUDED.package_size_g, package_price = EXCLUDED.package_price, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, package_size_g, package_price, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Ginger', v_supplier_id, 8.3400, 455, 8.3400, 'C.370', 'Ginger Root Powder', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, package_size_g = EXCLUDED.package_size_g, package_price = EXCLUDED.package_price, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, package_size_g, package_price, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Ginkgo', v_supplier_id, 23.4200, 455, 23.4200, 'C.2697', 'Ginkgo Leaf C/S', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, package_size_g = EXCLUDED.package_size_g, package_price = EXCLUDED.package_price, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, package_size_g, package_price, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Goldenrod', v_supplier_id, 47.5300, 455, 47.5300, 'C.569', 'Goldenrod Herb C/S', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, package_size_g = EXCLUDED.package_size_g, package_price = EXCLUDED.package_price, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, package_size_g, package_price, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Gotu Kola', v_supplier_id, 9.8800, 455, 9.8800, 'C.573', 'Gotu Kola Herb C/S', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, package_size_g = EXCLUDED.package_size_g, package_price = EXCLUDED.package_price, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, package_size_g, package_price, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Hawthorn', v_supplier_id, 18.8600, 455, 18.8600, 'C.314', 'Hawthorn Leaf & Flower C/S', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, package_size_g = EXCLUDED.package_size_g, package_price = EXCLUDED.package_price, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, package_size_g, package_price, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Horsetail', v_supplier_id, 18.8100, 455, 18.8100, 'C.968', 'Horsetail (Shavegrass) Herb C/S', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, package_size_g = EXCLUDED.package_size_g, package_price = EXCLUDED.package_price, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, package_size_g, package_price, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Hyssop', v_supplier_id, 25.7800, 455, 25.7800, 'C.988', 'Hyssop Herb C/S', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, package_size_g = EXCLUDED.package_size_g, package_price = EXCLUDED.package_price, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, package_size_g, package_price, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Inula', v_supplier_id, 26.7100, 455, 26.7100, 'C.559', 'Elecampane Root C/S', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, package_size_g = EXCLUDED.package_size_g, package_price = EXCLUDED.package_price, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, package_size_g, package_price, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Juniper', v_supplier_id, 19.6500, 455, 19.6500, 'C.2545', 'Juniper Berries Whole', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, package_size_g = EXCLUDED.package_size_g, package_price = EXCLUDED.package_price, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, package_size_g, package_price, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Lady''s Mantle', v_supplier_id, 59.0200, 227.5, 29.5100, 'C.5925', 'Lady''s Mantle Herb C/S', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, package_size_g = EXCLUDED.package_size_g, package_price = EXCLUDED.package_price, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, package_size_g, package_price, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Lavender', v_supplier_id, 25.9000, 227.5, 12.9500, 'C.1301', 'Lavender Flowers (English) Whole', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, package_size_g = EXCLUDED.package_size_g, package_price = EXCLUDED.package_price, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, package_size_g, package_price, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Lemon Balm', v_supplier_id, 22.9800, 227.5, 11.4900, 'C.3592', 'Lemon Balm Leaf C/S', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, package_size_g = EXCLUDED.package_size_g, package_price = EXCLUDED.package_price, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, package_size_g, package_price, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Lemongrass', v_supplier_id, 12.4000, 455, 12.4000, 'C.596', 'Lemongrass C/S', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, package_size_g = EXCLUDED.package_size_g, package_price = EXCLUDED.package_price, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, package_size_g, package_price, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Licorice', v_supplier_id, 9.4400, 455, 9.4400, 'C.5981', 'Licorice Root C/S', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, package_size_g = EXCLUDED.package_size_g, package_price = EXCLUDED.package_price, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, package_size_g, package_price, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Linden', v_supplier_id, 35.6600, 455, 35.6600, 'C.972', 'Linden Leaf & Flower C/S', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, package_size_g = EXCLUDED.package_size_g, package_price = EXCLUDED.package_price, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, package_size_g, package_price, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Lycopus', v_supplier_id, 68.8600, 455, 68.8600, 'C.9156', 'Bugleweed C/S', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, package_size_g = EXCLUDED.package_size_g, package_price = EXCLUDED.package_price, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, package_size_g, package_price, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Maca', v_supplier_id, 24.4800, 455, 24.4800, 'C.9833', 'Maca Root Yellow Powder Gelatinized', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, package_size_g = EXCLUDED.package_size_g, package_price = EXCLUDED.package_price, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, package_size_g, package_price, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Marshmallow', v_supplier_id, 24.1500, 455, 24.1500, 'C.886', 'Marshmallow Root C/S', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, package_size_g = EXCLUDED.package_size_g, package_price = EXCLUDED.package_price, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, package_size_g, package_price, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Meadowsweet', v_supplier_id, 37.5100, 455, 37.5100, 'C.996', 'Meadowsweet Herb C/S', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, package_size_g = EXCLUDED.package_size_g, package_price = EXCLUDED.package_price, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, package_size_g, package_price, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Milk Thistle', v_supplier_id, 17.9800, 455, 17.9800, 'C.952', 'Milk Thistle Seed Whole', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, package_size_g = EXCLUDED.package_size_g, package_price = EXCLUDED.package_price, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, package_size_g, package_price, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Motherwort', v_supplier_id, 45.1000, 455, 45.1000, 'C.2581', 'Motherwort Herb C/S', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, package_size_g = EXCLUDED.package_size_g, package_price = EXCLUDED.package_price, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, package_size_g, package_price, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Mugwort', v_supplier_id, 21.4200, 455, 21.4200, 'C.2652', 'Mugwort Herb C/S', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, package_size_g = EXCLUDED.package_size_g, package_price = EXCLUDED.package_price, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, package_size_g, package_price, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Mullein', v_supplier_id, 23.2600, 227.5, 11.6300, 'C.2759', 'Mullein Leaf C/S', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, package_size_g = EXCLUDED.package_size_g, package_price = EXCLUDED.package_price, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, package_size_g, package_price, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Nettle Root', v_supplier_id, 67.7600, 455, 67.7600, 'C.2566', 'Nettle Root C/S', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, package_size_g = EXCLUDED.package_size_g, package_price = EXCLUDED.package_price, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, package_size_g, package_price, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Oak', v_supplier_id, 37.8400, 455, 37.8400, 'C.2588', 'White Oak Bark C/S', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, package_size_g = EXCLUDED.package_size_g, package_price = EXCLUDED.package_price, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, package_size_g, package_price, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Ocimum', v_supplier_id, 11.0400, 227.5, 5.5200, 'C.3566', 'Holy Basil (Tulsi: Krishna) C/S', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, package_size_g = EXCLUDED.package_size_g, package_price = EXCLUDED.package_price, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, package_size_g, package_price, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Olive Leaf', v_supplier_id, 27.8300, 455, 27.8300, 'C.2714', 'Olive Leaf C/S', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, package_size_g = EXCLUDED.package_size_g, package_price = EXCLUDED.package_price, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, package_size_g, package_price, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Orange Peel', v_supplier_id, 23.3200, 455, 23.3200, 'C.985', 'Orange Peel C/S', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, package_size_g = EXCLUDED.package_size_g, package_price = EXCLUDED.package_price, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, package_size_g, package_price, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Oregano', v_supplier_id, 17.8300, 455, 17.8300, 'C.281', 'Oregano Leaf C/S', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, package_size_g = EXCLUDED.package_size_g, package_price = EXCLUDED.package_price, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, package_size_g, package_price, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Oregon Grape', v_supplier_id, 36.6800, 455, 36.6800, 'C.782', 'Oregon Grape Root C/S', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, package_size_g = EXCLUDED.package_size_g, package_price = EXCLUDED.package_price, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, package_size_g, package_price, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Parsley', v_supplier_id, 30.5600, 227.5, 15.2800, 'C.1802', 'Parsley Leaf Flakes', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, package_size_g = EXCLUDED.package_size_g, package_price = EXCLUDED.package_price, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, package_size_g, package_price, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Peony', v_supplier_id, 55.9000, 455, 55.9000, 'C.1057', 'White Peony Root C/S', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, package_size_g = EXCLUDED.package_size_g, package_price = EXCLUDED.package_price, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, package_size_g, package_price, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Peppermint', v_supplier_id, 13.7800, 227.5, 6.8900, 'C.780', 'Peppermint Leaf C/S', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, package_size_g = EXCLUDED.package_size_g, package_price = EXCLUDED.package_price, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, package_size_g, package_price, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Periwinkle', v_supplier_id, 73.0300, 455, 73.0300, 'C.9157', 'Periwinkle Herb C/S', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, package_size_g = EXCLUDED.package_size_g, package_price = EXCLUDED.package_price, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, package_size_g, package_price, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Plantain', v_supplier_id, 19.4800, 455, 19.4800, 'C.632', 'Plantain Leaf C/S', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, package_size_g = EXCLUDED.package_size_g, package_price = EXCLUDED.package_price, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, package_size_g, package_price, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Poppy', v_supplier_id, 108.4000, 227.5, 54.2000, 'C.2598', 'California Poppy C/S', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, package_size_g = EXCLUDED.package_size_g, package_price = EXCLUDED.package_price, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, package_size_g, package_price, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Raspberry Leaf', v_supplier_id, 18.5200, 455, 18.5200, 'C.732', 'Raspberry Red Leaf C/S', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, package_size_g = EXCLUDED.package_size_g, package_price = EXCLUDED.package_price, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, package_size_g, package_price, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Red Clover', v_supplier_id, 24.6200, 227.5, 12.3100, 'C.7685', 'Red Clover Leaf & Blossom C/S', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, package_size_g = EXCLUDED.package_size_g, package_price = EXCLUDED.package_price, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, package_size_g, package_price, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Rose', v_supplier_id, 25.2000, 227.5, 12.6000, 'C.6465', 'Rose (Cabbage) Buds & Petals Red', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, package_size_g = EXCLUDED.package_size_g, package_price = EXCLUDED.package_price, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, package_size_g, package_price, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Rosemary', v_supplier_id, 11.6200, 455, 11.6200, 'C.379', 'Rosemary Leaf Whole', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, package_size_g = EXCLUDED.package_size_g, package_price = EXCLUDED.package_price, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, package_size_g, package_price, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Rue', v_supplier_id, 46.3800, 227.5, 23.1900, 'C.9122', 'Goat''s Rue Herb C/S', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, package_size_g = EXCLUDED.package_size_g, package_price = EXCLUDED.package_price, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, package_size_g, package_price, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Sage', v_supplier_id, 17.4800, 227.5, 8.7400, 'C.2365', 'Sage Leaf C/S', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, package_size_g = EXCLUDED.package_size_g, package_price = EXCLUDED.package_price, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, package_size_g, package_price, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Sarsaparilla', v_supplier_id, 22.7800, 455, 22.7800, 'C.883', 'Sarsaparilla Root C/S Mexican', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, package_size_g = EXCLUDED.package_size_g, package_price = EXCLUDED.package_price, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, package_size_g, package_price, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Schisandra', v_supplier_id, 69.7300, 455, 69.7300, 'C.901', 'Schisandra Berries Whole', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, package_size_g = EXCLUDED.package_size_g, package_price = EXCLUDED.package_price, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, package_size_g, package_price, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Scutellaria', v_supplier_id, 45.2300, 455, 45.2300, 'C.844T', 'Skullcap Herb TBC', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, package_size_g = EXCLUDED.package_size_g, package_price = EXCLUDED.package_price, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, package_size_g, package_price, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Shatavari', v_supplier_id, 11.3200, 455, 11.3200, 'C.9181', 'Shatavari Root C/S', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, package_size_g = EXCLUDED.package_size_g, package_price = EXCLUDED.package_price, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, package_size_g, package_price, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Shepherd''s Purse', v_supplier_id, 37.7700, 455, 37.7700, 'C.657', 'Shepherd''s Purse Herb C/S', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, package_size_g = EXCLUDED.package_size_g, package_price = EXCLUDED.package_price, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, package_size_g, package_price, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Thyme', v_supplier_id, 16.6800, 455, 16.6800, 'C.378', 'Thyme Leaf Whole', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, package_size_g = EXCLUDED.package_size_g, package_price = EXCLUDED.package_price, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, package_size_g, package_price, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Tulsi', v_supplier_id, 11.0400, 227.5, 5.5200, 'C.3566', 'Holy Basil (Tulsi: Krishna) C/S', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, package_size_g = EXCLUDED.package_size_g, package_price = EXCLUDED.package_price, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, package_size_g, package_price, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Valerian', v_supplier_id, 39.8400, 455, 39.8400, 'C.888', 'Valerian Root C/S', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, package_size_g = EXCLUDED.package_size_g, package_price = EXCLUDED.package_price, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, package_size_g, package_price, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'White Oak', v_supplier_id, 37.8400, 455, 37.8400, 'C.2588', 'White Oak Bark C/S', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, package_size_g = EXCLUDED.package_size_g, package_price = EXCLUDED.package_price, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, package_size_g, package_price, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Wild Lettuce', v_supplier_id, 53.2900, 455, 53.2900, 'C.9164', 'Wild Lettuce Leaf C/S', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, package_size_g = EXCLUDED.package_size_g, package_price = EXCLUDED.package_price, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, package_size_g, package_price, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Wild Yam', v_supplier_id, 21.5300, 455, 21.5300, 'C.2516', 'Wild Yam Root Powder', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, package_size_g = EXCLUDED.package_size_g, package_price = EXCLUDED.package_price, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, package_size_g, package_price, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Yarrow', v_supplier_id, 32.5000, 455, 32.5000, 'C.882', 'Yarrow Flowers C/S', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, package_size_g = EXCLUDED.package_size_g, package_price = EXCLUDED.package_price, last_updated = CURRENT_DATE;

END $$;

-- Done: 95 pricing rows