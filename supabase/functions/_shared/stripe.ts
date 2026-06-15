import Stripe from 'https://esm.sh/stripe@14?target=deno';

export function getStripeClient(): Stripe {
  const secretKey = Deno.env.get('STRIPE_SECRET_KEY');
  if (!secretKey) {
    throw new Error('STRIPE_SECRET_KEY is not configured');
  }
  return new Stripe(secretKey, {
    apiVersion: '2023-10-16',
    httpClient: Stripe.createFetchHttpClient(),
  });
}

export type PlanTier = 'basic' | 'pro';

export function priceIdForPlan(plan: PlanTier): string {
  const envKey = plan === 'pro' ? 'STRIPE_PRICE_ID_PRO' : 'STRIPE_PRICE_ID_BASIC';
  const priceId = Deno.env.get(envKey);
  if (!priceId) {
    throw new Error(`${envKey} is not configured`);
  }
  return priceId;
}

export function planForPriceId(priceId: string): PlanTier | 'none' {
  if (priceId === Deno.env.get('STRIPE_PRICE_ID_PRO')) return 'pro';
  if (priceId === Deno.env.get('STRIPE_PRICE_ID_BASIC')) return 'basic';
  return 'none';
}
