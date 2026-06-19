import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { MessageCircle, Quote, Calculator, Scale, Bot, AlertTriangle, Code } from "lucide-react";
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

      {/* Hero */}
      <section className="pt-8 pb-6 px-4 text-center">
        <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold text-gradient-title tracking-tight pb-1">
          The Algorithm
        </h1>
        <p className="mt-4 text-muted-foreground text-lg max-w-xl mx-auto">
          The internet is noisy. Retardometer cuts through it using real engagement data to tell you if a tweet is landing — or getting destroyed.
        </p>
      </section>

      <main className="flex-1 px-4 pb-16 max-w-4xl mx-auto w-full">
        <div className="space-y-8">

          {/* Sentiment, not truth */}
          <div className="glass-card p-6 sm:p-8">
            <h2 className="text-2xl font-display font-bold text-foreground mb-4">
              We measure sentiment, not truth
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              We don't fact-check. We measure crowd behaviour. If 10,000 people are arguing with a post, the crowd has already delivered its verdict. We just turn that chaos into a number.
            </p>
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                <span className="mt-0.5">🤡</span>
                <p className="text-muted-foreground">
                  <strong className="text-destructive">High score</strong> = the crowd is dunking, arguing, and ratio'ing
                </p>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-lg bg-primary/10 border border-primary/20">
                <span className="mt-0.5">🧠</span>
                <p className="text-muted-foreground">
                  <strong className="text-primary">Low score</strong> = the crowd is amplifying and agreeing
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
            <p className="text-muted-foreground leading-relaxed">
              In 2026, a healthy tweet has roughly 300 likes for every reply. When that balance flips, something has gone wrong.
            </p>
          </div>

          {/* The Actual Formula */}
          <div className="glass-card p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-lg bg-primary/20 border border-primary/30">
                <Code className="w-6 h-6 text-primary" />
              </div>
              <h2 className="text-2xl font-display font-bold text-foreground">
                The Actual Formula
              </h2>
            </div>

            <pre className="bg-muted/30 border border-border rounded-xl p-4 sm:p-6 text-sm sm:text-base font-mono text-foreground overflow-x-auto mb-6">
{`replyRatio  = replies ÷ likes
quoteRatio  = quotes ÷ retweets

rawScore = (replyRatio × 45)
         + (quoteRatio × 35)
         + (engagementQuality < 5 ? +20 : 0)

Community Note = +25 penalty
Reply Suppression (likes > 500 && replyRatio < 0.001) = +10 penalty

Final Retard Score = rawScore (capped 0–100)`}
            </pre>

            <div className="space-y-4">
              <div className="flex items-start gap-3 p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                <MessageCircle className="w-5 h-5 text-destructive mt-0.5 shrink-0" />
                <p className="text-muted-foreground text-sm">
                  <strong className="text-foreground">The Reply Ratio</strong> accounts for 45% of the score. A tweet with as many replies as likes means the crowd is arguing, not agreeing.
                </p>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-lg bg-accent/10 border border-accent/20">
                <Quote className="w-5 h-5 text-accent mt-0.5 shrink-0" />
                <p className="text-muted-foreground text-sm">
                  <strong className="text-foreground">The Quote-Tweet Dunk</strong> accounts for 35%. More quotes than retweets means the poster is being mocked, not shared.
                </p>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-lg bg-primary/10 border border-primary/20">
                <Calculator className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                <p className="text-muted-foreground text-sm">
                  <strong className="text-foreground">Engagement Quality</strong> adds up to 20 points when the ratio of negative to positive engagement tips below a healthy threshold.
                </p>
              </div>
            </div>
          </div>

          {/* The Zones */}
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
                    <TableHead className="font-bold text-foreground">Meaning</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow className="bg-primary/5 hover:bg-primary/10">
                    <TableCell className="font-mono font-bold text-primary">0–35</TableCell>
                    <TableCell>
                      <span className="font-bold text-primary">NOT RETARDED 🧠</span>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      Strong positive reception. The crowd is with you.
                    </TableCell>
                  </TableRow>
                  <TableRow className="bg-accent/5 hover:bg-accent/10">
                    <TableCell className="font-mono font-bold text-accent">36–70</TableCell>
                    <TableCell>
                      <span className="font-bold text-accent">SEMI-RETARDED 😐</span>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      Average engagement. Most of the internet lives here.
                    </TableCell>
                  </TableRow>
                  <TableRow className="bg-destructive/5 hover:bg-destructive/10">
                    <TableCell className="font-mono font-bold text-destructive">71–100</TableCell>
                    <TableCell>
                      <span className="font-bold text-destructive">FULLY RETARDED 🤡</span>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      Absolutely ratio'd. The crowd is not on your side.
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </div>

          {/* Why not upvotes */}
          <div className="glass-card p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-lg bg-primary/20 border border-primary/30">
                <Bot className="w-6 h-6 text-primary" />
              </div>
              <h2 className="text-2xl font-display font-bold text-foreground">
                Why not just use upvotes?
              </h2>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              Upvotes and downvotes are easily manipulated by bot farms and coordinated brigading. Engagement ratios are much harder to fake. We look at the math, not the mob.
            </p>
          </div>

          {/* Community Notes Penalty */}
          <div className="glass-card p-6 sm:p-8 border-amber-500/30">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-lg bg-amber-500/20 border border-amber-500/30">
                <AlertTriangle className="w-6 h-6 text-amber-400" />
              </div>
              <h2 className="text-2xl font-display font-bold text-foreground">Community Notes Penalty</h2>
            </div>
            <p className="text-muted-foreground">
              A Community Note is a crowd-sourced flag for misleading content. If a tweet carries one, the raw score receives a flat <strong className="text-foreground">+25 penalty</strong> — enough to push any borderline tweet firmly into FULLY RETARDED territory. A Community Note means the crowd has already spoken.
            </p>
          </div>

          {/* Reply Suppression Penalty */}
          <div className="glass-card p-6 sm:p-8 border-amber-500/30">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-lg bg-amber-500/20 border border-amber-500/30">
                <AlertTriangle className="w-6 h-6 text-amber-400" />
              </div>
              <h2 className="text-2xl font-display font-bold text-foreground">Reply Suppression Penalty</h2>
            </div>
            <p className="text-muted-foreground">
              Some accounts suppress replies — accumulating likes while hiding the crowd's reaction. If a tweet has over 500 likes but a reply ratio below 0.001, the score receives a flat <strong className="text-foreground">+10 penalty</strong>. Burying the ratio doesn't make it go away.
            </p>
          </div>

          {/* Is the algorithm fair? */}
          <div className="glass-card p-6 sm:p-8">
            <h2 className="text-2xl font-display font-bold text-foreground mb-4">
              Is the algorithm fair?
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              We believe the Retard Score is mathematically just. The crowd always tells the truth.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-4">
              If you disagree with the weightings, believe your score was unfair, or think you have a better formula — contact us on X at{" "}
              <a href="https://x.com/Retardometer" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-bold">@Retardometer</a>{" "}
              with your proposed algorithm. We will consider all submissions seriously.
            </p>
            <p className="text-muted-foreground italic">
              We probably won't change it though.
            </p>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
};

export default About;
