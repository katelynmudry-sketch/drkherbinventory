import { useState, useEffect, useMemo } from 'react';
import { Plus, Trash2, Edit2, Check, X, Clock, Filter, CheckCircle2, CalendarIcon, ChevronDown, ChevronUp, Search } from 'lucide-react';
import { Toggle } from '@/components/ui/toggle';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Checkbox } from '@/components/ui/checkbox';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  useInventory,
  useHerbs,
  useAddInventory,
  useUpdateInventory,
  useDeleteInventory,
  useUpdateHerb,
  useSetInventoryStatusForHerb,
  InventoryLocation,
  InventoryStatus,
  InventoryItem,
  getDisplayName,
} from '@/hooks/useInventory';
import { usePressBatch, useTinctureBatches, useUpdateTinctureBatch, TinctureBatch } from '@/hooks/useTinctureBatches';
import { checkHerbAvailability, findMatchingInventoryItem, findHerbNameMatch, AvailabilityInfo } from '@/hooks/useInventoryCheck';
import { usePremadeTinctures } from '@/hooks/usePremadeTinctures';
import { AvailabilityAlert } from '@/components/AvailabilityAlert';
import { cn } from '@/lib/utils';
import { getTinctureAlcohol } from '@/lib/tinctureAlcohol';
import { format, differenceInDays, isPast, addWeeks } from 'date-fns';
import { toast } from 'sonner';

interface InventorySectionProps {
  location: InventoryLocation;
  title: string;
  icon: React.ReactNode;
  description: string;
  searchQuery?: string;
  showBatchInfo?: boolean;
}

