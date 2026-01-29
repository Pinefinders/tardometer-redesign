import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="border-t border-border/50 bg-background/95 mt-auto">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Main Footer Content */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
          {/* Branding */}
          <div className="text-center sm:text-left">
            <Link 
              to="/" 
              className="font-display text-xl font-bold text-gradient-title hover:opacity-80 transition-opacity"
            >
              TARDOMETER
            </Link>
            <p className="mt-1 text-sm text-muted-foreground">
              🤖 Algorithmic Tweet & Profile Analysis
            </p>
          </div>

          {/* Links */}
          <div className="flex items-center gap-6">
            <Link 
              to="/about" 
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              Algorithm
            </Link>
            <Link 
              to="/contact" 
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              Contact
            </Link>
          </div>
        </div>

        {/* Bottom - Copyright */}
        <div className="pt-6 border-t border-border/30 text-center">
          <p className="text-xs text-muted-foreground">
            © 2026 Tardometer. Real Twitter data via Apify.
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
