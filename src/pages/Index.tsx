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
                {/* Inline Share Preview */}
                {(() => {
                  const zone = result.score.score <= 35 ? "NOT RETARDED" : result.score.score <= 70 ? "SEMI-RETARDED" : "FULLY RETARDED";
                  const shareUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/share?score=${result.score.score}&zone=${zone}&v=4`;
                  const ogImages: Record<string, string> = {
                    "NOT RETARDED": "/og-not-retarded.png",
                    "SEMI-RETARDED": "/og-semi-retarded.png",
                    "FULLY RETARDED": "/og-fully-retarded.png",
                  };
                  const ogImage = ogImages[zone] || ogImages["SEMI-RETARDED"];
                  const tweetText = `This tweet scored ${result.score.score}/100 — ${zone}. The Retard Score doesn't lie. retardometer.com`;

                  const handlePost = () => {
                    const fullUrl = `https://x.com/intent/tweet?text=${encodeURIComponent(tweetText)}&url=${encodeURIComponent(shareUrl)}`;
                    window.open(fullUrl, "_blank", "noopener,noreferrer");
                  };

                  return (
                    <div className="mt-6 animate-fade-in">
                      {/* Tweet Preview Card */}
                      <div className="rounded-xl border border-border/40 bg-secondary/30 overflow-hidden">
                        <img src={ogImage} alt={`${zone} OG card`} className="w-full object-cover" />
                        <div className="px-4 py-3">
                          <p className="text-sm text-foreground/80 leading-relaxed">{tweetText}</p>
                        </div>
                      </div>

                      {/* Action Button */}
                      <div className="mt-4">
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
                          className="w-full inline-flex items-center justify-center px-6 py-3.5 rounded-xl border border-border bg-muted text-foreground font-bold text-base hover:bg-accent transition-colors shadow-lg"
                        >
                          🔗 Copy link
                        </button>
                      </div>
                      <p className="text-base font-semibold text-foreground/90 text-center mt-4">
                        💡 Paste the link as a reply or quote tweet
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
        {/* Official Warning Notice */}
        <div className="w-full max-w-xl mt-8 sm:mt-12">
          <div className="rounded-xl border border-destructive/40 bg-destructive/5 px-6 py-5">
            <p className="text-destructive font-bold text-sm tracking-wide mb-3">⚠️ OFFICIAL NOTICE</p>
            <div className="text-foreground/70 text-xs leading-relaxed space-y-2">
              <p>Anyone found posting incorrect results to the wrong tweet will be immediately blocked and their account publicly exposed as <span className="text-destructive font-bold">FULLY RETARDED</span>.</p>
              <p>No appeals. No redemption. Permanent block.</p>
              <p>The Retard Score doesn't lie — and neither do we.</p>
              <p className="text-foreground/50 italic mt-3">You have been warned.</p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
