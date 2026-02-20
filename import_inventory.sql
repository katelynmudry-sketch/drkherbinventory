-- ============================================================
-- HerbInventory CSV Import
-- ============================================================

DO $$
DECLARE
  v_user_id UUID := 'b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4';

  herb_0 UUID;
  herb_1 UUID;
  herb_2 UUID;
  herb_3 UUID;
  herb_4 UUID;
  herb_5 UUID;
  herb_6 UUID;
  herb_7 UUID;
  herb_8 UUID;
  herb_9 UUID;
  herb_10 UUID;
  herb_11 UUID;
  herb_12 UUID;
  herb_13 UUID;
  herb_14 UUID;
  herb_15 UUID;
  herb_16 UUID;
  herb_17 UUID;
  herb_18 UUID;
  herb_19 UUID;
  herb_20 UUID;
  herb_21 UUID;
  herb_22 UUID;
  herb_23 UUID;
  herb_24 UUID;
  herb_25 UUID;
  herb_26 UUID;
  herb_27 UUID;
  herb_28 UUID;
  herb_29 UUID;
  herb_30 UUID;
  herb_31 UUID;
  herb_32 UUID;
  herb_33 UUID;
  herb_34 UUID;
  herb_35 UUID;
  herb_36 UUID;
  herb_37 UUID;
  herb_38 UUID;
  herb_39 UUID;
  herb_40 UUID;
  herb_41 UUID;
  herb_42 UUID;
  herb_43 UUID;
  herb_44 UUID;
  herb_45 UUID;
  herb_46 UUID;
  herb_47 UUID;
  herb_48 UUID;
  herb_49 UUID;
  herb_50 UUID;
  herb_51 UUID;
  herb_52 UUID;
  herb_53 UUID;
  herb_54 UUID;
  herb_55 UUID;
  herb_56 UUID;
  herb_57 UUID;
  herb_58 UUID;
  herb_59 UUID;
  herb_60 UUID;
  herb_61 UUID;
  herb_62 UUID;
  herb_63 UUID;
  herb_64 UUID;
  herb_65 UUID;
  herb_66 UUID;
  herb_67 UUID;
  herb_68 UUID;
  herb_69 UUID;
  herb_70 UUID;
  herb_71 UUID;
  herb_72 UUID;
  herb_73 UUID;
  herb_74 UUID;
  herb_75 UUID;
  herb_76 UUID;
  herb_77 UUID;
  herb_78 UUID;
  herb_79 UUID;
  herb_80 UUID;
  herb_81 UUID;
  herb_82 UUID;
  herb_83 UUID;
  herb_84 UUID;
  herb_85 UUID;
  herb_86 UUID;
  herb_87 UUID;
