import { TardScore, TweetMetrics, UserAnalysis } from "./twitter";

// Types for leaderboard entries
export interface TweetEntry {
  id: string;
  tweetUrl: string;
  tweetId: string;
  authorUsername: string;
  score: TardScore;
  metrics: TweetMetrics;
  submittedAt: string; // ISO date string
  weekStart: string; // ISO date string for the Monday of that week
}

export interface UserEntry {
  id: string;
  username: string;
  profileUrl: string;
  averageScore: TardScore;
  tweetCount: number;
  submittedAt: string;
  weekStart: string;
}

export interface WeeklyWinners {
  weekStart: string;
  weekEnd: string;
  tardTweet: TweetEntry | null;
  chadTweet: TweetEntry | null;
  tardPerson: UserEntry | null;
  chadPerson: UserEntry | null;
}

const STORAGE_KEY_TWEETS = "tardometer_tweet_entries";
const STORAGE_KEY_USERS = "tardometer_user_entries";
const STORAGE_KEY_ARCHIVE = "tardometer_winners_archive";

// Get the Monday of the current week at midnight UTC
export const getCurrentWeekStart = (): Date => {
  const now = new Date();
  const day = now.getUTCDay();
  const diff = now.getUTCDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
  const monday = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), diff, 0, 0, 0, 0));
  return monday;
};

// Get the end of the current week (Sunday 23:59:59 UTC)
export const getCurrentWeekEnd = (): Date => {
  const weekStart = getCurrentWeekStart();
  const weekEnd = new Date(weekStart);
  weekEnd.setUTCDate(weekEnd.getUTCDate() + 6);
  weekEnd.setUTCHours(23, 59, 59, 999);
  return weekEnd;
};

// Calculate time until next Monday midnight
export const getTimeUntilReset = (): { days: number; hours: number; minutes: number } => {
  const now = new Date();
  const weekEnd = getCurrentWeekEnd();
  const diff = weekEnd.getTime() - now.getTime();
  
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  
  return { days, hours, minutes };
};

// Format week for display
export const formatWeekRange = (weekStart: string): string => {
  const start = new Date(weekStart);
  const end = new Date(start);
  end.setUTCDate(end.getUTCDate() + 6);
  
  const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };
  return `${start.toLocaleDateString('en-US', options)} - ${end.toLocaleDateString('en-US', options)}`;
};

// Get all tweet entries from localStorage
export const getTweetEntries = (): TweetEntry[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY_TWEETS);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

// Get all user entries from localStorage
export const getUserEntries = (): UserEntry[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY_USERS);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

