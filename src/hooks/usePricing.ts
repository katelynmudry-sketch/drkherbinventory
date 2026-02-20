import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface Supplier {
  id: string;
  user_id: string;
  name: string;
  url: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
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

  // Group pricing by herb_name
  const pricingByHerb = new Map<string, HerbPricing[]>();
  for (const p of pricing) {
    const list = pricingByHerb.get(p.herb_name) ?? [];
    list.push(p);
    pricingByHerb.set(p.herb_name, list);
  }

  const ordersMap = new Map<string, SupplierOrder>(); // supplier_id → order
  const uncoveredHerbs: string[] = [];

  for (const herbName of outHerbNames) {
    const options = pricingByHerb.get(herbName) ?? [];
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
