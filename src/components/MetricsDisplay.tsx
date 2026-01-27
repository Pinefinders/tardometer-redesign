import { TweetMetrics, TardScore } from "@/lib/twitter";
import { Heart, MessageCircle, Repeat2, Quote } from "lucide-react";

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
  return (
    <div className="mt-6 space-y-4">
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

      {/* Score Breakdown */}
      <div className="p-4 rounded-xl bg-muted/30 border border-border/30">
        <h4 className="text-sm font-semibold text-muted-foreground mb-3 text-center">Score Breakdown</h4>
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
    </div>
  );
};

export default MetricsDisplay;
