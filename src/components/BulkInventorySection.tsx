import { useState, useMemo, useEffect } from 'react';
import { Plus, Trash2, Edit2, Check, X, Filter, Search, Package2, ChevronsUpDown, ClipboardList, Archive } from 'lucide-react';
import { Toggle } from '@/components/ui/toggle';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  useInventory,
  useHerbs,
  useAddInventory,
  useUpdateInventory,
  useDeleteInventory,
  useUpdateHerb,
  useAddHerb,
  useBulkUpsert,
  getDisplayName,
  Herb,
  InventoryItem,
} from '@/hooks/useInventory';
import { HERB_LIST } from '@/lib/herbCorrection';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { ArrowLeft } from 'lucide-react';

// Standard lb increments available in the UI
const LB_OPTIONS = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2, 2.5, 3, 4, 5];
// Compact subset shown as tap buttons in stock count mode
const STOCK_COUNT_OPTIONS = [0.25, 0.5, 1, 1.25, 1.5, 2, 3];
// Default low-stock threshold when herb has no custom value
const DEFAULT_LOW_THRESHOLD = 0.25; // lbs
// Available per-herb low threshold options
const THRESHOLD_OPTIONS = [0.25, 0.5] as const;
const NONE_VALUE = '__none__';

function formatLbs(qty: number): string {
  return String(qty);
}

function calcBulkStatus(qty: number, lowThreshold: number): 'out' | 'low' | 'full' {
  if (qty <= 0) return 'out';
  if (qty <= lowThreshold) return 'low';
  return 'full';
}

