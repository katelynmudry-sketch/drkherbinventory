// Master herb list for fuzzy matching
export const HERB_LIST = [
  "Alfalfa", "Agrimony", "Althea", "Angelica", "Ashwagandha", "Avena",
  "Artemesia", "Wormwood", "Astragalus", "Anise", "Artichoke", "Bacopa",
  "Baptisia", "Bayberry Root Bark", "Birch Leaf", "Birch Bark", "Bee Balm",
  "Black Haw", "Black Cohosh", "Black Pepper", "Black Walnut", "Blessed Thistle",
  "Blue Cohosh", "Blue Vervain", "Borage", "Boneset", "Burdock", "Bugleweed",
  "Bupleurum", "California Poppy", "Catnip", "Cat's Claw", "Calamus", "Calendula",
  "Chamomile", "Chelidonium", "Cinnamon", "Cleavers", "Comfrey Root", "Couch Grass",
  "Cramp Bark", "Damiana", "Dandelion Leaf", "Dandelion Root", "Devil's Club",
  "Devil's Claw", "Dong Quai", "Echinacea Augustifolia", "Echinacea Purpurea Leaf",
  "Echinacea Purpurea Root", "Eclipta", "Eleuthero", "Erigeron", "Fennel",
  "Feverfew", "Gentian", "Goldenrod", "Solidago", "Ginkgo", "Gotu Kola", "Goji",
  "Ginger", "Gravel Root", "Hawthorn", "Hops", "Horsetail", "Horse Chestnut",
  "Hypericum", "Hyssop", "Inula", "Iris", "Juniper", "Labrador Tea", "Lavender",
  "Lady's Mantle", "Lemon Balm", "Lemongrass", "Licorice", "Linden", "Lomatium",
  "Lycopus", "Maca", "Meadowsweet", "Milk Thistle", "Marshmallow", "Mullein",
  "Mullein Root", "Mugwort", "Motherwort", "Nettle Leaf", "Nettle Root", "Oak",
  "Ocimum", "Olive Leaf", "Orange Peel", "Oregon Grape", "Oregano", "Osha",
  "Peppermint", "Parsley", "Passion Flower", "Poppy", "Periwinkle", "Peony",
  "Plantain", "Raspberry Leaf", "Red Clover", "Rheum", "Rhodiola", "Rose",
  "Rosemary", "Rue", "Rumex", "Sage", "Sarsaparilla", "Self Heal", "Scutellaria",
  "Schisandra", "Shatavari", "Shepherd's Purse", "Solomon's Seal", "Spikenard",
  "Spilanthes", "Thyme", "Tulsi", "Valerian", "Vitex", "Yarrow", "Wild Lettuce",
  "Wild Yam", "White Oak"
];

