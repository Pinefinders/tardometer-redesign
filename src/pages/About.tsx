import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { MessageCircle, Quote, Calculator, Scale, Bot, AlertTriangle } from "lucide-react";
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
                <span className="mt-0.5">🔥</span>
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
            <p className="text-muted-foreground leading-relaxed mb-6">
              In 2026, a healthy tweet has roughly 300 likes for every reply. When that balance flips, something has gone wrong.
            </p>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/30">
                <div className="flex items-center gap-2 mb-2">
                  <MessageCircle className="w-5 h-5 text-destructive" />
                  <h3 className="font-bold text-foreground">The Reply Ratio</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  If a tweet has as many replies as likes, the crowd is arguing — not agreeing. That's a red flag.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-accent/10 border border-accent/30">
                <div className="flex items-center gap-2 mb-2">
                  <Quote className="w-5 h-5 text-accent" />
                  <h3 className="font-bold text-foreground">The Quote-Tweet Dunk</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Quote tweets are weighted heavily. More quotes than retweets means the poster is being mocked, not shared.
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
                      Strong positive reception. High likes-to-replies ratio. The crowd is with you.
                    </TableCell>
                  </TableRow>
                  <TableRow className="bg-accent/5 hover:bg-accent/10">
                    <TableCell className="font-mono font-bold text-accent">36–70</TableCell>
                    <TableCell>
                      <span className="font-bold text-accent">SEMI-RETARDED 😐</span>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      Average engagement. Some noise, some agreement. Most of the internet lives here.
                    </TableCell>
                  </TableRow>
                  <TableRow className="bg-destructive/5 hover:bg-destructive/10">
                    <TableCell className="font-mono font-bold text-destructive">71–100</TableCell>
                    <TableCell>
                      <span className="font-bold text-destructive">FULLY RETARDED 🤡</span>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      Absolutely ratio'd. High negative engagement. The crowd is not on your side.
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

        </div>
      </main>

      <Footer />
    </div>
  );
};

export default About;
