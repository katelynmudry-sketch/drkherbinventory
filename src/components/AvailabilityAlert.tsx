import { Package, Droplets, Clock, AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AvailabilityInfo } from '@/hooks/useInventoryCheck';
import { differenceInDays, isPast, format } from 'date-fns';
import { cn } from '@/lib/utils';

interface AvailabilityAlertProps {
  herbName: string;
  availability: AvailabilityInfo[];
}

export function AvailabilityAlert({ herbName, availability }: AvailabilityAlertProps) {
  if (availability.length === 0) return null;

  return (
    <Alert className="border-amber-500/50 bg-amber-500/10">
      <AlertTriangle className="h-4 w-4 text-amber-600" />
      <AlertTitle className="text-amber-700 dark:text-amber-400">
        {herbName} found in other locations!
      </AlertTitle>
      <AlertDescription className="mt-2 space-y-2">
        {availability.map((item, index) => (
          <div key={index} className="flex items-center gap-2 text-sm">
            {item.location === 'backstock' ? (
              <>
                <Package className="h-4 w-4 text-blue-600" />
                <span>
                  <strong>Backstock:</strong>{' '}
                  <span className={cn(
                    item.status === 'full' && 'text-green-600 dark:text-green-400',
                    item.status === 'low' && 'text-yellow-600 dark:text-yellow-400',
                    item.status === 'out' && 'text-red-600 dark:text-red-400'
                  )}>
                    {item.status === 'full' ? 'Full' : item.status === 'low' ? 'Low' : 'Out'}
                  </span>
                </span>
              </>
            ) : (
              <>
                <Droplets className="h-4 w-4 text-purple-600" />
                <TinctureStatus tinctureReadyAt={item.tinctureReadyAt} />
              </>
            )}
          </div>
        ))}
        <p className="text-xs text-muted-foreground mt-2">
          You can still add this to the clinic if needed.
        </p>
      </AlertDescription>
    </Alert>
  );
}

function TinctureStatus({ tinctureReadyAt }: { tinctureReadyAt?: string | null }) {
  if (!tinctureReadyAt) {
    return <span><strong>Tincture:</strong> Brewing</span>;
  }

  const readyDate = new Date(tinctureReadyAt);
  const isReady = isPast(readyDate);
  const daysLeft = differenceInDays(readyDate, new Date());

  if (isReady) {
    return (
      <span>
        <strong>Tincture:</strong>{' '}
        <span className="text-green-600 dark:text-green-400 font-medium">Ready to use!</span>
      </span>
    );
  }

  return (
    <span className="flex items-center gap-1">
      <strong>Tincture:</strong>{' '}
      <Clock className="h-3 w-3 text-muted-foreground" />
      <span>{daysLeft} days left ({format(readyDate, 'MMM d')})</span>
    </span>
  );
}
