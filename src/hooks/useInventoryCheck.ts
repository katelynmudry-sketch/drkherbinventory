import { supabase } from '@/integrations/supabase/client';
import { getDisplayName, InventoryItem, InventoryLocation } from './useInventory';

export interface AvailabilityInfo {
  location: InventoryLocation;
  status: string;
  tinctureReadyAt?: string | null;
}

// Core name matcher: exact (case-insensitive) → prefix → typo-tolerant
// (first-6-characters) match. Returns the matching candidate name as given.
export function matchHerbName(targetName: string, candidateNames: string[]): string | undefined {
  const target = targetName.toLowerCase().trim();
  if (!target) return undefined;

  let prefixMatch: string | undefined;
  let typoMatch: string | undefined;
  for (const raw of candidateNames) {
    const name = raw.toLowerCase().trim();
    if (name === target) return raw;
    if (!prefixMatch && (name.startsWith(target) || target.startsWith(name))) {
      prefixMatch = raw;
    }
    if (!typoMatch && target.length >= 5 && name.length >= 5 && target.slice(0, 6) === name.slice(0, 6)) {
      typoMatch = raw;
    }
  }
  return prefixMatch ?? typoMatch;
}

// Generic version of matchHerbName for any candidate shape with a herb_name field.
export function findHerbNameMatch<T extends { herb_name: string }>(
  targetName: string,
  candidates: T[]
): T | undefined {
  const byName = new Map(candidates.map(c => [c.herb_name, c]));
  const matchedName = matchHerbName(targetName, candidates.map(c => c.herb_name));
  return matchedName ? byName.get(matchedName) : undefined;
}

// Matches an inventory item to its counterpart in another location's item list,
// by herb_id first, then by display name via matchHerbName.
export function findMatchingInventoryItem(
  target: InventoryItem,
  candidates: InventoryItem[]
): InventoryItem | undefined {
  const byId = candidates.find(c => c.herb_id === target.herb_id);
  if (byId) return byId;

  if (!target.herbs) return undefined;
  const targetName = getDisplayName(target.herbs).toLowerCase().trim();
  if (!targetName) return undefined;

  const named = candidates.filter((c): c is InventoryItem & { herbs: NonNullable<InventoryItem['herbs']> } => !!c.herbs);
  const byName = new Map(named.map(c => [getDisplayName(c.herbs).toLowerCase().trim(), c]));
  const matchedKey = matchHerbName(targetName, named.map(c => getDisplayName(c.herbs).toLowerCase().trim()));
  return matchedKey ? byName.get(matchedKey) : undefined;
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
