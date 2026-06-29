import { useQuery, useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export type PlanTier = 'none' | 'basic' | 'pro';

export interface SubscriptionInfo {
  tier: PlanTier;
  status: string;
  isActive: boolean;
  hasAI: boolean;
}

const ACTIVE_STATUSES = ['active', 'trialing'];

export function useSubscription() {
  return useQuery({
    queryKey: ['subscription'],
    queryFn: async (): Promise<SubscriptionInfo> => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return { tier: 'none', status: 'inactive', isActive: false, hasAI: false };
      }

      const { data, error } = await supabase
        .from('subscriptions')
        .select('plan_tier, status')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) throw error;

      const tier = (data?.plan_tier ?? 'none') as PlanTier;
      const status = data?.status ?? 'inactive';
      const isActive = ACTIVE_STATUSES.includes(status);

      return {
        tier,
        status,
        isActive,
        hasAI: isActive && tier === 'pro',
      };
    },
  });
}

export function useStripeCheckout() {
  return useMutation({
    mutationFn: async (plan: 'basic' | 'pro') => {
      const { data, error } = await supabase.functions.invoke('stripe-checkout', {
        body: { plan },
      });
      if (error) throw error;
      return data as { url: string };
    },
    onSuccess: (data) => {
      if (data?.url) {
        window.location.href = data.url;
      }
    },
  });
}

export function useStripePortal() {
  return useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase.functions.invoke('stripe-portal', {
        body: {},
      });
      if (error) throw error;
      return data as { url: string };
    },
    onSuccess: (data) => {
      if (data?.url) {
        window.location.href = data.url;
      }
    },
  });
}
