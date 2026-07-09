// Shared lb-based quantity helpers for the Bulk / Bulk Backstock / Clinic Bulk
// locations, used by both the dedicated Bulk Herbs tab and the global Add
// Herb dialog so the two stay consistent.

// Standard lb increments available in the UI
export const LB_OPTIONS = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2, 2.5, 3, 4, 5];
// Default low-stock threshold when herb has no custom value
export const DEFAULT_LOW_THRESHOLD = 0.25; // lbs

export function formatLbs(qty: number): string {
  return String(qty);
}

export function calcBulkStatus(qty: number, lowThreshold: number): 'out' | 'low' | 'full' {
  if (qty <= 0) return 'out';
  if (qty <= lowThreshold) return 'low';
  return 'full';
}
