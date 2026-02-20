import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ChevronDown, ChevronUp, ExternalLink, Package, Plus, ShoppingCart, Trash2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { useInventory } from '@/hooks/useInventory';
import {
  useSuppliers,
  useAddSupplier,
  useUpdateSupplier,
  useDeleteSupplier,
  useHerbPricing,
  useAddHerbPrice,
  useUpdateHerbPrice,
  useDeleteHerbPrice,
  useReorderQtys,
  useUpsertReorderQty,
  computeOrderSuggestion,
  type HerbPricing,
  type OrderSuggestion,
} from '@/hooks/usePricing';
import { HERB_LIST } from '@/lib/herbCorrection';

// ─── Helper ───────────────────────────────────────────────────────────────────

function fmt(n: number) {
  return n.toLocaleString('en-CA', { style: 'currency', currency: 'CAD' });
}

// ─── Reorder Qty Cell ─────────────────────────────────────────────────────────

function ReorderQtyCell({ herbName, value, onChange }: { herbName: string; value: number; onChange: (v: number) => void }) {
  const [editing, setEditing] = useState(false);
  const [local, setLocal] = useState(String(value));

  const commit = () => {
    const n = parseFloat(local);
    if (!isNaN(n) && n > 0) onChange(n);
    else setLocal(String(value));
    setEditing(false);
  };

  if (editing) {
    return (
      <Input
        type="number"
        min="0.25"
        step="0.25"
        value={local}
        onChange={e => setLocal(e.target.value)}
        onBlur={commit}
        onKeyDown={e => { if (e.key === 'Enter') commit(); if (e.key === 'Escape') setEditing(false); }}
        className="w-20 h-7 text-sm"
        autoFocus
      />
    );
  }

  return (
    <button
      className="text-sm font-medium underline decoration-dashed underline-offset-2 hover:text-primary"
      onClick={() => { setLocal(String(value)); setEditing(true); }}
      title="Click to edit"
    >
      {value} lb
    </button>
  );
}

// ─── Add Price Dialog ─────────────────────────────────────────────────────────

function AddPriceRow({ supplierId, existingHerbs, onClose }: {
  supplierId: string;
  existingHerbs: Set<string>;
  onClose: () => void;
}) {
  const addPrice = useAddHerbPrice();
  const [herbName, setHerbName] = useState('');
  const [pricePerLb, setPricePerLb] = useState('');
  const [packageSizeG, setPackageSizeG] = useState('');
  const [packagePrice, setPackagePrice] = useState('');

  const available = HERB_LIST.filter(h => !existingHerbs.has(h)).sort();

  const handleSave = async () => {
    if (!herbName || !pricePerLb) { toast.error('Herb and price required'); return; }
    const price = parseFloat(pricePerLb);
    if (isNaN(price) || price <= 0) { toast.error('Invalid price'); return; }

    let pkg_size: number | null = null;
    let pkg_price: number | null = null;

    if (packageSizeG && packagePrice) {
      pkg_size = parseInt(packageSizeG);
      pkg_price = parseFloat(packagePrice);
      // Recompute price_per_lb from package data if both provided
    }

    try {
      await addPrice.mutateAsync({
        herb_name: herbName,
        supplier_id: supplierId,
        price_per_lb: price,
        package_size_g: pkg_size,
        package_price: pkg_price,
      });
      toast.success(`Price added for ${herbName}`);
      onClose();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Failed to add price');
    }
  };

  return (
    <tr className="bg-primary/5 border-t">
      <td className="px-3 py-2">
        <Select value={herbName} onValueChange={setHerbName}>
          <SelectTrigger className="h-8 w-44 text-sm">
            <SelectValue placeholder="Select herb…" />
          </SelectTrigger>
          <SelectContent className="max-h-64">
            {available.map(h => <SelectItem key={h} value={h}>{h}</SelectItem>)}
          </SelectContent>
        </Select>
      </td>
      <td className="px-3 py-2">
        <Input type="number" step="0.01" placeholder="$/lb" value={pricePerLb}
          onChange={e => setPricePerLb(e.target.value)} className="h-8 w-24 text-sm" />
      </td>
      <td className="px-3 py-2">
        <div className="flex gap-1 items-center">
          <Select value={packageSizeG} onValueChange={setPackageSizeG}>
            <SelectTrigger className="h-8 w-24 text-sm">
              <SelectValue placeholder="Pkg size" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">None (sold by lb)</SelectItem>
              <SelectItem value="250">250g</SelectItem>
              <SelectItem value="500">500g</SelectItem>
            </SelectContent>
          </Select>
          {packageSizeG && (
            <Input type="number" step="0.01" placeholder="Pkg $" value={packagePrice}
              onChange={e => setPackagePrice(e.target.value)} className="h-8 w-20 text-sm" />
          )}
        </div>
      </td>
      <td className="px-3 py-2 text-right">
        <div className="flex gap-1 justify-end">
          <Button size="sm" className="h-7" onClick={handleSave} disabled={addPrice.isPending}>Save</Button>
          <Button size="sm" variant="ghost" className="h-7" onClick={onClose}><X className="h-3 w-3" /></Button>
        </div>
      </td>
    </tr>
  );
}