BEGIN

  -- Insert herbs (skip if already exists for this user)

  INSERT INTO public.herbs (user_id, name)
    VALUES (v_user_id, 'Rosemary')
    ON CONFLICT DO NOTHING;
  SELECT id INTO herb_0 FROM public.herbs WHERE user_id = v_user_id AND lower(name) = lower('Rosemary') LIMIT 1;

  INSERT INTO public.herbs (user_id, name)
    VALUES (v_user_id, 'California Poppy')
    ON CONFLICT DO NOTHING;
  SELECT id INTO herb_1 FROM public.herbs WHERE user_id = v_user_id AND lower(name) = lower('California Poppy') LIMIT 1;

  INSERT INTO public.herbs (user_id, name)
    VALUES (v_user_id, 'Motherwort')
    ON CONFLICT DO NOTHING;
  SELECT id INTO herb_2 FROM public.herbs WHERE user_id = v_user_id AND lower(name) = lower('Motherwort') LIMIT 1;

  INSERT INTO public.herbs (user_id, name)
    VALUES (v_user_id, 'Passion Flower')
    ON CONFLICT DO NOTHING;
  SELECT id INTO herb_3 FROM public.herbs WHERE user_id = v_user_id AND lower(name) = lower('Passion Flower') LIMIT 1;

  INSERT INTO public.herbs (user_id, name)
    VALUES (v_user_id, 'Black haw')
    ON CONFLICT DO NOTHING;
  SELECT id INTO herb_4 FROM public.herbs WHERE user_id = v_user_id AND lower(name) = lower('Black haw') LIMIT 1;

  INSERT INTO public.herbs (user_id, name)
    VALUES (v_user_id, 'Damiana')
    ON CONFLICT DO NOTHING;
  SELECT id INTO herb_5 FROM public.herbs WHERE user_id = v_user_id AND lower(name) = lower('Damiana') LIMIT 1;

  INSERT INTO public.herbs (user_id, name)
    VALUES (v_user_id, 'Not weed')
    ON CONFLICT DO NOTHING;
  SELECT id INTO herb_6 FROM public.herbs WHERE user_id = v_user_id AND lower(name) = lower('Not weed') LIMIT 1;

  INSERT INTO public.herbs (user_id, name)
    VALUES (v_user_id, 'Buplureum')
    ON CONFLICT DO NOTHING;
  SELECT id INTO herb_7 FROM public.herbs WHERE user_id = v_user_id AND lower(name) = lower('Buplureum') LIMIT 1;

  INSERT INTO public.herbs (user_id, name)
    VALUES (v_user_id, 'Tulsi')
    ON CONFLICT DO NOTHING;
  SELECT id INTO herb_8 FROM public.herbs WHERE user_id = v_user_id AND lower(name) = lower('Tulsi') LIMIT 1;

  INSERT INTO public.herbs (user_id, name)
    VALUES (v_user_id, 'Blessed thistle')
    ON CONFLICT DO NOTHING;
  SELECT id INTO herb_9 FROM public.herbs WHERE user_id = v_user_id AND lower(name) = lower('Blessed thistle') LIMIT 1;

  INSERT INTO public.herbs (user_id, name)
    VALUES (v_user_id, 'DandElion root')
    ON CONFLICT DO NOTHING;
  SELECT id INTO herb_10 FROM public.herbs WHERE user_id = v_user_id AND lower(name) = lower('DandElion root') LIMIT 1;

  INSERT INTO public.herbs (user_id, name)
    VALUES (v_user_id, 'Wild yam')
    ON CONFLICT DO NOTHING;
  SELECT id INTO herb_11 FROM public.herbs WHERE user_id = v_user_id AND lower(name) = lower('Wild yam') LIMIT 1;

  INSERT INTO public.herbs (user_id, name)
    VALUES (v_user_id, 'Plantain')
    ON CONFLICT DO NOTHING;
  SELECT id INTO herb_12 FROM public.herbs WHERE user_id = v_user_id AND lower(name) = lower('Plantain') LIMIT 1;

  INSERT INTO public.herbs (user_id, name)
    VALUES (v_user_id, 'Passionflower')
    ON CONFLICT DO NOTHING;
  SELECT id INTO herb_13 FROM public.herbs WHERE user_id = v_user_id AND lower(name) = lower('Passionflower') LIMIT 1;

  INSERT INTO public.herbs (user_id, name)
    VALUES (v_user_id, 'Lomatium')
    ON CONFLICT DO NOTHING;
  SELECT id INTO herb_14 FROM public.herbs WHERE user_id = v_user_id AND lower(name) = lower('Lomatium') LIMIT 1;

  INSERT INTO public.herbs (user_id, name)
    VALUES (v_user_id, 'Shatavari')
    ON CONFLICT DO NOTHING;
  SELECT id INTO herb_15 FROM public.herbs WHERE user_id = v_user_id AND lower(name) = lower('Shatavari') LIMIT 1;

  INSERT INTO public.herbs (user_id, name)
    VALUES (v_user_id, 'Ashwaganda')
    ON CONFLICT DO NOTHING;
  SELECT id INTO herb_16 FROM public.herbs WHERE user_id = v_user_id AND lower(name) = lower('Ashwaganda') LIMIT 1;

  INSERT INTO public.herbs (user_id, name)
    VALUES (v_user_id, 'Caledonium')
    ON CONFLICT DO NOTHING;
  SELECT id INTO herb_17 FROM public.herbs WHERE user_id = v_user_id AND lower(name) = lower('Caledonium') LIMIT 1;

  INSERT INTO public.herbs (user_id, name)
    VALUES (v_user_id, 'Self heal')
    ON CONFLICT DO NOTHING;
  SELECT id INTO herb_18 FROM public.herbs WHERE user_id = v_user_id AND lower(name) = lower('Self heal') LIMIT 1;

  INSERT INTO public.herbs (user_id, name)
    VALUES (v_user_id, 'Dandelion leaf')
    ON CONFLICT DO NOTHING;
  SELECT id INTO herb_19 FROM public.herbs WHERE user_id = v_user_id AND lower(name) = lower('Dandelion leaf') LIMIT 1;

  INSERT INTO public.herbs (user_id, name)
    VALUES (v_user_id, 'Chamomile')
    ON CONFLICT DO NOTHING;
  SELECT id INTO herb_20 FROM public.herbs WHERE user_id = v_user_id AND lower(name) = lower('Chamomile') LIMIT 1;

  INSERT INTO public.herbs (user_id, name)
    VALUES (v_user_id, 'Mullei root')
    ON CONFLICT DO NOTHING;
  SELECT id INTO herb_21 FROM public.herbs WHERE user_id = v_user_id AND lower(name) = lower('Mullei root') LIMIT 1;

  INSERT INTO public.herbs (user_id, name)
    VALUES (v_user_id, 'Burdock')
    ON CONFLICT DO NOTHING;
  SELECT id INTO herb_22 FROM public.herbs WHERE user_id = v_user_id AND lower(name) = lower('Burdock') LIMIT 1;

  INSERT INTO public.herbs (user_id, name)
    VALUES (v_user_id, 'Rheum')
    ON CONFLICT DO NOTHING;
  SELECT id INTO herb_23 FROM public.herbs WHERE user_id = v_user_id AND lower(name) = lower('Rheum') LIMIT 1;

  INSERT INTO public.herbs (user_id, name)
    VALUES (v_user_id, 'Hyssop')
    ON CONFLICT DO NOTHING;
  SELECT id INTO herb_24 FROM public.herbs WHERE user_id = v_user_id AND lower(name) = lower('Hyssop') LIMIT 1;

  INSERT INTO public.herbs (user_id, name)
    VALUES (v_user_id, 'Saw palmetto')
    ON CONFLICT DO NOTHING;
  SELECT id INTO herb_25 FROM public.herbs WHERE user_id = v_user_id AND lower(name) = lower('Saw palmetto') LIMIT 1;

  INSERT INTO public.herbs (user_id, name)
    VALUES (v_user_id, 'Gentian')
    ON CONFLICT DO NOTHING;
  SELECT id INTO herb_26 FROM public.herbs WHERE user_id = v_user_id AND lower(name) = lower('Gentian') LIMIT 1;

  INSERT INTO public.herbs (user_id, name)
    VALUES (v_user_id, 'Gotu kola')
    ON CONFLICT DO NOTHING;
  SELECT id INTO herb_27 FROM public.herbs WHERE user_id = v_user_id AND lower(name) = lower('Gotu kola') LIMIT 1;

  INSERT INTO public.herbs (user_id, name)
    VALUES (v_user_id, 'Chaparral/larrea')
    ON CONFLICT DO NOTHING;
  SELECT id INTO herb_28 FROM public.herbs WHERE user_id = v_user_id AND lower(name) = lower('Chaparral/larrea') LIMIT 1;

  INSERT INTO public.herbs (user_id, name)
    VALUES (v_user_id, 'Anise')
    ON CONFLICT DO NOTHING;
  SELECT id INTO herb_29 FROM public.herbs WHERE user_id = v_user_id AND lower(name) = lower('Anise') LIMIT 1;

  INSERT INTO public.herbs (user_id, name)
    VALUES (v_user_id, 'Agrimony')
    ON CONFLICT DO NOTHING;
  SELECT id INTO herb_30 FROM public.herbs WHERE user_id = v_user_id AND lower(name) = lower('Agrimony') LIMIT 1;

  INSERT INTO public.herbs (user_id, name)
    VALUES (v_user_id, 'Goji')
    ON CONFLICT DO NOTHING;
  SELECT id INTO herb_31 FROM public.herbs WHERE user_id = v_user_id AND lower(name) = lower('Goji') LIMIT 1;

  INSERT INTO public.herbs (user_id, name)
    VALUES (v_user_id, 'Fennel')
    ON CONFLICT DO NOTHING;
  SELECT id INTO herb_32 FROM public.herbs WHERE user_id = v_user_id AND lower(name) = lower('Fennel') LIMIT 1;

  INSERT INTO public.herbs (user_id, name)
    VALUES (v_user_id, 'Bupluerum')
    ON CONFLICT DO NOTHING;
  SELECT id INTO herb_33 FROM public.herbs WHERE user_id = v_user_id AND lower(name) = lower('Bupluerum') LIMIT 1;

  INSERT INTO public.herbs (user_id, name)
    VALUES (v_user_id, 'Hops')
    ON CONFLICT DO NOTHING;
  SELECT id INTO herb_34 FROM public.herbs WHERE user_id = v_user_id AND lower(name) = lower('Hops') LIMIT 1;

  INSERT INTO public.herbs (user_id, name)
    VALUES (v_user_id, 'Geranium')
    ON CONFLICT DO NOTHING;
  SELECT id INTO herb_35 FROM public.herbs WHERE user_id = v_user_id AND lower(name) = lower('Geranium') LIMIT 1;

  INSERT INTO public.herbs (user_id, name)
    VALUES (v_user_id, 'Black cohosh')
    ON CONFLICT DO NOTHING;
  SELECT id INTO herb_36 FROM public.herbs WHERE user_id = v_user_id AND lower(name) = lower('Black cohosh') LIMIT 1;

  INSERT INTO public.herbs (user_id, name)
    VALUES (v_user_id, 'Bacopa')
    ON CONFLICT DO NOTHING;
  SELECT id INTO herb_37 FROM public.herbs WHERE user_id = v_user_id AND lower(name) = lower('Bacopa') LIMIT 1;

  INSERT INTO public.herbs (user_id, name)
    VALUES (v_user_id, 'Rhodiola')
    ON CONFLICT DO NOTHING;
  SELECT id INTO herb_38 FROM public.herbs WHERE user_id = v_user_id AND lower(name) = lower('Rhodiola') LIMIT 1;

  INSERT INTO public.herbs (user_id, name)
    VALUES (v_user_id, 'Red clover')
    ON CONFLICT DO NOTHING;
  SELECT id INTO herb_39 FROM public.herbs WHERE user_id = v_user_id AND lower(name) = lower('Red clover') LIMIT 1;

  INSERT INTO public.herbs (user_id, name)
    VALUES (v_user_id, 'Dong quai')
    ON CONFLICT DO NOTHING;
  SELECT id INTO herb_40 FROM public.herbs WHERE user_id = v_user_id AND lower(name) = lower('Dong quai') LIMIT 1;

  INSERT INTO public.herbs (user_id, name)
    VALUES (v_user_id, 'Valerian')
    ON CONFLICT DO NOTHING;
  SELECT id INTO herb_41 FROM public.herbs WHERE user_id = v_user_id AND lower(name) = lower('Valerian') LIMIT 1;

  INSERT INTO public.herbs (user_id, name)
    VALUES (v_user_id, 'Oregon grapefruit')
    ON CONFLICT DO NOTHING;
  SELECT id INTO herb_42 FROM public.herbs WHERE user_id = v_user_id AND lower(name) = lower('Oregon grapefruit') LIMIT 1;

  INSERT INTO public.herbs (user_id, name)
    VALUES (v_user_id, 'Mullen')
    ON CONFLICT DO NOTHING;
  SELECT id INTO herb_43 FROM public.herbs WHERE user_id = v_user_id AND lower(name) = lower('Mullen') LIMIT 1;

  INSERT INTO public.herbs (user_id, name)
    VALUES (v_user_id, 'Yarrow')
    ON CONFLICT DO NOTHING;
  SELECT id INTO herb_44 FROM public.herbs WHERE user_id = v_user_id AND lower(name) = lower('Yarrow') LIMIT 1;

  INSERT INTO public.herbs (user_id, name)
    VALUES (v_user_id, 'Violet')
    ON CONFLICT DO NOTHING;
  SELECT id INTO herb_45 FROM public.herbs WHERE user_id = v_user_id AND lower(name) = lower('Violet') LIMIT 1;

  INSERT INTO public.herbs (user_id, name)
    VALUES (v_user_id, 'Vitex')
    ON CONFLICT DO NOTHING;
  SELECT id INTO herb_46 FROM public.herbs WHERE user_id = v_user_id AND lower(name) = lower('Vitex') LIMIT 1;

  INSERT INTO public.herbs (user_id, name)
    VALUES (v_user_id, 'Spikenard')
    ON CONFLICT DO NOTHING;
  SELECT id INTO herb_47 FROM public.herbs WHERE user_id = v_user_id AND lower(name) = lower('Spikenard') LIMIT 1;

  INSERT INTO public.herbs (user_id, name)
    VALUES (v_user_id, 'Shepherd''s purse')
    ON CONFLICT DO NOTHING;
  SELECT id INTO herb_48 FROM public.herbs WHERE user_id = v_user_id AND lower(name) = lower('Shepherd''s purse') LIMIT 1;

  INSERT INTO public.herbs (user_id, name)
    VALUES (v_user_id, 'Vervain')
    ON CONFLICT DO NOTHING;
  SELECT id INTO herb_49 FROM public.herbs WHERE user_id = v_user_id AND lower(name) = lower('Vervain') LIMIT 1;

  INSERT INTO public.herbs (user_id, name)
    VALUES (v_user_id, 'Ra')
    ON CONFLICT DO NOTHING;
  SELECT id INTO herb_50 FROM public.herbs WHERE user_id = v_user_id AND lower(name) = lower('Ra') LIMIT 1;

  INSERT INTO public.herbs (user_id, name)
    VALUES (v_user_id, 'Schisandra')
    ON CONFLICT DO NOTHING;
  SELECT id INTO herb_51 FROM public.herbs WHERE user_id = v_user_id AND lower(name) = lower('Schisandra') LIMIT 1;

  INSERT INTO public.herbs (user_id, name)
    VALUES (v_user_id, 'Sage')
    ON CONFLICT DO NOTHING;
  SELECT id INTO herb_52 FROM public.herbs WHERE user_id = v_user_id AND lower(name) = lower('Sage') LIMIT 1;

  INSERT INTO public.herbs (user_id, name)
    VALUES (v_user_id, 'Skull cap')
    ON CONFLICT DO NOTHING;
  SELECT id INTO herb_53 FROM public.herbs WHERE user_id = v_user_id AND lower(name) = lower('Skull cap') LIMIT 1;

  INSERT INTO public.herbs (user_id, name)
    VALUES (v_user_id, 'Reishi')
    ON CONFLICT DO NOTHING;
  SELECT id INTO herb_54 FROM public.herbs WHERE user_id = v_user_id AND lower(name) = lower('Reishi') LIMIT 1;

  INSERT INTO public.herbs (user_id, name)
    VALUES (v_user_id, 'Raspberry leaf')
    ON CONFLICT DO NOTHING;
  SELECT id INTO herb_55 FROM public.herbs WHERE user_id = v_user_id AND lower(name) = lower('Raspberry leaf') LIMIT 1;

  INSERT INTO public.herbs (user_id, name)
    VALUES (v_user_id, 'Pipsissewa')
    ON CONFLICT DO NOTHING;
  SELECT id INTO herb_56 FROM public.herbs WHERE user_id = v_user_id AND lower(name) = lower('Pipsissewa') LIMIT 1;

  INSERT INTO public.herbs (user_id, name)
    VALUES (v_user_id, 'Periwinkle')
    ON CONFLICT DO NOTHING;
  SELECT id INTO herb_57 FROM public.herbs WHERE user_id = v_user_id AND lower(name) = lower('Periwinkle') LIMIT 1;

  INSERT INTO public.herbs (user_id, name)
    VALUES (v_user_id, 'Peppermint')
    ON CONFLICT DO NOTHING;
  SELECT id INTO herb_58 FROM public.herbs WHERE user_id = v_user_id AND lower(name) = lower('Peppermint') LIMIT 1;

  INSERT INTO public.herbs (user_id, name)
    VALUES (v_user_id, 'Olive leaf')
    ON CONFLICT DO NOTHING;
  SELECT id INTO herb_59 FROM public.herbs WHERE user_id = v_user_id AND lower(name) = lower('Olive leaf') LIMIT 1;

  INSERT INTO public.herbs (user_id, name)
    VALUES (v_user_id, 'Mug wart')
    ON CONFLICT DO NOTHING;
  SELECT id INTO herb_60 FROM public.herbs WHERE user_id = v_user_id AND lower(name) = lower('Mug wart') LIMIT 1;

  INSERT INTO public.herbs (user_id, name)
    VALUES (v_user_id, 'Nettle')
    ON CONFLICT DO NOTHING;
  SELECT id INTO herb_61 FROM public.herbs WHERE user_id = v_user_id AND lower(name) = lower('Nettle') LIMIT 1;

  INSERT INTO public.herbs (user_id, name)
    VALUES (v_user_id, 'Milk thistle')
    ON CONFLICT DO NOTHING;
  SELECT id INTO herb_62 FROM public.herbs WHERE user_id = v_user_id AND lower(name) = lower('Milk thistle') LIMIT 1;

  INSERT INTO public.herbs (user_id, name)
    VALUES (v_user_id, 'Melissa/lemon balm')
    ON CONFLICT DO NOTHING;
  SELECT id INTO herb_63 FROM public.herbs WHERE user_id = v_user_id AND lower(name) = lower('Melissa/lemon balm') LIMIT 1;

  INSERT INTO public.herbs (user_id, name)
    VALUES (v_user_id, 'Lemongrass')
    ON CONFLICT DO NOTHING;
  SELECT id INTO herb_64 FROM public.herbs WHERE user_id = v_user_id AND lower(name) = lower('Lemongrass') LIMIT 1;

  INSERT INTO public.herbs (user_id, name)
    VALUES (v_user_id, 'Lavender')
    ON CONFLICT DO NOTHING;
  SELECT id INTO herb_65 FROM public.herbs WHERE user_id = v_user_id AND lower(name) = lower('Lavender') LIMIT 1;

  INSERT INTO public.herbs (user_id, name)
    VALUES (v_user_id, 'Lycopus')
    ON CONFLICT DO NOTHING;
  SELECT id INTO herb_66 FROM public.herbs WHERE user_id = v_user_id AND lower(name) = lower('Lycopus') LIMIT 1;

  INSERT INTO public.herbs (user_id, name)
    VALUES (v_user_id, 'Licorice')
    ON CONFLICT DO NOTHING;
  SELECT id INTO herb_67 FROM public.herbs WHERE user_id = v_user_id AND lower(name) = lower('Licorice') LIMIT 1;

  INSERT INTO public.herbs (user_id, name)
    VALUES (v_user_id, 'Ladies mantle')
    ON CONFLICT DO NOTHING;
  SELECT id INTO herb_68 FROM public.herbs WHERE user_id = v_user_id AND lower(name) = lower('Ladies mantle') LIMIT 1;

  INSERT INTO public.herbs (user_id, name)
    VALUES (v_user_id, 'Fireweed')
    ON CONFLICT DO NOTHING;
  SELECT id INTO herb_69 FROM public.herbs WHERE user_id = v_user_id AND lower(name) = lower('Fireweed') LIMIT 1;

  INSERT INTO public.herbs (user_id, name)
    VALUES (v_user_id, 'Feverfew')
    ON CONFLICT DO NOTHING;
  SELECT id INTO herb_70 FROM public.herbs WHERE user_id = v_user_id AND lower(name) = lower('Feverfew') LIMIT 1;

  INSERT INTO public.herbs (user_id, name)
    VALUES (v_user_id, 'Horsechestnut')
    ON CONFLICT DO NOTHING;
  SELECT id INTO herb_71 FROM public.herbs WHERE user_id = v_user_id AND lower(name) = lower('Horsechestnut') LIMIT 1;

  INSERT INTO public.herbs (user_id, name)
    VALUES (v_user_id, 'Ginko')
    ON CONFLICT DO NOTHING;
  SELECT id INTO herb_72 FROM public.herbs WHERE user_id = v_user_id AND lower(name) = lower('Ginko') LIMIT 1;

  INSERT INTO public.herbs (user_id, name)
    VALUES (v_user_id, 'Eclipta')
    ON CONFLICT DO NOTHING;
  SELECT id INTO herb_73 FROM public.herbs WHERE user_id = v_user_id AND lower(name) = lower('Eclipta') LIMIT 1;

  INSERT INTO public.herbs (user_id, name)
    VALUES (v_user_id, 'Eluethero')
    ON CONFLICT DO NOTHING;
  SELECT id INTO herb_74 FROM public.herbs WHERE user_id = v_user_id AND lower(name) = lower('Eluethero') LIMIT 1;

  INSERT INTO public.herbs (user_id, name)
    VALUES (v_user_id, 'Echinacea')
    ON CONFLICT DO NOTHING;
  SELECT id INTO herb_75 FROM public.herbs WHERE user_id = v_user_id AND lower(name) = lower('Echinacea') LIMIT 1;

  INSERT INTO public.herbs (user_id, name)
    VALUES (v_user_id, 'Eyebright')
    ON CONFLICT DO NOTHING;
  SELECT id INTO herb_76 FROM public.herbs WHERE user_id = v_user_id AND lower(name) = lower('Eyebright') LIMIT 1;

  INSERT INTO public.herbs (user_id, name)
    VALUES (v_user_id, 'Couch grass')
    ON CONFLICT DO NOTHING;
  SELECT id INTO herb_77 FROM public.herbs WHERE user_id = v_user_id AND lower(name) = lower('Couch grass') LIMIT 1;

  INSERT INTO public.herbs (user_id, name)
    VALUES (v_user_id, 'Cats claw')
    ON CONFLICT DO NOTHING;
  SELECT id INTO herb_78 FROM public.herbs WHERE user_id = v_user_id AND lower(name) = lower('Cats claw') LIMIT 1;

  INSERT INTO public.herbs (user_id, name)
    VALUES (v_user_id, 'Baptisia')
    ON CONFLICT DO NOTHING;
  SELECT id INTO herb_79 FROM public.herbs WHERE user_id = v_user_id AND lower(name) = lower('Baptisia') LIMIT 1;

  INSERT INTO public.herbs (user_id, name)
    VALUES (v_user_id, 'Birch')
    ON CONFLICT DO NOTHING;
  SELECT id INTO herb_80 FROM public.herbs WHERE user_id = v_user_id AND lower(name) = lower('Birch') LIMIT 1;

  INSERT INTO public.herbs (user_id, name)
    VALUES (v_user_id, 'Black hole')
    ON CONFLICT DO NOTHING;
  SELECT id INTO herb_81 FROM public.herbs WHERE user_id = v_user_id AND lower(name) = lower('Black hole') LIMIT 1;

  INSERT INTO public.herbs (user_id, name)
    VALUES (v_user_id, 'Bee balm')
    ON CONFLICT DO NOTHING;
  SELECT id INTO herb_82 FROM public.herbs WHERE user_id = v_user_id AND lower(name) = lower('Bee balm') LIMIT 1;

  INSERT INTO public.herbs (user_id, name)
    VALUES (v_user_id, 'Borage')
    ON CONFLICT DO NOTHING;
  SELECT id INTO herb_83 FROM public.herbs WHERE user_id = v_user_id AND lower(name) = lower('Borage') LIMIT 1;

  INSERT INTO public.herbs (user_id, name)
    VALUES (v_user_id, 'Artichoke')
    ON CONFLICT DO NOTHING;
  SELECT id INTO herb_84 FROM public.herbs WHERE user_id = v_user_id AND lower(name) = lower('Artichoke') LIMIT 1;

  INSERT INTO public.herbs (user_id, name)
    VALUES (v_user_id, 'Artemisia')
    ON CONFLICT DO NOTHING;
  SELECT id INTO herb_85 FROM public.herbs WHERE user_id = v_user_id AND lower(name) = lower('Artemisia') LIMIT 1;

  INSERT INTO public.herbs (user_id, name)
    VALUES (v_user_id, 'Ashwanganda')
    ON CONFLICT DO NOTHING;
  SELECT id INTO herb_86 FROM public.herbs WHERE user_id = v_user_id AND lower(name) = lower('Ashwanganda') LIMIT 1;

  INSERT INTO public.herbs (user_id, name)
    VALUES (v_user_id, 'Hawthorne')
    ON CONFLICT DO NOTHING;
  SELECT id INTO herb_87 FROM public.herbs WHERE user_id = v_user_id AND lower(name) = lower('Hawthorne') LIMIT 1;

  -- Insert inventory entries (skip if already exists)

  INSERT INTO public.inventory (user_id, herb_id, location, status, tincture_started_at, tincture_ready_at, notes)
    VALUES (v_user_id, herb_0, 'clinic', 'low', NULL, NULL, NULL)
    ON CONFLICT (herb_id, location) DO NOTHING;

  INSERT INTO public.inventory (user_id, herb_id, location, status, tincture_started_at, tincture_ready_at, notes)
    VALUES (v_user_id, herb_1, 'clinic', 'low', NULL, NULL, NULL)
    ON CONFLICT (herb_id, location) DO NOTHING;

  INSERT INTO public.inventory (user_id, herb_id, location, status, tincture_started_at, tincture_ready_at, notes)
    VALUES (v_user_id, herb_2, 'clinic', 'low', NULL, NULL, NULL)
    ON CONFLICT (herb_id, location) DO NOTHING;

  INSERT INTO public.inventory (user_id, herb_id, location, status, tincture_started_at, tincture_ready_at, notes)
    VALUES (v_user_id, herb_3, 'backstock', 'low', NULL, NULL, NULL)
    ON CONFLICT (herb_id, location) DO NOTHING;

  INSERT INTO public.inventory (user_id, herb_id, location, status, tincture_started_at, tincture_ready_at, notes)
    VALUES (v_user_id, herb_4, 'backstock', 'low', NULL, NULL, NULL)
    ON CONFLICT (herb_id, location) DO NOTHING;

  INSERT INTO public.inventory (user_id, herb_id, location, status, tincture_started_at, tincture_ready_at, notes)
    VALUES (v_user_id, herb_5, 'backstock', 'low', NULL, NULL, NULL)
    ON CONFLICT (herb_id, location) DO NOTHING;

  INSERT INTO public.inventory (user_id, herb_id, location, status, tincture_started_at, tincture_ready_at, notes)
    VALUES (v_user_id, herb_6, 'tincture', 'low', '2026-02-03T21:04:32.234+00:00', '2026-02-17T21:04:32.234+00:00', NULL)
    ON CONFLICT (herb_id, location) DO NOTHING;

  INSERT INTO public.inventory (user_id, herb_id, location, status, tincture_started_at, tincture_ready_at, notes)
    VALUES (v_user_id, herb_7, 'backstock', 'full', NULL, NULL, NULL)
    ON CONFLICT (herb_id, location) DO NOTHING;

  INSERT INTO public.inventory (user_id, herb_id, location, status, tincture_started_at, tincture_ready_at, notes)
    VALUES (v_user_id, herb_8, 'clinic', 'low', NULL, NULL, NULL)
    ON CONFLICT (herb_id, location) DO NOTHING;

  INSERT INTO public.inventory (user_id, herb_id, location, status, tincture_started_at, tincture_ready_at, notes)
    VALUES (v_user_id, herb_9, 'clinic', 'low', NULL, NULL, NULL)
    ON CONFLICT (herb_id, location) DO NOTHING;

  INSERT INTO public.inventory (user_id, herb_id, location, status, tincture_started_at, tincture_ready_at, notes)
    VALUES (v_user_id, herb_10, 'tincture', 'full', '2026-01-23T16:05:50.254+00:00', '2026-02-06T16:05:50.254+00:00', NULL)
    ON CONFLICT (herb_id, location) DO NOTHING;

  INSERT INTO public.inventory (user_id, herb_id, location, status, tincture_started_at, tincture_ready_at, notes)
    VALUES (v_user_id, herb_11, 'tincture', 'full', '2026-01-23T16:03:39.498+00:00', '2026-02-06T16:03:39.498+00:00', NULL)
    ON CONFLICT (herb_id, location) DO NOTHING;

  INSERT INTO public.inventory (user_id, herb_id, location, status, tincture_started_at, tincture_ready_at, notes)
    VALUES (v_user_id, herb_12, 'tincture', 'full', '2026-01-23T16:03:37.346+00:00', '2026-02-06T16:03:37.346+00:00', NULL)
    ON CONFLICT (herb_id, location) DO NOTHING;

  INSERT INTO public.inventory (user_id, herb_id, location, status, tincture_started_at, tincture_ready_at, notes)
    VALUES (v_user_id, herb_13, 'tincture', 'full', '2026-01-23T16:03:36.914+00:00', '2026-02-06T16:03:36.914+00:00', NULL)
    ON CONFLICT (herb_id, location) DO NOTHING;

  INSERT INTO public.inventory (user_id, herb_id, location, status, tincture_started_at, tincture_ready_at, notes)
    VALUES (v_user_id, herb_14, 'tincture', 'full', '2026-01-23T15:42:42.833+00:00', '2026-02-06T15:42:42.833+00:00', NULL)
    ON CONFLICT (herb_id, location) DO NOTHING;

  INSERT INTO public.inventory (user_id, herb_id, location, status, tincture_started_at, tincture_ready_at, notes)
    VALUES (v_user_id, herb_15, 'tincture', 'full', '2026-01-23T15:42:41.762+00:00', '2026-02-06T15:42:41.762+00:00', NULL)
    ON CONFLICT (herb_id, location) DO NOTHING;

  INSERT INTO public.inventory (user_id, herb_id, location, status, tincture_started_at, tincture_ready_at, notes)
    VALUES (v_user_id, herb_16, 'tincture', 'full', '2026-01-23T15:42:39.869+00:00', '2026-01-26T01:12:08.362+00:00', NULL)
    ON CONFLICT (herb_id, location) DO NOTHING;

  INSERT INTO public.inventory (user_id, herb_id, location, status, tincture_started_at, tincture_ready_at, notes)
    VALUES (v_user_id, herb_17, 'tincture', 'full', '2026-01-23T15:42:38.946+00:00', '2026-02-06T15:42:38.946+00:00', NULL)
    ON CONFLICT (herb_id, location) DO NOTHING;

  INSERT INTO public.inventory (user_id, herb_id, location, status, tincture_started_at, tincture_ready_at, notes)
    VALUES (v_user_id, herb_18, 'tincture', 'full', '2026-01-23T15:42:37.988+00:00', '2026-01-25T13:09:59.868+00:00', NULL)
    ON CONFLICT (herb_id, location) DO NOTHING;

  INSERT INTO public.inventory (user_id, herb_id, location, status, tincture_started_at, tincture_ready_at, notes)
    VALUES (v_user_id, herb_19, 'tincture', 'full', '2026-01-23T15:42:37.052+00:00', '2026-02-06T15:42:37.052+00:00', NULL)
    ON CONFLICT (herb_id, location) DO NOTHING;

  INSERT INTO public.inventory (user_id, herb_id, location, status, tincture_started_at, tincture_ready_at, notes)
    VALUES (v_user_id, herb_20, 'tincture', 'full', '2026-01-23T15:42:36.124+00:00', '2026-02-06T15:42:36.124+00:00', NULL)
    ON CONFLICT (herb_id, location) DO NOTHING;

  INSERT INTO public.inventory (user_id, herb_id, location, status, tincture_started_at, tincture_ready_at, notes)
    VALUES (v_user_id, herb_21, 'tincture', 'full', '2026-01-23T15:42:34.377+00:00', '2026-02-06T15:42:34.377+00:00', NULL)
    ON CONFLICT (herb_id, location) DO NOTHING;

  INSERT INTO public.inventory (user_id, herb_id, location, status, tincture_started_at, tincture_ready_at, notes)
    VALUES (v_user_id, herb_22, 'tincture', 'full', '2026-01-23T15:42:33.201+00:00', '2026-02-06T15:42:33.201+00:00', NULL)
    ON CONFLICT (herb_id, location) DO NOTHING;

  INSERT INTO public.inventory (user_id, herb_id, location, status, tincture_started_at, tincture_ready_at, notes)
    VALUES (v_user_id, herb_23, 'tincture', 'full', '2026-01-23T15:42:32.589+00:00', '2026-02-06T15:42:32.589+00:00', NULL)
    ON CONFLICT (herb_id, location) DO NOTHING;

  INSERT INTO public.inventory (user_id, herb_id, location, status, tincture_started_at, tincture_ready_at, notes)
    VALUES (v_user_id, herb_24, 'clinic', 'low', NULL, NULL, NULL)
    ON CONFLICT (herb_id, location) DO NOTHING;

  INSERT INTO public.inventory (user_id, herb_id, location, status, tincture_started_at, tincture_ready_at, notes)
    VALUES (v_user_id, herb_25, 'clinic', 'out', NULL, NULL, NULL)
    ON CONFLICT (herb_id, location) DO NOTHING;

  INSERT INTO public.inventory (user_id, herb_id, location, status, tincture_started_at, tincture_ready_at, notes)
    VALUES (v_user_id, herb_26, 'clinic', 'low', NULL, NULL, NULL)
    ON CONFLICT (herb_id, location) DO NOTHING;

  INSERT INTO public.inventory (user_id, herb_id, location, status, tincture_started_at, tincture_ready_at, notes)
    VALUES (v_user_id, herb_27, 'clinic', 'low', NULL, NULL, NULL)
    ON CONFLICT (herb_id, location) DO NOTHING;

  INSERT INTO public.inventory (user_id, herb_id, location, status, tincture_started_at, tincture_ready_at, notes)
    VALUES (v_user_id, herb_28, 'clinic', 'low', NULL, NULL, NULL)
    ON CONFLICT (herb_id, location) DO NOTHING;

  INSERT INTO public.inventory (user_id, herb_id, location, status, tincture_started_at, tincture_ready_at, notes)
    VALUES (v_user_id, herb_29, 'clinic', 'low', NULL, NULL, NULL)
    ON CONFLICT (herb_id, location) DO NOTHING;

  INSERT INTO public.inventory (user_id, herb_id, location, status, tincture_started_at, tincture_ready_at, notes)
    VALUES (v_user_id, herb_30, 'clinic', 'out', NULL, NULL, NULL)
    ON CONFLICT (herb_id, location) DO NOTHING;

  INSERT INTO public.inventory (user_id, herb_id, location, status, tincture_started_at, tincture_ready_at, notes)
    VALUES (v_user_id, herb_31, 'clinic', 'low', NULL, NULL, NULL)
    ON CONFLICT (herb_id, location) DO NOTHING;

  INSERT INTO public.inventory (user_id, herb_id, location, status, tincture_started_at, tincture_ready_at, notes)
    VALUES (v_user_id, herb_32, 'clinic', 'low', NULL, NULL, NULL)
    ON CONFLICT (herb_id, location) DO NOTHING;

  INSERT INTO public.inventory (user_id, herb_id, location, status, tincture_started_at, tincture_ready_at, notes)
    VALUES (v_user_id, herb_23, 'clinic', 'low', NULL, NULL, NULL)
    ON CONFLICT (herb_id, location) DO NOTHING;

  INSERT INTO public.inventory (user_id, herb_id, location, status, tincture_started_at, tincture_ready_at, notes)
    VALUES (v_user_id, herb_33, 'clinic', 'low', NULL, NULL, NULL)
    ON CONFLICT (herb_id, location) DO NOTHING;

  INSERT INTO public.inventory (user_id, herb_id, location, status, tincture_started_at, tincture_ready_at, notes)
    VALUES (v_user_id, herb_34, 'clinic', 'low', NULL, NULL, NULL)
    ON CONFLICT (herb_id, location) DO NOTHING;

  INSERT INTO public.inventory (user_id, herb_id, location, status, tincture_started_at, tincture_ready_at, notes)
    VALUES (v_user_id, herb_35, 'clinic', 'low', NULL, NULL, NULL)
    ON CONFLICT (herb_id, location) DO NOTHING;

  INSERT INTO public.inventory (user_id, herb_id, location, status, tincture_started_at, tincture_ready_at, notes)
    VALUES (v_user_id, herb_36, 'clinic', 'low', NULL, NULL, NULL)
    ON CONFLICT (herb_id, location) DO NOTHING;

  INSERT INTO public.inventory (user_id, herb_id, location, status, tincture_started_at, tincture_ready_at, notes)
    VALUES (v_user_id, herb_37, 'backstock', 'full', NULL, NULL, NULL)
    ON CONFLICT (herb_id, location) DO NOTHING;

  INSERT INTO public.inventory (user_id, herb_id, location, status, tincture_started_at, tincture_ready_at, notes)
    VALUES (v_user_id, herb_38, 'backstock', 'full', NULL, NULL, NULL)
    ON CONFLICT (herb_id, location) DO NOTHING;

  INSERT INTO public.inventory (user_id, herb_id, location, status, tincture_started_at, tincture_ready_at, notes)
    VALUES (v_user_id, herb_39, 'backstock', 'full', NULL, NULL, NULL)
    ON CONFLICT (herb_id, location) DO NOTHING;

  INSERT INTO public.inventory (user_id, herb_id, location, status, tincture_started_at, tincture_ready_at, notes)
    VALUES (v_user_id, herb_40, 'backstock', 'full', NULL, NULL, NULL)
    ON CONFLICT (herb_id, location) DO NOTHING;

  INSERT INTO public.inventory (user_id, herb_id, location, status, tincture_started_at, tincture_ready_at, notes)
    VALUES (v_user_id, herb_41, 'backstock', 'full', NULL, NULL, NULL)
    ON CONFLICT (herb_id, location) DO NOTHING;

  INSERT INTO public.inventory (user_id, herb_id, location, status, tincture_started_at, tincture_ready_at, notes)
    VALUES (v_user_id, herb_42, 'backstock', 'full', NULL, NULL, NULL)
    ON CONFLICT (herb_id, location) DO NOTHING;

  INSERT INTO public.inventory (user_id, herb_id, location, status, tincture_started_at, tincture_ready_at, notes)
    VALUES (v_user_id, herb_43, 'backstock', 'full', NULL, NULL, NULL)
    ON CONFLICT (herb_id, location) DO NOTHING;

  INSERT INTO public.inventory (user_id, herb_id, location, status, tincture_started_at, tincture_ready_at, notes)
    VALUES (v_user_id, herb_44, 'backstock', 'full', NULL, NULL, NULL)
    ON CONFLICT (herb_id, location) DO NOTHING;

  INSERT INTO public.inventory (user_id, herb_id, location, status, tincture_started_at, tincture_ready_at, notes)
    VALUES (v_user_id, herb_45, 'backstock', 'full', NULL, NULL, NULL)
    ON CONFLICT (herb_id, location) DO NOTHING;

  INSERT INTO public.inventory (user_id, herb_id, location, status, tincture_started_at, tincture_ready_at, notes)
    VALUES (v_user_id, herb_46, 'backstock', 'full', NULL, NULL, NULL)
    ON CONFLICT (herb_id, location) DO NOTHING;

  INSERT INTO public.inventory (user_id, herb_id, location, status, tincture_started_at, tincture_ready_at, notes)
    VALUES (v_user_id, herb_47, 'backstock', 'full', NULL, NULL, NULL)
    ON CONFLICT (herb_id, location) DO NOTHING;

  INSERT INTO public.inventory (user_id, herb_id, location, status, tincture_started_at, tincture_ready_at, notes)
    VALUES (v_user_id, herb_48, 'backstock', 'full', NULL, NULL, NULL)
    ON CONFLICT (herb_id, location) DO NOTHING;

  INSERT INTO public.inventory (user_id, herb_id, location, status, tincture_started_at, tincture_ready_at, notes)
    VALUES (v_user_id, herb_49, 'backstock', 'full', NULL, NULL, NULL)
    ON CONFLICT (herb_id, location) DO NOTHING;

  INSERT INTO public.inventory (user_id, herb_id, location, status, tincture_started_at, tincture_ready_at, notes)
    VALUES (v_user_id, herb_50, 'backstock', 'full', NULL, NULL, NULL)
    ON CONFLICT (herb_id, location) DO NOTHING;

  INSERT INTO public.inventory (user_id, herb_id, location, status, tincture_started_at, tincture_ready_at, notes)
    VALUES (v_user_id, herb_51, 'backstock', 'full', NULL, NULL, NULL)
    ON CONFLICT (herb_id, location) DO NOTHING;

  INSERT INTO public.inventory (user_id, herb_id, location, status, tincture_started_at, tincture_ready_at, notes)
    VALUES (v_user_id, herb_52, 'backstock', 'full', NULL, NULL, NULL)
    ON CONFLICT (herb_id, location) DO NOTHING;

  INSERT INTO public.inventory (user_id, herb_id, location, status, tincture_started_at, tincture_ready_at, notes)
    VALUES (v_user_id, herb_53, 'backstock', 'full', NULL, NULL, NULL)
    ON CONFLICT (herb_id, location) DO NOTHING;

  INSERT INTO public.inventory (user_id, herb_id, location, status, tincture_started_at, tincture_ready_at, notes)
    VALUES (v_user_id, herb_54, 'backstock', 'full', NULL, NULL, NULL)
    ON CONFLICT (herb_id, location) DO NOTHING;

  INSERT INTO public.inventory (user_id, herb_id, location, status, tincture_started_at, tincture_ready_at, notes)
    VALUES (v_user_id, herb_55, 'backstock', 'full', NULL, NULL, NULL)
    ON CONFLICT (herb_id, location) DO NOTHING;

  INSERT INTO public.inventory (user_id, herb_id, location, status, tincture_started_at, tincture_ready_at, notes)
    VALUES (v_user_id, herb_56, 'backstock', 'full', NULL, NULL, NULL)
    ON CONFLICT (herb_id, location) DO NOTHING;

  INSERT INTO public.inventory (user_id, herb_id, location, status, tincture_started_at, tincture_ready_at, notes)
    VALUES (v_user_id, herb_57, 'backstock', 'full', NULL, NULL, NULL)
    ON CONFLICT (herb_id, location) DO NOTHING;

  INSERT INTO public.inventory (user_id, herb_id, location, status, tincture_started_at, tincture_ready_at, notes)
    VALUES (v_user_id, herb_12, 'backstock', 'full', NULL, NULL, NULL)
    ON CONFLICT (herb_id, location) DO NOTHING;

  INSERT INTO public.inventory (user_id, herb_id, location, status, tincture_started_at, tincture_ready_at, notes)
    VALUES (v_user_id, herb_58, 'backstock', 'full', NULL, NULL, NULL)
    ON CONFLICT (herb_id, location) DO NOTHING;

  INSERT INTO public.inventory (user_id, herb_id, location, status, tincture_started_at, tincture_ready_at, notes)
    VALUES (v_user_id, herb_59, 'backstock', 'full', NULL, NULL, NULL)
    ON CONFLICT (herb_id, location) DO NOTHING;

  INSERT INTO public.inventory (user_id, herb_id, location, status, tincture_started_at, tincture_ready_at, notes)
    VALUES (v_user_id, herb_60, 'backstock', 'full', NULL, NULL, NULL)
    ON CONFLICT (herb_id, location) DO NOTHING;

  INSERT INTO public.inventory (user_id, herb_id, location, status, tincture_started_at, tincture_ready_at, notes)
    VALUES (v_user_id, herb_61, 'backstock', 'full', NULL, NULL, NULL)
    ON CONFLICT (herb_id, location) DO NOTHING;

  INSERT INTO public.inventory (user_id, herb_id, location, status, tincture_started_at, tincture_ready_at, notes)
    VALUES (v_user_id, herb_62, 'backstock', 'full', NULL, NULL, NULL)
    ON CONFLICT (herb_id, location) DO NOTHING;

  INSERT INTO public.inventory (user_id, herb_id, location, status, tincture_started_at, tincture_ready_at, notes)
    VALUES (v_user_id, herb_63, 'backstock', 'full', NULL, NULL, NULL)
    ON CONFLICT (herb_id, location) DO NOTHING;

  INSERT INTO public.inventory (user_id, herb_id, location, status, tincture_started_at, tincture_ready_at, notes)
    VALUES (v_user_id, herb_64, 'backstock', 'full', NULL, NULL, NULL)
    ON CONFLICT (herb_id, location) DO NOTHING;

  INSERT INTO public.inventory (user_id, herb_id, location, status, tincture_started_at, tincture_ready_at, notes)
    VALUES (v_user_id, herb_65, 'backstock', 'full', NULL, NULL, NULL)
    ON CONFLICT (herb_id, location) DO NOTHING;

  INSERT INTO public.inventory (user_id, herb_id, location, status, tincture_started_at, tincture_ready_at, notes)
    VALUES (v_user_id, herb_66, 'backstock', 'full', NULL, NULL, NULL)
    ON CONFLICT (herb_id, location) DO NOTHING;

  INSERT INTO public.inventory (user_id, herb_id, location, status, tincture_started_at, tincture_ready_at, notes)
    VALUES (v_user_id, herb_67, 'backstock', 'full', NULL, NULL, NULL)
    ON CONFLICT (herb_id, location) DO NOTHING;

  INSERT INTO public.inventory (user_id, herb_id, location, status, tincture_started_at, tincture_ready_at, notes)
    VALUES (v_user_id, herb_68, 'backstock', 'full', NULL, NULL, NULL)
    ON CONFLICT (herb_id, location) DO NOTHING;

  INSERT INTO public.inventory (user_id, herb_id, location, status, tincture_started_at, tincture_ready_at, notes)
    VALUES (v_user_id, herb_69, 'backstock', 'full', NULL, NULL, NULL)
    ON CONFLICT (herb_id, location) DO NOTHING;

  INSERT INTO public.inventory (user_id, herb_id, location, status, tincture_started_at, tincture_ready_at, notes)
    VALUES (v_user_id, herb_34, 'backstock', 'full', NULL, NULL, NULL)
    ON CONFLICT (herb_id, location) DO NOTHING;

  INSERT INTO public.inventory (user_id, herb_id, location, status, tincture_started_at, tincture_ready_at, notes)
    VALUES (v_user_id, herb_24, 'backstock', 'full', NULL, NULL, NULL)
    ON CONFLICT (herb_id, location) DO NOTHING;

  INSERT INTO public.inventory (user_id, herb_id, location, status, tincture_started_at, tincture_ready_at, notes)
    VALUES (v_user_id, herb_70, 'backstock', 'full', NULL, NULL, NULL)
    ON CONFLICT (herb_id, location) DO NOTHING;

  INSERT INTO public.inventory (user_id, herb_id, location, status, tincture_started_at, tincture_ready_at, notes)
    VALUES (v_user_id, herb_71, 'backstock', 'full', NULL, NULL, NULL)
    ON CONFLICT (herb_id, location) DO NOTHING;

  INSERT INTO public.inventory (user_id, herb_id, location, status, tincture_started_at, tincture_ready_at, notes)
    VALUES (v_user_id, herb_72, 'backstock', 'full', NULL, NULL, NULL)
    ON CONFLICT (herb_id, location) DO NOTHING;

  INSERT INTO public.inventory (user_id, herb_id, location, status, tincture_started_at, tincture_ready_at, notes)
    VALUES (v_user_id, herb_73, 'backstock', 'full', NULL, NULL, NULL)
    ON CONFLICT (herb_id, location) DO NOTHING;

  INSERT INTO public.inventory (user_id, herb_id, location, status, tincture_started_at, tincture_ready_at, notes)
    VALUES (v_user_id, herb_74, 'backstock', 'full', NULL, NULL, NULL)
    ON CONFLICT (herb_id, location) DO NOTHING;

  INSERT INTO public.inventory (user_id, herb_id, location, status, tincture_started_at, tincture_ready_at, notes)
    VALUES (v_user_id, herb_75, 'backstock', 'full', NULL, NULL, NULL)
    ON CONFLICT (herb_id, location) DO NOTHING;

  INSERT INTO public.inventory (user_id, herb_id, location, status, tincture_started_at, tincture_ready_at, notes)
    VALUES (v_user_id, herb_76, 'backstock', 'full', NULL, NULL, NULL)
    ON CONFLICT (herb_id, location) DO NOTHING;

  INSERT INTO public.inventory (user_id, herb_id, location, status, tincture_started_at, tincture_ready_at, notes)
    VALUES (v_user_id, herb_77, 'backstock', 'full', NULL, NULL, NULL)
    ON CONFLICT (herb_id, location) DO NOTHING;

  INSERT INTO public.inventory (user_id, herb_id, location, status, tincture_started_at, tincture_ready_at, notes)
    VALUES (v_user_id, herb_78, 'backstock', 'full', NULL, NULL, NULL)
    ON CONFLICT (herb_id, location) DO NOTHING;

  INSERT INTO public.inventory (user_id, herb_id, location, status, tincture_started_at, tincture_ready_at, notes)
    VALUES (v_user_id, herb_79, 'backstock', 'full', NULL, NULL, NULL)
    ON CONFLICT (herb_id, location) DO NOTHING;

  INSERT INTO public.inventory (user_id, herb_id, location, status, tincture_started_at, tincture_ready_at, notes)
    VALUES (v_user_id, herb_80, 'backstock', 'full', NULL, NULL, NULL)
    ON CONFLICT (herb_id, location) DO NOTHING;

  INSERT INTO public.inventory (user_id, herb_id, location, status, tincture_started_at, tincture_ready_at, notes)
    VALUES (v_user_id, herb_9, 'backstock', 'full', NULL, NULL, NULL)
    ON CONFLICT (herb_id, location) DO NOTHING;

  INSERT INTO public.inventory (user_id, herb_id, location, status, tincture_started_at, tincture_ready_at, notes)
    VALUES (v_user_id, herb_81, 'backstock', 'full', NULL, NULL, NULL)
    ON CONFLICT (herb_id, location) DO NOTHING;

  INSERT INTO public.inventory (user_id, herb_id, location, status, tincture_started_at, tincture_ready_at, notes)
    VALUES (v_user_id, herb_82, 'backstock', 'full', NULL, NULL, NULL)
    ON CONFLICT (herb_id, location) DO NOTHING;

  INSERT INTO public.inventory (user_id, herb_id, location, status, tincture_started_at, tincture_ready_at, notes)
    VALUES (v_user_id, herb_22, 'backstock', 'full', NULL, NULL, NULL)
    ON CONFLICT (herb_id, location) DO NOTHING;

  INSERT INTO public.inventory (user_id, herb_id, location, status, tincture_started_at, tincture_ready_at, notes)
    VALUES (v_user_id, herb_36, 'backstock', 'full', NULL, NULL, NULL)
    ON CONFLICT (herb_id, location) DO NOTHING;

  INSERT INTO public.inventory (user_id, herb_id, location, status, tincture_started_at, tincture_ready_at, notes)
    VALUES (v_user_id, herb_83, 'backstock', 'full', NULL, NULL, NULL)
    ON CONFLICT (herb_id, location) DO NOTHING;

  INSERT INTO public.inventory (user_id, herb_id, location, status, tincture_started_at, tincture_ready_at, notes)
    VALUES (v_user_id, herb_84, 'backstock', 'full', NULL, NULL, NULL)
    ON CONFLICT (herb_id, location) DO NOTHING;

  INSERT INTO public.inventory (user_id, herb_id, location, status, tincture_started_at, tincture_ready_at, notes)
    VALUES (v_user_id, herb_85, 'backstock', 'full', NULL, NULL, NULL)
    ON CONFLICT (herb_id, location) DO NOTHING;

  INSERT INTO public.inventory (user_id, herb_id, location, status, tincture_started_at, tincture_ready_at, notes)
    VALUES (v_user_id, herb_86, 'backstock', 'full', NULL, NULL, NULL)
    ON CONFLICT (herb_id, location) DO NOTHING;

  INSERT INTO public.inventory (user_id, herb_id, location, status, tincture_started_at, tincture_ready_at, notes)
    VALUES (v_user_id, herb_87, 'clinic', 'out', NULL, NULL, NULL)
    ON CONFLICT (herb_id, location) DO NOTHING;

  INSERT INTO public.inventory (user_id, herb_id, location, status, tincture_started_at, tincture_ready_at, notes)
    VALUES (v_user_id, herb_61, 'clinic', 'out', NULL, NULL, NULL)
    ON CONFLICT (herb_id, location) DO NOTHING;

END $$;