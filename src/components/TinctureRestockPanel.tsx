import { useState } from 'react';
import { differenceInDays, isPast, format } from 'date-fns';
import { AlertCircle, Clock, Droplets, ChevronDown, ChevronUp } from 'lucide-react';
import { useInventory, getDisplayName, InventoryItem } from '@/hooks/useInventory';
import { cn } from '@/lib/utils';

export function TinctureRestockPanel() {
  const { data: clinicInventory = [] } = useInventory('clinic');
  const { data: tinctureInventory = [] } = useInventory('tincture');
  const [isCollapsed, setIsCollapsed] = useState(false);

  const clinicNeeds = clinicInventory.filter(
    item => item.status === 'low' || item.status === 'out'
  );

  if (clinicNeeds.length === 0) return null;

  const tinctureByHerbId = new Map<string, InventoryItem>();
  tinctureInventory.forEach(item => tinctureByHerbId.set(item.herb_id, item));

  // Also build a name-based lookup as fallback for mismatched herb_id records
  const tinctureByName = new Map<string, InventoryItem>();
  tinctureInventory.forEach(item => {
    if (item.herbs) {
      const key = getDisplayName(item.herbs).toLowerCase().trim();
      tinctureByName.set(key, item);
    }
  });

  const rows = clinicNeeds.map(clinicItem => {
    const byId = tinctureByHerbId.get(clinicItem.herb_id) ?? null;
    if (byId) return { clinicItem, tinctureItem: byId };
    // Fallback: match by display name (handles herb_id mismatches from duplicate herb records)
    const clinicName = clinicItem.herbs ? getDisplayName(clinicItem.herbs).toLowerCase().trim() : '';
    const byName = clinicName ? (tinctureByName.get(clinicName) ?? null) : null;
    return { clinicItem, tinctureItem: byName };
  });

  const statusPriority: Record<string, number> = { out: 0, low: 1 };
  rows.sort((a, b) => {
    const hasA = a.tinctureItem ? 0 : 1;
    const hasB = b.tinctureItem ? 0 : 1;
    if (hasA !== hasB) return hasA - hasB;
    const sDiff =
      (statusPriority[a.clinicItem.status] ?? 2) -
      (statusPriority[b.clinicItem.status] ?? 2);
    if (sDiff !== 0) return sDiff;
    const nameA = a.clinicItem.herbs ? getDisplayName(a.clinicItem.herbs).toLowerCase() : '';
    const nameB = b.clinicItem.herbs ? getDisplayName(b.clinicItem.herbs).toLowerCase() : '';
    return nameA.localeCompare(nameB);
  });

  return (
    <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-3 mb-4">
      <button
        className="flex items-center gap-2 w-full text-left"
        onClick={() => setIsCollapsed(c => !c)}
      >
        <AlertCircle className="h-4 w-4 text-amber-600 shrink-0" />
        <h3 className="text-sm font-semibold text-amber-700 dark:text-amber-400">
          Clinic Needs ({clinicNeeds.length})
        </h3>
        <span className="text-xs text-muted-foreground flex-1">— check tincture status</span>
        {isCollapsed
          ? <ChevronDown className="h-4 w-4 text-amber-600 shrink-0" />
          : <ChevronUp className="h-4 w-4 text-amber-600 shrink-0" />
        }
      </button>
      {!isCollapsed && (
        <div className="space-y-1 mt-3">
          {rows.map(({ clinicItem, tinctureItem }) => (
            <RestockRow
              key={clinicItem.id}
              clinicItem={clinicItem}
              tinctureItem={tinctureItem}
            />
          ))}
        </div>
      )}
    </div>
  );
}

interface RestockRowProps {
  clinicItem: InventoryItem;
  tinctureItem: InventoryItem | null;
}

function RestockRow({ clinicItem, tinctureItem }: RestockRowProps) {
  const herbName = clinicItem.herbs ? getDisplayName(clinicItem.herbs) : 'Unknown';

  return (
    <div className="flex items-center justify-between gap-2 rounded px-2 py-1.5 bg-background/60">
      <span className="text-sm font-medium truncate flex-1">{herbName}</span>
      <ClinicStatusBadge status={clinicItem.status as 'low' | 'out'} />
      <TinctureBadge tinctureItem={tinctureItem} />
    </div>
  );
}

function ClinicStatusBadge({ status }: { status: 'low' | 'out' }) {
  return (
    <span
      className={cn(
        'rounded-full px-2 py-0.5 text-xs font-medium whitespace-nowrap',
        status === 'low' && 'bg-yellow-500/20 text-yellow-700 dark:text-yellow-400',
        status === 'out' && 'bg-red-500/20 text-red-700 dark:text-red-400'
      )}
    >
      {status === 'low' ? 'Low' : 'Out'}
    </span>
  );
}

function TinctureBadge({ tinctureItem }: { tinctureItem: InventoryItem | null }) {
  if (!tinctureItem) {
    return (
      <span className="rounded-full px-2 py-0.5 text-xs font-medium whitespace-nowrap bg-muted text-muted-foreground">
        No batch
      </span>
    );
  }

  const readyDate = tinctureItem.tincture_ready_at
    ? new Date(tinctureItem.tincture_ready_at)
    : null;

  if (!readyDate) {
    return (
      <span className="flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium whitespace-nowrap bg-purple-500/20 text-purple-700 dark:text-purple-400">
        <Droplets className="h-3 w-3" />
        Brewing
      </span>
    );
  }

  if (isPast(readyDate)) {
    return (
      <span className="flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium whitespace-nowrap bg-green-500/20 text-green-700 dark:text-green-400">
        <Droplets className="h-3 w-3" />
        Ready
      </span>
    );
  }

  const daysLeft = differenceInDays(readyDate, new Date());
  return (
    <span className="flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium whitespace-nowrap bg-purple-500/20 text-purple-700 dark:text-purple-400">
      <Clock className="h-3 w-3" />
      {daysLeft}d ({format(readyDate, 'MMM d')})
    </span>
  );
}
