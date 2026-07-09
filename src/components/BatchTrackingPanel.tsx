import { useState } from 'react';
import { format } from 'date-fns';
import { Hash, Plus, Minus, CalendarIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useTinctureBatches, TinctureBatch, useCreateTinctureBatch, useUpdateTinctureBatch } from '@/hooks/useTinctureBatches';
import { useBulkBatches } from '@/hooks/useBulkBatches';
import { useHerbs, useAddInventory, getDisplayName } from '@/hooks/useInventory';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export function BatchTrackingPanel({ activeTab }: { activeTab: string }) {
  const { data: tinctureBatches = [], isLoading: loadingTincture } = useTinctureBatches();
  const { data: bulkBatches = [], isLoading: loadingBulk } = useBulkBatches();

  return (
    <div className="grid gap-4 mb-6">
      {activeTab === 'tinctures' && (
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <Hash className="h-4 w-4 text-purple-600" />
              Tincture Batches
            </CardTitle>
            <AddTinctureBatchDialog />
          </div>
        </CardHeader>
        <CardContent className="max-h-80 overflow-y-auto space-y-1.5">
          {loadingTincture ? (
            <p className="text-sm text-muted-foreground">Loading...</p>
          ) : tinctureBatches.length === 0 ? (
            <p className="text-sm text-muted-foreground italic">No tincture batches yet</p>
          ) : (
            tinctureBatches.map(batch => (
              <div
                key={batch.id}
                className="flex items-center justify-between gap-2 rounded px-2 py-1.5 bg-background/60 border"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium truncate">
                    {batch.herbs ? getDisplayName(batch.herbs) : 'Unknown herb'}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {format(new Date(batch.batch_date), 'MMM d, yyyy')}
                    {batch.pressed_date && ` · pressed ${format(new Date(batch.pressed_date), 'MMM d, yyyy')}`}
                    {batch.bulk_batches && ` · from lot ${batch.bulk_batches.batch_number}`}
                  </p>
                </div>
                {(batch.status === 'macerating' || batch.status === 'active') ? (
                  <BottleCountStepper batch={batch} />
                ) : (
                  batch.bottle_count != null && (
                    <span className="text-xs text-muted-foreground whitespace-nowrap">{batch.bottle_count} bottles</span>
                  )
                )}
                <span className="font-mono text-xs whitespace-nowrap">{batch.batch_number}</span>
                <TinctureStatusBadge status={batch.status} />
              </div>
            ))
          )}
        </CardContent>
      </Card>
      )}

      {activeTab === 'bulk' && (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Hash className="h-4 w-4 text-amber-600" />
            Bulk Lots
          </CardTitle>
        </CardHeader>
        <CardContent className="max-h-80 overflow-y-auto space-y-1.5">
          {loadingBulk ? (
            <p className="text-sm text-muted-foreground">Loading...</p>
          ) : bulkBatches.length === 0 ? (
            <p className="text-sm text-muted-foreground italic">No bulk lots yet</p>
          ) : (
            bulkBatches.map(lot => (
              <div
                key={lot.id}
                className="flex items-center justify-between gap-2 rounded px-2 py-1.5 bg-background/60 border"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium truncate">
                    {lot.herbs ? getDisplayName(lot.herbs) : 'Unknown herb'}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Received {format(new Date(lot.received_date), 'MMM d, yyyy')}
                  </p>
                </div>
                <span className="font-mono text-xs whitespace-nowrap">{lot.batch_number}</span>
                <BulkLotStatusBadge status={lot.status} />
              </div>
            ))
          )}
        </CardContent>
      </Card>
      )}
    </div>
  );
}

// Inline -/+ stepper for a batch's bottle count. If untracked (null), shows a
// button to start tracking at 0.
function BottleCountStepper({ batch }: { batch: TinctureBatch }) {
  const updateBatch = useUpdateTinctureBatch();

  if (batch.bottle_count == null) {
    return (
      <Button
        size="sm"
        variant="ghost"
        className="h-6 px-2 text-xs text-muted-foreground"
        onClick={() => updateBatch.mutate({ id: batch.id, bottle_count: 0 })}
      >
        Track bottles
      </Button>
    );
  }

  return (
    <div className="flex items-center gap-1 whitespace-nowrap">
      <Button
        size="icon"
        variant="ghost"
        className="h-6 w-6"
        disabled={batch.bottle_count <= 0 || updateBatch.isPending}
        onClick={() => updateBatch.mutate({ id: batch.id, bottle_count: Math.max(0, batch.bottle_count! - 1) })}
      >
        <Minus className="h-3 w-3" />
      </Button>
      <span className="text-xs font-medium w-5 text-center">{batch.bottle_count}</span>
      <Button
        size="icon"
        variant="ghost"
        className="h-6 w-6"
        disabled={updateBatch.isPending}
        onClick={() => updateBatch.mutate({ id: batch.id, bottle_count: batch.bottle_count! + 1 })}
      >
        <Plus className="h-3 w-3" />
      </Button>
    </div>
  );
}

