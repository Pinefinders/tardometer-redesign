CREATE TABLE public.tweet_cache (
  tweet_url TEXT PRIMARY KEY,
  tweet_id TEXT NOT NULL,
  score INTEGER NOT NULL,
  zone TEXT NOT NULL,
  likes INTEGER NOT NULL DEFAULT 0,
  replies INTEGER NOT NULL DEFAULT 0,
  retweets INTEGER NOT NULL DEFAULT 0,
  quotes INTEGER NOT NULL DEFAULT 0,
  has_community_note BOOLEAN NOT NULL DEFAULT false,
  reply_ratio NUMERIC,
  quote_ratio NUMERIC,
  engagement_quality NUMERIC,
  raw_score NUMERIC,
  author_username TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.tweet_cache ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to tweet_cache"
  ON public.tweet_cache FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Allow service role insert/update on tweet_cache"
  ON public.tweet_cache FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow anon insert on tweet_cache"
  ON public.tweet_cache FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Allow anon update on tweet_cache"
  ON public.tweet_cache FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);