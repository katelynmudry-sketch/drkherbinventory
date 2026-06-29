export interface HerbNameRow {
  name: string;
  common_name: string | null;
  latin_name: string | null;
  pinyin_name: string | null;
}

// Build a compact "canonical name (alt names)" list for grounding Claude's
// herb-name matching against this user's actual herb records.
export function formatHerbNamesForPrompt(herbs: HerbNameRow[]): string {
  return herbs
    .map((herb) => {
      const alts = [herb.common_name, herb.latin_name, herb.pinyin_name].filter(Boolean);
      return alts.length > 0 ? `${herb.name} (${alts.join(', ')})` : herb.name;
    })
    .join('; ');
}
