import { useState, useMemo } from 'react';
import { ChevronDown, ChevronUp, Package, Trash2, CheckCircle2, Pin, Sparkles, Plus, ShoppingCart } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useInventory, useHerbs, getDisplayName, InventoryItem } from '@/hooks/useInventory';
import { findHerbNameMatch } from '@/hooks/useInventoryCheck';
import {
  usePremadeTinctures,
  useAddPremadeTincture,
  useUpdatePremadeTincture,
  useDeletePremadeTincture,
  useTincturePriceTiers,
  useTincturePriceHerbs,
  lookupTincturePrice,
  BottleSizeMl,
} from '@/hooks/usePremadeTinctures';
import { toast } from 'sonner';

const SIZES: BottleSizeMl[] = [100, 250, 500, 1000];
const MINIMUM_STORAGE_KEY = 'premadeOrderMinimum';

function fmt(n: number) {
  return `$${n.toFixed(2)}`;
}

type ManagedHerb = {
  key: string;
  herbName: string;
  clinicStatus: string | null;
  isPinned: boolean;
  premadeId?: string;
  defaultSize: BottleSizeMl;
};

function StatusBadge({ status }: { status: string | null }) {
  if (!status) return null;
  const map: Record<string, { label: string; cls: string }> = {
    out:     { label: 'Out',     cls: 'bg-red-500/20 text-red-700 dark:text-red-400' },
    low:     { label: 'Low',     cls: 'bg-yellow-500/20 text-yellow-700 dark:text-yellow-400' },
    full:    { label: 'Full',    cls: 'bg-green-500/20 text-green-700 dark:text-green-400' },
    ordered: { label: 'Ordered', cls: 'bg-blue-500/20 text-blue-700 dark:text-blue-400' },
  };
  const s = map[status];
  if (!s) return null;
  return (
    <span className={`rounded-full px-2 py-0.5 text-xs font-medium whitespace-nowrap shrink-0 ${s.cls}`}>
      {s.label}
    </span>
  );
}

