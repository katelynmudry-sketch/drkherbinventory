import { useState } from 'react';
import { differenceInDays, isPast, format } from 'date-fns';
import { AlertCircle, Clock, Droplets, ChevronDown, ChevronUp, PackageX } from 'lucide-react';
import { useInventory, getDisplayName, InventoryItem } from '@/hooks/useInventory';
import { useTinctureBatches, TinctureBatch } from '@/hooks/useTinctureBatches';
import { findMatchingInventoryItem } from '@/hooks/useInventoryCheck';
import { getTinctureAlcohol } from '@/lib/tinctureAlcohol';
import { cn } from '@/lib/utils';

export function TinctureRestockPanel() {
  const { data: clinicInventory = [] } = useInventory('clinic');
  const { data: tinctureInventory = [] } = useInventory('tincture');
  const { data: backstockInventory = [] } = useInventory('backstock');
  const { data: bulkInventory = [] } = useInventory('bulk');
  const { data: bulkBackstockInventory = [] } = useInventory('bulk_backstock');
  const { data: bulkClinicInventory = [] } = useInventory('bulk_clinic');
  const { data: allBatches = [] } = useTinctureBatches();
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Raw bulk herb on hand (bulk + bulk backstock + bulk clinic combined) —
  // this is the material a tincture batch is actually pressed from, so if
  // it's all gone there's nothing to start a tincture with.
  const bulkQtyByHerbId = new Map<string, number>();
  const bulkQtyByName = new Map<string, number>();
  [...bulkInventory, ...bulkBackstockInventory, ...bulkClinicInventory].forEach(i => {
    const qty = Number(i.quantity) || 0;
    bulkQtyByHerbId.set(i.herb_id, (bulkQtyByHerbId.get(i.herb_id) ?? 0) + qty);
    if (i.herbs) {
      const name = getDisplayName(i.herbs).toLowerCase().trim();
      bulkQtyByName.set(name, (bulkQtyByName.get(name) ?? 0) + qty);
    }
  });

  const getBulkQtyForClinicItem = (clinicItem: InventoryItem): number => {
    if (bulkQtyByHerbId.has(clinicItem.herb_id)) return bulkQtyByHerbId.get(clinicItem.herb_id)!;
    if (clinicItem.herbs) {
      const name = getDisplayName(clinicItem.herbs).toLowerCase().trim();
      if (bulkQtyByName.has(name)) return bulkQtyByName.get(name)!;
      for (const [k, v] of bulkQtyByName) {
        if (k.startsWith(name) || name.startsWith(k)) return v;
        if (name.length >= 5 && k.length >= 5 && name.slice(0, 6) === k.slice(0, 6)) return v;
      }
    }
    return 0;
  };

  // Build lookup maps
  const activeBatchByHerbId = new Map<string, TinctureBatch>();
  const maceratingBatchByHerbId = new Map<string, TinctureBatch>();
  allBatches.forEach(b => {
    if (b.status === 'active') activeBatchByHerbId.set(b.herb_id, b);
    if (b.status === 'macerating') maceratingBatchByHerbId.set(b.herb_id, b);
  });

  // Only count tincture backstock as available if status is not 'out'
  const findBackstockForClinicItem = (clinicItem: InventoryItem): boolean => {
    const match = findMatchingInventoryItem(clinicItem, backstockInventory);
    return !!match && match.status !== 'out';
  };

  const tinctureByHerbId = new Map<string, InventoryItem>();
  tinctureInventory.forEach(item => tinctureByHerbId.set(item.herb_id, item));

  // Clinic needs: clinic items that are low/out
  const clinicNeeds = clinicInventory.filter(
    item => item.status === 'low' || item.status === 'out'
  );

  // Tincture needs: herbs that are low/out in clinic AND have no backstock AND no active/macerating batch
  // These are "action needed" — nothing is in process
  const tinctureAlerts = clinicNeeds.filter(clinicItem => {
    const herbId = clinicItem.herb_id;
    const hasBackstock = findBackstockForClinicItem(clinicItem);
    const hasBatch = activeBatchByHerbId.has(herbId) || maceratingBatchByHerbId.has(herbId);
    const hasTinctureBrewing = tinctureByHerbId.has(herbId);
    return !hasBackstock && !hasBatch && !hasTinctureBrewing;
  });

  if (clinicNeeds.length === 0) return null;

  // Name-based fallback for mismatched herb_id records
  const tinctureNames: Array<{ key: string; item: InventoryItem }> = [];
  tinctureInventory.forEach(item => {
    if (item.herbs) {
      tinctureNames.push({ key: getDisplayName(item.herbs).toLowerCase().trim(), item });
    }
  });

  const findTinctureByName = (clinicHerb: InventoryItem['herbs']): InventoryItem | null => {
    if (!clinicHerb) return null;
    const clinicName = getDisplayName(clinicHerb).toLowerCase().trim();
    const exact = tinctureNames.find(t => t.key === clinicName);
    if (exact) return exact.item;
    const partial = tinctureNames.find(t =>
      t.key.startsWith(clinicName) || clinicName.startsWith(t.key)
    );
    return partial?.item ?? null;
  };

  const rows = clinicNeeds.map(clinicItem => {
    const byId = tinctureByHerbId.get(clinicItem.herb_id) ?? null;
    const tinctureItem = byId ?? findTinctureByName(clinicItem.herbs);
    const batch =
      activeBatchByHerbId.get(clinicItem.herb_id) ??
      (tinctureItem ? activeBatchByHerbId.get(tinctureItem.herb_id) : undefined) ??
      null;
    const hasBackstock = findBackstockForClinicItem(clinicItem);
    const needsAction = !hasBackstock && !batch && !tinctureItem;
    const bulkOut = getBulkQtyForClinicItem(clinicItem) <= 0;
    return { clinicItem, tinctureItem, batch, hasBackstock, needsAction, bulkOut };
  });

  const statusPriority: Record<string, number> = { out: 0, low: 1 };
  rows.sort((a, b) => {
    // Needs-action items float to top
    if (a.needsAction !== b.needsAction) return a.needsAction ? -1 : 1;
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

  const needsActionCount = tinctureAlerts.length;

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
        {needsActionCount > 0 && (
          <span className="rounded-full bg-red-500/20 px-2 py-0.5 text-xs font-medium text-red-700 dark:text-red-400">
            {needsActionCount} need tincture
          </span>
        )}
        <span className="text-xs text-muted-foreground flex-1">— tincture status</span>
        {isCollapsed
          ? <ChevronDown className="h-4 w-4 text-amber-600 shrink-0" />
          : <ChevronUp className="h-4 w-4 text-amber-600 shrink-0" />
        }
      </button>
      {!isCollapsed && (
        <div className="space-y-1 mt-3">
          {rows.map(({ clinicItem, tinctureItem, batch, hasBackstock, needsAction, bulkOut }) => (
            <RestockRow
              key={clinicItem.id}
              clinicItem={clinicItem}
              tinctureItem={tinctureItem}
              batch={batch}
              hasBackstock={hasBackstock}
              needsAction={needsAction}
              bulkOut={bulkOut}
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
  batch: TinctureBatch | null;
  hasBackstock: boolean;
  needsAction: boolean;
  bulkOut: boolean;
}

function RestockRow({ clinicItem, tinctureItem, batch, hasBackstock, needsAction, bulkOut }: RestockRowProps) {
  const herbName = clinicItem.herbs ? getDisplayName(clinicItem.herbs) : 'Unknown';
  const alcohol = clinicItem.herbs
    ? getTinctureAlcohol(clinicItem.herbs.name) ??
      (clinicItem.herbs.common_name ? getTinctureAlcohol(clinicItem.herbs.common_name) : null)
    : null;

  return (
    <div className={cn(
      "flex items-center justify-between gap-2 rounded px-2 py-1.5",
      needsAction ? "bg-red-500/5 border border-red-500/20" : "bg-background/60"
    )}>
      <span className="text-sm font-medium truncate flex-1">{herbName}</span>
      {alcohol && (
        <span className="text-xs whitespace-nowrap text-foreground">
          {alcohol}
        </span>
      )}
      <ClinicStatusBadge status={clinicItem.status as 'low' | 'out'} />
      {hasBackstock && (
        <span className="rounded-full px-2 py-0.5 text-xs font-medium whitespace-nowrap bg-blue-500/20 text-blue-700 dark:text-blue-400">
          Backstock
        </span>
      )}
      {bulkOut && (
        <span className="rounded-full px-2 py-0.5 text-xs font-medium whitespace-nowrap bg-red-500/20 text-red-700 dark:text-red-400">
          Bulk OUT
        </span>
      )}
      <TinctureBadge tinctureItem={tinctureItem} batch={batch} needsAction={needsAction} hasBackstock={hasBackstock} bulkOut={bulkOut} />
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

function TinctureBadge({ tinctureItem, batch, needsAction, hasBackstock, bulkOut }: { tinctureItem: InventoryItem | null; batch: TinctureBatch | null; needsAction: boolean; hasBackstock: boolean; bulkOut: boolean }) {
  if (!tinctureItem && !batch) {
    if (needsAction && !hasBackstock && bulkOut) {
      return (
        <span className="flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium whitespace-nowrap bg-orange-500/20 text-orange-700 dark:text-orange-400">
          <PackageX className="h-3 w-3" />
          Bulk out
        </span>
      );
    }
    return (
      <span className={cn(
        "rounded-full px-2 py-0.5 text-xs font-medium whitespace-nowrap",
        needsAction
          ? "bg-red-500/20 text-red-700 dark:text-red-400"
          : "bg-muted text-muted-foreground"
      )}>
        {needsAction
          ? (bulkOut ? "Bulk out — can't make" : hasBackstock ? "Grab backstock" : "Start tincture")
          : "No batch"}
      </span>
    );
  }

  // Has an active batch but no macerating row
  if (!tinctureItem && batch) {
    return (
      <span className="flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium whitespace-nowrap bg-green-500/20 text-green-700 dark:text-green-400">
        <Droplets className="h-3 w-3" />
        Pressed{batch.bottle_count != null && ` · ${batch.bottle_count}`}
      </span>
    );
  }

  const readyDate = tinctureItem.tincture_ready_at
    ? new Date(tinctureItem.tincture_ready_at)
    : null;

  const batchTag = batch
    ? <span className="font-mono opacity-70 ml-1">{batch.batch_number}</span>
    : null;

  if (!readyDate) {
    return (
      <span className="flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium whitespace-nowrap bg-purple-500/20 text-purple-700 dark:text-purple-400">
        <Droplets className="h-3 w-3" />
        Brewing{batchTag}
      </span>
    );
  }

  if (isPast(readyDate)) {
    return (
      <span className="flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium whitespace-nowrap bg-green-500/20 text-green-700 dark:text-green-400">
        <Droplets className="h-3 w-3" />
        Ready{batchTag}
      </span>
    );
  }

  const daysLeft = differenceInDays(readyDate, new Date());
  return (
    <span className="flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium whitespace-nowrap bg-purple-500/20 text-purple-700 dark:text-purple-400">
      <Clock className="h-3 w-3" />
      {daysLeft}d ({format(readyDate, 'MMM d')}){batchTag}
    </span>
  );
}
