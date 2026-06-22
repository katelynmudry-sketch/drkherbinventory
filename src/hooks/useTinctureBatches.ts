import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Herb } from '@/hooks/useInventory';

export interface TinctureBatch {
  id: string;
  user_id: string;
  herb_id: string;
  batch_number: string;
  batch_date: string;
  status: 'macerating' | 'active' | 'archived';
  pressed_date: string | null;
  notes: string | null;
  bulk_inventory_id: string | null;
  bulk_batch_id: string | null;
  created_at: string;
  updated_at: string;
  herbs?: Herb;
  bulk_batches?: { id: string; batch_number: string; received_date: string } | null;
}

// Fetch all batches (active + archived) for the current user
export function useTinctureBatches() {
  return useQuery({
    queryKey: ['tincture_batches'],
    queryFn: async (): Promise<TinctureBatch[]> => {
      const { data, error } = await supabase
        .from('tincture_batches')
        .select('*, herbs(*), bulk_batches(id, batch_number, received_date)')
        .order('batch_date', { ascending: false });
      if (error) throw error;
      return data as TinctureBatch[];
    },
  });
}

// Fetch the active (pressed) batch for a single herb
export function useCurrentBatch(herbId: string | undefined) {
  return useQuery({
    queryKey: ['tincture_batches', 'active', herbId],
    enabled: !!herbId,
    queryFn: async (): Promise<TinctureBatch | null> => {
      if (!herbId) return null;
      const { data, error } = await supabase
        .from('tincture_batches')
        .select('*, herbs(*), bulk_batches(id, batch_number, received_date)')
        .eq('herb_id', herbId)
        .eq('status', 'active')
        .maybeSingle();
      if (error) throw error;
      return data as TinctureBatch | null;
    },
  });
}

// Fetch the macerating batch for a single herb (in-tincture stage)
export function useMaceratingBatch(herbId: string | undefined) {
  return useQuery({
    queryKey: ['tincture_batches', 'macerating', herbId],
    enabled: !!herbId,
    queryFn: async (): Promise<TinctureBatch | null> => {
      if (!herbId) return null;
      const { data, error } = await supabase
        .from('tincture_batches')
        .select('*, herbs(*), bulk_batches(id, batch_number, received_date)')
        .eq('herb_id', herbId)
        .eq('status', 'macerating')
        .maybeSingle();
      if (error) throw error;
      return data as TinctureBatch | null;
    },
  });
}

// Create a new batch for a herb (starts as 'macerating'):
//   1. Generates batch number via DB function
//   2. Inserts new batch with status='macerating'
//   (Does NOT archive existing active batches — pressing does that)
export function useCreateTinctureBatch() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: {
      herb_id: string;
      batch_date?: string;
      notes?: string;
      bulk_inventory_id?: string;
    }): Promise<TinctureBatch> => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // 1. Generate batch number via DB function
      const { data: batchNumber, error: fnError } = await supabase
        .rpc('generate_batch_number', {
          p_herb_id: input.herb_id,
          p_user_id: user.id,
        });
      if (fnError) throw fnError;

      // 2. Find the herb's current available bulk lot — that lot is the
      // source for this tincture batch (most-recent-arrival convention,
      // same as how pressing tags backstock with the most recent batch).
      const { data: bulkLot } = await supabase
        .from('bulk_batches')
        .select('id')
        .eq('user_id', user.id)
        .eq('herb_id', input.herb_id)
        .eq('status', 'available')
        .maybeSingle();

      // 3. Insert new batch as 'macerating' (not yet pressed)
      const { data, error } = await supabase
        .from('tincture_batches')
        .insert({
          user_id: user.id,
          herb_id: input.herb_id,
          batch_number: batchNumber as string,
          batch_date: input.batch_date ?? new Date().toISOString().split('T')[0],
          status: 'macerating',
          notes: input.notes ?? null,
          bulk_inventory_id: input.bulk_inventory_id ?? null,
          bulk_batch_id: bulkLot?.id ?? null,
        })
        .select('*, herbs(*), bulk_batches(id, batch_number, received_date)')
        .single();
      if (error) throw error;

      // 4. Consume the bulk lot — it's now used by this tincture batch
      if (bulkLot) {
        await supabase
          .from('bulk_batches')
          .update({ status: 'depleted' })
          .eq('id', bulkLot.id);
      }

      return data as TinctureBatch;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tincture_batches'] });
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
      queryClient.invalidateQueries({ queryKey: ['bulk_batches'] });
    },
  });
}

