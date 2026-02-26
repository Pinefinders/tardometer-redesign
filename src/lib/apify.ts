import { supabase } from "@/integrations/supabase/client";

// Types for API responses
export interface ApifyTweetData {
  id: string;
  likes: number;
  retweets: number;
  replies: number;
  quoteRetweets: number;
  authorUsername: string;
  hasCommunityNote: boolean;
}

interface ApifyResponse {
  success: boolean;
  data?: ApifyTweetData;
  error?: string;
}

// Error types for better UX messaging
export class ApifyError extends Error {
  constructor(message: string, public readonly isUserError: boolean = false) {
    super(message);
    this.name = 'ApifyError';
  }
}

export interface CachedResult {
  score: number;
  zone: string;
  likes: number;
  replies: number;
  retweets: number;
  quotes: number;
  has_community_note: boolean;
  reply_ratio: number;
  quote_ratio: number;
  engagement_quality: number;
  raw_score: number;
  author_username: string;
  tweet_id: string;
}

const CACHE_MAX_AGE_MS = 24 * 60 * 60 * 1000; // 24 hours

/**
 * Check cache for a tweet result
 */
export async function checkCache(tweetUrl: string): Promise<CachedResult | null> {
  try {
    // Normalize URL
    const normalized = normalizeTweetUrl(tweetUrl);
    
    const { data, error } = await supabase
      .from('tweet_cache')
      .select('*')
      .eq('tweet_url', normalized)
      .maybeSingle();

    if (error || !data) return null;

    // Check if cache is fresh (< 24 hours)
    const cacheAge = Date.now() - new Date(data.created_at).getTime();
    if (cacheAge > CACHE_MAX_AGE_MS) return null;

    return {
      score: data.score,
      zone: data.zone,
      likes: data.likes,
      replies: data.replies,
      retweets: data.retweets,
      quotes: data.quotes,
      has_community_note: data.has_community_note,
      reply_ratio: Number(data.reply_ratio) || 0,
      quote_ratio: Number(data.quote_ratio) || 0,
      engagement_quality: Number(data.engagement_quality) || 0,
      raw_score: Number(data.raw_score) || 0,
      author_username: data.author_username || 'unknown',
      tweet_id: data.tweet_id,
    };
  } catch (e) {
    console.warn('[Cache] Read error:', e);
    return null;
  }
}

/**
 * Store a result in cache
 */
export async function storeInCache(
  tweetUrl: string,
  tweetId: string,
  score: number,
  zone: string,
  metrics: ApifyTweetData,
  scoreDetails: { replyRatio: number; quoteRatio: number; engagementQuality: number; rawTardScore: number }
): Promise<void> {
  try {
    const normalized = normalizeTweetUrl(tweetUrl);

    await supabase
      .from('tweet_cache')
      .upsert({
        tweet_url: normalized,
        tweet_id: tweetId,
        score,
        zone,
        likes: metrics.likes,
        replies: metrics.replies,
        retweets: metrics.retweets,
        quotes: metrics.quoteRetweets,
        has_community_note: metrics.hasCommunityNote,
        reply_ratio: scoreDetails.replyRatio,
        quote_ratio: scoreDetails.quoteRatio,
        engagement_quality: scoreDetails.engagementQuality,
        raw_score: scoreDetails.rawTardScore,
        author_username: metrics.authorUsername,
        created_at: new Date().toISOString(),
      }, { onConflict: 'tweet_url' });
  } catch (e) {
    console.warn('[Cache] Write error:', e);
  }
}

function normalizeTweetUrl(url: string): string {
  // Extract tweet ID and normalize to x.com format
  const match = url.match(/status\/(\d+)/);
  if (match) return `https://x.com/i/status/${match[1]}`;
  return url;
}

/**
 * Fetch a single tweet's data from the Apify API via edge function
 */
export async function fetchSingleTweet(tweetId: string): Promise<ApifyTweetData> {
  console.log(`[Apify] Fetching tweet: ${tweetId}`);
  
  const { data, error } = await supabase.functions.invoke('fetch-twitter-data', {
    body: { type: 'tweet', tweetId },
  });

  if (error) {
    console.error('[Apify] Edge function error:', error);
    throw new ApifyError(`Failed to fetch tweet: ${error.message}`);
  }

  const response = data as ApifyResponse;
  
  if (!response.success) {
    const errorMsg = response.error || 'Unknown error';
    const isUserError = errorMsg.includes('not found') || errorMsg.includes('protected');
    throw new ApifyError(errorMsg, isUserError);
  }

  if (!response.data) {
    throw new ApifyError('Invalid response format from API');
  }

  console.log('[Apify] Tweet data received:', response.data);
  return response.data;
}
