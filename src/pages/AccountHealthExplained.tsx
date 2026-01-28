import { Link, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { 
  Shield, 
  TrendingUp, 
  Users, 
  Activity, 
  AlertTriangle, 
  CheckCircle, 
  ArrowLeft,
  Bot,
  Zap,
  Eye,
  Target
} from "lucide-react";

const AccountHealthExplained = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="flex-1 px-4 py-8 max-w-4xl mx-auto w-full">
        {/* Back Link */}
        <button 
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Go Back
        </button>

        {/* Hero */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 mb-4">
            <Shield className="w-8 h-8 text-accent" />
            <h1 className="font-display text-4xl sm:text-5xl font-bold text-gradient-title">
              Account Health Explained
            </h1>
          </div>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Understanding audience authenticity and engagement quality
          </p>
        </div>

        {/* What Is Account Health */}
        <section className="glass-card p-6 sm:p-8 mb-8">
          <h2 className="text-2xl font-display font-bold text-foreground mb-4">
            What Is Account Health?
          </h2>
          <p className="text-muted-foreground mb-4">
            Account Health measures the <strong className="text-foreground">authenticity and quality of a Twitter user's audience</strong>, not the quality of their content.
          </p>
          <p className="text-muted-foreground mb-4">
            A user can have excellent account health (real, engaged followers) but still post Tard content, or vice versa - they might post Based takes but have a bot-filled audience.
          </p>
          <div className="p-4 rounded-xl bg-accent/20 border border-accent/50">
            <p className="text-accent font-semibold text-sm">
              ⚠️ This is separate from the Tard ↔ Based score, which measures content quality.
            </p>
          </div>
        </section>

        {/* Why Account Health Matters */}
        <section className="glass-card p-6 sm:p-8 mb-8">
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
        </section>

        {/* How We Calculate */}
        <section className="glass-card p-6 sm:p-8 mb-8">
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
                <Badge variant="secondary">30% weight</Badge>
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
                <Badge variant="secondary">10% weight + triggers</Badge>
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
        </section>

        {/* Overall Health Ratings */}
        <section className="glass-card p-6 sm:p-8 mb-8">
          <h2 className="text-2xl font-display font-bold text-foreground mb-6">
            Overall Health Ratings
          </h2>
          <p className="text-muted-foreground mb-6">
            Based on all signals, we assign an overall health rating:
          </p>
          
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 rounded-xl bg-primary/20 border border-primary/50">
              <div className="w-12 h-12 rounded-full bg-primary/30 flex items-center justify-center">
                <span className="text-2xl">🌟</span>
              </div>
              <div>
                <h4 className="font-bold text-primary">Excellent</h4>
                <p className="text-sm text-muted-foreground">Engagement &gt;5%, strong follower ratio, consistent activity. Genuine influencer with real impact.</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 p-4 rounded-xl bg-primary/15 border border-primary/40">
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                <span className="text-2xl">✓</span>
              </div>
              <div>
                <h4 className="font-bold text-primary">Good</h4>
                <p className="text-sm text-muted-foreground">Engagement 3-5%, normal ratio, regular activity. Healthy account with authentic audience.</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 p-4 rounded-xl bg-accent/20 border border-accent/50">
              <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center">
                <span className="text-2xl">⚠️</span>
              </div>
              <div>
                <h4 className="font-bold text-accent">Fair</h4>
                <p className="text-sm text-muted-foreground">Engagement 1-3%, acceptable metrics. Average account, some room for concern.</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 p-4 rounded-xl bg-destructive/20 border border-destructive/50">
              <div className="w-12 h-12 rounded-full bg-destructive/20 flex items-center justify-center">
                <span className="text-2xl">⚠️</span>
              </div>
              <div>
                <h4 className="font-bold text-destructive">Poor</h4>
                <p className="text-sm text-muted-foreground">Engagement &lt;1%, some red flags. May have fake followers or engagement issues.</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 p-4 rounded-xl bg-destructive/30 border border-destructive/60">
              <div className="w-12 h-12 rounded-full bg-destructive/30 flex items-center justify-center">
                <span className="text-2xl">🚩</span>
              </div>
              <div>
                <h4 className="font-bold text-destructive">Suspicious</h4>
                <p className="text-sm text-muted-foreground">Multiple red flags detected. Likely bot, spam, or purchased followers.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Important Notes */}
        <section className="glass-card p-6 sm:p-8 mb-8">
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
        </section>

        {/* Navigation */}
        <div className="flex flex-wrap justify-center gap-4 text-sm">
          <Link to="/" className="text-primary hover:underline">← Home</Link>
          <span className="text-muted-foreground">|</span>
          <Link to="/how-it-works" className="text-primary hover:underline">How It Works</Link>
          <span className="text-muted-foreground">|</span>
          <Link to="/algorithm" className="text-primary hover:underline">The Algorithm</Link>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AccountHealthExplained;
