import { useState } from "react";
import { CuratorSignalsResult, CuratorSignal, CURATORS } from "@/lib/curators";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, ChevronUp, ExternalLink, Info, CheckCircle, AlertTriangle, Target, ShieldAlert } from "lucide-react";
import { cn } from "@/lib/utils";

interface CuratorSignalsProps {
  signals: CuratorSignalsResult;
  username: string;
}

// Single curator's mentions display
const CuratorMentionCard = ({ signal }: { signal: CuratorSignal }) => {
  const { curator, status } = signal;
  
  if (!status) return null;
  
  const isNegative = status.sentiment === 'negative';
  
  return (
    <div className={cn(
      "p-3 rounded-lg border",
      isNegative ? "bg-orange-500/5 border-orange-500/30" : "bg-green-500/5 border-green-500/30"
    )}>
      <div className="flex items-center justify-between mb-2">
        <span className={cn(
          "font-semibold text-sm",
          isNegative ? "text-orange-400" : "text-green-400"
        )}>
          {curator.name}
        </span>
        {isNegative && (
          <span className="text-xs text-orange-300">
            {status.count} callout{status.count !== 1 ? 's' : ''}
          </span>
        )}
      </div>
      
      {status.examples && status.examples.length > 0 && (
        <div className="space-y-1.5">
          {status.examples.slice(0, 2).map((example, index) => (
            <div 
              key={index} 
              className="flex items-center justify-between text-sm"
            >
              <div className="flex-1 min-w-0">
                <span className="text-foreground/90 truncate">"{example.text}"</span>
                <span className="text-xs text-muted-foreground ml-1">({example.date})</span>
              </div>
              <a 
                href={example.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-xs text-primary hover:underline ml-2 shrink-0"
              >
                View
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const CuratorSignals = ({ signals, username }: CuratorSignalsProps) => {
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  
  const { totalNegative, totalPositive, hasAnyMention } = signals;
  const negativeMentions = signals.signals.filter(s => s.status?.sentiment === 'negative');
  const positiveMentions = signals.signals.filter(s => s.status?.sentiment === 'positive');

  // Determine severity and styling
  const isMultipleNegative = totalNegative >= 2;
  const hasSingleNegative = totalNegative === 1;
  const hasPositive = totalPositive > 0;

  const getBorderClass = () => {
    if (isMultipleNegative) return "border-red-500/50";
    if (hasSingleNegative) return "border-orange-500/50";
    if (hasPositive) return "border-green-500/50";
    return "border-muted-foreground/30";
  };

  const getBackgroundClass = () => {
    if (isMultipleNegative) return "bg-red-500/10";
    if (hasSingleNegative) return "bg-orange-500/10";
    if (hasPositive) return "bg-green-500/10";
    return "bg-muted/30";
  };

  // Get curator names for "not mentioned" text
  const curatorNames = CURATORS.map(c => c.name).join(' or ');

  return (
    <Card className={cn("w-full border-2", getBorderClass(), getBackgroundClass())}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg font-display">
          <Target className="w-5 h-5 text-primary" />
          Community Curator Signals
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Not mentioned by any curator */}
        {!hasAnyMention && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-muted-foreground">
              <CheckCircle className="w-5 h-5" />
              <span className="font-semibold">Not flagged by community curators</span>
            </div>
            <p className="text-sm text-muted-foreground pl-7">
              This user is not on the radar of {curatorNames}
            </p>
          </div>
        )}

        {/* Called out by MULTIPLE curators */}
        {isMultipleNegative && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-red-400">
              <ShieldAlert className="w-5 h-5" />
              <span className="font-semibold">Called Out by Multiple Curators</span>
            </div>
            <p className="text-sm text-muted-foreground pl-7">
              This user has been documented by {totalNegative} trusted community sources:
            </p>
            
            {/* Each curator's mentions */}
            <div className="pl-7 space-y-3">
              {negativeMentions.map((signal, index) => (
                <CuratorMentionCard key={index} signal={signal} />
              ))}
            </div>

            {/* Strong warning for multiple */}
            <div className="mt-3 p-3 rounded-lg bg-red-500/20 border border-red-500/30">
              <p className="text-sm text-red-300">
                🚨 MULTIPLE INDEPENDENT SOURCES have flagged this account - strong signal of consistent poor behavior.
              </p>
            </div>
          </div>
        )}

        {/* Called out by SINGLE curator */}
        {hasSingleNegative && !isMultipleNegative && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-orange-400">
              <AlertTriangle className="w-5 h-5" />
              <span className="font-semibold">
                Called Out by {negativeMentions[0]?.curator.name}
              </span>
            </div>
            <p className="text-sm text-muted-foreground pl-7">
              {negativeMentions[0]?.curator.name} has documented this user's behavior:
            </p>
            
            <div className="pl-7">
              <CuratorMentionCard signal={negativeMentions[0]} />
            </div>

            {/* Warning */}
            <div className="mt-3 p-3 rounded-lg bg-orange-500/20 border border-orange-500/30">
              <p className="text-sm text-orange-300">
                ⚠️ Flagged by one community source - documented incident.
              </p>
            </div>
          </div>
        )}

        {/* Positive endorsement(s) */}
        {hasPositive && !hasSingleNegative && !isMultipleNegative && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-green-400">
              <CheckCircle className="w-5 h-5" />
              <span className="font-semibold">
                Endorsed by {positiveMentions.map(s => s.curator.name).join(' & ')}
              </span>
            </div>
            <p className="text-sm text-muted-foreground pl-7">
              Rare seal of approval from trusted curator{totalPositive > 1 ? 's' : ''}:
            </p>
            
            <div className="pl-7 space-y-3">
              {positiveMentions.map((signal, index) => (
                <CuratorMentionCard key={index} signal={signal} />
              ))}
            </div>

            {/* Positive badge */}
            <div className="mt-3 p-3 rounded-lg bg-green-500/20 border border-green-500/30">
              <p className="text-sm text-green-300">
                🌟 This is significant - trusted curators rarely endorse anyone.
              </p>
            </div>
          </div>
        )}

        {/* Mixed: Has positive but also negative */}
        {hasPositive && (hasSingleNegative || isMultipleNegative) && (
          <div className="mt-3 p-2 rounded-lg bg-muted/50 border border-border">
            <p className="text-xs text-muted-foreground">
              Note: Also endorsed by {positiveMentions.map(s => s.curator.name).join(', ')} - mixed signals detected.
            </p>
          </div>
        )}

        {/* Info Section */}
        <Collapsible open={isInfoOpen} onOpenChange={setIsInfoOpen}>
          <CollapsibleTrigger className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mt-4 pt-3 border-t border-border/50 w-full">
            <Info className="w-4 h-4" />
            <span>About Community Curators</span>
            {isInfoOpen ? (
              <ChevronUp className="w-4 h-4 ml-auto" />
            ) : (
              <ChevronDown className="w-4 h-4 ml-auto" />
            )}
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-3">
            <div className="p-3 rounded-lg bg-muted/50 text-sm space-y-3">
              <p className="text-muted-foreground">
                We track mentions from established Twitter accounts dedicated to documenting problematic behavior:
              </p>
              <ul className="space-y-1 pl-2">
                {CURATORS.map((curator, index) => (
                  <li key={index} className="text-muted-foreground">
                    <span className="text-primary font-medium">{curator.name}</span>
                    <span> - {curator.description}</span>
                  </li>
                ))}
              </ul>
              <p className="text-muted-foreground">
                When multiple independent curators flag the same account, it's a very strong signal of consistent poor behavior.
              </p>
              <div className="space-y-1 pt-2 border-t border-border/50">
                <p className="text-muted-foreground font-medium">Signal strength:</p>
                <ul className="list-disc list-inside text-muted-foreground pl-2 space-y-1">
                  <li><span className="text-red-400">Multiple callouts</span> = Pattern of behavior (high confidence)</li>
                  <li><span className="text-orange-400">Single callout</span> = Documented incident (medium confidence)</li>
                  <li><span className="text-green-400">Rare endorsements</span> = Exceptional quality (very high confidence)</li>
                  <li><span className="text-muted-foreground">Not mentioned</span> = Not on their radar</li>
                </ul>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Mock data disclaimer */}
        <p className="text-xs text-muted-foreground/70 italic pt-2 border-t border-border/30">
          Currently using simulated data. Real curator integration coming soon with actual mention tracking.
        </p>
      </CardContent>
    </Card>
  );
};

export default CuratorSignals;
