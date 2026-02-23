import { useEffect, useState } from "react";
import wojakCrying from "@/assets/wojak-crying.png";
import gigachad from "@/assets/gigachad.jpg";
import smugPepe from "@/assets/smug-pepe.webp";

interface GaugeProps {
  score: number | null; // 0-100, null = idle state
  animated?: boolean;
  showDemoBadge?: boolean;
}

type Zone = "tard" | "mid" | "based";

const Gauge = ({ score, animated = true, showDemoBadge = false }: GaugeProps) => {
  const isIdle = score === null;
  const [displayScore, setDisplayScore] = useState<number | null>(animated ? null : score);

  useEffect(() => {
    if (score === null) {
      setDisplayScore(null);
      return;
    }
    if (animated) {
      setDisplayScore(null);
      const timer = setTimeout(() => setDisplayScore(score), 100);
      return () => clearTimeout(timer);
    } else {
      setDisplayScore(score);
    }
  }, [score, animated]);

  // Convert score (0-100) to rotation angle (-90 to 90 degrees)
  // Idle (null) = straight down = 0 degrees (but we position from bottom, so -90 + 90 = 0 which is straight up... 
  // Actually needle at bottom center pointing down = no rotation needed if origin is bottom
  // -90 = full left, 0 = straight up, 90 = full right
  // For idle, we want needle pointing straight down, which is 180 from up... but since the needle hangs from bottom of the arc pointing up, "straight down" means hidden behind the center cap. Let's use 0 (straight up/neutral center).
  const needleRotation = displayScore === null ? 0 : -90 + (displayScore / 100) * 180;

  // Zone detection: 0-35 = GOAT, 36-70 = MID, 71-100 = REKT
  const getScoreInfo = (s: number): { label: string; colorClass: string; glowClass: string; zone: Zone } => {
    if (s <= 35) return { label: "GOAT", colorClass: "text-primary", glowClass: "glow-based", zone: "based" };
    if (s <= 70) return { label: "MID", colorClass: "text-accent", glowClass: "glow-mid", zone: "mid" };
    return { label: "REKT", colorClass: "text-destructive", glowClass: "glow-tard", zone: "tard" };
  };

  const scoreInfo = displayScore !== null ? getScoreInfo(displayScore) : null;

  // Mascot styles based on active zone
  const getMascotStyles = (mascotZone: Zone) => {
    const isActive = scoreInfo?.zone === mascotZone;
    
    if (isIdle) {
      // All mascots at a neutral mid size in idle
      if (mascotZone === "mid") {
        return {
          size: "w-20 h-20 sm:w-28 sm:h-28 md:w-32 md:h-32",
          animation: "",
          filter: "drop-shadow(0 0 15px hsl(45, 100%, 55%))",
          opacity: "opacity-70",
          scale: "scale-100",
          zIndex: "z-10",
        };
      }
      return {
        size: "w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20",
        animation: "",
        filter: "grayscale(50%) brightness(0.6)",
        opacity: "opacity-40",
        scale: "scale-90",
        zIndex: "z-0",
      };
    }
    
    if (isActive) {
      return {
        size: "w-28 h-28 sm:w-40 sm:h-40 md:w-48 md:h-48",
        animation: "animate-bounce",
        filter: mascotZone === "tard" 
          ? "drop-shadow(0 0 30px hsl(0, 84%, 60%)) drop-shadow(0 0 60px hsl(0, 84%, 60%)) drop-shadow(0 0 90px hsl(0, 84%, 50%))"
          : mascotZone === "mid"
          ? "drop-shadow(0 0 30px hsl(45, 100%, 55%)) drop-shadow(0 0 60px hsl(45, 100%, 55%)) drop-shadow(0 0 90px hsl(45, 100%, 45%))"
          : "drop-shadow(0 0 30px hsl(142, 76%, 45%)) drop-shadow(0 0 60px hsl(142, 76%, 45%)) drop-shadow(0 0 90px hsl(142, 76%, 35%))",
        opacity: "opacity-100",
        scale: "scale-110",
        zIndex: "z-20",
      };
    }
    
    return {
      size: "w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10",
      animation: "",
      filter: "grayscale(100%) brightness(0.3) opacity(0.4)",
      opacity: "opacity-20",
      scale: "scale-75",
      zIndex: "z-0",
    };
  };

  const tardStyles = getMascotStyles("tard");
  const midStyles = getMascotStyles("mid");
  const basedStyles = getMascotStyles("based");

  const getBorderColor = (zone: Zone) => {
    switch (zone) {
      case "tard": return "border-destructive/50";
      case "mid": return "border-accent/50";
      case "based": return "border-primary/50";
    }
  };

  return (
    <div className="flex flex-col items-center gap-6 px-4">
      {/* Gauge with All Mascots */}
      <div className="flex items-end justify-center gap-1 sm:gap-4 w-full max-w-[320px] sm:max-w-none">
        {/* GOAT Mascot (Left) - hidden in idle */}
        {!isIdle && (
        <div className={`flex flex-col items-center gap-1 translate-y-2 transition-all duration-700 ease-out ${basedStyles.zIndex}`}>
          <div 
            className={`transition-all duration-700 ease-out rounded-full overflow-hidden border-2 ${getBorderColor("based")} ${basedStyles.size} ${basedStyles.animation} ${basedStyles.opacity} ${basedStyles.scale}`}
            style={{ filter: basedStyles.filter }}
          >
            <img 
              src={gigachad} 
              alt="Gigachad" 
              className="w-full h-full object-cover"
            />
          </div>
          <span className={`text-xs font-bold text-primary hidden sm:block transition-opacity duration-500 ${scoreInfo?.zone === "based" ? "opacity-100" : "opacity-20"}`}>
            GOAT
          </span>
        </div>
        )}

        <div className="relative w-44 h-28 sm:w-72 sm:h-40 md:w-80 md:h-44 mt-12 sm:mt-20 md:mt-24">
          {/* Mid Mascot - positioned above the arc */}
          <div className={`absolute left-1/2 -translate-x-1/2 -top-24 sm:-top-36 md:-top-44 ${midStyles.zIndex} flex flex-col items-center gap-1 transition-all duration-700 ease-out`}>
            <div 
              className={`transition-all duration-700 ease-out rounded-full overflow-hidden border-2 ${getBorderColor("mid")} ${midStyles.size} ${midStyles.animation} ${midStyles.opacity} ${midStyles.scale}`}
              style={{ filter: midStyles.filter }}
            >
              <img 
                src={smugPepe} 
                alt="Smug Pepe" 
                className="w-full h-full object-cover"
              />
            </div>
            <span className={`text-xs font-bold text-accent transition-opacity duration-500 ${isIdle || scoreInfo?.zone === "mid" ? "opacity-100" : "opacity-20"}`}>
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
                <stop offset="0%" stopColor="hsl(142, 76%, 45%)" />
                <stop offset="25%" stopColor="hsl(45, 100%, 55%)" />
                <stop offset="75%" stopColor="hsl(45, 100%, 55%)" />
                <stop offset="100%" stopColor="hsl(0, 84%, 60%)" />
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
              className={isIdle ? "opacity-50" : "opacity-100"}
              style={{ transition: "opacity 0.5s ease" }}
            />

            {/* Tick marks */}
            {[0, 35, 50, 70, 100].map((tick) => {
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
            className="absolute bottom-2 left-1/2 -translate-x-1/2 origin-bottom"
            style={{ 
              transform: `translateX(-50%) rotate(${needleRotation}deg)`,
              transition: "transform 1s cubic-bezier(0.34, 1.56, 0.64, 1)",
              opacity: isIdle ? 0.4 : 1,
            }}
          >
            <div className="w-1 h-16 sm:h-24 md:h-28 bg-gradient-to-t from-foreground via-foreground to-transparent rounded-full" />
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-5 h-5 rounded-full bg-foreground border-2 border-muted" />
          </div>

          {/* Center cap */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-card border-2 border-border" />
        </div>

        {/* REKT Mascot (Right) */}
        {!isIdle && (
        <div className={`flex flex-col items-center gap-1 translate-y-2 transition-all duration-700 ease-out ${tardStyles.zIndex}`}>
          <div 
            className={`transition-all duration-700 ease-out rounded-full overflow-hidden border-2 ${getBorderColor("tard")} ${tardStyles.size} ${tardStyles.animation} ${tardStyles.opacity} ${tardStyles.scale}`}
            style={{ filter: tardStyles.filter }}
          >
            <img 
              src={wojakCrying} 
              alt="Crying Wojak" 
              className="w-full h-full object-cover"
            />
          </div>
          <span className={`text-xs font-bold text-destructive hidden sm:block transition-opacity duration-500 ${scoreInfo?.zone === "tard" ? "opacity-100" : "opacity-20"}`}>
            REKT
          </span>
        </div>
        )}
      </div>

      {/* Score Display - only show when we have a score */}
      {displayScore !== null && scoreInfo && (
        <div className={`text-center animate-fade-up ${scoreInfo.glowClass} rounded-2xl px-8 py-4 relative`}>
          {showDemoBadge && (
            <span className="absolute -top-2 left-1/2 -translate-x-1/2 px-2 py-0.5 text-[10px] font-bold bg-amber-500 text-amber-950 rounded-full">
              DEMO
            </span>
          )}
          <div className={`text-5xl md:text-6xl font-display font-bold ${scoreInfo.colorClass}`}>
            {Math.round(displayScore)}
          </div>
          <div className={`text-2xl md:text-3xl font-display font-bold mt-1 ${scoreInfo.colorClass}`}>
            {scoreInfo.label}
          </div>
        </div>
      )}

    </div>
  );
};

export default Gauge;
