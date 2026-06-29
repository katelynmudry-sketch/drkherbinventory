import { corsHeaders } from '../_shared/cors.ts';
import { getServiceClient, getUserClient } from '../_shared/supabaseClients.ts';
import { getStripeClient, priceIdForPlan, PlanTier } from '../_shared/stripe.ts';

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Missing Authorization header' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { plan } = await req.json() as { plan: PlanTier };
    if (plan !== 'basic' && plan !== 'pro') {
      return new Response(JSON.stringify({ error: 'Invalid plan' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const userClient = getUserClient(authHeader);
    const { data: { user }, error: authError } = await userClient.auth.getUser();
    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const stripe = getStripeClient();
    const serviceClient = getServiceClient();

    // Reuse an existing Stripe customer if we already created one for this user.
    const { data: existingSub } = await serviceClient
      .from('subscriptions')
      .select('stripe_customer_id')
      .eq('user_id', user.id)
      .maybeSingle();

    let customerId = existingSub?.stripe_customer_id as string | undefined;

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: { supabase_user_id: user.id },
      });
      customerId = customer.id;

      await serviceClient
        .from('subscriptions')
        .upsert({ user_id: user.id, stripe_customer_id: customerId }, { onConflict: 'user_id' });
    }

    const origin = req.headers.get('Origin') ?? req.headers.get('Referer') ?? '/';

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      customer: customerId,
      client_reference_id: user.id,
      line_items: [{ price: priceIdForPlan(plan), quantity: 1 }],
      success_url: `${origin}?checkout=success`,
      cancel_url: `${origin}?checkout=cancelled`,
    });

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('stripe-checkout error', error);
    return new Response(JSON.stringify({ error: (error as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
