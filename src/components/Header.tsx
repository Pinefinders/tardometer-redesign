import { Link, useLocation } from "react-router-dom";
import { Info } from "lucide-react";

const Header = () => {
  const location = useLocation();

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

          <nav className="flex items-center">
            <Link
              to="/about"
              className={`flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary ${
                location.pathname === "/about" ? "text-primary" : "text-muted-foreground"
              }`}
            >
              <Info className="w-4 h-4" />
              Algorithm
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
