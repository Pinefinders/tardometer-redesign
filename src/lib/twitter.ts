// URL type detection
export type UrlType = 'tweet' | 'profile' | 'invalid';

export interface ParsedUrl {
  type: UrlType;
  tweetId?: string;
  username?: string;
}

// Parse a Twitter/X URL and determine its type
export const parseTwitterUrl = (url: string): ParsedUrl => {
  // Check for tweet URLs first (more specific pattern)
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

  // Check for profile URLs
  const profilePattern = /(?:twitter\.com|x\.com)\/(@?\w+)\/?$/i;
  const profileMatch = url.match(profilePattern);
  if (profileMatch && profileMatch[1]) {
    const username = profileMatch[1].replace('@', '');
    // Exclude common Twitter paths that aren't usernames
    const excludedPaths = ['home', 'explore', 'notifications', 'messages', 'settings', 'i', 'search'];
    if (!excludedPaths.includes(username.toLowerCase())) {
      return { type: 'profile', username };
    }
  }

  return { type: 'invalid' };
};

// Legacy function for backwards compatibility
export const extractTweetId = (url: string): string | null => {
  const parsed = parseTwitterUrl(url);
  return parsed.type === 'tweet' ? parsed.tweetId! : null;
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

// User analysis result
export interface UserAnalysis {
  username: string;
  averageScore: TardScore;
  tweetCount: number;
  individualScores: TardScore[];
}

// Mock function to fetch a user's recent tweets and calculate their average score
export const analyzeUserProfile = async (username: string): Promise<UserAnalysis> => {
  // Simulate API delay (longer for user analysis)
  await new Promise((resolve) => setTimeout(resolve, 1500 + Math.random() * 1000));

  // Generate 10-20 mock tweets for this user
  const tweetCount = 10 + Math.floor(Math.random() * 11); // 10-20 tweets
  const individualScores: TardScore[] = [];

  // Use username as seed for consistent results per user
  const seed = username.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);

  for (let i = 0; i < tweetCount; i++) {
    // Generate mock metrics for each tweet
    const mockMetrics: TweetMetrics = {
      likes: Math.floor(Math.abs(Math.sin(seed * (i + 1)) * 50000)),
      replies: Math.floor(Math.abs(Math.sin(seed * (i + 2)) * 5000)),
      retweets: Math.floor(Math.abs(Math.sin(seed * (i + 3)) * 10000)),
      quoteRetweets: Math.floor(Math.abs(Math.sin(seed * (i + 4)) * 3000)),
      tweetId: `mock_${i}`,
      authorUsername: username,
    };
    
    const score = calculateTardScore(mockMetrics);
    individualScores.push(score);
  }

  // Calculate average score
  const avgScore = Math.round(
    individualScores.reduce((sum, s) => sum + s.score, 0) / individualScores.length
  );
  const avgReplyRatio = Math.round(
    (individualScores.reduce((sum, s) => sum + s.replyRatio, 0) / individualScores.length) * 1000
  ) / 1000;
  const avgQuoteRatio = Math.round(
    (individualScores.reduce((sum, s) => sum + s.quoteRatio, 0) / individualScores.length) * 1000
  ) / 1000;
  const avgEngagementQuality = Math.round(
    (individualScores.reduce((sum, s) => sum + s.engagementQuality, 0) / individualScores.length) * 100
  ) / 100;
  const avgRawTardScore = Math.round(
    (individualScores.reduce((sum, s) => sum + s.rawTardScore, 0) / individualScores.length) * 100
  ) / 100;

  return {
    username,
    averageScore: {
      score: avgScore,
      replyRatio: avgReplyRatio,
      quoteRatio: avgQuoteRatio,
      engagementQuality: avgEngagementQuality,
      rawTardScore: avgRawTardScore,
    },
    tweetCount,
    individualScores,
  };
};
