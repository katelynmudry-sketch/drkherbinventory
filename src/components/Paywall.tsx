import { Check, Leaf, Loader2, Mic, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useStripeCheckout } from '@/hooks/useSubscription';
import { useAuth } from '@/hooks/useAuth';

const BASIC_FEATURES = [
  'Track herbs across clinic, backstock, tincture & bulk',
  'Voice commands to update inventory',
  'Voice queries ("What\'s low in clinic?")',
  'Reports & ordering tools',
];

const PRO_FEATURES = [
  'Everything in Basic',
  'AI Voice Assistant — natural, conversational commands',
  'Ask multi-part questions and update inventory in one breath',
  'Spoken answers powered by Claude',
];

export function Paywall() {
  const { signOut } = useAuth();
  const checkout = useStripeCheckout();

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-green-50 to-amber-50 p-4 dark:from-green-950/20 dark:to-amber-950/20">
      <div className="w-full max-w-3xl space-y-6">
        <div className="text-center space-y-2">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <Leaf className="h-6 w-6 text-primary" />
          </div>
          <h1 className="text-2xl font-bold">Choose a plan to continue</h1>
          <p className="text-muted-foreground">Pick the plan that fits your clinic.</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-baseline gap-1">
                <span className="text-2xl">$4</span>
                <span className="text-sm font-normal text-muted-foreground">/month</span>
              </CardTitle>
              <CardDescription>Basic — Inventory Management</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                {BASIC_FEATURES.map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button
                className="w-full"
                variant="outline"
                onClick={() => checkout.mutate('basic')}
                disabled={checkout.isPending}
              >
                {checkout.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Subscribe to Basic'}
              </Button>
            </CardFooter>
          </Card>

          <Card className="border-primary/40 ring-1 ring-primary/20">
            <CardHeader>
              <CardTitle className="flex items-baseline gap-1">
                <span className="text-2xl">$10</span>
                <span className="text-sm font-normal text-muted-foreground">/month</span>
              </CardTitle>
              <CardDescription className="flex items-center gap-2">
                <Mic className="h-4 w-4 text-primary" />
                Pro — with AI Voice Assistant
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                {PRO_FEATURES.map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button
                className="w-full"
                onClick={() => checkout.mutate('pro')}
                disabled={checkout.isPending}
              >
                {checkout.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Subscribe to Pro'}
              </Button>
            </CardFooter>
          </Card>
        </div>

        <div className="text-center">
          <Button variant="ghost" size="sm" onClick={signOut} className="gap-2 text-muted-foreground">
            <LogOut className="h-4 w-4" />
            Sign out
          </Button>
        </div>
      </div>
    </div>
  );
}
