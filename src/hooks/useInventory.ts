import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useEffect } from 'react';

export type InventoryLocation = 'backstock' | 'tincture' | 'clinic' | 'bulk' | 'bulk_backstock';
export type InventoryStatus = 'full' | 'low' | 'out' | 'ordered';

export interface Herb {
  id: string;
  user_id: string;
  name: string;
  common_name: string | null;
  latin_name: string | null;
  pinyin_name: string | null;
  preferred_name: 'common' | 'latin' | 'pinyin' | null;
  low_threshold_lb: number;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export function getDisplayName(herb: Herb): string {
  if (herb.preferred_name === 'common' && herb.common_name) return herb.common_name;
  if (herb.preferred_name === 'latin' && herb.latin_name) return herb.latin_name;
  if (herb.preferred_name === 'pinyin' && herb.pinyin_name) return herb.pinyin_name;
  return herb.name;
}

export interface InventoryItem {
  id: string;
  user_id: string;
  herb_id: string;
  location: InventoryLocation;
  quantity: number;
  status: InventoryStatus;
  tincture_started_at: string | null;
  tincture_ready_at: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
  herbs?: Herb;
}

export function useHerbs() {
  return useQuery({
    queryKey: ['herbs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('herbs')
        .select('*')
        .order('name');
      if (error) throw error;
      return data as Herb[];
    },
  });
}

export function useInventory(location?: InventoryLocation) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['inventory', location],
    queryFn: async () => {
      let q = supabase
        .from('inventory')
        .select('*, herbs(*)')
        .order('created_at', { ascending: false });
      
      if (location) {
        q = q.eq('location', location);
      }
      
      const { data, error } = await q;
      if (error) throw error;
      return data as InventoryItem[];
    },
  });

  // Subscribe to realtime updates (channel name is unique per location to avoid conflicts)
  useEffect(() => {
    const channel = supabase
      .channel(`inventory-changes-${location ?? 'all'}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'inventory' },
        () => {
          queryClient.invalidateQueries({ queryKey: ['inventory'] });
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'herbs' },
        () => {
          queryClient.invalidateQueries({ queryKey: ['herbs'] });
          queryClient.invalidateQueries({ queryKey: ['inventory'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient, location]);

  return query;
}

export function useAddHerb() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (herb: { name: string; common_name?: string; latin_name?: string; pinyin_name?: string; preferred_name?: 'common' | 'latin' | 'pinyin'; low_threshold_lb?: number; notes?: string }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');
      
      const { data, error } = await supabase
        .from('herbs')
        .insert({ ...herb, user_id: user.id })
        .select()
        .single();
      if (error) throw error;
      return data as Herb;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['herbs'] });
    },
  });
}

export function useUpdateHerb() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, name, common_name, latin_name, pinyin_name, preferred_name, low_threshold_lb, notes }: { id: string; name?: string; common_name?: string | null; latin_name?: string | null; pinyin_name?: string | null; preferred_name?: 'common' | 'latin' | 'pinyin' | null; low_threshold_lb?: number; notes?: string | null }) => {
      // Build payload with only defined fields; coerce types to match DB expectations
      const payload: Record<string, unknown> = {};
      if (name !== undefined) payload.name = name;
      if (common_name !== undefined) payload.common_name = common_name || null;
      if (latin_name !== undefined) payload.latin_name = latin_name || null;
      if (pinyin_name !== undefined) payload.pinyin_name = pinyin_name || null;
      if (preferred_name !== undefined) payload.preferred_name = preferred_name || null;
      // low_threshold_lb excluded — PostgREST schema cache doesn't reflect this column yet
      if (notes !== undefined) payload.notes = notes || null;

      // Do the update without select — avoids RLS RETURNING issues
      const { error: updateError } = await supabase
        .from('herbs')
        .update(payload)
        .eq('id', id);
      if (updateError) {
        console.error('updateHerb error', updateError, 'payload', payload);
        throw updateError;
      }
      // Fetch the updated row separately
      const { data, error: fetchError } = await supabase
        .from('herbs')
        .select()
        .eq('id', id)
        .single();
      if (fetchError) throw fetchError;
      return data as Herb;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['herbs'] });
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
    },
  });
}

export function useAddInventory() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (item: {
      herb_id: string;
      location: InventoryLocation;
      quantity?: number;
      status?: InventoryStatus;
      notes?: string;
    }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');
      
      const tincture_started_at = item.location === 'tincture' ? new Date().toISOString() : null;
      const tincture_ready_at = item.location === 'tincture' 
        ? new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString() 
        : null;
      
      const { data, error } = await supabase
        .from('inventory')
        .insert({
          ...item,
          user_id: user.id,
          tincture_started_at,
          tincture_ready_at,
        })
        .select('*, herbs(*)')
        .single();
      if (error) throw error;
      return data as InventoryItem;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
    },
  });
}

export function useUpdateInventory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, status, quantity, notes, tincture_started_at, tincture_ready_at }: Partial<InventoryItem> & { id: string }) => {
      // Only send writable columns — never send herbs join, user_id, created_at, updated_at
      const payload: Record<string, unknown> = {};
      if (status !== undefined) payload.status = status;
      if (quantity !== undefined) payload.quantity = quantity;
      if (notes !== undefined) payload.notes = notes;
      if (tincture_started_at !== undefined) payload.tincture_started_at = tincture_started_at;
      if (tincture_ready_at !== undefined) payload.tincture_ready_at = tincture_ready_at;

      const { data, error } = await supabase
        .from('inventory')
        .update(payload)
        .eq('id', id)
        .select('*, herbs(*)')
        .single();
      if (error) throw error;
      return data as InventoryItem;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
    },
  });
}

export function useDeleteInventory() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('inventory')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
    },
  });
}

// Batch upsert for bulk stock count mode
export function useBulkUpsert() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (entries: Array<{
      herbName: string;
      quantity: number;
      status: InventoryStatus;
      herbId?: string;          // set if herb already exists in herbs table
    }>) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Process in small batches to avoid hitting Supabase connection limits
      const BATCH_SIZE = 5;
      for (let i = 0; i < entries.length; i += BATCH_SIZE) {
        const batch = entries.slice(i, i + BATCH_SIZE);
        await Promise.all(batch.map(async (entry) => {
          let herb_id = entry.herbId;

          // Create herb record if it doesn't exist yet
          if (!herb_id) {
            const { data: existing } = await supabase
              .from('herbs')
              .select('id')
              .eq('user_id', user.id)
              .ilike('name', entry.herbName)
              .single();

            if (existing) {
              herb_id = existing.id;
            } else {
              const { data: created, error } = await supabase
                .from('herbs')
                .insert({ name: entry.herbName, user_id: user.id })
                .select('id')
                .single();
              if (error) throw new Error(error.message || 'Failed to create herb');
              herb_id = created.id;
            }
          }

          // Upsert on (herb_id, location) — do NOT include id in payload,
          // as passing id alongside onConflict:'herb_id,location' triggers a
          // duplicate primary key error when Supabase tries to insert a new row.
          const { error } = await supabase
            .from('inventory')
            .upsert({
              herb_id,
              location: 'bulk',
              quantity: entry.quantity,
              status: entry.status,
              user_id: user.id,
              tincture_started_at: null,
              tincture_ready_at: null,
            }, { onConflict: 'herb_id,location' });
          if (error) throw new Error(error.message || 'Failed to save inventory');
        }));
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
      queryClient.invalidateQueries({ queryKey: ['herbs'] });
    },
  });
}

export function useSearchInventory() {
  return useMutation({
    mutationFn: async (searchTerm: string) => {
      const { data, error } = await supabase
        .from('inventory')
        .select('*, herbs!inner(*)')
        .or(`name.ilike.%${searchTerm}%,common_name.ilike.%${searchTerm}%,latin_name.ilike.%${searchTerm}%,pinyin_name.ilike.%${searchTerm}%`, { referencedTable: 'herbs' });
      if (error) throw error;
      return data as InventoryItem[];
    },
  });
}

export function useRemoveInventoryByHerbName() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ herbName, location }: { herbName: string; location: InventoryLocation }) => {
      // First find the inventory item by herb name and location
      const { data: inventoryItems, error: findError } = await supabase
        .from('inventory')
        .select('id, herbs!inner(name)')
        .eq('location', location)
        .ilike('herbs.name', herbName);
      
      if (findError) throw findError;
      if (!inventoryItems || inventoryItems.length === 0) {
        throw new Error(`${herbName} not found in ${location}`);
      }
      
      // Delete the inventory item
      const { error: deleteError } = await supabase
        .from('inventory')
        .delete()
        .eq('id', inventoryItems[0].id);
      
      if (deleteError) throw deleteError;
      return { herbName, location };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
    },
  });
}

export function useUpdateInventoryByHerbName() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ herbName, location, status }: { herbName: string; location: InventoryLocation; status: InventoryStatus }) => {
      // First find the inventory item by herb name and location
      const { data: inventoryItems, error: findError } = await supabase
        .from('inventory')
        .select('id, herbs!inner(name)')
        .eq('location', location)
        .ilike('herbs.name', herbName);

      if (findError) throw findError;
      if (!inventoryItems || inventoryItems.length === 0) {
        throw new Error(`${herbName} not found in ${location}`);
      }

      // Update the inventory item status
      const { data, error: updateError } = await supabase
        .from('inventory')
        .update({ status })
        .eq('id', inventoryItems[0].id)
        .select('*, herbs(*)')
        .single();

      if (updateError) throw updateError;
      return { herbName, location, status, data };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
    },
  });
}

// Update a herb's low_threshold_lb (reorder trigger) by herb_id
export function useUpdateLowThreshold() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ herbId, low_threshold_lb }: { herbId: string; low_threshold_lb: number }) => {
      const { error } = await supabase
        .from('herbs')
        .update({ low_threshold_lb })
        .eq('id', herbId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['herbs'] });
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
    },
  });
}

// Mark multiple inventory items as 'ordered'
export function useMarkAsOrdered() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (inventoryIds: string[]) => {
      const { error } = await supabase
        .from('inventory')
        .update({ status: 'ordered' })
        .in('id', inventoryIds);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
    },
  });
}
