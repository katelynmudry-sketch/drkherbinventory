-- Populate latin_name and common_name for existing herbs
-- Generated: 2026-02-23T04:21:00.237Z
-- Run in Supabase SQL Editor once.
-- Uses AND latin_name IS NULL so it is safe to re-run (no overwrites).

UPDATE public.herbs SET latin_name = 'Medicago sativa'
WHERE user_id = 'b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4' AND name = 'Alfalfa' AND latin_name IS NULL;

UPDATE public.herbs SET latin_name = 'Agrimonia eupatoria'
WHERE user_id = 'b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4' AND name = 'Agrimony' AND latin_name IS NULL;

UPDATE public.herbs SET latin_name = 'Althaea officinalis', common_name = 'Marshmallow Root'
WHERE user_id = 'b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4' AND name = 'Althea' AND latin_name IS NULL;

UPDATE public.herbs SET latin_name = 'Angelica archangelica'
WHERE user_id = 'b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4' AND name = 'Angelica' AND latin_name IS NULL;

UPDATE public.herbs SET latin_name = 'Pimpinella anisum'
WHERE user_id = 'b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4' AND name = 'Anise' AND latin_name IS NULL;

UPDATE public.herbs SET latin_name = 'Cynara cardunculus'
WHERE user_id = 'b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4' AND name = 'Artichoke' AND latin_name IS NULL;

UPDATE public.herbs SET latin_name = 'Artemisia annua', common_name = 'Wormwood'
WHERE user_id = 'b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4' AND name = 'Artemisia' AND latin_name IS NULL;

UPDATE public.herbs SET latin_name = 'Withania somnifera'
WHERE user_id = 'b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4' AND name = 'Ashwagandha' AND latin_name IS NULL;

UPDATE public.herbs SET latin_name = 'Astragalus membranaceus'
WHERE user_id = 'b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4' AND name = 'Astragalus' AND latin_name IS NULL;

UPDATE public.herbs SET latin_name = 'Avena sativa', common_name = 'Oatstraw'
WHERE user_id = 'b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4' AND name = 'Avena' AND latin_name IS NULL;

UPDATE public.herbs SET latin_name = 'Bacopa monnieri', common_name = 'Brahmi'
WHERE user_id = 'b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4' AND name = 'Bacopa' AND latin_name IS NULL;

UPDATE public.herbs SET latin_name = 'Baptisia tinctoria', common_name = 'Wild Indigo'
WHERE user_id = 'b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4' AND name = 'Baptisia' AND latin_name IS NULL;

UPDATE public.herbs SET latin_name = 'Morella cerifera'
WHERE user_id = 'b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4' AND name = 'Bayberry Root Bark' AND latin_name IS NULL;

UPDATE public.herbs SET latin_name = 'Monarda fistulosa'
WHERE user_id = 'b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4' AND name = 'Bee Balm' AND latin_name IS NULL;

UPDATE public.herbs SET latin_name = 'Betula papyrifera'
WHERE user_id = 'b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4' AND name = 'Birch Bark' AND latin_name IS NULL;

UPDATE public.herbs SET latin_name = 'Betula pendula'
WHERE user_id = 'b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4' AND name = 'Birch Leaf' AND latin_name IS NULL;

UPDATE public.herbs SET latin_name = 'Actaea racemosa'
WHERE user_id = 'b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4' AND name = 'Black Cohosh' AND latin_name IS NULL;

UPDATE public.herbs SET latin_name = 'Viburnum prunifolium'
WHERE user_id = 'b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4' AND name = 'Black Haw' AND latin_name IS NULL;

UPDATE public.herbs SET latin_name = 'Piper nigrum'
WHERE user_id = 'b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4' AND name = 'Black Pepper' AND latin_name IS NULL;

UPDATE public.herbs SET latin_name = 'Juglans nigra'
WHERE user_id = 'b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4' AND name = 'Black Walnut' AND latin_name IS NULL;