// Manual entry point for tincture batches — lets you log a batch (including
// backdated/historical ones already pressed) with a bottle count, since the
// only other way to create a batch is the voice "start tincture" command,
// which always starts macerating today with no bottle count.
function AddTinctureBatchDialog() {
  const { data: herbs = [] } = useHerbs();
  const createBatch = useCreateTinctureBatch();
  const addInventory = useAddInventory();

  const [open, setOpen] = useState(false);
  const [herbId, setHerbId] = useState('');
  const [bottleCount, setBottleCount] = useState('');
  const [batchDate, setBatchDate] = useState<Date>(new Date());
  const [batchDateOpen, setBatchDateOpen] = useState(false);
  const [statusChoice, setStatusChoice] = useState<'macerating' | 'active'>('active');
  const [pressedDate, setPressedDate] = useState<Date>(new Date());
  const [pressedDateOpen, setPressedDateOpen] = useState(false);

  const reset = () => {
    setHerbId('');
    setBottleCount('');
    setBatchDate(new Date());
    setStatusChoice('active');
    setPressedDate(new Date());
  };

  const handleClose = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) reset();
  };

  const handleSubmit = async () => {
    if (!herbId) return;
    const batch_date = format(batchDate, 'yyyy-MM-dd');
    const bottle_count = bottleCount.trim() ? Number(bottleCount) : undefined;

    try {
      if (statusChoice === 'macerating') {
        // Mirrors what the voice "start tincture" flow does: a brewing
        // inventory row at the tincture location, plus the batch record.
        await addInventory.mutateAsync({ herb_id: herbId, location: 'tincture', status: 'full' });
        await createBatch.mutateAsync({ herb_id: herbId, batch_date, bottle_count, status: 'macerating' });
      } else {
        // Already pressed/ready (e.g. a historical batch) — no brewing row,
        // just the batch record with bottles already on hand.
        await createBatch.mutateAsync({
          herb_id: herbId,
          batch_date,
          bottle_count,
          status: 'active',
          pressed_date: format(pressedDate, 'yyyy-MM-dd'),
        });
      }
      toast.success('Tincture batch added');
      handleClose(false);
    } catch (err) {
      const e = err as { code?: string; message?: string };
      if (e?.code === '23505') {
        toast.error('This herb already has a batch in progress — adjust its bottle count instead');
      } else {
        toast.error(e.message || 'Failed to add batch');
      }
    }
  };

  const isPending = createBatch.isPending || addInventory.isPending;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline" className="h-8 w-8 p-0">
          <Plus className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>Add Tincture Batch</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-2">
          <Select value={herbId} onValueChange={setHerbId}>
            <SelectTrigger>
              <SelectValue placeholder="Select herb" />
            </SelectTrigger>
            <SelectContent>
              {herbs.map(herb => (
                <SelectItem key={herb.id} value={herb.id}>
                  {getDisplayName(herb)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Input
            type="number"
            min={0}
            placeholder="Bottle count (optional)"
            value={bottleCount}
            onChange={(e) => setBottleCount(e.target.value)}
          />

          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground shrink-0">Batch date:</span>
            <Popover open={batchDateOpen} onOpenChange={setBatchDateOpen}>
              <PopoverTrigger asChild>
                <Button size="sm" variant="outline" className="h-8 gap-1 text-xs">
                  <CalendarIcon className="h-3 w-3" />
                  {format(batchDate, 'MMM d, yyyy')}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={batchDate}
                  onSelect={(date) => { if (date) { setBatchDate(date); setBatchDateOpen(false); } }}
                  disabled={(date) => date > new Date()}
                  initialFocus
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>

          <Select value={statusChoice} onValueChange={(v) => setStatusChoice(v as 'macerating' | 'active')}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Already pressed / ready</SelectItem>
              <SelectItem value="macerating">Still macerating</SelectItem>
            </SelectContent>
          </Select>

          {statusChoice === 'active' && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground shrink-0">Pressed date:</span>
              <Popover open={pressedDateOpen} onOpenChange={setPressedDateOpen}>
                <PopoverTrigger asChild>
                  <Button size="sm" variant="outline" className="h-8 gap-1 text-xs">
                    <CalendarIcon className="h-3 w-3" />
                    {format(pressedDate, 'MMM d, yyyy')}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={pressedDate}
                    onSelect={(date) => { if (date) { setPressedDate(date); setPressedDateOpen(false); } }}
                    disabled={(date) => date > new Date()}
                    initialFocus
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
          )}

          <Button className="w-full" onClick={handleSubmit} disabled={!herbId || isPending}>
            {isPending ? 'Adding...' : 'Add Batch'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function TinctureStatusBadge({ status }: { status: 'macerating' | 'active' | 'archived' }) {
  return (
    <span
      className={cn(
        'rounded-full px-2 py-0.5 text-xs font-medium whitespace-nowrap',
        status === 'macerating' && 'bg-purple-500/20 text-purple-700 dark:text-purple-400',
        status === 'active' && 'bg-green-500/20 text-green-700 dark:text-green-400',
        status === 'archived' && 'bg-muted text-muted-foreground'
      )}
    >
      {status === 'macerating' ? 'Brewing' : status === 'active' ? 'Pressed' : 'Archived'}
    </span>
  );
}

function BulkLotStatusBadge({ status }: { status: 'available' | 'depleted' }) {
  return (
    <span
      className={cn(
        'rounded-full px-2 py-0.5 text-xs font-medium whitespace-nowrap',
        status === 'available'
          ? 'bg-green-500/20 text-green-700 dark:text-green-400'
          : 'bg-muted text-muted-foreground'
      )}
    >
      {status === 'available' ? 'Available' : 'Depleted'}
    </span>
  );
}
