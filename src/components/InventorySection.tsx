import { useState } from 'react';
import { Plus, Trash2, Edit2, Check, X, Droplets, Clock } from 'lucide-react';
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
  InventoryLocation,
  InventoryStatus,
  InventoryItem,
} from '@/hooks/useInventory';
import { cn } from '@/lib/utils';
import { format, differenceInDays, isPast } from 'date-fns';

interface InventorySectionProps {
  location: InventoryLocation;
  title: string;
  icon: React.ReactNode;
  description: string;
}

export function InventorySection({ location, title, icon, description }: InventorySectionProps) {
  const { data: inventory = [], isLoading } = useInventory(location);
  const { data: herbs = [] } = useHerbs();
  const addInventory = useAddInventory();
  const updateInventory = useUpdateInventory();
  const deleteInventory = useDeleteInventory();

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedHerbId, setSelectedHerbId] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editStatus, setEditStatus] = useState<InventoryStatus>('full');

  const handleAdd = async () => {
    if (!selectedHerbId) return;
    
    await addInventory.mutateAsync({
      herb_id: selectedHerbId,
      location,
      status: 'full',
    });
    
    setSelectedHerbId('');
    setIsAddDialogOpen(false);
  };

  const handleUpdateStatus = async (id: string, status: InventoryStatus) => {
    await updateInventory.mutateAsync({ id, status });
    setEditingId(null);
  };

  const handleDelete = async (id: string) => {
    await deleteInventory.mutateAsync(id);
  };

  // Filter out herbs that are already in this location
  const existingHerbIds = inventory.map(item => item.herb_id);
  const availableHerbs = herbs.filter(herb => !existingHerbIds.includes(herb.id));

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
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" variant="outline">
                <Plus className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add to {title}</DialogTitle>
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
                <Button
                  className="w-full"
                  onClick={handleAdd}
                  disabled={!selectedHerbId || addInventory.isPending}
                >
                  {addInventory.isPending ? 'Adding...' : 'Add to Inventory'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        {isLoading ? (
          <p className="text-sm text-muted-foreground">Loading...</p>
        ) : inventory.length === 0 ? (
          <p className="text-sm text-muted-foreground italic">No items yet</p>
        ) : (
          inventory.map((item) => (
            <InventoryItemRow
              key={item.id}
              item={item}
              isEditing={editingId === item.id}
              editStatus={editStatus}
              onStartEdit={() => {
                setEditingId(item.id);
                setEditStatus(item.status);
              }}
              onCancelEdit={() => setEditingId(null)}
              onSaveEdit={() => handleUpdateStatus(item.id, editStatus)}
              onStatusChange={setEditStatus}
              onDelete={() => handleDelete(item.id)}
              location={location}
            />
          ))
        )}
      </CardContent>
    </Card>
  );
}

interface InventoryItemRowProps {
  item: InventoryItem;
  isEditing: boolean;
  editStatus: InventoryStatus;
  onStartEdit: () => void;
  onCancelEdit: () => void;
  onSaveEdit: () => void;
  onStatusChange: (status: InventoryStatus) => void;
  onDelete: () => void;
  location: InventoryLocation;
}

function InventoryItemRow({
  item,
  isEditing,
  editStatus,
  onStartEdit,
  onCancelEdit,
  onSaveEdit,
  onStatusChange,
  onDelete,
  location,
}: InventoryItemRowProps) {
  const readyDate = item.tincture_ready_at ? new Date(item.tincture_ready_at) : null;
  const isReady = readyDate ? isPast(readyDate) : false;
  const daysLeft = readyDate ? differenceInDays(readyDate, new Date()) : null;

  return (
    <div
      className={cn(
        "flex items-center justify-between rounded-lg border p-3 transition-colors",
        item.status === 'full' && "border-green-500/30 bg-green-500/5",
        item.status === 'low' && "border-yellow-500/30 bg-yellow-500/5",
        item.status === 'out' && "border-red-500/30 bg-red-500/5"
      )}
    >
      <div className="flex-1 min-w-0">
        <p className="font-medium truncate">{item.herbs?.name}</p>
        {item.herbs?.common_name && (
          <p className="text-xs text-muted-foreground truncate">{item.herbs.common_name}</p>
        )}
        {location === 'tincture' && readyDate && (
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

      <div className="flex items-center gap-2">
        {isEditing ? (
          <>
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
            <Button size="icon" variant="ghost" className="h-8 w-8" onClick={onSaveEdit}>
              <Check className="h-4 w-4 text-green-600" />
            </Button>
            <Button size="icon" variant="ghost" className="h-8 w-8" onClick={onCancelEdit}>
              <X className="h-4 w-4 text-muted-foreground" />
            </Button>
          </>
        ) : (
          <>
            <StatusBadge status={item.status} />
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
      {status === 'full' ? 'Full' : status === 'low' ? 'Low' : 'Out'}
    </span>
  );
}
