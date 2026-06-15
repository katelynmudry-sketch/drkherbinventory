-- ============================================================
-- Voice API usage log — rate limiting & cost tracking for the
-- Claude-powered AI Voice Assistant (Pro tier)
-- Run this in Supabase Dashboard > SQL Editor
-- ============================================================

CREATE TABLE public.voice_api_usage (
  id              UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id         UUID NOT NULL,
  created_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  model           TEXT NOT NULL,
  input_tokens    INTEGER NOT NULL DEFAULT 0,
  output_tokens   INTEGER NOT NULL DEFAULT 0,
  transcript_len  INTEGER,
  action_count    INTEGER NOT NULL DEFAULT 0,
  success         BOOLEAN NOT NULL DEFAULT true,
  error_message   TEXT
);

ALTER TABLE public.voice_api_usage ENABLE ROW LEVEL SECURITY;

-- Users can view their own usage (e.g. "X of Y calls used today").
-- No insert/update/delete policies — only the service-role edge function writes.
CREATE POLICY "Users can view their own voice_api_usage"
  ON public.voice_api_usage FOR SELECT USING (auth.uid() = user_id);

-- Supports the daily rate-limit count query (user_id, created_at >= start of day)
CREATE INDEX idx_voice_api_usage_user_created
  ON public.voice_api_usage (user_id, created_at);