// ─── Supplier Pricing Table ───────────────────────────────────────────────────

function SupplierPricingTable({ supplierId, pricing }: { supplierId: string; pricing: HerbPricing[] }) {
  const [addingRow, setAddingRow] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editPrice, setEditPrice] = useState('');
  const updatePrice = useUpdateHerbPrice();
  const deletePrice = useDeleteHerbPrice();

  const rows = pricing.filter(p => p.supplier_id === supplierId).sort((a, b) => a.herb_name.localeCompare(b.herb_name));
  const existingHerbs = new Set(rows.map(r => r.herb_name));

  const commitEdit = async (id: string) => {
    const n = parseFloat(editPrice);
    if (isNaN(n) || n <= 0) { toast.error('Invalid price'); return; }
    await updatePrice.mutateAsync({ id, price_per_lb: n });
    setEditingId(null);
  };

  return (
    <div className="mt-3">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-muted-foreground border-b">
            <th className="px-3 pb-1 font-medium">Herb</th>
            <th className="px-3 pb-1 font-medium">$/lb</th>
            <th className="px-3 pb-1 font-medium">Package</th>
            <th className="px-3 pb-1 font-medium text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(row => (
            <tr key={row.id} className="border-b last:border-0 hover:bg-muted/30">
              <td className="px-3 py-1.5 font-medium">{row.herb_name}</td>
              <td className="px-3 py-1.5">
                {editingId === row.id ? (
                  <Input
                    type="number" step="0.01" value={editPrice}
                    onChange={e => setEditPrice(e.target.value)}
                    onBlur={() => commitEdit(row.id)}
                    onKeyDown={e => { if (e.key === 'Enter') commitEdit(row.id); if (e.key === 'Escape') setEditingId(null); }}
                    className="h-7 w-20 text-sm" autoFocus
                  />
                ) : (
                  <button className="underline decoration-dashed underline-offset-2 hover:text-primary"
                    onClick={() => { setEditPrice(String(row.price_per_lb)); setEditingId(row.id); }}>
                    ${Number(row.price_per_lb).toFixed(2)}
                  </button>
                )}
              </td>
              <td className="px-3 py-1.5 text-muted-foreground">
                {row.package_size_g ? `${row.package_size_g}g @ ${fmt(Number(row.package_price ?? 0))}` : '—'}
              </td>
              <td className="px-3 py-1.5 text-right">
                <Button size="icon" variant="ghost" className="h-6 w-6 text-destructive/70 hover:text-destructive"
                  onClick={async () => { await deletePrice.mutateAsync(row.id); toast.success(`Removed ${row.herb_name}`); }}>
                  <Trash2 className="h-3 w-3" />
                </Button>
              </td>
            </tr>
          ))}
          {addingRow && (
            <AddPriceRow supplierId={supplierId} existingHerbs={existingHerbs} onClose={() => setAddingRow(false)} />
          )}
        </tbody>
      </table>
      {!addingRow && (
        <Button size="sm" variant="ghost" className="mt-2 h-7 text-xs" onClick={() => setAddingRow(true)}>
          <Plus className="h-3 w-3 mr-1" /> Add herb price
        </Button>
      )}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

