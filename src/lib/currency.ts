// Supplier price lists quoted in USD get converted to CAD for display and ordering comparisons.
// Update USD_TO_CAD_RATE whenever you want to refresh the exchange rate (CAD per 1 USD).
export const USD_TO_CAD_RATE = 1.41;

// Suppliers whose price lists are published in USD (matched by name, case-insensitive).
const USD_SUPPLIER_PATTERNS = ['mountain rose', 'pacific botanicals'];

export function isUsdSupplier(name: string | null | undefined): boolean {
  if (!name) return false;
  const n = name.toLowerCase();
  return USD_SUPPLIER_PATTERNS.some(p => n.includes(p));
}

export function usdToCad(amount: number): number {
  return Math.round(amount * USD_TO_CAD_RATE * 100) / 100;
}