// Common voice recognition mistakes mapped to correct herb names
export const CORRECTION_MAP: Record<string, string> = {
  // Ashwagandha variations
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
  
  // Echinacea variations
  "echinacea": "Echinacea Augustifolia",
  "echinacea august": "Echinacea Augustifolia",
  "echinacea augs": "Echinacea Augustifolia",
  "echinacea purple": "Echinacea Purpurea Leaf",
  "echinacea purpur": "Echinacea Purpurea Leaf",
  "echo nasa": "Echinacea Augustifolia",
  "echo nasia": "Echinacea Augustifolia",
  "etch in asia": "Echinacea Augustifolia",
  
  // Shatavari variations
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
  
  // Skullcap variations
  "skull cap": "Skullcap",
  "skullcap": "Skullcap",
  "scutellaria": "Skullcap",
  "scut lat": "Skullcap",
  "school cap": "Skullcap",
  "skull cat": "Skullcap",
  
  // Gotu Kola variations
  "go to cola": "Gotu Kola",
  "go to kola": "Gotu Kola",
  "go to call a": "Gotu Kola",
  "goto cola": "Gotu Kola",
  "go to koala": "Gotu Kola",
  "goat to cola": "Gotu Kola",
  "goat you cola": "Gotu Kola",
  
  // Eleuthero variations
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
  "lavander": "Lavender",
  "lavendar": "Lavender",
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
  
  // Mullein variations
  "mullen": "Mullein",
  "mull in": "Mullein",
  "mullin": "Mullein",
  "mullen root": "Mullein Root",
  "mull in root": "Mullein Root",
  
  // Hawthorn variations
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
  
  // Passionflower variations
  "passion flower": "Passion Flower",
  "passionate flower": "Passion Flower",
  "pasion flower": "Passion Flower",
  
  // Milk Thistle variations
  "milk thistle": "Milk Thistle",
  "milk thistles": "Milk Thistle",
  "milk whistle": "Milk Thistle",
  
  // Lemon Balm variations
  "lemon bomb": "Lemon Balm",
  "lemon palm": "Lemon Balm",
  "lemon balm": "Lemon Balm",
  
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
  "dandy lion": "Dandelion Leaf",
  "dandy lion leaf": "Dandelion Leaf",
  "dandy lion root": "Dandelion Root",
  "dandelion": "Dandelion Leaf",
  
  // Nettle variations
  "nettle": "Nettle Leaf",
  "nettle leaf": "Nettle Leaf",
  "nettle root": "Nettle Root",
  "metal leaf": "Nettle Leaf",
  "needle leaf": "Nettle Leaf",
  
  // Common mishearings
  "horse tail": "Horsetail",
  "cats claw": "Cat's Claw",
  "cat's claw": "Cat's Claw",
  "devils claw": "Devil's Claw",
  "devil's claw": "Devil's Claw",
  "devils club": "Devil's Club",
  "devil's club": "Devil's Club",
  "st johns wort": "Hypericum",
  "saint johns wort": "Hypericum",
  "saint john's wort": "Hypericum",
  "cleavers": "Cleavers",
  "cleaver": "Cleavers",
  "clever": "Cleavers",
  "comfrey": "Comfrey Root",
  "come free": "Comfrey Root",
  "golden rod": "Goldenrod",
  "shepherd's purse": "Shepherd's Purse",
  "shepherds purse": "Shepherd's Purse",
  "solomon seal": "Solomon's Seal",
  "solomons seal": "Solomon's Seal",
  "solomon's seal": "Solomon's Seal",
  "osha root": "Osha",
  "dong quay": "Dong Quai",
  "dong kway": "Dong Quai",
  "dong qway": "Dong Quai",
  "blue co hash": "Blue Cohosh",
  "black co hash": "Black Cohosh",
  "blue vervane": "Blue Vervain",
  "blue ver vain": "Blue Vervain",
  "yarrow": "Yarrow",
  "arrow": "Yarrow",
  "yellow": "Yarrow",
  "wild yam": "Wild Yam",
  "wile yam": "Wild Yam",
  "wild lettuce": "Wild Lettuce",
  "while lettuce": "Wild Lettuce",
  "rose mary": "Rosemary",
  "rose marry": "Rosemary",
  "pepper mint": "Peppermint",
  "pepper meant": "Peppermint",
  "ginger": "Ginger",
  "jinger": "Ginger",
  "oregon grape": "Oregon Grape",
  "organ grape": "Oregon Grape",
  "california poppy": "California Poppy",
  "california puppy": "California Poppy",
  "cramp bark": "Cramp Bark",
  "gram bark": "Cramp Bark",
  "black haw": "Black Haw",
  "black hall": "Black Haw",
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
  
  // First check the correction map
  if (CORRECTION_MAP[normalized]) {
    return CORRECTION_MAP[normalized];
  }
  
  // Check for partial matches in correction map
  for (const [key, value] of Object.entries(CORRECTION_MAP)) {
    if (normalized.includes(key) || key.includes(normalized)) {
      return value;
    }
  }
  
  // Fuzzy match against herb list
  let bestMatch: string | null = null;
  let bestScore = 0;
  
  for (const herb of HERB_LIST) {
    const herbLower = herb.toLowerCase();
    
    // Exact match
    if (herbLower === normalized) {
      return herb;
    }
    
    // Check if input starts with or contains the herb name
    if (herbLower.startsWith(normalized) || normalized.startsWith(herbLower)) {
      return herb;
    }
    
    // Calculate similarity score
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

// Correct a herb name, returning original if no match found
export function correctHerbName(input: string): string {
  const match = findBestHerbMatch(input);
  return match || input.charAt(0).toUpperCase() + input.slice(1).toLowerCase();
}

// Get suggestions for autocomplete
export function getHerbSuggestions(input: string, limit = 5): string[] {
  if (!input || input.length < 2) return [];
  
  const normalized = input.toLowerCase().trim();
  const suggestions: { herb: string; score: number }[] = [];
  
  for (const herb of HERB_LIST) {
    const herbLower = herb.toLowerCase();
    
    // Prioritize starts-with matches
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
