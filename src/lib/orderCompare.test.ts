import { describe, it, expect } from 'vitest';
import {
  buildOptions,
  planFromAssignments,
  summarizeSuppliers,
  assignAllTo,
  consolidationHints,
  spreadForHerb,
  formatOrderText,
  type PriceRow,
  type HerbNeed,
} from './orderCompare';

const row = (herb: string, supplier: string, price: number, extra: Partial<PriceRow> = {}): PriceRow => ({
  herb_name: herb,
  supplier_id: supplier,
  price_per_lb: price,
  package_size_g: null,
  package_price: null,
  supplier_item_code: null,
  supplier_item_name: null,
  last_updated: '2026-11-10',
  ...extra,
});

// Names chosen so shipping rules apply: Mountain Rose = flat US shipping + customs, Clef = free over $300, others = $0
const clef = { id: 'clef', name: 'Clef des Champs' };
const oc = { id: 'oc', name: 'Organic Connections' };
const mr = { id: 'mr', name: 'Mountain Rose Herbs' };
const suppliers = [clef, oc, mr];

const needs: HerbNeed[] = [
  { herbName: 'Nettle', qtyLb: 1 },
  { herbName: 'Rose', qtyLb: 2 },
  { herbName: 'Yarrow', qtyLb: 1 },
];

const rows: PriceRow[] = [
  row('Nettle', 'clef', 20),
  row('Nettle', 'oc', 25),
  row('Rose', 'clef', 30),
  row('Rose', 'oc', 28),
  row('Yarrow', 'oc', 32.5),
  row('Nettle', 'mr', 10),
];

const all = new Set(['clef', 'oc', 'mr']);

describe('buildOptions', () => {
  it('matches herb names case-insensitively and respects the supplier filter', () => {
    const opts = buildOptions(needs, rows, new Set(['clef']));
    expect(opts.get('Nettle')?.has('clef')).toBe(true);
    expect(opts.get('Nettle')?.has('oc')).toBe(false);
    expect(opts.get('Yarrow')?.size).toBe(0);
  });

  it('prices by pack when a package size and price exist', () => {
    const r = row('Nettle', 'clef', 10, { package_size_g: 250, package_price: 6 });
    const opts = buildOptions([{ herbName: 'Nettle', qtyLb: 1 }], [r], all);
    // 1 lb = 453.592 g -> 2 packs of 250 g
    expect(opts.get('Nettle')!.get('clef')!.subtotal).toBe(12);
    expect(opts.get('Nettle')!.get('clef')!.packageInfo).toBe('2× 250g');
  });
});

describe('summarizeSuppliers', () => {
  it('ranks by herbs covered, then by total', () => {
    const opts = buildOptions(needs, rows, all);
    const s = summarizeSuppliers(needs, opts, suppliers);
    expect(s[0].supplier.id).toBe('oc'); // carries all 3
    expect(s[0].covered).toBe(3);
    expect(s[0].order!.subtotal).toBe(25 + 56 + 32.5);
    const clefRow = s.find(x => x.supplier.id === 'clef')!;
    expect(clefRow.missing).toEqual(['Yarrow']);
  });

  it('puts a supplier with nothing at the bottom with no order', () => {
    const opts = buildOptions(needs, rows.filter(r => r.supplier_id !== 'mr'), all);
    const s = summarizeSuppliers(needs, opts, suppliers);
    const mrRow = s.find(x => x.supplier.id === 'mr')!;
    expect(mrRow.covered).toBe(0);
    expect(mrRow.order).toBeNull();
    expect(s[s.length - 1].supplier.id).toBe('mr');
  });
});

describe('planFromAssignments', () => {
  it('reports herbs with no supplier as unassigned', () => {
    const opts = buildOptions(needs, rows, all);
    const plan = planFromAssignments(needs, opts, { Nettle: 'clef' }, suppliers);
    expect(plan.unassigned).toEqual(['Rose', 'Yarrow']);
    expect(plan.orders).toHaveLength(1);
  });

  it('treats a supplier that has no price for the herb as unassigned', () => {
    const opts = buildOptions(needs, rows, all);
    const plan = planFromAssignments(needs, opts, { Yarrow: 'clef' }, suppliers);
    expect(plan.unassigned).toContain('Yarrow');
  });

  it('adds shipping per supplier order', () => {
    const opts = buildOptions(needs, rows, all);
    const plan = planFromAssignments(needs, opts, assignAllTo(needs, opts, 'mr'), suppliers);
    expect(plan.orders[0].shipping).toBeGreaterThan(0); // US flat shipping + customs
    expect(plan.grandTotal).toBe(plan.herbsTotal + plan.shippingTotal);
  });
});

describe('consolidationHints', () => {
  it('suggests moving a small foreign order to a supplier already in the plan when shipping outweighs the price gap', () => {
    // Nettle is far cheaper at Mountain Rose, but MR adds ~US$120 + customs shipping for one herb
    const opts = buildOptions(needs, rows, all);
    const plan = planFromAssignments(
      needs,
      opts,
      { Nettle: 'mr', Rose: 'oc', Yarrow: 'oc' },
      suppliers,
    );
    const hints = consolidationHints(needs, opts, plan, suppliers);
    expect(hints).toHaveLength(1);
    expect(hints[0].from.id).toBe('mr');
    expect(hints[0].to.id).toBe('oc');
    expect(hints[0].herbs).toEqual(['Nettle']);
    expect(hints[0].saving).toBeGreaterThan(0);
    expect(hints[0].extraHerbCost).toBeGreaterThan(0); // the herb costs more there, still a net saving
  });

  it('gives no hint when the target supplier cannot carry the herbs', () => {
    const opts = buildOptions(needs, rows, all);
    const plan = planFromAssignments(needs, opts, { Yarrow: 'oc', Nettle: 'clef' }, suppliers);
    // clef cannot carry Yarrow, so oc -> clef is not possible; clef -> oc may be, but must save money to be suggested
    const hints = consolidationHints(needs, opts, plan, suppliers);
    expect(hints.every(h => h.saving > 0)).toBe(true);
    expect(hints.find(h => h.from.id === 'oc' && h.to.id === 'clef')).toBeUndefined();
  });
});

describe('spreadForHerb', () => {
  it('returns cheapest, dearest and the percentage gap', () => {
    const opts = buildOptions(needs, rows, all);
    const s = spreadForHerb(opts, 'Nettle')!;
    expect(s.min).toBe(10);
    expect(s.max).toBe(25);
    expect(s.minSupplierId).toBe('mr');
    expect(Math.round(s.gapPct)).toBe(150);
  });

  it('returns null when nobody carries the herb', () => {
    const opts = buildOptions(needs, rows, new Set(['clef']));
    expect(spreadForHerb(opts, 'Yarrow')).toBeNull();
  });
});

describe('formatOrderText', () => {
  it('lists item code, name, quantity and pack info', () => {
    const r = row('Nettle', 'oc', 25, { supplier_item_code: 'C.123', supplier_item_name: 'Nettle Leaf C/S', package_size_g: 455, package_price: 25 });
    const opts = buildOptions([{ herbName: 'Nettle', qtyLb: 1 }], [r], all);
    const plan = planFromAssignments([{ herbName: 'Nettle', qtyLb: 1 }], opts, { Nettle: 'oc' }, suppliers);
    const text = formatOrderText(plan.orders[0]);
    expect(text).toContain('Order for Organic Connections');
    expect(text).toContain('C.123 Nettle Leaf C/S — 1 lb (1× 455g)');
  });
});
