import { format } from 'date-fns';
import { Hash } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTinctureBatches } from '@/hooks/useTinctureBatches';
import { useBulkBatches } from '@/hooks/useBulkBatches';
import { getDisplayName } from '@/hooks/useInventory';
import { cn } from '@/lib/utils';

export function BatchTrackingPanel({ activeTab }: { activeTab: string }) {
  const { data: tinctureBatches = [], isLoading: loadingTincture } = useTinctureBatches();
  const { data: bulkBatches = [], isLoading: loadingBulk } = useBulkBatches();

  return (
    <div className="grid gap-4 mb-6">
      {activeTab === 'tinctures' && (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Hash className="h-4 w-4 text-purple-600" />
            Tincture Batches
          </CardTitle>
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
                    {batch.pressed_date && ` · pressed ${format(new Date(batch.pressed_date), 'MMM d')}`}
                    {batch.bulk_batches && ` · from lot ${batch.bulk_batches.batch_number}`}
                  </p>
                </div>
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
