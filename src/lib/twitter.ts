import { fetchSingleTweet, fetchUserTweets, ApifyTweetData, ApifyError } from './apify';

// Re-export for convenience
export { ApifyError };

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
  hasCommunityNote: boolean;
}

/**
 * Fetch real tweet metrics from Twitter via Apify
 * This replaces the mock data function with real API calls
 */
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

/**
 * Convert Apify tweet data to our TweetMetrics format
 */
const apifyToTweetMetrics = (tweet: ApifyTweetData): TweetMetrics => ({
  likes: tweet.likes,
  replies: tweet.replies,
  retweets: tweet.retweets,
  quoteRetweets: tweet.quoteRetweets,
  tweetId: tweet.id,
  authorUsername: tweet.authorUsername,
  hasCommunityNote: tweet.hasCommunityNote,
});

// Score calculation result
export interface TardScore {
  score: number; // 0-100, where 0 = TARD, 100 = BASED
  replyRatio: number;
  quoteRatio: number;
  engagementQuality: number;
  rawTardScore: number;
  hasCommunityNote?: boolean;
}

// Extended user score with raw metrics for detailed breakdown
export interface UserTardScoreDetails extends TardScore {
  avgLikes: number;
  avgReplies: number;
  avgRetweets: number;
  avgQuoteRetweets: number;
  replyRatioImpact: number; // points added/subtracted
  quoteRatioImpact: number;
  engagementQualityImpact: number;
  communityNotePenalty: number; // percentage penalty applied
}

// Calculate the Tard score based on tweet metrics
export const calculateTardScore = (metrics: TweetMetrics): TardScore => {
  const { likes, replies, retweets, quoteRetweets, hasCommunityNote } = metrics;

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
  let rawTardScore = 
    (Math.min(replyRatio, 2) / 2) * 40 + // Cap at 2 for normalization
    (Math.min(quoteRatio, 2) / 2) * 30 + // Cap at 2 for normalization
    (Math.min(1 / engagementQuality, 1)) * 30;

  // Community Note penalty: 50% increase to raw tard score
  // This is a strong signal that the tweet spread misinformation
  if (hasCommunityNote) {
    rawTardScore = Math.min(rawTardScore * 1.5, 100);
  }

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
    hasCommunityNote,
  };
};

// Account health metrics
export interface AccountHealthMetrics {
  followers: number;
  following: number;
  followerRatio: number;
  ratioLabel: string;
  engagementRate: number;
  engagementLabel: string;
  activityLevel: "Consistent" | "Sporadic" | "Burst Pattern";
  activityLabel: string;
  redFlags: string[];
  overallHealth: "Excellent" | "Good" | "Fair" | "Poor" | "Suspicious";
  healthScore: number; // 0-100 numeric score for the gauge
  // Score component breakdown
  engagementPoints: number; // out of 40
  ratioPoints: number; // out of 25
  activityPoints: number; // out of 20
  profilePoints: number; // out of 15
}

// User analysis result
export interface UserAnalysis {
  username: string;
  averageScore: UserTardScoreDetails;
  tweetCount: number;
  individualScores: TardScore[];
  communityNotePercentage: number;
  accountHealth: AccountHealthMetrics;
}