const Ordering = () => {
  const [showManage, setShowManage] = useState(false);
  const [suggestion, setSuggestion] = useState<OrderSuggestion | null>(null);

  // Data
  const { data: inventory = [] } = useInventory('bulk');
  const { data: suppliers = [] } = useSuppliers();
  const { data: pricing = [] } = useHerbPricing();
  const { data: reorderQtys = [] } = useReorderQtys();
  const upsertReorderQty = useUpsertReorderQty();

  // Supplier management state
  const [newSupplierName, setNewSupplierName] = useState('');
  const [newSupplierUrl, setNewSupplierUrl] = useState('');
  const addSupplier = useAddSupplier();
  const deleteSupplier = useDeleteSupplier();

  // Out bulk herbs
  const outHerbs = inventory.filter(item => item.status === 'out');

  // Pricing lookup: herb_name → { supplierId → HerbPricing }
  const pricingByHerb = new Map<string, Map<string, HerbPricing>>();
  for (const p of pricing) {
    if (!pricingByHerb.has(p.herb_name)) pricingByHerb.set(p.herb_name, new Map());
    pricingByHerb.get(p.herb_name)!.set(p.supplier_id, p);
  }

  const reorderMap = new Map(reorderQtys.map(r => [r.herb_name, r.quantity_lb]));

  const handleCalculate = () => {
    const outNames = outHerbs.map(i => i.herbs?.name ?? '').filter(Boolean);
    const result = computeOrderSuggestion(outNames, pricing, reorderQtys, suppliers);
    setSuggestion(result);
    if (result.orders.length === 0 && result.uncoveredHerbs.length > 0) {
      toast.warning('No pricing data found for out herbs. Add prices in Manage Pricing below.');
    }
  };

  const handleAddSupplier = async () => {
    if (!newSupplierName.trim()) { toast.error('Supplier name required'); return; }
    try {
      await addSupplier.mutateAsync({ name: newSupplierName.trim(), url: newSupplierUrl.trim() || undefined });
      toast.success(`Added ${newSupplierName}`);
      setNewSupplierName('');
      setNewSupplierUrl('');
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Failed to add supplier');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-amber-50 dark:from-green-950/20 dark:to-amber-950/20">
      <main className="container mx-auto px-4 py-6 max-w-6xl space-y-6">

        {/* Header */}
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/"><ArrowLeft className="h-4 w-4 mr-1" />Back</Link>
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <ShoppingCart className="h-6 w-6 text-primary" />
              Herb Ordering
            </h1>
            <p className="text-sm text-muted-foreground">Compare supplier prices and build your order</p>
          </div>
        </div>

        {/* Section 1: Herbs to Order */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Package className="h-4 w-4" />
              Herbs to Order
              {outHerbs.length > 0 && (
                <Badge variant="destructive" className="ml-1">{outHerbs.length} out</Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {outHerbs.length === 0 ? (
              <p className="text-muted-foreground text-sm py-4 text-center">
                All bulk herbs are stocked — nothing to order!
              </p>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left text-muted-foreground border-b">
                        <th className="px-3 pb-2 font-medium">Herb</th>
                        <th className="px-3 pb-2 font-medium">Reorder Qty</th>
                        {suppliers.map(s => (
                          <th key={s.id} className="px-3 pb-2 font-medium text-right">{s.name} ($/lb)</th>
                        ))}
                        <th className="px-3 pb-2 font-medium text-right">Best Price</th>
                      </tr>
                    </thead>
                    <tbody>
                      {outHerbs.map(item => {
                        const herbName = item.herbs?.name ?? '';
                        const qtyLb = reorderMap.get(herbName) ?? 1;
                        const herbPricing = pricingByHerb.get(herbName);
                        const prices = herbPricing ? Array.from(herbPricing.values()) : [];
                        const minPrice = prices.length > 0 ? Math.min(...prices.map(p => p.price_per_lb)) : null;

                        return (
                          <tr key={item.id} className="border-b last:border-0 hover:bg-muted/20">
                            <td className="px-3 py-2 font-medium">{herbName}</td>
                            <td className="px-3 py-2">
                              <ReorderQtyCell
                                herbName={herbName}
                                value={qtyLb}
                                onChange={async (v) => {
                                  await upsertReorderQty.mutateAsync({ herb_name: herbName, quantity_lb: v });
                                }}
                              />
                            </td>
                            {suppliers.map(s => {
                              const p = herbPricing?.get(s.id);
                              const isMin = p && minPrice !== null && p.price_per_lb === minPrice;
                              return (
                                <td key={s.id} className={`px-3 py-2 text-right ${isMin ? 'text-green-600 font-semibold' : 'text-muted-foreground'}`}>
                                  {p ? `$${Number(p.price_per_lb).toFixed(2)}` : '—'}
                                </td>
                              );
                            })}
                            <td className="px-3 py-2 text-right">
                              {minPrice !== null ? (
                                <span className="text-green-600 font-semibold">${minPrice.toFixed(2)}</span>
                              ) : (
                                <span className="text-muted-foreground text-xs">no pricing</span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                <div className="mt-4 flex items-center gap-3">
                  <Button onClick={handleCalculate} className="gap-2">
                    <ShoppingCart className="h-4 w-4" />
                    Calculate Optimal Order
                  </Button>
                  <span className="text-xs text-muted-foreground">
                    Click herb quantities to edit. Changes save automatically.
                  </span>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Section 2: Order Suggestion */}
        {suggestion && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Order Suggestion</h2>
              <Button variant="ghost" size="sm" onClick={() => setSuggestion(null)}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            {suggestion.orders.length === 0 && suggestion.uncoveredHerbs.length > 0 && (
              <Card className="border-amber-200 bg-amber-50">
                <CardContent className="pt-4">
                  <p className="text-sm text-amber-800">No pricing data found for any out herbs. Add prices in Manage Pricing below.</p>
                </CardContent>
              </Card>
            )}

            {suggestion.orders.map(order => (
              <Card key={order.supplier.id}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Package className="h-4 w-4" />
                      {order.supplier.name}
                      {order.supplier.url && (
                        <a href={order.supplier.url} target="_blank" rel="noopener noreferrer"
                          className="text-muted-foreground hover:text-primary">
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      )}
                    </div>
                    <span className="text-base font-bold text-primary">{fmt(order.total)}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left text-muted-foreground border-b">
                        <th className="pb-1 font-medium">Herb</th>
                        <th className="pb-1 font-medium text-right">Qty</th>
                        <th className="pb-1 font-medium text-right">$/lb</th>
                        <th className="pb-1 font-medium text-right">Package</th>
                        <th className="pb-1 font-medium text-right">Subtotal</th>
                      </tr>
                    </thead>
                    <tbody>
                      {order.herbs.map(line => (
                        <tr key={line.herbName} className="border-b last:border-0">
                          <td className="py-1 font-medium">{line.herbName}</td>
                          <td className="py-1 text-right">{line.qtyLb} lb</td>
                          <td className="py-1 text-right">${line.pricePerLb.toFixed(2)}</td>
                          <td className="py-1 text-right text-muted-foreground">{line.packageInfo ?? '—'}</td>
                          <td className="py-1 text-right font-medium">{fmt(line.subtotal)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </CardContent>
              </Card>
            ))}

            {suggestion.uncoveredHerbs.length > 0 && (
              <Card className="border-amber-200 bg-amber-50/50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-amber-800">No supplier pricing found for:</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {suggestion.uncoveredHerbs.map(h => (
                      <Badge key={h} variant="outline" className="text-amber-700 border-amber-300">{h}</Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {suggestion.orders.length > 0 && (
              <div className="flex justify-end">
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Grand Total</p>
                  <p className="text-2xl font-bold text-primary">{fmt(suggestion.grandTotal)}</p>
                  <p className="text-xs text-muted-foreground">{suggestion.orders.length} supplier order{suggestion.orders.length > 1 ? 's' : ''}</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Section 3: Manage Pricing (collapsible) */}
        <Card>
          <CardHeader className="pb-3 cursor-pointer" onClick={() => setShowManage(v => !v)}>
            <CardTitle className="text-base flex items-center justify-between">
              <span>Manage Suppliers & Pricing</span>
              {showManage ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </CardTitle>
          </CardHeader>

          {showManage && (
            <CardContent className="space-y-6">
              {/* Add supplier */}
              <div>
                <Label className="text-sm font-medium">Add Supplier</Label>
                <div className="flex gap-2 mt-1">
                  <Input placeholder="Name (e.g. Pacific Botanicals)" value={newSupplierName}
                    onChange={e => setNewSupplierName(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') handleAddSupplier(); }}
                    className="max-w-56" />
                  <Input placeholder="URL (optional)" value={newSupplierUrl}
                    onChange={e => setNewSupplierUrl(e.target.value)}
                    className="max-w-56" />
                  <Button onClick={handleAddSupplier} disabled={addSupplier.isPending}>
                    <Plus className="h-4 w-4 mr-1" /> Add
                  </Button>
                </div>
              </div>

              {/* Per-supplier pricing tables */}
              {suppliers.length === 0 ? (
                <p className="text-sm text-muted-foreground">No suppliers yet. Add one above, or run the import scripts to load Pacific Botanicals and Clef des Champs pricing.</p>
              ) : (
                suppliers.map(supplier => (
                  <div key={supplier.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{supplier.name}</span>
                        {supplier.url && (
                          <a href={supplier.url} target="_blank" rel="noopener noreferrer"
                            className="text-xs text-muted-foreground hover:text-primary flex items-center gap-0.5">
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        )}
                        <Badge variant="outline" className="text-xs">
                          {pricing.filter(p => p.supplier_id === supplier.id).length} herbs
                        </Badge>
                      </div>
                      <Button
                        size="sm" variant="ghost"
                        className="text-destructive/70 hover:text-destructive h-7"
                        onClick={async () => {
                          if (!confirm(`Delete ${supplier.name} and all its pricing?`)) return;
                          await deleteSupplier.mutateAsync(supplier.id);
                          toast.success(`Deleted ${supplier.name}`);
                        }}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                    <SupplierPricingTable supplierId={supplier.id} pricing={pricing} />
                  </div>
                ))
              )}

              <div className="rounded-lg bg-muted/50 p-3 text-xs text-muted-foreground space-y-1">
                <p className="font-medium">Bulk import from your supplier spreadsheets:</p>
                <p>1. Run <code className="bg-background px-1 rounded">npx tsx scripts/import-pacific-botanicals.ts</code></p>
                <p>2. Run <code className="bg-background px-1 rounded">npx tsx scripts/import-clef.ts</code></p>
                <p>3. Review the generated SQL files in <code className="bg-background px-1 rounded">scripts/</code>, then run them in your Supabase SQL Editor.</p>
              </div>
            </CardContent>
          )}
        </Card>
      </main>
    </div>
  );
};

export default Ordering;
