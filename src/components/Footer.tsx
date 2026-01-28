import { Link } from "react-router-dom";
import { Twitter, Github, ExternalLink } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t border-border/50 bg-background/95 mt-auto">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Left - Branding */}
          <div className="text-center md:text-left">
            <Link 
              to="/" 
              className="font-display text-xl font-bold text-gradient-title hover:opacity-80 transition-opacity"
            >
              TARDOMETER
            </Link>
            <p className="mt-2 text-sm text-muted-foreground">
              Measuring Tardedness one Tweet at a time
            </p>
          </div>

          {/* Center - Links */}
          <div className="flex flex-col items-center gap-2">
            <h3 className="text-sm font-semibold text-foreground mb-1">Links</h3>
            <Link 
              to="/how-it-works" 
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              How It Works
            </Link>
            <Link 
              to="/algorithm" 
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              Algorithm
            </Link>
            <Link 
              to="/contact" 
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              Contact / Feedback
            </Link>
          </div>

          {/* Right - Open Source & Social */}
          <div className="flex flex-col items-center md:items-end gap-3">
            <Link 
              to="/open-source"
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/30 text-xs font-medium text-primary hover:bg-primary/20 transition-colors"
            >
              <ExternalLink className="w-3 h-3" />
              Open Source
            </Link>
            <div className="flex items-center gap-3">
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a 
                href="https://github.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                aria-label="GitHub"
              >
                <Github className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom - Copyright */}
        <div className="pt-6 border-t border-border/30 text-center">
          <p className="text-xs text-muted-foreground">
            © 2026 Tardometer. Using mock data for demonstration.
          </p>
          <p className="text-xs text-muted-foreground/60 mt-1">
            This is a parody project. Not affiliated with Twitter/X.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
