import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { WorkspaceConfig } from '@/lib/workspaceConfigDefaults';
import { getLocationIcon, STATUS_COLOR_CLASSES } from './iconMap';

interface ReviewStepProps {
  config: WorkspaceConfig;
}

export function ReviewStep({ config }: ReviewStepProps) {
  const firstLocation = config.locations[0];
  const firstStatus = config.statuses[0];
  const sampleItem = config.item_label_singular || 'item';

  const exampleCommand = firstLocation && firstStatus
    ? `"Add to ${firstLocation.label.toLowerCase()} ${firstStatus.label.toLowerCase()} [${sampleItem} name]"`
    : null;

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Terminology</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            You'll track <span className="font-medium text-foreground">{config.item_label_plural}</span>{' '}
            (singular: <span className="font-medium text-foreground">{config.item_label_singular}</span>)
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Locations</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          {config.locations.map((loc) => {
            const Icon = getLocationIcon(loc.icon);
            return (
              <span key={loc.id} className="flex items-center gap-1 rounded-full bg-muted px-3 py-1 text-sm">
                <Icon className="h-3.5 w-3.5" />
                {loc.label}
              </span>
            );
          })}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Statuses</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          {config.statuses.map((status) => (
            <span
              key={status.id}
              className={`rounded-full border px-3 py-1 text-sm font-medium ${STATUS_COLOR_CLASSES[status.color] ?? STATUS_COLOR_CLASSES.gray}`}
            >
              {status.label}
            </span>
          ))}
        </CardContent>
      </Card>

      {exampleCommand && (
        <Card className="border-primary/30 bg-primary/5">
          <CardHeader>
            <CardTitle className="text-base">Sample voice command</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm italic text-muted-foreground">{exampleCommand}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
