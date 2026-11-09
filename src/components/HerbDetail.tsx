import { createContext, useContext, useEffect, useMemo, useState, ReactNode } from 'react';
import { Leaf, Droplets, Package2, Save, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import {
  useHerbs,
  useInventory,
  useUpdateHerb,
  useUpdateLowThreshold,
  getDisplayName,
  Herb,
  InventoryLocation,
} from '@/hooks/useInventory';
import { getTinctureAlcohol } from '@/lib/tinctureAlcohol';
import { LB_OPTIONS, DEFAULT_LOW_THRESHOLD, formatLbs } from '@/lib/bulkUnits';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const LOCATION_LABELS: Record<InventoryLocation, string> = {
  clinic: 'Clinic',
  backstock: 'Backstock',
  tincture: 'Tincture',
  bulk: 'Bulk',
  bulk_backstock: 'Bulk Backstock',
  bulk_clinic: 'Clinic Bulk',
};

const PLANT_PARTS = ['Leaf', 'Root', 'Flower', 'Seed', 'Bark', 'Berry', 'Aerial parts', 'Whole plant', 'Resin', 'Other'];

// ---------------------------------------------------------------------------
// Context: any component can open the detail screen with openHerb(herbId)
// ---------------------------------------------------------------------------
interface HerbDetailContextValue {
  openHerb: (herbId: string) => void;
}

const HerbDetailContext = createContext<HerbDetailContextValue>({ openHerb: () => {} });

export function useHerbDetail() {
  return useContext(HerbDetailContext);
}

export function HerbDetailProvider({ children }: { children: ReactNode }) {
  const [herbId, setHerbId] = useState<string | null>(null);
  const value = useMemo(() => ({ openHerb: (id: string) => setHerbId(id) }), []);

  return (
    <HerbDetailContext.Provider value={value}>
      {children}
      <HerbDetailDialog herbId={herbId} onClose={() => setHerbId(null)} />
    </HerbDetailContext.Provider>
  );
}

// Clickable herb name — drop-in replacement for a plain name element.
export function HerbNameButton({
  herb,
  className,
  children,
}: {
  herb: Pick<Herb, 'id'> | null | undefined;
  className?: string;
  children: ReactNode;
}) {
  const { openHerb } = useHerbDetail();
  if (!herb) return <span className={className}>{children}</span>;
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        openHerb(herb.id);
      }}
      className={cn('text-left hover:underline underline-offset-2 decoration-dotted cursor-pointer', className)}
      title="Open herb details"
    >
      {children}
    </button>
  );
}

// ---------------------------------------------------------------------------
// Dialog
// ---------------------------------------------------------------------------
interface FormState {
  name: string;
  common_name: string;
  latin_name: string;
  pinyin_name: string;
  preferred_name: 'common' | 'latin' | 'pinyin' | 'name';
  plant_part: string;
  tincture_alcohol: string;
  tincture_ratio: string;
  low_threshold_lb: number;
  notes: string;
}

function toForm(herb: Herb): FormState {
  return {
    name: herb.name,
    common_name: herb.common_name ?? '',
    latin_name: herb.latin_name ?? '',
    pinyin_name: herb.pinyin_name ?? '',
    preferred_name: herb.preferred_name ?? 'name',
    plant_part: herb.plant_part ?? '',
    tincture_alcohol: herb.tincture_alcohol ?? '',
    tincture_ratio: herb.tincture_ratio ?? '',
    low_threshold_lb: Number(herb.low_threshold_lb ?? DEFAULT_LOW_THRESHOLD),
    notes: herb.notes ?? '',
  };
}

