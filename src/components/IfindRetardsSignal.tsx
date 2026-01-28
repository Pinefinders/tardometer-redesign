import { useState } from "react";
import { IfindRetardsStatus } from "@/lib/ifindretards";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, ChevronUp, ExternalLink, Info, CheckCircle, AlertTriangle, Target } from "lucide-react";
import { cn } from "@/lib/utils";

interface IfindRetardsSignalProps {
  status: IfindRetardsStatus;
  username: string;
}

const IfindRetardsSignal = ({ status, username }: IfindRetardsSignalProps) => {
  const [isInfoOpen, setIsInfoOpen] = useState(false);

  // Determine border color based on status
  const getBorderClass = () => {
    if (!status.mentioned) return "border-muted-foreground/30";
    if (status.sentiment === 'positive') return "border-green-500/50";
    return "border-orange-500/50";
  };

  const getBackgroundClass = () => {
    if (!status.mentioned) return "bg-muted/30";
    if (status.sentiment === 'positive') return "bg-green-500/10";
    return "bg-orange-500/10";
  };

  return (
    <Card className={cn("w-full border-2", getBorderClass(), getBackgroundClass())}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg font-display">
          <Target className="w-5 h-5 text-primary" />
          @IfindRetards Community Signal
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Status Display */}
        {!status.mentioned && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-muted-foreground">
              <CheckCircle className="w-5 h-5" />
              <span className="font-semibold">Not on @IfindRetards' radar</span>
            </div>
            <p className="text-sm text-muted-foreground pl-7">
              This user has not been documented by @IfindRetards
            </p>
          </div>
        )}

        {status.mentioned && status.sentiment === 'negative' && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-orange-400">
              <AlertTriangle className="w-5 h-5" />
              <span className="font-semibold">Called Out by @IfindRetards</span>
            </div>
            <p className="text-sm text-muted-foreground pl-7">
              @IfindRetards has documented this user's Tard behavior:
            </p>
            
            {/* Mention Stats */}
            <div className="pl-7 space-y-2">
              <p className="text-sm font-medium text-orange-300">
                {status.count} callout tweet{status.count !== 1 ? 's' : ''} found
              </p>
              
              {/* Examples */}
              {status.examples && status.examples.length > 0 && (
                <div className="space-y-2 mt-3">
                  {status.examples.map((example, index) => (
                    <div 
                      key={index} 
                      className="flex items-center justify-between p-2 rounded-lg bg-background/50 border border-orange-500/20"
                    >
                      <div className="flex-1">
                        <span className="text-sm font-medium">"{example.text}"</span>
                        <span className="text-xs text-muted-foreground ml-2">({example.date})</span>
                      </div>
                      <a 
                        href={example.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-xs text-primary hover:underline ml-2"
                      >
                        View Tweet
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Warning */}
            <div className="mt-3 p-3 rounded-lg bg-orange-500/20 border border-orange-500/30">
              <p className="text-sm text-orange-300">
                ⚠️ This user has a documented history of Tard moments according to a trusted community source.
              </p>
            </div>
          </div>
        )}

        {status.mentioned && status.sentiment === 'positive' && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-green-400">
              <CheckCircle className="w-5 h-5" />
              <span className="font-semibold">Endorsed by @IfindRetards</span>
            </div>
            <p className="text-sm text-muted-foreground pl-7">
              @IfindRetards rare seal of approval:
            </p>
            
            {/* Examples */}
            {status.examples && status.examples.length > 0 && (
              <div className="pl-7 space-y-2">
                {status.examples.map((example, index) => (
                  <div 
                    key={index} 
                    className="flex items-center justify-between p-2 rounded-lg bg-background/50 border border-green-500/20"
                  >
                    <div className="flex-1">
                      <span className="text-sm font-medium">"{example.text}"</span>
                      <span className="text-xs text-muted-foreground ml-2">({example.date})</span>
                    </div>
                    <a 
                      href={example.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-xs text-primary hover:underline ml-2"
                    >
                      View Tweet
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                ))}
              </div>
            )}

            {/* Positive badge */}
            <div className="mt-3 p-3 rounded-lg bg-green-500/20 border border-green-500/30">
              <p className="text-sm text-green-300">
                🌟 This is significant - @IfindRetards rarely endorses anyone.
              </p>
            </div>
          </div>
        )}

        {/* Info Section */}
        <Collapsible open={isInfoOpen} onOpenChange={setIsInfoOpen}>
          <CollapsibleTrigger className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mt-4 pt-3 border-t border-border/50 w-full">
            <Info className="w-4 h-4" />
            <span>What is this?</span>
            {isInfoOpen ? (
              <ChevronUp className="w-4 h-4 ml-auto" />
            ) : (
              <ChevronDown className="w-4 h-4 ml-auto" />
            )}
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-3">
            <div className="p-3 rounded-lg bg-muted/50 text-sm space-y-3">
              <p className="font-medium">About @IfindRetards</p>
              <p className="text-muted-foreground">
                @IfindRetards is a well-established Twitter account dedicated to documenting and calling out Tard behavior across the platform.
              </p>
              <div className="space-y-1">
                <p className="text-muted-foreground">Their mentions serve as a community signal:</p>
                <ul className="list-disc list-inside text-muted-foreground pl-2 space-y-1">
                  <li><span className="text-orange-400">Negative mentions</span> = Documented pattern of poor takes</li>
                  <li><span className="text-green-400">Positive endorsements</span> = Rare seal of approval</li>
                  <li><span className="text-muted-foreground">Not mentioned</span> = Not on their radar</li>
                </ul>
              </div>
              <p className="text-muted-foreground">
                We aggregate their public callouts as an additional data point for account assessment.
              </p>
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Mock data disclaimer */}
        <p className="text-xs text-muted-foreground/70 italic pt-2 border-t border-border/30">
          Currently using simulated data. Real @IfindRetards integration coming soon with actual mention tracking.
        </p>
      </CardContent>
    </Card>
  );
};

export default IfindRetardsSignal;
