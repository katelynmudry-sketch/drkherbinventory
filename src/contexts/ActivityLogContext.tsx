import { createContext, useContext, useEffect, useState, useCallback, useMemo, ReactNode } from 'react';
import type { InventoryLocation, InventoryStatus } from '@/hooks/useInventory';
import type { PressSnapshot } from '@/hooks/useTinctureBatches';

const STORAGE_KEY = 'herb-activity-log';
const MAX_ENTRIES = 100;
const EXPIRY_MS = 24 * 60 * 60 * 1000;

export type ActivityAction =
  | {
      type: 'add';
      inventoryId: string;
      herb_id: string;
      herbName: string;
      location: InventoryLocation;
      status: InventoryStatus;
    }
  | {
      type: 'remove';
      herb_id: string;
      herbName: string;
      location: InventoryLocation;
      status: InventoryStatus;
      notes: string | null;
      tincture_started_at: string | null;
      tincture_ready_at: string | null;
      current_batch_id: string | null;
      quantity?: number;
      // Set when the removal was a tincture "Pressed": lets Undo put the batch
      // back to macerating and undo the side effects of pressing.
      pressed?: PressSnapshot;
      // Id of the row that was removed, so Undo can re-point older log
      // entries at the re-created row (it gets a new id).
      inventoryId?: string;
    }
  | {
      type: 'status_change';
      inventoryId: string;
      herbName: string;
      location: InventoryLocation;
      prevStatus: InventoryStatus;
      newStatus: InventoryStatus;
      // Optional extra previous values restored by Undo
      prevQuantity?: number;
      prevNotes?: string | null; // backstock size
      prevTinctureStartedAt?: string | null;
      prevTinctureReadyAt?: string | null;
      // What kind of change this was; only used to label entries whose status didn't change
      change?: 'quantity' | 'size' | 'restart';
    };

export interface ActivityEntry {
  id: string;
  timestamp: number;
  action: ActivityAction;
}

interface ActivityLogContextValue {
  entries: ActivityEntry[];
  logActivity: (action: ActivityAction) => void;
  removeEntry: (id: string) => void;
  // Drop every entry about an inventory row that no longer exists
  removeEntriesForInventory: (inventoryId: string) => void;
  // A row was re-created under a new id: point its older entries at it
  repointInventoryId: (oldId: string, newId: string) => void;
  clearAll: () => void;
}

const ActivityLogContext = createContext<ActivityLogContextValue | null>(null);

const ACTION_TYPES = ['add', 'remove', 'status_change'];

// Stored data can be stale or hand-edited: drop anything that isn't a
// well-formed, unexpired entry rather than crash the log UI.
function isValidEntry(e: unknown): e is ActivityEntry {
  const entry = e as Partial<ActivityEntry> | null;
  return (
    !!entry &&
    typeof entry.id === 'string' &&
    typeof entry.timestamp === 'number' &&
    !!entry.action &&
    ACTION_TYPES.includes(entry.action.type) &&
    typeof entry.action.herbName === 'string' &&
    typeof entry.action.location === 'string'
  );
}

function loadEntries(): ActivityEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    const cutoff = Date.now() - EXPIRY_MS;
    return parsed.filter(isValidEntry).filter(e => e.timestamp > cutoff);
  } catch {
    return [];
  }
}

function saveEntries(entries: ActivityEntry[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  } catch {}
}

export function ActivityLogProvider({ children }: { children: ReactNode }) {
  const [entries, setEntries] = useState<ActivityEntry[]>(loadEntries);

  useEffect(() => {
    saveEntries(entries);
  }, [entries]);

  // Keep several open tabs in sync instead of each overwriting the others' log
  useEffect(() => {
    const onStorage = (ev: StorageEvent) => {
      if (ev.key === STORAGE_KEY) setEntries(loadEntries());
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const logActivity = useCallback((action: ActivityAction) => {
    const entry: ActivityEntry = {
      id: crypto.randomUUID(),
      timestamp: Date.now(),
      action,
    };
    setEntries(prev => [entry, ...prev].slice(0, MAX_ENTRIES));
  }, []);

  const removeEntry = useCallback((id: string) => {
    setEntries(prev => prev.filter(e => e.id !== id));
  }, []);

  const removeEntriesForInventory = useCallback((inventoryId: string) => {
    setEntries(prev => prev.filter(e => !('inventoryId' in e.action) || e.action.inventoryId !== inventoryId));
  }, []);

  const repointInventoryId = useCallback((oldId: string, newId: string) => {
    setEntries(prev => prev.map(e =>
      'inventoryId' in e.action && e.action.inventoryId === oldId
        ? { ...e, action: { ...e.action, inventoryId: newId } }
        : e
    ));
  }, []);

  const clearAll = useCallback(() => {
    setEntries([]);
  }, []);

  const value = useMemo(
    () => ({ entries, logActivity, removeEntry, removeEntriesForInventory, repointInventoryId, clearAll }),
    [entries, logActivity, removeEntry, removeEntriesForInventory, repointInventoryId, clearAll]
  );

  return (
    <ActivityLogContext.Provider value={value}>
      {children}
    </ActivityLogContext.Provider>
  );
}

export function useActivityLog() {
  const ctx = useContext(ActivityLogContext);
  if (!ctx) throw new Error('useActivityLog must be used within ActivityLogProvider');
  return ctx;
}
