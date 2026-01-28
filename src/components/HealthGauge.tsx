import { useEffect, useState } from "react";

interface HealthGaugeProps {
  score: number; // 0-100
  animated?: boolean;
}

type HealthZone = "dying" | "sickly" | "healthy" | "gigachad";

const HealthGauge = ({ score, animated = true }: HealthGaugeProps) => {
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

  // Zone detection: 0-25 = DYING, 25-50 = SICKLY, 50-75 = HEALTHY, 75-100 = GIGACHAD
  const getScoreInfo = (s: number): { label: string; emoji: string; colorClass: string; glowClass: string; zone: HealthZone } => {
    if (s <= 25) return { label: "DYING", emoji: "☠️", colorClass: "text-[hsl(0,50%,30%)]", glowClass: "shadow-[0_0_20px_hsl(0,50%,30%,0.4)]", zone: "dying" };
    if (s <= 50) return { label: "SICKLY", emoji: "🤢", colorClass: "text-[hsl(30,90%,50%)]", glowClass: "shadow-[0_0_20px_hsl(30,90%,50%,0.4)]", zone: "sickly" };
    if (s <= 75) return { label: "HEALTHY", emoji: "😊", colorClass: "text-[hsl(100,60%,50%)]", glowClass: "shadow-[0_0_20px_hsl(100,60%,50%,0.4)]", zone: "healthy" };
    return { label: "GIGACHAD", emoji: "🗿", colorClass: "text-[hsl(50,100%,50%)]", glowClass: "shadow-[0_0_20px_hsl(50,100%,50%,0.4)]", zone: "gigachad" };
  };

  const scoreInfo = getScoreInfo(displayScore);

  return (
    <div className="flex flex-col items-center gap-3">
      {/* Gauge */}
      <div className="relative w-40 h-24 sm:w-52 sm:h-32">
        {/* Background arc */}
        <svg
          viewBox="0 0 200 110"
          className="w-full h-full"
          style={{ filter: "drop-shadow(0 4px 15px rgba(0,0,0,0.3))" }}
        >
          <defs>
            {/* Health gradient: Dark red → Orange → Light green → Gold/Bright green */}
            <linearGradient id="healthGaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="hsl(0, 50%, 25%)" />
              <stop offset="25%" stopColor="hsl(0, 70%, 40%)" />
              <stop offset="40%" stopColor="hsl(30, 90%, 50%)" />
              <stop offset="60%" stopColor="hsl(80, 60%, 45%)" />
              <stop offset="80%" stopColor="hsl(100, 70%, 45%)" />
              <stop offset="100%" stopColor="hsl(50, 100%, 50%)" />
            </linearGradient>
            <filter id="healthGlow">
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
            strokeWidth="14"
            strokeLinecap="round"
          />

          {/* Colored arc */}
          <path
            d="M 20 100 A 80 80 0 0 1 180 100"
            fill="none"
            stroke="url(#healthGaugeGradient)"
            strokeWidth="10"
            strokeLinecap="round"
            filter="url(#healthGlow)"
          />

          {/* Tick marks at zone boundaries */}
          {[0, 25, 50, 75, 100].map((tick) => {
            const angle = -180 + (tick / 100) * 180;
            const rad = (angle * Math.PI) / 180;
            const innerR = 62;
            const outerR = 70;
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
          className="absolute bottom-1 left-1/2 -translate-x-1/2 origin-bottom animate-needle"
          style={{ transform: `translateX(-50%) rotate(${needleRotation}deg)` }}
        >
          <div className="w-0.5 h-14 sm:h-20 bg-gradient-to-t from-foreground via-foreground to-transparent rounded-full" />
          <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-foreground border-2 border-muted" />
        </div>

        {/* Center cap */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-card border-2 border-border" />
      </div>

      {/* Score Display */}
      <div className={`text-center rounded-xl px-4 py-2 ${scoreInfo.glowClass}`}>
        <div className={`text-3xl sm:text-4xl font-display font-bold ${scoreInfo.colorClass}`}>
          {Math.round(displayScore)}
        </div>
        <div className={`text-base sm:text-lg font-display font-bold mt-0.5 ${scoreInfo.colorClass}`}>
          {scoreInfo.label} {scoreInfo.emoji}
        </div>
      </div>
    </div>
  );
};

export default HealthGauge;
