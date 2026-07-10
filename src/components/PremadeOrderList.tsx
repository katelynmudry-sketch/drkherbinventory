import { useState, useMemo } from 'react';
import { ChevronDown, ChevronUp, Package, Trash2, CheckCircle2 } from 'lucide-react';
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
  PremadeTincture,
} from '@/hooks/usePremadeTinctures';
import { toast } from 'sonner';

const SIZES: BottleSizeMl[] = [100, 250, 500, 1000];
const MINIMUM_STORAGE_KEY = 'premadeOrderMinimum';

function fmt(n: number) {
  return `$${n.toFixed(2)}`;
}

export function PremadeOrderList() {
  const { data: clinicInventory = [] } = useInventory('clinic');
  const { data: herbs = [] } = useHerbs();
  const { data: premadeTinctures = [] } = usePremadeTinctures();
  const { data: priceTiers = [] } = useTincturePriceTiers();
  const { data: priceHerbs = [] } = useTincturePriceHerbs();
  const addPremade = useAddPremadeTincture();
  const updatePremade = useUpdatePremadeTincture();
  const deletePremade = useDeletePremadeTincture();

  const [sizeOverrides, setSizeOverrides] = useState<Record<string, BottleSizeMl>>({});
  const [showManage, setShowManage] = useState(false);
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

  // Clinic items keyed by their display name for fuzzy herb-name lookups
  const clinicByDisplayName = useMemo(() => {
    return clinicInventory
      .filter((c): c is InventoryItem & { herbs: NonNullable<InventoryItem['herbs']> } => !!c.herbs)
      .map(c => ({ herb_name: getDisplayName(c.herbs), item: c }));
  }, [clinicInventory]);

  // Premade herbs whose clinic status is low/out
  const needsOrder = useMemo(() => {
    return premadeTinctures
      .map(p => ({ premade: p, clinicItem: findHerbNameMatch(p.herb_name, clinicByDisplayName)?.item ?? null }))
      .filter((row): row is { premade: PremadeTincture; clinicItem: InventoryItem } =>
        !!row.clinicItem && (row.clinicItem.status === 'low' || row.clinicItem.status === 'out')
      );
  }, [premadeTinctures, clinicByDisplayName]);

  const rows = needsOrder.map(({ premade, clinicItem }) => {
    const size = sizeOverrides[premade.id] ?? (premade.default_size_ml as BottleSizeMl | null) ?? 500;
    const price = lookupTincturePrice(premade.herb_name, priceHerbs, priceTiers, size);
    return { premade, clinicItem, size, price };
  });

  const total = rows.reduce((sum, r) => sum + (r.price ?? 0), 0);
  const readyToOrder = total >= minimum;

  const existingHerbNames = new Set(premadeTinctures.map(p => p.herb_name));
  const availableHerbs = herbs
    .map(h => getDisplayName(h))
    .filter(name => !existingHerbNames.has(name))
    .sort();

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

  return (
    <Card className="mt-4">
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Package className="h-4 w-4 text-purple-600" />
          Premade Order List
        </CardTitle>
        <p className="text-xs text-muted-foreground">Herbs ordered premade, not made in-house</p>
      </CardHeader>
      <CardContent>
        {rows.length === 0 ? (
          <p className="text-sm text-muted-foreground italic">No premade herbs currently low/out.</p>
        ) : (
          <div className="space-y-2">
            {rows.map(({ premade, clinicItem, size, price }) => (
              <div key={premade.id} className="flex items-center gap-2 rounded-lg border p-2">
                <span className="flex-1 text-sm font-medium truncate">{premade.herb_name}</span>
                <span className={`rounded-full px-2 py-0.5 text-xs font-medium whitespace-nowrap ${
                  clinicItem.status === 'out' ? 'bg-red-500/20 text-red-700 dark:text-red-400' : 'bg-yellow-500/20 text-yellow-700 dark:text-yellow-400'
                }`}>
                  {clinicItem.status === 'out' ? 'Out' : 'Low'}
                </span>
                <Select
                  value={String(size)}
                  onValueChange={async (v) => {
                    const sizeMl = parseInt(v) as BottleSizeMl;
                    setSizeOverrides(prev => ({ ...prev, [premade.id]: sizeMl }));
                    await updatePremade.mutateAsync({ id: premade.id, default_size_ml: sizeMl });
                  }}
                >
                  <SelectTrigger className="h-8 w-24 text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {SIZES.map(s => <SelectItem key={s} value={String(s)}>{s}ml</SelectItem>)}
                  </SelectContent>
                </Select>
                <span className="w-16 text-right text-sm font-semibold text-primary">
                  {price !== null ? fmt(price) : <span className="text-xs text-muted-foreground">no price</span>}
                </span>
              </div>
            ))}
          </div>
        )}

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t pt-3">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Order minimum:</span>
            <Input
              type="number"
              step="1"
              value={minimum}
              onChange={(e) => updateMinimum(parseFloat(e.target.value) || 0)}
              className="h-8 w-24 text-sm"
            />
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold">Total: {fmt(total)}</span>
            {readyToOrder ? (
              <span className="flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium whitespace-nowrap bg-green-500/20 text-green-700 dark:text-green-400">
                <CheckCircle2 className="h-3 w-3" />
                Ready to order
              </span>
            ) : (
              <span className="text-xs text-muted-foreground">{fmt(minimum - total)} more to reach minimum</span>
            )}
          </div>
        </div>

        <div className="mt-4 border-t pt-3">
          <button
            className="flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground"
            onClick={() => setShowManage(v => !v)}
          >
            Manage premade herbs
            {showManage ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
          </button>
          {showManage && (
            <div className="mt-3 space-y-2">
              <Select value={addHerbValue} onValueChange={handleAdd}>
                <SelectTrigger className="h-8 w-52 text-sm">
                  <SelectValue placeholder="Add a herb…" />
                </SelectTrigger>
                <SelectContent className="max-h-64">
                  {availableHerbs.map(name => <SelectItem key={name} value={name}>{name}</SelectItem>)}
                </SelectContent>
              </Select>
              {premadeTinctures.map(p => (
                <div key={p.id} className="flex items-center justify-between rounded border px-2 py-1.5">
                  <span className="text-sm">{p.herb_name}</span>
                  <Button
                    size="icon" variant="ghost" className="h-6 w-6 text-destructive/70 hover:text-destructive"
                    onClick={async () => {
                      await deletePremade.mutateAsync(p.id);
                      toast.success(`Removed ${p.herb_name} from premade list`);
                    }}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-3 border-t pt-3">
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
