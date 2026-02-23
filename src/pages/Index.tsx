import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import TweetInput from "@/components/TweetInput";
import Gauge from "@/components/Gauge";
import MetricsDisplay from "@/components/MetricsDisplay";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

import { 
  parseTwitterUrl, 
  fetchTweetMetrics, 
  calculateTardScore, 
  ApifyError,
  TweetMetrics, 
  TardScore,
} from "@/lib/twitter";
import { toast } from "sonner";

interface TweetResult {
  score: TardScore;
  metrics: TweetMetrics;
  tweetUrl: string;
}

const RESULT_STORAGE_KEY = 'tardometer_last_result';

const Index = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");
  const [clearTrigger, setClearTrigger] = useState(0);
  const [result, setResult] = useState<TweetResult | null>(() => {
    try {
      const saved = localStorage.getItem(RESULT_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to restore result:', e);
    }
    return null;
  });

  useEffect(() => {
    const tweetUrl = searchParams.get('tweet');
    if (tweetUrl) {
      setSearchParams({}, { replace: true });
      handleSubmit(tweetUrl);
    }
  }, []);

  const handleSubmit = async (url: string) => {
    const parsed = parseTwitterUrl(url);
    
    if (parsed.type === 'invalid') {
      toast.error("Invalid Tweet URL", {
        description: "Please enter a valid tweet URL (e.g., x.com/user/status/123...)",
      });
      return;
    }

    setIsLoading(true);
    setResult(null);

    try {
      setLoadingMessage("Fetching tweet from Twitter... This may take 30-60 seconds");
      const metrics = await fetchTweetMetrics(parsed.tweetId!);
      const score = calculateTardScore(metrics);
      
      const tweetResult: TweetResult = { score, metrics, tweetUrl: url };
      setResult(tweetResult);
      localStorage.setItem(RESULT_STORAGE_KEY, JSON.stringify(tweetResult));
    } catch (error) {
      console.error("Error analyzing:", error);
      
      let errorMessage = "An unexpected error occurred. Please try again.";
      let errorDescription = "";
      
      if (error instanceof ApifyError) {
        errorMessage = error.isUserError ? "Could not fetch data" : "API Error";
        errorDescription = error.message;
      } else if (error instanceof Error) {
        if (error.message.includes('Failed to fetch')) {
          errorMessage = "Network Error";
          errorDescription = "Could not connect to the server. Please check your connection.";
        } else {
          errorDescription = error.message;
        }
      }
      
      toast.error(errorMessage, {
        description: errorDescription,
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
      setLoadingMessage("");
    }
  };

  const handleReset = () => {
    setResult(null);
    localStorage.removeItem(RESULT_STORAGE_KEY);
    setClearTrigger(c => c + 1);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      {/* Title */}
      <section className="pt-4 sm:pt-6 pb-2 sm:pb-4 px-4 text-center">
        <h1 className="font-display text-4xl sm:text-6xl md:text-7xl font-bold text-gradient-title tracking-tight">
          TARDOMETER
        </h1>
      </section>

      <main className="flex flex-col items-center justify-start px-4 flex-1 pb-4 sm:pb-16">
        {/* Input */}
        <div className="w-full max-w-2xl mb-4 sm:mb-8">
          <TweetInput onSubmit={handleSubmit} isLoading={isLoading} clearTrigger={clearTrigger} />
        </div>

        {/* Gauge - always visible */}
        <div className="w-full max-w-xl">
          <div className="glass-card p-8 sm:p-12">
            {isLoading ? (
              <div className="flex flex-col items-center gap-6">
                <Gauge score={null} />
                <div className="animate-pulse-slow text-muted-foreground text-lg text-center">
                  {loadingMessage || "Analyzing..."}
                </div>
              </div>
            ) : result ? (
              <div className="relative">
                <button
                  onClick={handleReset}
                  className="absolute top-0 right-0 text-xs text-muted-foreground hover:text-foreground transition-colors px-3 py-1.5 rounded-full bg-muted/50 hover:bg-muted font-medium z-10"
                >
                  ✕ Clear
                </button>
                <Gauge score={result.score.score} />
                
                {/* Low data warning */}
                {(result.metrics.likes + result.metrics.replies + result.metrics.retweets + result.metrics.quoteRetweets) < 50 && (
                  <div className="text-center mt-2 text-xs text-amber-400/80">
                    ⚠️ Low data — score may not be reliable
                  </div>
                )}
                {/* Share on X button */}
                {(() => {
                  const zone = result.score.score <= 35 ? "GOAT" : result.score.score <= 70 ? "MID" : "REKT";
                  const tweetText = encodeURIComponent(`My tweet scored ${result.score.score}/100 — ${zone} on the Tardometer 💀\n\nCheck your Tard Score 👇\nhttps://tardometer.com`);
                  return (
                    <div className="flex justify-center mt-6">
                      <a
                        href={`https://x.com/intent/tweet?text=${tweetText}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-8 py-4 rounded-xl bg-foreground text-background font-bold text-lg hover:opacity-90 transition-opacity shadow-lg animate-fade-in"
                      >
                        🐦 Post this on X
                      </a>
                    </div>
                  );
                })()}
                
                <MetricsDisplay metrics={result.metrics} score={result.score} />
              </div>
            ) : (
              <Gauge score={null} />
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