// Press a batch:
//   1. Sets this batch to 'active' + records pressed_date
//   2. Updates inventory backstock rows for this herb to reference this batch
//   3. Keeps at most 2 active batches per herb — archives the oldest if there are now 3+
export function usePressBatch() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (batchId: string): Promise<void> => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // 1. Fetch the batch being pressed
      const { data: batch, error: fetchErr } = await supabase
        .from('tincture_batches')
        .select('*')
        .eq('id', batchId)
        .single();
      if (fetchErr) throw fetchErr;

      // 2. Mark it active + record pressed_date
      const { error: pressErr } = await supabase
        .from('tincture_batches')
        .update({ status: 'active', pressed_date: new Date().toISOString().split('T')[0] })
        .eq('id', batchId);
      if (pressErr) throw pressErr;

      // 3. Tag backstock inventory rows for this herb with this batch
      await supabase
        .from('inventory')
        .update({ current_batch_id: batchId })
        .eq('user_id', user.id)
        .eq('herb_id', batch.herb_id)
        .eq('location', 'backstock');

      // 4. Keep only 2 active batches — archive oldest if there are now 3+
      const { data: activeBatches, error: listErr } = await supabase
        .from('tincture_batches')
        .select('id, pressed_date, batch_date')
        .eq('user_id', user.id)
        .eq('herb_id', batch.herb_id)
        .eq('status', 'active')
        .order('pressed_date', { ascending: true });
      if (listErr) throw listErr;

      if (activeBatches && activeBatches.length > 2) {
        // Archive all but the 2 most recent
        const toArchive = activeBatches.slice(0, activeBatches.length - 2).map(b => b.id);
        await supabase
          .from('tincture_batches')
          .update({ status: 'archived' })
          .in('id', toArchive);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tincture_batches'] });
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
    },
  });
}

// Archive a batch and clear current_batch_id on any inventory rows referencing it
export function useArchiveBatch() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (batchId: string): Promise<void> => {
      const { error } = await supabase
        .from('tincture_batches')
        .update({ status: 'archived' })
        .eq('id', batchId);
      if (error) throw error;

      await supabase
        .from('inventory')
        .update({ current_batch_id: null })
        .eq('current_batch_id', batchId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tincture_batches'] });
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
    },
  });
}

// Given a list of herb names, return each herb's active batch (for formula lookups)
export function useGetBatchesForFormula() {
  return useMutation({
    mutationFn: async (
      herbNames: string[]
    ): Promise<Array<{ herbName: string; batch: TinctureBatch | null }>> => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const normalized = herbNames.map(n => n.toLowerCase().trim());

      // Fetch all active batches with herb names in one query
      const { data, error } = await supabase
        .from('tincture_batches')
        .select('*, herbs(*), bulk_batches(id, batch_number, received_date)')
        .eq('user_id', user.id)
        .eq('status', 'active');
      if (error) throw error;

      const batches = data as TinctureBatch[];

      // Build lookup by any name variant (name, common_name, latin_name, pinyin_name)
      const batchByName = new Map<string, TinctureBatch>();
      for (const batch of batches) {
        if (!batch.herbs) continue;
        const h = batch.herbs;
        for (const n of [h.name, h.common_name, h.latin_name, h.pinyin_name]) {
          if (n) batchByName.set(n.toLowerCase().trim(), batch);
        }
      }

      return herbNames.map((originalName, i) => ({
        herbName: originalName,
        batch: batchByName.get(normalized[i]) ?? null,
      }));
    },
  });
}
