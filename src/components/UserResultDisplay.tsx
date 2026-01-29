import { UserAnalysis } from "@/lib/twitter";
import Gauge from "./Gauge";
import TardScoreBreakdown from "./TardScoreBreakdown";
import { User, AlertTriangle } from "lucide-react";

interface UserResultDisplayProps {
  analysis: UserAnalysis;
}

const UserResultDisplay = ({ analysis }: UserResultDisplayProps) => {
  const { username, averageScore, tweetCount, communityNotePercentage } = analysis;

  return (
    <div className="flex flex-col items-center gap-6">
      {/* User Header */}
      <div className="flex items-center gap-3 text-center mb-16 sm:mb-24 md:mb-28">
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
      <Gauge score={averageScore.score} showDemoBadge />

      {/* Community Notes Warning */}
      {communityNotePercentage > 0 && (
        <div className="w-full flex items-center justify-center gap-2 p-3 rounded-xl bg-amber-500/20 border border-amber-500/50">
          <AlertTriangle className="w-5 h-5 text-amber-400" />
          <span className="text-amber-400 font-semibold text-sm">
            {communityNotePercentage}% of tweets flagged with Community Notes
          </span>
        </div>
      )}

      {/* Tard Score Breakdown */}
      <TardScoreBreakdown 
        score={averageScore} 
        tweetCount={tweetCount} 
        communityNotePercentage={communityNotePercentage} 
      />
    </div>
  );
};

export default UserResultDisplay;
