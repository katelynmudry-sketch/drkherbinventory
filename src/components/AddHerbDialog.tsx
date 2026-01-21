import { useState } from 'react';
import { Plus, Leaf } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
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

export function AddHerbDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [herbsText, setHerbsText] = useState('');
  const [location, setLocation] = useState<InventoryLocation>('clinic');
  const [status, setStatus] = useState<InventoryStatus>('low');
  const [isProcessing, setIsProcessing] = useState(false);
  
  const { data: existingHerbs } = useHerbs();
  const addHerb = useAddHerb();
  const addInventory = useAddInventory();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!herbsText.trim()) return;

    // Parse herbs from comma-separated text
    const herbNames = herbsText
      .split(/,|and/)
      .map(name => name.trim())
      .filter(name => name.length > 0)
      .map(name => name.charAt(0).toUpperCase() + name.slice(1).toLowerCase());

    if (herbNames.length === 0) {
      toast.error('Please enter at least one herb name');
      return;
    }

    setIsProcessing(true);
    let successCount = 0;
    let errorCount = 0;

    for (const herbName of herbNames) {
      try {
        // Check if herb already exists
        let herb = existingHerbs?.find(
          h => h.name.toLowerCase() === herbName.toLowerCase()
        );
        
        // Create herb if it doesn't exist
        if (!herb) {
          herb = await addHerb.mutateAsync({ name: herbName });
        }
        
        // Add to inventory
        await addInventory.mutateAsync({
          herb_id: herb.id,
          location,
          status,
        });
        
        successCount++;
      } catch (error: any) {
        if (error?.code === '23505') {
          toast.error(`${herbName} already exists in ${location}`);
        } else {
          console.error(`Failed to add ${herbName}:`, error);
        }
        errorCount++;
      }
    }

    setIsProcessing(false);
    
    if (successCount > 0) {
      toast.success(`Added ${successCount} herb${successCount > 1 ? 's' : ''} to ${location} as ${status}`);
      setHerbsText('');
      setIsOpen(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
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
            Add Herbs to Inventory
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Location</Label>
              <Select value={location} onValueChange={(v) => setLocation(v as InventoryLocation)}>
                <SelectTrigger className="bg-background">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-background z-50">
                  <SelectItem value="clinic">Clinic</SelectItem>
                  <SelectItem value="backstock">Backstock</SelectItem>
                  <SelectItem value="tincture">Tincture</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={status} onValueChange={(v) => setStatus(v as InventoryStatus)}>
                <SelectTrigger className="bg-background">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-background z-50">
                  <SelectItem value="full">Full</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="out">Out</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="herbs">Herbs (comma-separated)</Label>
            <Textarea
              id="herbs"
              placeholder="e.g., Grapefruit, Thyme, Sage, Rosemary"
              value={herbsText}
              onChange={(e) => setHerbsText(e.target.value)}
              rows={3}
              className="resize-none"
            />
            <p className="text-xs text-muted-foreground">
              Enter multiple herbs separated by commas
            </p>
          </div>
          
          <Button type="submit" className="w-full" disabled={isProcessing || !herbsText.trim()}>
            {isProcessing ? 'Adding...' : 'Add Herbs'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
