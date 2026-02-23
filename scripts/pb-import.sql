-- Pacific Botanicals price import
-- Generated: 2026-02-23T04:24:26.804Z
-- Run this in your Supabase SQL Editor

-- Step 1: Insert supplier (skip if exists)
INSERT INTO public.suppliers (user_id, name, url)
VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Pacific Botanicals', 'https://www.pacificbotanicals.com')
ON CONFLICT (user_id, name) DO NOTHING;

-- Step 2: Insert pricing rows
DO $$
DECLARE v_supplier_id UUID;
BEGIN
  SELECT id INTO v_supplier_id FROM public.suppliers
  WHERE user_id = 'b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4' AND name = 'Pacific Botanicals';

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Alfalfa', v_supplier_id, 18.0000, '200036', 'ALFALFA LEAF CUT-OG', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, supplier_item_name = EXCLUDED.supplier_item_name, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Althea', v_supplier_id, 33.0000, '202350', 'MARSHMALLOW ROOT CUT-OG', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, supplier_item_name = EXCLUDED.supplier_item_name, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Angelica', v_supplier_id, 50.0000, '200084', 'ANGELICA ARCHANGELICA ROOT CUT-OG', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, supplier_item_name = EXCLUDED.supplier_item_name, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Anise', v_supplier_id, 20.0000, '200096', 'ANISE SEED WHOLE-OG', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, supplier_item_name = EXCLUDED.supplier_item_name, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Artemisia', v_supplier_id, 40.0000, '200132', 'ARTEMISIA ANNUA HERB CUT-OG ROC OU', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, supplier_item_name = EXCLUDED.supplier_item_name, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Artichoke', v_supplier_id, 22.0000, '200156', 'ARTICHOKE LEAF POWDER-OG', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, supplier_item_name = EXCLUDED.supplier_item_name, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Ashwagandha', v_supplier_id, 45.0000, '200220', 'ASHWAGANDHA ROOT CUT-OG', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, supplier_item_name = EXCLUDED.supplier_item_name, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Astragalus', v_supplier_id, 25.0000, '200283', 'ASTRAGALUS ROOT CUT-OG', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, supplier_item_name = EXCLUDED.supplier_item_name, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Avena', v_supplier_id, 25.0000, '202583', 'OATSTRAW CUT-OG', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, supplier_item_name = EXCLUDED.supplier_item_name, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Bacopa', v_supplier_id, 70.0000, '200307', 'BACOPA HERB CUT-OG ROC', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, supplier_item_name = EXCLUDED.supplier_item_name, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Bayberry Root Bark', v_supplier_id, 65.0000, '200381', 'BAYBERRY ROOT BARK CUT-WILD', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, supplier_item_name = EXCLUDED.supplier_item_name, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Black Cohosh', v_supplier_id, 44.0000, '200454', 'BLACK COHOSH ROOT CUT-OG', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, supplier_item_name = EXCLUDED.supplier_item_name, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Black Haw', v_supplier_id, 60.0000, '200466', 'BLACK HAW BARK CUT-WILD', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, supplier_item_name = EXCLUDED.supplier_item_name, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Black Pepper', v_supplier_id, 26.0000, '200478', 'BLACK PEPPER GROUND-OG', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, supplier_item_name = EXCLUDED.supplier_item_name, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Black Walnut', v_supplier_id, 25.0000, '200538', 'BLACK WALNUT HULLS CUT-WILD', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, supplier_item_name = EXCLUDED.supplier_item_name, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Blessed Thistle', v_supplier_id, 40.0000, '200562', 'BLESSED THISTLE CUT-OG ROC OU', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, supplier_item_name = EXCLUDED.supplier_item_name, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Blue Cohosh', v_supplier_id, 44.0000, '200600', 'BLUE COHOSH ROOT CUT-OG', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, supplier_item_name = EXCLUDED.supplier_item_name, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Blue Vervain', v_supplier_id, 40.0000, '200626', 'BLUE VERVAIN HERB CUT-OG', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, supplier_item_name = EXCLUDED.supplier_item_name, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Borage', v_supplier_id, 40.0000, '200650', 'BORAGE HERB CUT-OG', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, supplier_item_name = EXCLUDED.supplier_item_name, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Bugleweed', v_supplier_id, 45.0000, '200662', 'BUGLEWEED CUT-OG', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, supplier_item_name = EXCLUDED.supplier_item_name, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Burdock', v_supplier_id, 28.0000, '200699', 'BURDOCK ROOT CUT-OG', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, supplier_item_name = EXCLUDED.supplier_item_name, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Calendula', v_supplier_id, 65.0000, '200783', 'CALENDULA FLOWER WHOLE-OG', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, supplier_item_name = EXCLUDED.supplier_item_name, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'California Poppy', v_supplier_id, 47.0000, '200735', 'CALIFORNIA POPPY HERB CUT-OG', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, supplier_item_name = EXCLUDED.supplier_item_name, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Cat''s Claw', v_supplier_id, 22.0000, '200879', 'CAT''S CLAW SHRED-WILD', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, supplier_item_name = EXCLUDED.supplier_item_name, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Catnip', v_supplier_id, 30.0000, '200855', 'CATNIP LEAF TBC-OG', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, supplier_item_name = EXCLUDED.supplier_item_name, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Chamomile', v_supplier_id, 40.0000, '200915', 'CHAMOMILE FLOWER WHOLE-OG', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, supplier_item_name = EXCLUDED.supplier_item_name, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Cinnamon', v_supplier_id, 22.0000, '200999', 'CINNAMON CHIPS CUT-OG', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, supplier_item_name = EXCLUDED.supplier_item_name, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Cleavers', v_supplier_id, 22.0000, '201023', 'CLEAVERS HERB CUT-OG', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, supplier_item_name = EXCLUDED.supplier_item_name, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Comfrey Root', v_supplier_id, 30.0000, '201083', 'COMFREY ROOT POWDER-OG', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, supplier_item_name = EXCLUDED.supplier_item_name, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Cramp Bark', v_supplier_id, 65.0000, '201131', 'CRAMPBARK WHOLE-WILD', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, supplier_item_name = EXCLUDED.supplier_item_name, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Damiana', v_supplier_id, 32.0000, '201143', 'DAMIANA HERB CUT-OG', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, supplier_item_name = EXCLUDED.supplier_item_name, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Dandelion Leaf', v_supplier_id, 30.0000, '201167', 'DANDELION LEAF CUT-OG', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, supplier_item_name = EXCLUDED.supplier_item_name, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Dandelion Root', v_supplier_id, 32.0000, '201179', 'DANDELION ROOT POWDER-OG', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, supplier_item_name = EXCLUDED.supplier_item_name, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Devil''s Claw', v_supplier_id, 31.0000, '201203', 'DEVIL''S CLAW ROOT CUT-OG', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, supplier_item_name = EXCLUDED.supplier_item_name, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Devil''s Club', v_supplier_id, 64.0000, '201215', 'DEVIL''S CLUB RHIZOME BARK CUT-WILD', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, supplier_item_name = EXCLUDED.supplier_item_name, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Dong Quai', v_supplier_id, 50.0000, '201239', 'DONG QUAI ROOT CUT-OG', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, supplier_item_name = EXCLUDED.supplier_item_name, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Echinacea Augustifolia', v_supplier_id, 58.0000, '201288', 'ECHINACEA ANGUSTIFOLIA ROOT WHOLE-OG', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, supplier_item_name = EXCLUDED.supplier_item_name, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Echinacea Purpurea Leaf', v_supplier_id, 22.0000, '201300', 'ECHINACEA PURPUREA HERB POWDER-OG', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, supplier_item_name = EXCLUDED.supplier_item_name, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Echinacea Purpurea Root', v_supplier_id, 38.0000, '201360', 'ECHINACEA PURPUREA ROOT CUT-OG', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, supplier_item_name = EXCLUDED.supplier_item_name, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Eclipta', v_supplier_id, 35.0000, '201386', 'ECLIPTA HERB CUT-OG ROC OU', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, supplier_item_name = EXCLUDED.supplier_item_name, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Eleuthero', v_supplier_id, 23.0000, '201483', 'ELEUTHERO ROOT CUT-OG', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, supplier_item_name = EXCLUDED.supplier_item_name, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Fennel', v_supplier_id, 20.0000, '201495', 'FENNEL SEED WHOLE-OG', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, supplier_item_name = EXCLUDED.supplier_item_name, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Feverfew', v_supplier_id, 32.0000, '201543', 'FEVERFEW HERB CUT-OG', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, supplier_item_name = EXCLUDED.supplier_item_name, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Gentian', v_supplier_id, 40.0000, '201591', 'GENTIAN ROOT CUT-OG', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, supplier_item_name = EXCLUDED.supplier_item_name, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Ginger', v_supplier_id, 22.0000, '201603', 'GINGER RHIZOME CUT-OG', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, supplier_item_name = EXCLUDED.supplier_item_name, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Ginkgo', v_supplier_id, 24.0000, '201651', 'GINKGO LEAF WHOLE-OG', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, supplier_item_name = EXCLUDED.supplier_item_name, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Goji', v_supplier_id, 29.0000, '201675', 'GOJI BERRIES-OG', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, supplier_item_name = EXCLUDED.supplier_item_name, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Goldenrod', v_supplier_id, 22.0000, '201699', 'GOLDENROD HERB CUT-OG', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, supplier_item_name = EXCLUDED.supplier_item_name, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Gotu Kola', v_supplier_id, 40.0000, '201803', 'GOTU KOLA HERB CUT-OG', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, supplier_item_name = EXCLUDED.supplier_item_name, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Gravel Root', v_supplier_id, 45.0000, '201840', 'GRAVEL ROOT CUT-OG', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, supplier_item_name = EXCLUDED.supplier_item_name, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Hawthorn', v_supplier_id, 20.0000, '201900', 'HAWTHORN BERRIES WHOLE-OG', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, supplier_item_name = EXCLUDED.supplier_item_name, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Hops', v_supplier_id, 49.0000, '201949', 'HOPS STROBILES WHOLE-OG', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, supplier_item_name = EXCLUDED.supplier_item_name, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Horsetail', v_supplier_id, 28.0000, '201998', 'HORSETAIL POWDER-OG', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, supplier_item_name = EXCLUDED.supplier_item_name, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Hypericum', v_supplier_id, 31.0000, '203296', 'ST JOHNS WORT TOPS CUT-OG', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, supplier_item_name = EXCLUDED.supplier_item_name, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Hyssop', v_supplier_id, 23.0000, '204514', 'HYSSOP HERB CUT-OG', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, supplier_item_name = EXCLUDED.supplier_item_name, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Inula', v_supplier_id, 25.0000, '201458', 'ELECAMPANE ROOT CUT-OG', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, supplier_item_name = EXCLUDED.supplier_item_name, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Iris', v_supplier_id, 42.0000, '200602', 'BLUE FLAG ROOT CUT-OG ROC OU', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, supplier_item_name = EXCLUDED.supplier_item_name, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Juniper', v_supplier_id, 27.0000, '202058', 'JUNIPER BERRIES WHOLE-OG', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, supplier_item_name = EXCLUDED.supplier_item_name, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Lavender', v_supplier_id, 44.0000, '202134', 'LAVENDER FLOWERS WHOLE-OG', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, supplier_item_name = EXCLUDED.supplier_item_name, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Lemon Balm', v_supplier_id, 28.0000, '202158', 'LEMON BALM HERB CUT-OG', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, supplier_item_name = EXCLUDED.supplier_item_name, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Lemongrass', v_supplier_id, 17.0000, '202207', 'LEMONGRASS CUT-OG', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, supplier_item_name = EXCLUDED.supplier_item_name, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Licorice', v_supplier_id, 30.0000, '202231', 'LICORICE ROOT CUT-OG', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, supplier_item_name = EXCLUDED.supplier_item_name, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Linden', v_supplier_id, 43.0000, '202243', 'LINDEN FLOWER & LEAF CUT-OG', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, supplier_item_name = EXCLUDED.supplier_item_name, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Lomatium', v_supplier_id, 47.2500, '202278', 'LOMATIUM ROOT CUT-WILD', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, supplier_item_name = EXCLUDED.supplier_item_name, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Lycopus', v_supplier_id, 45.0000, '200662', 'BUGLEWEED CUT-OG', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, supplier_item_name = EXCLUDED.supplier_item_name, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Maca', v_supplier_id, 22.0000, '202302', 'MACA ROOT RAW POWDER-OG', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, supplier_item_name = EXCLUDED.supplier_item_name, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Marshmallow', v_supplier_id, 25.0000, '202314', 'MARSHMALLOW LEAF CUT-OG', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, supplier_item_name = EXCLUDED.supplier_item_name, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Meadowsweet', v_supplier_id, 24.0000, '202362', 'MEADOWSWEET HERB IN FLOWER CUT-OG', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, supplier_item_name = EXCLUDED.supplier_item_name, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Milk Thistle', v_supplier_id, 25.0000, '202412', 'MILK THISTLE SEED WHOLE-OG', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, supplier_item_name = EXCLUDED.supplier_item_name, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Motherwort', v_supplier_id, 29.0000, '202374', 'MOTHERWORT HERB CUT-OG ROC OU', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, supplier_item_name = EXCLUDED.supplier_item_name, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Mugwort', v_supplier_id, 23.0000, '202424', 'MUGWORT HERB CUT-OG', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, supplier_item_name = EXCLUDED.supplier_item_name, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Mullein', v_supplier_id, 40.0000, '202436', 'MULLEIN LEAF CUT-OG ROC OU', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, supplier_item_name = EXCLUDED.supplier_item_name, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Nettle Leaf', v_supplier_id, 25.0000, '204596', 'NETTLE HERB CUT-OG', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, supplier_item_name = EXCLUDED.supplier_item_name, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Nettle Root', v_supplier_id, 38.0000, '202509', 'NETTLE ROOT CUT-OG ROC OU', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, supplier_item_name = EXCLUDED.supplier_item_name, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Oak', v_supplier_id, 21.0000, '203613', 'WHITE OAK BARK CUT-WILD', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, supplier_item_name = EXCLUDED.supplier_item_name, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Ocimum', v_supplier_id, 20.0000, '204446', 'HOLY BASIL CUT-OG', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, supplier_item_name = EXCLUDED.supplier_item_name, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Olive Leaf', v_supplier_id, 20.0000, '202595', 'OLIVE LEAF CUT-OG', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, supplier_item_name = EXCLUDED.supplier_item_name, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Orange Peel', v_supplier_id, 29.0000, '202691', 'ORANGE PEEL POWDER-OG', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, supplier_item_name = EXCLUDED.supplier_item_name, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Oregano', v_supplier_id, 24.0000, '202727', 'OREGANO LEAF CUT-OG', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, supplier_item_name = EXCLUDED.supplier_item_name, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Oregon Grape', v_supplier_id, 40.0000, '202679', 'OREGON GRAPE ROOT CUT-WILD', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, supplier_item_name = EXCLUDED.supplier_item_name, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Parsley', v_supplier_id, 33.0000, '202739', 'PARSLEY ROOT CUT-OG', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, supplier_item_name = EXCLUDED.supplier_item_name, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Passion Flower', v_supplier_id, 29.0000, '202763', 'PASSIONFLOWER HERB IN FLOWER CUT-OG', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, supplier_item_name = EXCLUDED.supplier_item_name, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Peppermint', v_supplier_id, 25.0000, '202799', 'PEPPERMINT LEAF CUT-OG', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, supplier_item_name = EXCLUDED.supplier_item_name, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Plantain', v_supplier_id, 38.0000, '202811', 'PLANTAIN LEAF CUT-OG ROC OU', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, supplier_item_name = EXCLUDED.supplier_item_name, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Poppy', v_supplier_id, 47.0000, '200735', 'CALIFORNIA POPPY HERB CUT-OG', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, supplier_item_name = EXCLUDED.supplier_item_name, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Raspberry Leaf', v_supplier_id, 23.0000, '202907', 'RASPBERRY LEAF CUT-OG', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, supplier_item_name = EXCLUDED.supplier_item_name, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Red Clover', v_supplier_id, 33.0000, '202920', 'RED CLOVER HERB CUT-OG', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, supplier_item_name = EXCLUDED.supplier_item_name, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Rheum', v_supplier_id, 39.0000, '203454', 'TURKEY RHUBARB ROOT CUT-OG', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, supplier_item_name = EXCLUDED.supplier_item_name, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Rhodiola', v_supplier_id, 60.0000, '202944', 'RHODIOLA ROOT CUT-OG', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, supplier_item_name = EXCLUDED.supplier_item_name, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Rose', v_supplier_id, 57.0000, '203005', 'ROSE PETALS WHOLE-OG', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, supplier_item_name = EXCLUDED.supplier_item_name, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Rosemary', v_supplier_id, 18.0000, '202992', 'ROSEMARY LEAF WHOLE-OG', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, supplier_item_name = EXCLUDED.supplier_item_name, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Rue', v_supplier_id, 34.0000, '203029', 'RUE HERB CUT-OG', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, supplier_item_name = EXCLUDED.supplier_item_name, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Rumex', v_supplier_id, 38.0000, '203781', 'YELLOW DOCK ROOT CUT-OG ROC OU', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, supplier_item_name = EXCLUDED.supplier_item_name, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Sage', v_supplier_id, 35.0000, '203042', 'SAGE LEAF CUT-OG ROC OU', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, supplier_item_name = EXCLUDED.supplier_item_name, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Schisandra', v_supplier_id, 57.0000, '203078', 'SCHISANDRA BERRIES WHOLE-OG', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, supplier_item_name = EXCLUDED.supplier_item_name, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Scutellaria', v_supplier_id, 46.0000, '203188', 'SKULLCAP HERB CUT-OG', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, supplier_item_name = EXCLUDED.supplier_item_name, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Shatavari', v_supplier_id, 25.0000, '203128', 'SHATAVARI ROOT CUT-OG', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, supplier_item_name = EXCLUDED.supplier_item_name, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Spilanthes', v_supplier_id, 36.0000, '203260', 'SPILANTHES PLANT WITH ROOT CUT-OG ROC', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, supplier_item_name = EXCLUDED.supplier_item_name, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Thyme', v_supplier_id, 26.0000, '203356', 'THYME LEAF CUT-OG', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, supplier_item_name = EXCLUDED.supplier_item_name, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Tulsi', v_supplier_id, 31.0000, '203428', 'TULSI BASIL HERB CUT-OG', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, supplier_item_name = EXCLUDED.supplier_item_name, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Valerian', v_supplier_id, 47.0000, '203526', 'VALERIAN ROOT CUT-OG', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, supplier_item_name = EXCLUDED.supplier_item_name, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'White Oak', v_supplier_id, 21.0000, '203613', 'WHITE OAK BARK CUT-WILD', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, supplier_item_name = EXCLUDED.supplier_item_name, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Wild Yam', v_supplier_id, 47.0000, '203661', 'WILD YAM ROOT CUT-WILD', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, supplier_item_name = EXCLUDED.supplier_item_name, last_updated = CURRENT_DATE;

  INSERT INTO public.herb_pricing (user_id, herb_name, supplier_id, price_per_lb, supplier_item_code, supplier_item_name, last_updated)
  VALUES ('b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4', 'Yarrow', v_supplier_id, 33.0000, '203733', 'YARROW FLOWERS CUT-WILD', CURRENT_DATE)
  ON CONFLICT (supplier_id, herb_name) DO UPDATE SET price_per_lb = EXCLUDED.price_per_lb, supplier_item_name = EXCLUDED.supplier_item_name, last_updated = CURRENT_DATE;

END $$;

-- Done: 104 pricing rows