// Save a tweet entry
export const saveTweetEntry = (entry: Omit<TweetEntry, 'id' | 'weekStart' | 'submittedAt'>): TweetEntry => {
  const entries = getTweetEntries();
  const weekStart = getCurrentWeekStart().toISOString();
  
  const newEntry: TweetEntry = {
    ...entry,
    id: `tweet_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    submittedAt: new Date().toISOString(),
    weekStart,
  };
  
  entries.push(newEntry);
  localStorage.setItem(STORAGE_KEY_TWEETS, JSON.stringify(entries));
  
  return newEntry;
};

// Save a user entry
export const saveUserEntry = (entry: Omit<UserEntry, 'id' | 'weekStart' | 'submittedAt'>): UserEntry => {
  const entries = getUserEntries();
  const weekStart = getCurrentWeekStart().toISOString();
  
  const newEntry: UserEntry = {
    ...entry,
    id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    submittedAt: new Date().toISOString(),
    weekStart,
  };
  
  entries.push(newEntry);
  localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(entries));
  
  return newEntry;
};

// Get current week's entries
export const getCurrentWeekTweets = (): TweetEntry[] => {
  const weekStart = getCurrentWeekStart().toISOString();
  return getTweetEntries().filter(e => e.weekStart === weekStart);
};

export const getCurrentWeekUsers = (): UserEntry[] => {
  const weekStart = getCurrentWeekStart().toISOString();
  return getUserEntries().filter(e => e.weekStart === weekStart);
};

// Get the most Tard tweet of the current week (lowest score)
export const getTardTweetOfWeek = (): TweetEntry | null => {
  const tweets = getCurrentWeekTweets();
  if (tweets.length === 0) return null;
  
  return tweets.reduce((lowest, current) => 
    current.score.score < lowest.score.score ? current : lowest
  );
};

// Get the most Chad/Based tweet of the current week (highest score)
export const getChadTweetOfWeek = (): TweetEntry | null => {
  const tweets = getCurrentWeekTweets();
  if (tweets.length === 0) return null;
  
  return tweets.reduce((highest, current) => 
    current.score.score > highest.score.score ? current : highest
  );
};

// Get the most Tard person of the current week (lowest average score)
export const getTardPersonOfWeek = (): UserEntry | null => {
  const users = getCurrentWeekUsers();
  if (users.length === 0) return null;
  
  return users.reduce((lowest, current) => 
    current.averageScore.score < lowest.averageScore.score ? current : lowest
  );
};

// Get the most Chad/Based person of the current week (highest average score)
export const getChadPersonOfWeek = (): UserEntry | null => {
  const users = getCurrentWeekUsers();
  if (users.length === 0) return null;
  
  return users.reduce((highest, current) => 
    current.averageScore.score > highest.averageScore.score ? current : highest
  );
};

// Get winners archive
export const getWinnersArchive = (): WeeklyWinners[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY_ARCHIVE);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

// Archive current week's winners (call this when week ends or manually)
export const archiveCurrentWeek = (): void => {
  const weekStart = getCurrentWeekStart();
  const weekEnd = getCurrentWeekEnd();
  
  const archive = getWinnersArchive();
  
  // Check if this week is already archived
  const alreadyArchived = archive.some(w => w.weekStart === weekStart.toISOString());
  if (alreadyArchived) return;
  
  const winners: WeeklyWinners = {
    weekStart: weekStart.toISOString(),
    weekEnd: weekEnd.toISOString(),
    tardTweet: getTardTweetOfWeek(),
    chadTweet: getChadTweetOfWeek(),
    tardPerson: getTardPersonOfWeek(),
    chadPerson: getChadPersonOfWeek(),
  };
  
  // Only archive if there are winners
  if (winners.tardTweet || winners.chadTweet || winners.tardPerson || winners.chadPerson) {
    archive.unshift(winners); // Add to beginning
    localStorage.setItem(STORAGE_KEY_ARCHIVE, JSON.stringify(archive.slice(0, 52))); // Keep max 52 weeks
  }
};

// Get past weeks' entries (for archive display)
export const getPastWeekWinners = (): WeeklyWinners[] => {
  const currentWeekStart = getCurrentWeekStart().toISOString();
  const allTweets = getTweetEntries();
  const allUsers = getUserEntries();
  
  // Group by week
  const weekMap = new Map<string, { tweets: TweetEntry[]; users: UserEntry[] }>();
  
  allTweets.forEach(tweet => {
    if (tweet.weekStart !== currentWeekStart) {
      if (!weekMap.has(tweet.weekStart)) {
        weekMap.set(tweet.weekStart, { tweets: [], users: [] });
      }
      weekMap.get(tweet.weekStart)!.tweets.push(tweet);
    }
  });
  
  allUsers.forEach(user => {
    if (user.weekStart !== currentWeekStart) {
      if (!weekMap.has(user.weekStart)) {
        weekMap.set(user.weekStart, { tweets: [], users: [] });
      }
      weekMap.get(user.weekStart)!.users.push(user);
    }
  });
  
  // Convert to winners array
  const winners: WeeklyWinners[] = [];
  
  weekMap.forEach((data, weekStart) => {
    const weekStartDate = new Date(weekStart);
    const weekEndDate = new Date(weekStart);
    weekEndDate.setUTCDate(weekEndDate.getUTCDate() + 6);
    weekEndDate.setUTCHours(23, 59, 59, 999);
    
    const tardTweet = data.tweets.length > 0 
      ? data.tweets.reduce((lowest, current) => current.score.score < lowest.score.score ? current : lowest)
      : null;
    
    const chadTweet = data.tweets.length > 0 
      ? data.tweets.reduce((highest, current) => current.score.score > highest.score.score ? current : highest)
      : null;
      
    const tardPerson = data.users.length > 0
      ? data.users.reduce((lowest, current) => current.averageScore.score < lowest.averageScore.score ? current : lowest)
      : null;
    
    const chadPerson = data.users.length > 0
      ? data.users.reduce((highest, current) => current.averageScore.score > highest.averageScore.score ? current : highest)
      : null;
    
    winners.push({
      weekStart,
      weekEnd: weekEndDate.toISOString(),
      tardTweet,
      chadTweet,
      tardPerson,
      chadPerson,
    });
  });
  
  // Sort by week start date (newest first)
  return winners.sort((a, b) => new Date(b.weekStart).getTime() - new Date(a.weekStart).getTime());
};

// Generate mock archive data for demo purposes
export const generateMockArchive = (): void => {
  const archive = getWinnersArchive();
  if (archive.length > 0) return; // Don't regenerate if already exists
  
  const mockWinners: WeeklyWinners[] = [];
  const now = new Date();
  
  for (let i = 1; i <= 4; i++) {
    const weekStart = new Date(now);
    weekStart.setUTCDate(weekStart.getUTCDate() - (7 * i));
    const day = weekStart.getUTCDay();
    const diff = weekStart.getUTCDate() - day + (day === 0 ? -6 : 1);
    weekStart.setUTCDate(diff);
    weekStart.setUTCHours(0, 0, 0, 0);
    
    const weekEnd = new Date(weekStart);
    weekEnd.setUTCDate(weekEnd.getUTCDate() + 6);
    weekEnd.setUTCHours(23, 59, 59, 999);
    
    const mockTardTweet: TweetEntry = {
      id: `mock_tard_tweet_${i}`,
      tweetUrl: `https://x.com/tardposter${i}/status/${1234567890 + i}`,
      tweetId: `${1234567890 + i}`,
      authorUsername: ['angry_poster', 'ratio_victim', 'hot_take_haver', 'main_character'][i - 1] || 'mockuser',
      score: {
        score: 5 + Math.floor(Math.random() * 15),
        replyRatio: 1.2 + Math.random(),
        quoteRatio: 0.8 + Math.random(),
        engagementQuality: 1 + Math.random() * 2,
        rawTardScore: 75 + Math.random() * 20,
      },
      metrics: {
        likes: Math.floor(Math.random() * 10000),
        replies: Math.floor(Math.random() * 50000),
        retweets: Math.floor(Math.random() * 5000),
        quoteRetweets: Math.floor(Math.random() * 10000),
        tweetId: `${1234567890 + i}`,
        authorUsername: ['angry_poster', 'ratio_victim', 'hot_take_haver', 'main_character'][i - 1] || 'mockuser',
        hasCommunityNote: Math.random() < 0.3,
      },
      submittedAt: weekStart.toISOString(),
      weekStart: weekStart.toISOString(),
    };
    
    const mockChadTweet: TweetEntry = {
      id: `mock_chad_tweet_${i}`,
      tweetUrl: `https://x.com/basedking${i}/status/${9876543210 + i}`,
      tweetId: `${9876543210 + i}`,
      authorUsername: ['naval', 'paulg', 'balajis', 'vikiivalencia'][i - 1] || 'baseduser',
      score: {
        score: 80 + Math.floor(Math.random() * 20),
        replyRatio: 0.05 + Math.random() * 0.1,
        quoteRatio: 0.1 + Math.random() * 0.1,
        engagementQuality: 20 + Math.random() * 30,
        rawTardScore: 5 + Math.random() * 15,
      },
      metrics: {
        likes: 50000 + Math.floor(Math.random() * 100000),
        replies: Math.floor(Math.random() * 5000),
        retweets: 20000 + Math.floor(Math.random() * 30000),
        quoteRetweets: Math.floor(Math.random() * 2000),
        tweetId: `${9876543210 + i}`,
        authorUsername: ['naval', 'paulg', 'balajis', 'vikiivalencia'][i - 1] || 'baseduser',
        hasCommunityNote: false,
      },
      submittedAt: weekStart.toISOString(),
      weekStart: weekStart.toISOString(),
    };
    
    const mockTardUser: UserEntry = {
      id: `mock_tard_user_${i}`,
      username: ['ratio_king', 'always_wrong', 'bad_take_bot', 'controversy_enjoyer'][i - 1] || 'mockuser',
      profileUrl: `https://x.com/${['ratio_king', 'always_wrong', 'bad_take_bot', 'controversy_enjoyer'][i - 1]}`,
      averageScore: {
        score: 8 + Math.floor(Math.random() * 12),
        replyRatio: 1.0 + Math.random(),
        quoteRatio: 0.6 + Math.random(),
        engagementQuality: 1.5 + Math.random() * 2,
        rawTardScore: 70 + Math.random() * 20,
      },
      tweetCount: 10 + Math.floor(Math.random() * 10),
      submittedAt: weekStart.toISOString(),
      weekStart: weekStart.toISOString(),
    };
    
    const mockChadUser: UserEntry = {
      id: `mock_chad_user_${i}`,
      username: ['wisdom_dropper', 'based_poster', 'w_collector', 'gigabrain'][i - 1] || 'chaduser',
      profileUrl: `https://x.com/${['wisdom_dropper', 'based_poster', 'w_collector', 'gigabrain'][i - 1]}`,
      averageScore: {
        score: 82 + Math.floor(Math.random() * 18),
        replyRatio: 0.08 + Math.random() * 0.1,
        quoteRatio: 0.1 + Math.random() * 0.15,
        engagementQuality: 15 + Math.random() * 25,
        rawTardScore: 8 + Math.random() * 12,
      },
      tweetCount: 15 + Math.floor(Math.random() * 10),
      submittedAt: weekStart.toISOString(),
      weekStart: weekStart.toISOString(),
    };
    
    mockWinners.push({
      weekStart: weekStart.toISOString(),
      weekEnd: weekEnd.toISOString(),
      tardTweet: mockTardTweet,
      chadTweet: mockChadTweet,
      tardPerson: mockTardUser,
      chadPerson: mockChadUser,
    });
  }
  
  localStorage.setItem(STORAGE_KEY_ARCHIVE, JSON.stringify(mockWinners));
};
