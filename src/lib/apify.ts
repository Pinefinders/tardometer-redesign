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
  data?: ApifyTweetData | ApifyTweetData[];
  count?: number;
  error?: string;
}

// Error types for better UX messaging
export class ApifyError extends Error {
  constructor(message: string, public readonly isUserError: boolean = false) {
    super(message);
    this.name = 'ApifyError';
  }
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

  if (!response.data || Array.isArray(response.data)) {
    throw new ApifyError('Invalid response format from API');
  }

  console.log('[Apify] Tweet data received:', response.data);
  return response.data;
}

/**
 * Fetch a user's recent tweets from the Apify API via edge function
 */
export async function fetchUserTweets(username: string, count: number = 15): Promise<ApifyTweetData[]> {
  console.log(`[Apify] Fetching ${count} tweets for user: @${username}`);
  
  const { data, error } = await supabase.functions.invoke('fetch-twitter-data', {
    body: { type: 'profile', username, count },
  });

  if (error) {
    console.error('[Apify] Edge function error:', error);
    throw new ApifyError(`Failed to fetch user tweets: ${error.message}`);
  }

  const response = data as ApifyResponse;
  
  if (!response.success) {
    const errorMsg = response.error || 'Unknown error';
    const isUserError = errorMsg.includes('not found') || 
                        errorMsg.includes('private') || 
                        errorMsg.includes('No tweets');
    throw new ApifyError(errorMsg, isUserError);
  }

  if (!response.data || !Array.isArray(response.data)) {
    throw new ApifyError('Invalid response format from API');
  }

  console.log(`[Apify] Received ${response.data.length} tweets for @${username}`);
  return response.data;
}
