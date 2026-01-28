import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import TweetInput from "@/components/TweetInput";
import Gauge from "@/components/Gauge";
import MetricsDisplay from "@/components/MetricsDisplay";
import UserResultDisplay from "@/components/UserResultDisplay";
import BookmarkletSection from "@/components/BookmarkletSection";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ShareButton from "@/components/ShareButton";
import NotesSection from "@/components/NotesSection";
import { Trophy } from "lucide-react";

import { 
  parseTwitterUrl, 
  fetchTweetMetrics, 
  calculateTardScore, 
  analyzeUserProfile,
  TweetMetrics, 
  TardScore,
  UserAnalysis 
} from "@/lib/twitter";
import { saveTweetEntry, saveUserEntry } from "@/lib/leaderboard";
import { toast } from "sonner";

type ResultType = 'tweet' | 'user';

interface TweetResult {
  type: 'tweet';
  score: TardScore;
  metrics: TweetMetrics;
  tweetUrl: string;
}

interface UserResult {
  type: 'user';
  analysis: UserAnalysis;
}

type Result = TweetResult | UserResult;

const Index = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");
  const [result, setResult] = useState<Result | null>(null);
  const [isDemo, setIsDemo] = useState(false);

  // Demo data for example results
  const demoResults: Record<'tard' | 'mid' | 'chad', TweetResult> = {
    tard: {
      type: 'tweet',
      score: { 
        score: 12, 
        replyRatio: 19.822,
        quoteRatio: 1.950,
        engagementQuality: 0.05,
        rawTardScore: 88.0,
        hasCommunityNote: true,
      },
      metrics: {
        likes: 45,
        retweets: 8,
        replies: 892,
        quoteRetweets: 156,
        tweetId: 'demo_tard',
        authorUsername: 'demo_user',
        hasCommunityNote: true,
      },
      tweetUrl: 'https://x.com/demo/status/123',
    },
    mid: {
      type: 'tweet',
      score: { 
        score: 52, 
        replyRatio: 0.272,
        quoteRatio: 0.506,
        engagementQuality: 3.48,
        rawTardScore: 48.0,
        hasCommunityNote: false,
      },
      metrics: {
        likes: 1250,
        retweets: 89,
        replies: 340,
        quoteRetweets: 45,
        tweetId: 'demo_mid',
        authorUsername: 'demo_user',
        hasCommunityNote: false,
      },
      tweetUrl: 'https://x.com/demo/status/456',
    },
    chad: {
      type: 'tweet',
      score: { 
        score: 89, 
        replyRatio: 0.058,
        quoteRatio: 0.029,
        engagementQuality: 19.43,
        rawTardScore: 11.0,
        hasCommunityNote: false,
      },
      metrics: {
        likes: 15420,
        retweets: 4200,
        replies: 890,
        quoteRetweets: 120,
        tweetId: 'demo_chad',
        authorUsername: 'demo_user',
        hasCommunityNote: false,
      },
      tweetUrl: 'https://x.com/demo/status/789',
    },
  };

  const showDemoResult = (type: 'tard' | 'mid' | 'chad') => {
    setIsDemo(true);
    setResult(demoResults[type]);
  };

  // Handle tweet URL from bookmarklet (query parameter)
  useEffect(() => {
    const tweetUrl = searchParams.get('tweet');
    if (tweetUrl) {
      // Clear the URL parameter to clean up the address bar
      setSearchParams({}, { replace: true });
      // Auto-submit the tweet URL
      handleSubmit(tweetUrl);
    }
  }, []);

  const handleSubmit = async (url: string) => {
    // Parse the URL to determine type
    const parsed = parseTwitterUrl(url);
    
    if (parsed.type === 'invalid') {
      toast.error("Invalid Twitter/X URL", {
        description: "Please enter a valid tweet or profile URL (e.g., x.com/user or x.com/user/status/123...)",
      });
      return;
    }

    setIsLoading(true);
    setResult(null);
    setIsDemo(false);

    try {
      if (parsed.type === 'tweet') {
        // Handle tweet analysis
        setLoadingMessage("Analyzing tweet...");
        const metrics = await fetchTweetMetrics(parsed.tweetId!);
        const score = calculateTardScore(metrics);
        
        // Save to leaderboard
        saveTweetEntry({
          tweetUrl: url,
          tweetId: parsed.tweetId!,
          authorUsername: parsed.username || metrics.authorUsername,
          score,
          metrics,
        });
        
        setResult({ type: 'tweet', score, metrics, tweetUrl: url });
      } else {
        // Handle user profile analysis
        setLoadingMessage(`Analyzing @${parsed.username}'s recent tweets...`);
        const analysis = await analyzeUserProfile(parsed.username!);
        
        // Save to leaderboard
        saveUserEntry({
          username: analysis.username,
          profileUrl: url,
          averageScore: analysis.averageScore,
          tweetCount: analysis.tweetCount,
        });
        
        setResult({ type: 'user', analysis });
      }
    } catch (error) {
      console.error("Error analyzing:", error);
      toast.error("Failed to analyze", {
        description: "Please try again later.",
      });
    } finally {
      setIsLoading(false);
      setLoadingMessage("");
    }
  };

  const handleReset = () => {
    setResult(null);
    setIsDemo(false);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-8 pb-6 px-4 text-center">
        <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 rounded-full bg-amber-500/20 border border-amber-500/50">
          <span className="text-amber-400 font-bold text-xs uppercase tracking-wider">⚠️ Demo Mode</span>
          <span className="text-amber-400/80 text-xs">Using simulated data</span>
        </div>
        <h1 className="font-display text-5xl sm:text-6xl md:text-7xl font-bold text-gradient-title tracking-tight">
          TARDOMETER
        </h1>
        <p className="mt-4 text-muted-foreground text-lg max-w-md mx-auto">
          Find out if that tweet is <span className="text-destructive font-semibold">Tard</span>,{" "}
          <span className="text-accent font-semibold">Mid</span>, or{" "}
          <span className="text-primary font-semibold">Based</span>
        </p>
      </section>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-start px-4 pb-16">
        {/* Input Section */}
        <div className="w-full max-w-xl mb-6">
          <TweetInput onSubmit={handleSubmit} isLoading={isLoading} />
        </div>

        {/* Demo Buttons & Links */}
        {!result && !isLoading && (
          <div className="w-full max-w-xl mb-12 space-y-4">
            {/* Demo Example Buttons */}
            <div className="glass-card p-4">
              <p className="text-center text-sm text-muted-foreground mb-3">
                👀 See example results:
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                <button
                  onClick={() => showDemoResult('tard')}
                  className="px-4 py-2 rounded-lg bg-destructive/20 border border-destructive/50 text-destructive font-semibold text-sm hover:bg-destructive/30 transition-colors"
                >
                  😭 Tarded Example
                </button>
                <button
                  onClick={() => showDemoResult('mid')}
                  className="px-4 py-2 rounded-lg bg-accent/20 border border-accent/50 text-accent font-semibold text-sm hover:bg-accent/30 transition-colors"
                >
                  😐 Mid Example
                </button>
                <button
                  onClick={() => showDemoResult('chad')}
                  className="px-4 py-2 rounded-lg bg-primary/20 border border-primary/50 text-primary font-semibold text-sm hover:bg-primary/30 transition-colors"
                >
                  🗿 Chad Example
                </button>
              </div>
            </div>
            
            <BookmarkletSection />
            
            {/* Leaderboard Link */}
            <Link 
              to="/leaderboards"
              className="block glass-card p-4 text-center hover:border-primary/50 transition-colors group"
            >
              <div className="flex items-center justify-center gap-2">
                <Trophy className="w-5 h-5 text-accent group-hover:text-primary transition-colors" />
                <span className="font-semibold text-foreground group-hover:text-primary transition-colors">
                  View Weekly Leaderboards
                </span>
              </div>
            </Link>
          </div>
        )}

        {/* Results Section */}
        {(result || isLoading) && (
          <div className="w-full max-w-xl animate-fade-up">
            <div className="glass-card p-8 sm:p-12">
              {isLoading ? (
                <div className="flex flex-col items-center gap-6">
                  <div className="w-72 h-40 sm:w-80 sm:h-44 md:w-96 md:h-52 flex items-center justify-center">
                    <div className="animate-pulse-slow text-muted-foreground text-lg text-center">
                      {loadingMessage || "Analyzing..."}
                    </div>
                  </div>
                </div>
              ) : result ? (
                <div className="relative">
                  <button
                    onClick={handleReset}
                    className="absolute -top-12 right-0 text-sm text-muted-foreground hover:text-foreground transition-colors px-4 py-2 rounded-full bg-muted/50 hover:bg-muted font-medium z-10"
                  >
                    ✕ Reset
                  </button>
                  
                  {/* Demo Mode Banner */}
                  <div className="mb-6 p-4 rounded-xl bg-amber-500 text-center">
                    <p className="text-amber-950 font-bold text-sm">
                      {isDemo 
                        ? "🎭 DEMO RESULT: This is an example to show how scores work!"
                        : "⚠️ DEMO MODE: These scores are simulated. Real Twitter/X API coming soon!"
                      }
                    </p>
                  </div>
                  
                  {result.type === 'tweet' ? (
                    <>
                      <Gauge score={result.score.score} showDemoBadge />
                      <MetricsDisplay metrics={result.metrics} score={result.score} />
                      <div className="flex justify-center mt-6">
                        <ShareButton 
                          score={result.score.score} 
                          type="tweet" 
                          tweetUrl={result.tweetUrl} 
                        />
                      </div>
                      <NotesSection type="tweet" identifier={result.metrics.tweetId} />
                    </>
                  ) : (
                    <>
                      <UserResultDisplay analysis={result.analysis} />
                      <div className="flex justify-center mt-6">
                        <ShareButton 
                          score={result.analysis.averageScore.score} 
                          type="user" 
                          username={result.analysis.username} 
                        />
                      </div>
                      <NotesSection type="user" identifier={result.analysis.username} />
                    </>
                  )}
                </div>
              ) : null}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Index;