UPDATE public.herbs SET latin_name = 'Cnicus benedictus'
WHERE user_id = 'b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4' AND name = 'Blessed Thistle' AND latin_name IS NULL;

UPDATE public.herbs SET latin_name = 'Caulophyllum thalictroides'
WHERE user_id = 'b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4' AND name = 'Blue Cohosh' AND latin_name IS NULL;

UPDATE public.herbs SET latin_name = 'Verbena hastata'
WHERE user_id = 'b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4' AND name = 'Blue Vervain' AND latin_name IS NULL;

UPDATE public.herbs SET latin_name = 'Eupatorium perfoliatum'
WHERE user_id = 'b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4' AND name = 'Boneset' AND latin_name IS NULL;

UPDATE public.herbs SET latin_name = 'Borago officinalis'
WHERE user_id = 'b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4' AND name = 'Borage' AND latin_name IS NULL;

UPDATE public.herbs SET latin_name = 'Lycopus europaeus', common_name = 'Lycopus'
WHERE user_id = 'b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4' AND name = 'Bugleweed' AND latin_name IS NULL;

UPDATE public.herbs SET latin_name = 'Bupleurum chinense'
WHERE user_id = 'b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4' AND name = 'Bupleurum' AND latin_name IS NULL;

UPDATE public.herbs SET latin_name = 'Arctium lappa'
WHERE user_id = 'b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4' AND name = 'Burdock' AND latin_name IS NULL;

UPDATE public.herbs SET latin_name = 'Acorus calamus', common_name = 'Sweet Flag'
WHERE user_id = 'b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4' AND name = 'Calamus' AND latin_name IS NULL;

UPDATE public.herbs SET latin_name = 'Calendula officinalis'
WHERE user_id = 'b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4' AND name = 'Calendula' AND latin_name IS NULL;

UPDATE public.herbs SET latin_name = 'Eschscholzia californica'
WHERE user_id = 'b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4' AND name = 'California Poppy' AND latin_name IS NULL;

UPDATE public.herbs SET latin_name = 'Uncaria tomentosa'
WHERE user_id = 'b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4' AND name = 'Cat''s Claw' AND latin_name IS NULL;

UPDATE public.herbs SET latin_name = 'Nepeta cataria'
WHERE user_id = 'b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4' AND name = 'Catnip' AND latin_name IS NULL;

UPDATE public.herbs SET latin_name = 'Matricaria chamomilla'
WHERE user_id = 'b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4' AND name = 'Chamomile' AND latin_name IS NULL;

UPDATE public.herbs SET latin_name = 'Chelidonium majus', common_name = 'Celandine'
WHERE user_id = 'b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4' AND name = 'Chelidonium' AND latin_name IS NULL;

UPDATE public.herbs SET latin_name = 'Cinnamomum verum'
WHERE user_id = 'b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4' AND name = 'Cinnamon' AND latin_name IS NULL;

UPDATE public.herbs SET latin_name = 'Galium aparine'
WHERE user_id = 'b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4' AND name = 'Cleavers' AND latin_name IS NULL;

UPDATE public.herbs SET latin_name = 'Symphytum officinale'
WHERE user_id = 'b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4' AND name = 'Comfrey Root' AND latin_name IS NULL;

UPDATE public.herbs SET latin_name = 'Elymus repens'
WHERE user_id = 'b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4' AND name = 'Couch Grass' AND latin_name IS NULL;

UPDATE public.herbs SET latin_name = 'Viburnum opulus'
WHERE user_id = 'b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4' AND name = 'Cramp Bark' AND latin_name IS NULL;

UPDATE public.herbs SET latin_name = 'Turnera diffusa'
WHERE user_id = 'b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4' AND name = 'Damiana' AND latin_name IS NULL;

UPDATE public.herbs SET latin_name = 'Taraxacum officinale'
WHERE user_id = 'b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4' AND name = 'Dandelion Leaf' AND latin_name IS NULL;

UPDATE public.herbs SET latin_name = 'Taraxacum officinale'
WHERE user_id = 'b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4' AND name = 'Dandelion Root' AND latin_name IS NULL;

