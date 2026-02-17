import { supabase } from '@/integrations/supabase/client';
import { InventoryItem, InventoryLocation } from './useInventory';

export interface AvailabilityInfo {
  location: InventoryLocation;
  status: string;
  tinctureReadyAt?: string | null;
}

export async function checkHerbAvailability(herbId: string, excludeLocation?: InventoryLocation): Promise<AvailabilityInfo[]> {
  const locations: InventoryLocation[] = ['backstock', 'tincture'];
  
  if (excludeLocation) {
    const filtered = locations.filter(loc => loc !== excludeLocation);
    
    const { data, error } = await supabase
      .from('inventory')
      .select('location, status, tincture_ready_at')
      .eq('herb_id', herbId)
      .in('location', filtered);
    
    if (error) throw error;
    
    return (data || []).map(item => ({
      location: item.location as InventoryLocation,
      status: item.status,
      tinctureReadyAt: item.tincture_ready_at,
    }));
  }
  
  return [];
}

export async function checkHerbAvailabilityByName(herbName: string): Promise<{ herbId: string | null; availability: AvailabilityInfo[] }> {
  // First find the herb by name
  const { data: herbs, error: herbError } = await supabase
    .from('herbs')
    .select('id')
    .ilike('name', herbName)
    .limit(1);
  
  if (herbError) throw herbError;
  if (!herbs || herbs.length === 0) {
    return { herbId: null, availability: [] };
  }
  
  const herbId = herbs[0].id;
  
  // Check backstock and tincture
  const { data: inventory, error: invError } = await supabase
    .from('inventory')
    .select('location, status, tincture_ready_at')
    .eq('herb_id', herbId)
    .in('location', ['backstock', 'tincture']);
  
  if (invError) throw invError;
  
  return {
    herbId,
    availability: (inventory || []).map(item => ({
      location: item.location as InventoryLocation,
      status: item.status,
      tinctureReadyAt: item.tincture_ready_at,
    })),
  };
}

export function formatAvailabilityMessage(availability: AvailabilityInfo[]): string {
  if (availability.length === 0) return '';
  
  const messages: string[] = [];
  
  for (const item of availability) {
    if (item.location === 'backstock') {
      messages.push(`📦 In Backstock (${item.status})`);
    } else if (item.location === 'tincture') {
      if (item.tinctureReadyAt) {
        const readyDate = new Date(item.tinctureReadyAt);
        const isReady = readyDate <= new Date();
        if (isReady) {
          messages.push(`🧪 Tincture Ready!`);
        } else {
          const daysLeft = Math.ceil((readyDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
          messages.push(`🧪 Tincture brewing (${daysLeft} days left)`);
        }
      } else {
        messages.push(`🧪 In Tincture`);
      }
    }
  }
  
  return messages.join(' • ');
}
