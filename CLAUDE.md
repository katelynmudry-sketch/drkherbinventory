# HerbInventory - CLAUDE.md

## Project Overview

A herbal inventory management web app for a clinical setting. Core workflow:
- **Phone**: Voice-to-text input to update herb inventory on the go
- **Desktop**: Ordering/pricing research when herbs are out of stock

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite (port 8080)
- **Styling**: Tailwind CSS + shadcn/ui (Radix UI components)
- **Backend**: Supabase (PostgreSQL + auth + realtime subscriptions)
- **State**: TanStack React Query v5
- **Voice**: Browser Web Speech API + Speech Synthesis API
- **Routing**: React Router v6
- **Testing**: Vitest
- **Deployment**: GitHub Pages at `/drkherbinventory/` base path

## Key Files

| File | Purpose |
|------|---------|
| [src/pages/Index.tsx](src/pages/Index.tsx) | Main dashboard with tabs, search, voice controls |
| [src/pages/Reports.tsx](src/pages/Reports.tsx) | Inventory stats overview |
| [src/components/VoiceHerbAdd.tsx](src/components/VoiceHerbAdd.tsx) | Voice commands: add/remove/change status |
| [src/components/VoiceQuery.tsx](src/components/VoiceQuery.tsx) | Voice-based inventory queries |
| [src/components/BulkInventorySection.tsx](src/components/BulkInventorySection.tsx) | Bulk herbs inventory view |
| [src/hooks/useInventory.ts](src/hooks/useInventory.ts) | All CRUD operations via React Query + Supabase |
| [src/lib/herbCorrection.ts](src/lib/herbCorrection.ts) | Voice recognition correction (100+ herb name variants) |
| [src/integrations/supabase/types.ts](src/integrations/supabase/types.ts) | Database schema types |
| [src/components/AppGate.tsx](src/components/AppGate.tsx) | App-wide gate: requires sign-in + active subscription before rendering any route |
| [src/components/Paywall.tsx](src/components/Paywall.tsx) | Plan picker (Basic/Pro) shown to signed-in users without an active subscription |
| [src/hooks/useSubscription.ts](src/hooks/useSubscription.ts) | Reads the caller's subscription tier/status; Stripe checkout + billing portal mutations |
| [src/components/VoiceAssistant.tsx](src/components/VoiceAssistant.tsx) | Pro-only: AI Voice Assistant card (compound natural-language commands) |
| [src/hooks/useVoiceAssistant.ts](src/hooks/useVoiceAssistant.ts) | Calls the `voice-assistant` edge function |
| [supabase/functions/voice-assistant/index.ts](supabase/functions/voice-assistant/index.ts) | Edge function: Claude-powered NLU + spoken response, tier/rate-limit gated |
| [supabase/functions/stripe-checkout/index.ts](supabase/functions/stripe-checkout/index.ts) | Edge function: creates a Stripe Checkout session for Basic/Pro |
| [supabase/functions/stripe-portal/index.ts](supabase/functions/stripe-portal/index.ts) | Edge function: creates a Stripe Billing Portal session |
| [supabase/functions/stripe-webhook/index.ts](supabase/functions/stripe-webhook/index.ts) | Edge function: syncs `subscriptions` table from Stripe webhook events |

## Data Model

**Herbs** tracked across 4 locations: `clinic`, `backstock`, `tincture`, `bulk`
**Status levels**: `full`, `low`, `out`
**Unique constraint**: herb name + location (no duplicates per location)

## Voice Command Patterns

```
"Add to [location] [status] [herb names]"
"Remove from [location] [herb name]"
"Change [location] [herb name] to [status]"
```

Herb name correction uses fuzzy matching (Levenshtein distance) + a 100+ entry synonym map in `herbCorrection.ts`.

## Active Development: Ordering & Pricing Feature

**Goal**: When a bulk herb is `out`, show a ranked list of suppliers with pricing so ordering decisions can be made from the desktop.

**Planned approach**:
- New Supabase table: `suppliers` (name, URL, notes)
- New Supabase table: `herb_pricing` (herb_name, supplier_id, price_per_oz, last_updated, notes, url)
- New page: `/ordering` — shows all `out` bulk herbs with supplier comparison table
- Desktop-optimized layout (not voice-driven)
- Ability to manually update pricing when placing orders

## Subscriptions (Stripe)

The entire app is gated behind an active paid subscription — there is no
free tier. `src/components/AppGate.tsx` wraps all routes in `App.tsx`:
signed-out users see `AuthForm`, signed-in users without an active
subscription see `Paywall`.

**Tiers**:
- **Basic ($4/mo)**: inventory management — `VoiceHerbAdd`, `VoiceQuery`,
  inventory sections, reports, ordering.
