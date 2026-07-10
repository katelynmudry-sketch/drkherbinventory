import { useState } from 'react';
import { History, Trash2, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { useActivityLog, ActivityEntry } from '@/contexts/ActivityLogContext';
import { useAddInventory, useDeleteInventory, useUpdateInventory } from '@/hooks/useInventory';
import { supabase } from '@/integrations/supabase/client';

function formatTimeAgo(timestamp: number): string {
  const diff = Date.now() - timestamp;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

function entryLabel(entry: ActivityEntry): string {
  const a = entry.action;
  switch (a.type) {
    case 'add':
      return `Added ${a.herbName} to ${a.location} as ${a.status}`;
    case 'remove':
      return `Removed ${a.herbName} from ${a.location}`;
    case 'status_change':
      return `${a.herbName} in ${a.location}: ${a.prevStatus} → ${a.newStatus}`;
  }
}

function undoDescription(entry: ActivityEntry): string {
  const a = entry.action;
  switch (a.type) {
    case 'add':
      return `Remove ${a.herbName} from ${a.location} (undo the add)?`;
    case 'remove':
      return `Re-add ${a.herbName} to ${a.location} as ${a.status}?`;
    case 'status_change':
      return `Change ${a.herbName} in ${a.location} back to ${a.prevStatus}?`;
  }
}

function actionIcon(entry: ActivityEntry): string {
  switch (entry.action.type) {
    case 'add': return '➕';
    case 'remove': return '🗑';
    case 'status_change': return '✏️';
  }
}

export function ActivityLogButton() {
  const { entries, removeEntry, clearAll } = useActivityLog();
  const [open, setOpen] = useState(false);
  const [pendingUndo, setPendingUndo] = useState<ActivityEntry | null>(null);
  const [isUndoing, setIsUndoing] = useState(false);

  const addInventory = useAddInventory();
  const deleteInventory = useDeleteInventory();
  const updateInventory = useUpdateInventory();

  const handleUndo = async () => {
    if (!pendingUndo) return;
    const a = pendingUndo.action;
    setIsUndoing(true);
    try {
      if (a.type === 'add') {
        await deleteInventory.mutateAsync(a.inventoryId);
        toast.success(`Removed ${a.herbName} from ${a.location}`);
      } else if (a.type === 'remove') {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('Not authenticated');
        const { error } = await supabase.from('inventory').insert({
          herb_id: a.herb_id,
          location: a.location,
          status: a.status,
          notes: a.notes,
          tincture_started_at: a.tincture_started_at,
          tincture_ready_at: a.tincture_ready_at,
          current_batch_id: a.current_batch_id,
          user_id: user.id,
        });
        if (error) throw error;
        toast.success(`Re-added ${a.herbName} to ${a.location}`);
      } else if (a.type === 'status_change') {
        await updateInventory.mutateAsync({ id: a.inventoryId, status: a.prevStatus });
        toast.success(`Reverted ${a.herbName} to ${a.prevStatus}`);
      }
      removeEntry(pendingUndo.id);
    } catch (err: any) {
      toast.error(err?.message || 'Undo failed');
    } finally {
      setIsUndoing(false);
      setPendingUndo(null);
    }
  };

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-4 z-50 flex h-11 w-11 items-center justify-center rounded-full bg-background border shadow-md hover:shadow-lg transition-shadow"
        aria-label="Activity log"
      >
        <History className="h-5 w-5 text-muted-foreground" />
        {entries.length > 0 && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
            {entries.length > 99 ? '99' : entries.length}
          </span>
        )}
      </button>

      {/* Log sheet */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="bottom" className="max-h-[70vh] flex flex-col">
          <SheetHeader className="shrink-0 flex flex-row items-center justify-between pb-2">
            <SheetTitle className="text-base">Session Log</SheetTitle>
            {entries.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                className="h-7 px-2 text-xs text-muted-foreground"
                onClick={clearAll}
              >
                <Trash2 className="h-3 w-3 mr-1" />
                Clear all
              </Button>
            )}
          </SheetHeader>

          <div className="overflow-y-auto flex-1 -mx-6 px-6">
            {entries.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">No activity yet this session.</p>
            ) : (
              <div className="divide-y">
                {entries.map(entry => (
                  <div key={entry.id} className="flex items-center gap-3 py-3">
                    <span className="text-base shrink-0">{actionIcon(entry)}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm truncate">{entryLabel(entry)}</p>
                      <p className="text-xs text-muted-foreground">{formatTimeAgo(entry.timestamp)}</p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-7 px-2 shrink-0 gap-1"
                      onClick={() => setPendingUndo(entry)}
                    >
                      <RotateCcw className="h-3 w-3" />
                      Undo
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>

      {/* Undo confirm dialog */}
      <AlertDialog open={!!pendingUndo} onOpenChange={(o) => { if (!o) setPendingUndo(null); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Undo</AlertDialogTitle>
            <AlertDialogDescription>
              {pendingUndo ? undoDescription(pendingUndo) : ''}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isUndoing}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleUndo} disabled={isUndoing}>
              {isUndoing ? 'Undoing...' : 'Yes, undo'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
