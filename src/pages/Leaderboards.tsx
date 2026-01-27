import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Trophy, Clock, ChevronDown, ChevronUp, User, MessageSquare, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  getTardTweetOfWeek, 
  getTardPersonOfWeek, 
  getTimeUntilReset, 
  formatWeekRange,
  getCurrentWeekStart,
  getPastWeekWinners,
  generateMockArchive,
  WeeklyWinners,
  TweetEntry,
  UserEntry
} from "@/lib/leaderboard";

const MiniGauge = ({ score }: { score: number }) => {
  const getColor = (s: number) => {
    if (s <= 24) return "text-destructive";
    if (s <= 75) return "text-accent";
    return "text-primary";
  };

  const getLabel = (s: number) => {
    if (s <= 24) return "TARD";
    if (s <= 75) return "MID";
    return "BASED";
  };

  return (
    <div className="flex items-center gap-2">
      <div className={`text-3xl font-display font-bold ${getColor(score)}`}>
        {score}
      </div>
      <div className={`text-sm font-bold ${getColor(score)}`}>
        {getLabel(score)}
      </div>
    </div>
  );
};

const TweetCard = ({ entry, isCurrent }: { entry: TweetEntry; isCurrent?: boolean }) => (
  <a 
    href={entry.tweetUrl} 
    target="_blank" 
    rel="noopener noreferrer"
    className="block p-4 rounded-xl bg-secondary/50 border border-border/50 hover:border-primary/50 transition-colors"
  >
    <div className="flex items-start justify-between gap-4">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-2">
          {isCurrent && <Trophy className="w-5 h-5 text-amber-400" />}
          <span className="text-muted-foreground">@{entry.authorUsername}</span>
        </div>
        <p className="text-xs text-muted-foreground truncate">
          {entry.tweetUrl}
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          Submitted {new Date(entry.submittedAt).toLocaleDateString()}
        </p>
      </div>
      <MiniGauge score={entry.score.score} />
    </div>
  </a>
);

const UserCard = ({ entry, isCurrent }: { entry: UserEntry; isCurrent?: boolean }) => (
  <a 
    href={entry.profileUrl} 
    target="_blank" 
    rel="noopener noreferrer"
    className="block p-4 rounded-xl bg-secondary/50 border border-border/50 hover:border-primary/50 transition-colors"
  >
    <div className="flex items-start justify-between gap-4">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-2">
          {isCurrent && <Trophy className="w-5 h-5 text-amber-400" />}
          <User className="w-4 h-4 text-primary" />
          <span className="font-semibold text-foreground">@{entry.username}</span>
        </div>
        <p className="text-xs text-muted-foreground">
          Based on {entry.tweetCount} tweets analyzed
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          Submitted {new Date(entry.submittedAt).toLocaleDateString()}
        </p>
      </div>
      <MiniGauge score={entry.averageScore.score} />
    </div>
  </a>
);

