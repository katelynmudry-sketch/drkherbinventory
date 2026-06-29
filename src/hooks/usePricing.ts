import { useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

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
  total: number;
}

export interface OrderSuggestion {
  orders: SupplierOrder[];
  grandTotal: number;
  uncoveredHerbs: string[];
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

    const result: MergedHerbPricing[] = personalPricing.map(p => ({
      ...p,
      source: 'personal' as PricingSource,
    }));

    // Keys covered by personal pricing (herb_name_lower | canonical_supplier_id)
    const personalKeys = new Set(
      personalPricing.map(p => `${p.herb_name.toLowerCase()}|${p.supplier_id}`)
    );

    for (const p of sharedPricing) {
      const canonicalSupplierId = sharedToCanonical.get(p.supplier_id) ?? p.supplier_id;
      const key = `${p.herb_name.toLowerCase()}|${canonicalSupplierId}`;
      if (!personalKeys.has(key)) {
        const sharedSupplier = p.shared_suppliers;
        result.push({
          id: p.id,
          user_id: '',
          herb_name: p.herb_name,
          supplier_id: canonicalSupplierId,
          price_per_lb: p.price_per_lb,
          package_size_g: p.package_size_g,
          package_price: p.package_price,
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

const GRAMS_PER_LB = 453.592;

/** How many packages of `packageSizeG` grams to cover `qtyLb` pounds */
function packagesNeeded(qtyLb: number, packageSizeG: number): number {
  const qtyG = qtyLb * GRAMS_PER_LB;
  return Math.ceil(qtyG / packageSizeG);
}

/** Format package info string for display, e.g. "2× 500g" */
function formatPackageInfo(qtyLb: number, packageSizeG: number): string {
  const n = packagesNeeded(qtyLb, packageSizeG);
  return `${n}× ${packageSizeG}g`;
}

/**
 * Compute optimized order split: each herb goes to cheapest available supplier.
 * Returns one order per supplier.
 */
export function computeOrderSuggestion(
  outHerbNames: string[],
  pricing: HerbPricing[],
  reorderQtys: HerbReorderQty[],
  suppliers: Supplier[],
): OrderSuggestion {
  const reorderMap = new Map(reorderQtys.map(r => [r.herb_name, r.quantity_lb]));
  const supplierMap = new Map(suppliers.map(s => [s.id, s]));

  // Group pricing by herb_name (lowercased for case-insensitive lookup)
  const pricingByHerb = new Map<string, HerbPricing[]>();
  for (const p of pricing) {
    const key = p.herb_name.toLowerCase().trim();
    const list = pricingByHerb.get(key) ?? [];
    list.push(p);
    pricingByHerb.set(key, list);
  }

  const ordersMap = new Map<string, SupplierOrder>(); // supplier_id → order
  const uncoveredHerbs: string[] = [];

  for (const herbName of outHerbNames) {
    const options = pricingByHerb.get(herbName.toLowerCase().trim()) ?? [];
    if (options.length === 0) {
      uncoveredHerbs.push(herbName);
      continue;
    }

    // Find cheapest supplier for this herb
    const cheapest = options.reduce((a, b) => a.price_per_lb <= b.price_per_lb ? a : b);
    const supplier = supplierMap.get(cheapest.supplier_id);
    if (!supplier) {
      uncoveredHerbs.push(herbName);
      continue;
    }

    const qtyLb = reorderMap.get(herbName) ?? 1;
    let subtotal = qtyLb * cheapest.price_per_lb;
    let packageInfo: string | null = null;

    // For Clef (package-based), calculate actual packages needed
    if (cheapest.package_size_g && cheapest.package_price) {
      const pkgsNeeded = packagesNeeded(qtyLb, cheapest.package_size_g);
      subtotal = pkgsNeeded * cheapest.package_price;
      packageInfo = formatPackageInfo(qtyLb, cheapest.package_size_g);
    }

    const line: OrderHerbLine = {
      herbName,
      qtyLb,
      pricePerLb: cheapest.price_per_lb,
      subtotal,
      packageInfo,
    };

    if (!ordersMap.has(supplier.id)) {
      ordersMap.set(supplier.id, { supplier, herbs: [], total: 0 });
    }
    const order = ordersMap.get(supplier.id)!;
    order.herbs.push(line);
    order.total += subtotal;
  }

  const orders = Array.from(ordersMap.values()).sort((a, b) => b.total - a.total);
  const grandTotal = orders.reduce((sum, o) => sum + o.total, 0);

  return { orders, grandTotal, uncoveredHerbs };
}
