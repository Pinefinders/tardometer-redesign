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

  // 5-10% chance of having a community note
  const hasCommunityNote = random(0, 100) < random(5, 10);

  return {
    likes,
    replies,
    retweets,
    quoteRetweets,
    tweetId,
    authorUsername: "mockuser",
    hasCommunityNote,
  };
};

// Score calculation result
export interface TardScore {
  score: number; // 0-100, where 0 = TARD, 100 = BASED
  replyRatio: number;
  quoteRatio: number;
  engagementQuality: number;
  rawTardScore: number;
  hasCommunityNote?: boolean;
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
}

// User analysis result
export interface UserAnalysis {
  username: string;
  averageScore: TardScore;
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
  
  // Determine overall health
  let overallHealth: "Excellent" | "Good" | "Fair" | "Poor" | "Suspicious";
  
  if (redFlags.length >= 3) {
    overallHealth = "Suspicious";
  } else if (redFlags.length >= 2) {
    overallHealth = "Poor";
  } else if (engagementRate >= 5 && followerRatio >= 3 && activityLevel === "Consistent") {
    overallHealth = "Excellent";
  } else if (engagementRate >= 3 && followerRatio >= 1 && activityLevel !== "Burst Pattern") {
    overallHealth = "Good";
  } else if (engagementRate >= 1 || redFlags.length === 0) {
    overallHealth = "Fair";
  } else {
    overallHealth = "Poor";
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
  };
};

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
    // 5-10% chance of having a community note
    const hasCommunityNote = Math.abs(Math.sin(seed * (i + 5))) < 0.08;
    
    const mockMetrics: TweetMetrics = {
      likes: Math.floor(Math.abs(Math.sin(seed * (i + 1)) * 50000)),
      replies: Math.floor(Math.abs(Math.sin(seed * (i + 2)) * 5000)),
      retweets: Math.floor(Math.abs(Math.sin(seed * (i + 3)) * 10000)),
      quoteRetweets: Math.floor(Math.abs(Math.sin(seed * (i + 4)) * 3000)),
      tweetId: `mock_${i}`,
      authorUsername: username,
      hasCommunityNote,
    };
    
    const score = calculateTardScore(mockMetrics);
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

  // Generate account health metrics
  const accountHealth = generateAccountHealth(username);

  return {
    username,
    averageScore: {
      score: Math.round(penalizedScore),
      replyRatio: avgReplyRatio,
      quoteRatio: avgQuoteRatio,
      engagementQuality: avgEngagementQuality,
      rawTardScore: Math.round(penalizedRawTardScore * 100) / 100,
    },
    tweetCount,
    individualScores,
    communityNotePercentage,
    accountHealth,
  };
};
