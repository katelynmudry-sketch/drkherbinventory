import { useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { isUsdSupplier, usdToCad } from '@/lib/currency';
import { packagesNeeded, formatPackageInfo } from '@/lib/orderCompare';
import { estimateShipping } from '@/lib/shipping';

// ─── Types ────────────────────────────────────────────────────────────────────

export type PricingSource = 'personal' | 'shared';

export interface Supplier {
  id: string;
  user_id: string;
  name: string;
  url: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface SharedSupplier {
  id: string;
  name: string;
  url: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

/** Personal or shared supplier unified for display */
export interface MergedSupplier extends SharedSupplier {
  user_id: string; // '' for shared rows
  source: PricingSource;
}

export interface HerbPricing {
  id: string;
  user_id: string;
  herb_name: string;
  supplier_id: string;
  price_per_lb: number;
  package_size_g: number | null;
  package_price: number | null;
  supplier_item_code: string | null;
  supplier_item_name: string | null;
  notes: string | null;
  last_updated: string;
  // Joined
  suppliers?: { name: string; url: string | null };
}

export interface SharedHerbPricing {
  id: string;
  herb_name: string;
  supplier_id: string; // references shared_suppliers.id
  price_per_lb: number;
  package_size_g: number | null;
  package_price: number | null;
  supplier_item_code: string | null;
  supplier_item_name: string | null;
  notes: string | null;
  last_updated: string;
  shared_suppliers?: { name: string; url: string | null };
}

/** Personal or shared pricing row unified for display */
export interface MergedHerbPricing extends HerbPricing {
  source: PricingSource;
  // Original USD list prices, set only for USD-quoted suppliers (price_per_lb / package_price hold CAD)
  price_per_lb_usd?: number | null;
  package_price_usd?: number | null;
}

export interface HerbReorderQty {
  id: string;
  user_id: string;
  herb_name: string;
  quantity_lb: number;
}

export interface OrderHerbLine {
  herbName: string;
  qtyLb: number;
  pricePerLb: number;
  subtotal: number;
  packageInfo: string | null; // e.g. "1× 500g" for Clef
}

export interface SupplierOrder {
  supplier: Supplier;
  herbs: OrderHerbLine[];
  /** Herbs only (no shipping) */
  subtotal: number;
  /** Shipping + customs estimate for this supplier order */
  shipping: number;
  shippingNote: string;
  /** subtotal + shipping */
  total: number;
}

export interface OrderSuggestion {
  orders: SupplierOrder[];
  /** Herbs + shipping across all orders */
  grandTotal: number;
  herbsTotal: number;
  shippingTotal: number;
  uncoveredHerbs: string[];
  /** Extra cost (incl. shipping) had each herb simply gone to its cheapest supplier; 0 when same plan */
  savingsVsCheapestPerHerb: number;
}

// ─── Suppliers ────────────────────────────────────────────────────────────────

export function useSuppliers() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['suppliers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('suppliers')
        .select('*')
        .eq('user_id', user!.id)
        .order('name');
      if (error) throw error;
      return (data ?? []) as Supplier[];
    },
    enabled: !!user,
  });
}

export function useAddSupplier() {
  const { user } = useAuth();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (values: { name: string; url?: string; notes?: string }) => {
      const { data, error } = await supabase
        .from('suppliers')
        .insert({ user_id: user!.id, ...values })
        .select()
        .single();
      if (error) throw error;
      return data as Supplier;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['suppliers'] }),
  });
}

export function useUpdateSupplier() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...values }: { id: string; name?: string; url?: string | null; notes?: string | null }) => {
      const { error } = await supabase.from('suppliers').update(values).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['suppliers'] }),
  });
}

export function useDeleteSupplier() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('suppliers').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['suppliers'] });
      qc.invalidateQueries({ queryKey: ['herb_pricing'] });
    },
  });
}

// ─── Herb Pricing ─────────────────────────────────────────────────────────────

export function useHerbPricing() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['herb_pricing'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('herb_pricing')
        .select('*, suppliers(name, url)')
        .eq('user_id', user!.id)
        .order('herb_name');
      if (error) throw error;
      return (data ?? []) as HerbPricing[];
    },
    enabled: !!user,
  });
}

