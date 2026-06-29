import { getServiceClient } from '../_shared/supabaseClients.ts';
import { getStripeClient, planForPriceId } from '../_shared/stripe.ts';

interface StripeCheckoutSessionLike {
  customer: string;
  subscription: string | null;
}

interface StripeSubscriptionLike {
  id: string;
  customer: string;
  status: string;
  current_period_end: number;
  items: { data: Array<{ price?: { id?: string } }> };
}

// Note: this endpoint is called directly by Stripe (no Supabase JWT), so
// `verify_jwt = false` is set for this function in supabase/config.toml.
// Authenticity is instead verified via the Stripe-Signature header below.

Deno.serve(async (req: Request) => {
  const signature = req.headers.get('Stripe-Signature');
  const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET');

  if (!signature || !webhookSecret) {
    return new Response('Missing signature or webhook secret', { status: 400 });
  }

  const body = await req.text();
  const stripe = getStripeClient();

  let event;
  try {
    event = await stripe.webhooks.constructEventAsync(body, signature, webhookSecret);
  } catch (error) {
    console.error('stripe-webhook signature verification failed', error);
    return new Response(`Webhook signature verification failed: ${(error as Error).message}`, { status: 400 });
  }

  const serviceClient = getServiceClient();

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as unknown as StripeCheckoutSessionLike;
        const customerId = session.customer;
        const subscriptionId = session.subscription;

        if (subscriptionId) {
          const subscription = await stripe.subscriptions.retrieve(subscriptionId);
          const priceId = subscription.items.data[0]?.price?.id ?? '';

          await serviceClient
            .from('subscriptions')
            .update({
              stripe_subscription_id: subscription.id,
              plan_tier: planForPriceId(priceId),
              status: subscription.status,
              current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
            })
            .eq('stripe_customer_id', customerId);
        }
        break;
      }

      case 'customer.subscription.updated':
      case 'customer.subscription.created': {
        const subscription = event.data.object as unknown as StripeSubscriptionLike;
        const priceId = subscription.items.data[0]?.price?.id ?? '';

        await serviceClient
          .from('subscriptions')
          .update({
            stripe_subscription_id: subscription.id,
            plan_tier: planForPriceId(priceId),
            status: subscription.status,
            current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
          })
          .eq('stripe_customer_id', subscription.customer);
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as unknown as StripeSubscriptionLike;

        await serviceClient
          .from('subscriptions')
          .update({
            status: 'canceled',
            plan_tier: 'none',
          })
          .eq('stripe_customer_id', subscription.customer);
        break;
      }

      default:
        // Ignore other event types
        break;
    }
  } catch (error) {
    console.error(`stripe-webhook error handling ${event.type}`, error);
    return new Response('Webhook handler error', { status: 500 });
  }

  return new Response(JSON.stringify({ received: true }), {
    headers: { 'Content-Type': 'application/json' },
  });
});
