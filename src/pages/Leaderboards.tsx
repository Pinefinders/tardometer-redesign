import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Trophy, Clock, ChevronDown, ChevronUp, User, MessageSquare, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import wojakCrying from "@/assets/wojak-crying.webp";
import wojakBrainlet from "@/assets/wojak-brainlet.webp";
import gigachad from "@/assets/gigachad.jpg";
import gigachadLaptop from "@/assets/gigachad-laptop.jpg";
import { 
  getTardTweetOfWeek, 
  getChadTweetOfWeek,
  getTardPersonOfWeek, 
  getChadPersonOfWeek,
  getTimeUntilReset, 
  formatWeekRange,
  getCurrentWeekStart,
  getPastWeekWinners,
  generateMockArchive,
  WeeklyWinners,
  TweetEntry,
  UserEntry
} from "@/lib/leaderboard";

type WinnerType = 'tard' | 'chad';

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

const TweetCard = ({ entry, isCurrent, type }: { entry: TweetEntry; isCurrent?: boolean; type: WinnerType }) => (
  <div className="p-4 rounded-xl bg-secondary/50 border border-border/50">
    <div className="flex items-start justify-between gap-4">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-2">
          {isCurrent && (
            <>
              <Trophy className="w-5 h-5 text-amber-400" />
              <img 
                src={type === 'tard' ? wojakCrying : gigachad} 
                alt={type === 'tard' ? 'Wojak' : 'Gigachad'} 
                className="w-6 h-6 rounded-full object-cover"
              />
            </>
          )}
          <span className="text-muted-foreground">@{entry.authorUsername}</span>
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          Submitted {new Date(entry.submittedAt).toLocaleDateString()}
        </p>
        <a 
          href={entry.tweetUrl} 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 mt-2 text-sm text-primary hover:underline font-medium"
        >
          Go to Tweet →
        </a>
      </div>
      <MiniGauge score={entry.score.score} />
    </div>
  </div>
);

const UserCard = ({ entry, isCurrent, type }: { entry: UserEntry; isCurrent?: boolean; type: WinnerType }) => (
  <div className="p-4 rounded-xl bg-secondary/50 border border-border/50">
    <div className="flex items-start justify-between gap-4">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-2">
          {isCurrent && (
            <>
              <Trophy className="w-5 h-5 text-amber-400" />
              <img 
                src={type === 'tard' ? wojakCrying : gigachad} 
                alt={type === 'tard' ? 'Wojak' : 'Gigachad'} 
                className="w-6 h-6 rounded-full object-cover"
              />
            </>
          )}
          <User className="w-4 h-4 text-primary" />
          <span className="font-semibold text-foreground">@{entry.username}</span>
        </div>
        <p className="text-xs text-muted-foreground">
          Based on {entry.tweetCount} tweets analyzed
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          Submitted {new Date(entry.submittedAt).toLocaleDateString()}
        </p>
        <a 
          href={entry.profileUrl} 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 mt-2 text-sm text-primary hover:underline font-medium"
        >
          Visit profile →
        </a>
      </div>
      <MiniGauge score={entry.averageScore.score} />
    </div>
  </div>
);

const EmptyState = ({ message, ctaText }: { message: string; ctaText: string }) => (
  <div className="text-center py-8 text-muted-foreground">
    <p className="text-lg mb-2">{message}</p>
    <p className="text-sm">Be the first to submit this week's winner!</p>
    <Link to="/">
      <Button variant="calculate" className="mt-4">
        {ctaText}
      </Button>
    </Link>
  </div>
);

const LeaderboardSection = ({ 
  title, 
  emoji, 
  entry, 
  type,
  emptyMessage,
  ctaText,
  isTweet 
}: { 
  title: string; 
  emoji: string;
  entry: TweetEntry | UserEntry | null; 
  type: WinnerType;
  emptyMessage: string;
  ctaText: string;
  isTweet: boolean;
}) => (
  <section>
    <div className="flex items-center gap-2 mb-4">
      <span className="text-xl">{emoji}</span>
      <h2 className="text-xl font-display font-bold text-foreground">
        {title}
      </h2>
    </div>
    
    <div className={`glass-card p-6 ${type === 'chad' ? 'border-primary/30' : 'border-destructive/30'}`}>
      {entry ? (
        isTweet ? (
          <TweetCard entry={entry as TweetEntry} isCurrent type={type} />
        ) : (
          <UserCard entry={entry as UserEntry} isCurrent type={type} />
        )
      ) : (
        <EmptyState message={emptyMessage} ctaText={ctaText} />
      )}
    </div>
  </section>
);

