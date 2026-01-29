import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
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
  ArrowLeft,
  Shield,
  Eye,
  HelpCircle,
  Users,
  Bot
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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
        <p className="mt-4 text-muted-foreground text-lg max-w-xl mx-auto">
          The Internet is noisy. Tardometer acts as a "noise-canceling" filter for your feed, using real-time engagement data to tell you if a tweet is a solid take or getting ratio'd.
        </p>
      </section>

      {/* Main Content */}
      <main className="flex-1 px-4 pb-16 max-w-4xl mx-auto w-full">
        <div className="space-y-8">
          
          {/* Social Sentiment Section */}
          <div className="glass-card p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-lg bg-accent/20 border border-accent/30">
                <Users className="w-6 h-6 text-accent" />
              </div>
              <h2 className="text-2xl font-display font-bold text-foreground">
                Social Sentiment, Not "Truth"
              </h2>
            </div>
            <p className="text-muted-foreground leading-relaxed mb-6">
              We don't play "Fact-Check Police." Instead, we measure <strong className="text-foreground">social sentiment</strong>. If 10,000 people are arguing with a post, the crowd has already done the fact-checking for you. We just turn that chaos into a number.
            </p>
            
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 rounded-lg bg-primary/10 border border-primary/20">
                <TrendingUp className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <p className="text-muted-foreground">
                  <strong className="text-primary">High Score:</strong> People are amplifying the message because they find it valuable.
                </p>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                <TrendingDown className="w-5 h-5 text-destructive mt-0.5 flex-shrink-0" />
                <p className="text-muted-foreground">
                  <strong className="text-destructive">Low Score:</strong> People are quote-tweeting to "dunk" on it or arguing in the replies.
                </p>
              </div>
            </div>
          </div>

          {/* The Science of the Ratio */}
          <div className="glass-card p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-lg bg-destructive/20 border border-destructive/30">
                <Scale className="w-6 h-6 text-destructive" />
              </div>
              <h2 className="text-2xl font-display font-bold text-foreground">
                The Science of the Ratio
              </h2>
            </div>
            <p className="text-muted-foreground leading-relaxed mb-6">
              In 2026, a healthy tweet usually has 300 likes for every 1 reply. If that balance flips, something is wrong.
            </p>
            
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/30">
                <div className="flex items-center gap-2 mb-2">
                  <MessageCircle className="w-5 h-5 text-destructive" />
                  <h3 className="font-bold text-foreground">The 1:1 Disaster</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  If a tweet has as many replies as likes, it's a red flag. The crowd is arguing, not agreeing.
                </p>
              </div>
              
              <div className="p-4 rounded-xl bg-accent/10 border border-accent/30">
                <div className="flex items-center gap-2 mb-2">
                  <Quote className="w-5 h-5 text-accent" />
                  <h3 className="font-bold text-foreground">The Quote-Tweet Dunk</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  We weigh Quote Tweets heavily. If a post has more Quotes than Retweets, the poster is being mocked, not supported.
                </p>
              </div>
            </div>
          </div>

          {/* The Zones - Table */}
          <div className="glass-card p-6 sm:p-8">
            <h2 className="text-2xl font-display font-bold text-foreground mb-6 flex items-center gap-2">
              <Calculator className="w-6 h-6 text-primary" />
              The Zones
            </h2>
            
            <div className="rounded-xl border border-border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/30 hover:bg-muted/30">
                    <TableHead className="font-bold text-foreground">Score</TableHead>
                    <TableHead className="font-bold text-foreground">Status</TableHead>
                    <TableHead className="font-bold text-foreground">What it Means</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow className="bg-destructive/5 hover:bg-destructive/10">
                    <TableCell className="font-mono font-bold text-destructive">0-35</TableCell>
                    <TableCell>
                      <span className="font-bold text-destructive">COOKED</span> 🔥
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      This post is getting absolutely ratioed. High negative engagement or a Community Note present. The crowd is not on your side.
                    </TableCell>
                  </TableRow>
                  <TableRow className="bg-accent/5 hover:bg-accent/10">
                    <TableCell className="font-mono font-bold text-accent">36-70</TableCell>
                    <TableCell>
                      <span className="font-bold text-accent">MID</span> 😐
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      Standard social noise. Average engagement with some disagreement. Most of the internet lives here.
                    </TableCell>
                  </TableRow>
                  <TableRow className="bg-primary/5 hover:bg-primary/10">
                    <TableCell className="font-mono font-bold text-primary">71-100</TableCell>
                    <TableCell>
                      <span className="font-bold text-primary">BASED</span> 🗿
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      Strong positive reception. High likes-to-replies ratio. This content is being amplified by the community as high-value or authoritative.
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </div>

          {/* Why an Algorithm */}
          <div className="glass-card p-6 sm:p-8 border-primary/30">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-lg bg-primary/20 border border-primary/30">
                <Bot className="w-6 h-6 text-primary" />
              </div>
              <h2 className="text-2xl font-display font-bold text-foreground">
                Why an Algorithm? (No Bot-Voting)
              </h2>
            </div>
            <div className="space-y-4 text-muted-foreground">
              <p>
                We don't use "Upvotes" or "Downvotes" because those are easily manipulated by <strong className="text-foreground">bot farms</strong> and <strong className="text-foreground">"brigading"</strong> (coordinated attacks).
              </p>
              <p>
                By using an <strong className="text-primary">Engagement Algorithm</strong>, we look at organic behavior. It's much harder for a bot to fake a healthy "Likes-to-Quotes" ratio than it is to just click a "Dislike" button.
              </p>
              <p className="text-sm italic border-l-2 border-primary/50 pl-4">
                We look at the math, not the mob.
              </p>
            </div>
          </div>

          {/* Privacy & Transparency */}
          <div className="glass-card p-6 sm:p-8 border-primary/30">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-lg bg-primary/20 border border-primary/30">
                <Shield className="w-6 h-6 text-primary" />
              </div>
              <h2 className="text-2xl font-display font-bold text-foreground">
                Privacy & Transparency
              </h2>
            </div>
            <p className="text-muted-foreground mb-6">
              We value your privacy. Tardometer is a <strong className="text-foreground">"read-only" auditor</strong>.
            </p>
            
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Eye className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <strong className="text-foreground">Public Data Only:</strong>
                  <p className="text-sm text-muted-foreground">We exclusively analyze publicly available engagement metrics (likes, replies, quotes, and retweets) fetched via Apify.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <strong className="text-foreground">No Data Harvesting:</strong>
                  <p className="text-sm text-muted-foreground">We do not store your private messages, passwords, or personal browsing history.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Code2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <strong className="text-foreground">Zero-Access:</strong>
                  <p className="text-sm text-muted-foreground">We never ask for your X login credentials. We audit the math, not your identity.</p>
                </div>
              </div>
            </div>
          </div>

          {/* FAQ */}
          <div className="glass-card p-6 sm:p-8 border-accent/30">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-lg bg-accent/20 border border-accent/30">
                <HelpCircle className="w-6 h-6 text-accent" />
              </div>
              <h2 className="text-2xl font-display font-bold text-foreground">
                FAQ: Why is my score low?
              </h2>
            </div>
            <div className="space-y-4 text-muted-foreground">
              <p>
                If you're asking a question or starting a heated debate, your score will naturally be lower. <strong className="text-foreground">That doesn't mean you're wrong</strong>—it just means the internet is arguing with you.
              </p>
              <p className="p-4 rounded-lg bg-accent/10 border border-accent/20">
                The algorithm measures <strong className="text-accent">reception</strong>, not correctness. A low score reflects high-friction engagement, not a moral judgment.
              </p>
            </div>
          </div>

          {/* Community Notes Penalty */}
          <div className="glass-card p-6 sm:p-8 border-amber-500/30">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-lg bg-amber-500/20 border border-amber-500/30">
                <AlertTriangle className="w-6 h-6 text-amber-400" />
              </div>
              <h2 className="text-2xl font-display font-bold text-foreground">Community Notes Penalty</h2>
            </div>
            <p className="text-muted-foreground mb-4">
              If a tweet has been flagged with a <strong className="text-amber-400">Community Note</strong>, the raw Tard score receives a flat <strong className="text-foreground">+50 point penalty</strong>. This is a strong signal the content was misleading.
            </p>
            <div className="font-mono text-sm text-muted-foreground bg-muted/50 px-3 py-2 rounded inline-block">
              raw_tard_score + 50 (capped at 85)
            </div>
            <p className="text-xs text-muted-foreground mt-2 italic">
              Community Notes ensure a tweet can never be classified as "Based."
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