export function useAddHerbPrice() {
  const { user } = useAuth();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (values: {
      herb_name: string;
      supplier_id: string;
      price_per_lb: number;
      package_size_g?: number | null;
      package_price?: number | null;
      supplier_item_code?: string | null;
      notes?: string | null;
    }) => {
      const { error } = await supabase
        .from('herb_pricing')
        .upsert({ user_id: user!.id, last_updated: new Date().toISOString().slice(0, 10), ...values });
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['herb_pricing'] }),
  });
}

export function useUpdateHerbPrice() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...values }: {
      id: string;
      price_per_lb?: number;
      package_size_g?: number | null;
      package_price?: number | null;
      notes?: string | null;
    }) => {
      const { error } = await supabase
        .from('herb_pricing')
        .update({ ...values, last_updated: new Date().toISOString().slice(0, 10) })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['herb_pricing'] }),
  });
}

export function useDeleteHerbPrice() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('herb_pricing').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['herb_pricing'] }),
  });
}

// ─── Shared Suppliers & Pricing (read-only, admin-loaded) ────────────────────

export function useSharedSuppliers() {
  return useQuery({
    queryKey: ['shared_suppliers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('shared_suppliers')
        .select('*')
        .order('name');
      if (error) throw error;
      return (data ?? []) as SharedSupplier[];
    },
  });
}

export function useSharedHerbPricing() {
  return useQuery({
    queryKey: ['shared_herb_pricing'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('shared_herb_pricing')
        .select('*, shared_suppliers(name, url)')
        .order('herb_name');
      if (error) throw error;
      return (data ?? []) as SharedHerbPricing[];
    },
  });
}

/**
 * Merged supplier list: personal suppliers take precedence over shared ones with the same name.
 * The returned list is sorted by name and deduped — one entry per supplier name.
 */
export function useMergedSuppliers() {
  const personalQuery = useSuppliers();
  const sharedQuery = useSharedSuppliers();

  const data = useMemo(() => {
    const personal = personalQuery.data ?? [];
    const shared = sharedQuery.data ?? [];
    const personalNames = new Set(personal.map(s => s.name.toLowerCase()));

    const result: MergedSupplier[] = personal.map(s => ({ ...s, source: 'personal' as PricingSource }));

    for (const s of shared) {
      if (!personalNames.has(s.name.toLowerCase())) {
        result.push({ ...s, user_id: '', source: 'shared' as PricingSource });
      }
    }

    return result.sort((a, b) => a.name.localeCompare(b.name));
  }, [personalQuery.data, sharedQuery.data]);

  return {
    data,
    isLoading: personalQuery.isLoading || sharedQuery.isLoading,
  };
}

/**
 * Merged pricing list: personal rows override shared rows for the same (herb_name, supplier_name) pair.
 * Shared pricing rows are remapped to canonical supplier IDs (personal ID when a personal supplier
 * of the same name exists, otherwise the shared supplier ID).
 */
