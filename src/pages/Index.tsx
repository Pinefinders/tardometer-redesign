import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { usePwaInstall } from "@/hooks/use-pwa-install";
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
import { checkCache, storeInCache } from "@/lib/apify";
import { toast } from "sonner";

interface TweetResult {
  score: TardScore;
  metrics: TweetMetrics;
  tweetUrl: string;
  fromCache?: boolean;
}


const RESULT_STORAGE_KEY = 'retardometer_last_result';

const Index = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { canInstall, install } = usePwaInstall();
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
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
      setErrorMessage("ARE YOU RETARDED? Enter a valid tweet URL");
      return;
    }

    setErrorMessage("");
    setIsLoading(true);
    setResult(null);

    try {
      // Check cache first
      setLoadingMessage("Checking cache...");
      const cached = await checkCache(url);

      if (cached) {
        console.log('[Cache] Hit! Returning cached result');
        const metrics: TweetMetrics = {
          likes: cached.likes,
          replies: cached.replies,
          retweets: cached.retweets,
          quoteRetweets: cached.quotes,
          tweetId: cached.tweet_id,
          authorUsername: cached.author_username,
          hasCommunityNote: cached.has_community_note,
        };
        const score: TardScore = {
          score: cached.score,
          replyRatio: cached.reply_ratio,
          quoteRatio: cached.quote_ratio,
          engagementQuality: cached.engagement_quality,
          rawTardScore: cached.raw_score,
          hasCommunityNote: cached.has_community_note,
        };
        const tweetResult: TweetResult = { score, metrics, tweetUrl: url, fromCache: true };
        setResult(tweetResult);
        localStorage.setItem(RESULT_STORAGE_KEY, JSON.stringify(tweetResult));
        return;
      }

      // No cache hit — call Apify
      setLoadingMessage("Scanning Tweet for any retardation..");
      const metrics = await fetchTweetMetrics(parsed.tweetId!);
      const score = calculateTardScore(metrics);
      
      const tweetResult: TweetResult = { score, metrics, tweetUrl: url, fromCache: false };
      setResult(tweetResult);
      localStorage.setItem(RESULT_STORAGE_KEY, JSON.stringify(tweetResult));

      // Store in cache
      const zone = score.score <= 35 ? "NOT RETARDED" : score.score <= 70 ? "SEMI-RETARDED" : "FULLY RETARDED";
      await storeInCache(url, parsed.tweetId!, score.score, zone, {
        id: metrics.tweetId,
        likes: metrics.likes,
        replies: metrics.replies,
        retweets: metrics.retweets,
        quoteRetweets: metrics.quoteRetweets,
        authorUsername: metrics.authorUsername,
        hasCommunityNote: metrics.hasCommunityNote,
      }, {
        replyRatio: score.replyRatio,
        quoteRatio: score.quoteRatio,
        engagementQuality: score.engagementQuality,
        rawTardScore: score.rawTardScore,
      });
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
    setErrorMessage("");
    localStorage.removeItem(RESULT_STORAGE_KEY);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      {/* Title */}
      <section className="pt-4 sm:pt-6 pb-2 sm:pb-4 px-4 text-center">
        <h1 className="font-display text-4xl sm:text-6xl md:text-7xl font-bold text-gradient-title tracking-tight">
          RETARDOMETER
        </h1>
      </section>

      <main className="flex flex-col items-center justify-start px-4 flex-1 pb-4 sm:pb-16">
        {/* Input */}
        <div className="w-full max-w-2xl mb-4 sm:mb-8">
          <TweetInput onSubmit={handleSubmit} isLoading={isLoading} />
          {errorMessage && (
            <p className="text-destructive text-sm font-medium mt-2 text-center">{errorMessage}</p>
          )}
          {canInstall && !isLoading && !result && (
            <button
              onClick={install}
              className="block mx-auto mt-3 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              Install as app 💀
            </button>
          )}
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
                
                {/* Cached result indicator */}
                {result.fromCache && (
                  <div className="text-center mt-2 text-xs text-primary/80 font-medium">
                    ⚡ Cached result
                  </div>
                )}
                
                {/* Low data warning */}
                {(result.metrics.likes + result.metrics.replies + result.metrics.retweets + result.metrics.quoteRetweets) < 50 && (
                  <div className="text-center mt-2 text-xs text-amber-400/80">
                    ⚠️ Low data — score may not be reliable
                  </div>
                )}
                {/* Share on X button */}
                {(() => {
                  const zone = result.score.score <= 35 ? "NOT RETARDED" : result.score.score <= 70 ? "SEMI-RETARDED" : "FULLY RETARDED";
                   const shareZone = result.score.score <= 35 ? "GOAT" : result.score.score <= 70 ? "MID" : "REKT";
                   const shareUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/share?score=${result.score.score}&zone=${shareZone}&v=4`;
                   const originalTweetUrl = `https://x.com/i/status/${result.metrics.tweetId}`;
                   const tweetText = encodeURIComponent(`This tweet scored ${result.score.score}/100 — ${zone}. The Retard Score doesn't lie. retardometer.com\n\n${originalTweetUrl}`);
                   const fullShareUrl = `https://x.com/intent/tweet?text=${tweetText}&url=${encodeURIComponent(shareUrl)}`;
                  return (
                    <div className="flex flex-col items-center mt-6 gap-3">
                      <div className="flex items-center gap-3">
                        <a
                          href={fullShareUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-3 px-10 py-4 rounded-xl bg-foreground text-background font-bold text-lg hover:opacity-90 transition-opacity shadow-lg animate-fade-in"
                        >
                          <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" aria-hidden="true">
                            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                          </svg>
                          Post on X
                        </a>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(shareUrl).then(() => {
                              const btn = document.getElementById('copy-link-btn');
                              if (btn) {
                                btn.textContent = '✓ Copied!';
                                setTimeout(() => { btn.textContent = '🔗 Copy link'; }, 2000);
                              }
                            });
                          }}
                          id="copy-link-btn"
                          className="inline-flex items-center px-6 py-4 rounded-xl border border-border bg-muted text-foreground font-bold text-lg hover:bg-accent transition-colors shadow-lg animate-fade-in"
                        >
                          🔗 Copy link
                        </button>
                      </div>
                      <p className="text-xs text-muted-foreground text-center">
                        💡 For maximum roast: paste the link as a quote tweet or reply
                      </p>
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
