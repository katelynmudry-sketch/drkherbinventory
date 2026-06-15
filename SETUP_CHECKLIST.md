# Setup Checklist: Stripe Subscriptions + AI Voice Assistant

Manual steps to finish deploying the Stripe billing + Claude AI Voice
Assistant changes from branch `claude/cloud-api-voice-commands-74gtvi`.
Code, migrations, and edge functions are already written — this is just
the infrastructure/config work that has to happen outside the repo.

Run these from the project root with the [Supabase CLI](https://supabase.com/docs/guides/cli)
linked to this project (`supabase link --project-ref <project-ref>`).

## 1. Apply database migrations

- [ ] `supabase/migrations/20260615_subscriptions.sql` (creates `subscriptions` table)
- [ ] `supabase/migrations/20260616_voice_api_usage.sql` (creates `voice_api_usage` table)

```bash
supabase db push
```

## 2. Deploy edge functions

```bash
supabase functions deploy stripe-checkout
supabase functions deploy stripe-portal
supabase functions deploy stripe-webhook --no-verify-jwt
supabase functions deploy voice-assistant
```

- [ ] `stripe-checkout` deployed
- [ ] `stripe-portal` deployed
- [ ] `stripe-webhook` deployed (no JWT verification — Stripe calls this directly)
- [ ] `voice-assistant` deployed

## 3. Create Stripe Products & Prices

In the [Stripe Dashboard](https://dashboard.stripe.com/products):

- [ ] **Basic** plan — $4/mo recurring price → copy the Price ID (`price_...`)
- [ ] **Pro** plan — $10/mo recurring price → copy the Price ID (`price_...`)

## 4. Set Supabase Edge Function secrets

```bash
supabase secrets set STRIPE_SECRET_KEY=sk_live_...
supabase secrets set STRIPE_WEBHOOK_SECRET=whsec_...
supabase secrets set STRIPE_PRICE_ID_BASIC=price_...
supabase secrets set STRIPE_PRICE_ID_PRO=price_...
supabase secrets set ANTHROPIC_API_KEY=sk-ant-...
```

- [ ] `STRIPE_SECRET_KEY`
- [ ] `STRIPE_WEBHOOK_SECRET` (from step 5 below — you may need to do step 5 first, then come back and set this)
- [ ] `STRIPE_PRICE_ID_BASIC`
- [ ] `STRIPE_PRICE_ID_PRO`
- [ ] `ANTHROPIC_API_KEY`
- [ ] *(optional)* `VOICE_ASSISTANT_DAILY_LIMIT` — defaults to `50` requests/user/day if unset

## 5. Configure the Stripe webhook

In the Stripe Dashboard → Developers → Webhooks:

- [ ] Add an endpoint pointing at:
  `https://<project-ref>.supabase.co/functions/v1/stripe-webhook`
- [ ] Subscribe it to these events:
  - `checkout.session.completed`
  - `customer.subscription.created`
  - `customer.subscription.updated`
  - `customer.subscription.deleted`
- [ ] Copy the endpoint's **Signing secret** (`whsec_...`) and set it as
  `STRIPE_WEBHOOK_SECRET` (step 4)

## 6. Test end-to-end

- [ ] Sign in to the app while signed out of any subscription → should see the **Paywall**
- [ ] Subscribe to **Basic** (use a [Stripe test card](https://docs.stripe.com/testing) in test mode) → app unlocks, no AI Assistant card (shows "Upgrade to Pro" instead)
- [ ] Subscribe to **Pro** → AI Assistant card appears
- [ ] Try a compound voice command, e.g. *"I just ran out of borage, what's in my inventory?"*
  - [ ] Pure query (no inventory change)
  - [ ] Pure update (add/remove/change status)
  - [ ] Ambiguous input → assistant asks for clarification
  - [ ] Herb name it doesn't recognize → action is dropped, listed under "Couldn't match"
- [ ] Rate limit: temporarily set `VOICE_ASSISTANT_DAILY_LIMIT=1`, confirm the 2nd request that day returns the friendly rate-limit message, then reset the limit
- [ ] "Manage Billing" button opens the Stripe customer portal

## Done?

Once everything above is checked off, you can delete this file
(`SETUP_CHECKLIST.md`) — it's just a one-time setup guide and isn't
referenced by the app.
