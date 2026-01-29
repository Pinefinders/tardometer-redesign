import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";

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

  const handleClear = () => {
    setUrl("");
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto">
      <div className="glass-card p-6 sm:p-8 border-primary/20 shadow-lg shadow-primary/5">
        <div className="flex flex-col sm:flex-row gap-3">
          <Input
            id="tweet-url"
            type="url"
            placeholder="Paste tweet or profile URL..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="flex-1 h-14 text-base bg-input border-border text-foreground placeholder:text-muted-foreground focus-visible:ring-primary focus-visible:ring-2 focus-visible:border-primary"
          />
          <div className="flex gap-2">
            <Button
              type="submit"
              disabled={!url.trim() || isLoading}
              variant="calculate"
              size="lg"
              className="h-14 px-8 font-semibold text-base"
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
                "Analyze"
              )}
            </Button>
            {url.trim() && !isLoading && (
              <Button
                type="button"
                variant="ghost"
                size="lg"
                onClick={handleClear}
                className="h-14 px-3 text-muted-foreground hover:text-foreground"
              >
                <X className="w-5 h-5" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </form>
  );
};

export default TweetInput;
