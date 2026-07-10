import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';
import type { InventoryLocation, InventoryStatus } from '@/hooks/useInventory';

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
    }
  | {
      type: 'status_change';
      inventoryId: string;
      herbName: string;
      location: InventoryLocation;
      prevStatus: InventoryStatus;
      newStatus: InventoryStatus;
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
  clearAll: () => void;
}

const ActivityLogContext = createContext<ActivityLogContextValue | null>(null);

function loadEntries(): ActivityEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: ActivityEntry[] = JSON.parse(raw);
    const cutoff = Date.now() - EXPIRY_MS;
    return parsed.filter(e => e.timestamp > cutoff);
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

  const clearAll = useCallback(() => {
    setEntries([]);
  }, []);

  return (
    <ActivityLogContext.Provider value={{ entries, logActivity, removeEntry, clearAll }}>
      {children}
    </ActivityLogContext.Provider>
  );
}

export function useActivityLog() {
  const ctx = useContext(ActivityLogContext);
  if (!ctx) throw new Error('useActivityLog must be used within ActivityLogProvider');
  return ctx;
}
