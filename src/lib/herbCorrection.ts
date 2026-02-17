// Master herb list — matches actual inventory. These are the only valid herb names.
// All voice input is corrected/fuzzy-matched to one of these before saving.
export const HERB_LIST = [
  "Alfalfa",
  "Agrimony",
  "Althea",
  "Angelica",
  "Ashwagandha",
  "Avena",
  "Artemisia",
  "Astragalus",
  "Anise",
  "Artichoke",
  "Bacopa",
  "Baptisia",
  "Bayberry Root Bark",
  "Birch Leaf",
  "Birch Bark",
  "Bee Balm",
  "Black Haw",
  "Black Cohosh",
  "Black Pepper",
  "Black Walnut",
  "Blessed Thistle",
  "Blue Cohosh",
  "Blue Vervain",
  "Borage",
  "Boneset",
  "Burdock",
  "Bugleweed",
  "Bupleurum",
  "California Poppy",
  "Catnip",
  "Cat's Claw",
  "Calamus",
  "Calendula",
  "Chamomile",
  "Chelidonium",
  "Cinnamon",
  "Cleavers",
  "Comfrey Root",
  "Couch Grass",
  "Cramp Bark",
  "Damiana",
  "Dandelion Leaf",
  "Dandelion Root",
  "Devil's Club",
  "Devil's Claw",
  "Dong Quai",
  "Echinacea Augustifolia",
  "Echinacea Purpurea Leaf",
  "Echinacea Purpurea Root",
  "Eclipta",
  "Eleuthero",
  "Erigeron",
  "Fennel",
  "Feverfew",
  "Gentian",
  "Goldenrod",
  "Ginkgo",
  "Gotu Kola",
  "Goji",
  "Ginger",
  "Gravel Root",
  "Hawthorn",
  "Hops",
  "Horsetail",
  "Horse Chestnut",
  "Hypericum",
  "Hyssop",
  "Inula",
  "Iris",
  "Juniper",
  "Labrador Tea",
  "Lavender",
  "Lady's Mantle",
  "Lemon Balm",
  "Lemongrass",
  "Licorice",
  "Linden",
  "Lomatium",
  "Lycopus",
  "Maca",
  "Meadowsweet",
  "Milk Thistle",
  "Marshmallow",
  "Mullein",
  "Mullein Root",
  "Mugwort",
  "Motherwort",
  "Nettle Leaf",
  "Nettle Root",
  "Oak",
  "Ocimum",
  "Olive Leaf",
  "Orange Peel",
  "Oregon Grape",
  "Oregano",
  "Osha",
  "Peppermint",
  "Parsley",
  "Passion Flower",
  "Poppy",
  "Periwinkle",
  "Peony",
  "Plantain",
  "Raspberry Leaf",
  "Red Clover",
  "Rheum",
  "Rhodiola",
  "Rose",
  "Rosemary",
  "Rue",
  "Rumex",
  "Sage",
  "Sarsaparilla",
  "Self Heal",
  "Scutellaria",
  "Schisandra",
  "Shatavari",
  "Shepherd's Purse",
  "Solomon's Seal",
  "Spikenard",
  "Spilanthes",
  "Stone Root",
  "Thyme",
  "Tulsi",
  "Valerian",
  "Vitex",
  "Yarrow",
  "Wild Lettuce",
  "Wild Yam",
  "White Oak",
];

