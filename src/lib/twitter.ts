import { fetchSingleTweet, ApifyError } from './apify';

// Re-export for convenience
export { ApifyError };

// URL type detection
export type UrlType = 'tweet' | 'invalid';

export interface ParsedUrl {
  type: UrlType;
  tweetId?: string;
  username?: string;
}

// Parse a Twitter/X URL to extract tweet ID
export const parseTwitterUrl = (url: string): ParsedUrl => {
  const tweetPatterns = [
    /(?:twitter\.com|x\.com)\/(\w+)\/status\/(\d+)/i,
    /(?:twitter\.com|x\.com)\/(\w+)\/statuses\/(\d+)/i,
  ];

  for (const pattern of tweetPatterns) {
    const match = url.match(pattern);
    if (match && match[1] && match[2]) {
      return { type: 'tweet', tweetId: match[2], username: match[1] };
    }
  }

  return { type: 'invalid' };
};

// Tweet metrics interface
export interface TweetMetrics {
  likes: number;
  replies: number;
  retweets: number;
  quoteRetweets: number;
  tweetId: string;
  authorUsername: string;
  hasCommunityNote: boolean;
}

// Fetch real tweet metrics from Twitter via Apify
export const fetchTweetMetrics = async (tweetId: string): Promise<TweetMetrics> => {
  const tweetData = await fetchSingleTweet(tweetId);
  
  return {
    likes: tweetData.likes,
    replies: tweetData.replies,
    retweets: tweetData.retweets,
    quoteRetweets: tweetData.quoteRetweets,
    tweetId: tweetData.id,
    authorUsername: tweetData.authorUsername,
    hasCommunityNote: tweetData.hasCommunityNote,
  };
};

// Score calculation result
export interface TardScore {
  score: number;
  replyRatio: number;
  quoteRatio: number;
  engagementQuality: number;
  rawTardScore: number;
  hasCommunityNote?: boolean;
}

// Calculate the Tard score based on tweet metrics
export const calculateTardScore = (metrics: TweetMetrics): TardScore => {
  const { likes, replies, retweets, quoteRetweets, hasCommunityNote } = metrics;

  const replyRatio = likes > 0 ? replies / likes : 0;
  const quoteRatio = retweets > 0 ? quoteRetweets / retweets : 0;

  const negativeEngagement = replies + quoteRetweets;
  const positiveEngagement = likes + retweets;
  const engagementQuality = negativeEngagement > 0 
    ? positiveEngagement / negativeEngagement 
    : positiveEngagement > 0 ? 100 : 1;

  let rawTardScore = 
    (Math.min(replyRatio, 1.0) / 1.0) * 45 +
    (Math.min(quoteRatio, 0.5) / 0.5) * 35 +
    (engagementQuality < 5 ? 20 : 0);

  if (hasCommunityNote) {
    rawTardScore = rawTardScore + 25;
  }

  const normalizedScore = Math.max(0, Math.min(100, rawTardScore));

  return {
    score: Math.round(normalizedScore),
    replyRatio: Math.round(replyRatio * 1000) / 1000,
    quoteRatio: Math.round(quoteRatio * 1000) / 1000,
    engagementQuality: Math.round(engagementQuality * 100) / 100,
    rawTardScore: Math.round(rawTardScore * 100) / 100,
    hasCommunityNote,
  };
};
