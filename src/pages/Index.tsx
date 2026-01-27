import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import TweetInput from "@/components/TweetInput";
import Gauge from "@/components/Gauge";
import MetricsDisplay from "@/components/MetricsDisplay";
import UserResultDisplay from "@/components/UserResultDisplay";
import BookmarkletSection from "@/components/BookmarkletSection";
import { 
  parseTwitterUrl, 
  fetchTweetMetrics, 
  calculateTardScore, 
  analyzeUserProfile,
  TweetMetrics, 
  TardScore,
  UserAnalysis 
} from "@/lib/twitter";
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

    try {
      if (parsed.type === 'tweet') {
        // Handle tweet analysis
        setLoadingMessage("Analyzing tweet...");
        const metrics = await fetchTweetMetrics(parsed.tweetId!);
        const score = calculateTardScore(metrics);
        setResult({ type: 'tweet', score, metrics, tweetUrl: url });
      } else {
        // Handle user profile analysis
        setLoadingMessage(`Analyzing @${parsed.username}'s recent tweets...`);
        const analysis = await analyzeUserProfile(parsed.username!);
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
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="pt-12 pb-8 px-4 text-center">
        <h1 className="font-display text-5xl sm:text-6xl md:text-7xl font-bold text-gradient-title tracking-tight">
          TARDOMETER
        </h1>
        <p className="mt-4 text-muted-foreground text-lg max-w-md mx-auto">
          Find out if that tweet is <span className="text-destructive font-semibold">Tard</span>,{" "}
          <span className="text-accent font-semibold">Mid</span>, or{" "}
          <span className="text-primary font-semibold">Based</span>
        </p>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-start px-4 pb-16">
        {/* Input Section */}
        <div className="w-full max-w-xl mb-6">
          <TweetInput onSubmit={handleSubmit} isLoading={isLoading} />
        </div>

        {/* Bookmarklet Section */}
        {!result && !isLoading && (
          <div className="w-full max-w-xl mb-12">
            <BookmarkletSection />
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
                    className="absolute -top-2 right-0 text-sm text-muted-foreground hover:text-foreground transition-colors px-4 py-2 rounded-full bg-muted/50 hover:bg-muted font-medium z-10"
                  >
                    ✕ Reset
                  </button>
                  
                  {/* Demo Mode Banner */}
                  <div className="mb-6 p-3 rounded-lg bg-amber-500/20 border border-amber-500/50 text-center">
                    <p className="text-amber-400 font-semibold text-sm">
                      ⚠️ DEMO MODE: Using simulated data. Not yet connected to Twitter/X API.
                    </p>
                  </div>
                  
                  {result.type === 'tweet' ? (
                    <>
                      <Gauge score={result.score.score} showDemoBadge />
                      <MetricsDisplay metrics={result.metrics} score={result.score} />
                    </>
                  ) : (
                    <UserResultDisplay analysis={result.analysis} />
                  )}
                </div>
              ) : null}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="py-6 px-4 text-center">
        <p className="text-sm text-muted-foreground">
          Currently using mock data for demonstration. Real Twitter API integration coming soon.
        </p>
      </footer>
    </div>
  );
};

export default Index;
