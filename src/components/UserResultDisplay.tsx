import { UserAnalysis } from "@/lib/twitter";
import Gauge from "./Gauge";
import { User } from "lucide-react";

interface UserResultDisplayProps {
  analysis: UserAnalysis;
}

const UserResultDisplay = ({ analysis }: UserResultDisplayProps) => {
  const { username, averageScore, tweetCount } = analysis;

  return (
    <div className="flex flex-col items-center gap-6">
      {/* User Header */}
      <div className="flex items-center gap-3 text-center">
        <div className="w-12 h-12 rounded-full bg-primary/20 border-2 border-primary/50 flex items-center justify-center">
          <User className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h2 className="text-xl sm:text-2xl font-display font-bold text-foreground">
            @{username}
          </h2>
          <p className="text-sm text-muted-foreground">
            Based on {tweetCount} recent tweets
          </p>
        </div>
      </div>

      {/* Gauge */}
      <Gauge score={averageScore.score} />

      {/* Score Breakdown */}
      <div className="w-full p-4 rounded-xl bg-muted/30 border border-border/30">
        <h4 className="text-sm font-semibold text-muted-foreground mb-3 text-center">Average Score Breakdown</h4>
        <div className="grid grid-cols-3 gap-2 text-center">
          <div>
            <div className="text-xs text-muted-foreground">Avg Reply Ratio</div>
            <div className={`text-sm font-mono font-bold ${averageScore.replyRatio > 0.5 ? "text-destructive" : "text-primary"}`}>
              {averageScore.replyRatio}
            </div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground">Avg Quote Ratio</div>
            <div className={`text-sm font-mono font-bold ${averageScore.quoteRatio > 0.5 ? "text-destructive" : "text-primary"}`}>
              {averageScore.quoteRatio}
            </div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground">Avg Eng. Quality</div>
            <div className={`text-sm font-mono font-bold ${averageScore.engagementQuality < 5 ? "text-destructive" : "text-primary"}`}>
              {averageScore.engagementQuality}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserResultDisplay;
