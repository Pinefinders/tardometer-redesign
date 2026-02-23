import { useState } from "react";
import { TweetMetrics, TardScore } from "@/lib/twitter";
import { Heart, MessageCircle, Repeat2, Quote, AlertTriangle, ChevronDown, ChevronUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface MetricsDisplayProps {
  metrics: TweetMetrics;
  score: TardScore;
}

const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + "M";
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + "K";
  }
  return num.toString();
};

const MetricsDisplay = ({ metrics, score }: MetricsDisplayProps) => {
  const [showBreakdown, setShowBreakdown] = useState(false);

  return (
    <div className="mt-6 space-y-4">
      {/* Community Note Warning */}
      {metrics.hasCommunityNote && (
        <div className="flex items-center justify-center gap-2 p-3 rounded-xl bg-amber-500/20 border border-amber-500/50">
          <AlertTriangle className="w-5 h-5 text-amber-400" />
          <span className="text-amber-400 font-semibold text-sm">
            ⚠️ Community Note
          </span>
          <Badge className="bg-amber-500/30 text-amber-300 border-amber-500/50 text-xs">
            +50% Tard Penalty
          </Badge>
        </div>
      )}

      {/* Raw Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="flex flex-col items-center p-3 rounded-xl bg-secondary/50 border border-border/50">
          <Heart className="w-5 h-5 text-destructive mb-1" />
          <span className="text-lg font-bold text-foreground">{formatNumber(metrics.likes)}</span>
          <span className="text-xs text-muted-foreground">Likes</span>
        </div>
        <div className="flex flex-col items-center p-3 rounded-xl bg-secondary/50 border border-border/50">
          <MessageCircle className="w-5 h-5 text-primary mb-1" />
          <span className="text-lg font-bold text-foreground">{formatNumber(metrics.replies)}</span>
          <span className="text-xs text-muted-foreground">Replies</span>
        </div>
        <div className="flex flex-col items-center p-3 rounded-xl bg-secondary/50 border border-border/50">
          <Repeat2 className="w-5 h-5 text-primary mb-1" />
          <span className="text-lg font-bold text-foreground">{formatNumber(metrics.retweets)}</span>
          <span className="text-xs text-muted-foreground">Retweets</span>
        </div>
        <div className="flex flex-col items-center p-3 rounded-xl bg-secondary/50 border border-border/50">
          <Quote className="w-5 h-5 text-accent mb-1" />
          <span className="text-lg font-bold text-foreground">{formatNumber(metrics.quoteRetweets)}</span>
          <span className="text-xs text-muted-foreground">Quotes</span>
        </div>
      </div>

      {/* Score Breakdown Toggle */}
      <button
        onClick={() => setShowBreakdown(!showBreakdown)}
        className="flex items-center justify-center gap-1.5 w-full text-xs text-muted-foreground hover:text-foreground transition-colors py-1"
      >
        {showBreakdown ? "hide breakdown" : "show breakdown"}
        {showBreakdown ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
      </button>

      {showBreakdown && (
        <div className="p-4 rounded-xl bg-muted/30 border border-border/30 animate-fade-in">
          <div className="grid grid-cols-3 gap-2 text-center">
            <div>
              <div className="text-xs text-muted-foreground">Reply Ratio</div>
              <div className={`text-sm font-mono font-bold ${score.replyRatio > 0.5 ? "text-destructive" : "text-primary"}`}>
                {score.replyRatio}
              </div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Quote Ratio</div>
              <div className={`text-sm font-mono font-bold ${score.quoteRatio > 0.5 ? "text-destructive" : "text-primary"}`}>
                {score.quoteRatio}
              </div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Eng. Quality</div>
              <div className={`text-sm font-mono font-bold ${score.engagementQuality < 5 ? "text-destructive" : "text-primary"}`}>
                {score.engagementQuality}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MetricsDisplay;