// Generate account health metrics
const generateAccountHealth = (username: string): AccountHealthMetrics => {
  // Use username as seed for consistent results
  const seed = username.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  
  const seededRandom = (min: number, max: number, offset: number = 0) => {
    const x = Math.sin(seed * (offset + 1)) * 10000;
    return (x - Math.floor(x)) * (max - min) + min;
  };

  // Generate followers (100 to 5M, logarithmic distribution)
  const followerBase = Math.pow(10, seededRandom(2, 6.7, 1));
  const followers = Math.floor(followerBase);
  
  // Generate following based on account "type"
  const accountType = seededRandom(0, 1, 2);
  let following: number;
  
  if (accountType > 0.85) {
    // Influencer type: low following
    following = Math.floor(seededRandom(50, 500, 3));
  } else if (accountType > 0.7) {
    // Spam pattern: very high following
    following = Math.floor(seededRandom(3000, 7000, 3));
  } else if (accountType > 0.3) {
    // Normal user: balanced
    following = Math.floor(followers * seededRandom(0.1, 0.8, 3));
  } else {
    // Reciprocal follower
    following = Math.floor(followers * seededRandom(0.8, 1.5, 3));
  }
  
  // Calculate follower ratio
  const followerRatio = following > 0 ? followers / following : followers;
  
  // Determine ratio label
  let ratioLabel: string;
  if (followerRatio >= 10) {
    ratioLabel = "Strong influence";
  } else if (followerRatio >= 3) {
    ratioLabel = "Normal ratio";
  } else if (followerRatio >= 1) {
    ratioLabel = "Reciprocal following";
  } else {
    ratioLabel = "Spam/bot pattern";
  }
  
  // Calculate engagement rate (0.3% to 8%)
  let engagementRate: number;
  if (accountType > 0.7) {
    // Spam accounts have low engagement
    engagementRate = seededRandom(0.1, 0.8, 4);
  } else if (followers > 100000) {
    // Large accounts have lower engagement rates
    engagementRate = seededRandom(0.5, 3, 4);
  } else {
    // Smaller accounts can have higher engagement
    engagementRate = seededRandom(1.5, 7, 4);
  }
  
  // Determine engagement label
  let engagementLabel: string;
  if (engagementRate >= 5) {
    engagementLabel = "🌟 Excellent - Highly engaged audience";
  } else if (engagementRate >= 3) {
    engagementLabel = "✓✓ Good - Active audience";
  } else if (engagementRate >= 1) {
    engagementLabel = "✓ Normal - Healthy engagement";
  } else {
    engagementLabel = "🚩 Low - Disengaged or bot audience";
  }
  
  // Determine activity level
  const activityRoll = seededRandom(0, 1, 5);
  let activityLevel: "Consistent" | "Sporadic" | "Burst Pattern";
  let activityLabel: string;
  
  if (activityRoll > 0.7) {
    activityLevel = "Consistent";
    activityLabel = "✓ Regular posting schedule";
  } else if (activityRoll > 0.3) {
    activityLevel = "Sporadic";
    activityLabel = "⚠️ Irregular activity";
  } else {
    activityLevel = "Burst Pattern";
    activityLabel = "🚩 Suspicious activity spikes";
  }
  
  // Detect red flags
  const redFlags: string[] = [];
  
  if (following > 5000 && followerRatio < 1) {
    redFlags.push(`High following-to-follower ratio (${following.toLocaleString()}:${followers.toLocaleString()})`);
  }
  if (engagementRate < 1) {
    redFlags.push(`Low engagement rate (${engagementRate.toFixed(1)}%)`);
  }
  if (activityLevel === "Burst Pattern") {
    redFlags.push("Suspicious activity pattern detected");
  }
  if (followers > 10000 && engagementRate < 0.5) {
    redFlags.push("High follower count with very low engagement (likely bot followers)");
  }
  if (following > 4000) {
    redFlags.push("Unusually high following count");
  }
  
  // Determine overall health and calculate numeric health score
  let overallHealth: "Excellent" | "Good" | "Fair" | "Poor" | "Suspicious";
  let healthScore: number;
  
  // Track individual score components
  let engagementPoints = 0;
  let ratioPoints = 0;
  let activityPoints = 0;
  const profilePoints = 15; // Assume complete profile for mock data
  
  // Calculate health score based on metrics
  // Most accounts should be HEALTHY (50-75), occasionally SICKLY (25-50) or DYING (0-25)
  // Rarely GIGACHAD (75-100)
  
  // Base score components (each contributes to total)
  let baseScore = 50; // Start at middle
  
  // Engagement rate contribution (0-40 points max)
  if (engagementRate >= 5) {
    engagementPoints = 35 + Math.round(seededRandom(0, 5, 10));
    baseScore += 20 + seededRandom(0, 5, 10);
  } else if (engagementRate >= 3) {
    engagementPoints = 25 + Math.round(seededRandom(0, 10, 10));
    baseScore += 10 + seededRandom(0, 10, 10);
  } else if (engagementRate >= 1) {
    engagementPoints = 15 + Math.round(seededRandom(0, 10, 10));
    baseScore += seededRandom(-5, 10, 10);
  } else {
    engagementPoints = Math.max(0, Math.round(10 - seededRandom(0, 10, 10)));
    baseScore -= 15 + seededRandom(0, 15, 10);
  }
  
  // Follower ratio contribution (0-25 points max)
  if (followerRatio >= 10) {
    ratioPoints = 20 + Math.round(seededRandom(0, 5, 11));
    baseScore += 15 + seededRandom(0, 5, 11);
  } else if (followerRatio >= 3) {
    ratioPoints = 15 + Math.round(seededRandom(0, 7, 11));
    baseScore += 5 + seededRandom(0, 10, 11);
  } else if (followerRatio >= 1) {
    ratioPoints = 10 + Math.round(seededRandom(0, 5, 11));
    baseScore += seededRandom(-5, 5, 11);
  } else {
    ratioPoints = Math.max(0, Math.round(5 - seededRandom(0, 5, 11)));
    baseScore -= 10 + seededRandom(0, 15, 11);
  }
  
  // Activity level contribution (0-20 points max)
  if (activityLevel === "Consistent") {
    activityPoints = 15 + Math.round(seededRandom(0, 5, 12));
    baseScore += 5 + seededRandom(0, 5, 12);
  } else if (activityLevel === "Sporadic") {
    activityPoints = 8 + Math.round(seededRandom(0, 5, 12));
    baseScore += seededRandom(-5, 3, 12);
  } else {
    activityPoints = Math.max(0, Math.round(3 - seededRandom(0, 3, 12)));
    baseScore -= 10 + seededRandom(0, 10, 12);
  }
  
  // Red flags penalty
  baseScore -= redFlags.length * 8;
  
  // Apply distribution bias: most accounts should be HEALTHY (50-75)
  // Use seeded random to occasionally push to extremes
  const distributionRoll = seededRandom(0, 100, 13);
  
  if (distributionRoll > 95) {
    // 5% chance: GIGACHAD territory (75-100)
    baseScore = Math.max(baseScore, 75 + seededRandom(0, 20, 14));
  } else if (distributionRoll < 10) {
    // 10% chance: DYING territory (0-25)
    baseScore = Math.min(baseScore, seededRandom(5, 25, 14));
  } else if (distributionRoll < 25) {
    // 15% chance: SICKLY territory (25-50)
    baseScore = Math.min(Math.max(baseScore, 25), 50);
  }
  
  // Clamp final score
  healthScore = Math.max(0, Math.min(100, Math.round(baseScore)));
  
  // Determine label based on score
  if (healthScore <= 25) {
    overallHealth = "Suspicious";
  } else if (healthScore <= 50) {
    overallHealth = "Poor";
  } else if (healthScore <= 75) {
    if (healthScore >= 65) {
      overallHealth = "Good";
    } else {
      overallHealth = "Fair";
    }
  } else {
    overallHealth = "Excellent";
  }
  
  return {
    followers,
    following,
    followerRatio,
    ratioLabel,
    engagementRate,
    engagementLabel,
    activityLevel,
    activityLabel,
    redFlags,
    overallHealth,
    healthScore,
    engagementPoints: Math.min(40, engagementPoints),
    ratioPoints: Math.min(25, ratioPoints),
    activityPoints: Math.min(20, activityPoints),
    profilePoints,
  };
};

