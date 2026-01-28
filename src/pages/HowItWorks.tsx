import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { 
  BookOpen, 
  Search, 
  Gauge, 
  BarChart3,
  StickyNote,
  Archive,
  Trophy,
  Bookmark,
  MessageCircle,
  Quote,
  Heart,
  AlertTriangle,
  Lightbulb,
  HelpCircle,
  ArrowRight
} from "lucide-react";

const HowItWorks = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-8 pb-6 px-4 text-center">
        <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 rounded-full bg-primary/20 border border-primary/50">
          <BookOpen className="w-4 h-4 text-primary" />
          <span className="text-primary font-bold text-xs uppercase tracking-wider">Guide</span>
        </div>
        <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold text-gradient-title tracking-tight">
          How It Works
        </h1>
        <p className="mt-4 text-muted-foreground text-lg max-w-lg mx-auto">
          Everything you need to know about measuring internet quality
        </p>
      </section>

      {/* Main Content */}
      <main className="flex-1 px-4 pb-16 max-w-4xl mx-auto w-full">
        <div className="space-y-8">
          
          {/* Quick Start Section */}
          <div className="glass-card p-6 sm:p-8">
            <h2 className="text-2xl font-display font-bold text-foreground mb-6 flex items-center gap-2">
              <Search className="w-6 h-6 text-primary" />
              Quick Start
            </h2>
            
            <div className="space-y-6">
              {/* Step 1 */}
              <div className="p-5 rounded-xl bg-secondary/30 border border-border/50">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center">
                    <span className="text-primary font-bold text-sm">1</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-foreground mb-2">Analyze Any Tweet or User</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed mb-3">
                      Paste a Twitter/X URL into the input field on the homepage:
                    </p>
                    <div className="space-y-2">
                      <div className="p-2 rounded-lg bg-muted/30 overflow-hidden">
                        <Badge variant="outline" className="text-xs mb-1">Tweet URL</Badge>
                        <div className="text-xs text-muted-foreground">
                          <code className="break-all">twitter.com/user/status/123456</code>
                          <span className="text-muted-foreground/50 mx-1">or</span>
                          <code className="break-all">x.com/user/status/123456</code>
                        </div>
                      </div>
                      <div className="p-2 rounded-lg bg-muted/30 overflow-hidden">
                        <Badge variant="outline" className="text-xs mb-1">User Profile</Badge>
                        <div className="text-xs text-muted-foreground">
                          <code className="break-all">twitter.com/username</code>
                          <span className="text-muted-foreground/50 mx-1">or</span>
                          <code className="break-all">x.com/username</code>
                        </div>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-3">
                      Our smart detection automatically figures out what you pasted.
                    </p>
                  </div>
                </div>
              </div>

              {/* Step 2 */}
              <div className="p-5 rounded-xl bg-secondary/30 border border-border/50">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center">
                    <span className="text-primary font-bold text-sm">2</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-foreground mb-2">Get Your Score</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed mb-3">
                      Click "Calculate Score" and we'll analyze:
                    </p>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-primary"></span>
                        <strong>For tweets:</strong> Engagement patterns on that specific post
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-accent"></span>
                        <strong>For users:</strong> Average score across their recent 10-20 tweets
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Step 3 */}
              <div className="p-5 rounded-xl bg-secondary/30 border border-border/50">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center">
                    <span className="text-primary font-bold text-sm">3</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-foreground mb-2">Understand the Results</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                      The gauge shows where content falls on the Tard ↔ Based spectrum:
                    </p>
                    
                    <div className="grid gap-3">
                      <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/30">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-2xl">😭</span>
                          <h4 className="font-bold text-destructive">TARD (0-24)</h4>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Getting ratioed into oblivion. High reply/quote ratios mean people are arguing, not agreeing.
                        </p>
                      </div>
                      
                      <div className="p-4 rounded-xl bg-accent/10 border border-accent/30">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-2xl">🐸</span>
                          <h4 className="font-bold text-accent">MID (25-75)</h4>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Average engagement. Nothing special. Passable content.
                        </p>
                      </div>
                      
                      <div className="p-4 rounded-xl bg-primary/10 border border-primary/30">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-2xl">🗿</span>
                          <h4 className="font-bold text-primary">BASED (76-100)</h4>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Pure positive engagement energy. People are amplifying, not dunking.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Key Features Section */}
          <div className="glass-card p-6 sm:p-8">
            <h2 className="text-2xl font-display font-bold text-foreground mb-6 flex items-center gap-2">
              <BarChart3 className="w-6 h-6 text-accent" />
              Key Features
            </h2>
            
            <div className="grid gap-6">
              {/* Private Notes */}
              <div className="p-5 rounded-xl bg-secondary/30 border border-border/50">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-primary/20 border border-primary/30">
                    <StickyNote className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-foreground mb-2">🔖 Private Notes</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed mb-3">
                      Save personal observations about any tweet or user you analyze.
                    </p>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li>• Click "Private Notes" section below results</li>
                      <li>• Type your thoughts</li>
                      <li>• Click "Save Note"</li>
                      <li>• Only you can see these (stored locally in your browser)</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Archive Tweets */}
              <div className="p-5 rounded-xl bg-secondary/30 border border-border/50">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-accent/20 border border-accent/30">
                    <Archive className="w-6 h-6 text-accent" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-foreground mb-2">📦 Archive Tweets</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed mb-3">
                      Preserve embarrassing moments before they get deleted.
                    </p>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li>• Click "Archive Tweet" button on results</li>
                      <li>• View all archives in "My Archives" (navigation menu)</li>
                      <li>• <strong>Metrics saved:</strong> Even if original tweet is deleted, you have the evidence</li>
                      <li>• Delete archived tweets anytime</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Weekly Leaderboards */}
              <div className="p-5 rounded-xl bg-secondary/30 border border-border/50">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-amber-500/20 border border-amber-500/30">
                    <Trophy className="w-6 h-6 text-amber-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-foreground mb-2">🏆 Weekly Leaderboards</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed mb-3">
                      See who dominated (or embarrassed themselves) this week.
                    </p>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li>• <strong>Chad Tweet/Person of the Week:</strong> Highest scores (most Based)</li>
                      <li>• <strong>Tard Tweet/Person of the Week:</strong> Lowest scores (most Tard)</li>
                      <li>• Resets every Monday</li>
                      <li>• Only includes tweets/users that people have analyzed</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Bookmarklet */}
              <div className="p-5 rounded-xl bg-secondary/30 border border-border/50">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-destructive/20 border border-destructive/30">
                    <Bookmark className="w-6 h-6 text-destructive" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-foreground mb-2">📊 Quick Score Bookmarklet</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed mb-3">
                      Score tweets instantly while browsing Twitter.
                    </p>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li>• Drag the "📊 Tard Score" button (on homepage) to your bookmarks bar</li>
                      <li>• Browse Twitter normally</li>
                      <li>• Click the bookmark when viewing any tweet</li>
                      <li>• Instant analysis in a popup</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Understanding Metrics Section */}
          <div className="glass-card p-6 sm:p-8">
            <h2 className="text-2xl font-display font-bold text-foreground mb-6 flex items-center gap-2">
              <Gauge className="w-6 h-6 text-primary" />
              Understanding the Metrics
            </h2>
            
            <p className="text-muted-foreground mb-6">
              We analyze three key engagement patterns:
            </p>
            
            <div className="grid gap-4 mb-6">
              <div className="p-4 rounded-xl bg-secondary/30 border border-border/50">
                <div className="flex items-center gap-3 mb-2">
                  <MessageCircle className="w-5 h-5 text-destructive" />
                  <h3 className="font-bold text-foreground">Reply Ratio</h3>
                  <Badge variant="outline" className="text-xs">40% weight</Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  Replies ÷ Likes. High ratio = people arguing with you.
                </p>
              </div>
              
              <div className="p-4 rounded-xl bg-secondary/30 border border-border/50">
                <div className="flex items-center gap-3 mb-2">
                  <Quote className="w-5 h-5 text-accent" />
                  <h3 className="font-bold text-foreground">Quote Ratio</h3>
                  <Badge variant="outline" className="text-xs">30% weight</Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  Quote tweets ÷ Retweets. High ratio = people dunking on you.
                </p>
              </div>
              
              <div className="p-4 rounded-xl bg-secondary/30 border border-border/50">
                <div className="flex items-center gap-3 mb-2">
                  <Heart className="w-5 h-5 text-primary" />
                  <h3 className="font-bold text-foreground">Engagement Quality</h3>
                  <Badge variant="outline" className="text-xs">30% weight</Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  (Likes + Retweets) ÷ (Replies + Quotes). Measures positive vs negative engagement.
                </p>
              </div>
              
              <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30">
                <div className="flex items-center gap-3 mb-2">
                  <AlertTriangle className="w-5 h-5 text-amber-400" />
                  <h3 className="font-bold text-foreground">Community Notes Penalty</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Tweets with fact-check warnings get 50% Tard penalty. Users with multiple flagged tweets get scaling penalties.
                </p>
              </div>
            </div>
            
            <p className="text-sm text-muted-foreground">
              Want the detailed math? Check out the{" "}
              <Link to="/algorithm" className="text-primary hover:underline">
                Algorithm page
              </Link>
              . For audience authenticity metrics, see{" "}
              <Link to="/account-health" className="text-primary hover:underline">
                Account Health Explained
              </Link>
              .
            </p>
          </div>

          {/* Tips & Tricks Section */}
          <div className="glass-card p-6 sm:p-8">
            <h2 className="text-2xl font-display font-bold text-foreground mb-6 flex items-center gap-2">
              <Lightbulb className="w-6 h-6 text-amber-400" />
              Tips & Tricks
            </h2>
            
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-primary/5 border border-primary/20">
                <p className="text-sm text-foreground">
                  ✅ <strong>Compare Over Time:</strong> Archive tweets to track if someone's getting more or less Tard
                </p>
              </div>
              <div className="p-4 rounded-xl bg-primary/5 border border-primary/20">
                <p className="text-sm text-foreground">
                  ✅ <strong>Browse Leaderboards:</strong> Discover legendary Tard moments submitted by the community
                </p>
              </div>
              <div className="p-4 rounded-xl bg-primary/5 border border-primary/20">
                <p className="text-sm text-foreground">
                  ✅ <strong>Use Notes:</strong> Track patterns - "This user always gets ratioed on climate posts"
                </p>
              </div>
              <div className="p-4 rounded-xl bg-primary/5 border border-primary/20">
                <p className="text-sm text-foreground">
                  ✅ <strong>Share Results:</strong> Tweet your scores to flex (or shame others)
                </p>
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="glass-card p-6 sm:p-8">
            <h2 className="text-2xl font-display font-bold text-foreground mb-6 flex items-center gap-2">
              <HelpCircle className="w-6 h-6 text-accent" />
              FAQ
            </h2>
            
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-secondary/30 border border-border/50">
                <h3 className="font-bold text-foreground mb-2">Is this real data?</h3>
                <p className="text-sm text-muted-foreground">
                  Currently using mock data for demonstration. Real Twitter API integration coming soon. See the demo banner for current status.
                </p>
              </div>
              
              <div className="p-4 rounded-xl bg-secondary/30 border border-border/50">
                <h3 className="font-bold text-foreground mb-2">Where is my data stored?</h3>
                <p className="text-sm text-muted-foreground">
                  Notes and archives are stored locally in your browser (localStorage). Only you can access them. We don't have a backend database yet.
                </p>
              </div>
              
              <div className="p-4 rounded-xl bg-secondary/30 border border-border/50">
                <h3 className="font-bold text-foreground mb-2">Can I export my archives?</h3>
                <p className="text-sm text-muted-foreground">
                  Not yet, but this feature is coming! For now, archives persist in your browser.
                </p>
              </div>
              
              <div className="p-4 rounded-xl bg-secondary/30 border border-border/50">
                <h3 className="font-bold text-foreground mb-2">What happens on Mondays?</h3>
                <p className="text-sm text-muted-foreground">
                  Leaderboards reset every Monday at midnight. Previous winners are archived in the "Previous Winners" section (coming soon).
                </p>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="flex flex-wrap justify-center gap-4 pt-4">
            <Link 
              to="/" 
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/10 border border-primary/30 text-primary hover:bg-primary/20 transition-colors text-sm font-medium"
            >
              <ArrowRight className="w-4 h-4 rotate-180" />
              Back to Home
            </Link>
            <Link 
              to="/algorithm" 
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-accent/10 border border-accent/30 text-accent hover:bg-accent/20 transition-colors text-sm font-medium"
            >
              View Algorithm Details
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link 
              to="/leaderboards" 
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400 hover:bg-amber-500/20 transition-colors text-sm font-medium"
            >
              Check Leaderboards
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
};

export default HowItWorks;
