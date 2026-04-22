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
import { useAddHerb, useAddInventory, useHerbs, InventoryLocation, InventoryStatus } from '@/hooks/useInventory';
import { toast } from 'sonner';

const STATUS_OPTIONS: Record<InventoryLocation, { value: string; label: string }[]> = {
  clinic:        [{ value: 'low', label: 'Low' }, { value: 'out', label: 'Out' }],
  backstock:     [{ value: 'small', label: 'Small' }, { value: 'large', label: 'Large' }],
  tincture:      [],
  bulk:          [{ value: 'full', label: 'Full' }, { value: 'low', label: 'Low' }, { value: 'out', label: 'Out' }],
  bulk_backstock:[{ value: 'full', label: 'Full' }, { value: 'low', label: 'Low' }, { value: 'out', label: 'Out' }],
};

const DEFAULT_STATUS: Record<InventoryLocation, string> = {
  clinic:        'low',
  backstock:     'untagged',
  tincture:      'full',
  bulk:          'full',
  bulk_backstock:'full',
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
  const [staged, setStaged] = useState<StagedHerb[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const { data: existingHerbs = [] } = useHerbs();
  const addHerb = useAddHerb();
  const addInventory = useAddInventory();

  const handleLocationChange = (v: InventoryLocation) => {
    setLocation(v);
    setStatus(DEFAULT_STATUS[v]);
  };

  const filteredHerbs = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return existingHerbs;
    return existingHerbs.filter(h =>
      h.name.toLowerCase().includes(q) ||
      (h.common_name && h.common_name.toLowerCase().includes(q)) ||
      (h.latin_name && h.latin_name.toLowerCase().includes(q))
    );
  }, [search, existingHerbs]);

  const exactMatch = existingHerbs.find(
    h => h.name.toLowerCase() === search.trim().toLowerCase()
  );
  const isNewHerb = search.trim().length > 0 && !exactMatch && filteredHerbs.length === 0;

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

  const handleConfirm = async () => {
    if (staged.length === 0) return;
    setIsProcessing(true);

    let successCount = 0;
    for (const entry of staged) {
      try {
        let herb = existingHerbs.find(h => h.name.toLowerCase() === entry.name.toLowerCase());
        if (!herb) {
          herb = await addHerb.mutateAsync({ name: entry.name });
        }

        const inventoryStatus: InventoryStatus = location === 'backstock' ? 'full' : (status as InventoryStatus) || 'full';
        const notes = location === 'backstock' && status && status !== 'untagged' ? status : undefined;

        await addInventory.mutateAsync({
          herb_id: herb.id,
          location,
          status: inventoryStatus,
          ...(notes ? { notes } : {}),
        });

        successCount++;
      } catch (error: any) {
        if (error?.code === '23505') {
          toast.error(`${entry.name} already exists in ${location}`);
        } else {
          toast.error(`Failed to add ${entry.name}`);
          console.error(error);
        }
      }
    }

    if (successCount > 0) {
      toast.success(`Added ${successCount} herb${successCount > 1 ? 's' : ''} to ${location}`);
    }

    setStaged([]);
    setSearch('');
    setStatus(DEFAULT_STATUS[location]);
    setIsProcessing(false);
    setIsOpen(false);
  };

  const handleClose = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      setSearch('');
      setStaged([]);
      setStatus(DEFAULT_STATUS[location]);
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
            Add Herb to Inventory
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 pt-2">
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
              </SelectContent>
            </Select>
          </div>

          {/* Status */}
          {location !== 'tincture' && (
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
                ) : isNewHerb ? (
                  <button
                    type="button"
                    className="w-full text-left px-3 py-2 text-sm hover:bg-accent transition-colors text-primary"
                    onClick={() => stageHerb(search.trim(), true)}
                    disabled={isProcessing}
                  >
                    <Plus className="inline h-3 w-3 mr-1" />
                    Add &ldquo;{search.trim()}&rdquo; as new herb
                  </button>
                ) : null}
              </div>
            )}

            {search.trim().length === 0 && staged.length === 0 && (
              <p className="text-xs text-muted-foreground">Start typing to search your herb list</p>
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
              ? 'Adding...'
              : staged.length === 0
              ? 'Select herbs above'
              : `Add ${staged.length} herb${staged.length > 1 ? 's' : ''} to ${location}`}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
