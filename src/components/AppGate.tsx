import { ReactNode } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { AuthForm } from '@/components/AuthForm';
import { useAuth } from '@/hooks/useAuth';

function LoadingScreen() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-green-50 to-amber-50 dark:from-green-950/20 dark:to-amber-950/20">
      <div className="space-y-4 text-center">
        <Skeleton className="mx-auto h-12 w-12 rounded-full" />
        <Skeleton className="h-6 w-32" />
      </div>
    </div>
  );
}

// Central gate for the whole app: requires sign-in before rendering any
// routed page. Subscription gating (Paywall/useSubscription) is wired up
// but disabled for now during personal-account testing — re-enable the
// isActive check below before going public.
export function AppGate({ children }: { children: ReactNode }) {
  const { user, loading: authLoading } = useAuth();

  if (authLoading) {
    return <LoadingScreen />;
  }

  if (!user) {
    return <AuthForm />;
  }

  return <>{children}</>;
}
