import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

// Actor 1: For single tweet analysis - supports individual tweet URLs
const TWITTER_SCRAPER_UNLIMITED = "apidojo~twitter-scraper-unlimited";

// Actor 2: For user profile analysis - optimized for bulk fetching
const TWEET_SCRAPER_V2 = "apidojo~tweet-scraper";

interface ApifyRunResponse {
  data: {
    id: string;
    status: string;
    defaultDatasetId: string;
  };
}

// Tweet data format from both Apify actors
interface TweetData {
  // ID fields
  id?: string;
  id_str?: string;
  
  // Content
  text?: string;
  full_text?: string;
  
  // Engagement metrics (Apify format)
  likeCount?: number;
  retweetCount?: number;
  replyCount?: number;
  quoteCount?: number;
  
  // Alternative format (Twitter v1)
  favorite_count?: number;
  retweet_count?: number;
  reply_count?: number;
  quote_count?: number;
  
  // Author info
  author?: {
    userName?: string;
    screenName?: string;
    name?: string;
    id?: string;
  };
  
  // Alternative user format
  user?: {
    screen_name?: string;
    name?: string;
  };
  
  // Tweet metadata
  type?: string;
  url?: string;
  createdAt?: string;
  
  // Community note / birdwatch
  birdwatch_pivot?: unknown;
  note?: unknown;
  
  // Error indicator
  noResults?: boolean;
}

interface NormalizedTweet {
  id: string;
  likes: number;
  retweets: number;
  replies: number;
  quoteRetweets: number;
  authorUsername: string;
  hasCommunityNote: boolean;
}

// Check if result is valid tweet data
function isValidTweet(data: TweetData): boolean {
  if (!data) return false;
  if (data.noResults === true) return false;
  if (data.type && data.type !== 'tweet') return false;
  
  // Must have some engagement data or an ID
  const hasId = !!(data.id || data.id_str);
  const hasEngagement = (data.likeCount !== undefined) || 
                        (data.favorite_count !== undefined) ||
                        (data.retweetCount !== undefined);
  
  return hasId || hasEngagement;
}

// Normalize tweet data from Apify response
function normalizeTweet(tweet: TweetData): NormalizedTweet | null {
  if (!isValidTweet(tweet)) return null;
  
  return {
    id: tweet.id || tweet.id_str || '',
    likes: tweet.likeCount ?? tweet.favorite_count ?? 0,
    retweets: tweet.retweetCount ?? tweet.retweet_count ?? 0,
    replies: tweet.replyCount ?? tweet.reply_count ?? 0,
    quoteRetweets: tweet.quoteCount ?? tweet.quote_count ?? 0,
    authorUsername: tweet.author?.userName ?? 
                    tweet.author?.screenName ?? 
                    tweet.user?.screen_name ?? 
                    'unknown',
    hasCommunityNote: !!(tweet.birdwatch_pivot || tweet.note),
  };
}

