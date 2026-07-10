import { describe, it, expect } from 'vitest';
import { matchHerbName, findHerbNameMatch } from './useInventoryCheck';

describe('matchHerbName', () => {
  it('returns the exact match, case-insensitive', () => {
    expect(matchHerbName('Valerian', ['Skullcap', 'Valerian', 'Yarrow'])).toBe('Valerian');
    expect(matchHerbName('valerian', ['Valerian'])).toBe('Valerian');
  });

  it('falls back to a prefix match', () => {
    expect(matchHerbName('Bupleurum', ['Bupleurum chinensis'])).toBe('Bupleurum chinensis');
  });

  it('falls back to a typo-tolerant match on the first 6 characters', () => {
    // 'valeri' === 'valeri' (first 6 chars of both), so typo tolerance kicks in
    expect(matchHerbName('Valerina', ['Valerian'])).toBe('Valerian');
  });

  it('returns undefined when nothing matches', () => {
    expect(matchHerbName('Ginseng', ['Valerian', 'Yarrow'])).toBeUndefined();
  });

  it('returns undefined for an empty target', () => {
    expect(matchHerbName('', ['Valerian'])).toBeUndefined();
  });
});

describe('findHerbNameMatch', () => {
  const candidates = [
    { herb_name: 'Valerian', tier: 2 },
    { herb_name: 'Reishi', tier: 3 },
  ];

  it('matches by herb_name and returns the whole candidate object', () => {
    expect(findHerbNameMatch('valerian', candidates)).toEqual({ herb_name: 'Valerian', tier: 2 });
  });

  it('returns undefined when no candidate matches', () => {
    expect(findHerbNameMatch('Ginseng', candidates)).toBeUndefined();
  });
});
