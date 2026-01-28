import { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown, ChevronUp, Info, AlertTriangle, CheckCircle, Star, TrendingUp, Users, Activity, Shield, ExternalLink } from "lucide-react";
import { AccountHealthMetrics } from "@/lib/twitter";
import { Progress } from "@/components/ui/progress";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import HealthGauge from "./HealthGauge";

interface AccountHealthProps {
  health: AccountHealthMetrics;
}

const AccountHealth = ({ health }: AccountHealthProps) => {
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const [isRedFlagsOpen, setIsRedFlagsOpen] = useState(health.redFlags.length > 0);

  const getEngagementIcon = () => {
    if (health.engagementRate >= 5) return <Star className="w-4 h-4 text-primary" />;
    if (health.engagementRate >= 3) return <CheckCircle className="w-4 h-4 text-primary" />;
    if (health.engagementRate >= 1) return <CheckCircle className="w-4 h-4 text-accent" />;
    return <AlertTriangle className="w-4 h-4 text-destructive" />;
  };

  const getEngagementColor = () => {
    if (health.engagementRate >= 5) return "text-primary";
    if (health.engagementRate >= 3) return "text-primary";
    if (health.engagementRate >= 1) return "text-accent";
    return "text-destructive";
  };

  const getRatioIcon = () => {
    if (health.followerRatio >= 10) return <CheckCircle className="w-4 h-4 text-primary" />;
    if (health.followerRatio >= 3) return <CheckCircle className="w-4 h-4 text-primary" />;
    if (health.followerRatio >= 1) return <AlertTriangle className="w-4 h-4 text-accent" />;
    return <AlertTriangle className="w-4 h-4 text-destructive" />;
  };

  const getRatioColor = () => {
    if (health.followerRatio >= 10) return "text-primary";
    if (health.followerRatio >= 3) return "text-primary";
    if (health.followerRatio >= 1) return "text-accent";
    return "text-destructive";
  };

  const getActivityIcon = () => {
    if (health.activityLevel === "Consistent") return <CheckCircle className="w-4 h-4 text-primary" />;
    if (health.activityLevel === "Sporadic") return <AlertTriangle className="w-4 h-4 text-accent" />;
    return <AlertTriangle className="w-4 h-4 text-destructive" />;
  };

  const getActivityColor = () => {
    if (health.activityLevel === "Consistent") return "text-primary";
    if (health.activityLevel === "Sporadic") return "text-accent";
    return "text-destructive";
  };

  const getOverallColor = () => {
    switch (health.overallHealth) {
      case "Excellent": return "text-primary";
      case "Good": return "text-primary";
      case "Fair": return "text-accent";
      case "Poor": return "text-destructive";
      case "Suspicious": return "text-destructive";
      default: return "text-muted-foreground";
    }
  };

  const getOverallBg = () => {
    switch (health.overallHealth) {
      case "Excellent": return "bg-primary/20 border-primary/50";
      case "Good": return "bg-primary/15 border-primary/40";
      case "Fair": return "bg-accent/20 border-accent/50";
      case "Poor": return "bg-destructive/20 border-destructive/50";
      case "Suspicious": return "bg-destructive/30 border-destructive/60";
      default: return "bg-muted/30 border-border/30";
    }
  };

  const engagementProgress = Math.min((health.engagementRate / 7) * 100, 100);
  const ratioProgress = Math.min((health.followerRatio / 15) * 100, 100);

  return (
    <div className="w-full mt-6 p-4 rounded-xl bg-muted/20 border border-border/30">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <Shield className="w-5 h-5 text-accent" />
        <h3 className="text-base font-semibold text-foreground">Account Health</h3>
        <Link 
          to="/account-health" 
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
        
        <CollapsibleContent>
          {/* Metrics Grid */}
          <div className="space-y-4">
            {/* Engagement Rate */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Engagement Rate</span>
                </div>
                <div className="flex items-center gap-2">
                  {getEngagementIcon()}
                  <span className={`text-sm font-bold ${getEngagementColor()}`}>
                    {health.engagementRate.toFixed(1)}%
                  </span>
                </div>
              </div>
              <Progress value={engagementProgress} className="h-2" />
              <p className="text-xs text-muted-foreground">{health.engagementLabel}</p>
            </div>

            {/* Follower Ratio */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Follower Ratio</span>
                </div>
                <div className="flex items-center gap-2">
                  {getRatioIcon()}
                  <span className={`text-sm font-bold ${getRatioColor()}`}>
                    {health.followerRatio.toFixed(1)}:1
                  </span>
                </div>
              </div>
              <Progress value={ratioProgress} className="h-2" />
              <p className="text-xs text-muted-foreground">
                {health.followers.toLocaleString()} followers / {health.following.toLocaleString()} following • {health.ratioLabel}
              </p>
            </div>

            {/* Activity Level */}
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Activity Level</span>
              </div>
              <div className="flex items-center gap-2">
                {getActivityIcon()}
                <span className={`text-sm font-bold ${getActivityColor()}`}>
                  {health.activityLevel}
                </span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground -mt-2 ml-6">{health.activityLabel}</p>
          </div>

          {/* Red Flags Section */}
          {health.redFlags.length > 0 ? (
            <Collapsible open={isRedFlagsOpen} onOpenChange={setIsRedFlagsOpen} className="mt-4">
              <CollapsibleTrigger className="w-full flex items-center justify-between p-3 rounded-lg bg-destructive/20 border border-destructive/50 hover:bg-destructive/30 transition-colors">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-destructive" />
                  <span className="text-sm font-semibold text-destructive">
                    🚩 Red Flags ({health.redFlags.length})
                  </span>
                </div>
                {isRedFlagsOpen ? (
                  <ChevronUp className="w-4 h-4 text-destructive" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-destructive" />
                )}
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-2 p-3 rounded-lg bg-destructive/10 border border-destructive/30">
                <ul className="space-y-2">
                  {health.redFlags.map((flag, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-destructive">
                      <span>🚩</span>
                      <span>{flag}</span>
                    </li>
                  ))}
                </ul>
              </CollapsibleContent>
            </Collapsible>
          ) : (
            <div className="mt-4 p-3 rounded-lg bg-primary/20 border border-primary/50">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-primary" />
                <span className="text-sm font-semibold text-primary">
                  ✅ No major red flags detected
                </span>
              </div>
            </div>
          )}

          {/* Info Panel */}
          <Collapsible open={isInfoOpen} onOpenChange={setIsInfoOpen} className="mt-4">
            <CollapsibleTrigger className="w-full flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
              <div className="flex items-center gap-2">
                <Info className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">ℹ️ What is Account Health?</span>
              </div>
              {isInfoOpen ? (
                <ChevronUp className="w-4 h-4 text-muted-foreground" />
              ) : (
                <ChevronDown className="w-4 h-4 text-muted-foreground" />
              )}
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-2 p-4 rounded-lg bg-muted/20 border border-border/30">
              <p className="text-sm text-muted-foreground mb-3">
                Account health measures <strong>audience authenticity and engagement quality</strong>, not content quality.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <p className="font-semibold text-primary mb-2">✓ Healthy accounts have:</p>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>• Organic follower growth</li>
                    <li>• High engagement rates</li>
                    <li>• Consistent, authentic activity</li>
                    <li>• Genuine conversations</li>
                  </ul>
                </div>
                <div>
                  <p className="font-semibold text-destructive mb-2">✗ Unhealthy accounts show:</p>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>• Sudden follower spikes (bought)</li>
                    <li>• High views, low engagement</li>
                    <li>• Spam patterns</li>
                    <li>• Generic, repetitive content</li>
                  </ul>
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};

export default AccountHealth;
