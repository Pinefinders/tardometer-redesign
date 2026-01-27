import { useState } from "react";
import TweetInput from "@/components/TweetInput";
import Gauge from "@/components/Gauge";

const Index = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{ score: number; tweetUrl: string } | null>(null);

  const handleSubmit = async (url: string) => {
    setIsLoading(true);
    setResult(null);

    // Simulate API call with mock data
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Generate a random score for demo purposes
    const mockScore = Math.floor(Math.random() * 101);
    
    setResult({ score: mockScore, tweetUrl: url });
    setIsLoading(false);
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
        <div className="w-full max-w-xl mb-12">
          <TweetInput onSubmit={handleSubmit} isLoading={isLoading} />
        </div>

        {/* Results Section */}
        {(result || isLoading) && (
          <div className="w-full max-w-xl animate-fade-up">
            <div className="glass-card p-8 sm:p-12">
              {isLoading ? (
                <div className="flex flex-col items-center gap-6">
                  <div className="w-72 h-40 sm:w-80 sm:h-44 md:w-96 md:h-52 flex items-center justify-center">
                    <div className="animate-pulse-slow text-muted-foreground text-lg">
                      Analyzing tweet...
                    </div>
                  </div>
                </div>
              ) : result ? (
                <>
                  <Gauge score={result.score} />
                  <div className="mt-8 text-center">
                    <button
                      onClick={handleReset}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors underline underline-offset-4"
                    >
                      Analyze another tweet
                    </button>
                  </div>
                </>
              ) : null}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="py-6 px-4 text-center text-muted-foreground text-sm">
        <p>For entertainment purposes only. No actual analysis is performed yet.</p>
      </footer>
    </div>
  );
};

export default Index;
