import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { 
  Code2, 
  GitBranch, 
  Users, 
  Clock, 
  Mail,
  ArrowRight,
  CheckCircle2,
  Eye,
  Vote
} from "lucide-react";

const OpenSource = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-8 pb-6 px-4 text-center">
        <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 rounded-full bg-primary/20 border border-primary/50">
          <Code2 className="w-4 h-4 text-primary" />
          <span className="text-primary font-bold text-xs uppercase tracking-wider">Transparency</span>
        </div>
        <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold text-gradient-title tracking-tight">
          Open Source
        </h1>
        <p className="mt-4 text-muted-foreground text-lg max-w-lg mx-auto">
          Building trust through transparency
        </p>
      </section>

      {/* Main Content */}
      <main className="flex-1 px-4 pb-16 max-w-4xl mx-auto w-full">
        <div className="space-y-8">
          
          {/* Coming Soon Banner */}
          <div className="glass-card p-6 sm:p-8 border-primary/30">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-lg bg-primary/20 border border-primary/30">
                <Clock className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h2 className="text-2xl font-display font-bold text-foreground">Coming Soon</h2>
                <Badge className="bg-primary/20 text-primary border-primary/50 mt-1">Q2 2026</Badge>
              </div>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              We're planning to open source the Tardometer algorithm for full transparency and community contribution.
            </p>
          </div>

          {/* What Will Be Open Sourced */}
          <div className="glass-card p-6 sm:p-8">
            <h2 className="text-2xl font-display font-bold text-foreground mb-6 flex items-center gap-2">
              <GitBranch className="w-6 h-6 text-accent" />
              What Will Be Open Sourced
            </h2>
            
            <div className="grid gap-4">
              <div className="flex items-center gap-3 p-4 rounded-xl bg-secondary/30 border border-border/50">
                <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
                <span className="text-foreground">Complete scoring algorithm code</span>
              </div>
              <div className="flex items-center gap-3 p-4 rounded-xl bg-secondary/30 border border-border/50">
                <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
                <span className="text-foreground">Formula calculations (Reply Ratio, Quote Ratio, Engagement Quality)</span>
              </div>
              <div className="flex items-center gap-3 p-4 rounded-xl bg-secondary/30 border border-border/50">
                <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
                <span className="text-foreground">Community Note detection logic</span>
              </div>
              <div className="flex items-center gap-3 p-4 rounded-xl bg-secondary/30 border border-border/50">
                <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
                <span className="text-foreground">Test cases and examples</span>
              </div>
            </div>
          </div>

          {/* Why Open Source */}
          <div className="glass-card p-6 sm:p-8">
            <h2 className="text-2xl font-display font-bold text-foreground mb-6 flex items-center gap-2">
              <Eye className="w-6 h-6 text-primary" />
              Why Open Source?
            </h2>
            
            <div className="space-y-4">
              <p className="text-muted-foreground leading-relaxed">
                <strong className="text-foreground">Transparency builds trust.</strong> Anyone should be able to verify exactly how scores are calculated, audit the logic, and propose improvements.
              </p>
              
              <div className="p-5 rounded-xl bg-accent/10 border border-accent/30">
                <div className="flex items-center gap-3 mb-2">
                  <Vote className="w-5 h-5 text-accent" />
                  <h3 className="font-bold text-foreground">Community-Driven Development</h3>
                </div>
                <p className="text-muted-foreground text-sm">
                  The community will vote on algorithm changes monthly - no black box scoring.
                </p>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="glass-card p-6 sm:p-8">
            <h2 className="text-2xl font-display font-bold text-foreground mb-4 flex items-center gap-2">
              <Clock className="w-6 h-6 text-amber-400" />
              Timeline
            </h2>
            
            <p className="text-muted-foreground leading-relaxed">
              We're finalizing the scoring methodology and will release the code publicly in <strong className="text-primary">Q2 2026</strong>.
            </p>
            
            <div className="mt-4 p-4 rounded-xl bg-muted/30 border border-border/50">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-amber-400 animate-pulse"></div>
                <span className="text-sm text-muted-foreground">Currently: Finalizing scoring methodology</span>
              </div>
            </div>
          </div>

          {/* Want to Contribute */}
          <div className="glass-card p-6 sm:p-8 border-primary/30">
            <h2 className="text-2xl font-display font-bold text-foreground mb-4 flex items-center gap-2">
              <Users className="w-6 h-6 text-primary" />
              Want to Contribute?
            </h2>
            
            <p className="text-muted-foreground leading-relaxed mb-6">
              Interested in reviewing code, proposing improvements, or contributing?
            </p>
            
            <a 
              href="mailto:contribute@tardometer.com" 
              className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-primary/20 border border-primary/50 text-primary hover:bg-primary/30 transition-colors font-medium"
            >
              <Mail className="w-5 h-5" />
              contribute@tardometer.com
            </a>
            
            <p className="text-sm text-muted-foreground mt-4">
              We'll notify early contributors when the repository goes live.
            </p>
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
              to="/how-it-works" 
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-accent/10 border border-accent/30 text-accent hover:bg-accent/20 transition-colors text-sm font-medium"
            >
              How It Works
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link 
              to="/algorithm" 
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400 hover:bg-amber-500/20 transition-colors text-sm font-medium"
            >
              The Algorithm
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
};

export default OpenSource;