// Wait for Apify run to complete
async function waitForRun(runId: string, apiKey: string, maxWaitMs = 120000): Promise<string> {
  const startTime = Date.now();
  const pollInterval = 2000;
  
  while (Date.now() - startTime < maxWaitMs) {
    const response = await fetch(`https://api.apify.com/v2/actor-runs/${runId}`, {
      headers: { 'Authorization': `Bearer ${apiKey}` },
    });
    
    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Failed to check run status: ${response.status} - ${text}`);
    }
    
    const data = await response.json();
    console.log(`Run status: ${data.data.status}`);
    
    if (data.data.status === 'SUCCEEDED') {
      return data.data.defaultDatasetId;
    } else if (['FAILED', 'ABORTED', 'TIMED-OUT'].includes(data.data.status)) {
      throw new Error(`Apify run ${data.data.status}`);
    }
    
    await new Promise(resolve => setTimeout(resolve, pollInterval));
  }
  
  throw new Error('Apify run timed out');
}

// Fetch dataset items
async function fetchDatasetItems(datasetId: string, apiKey: string): Promise<TweetData[]> {
  const response = await fetch(`https://api.apify.com/v2/datasets/${datasetId}/items?clean=true&format=json`, {
    headers: { 'Authorization': `Bearer ${apiKey}` },
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to fetch dataset: ${response.status} - ${errorText}`);
  }
  
  return await response.json();
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const APIFY_API_KEY = Deno.env.get('APIFY_API_KEY');
    if (!APIFY_API_KEY) {
      throw new Error('APIFY_API_KEY is not configured. Please add your Apify API key in Cloud secrets.');
    }

    const { type, tweetId, tweetUrl, username, count = 15 } = await req.json();

    if (type === 'tweet' && (tweetId || tweetUrl)) {
      // Use Twitter Scraper Unlimited for single tweets
      const url = tweetUrl || `https://x.com/i/status/${tweetId}`;
      console.log(`[Tweet] Fetching single tweet: ${url}`);
      
      const runResponse = await fetch(`https://api.apify.com/v2/acts/${TWITTER_SCRAPER_UNLIMITED}/runs`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${APIFY_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          startUrls: [url],
          maxItems: 1,
        }),
      });

      if (!runResponse.ok) {
        const errorText = await runResponse.text();
        console.error(`Apify error: ${errorText}`);
        throw new Error(`Failed to start Apify run: ${runResponse.status} - ${errorText}`);
      }

      const runData: ApifyRunResponse = await runResponse.json();
      console.log(`[Tweet] Apify run started: ${runData.data.id}`);
      
      const datasetId = await waitForRun(runData.data.id, APIFY_API_KEY, 90000);
      const tweets = await fetchDatasetItems(datasetId, APIFY_API_KEY);
      
      console.log(`[Tweet] Received ${tweets.length} items`);
      if (tweets.length > 0) {
        console.log('[Tweet] Raw data sample:', JSON.stringify(tweets[0]).substring(0, 1200));
      }
      
      const validTweets = tweets
        .map(normalizeTweet)
        .filter((t): t is NormalizedTweet => t !== null && t.id !== '');
      
      console.log(`[Tweet] Valid tweets: ${validTweets.length}`);
      
      if (validTweets.length === 0) {
        throw new Error('Tweet not found - it may be deleted, protected, or the account is suspended');
      }

      // Find matching tweet by ID or return first
      const targetTweet = tweetId 
        ? validTweets.find(t => t.id === tweetId) || validTweets[0]
        : validTweets[0];
      
      return new Response(JSON.stringify({
        success: true,
        data: targetTweet,
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });

    } else if (type === 'profile' && username) {
      // Use Tweet Scraper V2 for user profiles with searchTerms
      console.log(`[Profile] Fetching tweets for @${username}, count: ${count}`);
      
      const runResponse = await fetch(`https://api.apify.com/v2/acts/${TWEET_SCRAPER_V2}/runs`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${APIFY_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          searchTerms: [`from:${username}`],
          maxItems: Math.min(count, 25),
          sort: "Latest",
        }),
      });

      if (!runResponse.ok) {
        const errorText = await runResponse.text();
        console.error(`Apify error: ${errorText}`);
        throw new Error(`Failed to start Apify run: ${runResponse.status} - ${errorText}`);
      }

      const runData: ApifyRunResponse = await runResponse.json();
      console.log(`[Profile] Apify run started: ${runData.data.id}`);
      
      const datasetId = await waitForRun(runData.data.id, APIFY_API_KEY, 180000);
      const tweets = await fetchDatasetItems(datasetId, APIFY_API_KEY);
      
      console.log(`[Profile] Received ${tweets.length} items for @${username}`);
      if (tweets.length > 0) {
        console.log('[Profile] Raw data sample:', JSON.stringify(tweets[0]).substring(0, 1200));
      }
      
      const validTweets = tweets
        .map(normalizeTweet)
        .filter((t): t is NormalizedTweet => t !== null && t.id !== '');
      
      console.log(`[Profile] Valid tweets: ${validTweets.length}`);
      
      if (validTweets.length === 0) {
        throw new Error('No tweets found - the account may be private, suspended, or have no recent tweets');
      }

      return new Response(JSON.stringify({
        success: true,
        data: validTweets,
        count: validTweets.length,
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });

    } else {
      throw new Error('Invalid request: must provide either (type: "tweet", tweetId) or (type: "profile", username)');
    }

  } catch (error) {
    console.error('Error fetching Twitter data:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    
    // Provide more helpful error messages
    let userMessage = errorMessage;
    if (errorMessage.includes('actor-is-not-rented')) {
      userMessage = 'Apify subscription required. Please ensure you have an active subscription to the Twitter scraper actors on Apify.';
    } else if (errorMessage.includes('401')) {
      userMessage = 'Invalid Apify API key. Please check your API key in the Cloud secrets.';
    }
    
    return new Response(JSON.stringify({
      success: false,
      error: userMessage,
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
