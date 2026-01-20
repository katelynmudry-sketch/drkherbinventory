import { useState } from 'react';
import { Plus, Leaf } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useAddHerb } from '@/hooks/useInventory';
import { toast } from 'sonner';

export function AddHerbDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState('');
  const [commonName, setCommonName] = useState('');
  const [notes, setNotes] = useState('');
  const addHerb = useAddHerb();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      await addHerb.mutateAsync({
        name: name.trim(),
        common_name: commonName.trim() || undefined,
        notes: notes.trim() || undefined,
      });
      
      toast.success(`Added ${name} to your herb list`);
      setName('');
      setCommonName('');
      setNotes('');
      setIsOpen(false);
    } catch (error) {
      toast.error('Failed to add herb');
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
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Leaf className="h-5 w-5 text-primary" />
            Add New Herb
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="name">Herb Name *</Label>
            <Input
              id="name"
              placeholder="e.g., Angelica"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="commonName">Common Name</Label>
            <Input
              id="commonName"
              placeholder="e.g., Garden Angelica"
              value={commonName}
              onChange={(e) => setCommonName(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              placeholder="Any notes about this herb..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </div>
          <Button type="submit" className="w-full" disabled={addHerb.isPending}>
            {addHerb.isPending ? 'Adding...' : 'Add Herb'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