export function BulkInventorySection() {
  const { data: inventory = [], isLoading } = useInventory('bulk');
  const { data: backstockInventory = [] } = useInventory('bulk_backstock');
  const { data: herbs = [] } = useHerbs();
  const addInventory = useAddInventory();
  const updateInventory = useUpdateInventory();
  const deleteInventory = useDeleteInventory();
  const updateHerb = useUpdateHerb();
  const addHerb = useAddHerb();

  const [stockCountMode, setStockCountMode] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedHerbId, setSelectedHerbId] = useState('');
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [selectedBackstockQty, setSelectedBackstockQty] = useState<number | null>(null);
  const [selectedNotes, setSelectedNotes] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editQuantity, setEditQuantity] = useState(1);
  const [editBackstockQty, setEditBackstockQty] = useState<number | null>(null);
  const [editHerbName, setEditHerbName] = useState('');
  const [editCommonName, setEditCommonName] = useState('');
  const [editLatinName, setEditLatinName] = useState('');
  const [editPinyinName, setEditPinyinName] = useState('');
  const [editPreferredName, setEditPreferredName] = useState<'common' | 'latin' | 'pinyin' | null>(null);
  const [editLowThreshold, setEditLowThreshold] = useState<number>(DEFAULT_LOW_THRESHOLD);
  const [editNotes, setEditNotes] = useState('');
  const [showLowOnly, setShowLowOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [herbPickerOpen, setHerbPickerOpen] = useState(false);
  const [herbPickerSearch, setHerbPickerSearch] = useState('');

  // Build a lookup: herb_id → backstock inventory item
  const backstockByHerbId = useMemo(() => {
    const map = new Map<string, InventoryItem>();
    for (const item of backstockInventory) {
      map.set(item.herb_id, item);
    }
    return map;
  }, [backstockInventory]);

  const handleAdd = async () => {
    if (!selectedHerbId && !herbPickerSearch.trim()) return;

    try {
      // If no existing herb is selected but user typed a name, create a new herb first
      let resolvedHerbId = selectedHerbId;
      if (!resolvedHerbId && herbPickerSearch.trim()) {
        const newHerb = await addHerb.mutateAsync({ name: herbPickerSearch.trim() });
        resolvedHerbId = newHerb.id;
      }

      if (!resolvedHerbId) return;

      // Check if this herb already has a bulk record — if so, update it
      const existingBulk = inventory.find(i => i.herb_id === resolvedHerbId);
      const herbRecord = herbs.find(h => h.id === resolvedHerbId);
      const herbThreshold = herbRecord?.low_threshold_lb ?? DEFAULT_LOW_THRESHOLD;
      const bulkStatus = calcBulkStatus(selectedQuantity, herbThreshold);

      if (existingBulk) {
        await updateInventory.mutateAsync({
          id: existingBulk.id,
          status: bulkStatus,
          quantity: selectedQuantity,
          notes: selectedNotes || null,
        });
      } else {
        await addInventory.mutateAsync({
          herb_id: resolvedHerbId,
          location: 'bulk',
          status: bulkStatus,
          quantity: selectedQuantity,
          notes: selectedNotes || undefined,
        });
      }

      // Handle backstock
      if (selectedBackstockQty !== null) {
        const existingBackstock = backstockByHerbId.get(resolvedHerbId);
        const bsStatus = calcBulkStatus(selectedBackstockQty, DEFAULT_LOW_THRESHOLD);
        if (existingBackstock) {
          await updateInventory.mutateAsync({
            id: existingBackstock.id,
            status: bsStatus,
            quantity: selectedBackstockQty,
          });
        } else {
          await addInventory.mutateAsync({
            herb_id: resolvedHerbId,
            location: 'bulk_backstock',
            status: bsStatus,
            quantity: selectedBackstockQty,
          });
        }
      }

      setSelectedHerbId('');
      setSelectedQuantity(1);
      setSelectedBackstockQty(null);
      setSelectedNotes('');
      setHerbPickerSearch('');
      setIsAddDialogOpen(false);
      toast.success(existingBulk ? 'Bulk inventory updated' : 'Herb added to bulk inventory');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to save');
    }
  };

  const handleDialogClose = (open: boolean) => {
    setIsAddDialogOpen(open);
    if (!open) {
      setSelectedHerbId('');
      setSelectedQuantity(1);
      setSelectedBackstockQty(null);
      setSelectedNotes('');
      setHerbPickerSearch('');
    }
  };

  const handleUpdateItem = async (id: string, herbId: string, newHerbName: string) => {
    try {
      const currentHerb = herbs.find(h => h.id === herbId);
      if (currentHerb) {
        await updateHerb.mutateAsync({
          id: herbId,
          name: newHerbName.trim() || currentHerb.name,
          common_name: editCommonName.trim() || null,
          latin_name: editLatinName.trim() || null,
          pinyin_name: editPinyinName.trim() || null,
          preferred_name: editPreferredName,
        });
      }

      // Update bulk record using the herb's low threshold
      const status = calcBulkStatus(editQuantity, editLowThreshold);
      await updateInventory.mutateAsync({
        id,
        status,
        quantity: editQuantity,
        notes: editNotes || null,
      });

      // Handle backstock quantity (backstock uses default threshold)
      const existingBackstock = backstockByHerbId.get(herbId);
      if (editBackstockQty !== null) {
        if (existingBackstock) {
          await updateInventory.mutateAsync({
            id: existingBackstock.id,
            status: calcBulkStatus(editBackstockQty, DEFAULT_LOW_THRESHOLD),
            quantity: editBackstockQty,
          });
        } else {
          await addInventory.mutateAsync({
            herb_id: herbId,
            location: 'bulk_backstock',
            status: calcBulkStatus(editBackstockQty, DEFAULT_LOW_THRESHOLD),
            quantity: editBackstockQty,
          });
        }
      }

      setEditingId(null);
      toast.success('Saved');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to save changes');
    }
  };

  const handleDelete = async (id: string) => {
    await deleteInventory.mutateAsync(id);
  };

  // Build lookup for existing bulk records by herb_id (for upsert logic)
  const bulkByHerbId = useMemo(() => {
    const map = new Map<string, InventoryItem>();
    for (const item of inventory) map.set(item.herb_id, item);
    return map;
  }, [inventory]);

  // Filter and sort: low stock first, then alphabetical
  const filteredInventory = useMemo(() => {
    return inventory
      .filter(item => {
        if (searchQuery) {
          const query = searchQuery.toLowerCase();
          const matchesSearch =
            item.herbs?.name?.toLowerCase().includes(query) ||
            item.herbs?.common_name?.toLowerCase().includes(query) ||
            item.herbs?.latin_name?.toLowerCase().includes(query) ||
            item.herbs?.pinyin_name?.toLowerCase().includes(query);
          if (!matchesSearch) return false;
        }
        if (showLowOnly) {
          const threshold = Number(item.herbs?.low_threshold_lb ?? DEFAULT_LOW_THRESHOLD);
          if (Number(item.quantity ?? 0) > threshold) return false;
        }
        return true;
      })
      .sort((a, b) => {
        const qtyDiff = Number(a.quantity ?? 1) - Number(b.quantity ?? 1);
        if (qtyDiff !== 0) return qtyDiff;
        const nameA = a.herbs?.name?.toLowerCase() || '';
        const nameB = b.herbs?.name?.toLowerCase() || '';
        return nameA.localeCompare(nameB);
      });
  }, [inventory, searchQuery, showLowOnly]);

  const lowCount = inventory.filter(item => {
    const threshold = Number(item.herbs?.low_threshold_lb ?? DEFAULT_LOW_THRESHOLD);
    return Number(item.quantity ?? 0) <= threshold;
  }).length;
  const totalCount = inventory.length;

  const selectedHerb = herbs.find(h => h.id === selectedHerbId);
  const selectedHerbExistingBulk = selectedHerbId ? bulkByHerbId.get(selectedHerbId) : undefined;
  const selectedHerbExistingBackstock = selectedHerbId ? backstockByHerbId.get(selectedHerbId) : undefined;

  if (stockCountMode) {
    return (
      <BulkStockCountView
        inventory={inventory}
        backstockInventory={backstockInventory}
        herbs={herbs}
        onExit={() => setStockCountMode(false)}
      />
    );
  }

  return (
    <div className="space-y-4">
      {/* Header with stats */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-500/10">
            <Package2 className="h-5 w-5 text-amber-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold">Bulk Herb Inventory</h2>
            <p className="text-sm text-muted-foreground">
              {totalCount} herbs • {lowCount} low stock
            </p>
          </div>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button
            variant="outline"
            className="gap-2 flex-1 sm:flex-none"
            onClick={() => setStockCountMode(true)}
          >
            <ClipboardList className="h-4 w-4" />
            Stock Count
          </Button>
          <Dialog open={isAddDialogOpen} onOpenChange={handleDialogClose}>
            <DialogTrigger asChild>
              <Button className="gap-2 flex-1 sm:flex-none">
                <Plus className="h-4 w-4" />
                Add Herb
              </Button>
            </DialogTrigger>
            <DialogContent className="flex flex-col max-h-[90vh]">
              <DialogHeader className="shrink-0">
                <DialogTitle>Add to Bulk Inventory</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4 overflow-y-auto pr-1">
                <div className="space-y-2">
                  <Label>Herb</Label>
                  <Popover open={herbPickerOpen} onOpenChange={setHerbPickerOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={herbPickerOpen}
                        className="w-full justify-between font-normal"
                      >
                        {selectedHerb
                          ? getDisplayName(selectedHerb)
                          : herbPickerSearch.trim()
                          ? `"${herbPickerSearch.trim()}" (new herb)`
                          : "Search or select an herb..."}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start" side="bottom">
                      <Command shouldFilter={false}>
                        <CommandInput
                          placeholder="Type to search or add new herb..."
                          value={herbPickerSearch}
                          onValueChange={(v) => {
                            setHerbPickerSearch(v);
                            // Clear selected herb when user edits the search
                            if (selectedHerbId) setSelectedHerbId('');
                          }}
                        />
                        <CommandList className="max-h-48 overflow-y-auto">
                          {(() => {
                            const q = herbPickerSearch.toLowerCase();
                            const filtered = herbs.filter(h =>
                              !q ||
                              h.name.toLowerCase().includes(q) ||
                              h.common_name?.toLowerCase().includes(q) ||
                              h.latin_name?.toLowerCase().includes(q) ||
                              h.pinyin_name?.toLowerCase().includes(q)
                            );
                            return (
                              <>
                                {filtered.length === 0 && !herbPickerSearch.trim() && (
                                  <CommandEmpty>No herbs found.</CommandEmpty>
                                )}
                                <CommandGroup>
                                  {filtered.map((herb) => {
                                    const existingBulk = bulkByHerbId.get(herb.id);
                                    return (
                                      <CommandItem
                                        key={herb.id}
                                        value={herb.id}
                                        onSelect={() => {
                                          setSelectedHerbId(herb.id);
                                          setHerbPickerSearch('');
                                          if (existingBulk) setSelectedQuantity(existingBulk.quantity ?? 1);
                                          setHerbPickerOpen(false);
                                        }}
                                      >
                                        <Check
                                          className={cn(
                                            "mr-2 h-4 w-4",
                                            selectedHerbId === herb.id ? "opacity-100" : "opacity-0"
                                          )}
                                        />
                                        {getDisplayName(herb)}
                                        {[herb.common_name, herb.latin_name, herb.pinyin_name]
                                          .filter((n): n is string => !!n && n !== getDisplayName(herb))
                                          .map((n, i) => (
                                            <span key={i} className="ml-1 text-muted-foreground text-xs">({n})</span>
                                          ))}
                                        {existingBulk && (
                                          <span className="ml-auto text-xs text-muted-foreground">{formatLbs(existingBulk.quantity ?? 1)} lb</span>
                                        )}
                                      </CommandItem>
                                    );
                                  })}
                                  {herbPickerSearch.trim() && filtered.every(h => h.name.toLowerCase() !== herbPickerSearch.toLowerCase()) && (
                                    <CommandItem
                                      value="__create__"
                                      onSelect={() => {
                                        setSelectedHerbId('');
                                        setHerbPickerOpen(false);
                                      }}
                                    >
                                      <Plus className="mr-2 h-4 w-4 text-primary" />
                                      <span>Create <strong>"{herbPickerSearch.trim()}"</strong> as new herb</span>
                                    </CommandItem>
                                  )}
                                </CommandGroup>
                              </>
                            );
                          })()}
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label>Quantity (lbs)</Label>
                  <Select
                    value={String(selectedQuantity)}
                    onValueChange={(v) => setSelectedQuantity(Number(v))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {LB_OPTIONS.map(lb => (
                        <SelectItem key={lb} value={String(lb)}>
                          {formatLbs(lb)} lb
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center gap-1.5">
                    <Archive className="h-3.5 w-3.5 text-blue-500" />
                    Backstock qty (lbs)
                    {selectedHerbExistingBackstock && (
                      <span className="text-xs text-muted-foreground font-normal ml-1">
                        (currently {formatLbs(selectedHerbExistingBackstock.quantity ?? 0)} lb)
                      </span>
                    )}
                  </Label>
                  <Select
                    value={selectedBackstockQty !== null ? String(selectedBackstockQty) : NONE_VALUE}
                    onValueChange={(v) => setSelectedBackstockQty(v === NONE_VALUE ? null : Number(v))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={NONE_VALUE}>None</SelectItem>
                      {LB_OPTIONS.map(lb => (
                        <SelectItem key={lb} value={String(lb)}>
                          {formatLbs(lb)} lb
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Notes (optional)</Label>
                  <Textarea
                    placeholder="Add any notes about this herb..."
                    value={selectedNotes}
                    onChange={(e) => setSelectedNotes(e.target.value)}
                    rows={2}
                  />
                </div>

                {selectedHerbExistingBulk && (
                  <p className="text-xs text-amber-600 dark:text-amber-400">
                    This herb already has {formatLbs(selectedHerbExistingBulk.quantity ?? 0)} lb in bulk — saving will update it.
                  </p>
                )}

                <Button
                  className="w-full"
                  onClick={handleAdd}
                  disabled={(!selectedHerbId && !herbPickerSearch.trim()) || addInventory.isPending || updateInventory.isPending || addHerb.isPending}
                >
                  {(addInventory.isPending || updateInventory.isPending || addHerb.isPending)
                    ? 'Saving...'
                    : selectedHerbExistingBulk
                    ? 'Update Bulk Inventory'
                    : !selectedHerbId && herbPickerSearch.trim()
                    ? `Add "${herbPickerSearch.trim()}" to Bulk`
                    : 'Add to Bulk Inventory'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Search and filter bar */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search bulk herbs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Toggle
          pressed={showLowOnly}
          onPressedChange={setShowLowOnly}
          variant="outline"
          className="gap-1 data-[state=on]:bg-yellow-500/20 data-[state=on]:text-yellow-700 dark:data-[state=on]:text-yellow-400"
        >
          <Filter className="h-4 w-4" />
          Low Stock{lowCount > 0 && ` (${lowCount})`}
        </Toggle>
      </div>

      {/* Inventory grid */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {isLoading ? (
          <p className="text-sm text-muted-foreground col-span-full">Loading...</p>
        ) : filteredInventory.length === 0 ? (
          <p className="text-sm text-muted-foreground italic col-span-full">
            {searchQuery ? 'No matching herbs' : 'No bulk herbs yet. Add some to get started!'}
          </p>
        ) : (
          filteredInventory.map((item) => {
            const backstock = backstockByHerbId.get(item.herb_id);
            return (
              <BulkItemCard
                key={item.id}
                item={item}
                backstockQty={backstock?.quantity != null ? Number(backstock.quantity) : null}
                isEditing={editingId === item.id}
                editQuantity={editQuantity}
                editBackstockQty={editBackstockQty}
                editHerbName={editHerbName}
                editNotes={editNotes}
                onStartEdit={() => {
                  setEditingId(item.id);
                  setEditQuantity(Number(item.quantity ?? 1));
                  setEditBackstockQty(backstock?.quantity != null ? Number(backstock.quantity) : null);
                  setEditHerbName(item.herbs?.name || '');
                  setEditCommonName(item.herbs?.common_name || '');
                  setEditLatinName(item.herbs?.latin_name || '');
                  setEditPinyinName(item.herbs?.pinyin_name || '');
                  setEditPreferredName(item.herbs?.preferred_name ?? null);
                  setEditLowThreshold(item.herbs?.low_threshold_lb ?? DEFAULT_LOW_THRESHOLD);
                  setEditNotes(item.notes || '');
                }}
                onCancelEdit={() => setEditingId(null)}
                onSaveEdit={() => handleUpdateItem(item.id, item.herb_id, editHerbName)}
                onQuantityChange={setEditQuantity}
                onBackstockQtyChange={setEditBackstockQty}
                onHerbNameChange={setEditHerbName}
                onCommonNameChange={setEditCommonName}
                onLatinNameChange={setEditLatinName}
                onPinyinNameChange={setEditPinyinName}
                onPreferredNameChange={setEditPreferredName}
                onLowThresholdChange={setEditLowThreshold}
                onNotesChange={setEditNotes}
                editCommonName={editCommonName}
                editLatinName={editLatinName}
                editPinyinName={editPinyinName}
                editPreferredName={editPreferredName}
                editLowThreshold={editLowThreshold}
                onDelete={() => handleDelete(item.id)}
              />
            );
          })
        )}
      </div>
    </div>
  );
}

interface BulkItemCardProps {
  item: InventoryItem;
  backstockQty: number | null;
  isEditing: boolean;
  editQuantity: number;
  editBackstockQty: number | null;
  editHerbName: string;
  editCommonName: string;
  editLatinName: string;
  editPinyinName: string;
  editPreferredName: 'common' | 'latin' | 'pinyin' | null;
  editLowThreshold: number;
  editNotes: string;
  onStartEdit: () => void;
  onCancelEdit: () => void;
  onSaveEdit: () => void;
  onQuantityChange: (qty: number) => void;
  onBackstockQtyChange: (qty: number | null) => void;
  onHerbNameChange: (name: string) => void;
  onCommonNameChange: (name: string) => void;
  onLatinNameChange: (name: string) => void;
  onPinyinNameChange: (name: string) => void;
  onPreferredNameChange: (val: 'common' | 'latin' | 'pinyin' | null) => void;
  onLowThresholdChange: (val: number) => void;
  onNotesChange: (notes: string) => void;
  onDelete: () => void;
}

function BulkItemCard({
  item,
  backstockQty,
  isEditing,
  editQuantity,
  editBackstockQty,
  editHerbName,
  editCommonName,
  editLatinName,
  editPinyinName,
  editPreferredName,
  editLowThreshold,
  editNotes,
  onStartEdit,
  onCancelEdit,
  onSaveEdit,
  onQuantityChange,
  onBackstockQtyChange,
  onHerbNameChange,
  onCommonNameChange,
  onLatinNameChange,
  onPinyinNameChange,
  onPreferredNameChange,
  onLowThresholdChange,
  onNotesChange,
  onDelete,
}: BulkItemCardProps) {
  const qty = Number(item.quantity ?? 1);
  const herbThreshold = Number(item.herbs?.low_threshold_lb ?? DEFAULT_LOW_THRESHOLD);
  const isOrdered = item.status === 'ordered';
  const isLow = !isOrdered && qty > 0 && qty <= herbThreshold;
  const isOut = !isOrdered && qty <= 0;

  return (
    <>
      {/* Edit dialog */}
      <Dialog open={isEditing} onOpenChange={(open) => { if (!open) onCancelEdit(); }}>
        <DialogContent className="flex flex-col max-h-[90vh]">
          <DialogHeader className="shrink-0">
            <DialogTitle>Edit Bulk Herb</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2 overflow-y-auto pr-1">
            <div className="space-y-2">
              <Label>Primary name</Label>
              <Input
                value={editHerbName}
                onChange={(e) => onHerbNameChange(e.target.value)}
                placeholder="e.g. Althea"
              />
            </div>
            <div className="space-y-2">
              <Label>Common name (optional)</Label>
              <Input
                value={editCommonName}
                onChange={(e) => onCommonNameChange(e.target.value)}
                placeholder="e.g. Marshmallow"
              />
            </div>
            <div className="space-y-2">
              <Label>Latin / botanical name (optional)</Label>
              <Input
                value={editLatinName}
                onChange={(e) => onLatinNameChange(e.target.value)}
                placeholder="e.g. Althaea officinalis"
              />
            </div>
            <div className="space-y-2">
              <Label>Pinyin name (optional)</Label>
              <Input
                value={editPinyinName}
                onChange={(e) => onPinyinNameChange(e.target.value)}
                placeholder="e.g. Huang Qi"
              />
            </div>
            <div className="space-y-2">
              <Label>Display name</Label>
              <Select
                value={editPreferredName ?? '__default__'}
                onValueChange={(v) => onPreferredNameChange(v === '__default__' ? null : v as 'common' | 'latin' | 'pinyin')}
              >
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="__default__">Primary ({editHerbName || 'name'})</SelectItem>
                  {editCommonName && <SelectItem value="common">Common ({editCommonName})</SelectItem>}
                  {editLatinName && <SelectItem value="latin">Latin ({editLatinName})</SelectItem>}
                  {editPinyinName && <SelectItem value="pinyin">Pinyin ({editPinyinName})</SelectItem>}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Bulk qty (lbs)</Label>
              <Select
                value={String(editQuantity)}
                onValueChange={(v) => onQuantityChange(Number(v))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {LB_OPTIONS.map(lb => (
                    <SelectItem key={lb} value={String(lb)}>
                      {formatLbs(lb)} lb
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-1.5">
                <Archive className="h-3.5 w-3.5 text-blue-500" />
                Backstock qty (lbs)
              </Label>
              <Select
                value={editBackstockQty !== null ? String(editBackstockQty) : NONE_VALUE}
                onValueChange={(v) => onBackstockQtyChange(v === NONE_VALUE ? null : Number(v))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={NONE_VALUE}>None</SelectItem>
                  {LB_OPTIONS.map(lb => (
                    <SelectItem key={lb} value={String(lb)}>
                      {formatLbs(lb)} lb
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Low stock alert at</Label>
              <Select
                value={String(editLowThreshold)}
                onValueChange={(v) => onLowThresholdChange(Number(v))}
              >
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {THRESHOLD_OPTIONS.map(t => (
                    <SelectItem key={t} value={String(t)}>{formatLbs(t)} lb</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Notes (optional)</Label>
              <Textarea
                placeholder="Notes..."
                value={editNotes}
                onChange={(e) => onNotesChange(e.target.value)}
                rows={2}
              />
            </div>

            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={onCancelEdit}>Cancel</Button>
              <Button onClick={onSaveEdit}>Save</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Card (always visible) */}
      <Card
        className={cn(
          "transition-colors",
          isOrdered ? "border-blue-500/30 bg-blue-500/5"
          : isOut ? "border-red-500/30 bg-red-500/5"
          : isLow ? "border-yellow-500/30 bg-yellow-500/5"
          : "border-green-500/30 bg-green-500/5"
        )}
      >
        <CardContent className="px-3 py-2">
          <div className="flex items-center gap-2 min-w-0">
            {/* Name */}
            <div className="flex-1 min-w-0">
              {item.herbs ? (() => {
                const display = getDisplayName(item.herbs);
                const alts = [item.herbs.name, item.herbs.common_name, item.herbs.latin_name, item.herbs.pinyin_name]
                  .filter((n): n is string => !!n && n !== display);
                return (
                  <>
                    <p className="text-sm font-medium truncate leading-tight">{display}</p>
                    {alts.length > 0 && (
                      <p className="text-xs text-muted-foreground truncate leading-tight">{alts.join(' · ')}</p>
                    )}
                  </>
                );
              })() : null}
            </div>
            {/* Backstock badge */}
            {backstockQty !== null && (
              <span className="flex items-center gap-0.5 text-xs font-medium text-blue-600 dark:text-blue-400 whitespace-nowrap">
                <Archive className="h-3 w-3" />
                {formatLbs(backstockQty)}
              </span>
            )}
            {/* Quantity badge */}
            <LbsBadge qty={qty} lowThreshold={herbThreshold} isOrdered={isOrdered} />
            {/* Actions */}
            <Button size="icon" variant="ghost" className="h-7 w-7 shrink-0" onClick={onStartEdit}>
              <Edit2 className="h-3.5 w-3.5 text-muted-foreground" />
            </Button>
            <Button size="icon" variant="ghost" className="h-7 w-7 shrink-0" onClick={onDelete}>
              <Trash2 className="h-3.5 w-3.5 text-muted-foreground" />
            </Button>
          </div>
          {item.notes && (
            <p className="text-xs text-muted-foreground mt-1 line-clamp-1 pl-0">{item.notes}</p>
          )}
        </CardContent>
      </Card>
    </>
  );
}

function LbsBadge({ qty, lowThreshold, isOrdered }: { qty: number; lowThreshold: number; isOrdered?: boolean }) {
  const isOut = qty <= 0;
  const isLow = !isOut && qty <= lowThreshold;
  return (
    <span
      className={cn(
        "rounded-full px-2 py-1 text-xs font-medium whitespace-nowrap",
        isOrdered
          ? "bg-blue-500/20 text-blue-700 dark:text-blue-400"
          : isOut
          ? "bg-red-500/20 text-red-700 dark:text-red-400"
          : isLow
          ? "bg-yellow-500/20 text-yellow-700 dark:text-yellow-400"
          : "bg-green-500/20 text-green-700 dark:text-green-400"
      )}
    >
      {isOrdered ? 'ORDERED' : isOut ? 'OUT' : `${formatLbs(qty)} lb`}
    </span>
  );
}

// ─── Stock Count View ────────────────────────────────────────────────────────

function BulkStockCountView({
  inventory,
  backstockInventory,
  herbs,
  onExit,
}: {
  inventory: InventoryItem[];
  backstockInventory: InventoryItem[];
  herbs: Herb[];
  onExit: () => void;
}) {
  const bulkUpsert = useBulkUpsert();
  const addInventory = useAddInventory();
  const updateInventory = useUpdateInventory();
  const [search, setSearch] = useState('');

  // herb_id → existing bulk inventory item
  const existingById = useMemo(() => {
    const map = new Map<string, InventoryItem>();
    for (const item of inventory) map.set(item.herb_id, item);
    return map;
  }, [inventory]);

  // herb_id → existing bulk_backstock inventory item
  const backstockById = useMemo(() => {
    const map = new Map<string, InventoryItem>();
    for (const item of backstockInventory) map.set(item.herb_id, item);
    return map;
  }, [backstockInventory]);

  // herbName (lowercase) → herb record — case-insensitive so HERB_LIST names match DB names
  // e.g. HERB_LIST "Black Cohosh" matches DB "Black cohosh"
  const herbByName = useMemo(() => {
    const map = new Map<string, Herb>();
    for (const h of herbs) map.set(h.name.toLowerCase(), h);
    return map;
  }, [herbs]);

  // Full list of herb names for display: HERB_LIST + any bulk inventory herbs not in it
  // Uses herbs.name as the canonical key throughout
  const allHerbNames = useMemo(() => {
    const herbListSet = new Set(HERB_LIST);
    const extra: string[] = [];
    for (const item of inventory) {
      const name = item.herbs?.name;
      if (name && !herbListSet.has(name)) extra.push(name);
    }
    return [...HERB_LIST, ...extra.sort((a, b) => a.localeCompare(b))];
  }, [inventory]);

  // herbName → selected bulk qty (keyed by herbs.name, looked up via herbByName → herb_id → existingById)
  const [selections, setSelections] = useState<Map<string, number | 'out' | null>>(() => new Map());
  // herbName → selected backstock qty
  const [backstockSelections, setBackstockSelections] = useState<Map<string, number | null>>(() => new Map());
  // Track which herbs the user has manually tapped so DB sync doesn't overwrite them
  const [userTouched, setUserTouched] = useState<Set<string>>(() => new Set());
  const [userTouchedBs, setUserTouchedBs] = useState<Set<string>>(() => new Set());

  // Sync bulk selections from DB. Looks up by herb_id to avoid name-mismatch bugs.
  useEffect(() => {
    setSelections(prev => {
      const next = new Map(prev);
      for (const name of allHerbNames) {
        if (userTouched.has(name)) continue;
        const herb = herbByName.get(name.toLowerCase());
        const existing = herb ? existingById.get(herb.id) : undefined;
        if (existing) {
          const qty = Number(existing.quantity ?? 0);
          next.set(name, qty === 0 ? 'out' : qty);
        } else if (!next.has(name)) {
          next.set(name, null);
        }
      }
      return next;
    });
  }, [existingById, allHerbNames, herbByName]); // eslint-disable-line react-hooks/exhaustive-deps

  // Sync backstock selections from DB, also by herb_id.
  useEffect(() => {
    setBackstockSelections(prev => {
      const next = new Map(prev);
      for (const name of allHerbNames) {
        if (userTouchedBs.has(name)) continue;
        const herb = herbByName.get(name.toLowerCase());
        const existing = herb ? backstockById.get(herb.id) : undefined;
        if (existing) {
          next.set(name, Number(existing.quantity ?? 0) || null);
        } else if (!next.has(name)) {
          next.set(name, null);
        }
      }
      return next;
    });
  }, [backstockById, allHerbNames, herbByName]); // eslint-disable-line react-hooks/exhaustive-deps

  const toggle = (herbName: string, value: number | 'out') => {
    setUserTouched(prev => new Set(prev).add(herbName));
    setSelections(prev => {
      const next = new Map(prev);
      next.set(herbName, prev.get(herbName) === value ? null : value);
      return next;
    });
  };

  const toggleBackstock = (herbName: string, value: number) => {
    setUserTouchedBs(prev => new Set(prev).add(herbName));
    setBackstockSelections(prev => {
      const next = new Map(prev);
      next.set(herbName, prev.get(herbName) === value ? null : value);
      return next;
    });
  };

  // Count changed bulk selections (compare against DB via herb_id)
  const changedCount = Array.from(selections.entries()).filter(([name, sel]) => {
    if (sel === null) return false;
    const herb = herbByName.get(name.toLowerCase());
    const existing = herb ? existingById.get(herb.id) : undefined;
    const dbQty = existing != null ? Number(existing.quantity ?? 0) : null;
    const dbVal: number | 'out' | null = dbQty === null ? null : dbQty === 0 ? 'out' : dbQty;
    return sel !== dbVal;
  }).length;

  const filteredHerbs = useMemo(() => {
    if (!search.trim()) return allHerbNames;
    const q = search.toLowerCase();
    return allHerbNames.filter(h => {
      if (h.toLowerCase().includes(q)) return true;
      const dbHerb = herbByName.get(h.toLowerCase());
      if (!dbHerb) return false;
      return (
        dbHerb.common_name?.toLowerCase().includes(q) ||
        dbHerb.latin_name?.toLowerCase().includes(q) ||
        dbHerb.pinyin_name?.toLowerCase().includes(q)
      );
    });
  }, [search, herbByName, allHerbNames]);

  const handleSave = async () => {
    const entries: Parameters<typeof bulkUpsert.mutateAsync>[0] = [];
    for (const [herbName, sel] of selections.entries()) {
      if (sel === null) continue;
      const herb = herbByName.get(herbName.toLowerCase());
      const existing = herb ? existingById.get(herb.id) : undefined;
      const dbQty = existing != null ? Number(existing.quantity ?? 0) : null;
      const dbVal: number | 'out' | null = dbQty === null ? null : dbQty === 0 ? 'out' : dbQty;
      if (sel === dbVal) continue;
      const quantity = sel === 'out' ? 0 : sel;
      const herbThreshold = Number(herb?.low_threshold_lb ?? DEFAULT_LOW_THRESHOLD);
      const status = calcBulkStatus(quantity, herbThreshold);
      entries.push({ herbName, quantity, status, herbId: herb?.id });
    }

    const bsEntriesToSave: Array<{ herbName: string; bsQty: number }> = [];
    for (const [herbName, bsQty] of backstockSelections.entries()) {
      if (bsQty === null) continue;
      const herb = herbByName.get(herbName.toLowerCase());
      const existing = herb ? backstockById.get(herb.id) : undefined;
      const dbBsVal = existing?.quantity != null ? Number(existing.quantity) : null;
      if (bsQty === dbBsVal) continue;
      bsEntriesToSave.push({ herbName, bsQty });
    }

    if (entries.length === 0 && bsEntriesToSave.length === 0) {
      toast.info('No changes to save.');
      return;
    }

    let bulkSaveError: unknown = null;
    try {
      await bulkUpsert.mutateAsync(entries);
    } catch (e) {
      bulkSaveError = e;
    }

    if (bulkSaveError !== null) {
      const err = bulkSaveError as { message?: string };
      console.error('Stock count bulk save error:', bulkSaveError);
      toast.error(err?.message ?? 'Save failed');
      return;
    }

    let backstockErrors = 0;
    for (const { herbName, bsQty } of bsEntriesToSave) {
      const herb = herbByName.get(herbName.toLowerCase());
      const existingBackstock = herb ? backstockById.get(herb.id) : undefined;
      const bsStatus = calcBulkStatus(bsQty, DEFAULT_LOW_THRESHOLD);
      try {
        if (existingBackstock) {
          await updateInventory.mutateAsync({ id: existingBackstock.id, quantity: bsQty, status: bsStatus });
        } else if (herb) {
          await addInventory.mutateAsync({ herb_id: herb.id, location: 'bulk_backstock', quantity: bsQty, status: bsStatus });
        }
      } catch {
        backstockErrors++;
      }
    }

    const totalSaved = entries.length + bsEntriesToSave.length - backstockErrors;
    toast.success(`Saved ${totalSaved} change${totalSaved !== 1 ? 's' : ''}${backstockErrors > 0 ? ` (${backstockErrors} backstock skipped)` : ''}`, { duration: 2000 });
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={onExit}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h2 className="text-xl font-bold">Stock Count</h2>
          <p className="text-sm text-muted-foreground">Current quantities shown selected. Tap to change, then save.</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search herbs..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
      </div>

      {/* Column headers */}
      <div className="flex items-center gap-2 px-3 py-1 text-xs font-semibold text-muted-foreground">
        <span className="w-36 flex-shrink-0">Herb</span>
        <span className="flex-1">Bulk (lbs)</span>
        <span className="flex-1 flex items-center gap-1">
          <Archive className="h-3 w-3 text-blue-500" />
          Backstock (lbs)
        </span>
      </div>

      {/* Herb list */}
      <div className="divide-y rounded-lg border bg-background">
        {filteredHerbs.map(herbName => {
          const sel = selections.get(herbName);
          const bsSel = backstockSelections.get(herbName);
          return (
            <div key={herbName} className="flex items-start gap-2 px-3 py-2">
              <span className="w-36 flex-shrink-0 text-sm font-medium pt-1">
                {herbByName.get(herbName.toLowerCase()) ? getDisplayName(herbByName.get(herbName.toLowerCase())!) : herbName}
              </span>
              {/* Bulk qty buttons */}
              <div className="flex flex-wrap gap-1 flex-1">
                {STOCK_COUNT_OPTIONS.map(opt => (
                  <button
                    key={opt}
                    onClick={() => toggle(herbName, opt)}
                    className={cn(
                      'rounded px-2 py-1 text-xs font-medium border transition-colors',
                      sel === opt
                        ? 'bg-primary text-primary-foreground border-primary'
                        : 'bg-background text-foreground border-border hover:bg-muted'
                    )}
                  >
                    {opt}
                  </button>
                ))}
                <button
                  onClick={() => toggle(herbName, 'out')}
                  className={cn(
                    'rounded px-2 py-1 text-xs font-medium border transition-colors',
                    sel === 'out'
                      ? 'bg-destructive text-destructive-foreground border-destructive'
                      : 'bg-background text-foreground border-border hover:bg-muted'
                  )}
                >
                  OUT
                </button>
                {sel !== null && (
                  <button
                    onClick={() => toggle(herbName, sel as number | 'out')}
                    className="rounded px-2 py-1 text-xs font-medium border border-border bg-background text-muted-foreground hover:bg-muted"
                    title="Clear"
                  >
                    ✕
                  </button>
                )}
              </div>
              {/* Backstock qty buttons */}
              <div className="flex flex-wrap gap-1 flex-1">
                {STOCK_COUNT_OPTIONS.map(opt => (
                  <button
                    key={opt}
                    onClick={() => toggleBackstock(herbName, opt)}
                    className={cn(
                      'rounded px-2 py-1 text-xs font-medium border transition-colors',
                      bsSel === opt
                        ? 'bg-blue-500 text-white border-blue-500'
                        : 'bg-background text-foreground border-border hover:bg-muted'
                    )}
                  >
                    {opt}
                  </button>
                ))}
                {bsSel !== null && (
                  <button
                    onClick={() => toggleBackstock(herbName, bsSel as number)}
                    className="rounded px-2 py-1 text-xs font-medium border border-border bg-background text-muted-foreground hover:bg-muted"
                    title="Clear backstock"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Sticky save bar */}
      <div className="sticky bottom-0 bg-background border-t pt-3 pb-2 flex items-center justify-between gap-4">
        <span className="text-sm text-muted-foreground">
          {changedCount === 0 ? 'No changes' : `${changedCount} change${changedCount !== 1 ? 's' : ''}`}
        </span>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onExit}>Done</Button>
          <Button onClick={handleSave} disabled={bulkUpsert.isPending || changedCount === 0}>
            {bulkUpsert.isPending ? 'Saving...' : 'Save Stock Count'}
          </Button>
        </div>
      </div>
    </div>
  );
}