const Leaderboards = () => {
  const [tardTweet, setTardTweet] = useState<TweetEntry | null>(null);
  const [chadTweet, setChadTweet] = useState<TweetEntry | null>(null);
  const [tardPerson, setTardPerson] = useState<UserEntry | null>(null);
  const [chadPerson, setChadPerson] = useState<UserEntry | null>(null);
  const [timeUntilReset, setTimeUntilReset] = useState(getTimeUntilReset());
  const [pastWinners, setPastWinners] = useState<WeeklyWinners[]>([]);
  const [showArchive, setShowArchive] = useState(false);

  useEffect(() => {
    // Generate mock archive data for demo
    generateMockArchive();
    
    // Load current week's winners
    setTardTweet(getTardTweetOfWeek());
    setChadTweet(getChadTweetOfWeek());
    setTardPerson(getTardPersonOfWeek());
    setChadPerson(getChadPersonOfWeek());
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
              Weekly Tard & Chad Champions
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
          
          {/* Person Section - TOP */}
          <div className="space-y-4">
            {/* Person Headers - Desktop only */}
            <div className="hidden md:grid md:grid-cols-2 gap-6">
              <div className="flex flex-col items-center">
                <img 
                  src={wojakCrying} 
                  alt="Wojak Crying" 
                  className="w-32 h-32 rounded-full object-cover border-2 border-destructive/50 mb-2"
                />
                <h2 className="text-lg font-display font-bold text-destructive">TARD OF THE WEEK</h2>
              </div>
              <div className="flex flex-col items-center">
                <img 
                  src={gigachad} 
                  alt="Gigachad" 
                  className="w-32 h-32 rounded-full object-cover border-2 border-primary/50 mb-2"
                />
                <h2 className="text-lg font-display font-bold text-primary">CHAD OF THE WEEK</h2>
              </div>
            </div>

            {/* Desktop: Person boxes side by side */}
            <div className="hidden md:grid md:grid-cols-2 gap-6">
              <LeaderboardSection
                title=""
                emoji=""
                entry={tardPerson}
                type="tard"
                emptyMessage="No profiles analyzed yet!"
                ctaText="Analyze a Profile"
                isTweet={false}
              />
              
              <LeaderboardSection
                title=""
                emoji=""
                entry={chadPerson}
                type="chad"
                emptyMessage="No profiles analyzed yet!"
                ctaText="Analyze a Profile"
                isTweet={false}
              />
            </div>

            {/* Mobile: Tard Person first, then Chad Person */}
            <div className="md:hidden space-y-6">
              {/* Tard Person */}
              <div className="flex flex-col items-center">
                <img 
                  src={wojakCrying} 
                  alt="Wojak Crying" 
                  className="w-24 h-24 rounded-full object-cover border-2 border-destructive/50 mb-2"
                />
                <h2 className="text-lg font-display font-bold text-destructive mb-4">TARD OF THE WEEK</h2>
                <div className="w-full">
                  <LeaderboardSection
                    title=""
                    emoji=""
                    entry={tardPerson}
                    type="tard"
                    emptyMessage="No profiles analyzed yet!"
                    ctaText="Analyze a Profile"
                    isTweet={false}
                  />
                </div>
              </div>
              
              {/* Chad Person */}
              <div className="flex flex-col items-center">
                <img 
                  src={gigachad} 
                  alt="Gigachad" 
                  className="w-24 h-24 rounded-full object-cover border-2 border-primary/50 mb-2"
                />
                <h2 className="text-lg font-display font-bold text-primary mb-4">CHAD OF THE WEEK</h2>
                <div className="w-full">
                  <LeaderboardSection
                    title=""
                    emoji=""
                    entry={chadPerson}
                    type="chad"
                    emptyMessage="No profiles analyzed yet!"
                    ctaText="Analyze a Profile"
                    isTweet={false}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Tweet Section - BOTTOM */}
          <div className="space-y-4">
            {/* Tweet Headers - Desktop: side by side, Mobile: stacked with content */}
            <div className="hidden md:grid md:grid-cols-2 gap-6">
              <div className="flex flex-col items-center">
                <img 
                  src={wojakBrainlet} 
                  alt="Wojak Brainlet" 
                  className="w-32 h-32 rounded-full object-cover border-2 border-destructive/50 mb-2 bg-white"
                />
                <h2 className="text-lg font-display font-bold text-destructive">TARD TWEET OF THE WEEK</h2>
              </div>
              <div className="flex flex-col items-center">
                <img 
                  src={gigachadLaptop} 
                  alt="Gigachad with Laptop" 
                  className="w-32 h-32 rounded-full object-cover border-2 border-primary/50 mb-2"
                />
                <h2 className="text-lg font-display font-bold text-primary">CHAD TWEET OF THE WEEK</h2>
              </div>
            </div>

            {/* Desktop: Tweet boxes side by side */}
            <div className="hidden md:grid md:grid-cols-2 gap-6">
              <LeaderboardSection
                title=""
                emoji=""
                entry={tardTweet}
                type="tard"
                emptyMessage="No tweets analyzed yet!"
                ctaText="Analyze a Tweet"
                isTweet
              />
              
              <LeaderboardSection
                title=""
                emoji=""
                entry={chadTweet}
                type="chad"
                emptyMessage="No tweets analyzed yet!"
                ctaText="Analyze a Tweet"
                isTweet
              />
            </div>

            {/* Mobile: Tard Tweet first, then Chad Tweet */}
            <div className="md:hidden space-y-6">
              {/* Tard Tweet */}
              <div className="flex flex-col items-center">
                <img 
                  src={wojakBrainlet} 
                  alt="Wojak Brainlet" 
                  className="w-24 h-24 rounded-full object-cover border-2 border-destructive/50 mb-2 bg-white"
                />
                <h2 className="text-lg font-display font-bold text-destructive mb-4">TARD TWEET OF THE WEEK</h2>
                <div className="w-full">
                  <LeaderboardSection
                    title=""
                    emoji=""
                    entry={tardTweet}
                    type="tard"
                    emptyMessage="No tweets analyzed yet!"
                    ctaText="Analyze a Tweet"
                    isTweet
                  />
                </div>
              </div>
              
              {/* Chad Tweet */}
              <div className="flex flex-col items-center">
                <img 
                  src={gigachadLaptop} 
                  alt="Gigachad with Laptop" 
                  className="w-24 h-24 rounded-full object-cover border-2 border-primary/50 mb-2"
                />
                <h2 className="text-lg font-display font-bold text-primary mb-4">CHAD TWEET OF THE WEEK</h2>
                <div className="w-full">
                  <LeaderboardSection
                    title=""
                    emoji=""
                    entry={chadTweet}
                    type="chad"
                    emptyMessage="No tweets analyzed yet!"
                    ctaText="Analyze a Tweet"
                    isTweet
                  />
                </div>
              </div>
            </div>
          </div>

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
                      
                      <div className="grid gap-4 md:grid-cols-2">
                        {/* Tard Winners */}
                        <div className="space-y-3">
                          <p className="text-xs font-bold text-destructive flex items-center gap-1">
                            😭 TARD WINNERS
                          </p>
                          {week.tardTweet && (
                            <div>
                              <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                                <MessageSquare className="w-3 h-3" /> Tweet
                              </p>
                              <TweetCard entry={week.tardTweet} type="tard" />
                            </div>
                          )}
                          {week.tardPerson && (
                            <div>
                              <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                                <User className="w-3 h-3" /> Person
                              </p>
                              <UserCard entry={week.tardPerson} type="tard" />
                            </div>
                          )}
                        </div>
                        
                        {/* Chad Winners */}
                        <div className="space-y-3">
                          <p className="text-xs font-bold text-primary flex items-center gap-1">
                            🗿 CHAD WINNERS
                          </p>
                          {week.chadTweet && (
                            <div>
                              <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                                <MessageSquare className="w-3 h-3" /> Tweet
                              </p>
                              <TweetCard entry={week.chadTweet} type="chad" />
                            </div>
                          )}
                          {week.chadPerson && (
                            <div>
                              <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                                <User className="w-3 h-3" /> Person
                              </p>
                              <UserCard entry={week.chadPerson} type="chad" />
                            </div>
                          )}
                        </div>
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
