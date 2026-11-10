import { useMemo, useState } from 'react';
import { Check, ChevronDown, ChevronUp, Copy, Lightbulb, Save, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  assignAllTo,
  buildOptions,
  consolidationHints,
  formatOrderText,
  planFromAssignments,
  spreadForHerb,
  summarizeSuppliers,
  type Assignments,
  type HerbNeed,
  type PriceRow,
  type SupplierLike,
} from '@/lib/orderCompare';

const fmt = (n: number) => n.toLocaleString('en-CA', { style: 'currency', currency: 'CAD' });

interface SavedComparison {
  name: string;
  activeIds: string[];
  assignments: Assignments;
}

const STORAGE_KEY = 'ordering-saved-comparisons';

function loadSaved(): SavedComparison[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as SavedComparison[]) : [];
  } catch {
    return [];
  }
}

function persistSaved(list: SavedComparison[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch {
    toast.error('Could not save on this device');
  }
}

interface Props<S extends SupplierLike> {
  needs: HerbNeed[];
  pricing: PriceRow[];
  suppliers: S[];
}

export function SupplierCompare<S extends SupplierLike>({ needs, pricing, suppliers }: Props<S>) {
  // Only suppliers that have at least one price are worth comparing
  const pricedSupplierIds = useMemo(() => new Set(pricing.map(p => p.supplier_id)), [pricing]);
  const comparable = useMemo(() => suppliers.filter(s => pricedSupplierIds.has(s.id)), [suppliers, pricedSupplierIds]);

  // null = all comparable suppliers are on
  const [activeOverride, setActiveOverride] = useState<Set<string> | null>(null);
  const activeIds = activeOverride ?? new Set(comparable.map(s => s.id));
  const activeSuppliers = comparable.filter(s => activeIds.has(s.id));

  // null = follow the best single supplier automatically
  const [assignmentsOverride, setAssignmentsOverride] = useState<Assignments | null>(null);
  const [expandedMissing, setExpandedMissing] = useState<string | null>(null);
  const [saved, setSaved] = useState<SavedComparison[]>(loadSaved);
  const [saveName, setSaveName] = useState('');

  const options = useMemo(() => buildOptions(needs, pricing, activeIds), [needs, pricing, activeOverride, comparable]);
  const summaries = useMemo(() => summarizeSuppliers(needs, options, activeSuppliers), [needs, options, activeOverride, comparable]);
  const best = summaries.find(s => s.order) ?? null;

  const assignments: Assignments = assignmentsOverride ?? (best ? assignAllTo(needs, options, best.supplier.id) : {});
  const plan = useMemo(
    () => planFromAssignments(needs, options, assignments, activeSuppliers),
    [needs, options, assignmentsOverride, best, activeOverride, comparable],
  );
  const hints = useMemo(
    () => consolidationHints(needs, options, plan, activeSuppliers),
    [needs, options, plan, activeOverride, comparable],
  );

  const supplierName = (id: string) => suppliers.find(s => s.id === id)?.name ?? 'Unknown';

  const toggleSupplier = (id: string) => {
    const next = new Set(activeIds);
    if (next.has(id)) {
      if (next.size === 1) return; // keep at least one on
      next.delete(id);
    } else {
      next.add(id);
    }
    setActiveOverride(next);
  };

  const setHerbSupplier = (herbName: string, supplierId: string) => {
    setAssignmentsOverride({ ...assignments, [herbName]: supplierId || undefined });
  };

  const copyOrder = async (order: (typeof plan.orders)[number]) => {
    try {
      await navigator.clipboard.writeText(formatOrderText(order));
      toast.success(`Copied ${order.supplier.name} order`);
    } catch {
      toast.error('Could not copy — your browser blocked clipboard access');
    }
  };

  const saveComparison = () => {
    const name = saveName.trim();
    if (!name) {
      toast.error('Give this comparison a name');
      return;
    }
    const entry: SavedComparison = { name, activeIds: Array.from(activeIds), assignments };
    const next = [...saved.filter(s => s.name !== name), entry];
    setSaved(next);
    persistSaved(next);
    setSaveName('');
    toast.success(`Saved "${name}" on this device`);
  };

  const loadComparison = (c: SavedComparison) => {
    setActiveOverride(new Set(c.activeIds.filter(id => comparable.some(s => s.id === id))));
    setAssignmentsOverride(c.assignments);
  };

  const deleteComparison = (name: string) => {
    const next = saved.filter(s => s.name !== name);
    setSaved(next);
    persistSaved(next);
  };

  if (needs.length === 0) {
    return (
      <Card>
        <CardHeader className="pb-2"><CardTitle className="text-base">Compare Suppliers</CardTitle></CardHeader>
        <CardContent><p className="text-sm text-muted-foreground">No herbs to order right now.</p></CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Compare Suppliers</CardTitle>
        <p className="text-xs text-muted-foreground">
          Prices in CAD. Each row prices your whole list from that one supplier, including shipping and customs.
        </p>
      </CardHeader>
      <CardContent className="space-y-5">
        {/* Supplier filter */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-medium text-muted-foreground">Include:</span>
          {comparable.map(s => {
            const on = activeIds.has(s.id);
            return (
              <button
                key={s.id}
                onClick={() => toggleSupplier(s.id)}
                className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                  on ? 'bg-primary text-primary-foreground border-primary' : 'bg-background text-muted-foreground hover:bg-muted'
                }`}
              >
                {on && <Check className="mr-1 inline h-3 w-3" />}
                {s.name}
              </button>
            );
          })}
        </div>

        {/* Best single order */}
        {best?.order && (
          <div className="rounded-lg border border-green-300 bg-green-50 p-3 dark:bg-green-950/20">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-green-700">Best single order</p>
                <p className="text-lg font-semibold">
                  {best.supplier.name} — {fmt(best.order.total)}
                </p>
                <p className="text-sm text-muted-foreground">
                  Carries {best.covered} of {best.totalHerbs} herbs
                  {best.missing.length > 0 && ` · missing ${best.missing.length}`} · most herbs, then lowest cost
                </p>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setAssignmentsOverride(assignAllTo(needs, options, best.supplier.id))}
              >
                Use this order
              </Button>
            </div>
          </div>
        )}

        {/* Compare table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left text-muted-foreground">
                <th className="px-3 pb-2 font-medium">Supplier</th>
                <th className="px-3 pb-2 font-medium">Herbs</th>
                <th className="px-3 pb-2 text-right font-medium">Herb cost</th>
                <th className="px-3 pb-2 text-right font-medium">Shipping &amp; customs</th>
                <th className="px-3 pb-2 text-right font-medium">Total</th>
                <th className="px-3 pb-2 font-medium">Missing</th>
                <th className="px-3 pb-2"></th>
              </tr>
            </thead>
            <tbody>
              {summaries.map(s => (
                <>
                  <tr key={s.supplier.id} className="border-b hover:bg-muted/20">
                    <td className="px-3 py-2 font-medium">{s.supplier.name}</td>
                    <td className="px-3 py-2">
                      <Badge variant={s.covered === s.totalHerbs ? 'default' : 'secondary'}>
                        {s.covered} of {s.totalHerbs}
                      </Badge>
                    </td>
                    <td className="px-3 py-2 text-right">{s.order ? fmt(s.order.subtotal) : '—'}</td>
                    <td className="px-3 py-2 text-right">
                      {s.order ? (
                        <>
                          {fmt(s.order.shipping)}
                          <div className="text-[10px] text-muted-foreground">{s.order.shippingNote}</div>
                        </>
                      ) : '—'}
                    </td>
                    <td className="px-3 py-2 text-right font-semibold">{s.order ? fmt(s.order.total) : '—'}</td>
                    <td className="px-3 py-2">
                      {s.missing.length > 0 ? (
                        <button
                          className="flex items-center gap-1 text-xs text-amber-700 hover:underline"
                          onClick={() => setExpandedMissing(expandedMissing === s.supplier.id ? null : s.supplier.id)}
                        >
                          {s.missing.length} missing
                          {expandedMissing === s.supplier.id ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                        </button>
                      ) : (
                        <span className="text-xs text-green-700">none</span>
                      )}
                    </td>
                    <td className="px-3 py-2 text-right">
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-7 text-xs"
                        disabled={!s.order}
                        onClick={() => setAssignmentsOverride(assignAllTo(needs, options, s.supplier.id))}
                      >
                        Use
                      </Button>
                    </td>
                  </tr>
                  {expandedMissing === s.supplier.id && (
                    <tr key={`${s.supplier.id}-missing`} className="border-b bg-amber-50/60 dark:bg-amber-950/10">
                      <td colSpan={7} className="px-3 py-2">
                        <p className="mb-1 text-xs font-medium text-amber-800">
                          {s.supplier.name} doesn't carry these. Where you could get them instead:
                        </p>
                        <ul className="grid gap-x-6 gap-y-0.5 text-xs sm:grid-cols-2">
                          {s.missing.map(h => {
                            const alt = Array.from(options.get(h)?.values() ?? []).sort((a, b) => a.pricePerLb - b.pricePerLb)[0];
                            return (
                              <li key={h}>
                                <span className="font-medium">{h}</span>
                                {alt
                                  ? ` — ${supplierName(alt.supplierId)} at ${fmt(alt.pricePerLb)}/lb`
                                  : ' — no active supplier carries it'}
                              </li>
                            );
                          })}
                        </ul>
                      </td>
                    </tr>
                  )}
                </>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mix and match */}
        <div>
          <h3 className="mb-2 text-sm font-semibold">Your order — mix and match</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-muted-foreground">
                  <th className="px-3 pb-2 font-medium">Herb</th>
                  <th className="px-3 pb-2 font-medium">Qty</th>
                  <th className="px-3 pb-2 font-medium">Order from</th>
                  <th className="px-3 pb-2 text-right font-medium">Cost</th>
                  <th className="px-3 pb-2 font-medium">Price range (per lb)</th>
                </tr>
              </thead>
              <tbody>
                {needs.map(({ herbName, qtyLb }) => {
                  const herbOptions = Array.from(options.get(herbName)?.values() ?? []).sort((a, b) => a.pricePerLb - b.pricePerLb);
                  const chosenId = assignments[herbName];
                  const chosen = chosenId ? options.get(herbName)?.get(chosenId) : undefined;
                  const spread = spreadForHerb(options, herbName);
                  return (
                    <tr key={herbName} className="border-b last:border-0">
                      <td className="px-3 py-2 font-medium">{herbName}</td>
                      <td className="px-3 py-2 text-muted-foreground">{qtyLb} lb</td>
                      <td className="px-3 py-2">
                        {herbOptions.length === 0 ? (
                          <span className="text-xs text-amber-700">no active supplier</span>
                        ) : (
                          <select
                            className="rounded-md border bg-background px-2 py-1 text-xs"
                            value={chosen ? chosenId : ''}
                            onChange={e => setHerbSupplier(herbName, e.target.value)}
                          >
                            <option value="">— skip —</option>
                            {herbOptions.map(o => (
                              <option key={o.supplierId} value={o.supplierId}>
                                {supplierName(o.supplierId)} · {fmt(o.pricePerLb)}/lb
                              </option>
                            ))}
                          </select>
                        )}
                      </td>
                      <td className="px-3 py-2 text-right">
                        {chosen ? fmt(chosen.subtotal) : '—'}
                        {chosen?.packageInfo && <div className="text-[10px] text-muted-foreground">{chosen.packageInfo}</div>}
                      </td>
                      <td className="px-3 py-2 text-xs">
                        {spread && spread.count > 1 ? (
                          <>
                            {fmt(spread.min)}–{fmt(spread.max)}
                            <span className="ml-1 text-muted-foreground">(+{Math.round(spread.gapPct)}%)</span>
                            <div className="text-[10px] text-green-700">cheapest: {supplierName(spread.minSupplierId)}</div>
                          </>
                        ) : spread ? (
                          <span className="text-muted-foreground">only {supplierName(spread.minSupplierId)}</span>
                        ) : '—'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Plan totals per supplier */}
        {plan.orders.length > 0 && (
          <div className="space-y-2">
            {plan.orders.map(o => (
              <div key={o.supplier.id} className="flex flex-wrap items-center justify-between gap-2 rounded-lg border p-3">
                <div>
                  <p className="font-medium">
                    {o.supplier.name} <span className="text-sm font-normal text-muted-foreground">· {o.lines.length} herb{o.lines.length !== 1 ? 's' : ''}</span>
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Herbs {fmt(o.subtotal)} + shipping &amp; customs {fmt(o.shipping)} <span className="opacity-70">({o.shippingNote})</span>
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold">{fmt(o.total)}</span>
                  <Button size="sm" variant="outline" className="h-7 gap-1 text-xs" onClick={() => copyOrder(o)}>
                    <Copy className="h-3 w-3" /> Copy order
                  </Button>
                </div>
              </div>
            ))}
            <div className="flex flex-wrap items-baseline justify-between gap-2 px-1">
              <span className="text-sm text-muted-foreground">
                {plan.orders.length} order{plan.orders.length !== 1 ? 's' : ''}
                {plan.unassigned.length > 0 && ` · ${plan.unassigned.length} herb${plan.unassigned.length !== 1 ? 's' : ''} not covered`}
              </span>
              <span className="text-xl font-bold text-primary">{fmt(plan.grandTotal)}</span>
            </div>
          </div>
        )}

        {/* Save on shipping hints */}
        {hints.map(h => (
          <div key={`${h.from.id}-${h.to.id}`} className="flex gap-2 rounded-lg border border-blue-200 bg-blue-50 p-3 text-sm dark:bg-blue-950/20">
            <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" />
            <div className="flex-1">
              Order {h.herbs.join(', ')} from <strong>{h.to.name}</strong> instead of {h.from.name} and save{' '}
              <strong>{fmt(h.saving)}</strong>
              {h.extraHerbCost > 0 && <> (the herbs cost {fmt(h.extraHerbCost)} more there, but you skip a shipping charge)</>}.
              <Button
                size="sm"
                variant="outline"
                className="ml-2 h-6 text-xs"
                onClick={() => {
                  const next = { ...assignments };
                  for (const herb of h.herbs) next[herb] = h.to.id;
                  setAssignmentsOverride(next);
                }}
              >
                Apply
              </Button>
            </div>
          </div>
        ))}

        {/* Saved comparisons */}
        <div className="border-t pt-4">
          <h3 className="mb-2 text-sm font-semibold">Saved comparisons</h3>
          <div className="flex flex-wrap items-center gap-2">
            <Input
              value={saveName}
              onChange={e => setSaveName(e.target.value)}
              placeholder="Name, e.g. Clef + Pacific"
              className="h-8 max-w-xs text-sm"
            />
            <Button size="sm" variant="outline" className="h-8 gap-1" onClick={saveComparison}>
              <Save className="h-3 w-3" /> Save current
            </Button>
          </div>
          {saved.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {saved.map(c => (
                <span key={c.name} className="flex items-center rounded-full border bg-muted/40 pl-3 pr-1 text-xs">
                  <button className="py-1 font-medium hover:underline" onClick={() => loadComparison(c)}>{c.name}</button>
                  <button
                    className="ml-1 rounded-full p-1 text-muted-foreground hover:text-destructive"
                    title="Delete"
                    onClick={() => deleteComparison(c.name)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          )}
          <p className="mt-1 text-[11px] text-muted-foreground">Saved on this device only.</p>
        </div>
      </CardContent>
    </Card>
  );
}