export function useMergedHerbPricing() {
  const personalSuppliersQuery = useSuppliers();
  const sharedSuppliersQuery = useSharedSuppliers();
  const personalPricingQuery = useHerbPricing();
  const sharedPricingQuery = useSharedHerbPricing();

  const data = useMemo(() => {
    const personalSuppliers = personalSuppliersQuery.data ?? [];
    const sharedSuppliers = sharedSuppliersQuery.data ?? [];
    const personalPricing = personalPricingQuery.data ?? [];
    const sharedPricing = sharedPricingQuery.data ?? [];

    // Personal supplier by name (for override detection)
    const personalByName = new Map(personalSuppliers.map(s => [s.name.toLowerCase(), s]));

    // Shared supplier ID → canonical ID (personal ID if overridden, else shared ID)
    const sharedToCanonical = new Map<string, string>();
    for (const s of sharedSuppliers) {
      const personal = personalByName.get(s.name.toLowerCase());
      sharedToCanonical.set(s.id, personal?.id ?? s.id);
    }

    // Personal rows for USD-quoted suppliers (imported from their price lists) are stored in USD
    const supplierNameById = new Map(personalSuppliers.map(s => [s.id, s.name]));
    const result: MergedHerbPricing[] = personalPricing.map(p => {
      const isUsd = isUsdSupplier(supplierNameById.get(p.supplier_id) ?? p.suppliers?.name);
      if (!isUsd) return { ...p, source: 'personal' as PricingSource };
      return {
        ...p,
        source: 'personal' as PricingSource,
        price_per_lb: usdToCad(Number(p.price_per_lb)),
        package_price: p.package_price != null ? usdToCad(Number(p.package_price)) : p.package_price,
        price_per_lb_usd: Number(p.price_per_lb),
        package_price_usd: p.package_price != null ? Number(p.package_price) : null,
      };
    });

    // Keys covered by personal pricing (herb_name_lower | canonical_supplier_id)
    const personalKeys = new Set(
      personalPricing.map(p => `${p.herb_name.toLowerCase()}|${p.supplier_id}`)
    );

    for (const p of sharedPricing) {
      const canonicalSupplierId = sharedToCanonical.get(p.supplier_id) ?? p.supplier_id;
      const key = `${p.herb_name.toLowerCase()}|${canonicalSupplierId}`;
      if (!personalKeys.has(key)) {
        const sharedSupplier = p.shared_suppliers;
        // Shared price lists from Mountain Rose / Pacific Botanicals are in USD → convert to CAD
        const isUsd = isUsdSupplier(sharedSupplier?.name);
        result.push({
          id: p.id,
          user_id: '',
          herb_name: p.herb_name,
          supplier_id: canonicalSupplierId,
          price_per_lb: isUsd ? usdToCad(Number(p.price_per_lb)) : p.price_per_lb,
          package_size_g: p.package_size_g,
          package_price: isUsd && p.package_price != null ? usdToCad(Number(p.package_price)) : p.package_price,
          price_per_lb_usd: isUsd ? Number(p.price_per_lb) : null,
          package_price_usd: isUsd && p.package_price != null ? Number(p.package_price) : null,
          supplier_item_code: p.supplier_item_code,
          supplier_item_name: p.supplier_item_name,
          notes: p.notes,
          last_updated: p.last_updated,
          source: 'shared' as PricingSource,
          suppliers: sharedSupplier ?? undefined,
        });
      }
    }

    return result;
  }, [personalSuppliersQuery.data, sharedSuppliersQuery.data, personalPricingQuery.data, sharedPricingQuery.data]);

  return {
    data,
    isLoading:
      personalSuppliersQuery.isLoading ||
      sharedSuppliersQuery.isLoading ||
      personalPricingQuery.isLoading ||
      sharedPricingQuery.isLoading,
  };
}

// ─── Reorder Quantities ───────────────────────────────────────────────────────

export function useReorderQtys() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['herb_reorder_qty'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('herb_reorder_qty')
        .select('*')
        .eq('user_id', user!.id);
      if (error) throw error;
      return (data ?? []) as HerbReorderQty[];
    },
    enabled: !!user,
  });
}

export function useUpsertReorderQty() {
  const { user } = useAuth();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ herb_name, quantity_lb }: { herb_name: string; quantity_lb: number }) => {
      const { error } = await supabase
        .from('herb_reorder_qty')
        .upsert({ user_id: user!.id, herb_name, quantity_lb }, { onConflict: 'user_id,herb_name' });
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['herb_reorder_qty'] }),
  });
}

// ─── Order Optimization ───────────────────────────────────────────────────────

interface HerbOption {
  supplierId: string;
  line: OrderHerbLine;
}

/**
 * Compute the cheapest way to place the order INCLUDING shipping/customs.
 *
 * Shipping is a flat cost per supplier order, so the cheapest plan is not always
 * "each herb from its cheapest supplier". We try every combination of suppliers
 * (a handful at most), send each herb to its cheapest supplier within that combination,
 * add that combination's shipping, and keep the lowest total. Ties go to fewer orders.
 */
