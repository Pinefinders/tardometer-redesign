// Community Curator Signals - Multiple trusted sources

export interface CuratorMention {
  text: string;
  date: string;
  url: string;
}

export interface CuratorStatus {
  sentiment: 'positive' | 'negative';
  count: number;
  examples: CuratorMention[];
}

export interface Curator {
  handle: string;
  name: string;
  description: string;
}

export interface CuratorSignal {
  curator: Curator;
  status: CuratorStatus | null; // null = not mentioned
}

export interface CuratorSignalsResult {
  signals: CuratorSignal[];
  totalNegative: number;
  totalPositive: number;
  hasAnyMention: boolean;
}

// Curator registry - easy to add more later
export const CURATORS: Curator[] = [
  { 
    handle: 'IfindRetards', 
    name: '@IfindRetards',
    description: 'Documents Tard takes and behavior'
  },
  { 
    handle: 'IfindWankers', 
    name: '@IfindWankers',
    description: 'Calls out wanker behavior'
  },
  // Easy to add more curators here
];

// Generate a consistent hash from username
const hashUsername = (username: string): number => {
  return username.split('').reduce((acc, char, i) => {
    return acc + char.charCodeAt(0) * (i + 1);
  }, 0);
};

// Generate mock negative mention examples for a curator
const generateNegativeExamples = (seed: number, curatorHandle: string, count: number): CuratorMention[] => {
  const phrasesByHandle: Record<string, string[]> = {
    'IfindRetards': [
      "Peak cringe",
      "Another terrible take",
      "Hall of Shame inductee",
      "Main character syndrome",
      "Ratio'd into oblivion",
      "This is why we can't have nice things",
      "Touch grass immediately",
      "Certified clown behavior",
    ],
    'IfindWankers': [
      "Absolute wanker",
      "Premium wanker behavior",
      "Hall of Wankers",
      "Wanker of the week",
      "Peak wankery",
      "Weapons-grade wanker",
      "Professional wanker detected",
      "Wanker alert 🚨",
    ]
  };
  
  const phrases = phrasesByHandle[curatorHandle] || phrasesByHandle['IfindRetards'];
  
  const timeframes = [
    "3 days ago",
    "1 week ago", 
    "2 weeks ago",
    "3 weeks ago",
    "1 month ago",
  ];
  
  const examples: CuratorMention[] = [];
  const numExamples = Math.min(count, 3);
  
  for (let i = 0; i < numExamples; i++) {
    const phraseIndex = (seed * (i + 1)) % phrases.length;
    const timeIndex = i;
    examples.push({
      text: phrases[phraseIndex],
      date: timeframes[timeIndex],
      url: `https://x.com/${curatorHandle}/status/${1800000000000000000n + BigInt(seed * 1000 + i)}`
    });
  }
  
  return examples;
};

// Generate mock positive mention examples for a curator
const generatePositiveExamples = (seed: number, curatorHandle: string): CuratorMention[] => {
  const phrasesByHandle: Record<string, string[]> = {
    'IfindRetards': [
      "Definitely not a retard",
      "One of the good ones",
      "Actually based take",
      "Rare W holder"
    ],
    'IfindWankers': [
      "Certified non-wanker",
      "Anti-wanker energy",
      "Rare quality account",
      "Based and not a wanker"
    ]
  };
  
  const phrases = phrasesByHandle[curatorHandle] || phrasesByHandle['IfindRetards'];
  const phraseIndex = seed % phrases.length;
  
  return [{
    text: phrases[phraseIndex],
    date: "2 weeks ago",
    url: `https://x.com/${curatorHandle}/status/${1800000000000000000n + BigInt(seed * 1000)}`
  }];
};

/**
 * Get status for a single curator
 * Uses hash + curator handle offset for different results per curator
 */
const getCuratorStatus = (hash: number, curator: Curator): CuratorStatus | null => {
  // Use curator handle to offset the random distribution
  const curatorOffset = curator.handle.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const rand = (hash + curatorOffset) % 100;
  
  if (rand < 85) {
    // Not mentioned (85%)
    return null;
  } else if (rand < 95) {
    // Negative mention (10%)
    const mentionCount = ((hash + curatorOffset) % 8) + 1;
    return {
      sentiment: 'negative',
      count: mentionCount,
      examples: generateNegativeExamples(hash, curator.handle, mentionCount)
    };
  } else {
    // Positive mention (5%)
    return {
      sentiment: 'positive',
      count: 1,
      examples: generatePositiveExamples(hash, curator.handle)
    };
  }
};

/**
 * Get community curator signals for a user
 * Returns status from all tracked curators
 */
export const getCuratorSignals = (username: string): CuratorSignalsResult => {
  const hash = hashUsername(username);
  
  const signals: CuratorSignal[] = CURATORS.map(curator => ({
    curator,
    status: getCuratorStatus(hash, curator)
  }));
  
  const totalNegative = signals.filter(s => s.status?.sentiment === 'negative').length;
  const totalPositive = signals.filter(s => s.status?.sentiment === 'positive').length;
  const hasAnyMention = signals.some(s => s.status !== null);
  
  return {
    signals,
    totalNegative,
    totalPositive,
    hasAnyMention
  };
};
