import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useEffect } from 'react';

export type InventoryLocation = 'backstock' | 'tincture' | 'clinic' | 'bulk' | 'bulk_backstock';
export type InventoryStatus = 'full' | 'low' | 'out';

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
    mutationFn: async ({ id, ...updates }: { id: string; name?: string; common_name?: string; latin_name?: string; pinyin_name?: string; preferred_name?: 'common' | 'latin' | 'pinyin' | null; low_threshold_lb?: number; notes?: string }) => {
      const { data, error } = await supabase
        .from('herbs')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
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
    mutationFn: async ({ id, ...updates }: Partial<InventoryItem> & { id: string }) => {
      const { data, error } = await supabase
        .from('inventory')
        .update(updates)
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
