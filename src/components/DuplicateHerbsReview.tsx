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

interface FieldCopyState {
  common_name: boolean;
  latin_name: boolean;
  pinyin_name: boolean;
  notes: boolean;
}

function DuplicateGroupCard({ group }: { group: DuplicateGroup }) {
  const mergeHerbs = useMergeHerbs();
  const [survivorId, setSurvivorId] = useState<string>(group.herbs[0].id);
  const [expanded, setExpanded] = useState(true);
  const [copyFields, setCopyFields] = useState<FieldCopyState>({
    common_name: false,
    latin_name: false,
    pinyin_name: false,
    notes: false,
  });

  const survivor = group.herbs.find(h => h.id === survivorId) ?? group.herbs[0];
  const loser = group.herbs.find(h => h.id !== survivorId) ?? group.herbs[1];

  const handleMerge = async () => {
    const survivorUpdates: Record<string, string | null> = {};
    if (copyFields.common_name && loser.common_name && !survivor.common_name) {
      survivorUpdates.common_name = loser.common_name;
    }
    if (copyFields.latin_name && loser.latin_name && !survivor.latin_name) {
      survivorUpdates.latin_name = loser.latin_name;
    }
    if (copyFields.pinyin_name && loser.pinyin_name && !survivor.pinyin_name) {
      survivorUpdates.pinyin_name = loser.pinyin_name;
    }
    if (copyFields.notes && loser.notes && !survivor.notes) {
      survivorUpdates.notes = loser.notes;
    }

    try {
      await mergeHerbs.mutateAsync({
        survivorId: survivor.id,
        loserId: loser.id,
        survivorUpdates: Object.keys(survivorUpdates).length > 0 ? survivorUpdates : undefined,
      });
      toast.success(`Merged "${loser.name}" into "${survivor.name}"`);
    } catch (err: any) {
      toast.error(err.message || 'Failed to merge herbs');
    }
  };

  const fields: Array<{ key: keyof FieldCopyState; label: string }> = [
    { key: 'common_name', label: 'Common name' },
    { key: 'latin_name', label: 'Latin name' },
    { key: 'pinyin_name', label: 'Pinyin name' },
    { key: 'notes', label: 'Notes' },
  ];

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
          {/* Side-by-side comparison */}
          <div className="grid grid-cols-2 gap-3">
            {group.herbs.slice(0, 2).map(herb => (
              <HerbCard
                key={herb.id}
                herb={herb}
                isSurvivor={herb.id === survivorId}
                onSelectSurvivor={() => setSurvivorId(herb.id)}
              />
            ))}
          </div>

          {/* Optional field copy */}
          {fields.some(f => loser[f.key] && !survivor[f.key]) && (
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground font-medium">
                Copy fields from "{loser.name}" into "{survivor.name}" before merging:
              </p>
              <div className="flex flex-wrap gap-2">
                {fields.map(({ key, label }) => {
                  const hasValue = !!loser[key] && !survivor[key];
                  if (!hasValue) return null;
                  return (
                    <label key={key} className="flex items-center gap-1.5 text-xs cursor-pointer">
                      <input
                        type="checkbox"
                        checked={copyFields[key]}
                        onChange={e => setCopyFields(prev => ({ ...prev, [key]: e.target.checked }))}
                        className="h-3 w-3"
                      />
                      <span>{label}: <em>{loser[key]}</em></span>
                    </label>
                  );
                })}
              </div>
            </div>
          )}

          <Button
            size="sm"
            onClick={handleMerge}
            disabled={mergeHerbs.isPending}
            className="w-full gap-2"
          >
            <GitMerge className="h-3 w-3" />
            {mergeHerbs.isPending ? 'Merging...' : `Keep "${survivor.name}", delete "${loser.name}"`}
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
