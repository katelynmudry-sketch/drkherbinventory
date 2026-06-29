import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Herb } from '@/hooks/useInventory';

export interface BulkBatch {
  id: string;
  user_id: string;
  herb_id: string;
  batch_number: string;
  received_date: string;
  status: 'available' | 'depleted';
  notes: string | null;
  created_at: string;
  updated_at: string;
  herbs?: Herb;
}

// Fetch all bulk lots (available + depleted) for the current user
export function useBulkBatches() {
  return useQuery({
    queryKey: ['bulk_batches'],
    queryFn: async (): Promise<BulkBatch[]> => {
      const { data, error } = await supabase
        .from('bulk_batches')
        .select('*, herbs(*)')
        .order('received_date', { ascending: false });
      if (error) throw error;
      return data as BulkBatch[];
    },
  });
}

// Fetch the available lot for a single herb
export function useCurrentBulkBatch(herbId: string | undefined) {
  return useQuery({
    queryKey: ['bulk_batches', 'available', herbId],
    enabled: !!herbId,
    queryFn: async (): Promise<BulkBatch | null> => {
      if (!herbId) return null;
      const { data, error } = await supabase
        .from('bulk_batches')
        .select('*, herbs(*)')
        .eq('herb_id', herbId)
        .eq('status', 'available')
        .maybeSingle();
      if (error) throw error;
      return data as BulkBatch | null;
    },
  });
}

// Record a new bulk lot arrival for a herb:
//   1. Generates lot batch number via DB function
//   2. Marks any existing 'available' lot for this herb as 'depleted'
//   3. Inserts the new lot as 'available'
//   4. Tags the herb's bulk inventory row with this lot
export function useReceiveBulkBatch() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: { herb_id: string; notes?: string }): Promise<BulkBatch> => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data: batchNumber, error: fnError } = await supabase
        .rpc('generate_bulk_batch_number', {
          p_herb_id: input.herb_id,
          p_user_id: user.id,
        });
      if (fnError) throw fnError;

      await supabase
        .from('bulk_batches')
        .update({ status: 'depleted' })
        .eq('user_id', user.id)
        .eq('herb_id', input.herb_id)
        .eq('status', 'available');

      const { data, error } = await supabase
        .from('bulk_batches')
        .insert({
          user_id: user.id,
          herb_id: input.herb_id,
          batch_number: batchNumber as string,
          status: 'available',
          notes: input.notes ?? null,
        })
        .select('*, herbs(*)')
        .single();
      if (error) throw error;

      await supabase
        .from('inventory')
        .update({ current_bulk_batch_id: data.id })
        .eq('user_id', user.id)
        .eq('herb_id', input.herb_id)
        .eq('location', 'bulk');

      return data as BulkBatch;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bulk_batches'] });
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
    },
  });
}
