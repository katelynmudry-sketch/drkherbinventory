import { useState, useMemo } from 'react';
import { Leaf, Search, Plus } from 'lucide-react';
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
import { useAddHerb, useAddInventory, useHerbs, InventoryLocation, InventoryStatus } from '@/hooks/useInventory';
import { toast } from 'sonner';

// Status options per location
const STATUS_OPTIONS: Record<InventoryLocation, { value: string; label: string }[]> = {
  clinic:        [{ value: 'low', label: 'Low' }, { value: 'out', label: 'Out' }],
  backstock:     [{ value: 'small', label: 'Small' }, { value: 'large', label: 'Large' }],
  tincture:      [],  // no status picker for tincture
  bulk:          [{ value: 'full', label: 'Full' }, { value: 'low', label: 'Low' }, { value: 'out', label: 'Out' }],
  bulk_backstock:[{ value: 'full', label: 'Full' }, { value: 'low', label: 'Low' }, { value: 'out', label: 'Out' }],
};

const DEFAULT_STATUS: Record<InventoryLocation, string> = {
  clinic:        'low',
  backstock:     'untagged', // untagged by default
  tincture:      'full',
  bulk:          'full',
  bulk_backstock:'full',
};

export function AddHerbDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [location, setLocation] = useState<InventoryLocation>('clinic');
  const [status, setStatus] = useState<string>(DEFAULT_STATUS['clinic']);
  const [isProcessing, setIsProcessing] = useState(false);

  const { data: existingHerbs = [] } = useHerbs();
  const addHerb = useAddHerb();
  const addInventory = useAddInventory();

  // Reset status when location changes
  const handleLocationChange = (v: InventoryLocation) => {
    setLocation(v);
    setStatus(DEFAULT_STATUS[v]);
  };

  // Filter herbs by search — match on name, common_name, latin_name
  const filteredHerbs = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return existingHerbs;
    return existingHerbs.filter(h =>
      h.name.toLowerCase().includes(q) ||
      (h.common_name && h.common_name.toLowerCase().includes(q)) ||
      (h.latin_name && h.latin_name.toLowerCase().includes(q))
    );
  }, [search, existingHerbs]);

  // Check if the typed text is a new herb (no exact match)
  const exactMatch = existingHerbs.find(
    h => h.name.toLowerCase() === search.trim().toLowerCase()
  );
  const isNewHerb = search.trim().length > 0 && !exactMatch && filteredHerbs.length === 0;

  const handleAdd = async (herbName: string) => {
    if (!herbName.trim()) return;
    setIsProcessing(true);

    try {
      // Resolve or create herb
      let herb = existingHerbs.find(h => h.name.toLowerCase() === herbName.trim().toLowerCase());
      if (!herb) {
        const capitalized = herbName.trim().charAt(0).toUpperCase() + herbName.trim().slice(1);
        herb = await addHerb.mutateAsync({ name: capitalized });
      }

      // For backstock, store size in notes field; status is always 'full'
      const inventoryStatus: InventoryStatus = location === 'backstock' ? 'full' : (status as InventoryStatus) || 'full';
      const notes = location === 'backstock' && status && status !== 'untagged' ? status : undefined;

      await addInventory.mutateAsync({
        herb_id: herb.id,
        location,
        status: inventoryStatus,
        ...(notes ? { notes } : {}),
      });

      toast.success(`Added ${herb.name} to ${location}`);
      setSearch('');
      setStatus(DEFAULT_STATUS[location]);
      setIsOpen(false);
    } catch (error: any) {
      if (error?.code === '23505') {
        toast.error(`${herbName} already exists in ${location}`);
      } else {
        toast.error(`Failed to add herb`);
        console.error(error);
      }
    }
    setIsProcessing(false);
  };

  const statusOptions = STATUS_OPTIONS[location];

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { setIsOpen(open); if (!open) { setSearch(''); setStatus(DEFAULT_STATUS[location]); } }}>
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

          {/* Status — hidden for tincture, size picker for backstock */}
          {location !== 'tincture' && (
            <div className="space-y-2">
              <Label>{location === 'backstock' ? 'Size' : 'Status'}</Label>
              <Select
                value={status}
                onValueChange={setStatus}
              >
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
            <Label>Herb</Label>
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

            {/* Matched herb list */}
            {search.trim().length > 0 && (
              <div className="border rounded-md max-h-48 overflow-y-auto">
                {filteredHerbs.length > 0 ? (
                  filteredHerbs.slice(0, 20).map(herb => (
                    <button
                      key={herb.id}
                      type="button"
                      className="w-full text-left px-3 py-2 text-sm hover:bg-accent transition-colors border-b last:border-b-0"
                      onClick={() => handleAdd(herb.name)}
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
                    onClick={() => handleAdd(search.trim())}
                    disabled={isProcessing}
                  >
                    <Plus className="inline h-3 w-3 mr-1" />
                    Add &ldquo;{search.trim()}&rdquo; as new herb
                  </button>
                ) : null}
              </div>
            )}

            {search.trim().length === 0 && (
              <p className="text-xs text-muted-foreground">Start typing to search your herb list</p>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
