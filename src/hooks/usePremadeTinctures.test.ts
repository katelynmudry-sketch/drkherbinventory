import { describe, it, expect } from 'vitest';
import { lookupTincturePrice, TincturePriceTier, TincturePriceHerb } from './usePremadeTinctures';

const tiers: TincturePriceTier[] = [
  { id: 't1', tier_label: 'Tier 1', price_100ml: 19.95, price_250ml: 39.95, price_500ml: 64.95, price_1000ml: 117 },
  { id: 't2', tier_label: 'Tier 2', price_100ml: 23.95, price_250ml: 44.95, price_500ml: 69.95, price_1000ml: 125.95 },
];

const priceHerbs: TincturePriceHerb[] = [
  { id: 'h1', herb_name: 'Valerian', tier_id: 't2' },
  { id: 'h2', herb_name: 'Yarrow', tier_id: 't1' },
];

describe('lookupTincturePrice', () => {
  it('looks up the price for the matching herb and size', () => {
    expect(lookupTincturePrice('Valerian', priceHerbs, tiers, 500)).toBe(69.95);
    expect(lookupTincturePrice('valerian', priceHerbs, tiers, 100)).toBe(23.95);
  });

  it('uses fuzzy name matching like the rest of the app', () => {
    expect(lookupTincturePrice('Yarrow root', priceHerbs, tiers, 1000)).toBe(117);
  });

  it('returns null when the herb has no price entry', () => {
    expect(lookupTincturePrice('Ginseng', priceHerbs, tiers, 500)).toBeNull();
  });
});
