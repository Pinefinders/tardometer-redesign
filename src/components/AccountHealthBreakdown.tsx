import { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown, ChevronUp, AlertTriangle, CheckCircle, TrendingUp, Users, Activity, Shield, ExternalLink } from "lucide-react";
import { AccountHealthMetrics } from "@/lib/twitter";
import { Progress } from "@/components/ui/progress";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import HealthGauge from "./HealthGauge";

interface AccountHealthBreakdownProps {
  health: AccountHealthMetrics;
}

const AccountHealthBreakdown = ({ health }: AccountHealthBreakdownProps) => {
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  // Get health zone label
  const getHealthZone = (score: number) => {
    if (score <= 25) return { label: "DYING", emoji: "☠️" };
    if (score <= 50) return { label: "SICKLY", emoji: "🤢" };
    if (score <= 75) return { label: "HEALTHY", emoji: "😊" };
    return { label: "GIGACHAD", emoji: "🗿" };
  };

  const healthZone = getHealthZone(health.healthScore);

  // Engagement rate interpretation
  const getEngagementAssessment = () => {
    if (health.engagementRate >= 5) return { assessment: "Excellent", meaning: `${health.engagementRate.toFixed(1)}% of followers engage with each tweet`, benchmark: "above", color: "text-primary" };
    if (health.engagementRate >= 3) return { assessment: "Good", meaning: `${health.engagementRate.toFixed(1)}% of followers engage with each tweet`, benchmark: "above", color: "text-primary" };
    if (health.engagementRate >= 1) return { assessment: "Fair", meaning: `${health.engagementRate.toFixed(1)}% of followers engage with each tweet`, benchmark: "at", color: "text-accent" };
    return { assessment: "Poor", meaning: `Only ${health.engagementRate.toFixed(1)}% of followers engage with each tweet`, benchmark: "below", color: "text-destructive" };
  };

  // Follower ratio interpretation
  const getRatioAssessment = () => {
    if (health.followerRatio >= 10) return { assessment: "Strong", meaning: `${health.followerRatio.toFixed(1)} people follow for every 1 they follow`, indicates: "organic influence", color: "text-primary" };
    if (health.followerRatio >= 3) return { assessment: "Normal", meaning: `${health.followerRatio.toFixed(1)} people follow for every 1 they follow`, indicates: "normal growth", color: "text-primary" };
    if (health.followerRatio >= 1) return { assessment: "Weak", meaning: `${health.followerRatio.toFixed(1)} people follow for every 1 they follow`, indicates: "reciprocal following", color: "text-accent" };
    return { assessment: "Concerning", meaning: `Following more than followers (${health.followerRatio.toFixed(2)}:1)`, indicates: "follow-for-follow or spam pattern", color: "text-destructive" };
  };

  // Activity pattern interpretation
  const getActivityDescription = () => {
    switch (health.activityLevel) {
      case "Consistent": return "Regular, predictable posting schedule indicating authentic usage";
      case "Sporadic": return "Irregular posting with gaps, common for casual users";
      case "Burst Pattern": return "Sudden spikes in activity, often associated with automated posting or spam campaigns";
    }
  };

  // Overall assessment paragraph
  const getOverallAssessment = () => {
    const score = health.healthScore;
    const hasRedFlags = health.redFlags.length > 0;
    
    if (score >= 75) {
      return "This account shows strong signs of authentic, organic growth. High engagement rates and a healthy follower ratio indicate genuine audience interest. " + 
        (hasRedFlags ? "However, there are some minor concerns worth noting." : "No significant red flags were detected.");
    }
    if (score >= 50) {
      return "This account appears legitimate with reasonable engagement metrics. The numbers suggest a mix of organic and potentially promotional activity. " +
        (hasRedFlags ? "Some patterns warrant attention but aren't necessarily problematic." : "Overall health indicators are acceptable.");
    }
    if (score >= 25) {
      return "This account shows some concerning patterns. Low engagement relative to follower count or unusual following patterns may indicate bot followers, purchased engagement, or spam behavior. " +
        "Consider these metrics when evaluating content credibility.";
    }
    return "This account displays multiple warning signs typical of inauthentic accounts. Very low engagement, suspicious follower/following ratios, and erratic activity patterns suggest potential bot activity, purchased followers, or coordinated inauthentic behavior.";
  };

  const engagementInfo = getEngagementAssessment();
  const ratioInfo = getRatioAssessment();

  const engagementProgress = Math.min((health.engagementRate / 7) * 100, 100);
  const ratioProgress = Math.min((health.followerRatio / 15) * 100, 100);

  return (
    <div className="w-full mt-6 p-4 rounded-xl bg-muted/20 border border-border/30">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <Shield className="w-5 h-5 text-accent" />
        <h3 className="text-base font-semibold text-foreground">Account Health</h3>
        <Link 
          to="/algorithm#account-health" 
          className="text-xs text-muted-foreground hover:text-primary transition-colors ml-auto flex items-center gap-1"
        >
          Learn more <ExternalLink className="w-3 h-3" />
        </Link>
      </div>

      {/* Health Gauge - Prominent at top */}
      <div className="flex justify-center mb-6 pt-2">
        <HealthGauge score={health.healthScore} />
      </div>

      {/* Expand Details Button */}
      <h4 className="text-sm font-semibold text-muted-foreground mb-3 text-center">Account Health Breakdown</h4>
      <Collapsible open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <CollapsibleTrigger className="w-full flex items-center justify-center gap-2 p-2 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors mb-4">
          <span className="text-sm text-muted-foreground">
            {isDetailsOpen ? "Hide Details" : "Show Details"}
          </span>
          {isDetailsOpen ? (
            <ChevronUp className="w-4 h-4 text-muted-foreground" />
          ) : (
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          )}
        </CollapsibleTrigger>
        
        <CollapsibleContent className="space-y-4">
          {/* Detailed Metric Explanations */}
          
          {/* Engagement Rate */}
          <div className="p-3 rounded-lg bg-muted/20 border border-border/20 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-semibold text-foreground">Engagement Rate</span>
              </div>
              <span className={`text-sm font-bold ${engagementInfo.color}`}>
                {health.engagementRate.toFixed(1)}%
              </span>
            </div>
            <Progress value={engagementProgress} className="h-2" />
            <div className="text-xs space-y-1">
              <div className={`${engagementInfo.color} font-semibold`}>
                Assessment: {engagementInfo.assessment}
              </div>
              <div className="text-muted-foreground">
                └─ Meaning: {engagementInfo.meaning}
              </div>
              <div className="text-muted-foreground">
                └─ Benchmark: 1-3% is normal, this is {engagementInfo.benchmark} average
              </div>
            </div>
          </div>

          {/* Follower Ratio */}
          <div className="p-3 rounded-lg bg-muted/20 border border-border/20 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-semibold text-foreground">Follower Ratio</span>
              </div>
              <span className={`text-sm font-bold ${ratioInfo.color}`}>
                {health.followerRatio.toFixed(1)}:1
              </span>
            </div>
            <Progress value={ratioProgress} className="h-2" />
            <div className="text-xs space-y-1">
              <div className={`${ratioInfo.color} font-semibold`}>
                Assessment: {ratioInfo.assessment}
              </div>
              <div className="text-muted-foreground">
                └─ Meaning: {ratioInfo.meaning}
              </div>
              <div className="text-muted-foreground">
                └─ Indicates {ratioInfo.indicates}
              </div>
              <div className="text-muted-foreground mt-1">
                {health.followers.toLocaleString()} followers / {health.following.toLocaleString()} following
              </div>
            </div>
          </div>

          {/* Activity Pattern */}
          <div className="p-3 rounded-lg bg-muted/20 border border-border/20 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-semibold text-foreground">Activity Pattern</span>
              </div>
              <span className={`text-sm font-bold ${
                health.activityLevel === "Consistent" ? "text-primary" :
                health.activityLevel === "Sporadic" ? "text-accent" : "text-destructive"
              }`}>
                {health.activityLevel}
              </span>
            </div>
            <div className="text-xs text-muted-foreground">
              └─ Meaning: {getActivityDescription()}
            </div>
          </div>

          {/* Red Flags Section */}
          {health.redFlags.length > 0 ? (
            <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/30">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-4 h-4 text-destructive" />
                <span className="text-sm font-semibold text-destructive">🚩 Red Flags ({health.redFlags.length})</span>
              </div>
              <ul className="space-y-1.5">
                {health.redFlags.map((flag, index) => (
                  <li key={index} className="flex items-start gap-2 text-xs text-destructive">
                    <span>•</span>
                    <span>{flag}</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="p-3 rounded-lg bg-primary/10 border border-primary/30">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-primary" />
                <span className="text-sm font-semibold text-primary">✓ No red flags detected</span>
              </div>
            </div>
          )}

          {/* Score Components Breakdown */}
          <div className="p-3 rounded-lg bg-muted/20 border border-border/20">
            <h5 className="text-xs font-semibold text-muted-foreground mb-2">📊 Health Score Components</h5>
            <div className="space-y-1.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Engagement Rate:</span>
                <span className="font-mono font-bold text-foreground">{health.engagementPoints} <span className="text-muted-foreground font-normal">/ 40 pts</span></span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Follower Ratio:</span>
                <span className="font-mono font-bold text-foreground">{health.ratioPoints} <span className="text-muted-foreground font-normal">/ 25 pts</span></span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Activity Pattern:</span>
                <span className="font-mono font-bold text-foreground">{health.activityPoints} <span className="text-muted-foreground font-normal">/ 20 pts</span></span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Profile Quality:</span>
                <span className="font-mono font-bold text-foreground">{health.profilePoints} <span className="text-muted-foreground font-normal">/ 15 pts</span></span>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-border/30">
                <span className="text-foreground font-semibold">Total:</span>
                <span className="font-mono font-bold text-foreground">
                  {health.healthScore}/100 <span className="text-accent">({healthZone.label} {healthZone.emoji})</span>
                </span>
              </div>
            </div>
          </div>

          {/* Overall Assessment Paragraph */}
          <div className="p-3 rounded-lg bg-accent/10 border border-accent/30">
            <h5 className="text-xs font-semibold text-accent mb-1">💡 Overall Assessment</h5>
            <p className="text-xs text-muted-foreground">
              {getOverallAssessment()}
            </p>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};

export default AccountHealthBreakdown;