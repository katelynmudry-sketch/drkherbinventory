import { isUsdSupplier, usdToCad } from '@/lib/currency';

// Per-supplier shipping rules, matched by supplier name (case-insensitive substring).
// All order calculations run in CAD. Edit the numbers here to update the estimates.

// Mountain Rose + Pacific Botanicals ship from the US: flat shipping (USD) plus Canadian customs (CAD).
export const US_SUPPLIER_SHIPPING_USD = 120;
export const US_SUPPLIER_CUSTOMS_CAD = 40; // midpoint of the $30–$50 charged last time

// Clef des Champs: free shipping at or above this order subtotal (CAD).
export const CLEF_FREE_SHIPPING_MIN_CAD = 300;
// Clef's fee when the order is below the free-shipping minimum. UNKNOWN: set to 0 until confirmed.
export const CLEF_SHIPPING_BELOW_MIN_CAD = 0;

export interface ShippingEstimate {
  /** Total shipping + customs for this supplier order, in CAD */
  cost: number;
  /** Short explanation shown in the UI, e.g. "US$120 shipping + CA$40 customs" */
  note: string;
}

export function estimateShipping(supplierName: string, orderSubtotalCad: number): ShippingEstimate {
  const name = supplierName.toLowerCase();

  if (isUsdSupplier(supplierName)) {
    return {
      cost: usdToCad(US_SUPPLIER_SHIPPING_USD) + US_SUPPLIER_CUSTOMS_CAD,
      note: `US$${US_SUPPLIER_SHIPPING_USD} shipping + CA$${US_SUPPLIER_CUSTOMS_CAD} customs (est.)`,
    };
  }

  if (name.includes('clef')) {
    if (orderSubtotalCad >= CLEF_FREE_SHIPPING_MIN_CAD) {
      return { cost: 0, note: `Free shipping (order over CA$${CLEF_FREE_SHIPPING_MIN_CAD})` };
    }
    return {
      cost: CLEF_SHIPPING_BELOW_MIN_CAD,
      note: `Free over CA$${CLEF_FREE_SHIPPING_MIN_CAD}; add CA$${(CLEF_FREE_SHIPPING_MIN_CAD - orderSubtotalCad).toFixed(2)} to ship free`,
    };
  }

  return { cost: 0, note: 'No shipping estimate set' };
}
