import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ChevronDown, ChevronUp, ExternalLink, Package, Plus, ShoppingCart, Trash2, X, CheckCheck, Undo2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { useInventory, useUpdateLowThreshold, useMarkAsOrdered, useUnmarkOrdered } from '@/hooks/useInventory';
import {
  useSuppliers,
  useAddSupplier,
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

// ─── Threshold Filter Toggle ──────────────────────────────────────────────────

type ThresholdKey = 'out' | '0.25' | '0.5';

const THRESHOLD_OPTIONS: { key: ThresholdKey; label: string; description: string }[] = [
  { key: 'out', label: 'Out', description: 'Status = out (quantity ≤ 0)' },
  { key: '0.25', label: '≤ 0.25 lb', description: 'Low stock at or under a quarter pound' },
  { key: '0.5', label: '≤ 0.5 lb', description: 'Low stock at or under half a pound' },
];

// ─── Reorder Qty Cell ─────────────────────────────────────────────────────────

function ReorderQtyCell({ value, onChange }: { value: number; onChange: (v: number) => void }) {
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

// ─── Threshold (Reorder Trigger) Cell ────────────────────────────────────────

function ThresholdCell({ value, onChange }: { value: number; onChange: (v: number) => void }) {
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
      className="text-sm font-medium underline decoration-dashed underline-offset-2 hover:text-amber-600"
      onClick={() => { setLocal(String(value)); setEditing(true); }}
      title="Click to edit reorder trigger"
    >
      {value} lb
    </button>
  );
}

// ─── Add Price Row ────────────────────────────────────────────────────────────

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

    const pkg_size = packageSizeG ? parseInt(packageSizeG) : null;
    const pkg_price = packagePrice ? parseFloat(packagePrice) : null;

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

  // Threshold filter — which quantity buckets to include in the order list
  const [activeFilters, setActiveFilters] = useState<Set<ThresholdKey>>(new Set(['out']));

  // Manual overrides — session-only, reset on filter change
  const [manualAdds, setManualAdds] = useState<Set<string>>(new Set());
  const [manualRemoveIds, setManualRemoveIds] = useState<Set<string>>(new Set());
  const [addHerbValue, setAddHerbValue] = useState('');

  // Data
  const { data: inventory = [] } = useInventory('bulk');
  const { data: backstockInventory = [] } = useInventory('bulk_backstock');
  const { data: suppliers = [] } = useSuppliers();
  const { data: pricing = [] } = useHerbPricing();
  const { data: reorderQtys = [] } = useReorderQtys();
  const upsertReorderQty = useUpsertReorderQty();
  const updateLowThreshold = useUpdateLowThreshold();
  const markAsOrdered = useMarkAsOrdered();
  const unmarkOrdered = useUnmarkOrdered();

  // Bulk herbs currently marked as ordered
  const orderedHerbs = useMemo(() =>
    inventory.filter(i => i.status === 'ordered')
  , [inventory]);

  // Supplier management state
  const [newSupplierName, setNewSupplierName] = useState('');
  const [newSupplierUrl, setNewSupplierUrl] = useState('');
  const addSupplier = useAddSupplier();
  const deleteSupplier = useDeleteSupplier();

  // herb_ids that have backstock quantity > 0 (no need to order these)
  const herbIdsWithBackstock = useMemo(() =>
    new Set(backstockInventory.filter(i => Number(i.quantity) > 0).map(i => i.herb_id))
  , [backstockInventory]);

  // ── Compute the order list ────────────────────────────────────────────────
  const orderItems = useMemo(() => {
    const included = new Map<string, (typeof inventory)[0] & { _manuallyAdded?: boolean }>();

    for (const item of inventory) {
      if (manualRemoveIds.has(item.id)) continue;
      // Skip herbs that have backstock available
      if (herbIdsWithBackstock.has(item.herb_id)) continue;

      const qty = Number(item.quantity);
      const matchesOut = activeFilters.has('out') && item.status === 'out';
      const matches025 = activeFilters.has('0.25') && qty > 0 && qty <= 0.25;
      const matches05 = activeFilters.has('0.5') && qty > 0 && qty <= 0.5;

      if (matchesOut || matches025 || matches05) {
        included.set(item.id, item);
      }
    }

    // Manually added herbs bypass the backstock filter
    for (const herbName of manualAdds) {
      const item = inventory.find(i => (i.herbs?.name ?? '') === herbName);
      if (item && !manualRemoveIds.has(item.id) && !included.has(item.id)) {
        included.set(item.id, { ...item, _manuallyAdded: true });
      }
    }

    return Array.from(included.values());
  }, [inventory, activeFilters, manualAdds, manualRemoveIds, herbIdsWithBackstock]);

  // Herbs available to add manually (bulk inventory herbs not already in the order list)
  const orderItemIds = useMemo(() => new Set(orderItems.map(i => i.id)), [orderItems]);
  const availableToAdd = useMemo(() =>
    inventory
      .filter(i => !orderItemIds.has(i.id))
      .map(i => i.herbs?.name ?? '')
      .filter(Boolean)
      .sort()
  , [inventory, orderItemIds]);

  // Pricing lookup — keyed on lowercased herb_name for case-insensitive matching
  const pricingByHerb = useMemo(() => {
    const map = new Map<string, Map<string, HerbPricing>>();
    for (const p of pricing) {
      const key = p.herb_name.toLowerCase().trim();
      if (!map.has(key)) map.set(key, new Map());
      map.get(key)!.set(p.supplier_id, p);
    }
    return map;
  }, [pricing]);

  const reorderMap = useMemo(() => new Map(reorderQtys.map(r => [r.herb_name, r.quantity_lb])), [reorderQtys]);

  const toggleFilter = (key: ThresholdKey) => {
    setActiveFilters(prev => {
      const next = new Set(prev);
      if (next.has(key)) {
        if (next.size === 1) return prev; // Keep at least one active
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
    // Reset manual overrides when filter changes
    setManualAdds(new Set());
    setManualRemoveIds(new Set());
    setAddHerbValue('');
  };

  const handleManualAdd = (herbName: string) => {
    if (!herbName) return;
    setManualAdds(prev => new Set([...prev, herbName]));
    setAddHerbValue('');
  };

  const handleRemove = (itemId: string) => {
    setManualRemoveIds(prev => new Set([...prev, itemId]));
  };

  const handleCalculate = () => {
    const outNames = orderItems.map(i => i.herbs?.name ?? '').filter(Boolean);
    const result = computeOrderSuggestion(outNames, pricing, reorderQtys, suppliers);
    setSuggestion(result);
    if (result.orders.length === 0 && result.uncoveredHerbs.length > 0) {
      toast.warning('No pricing data found. Add prices in Manage Pricing below.');
    }
  };

  const handleMarkAllOrdered = async () => {
    const ids = orderItems.map(i => i.id);
    if (ids.length === 0) return;
    try {
      await markAsOrdered.mutateAsync(ids);
      toast.success(`Marked ${ids.length} herb${ids.length !== 1 ? 's' : ''} as ordered`);
      setManualAdds(new Set());
      setManualRemoveIds(new Set());
      setSuggestion(null);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Failed to mark as ordered');
    }
  };

  const handleUnmarkOne = async (item: (typeof inventory)[0]) => {
    try {
      await unmarkOrdered.mutateAsync([{
        id: item.id,
        quantity: Number(item.quantity),
        low_threshold_lb: Number(item.herbs?.low_threshold_lb ?? 0.25),
      }]);
      toast.success(`Unmarked ${item.herbs?.name ?? 'herb'} as ordered`);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Failed to undo');
    }
  };

  const handleUnmarkAll = async () => {
    try {
      await unmarkOrdered.mutateAsync(orderedHerbs.map(i => ({
        id: i.id,
        quantity: Number(i.quantity),
        low_threshold_lb: Number(i.herbs?.low_threshold_lb ?? 0.25),
      })));
      toast.success(`Unmarked ${orderedHerbs.length} herb${orderedHerbs.length !== 1 ? 's' : ''}`);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Failed to undo');
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
            <div className="flex flex-wrap items-center justify-between gap-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Package className="h-4 w-4" />
                Herbs to Order
                {orderItems.length > 0 && (
                  <Badge variant="destructive" className="ml-1">{orderItems.length}</Badge>
                )}
              </CardTitle>

              {/* Threshold filter toggles */}
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-xs text-muted-foreground mr-1">Include:</span>
                {THRESHOLD_OPTIONS.map(opt => (
                  <button
                    key={opt.key}
                    onClick={() => toggleFilter(opt.key)}
                    title={opt.description}
                    className={`px-2.5 py-1 rounded-full text-xs font-medium border transition-colors ${
                      activeFilters.has(opt.key)
                        ? 'bg-primary text-primary-foreground border-primary'
                        : 'bg-background text-muted-foreground border-border hover:border-primary/50'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </CardHeader>

          <CardContent>
            {/* Manual add */}
            <div className="flex items-center gap-2 mb-4 flex-wrap">
              <span className="text-xs text-muted-foreground whitespace-nowrap">Add to list:</span>
              <Select value={addHerbValue} onValueChange={handleManualAdd}>
                <SelectTrigger className="h-8 w-52 text-sm">
                  <SelectValue placeholder="Select a herb…" />
                </SelectTrigger>
                <SelectContent className="max-h-64">
                  {availableToAdd.map(h => (
                    <SelectItem key={h} value={h}>{h}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <span className="text-xs text-muted-foreground">(session only — no inventory change)</span>
            </div>

            {orderItems.length === 0 ? (
              <p className="text-muted-foreground text-sm py-4 text-center">
                No herbs match the current filter — nothing to order!
              </p>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left text-muted-foreground border-b">
                        <th className="px-3 pb-2 font-medium">Herb</th>
                        <th className="px-3 pb-2 font-medium">On hand</th>
                        <th className="px-3 pb-2 font-medium">
                          Reorder trigger
                          <span className="block text-xs font-normal opacity-70">low_threshold_lb</span>
                        </th>
                        <th className="px-3 pb-2 font-medium">Reorder qty</th>
                        {suppliers.map(s => (
                          <th key={s.id} className="px-3 pb-2 font-medium text-right">{s.name} ($/lb)</th>
                        ))}
                        <th className="px-3 pb-2 font-medium text-right">Best price</th>
                        <th className="px-3 pb-2 w-8"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {orderItems.map(item => {
                        const herbName = item.herbs?.name ?? '';
                        const qty = Number(item.quantity);
                        const threshold = item.herbs?.low_threshold_lb ?? 0.25;
                        const qtyLb = reorderMap.get(herbName) ?? 1;
                        const herbPricing = pricingByHerb.get(herbName.toLowerCase().trim());
                        const prices = herbPricing ? Array.from(herbPricing.values()) : [];
                        const minPrice = prices.length > 0 ? Math.min(...prices.map(p => p.price_per_lb)) : null;

                        return (
                          <tr key={item.id} className="border-b last:border-0 hover:bg-muted/20">
                            <td className="px-3 py-2 font-medium">
                              <span className="flex items-center gap-1.5">
                                {herbName}
                                {item._manuallyAdded && (
                                  <Badge variant="outline" className="text-xs py-0 px-1.5 text-blue-600 border-blue-300">added</Badge>
                                )}
                              </span>
                            </td>
                            <td className="px-3 py-2 text-muted-foreground">
                              {item.status === 'out' ? (
                                <Badge variant="destructive" className="text-xs">OUT</Badge>
                              ) : (
                                `${qty} lb`
                              )}
                            </td>
                            <td className="px-3 py-2">
                              {item.herbs ? (
                                <ThresholdCell
                                  value={threshold}
                                  onChange={async (v) => {
                                    await updateLowThreshold.mutateAsync({ herbId: item.herb_id, low_threshold_lb: v });
                                    toast.success(`Reorder trigger updated for ${herbName}`);
                                  }}
                                />
                              ) : '—'}
                            </td>
                            <td className="px-3 py-2">
                              <ReorderQtyCell
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
                            <td className="px-3 py-2">
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-6 w-6 text-muted-foreground hover:text-destructive"
                                title="Remove from order list (session only)"
                                onClick={() => handleRemove(item.id)}
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                <div className="mt-4 flex flex-wrap items-center gap-3">
                  <Button onClick={handleCalculate} className="gap-2">
                    <ShoppingCart className="h-4 w-4" />
                    Calculate Optimal Order
                  </Button>
                  <Button
                    onClick={handleMarkAllOrdered}
                    variant="outline"
                    className="gap-2 border-blue-300 text-blue-700 hover:bg-blue-50"
                    disabled={markAsOrdered.isPending}
                  >
                    <CheckCheck className="h-4 w-4" />
                    Mark All as Ordered
                  </Button>
                  <span className="text-xs text-muted-foreground">
                    Click values to edit. Removes are session-only.
                  </span>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Section 1.5: Ordered herbs (undo panel) */}
        {orderedHerbs.length > 0 && (
          <Card className="border-blue-200 bg-blue-50/50 dark:bg-blue-950/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center justify-between">
                <span className="flex items-center gap-2 text-blue-700 dark:text-blue-400">
                  <CheckCheck className="h-4 w-4" />
                  Ordered ({orderedHerbs.length})
                </span>
                <Button
                  size="sm"
                  variant="outline"
                  className="h-7 gap-1.5 border-blue-300 text-blue-700 hover:bg-blue-100"
                  onClick={handleUnmarkAll}
                  disabled={unmarkOrdered.isPending}
                >
                  <Undo2 className="h-3.5 w-3.5" />
                  Undo All
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {orderedHerbs.map(item => (
                  <div key={item.id} className="flex items-center gap-1 bg-blue-100 dark:bg-blue-900/40 border border-blue-200 rounded-full pl-3 pr-1 py-1">
                    <span className="text-sm font-medium text-blue-800 dark:text-blue-300">
                      {item.herbs?.name ?? '—'}
                    </span>
                    <span className="text-xs text-blue-500 ml-1">{Number(item.quantity)} lb</span>
                    <button
                      className="ml-1 rounded-full p-0.5 hover:bg-blue-200 dark:hover:bg-blue-800 text-blue-500 hover:text-blue-700"
                      title="Undo ordered"
                      onClick={() => handleUnmarkOne(item)}
                    >
                      <Undo2 className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

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
                  <p className="text-sm text-amber-800">No pricing data found for any listed herbs. Add prices in Manage Pricing below.</p>
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
