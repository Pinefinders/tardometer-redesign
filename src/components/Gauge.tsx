import { useEffect, useState } from "react";
import wojakCrying from "@/assets/wojak-crying.webp";
import gigachad from "@/assets/gigachad.jpg";
import smugPepe from "@/assets/smug-pepe.webp";

interface GaugeProps {
  score: number; // 0-100
  animated?: boolean;
}

type Zone = "tard" | "mid" | "based";

const Gauge = ({ score, animated = true }: GaugeProps) => {
  const [displayScore, setDisplayScore] = useState(animated ? 0 : score);

  useEffect(() => {
    if (animated) {
      setDisplayScore(0);
      const timer = setTimeout(() => setDisplayScore(score), 100);
      return () => clearTimeout(timer);
    } else {
      setDisplayScore(score);
    }
  }, [score, animated]);

  // Convert score (0-100) to rotation angle (-90 to 90 degrees)
  const needleRotation = -90 + (displayScore / 100) * 180;

  // Updated zone detection: 0-24 = TARD, 25-75 = MID, 76-100 = BASED
  const getScoreInfo = (s: number): { label: string; colorClass: string; glowClass: string; zone: Zone } => {
    if (s <= 24) return { label: "TARD", colorClass: "text-destructive", glowClass: "glow-tard", zone: "tard" };
    if (s <= 75) return { label: "MID", colorClass: "text-accent", glowClass: "glow-mid", zone: "mid" };
    return { label: "BASED", colorClass: "text-primary", glowClass: "glow-based", zone: "based" };
  };

  const scoreInfo = getScoreInfo(displayScore);

  // Mascot styles based on active zone
  const getMascotStyles = (mascotZone: Zone) => {
    const isActive = scoreInfo.zone === mascotZone;
    
    if (isActive) {
      return {
        size: "w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24",
        animation: "animate-bounce-slow",
        filter: mascotZone === "tard" 
          ? "drop-shadow(0 0 20px hsl(0, 84%, 60%))"
          : mascotZone === "mid"
          ? "drop-shadow(0 0 20px hsl(45, 100%, 55%))"
          : "drop-shadow(0 0 20px hsl(142, 76%, 45%))",
        opacity: "opacity-100",
      };
    }
    
    // Inactive mascots
    return {
      size: "w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14",
      animation: "",
      filter: "grayscale(100%)",
      opacity: "opacity-40",
    };
  };

  const tardStyles = getMascotStyles("tard");
  const midStyles = getMascotStyles("mid");
  const basedStyles = getMascotStyles("based");

  // Border colors for each mascot
  const getBorderColor = (zone: Zone) => {
    switch (zone) {
      case "tard": return "border-destructive/50";
      case "mid": return "border-accent/50";
      case "based": return "border-primary/50";
    }
  };

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Gauge with All Mascots */}
      <div className="flex items-end justify-center gap-2 sm:gap-4">
        {/* Tard Mascot (Left) */}
        <div className="flex flex-col items-center gap-1 translate-y-2 transition-all duration-500">
          <div 
            className={`transition-all duration-500 rounded-full overflow-hidden border-2 ${getBorderColor("tard")} ${tardStyles.size} ${tardStyles.animation} ${tardStyles.opacity}`}
            style={{ filter: tardStyles.filter }}
          >
            <img 
              src={wojakCrying} 
              alt="Crying Wojak" 
              className="w-full h-full object-cover"
            />
          </div>
          <span className={`text-xs font-bold text-destructive hidden sm:block transition-opacity duration-500 ${scoreInfo.zone === "tard" ? "opacity-100" : "opacity-50"}`}>
            TARD
          </span>
        </div>

        {/* Gauge Container */}
        <div className="relative w-56 h-32 sm:w-72 sm:h-40 md:w-80 md:h-44 mt-16 sm:mt-20 md:mt-24">
          {/* Mid Mascot - positioned well above the arc's center */}
          <div className="absolute left-1/2 -translate-x-1/2 -top-20 sm:-top-24 md:-top-28 z-10 flex flex-col items-center gap-1 transition-all duration-500">
            <div 
              className={`transition-all duration-500 rounded-full overflow-hidden border-2 ${getBorderColor("mid")} ${midStyles.size} ${midStyles.animation} ${midStyles.opacity}`}
              style={{ filter: midStyles.filter }}
            >
              <img 
                src={smugPepe} 
                alt="Smug Pepe" 
                className="w-full h-full object-cover"
              />
            </div>
            <span className={`text-xs font-bold text-accent transition-opacity duration-500 ${scoreInfo.zone === "mid" ? "opacity-100" : "opacity-50"}`}>
              MID
            </span>
          </div>

          {/* Background arc */}
          <svg
            viewBox="0 0 200 110"
            className="w-full h-full"
            style={{ filter: "drop-shadow(0 4px 20px rgba(0,0,0,0.3))" }}
          >
            <defs>
              <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="hsl(0, 84%, 60%)" />
                <stop offset="25%" stopColor="hsl(45, 100%, 55%)" />
                <stop offset="75%" stopColor="hsl(45, 100%, 55%)" />
                <stop offset="100%" stopColor="hsl(142, 76%, 45%)" />
              </linearGradient>
              <filter id="glow">
                <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Background track */}
            <path
              d="M 20 100 A 80 80 0 0 1 180 100"
              fill="none"
              stroke="hsl(220, 15%, 18%)"
              strokeWidth="16"
              strokeLinecap="round"
            />

            {/* Colored arc */}
            <path
              d="M 20 100 A 80 80 0 0 1 180 100"
              fill="none"
              stroke="url(#gaugeGradient)"
              strokeWidth="12"
              strokeLinecap="round"
              filter="url(#glow)"
            />

            {/* Tick marks - updated for new zones */}
            {[0, 24, 50, 75, 100].map((tick) => {
              const angle = -180 + (tick / 100) * 180;
              const rad = (angle * Math.PI) / 180;
              const innerR = 60;
              const outerR = 68;
              const x1 = 100 + innerR * Math.cos(rad);
              const y1 = 100 + innerR * Math.sin(rad);
              const x2 = 100 + outerR * Math.cos(rad);
              const y2 = 100 + outerR * Math.sin(rad);
              return (
                <line
                  key={tick}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke="hsl(0, 0%, 50%)"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              );
            })}
          </svg>

          {/* Needle */}
          <div
            className="absolute bottom-2 left-1/2 -translate-x-1/2 origin-bottom animate-needle"
            style={{ transform: `translateX(-50%) rotate(${needleRotation}deg)` }}
          >
            <div className="w-1 h-20 sm:h-24 md:h-28 bg-gradient-to-t from-foreground via-foreground to-transparent rounded-full" />
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-5 h-5 rounded-full bg-foreground border-2 border-muted" />
          </div>

          {/* Center cap */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-card border-2 border-border" />
        </div>

        {/* Based Mascot (Right) */}
        <div className="flex flex-col items-center gap-1 translate-y-2 transition-all duration-500">
          <div 
            className={`transition-all duration-500 rounded-full overflow-hidden border-2 ${getBorderColor("based")} ${basedStyles.size} ${basedStyles.animation} ${basedStyles.opacity}`}
            style={{ filter: basedStyles.filter }}
          >
            <img 
              src={gigachad} 
              alt="Gigachad" 
              className="w-full h-full object-cover"
            />
          </div>
          <span className={`text-xs font-bold text-primary hidden sm:block transition-opacity duration-500 ${scoreInfo.zone === "based" ? "opacity-100" : "opacity-50"}`}>
            BASED
          </span>
        </div>
      </div>

      {/* Score Display */}
      <div className={`text-center animate-fade-up ${scoreInfo.glowClass} rounded-2xl px-8 py-4`}>
        <div className={`text-5xl md:text-6xl font-display font-bold ${scoreInfo.colorClass}`}>
          {Math.round(displayScore)}
        </div>
        <div className={`text-2xl md:text-3xl font-display font-bold mt-1 ${scoreInfo.colorClass}`}>
          {scoreInfo.label}
        </div>
      </div>
    </div>
  );
};

export default Gauge;
