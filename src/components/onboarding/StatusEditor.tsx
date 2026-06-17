import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus, X } from 'lucide-react';
import { StatusConfig } from '@/lib/workspaceConfigDefaults';
import { STATUS_COLOR_CLASSES, STATUS_COLOR_OPTIONS } from './iconMap';
import { makeBlankStatus } from './onboardingUtils';

interface StatusEditorProps {
  statuses: StatusConfig[];
  onChange: (statuses: StatusConfig[]) => void;
}

export function StatusEditor({ statuses, onChange }: StatusEditorProps) {
  const updateLabel = (id: string, label: string) => {
    onChange(statuses.map((s) => (s.id === id ? { ...s, label } : s)));
  };

  const cycleColor = (id: string) => {
    onChange(
      statuses.map((s) => {
        if (s.id !== id) return s;
        const idx = STATUS_COLOR_OPTIONS.indexOf(s.color);
        const nextColor = STATUS_COLOR_OPTIONS[(idx + 1) % STATUS_COLOR_OPTIONS.length];
        return { ...s, color: nextColor };
      })
    );
  };

  const removeStatus = (id: string) => {
    onChange(statuses.filter((s) => s.id !== id));
  };

  const addStatus = () => {
    onChange([...statuses, makeBlankStatus(statuses)]);
  };

  return (
    <div className="space-y-3">
      {statuses.map((status) => (
        <div key={status.id} className="flex items-center gap-3 rounded-lg border bg-card p-3">
          <button
            type="button"
            onClick={() => cycleColor(status.id)}
            title="Click to change color"
            className={`shrink-0 rounded-full border px-3 py-1 text-xs font-medium ${STATUS_COLOR_CLASSES[status.color] ?? STATUS_COLOR_CLASSES.gray}`}
          >
            {status.label || 'Status'}
          </button>
          <Input
            value={status.label}
            onChange={(e) => updateLabel(status.id, e.target.value)}
            className="flex-1"
          />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => removeStatus(status.id)}
            disabled={statuses.length <= 1}
            aria-label={`Remove ${status.label}`}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ))}

      <Button variant="outline" onClick={addStatus} className="gap-2">
        <Plus className="h-4 w-4" />
        Add status
      </Button>
    </div>
  );
}
