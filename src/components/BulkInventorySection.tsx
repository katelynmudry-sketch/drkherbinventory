import { useState, useMemo } from 'react';
import { Plus, Trash2, Edit2, Check, X, Filter, Search, Package2 } from 'lucide-react';
import { Toggle } from '@/components/ui/toggle';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
  InventoryStatus,
  InventoryItem,
} from '@/hooks/useInventory';
import { cn } from '@/lib/utils';

export function BulkInventorySection() {
  const { data: inventory = [], isLoading } = useInventory('bulk');
  const { data: herbs = [] } = useHerbs();
  const addInventory = useAddInventory();
  const updateInventory = useUpdateInventory();
  const deleteInventory = useDeleteInventory();
  const updateHerb = useUpdateHerb();

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedHerbId, setSelectedHerbId] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<InventoryStatus>('full');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editStatus, setEditStatus] = useState<InventoryStatus>('full');
  const [editHerbName, setEditHerbName] = useState('');
  const [showOutOnly, setShowOutOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Status priority for sorting (out first, then low, then full)
  const statusPriority: Record<InventoryStatus, number> = { out: 0, low: 1, full: 2 };

  const handleAdd = async () => {
    if (!selectedHerbId) return;
    
    await addInventory.mutateAsync({
      herb_id: selectedHerbId,
      location: 'bulk',
      status: selectedStatus,
    });
    
    setSelectedHerbId('');
    setSelectedStatus('full');
    setIsAddDialogOpen(false);
  };

  const handleDialogClose = (open: boolean) => {
    setIsAddDialogOpen(open);
    if (!open) {
      setSelectedHerbId('');
      setSelectedStatus('full');
    }
  };

  const handleUpdateStatus = async (id: string, status: InventoryStatus, herbId: string, newHerbName: string) => {
    const currentHerb = herbs.find(h => h.id === herbId);
    if (currentHerb && currentHerb.name !== newHerbName && newHerbName.trim()) {
      await updateHerb.mutateAsync({ id: herbId, name: newHerbName.trim() });
    }
    await updateInventory.mutateAsync({ id, status });
    setEditingId(null);
  };

  const handleDelete = async (id: string) => {
    await deleteInventory.mutateAsync(id);
  };

  // Filter out herbs that are already in bulk
  const existingHerbIds = inventory.map(item => item.herb_id);
  const availableHerbs = herbs.filter(herb => !existingHerbIds.includes(herb.id));

  // Filter by search query and status filter, then sort
  const filteredInventory = useMemo(() => {
    return inventory
      .filter(item => {
        if (searchQuery) {
          const query = searchQuery.toLowerCase();
          const matchesSearch = 
            item.herbs?.name?.toLowerCase().includes(query) ||
            item.herbs?.common_name?.toLowerCase().includes(query);
          if (!matchesSearch) return false;
        }
        if (showOutOnly && item.status !== 'out') {
          return false;
        }
        return true;
      })
      .sort((a, b) => {
        const priorityDiff = statusPriority[a.status] - statusPriority[b.status];
        if (priorityDiff !== 0) return priorityDiff;
        const nameA = a.herbs?.name?.toLowerCase() || '';
        const nameB = b.herbs?.name?.toLowerCase() || '';
        return nameA.localeCompare(nameB);
      });
  }, [inventory, searchQuery, showOutOnly]);

  const outCount = inventory.filter(item => item.status === 'out').length;
  const lowCount = inventory.filter(item => item.status === 'low').length;
  const totalCount = inventory.length;

  return (
    <div className="space-y-4">
      {/* Header with stats */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-500/10">
            <Package2 className="h-5 w-5 text-amber-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold">Bulk Herb Inventory</h2>
            <p className="text-sm text-muted-foreground">
              {totalCount} herbs • {lowCount} low • {outCount} out
            </p>
          </div>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={handleDialogClose}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add Herb
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add to Bulk Inventory</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <Select value={selectedHerbId} onValueChange={setSelectedHerbId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select an herb" />
                </SelectTrigger>
                <SelectContent>
                  {availableHerbs.map((herb) => (
                    <SelectItem key={herb.id} value={herb.id}>
                      {herb.name}
                      {herb.common_name && ` (${herb.common_name})`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={selectedStatus} onValueChange={(v) => setSelectedStatus(v as InventoryStatus)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="full">Full</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="out">Out</SelectItem>
                </SelectContent>
              </Select>
              
              <Button
                className="w-full"
                onClick={handleAdd}
                disabled={!selectedHerbId || addInventory.isPending}
              >
                {addInventory.isPending ? 'Adding...' : 'Add to Bulk Inventory'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
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
          pressed={showOutOnly}
          onPressedChange={setShowOutOnly}
          variant="outline"
          className="gap-1 data-[state=on]:bg-red-500/20 data-[state=on]:text-red-700 dark:data-[state=on]:text-red-400"
        >
          <Filter className="h-4 w-4" />
          Out Only{outCount > 0 && ` (${outCount})`}
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
          filteredInventory.map((item) => (
            <BulkItemCard
              key={item.id}
              item={item}
              isEditing={editingId === item.id}
              editStatus={editStatus}
              editHerbName={editHerbName}
              onStartEdit={() => {
                setEditingId(item.id);
                setEditStatus(item.status);
                setEditHerbName(item.herbs?.name || '');
              }}
              onCancelEdit={() => setEditingId(null)}
              onSaveEdit={() => handleUpdateStatus(item.id, editStatus, item.herb_id, editHerbName)}
              onStatusChange={setEditStatus}
              onHerbNameChange={setEditHerbName}
              onDelete={() => handleDelete(item.id)}
            />
          ))
        )}
      </div>
    </div>
  );
}

interface BulkItemCardProps {
  item: InventoryItem;
  isEditing: boolean;
  editStatus: InventoryStatus;
  editHerbName: string;
  onStartEdit: () => void;
  onCancelEdit: () => void;
  onSaveEdit: () => void;
  onStatusChange: (status: InventoryStatus) => void;
  onHerbNameChange: (name: string) => void;
  onDelete: () => void;
}

function BulkItemCard({
  item,
  isEditing,
  editStatus,
  editHerbName,
  onStartEdit,
  onCancelEdit,
  onSaveEdit,
  onStatusChange,
  onHerbNameChange,
  onDelete,
}: BulkItemCardProps) {
  return (
    <Card
      className={cn(
        "transition-colors",
        item.status === 'full' && "border-green-500/30 bg-green-500/5",
        item.status === 'low' && "border-yellow-500/30 bg-yellow-500/5",
        item.status === 'out' && "border-red-500/30 bg-red-500/5"
      )}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            {isEditing ? (
              <Input
                value={editHerbName}
                onChange={(e) => onHerbNameChange(e.target.value)}
                className="h-8 text-sm font-medium mb-2"
                placeholder="Herb name"
              />
            ) : (
              <>
                <p className="font-medium truncate">{item.herbs?.name}</p>
                {item.herbs?.common_name && (
                  <p className="text-xs text-muted-foreground truncate">{item.herbs.common_name}</p>
                )}
              </>
            )}
          </div>
          <StatusBadge status={item.status} />
        </div>

        <div className="flex items-center justify-end gap-1 mt-3">
          {isEditing ? (
            <>
              <Select value={editStatus} onValueChange={(v) => onStatusChange(v as InventoryStatus)}>
                <SelectTrigger className="w-20 h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="full">Full</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="out">Out</SelectItem>
                </SelectContent>
              </Select>
              <Button size="icon" variant="ghost" className="h-8 w-8" onClick={onSaveEdit}>
                <Check className="h-4 w-4 text-green-600" />
              </Button>
              <Button size="icon" variant="ghost" className="h-8 w-8" onClick={onCancelEdit}>
                <X className="h-4 w-4 text-muted-foreground" />
              </Button>
            </>
          ) : (
            <>
              <Button size="icon" variant="ghost" className="h-8 w-8" onClick={onStartEdit}>
                <Edit2 className="h-4 w-4 text-muted-foreground" />
              </Button>
              <Button size="icon" variant="ghost" className="h-8 w-8" onClick={onDelete}>
                <Trash2 className="h-4 w-4 text-muted-foreground" />
              </Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function StatusBadge({ status }: { status: InventoryStatus }) {
  return (
    <span
      className={cn(
        "rounded-full px-2 py-1 text-xs font-medium whitespace-nowrap",
        status === 'full' && "bg-green-500/20 text-green-700 dark:text-green-400",
        status === 'low' && "bg-yellow-500/20 text-yellow-700 dark:text-yellow-400",
        status === 'out' && "bg-red-500/20 text-red-700 dark:text-red-400"
      )}
    >
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}
