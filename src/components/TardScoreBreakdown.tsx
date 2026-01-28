import { useState } from "react";
import { ChevronDown, ChevronUp, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { UserTardScoreDetails } from "@/lib/twitter";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface TardScoreBreakdownProps {
  score: UserTardScoreDetails;
  tweetCount: number;
  communityNotePercentage: number;
}

const TardScoreBreakdown = ({ score, tweetCount, communityNotePercentage }: TardScoreBreakdownProps) => {
  const [isOpen, setIsOpen] = useState(false);

  // Reply ratio interpretation
  const getReplyRatioLevel = (ratio: number) => {
    if (ratio <= 0.3) return { level: "Low", emoji: "✓", color: "text-primary", meaning: "People agreeing, not arguing" };
    if (ratio <= 0.8) return { level: "Medium", emoji: "⚠️", color: "text-accent", meaning: "Some debate, mixed reactions" };
    return { level: "High", emoji: "❌", color: "text-destructive", meaning: "Getting ratioed - lots of arguing" };
  };

  // Quote ratio interpretation
  const getQuoteRatioLevel = (ratio: number) => {
    if (ratio <= 0.3) return { level: "Low", emoji: "✓", color: "text-primary", meaning: "Being shared, not mocked" };
    if (ratio <= 0.6) return { level: "Medium", emoji: "⚠️", color: "text-accent", meaning: "Some dunking, mostly neutral" };
    return { level: "High", emoji: "❌", color: "text-destructive", meaning: "Heavy quote-tweet dunking" };
  };

  // Engagement quality interpretation
  const getEngagementQualityLevel = (quality: number) => {
    if (quality < 2) return { level: "Low", emoji: "❌", color: "text-destructive", meaning: "Negative engagement >> Positive" };
    if (quality < 5) return { level: "Medium", emoji: "⚠️", color: "text-accent", meaning: "Balanced engagement" };
    return { level: "High", emoji: "✓", color: "text-primary", meaning: "Strong positive engagement" };
  };

  // Get impact icon and color
  const getImpactDisplay = (impact: number) => {
    if (impact > 0) return { icon: <TrendingUp className="w-3 h-3" />, label: "Helped", color: "text-primary", points: `+${impact}` };
    if (impact < 0) return { icon: <TrendingDown className="w-3 h-3" />, label: "Hurt", color: "text-destructive", points: `${impact}` };
    return { icon: <Minus className="w-3 h-3" />, label: "Neutral", color: "text-muted-foreground", points: "0" };
  };

  const replyLevel = getReplyRatioLevel(score.replyRatio);
  const quoteLevel = getQuoteRatioLevel(score.quoteRatio);
  const engagementLevel = getEngagementQualityLevel(score.engagementQuality);

  const replyImpact = getImpactDisplay(score.replyRatioImpact ?? 0);
  const quoteImpact = getImpactDisplay(score.quoteRatioImpact ?? 0);
  const engagementImpact = getImpactDisplay(score.engagementQualityImpact ?? 0);

  // Overall interpretation
  const getOverallInterpretation = () => {
    const tardScore = score.score;
    if (tardScore >= 76) {
      return "This user's content generates strong positive engagement with people sharing and liking more than arguing or dunking.";
    }
    if (tardScore >= 50) {
      return "This user's content generates mixed reactions - some positive engagement but also notable pushback or debate.";
    }
    if (tardScore >= 25) {
      return "This user's content frequently generates controversy, with more arguing and dunking than positive engagement.";
    }
    return "This user's content regularly gets ratioed with heavy negative engagement and widespread mockery.";
  };

  return (
    <div className="w-full p-4 rounded-xl bg-muted/30 border border-border/30">
      <h4 className="text-sm font-semibold text-muted-foreground mb-3 text-center">Tard Score Breakdown</h4>
      
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger className="w-full flex items-center justify-center gap-2 p-2 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors mb-3">
          <span className="text-sm text-muted-foreground">
            {isOpen ? "Hide Details" : "Show Details"}
          </span>
          {isOpen ? (
            <ChevronUp className="w-4 h-4 text-muted-foreground" />
          ) : (
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          )}
        </CollapsibleTrigger>
        
        <CollapsibleContent className="space-y-5">
          {/* Sample Context */}
          <p className="text-xs text-muted-foreground text-center">
            Based on {tweetCount} recent tweets analyzed
          </p>

          {/* Raw Metrics */}
          {score.avgLikes !== undefined && (
            <div className="p-3 rounded-lg bg-muted/20 border border-border/20">
              <h5 className="text-xs font-semibold text-muted-foreground mb-2">📊 Raw Metrics (Average per tweet)</h5>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Average Likes:</span>
                  <span className="font-mono font-bold text-foreground">{score.avgLikes.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Average Replies:</span>
                  <span className="font-mono font-bold text-foreground">{(score.avgReplies ?? 0).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Average Retweets:</span>
                  <span className="font-mono font-bold text-foreground">{(score.avgRetweets ?? 0).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Average Quote Tweets:</span>
                  <span className="font-mono font-bold text-foreground">{(score.avgQuoteRetweets ?? 0).toLocaleString()}</span>
                </div>
              </div>
            </div>
          )}

          {/* Ratio Explanations */}
          <div className="space-y-3">
            {/* Reply Ratio */}
            <div className="p-3 rounded-lg bg-muted/20 border border-border/20">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-semibold text-foreground">Reply Ratio</span>
                <span className="font-mono font-bold text-foreground">{score.replyRatio}</span>
              </div>
              <div className={`text-xs ${replyLevel.color} flex items-center gap-1`}>
                <span>{replyLevel.emoji}</span>
                <span className="font-semibold">{replyLevel.level}</span>
                <span className="text-muted-foreground">- {replyLevel.meaning}</span>
              </div>
            </div>

            {/* Quote Ratio */}
            <div className="p-3 rounded-lg bg-muted/20 border border-border/20">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-semibold text-foreground">Quote Ratio</span>
                <span className="font-mono font-bold text-foreground">{score.quoteRatio}</span>
              </div>
              <div className={`text-xs ${quoteLevel.color} flex items-center gap-1`}>
                <span>{quoteLevel.emoji}</span>
                <span className="font-semibold">{quoteLevel.level}</span>
                <span className="text-muted-foreground">- {quoteLevel.meaning}</span>
              </div>
            </div>

            {/* Engagement Quality */}
            <div className="p-3 rounded-lg bg-muted/20 border border-border/20">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-semibold text-foreground">Engagement Quality</span>
                <span className="font-mono font-bold text-foreground">{score.engagementQuality}</span>
              </div>
              <div className={`text-xs ${engagementLevel.color} flex items-center gap-1`}>
                <span>{engagementLevel.emoji}</span>
                <span className="font-semibold">{engagementLevel.level}</span>
                <span className="text-muted-foreground">- {engagementLevel.meaning}</span>
              </div>
            </div>
          </div>

          {/* Score Impact Attribution */}
          <div className="p-3 rounded-lg bg-muted/20 border border-border/20">
            <h5 className="text-xs font-semibold text-muted-foreground mb-2">📈 Score Impact</h5>
            <div className="space-y-1.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Reply Ratio:</span>
                <div className={`flex items-center gap-1 ${replyImpact.color}`}>
                  {replyImpact.icon}
                  <span className="font-semibold">{replyImpact.label}</span>
                  <span className="font-mono">({replyImpact.points} pts)</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Quote Ratio:</span>
                <div className={`flex items-center gap-1 ${quoteImpact.color}`}>
                  {quoteImpact.icon}
                  <span className="font-semibold">{quoteImpact.label}</span>
                  <span className="font-mono">({quoteImpact.points} pts)</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Engagement Quality:</span>
                <div className={`flex items-center gap-1 ${engagementImpact.color}`}>
                  {engagementImpact.icon}
                  <span className="font-semibold">{engagementImpact.label}</span>
                  <span className="font-mono">({engagementImpact.points} pts)</span>
                </div>
              </div>
              {score.communityNotePenalty > 0 && (
                <div className="flex items-center justify-between pt-1 border-t border-border/30">
                  <span className="text-destructive">Community Notes Penalty:</span>
                  <span className="font-mono font-bold text-destructive">-{score.communityNotePenalty}%</span>
                </div>
              )}
            </div>
          </div>

          {/* Overall Interpretation */}
          <div className="p-3 rounded-lg bg-accent/10 border border-accent/30">
            <h5 className="text-xs font-semibold text-accent mb-1">💡 What This Means</h5>
            <p className="text-xs text-muted-foreground">
              {getOverallInterpretation()}
            </p>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};

export default TardScoreBreakdown;