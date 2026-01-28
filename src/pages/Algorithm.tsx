import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { 
  MessageCircle, 
  Heart, 
  Repeat2, 
  Quote, 
  AlertTriangle,
  Calculator,
  TrendingDown,
  TrendingUp,
  Scale,
  Shield,
  Users,
  Activity,
  CheckCircle,
  Bot,
  Zap,
  Eye,
  Target
} from "lucide-react";

const Algorithm = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-8 pb-6 px-4 text-center">
        <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 rounded-full bg-primary/20 border border-primary/50">
          <Calculator className="w-4 h-4 text-primary" />
          <span className="text-primary font-bold text-xs uppercase tracking-wider">The Science</span>
        </div>
        <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold text-gradient-title tracking-tight pb-1">
          The Algorithm
        </h1>
        <p className="mt-4 text-muted-foreground text-lg max-w-lg mx-auto">
          How we calculate if that tweet (or tweeter) is <span className="text-destructive font-semibold">Tarded</span> or{" "}
          <span className="text-primary font-semibold">Based</span>
        </p>
      </section>

      {/* Main Content */}
      <main className="flex-1 px-4 pb-16 max-w-4xl mx-auto w-full">
        <div className="space-y-8">
          
          {/* Overview Card */}
          <div className="glass-card p-6 sm:p-8">
            <h2 className="text-2xl font-display font-bold text-foreground mb-4 flex items-center gap-2">
              <Scale className="w-6 h-6 text-accent" />
              How It Works
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              The Tardometer analyzes tweet engagement patterns to determine if content is genuinely 
              appreciated (<span className="text-primary font-semibold">Based</span>) or getting 
              dunked on (<span className="text-destructive font-semibold">Tarded</span>). For individual 
              tweets, we look at engagement ratios. For users, we analyze their recent tweet history 
              to find patterns.
            </p>
          </div>

          {/* ============================================= */}
          {/* SECTION 1: TARD SCORE */}
          {/* ============================================= */}
          
          <div className="text-center">
            <h2 className="text-3xl font-display font-bold text-gradient-title">Section 1: Tard Score</h2>
            <p className="text-muted-foreground mt-2">Measuring content quality</p>
          </div>

          {/* The Three Pillars */}
          <div className="glass-card p-6 sm:p-8">
            <h2 className="text-2xl font-display font-bold text-foreground mb-6">
              The Three Metrics
            </h2>
            
            <div className="grid gap-6">
              {/* Reply Ratio */}
              <div className="p-5 rounded-xl bg-secondary/30 border border-border/50">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-destructive/20 border border-destructive/30">
                    <MessageCircle className="w-6 h-6 text-destructive" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-bold text-foreground">Reply Ratio</h3>
                      <Badge variant="outline" className="text-xs">Weight: 40%</Badge>
                    </div>
                    <div className="font-mono text-sm text-muted-foreground bg-muted/50 px-3 py-2 rounded mb-3 inline-block">
                      replies ÷ likes
                    </div>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      High reply ratio = people are arguing with you, not agreeing. When replies 
                      massively outnumber likes, you're getting <strong className="text-destructive">ratioed</strong>.
                    </p>
                    <div className="mt-3 flex items-center gap-4 text-xs">
                      <span className="flex items-center gap-1 text-primary">
                        <TrendingDown className="w-3 h-3" /> Low ratio = Based
                      </span>
                      <span className="flex items-center gap-1 text-destructive">
                        <TrendingUp className="w-3 h-3" /> High ratio = Tarded
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quote Ratio */}
              <div className="p-5 rounded-xl bg-secondary/30 border border-border/50">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-accent/20 border border-accent/30">
                    <Quote className="w-6 h-6 text-accent" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-bold text-foreground">Quote Ratio</h3>
                      <Badge variant="outline" className="text-xs">Weight: 30%</Badge>
                    </div>
                    <div className="font-mono text-sm text-muted-foreground bg-muted/50 px-3 py-2 rounded mb-3 inline-block">
                      quote_tweets ÷ retweets
                    </div>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      Quote tweets usually mean someone is <strong>dunking on you</strong>. When 
                      people quote instead of retweet, they're adding their own (often mocking) 
                      commentary.
                    </p>
                    <div className="mt-3 flex items-center gap-4 text-xs">
                      <span className="flex items-center gap-1 text-primary">
                        <TrendingDown className="w-3 h-3" /> Low ratio = Based
                      </span>
                      <span className="flex items-center gap-1 text-destructive">
                        <TrendingUp className="w-3 h-3" /> High ratio = Tarded
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Engagement Quality */}
              <div className="p-5 rounded-xl bg-secondary/30 border border-border/50">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-primary/20 border border-primary/30">
                    <Heart className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-bold text-foreground">Engagement Quality</h3>
                      <Badge variant="outline" className="text-xs">Weight: 30%</Badge>
                    </div>
                    <div className="font-mono text-sm text-muted-foreground bg-muted/50 px-3 py-2 rounded mb-3 inline-block">
                      (likes + retweets) ÷ (replies + quotes)
                    </div>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      The overall balance of positive vs negative engagement. High quality means 
                      people are <strong className="text-primary">amplifying</strong> your content, 
                      not fighting about it.
                    </p>
                    <div className="mt-3 flex items-center gap-4 text-xs">
                      <span className="flex items-center gap-1 text-primary">
                        <TrendingUp className="w-3 h-3" /> High quality = Based
                      </span>
                      <span className="flex items-center gap-1 text-destructive">
                        <TrendingDown className="w-3 h-3" /> Low quality = Tarded
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Community Notes Penalty */}
          <div className="glass-card p-6 sm:p-8 border-amber-500/30">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 rounded-lg bg-amber-500/20 border border-amber-500/30">
                <AlertTriangle className="w-6 h-6 text-amber-400" />
              </div>
              <h2 className="text-2xl font-display font-bold text-foreground">Community Notes Penalty</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* For Individual Tweets */}
              <div className="p-5 rounded-xl bg-secondary/30 border border-amber-500/20">
                <div className="flex items-center gap-2 mb-3">
                  <h3 className="text-lg font-bold text-foreground">For Individual Tweets</h3>
                  <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/50">+50% More Tarded</Badge>
                </div>
                <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                  If a specific tweet has been flagged with a <strong className="text-amber-400">Community Note</strong>, 
                  the raw Tard score increases by 50%. This is a strong signal the content was misleading.
                </p>
                <div className="font-mono text-sm text-muted-foreground bg-muted/50 px-3 py-2 rounded inline-block">
                  raw_tard_score × 1.5 (capped at 100)
                </div>
              </div>

              {/* For User Profiles */}
              <div className="p-5 rounded-xl bg-secondary/30 border border-amber-500/20">
                <div className="flex items-center gap-2 mb-3">
                  <h3 className="text-lg font-bold text-foreground">For User Profiles</h3>
                  <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/50">Scaling Penalty</Badge>
                </div>
                <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                  When analyzing a user's overall profile, we check what percentage of their recent tweets 
                  have Community Notes. The penalty scales with frequency:
                </p>
                <div className="space-y-2">
                  <div className="flex items-center gap-3 p-2 rounded-lg bg-muted/30">
                    <span className="font-mono text-xs text-amber-400/80">10%</span>
                    <span className="text-muted-foreground text-xs">flagged</span>
                    <span className="ml-auto font-mono text-xs text-amber-400">+5%</span>
                  </div>
                  <div className="flex items-center gap-3 p-2 rounded-lg bg-muted/30">
                    <span className="font-mono text-xs text-amber-400/80">20%</span>
                    <span className="text-muted-foreground text-xs">flagged</span>
                    <span className="ml-auto font-mono text-xs text-amber-400">+10%</span>
                  </div>
                  <div className="flex items-center gap-3 p-2 rounded-lg bg-muted/50 border border-amber-500/30">
                    <span className="font-mono text-xs text-amber-400">50%+</span>
                    <span className="text-muted-foreground text-xs">flagged</span>
                    <span className="ml-auto font-mono text-xs text-amber-400 font-bold">+25% (max)</span>
                  </div>
                </div>
              </div>
            </div>

            <p className="text-xs text-muted-foreground mt-4 text-center">
              Community Notes heavily weigh serial misinformation spreaders in the final score.
            </p>
          </div>

          {/* The Formula */}
          <div className="glass-card p-6 sm:p-8">
            <h2 className="text-2xl font-display font-bold text-foreground mb-4 flex items-center gap-2">
              <Calculator className="w-6 h-6 text-primary" />
              The Formula
            </h2>
            
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-muted/30 border border-border/50">
                <p className="text-sm text-muted-foreground mb-2">Step 1: Calculate Raw Tard Score</p>
                <div className="font-mono text-sm text-foreground bg-background/50 p-3 rounded overflow-x-auto">
                  raw_score = (reply_ratio/2 × 40) + (quote_ratio/2 × 30) + (1/engagement_quality × 30)
                </div>
              </div>
              
              <div className="p-4 rounded-xl bg-muted/30 border border-border/50">
                <p className="text-sm text-muted-foreground mb-2">Step 2: Apply Community Note Penalty (if applicable)</p>
                <div className="font-mono text-sm text-foreground bg-background/50 p-3 rounded">
                  if (has_community_note) raw_score = raw_score × 1.5
                </div>
              </div>
              
              <div className="p-4 rounded-xl bg-muted/30 border border-border/50">
                <p className="text-sm text-muted-foreground mb-2">Step 3: Invert to Final Score</p>
                <div className="font-mono text-sm text-foreground bg-background/50 p-3 rounded">
                  final_score = 100 - raw_score
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  (0 = Maximum Tarded, 100 = Maximum Based)
                </p>
              </div>
            </div>
          </div>

          {/* Score Zones */}
          <div className="glass-card p-6 sm:p-8">
            <h2 className="text-2xl font-display font-bold text-foreground mb-6">Score Zones</h2>
            
            <div className="grid sm:grid-cols-3 gap-4">
              {/* Tarded Zone */}
              <div className="p-5 rounded-xl bg-destructive/10 border border-destructive/30 text-center">
                <div className="text-4xl mb-2">😭</div>
                <h3 className="text-xl font-bold text-destructive mb-1">TARDED</h3>
                <p className="font-mono text-lg text-destructive/80">0 - 24</p>
                <p className="text-xs text-muted-foreground mt-2">
                  Getting ratioed into oblivion
                </p>
              </div>
              
              {/* Mid Zone */}
              <div className="p-5 rounded-xl bg-accent/10 border border-accent/30 text-center">
                <div className="text-4xl mb-2">🐸</div>
                <h3 className="text-xl font-bold text-accent mb-1">MID</h3>
                <p className="font-mono text-lg text-accent/80">25 - 75</p>
                <p className="text-xs text-muted-foreground mt-2">
                  Average engagement, nothing special
                </p>
              </div>
              
              {/* Based Zone */}
              <div className="p-5 rounded-xl bg-primary/10 border border-primary/30 text-center">
                <div className="text-4xl mb-2">🗿</div>
                <h3 className="text-xl font-bold text-primary mb-1">BASED</h3>
                <p className="font-mono text-lg text-primary/80">76 - 100</p>
                <p className="text-xs text-muted-foreground mt-2">
                  Pure positive engagement energy
                </p>
              </div>
            </div>
          </div>

          {/* User Analysis */}
          <div className="glass-card p-6 sm:p-8">
            <h2 className="text-2xl font-display font-bold text-foreground mb-4">
              User Profile Analysis
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              When you analyze a user profile instead of a single tweet, we fetch their 
              <strong> last 10-20 tweets</strong> and calculate:
            </p>
            <ul className="space-y-2 text-muted-foreground">
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-primary"></span>
                Average Tard Score across all tweets
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-accent"></span>
                Average Reply/Quote ratios
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                % of tweets with Community Notes
              </li>
            </ul>
          </div>

          {/* ============================================= */}
          {/* SECTION 2: ACCOUNT HEALTH */}
          {/* ============================================= */}
          
          <div id="account-health" className="text-center pt-8">
            <h2 className="text-3xl font-display font-bold text-gradient-title">Section 2: Account Health</h2>
            <p className="text-muted-foreground mt-2">Measuring audience authenticity</p>
          </div>

          {/* What Is Account Health */}
          <div className="glass-card p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="w-6 h-6 text-accent" />
              <h2 className="text-2xl font-display font-bold text-foreground">
                What Is Account Health?
              </h2>
            </div>
            <p className="text-muted-foreground mb-4">
              Account Health measures the <strong className="text-foreground">authenticity and quality of a Twitter user's audience</strong>, not the quality of their content.
            </p>
            <p className="text-muted-foreground mb-4">
              A user can have excellent account health (real, engaged followers) but still post Tarded content, or vice versa - they might post Based takes but have a bot-filled audience.
            </p>
            <div className="p-4 rounded-xl bg-accent/20 border border-accent/50">
              <p className="text-accent font-semibold text-sm">
                ⚠️ This is separate from the Tard ↔ Based score, which measures content quality.
              </p>
            </div>
          </div>

          {/* Why Account Health Matters */}
          <div className="glass-card p-6 sm:p-8">
            <h2 className="text-2xl font-display font-bold text-foreground mb-4">
              Why Account Health Matters
            </h2>
            <p className="text-muted-foreground mb-6">
              Account health helps you identify:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
                <Bot className="w-5 h-5 text-destructive mt-0.5" />
                <div>
                  <p className="font-semibold text-foreground">Bot accounts</p>
                  <p className="text-sm text-muted-foreground">With fake followers</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
                <Users className="w-5 h-5 text-destructive mt-0.5" />
                <div>
                  <p className="font-semibold text-foreground">Bought followers</p>
                  <p className="text-sm text-muted-foreground">High count, low engagement</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
                <AlertTriangle className="w-5 h-5 text-accent mt-0.5" />
                <div>
                  <p className="font-semibold text-foreground">Spam accounts</p>
                  <p className="text-sm text-muted-foreground">Suspicious activity patterns</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
                <CheckCircle className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <p className="font-semibold text-foreground">Authentic influencers</p>
                  <p className="text-sm text-muted-foreground">Real, engaged audiences</p>
                </div>
              </div>
            </div>
            <div className="p-4 rounded-xl bg-primary/20 border border-primary/50">
              <p className="text-primary font-medium text-sm">
                💡 A user with 10K real, engaged followers has more impact than someone with 1M fake followers.
              </p>
            </div>
          </div>

          {/* How We Calculate Account Health */}
          <div className="glass-card p-6 sm:p-8">
            <h2 className="text-2xl font-display font-bold text-foreground mb-6">
              How We Calculate Account Health
            </h2>
            <p className="text-muted-foreground mb-6">
              We analyze multiple signals to assess account authenticity:
            </p>

            {/* Engagement Rate */}
            <div className="mb-8 p-4 rounded-xl bg-muted/20 border border-border/30">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground">1. Engagement Rate</h3>
                  <Badge variant="secondary">40% weight</Badge>
                </div>
              </div>
              <div className="mb-4 p-3 rounded-lg bg-muted/30 font-mono text-sm">
                <p className="text-muted-foreground">Engagement Rate = (Likes + Replies + Retweets + Quotes) ÷ (Follower Count × 0.1) × 100</p>
              </div>
              <p className="text-muted-foreground mb-4">
                Measures how much your audience actually interacts with your content. High follower counts with low engagement suggest fake or inactive followers.
              </p>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-destructive">🚩</span>
                  <span className="text-muted-foreground">&lt;1% = Low - Disengaged or bot audience</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-primary">✓</span>
                  <span className="text-muted-foreground">1-3% = Normal - Healthy engagement</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-primary">✓✓</span>
                  <span className="text-muted-foreground">3-5% = Good - Active audience</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-primary">🌟</span>
                  <span className="text-muted-foreground">&gt;5% = Excellent - Highly engaged</span>
                </div>
              </div>
            </div>

            {/* Follower Ratio */}
            <div className="mb-8 p-4 rounded-xl bg-muted/20 border border-border/30">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
                  <Users className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground">2. Follower-to-Following Ratio</h3>
                  <Badge variant="secondary">25% weight</Badge>
                </div>
              </div>
              <div className="mb-4 p-3 rounded-lg bg-muted/30 font-mono text-sm">
                <p className="text-muted-foreground">Follower Ratio = Followers ÷ Following</p>
              </div>
              <p className="text-muted-foreground mb-4">
                Indicates organic growth vs. follow-for-follow schemes. Accounts following thousands but with few followers are often spam or bots.
              </p>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-primary">✓</span>
                  <span className="text-muted-foreground">&gt;10:1 = Strong influence (leader, not follower)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-primary">✓</span>
                  <span className="text-muted-foreground">3-10:1 = Normal ratio (healthy account)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-accent">⚠️</span>
                  <span className="text-muted-foreground">1-3:1 = Reciprocal following (follow-back patterns)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-destructive">🚩</span>
                  <span className="text-muted-foreground">&lt;1:1 or &gt;5000 following = Spam/bot pattern</span>
                </div>
              </div>
            </div>

            {/* Activity Level */}
            <div className="mb-8 p-4 rounded-xl bg-muted/20 border border-border/30">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                  <Activity className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground">3. Activity Consistency</h3>
                  <Badge variant="secondary">20% weight</Badge>
                </div>
              </div>
              <p className="text-muted-foreground mb-4">
                Analyzes posting patterns over time. Authentic accounts have relatively consistent activity, while compromised or coordinated accounts show suspicious patterns.
              </p>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-primary">✓</span>
                  <span className="text-muted-foreground"><strong>Consistent</strong> - Regular posting schedule (authentic)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-accent">⚠️</span>
                  <span className="text-muted-foreground"><strong>Sporadic</strong> - Irregular activity (casual user or semi-active)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-destructive">🚩</span>
                  <span className="text-muted-foreground"><strong>Burst Pattern</strong> - Suspicious activity spikes (possible automation)</span>
                </div>
              </div>
            </div>

            {/* Red Flags */}
            <div className="p-4 rounded-xl bg-muted/20 border border-border/30">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-destructive/20 flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-destructive" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground">4. Red Flag Detection</h3>
                  <Badge variant="secondary">15% weight + triggers</Badge>
                </div>
              </div>
              <p className="text-muted-foreground mb-4">
                We automatically detect and flag suspicious patterns:
              </p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-destructive">🚩</span>
                  <span>High following-to-follower ratio (e.g., 5000:50)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-destructive">🚩</span>
                  <span>Very low engagement rate (&lt;1%) despite high follower count</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-destructive">🚩</span>
                  <span>Burst activity patterns suggesting automation</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-destructive">🚩</span>
                  <span>Unusually high following count (&gt;4000)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-destructive">🚩</span>
                  <span>High follower count + very low engagement (likely purchased followers)</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Health Score Zones */}
          <div className="glass-card p-6 sm:p-8">
            <h2 className="text-2xl font-display font-bold text-foreground mb-6">
              Health Score Zones
            </h2>
            <p className="text-muted-foreground mb-6">
              Based on all signals, we assign an overall health rating (0-100):
            </p>
            
            <div className="grid sm:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl bg-[hsl(0,50%,25%)]/20 border border-[hsl(0,50%,30%)]/50 text-center">
                <div className="text-3xl mb-2">☠️</div>
                <h3 className="text-lg font-bold text-[hsl(0,50%,40%)] mb-1">DYING</h3>
                <p className="font-mono text-sm text-[hsl(0,50%,40%)]/80">0 - 25</p>
                <p className="text-xs text-muted-foreground mt-2">
                  Multiple red flags, likely fake
                </p>
              </div>
              
              <div className="p-4 rounded-xl bg-[hsl(30,90%,50%)]/20 border border-[hsl(30,90%,50%)]/50 text-center">
                <div className="text-3xl mb-2">🤢</div>
                <h3 className="text-lg font-bold text-[hsl(30,90%,50%)] mb-1">SICKLY</h3>
                <p className="font-mono text-sm text-[hsl(30,90%,50%)]/80">25 - 50</p>
                <p className="text-xs text-muted-foreground mt-2">
                  Some concerning patterns
                </p>
              </div>
              
              <div className="p-4 rounded-xl bg-[hsl(100,60%,45%)]/20 border border-[hsl(100,60%,45%)]/50 text-center">
                <div className="text-3xl mb-2">😊</div>
                <h3 className="text-lg font-bold text-[hsl(100,60%,45%)] mb-1">HEALTHY</h3>
                <p className="font-mono text-sm text-[hsl(100,60%,45%)]/80">50 - 75</p>
                <p className="text-xs text-muted-foreground mt-2">
                  Normal, authentic account
                </p>
              </div>
              
              <div className="p-4 rounded-xl bg-[hsl(50,100%,50%)]/20 border border-[hsl(50,100%,50%)]/50 text-center">
                <div className="text-3xl mb-2">🗿</div>
                <h3 className="text-lg font-bold text-[hsl(50,100%,50%)] mb-1">GIGACHAD</h3>
                <p className="font-mono text-sm text-[hsl(50,100%,50%)]/80">75 - 100</p>
                <p className="text-xs text-muted-foreground mt-2">
                  Excellent, highly engaged
                </p>
              </div>
            </div>
          </div>

          {/* Important Notes */}
          <div className="glass-card p-6 sm:p-8">
            <h2 className="text-2xl font-display font-bold text-foreground mb-4">
              Important Notes
            </h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Eye className="w-5 h-5 text-accent mt-1" />
                <div>
                  <p className="font-semibold text-foreground">Currently Using Mock Data</p>
                  <p className="text-sm text-muted-foreground">
                    Account health metrics are simulated until we integrate with the Twitter API. Results are for demonstration only.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Target className="w-5 h-5 text-primary mt-1" />
                <div>
                  <p className="font-semibold text-foreground">Not a Perfect Science</p>
                  <p className="text-sm text-muted-foreground">
                    Account health is an estimate based on public signals. Some legitimate accounts may score poorly, and some inauthentic accounts may game the metrics.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Zap className="w-5 h-5 text-accent mt-1" />
                <div>
                  <p className="font-semibold text-foreground">Context Matters</p>
                  <p className="text-sm text-muted-foreground">
                    New accounts, niche topics, and different user types will naturally have different patterns. Use health scores as one signal among many.
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Algorithm;