const Leaderboards = () => {
  const [tardTweet, setTardTweet] = useState<TweetEntry | null>(null);
  const [tardPerson, setTardPerson] = useState<UserEntry | null>(null);
  const [timeUntilReset, setTimeUntilReset] = useState(getTimeUntilReset());
  const [pastWinners, setPastWinners] = useState<WeeklyWinners[]>([]);
  const [showArchive, setShowArchive] = useState(false);

  useEffect(() => {
    // Generate mock archive data for demo
    generateMockArchive();
    
    // Load current week's winners
    setTardTweet(getTardTweetOfWeek());
    setTardPerson(getTardPersonOfWeek());
    setPastWinners(getPastWeekWinners());

    // Update countdown every minute
    const interval = setInterval(() => {
      setTimeUntilReset(getTimeUntilReset());
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  const currentWeekRange = formatWeekRange(getCurrentWeekStart().toISOString());

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="pt-8 pb-6 px-4">
        <div className="max-w-2xl mx-auto">
          <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-4">
            <ArrowLeft className="w-4 h-4" />
            Back to Tardometer
          </Link>
          
          <div className="text-center">
            <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 rounded-full bg-amber-500/20 border border-amber-500/50">
              <span className="text-amber-400 font-bold text-xs uppercase tracking-wider">⚠️ Demo Mode</span>
              <span className="text-amber-400/80 text-xs">Using simulated data</span>
            </div>
            
            <h1 className="font-display text-4xl sm:text-5xl font-bold text-gradient-title tracking-tight">
              🏆 LEADERBOARDS
            </h1>
            <p className="mt-2 text-muted-foreground">
              Weekly Tard Champions
            </p>
          </div>
        </div>
      </header>

      {/* Countdown */}
      <div className="px-4 mb-8">
        <div className="max-w-2xl mx-auto">
          <div className="glass-card p-4 text-center">
            <div className="flex items-center justify-center gap-2 text-muted-foreground mb-2">
              <Clock className="w-4 h-4" />
              <span className="text-sm">Week of {currentWeekRange}</span>
            </div>
            <div className="text-lg font-semibold text-foreground">
              Resets in{" "}
              <span className="text-primary">{timeUntilReset.days}d</span>{" "}
              <span className="text-primary">{timeUntilReset.hours}h</span>{" "}
              <span className="text-primary">{timeUntilReset.minutes}m</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 px-4 pb-16">
        <div className="max-w-2xl mx-auto space-y-8">
          
          {/* Tard Tweet of the Week */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <MessageSquare className="w-5 h-5 text-destructive" />
              <h2 className="text-xl font-display font-bold text-foreground">
                Tard Tweet of the Week
              </h2>
            </div>
            
            <div className="glass-card p-6">
              {tardTweet ? (
                <TweetCard entry={tardTweet} isCurrent />
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <p className="text-lg mb-2">No tweets analyzed this week yet!</p>
                  <p className="text-sm">Be the first to submit a tweet and claim the throne.</p>
                  <Link to="/">
                    <Button variant="calculate" className="mt-4">
                      Analyze a Tweet
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </section>

          {/* Tard Person of the Week */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <User className="w-5 h-5 text-destructive" />
              <h2 className="text-xl font-display font-bold text-foreground">
                Tard Person of the Week
              </h2>
            </div>
            
            <div className="glass-card p-6">
              {tardPerson ? (
                <UserCard entry={tardPerson} isCurrent />
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <p className="text-lg mb-2">No profiles analyzed this week yet!</p>
                  <p className="text-sm">Analyze a Twitter profile to see who's the most Tard.</p>
                  <Link to="/">
                    <Button variant="calculate" className="mt-4">
                      Analyze a Profile
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </section>

          {/* Previous Winners Archive */}
          <section>
            <button
              onClick={() => setShowArchive(!showArchive)}
              className="flex items-center gap-2 w-full text-left mb-4 group"
            >
              <Trophy className="w-5 h-5 text-accent" />
              <h2 className="text-xl font-display font-bold text-foreground flex-1">
                Previous Winners
              </h2>
              {showArchive ? (
                <ChevronUp className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
              ) : (
                <ChevronDown className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
              )}
            </button>

            {showArchive && (
              <div className="space-y-6 animate-fade-up">
                {pastWinners.length > 0 ? (
                  pastWinners.map((week) => (
                    <div key={week.weekStart} className="glass-card p-6">
                      <h3 className="text-sm font-semibold text-muted-foreground mb-4">
                        Week of {formatWeekRange(week.weekStart)}
                      </h3>
                      
                      <div className="space-y-4">
                        {week.tardTweet && (
                          <div>
                            <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
                              <MessageSquare className="w-3 h-3" /> Tard Tweet
                            </p>
                            <TweetCard entry={week.tardTweet} />
                          </div>
                        )}
                        
                        {week.tardPerson && (
                          <div>
                            <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
                              <User className="w-3 h-3" /> Tard Person
                            </p>
                            <UserCard entry={week.tardPerson} />
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="glass-card p-6 text-center text-muted-foreground">
                    <p>No previous winners yet. Check back next week!</p>
                  </div>
                )}
              </div>
            )}
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 px-4 text-center">
        <div className="inline-block px-4 py-2 rounded-lg bg-amber-500/10 border border-amber-500/30">
          <p className="text-sm text-amber-400 font-medium">
            🚧 Currently using mock data for demonstration. Real Twitter API integration coming soon.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Leaderboards;
