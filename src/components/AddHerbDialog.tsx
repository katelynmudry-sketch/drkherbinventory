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
import { useAddHerb, useAddInventory, useUpdateInventory, useDeleteInventory, getDisplayName, Herb, useInventory, useHerbs, InventoryLocation, InventoryStatus } from '@/hooks/useInventory';
import { useActivityLog } from '@/contexts/ActivityLogContext';
import { usePressBatch } from '@/hooks/useTinctureBatches';
import { supabase } from '@/integrations/supabase/client';
import { LB_OPTIONS, DEFAULT_LOW_THRESHOLD, formatLbs, calcBulkStatus } from '@/lib/bulkUnits';
import { useHerbDetail } from '@/components/HerbDetail';
import { toast } from 'sonner';

const STATUS_OPTIONS: Record<InventoryLocation, { value: string; label: string }[]> = {
  clinic:        [{ value: 'low', label: 'Low' }, { value: 'out', label: 'Out' }],
  backstock:     [{ value: 'small', label: 'Small' }, { value: 'large', label: 'Large' }],
  tincture:      [],
  bulk:          [],
  bulk_backstock:[],
  bulk_clinic:   [],
};

const DEFAULT_STATUS: Record<InventoryLocation, string> = {
  clinic:        'low',
  backstock:     'untagged',
  tincture:      'full',
  bulk:          'full',
  bulk_backstock:'full',
  bulk_clinic:   'full',
};

// Bulk-style locations track an actual lb quantity instead of a full/low/out status
const LB_LOCATIONS: ReadonlySet<InventoryLocation> = new Set(['bulk', 'bulk_backstock', 'bulk_clinic']);

const LOCATION_LABELS: Record<InventoryLocation, string> = {
  clinic: 'Clinic',
  backstock: 'Backstock',
  tincture: 'Tincture',
  bulk: 'Bulk',
  bulk_backstock: 'Bulk Backstock',
  bulk_clinic: 'Clinic Bulk',
};

interface StagedHerb {
  name: string;
  isNew: boolean;
}

