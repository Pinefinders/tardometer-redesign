import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Info, Share2 } from "lucide-react";
import { toast } from "sonner";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText("https://tardometer.com");
      toast.success("✓ Link copied to clipboard!");
    } catch (err) {
      toast.error("Failed to copy link");
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex h-14 items-center justify-between">
          <Link 
            to="/" 
            className="font-display text-xl font-bold text-gradient-title hover:opacity-80 transition-opacity"
          >
            TARDOMETER
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link
              to="/about"
              className={`flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary ${
                location.pathname === "/about" ? "text-primary" : "text-muted-foreground"
              }`}
            >
              <Info className="w-4 h-4" />
              Algorithm
            </Link>
            <button
              onClick={handleShare}
              className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
              aria-label="Share app"
            >
              <Share2 className="w-4 h-4" />
              Share
            </button>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden py-4 border-t border-border/50 animate-fade-up">
            <div className="flex flex-col gap-2">
              <Link
                to="/about"
                onClick={() => setIsMenuOpen(false)}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  location.pathname === "/about"
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <Info className="w-4 h-4" />
                Algorithm
              </Link>
              <button
                onClick={() => {
                  handleShare();
                  setIsMenuOpen(false);
                }}
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
              >
                <Share2 className="w-4 h-4" />
                Share
              </button>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
