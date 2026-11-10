import { estimateShipping } from '@/lib/shipping';

// Pure helpers for the supplier-compare view on the Ordering page.
// Prices passed in are already in CAD (see useMergedHerbPricing).

export const GRAMS_PER_LB = 453.592;

/** How many packages of `packageSizeG` grams to cover `qtyLb` pounds */
export function packagesNeeded(qtyLb: number, packageSizeG: number): number {
  return Math.ceil((qtyLb * GRAMS_PER_LB) / packageSizeG);
}

/** Format package info string for display, e.g. "2× 500g" */
export function formatPackageInfo(qtyLb: number, packageSizeG: number): string {
  return `${packagesNeeded(qtyLb, packageSizeG)}× ${packageSizeG}g`;
}

export interface SupplierLike {
  id: string;
  name: string;
}

export interface PriceRow {
  herb_name: string;
  supplier_id: string;
  price_per_lb: number;
  package_size_g: number | null;
  package_price: number | null;
  supplier_item_code: string | null;
  supplier_item_name: string | null;
  last_updated: string;
}

export interface HerbNeed {
  herbName: string;
  qtyLb: number;
}

export interface OrderLine {
  herbName: string;
  qtyLb: number;
  supplierId: string;
  pricePerLb: number;
  subtotal: number;
  packageInfo: string | null;
  itemCode: string | null;
  itemName: string | null;
  lastUpdated: string;
}

/** herbName -> supplierId -> what it would cost from that supplier */
export type OptionsByHerb = Map<string, Map<string, OrderLine>>;

export interface PlanOrder<S extends SupplierLike = SupplierLike> {
  supplier: S;
  lines: OrderLine[];
  subtotal: number;
  shipping: number;
  shippingNote: string;
  total: number;
}

export interface Plan<S extends SupplierLike = SupplierLike> {
  orders: PlanOrder<S>[];
  herbsTotal: number;
  shippingTotal: number;
  grandTotal: number;
  /** Herbs with no supplier chosen (or the chosen supplier has no price) */
  unassigned: string[];
}

export type Assignments = Record<string, string | undefined>;

export function buildOptions(
  needs: HerbNeed[],
  rows: PriceRow[],
  allowedSupplierIds: Set<string>,
): OptionsByHerb {
  const rowsByHerb = new Map<string, PriceRow[]>();
  for (const r of rows) {
    if (!allowedSupplierIds.has(r.supplier_id)) continue;
    const key = r.herb_name.toLowerCase().trim();
    const list = rowsByHerb.get(key) ?? [];
    list.push(r);
    rowsByHerb.set(key, list);
  }

  const result: OptionsByHerb = new Map();
  for (const { herbName, qtyLb } of needs) {
    const bySupplier = new Map<string, OrderLine>();
    for (const row of rowsByHerb.get(herbName.toLowerCase().trim()) ?? []) {
      let subtotal = qtyLb * row.price_per_lb;
      let packageInfo: string | null = null;
      if (row.package_size_g && row.package_price) {
        subtotal = packagesNeeded(qtyLb, row.package_size_g) * row.package_price;
        packageInfo = formatPackageInfo(qtyLb, row.package_size_g);
      }
      bySupplier.set(row.supplier_id, {
        herbName,
        qtyLb,
        supplierId: row.supplier_id,
        pricePerLb: row.price_per_lb,
        subtotal,
        packageInfo,
        itemCode: row.supplier_item_code,
        itemName: row.supplier_item_name,
        lastUpdated: row.last_updated,
      });
    }
    result.set(herbName, bySupplier);
  }
  return result;
}

export function planFromAssignments<S extends SupplierLike>(
  needs: HerbNeed[],
  options: OptionsByHerb,
  assignments: Assignments,
  suppliers: S[],
): Plan<S> {
  const supplierMap = new Map(suppliers.map(s => [s.id, s]));
  const bySupplier = new Map<string, OrderLine[]>();
  const unassigned: string[] = [];

  for (const { herbName } of needs) {
    const sid = assignments[herbName];
    const line = sid ? options.get(herbName)?.get(sid) : undefined;
    if (!sid || !line || !supplierMap.has(sid)) {
      unassigned.push(herbName);
      continue;
    }
    const list = bySupplier.get(sid) ?? [];
    list.push(line);
    bySupplier.set(sid, list);
  }

  const orders = Array.from(bySupplier.entries())
    .map(([sid, lines]) => {
      const supplier = supplierMap.get(sid)!;
      const subtotal = lines.reduce((sum, l) => sum + l.subtotal, 0);
      const ship = estimateShipping(supplier.name, subtotal);
      return { supplier, lines, subtotal, shipping: ship.cost, shippingNote: ship.note, total: subtotal + ship.cost };
    })
    .sort((a, b) => b.total - a.total);

  const herbsTotal = orders.reduce((s, o) => s + o.subtotal, 0);
  const shippingTotal = orders.reduce((s, o) => s + o.shipping, 0);
  return { orders, herbsTotal, shippingTotal, grandTotal: herbsTotal + shippingTotal, unassigned };
}