// Common voice recognition mistakes and data-entry typos mapped to canonical herb names.
// Keys are lowercase. Add new entries here when new mishearings are discovered.
export const CORRECTION_MAP: Record<string, string> = {

  // Ashwagandha variations
  "ashwaganda": "Ashwagandha",
  "ashwanganda": "Ashwagandha",
  "asheville gonda": "Ashwagandha",
  "asheville gondola": "Ashwagandha",
  "ash with gonda": "Ashwagandha",
  "ash waganda": "Ashwagandha",
  "ash we gonda": "Ashwagandha",
  "asha gonda": "Ashwagandha",
  "osha gonda": "Ashwagandha",
  "a sugar": "Ashwagandha",
  "ash won da": "Ashwagandha",
  "ashwa gonda": "Ashwagandha",
  "osh won da": "Ashwagandha",

  // Artemisia variations (also called wormwood)
  "artemesia": "Artemisia",
  "artemesia/wormwood": "Artemisia",
  "artemisia/wormwood": "Artemisia",
  "wormwood": "Artemisia",
  "artemesia wormwood": "Artemisia",

  // Echinacea variations
  "echinacea": "Echinacea Augustifolia",
  "echinacea august": "Echinacea Augustifolia",
  "echinacea augs": "Echinacea Augustifolia",
  "echinacea augustifolia": "Echinacea Augustifolia",
  "echinacea purple": "Echinacea Purpurea Leaf",
  "echinacea purpur": "Echinacea Purpurea Leaf",
  "echinacea purpur leaf": "Echinacea Purpurea Leaf",
  "echinacea purpurea leaf": "Echinacea Purpurea Leaf",
  "echinacea purpur root": "Echinacea Purpurea Root",
  "echinacea purpurea root": "Echinacea Purpurea Root",
  "echo nasa": "Echinacea Augustifolia",
  "echo nasia": "Echinacea Augustifolia",
  "etch in asia": "Echinacea Augustifolia",

  // Scutellaria / Skullcap (Scut lat FRESH in inventory)
  "scut lat": "Scutellaria",
  "scut lat fresh": "Scutellaria",
  "skull cap": "Scutellaria",
  "skullcap": "Scutellaria",
  "scullcap": "Scutellaria",
  "school cap": "Scutellaria",
  "skull cat": "Scutellaria",

  // Shatavari variations
  "shatavri": "Shatavari",
  "shot a very": "Shatavari",
  "shot ovary": "Shatavari",
  "shatter very": "Shatavari",
  "chat a very": "Shatavari",
  "shotta very": "Shatavari",
  "shot of ari": "Shatavari",

  // Schisandra variations
  "she sandra": "Schisandra",
  "she's andra": "Schisandra",
  "she sondra": "Schisandra",
  "shih sandra": "Schisandra",
  "shih sondra": "Schisandra",
  "ski sandra": "Schisandra",

  // Gotu Kola variations
  "go to cola": "Gotu Kola",
  "go to kola": "Gotu Kola",
  "go to call a": "Gotu Kola",
  "goto cola": "Gotu Kola",
  "go to koala": "Gotu Kola",
  "goat to cola": "Gotu Kola",
  "goat you cola": "Gotu Kola",

  // Eleuthero variations
  "eluethero": "Eleuthero",
  "a luthero": "Eleuthero",
  "a luthro": "Eleuthero",
  "eluthra": "Eleuthero",
  "you throw": "Eleuthero",
  "el euro": "Eleuthero",

  // Rhodiola variations
  "rodeo la": "Rhodiola",
  "road e ola": "Rhodiola",
  "radio la": "Rhodiola",
  "roddy ola": "Rhodiola",

  // Valerian variations
  "valarian": "Valerian",
  "valerium": "Valerian",
  "valeria": "Valerian",
  "valerie anne": "Valerian",

  // Chamomile variations
  "camomile": "Chamomile",
  "camo mile": "Chamomile",
  "camera mile": "Chamomile",
  "cam a meal": "Chamomile",

  // Lavender variations
  "lavendar": "Lavender",
  "lavander": "Lavender",
  "lava under": "Lavender",

  // Licorice variations
  "liquorice": "Licorice",
  "liquorish": "Licorice",
  "licker ish": "Licorice",
  "liquor ice": "Licorice",

  // Burdock variations
  "bird dock": "Burdock",
  "bur dock": "Burdock",
  "bird duck": "Burdock",

  // Calendula variations
  "calendar": "Calendula",
  "calendar la": "Calendula",
  "cal end you la": "Calendula",

  // Mullein variations (also catches data typo "mullien")
  "mullen": "Mullein",
  "mullien": "Mullein",
  "mull in": "Mullein",
  "mullin": "Mullein",
  "mullen root": "Mullein Root",
  "mullien root": "Mullein Root",
  "mull in root": "Mullein Root",
  "mullei root": "Mullein Root",

  // Hawthorn variations (also catches "hawthorne" from import)
  "hawthorne": "Hawthorn",
  "haw thorn": "Hawthorn",
  "hall thorn": "Hawthorn",
  "hot horn": "Hawthorn",

  // Meadowsweet variations
  "meadow sweet": "Meadowsweet",
  "metal sweet": "Meadowsweet",
  "meadow suite": "Meadowsweet",

  // Motherwort variations
  "mother wart": "Motherwort",
  "mother wort": "Motherwort",
  "mother worth": "Motherwort",

  // Passion Flower variations
  "passion flower": "Passion Flower",
  "passionflower": "Passion Flower",
  "passionate flower": "Passion Flower",
  "pasion flower": "Passion Flower",

  // Milk Thistle variations
  "milk thistle": "Milk Thistle",
  "milk thistles": "Milk Thistle",
  "milk whistle": "Milk Thistle",

  // Lemon Balm variations (also "melissa/lemon balm" from import)
  "lemon balm": "Lemon Balm",
  "melissa/lemon balm": "Lemon Balm",
  "melissa lemon balm": "Lemon Balm",
  "melissa": "Lemon Balm",
  "lemon bomb": "Lemon Balm",
  "lemon palm": "Lemon Balm",

  // Vitex variations
  "vite x": "Vitex",
  "vita ex": "Vitex",
  "vi tex": "Vitex",
  "vee tex": "Vitex",
  "chaste tree": "Vitex",
  "chasteberry": "Vitex",

  // Bacopa variations
  "back oh pa": "Bacopa",
  "ba copa": "Bacopa",
  "back opa": "Bacopa",
  "brahmi": "Bacopa",

  // Tulsi variations
  "tool see": "Tulsi",
  "tule c": "Tulsi",
  "holy basil": "Tulsi",

  // Astragalus variations
  "astral agus": "Astragalus",
  "astral gallus": "Astragalus",
  "a straggle us": "Astragalus",
  "astra gallus": "Astragalus",

  // Feverfew variations
  "fever few": "Feverfew",
  "fever view": "Feverfew",
  "fever flew": "Feverfew",

  // Dandelion variations
  "dandelion": "Dandelion Leaf",
  "dandy lion": "Dandelion Leaf",
  "dandy lion leaf": "Dandelion Leaf",
  "dandelion leaf": "Dandelion Leaf",
  "dandy lion root": "Dandelion Root",
  "dandelion root": "Dandelion Root",

  // Nettle variations
  "nettle": "Nettle Leaf",
  "nettle leaf": "Nettle Leaf",
  "metal leaf": "Nettle Leaf",
  "needle leaf": "Nettle Leaf",
  "nettle root": "Nettle Root",

  // Lomatium variations (catches "lomatsium" typo from inventory)
  "lomatsium": "Lomatium",
  "loma tium": "Lomatium",
  "loma sium": "Lomatium",

  // Sarsaparilla variations (catches "sarsasparilla" typo)
  "sarsasparilla": "Sarsaparilla",
  "sars a parilla": "Sarsaparilla",
  "sarsaparila": "Sarsaparilla",

  // Chelidonium variations
  "chelidonium fresh": "Chelidonium",
  "chelidonium (fresh)": "Chelidonium",
  "caledonium": "Chelidonium",
  "kal a doni um": "Chelidonium",

  // Shepherd's Purse variations
  "shepherds purse": "Shepherd's Purse",
  "shepherd's purse": "Shepherd's Purse",
  "shepards purse": "Shepherd's Purse",
  "shepherd purse": "Shepherd's Purse",

  // Solomon's Seal variations (catches "solomens seal" typo)
  "solomens seal": "Solomon's Seal",
  "solomon seal": "Solomon's Seal",
  "solomons seal": "Solomon's Seal",
  "solomon's seal": "Solomon's Seal",

  // Peony variations (catches "peony (white root)")
  "peony white root": "Peony",
  "peony (white root)": "Peony",
  "white peony": "Peony",
  "white peony root": "Peony",

  // Comfrey Root variations (catches "comfery root" typo)
  "comfrey": "Comfrey Root",
  "comfery root": "Comfrey Root",
  "comfery": "Comfrey Root",
  "come free": "Comfrey Root",
  "comfrey root": "Comfrey Root",

  // Bupleurum variations (catches "buplureum"/"bupluerum" import typos)
  "buplureum": "Bupleurum",
  "bupluerum": "Bupleurum",
  "bupleurum": "Bupleurum",

  // Cleavers variations
  "cleaver": "Cleavers",
  "cleavers": "Cleavers",
  "clever": "Cleavers",

  // Goldenrod variations
  "goldenrod": "Goldenrod",
  "golden rod": "Goldenrod",
  "solidago": "Goldenrod",
  "goldenrod/solidago": "Goldenrod",

  // Ocimum variations (catches "ociumum" typo)
  "ociumum": "Ocimum",
  "oci mum": "Ocimum",

  // Olive Leaf variations (catches "olive leag" typo)
  "olive leag": "Olive Leaf",
  "olive leaf": "Olive Leaf",

  // Oregon Grape variations (catches "oregon grapefruit" import error)
  "oregon grapefruit": "Oregon Grape",
  "oregon grape": "Oregon Grape",
  "organ grape": "Oregon Grape",

  // Mugwort variations (catches "mug wart" import entry)
  "mug wart": "Mugwort",
  "mug wort": "Mugwort",
  "mugwart": "Mugwort",

  // Horsetail variations
  "horse tail": "Horsetail",
  "horsetail": "Horsetail",

  // Stone Root variations
  "stone root": "Stone Root",
  "stone route": "Stone Root",
  "stoneroot": "Stone Root",
  "tone root": "Stone Root",
  "stone rut": "Stone Root",
  "ston root": "Stone Root",

  // Dong Quai variations
  "dong quai": "Dong Quai",
  "dong quay": "Dong Quai",
  "dong kway": "Dong Quai",
  "dong qway": "Dong Quai",
  "dong kwai": "Dong Quai",
  "dong qai": "Dong Quai",
  "don quai": "Dong Quai",
  "don quay": "Dong Quai",
  "dung quai": "Dong Quai",

  // Cohosh variations
  "blue co hash": "Blue Cohosh",
  "black co hash": "Black Cohosh",

  // Blue Vervain variations
  "blue vervane": "Blue Vervain",
  "blue ver vain": "Blue Vervain",

  // Yarrow variations
  "yarrow": "Yarrow",
  "arrow": "Yarrow",
  "yellow": "Yarrow",

  // Wild Yam / Wild Lettuce
  "wild yam": "Wild Yam",
  "wile yam": "Wild Yam",
  "wild lettuce": "Wild Lettuce",
  "while lettuce": "Wild Lettuce",

  // Rosemary variations
  "rose mary": "Rosemary",
  "rose marry": "Rosemary",

  // Peppermint variations
  "pepper mint": "Peppermint",
  "pepper meant": "Peppermint",

  // Ginger variations
  "ginger": "Ginger",
  "jinger": "Ginger",

  // California Poppy variations
  "california poppy": "California Poppy",
  "california puppy": "California Poppy",

  // Cramp Bark variations
  "cramp bark": "Cramp Bark",
  "gram bark": "Cramp Bark",

  // Black Haw variations
  "black haw": "Black Haw",
  "black hall": "Black Haw",

  // Hypericum / St John's Wort
  "st johns wort": "Hypericum",
  "saint johns wort": "Hypericum",
  "saint john's wort": "Hypericum",
  "st john's wort": "Hypericum",
  "hypericum": "Hypericum",

  // Cat's Claw variations
  "cats claw": "Cat's Claw",
  "cat's claw": "Cat's Claw",

  // Devil's Claw / Club
  "devils claw": "Devil's Claw",
  "devil's claw": "Devil's Claw",
  "devils club": "Devil's Club",
  "devil's club": "Devil's Club",

  // Osha variations
  "osha root": "Osha",
  "osha?": "Osha",
};

