import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useEffect } from 'react';

export type InventoryLocation = 'backstock' | 'tincture' | 'clinic';
export type InventoryStatus = 'full' | 'low' | 'out';

export interface Herb {
  id: string;
  user_id: string;
  name: string;
  common_name: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
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

  // Subscribe to realtime updates
  useEffect(() => {
    const channel = supabase
      .channel('inventory-changes')
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
  }, [queryClient]);

  return query;
}

export function useAddHerb() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (herb: { name: string; common_name?: string; notes?: string }) => {
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
    mutationFn: async ({ id, ...updates }: { id: string; name?: string; common_name?: string; notes?: string }) => {
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

export function useSearchInventory() {
  return useMutation({
    mutationFn: async (searchTerm: string) => {
      const { data, error } = await supabase
        .from('inventory')
        .select('*, herbs!inner(*)')
        .or(`name.ilike.%${searchTerm}%,common_name.ilike.%${searchTerm}%`, { referencedTable: 'herbs' });
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