/** Assign every herb a supplier carries to that supplier */
export function assignAllTo(needs: HerbNeed[], options: OptionsByHerb, supplierId: string): Assignments {
  const a: Assignments = {};
  for (const { herbName } of needs) {
    if (options.get(herbName)?.has(supplierId)) a[herbName] = supplierId;
  }
  return a;
}

export interface SupplierSummary<S extends SupplierLike = SupplierLike> {
  supplier: S;
  covered: number;
  totalHerbs: number;
  missing: string[];
  /** The whole list priced from this supplier alone; null when it carries none */
  order: PlanOrder<S> | null;
}

/** One row per supplier: everything priced from that supplier alone. Most herbs first, then cheapest. */
export function summarizeSuppliers<S extends SupplierLike>(
  needs: HerbNeed[],
  options: OptionsByHerb,
  suppliers: S[],
): SupplierSummary<S>[] {
  const summaries = suppliers.map(supplier => {
    const assignments = assignAllTo(needs, options, supplier.id);
    const plan = planFromAssignments(needs, options, assignments, [supplier]);
    return {
      supplier,
      covered: needs.length - plan.unassigned.length,
      totalHerbs: needs.length,
      missing: plan.unassigned,
      order: plan.orders[0] ?? null,
    };
  });
  return summaries.sort((a, b) => {
    if (b.covered !== a.covered) return b.covered - a.covered;
    return (a.order?.total ?? Infinity) - (b.order?.total ?? Infinity);
  });
}

export interface PriceSpread {
  count: number;
  min: number;
  max: number;
  minSupplierId: string;
  /** (max - min) / min, as a percentage */
  gapPct: number;
}

export function spreadForHerb(options: OptionsByHerb, herbName: string): PriceSpread | null {
  const lines = Array.from(options.get(herbName)?.values() ?? []);
  if (lines.length === 0) return null;
  const cheapest = lines.reduce((a, b) => (a.pricePerLb <= b.pricePerLb ? a : b));
  const max = Math.max(...lines.map(l => l.pricePerLb));
  const min = cheapest.pricePerLb;
  return {
    count: lines.length,
    min,
    max,
    minSupplierId: cheapest.supplierId,
    gapPct: min > 0 ? ((max - min) / min) * 100 : 0,
  };
}

export interface ConsolidationHint<S extends SupplierLike = SupplierLike> {
  from: S;
  to: S;
  herbs: string[];
  /** How much cheaper the whole order gets (shipping saved minus any extra herb cost) */
  saving: number;
  /** Extra herb cost from paying `to`'s prices instead of `from`'s */
  extraHerbCost: number;
}

/**
 * "Order these from the other company instead to save on shipping, even though
 * the herbs cost more there." Looks at each pair of suppliers in the current plan;
 * if one supplier's whole order can move to the other and the grand total drops, suggest it.
 */
export function consolidationHints<S extends SupplierLike>(
  needs: HerbNeed[],
  options: OptionsByHerb,
  plan: Plan<S>,
  suppliers: S[],
): ConsolidationHint<S>[] {
  const current: Assignments = {};
  for (const o of plan.orders) for (const l of o.lines) current[l.herbName] = o.supplier.id;

  const hints: ConsolidationHint<S>[] = [];
  for (const from of plan.orders) {
    for (const to of plan.orders) {
      if (from.supplier.id === to.supplier.id) continue;
      const herbs = from.lines.map(l => l.herbName);
      if (!herbs.every(h => options.get(h)?.has(to.supplier.id))) continue;

      const moved: Assignments = { ...current };
      for (const h of herbs) moved[h] = to.supplier.id;
      const next = planFromAssignments(needs, options, moved, suppliers);
      const saving = plan.grandTotal - next.grandTotal;
      if (saving > 0.005) {
        const extraHerbCost = next.herbsTotal - plan.herbsTotal;
        hints.push({ from: from.supplier, to: to.supplier, herbs, saving, extraHerbCost });
      }
    }
  }
  return hints.sort((a, b) => b.saving - a.saving);
}

/** Plain-text order for one supplier, ready to paste into an email or order form */
export function formatOrderText(order: PlanOrder): string {
  const lines = order.lines
    .slice()
    .sort((a, b) => a.herbName.localeCompare(b.herbName))
    .map(l => {
      const code = l.itemCode ? `${l.itemCode} ` : '';
      const name = l.itemName || l.herbName;
      const pack = l.packageInfo ? ` (${l.packageInfo})` : '';
      return `${code}${name} — ${l.qtyLb} lb${pack}`;
    });
  return [`Order for ${order.supplier.name}`, '', ...lines].join('\n');
}
