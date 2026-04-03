import { useState, useMemo } from 'react';
import { GitMerge, ChevronDown, ChevronUp, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { useHerbs, Herb } from '@/hooks/useInventory';
import { detectDuplicates, DuplicateGroup, useMergeHerbs } from '@/hooks/useDuplicateHerbs';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export function DuplicateHerbsReview() {
  const { data: herbs = [] } = useHerbs();
  const duplicates = useMemo(() => detectDuplicates(herbs), [herbs]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" title="Review duplicate herbs">
          <GitMerge className="h-4 w-4" />
          {duplicates.length > 0 && (
            <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-amber-500 text-[10px] text-white flex items-center justify-center font-bold">
              {duplicates.length}
            </span>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <GitMerge className="h-5 w-5" />
            Review Duplicate Herbs
          </DialogTitle>
        </DialogHeader>
        <DuplicateReviewContent duplicates={duplicates} />
      </DialogContent>
    </Dialog>
  );
}

function DuplicateReviewContent({ duplicates }: { duplicates: DuplicateGroup[] }) {
  const [copied, setCopied] = useState(false);

  const constraintSql = `CREATE UNIQUE INDEX herbs_user_id_name_lower_idx\n  ON public.herbs (user_id, lower(trim(name)));`;

  const handleCopySql = () => {
    navigator.clipboard.writeText(constraintSql);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (duplicates.length === 0) {
    return (
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground text-center py-4">
          No duplicate herbs detected.
        </p>
        <div className="rounded-lg border border-green-500/30 bg-green-500/5 p-4 space-y-2">
          <p className="text-sm font-medium text-green-700 dark:text-green-400">
            Run this in your Supabase SQL editor to prevent future duplicates:
          </p>
          <pre className="text-xs bg-muted rounded p-2 overflow-x-auto">{constraintSql}</pre>
          <Button size="sm" variant="outline" onClick={handleCopySql} className="gap-2">
            {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
            {copied ? 'Copied!' : 'Copy SQL'}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        {duplicates.length} group{duplicates.length > 1 ? 's' : ''} of suspected duplicates found.
        Review each group and choose which record to keep.
      </p>
      {duplicates.map(group => (
        <DuplicateGroupCard key={group.key} group={group} />
      ))}
      <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-3">
        <p className="text-xs text-amber-700 dark:text-amber-400">
          After merging all duplicates, run the SQL snippet in Supabase to prevent future duplicates. It will appear here when no more duplicates are detected.
        </p>
      </div>
    </div>
  );
}


function DuplicateGroupCard({ group }: { group: DuplicateGroup }) {
  const mergeHerbs = useMergeHerbs();
  const [survivorId, setSurvivorId] = useState<string>(group.herbs[0].id);
  const [expanded, setExpanded] = useState(true);

  const survivor = group.herbs.find(h => h.id === survivorId) ?? group.herbs[0];
  const losers = group.herbs.filter(h => h.id !== survivorId);

  const handleMerge = async () => {
    // Merge all losers into the survivor one at a time
    for (const loser of losers) {
      // Copy any non-empty fields from loser that survivor is missing
      const survivorUpdates: Record<string, string | null> = {};
      for (const field of ['common_name', 'latin_name', 'pinyin_name', 'notes'] as const) {
        if (loser[field] && !survivor[field]) survivorUpdates[field] = loser[field];
      }
      try {
        await mergeHerbs.mutateAsync({
          survivorId: survivor.id,
          loserId: loser.id,
          survivorUpdates: Object.keys(survivorUpdates).length > 0 ? survivorUpdates : undefined,
        });
      } catch (err: any) {
        toast.error(`Failed to merge "${loser.name}": ${err.message || 'Unknown error'}`);
        return;
      }
    }
    toast.success(`Merged ${losers.length} duplicate${losers.length > 1 ? 's' : ''} into "${survivor.name}"`);
  };

  const colClass = group.herbs.length === 2 ? 'grid-cols-2' : group.herbs.length === 3 ? 'grid-cols-3' : 'grid-cols-2';

  return (
    <div className="rounded-lg border bg-background">
      <button
        className="flex items-center gap-2 w-full px-4 py-3 text-left"
        onClick={() => setExpanded(e => !e)}
      >
        <span className="font-medium text-sm capitalize">{group.key}</span>
        <Badge variant="secondary" className="text-xs">{group.herbs.length} records</Badge>
        <span className="flex-1" />
        {expanded ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
      </button>

      {expanded && (
        <div className="px-4 pb-4 space-y-3">
          <p className="text-xs text-muted-foreground">Click a record to select it as the one to keep. All others will be merged into it.</p>
          <div className={`grid ${colClass} gap-3`}>
            {group.herbs.map(herb => (
              <HerbCard
                key={herb.id}
                herb={herb}
                isSurvivor={herb.id === survivorId}
                onSelectSurvivor={() => setSurvivorId(herb.id)}
              />
            ))}
          </div>

          <Button
            size="sm"
            onClick={handleMerge}
            disabled={mergeHerbs.isPending}
            className="w-full gap-2"
          >
            <GitMerge className="h-3 w-3" />
            {mergeHerbs.isPending
              ? 'Merging...'
              : `Keep "${survivor.name}", delete ${losers.length} duplicate${losers.length > 1 ? 's' : ''}`}
          </Button>
        </div>
      )}
    </div>
  );
}

function HerbCard({ herb, isSurvivor, onSelectSurvivor }: {
  herb: Herb;
  isSurvivor: boolean;
  onSelectSurvivor: () => void;
}) {
  return (
    <button
      onClick={onSelectSurvivor}
      className={cn(
        'rounded-lg border p-3 text-left text-xs space-y-1 transition-colors w-full',
        isSurvivor
          ? 'border-green-500 bg-green-500/10 ring-1 ring-green-500'
          : 'border-muted hover:border-muted-foreground/50'
      )}
    >
      <div className="flex items-center justify-between">
        <span className="font-semibold text-sm">{herb.name}</span>
        {isSurvivor && (
          <Badge variant="outline" className="text-[10px] border-green-500 text-green-700 dark:text-green-400">
            Keep
          </Badge>
        )}
      </div>
      {herb.common_name && <div className="text-muted-foreground">Common: {herb.common_name}</div>}
      {herb.latin_name && <div className="text-muted-foreground italic">{herb.latin_name}</div>}
      {herb.pinyin_name && <div className="text-muted-foreground">Pinyin: {herb.pinyin_name}</div>}
      {herb.notes && <div className="text-muted-foreground truncate">Notes: {herb.notes}</div>}
      {!isSurvivor && (
        <div className="text-primary text-[10px] pt-1">Click to keep this one instead</div>
      )}
    </button>
  );
}