export function computeOrderSuggestion(
  outHerbNames: string[],
  pricing: HerbPricing[],
  reorderQtys: HerbReorderQty[],
  suppliers: Supplier[],
): OrderSuggestion {
  const reorderMap = new Map(reorderQtys.map(r => [r.herb_name, r.quantity_lb]));
  const supplierMap = new Map(suppliers.map(s => [s.id, s]));

  const pricingByHerb = new Map<string, HerbPricing[]>();
  for (const p of pricing) {
    const key = p.herb_name.toLowerCase().trim();
    const list = pricingByHerb.get(key) ?? [];
    list.push(p);
    pricingByHerb.set(key, list);
  }

  // Every purchasable option per herb, with its full line cost for the quantity needed
  const optionsByHerb = new Map<string, HerbOption[]>();
  const uncoveredHerbs: string[] = [];

  for (const herbName of outHerbNames) {
    const rows = pricingByHerb.get(herbName.toLowerCase().trim()) ?? [];
    const qtyLb = reorderMap.get(herbName) ?? 1;
    const options: HerbOption[] = [];
    for (const row of rows) {
      if (!supplierMap.has(row.supplier_id)) continue;
      let subtotal = qtyLb * row.price_per_lb;
      let packageInfo: string | null = null;
      if (row.package_size_g && row.package_price) {
        subtotal = packagesNeeded(qtyLb, row.package_size_g) * row.package_price;
        packageInfo = formatPackageInfo(qtyLb, row.package_size_g);
      }
      options.push({
        supplierId: row.supplier_id,
        line: { herbName, qtyLb, pricePerLb: row.price_per_lb, subtotal, packageInfo },
      });
    }
    if (options.length === 0) uncoveredHerbs.push(herbName);
    else optionsByHerb.set(herbName, options);
  }

  const coveredHerbs = Array.from(optionsByHerb.keys());
  if (coveredHerbs.length === 0) {
    return { orders: [], grandTotal: 0, herbsTotal: 0, shippingTotal: 0, uncoveredHerbs, savingsVsCheapestPerHerb: 0 };
  }

  /** Build the order plan when each herb is sent to its cheapest option among `allowed` suppliers */
  const buildPlan = (allowed: Set<string> | null): SupplierOrder[] | null => {
    const bySupplier = new Map<string, OrderHerbLine[]>();
    for (const herbName of coveredHerbs) {
      const options = optionsByHerb.get(herbName)!.filter(o => !allowed || allowed.has(o.supplierId));
      if (options.length === 0) return null; // this supplier set can't cover every herb
      const best = options.reduce((a, b) => (a.line.subtotal <= b.line.subtotal ? a : b));
      const list = bySupplier.get(best.supplierId) ?? [];
      list.push(best.line);
      bySupplier.set(best.supplierId, list);
    }
    return Array.from(bySupplier.entries()).map(([supplierId, herbs]) => {
      const supplier = supplierMap.get(supplierId)!;
      const subtotal = herbs.reduce((sum, l) => sum + l.subtotal, 0);
      const ship = estimateShipping(supplier.name, subtotal);
      return { supplier, herbs, subtotal, shipping: ship.cost, shippingNote: ship.note, total: subtotal + ship.cost };
    });
  };

  const planTotal = (plan: SupplierOrder[]) => plan.reduce((sum, o) => sum + o.total, 0);

  // Baseline: cheapest supplier per herb, ignoring shipping when choosing
  const baseline = buildPlan(null)!;

  // Candidate supplier set = every supplier that can sell at least one herb
  const candidateIds = Array.from(new Set(coveredHerbs.flatMap(h => optionsByHerb.get(h)!.map(o => o.supplierId))));

  let best = baseline;
  let bestTotal = planTotal(baseline);

  if (candidateIds.length <= 10) {
    for (let mask = 1; mask < 1 << candidateIds.length; mask++) {
      const allowed = new Set(candidateIds.filter((_, i) => mask & (1 << i)));
      const plan = buildPlan(allowed);
      if (!plan) continue;
      const total = planTotal(plan);
      if (total < bestTotal - 0.005 || (Math.abs(total - bestTotal) <= 0.005 && plan.length < best.length)) {
        best = plan;
        bestTotal = total;
      }
    }
  }

  const orders = best.sort((a, b) => b.total - a.total);
  const herbsTotal = orders.reduce((sum, o) => sum + o.subtotal, 0);
  const shippingTotal = orders.reduce((sum, o) => sum + o.shipping, 0);

  return {
    orders,
    grandTotal: herbsTotal + shippingTotal,
    herbsTotal,
    shippingTotal,
    uncoveredHerbs,
    savingsVsCheapestPerHerb: Math.max(0, planTotal(baseline) - (herbsTotal + shippingTotal)),
  };
}
