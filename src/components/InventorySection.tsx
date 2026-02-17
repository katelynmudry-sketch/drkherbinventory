import { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, Check, X, Clock, Filter, CheckCircle2, CalendarIcon } from 'lucide-react';
import { Toggle } from '@/components/ui/toggle';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
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
  InventoryLocation,
  InventoryStatus,
  InventoryItem,
} from '@/hooks/useInventory';
import { checkHerbAvailability, AvailabilityInfo } from '@/hooks/useInventoryCheck';
import { AvailabilityAlert } from '@/components/AvailabilityAlert';
import { cn } from '@/lib/utils';
import { format, differenceInDays, isPast, addWeeks } from 'date-fns';

interface InventorySectionProps {
  location: InventoryLocation;
  title: string;
  icon: React.ReactNode;
  description: string;
  searchQuery?: string;
}

export function InventorySection({ location, title, icon, description, searchQuery = '' }: InventorySectionProps) {
  const { data: inventory = [], isLoading } = useInventory(location);
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
  const [availability, setAvailability] = useState<AvailabilityInfo[]>([]);
  const [isCheckingAvailability, setIsCheckingAvailability] = useState(false);

  // Status priority for sorting (out first, then low, then full)
  const statusPriority: Record<InventoryStatus, number> = { out: 0, low: 1, full: 2 };

  // Check availability when herb selection or status changes (for clinic low/out)
  useEffect(() => {
    const checkAvail = async () => {
      if (location === 'clinic' && selectedHerbId && (selectedStatus === 'low' || selectedStatus === 'out')) {
        setIsCheckingAvailability(true);
        try {
          const result = await checkHerbAvailability(selectedHerbId, 'clinic');
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
  const handleAdd = async () => {
    if (!selectedHerbId) return;
    
    await addInventory.mutateAsync({
      herb_id: selectedHerbId,
      location,
      status: location === 'clinic' ? selectedStatus : 'full',
    });
    
    setSelectedHerbId('');
    setSelectedStatus('full');
    setAvailability([]);
    setIsAddDialogOpen(false);
  };

  const handleDialogClose = (open: boolean) => {
    setIsAddDialogOpen(open);
    if (!open) {
      setSelectedHerbId('');
      setSelectedStatus('full');
      setAvailability([]);
    }
  };

  const handleUpdateStatus = async (id: string, status: InventoryStatus, herbId: string, newHerbName: string) => {
    // Update herb name if changed
    const currentHerb = herbs.find(h => h.id === herbId);
    if (currentHerb && currentHerb.name !== newHerbName && newHerbName.trim()) {
      await updateHerb.mutateAsync({ id: herbId, name: newHerbName.trim() });
    }
    // Only update status for non-tincture locations
    if (location !== 'tincture') {
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

  // Filter by search query and status filter, then sort by priority (for clinic) or alphabetically
  const filteredInventory = inventory
    .filter(item => {
      // Apply search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesSearch = 
          item.herbs?.name?.toLowerCase().includes(query) ||
          item.herbs?.common_name?.toLowerCase().includes(query);
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
                  
                  {location === 'clinic' && (
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
                  )}
                  
                  {availability.length > 0 && selectedHerbId && (
                    <AvailabilityAlert 
                      herbName={herbs.find(h => h.id === selectedHerbId)?.name || 'This herb'} 
                      availability={availability} 
                    />
                  )}
                  
                  <Button
                    className="w-full"
                    onClick={handleAdd}
                    disabled={!selectedHerbId || addInventory.isPending || isCheckingAvailability}
                  >
                    {addInventory.isPending ? 'Adding...' : 'Add to Inventory'}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-2 max-h-96 overflow-y-auto">
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
              onMarkDone={() => handleMarkTinctureDone(item.id)}
              onUpdateReadyDate={(date) => handleUpdateTinctureDate(item.id, date)}
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
  editHerbName: string;
  onStartEdit: () => void;
  onCancelEdit: () => void;
  onSaveEdit: () => void;
  onStatusChange: (status: InventoryStatus) => void;
  onHerbNameChange: (name: string) => void;
  onDelete: () => void;
  onMarkDone: () => void;
  onUpdateReadyDate: (date: Date) => void;
  location: InventoryLocation;
}

function InventoryItemRow({
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
  onMarkDone,
  onUpdateReadyDate,
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
        item.status === 'full' && "border-green-500/30 bg-green-500/5",
        item.status === 'low' && "border-yellow-500/30 bg-yellow-500/5",
        item.status === 'out' && "border-red-500/30 bg-red-500/5"
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
              <p className="font-medium truncate">{item.herbs?.name}</p>
              {item.herbs?.common_name && (
                <p className="text-xs text-muted-foreground truncate">{item.herbs.common_name}</p>
              )}
            </>
          )}
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
              {/* Show status dropdown only for clinic */}
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
