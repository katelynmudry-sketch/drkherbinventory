-- Mountain Rose Herbs price import
-- Generated: 2026-03-05T23:21:11.860Z
-- Run this in your Supabase SQL Editor

-- Step 1: Insert supplier (skip if exists)
INSERT INTO public.suppliers (user_id, name, url)
VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Mountain Rose Herbs', 'https://www.mountainroseherbs.com')
ON CONFLICT (user_id, name) DO NOTHING;

-- Step 2: Insert pricing rows
DO $$
DECLARE v_supplier_id UUID;
BEGIN
  SELECT id INTO v_supplier_id FROM public.suppliers
  WHERE user_id = 'b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4' AND name = 'Mountain Rose Herbs';

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Agrimony', v_supplier_id, 16.8800, '11-00004-17', 'Agrimony', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, supplier_item_name = EXCLUDED.supplier_item_name, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Alfalfa', v_supplier_id, 15.7500, '11-00006-17', 'Alfalfa Leaf', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, supplier_item_name = EXCLUDED.supplier_item_name, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Althea', v_supplier_id, 27.7500, '11-00353-17', 'Marshmallow Root', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, supplier_item_name = EXCLUDED.supplier_item_name, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Angelica', v_supplier_id, 36.0000, '11-00645-17', 'Angelica Root', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, supplier_item_name = EXCLUDED.supplier_item_name, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Anise', v_supplier_id, 12.9400, '11-00021-17', 'Anise Seed', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, supplier_item_name = EXCLUDED.supplier_item_name, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Artemisia', v_supplier_id, 21.0000, '11-00568-17', 'Wormwood', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, supplier_item_name = EXCLUDED.supplier_item_name, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Artichoke', v_supplier_id, 18.0000, '11-00028-17', 'Artichoke Leaf', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, supplier_item_name = EXCLUDED.supplier_item_name, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Ashwagandha', v_supplier_id, 18.7500, '11-00029-17', 'Ashwagandha Root', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, supplier_item_name = EXCLUDED.supplier_item_name, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Astragalus', v_supplier_id, 21.7500, '11-00032-17', 'Astragalus Root', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, supplier_item_name = EXCLUDED.supplier_item_name, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Avena', v_supplier_id, 21.7500, '11-00389-17', 'Oatstraw', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, supplier_item_name = EXCLUDED.supplier_item_name, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Bayberry Root Bark', v_supplier_id, 55.6900, '11-00041-17', 'Bayberry Root Bark', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, supplier_item_name = EXCLUDED.supplier_item_name, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Bee Balm', v_supplier_id, 34.5000, '11-36407-17', 'Bee Balm', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, supplier_item_name = EXCLUDED.supplier_item_name, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Birch Bark', v_supplier_id, 22.5000, '11-00048-17', 'Birch Bark', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, supplier_item_name = EXCLUDED.supplier_item_name, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Birch Leaf', v_supplier_id, 16.3100, '11-00050-17', 'Birch Leaf', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, supplier_item_name = EXCLUDED.supplier_item_name, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Black Cohosh', v_supplier_id, 40.1300, '11-00055-17', 'Black Cohosh Root', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, supplier_item_name = EXCLUDED.supplier_item_name, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Black Haw', v_supplier_id, 64.8800, '11-00057-17', 'Black Haw Bark', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, supplier_item_name = EXCLUDED.supplier_item_name, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Black Pepper', v_supplier_id, 21.0000, '11-01050-17', 'Peppercorn, Black', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, supplier_item_name = EXCLUDED.supplier_item_name, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Black Walnut', v_supplier_id, 14.0600, '11-00667-17', 'Black Walnut Hull Powder', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, supplier_item_name = EXCLUDED.supplier_item_name, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Blessed Thistle', v_supplier_id, 34.5000, '11-00072-17', 'Blessed Thistle', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, supplier_item_name = EXCLUDED.supplier_item_name, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Blue Cohosh', v_supplier_id, 34.8800, '11-00842-17', 'Blue Cohosh Root', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, supplier_item_name = EXCLUDED.supplier_item_name, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Blue Vervain', v_supplier_id, 38.6300, '11-00080-17', 'Blue Vervain', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, supplier_item_name = EXCLUDED.supplier_item_name, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Boneset', v_supplier_id, 21.7500, '11-00083-17', 'Boneset', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, supplier_item_name = EXCLUDED.supplier_item_name, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Borage', v_supplier_id, 35.6300, '11-00084-17', 'Borage', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, supplier_item_name = EXCLUDED.supplier_item_name, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Bugleweed', v_supplier_id, 39.7500, '11-00094-17', 'Bugleweed', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, supplier_item_name = EXCLUDED.supplier_item_name, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Bupleurum', v_supplier_id, 49.3100, '11-00095-17', 'Bupleurum Root', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, supplier_item_name = EXCLUDED.supplier_item_name, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Burdock', v_supplier_id, 21.3800, '11-00097-17', 'Burdock Root', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, supplier_item_name = EXCLUDED.supplier_item_name, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Calamus', v_supplier_id, 18.7500, '11-00105-17', 'Calamus Root', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, supplier_item_name = EXCLUDED.supplier_item_name, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Calendula', v_supplier_id, 30.7500, '11-00108-17', 'Calendula Flowers', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, supplier_item_name = EXCLUDED.supplier_item_name, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'California Poppy', v_supplier_id, 48.7500, '11-00109-17', 'California Poppy', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, supplier_item_name = EXCLUDED.supplier_item_name, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Cat''s Claw', v_supplier_id, 11.0600, '11-00123-17', 'Cat''s Claw Bark', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, supplier_item_name = EXCLUDED.supplier_item_name, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Catnip', v_supplier_id, 27.7500, '11-00122-17', 'Catnip', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, supplier_item_name = EXCLUDED.supplier_item_name, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Chamomile', v_supplier_id, 28.5000, '11-00137-17', 'Chamomile Flowers', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, supplier_item_name = EXCLUDED.supplier_item_name, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Cinnamon', v_supplier_id, 12.7500, '11-00155-17', 'Cinnamon, Cassia Chips', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, supplier_item_name = EXCLUDED.supplier_item_name, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Cleavers', v_supplier_id, 16.1300, '11-00165-17', 'Cleavers', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, supplier_item_name = EXCLUDED.supplier_item_name, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Comfrey Root', v_supplier_id, 19.5000, '11-00173-17', 'Comfrey Root', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, supplier_item_name = EXCLUDED.supplier_item_name, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Cramp Bark', v_supplier_id, 47.2500, '11-00620-17', 'Cramp Bark Powder', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, supplier_item_name = EXCLUDED.supplier_item_name, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Damiana', v_supplier_id, 21.0000, '11-00192-17', 'Damiana Leaf', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, supplier_item_name = EXCLUDED.supplier_item_name, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Dandelion Leaf', v_supplier_id, 23.6300, '11-00194-17', 'Dandelion Leaf', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, supplier_item_name = EXCLUDED.supplier_item_name, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Dandelion Root', v_supplier_id, 25.5000, '11-00195-17', 'Dandelion Root Roasted', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, supplier_item_name = EXCLUDED.supplier_item_name, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Devil''s Claw', v_supplier_id, 24.7500, '11-00198-17', 'Devil''s Claw Root', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, supplier_item_name = EXCLUDED.supplier_item_name, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Dong Quai', v_supplier_id, 45.0000, '11-00204-17', 'Dong Quai Root', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, supplier_item_name = EXCLUDED.supplier_item_name, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Echinacea Augustifolia', v_supplier_id, 46.5000, '11-00211-17', 'Echinacea Angustifolia Root', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, supplier_item_name = EXCLUDED.supplier_item_name, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Echinacea Purpurea Leaf', v_supplier_id, 20.8100, '11-00212-17', 'Echinacea Purpurea Herb', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, supplier_item_name = EXCLUDED.supplier_item_name, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Echinacea Purpurea Root', v_supplier_id, 40.8800, '11-00214-17', 'Echinacea Purpurea Root', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, supplier_item_name = EXCLUDED.supplier_item_name, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Eleuthero', v_supplier_id, 12.3500, '11-00221-17', 'Eleuthero Root', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, supplier_item_name = EXCLUDED.supplier_item_name, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Fennel', v_supplier_id, 14.2500, '11-00229-17', 'Fennel Seed', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, supplier_item_name = EXCLUDED.supplier_item_name, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Feverfew', v_supplier_id, 29.6300, '11-00233-17', 'Feverfew', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, supplier_item_name = EXCLUDED.supplier_item_name, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Gentian', v_supplier_id, 36.0000, '11-00251-17', 'Gentian Root', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, supplier_item_name = EXCLUDED.supplier_item_name, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Ginger', v_supplier_id, 22.5000, '11-00253-17', 'Ginger Root', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, supplier_item_name = EXCLUDED.supplier_item_name, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Ginkgo', v_supplier_id, 17.4400, '11-00255-17', 'Ginkgo Leaf', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, supplier_item_name = EXCLUDED.supplier_item_name, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Goldenrod', v_supplier_id, 13.8800, '11-00260-17', 'Goldenrod', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, supplier_item_name = EXCLUDED.supplier_item_name, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Gotu Kola', v_supplier_id, 25.1300, '11-00267-17', 'Gotu Kola', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, supplier_item_name = EXCLUDED.supplier_item_name, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Gravel Root', v_supplier_id, 33.3800, '11-00271-17', 'Gravel Root', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, supplier_item_name = EXCLUDED.supplier_item_name, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Hawthorn', v_supplier_id, 12.3800, '11-00282-17', 'Hawthorn Berries', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, supplier_item_name = EXCLUDED.supplier_item_name, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Hops', v_supplier_id, 49.5000, '11-00295-17', 'Hops Flowers', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, supplier_item_name = EXCLUDED.supplier_item_name, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Horse Chestnut', v_supplier_id, 12.3800, '11-00297-17', 'Horse Chestnut', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, supplier_item_name = EXCLUDED.supplier_item_name, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Horsetail', v_supplier_id, 16.3100, '11-00299-17', 'Horsetail', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, supplier_item_name = EXCLUDED.supplier_item_name, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Hypericum', v_supplier_id, 14.6300, '11-00510-17', 'St. John''s Wort', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, supplier_item_name = EXCLUDED.supplier_item_name, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Hyssop', v_supplier_id, 34.5000, '11-00946-17', 'Anise Hyssop', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, supplier_item_name = EXCLUDED.supplier_item_name, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Inula', v_supplier_id, 28.8800, '11-00220-17', 'Elecampane Root', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, supplier_item_name = EXCLUDED.supplier_item_name, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Iris', v_supplier_id, 27.7500, '11-00079-17', 'Blue Flag Root', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, supplier_item_name = EXCLUDED.supplier_item_name, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Juniper', v_supplier_id, 21.0000, '11-00311-17', 'Juniper Berries', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, supplier_item_name = EXCLUDED.supplier_item_name, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Lady''s Mantle', v_supplier_id, 29.0600, '11-00320-17', 'Lady''s Mantle', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, supplier_item_name = EXCLUDED.supplier_item_name, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Lavender', v_supplier_id, 37.5000, '11-00223-17', 'Lavender Flowers, English', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, supplier_item_name = EXCLUDED.supplier_item_name, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Lemon Balm', v_supplier_id, 27.3800, '11-00323-17', 'Lemon Balm', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, supplier_item_name = EXCLUDED.supplier_item_name, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Lemongrass', v_supplier_id, 13.8800, '11-00329-17', 'Lemongrass Powder', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, supplier_item_name = EXCLUDED.supplier_item_name, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Licorice', v_supplier_id, 21.3800, '11-00330-17', 'Licorice Root', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, supplier_item_name = EXCLUDED.supplier_item_name, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Linden', v_supplier_id, 41.0600, '11-00334-17', 'Linden', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, supplier_item_name = EXCLUDED.supplier_item_name, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Lycopus', v_supplier_id, 39.7500, '11-00094-17', 'Bugleweed', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, supplier_item_name = EXCLUDED.supplier_item_name, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Maca', v_supplier_id, 12.0000, '11-00344-17', 'Maca Powder', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, supplier_item_name = EXCLUDED.supplier_item_name, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Marshmallow', v_supplier_id, 21.7500, '11-00352-17', 'Marshmallow Leaf', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, supplier_item_name = EXCLUDED.supplier_item_name, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Meadowsweet', v_supplier_id, 19.1300, '11-00358-17', 'Meadowsweet Herb', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, supplier_item_name = EXCLUDED.supplier_item_name, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Milk Thistle', v_supplier_id, 17.2500, '11-00362-17', 'Milk Thistle Seed', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, supplier_item_name = EXCLUDED.supplier_item_name, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Motherwort', v_supplier_id, 26.4400, '11-00367-17', 'Motherwort', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, supplier_item_name = EXCLUDED.supplier_item_name, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Mugwort', v_supplier_id, 24.0000, '11-00368-17', 'Mugwort', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, supplier_item_name = EXCLUDED.supplier_item_name, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Mullein', v_supplier_id, 15.7500, '11-00372-17', 'Mullein Leaf', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, supplier_item_name = EXCLUDED.supplier_item_name, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Nettle Leaf', v_supplier_id, 18.7500, '11-00378-17', 'Nettle Leaf', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, supplier_item_name = EXCLUDED.supplier_item_name, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Nettle Root', v_supplier_id, 24.7500, '11-00380-17', 'Nettle Root', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, supplier_item_name = EXCLUDED.supplier_item_name, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Oak', v_supplier_id, 18.3800, '11-01079-17', 'White Oak Bark', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, supplier_item_name = EXCLUDED.supplier_item_name, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Ocimum', v_supplier_id, 12.0000, '11-00903-17', 'Holy Basil, Krishna', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, supplier_item_name = EXCLUDED.supplier_item_name, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Olive Leaf', v_supplier_id, 12.7500, '11-00391-17', 'Olive Leaf', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, supplier_item_name = EXCLUDED.supplier_item_name, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Orange Peel', v_supplier_id, 21.0000, '11-00054-17', 'Orange Peel, Bitter', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, supplier_item_name = EXCLUDED.supplier_item_name, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Oregano', v_supplier_id, 13.8800, '11-00361-17', 'Oregano Leaf, Mexican', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, supplier_item_name = EXCLUDED.supplier_item_name, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Oregon Grape', v_supplier_id, 41.6300, '11-00401-17', 'Oregon Grape Root', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, supplier_item_name = EXCLUDED.supplier_item_name, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Parsley', v_supplier_id, 18.7500, '11-00407-17', 'Parsley Leaf', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, supplier_item_name = EXCLUDED.supplier_item_name, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Passion Flower', v_supplier_id, 20.4400, '11-00410-17', 'Passionflower', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, supplier_item_name = EXCLUDED.supplier_item_name, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Peony', v_supplier_id, 22.6900, '11-00551-17', 'White Peony Root', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, supplier_item_name = EXCLUDED.supplier_item_name, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Peppermint', v_supplier_id, 19.5000, '11-00417-17', 'Peppermint Leaf', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, supplier_item_name = EXCLUDED.supplier_item_name, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Periwinkle', v_supplier_id, 42.5600, '11-00418-17', 'Periwinkle', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, supplier_item_name = EXCLUDED.supplier_item_name, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Plantain', v_supplier_id, 30.7500, '11-00424-17', 'Plantain Leaf', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, supplier_item_name = EXCLUDED.supplier_item_name, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Poppy', v_supplier_id, 48.7500, '11-00109-17', 'California Poppy', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, supplier_item_name = EXCLUDED.supplier_item_name, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Raspberry Leaf', v_supplier_id, 21.0000, '11-00442-17', 'Raspberry Leaf', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, supplier_item_name = EXCLUDED.supplier_item_name, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Red Clover', v_supplier_id, 16.1300, '11-00446-17', 'Red Clover Sprouting Seed', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, supplier_item_name = EXCLUDED.supplier_item_name, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Rheum', v_supplier_id, 28.5000, '11-00529-17', 'Turkey Rhubarb Root Powder', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, supplier_item_name = EXCLUDED.supplier_item_name, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Rhodiola', v_supplier_id, 143.2500, '11-01004-17', 'Rhodiola Root', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, supplier_item_name = EXCLUDED.supplier_item_name, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Rose', v_supplier_id, 50.6300, '11-00456-17', 'Rose Buds Whole', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, supplier_item_name = EXCLUDED.supplier_item_name, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Rosemary', v_supplier_id, 13.1300, '11-00459-17', 'Rosemary Leaf Whole', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, supplier_item_name = EXCLUDED.supplier_item_name, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Rue', v_supplier_id, 16.8800, '11-00259-17', 'Goats Rue', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, supplier_item_name = EXCLUDED.supplier_item_name, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Rumex', v_supplier_id, 18.7500, '11-00572-17', 'Yellow Dock Root', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, supplier_item_name = EXCLUDED.supplier_item_name, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Sage', v_supplier_id, 15.0000, '11-00463-17', 'Sage Leaf', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, supplier_item_name = EXCLUDED.supplier_item_name, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Sarsaparilla', v_supplier_id, 36.1900, '11-00464-17', 'Sarsaparilla Root, Jamaican', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, supplier_item_name = EXCLUDED.supplier_item_name, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Schisandra', v_supplier_id, 65.2500, '11-00475-17', 'Schisandra Berries', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, supplier_item_name = EXCLUDED.supplier_item_name, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Scutellaria', v_supplier_id, 36.7500, '11-36402-17', 'Chinese Skullcap Root', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, supplier_item_name = EXCLUDED.supplier_item_name, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Self Heal', v_supplier_id, 44.2500, '11-00479-17', 'Self Heal', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, supplier_item_name = EXCLUDED.supplier_item_name, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Shatavari', v_supplier_id, 15.0000, '11-00484-17', 'Shatavari Root', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, supplier_item_name = EXCLUDED.supplier_item_name, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Shepherd''s Purse', v_supplier_id, 17.4400, '11-00489-17', 'Shepherd''s Purse', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, supplier_item_name = EXCLUDED.supplier_item_name, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Solomon''s Seal', v_supplier_id, 81.5600, '11-00501-17', 'Solomon''s Seal Root', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, supplier_item_name = EXCLUDED.supplier_item_name, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Spikenard', v_supplier_id, 48.0000, '11-00505-17', 'Spikenard Root', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, supplier_item_name = EXCLUDED.supplier_item_name, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Spilanthes', v_supplier_id, 45.3800, '11-01001-17', 'Spilanthes', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, supplier_item_name = EXCLUDED.supplier_item_name, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Stone Root', v_supplier_id, 34.1300, '11-00513-17', 'Stone Root', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, supplier_item_name = EXCLUDED.supplier_item_name, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Thyme', v_supplier_id, 19.5000, '11-00524-17', 'Thyme Leaf', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, supplier_item_name = EXCLUDED.supplier_item_name, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Tulsi', v_supplier_id, 56.2500, '11-36436-17', 'Kapoor Tulsi, US Grown', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, supplier_item_name = EXCLUDED.supplier_item_name, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Valerian', v_supplier_id, 42.7500, '11-00536-17', 'Valerian Root', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, supplier_item_name = EXCLUDED.supplier_item_name, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Vitex', v_supplier_id, 11.2500, '11-00541-17', 'Vitex Berries', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, supplier_item_name = EXCLUDED.supplier_item_name, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'White Oak', v_supplier_id, 18.3800, '11-01079-17', 'White Oak Bark', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, supplier_item_name = EXCLUDED.supplier_item_name, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Wild Lettuce', v_supplier_id, 22.8800, '11-00558-17', 'Wild Lettuce', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, supplier_item_name = EXCLUDED.supplier_item_name, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Wild Yam', v_supplier_id, 52.3100, '11-00559-17', 'Wild Yam Root', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, supplier_item_name = EXCLUDED.supplier_item_name, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Yarrow', v_supplier_id, 20.4400, '11-00570-17', 'Yarrow', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, supplier_item_name = EXCLUDED.supplier_item_name, last_updated = CURRENT_DATE;

END $$;

-- Done: 118 pricing rows