UPDATE public.herbs SET latin_name = 'Harpagophytum procumbens'
WHERE user_id = 'b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4' AND name = 'Devil''s Claw' AND latin_name IS NULL;

UPDATE public.herbs SET latin_name = 'Oplopanax horridus'
WHERE user_id = 'b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4' AND name = 'Devil''s Club' AND latin_name IS NULL;

UPDATE public.herbs SET latin_name = 'Angelica sinensis'
WHERE user_id = 'b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4' AND name = 'Dong Quai' AND latin_name IS NULL;

UPDATE public.herbs SET latin_name = 'Echinacea angustifolia'
WHERE user_id = 'b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4' AND name = 'Echinacea Augustifolia' AND latin_name IS NULL;

UPDATE public.herbs SET latin_name = 'Echinacea purpurea'
WHERE user_id = 'b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4' AND name = 'Echinacea Purpurea Leaf' AND latin_name IS NULL;

UPDATE public.herbs SET latin_name = 'Echinacea purpurea'
WHERE user_id = 'b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4' AND name = 'Echinacea Purpurea Root' AND latin_name IS NULL;

UPDATE public.herbs SET latin_name = 'Eclipta prostrata'
WHERE user_id = 'b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4' AND name = 'Eclipta' AND latin_name IS NULL;

UPDATE public.herbs SET latin_name = 'Eleutherococcus senticosus', common_name = 'Siberian Ginseng'
WHERE user_id = 'b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4' AND name = 'Eleuthero' AND latin_name IS NULL;

UPDATE public.herbs SET latin_name = 'Erigeron canadensis', common_name = 'Fleabane'
WHERE user_id = 'b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4' AND name = 'Erigeron' AND latin_name IS NULL;

UPDATE public.herbs SET latin_name = 'Foeniculum vulgare'
WHERE user_id = 'b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4' AND name = 'Fennel' AND latin_name IS NULL;

UPDATE public.herbs SET latin_name = 'Tanacetum parthenium'
WHERE user_id = 'b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4' AND name = 'Feverfew' AND latin_name IS NULL;

UPDATE public.herbs SET latin_name = 'Gentiana lutea'
WHERE user_id = 'b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4' AND name = 'Gentian' AND latin_name IS NULL;

UPDATE public.herbs SET latin_name = 'Zingiber officinale'
WHERE user_id = 'b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4' AND name = 'Ginger' AND latin_name IS NULL;

UPDATE public.herbs SET latin_name = 'Ginkgo biloba'
WHERE user_id = 'b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4' AND name = 'Ginkgo' AND latin_name IS NULL;

UPDATE public.herbs SET latin_name = 'Lycium barbarum', common_name = 'Goji Berry'
WHERE user_id = 'b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4' AND name = 'Goji' AND latin_name IS NULL;

UPDATE public.herbs SET latin_name = 'Solidago canadensis'
WHERE user_id = 'b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4' AND name = 'Goldenrod' AND latin_name IS NULL;

UPDATE public.herbs SET latin_name = 'Centella asiatica'
WHERE user_id = 'b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4' AND name = 'Gotu Kola' AND latin_name IS NULL;

UPDATE public.herbs SET latin_name = 'Eutrochium purpureum'
WHERE user_id = 'b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4' AND name = 'Gravel Root' AND latin_name IS NULL;

UPDATE public.herbs SET latin_name = 'Crataegus monogyna'
WHERE user_id = 'b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4' AND name = 'Hawthorn' AND latin_name IS NULL;

UPDATE public.herbs SET latin_name = 'Humulus lupulus'
WHERE user_id = 'b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4' AND name = 'Hops' AND latin_name IS NULL;

UPDATE public.herbs SET latin_name = 'Aesculus hippocastanum'
WHERE user_id = 'b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4' AND name = 'Horse Chestnut' AND latin_name IS NULL;

