-- ============================================================
-- Subscriptions (Stripe) — app-wide paywall
-- Run this in Supabase Dashboard > SQL Editor
-- ============================================================

CREATE TABLE public.subscriptions (
  id                      UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id                 UUID NOT NULL UNIQUE,
  stripe_customer_id      TEXT UNIQUE,
  stripe_subscription_id  TEXT UNIQUE,
  plan_tier               TEXT NOT NULL DEFAULT 'none' CHECK (plan_tier IN ('none', 'basic', 'pro')),
  status                  TEXT NOT NULL DEFAULT 'inactive', -- active|trialing|past_due|canceled|incomplete|inactive
  current_period_end      TIMESTAMP WITH TIME ZONE,
  created_at              TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at              TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

-- Users can read their own subscription status (drives app gating client-side).
-- No insert/update/delete policies for regular users — only the service-role
-- Stripe webhook handler writes to this table.
CREATE POLICY "Users can view their own subscription"
  ON public.subscriptions FOR SELECT USING (auth.uid() = user_id);

CREATE TRIGGER update_subscriptions_updated_at
  BEFORE UPDATE ON public.subscriptions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
