// Extract tweet ID from Twitter/X URLs
export const extractTweetId = (url: string): string | null => {
  // Handle both twitter.com and x.com URLs
  // Examples:
  // https://twitter.com/username/status/1234567890
  // https://x.com/username/status/1234567890
  // https://twitter.com/username/status/1234567890?s=20
  const patterns = [
    /(?:twitter\.com|x\.com)\/\w+\/status\/(\d+)/i,
    /(?:twitter\.com|x\.com)\/\w+\/statuses\/(\d+)/i,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }

  return null;
};

// Tweet metrics interface
export interface TweetMetrics {
  likes: number;
  replies: number;
  retweets: number;
  quoteRetweets: number;
  tweetId: string;
  authorUsername: string;
}

// Mock function to simulate fetching tweet data
// Returns realistic-looking random data for demo purposes
export const fetchTweetMetrics = async (tweetId: string): Promise<TweetMetrics> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000 + Math.random() * 500));

  // Generate mock data with some variance
  // Using the tweet ID as a seed for pseudo-random but consistent results
  const seed = parseInt(tweetId.slice(-6)) || 12345;
  const random = (min: number, max: number) => {
    const x = Math.sin(seed * (min + max)) * 10000;
    return Math.floor((x - Math.floor(x)) * (max - min + 1)) + min;
  };

  // Generate base engagement (viral tweets vs normal tweets)
  const isViral = random(0, 10) > 7;
  const baseEngagement = isViral ? random(10000, 500000) : random(10, 5000);

  // Generate metrics with realistic ratios
  const likes = baseEngagement;
  const retweets = Math.floor(likes * (random(5, 40) / 100));
  const replies = Math.floor(likes * (random(2, 50) / 100));
  const quoteRetweets = Math.floor(retweets * (random(10, 60) / 100));

  return {
    likes,
    replies,
    retweets,
    quoteRetweets,
    tweetId,
    authorUsername: "mockuser",
  };
};

// Score calculation result
export interface TardScore {
  score: number; // 0-100, where 0 = TARD, 100 = BASED
  replyRatio: number;
  quoteRatio: number;
  engagementQuality: number;
  rawTardScore: number;
}

// Calculate the Tard score based on tweet metrics
export const calculateTardScore = (metrics: TweetMetrics): TardScore => {
  const { likes, replies, retweets, quoteRetweets } = metrics;

  // Reply Ratio = replies / likes (high ratio = more controversial = more tard)
  const replyRatio = likes > 0 ? replies / likes : 0;

  // Quote Ratio = quote_tweets / retweets (high ratio = more dunking = more tard)
  const quoteRatio = retweets > 0 ? quoteRetweets / retweets : 0;

  // Engagement Quality = (likes + retweets) / (replies + quote_tweets)
  // High quality = more positive engagement = more based
  const negativeEngagement = replies + quoteRetweets;
  const positiveEngagement = likes + retweets;
  const engagementQuality = negativeEngagement > 0 
    ? positiveEngagement / negativeEngagement 
    : positiveEngagement > 0 ? 100 : 1;

  // Raw Tard Score calculation
  // Higher reply ratio = more tard (weight: 40%)
  // Higher quote ratio = more tard (weight: 30%)
  // Lower engagement quality = more tard (weight: 30%)
  const rawTardScore = 
    (Math.min(replyRatio, 2) / 2) * 40 + // Cap at 2 for normalization
    (Math.min(quoteRatio, 2) / 2) * 30 + // Cap at 2 for normalization
    (Math.min(1 / engagementQuality, 1)) * 30;

  // Invert and normalize to 0-100 scale
  // rawTardScore ranges roughly 0-100, where 100 = very tard
  // We want score where 0 = tard, 100 = based
  const normalizedScore = Math.max(0, Math.min(100, 100 - rawTardScore));

  return {
    score: Math.round(normalizedScore),
    replyRatio: Math.round(replyRatio * 1000) / 1000,
    quoteRatio: Math.round(quoteRatio * 1000) / 1000,
    engagementQuality: Math.round(engagementQuality * 100) / 100,
    rawTardScore: Math.round(rawTardScore * 100) / 100,
  };
};
