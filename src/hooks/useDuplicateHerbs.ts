import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Herb } from '@/hooks/useInventory';

export interface DuplicateGroup {
  key: string;           // normalized name used to detect the group
  herbs: Herb[];         // 2+ herb records in this group
}

// Detect suspected duplicates from a list of herbs (run client-side)
// Matches on:
//   1. Exact lowercase-trimmed name
//   2. One herb's name is a prefix of another's (e.g. "lomatium" ↔ "lomatium dissectum")
export function detectDuplicates(herbs: Herb[]): DuplicateGroup[] {
  const groups = new Map<string, Herb[]>();

  // Pass 1: exact name duplicates
  for (const herb of herbs) {
    const key = herb.name.toLowerCase().trim();
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(herb);
  }

  // Pass 2: prefix matches (one name starts with another)
  // Build list of canonical keys from pass 1 (use the single-herb groups for prefix check)
  const keys = Array.from(groups.keys());
  const merged = new Set<string>(); // keys already absorbed into another group

  for (let i = 0; i < keys.length; i++) {
    if (merged.has(keys[i])) continue;
    for (let j = 0; j < keys.length; j++) {
      if (i === j || merged.has(keys[j])) continue;
      const a = keys[i];
      const b = keys[j];
      // One is a prefix of the other (e.g. "lomatium" ↔ "lomatium dissectum")
      if (b.startsWith(a + ' ') || a.startsWith(b + ' ')) {
        const survivor = a.length <= b.length ? a : b;
        const absorbed = a.length <= b.length ? b : a;
        // Merge absorbed herbs into survivor group
        const absorbedHerbs = groups.get(absorbed) ?? [];
        groups.get(survivor)!.push(...absorbedHerbs);
        merged.add(absorbed);
      }
    }
  }

  // Return only groups with 2+ herbs
  const result: DuplicateGroup[] = [];
  for (const [key, herbList] of groups.entries()) {
    if (!merged.has(key) && herbList.length >= 2) {
      result.push({ key, herbs: herbList });
    }
  }

  return result.sort((a, b) => a.key.localeCompare(b.key));
}

export interface MergeHerbsInput {
  survivorId: string;
  loserId: string;
  // Optional field updates to copy from loser → survivor before deleting loser
  survivorUpdates?: {
    common_name?: string | null;
    latin_name?: string | null;
    pinyin_name?: string | null;
    notes?: string | null;
  };
}

// Merge two herb records: re-point all inventory rows, optionally copy fields, delete loser
export function useMergeHerbs() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ survivorId, loserId, survivorUpdates }: MergeHerbsInput) => {
      // 1. Optionally update survivor with fields copied from loser
      if (survivorUpdates && Object.keys(survivorUpdates).length > 0) {
        const { error } = await supabase
          .from('herbs')
          .update(survivorUpdates)
          .eq('id', survivorId);
        if (error) throw error;
      }

      // 2. Find all inventory rows pointing at the loser
      const { data: loserInventory, error: fetchErr } = await supabase
        .from('inventory')
        .select('id, location')
        .eq('herb_id', loserId);
      if (fetchErr) throw fetchErr;

      if (loserInventory && loserInventory.length > 0) {
        // 3. For each loser inventory row, check if survivor already has a row for that location.
        //    If so, discard the loser row. If not, re-point it.
        const { data: survivorInventory, error: fetchErr2 } = await supabase
          .from('inventory')
          .select('id, location')
          .eq('herb_id', survivorId);
        if (fetchErr2) throw fetchErr2;

        const survivorLocations = new Set((survivorInventory ?? []).map(r => r.location));

        const toRepoint: string[] = [];
        const toDelete: string[] = [];

        for (const row of loserInventory) {
          if (survivorLocations.has(row.location)) {
            toDelete.push(row.id);
          } else {
            toRepoint.push(row.id);
          }
        }

        if (toRepoint.length > 0) {
          const { error } = await supabase
            .from('inventory')
            .update({ herb_id: survivorId })
            .in('id', toRepoint);
          if (error) throw error;
        }

        if (toDelete.length > 0) {
          const { error } = await supabase
            .from('inventory')
            .delete()
            .in('id', toDelete);
          if (error) throw error;
        }
      }

      // 4. Also re-point any tincture_batches rows from loser → survivor
      await supabase
        .from('tincture_batches')
        .update({ herb_id: survivorId })
        .eq('herb_id', loserId);

      // 5. Delete the loser herb
      const { error: deleteErr } = await supabase
        .from('herbs')
        .delete()
        .eq('id', loserId);
      if (deleteErr) throw deleteErr;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['herbs'] });
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
      queryClient.invalidateQueries({ queryKey: ['tincture_batches'] });
    },
  });
}