export function AddHerbDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [location, setLocation] = useState<InventoryLocation>('clinic');
  const [status, setStatus] = useState<string>(DEFAULT_STATUS['clinic']);
  const [quantity, setQuantity] = useState(1);
  const [staged, setStaged] = useState<StagedHerb[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [mode, setMode] = useState<'add' | 'remove'>('add');

  const { data: existingHerbs = [] } = useHerbs();
  const addHerb = useAddHerb();
  const addInventory = useAddInventory();
  const updateInventory = useUpdateInventory();
  const deleteInventory = useDeleteInventory();
  const pressBatch = usePressBatch();
  const { logActivity } = useActivityLog();
  const { data: existingInventory = [] } = useInventory(location);
  const { openHerb } = useHerbDetail();

  const isLbLocation = LB_LOCATIONS.has(location);
  const isRemove = mode === 'remove';
  const removeVerb = location === 'tincture' ? 'Press' : 'Remove';

  const handleLocationChange = (v: InventoryLocation) => {
    setLocation(v);
    setStatus(DEFAULT_STATUS[v]);
    setQuantity(1);
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

  const stageHerb = (name: string, isNew: boolean) => {
    if (!name.trim()) return;
    const displayName = isNew
      ? name.trim().charAt(0).toUpperCase() + name.trim().slice(1)
      : name;
    if (!staged.find(s => s.name.toLowerCase() === displayName.toLowerCase())) {
      setStaged(prev => [...prev, { name: displayName, isNew }]);
    }
    setSearch('');
  };

  const removeStaged = (name: string) => {
    setStaged(prev => prev.filter(s => s.name !== name));
  };

  // Only status changes are undoable from the log; skip no-op status changes
  const logStatusChange = (inventoryId: string, herb: Herb, prevStatus: InventoryStatus, newStatus: InventoryStatus) => {
    if (prevStatus === newStatus) return;
    logActivity({
      type: 'status_change',
      inventoryId,
      herbName: getDisplayName(herb),
      location,
      prevStatus,
      newStatus,
    });
  };

  const handleRemoveConfirm = async () => {
    setIsProcessing(true);
    let doneCount = 0;
    for (const entry of staged) {
      try {
        const herb = existingHerbs.find(h => h.name.toLowerCase() === entry.name.toLowerCase());
        const row = herb && existingInventory.find(i => i.herb_id === herb.id);
        if (!row) {
          toast.error(`${entry.name} isn't in ${LOCATION_LABELS[location]}`);
          continue;
        }
        if (location === 'tincture') {
          // Pressed: batch becomes active, tincture jar row is removed
          const { data: batch } = await supabase
            .from('tincture_batches')
            .select('id')
            .eq('herb_id', row.herb_id)
            .eq('status', 'macerating')
            .maybeSingle();
          const batchId = batch?.id ?? row.current_batch_id ?? null;
          if (batchId) await pressBatch.mutateAsync(batchId);
        }
        await deleteInventory.mutateAsync(row.id);
        // Log with a full snapshot so Undo can restore the row
        logActivity({
          type: 'remove',
          herb_id: row.herb_id,
          herbName: herb ? getDisplayName(herb) : entry.name,
          location,
          status: row.status,
          notes: row.notes,
          tincture_started_at: row.tincture_started_at,
          tincture_ready_at: row.tincture_ready_at,
          current_batch_id: row.current_batch_id,
        });
        doneCount++;
      } catch (error: any) {
        toast.error(`Failed to ${removeVerb.toLowerCase()} ${entry.name}`);
        console.error(error);
      }
    }
    if (doneCount > 0) {
      toast.success(location === 'tincture'
        ? `Pressed ${doneCount} herb${doneCount > 1 ? 's' : ''}`
        : `Removed ${doneCount} herb${doneCount > 1 ? 's' : ''} from ${LOCATION_LABELS[location]}`);
    }
    setStaged([]);
    setSearch('');
    setIsProcessing(false);
    setIsOpen(false);
  };

  const handleConfirm = async () => {
    if (staged.length === 0) return;
    if (isRemove) return handleRemoveConfirm();
    setIsProcessing(true);

    let successCount = 0;
    let updatedCount = 0;
    let firstNewHerbId: string | null = null;
    for (const entry of staged) {
      try {
        let herb = existingHerbs.find(h => h.name.toLowerCase() === entry.name.toLowerCase());
        if (!herb) {
          herb = await addHerb.mutateAsync({ name: entry.name });
          if (!firstNewHerbId) firstNewHerbId = herb.id;
        }

        // Build the row we'd insert; if the herb is already in this location
        // we update the existing row to these values instead.
        let desired: { status: InventoryStatus; quantity?: number; notes?: string };
        if (isLbLocation) {
          const herbThreshold = herb.low_threshold_lb ?? DEFAULT_LOW_THRESHOLD;
          desired = { status: calcBulkStatus(quantity, herbThreshold), quantity };
        } else {
          const inventoryStatus: InventoryStatus = location === 'backstock' ? 'full' : (status as InventoryStatus) || 'full';
          const notes = location === 'backstock' && status && status !== 'untagged' ? status : undefined;
          desired = { status: inventoryStatus, ...(notes ? { notes } : {}) };
        }

        const existingRow = existingInventory.find(i => i.herb_id === herb!.id);

        if (existingRow) {
          if (location === 'tincture') {
            // Re-adding a tincture starts a fresh one: restart the 14-day timer
            await updateInventory.mutateAsync({
              id: existingRow.id,
              ...desired,
              tincture_started_at: new Date().toISOString(),
              tincture_ready_at: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
            });
            logStatusChange(existingRow.id, herb, existingRow.status, desired.status);
            updatedCount++;
          } else if (existingRow.status === desired.status && (desired.quantity === undefined || existingRow.quantity === desired.quantity)) {
            toast.info(`${entry.name} is already ${desired.status} in ${LOCATION_LABELS[location]}`);
          } else {
            await updateInventory.mutateAsync({ id: existingRow.id, ...desired });
            logStatusChange(existingRow.id, herb, existingRow.status, desired.status);
            updatedCount++;
          }
          continue;
        }

        try {
          const created = await addInventory.mutateAsync({ herb_id: herb.id, location, ...desired });
          logActivity({
            type: 'add',
            inventoryId: created.id,
            herb_id: herb.id,
            herbName: getDisplayName(herb),
            location,
            status: desired.status,
          });
        } catch (insertError: any) {
          // Row exists but wasn't in the cached list — look it up and update it
          if (insertError?.code === '23505') {
            const { data: row, error: lookupError } = await supabase
              .from('inventory')
              .select('id, status')
              .eq('herb_id', herb.id)
              .eq('location', location)
              .maybeSingle();
            if (lookupError || !row) throw insertError;
            await updateInventory.mutateAsync({
              id: row.id,
              ...desired,
              ...(location === 'tincture' ? {
                tincture_started_at: new Date().toISOString(),
                tincture_ready_at: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
              } : {}),
            });
            logStatusChange(row.id, herb, row.status as InventoryStatus, desired.status);
            updatedCount++;
            continue;
          }
          throw insertError;
        }

        successCount++;
      } catch (error: any) {
        if (error?.code === '23505') {
          toast.error(`${entry.name} already exists in ${LOCATION_LABELS[location]}`);
        } else {
          toast.error(`Failed to add ${entry.name}`);
          console.error(error);
        }
      }
    }

    if (successCount > 0) {
      toast.success(`Added ${successCount} herb${successCount > 1 ? 's' : ''} to ${LOCATION_LABELS[location]}`);
    }
    if (updatedCount > 0) {
      toast.success(`Updated ${updatedCount} herb${updatedCount > 1 ? 's' : ''} already in ${LOCATION_LABELS[location]}`);
    }

    setStaged([]);
    setSearch('');
    setStatus(DEFAULT_STATUS[location]);
    setQuantity(1);
    setIsProcessing(false);
    setIsOpen(false);
    // New herb created — go straight to its detail screen to fill in the rest
    if (firstNewHerbId) openHerb(firstNewHerbId);
  };

  const handleClose = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      setSearch('');
      setStaged([]);
      setStatus(DEFAULT_STATUS[location]);
      setQuantity(1);
      setMode('add');
    }
  };

  const statusOptions = STATUS_OPTIONS[location];

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
            {isRemove ? (location === 'tincture' ? 'Press Herbs' : 'Remove Herbs from Inventory') : 'Add Herb to Inventory'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 pt-2">
          {/* Add / Remove */}
          <div className="grid grid-cols-2 gap-2">
            <Button
              type="button"
              variant={isRemove ? 'outline' : 'default'}
              onClick={() => { setMode('add'); setStaged([]); setSearch(''); }}
              disabled={isProcessing}
            >
              Add
            </Button>
            <Button
              type="button"
              variant={isRemove ? 'default' : 'outline'}
              onClick={() => { setMode('remove'); setStaged([]); setSearch(''); }}
              disabled={isProcessing}
            >
              {location === 'tincture' ? 'Pressed' : 'Remove'}
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
                <SelectItem value="clinic">Clinic</SelectItem>
                <SelectItem value="backstock">Backstock</SelectItem>
                <SelectItem value="tincture">Tincture</SelectItem>
                <SelectItem value="bulk">Bulk</SelectItem>
                <SelectItem value="bulk_backstock">Bulk Backstock</SelectItem>
                <SelectItem value="bulk_clinic">Clinic Bulk</SelectItem>
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
                  {LB_OPTIONS.map(lb => (
                    <SelectItem key={lb} value={String(lb)}>{formatLbs(lb)} lb</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ) : location !== 'tincture' && (
            <div className="space-y-2">
              <Label>{location === 'backstock' ? 'Size' : 'Status'}</Label>
              <Select value={status} onValueChange={setStatus}>
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
                {filteredHerbs.length > 0 ? (
                  filteredHerbs.slice(0, 20).map(herb => (
                    <button
                      key={herb.id}
                      type="button"
                      className="w-full text-left px-3 py-2 text-sm hover:bg-accent transition-colors border-b last:border-b-0"
                      onClick={() => stageHerb(herb.name, false)}
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
                  ))
                ) : null}
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
              <p className="text-xs text-muted-foreground">{isRemove ? `Start typing to search herbs in ${LOCATION_LABELS[location]}` : 'Start typing to search your herb list'}</p>
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
              ? `${removeVerb} ${staged.length} herb${staged.length > 1 ? 's' : ''}${location === 'tincture' ? '' : ` from ${LOCATION_LABELS[location]}`}`
              : `Add ${staged.length} herb${staged.length > 1 ? 's' : ''} to ${LOCATION_LABELS[location]}`}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
