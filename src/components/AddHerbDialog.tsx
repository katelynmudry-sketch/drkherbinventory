import { useState, useMemo } from 'react';
import { Leaf, Search, Plus, X, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
  useAddHerb, useDeleteHerb, useAddInventory, useUpdateInventory, useDeleteInventory,
  getDisplayName, Herb, InventoryItem, useInventory, useHerbs, InventoryLocation, InventoryStatus,
} from '@/hooks/useInventory';
import { useActivityLog } from '@/contexts/ActivityLogContext';
import { usePressTinctureHerb, PressSnapshot } from '@/hooks/useTinctureBatches';
import { supabase } from '@/integrations/supabase/client';
import { LB_OPTIONS, DEFAULT_LOW_THRESHOLD, formatLbs, calcBulkStatus } from '@/lib/bulkUnits';
import { LOCATION_LABELS, LOCATIONS, plural, errorCode } from '@/lib/inventoryLabels';
import { useHerbDetail } from '@/components/HerbDetail';
import { toast } from 'sonner';

// Choices for the Status / Size picker (only clinic and backstock have one)
const STATUS_OPTIONS: Partial<Record<InventoryLocation, { value: string; label: string }[]>> = {
  clinic:    [{ value: 'low', label: 'Low' }, { value: 'out', label: 'Out' }],
  backstock: [{ value: 'small', label: 'Small' }, { value: 'large', label: 'Large' }],
};

// Starting value of the picker. For backstock it is a SIZE ('untagged' = none);
// for clinic it is the status.
const DEFAULT_PICK: Partial<Record<InventoryLocation, string>> = {
  clinic: 'low',
  backstock: 'untagged',
};
const defaultPick = (l: InventoryLocation) => DEFAULT_PICK[l] ?? 'full';

// Bulk-style locations track an actual lb quantity instead of a full/low/out status
const LB_LOCATIONS: ReadonlySet<InventoryLocation> = new Set(['bulk', 'bulk_backstock', 'bulk_clinic']);

const TINCTURE_DAYS = 14;
const freshTinctureTimes = () => ({
  tincture_started_at: new Date().toISOString(),
  tincture_ready_at: new Date(Date.now() + TINCTURE_DAYS * 24 * 60 * 60 * 1000).toISOString(),
});

interface StagedHerb {
  name: string;
  isNew: boolean;
  herbId?: string; // set for herbs picked from the existing list
}

// What we want a row to look like after an add. For backstock, notes always
// carries the size (null clears an old one when "untagged").
interface DesiredRow {
  status: InventoryStatus;
  quantity?: number;
  notes?: string | null;
}

type AddResult = 'added' | 'updated' | 'unchanged';