function HerbDetailDialog({ herbId, onClose }: { herbId: string | null; onClose: () => void }) {
  const { data: herbs = [] } = useHerbs();
  const { data: inventory = [] } = useInventory();
  const updateHerb = useUpdateHerb();
  const updateThreshold = useUpdateLowThreshold();

  const herb = herbs.find((h) => h.id === herbId) ?? null;
  const [form, setForm] = useState<FormState | null>(null);
  const [saving, setSaving] = useState(false);

  // Load the form when a different herb is opened (not on every background refetch)
  useEffect(() => {
    if (herb) setForm(toForm(herb));
    else setForm(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [herbId, herb?.id]);

  const rows = useMemo(
    () => inventory.filter((i) => i.herb_id === herbId),
    [inventory, herbId]
  );

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((f) => (f ? { ...f, [key]: value } : f));

  // Built-in suggestion from the legacy alcohol lookup table
  const suggestedAlcohol = herb
    ? getTinctureAlcohol(herb.name) ?? (herb.common_name ? getTinctureAlcohol(herb.common_name) : null)
    : null;

  const handleSave = async () => {
    if (!herb || !form) return;
    if (!form.name.trim()) {
      toast.error('Herb name is required');
      return;
    }
    setSaving(true);
    try {
      await updateHerb.mutateAsync({
        id: herb.id,
        name: form.name.trim(),
        common_name: form.common_name.trim() || null,
        latin_name: form.latin_name.trim() || null,
        pinyin_name: form.pinyin_name.trim() || null,
        preferred_name: form.preferred_name === 'name' ? null : form.preferred_name,
        plant_part: form.plant_part.trim() || null,
        tincture_alcohol: form.tincture_alcohol.trim() || null,
        tincture_ratio: form.tincture_ratio.trim() || null,
        notes: form.notes.trim() || null,
      });
      if (form.low_threshold_lb !== Number(herb.low_threshold_lb)) {
        await updateThreshold.mutateAsync({ herbId: herb.id, low_threshold_lb: form.low_threshold_lb });
      }
      toast.success(`Saved ${form.name.trim()}`);
      onClose();
    } catch (error) {
      console.error('Save herb failed', error);
      const err = error as { code?: string; message?: string };
      toast.error(
        err?.code === '23505'
          ? 'An herb with that name already exists'
          : err?.message?.includes('column')
          ? 'Save failed — run the 20260710_herb_detail_fields.sql migration in Supabase first'
          : 'Failed to save herb'
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={!!herbId} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="bg-background flex flex-col max-h-[90vh] sm:max-w-lg">
        <DialogHeader className="shrink-0">
          <DialogTitle className="flex items-center gap-2">
            <Leaf className="h-5 w-5 text-primary" />
            {herb ? getDisplayName(herb) : 'Herb details'}
          </DialogTitle>
          <DialogDescription>
            {herb?.latin_name ? <em>{herb.latin_name}</em> : 'Names, tincture specs, bulk settings and notes'}
          </DialogDescription>
        </DialogHeader>

        {herb && form && (
          <div className="space-y-5 overflow-y-auto pr-1 pb-1">
            {/* Where it lives */}
            <div className="space-y-1.5">
              <Label className="text-xs uppercase tracking-wide text-muted-foreground">Current stock</Label>
              {rows.length === 0 ? (
                <p className="text-sm text-muted-foreground italic">Not in any inventory location yet</p>
              ) : (
                <div className="flex flex-wrap gap-1.5">
                  {rows.map((r) => {
                    const isLb = r.location.startsWith('bulk');
                    return (
                      <Badge key={r.id} variant="secondary" className="gap-1 font-normal">
                        {LOCATION_LABELS[r.location]}:{' '}
                        {isLb ? `${formatLbs(Number(r.quantity ?? 0))} lb` : r.status}
                      </Badge>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Names */}
            <section className="space-y-3">
              <h3 className="text-sm font-semibold flex items-center gap-1.5">
                <Info className="h-4 w-4 text-muted-foreground" /> Names
              </h3>
              <div className="space-y-1.5">
                <Label htmlFor="hd-name">Name</Label>
                <Input id="hd-name" value={form.name} onChange={(e) => set('name', e.target.value)} />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="hd-common">Common name</Label>
                  <Input id="hd-common" value={form.common_name} onChange={(e) => set('common_name', e.target.value)} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="hd-latin">Latin name</Label>
                  <Input id="hd-latin" value={form.latin_name} onChange={(e) => set('latin_name', e.target.value)} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="hd-pinyin">Pinyin name</Label>
                  <Input id="hd-pinyin" value={form.pinyin_name} onChange={(e) => set('pinyin_name', e.target.value)} />
                </div>
                <div className="space-y-1.5">
                  <Label>Show in lists as</Label>
                  <Select value={form.preferred_name} onValueChange={(v) => set('preferred_name', v as FormState['preferred_name'])}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="name">Name</SelectItem>
                      <SelectItem value="common">Common name</SelectItem>
                      <SelectItem value="latin">Latin name</SelectItem>
                      <SelectItem value="pinyin">Pinyin name</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-1.5">
                <Label>Plant part</Label>
                <Select value={form.plant_part || 'none'} onValueChange={(v) => set('plant_part', v === 'none' ? '' : v)}>
                  <SelectTrigger><SelectValue placeholder="Select plant part" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Not set</SelectItem>
                    {PLANT_PARTS.map((p) => (
                      <SelectItem key={p} value={p}>{p}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </section>

            {/* Tincture */}
            <section className="space-y-3">
              <h3 className="text-sm font-semibold flex items-center gap-1.5">
                <Droplets className="h-4 w-4 text-purple-600" /> Tincture making
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="hd-alcohol">Alcohol %</Label>
                  <Input
                    id="hd-alcohol"
                    value={form.tincture_alcohol}
                    onChange={(e) => set('tincture_alcohol', e.target.value)}
                    placeholder={suggestedAlcohol ?? 'e.g. 45%'}
                  />
                  {!form.tincture_alcohol && suggestedAlcohol && (
                    <button
                      type="button"
                      className="text-xs text-primary hover:underline"
                      onClick={() => set('tincture_alcohol', suggestedAlcohol)}
                    >
                      Use saved default: {suggestedAlcohol}
                    </button>
                  )}
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="hd-ratio">Ratio (herb : menstruum)</Label>
                  <Input
                    id="hd-ratio"
                    value={form.tincture_ratio}
                    onChange={(e) => set('tincture_ratio', e.target.value)}
                    placeholder="e.g. 1:5 (dry) or 1:2 (fresh)"
                  />
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                Free text, so notes like “55%/10V”, “fresh 60–70%” or “decoction/20%” are kept as typed.
              </p>
            </section>

            {/* Bulk */}
            <section className="space-y-3">
              <h3 className="text-sm font-semibold flex items-center gap-1.5">
                <Package2 className="h-4 w-4 text-amber-600" /> Bulk
              </h3>
              <div className="space-y-1.5">
                <Label>Low-stock threshold (lb)</Label>
                <Select
                  value={String(form.low_threshold_lb)}
                  onValueChange={(v) => set('low_threshold_lb', Number(v))}
                >
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {[...new Set([...LB_OPTIONS, form.low_threshold_lb])]
                      .filter((lb) => lb > 0)
                      .sort((a, b) => a - b)
                      .map((lb) => (
                        <SelectItem key={lb} value={String(lb)}>{formatLbs(lb)} lb</SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
            </section>

            {/* Notes */}
            <section className="space-y-1.5">
              <Label htmlFor="hd-notes">Notes</Label>
              <Textarea
                id="hd-notes"
                value={form.notes}
                onChange={(e) => set('notes', e.target.value)}
                rows={3}
                placeholder="Sourcing, preparation, anything worth remembering"
              />
            </section>

            <div className="flex gap-2 pt-1">
              <Button className="flex-1 gap-2" onClick={handleSave} disabled={saving}>
                <Save className="h-4 w-4" />
                {saving ? 'Saving...' : 'Save'}
              </Button>
              <Button variant="outline" onClick={onClose} disabled={saving}>
                Close
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
