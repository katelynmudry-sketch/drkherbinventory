import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles } from 'lucide-react';
import { PRESET_CONFIGS, WorkspaceConfig } from '@/lib/workspaceConfigDefaults';
import { getLocationIcon } from './iconMap';
import { BLANK_CUSTOM_CONFIG } from './onboardingUtils';

const PRESET_LABELS: Record<string, { title: string; description: string }> = {
  herbal_clinic: {
    title: 'Herbal Clinic',
    description: 'Clinic stock, backstock, tinctures, and bulk herbs by weight.',
  },
  general_retail: {
    title: 'General Retail',
    description: 'Storefront, backroom storage, and an online warehouse.',
  },
  construction_trades: {
    title: 'Construction / Trades',
    description: 'Job site, warehouse, truck, and tool crib tracking.',
  },
};

interface IndustryPickerProps {
  selectedKey: string | null;
  onSelect: (key: string, config: WorkspaceConfig) => void;
}

export function IndustryPicker({ selectedKey, onSelect }: IndustryPickerProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {Object.entries(PRESET_CONFIGS).map(([key, config]) => {
        const meta = PRESET_LABELS[key] ?? { title: key, description: '' };
        const isSelected = selectedKey === key;
        return (
          <Card
            key={key}
            onClick={() => onSelect(key, structuredClone(config))}
            className={`cursor-pointer transition-all hover:border-primary/60 ${
              isSelected ? 'border-primary ring-2 ring-primary/30' : ''
            }`}
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                {meta.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">{meta.description}</p>
              <div className="flex flex-wrap gap-2">
                {config.locations.map((loc) => {
                  const Icon = getLocationIcon(loc.icon);
                  return (
                    <span
                      key={loc.id}
                      className="flex items-center gap-1 rounded-full bg-muted px-2 py-1 text-xs"
                    >
                      <Icon className="h-3 w-3" />
                      {loc.label}
                    </span>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        );
      })}

      <Card
        onClick={() => onSelect('custom', structuredClone(BLANK_CUSTOM_CONFIG))}
        className={`cursor-pointer border-dashed transition-all hover:border-primary/60 ${
          selectedKey === 'custom' ? 'border-primary ring-2 ring-primary/30' : ''
        }`}
      >
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Sparkles className="h-4 w-4" />
            Start from scratch
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Don't see your industry? Start with a blank setup and add your own
            locations and statuses.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
