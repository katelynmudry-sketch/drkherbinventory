import type { InventoryLocation } from '@/hooks/useInventory';

// Display names for inventory locations (key order = order shown in pickers)
export const LOCATION_LABELS: Record<InventoryLocation, string> = {
  clinic: 'Clinic',
  backstock: 'Backstock',
  tincture: 'Tincture',
  bulk: 'Bulk',
  bulk_backstock: 'Bulk Backstock',
  bulk_clinic: 'Clinic Bulk',
};

export const LOCATIONS = Object.keys(LOCATION_LABELS) as InventoryLocation[];

export const plural = (n: number, word: string) => `${n} ${word}${n === 1 ? '' : 's'}`;

export const errorCode = (e: unknown): string | undefined =>
  (e as { code?: string } | null)?.code;

export const errorMessage = (e: unknown): string | undefined =>
  (e as { message?: string } | null)?.message;
