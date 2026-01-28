// @IfindRetards Community Signal types and mock data

export interface IfindRetardsMention {
  text: string;
  date: string;
  url: string;
}

export interface IfindRetardsStatus {
  mentioned: boolean;
  sentiment?: 'positive' | 'negative';
  count?: number;
  examples?: IfindRetardsMention[];
}

// Generate a consistent hash from username
const hashUsername = (username: string): number => {
  return username.split('').reduce((acc, char, i) => {
    return acc + char.charCodeAt(0) * (i + 1);
  }, 0);
};

// Generate mock negative mention examples
const generateNegativeExamples = (seed: number, count: number): IfindRetardsMention[] => {
  const phrases = [
    "Peak cringe",
    "Another terrible take",
    "Hall of Shame inductee",
    "Main character syndrome",
    "Ratio'd into oblivion",
    "This is why we can't have nice things",
    "Touch grass immediately",
    "Certified clown behavior",
    "L + ratio + didn't ask",
    "Average Twitter moment"
  ];
  
  const timeframes = [
    "3 days ago",
    "1 week ago", 
    "2 weeks ago",
    "3 weeks ago",
    "1 month ago",
    "2 months ago"
  ];
  
  const examples: IfindRetardsMention[] = [];
  const numExamples = Math.min(count, 3); // Show max 3 examples
  
  for (let i = 0; i < numExamples; i++) {
    const phraseIndex = (seed * (i + 1)) % phrases.length;
    const timeIndex = i; // Earlier examples are more recent
    examples.push({
      text: phrases[phraseIndex],
      date: timeframes[timeIndex],
      url: `https://x.com/IfindRetards/status/${1800000000000000000n + BigInt(seed * 1000 + i)}`
    });
  }
  
  return examples;
};

// Generate mock positive mention examples
const generatePositiveExamples = (seed: number): IfindRetardsMention[] => {
  const phrases = [
    "Definitely not a retard",
    "One of the good ones",
    "Actually based take",
    "Rare W holder"
  ];
  
  const phraseIndex = seed % phrases.length;
  
  return [{
    text: phrases[phraseIndex],
    date: "2 weeks ago",
    url: `https://x.com/IfindRetards/status/${1800000000000000000n + BigInt(seed * 1000)}`
  }];
};

/**
 * Get @IfindRetards status for a user
 * Mock implementation - returns consistent results based on username hash
 * 
 * Distribution:
 * - 85% Not mentioned
 * - 10% Negative mentions (callouts)
 * - 5% Positive mentions (endorsements)
 */
export const getIfindRetardsStatus = (username: string): IfindRetardsStatus => {
  const hash = hashUsername(username);
  const rand = hash % 100;
  
  if (rand < 85) {
    // Not mentioned (most common)
    return { mentioned: false };
  } else if (rand < 95) {
    // Negative mention (10%)
    const mentionCount = (hash % 10) + 1; // 1-10 mentions
    return {
      mentioned: true,
      sentiment: 'negative',
      count: mentionCount,
      examples: generateNegativeExamples(hash, mentionCount)
    };
  } else {
    // Positive mention (rare - 5%)
    return {
      mentioned: true,
      sentiment: 'positive',
      count: 1,
      examples: generatePositiveExamples(hash)
    };
  }
};
