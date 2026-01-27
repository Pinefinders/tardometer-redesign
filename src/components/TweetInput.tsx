import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface TweetInputProps {
  onSubmit: (url: string) => void;
  isLoading?: boolean;
}

const TweetInput = ({ onSubmit, isLoading = false }: TweetInputProps) => {
  const [url, setUrl] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url.trim()) {
      onSubmit(url.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-xl mx-auto">
      <div className="glass-card p-6 sm:p-8">
        <label htmlFor="tweet-url" className="block text-sm font-medium text-muted-foreground mb-3">
          Paste a Twitter/X post URL
        </label>
        <div className="flex flex-col sm:flex-row gap-3">
          <Input
            id="tweet-url"
            type="url"
            placeholder="https://x.com/user/status/..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="flex-1 h-12 bg-input border-border text-foreground placeholder:text-muted-foreground focus-visible:ring-primary"
          />
          <Button
            type="submit"
            disabled={!url.trim() || isLoading}
            variant="calculate"
            size="lg"
            className="h-12 px-8 font-semibold"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Calculating...
              </span>
            ) : (
              "Calculate Score"
            )}
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-3 text-center">
          We'll analyze the post and give it a score from Tard to Based
        </p>
      </div>
    </form>
  );
};

export default TweetInput;
