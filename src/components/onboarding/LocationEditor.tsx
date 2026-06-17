import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus, X } from 'lucide-react';
import { LocationConfig } from '@/lib/workspaceConfigDefaults';
import { getLocationIcon } from './iconMap';
import { makeBlankLocation } from './onboardingUtils';

interface LocationEditorProps {
  locations: LocationConfig[];
  onChange: (locations: LocationConfig[]) => void;
}

export function LocationEditor({ locations, onChange }: LocationEditorProps) {
  const updateLabel = (id: string, label: string) => {
    onChange(locations.map((loc) => (loc.id === id ? { ...loc, label } : loc)));
  };

  const removeLocation = (id: string) => {
    onChange(locations.filter((loc) => loc.id !== id));
  };

  const addLocation = () => {
    onChange([...locations, makeBlankLocation(locations)]);
  };

  return (
    <div className="space-y-3">
      {locations.map((loc) => {
        const Icon = getLocationIcon(loc.icon);
        return (
          <div key={loc.id} className="flex items-center gap-3 rounded-lg border bg-card p-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10">
              <Icon className="h-4 w-4 text-primary" />
            </div>
            <Input
              value={loc.label}
              onChange={(e) => updateLabel(loc.id, e.target.value)}
              className="flex-1"
            />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => removeLocation(loc.id)}
              disabled={locations.length <= 1}
              aria-label={`Remove ${loc.label}`}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        );
      })}

      <Button variant="outline" onClick={addLocation} className="gap-2">
        <Plus className="h-4 w-4" />
        Add location
      </Button>
    </div>
  );
}
