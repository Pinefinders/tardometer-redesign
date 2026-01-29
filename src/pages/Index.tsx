import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import TweetInput from "@/components/TweetInput";
import Gauge from "@/components/Gauge";
import MetricsDisplay from "@/components/MetricsDisplay";
import UserResultDisplay from "@/components/UserResultDisplay";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Zap, Code2, BarChart3 } from "lucide-react";

import { 
  parseTwitterUrl, 
  fetchTweetMetrics, 
  calculateTardScore, 
  analyzeUserProfile,
  ApifyError,
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

const RESULT_STORAGE_KEY = 'tardometer_last_result';

const Index = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");
  const [result, setResult] = useState<Result | null>(() => {
    try {
      const saved = localStorage.getItem(RESULT_STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed to restore result:', e);
    }
    return null;
  });

  // Handle tweet URL from query parameter
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
      toast.error("Invalid Twitter/X URL", {
        description: "Please enter a valid tweet or profile URL (e.g., x.com/user or x.com/user/status/123...)",
      });
      return;
    }

    setIsLoading(true);
    setResult(null);

    try {
      if (parsed.type === 'tweet') {
        setLoadingMessage("Fetching tweet from Twitter... This may take 30-60 seconds");
        const metrics = await fetchTweetMetrics(parsed.tweetId!);
        const score = calculateTardScore(metrics);
        
        const tweetResult: TweetResult = { type: 'tweet', score, metrics, tweetUrl: url };
        setResult(tweetResult);
        localStorage.setItem(RESULT_STORAGE_KEY, JSON.stringify(tweetResult));
      } else {
        setLoadingMessage(`Fetching @${parsed.username}'s tweets... This may take 1-2 minutes`);
        const analysis = await analyzeUserProfile(parsed.username!);
        
        const userResult: UserResult = { type: 'user', analysis };
        setResult(userResult);
        localStorage.setItem(RESULT_STORAGE_KEY, JSON.stringify(userResult));
      }
    } catch (error) {
      console.error("Error analyzing:", error);
      
      // Provide user-friendly error messages
      let errorMessage = "An unexpected error occurred. Please try again.";
      let errorDescription = "";
      
      if (error instanceof ApifyError) {
        if (error.isUserError) {
          errorMessage = "Could not fetch data";
          errorDescription = error.message;
        } else {
          errorMessage = "API Error";
          errorDescription = error.message;
        }
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
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-4 sm:pt-8 pb-3 sm:pb-6 px-4 text-center">
        <h1 className="font-display text-4xl sm:text-6xl md:text-7xl font-bold text-gradient-title tracking-tight">
          TARDOMETER
        </h1>
        <p className="mt-2 sm:mt-4 text-muted-foreground text-base sm:text-lg">
          🤖 Algorithmic Tweet & Profile Analysis
        </p>
        <div className="mt-2 sm:mt-3 flex justify-center items-center gap-2 text-xs sm:text-sm text-muted-foreground select-none pointer-events-none">
          <span className="flex items-center gap-1">
            <Zap className="w-3 h-3 sm:w-4 sm:h-4 text-primary" /> Instant
          </span>
          <span className="text-border/80">|</span>
          <span className="flex items-center gap-1">
            <Code2 className="w-3 h-3 sm:w-4 sm:h-4 text-primary" /> Open Source
          </span>
          <span className="text-border/80">|</span>
          <span className="flex items-center gap-1">
            <BarChart3 className="w-3 h-3 sm:w-4 sm:h-4 text-primary" /> Data-Driven
          </span>
        </div>
      </section>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-start px-4 pb-4 sm:pb-16">
        {/* Input Section */}
        <div className="w-full max-w-2xl mb-2 sm:mb-6">
          <TweetInput onSubmit={handleSubmit} isLoading={isLoading} />
        </div>


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
                  {/* Reset button */}
                  <div className="flex justify-end mb-4 sm:absolute sm:-top-12 sm:right-0 sm:mb-0">
                    <button
                      onClick={handleReset}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors px-4 py-2 rounded-full bg-muted/50 hover:bg-muted font-medium"
                    >
                      ✕ Reset
                    </button>
                  </div>
                  
                  
                  {result.type === 'tweet' ? (
                    <>
                      <Gauge score={result.score.score} showDemoBadge />
                      <MetricsDisplay metrics={result.metrics} score={result.score} />
                      <div className="flex justify-center mt-6">
                        <button
                          onClick={handleReset}
                          className="px-6 py-3 rounded-lg bg-primary/20 border border-primary/50 text-primary font-semibold hover:bg-primary/30 transition-colors"
                        >
                          Analyze Another
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <UserResultDisplay analysis={result.analysis} />
                      <div className="flex justify-center mt-6">
                        <button
                          onClick={handleReset}
                          className="px-6 py-3 rounded-lg bg-primary/20 border border-primary/50 text-primary font-semibold hover:bg-primary/30 transition-colors"
                        >
                          Analyze Another
                        </button>
                      </div>
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