// Calculate Levenshtein distance for fuzzy matching
function levenshteinDistance(a: string, b: string): number {
  const matrix: number[][] = [];

  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }

  return matrix[b.length][a.length];
}

// Find the best matching herb from the list
export function findBestHerbMatch(input: string, threshold = 0.6): string | null {
  const normalized = input.toLowerCase().trim();

  // 1. Exact correction map lookup
  if (CORRECTION_MAP[normalized]) {
    return CORRECTION_MAP[normalized];
  }

  // 2. Partial correction map lookup
  for (const [key, value] of Object.entries(CORRECTION_MAP)) {
    if (normalized.includes(key) || key.includes(normalized)) {
      return value;
    }
  }

  // 3. Fuzzy match against herb list
  let bestMatch: string | null = null;
  let bestScore = 0;

  for (const herb of HERB_LIST) {
    const herbLower = herb.toLowerCase();

    // Exact match
    if (herbLower === normalized) {
      return herb;
    }

    // Prefix match
    if (herbLower.startsWith(normalized) || normalized.startsWith(herbLower)) {
      return herb;
    }

    // Similarity score
    const maxLen = Math.max(normalized.length, herbLower.length);
    const distance = levenshteinDistance(normalized, herbLower);
    const similarity = 1 - distance / maxLen;

    if (similarity > bestScore && similarity >= threshold) {
      bestScore = similarity;
      bestMatch = herb;
    }
  }

  return bestMatch;
}

// Correct a herb name — returns null if no match found (herb not in inventory)
export function correctHerbName(input: string): string | null {
  return findBestHerbMatch(input);
}

// Get suggestions for autocomplete
export function getHerbSuggestions(input: string, limit = 5): string[] {
  if (!input || input.length < 2) return [];

  const normalized = input.toLowerCase().trim();
  const suggestions: { herb: string; score: number }[] = [];

  for (const herb of HERB_LIST) {
    const herbLower = herb.toLowerCase();

    if (herbLower.startsWith(normalized)) {
      suggestions.push({ herb, score: 1 });
    } else if (herbLower.includes(normalized)) {
      suggestions.push({ herb, score: 0.8 });
    } else {
      const maxLen = Math.max(normalized.length, herbLower.length);
      const distance = levenshteinDistance(normalized, herbLower);
      const similarity = 1 - distance / maxLen;
      if (similarity >= 0.4) {
        suggestions.push({ herb, score: similarity });
      }
    }
  }

  return suggestions
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(s => s.herb);
}
