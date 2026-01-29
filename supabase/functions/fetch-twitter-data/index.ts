import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

// Apify actors
const FREE_TWEET_SCRAPER = "coder_luffy~free-tweet-scraper"; // For individual tweets by ID
const TWITTER_SCRAPER_LITE = "apidojo~twitter-scraper-lite"; // For user profile tweets

interface ApifyRunResponse {
  data: {
    id: string;
    status: string;
    defaultDatasetId: string;
  };
}

// Tweet data from Free Tweet Scraper (coder_luffy/free-tweet-scraper)
interface FreeTweetData {
  tweet_id?: string;
  id_str?: string;
  full_text?: string;
  text?: string;
  favorite_count?: number;
  retweet_count?: number;
  reply_count?: number;
  quote_count?: number;
  user_id_str?: string;
  screen_name?: string;
  user?: {
    screen_name?: string;
    name?: string;
  };
  noResults?: boolean;
}

// Tweet data from Twitter Scraper Lite (apidojo/twitter-scraper-lite)
interface LiteTweetData {
  id?: string;
  type?: string;
  text?: string;
  likeCount?: number;
  retweetCount?: number;
  replyCount?: number;
  quoteCount?: number;
  author?: {
    userName?: string;
    screenName?: string;
    name?: string;
    followers?: number;
  };
  noResults?: boolean;
}

// Normalized output
interface NormalizedTweet {
  id: string;
  likes: number;
  retweets: number;
  replies: number;
  quoteRetweets: number;
  authorUsername: string;
  hasCommunityNote: boolean;
}

// Check if result is valid
function isValidResult(data: unknown): boolean {
  if (!data || typeof data !== 'object') return false;
  const obj = data as Record<string, unknown>;
  return obj.noResults !== true;
}

// Normalize from Free Tweet Scraper format
function normalizeFreeTweet(tweet: FreeTweetData): NormalizedTweet | null {
  if (!isValidResult(tweet)) return null;
  
  return {
    id: tweet.tweet_id || tweet.id_str || '',
    likes: tweet.favorite_count ?? 0,
    retweets: tweet.retweet_count ?? 0,
    replies: tweet.reply_count ?? 0,
    quoteRetweets: tweet.quote_count ?? 0,
    authorUsername: tweet.screen_name ?? tweet.user?.screen_name ?? 'unknown',
    hasCommunityNote: false, // Not available in this scraper
  };
}

// Normalize from Twitter Scraper Lite format
function normalizeLiteTweet(tweet: LiteTweetData): NormalizedTweet | null {
  if (!isValidResult(tweet)) return null;
  if (tweet.type && tweet.type !== 'tweet') return null; // Skip non-tweet items
  
  return {
    id: tweet.id || '',
    likes: tweet.likeCount ?? 0,
    retweets: tweet.retweetCount ?? 0,
    replies: tweet.replyCount ?? 0,
    quoteRetweets: tweet.quoteCount ?? 0,
    authorUsername: tweet.author?.userName ?? tweet.author?.screenName ?? 'unknown',
    hasCommunityNote: false, // Not available in this scraper
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
async function fetchDatasetItems<T>(datasetId: string, apiKey: string): Promise<T[]> {
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
      throw new Error('APIFY_API_KEY is not configured');
    }

    const { type, tweetId, username, count = 15 } = await req.json();

    if (type === 'tweet' && tweetId) {
      // Use Free Tweet Scraper for individual tweets - it accepts tweetIds directly
      console.log(`Fetching single tweet: ${tweetId}`);
      
      const runResponse = await fetch(`https://api.apify.com/v2/acts/${FREE_TWEET_SCRAPER}/runs`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${APIFY_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tweetIds: [tweetId],
        }),
      });

      if (!runResponse.ok) {
        const errorText = await runResponse.text();
        throw new Error(`Failed to start Apify run: ${runResponse.status} - ${errorText}`);
      }

      const runData: ApifyRunResponse = await runResponse.json();
      console.log(`Apify run started: ${runData.data.id}`);
      
      const datasetId = await waitForRun(runData.data.id, APIFY_API_KEY, 60000);
      const tweets = await fetchDatasetItems<FreeTweetData>(datasetId, APIFY_API_KEY);
      
      console.log(`Received ${tweets.length} items from Apify`);
      if (tweets.length > 0) {
        console.log('Raw data sample:', JSON.stringify(tweets[0]).substring(0, 1000));
      }
      
      const validTweets = tweets
        .map(normalizeFreeTweet)
        .filter((t): t is NormalizedTweet => t !== null && t.id !== '');
      
      console.log(`Valid tweets: ${validTweets.length}`);
      
      if (validTweets.length === 0) {
        throw new Error('Tweet not found - it may be deleted, protected, or unavailable');
      }

      const targetTweet = validTweets.find(t => t.id === tweetId) || validTweets[0];
      
      return new Response(JSON.stringify({
        success: true,
        data: targetTweet,
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });

    } else if (type === 'profile' && username) {
      // Use Twitter Scraper Lite for user profiles - better for timelines
      console.log(`Fetching tweets for user: @${username}, count: ${count}`);
      
      const runResponse = await fetch(`https://api.apify.com/v2/acts/${TWITTER_SCRAPER_LITE}/runs`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${APIFY_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          startUrls: [`https://x.com/${username}`],
          maxItems: Math.min(count, 25),
          sort: "Latest",
        }),
      });

      if (!runResponse.ok) {
        const errorText = await runResponse.text();
        throw new Error(`Failed to start Apify run: ${runResponse.status} - ${errorText}`);
      }

      const runData: ApifyRunResponse = await runResponse.json();
      console.log(`Apify run started: ${runData.data.id}`);
      
      const datasetId = await waitForRun(runData.data.id, APIFY_API_KEY, 120000);
      const tweets = await fetchDatasetItems<LiteTweetData>(datasetId, APIFY_API_KEY);
      
      console.log(`Received ${tweets.length} items for @${username}`);
      if (tweets.length > 0) {
        console.log('Raw data sample:', JSON.stringify(tweets[0]).substring(0, 1000));
      }
      
      const validTweets = tweets
        .map(normalizeLiteTweet)
        .filter((t): t is NormalizedTweet => t !== null && t.id !== '');
      
      console.log(`Valid tweets: ${validTweets.length}`);
      
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
      throw new Error('Invalid request: must provide either tweetId or username');
    }

  } catch (error) {
    console.error('Error fetching Twitter data:', error);
    
    return new Response(JSON.stringify({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