export function InventorySection({ location, title, icon, description, searchQuery = '', showBatchInfo = false }: InventorySectionProps) {
  const { data: inventory = [], isLoading } = useInventory(location);
  const { data: backstockInventory = [] } = useInventory('backstock');
  const { data: bulkInventory = [] } = useInventory('bulk');
  const { data: herbs = [] } = useHerbs();
  const { data: premadeTinctures = [] } = usePremadeTinctures();
  const { data: tinctureBatches = [] } = useTinctureBatches();
  const addInventory = useAddInventory();
  const updateInventory = useUpdateInventory();
  const deleteInventory = useDeleteInventory();
  const updateHerb = useUpdateHerb();
  const pressBatch = usePressBatch();
  const updateTinctureBatch = useUpdateTinctureBatch();
  const setInventoryStatus = useSetInventoryStatusForHerb();

  // Maps for batch badge lookup (only used when showBatchInfo is on)
  const { activeBatchByHerbId, maceratingBatchByHerbId, batchById } = useMemo(() => {
    const active = new Map<string, TinctureBatch>();
    const macerating = new Map<string, TinctureBatch>();
    const byId = new Map<string, TinctureBatch>();
    for (const batch of tinctureBatches) {
      byId.set(batch.id, batch);
      if (batch.status === 'active') active.set(batch.herb_id, batch);
      if (batch.status === 'macerating') macerating.set(batch.herb_id, batch);
    }
    return { activeBatchByHerbId: active, maceratingBatchByHerbId: macerating, batchById: byId };
  }, [tinctureBatches]);

  const herbHasBackstock = (item: InventoryItem) => {
    const match = findMatchingInventoryItem(item, backstockInventory);
    return !!match && match.status !== 'out';
  };

  // Clinic only: is this herb's matching bulk stock out? (no raw material to make a tincture from)
  const herbIsBulkOut = (item: InventoryItem) => {
    if (item.status === 'full') return false;
    const match = findMatchingInventoryItem(item, bulkInventory);
    return match?.status === 'out';
  };

  // Clinic only: is this herb on the "order premade, don't make" list?
  const herbIsPremade = (item: InventoryItem) => {
    if (!item.herbs) return false;
    return !!findHerbNameMatch(getDisplayName(item.herbs), premadeTinctures);
  };

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedHerbId, setSelectedHerbId] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<InventoryStatus>('low');
  const [addSearch, setAddSearch] = useState('');
  const [addSize, setAddSize] = useState(''); // for backstock: 'small' | 'large' | ''
  const [stagedHerbs, setStagedHerbs] = useState<Array<{ id: string; name: string }>>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editStatus, setEditStatus] = useState<InventoryStatus>('full');
  const [editHerbName, setEditHerbName] = useState('');
  const [editSize, setEditSize] = useState('');
  const [showOutOnly, setShowOutOnly] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [availability, setAvailability] = useState<AvailabilityInfo[]>([]);
  const [isCheckingAvailability, setIsCheckingAvailability] = useState(false);
  const [pressItem, setPressItem] = useState<InventoryItem | null>(null);
  const [pressAlsoClinic, setPressAlsoClinic] = useState(false);
  const [pressAlsoBackstock, setPressAlsoBackstock] = useState(false);
  const [pressBackstockSize, setPressBackstockSize] = useState('');

  // Status priority for sorting (out first, then low, then full)
  const statusPriority: Record<InventoryStatus, number> = { out: 0, low: 1, full: 2 };

  // Check availability when herb selection or status changes
  // Fires for: clinic (any low/out), tincture (any selection — show if backstock exists)
  useEffect(() => {
    const checkAvail = async () => {
      const shouldCheck =
        (location === 'clinic' && selectedHerbId && (selectedStatus === 'low' || selectedStatus === 'out')) ||
        (location === 'tincture' && selectedHerbId);
      if (shouldCheck) {
        setIsCheckingAvailability(true);
        try {
          const result = await checkHerbAvailability(selectedHerbId, location);
          setAvailability(result);
        } catch (error) {
          console.error('Error checking availability:', error);
          setAvailability([]);
        }
        setIsCheckingAvailability(false);
      } else {
        setAvailability([]);
      }
    };
    checkAvail();
  }, [selectedHerbId, selectedStatus, location]);
  const handleAddAllStaged = async () => {
    if (stagedHerbs.length === 0) return;
    const status: InventoryStatus = location === 'clinic' ? selectedStatus : 'full';
    const notes = location === 'backstock' && addSize && addSize !== 'untagged' ? addSize : undefined;
    await Promise.all(stagedHerbs.map(h =>
      addInventory.mutateAsync({
        herb_id: h.id,
        location,
        status,
        ...(notes ? { notes } : {}),
      })
    ));
    toast.success(`Added ${stagedHerbs.length} herb${stagedHerbs.length > 1 ? 's' : ''} to ${title}`);
    setStagedHerbs([]);
    setAddSearch('');
    setAddSize('');
    setAvailability([]);
    setIsAddDialogOpen(false);
  };

  const handleDialogClose = (open: boolean) => {
    setIsAddDialogOpen(open);
    if (!open) {
      setSelectedHerbId('');
      setSelectedStatus('low');
      setAddSearch('');
      setAddSize('');
      setStagedHerbs([]);
      setAvailability([]);
    }
  };

  const handleUpdateStatus = async (id: string, status: InventoryStatus, herbId: string, newHerbName: string, size: string) => {
    // Update herb name if changed
    const currentHerb = herbs.find(h => h.id === herbId);
    if (currentHerb && currentHerb.name !== newHerbName && newHerbName.trim()) {
      await updateHerb.mutateAsync({ id: herbId, name: newHerbName.trim() });
    }
    if (location === 'backstock') {
      await updateInventory.mutateAsync({ id, notes: (size && size !== 'untagged') ? size : null } as any);
    } else if (location !== 'tincture') {
      await updateInventory.mutateAsync({ id, status });
    }
    setEditingId(null);
  };

  const handleMarkTinctureDone = async (id: string) => {
    await updateInventory.mutateAsync({
      id,
      tincture_ready_at: new Date().toISOString()
    });
    setEditingId(null);
  };

  // PRESSED: opens a confirmation dialog before moving the herb to Clinic and/or Backstock
  const handlePress = (item: InventoryItem) => {
    setPressAlsoClinic(true);
    setPressAlsoBackstock(false);
    setPressBackstockSize('');
    setPressItem(item);
  };

  // Confirmed press: batch moves to active, the tincture inventory row is
  // deleted (tincture is done macerating), and — only if explicitly checked —
  // the herb is added/updated in Clinic as 'full' (replacing any low/out
  // status) and/or added to Backstock
  const handleConfirmPress = async () => {
    const item = pressItem;
    if (!item) return;
    try {
      const batch = maceratingBatchByHerbId.get(item.herb_id)
        ?? (item.current_batch_id ? batchById.get(item.current_batch_id) ?? null : null);
      if (batch) {
        await pressBatch.mutateAsync(batch.id);
      }
      const destinations: string[] = [];
      let bottlesUsed = 0;
      if (pressAlsoClinic) {
        await setInventoryStatus.mutateAsync({ herb_id: item.herb_id, location: 'clinic', status: 'full' });
        destinations.push('Clinic as Full');
        bottlesUsed++;
      }
      if (pressAlsoBackstock) {
        const size = pressBackstockSize && pressBackstockSize !== 'untagged' ? pressBackstockSize : null;
        await setInventoryStatus.mutateAsync({ herb_id: item.herb_id, location: 'backstock', status: 'full', notes: size });
        destinations.push('Backstock');
        bottlesUsed++;
      }
      // Decrement the batch's bottle count for bottles sent out (only when tracked)
      if (batch && bottlesUsed > 0 && batch.bottle_count != null) {
        await updateTinctureBatch.mutateAsync({
          id: batch.id,
          bottle_count: Math.max(0, batch.bottle_count - bottlesUsed),
        });
      }
      // Remove the tincture inventory row — the batch record is the permanent record now
      await deleteInventory.mutateAsync(item.id);
      const herbName = item.herbs ? getDisplayName(item.herbs) : 'Herb';
      toast.success(`${herbName} pressed${destinations.length ? ` — added to ${destinations.join(' and ')}` : ''}`);
    } catch (err: any) {
      toast.error(err.message || 'Failed to press batch');
    } finally {
      setPressItem(null);
      setPressAlsoClinic(false);
      setPressAlsoBackstock(false);
      setPressBackstockSize('');
    }
  };

  const handleUpdateTinctureDate = async (id: string, date: Date) => {
    await updateInventory.mutateAsync({ 
      id, 
      tincture_ready_at: date.toISOString() 
    });
    setEditingId(null);
  };

  const handleDelete = async (id: string) => {
    await deleteInventory.mutateAsync(id);
  };

  // Filter out herbs that are already in this location
  const existingHerbIds = inventory.map(item => item.herb_id);
  const availableHerbs = herbs.filter(herb => !existingHerbIds.includes(herb.id));

  // Autocomplete: filter available herbs by search query
  const filteredAddHerbs = useMemo(() => {
    const q = addSearch.trim().toLowerCase();
    if (!q) return availableHerbs;
    return availableHerbs.filter(h =>
      h.name.toLowerCase().includes(q) ||
      (h.common_name && h.common_name.toLowerCase().includes(q)) ||
      (h.latin_name && h.latin_name.toLowerCase().includes(q))
    );
  }, [addSearch, availableHerbs]);

  // Filter by search query and status filter, then sort by priority (for clinic) or alphabetically
  const filteredInventory = inventory
    .filter(item => {
      // Apply search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesSearch = 
          item.herbs?.name?.toLowerCase().includes(query) ||
          item.herbs?.common_name?.toLowerCase().includes(query) ||
          item.herbs?.latin_name?.toLowerCase().includes(query) ||
          item.herbs?.pinyin_name?.toLowerCase().includes(query);
        if (!matchesSearch) return false;
      }
      // Apply "out only" filter for clinic
      if (location === 'clinic' && showOutOnly && item.status !== 'out') {
        return false;
      }
      return true;
    })
    .sort((a, b) => {
      // For clinic, sort by status priority first (out → low → full), then alphabetically
      if (location === 'clinic') {
        const priorityDiff = statusPriority[a.status] - statusPriority[b.status];
        if (priorityDiff !== 0) return priorityDiff;
      }
      // Then sort alphabetically
      const nameA = a.herbs?.name?.toLowerCase() || '';
      const nameB = b.herbs?.name?.toLowerCase() || '';
      return nameA.localeCompare(nameB);
    });

  // Count of "out" items for the filter badge
  const outCount = inventory.filter(item => item.status === 'out').length;

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {icon}
            <div>
              <CardTitle className="text-lg">{title}</CardTitle>
              <p className="text-xs text-muted-foreground">{description}</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Button
              size="sm"
              variant="ghost"
              className="h-8 w-8 p-0"
              onClick={() => setIsCollapsed(c => !c)}
              title={isCollapsed ? 'Expand' : 'Collapse'}
            >
              {isCollapsed ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
            </Button>
            {location === 'clinic' && (
              <Toggle
                pressed={showOutOnly}
                onPressedChange={setShowOutOnly}
                size="sm"
                variant="outline"
                className="h-8 gap-1 data-[state=on]:bg-red-500/20 data-[state=on]:text-red-700 dark:data-[state=on]:text-red-400"
                title="Show only out-of-stock items"
              >
                <Filter className="h-3 w-3" />
                <span className="text-xs">Out{outCount > 0 && ` (${outCount})`}</span>
              </Toggle>
            )}
            <Dialog open={isAddDialogOpen} onOpenChange={handleDialogClose}>
              <DialogTrigger asChild>
                <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                  <Plus className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent onInteractOutside={(e) => e.preventDefault()} onPointerDownOutside={(e) => e.preventDefault()}>
                <DialogHeader>
                  <DialogTitle>Add to {title}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pt-4">

                  {/* Clinic: Full / Low / Out */}
                  {location === 'clinic' && (
                    <Select value={selectedStatus} onValueChange={(v) => setSelectedStatus(v as InventoryStatus)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="full">Full</SelectItem>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="out">Out</SelectItem>
                      </SelectContent>
                    </Select>
                  )}

                  {/* Backstock: Small / Large / Untagged */}
                  {location === 'backstock' && (
                    <Select value={addSize} onValueChange={setAddSize}>
                      <SelectTrigger>
                        <SelectValue placeholder="Size (optional)" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="untagged">Untagged</SelectItem>
                        <SelectItem value="small">Small</SelectItem>
                        <SelectItem value="large">Large</SelectItem>
                      </SelectContent>
                    </Select>
                  )}

                  {/* Herb autocomplete search + results — no autoFocus to avoid Radix dialog close */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 pl-9 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      placeholder="Search herbs..."
                      value={addSearch}
                      onChange={(e) => { setAddSearch(e.target.value); setSelectedHerbId(''); }}
                    />
                  </div>

                  {/* Matched herb list */}
                  {addSearch.trim().length > 0 && (
                    <div className="border rounded-md max-h-40 overflow-y-auto">
                      {filteredAddHerbs.filter(h => !stagedHerbs.find(s => s.id === h.id)).length > 0 ? (
                        filteredAddHerbs.filter(h => !stagedHerbs.find(s => s.id === h.id)).slice(0, 20).map(herb => (
                          <button
                            key={herb.id}
                            type="button"
                            className="w-full text-left px-3 py-2 text-sm hover:bg-accent transition-colors border-b last:border-b-0"
                            onPointerDown={(e) => e.preventDefault()}
                            onClick={() => {
                              setStagedHerbs(prev => [...prev, { id: herb.id, name: herb.name }]);
                              setAddSearch('');
                            }}
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
                      ) : (
                        <p className="px-3 py-2 text-sm text-muted-foreground italic">No matching herbs</p>
                      )}
                    </div>
                  )}

                  {/* Staged herbs list */}
                  {stagedHerbs.length > 0 && (
                    <div className="border rounded-md divide-y">
                      {stagedHerbs.map(h => (
                        <div key={h.id} className="flex items-center justify-between px-3 py-2 text-sm">
                          <span className="font-medium">{h.name}</span>
                          <button
                            type="button"
                            className="text-muted-foreground hover:text-destructive transition-colors"
                            onPointerDown={(e) => e.preventDefault()}
                            onClick={() => setStagedHerbs(prev => prev.filter(s => s.id !== h.id))}
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  <Button
                    className="w-full"
                    onClick={handleAddAllStaged}
                    disabled={stagedHerbs.length === 0 || addInventory.isPending}
                  >
                    {addInventory.isPending
                      ? 'Adding...'
                      : stagedHerbs.length === 0
                      ? 'Select herbs above'
                      : `Add ${stagedHerbs.length} herb${stagedHerbs.length > 1 ? 's' : ''}`}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </CardHeader>
      {!isCollapsed && <CardContent className="space-y-2 max-h-96 overflow-y-auto">
        {isLoading ? (
          <p className="text-sm text-muted-foreground">Loading...</p>
        ) : filteredInventory.length === 0 ? (
          <p className="text-sm text-muted-foreground italic">
            {searchQuery ? 'No matching herbs' : 'No items yet'}
          </p>
        ) : (
          filteredInventory.map((item) => (
            <InventoryItemRow
              key={item.id}
              item={item}
              batch={
                location === 'tincture'
                  ? maceratingBatchByHerbId.get(item.herb_id) ?? null
                  : !showBatchInfo
                  ? null
                  : (item.current_batch_id ? batchById.get(item.current_batch_id) : null) ?? activeBatchByHerbId.get(item.herb_id) ?? null
              }
              hasBackstock={location === 'clinic' && (item.status === 'low' || item.status === 'out') && herbHasBackstock(item)}
              isBulkOut={location === 'clinic' && herbIsBulkOut(item)}
              isPremade={location === 'clinic' && herbIsPremade(item)}
              isEditing={editingId === item.id}
              editStatus={editStatus}
              editHerbName={editHerbName}
              onStartEdit={() => {
                setEditingId(item.id);
                setEditStatus(item.status);
                setEditHerbName(item.herbs?.name || '');
                setEditSize(item.notes || '');
              }}
              onCancelEdit={() => setEditingId(null)}
              onSaveEdit={() => handleUpdateStatus(item.id, editStatus, item.herb_id, editHerbName, editSize)}
              onStatusChange={setEditStatus}
              onSizeChange={setEditSize}
              editSize={editSize}
              onHerbNameChange={setEditHerbName}
              onDelete={() => handleDelete(item.id)}
              onMarkDone={() => handleMarkTinctureDone(item.id)}
              onUpdateReadyDate={(date) => handleUpdateTinctureDate(item.id, date)}
              onPress={() => handlePress(item)}
              location={location}
            />
          ))
        )}
      </CardContent>}

      {/* Press confirmation dialog: lets you choose where the pressed tincture goes */}
      <Dialog open={!!pressItem} onOpenChange={(open) => { if (!open) { setPressItem(null); setPressAlsoClinic(false); setPressAlsoBackstock(false); setPressBackstockSize(''); } }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Tincture Pressed</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            {pressItem && (
              <div className="border rounded-md divide-y">
                <div className="px-3 py-2 text-sm font-medium">
                  {pressItem.herbs ? getDisplayName(pressItem.herbs) : 'Herb'}
                </div>
              </div>
            )}
            <p className="text-sm text-muted-foreground">
              The batch will be recorded. Choose where to send this tincture, if anywhere:
            </p>
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <Checkbox
                checked={pressAlsoClinic}
                onCheckedChange={(checked) => setPressAlsoClinic(checked === true)}
              />
              Add to Clinic as Full (clears any Low/Out)
            </label>
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <Checkbox
                checked={pressAlsoBackstock}
                onCheckedChange={(checked) => setPressAlsoBackstock(checked === true)}
              />
              Add to Backstock
            </label>
            {pressAlsoBackstock && (
              <Select value={pressBackstockSize} onValueChange={setPressBackstockSize}>
                <SelectTrigger>
                  <SelectValue placeholder="Size (optional)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="untagged">Untagged</SelectItem>
                  <SelectItem value="small">Small</SelectItem>
                  <SelectItem value="large">Large</SelectItem>
                </SelectContent>
              </Select>
            )}
            <Button
              className="w-full"
              onClick={handleConfirmPress}
              disabled={pressBatch.isPending || setInventoryStatus.isPending || deleteInventory.isPending}
            >
              {pressBatch.isPending || setInventoryStatus.isPending || deleteInventory.isPending
                ? 'Saving...'
                : 'Confirm'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
}

interface InventoryItemRowProps {
  item: InventoryItem;
  batch?: TinctureBatch | null;
  hasBackstock?: boolean;
  isBulkOut?: boolean;
  isPremade?: boolean;
  isEditing: boolean;
  editStatus: InventoryStatus;
  editHerbName: string;
  onStartEdit: () => void;
  onCancelEdit: () => void;
  onSaveEdit: () => void;
  onStatusChange: (status: InventoryStatus) => void;
  editSize: string;
  onSizeChange: (size: string) => void;
  onHerbNameChange: (name: string) => void;
  onDelete: () => void;
  onMarkDone: () => void;
  onUpdateReadyDate: (date: Date) => void;
  onPress: () => void;
  location: InventoryLocation;
}

function InventoryItemRow({
  item,
  batch = null,
  hasBackstock = false,
  isBulkOut = false,
  isPremade = false,
  isEditing,
  editStatus,
  editHerbName,
  onStartEdit,
  onCancelEdit,
  onSaveEdit,
  onStatusChange,
  onSizeChange,
  editSize,
  onHerbNameChange,
  onDelete,
  onMarkDone,
  onUpdateReadyDate,
  onPress,
  location,
}: InventoryItemRowProps) {
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const readyDate = item.tincture_ready_at ? new Date(item.tincture_ready_at) : null;
  const isReady = readyDate ? isPast(readyDate) : false;
  const daysLeft = readyDate ? differenceInDays(readyDate, new Date()) : null;

  return (
    <div
      className={cn(
        "rounded-lg border p-3 transition-colors",
        // Backstock is always green — presence in the list means it's in stock
        location === 'backstock'
          ? "border-green-500/30 bg-green-500/5"
          : item.status === 'full' ? "border-green-500/30 bg-green-500/5"
          : item.status === 'low' ? "border-yellow-500/30 bg-yellow-500/5"
          : "border-red-500/30 bg-red-500/5"
      )}
    >
      {/* Row 1: Name and action buttons */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex-1 min-w-0">
          {isEditing ? (
            <Input
              value={editHerbName}
              onChange={(e) => onHerbNameChange(e.target.value)}
              className="h-8 text-sm font-medium"
              placeholder="Herb name"
            />
          ) : (
            <>
              <p className="font-medium truncate">{item.herbs ? getDisplayName(item.herbs) : ''}</p>
              {item.herbs && (() => {
                const display = getDisplayName(item.herbs);
                const alts = [item.herbs.name, item.herbs.common_name, item.herbs.latin_name, item.herbs.pinyin_name]
                  .filter((n): n is string => !!n && n !== display);
                return alts.length > 0 ? (
                  <p className="text-xs text-muted-foreground truncate">{alts.join(' · ')}</p>
                ) : null;
              })()}
              {batch && (
                <p className="text-xs font-mono text-muted-foreground/80 truncate leading-tight">
                  Batch {batch.batch_number}
                </p>
              )}
            </>
          )}
          {(location === 'tincture' || location === 'clinic') && !isEditing && (() => {
            const alcohol = item.herbs ? getTinctureAlcohol(item.herbs.name) ?? (item.herbs.common_name ? getTinctureAlcohol(item.herbs.common_name) : null) : null;
            return alcohol ? (
              <span className="inline-block mt-0.5 text-xs text-foreground">
                {alcohol}
              </span>
            ) : null;
          })()}
          {location === 'tincture' && readyDate && !isEditing && (
            <div className="flex items-center gap-1 mt-1">
              <Clock className="h-3 w-3 text-muted-foreground" />
              <span className={cn(
                "text-xs",
                isReady ? "text-green-600 dark:text-green-400 font-medium" : "text-muted-foreground"
              )}>
                {isReady ? 'Ready!' : `${daysLeft} days left (${format(readyDate, 'MMM d')})`}
              </span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {isEditing ? (
            <>
              {/* Clinic: Full / Low / Out */}
              {location === 'clinic' && (
                <Select value={editStatus} onValueChange={(v) => onStatusChange(v as InventoryStatus)}>
                  <SelectTrigger className="w-24 h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="full">Full</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="out">Out</SelectItem>
                  </SelectContent>
                </Select>
              )}
              {/* Backstock: size tag stored in notes */}
              {location === 'backstock' && (
                <Select
                  value={editSize}
                  onValueChange={(v) => onSizeChange(v)}
                >
                  <SelectTrigger className="w-24 h-8">
                    <SelectValue placeholder="Size" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="untagged">Untagged</SelectItem>
                    <SelectItem value="small">Small</SelectItem>
                    <SelectItem value="large">Large</SelectItem>
                  </SelectContent>
                </Select>
              )}
              {/* Tincture: no status picker */}
              <Button size="icon" variant="ghost" className="h-8 w-8" onClick={onSaveEdit}>
                <Check className="h-4 w-4 text-green-600" />
              </Button>
              <Button size="icon" variant="ghost" className="h-8 w-8" onClick={onCancelEdit}>
                <X className="h-4 w-4 text-muted-foreground" />
              </Button>
            </>
          ) : (
            <>
              <StatusBadge status={item.status} location={location} notes={item.notes} />
              {hasBackstock && (
                <span className="rounded-full px-2 py-1 text-xs font-medium whitespace-nowrap bg-blue-500/20 text-blue-700 dark:text-blue-400">
                  Backstock
                </span>
              )}
              {isBulkOut && (
                <span className="rounded-full px-2 py-1 text-xs font-medium whitespace-nowrap bg-red-500/20 text-red-700 dark:text-red-400">
                  Bulk OUT
                </span>
              )}
              {isPremade && (
                <span className="rounded-full px-2 py-1 text-xs font-medium whitespace-nowrap bg-purple-500/20 text-purple-700 dark:text-purple-400">
                  Premade
                </span>
              )}
              {location === 'tincture' && (
                <Button
                  size="sm"
                  variant="outline"
                  className="h-8 px-2 text-xs font-semibold border-purple-400 text-purple-700 dark:text-purple-300 hover:bg-purple-500/20"
                  onClick={onPress}
                  title="Mark as pressed — archives tincture row, records batch"
                >
                  PRESSED
                </Button>
              )}
              <Button size="icon" variant="ghost" className="h-8 w-8" onClick={onStartEdit}>
                <Edit2 className="h-4 w-4 text-muted-foreground" />
              </Button>
              <Button size="icon" variant="ghost" className="h-8 w-8" onClick={onDelete}>
                <Trash2 className="h-4 w-4 text-muted-foreground" />
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Row 2: Tincture date/done controls (only when editing tinctures) */}
      {isEditing && location === 'tincture' && (
        <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border/50">
          <span className="text-xs text-muted-foreground">Ready date:</span>
          <Popover open={datePickerOpen} onOpenChange={setDatePickerOpen}>
            <PopoverTrigger asChild>
              <Button
                size="sm"
                variant="outline"
                className="h-8 gap-1 text-xs"
              >
                <CalendarIcon className="h-3 w-3" />
                {readyDate ? format(readyDate, 'MMM d') : 'Pick date'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={readyDate || undefined}
                onSelect={(date) => {
                  if (date) {
                    onUpdateReadyDate(date);
                    setDatePickerOpen(false);
                  }
                }}
                disabled={(date) =>
                  date < new Date() || date > addWeeks(new Date(), 4)
                }
                initialFocus
                className="p-3 pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
          <Button
            size="sm"
            variant={isReady ? "secondary" : "outline"}
            className={cn("h-8 gap-1 text-xs", isReady && "bg-green-500/20 text-green-700 dark:text-green-400")}
            onClick={onMarkDone}
          >
            <CheckCircle2 className="h-3 w-3" />
            {isReady ? 'Ready' : 'Mark Done'}
          </Button>
        </div>
      )}
    </div>
  );
}

function StatusBadge({ status, location, notes }: { status: InventoryStatus; location?: InventoryLocation; notes?: string | null }) {
  if (location === 'backstock') {
    const label = notes === 'small' ? 'Small' : notes === 'large' ? 'Large' : 'In Stock';
    return (
      <span className="rounded-full px-2 py-1 text-xs font-medium whitespace-nowrap bg-green-500/20 text-green-700 dark:text-green-400">
        {label}
      </span>
    );
  }
  return (
    <span
      className={cn(
        "rounded-full px-2 py-1 text-xs font-medium whitespace-nowrap",
        status === 'full' && "bg-green-500/20 text-green-700 dark:text-green-400",
        status === 'low' && "bg-yellow-500/20 text-yellow-700 dark:text-yellow-400",
        (status === 'out' || status === 'ordered') && "bg-red-500/20 text-red-700 dark:text-red-400"
      )}
    >
      {status === 'full' ? 'Full' : status === 'low' ? 'Low' : status === 'ordered' ? 'Ordered' : 'Out'}
    </span>
  );
}