export function AddHerbDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [location, setLocation] = useState<InventoryLocation>('clinic');
  // Clinic: the status. Backstock: the size ('untagged' for none).
  const [statusOrSize, setStatusOrSize] = useState<string>(defaultPick('clinic'));
  const [quantity, setQuantity] = useState(1);
  const [staged, setStaged] = useState<StagedHerb[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [mode, setMode] = useState<'add' | 'remove'>('add');

  const { data: existingHerbs = [] } = useHerbs();
  const addHerb = useAddHerb();
  const deleteHerb = useDeleteHerb();
  const addInventory = useAddInventory();
  const updateInventory = useUpdateInventory();
  const deleteInventory = useDeleteInventory();
  const pressTinctureHerb = usePressTinctureHerb();
  const { logActivity } = useActivityLog();
  const { data: existingInventory = [] } = useInventory(location);
  const { openHerb } = useHerbDetail();

  const isLbLocation = LB_LOCATIONS.has(location);
  const isRemove = mode === 'remove';
  const isTincture = location === 'tincture';
  const locationLabel = LOCATION_LABELS[location];

  const resetPicks = (l: InventoryLocation) => {
    setStatusOrSize(defaultPick(l));
    setQuantity(1);
  };

  const handleLocationChange = (v: InventoryLocation) => {
    setLocation(v);
    resetPicks(v);
    // Staged herbs were picked for the old location (remove mode only lists herbs in it)
    setStaged([]);
  };

  const changeMode = (m: 'add' | 'remove') => {
    setMode(m);
    setStaged([]);
    setSearch('');
  };

  const filteredHerbs = useMemo(() => {
    const q = search.trim().toLowerCase();
    // In remove mode only herbs actually in this location can be picked
    const inLocation = new Set(existingInventory.map(i => i.herb_id));
    const pool = isRemove ? existingHerbs.filter(h => inLocation.has(h.id)) : existingHerbs;
    if (!q) return pool;
    return pool.filter(h =>
      h.name.toLowerCase().includes(q) ||
      (h.common_name && h.common_name.toLowerCase().includes(q)) ||
      (h.latin_name && h.latin_name.toLowerCase().includes(q))
    );
  }, [search, existingHerbs, existingInventory, isRemove]);

  const exactMatch = existingHerbs.find(
    h => h.name.toLowerCase() === search.trim().toLowerCase()
  );
  const isNewHerb = !isRemove && search.trim().length > 0 && !exactMatch;

  const stageHerb = (name: string, isNew: boolean, herbId?: string) => {
    if (!name.trim()) return;
    const displayName = isNew
      ? name.trim().charAt(0).toUpperCase() + name.trim().slice(1)
      : name;
    if (!staged.find(s => s.name.toLowerCase() === displayName.toLowerCase())) {
      setStaged(prev => [...prev, { name: displayName, isNew, herbId }]);
    }
    setSearch('');
  };

  const removeStaged = (name: string) => {
    setStaged(prev => prev.filter(s => s.name !== name));
  };

  const resolveHerb = (entry: StagedHerb): Herb | undefined =>
    entry.herbId
      ? existingHerbs.find(h => h.id === entry.herbId)
      : existingHerbs.find(h => h.name.toLowerCase() === entry.name.toLowerCase());

  // Live lookup of this herb's row in the selected location. Always used
  // instead of the cached list so updates, and the values saved for Undo,
  // are never stale.
  const findRow = async (herbId: string): Promise<InventoryItem | null> => {
    const { data, error } = await supabase
      .from('inventory')
      .select('*')
      .eq('herb_id', herbId)
      .eq('location', location)
      .maybeSingle();
    if (error) throw error;
    return data as InventoryItem | null;
  };

  // Log an update to an existing row, snapshotting what Undo needs to restore
  const logUpdate = (herb: Herb, prev: InventoryItem, newStatus: InventoryStatus) => {
    logActivity({
      type: 'status_change',
      inventoryId: prev.id,
      herbName: getDisplayName(herb),
      location,
      prevStatus: prev.status,
      newStatus,
      prevQuantity: prev.quantity,
      ...(location === 'backstock' ? { prevNotes: prev.notes, change: 'size' as const } : {}),
      ...(isTincture
        ? {
            prevTinctureStartedAt: prev.tincture_started_at,
            prevTinctureReadyAt: prev.tincture_ready_at,
            change: 'restart' as const,
          }
        : {}),
      ...(isLbLocation ? { change: 'quantity' as const } : {}),
    });
  };

  const buildDesired = (herb: Herb): DesiredRow => {
    if (isLbLocation) {
      const threshold = herb.low_threshold_lb ?? DEFAULT_LOW_THRESHOLD;
      return { status: calcBulkStatus(quantity, threshold), quantity };
    }
    if (location === 'backstock') {
      return {
        status: 'full',
        notes: statusOrSize && statusOrSize !== 'untagged' ? statusOrSize : null,
      };
    }
    return { status: (statusOrSize as InventoryStatus) || 'full' };
  };

  // Add one staged herb to the location, or update it if it's already there.
  // A herb created just for this entry is deleted again if the inventory step fails.
  const processAddEntry = async (entry: StagedHerb): Promise<{ result: AddResult; newHerbId?: string }> => {
    let herb = resolveHerb(entry);
    let newHerbId: string | undefined;
    if (!herb) {
      herb = await addHerb.mutateAsync({ name: entry.name });
      newHerbId = herb.id;
    }

    try {
      const desired = buildDesired(herb);
      let row = await findRow(herb.id);

      if (!row) {
        try {
          const created = await addInventory.mutateAsync({
            herb_id: herb.id,
            location,
            ...desired,
            notes: desired.notes ?? undefined,
          });
          logActivity({
            type: 'add',
            inventoryId: created.id,
            herb_id: herb.id,
            herbName: getDisplayName(herb),
            location,
            status: desired.status,
          });
          return { result: 'added', newHerbId };
        } catch (insertError) {
          // Someone added it between our lookup and insert: fall through and update it
          if (errorCode(insertError) !== '23505') throw insertError;
          row = await findRow(herb.id);
          if (!row) throw insertError;
        }
      }

      if (isTincture) {
        // Re-adding a tincture starts a fresh one: restart the timer
        await updateInventory.mutateAsync({ id: row.id, ...desired, ...freshTinctureTimes() });
      } else if (
        row.status === desired.status &&
        (desired.quantity === undefined || row.quantity === desired.quantity) &&
        (desired.notes === undefined || (row.notes ?? null) === desired.notes)
      ) {
        toast.info(`${entry.name} is already ${desired.status} in ${locationLabel}`);
        return { result: 'unchanged', newHerbId };
      } else {
        await updateInventory.mutateAsync({ id: row.id, ...desired });
      }
      logUpdate(herb, row, desired.status);
      return { result: 'updated', newHerbId };
    } catch (error) {
      if (newHerbId) await deleteHerb.mutateAsync(newHerbId).catch(() => {});
      throw error;
    }
  };

  const handleAddConfirm = async () => {
    let added = 0;
    let updated = 0;
    let firstNewHerbId: string | undefined;
    for (const entry of staged) {
      try {
        const { result, newHerbId } = await processAddEntry(entry);
        if (result === 'added') added++;
        if (result === 'updated') updated++;
        if (newHerbId && !firstNewHerbId) firstNewHerbId = newHerbId;
      } catch (error) {
        if (errorCode(error) === '23505') {
          toast.error(`${entry.name} already exists in ${locationLabel}`);
        } else {
          toast.error(`Failed to add ${entry.name}`);
          console.error(error);
        }
      }
    }
    if (added > 0) toast.success(`Added ${plural(added, 'herb')} to ${locationLabel}`);
    if (updated > 0) toast.success(`Updated ${plural(updated, 'herb')} already in ${locationLabel}`);
    return firstNewHerbId;
  };

  const handleRemoveConfirm = async () => {
    let done = 0;
    for (const entry of staged) {
      try {
        const herb = resolveHerb(entry);
        const row = herb ? await findRow(herb.id) : null;
        if (!herb || !row) {
          toast.error(`${entry.name} isn't in ${locationLabel}`);
          continue;
        }
        // Tincture "Pressed" presses the batch and clears the jar row atomically
        let pressed: PressSnapshot | null = null;
        if (isTincture) {
          pressed = await pressTinctureHerb.mutateAsync(row);
        } else {
          await deleteInventory.mutateAsync(row.id);
        }
        // Log with a full snapshot so Undo can restore the row
        logActivity({
          type: 'remove',
          inventoryId: row.id,
          herb_id: row.herb_id,
          herbName: getDisplayName(herb),
          location,
          status: row.status,
          notes: row.notes,
          tincture_started_at: row.tincture_started_at,
          tincture_ready_at: row.tincture_ready_at,
          current_batch_id: row.current_batch_id,
          quantity: row.quantity,
          ...(pressed ? { pressed } : {}),
        });
        done++;
      } catch (error) {
        toast.error(`Failed to ${isTincture ? 'press' : 'remove'} ${entry.name}`);
        console.error(error);
      }
    }
    if (done > 0) {
      toast.success(isTincture
        ? `Pressed ${plural(done, 'herb')}`
        : `Removed ${plural(done, 'herb')} from ${locationLabel}`);
    }
  };

  const handleClose = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      setSearch('');
      setStaged([]);
      resetPicks(location);
      setMode('add');
    }
  };

  const handleConfirm = async () => {
    if (staged.length === 0) return;
    setIsProcessing(true);
    let newHerbId: string | undefined;
    try {
      if (isRemove) await handleRemoveConfirm();
      else newHerbId = await handleAddConfirm();
    } finally {
      setIsProcessing(false);
      handleClose(false);
    }
    // New herb created: go straight to its detail screen to fill in the rest
    if (newHerbId) openHerb(newHerbId);
  };

  const statusOptions = STATUS_OPTIONS[location] ?? [];

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Leaf className="h-4 w-4" />
          Add New Herb
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-background">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Leaf className="h-5 w-5 text-primary" />
            {isRemove ? (isTincture ? 'Press Herbs' : 'Remove Herbs from Inventory') : 'Add Herb to Inventory'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 pt-2">
          {/* Add / Remove */}
          <div className="grid grid-cols-2 gap-2">
            <Button
              type="button"
              variant={isRemove ? 'outline' : 'default'}
              onClick={() => changeMode('add')}
              disabled={isProcessing}
            >
              Add
            </Button>
            <Button
              type="button"
              variant={isRemove ? 'default' : 'outline'}
              onClick={() => changeMode('remove')}
              disabled={isProcessing}
            >
              {isTincture ? 'Pressed' : 'Remove'}
            </Button>
          </div>

          {/* Location */}
          <div className="space-y-2">
            <Label>Location</Label>
            <Select value={location} onValueChange={(v) => handleLocationChange(v as InventoryLocation)}>
              <SelectTrigger className="bg-background">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-background z-50">
                {LOCATIONS.map(l => (
                  <SelectItem key={l} value={l}>{LOCATION_LABELS[l]}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Status / Quantity */}
          {isRemove ? null : isLbLocation ? (
            <div className="space-y-2">
              <Label>Quantity (lbs)</Label>
              <Select value={String(quantity)} onValueChange={(v) => setQuantity(Number(v))}>
                <SelectTrigger className="bg-background">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-background z-50">
                  <SelectItem value="0">Out (0 lb)</SelectItem>
                  {LB_OPTIONS.map(lb => (
                    <SelectItem key={lb} value={String(lb)}>{formatLbs(lb)} lb</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ) : !isTincture && (
            <div className="space-y-2">
              <Label>{location === 'backstock' ? 'Size' : 'Status'}</Label>
              <Select value={statusOrSize} onValueChange={setStatusOrSize}>
                <SelectTrigger className="bg-background">
                  <SelectValue placeholder={location === 'backstock' ? 'Untagged' : 'Select status'} />
                </SelectTrigger>
                <SelectContent className="bg-background z-50">
                  {location === 'backstock' && (
                    <SelectItem value="untagged">Untagged</SelectItem>
                  )}
                  {statusOptions.map(opt => (
                    <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Herb search */}
          <div className="space-y-2">
            <Label>Herbs</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Type to search herbs..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
                autoFocus
              />
            </div>

            {search.trim().length > 0 && (
              <div className="border rounded-md max-h-48 overflow-y-auto">
                {filteredHerbs.slice(0, 20).map(herb => (
                  <button
                    key={herb.id}
                    type="button"
                    className="w-full text-left px-3 py-2 text-sm hover:bg-accent transition-colors border-b last:border-b-0"
                    onClick={() => stageHerb(herb.name, false, herb.id)}
                    disabled={isProcessing}
                  >
                    <span className="font-medium">{herb.name}</span>
                    {herb.common_name && (
                      <span className="text-muted-foreground ml-1">({herb.common_name})</span>
                    )}
                    {herb.latin_name && (
                      <span className="text-muted-foreground text-xs block">{herb.latin_name}</span>
                    )}
                  </button>
                ))}
                {isNewHerb && (
                  <button
                    type="button"
                    className="w-full text-left px-3 py-2 text-sm hover:bg-accent transition-colors text-primary border-t"
                    onClick={() => stageHerb(search.trim(), true)}
                    disabled={isProcessing}
                  >
                    <Plus className="inline h-3 w-3 mr-1" />
                    Add &ldquo;{search.trim()}&rdquo; as new herb
                  </button>
                )}
              </div>
            )}

            {search.trim().length === 0 && staged.length === 0 && (
              <p className="text-xs text-muted-foreground">{isRemove ? `Start typing to search herbs in ${locationLabel}` : 'Start typing to search your herb list'}</p>
            )}
          </div>

          {/* Staged herbs */}
          {staged.length > 0 && (
            <div className="space-y-2">
              <Label>Selected ({staged.length})</Label>
              <div className="flex flex-wrap gap-1.5">
                {staged.map(s => (
                  <Badge key={s.name} variant="secondary" className="gap-1 pr-1">
                    {s.name}
                    {s.isNew && <span className="text-xs text-muted-foreground">new</span>}
                    <button
                      type="button"
                      onClick={() => removeStaged(s.name)}
                      className="ml-0.5 rounded-full hover:bg-muted p-0.5"
                      disabled={isProcessing}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Confirm button */}
          <Button
            className="w-full gap-2"
            onClick={handleConfirm}
            disabled={staged.length === 0 || isProcessing}
          >
            <Check className="h-4 w-4" />
            {isProcessing
              ? (isRemove ? 'Working...' : 'Adding...')
              : staged.length === 0
              ? 'Select herbs above'
              : isRemove
              ? `${isTincture ? 'Press' : 'Remove'} ${plural(staged.length, 'herb')}${isTincture ? '' : ` from ${locationLabel}`}`
              : `Add ${plural(staged.length, 'herb')} to ${locationLabel}`}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
