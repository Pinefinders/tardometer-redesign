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
