import { useState, useMemo } from 'react';
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
const LOW_STOCK_THRESHOLD = 0.5; // lbs
const NONE_VALUE = '__none__';

function formatLbs(qty: number): string {
  return String(qty);
}

export function BulkInventorySection() {
  const { data: inventory = [], isLoading } = useInventory('bulk');
  const { data: backstockInventory = [] } = useInventory('backstock');
  const { data: herbs = [] } = useHerbs();
  const addInventory = useAddInventory();
  const updateInventory = useUpdateInventory();
  const deleteInventory = useDeleteInventory();
  const updateHerb = useUpdateHerb();

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
  const [editNotes, setEditNotes] = useState('');
  const [showLowOnly, setShowLowOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [herbPickerOpen, setHerbPickerOpen] = useState(false);

  // Build a lookup: herb_id → backstock inventory item
  const backstockByHerbId = useMemo(() => {
    const map = new Map<string, InventoryItem>();
    for (const item of backstockInventory) {
      map.set(item.herb_id, item);
    }
    return map;
  }, [backstockInventory]);

  const handleAdd = async () => {
    if (!selectedHerbId) return;

    try {
      // Check if this herb already has a bulk record — if so, update it
      const existingBulk = inventory.find(i => i.herb_id === selectedHerbId);
      const bulkStatus = selectedQuantity <= 0.25 ? 'out' : selectedQuantity <= LOW_STOCK_THRESHOLD ? 'low' : 'full';

      if (existingBulk) {
        await updateInventory.mutateAsync({
          id: existingBulk.id,
          status: bulkStatus,
          quantity: selectedQuantity,
          notes: selectedNotes || null,
        });
      } else {
        await addInventory.mutateAsync({
          herb_id: selectedHerbId,
          location: 'bulk',
          status: bulkStatus,
          quantity: selectedQuantity,
          notes: selectedNotes || undefined,
        });
      }

      // Handle backstock
      if (selectedBackstockQty !== null) {
        const existingBackstock = backstockByHerbId.get(selectedHerbId);
        const bsStatus = selectedBackstockQty <= LOW_STOCK_THRESHOLD ? 'low' : 'full';
        if (existingBackstock) {
          await updateInventory.mutateAsync({
            id: existingBackstock.id,
            status: bsStatus,
            quantity: selectedBackstockQty,
          });
        } else {
          await addInventory.mutateAsync({
            herb_id: selectedHerbId,
            location: 'backstock',
            status: bsStatus,
            quantity: selectedBackstockQty,
          });
        }
      }

      setSelectedHerbId('');
      setSelectedQuantity(1);
      setSelectedBackstockQty(null);
      setSelectedNotes('');
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
    }
  };

  const handleUpdateItem = async (id: string, herbId: string, newHerbName: string) => {
    try {
      const currentHerb = herbs.find(h => h.id === herbId);
      if (currentHerb) {
        const nameChanged = newHerbName.trim() && currentHerb.name !== newHerbName.trim();
        const anyFieldChanged =
          nameChanged ||
          (editCommonName.trim() || null) !== currentHerb.common_name ||
          (editLatinName.trim() || null) !== currentHerb.latin_name ||
          (editPinyinName.trim() || null) !== currentHerb.pinyin_name ||
          editPreferredName !== currentHerb.preferred_name;
        if (anyFieldChanged) {
          await updateHerb.mutateAsync({
            id: herbId,
            name: newHerbName.trim() || currentHerb.name,
            common_name: editCommonName.trim() || null,
            latin_name: editLatinName.trim() || null,
            pinyin_name: editPinyinName.trim() || null,
            preferred_name: editPreferredName,
          });
        }
      }

      // Update bulk record
      const status = editQuantity <= 0.25 ? 'out' : editQuantity <= LOW_STOCK_THRESHOLD ? 'low' : 'full';
      await updateInventory.mutateAsync({
        id,
        status,
        quantity: editQuantity,
        notes: editNotes || null,
      });

      // Handle backstock quantity
      const existingBackstock = backstockByHerbId.get(herbId);
      if (editBackstockQty !== null) {
        if (existingBackstock) {
          const bsStatus = editBackstockQty <= 0.25 ? 'out' : editBackstockQty <= LOW_STOCK_THRESHOLD ? 'low' : 'full';
          await updateInventory.mutateAsync({
            id: existingBackstock.id,
            status: bsStatus,
            quantity: editBackstockQty,
          });
        } else {
          await addInventory.mutateAsync({
            herb_id: herbId,
            location: 'backstock',
            status: editBackstockQty <= LOW_STOCK_THRESHOLD ? 'low' : 'full',
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
        if (showLowOnly && (item.quantity ?? 0) > LOW_STOCK_THRESHOLD) {
          return false;
        }
        return true;
      })
      .sort((a, b) => {
        const qtyDiff = (a.quantity ?? 1) - (b.quantity ?? 1);
        if (qtyDiff !== 0) return qtyDiff;
        const nameA = a.herbs?.name?.toLowerCase() || '';
        const nameB = b.herbs?.name?.toLowerCase() || '';
        return nameA.localeCompare(nameB);
      });
  }, [inventory, searchQuery, showLowOnly]);

  const lowCount = inventory.filter(item => (item.quantity ?? 0) <= LOW_STOCK_THRESHOLD).length;
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
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add to Bulk Inventory</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
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
                        {selectedHerb ? getDisplayName(selectedHerb) : "Search or select an herb..."}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
                      <Command>
                        <CommandInput placeholder="Type to search herbs..." />
                        <CommandList>
                          <CommandEmpty>No herb found.</CommandEmpty>
                          <CommandGroup>
                            {herbs.map((herb) => {
                              const existingBulk = bulkByHerbId.get(herb.id);
                              return (
                                <CommandItem
                                  key={herb.id}
                                  value={[herb.name, herb.common_name, herb.latin_name, herb.pinyin_name].filter(Boolean).join(' ')}
                                  onSelect={() => {
                                    setSelectedHerbId(herb.id);
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
                          </CommandGroup>
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
                  disabled={!selectedHerbId || addInventory.isPending || updateInventory.isPending}
                >
                  {(addInventory.isPending || updateInventory.isPending) ? 'Saving...' : selectedHerbExistingBulk ? 'Update Bulk Inventory' : 'Add to Bulk Inventory'}
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
                backstockQty={backstock?.quantity ?? null}
                isEditing={editingId === item.id}
                editQuantity={editQuantity}
                editBackstockQty={editBackstockQty}
                editHerbName={editHerbName}
                editNotes={editNotes}
                onStartEdit={() => {
                  setEditingId(item.id);
                  setEditQuantity(item.quantity ?? 1);
                  setEditBackstockQty(backstock?.quantity ?? null);
                  setEditHerbName(item.herbs?.name || '');
                  setEditCommonName(item.herbs?.common_name || '');
                  setEditLatinName(item.herbs?.latin_name || '');
                  setEditPinyinName(item.herbs?.pinyin_name || '');
                  setEditPreferredName(item.herbs?.preferred_name ?? null);
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
                onNotesChange={setEditNotes}
                editCommonName={editCommonName}
                editLatinName={editLatinName}
                editPinyinName={editPinyinName}
                editPreferredName={editPreferredName}
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
  onNotesChange,
  onDelete,
}: BulkItemCardProps) {
  const qty = item.quantity ?? 1;
  const isLow = qty <= LOW_STOCK_THRESHOLD;

  return (
    <>
      {/* Edit dialog */}
      <Dialog open={isEditing} onOpenChange={(open) => { if (!open) onCancelEdit(); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Bulk Herb</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
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
          isLow ? "border-yellow-500/30 bg-yellow-500/5" : "border-green-500/30 bg-green-500/5"
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
            <LbsBadge qty={qty} />
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

function LbsBadge({ qty }: { qty: number }) {
  const isOut = qty <= 0.25;
  const isLow = !isOut && qty <= LOW_STOCK_THRESHOLD;
  return (
    <span
      className={cn(
        "rounded-full px-2 py-1 text-xs font-medium whitespace-nowrap",
        isOut
          ? "bg-red-500/20 text-red-700 dark:text-red-400"
          : isLow
          ? "bg-yellow-500/20 text-yellow-700 dark:text-yellow-400"
          : "bg-green-500/20 text-green-700 dark:text-green-400"
      )}
    >
      {isOut ? 'OUT' : `${formatLbs(qty)} lb`}
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

  // herbName → existing bulk record
  const existingByName = useMemo(() => {
    const map = new Map<string, InventoryItem>();
    for (const item of inventory) {
      if (item.herbs?.name) map.set(item.herbs.name, item);
    }
    return map;
  }, [inventory]);

  // herbName → existing backstock record
  const backstockByName = useMemo(() => {
    const map = new Map<string, InventoryItem>();
    for (const item of backstockInventory) {
      if (item.herbs?.name) map.set(item.herbs.name, item);
    }
    return map;
  }, [backstockInventory]);

  // herbName → herb record (for herb_id)
  const herbByName = useMemo(() => {
    const map = new Map<string, Herb>();
    for (const h of herbs) map.set(h.name, h);
    return map;
  }, [herbs]);

  // herbName → selected bulk qty (number), 'out', or null (skip)
  const [selections, setSelections] = useState<Map<string, number | 'out' | null>>(() => {
    const initial = new Map<string, number | 'out' | null>();
    for (const name of HERB_LIST) {
      const existing = existingByName.get(name);
      if (existing) {
        const qty = existing.quantity ?? 0;
        initial.set(name, qty === 0 ? 'out' : qty);
      } else {
        initial.set(name, null);
      }
    }
    return initial;
  });

  // herbName → selected backstock qty (number | null — null means no change / none)
  const [backstockSelections, setBackstockSelections] = useState<Map<string, number | null>>(() => {
    const initial = new Map<string, number | null>();
    for (const name of HERB_LIST) {
      const existing = backstockByName.get(name);
      initial.set(name, existing ? (existing.quantity ?? null) : null);
    }
    return initial;
  });

  const toggle = (herbName: string, value: number | 'out') => {
    setSelections(prev => {
      const next = new Map(prev);
      next.set(herbName, prev.get(herbName) === value ? null : value);
      return next;
    });
  };

  const toggleBackstock = (herbName: string, value: number) => {
    setBackstockSelections(prev => {
      const next = new Map(prev);
      next.set(herbName, prev.get(herbName) === value ? null : value);
      return next;
    });
  };

  const markedCount = Array.from(selections.values()).filter(v => v !== null).length;

  const filteredHerbs = useMemo(() => {
    if (!search.trim()) return HERB_LIST;
    const q = search.toLowerCase();
    return HERB_LIST.filter(h => {
      if (h.toLowerCase().includes(q)) return true;
      const dbHerb = herbByName.get(h);
      if (!dbHerb) return false;
      return (
        dbHerb.common_name?.toLowerCase().includes(q) ||
        dbHerb.latin_name?.toLowerCase().includes(q) ||
        dbHerb.pinyin_name?.toLowerCase().includes(q)
      );
    });
  }, [search, herbByName]);

  const handleSave = async () => {
    const entries: Parameters<typeof bulkUpsert.mutateAsync>[0] = [];
    for (const [herbName, sel] of selections.entries()) {
      if (sel === null) continue;
      const quantity = sel === 'out' ? 0 : sel;
      const status = quantity === 0 ? 'out' : quantity <= LOW_STOCK_THRESHOLD ? 'low' : 'full';
      const herbRecord = herbByName.get(herbName);
      entries.push({ herbName, quantity, status, herbId: herbRecord?.id });
    }
    if (entries.length === 0) { toast.info('No herbs selected — nothing to save.'); return; }

    // Step 1: Save bulk quantities (critical path)
    let bulkSaveError: unknown = null;
    try {
      await bulkUpsert.mutateAsync(entries);
    } catch (e) {
      bulkSaveError = e;
    }

    if (bulkSaveError !== null) {
      const err = bulkSaveError as { message?: string };
      const msg = err?.message ?? 'Save failed';
      console.error('Stock count bulk save error:', bulkSaveError);
      toast.error(msg);
      return;
    }

    // Step 2: Save backstock quantities (non-critical — failures are tolerated)
    let backstockErrors = 0;
    for (const [herbName, bsQty] of backstockSelections.entries()) {
      if (bsQty === null) continue;
      const herbRecord = herbByName.get(herbName);
      const existingBackstock = backstockByName.get(herbName);
      const bsStatus = bsQty <= LOW_STOCK_THRESHOLD ? 'low' : 'full';
      try {
        if (existingBackstock) {
          await updateInventory.mutateAsync({ id: existingBackstock.id, quantity: bsQty, status: bsStatus });
        } else if (herbRecord) {
          await addInventory.mutateAsync({ herb_id: herbRecord.id, location: 'backstock', quantity: bsQty, status: bsStatus });
        }
      } catch {
        backstockErrors++;
      }
    }

    // Step 3: Always exit on bulk save success
    toast.success(`Saved ${entries.length} herb${entries.length !== 1 ? 's' : ''}${backstockErrors > 0 ? ` (${backstockErrors} backstock skipped)` : ''}`);
    onExit();
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
          <p className="text-sm text-muted-foreground">Tap quantities for bulk and backstock. Untouched herbs are skipped.</p>
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
                {herbByName.get(herbName) ? getDisplayName(herbByName.get(herbName)!) : herbName}
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
          {markedCount === 0 ? 'No herbs marked' : `${markedCount} herb${markedCount !== 1 ? 's' : ''} marked`}
        </span>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onExit}>Cancel</Button>
          <Button onClick={handleSave} disabled={bulkUpsert.isPending || markedCount === 0}>
            {bulkUpsert.isPending ? 'Saving...' : 'Save Stock Count'}
          </Button>
        </div>
      </div>
    </div>
  );
}
