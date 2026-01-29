import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { 
  MessageCircle, 
  Heart, 
  Quote, 
  AlertTriangle,
  Calculator,
  TrendingDown,
  TrendingUp,
  Scale,
  Code2,
  ArrowLeft
} from "lucide-react";

const About = () => {
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
            <p className="text-muted-foreground leading-relaxed mb-4">
              The Tardometer analyzes tweet engagement patterns to determine if content is genuinely 
              appreciated (<span className="text-primary font-semibold">Based</span>) or getting 
              dunked on (<span className="text-destructive font-semibold">Tarded</span>). We use 
              algorithmic analysis of engagement ratios—not subjective voting.
            </p>
          </div>

          {/* Why Recent Tweets Only */}
          <div className="glass-card p-6 sm:p-8 border-primary/30">
            <h2 className="text-2xl font-display font-bold text-foreground mb-4">
              Why Recent Tweets Only?
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              We analyze your <strong className="text-foreground">10-20 most recent tweets</strong> because 
              recent behavior is the best indicator of current posting quality.
            </p>
            
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <span className="text-primary font-bold">✓</span>
                <p className="text-muted-foreground">
                  <strong className="text-foreground">People evolve</strong> — What you posted years ago doesn't define you today
                </p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-primary font-bold">✓</span>
                <p className="text-muted-foreground">
                  <strong className="text-foreground">Current relevance</strong> — Recent posts reflect your current takes
                </p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-primary font-bold">✓</span>
                <p className="text-muted-foreground">
                  <strong className="text-foreground">Fair assessment</strong> — Everyone deserves a fresh evaluation based on recent behavior
                </p>
              </div>
            </div>
            
            <p className="mt-6 text-sm text-muted-foreground italic">
              The algorithm doesn't hold grudges from 2015. We measure who you are now, not who you were.
            </p>
          </div>

          {/* Why Algorithmic */}
          <div className="glass-card p-6 sm:p-8 border-primary/30">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-lg bg-primary/20 border border-primary/30">
                <Code2 className="w-6 h-6 text-primary" />
              </div>
              <h2 className="text-2xl font-display font-bold text-foreground">
                Why Algorithmic?
              </h2>
            </div>
            <div className="space-y-4 text-muted-foreground">
              <p>
                <strong className="text-foreground">Objective, not subjective.</strong> Traditional "community notes" or voting systems are susceptible to brigading, bias, and mob mentality.
              </p>
              <p>
                Our algorithm analyzes <strong className="text-foreground">how the crowd actually reacted</strong> to a tweet—not how they say they feel about it. The engagement patterns don't lie.
              </p>
            </div>
          </div>

          {/* The Three Metrics */}
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

            <p className="text-muted-foreground mb-4">
              If a tweet has been flagged with a <strong className="text-amber-400">Community Note</strong>, 
              the raw Tard score increases by 50%. This is a strong signal the content was misleading.
            </p>
            
            <div className="font-mono text-sm text-muted-foreground bg-muted/50 px-3 py-2 rounded inline-block">
              raw_tard_score × 1.5 (capped at 100)
            </div>
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

          {/* Open Source */}
          <div className="glass-card p-6 sm:p-8 border-primary/30">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-lg bg-primary/20 border border-primary/30">
                <Code2 className="w-6 h-6 text-primary" />
              </div>
              <h2 className="text-2xl font-display font-bold text-foreground">
                Open Source
              </h2>
            </div>
            <p className="text-muted-foreground leading-relaxed mb-4">
              <strong className="text-foreground">Transparency builds trust.</strong> We're planning to open source the Tardometer algorithm so anyone can verify exactly how scores are calculated, audit the logic, and propose improvements.
            </p>
            <p className="text-sm text-muted-foreground">
              Currently using simulated data for demonstration. Real Twitter/X API integration coming soon.
            </p>
          </div>

          {/* Back to Home */}
          <div className="flex justify-center pt-4">
            <Link 
              to="/" 
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary/20 border border-primary/50 text-primary font-semibold hover:bg-primary/30 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Link>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
};

export default About;
