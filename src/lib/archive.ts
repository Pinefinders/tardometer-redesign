import { TweetMetrics, TardScore } from "./twitter";

export interface ArchivedTweet {
  tweetId: string;
  tweetUrl: string;
  authorUsername: string;
  tweetText: string; // We'll store what we can get
  metrics: TweetMetrics;
  score: TardScore;
  archivedAt: string; // ISO timestamp
  hasCommunityNote: boolean;
}

const ARCHIVE_PREFIX = "archive_tweet_";

/**
 * Archive a tweet to localStorage
 */
export function archiveTweet(data: Omit<ArchivedTweet, "archivedAt">): void {
  const archived: ArchivedTweet = {
    ...data,
    archivedAt: new Date().toISOString(),
  };
  
  localStorage.setItem(`${ARCHIVE_PREFIX}${data.tweetId}`, JSON.stringify(archived));
}

/**
 * Get a specific archived tweet
 */
export function getArchivedTweet(tweetId: string): ArchivedTweet | null {
  const data = localStorage.getItem(`${ARCHIVE_PREFIX}${tweetId}`);
  if (!data) return null;
  
  try {
    return JSON.parse(data) as ArchivedTweet;
  } catch {
    return null;
  }
}

/**
 * Check if a tweet is archived
 */
export function isArchived(tweetId: string): boolean {
  return localStorage.getItem(`${ARCHIVE_PREFIX}${tweetId}`) !== null;
}

/**
 * Delete an archived tweet
 */
export function deleteArchivedTweet(tweetId: string): void {
  localStorage.removeItem(`${ARCHIVE_PREFIX}${tweetId}`);
}

/**
 * Get all archived tweets, sorted by archive date (newest first)
 */
export function getAllArchivedTweets(): ArchivedTweet[] {
  const archives: ArchivedTweet[] = [];
  
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key?.startsWith(ARCHIVE_PREFIX)) {
      const data = localStorage.getItem(key);
      if (data) {
        try {
          archives.push(JSON.parse(data) as ArchivedTweet);
        } catch {
          // Skip invalid entries
        }
      }
    }
  }
  
  // Sort by archived date, newest first
  return archives.sort((a, b) => 
    new Date(b.archivedAt).getTime() - new Date(a.archivedAt).getTime()
  );
}

/**
 * Get the count of archived tweets
 */
export function getArchiveCount(): number {
  let count = 0;
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key?.startsWith(ARCHIVE_PREFIX)) {
      count++;
    }
  }
  return count;
}
