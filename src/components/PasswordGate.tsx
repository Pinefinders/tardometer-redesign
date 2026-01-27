import { useState, useEffect, ReactNode } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Lock } from "lucide-react";

const BETA_PASSWORD = "tardometer2026";
const AUTH_KEY = "tardometer_beta_auth";

interface PasswordGateProps {
  children: ReactNode;
}

const PasswordGate = ({ children }: PasswordGateProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const stored = localStorage.getItem(AUTH_KEY);
    setIsAuthenticated(stored === "true");
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password === BETA_PASSWORD) {
      localStorage.setItem(AUTH_KEY, "true");
      setIsAuthenticated(true);
      setError("");
    } else {
      setError("Incorrect password");
      setPassword("");
    }
  };

  // Still checking auth state
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  // Authenticated - show app
  if (isAuthenticated) {
    return <>{children}</>;
  }

  // Not authenticated - show gate
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 border border-primary/30 mb-4">
            <Lock className="w-8 h-8 text-primary" />
          </div>
          <h1 className="font-display text-3xl font-bold text-gradient-title mb-2">
            TARDOMETER
          </h1>
          <p className="text-muted-foreground text-sm">
            Private Beta Access
          </p>
        </div>

        <form onSubmit={handleSubmit} className="glass-card p-6 space-y-4">
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-foreground mb-2">
              Enter password to access Tardometer
            </label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter beta password"
              className="bg-secondary/50"
              autoFocus
            />
            {error && (
              <p className="text-destructive text-sm mt-2">{error}</p>
            )}
          </div>
          
          <Button type="submit" className="w-full" disabled={!password.trim()}>
            Access Beta
          </Button>
        </form>

        <p className="text-center text-xs text-muted-foreground mt-6">
          Need access? Contact the team.
        </p>
      </div>
    </div>
  );
};

export default PasswordGate;