UPDATE public.herbs SET latin_name = 'Equisetum arvense'
WHERE user_id = 'b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4' AND name = 'Horsetail' AND latin_name IS NULL;

UPDATE public.herbs SET latin_name = 'Hypericum perforatum', common_name = 'St. John''s Wort'
WHERE user_id = 'b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4' AND name = 'Hypericum' AND latin_name IS NULL;

UPDATE public.herbs SET latin_name = 'Hyssopus officinalis'
WHERE user_id = 'b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4' AND name = 'Hyssop' AND latin_name IS NULL;

UPDATE public.herbs SET latin_name = 'Inula helenium', common_name = 'Elecampane'
WHERE user_id = 'b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4' AND name = 'Inula' AND latin_name IS NULL;

UPDATE public.herbs SET latin_name = 'Iris versicolor', common_name = 'Blue Flag'
WHERE user_id = 'b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4' AND name = 'Iris' AND latin_name IS NULL;

UPDATE public.herbs SET latin_name = 'Juniperus communis'
WHERE user_id = 'b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4' AND name = 'Juniper' AND latin_name IS NULL;

UPDATE public.herbs SET latin_name = 'Rhododendron groenlandicum'
WHERE user_id = 'b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4' AND name = 'Labrador Tea' AND latin_name IS NULL;

UPDATE public.herbs SET latin_name = 'Alchemilla vulgaris'
WHERE user_id = 'b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4' AND name = 'Lady''s Mantle' AND latin_name IS NULL;

UPDATE public.herbs SET latin_name = 'Lavandula angustifolia'
WHERE user_id = 'b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4' AND name = 'Lavender' AND latin_name IS NULL;

UPDATE public.herbs SET latin_name = 'Melissa officinalis'
WHERE user_id = 'b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4' AND name = 'Lemon Balm' AND latin_name IS NULL;

UPDATE public.herbs SET latin_name = 'Cymbopogon citratus'
WHERE user_id = 'b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4' AND name = 'Lemongrass' AND latin_name IS NULL;

UPDATE public.herbs SET latin_name = 'Glycyrrhiza glabra'
WHERE user_id = 'b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4' AND name = 'Licorice' AND latin_name IS NULL;

UPDATE public.herbs SET latin_name = 'Tilia cordata'
WHERE user_id = 'b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4' AND name = 'Linden' AND latin_name IS NULL;

UPDATE public.herbs SET latin_name = 'Lomatium dissectum'
WHERE user_id = 'b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4' AND name = 'Lomatium' AND latin_name IS NULL;

UPDATE public.herbs SET latin_name = 'Lycopus europaeus', common_name = 'Bugleweed'
WHERE user_id = 'b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4' AND name = 'Lycopus' AND latin_name IS NULL;

UPDATE public.herbs SET latin_name = 'Lepidium meyenii'
WHERE user_id = 'b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4' AND name = 'Maca' AND latin_name IS NULL;

UPDATE public.herbs SET latin_name = 'Althaea officinalis'
WHERE user_id = 'b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4' AND name = 'Marshmallow' AND latin_name IS NULL;

UPDATE public.herbs SET latin_name = 'Filipendula ulmaria'
WHERE user_id = 'b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4' AND name = 'Meadowsweet' AND latin_name IS NULL;

UPDATE public.herbs SET latin_name = 'Silybum marianum'
WHERE user_id = 'b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4' AND name = 'Milk Thistle' AND latin_name IS NULL;

UPDATE public.herbs SET latin_name = 'Leonurus cardiaca'
WHERE user_id = 'b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4' AND name = 'Motherwort' AND latin_name IS NULL;

UPDATE public.herbs SET latin_name = 'Artemisia vulgaris'
WHERE user_id = 'b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4' AND name = 'Mugwort' AND latin_name IS NULL;

UPDATE public.herbs SET latin_name = 'Verbascum thapsus'
WHERE user_id = 'b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4' AND name = 'Mullein' AND latin_name IS NULL;

UPDATE public.herbs SET latin_name = 'Verbascum thapsus'
WHERE user_id = 'b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4' AND name = 'Mullein Root' AND latin_name IS NULL;