export function PremadeOrderList() {
  const { data: clinicInventory = [] } = useInventory('clinic');
  const { data: bulkInventory = [] } = useInventory('bulk');
  const { data: bulkBackstockInventory = [] } = useInventory('bulk_backstock');
  const { data: bulkClinicInventory = [] } = useInventory('bulk_clinic');
  const { data: herbs = [] } = useHerbs();
  const { data: premadeTinctures = [] } = usePremadeTinctures();
  const { data: priceTiers = [] } = useTincturePriceTiers();
  const { data: priceHerbs = [] } = useTincturePriceHerbs();
  const addPremade = useAddPremadeTincture();
  const updatePremade = useUpdatePremadeTincture();
  const deletePremade = useDeletePremadeTincture();

  const [sizeOverrides, setSizeOverrides] = useState<Record<string, BottleSizeMl>>({});
  const [orderedKeys, setOrderedKeys] = useState<Set<string>>(new Set());
  const [showReference, setShowReference] = useState(false);
  const [addHerbValue, setAddHerbValue] = useState('');
  const [minimum, setMinimum] = useState<number>(() => {
    const stored = localStorage.getItem(MINIMUM_STORAGE_KEY);
    return stored ? parseFloat(stored) : 300;
  });

  const updateMinimum = (value: number) => {
    setMinimum(value);
    localStorage.setItem(MINIMUM_STORAGE_KEY, String(value));
  };

  const toggleOrder = (key: string) => {
    setOrderedKeys(prev => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  // Herb IDs that have any bulk stock entry
  const bulkHerbIds = useMemo(() => {
    const ids = new Set<string>();
    for (const item of [...bulkInventory, ...bulkBackstockInventory, ...bulkClinicInventory]) {
      ids.add(item.herb_id);
    }
    return ids;
  }, [bulkInventory, bulkBackstockInventory, bulkClinicInventory]);

  const pinnedHerbNames = useMemo(
    () => new Set(premadeTinctures.map(p => p.herb_name)),
    [premadeTinctures]
  );

  const clinicByDisplayName = useMemo(() => {
    return clinicInventory
      .filter((c): c is InventoryItem & { herbs: NonNullable<InventoryItem['herbs']> } => !!c.herbs)
      .map(c => ({ herb_name: getDisplayName(c.herbs), item: c }));
  }, [clinicInventory]);

  // Auto-detected: clinic herbs with no bulk stock anywhere, not already pinned
  const autoDetectedClinicItems = useMemo(() => {
    return clinicInventory
      .filter((item): item is InventoryItem & { herbs: NonNullable<InventoryItem['herbs']> } => !!item.herbs)
      .filter(item => !bulkHerbIds.has(item.herb_id))
      .filter(item => !pinnedHerbNames.has(getDisplayName(item.herbs)));
  }, [clinicInventory, bulkHerbIds, pinnedHerbNames]);

  // Unified list: pinned premade + auto-detected
  const allManagedHerbs = useMemo((): ManagedHerb[] => {
    const items: ManagedHerb[] = [];

    for (const p of premadeTinctures) {
      const clinicMatch = findHerbNameMatch(p.herb_name, clinicByDisplayName);
      items.push({
        key: p.id,
        herbName: p.herb_name,
        clinicStatus: clinicMatch?.item?.status ?? null,
        isPinned: true,
        premadeId: p.id,
        defaultSize: (p.default_size_ml as BottleSizeMl | null) ?? 500,
      });
    }

    for (const item of autoDetectedClinicItems) {
      items.push({
        key: item.herb_id,
        herbName: getDisplayName(item.herbs),
        clinicStatus: item.status,
        isPinned: false,
        defaultSize: 500,
      });
    }

    return items;
  }, [premadeTinctures, autoDetectedClinicItems, clinicByDisplayName]);

  // Herbs explicitly added to the order, with resolved size + price
  const orderedItems = useMemo(() => {
    return allManagedHerbs
      .filter(h => orderedKeys.has(h.key))
      .map(h => {
        const size = sizeOverrides[h.key] ?? h.defaultSize;
        const price = lookupTincturePrice(h.herbName, priceHerbs, priceTiers, size);
        return { ...h, size, price };
      });
  }, [allManagedHerbs, orderedKeys, sizeOverrides, priceHerbs, priceTiers]);

  const total = orderedItems.reduce((sum, r) => sum + (r.price ?? 0), 0);
  const readyToOrder = total >= minimum;

  const handleSizeChange = async (herb: ManagedHerb, sizeMl: BottleSizeMl) => {
    setSizeOverrides(prev => ({ ...prev, [herb.key]: sizeMl }));
    if (herb.isPinned && herb.premadeId) {
      await updatePremade.mutateAsync({ id: herb.premadeId, default_size_ml: sizeMl });
    }
  };

  const handleAdd = async (herbName: string) => {
    if (!herbName) return;
    try {
      await addPremade.mutateAsync({ herb_name: herbName });
      toast.success(`Added ${herbName} to premade list`);
      setAddHerbValue('');
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Failed to add herb');
    }
  };

  const handlePin = async (herbName: string) => {
    try {
      await addPremade.mutateAsync({ herb_name: herbName });
      toast.success(`Pinned ${herbName} as always-premade`);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Failed to pin herb');
    }
  };

  const handleDelete = async (id: string, herbName: string) => {
    try {
      await deletePremade.mutateAsync(id);
      setOrderedKeys(prev => { const next = new Set(prev); next.delete(id); return next; });
      toast.success(`Removed ${herbName} from premade list`);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Failed to remove herb');
    }
  };

  // Dropdown: inventory + price list herbs, deduped, excluding already pinned
  const availableHerbs = useMemo(() => {
    const pinnedNorm = new Set(premadeTinctures.map(p => p.herb_name.toLowerCase().replace(/['.]/g, '').trim()));
    const seen = new Set<string>();
    const names: string[] = [];
    const add = (name: string) => {
      const key = name.toLowerCase().replace(/['.]/g, '').trim();
      if (pinnedNorm.has(key) || seen.has(key)) return;
      seen.add(key);
      names.push(name);
    };
    for (const h of herbs) add(getDisplayName(h));
    for (const ph of priceHerbs) add(ph.herb_name);
    return names.sort();
  }, [herbs, priceHerbs, premadeTinctures]);

  return (
    <Card className="mt-4">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div>
            <CardTitle className="text-base flex items-center gap-2">
              <Package className="h-4 w-4 text-purple-600" />
              Premade Order List
            </CardTitle>
            <p className="text-xs text-muted-foreground mt-0.5">Herbs ordered premade, not made in-house</p>
          </div>
          <Select value={addHerbValue} onValueChange={handleAdd}>
            <SelectTrigger className="h-8 w-48 text-sm">
              <SelectValue placeholder="Add herb to list…" />
            </SelectTrigger>
            <SelectContent className="max-h-64">
              {availableHerbs.map(name => <SelectItem key={name} value={name}>{name}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>

      <CardContent>
        <div className="flex flex-col lg:flex-row gap-4">

          {/* Left: unified premade herb list */}
          <div className="flex-1 min-w-0 space-y-1.5">
            {allManagedHerbs.length === 0 ? (
              <p className="text-sm text-muted-foreground italic">No premade herbs yet. Add one above.</p>
            ) : (
              allManagedHerbs.map(herb => {
                const size = sizeOverrides[herb.key] ?? herb.defaultSize;
                const price = lookupTincturePrice(herb.herbName, priceHerbs, priceTiers, size);
                const inOrder = orderedKeys.has(herb.key);

                return (
                  <div
                    key={herb.key}
                    className={`flex items-center gap-2 rounded-lg border p-2 ${!herb.isPinned ? 'border-dashed' : ''}`}
                  >
                    {/* Icon */}
                    {herb.isPinned
                      ? <Pin className="h-3 w-3 text-purple-500 shrink-0" />
                      : <Sparkles className="h-3 w-3 text-purple-400 shrink-0" title="Auto-detected: no bulk stock" />
                    }

                    {/* Name */}
                    <span className="flex-1 text-sm font-medium truncate min-w-0">{herb.herbName}</span>

                    {/* Clinic status */}
                    <StatusBadge status={herb.clinicStatus} />

                    {/* Size selector */}
                    <Select
                      value={String(size)}
                      onValueChange={(v) => handleSizeChange(herb, parseInt(v) as BottleSizeMl)}
                    >
                      <SelectTrigger className="h-7 w-20 text-xs shrink-0">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {SIZES.map(s => <SelectItem key={s} value={String(s)}>{s}ml</SelectItem>)}
                      </SelectContent>
                    </Select>

                    {/* Price */}
                    <span className="w-14 text-right text-sm font-semibold text-primary shrink-0">
                      {price !== null ? fmt(price) : <span className="text-xs text-muted-foreground">—</span>}
                    </span>

                    {/* Add to order toggle */}
                    <Button
                      size="sm"
                      variant={inOrder ? 'default' : 'outline'}
                      className={`h-7 px-2 text-xs shrink-0 gap-1 ${inOrder ? 'bg-green-600 hover:bg-green-700 border-green-600 text-white' : ''}`}
                      onClick={() => toggleOrder(herb.key)}
                    >
                      {inOrder
                        ? <><CheckCircle2 className="h-3 w-3" /> Added</>
                        : <><Plus className="h-3 w-3" /> Order</>
                      }
                    </Button>

                    {/* Pin (auto) or delete (pinned) */}
                    {herb.isPinned ? (
                      <Button
                        size="icon" variant="ghost"
                        className="h-7 w-7 text-destructive/70 hover:text-destructive shrink-0"
                        onClick={() => handleDelete(herb.premadeId!, herb.herbName)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    ) : (
                      <Button
                        size="icon" variant="ghost"
                        className="h-7 w-7 text-purple-500 hover:text-purple-700 hover:bg-purple-50 dark:hover:bg-purple-950 shrink-0"
                        title="Pin as always-premade"
                        onClick={() => handlePin(herb.herbName)}
                      >
                        <Pin className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                );
              })
            )}
          </div>

          {/* Right: order summary */}
          <div className="lg:w-52 shrink-0 rounded-lg border bg-muted/30 p-3 flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-semibold">Order</span>
            </div>

            <div className="flex-1 min-h-[2rem]">
              {orderedItems.length === 0 ? (
                <p className="text-xs text-muted-foreground italic">No herbs added yet</p>
              ) : (
                <div className="space-y-1.5">
                  {orderedItems.map(item => (
                    <div key={item.key} className="flex items-center justify-between gap-2">
                      <span className="text-xs truncate min-w-0">{item.herbName}</span>
                      <span className="text-xs font-medium shrink-0 text-primary">
                        {item.price !== null ? fmt(item.price) : '—'}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="border-t pt-2 space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground whitespace-nowrap">Min:</span>
                <Input
                  type="number"
                  step="1"
                  value={minimum}
                  onChange={(e) => updateMinimum(parseFloat(e.target.value) || 0)}
                  className="h-7 w-full text-xs"
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Subtotal</span>
                <span className="text-sm font-bold">{fmt(total)}</span>
              </div>
              {orderedItems.length > 0 && (
                readyToOrder ? (
                  <span className="flex items-center gap-1 text-xs font-medium text-green-600 dark:text-green-400">
                    <CheckCircle2 className="h-3 w-3" />
                    Ready to order
                  </span>
                ) : (
                  <span className="text-xs text-muted-foreground">{fmt(minimum - total)} to minimum</span>
                )
              )}
            </div>
          </div>
        </div>

        {/* Price reference */}
        <div className="mt-4 border-t pt-3">
          <button
            className="flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground"
            onClick={() => setShowReference(v => !v)}
          >
            Price reference
            {showReference ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
          </button>
          {showReference && (
            <div className="mt-3 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-muted-foreground border-b">
                    <th className="px-2 pb-1 font-medium">Herb</th>
                    <th className="px-2 pb-1 font-medium">Tier</th>
                    <th className="px-2 pb-1 font-medium text-right">100ml</th>
                    <th className="px-2 pb-1 font-medium text-right">250ml</th>
                    <th className="px-2 pb-1 font-medium text-right">500ml</th>
                    <th className="px-2 pb-1 font-medium text-right">1000ml</th>
                  </tr>
                </thead>
                <tbody>
                  {priceHerbs.map(h => {
                    const tier = priceTiers.find(t => t.id === h.tier_id);
                    if (!tier) return null;
                    return (
                      <tr key={h.id} className="border-b last:border-0">
                        <td className="px-2 py-1">{h.herb_name}</td>
                        <td className="px-2 py-1 text-muted-foreground">{tier.tier_label}</td>
                        <td className="px-2 py-1 text-right">{fmt(tier.price_100ml)}</td>
                        <td className="px-2 py-1 text-right">{fmt(tier.price_250ml)}</td>
                        <td className="px-2 py-1 text-right">{fmt(tier.price_500ml)}</td>
                        <td className="px-2 py-1 text-right">{fmt(tier.price_1000ml)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
