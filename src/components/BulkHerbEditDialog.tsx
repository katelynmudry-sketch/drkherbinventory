import { useMemo, useState } from 'react';
import { Sprout, SlidersHorizontal } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useBulkUpdateHerbs, getDisplayName, type Herb } from '@/hooks/useInventory';

const THRESHOLD_CHOICES = [0.25, 0.5, 0.75, 1, 1.5, 2];

type Filter = 'all' | 'harvest';

export function BulkHerbEditDialog({ herbs }: { herbs: Herb[] }) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<Filter>('all');
  const [threshold, setThreshold] = useState<number>(0.25);
  const update = useBulkUpdateHerbs();

  const sorted = useMemo(
    () => herbs.slice().sort((a, b) => getDisplayName(a).localeCompare(getDisplayName(b))),
    [herbs],
  );

  const visible = useMemo(() => {
    const q = search.trim().toLowerCase();
    return sorted.filter(h => {
      if (filter === 'harvest' && !h.harvest) return false;
      if (!q) return true;
      return [h.name, h.common_name, h.latin_name, h.pinyin_name].some(n => n?.toLowerCase().includes(q));
    });
  }, [sorted, search, filter]);

  const allVisibleSelected = visible.length > 0 && visible.every(h => selected.has(h.id));

  const toggle = (id: string) =>
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const toggleAllVisible = () =>
    setSelected(prev => {
      const next = new Set(prev);
      if (allVisibleSelected) visible.forEach(h => next.delete(h.id));
      else visible.forEach(h => next.add(h.id));
      return next;
    });

  const run = async (
    changes: { low_threshold_lb?: number; harvest?: boolean },
    message: string,
  ) => {
    const ids = Array.from(selected);
    if (ids.length === 0) {
      toast.error('Select at least one herb');
      return;
    }
    try {
      await update.mutateAsync({ ids, ...changes });
      toast.success(`${message} — ${ids.length} herb${ids.length !== 1 ? 's' : ''}`);
      setSelected(new Set());
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Update failed';
      toast.error(
        msg.includes('harvest') && msg.includes('column')
          ? 'Run the 20261110_herb_harvest.sql migration in Supabase first'
          : msg,
      );
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-1.5">
          <SlidersHorizontal className="h-3.5 w-3.5" />
          Bulk edit herbs
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Bulk edit herbs</DialogTitle>
          <DialogDescription>
            Tick herbs, then change their reorder trigger or mark them to harvest. Harvest herbs stay out of the order list.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-wrap items-center gap-2">
          <Input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search herbs…"
            className="h-8 max-w-[220px] text-sm"
          />
          {(['all', 'harvest'] as Filter[]).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-full border px-3 py-1 text-xs font-medium ${
                filter === f ? 'border-primary bg-primary text-primary-foreground' : 'bg-background text-muted-foreground hover:bg-muted'
              }`}
            >
              {f === 'all' ? 'All' : `Harvest (${herbs.filter(h => h.harvest).length})`}
            </button>
          ))}
        </div>

        <div className="max-h-[45vh] overflow-y-auto rounded-md border">
          <label className="sticky top-0 flex cursor-pointer items-center gap-2 border-b bg-muted/60 px-3 py-2 text-sm font-medium backdrop-blur">
            <Checkbox checked={allVisibleSelected} onCheckedChange={toggleAllVisible} />
            Select all shown ({visible.length})
            <span className="ml-auto text-xs font-normal text-muted-foreground">{selected.size} selected</span>
          </label>
          {visible.length === 0 && (
            <p className="px-3 py-6 text-center text-sm text-muted-foreground">No herbs match.</p>
          )}
          {visible.map(h => (
            <label key={h.id} className="flex cursor-pointer items-center gap-2 border-b px-3 py-1.5 text-sm last:border-0 hover:bg-muted/30">
              <Checkbox checked={selected.has(h.id)} onCheckedChange={() => toggle(h.id)} />
              <span className="flex-1 truncate">{getDisplayName(h)}</span>
              {h.harvest && (
                <Badge className="bg-emerald-100 text-[10px] text-emerald-800 hover:bg-emerald-100">Harvest</Badge>
              )}
              <span className="w-14 text-right text-xs text-muted-foreground">{Number(h.low_threshold_lb)} lb</span>
            </label>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-2 border-t pt-3">
          <span className="text-xs font-medium text-muted-foreground">Reorder trigger</span>
          <select
            className="h-8 rounded-md border bg-background px-2 text-sm"
            value={threshold}
            onChange={e => setThreshold(Number(e.target.value))}
          >
            {THRESHOLD_CHOICES.map(v => (
              <option key={v} value={v}>{v} lb</option>
            ))}
          </select>
          <Button
            size="sm"
            disabled={update.isPending || selected.size === 0}
            onClick={() => run({ low_threshold_lb: threshold }, `Reorder trigger set to ${threshold} lb`)}
          >
            Apply
          </Button>
          <span className="mx-1 hidden h-5 w-px bg-border sm:block" />
          <Button
            size="sm"
            variant="outline"
            className="gap-1 border-emerald-300 text-emerald-800 hover:bg-emerald-50"
            disabled={update.isPending || selected.size === 0}
            onClick={() => run({ harvest: true }, 'Marked to harvest')}
          >
            <Sprout className="h-3.5 w-3.5" /> Mark harvest
          </Button>
          <Button
            size="sm"
            variant="ghost"
            disabled={update.isPending || selected.size === 0}
            onClick={() => run({ harvest: false }, 'Harvest cleared')}
          >
            Clear harvest
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