UPDATE public.herbs SET latin_name = 'Urtica dioica'
WHERE user_id = 'b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4' AND name = 'Nettle Leaf' AND latin_name IS NULL;

UPDATE public.herbs SET latin_name = 'Urtica dioica'
WHERE user_id = 'b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4' AND name = 'Nettle Root' AND latin_name IS NULL;

UPDATE public.herbs SET latin_name = 'Quercus robur', common_name = 'White Oak Bark'
WHERE user_id = 'b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4' AND name = 'Oak' AND latin_name IS NULL;

UPDATE public.herbs SET latin_name = 'Ocimum tenuiflorum', common_name = 'Holy Basil'
WHERE user_id = 'b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4' AND name = 'Ocimum' AND latin_name IS NULL;

UPDATE public.herbs SET latin_name = 'Olea europaea'
WHERE user_id = 'b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4' AND name = 'Olive Leaf' AND latin_name IS NULL;

UPDATE public.herbs SET latin_name = 'Citrus sinensis'
WHERE user_id = 'b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4' AND name = 'Orange Peel' AND latin_name IS NULL;

UPDATE public.herbs SET latin_name = 'Origanum vulgare'
WHERE user_id = 'b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4' AND name = 'Oregano' AND latin_name IS NULL;

UPDATE public.herbs SET latin_name = 'Mahonia aquifolium'
WHERE user_id = 'b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4' AND name = 'Oregon Grape' AND latin_name IS NULL;

UPDATE public.herbs SET latin_name = 'Ligusticum porteri'
WHERE user_id = 'b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4' AND name = 'Osha' AND latin_name IS NULL;

UPDATE public.herbs SET latin_name = 'Petroselinum crispum'
WHERE user_id = 'b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4' AND name = 'Parsley' AND latin_name IS NULL;

UPDATE public.herbs SET latin_name = 'Passiflora incarnata'
WHERE user_id = 'b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4' AND name = 'Passion Flower' AND latin_name IS NULL;

UPDATE public.herbs SET latin_name = 'Paeonia lactiflora', common_name = 'White Peony Root'
WHERE user_id = 'b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4' AND name = 'Peony' AND latin_name IS NULL;

UPDATE public.herbs SET latin_name = 'Mentha piperita'
WHERE user_id = 'b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4' AND name = 'Peppermint' AND latin_name IS NULL;

UPDATE public.herbs SET latin_name = 'Vinca minor'
WHERE user_id = 'b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4' AND name = 'Periwinkle' AND latin_name IS NULL;

UPDATE public.herbs SET latin_name = 'Plantago major'
WHERE user_id = 'b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4' AND name = 'Plantain' AND latin_name IS NULL;

UPDATE public.herbs SET latin_name = 'Eschscholzia californica', common_name = 'California Poppy'
WHERE user_id = 'b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4' AND name = 'Poppy' AND latin_name IS NULL;

UPDATE public.herbs SET latin_name = 'Rubus idaeus'
WHERE user_id = 'b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4' AND name = 'Raspberry Leaf' AND latin_name IS NULL;

UPDATE public.herbs SET latin_name = 'Trifolium pratense'
WHERE user_id = 'b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4' AND name = 'Red Clover' AND latin_name IS NULL;

UPDATE public.herbs SET latin_name = 'Rheum palmatum', common_name = 'Turkey Rhubarb'
WHERE user_id = 'b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4' AND name = 'Rheum' AND latin_name IS NULL;

UPDATE public.herbs SET latin_name = 'Rhodiola rosea'
WHERE user_id = 'b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4' AND name = 'Rhodiola' AND latin_name IS NULL;

UPDATE public.herbs SET latin_name = 'Rosa damascena'
WHERE user_id = 'b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4' AND name = 'Rose' AND latin_name IS NULL;

UPDATE public.herbs SET latin_name = 'Salvia rosmarinus'
WHERE user_id = 'b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4' AND name = 'Rosemary' AND latin_name IS NULL;

