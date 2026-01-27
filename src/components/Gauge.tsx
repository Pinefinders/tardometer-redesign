import { useEffect, useState } from "react";

interface GaugeProps {
  score: number; // 0-100
  animated?: boolean;
}

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

  // Determine the label and color based on score
  const getScoreInfo = (s: number) => {
    if (s <= 33) return { label: "TARD", colorClass: "text-destructive", glowClass: "glow-tard" };
    if (s <= 66) return { label: "MID", colorClass: "text-accent", glowClass: "glow-mid" };
    return { label: "BASED", colorClass: "text-primary", glowClass: "glow-based" };
  };

  const scoreInfo = getScoreInfo(displayScore);

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Gauge Container */}
      <div className="relative w-72 h-40 sm:w-80 sm:h-44 md:w-96 md:h-52">
        {/* Background arc */}
        <svg
          viewBox="0 0 200 110"
          className="w-full h-full"
          style={{ filter: "drop-shadow(0 4px 20px rgba(0,0,0,0.3))" }}
        >
          <defs>
            <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="hsl(0, 84%, 60%)" />
              <stop offset="50%" stopColor="hsl(45, 100%, 55%)" />
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

          {/* Tick marks */}
          {[0, 25, 50, 75, 100].map((tick) => {
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

          {/* Labels */}
          <text x="25" y="108" fontSize="8" fill="hsl(0, 84%, 60%)" fontWeight="bold">
            TARD
          </text>
          <text x="165" y="108" fontSize="8" fill="hsl(142, 76%, 45%)" fontWeight="bold">
            BASED
          </text>
        </svg>

        {/* Needle */}
        <div
          className="absolute bottom-2 left-1/2 -translate-x-1/2 origin-bottom animate-needle"
          style={{ transform: `translateX(-50%) rotate(${needleRotation}deg)` }}
        >
          <div className="w-1 h-24 sm:h-28 md:h-32 bg-gradient-to-t from-foreground via-foreground to-transparent rounded-full" />
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-5 h-5 rounded-full bg-foreground border-2 border-muted" />
        </div>

        {/* Center cap */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-card border-2 border-border" />
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