- **Pro ($10/mo)**: everything in Basic + the AI Voice Assistant.

**`subscriptions` table** (`supabase/migrations/20260615_subscriptions.sql`):
one row per user, `plan_tier` (`none`/`basic`/`pro`), `status`
(`active`/`trialing`/`past_due`/`canceled`/`incomplete`/`inactive`),
`stripe_customer_id`, `stripe_subscription_id`, `current_period_end`. RLS:
users can only `SELECT` their own row; all writes are service-role only
(via the webhook). `useSubscription()` derives `isActive` (status is
`active` or `trialing`) and `hasAI` (`isActive && tier === 'pro'`).

**Edge functions**: `stripe-checkout` (creates a Checkout session for
`basic`/`pro`), `stripe-portal` (Billing Portal session — "Manage Billing"
button in `Index.tsx`), `stripe-webhook` (syncs `subscriptions` from Stripe
events; `verify_jwt = false` in `supabase/config.toml` since Stripe calls it
directly and authenticity is checked via the Stripe signature instead).

**Required secrets** (Supabase Edge Function secrets):
- `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`
- `STRIPE_PRICE_ID_BASIC`, `STRIPE_PRICE_ID_PRO` (from the Stripe Dashboard
  Products/Prices for the two tiers above)

**Webhook setup**: in the Stripe Dashboard, add a webhook endpoint pointing
at the deployed `stripe-webhook` function URL, subscribed to
`checkout.session.completed`, `customer.subscription.created`,
`customer.subscription.updated`, and `customer.subscription.deleted`.

## AI Voice Assistant (Claude)

Pro-only feature, additive to the existing manual voice commands
(`VoiceHerbAdd`/`VoiceQuery`, which remain free-form regex-based and
unchanged). Transcription still happens client-side via the free browser
Web Speech API (`useVoiceRecognition`) — only the *understanding* and
*spoken response* are sent to Claude.

- `src/components/VoiceAssistant.tsx` lets a user speak compound,
  conversational commands (e.g. "I just ran out of borage, what's in my
  inventory?"). The transcript + alternatives + `activeTab` are sent to the
  `voice-assistant` edge function, which returns a `spokenResponse` (read
  aloud via `speechSynthesis`) and a list of proposed inventory `actions`.
- Every proposed `herbName` is re-validated client-side via `scanForHerbs`/
  `buildExtraNamesFromHerbs` (same correction logic as
  `src/lib/herbCorrection.ts`) before being shown for confirmation —
  unmatched names are dropped rather than used to auto-create herbs.
- `supabase/functions/voice-assistant/index.ts`: checks the caller's
  `subscriptions` row (must be Pro + active/trialing, else 403), enforces a
  per-user daily rate limit via the `voice_api_usage` table (default 50/day,
  override with `VOICE_ASSISTANT_DAILY_LIMIT`), grounds the prompt with the
  user's herbs + current inventory, and calls Claude
  (`claude-haiku-4-5-20251001`) with forced tool-use to get structured
  `actions` + `spokenResponse`.
- `voice_api_usage` table (`supabase/migrations/20260616_voice_api_usage.sql`)
  logs token counts and action counts per call for rate limiting — no raw
  transcript/response text is stored.

**Required secret**: `ANTHROPIC_API_KEY` (Supabase Edge Function secret,
never exposed to the client). Optional: `VOICE_ASSISTANT_DAILY_LIMIT`.

## Device Usage Context

- **Mobile (phone)**: Voice input for inventory updates — keep UI minimal, large touch targets, voice-first
- **Desktop**: Ordering/pricing research — can use dense data tables, multi-column layouts

## Development Commands

```bash
npm run dev        # Start dev server on port 8080
npm run build      # Production build
npm run preview    # Preview production build
npm run test       # Run Vitest tests
npm run lint       # ESLint check
```

## Environment Variables

```
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

> Note: `src/integrations/supabase/client.ts` actually reads
> `VITE_SUPABASE_PUBLISHABLE_KEY`, not `VITE_SUPABASE_ANON_KEY` as documented
> above. This is a pre-existing naming mismatch (informational only — not
> changed by the subscriptions/voice-assistant work).

## Deployment

GitHub Pages — base path is `/drkherbinventory/`. The `vite.config.ts` base must match. GitHub Actions workflow in `.github/workflows/deploy.yml`.

## Conventions

- Use existing shadcn/ui components from `src/components/ui/` — do not install new UI libraries
- All data mutations go through `useInventory.ts` hook (React Query + Supabase)
- Voice feedback uses browser Speech Synthesis — keep response strings concise
- Herb name correction belongs in `herbCorrection.ts`, not inline in components
- Mobile-first for voice features; desktop-optimized for ordering/reporting features