/**
 * Analyze a user's profile by fetching their recent tweets and calculating scores
 * Now uses real Twitter data via Apify API
 */
export const analyzeUserProfile = async (username: string): Promise<UserAnalysis> => {
  // Fetch real tweets from Twitter via Apify
  const tweets = await fetchUserTweets(username, 20);
  
  const tweetCount = tweets.length;
  const individualScores: TardScore[] = [];
  
  // Track raw metrics for averages
  let totalLikes = 0;
  let totalReplies = 0;
  let totalRetweets = 0;
  let totalQuoteRetweets = 0;

  // Process each tweet
  for (const tweet of tweets) {
    const metrics = apifyToTweetMetrics(tweet);
    
    totalLikes += metrics.likes;
    totalReplies += metrics.replies;
    totalRetweets += metrics.retweets;
    totalQuoteRetweets += metrics.quoteRetweets;
    
    const score = calculateTardScore(metrics);
    individualScores.push(score);
  }

  // Calculate community note percentage first (needed for penalty calculation)
  const communityNoteCount = individualScores.filter(s => s.hasCommunityNote).length;
  const communityNotePercentage = Math.round((communityNoteCount / tweetCount) * 100);

  // Calculate community note penalty based on percentage
  // 10% flagged = +5% penalty, 20% = +10%, 50%+ = +25% (capped)
  const getCommunityNotePenalty = (percentage: number): number => {
    if (percentage >= 50) return 0.25;
    if (percentage >= 20) return 0.10;
    if (percentage >= 10) return 0.05;
    return 0;
  };
  const communityNotePenalty = getCommunityNotePenalty(communityNotePercentage);

  // Calculate base average raw tard score
  const baseAvgRawTardScore = 
    individualScores.reduce((sum, s) => sum + s.rawTardScore, 0) / individualScores.length;
  
  // Apply community note penalty to raw tard score
  const penalizedRawTardScore = Math.min(baseAvgRawTardScore * (1 + communityNotePenalty), 100);
  
  // Recalculate final score with penalty applied
  const penalizedScore = Math.max(0, Math.min(100, 100 - penalizedRawTardScore));

  const avgReplyRatio = Math.round(
    (individualScores.reduce((sum, s) => sum + s.replyRatio, 0) / individualScores.length) * 1000
  ) / 1000;
  const avgQuoteRatio = Math.round(
    (individualScores.reduce((sum, s) => sum + s.quoteRatio, 0) / individualScores.length) * 1000
  ) / 1000;
  const avgEngagementQuality = Math.round(
    (individualScores.reduce((sum, s) => sum + s.engagementQuality, 0) / individualScores.length) * 100
  ) / 100;

  // Calculate average raw metrics
  const avgLikes = Math.round(totalLikes / tweetCount);
  const avgReplies = Math.round(totalReplies / tweetCount);
  const avgRetweets = Math.round(totalRetweets / tweetCount);
  const avgQuoteRetweets = Math.round(totalQuoteRetweets / tweetCount);

  // Calculate score impact for each metric
  // Reply ratio impact: higher = more tard points (max 40 points to score)
  const replyRatioImpact = -Math.round((Math.min(avgReplyRatio, 2) / 2) * 40);
  // Quote ratio impact: higher = more tard points (max 30 points to score)
  const quoteRatioImpact = -Math.round((Math.min(avgQuoteRatio, 2) / 2) * 30);
  // Engagement quality impact: higher = more based points
  const engagementQualityImpact = Math.round((1 - Math.min(1 / avgEngagementQuality, 1)) * 30);

  // Generate account health metrics (still uses seeded mock for now as Apify doesn't provide this)
  const accountHealth = generateAccountHealth(username);

  return {
    username,
    averageScore: {
      score: Math.round(penalizedScore),
      replyRatio: avgReplyRatio,
      quoteRatio: avgQuoteRatio,
      engagementQuality: avgEngagementQuality,
      rawTardScore: Math.round(penalizedRawTardScore * 100) / 100,
      avgLikes,
      avgReplies,
      avgRetweets,
      avgQuoteRetweets,
      replyRatioImpact,
      quoteRatioImpact,
      engagementQualityImpact,
      communityNotePenalty: Math.round(communityNotePenalty * 100),
    },
    tweetCount,
    individualScores,
    communityNotePercentage,
    accountHealth,
  };
};