UPDATE public.herbs SET latin_name = 'Ruta graveolens'
WHERE user_id = 'b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4' AND name = 'Rue' AND latin_name IS NULL;

UPDATE public.herbs SET latin_name = 'Rumex crispus', common_name = 'Yellow Dock'
WHERE user_id = 'b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4' AND name = 'Rumex' AND latin_name IS NULL;

UPDATE public.herbs SET latin_name = 'Salvia officinalis'
WHERE user_id = 'b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4' AND name = 'Sage' AND latin_name IS NULL;

UPDATE public.herbs SET latin_name = 'Smilax ornata'
WHERE user_id = 'b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4' AND name = 'Sarsaparilla' AND latin_name IS NULL;

UPDATE public.herbs SET latin_name = 'Schisandra chinensis'
WHERE user_id = 'b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4' AND name = 'Schisandra' AND latin_name IS NULL;

UPDATE public.herbs SET latin_name = 'Scutellaria lateriflora', common_name = 'Skullcap'
WHERE user_id = 'b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4' AND name = 'Scutellaria' AND latin_name IS NULL;

UPDATE public.herbs SET latin_name = 'Prunella vulgaris'
WHERE user_id = 'b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4' AND name = 'Self Heal' AND latin_name IS NULL;

UPDATE public.herbs SET latin_name = 'Asparagus racemosus'
WHERE user_id = 'b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4' AND name = 'Shatavari' AND latin_name IS NULL;

UPDATE public.herbs SET latin_name = 'Capsella bursa-pastoris'
WHERE user_id = 'b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4' AND name = 'Shepherd''s Purse' AND latin_name IS NULL;

UPDATE public.herbs SET latin_name = 'Polygonatum biflorum'
WHERE user_id = 'b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4' AND name = 'Solomon''s Seal' AND latin_name IS NULL;

UPDATE public.herbs SET latin_name = 'Aralia racemosa'
WHERE user_id = 'b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4' AND name = 'Spikenard' AND latin_name IS NULL;

UPDATE public.herbs SET latin_name = 'Acmella oleracea', common_name = 'Toothache Plant'
WHERE user_id = 'b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4' AND name = 'Spilanthes' AND latin_name IS NULL;

UPDATE public.herbs SET latin_name = 'Collinsonia canadensis'
WHERE user_id = 'b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4' AND name = 'Stone Root' AND latin_name IS NULL;

UPDATE public.herbs SET latin_name = 'Thymus vulgaris'
WHERE user_id = 'b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4' AND name = 'Thyme' AND latin_name IS NULL;

UPDATE public.herbs SET latin_name = 'Ocimum tenuiflorum', common_name = 'Holy Basil'
WHERE user_id = 'b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4' AND name = 'Tulsi' AND latin_name IS NULL;

UPDATE public.herbs SET latin_name = 'Valeriana officinalis'
WHERE user_id = 'b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4' AND name = 'Valerian' AND latin_name IS NULL;

UPDATE public.herbs SET latin_name = 'Vitex agnus-castus', common_name = 'Chaste Tree'
WHERE user_id = 'b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4' AND name = 'Vitex' AND latin_name IS NULL;

UPDATE public.herbs SET latin_name = 'Quercus alba'
WHERE user_id = 'b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4' AND name = 'White Oak' AND latin_name IS NULL;

UPDATE public.herbs SET latin_name = 'Lactuca virosa'
WHERE user_id = 'b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4' AND name = 'Wild Lettuce' AND latin_name IS NULL;

UPDATE public.herbs SET latin_name = 'Dioscorea villosa'
WHERE user_id = 'b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4' AND name = 'Wild Yam' AND latin_name IS NULL;

UPDATE public.herbs SET latin_name = 'Achillea millefolium'
WHERE user_id = 'b54fe6fd-fdc2-4aff-b126-3cc267b5b2b4' AND name = 'Yarrow' AND latin_name IS NULL;

-- Done