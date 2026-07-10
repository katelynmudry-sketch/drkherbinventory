import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { findHerbNameMatch } from '@/hooks/useInventoryCheck';

export type BottleSizeMl = 100 | 250 | 500 | 1000;

export interface TincturePriceTier {
  id: string;
  tier_label: string;
  price_100ml: number;
  price_250ml: number;
  price_500ml: number;
  price_1000ml: number;
}

export interface TincturePriceHerb {
  id: string;
  herb_name: string;
  tier_id: string;
}

export interface PremadeTincture {
  id: string;
  user_id: string;
  herb_name: string;
  notes: string | null;
  default_size_ml: BottleSizeMl | null;
  created_at: string;
}

export function useTincturePriceTiers() {
  return useQuery({
    queryKey: ['tincture_price_tiers'],
    queryFn: async () => {
      const { data, error } = await supabase.from('tincture_price_tiers').select('*').order('tier_label');
      if (error) throw error;
      return (data ?? []) as TincturePriceTier[];
    },
  });
}

export function useTincturePriceHerbs() {
  return useQuery({
    queryKey: ['tincture_price_herbs'],
    queryFn: async () => {
      const { data, error } = await supabase.from('tincture_price_herbs').select('*').order('herb_name');
      if (error) throw error;
      return (data ?? []) as TincturePriceHerb[];
    },
  });
}

export function usePremadeTinctures() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['premade_tinctures'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('premade_tinctures')
        .select('*')
        .eq('user_id', user!.id)
        .order('herb_name');
      if (error) throw error;
      return (data ?? []) as PremadeTincture[];
    },
    enabled: !!user,
  });
}

export function useAddPremadeTincture() {
  const { user } = useAuth();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (values: { herb_name: string; notes?: string; default_size_ml?: BottleSizeMl }) => {
      const { error } = await supabase.from('premade_tinctures').insert({ user_id: user!.id, ...values });
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['premade_tinctures'] }),
  });
}

export function useUpdatePremadeTincture() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...values }: { id: string; notes?: string | null; default_size_ml?: BottleSizeMl | null }) => {
      const { error } = await supabase.from('premade_tinctures').update(values).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['premade_tinctures'] }),
  });
}

export function useDeletePremadeTincture() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('premade_tinctures').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['premade_tinctures'] }),
  });
}

const SIZE_KEYS: Record<BottleSizeMl, keyof TincturePriceTier> = {
  100: 'price_100ml',
  250: 'price_250ml',
  500: 'price_500ml',
  1000: 'price_1000ml',
};

// Pure lookup: find a herb's price for a given bottle size via its tier.
// Uses the same fuzzy name matching as the rest of the app.
export function lookupTincturePrice(
  herbName: string,
  priceHerbs: TincturePriceHerb[],
  tiers: TincturePriceTier[],
  sizeMl: BottleSizeMl
): number | null {
  const herbMatch = findHerbNameMatch(herbName, priceHerbs);
  if (!herbMatch) return null;
  const tier = tiers.find(t => t.id === herbMatch.tier_id);
  if (!tier) return null;
  return tier[SIZE_KEYS[sizeMl]] as number;
}
