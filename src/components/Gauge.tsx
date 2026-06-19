import { useEffect, useState } from "react";

interface GaugeProps {
  score: number | null; // 0-100, null = idle state
  animated?: boolean;
  showDemoBadge?: boolean;
}

type Zone = "tard" | "mid" | "based";

// Zone boundaries — must stay in sync with calculateTardScore in src/lib/twitter.ts
const ZONE_BOUNDARIES = { based: 35, mid: 70 };

// --- Verified dial geometry (do not change without re-deriving by hand) ---
// Pivot sits 30% down from the top of the dial face, horizontally centred.
const CX = 200;
const CY = 200;
const FACE_RADIUS = 178;
const PIVOT_Y = 122;
const NEEDLE_LENGTH = 181.44;

// Needle sweeps from bearing -120deg (score 0, left) through 180deg (straight down)
// to bearing +120deg (score 100, right) — a 240deg sweep, using the convention where
// 0deg = straight up and bearings increase clockwise.
const MIN_BEARING = -120;
const MAX_BEARING = 120;

const scoreToBearing = (score: number): number => MIN_BEARING + (score / 100) * (MAX_BEARING - MIN_BEARING);

// Walking from MIN_BEARING to MAX_BEARING the long way (through 180deg) requires
// continuing past -180 rather than wrapping back through 0. This mirrors the
// verified prototype math exactly.
const sweepBearing = (score: number): number => MIN_BEARING - (score / 100) * 120;

const bearingToPoint = (bearingDeg: number, radius: number) => {
  const rad = (bearingDeg * Math.PI) / 180;
  return {
    x: CX + radius * Math.sin(rad),
    y: PIVOT_Y - radius * Math.cos(rad),
  };
};

const getScoreInfo = (s: number): { label: string; colorVar: string; zone: Zone } => {
  if (s <= ZONE_BOUNDARIES.based) return { label: "NOT RETARDED", colorVar: "var(--gauge-based)", zone: "based" };
  if (s <= ZONE_BOUNDARIES.mid) return { label: "SEMI-RETARDED", colorVar: "var(--gauge-mid)", zone: "mid" };
  return { label: "FULLY RETARDED", colorVar: "var(--gauge-tard)", zone: "tard" };
};

const describeArc = (radius: number, fromScore: number, toScore: number): string => {
  const start = bearingToPoint(sweepBearing(fromScore), radius);
  const end = bearingToPoint(sweepBearing(toScore), radius);
  return `M ${start.x} ${start.y} A ${radius} ${radius} 0 0 0 ${end.x} ${end.y}`;
};

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

  const effectiveScore = displayScore ?? 50; // idle resting position: straight down, centre of dial
  const needleTip = bearingToPoint(sweepBearing(effectiveScore), NEEDLE_LENGTH);

  const scoreInfo = displayScore !== null ? getScoreInfo(displayScore) : null;

  // The wedge (active zone) between the pivot and the two extreme needle positions
  const leftEdge = bearingToPoint(sweepBearing(0), NEEDLE_LENGTH);
  const rightEdge = bearingToPoint(sweepBearing(100), NEEDLE_LENGTH);
  const wedgePath = `M ${CX} ${PIVOT_Y} L ${leftEdge.x} ${leftEdge.y} A ${NEEDLE_LENGTH} ${NEEDLE_LENGTH} 0 0 0 ${rightEdge.x} ${rightEdge.y} Z`;

  return (
    <div className="flex flex-col items-center gap-2 px-4">
      <div className="relative w-full max-w-[320px] sm:max-w-[360px] aspect-square">
        <svg viewBox="0 0 400 400" className="w-full h-full">
          {/* Outer bezel */}
          <circle cx={CX} cy={CY} r="195" fill="#0a0a0a" />

          {/* Dial face */}
          <circle cx={CX} cy={CY} r={FACE_RADIUS} fill="#555555" />

          {/* Active zone wedge (lighter, marks where the needle can travel) */}
          <path d={wedgePath} fill="#6b6b6b" />

          {/* Colour scale, in even thirds along the swept arc */}
          <path d={describeArc(NEEDLE_LENGTH, 0, 33.33)} fill="none" stroke="hsl(var(--gauge-based))" strokeWidth="14" />
          <path d={describeArc(NEEDLE_LENGTH, 33.33, 66.66)} fill="none" stroke="hsl(var(--gauge-mid))" strokeWidth="14" />
          <path d={describeArc(NEEDLE_LENGTH, 66.66, 100)} fill="none" stroke="hsl(var(--gauge-tard))" strokeWidth="14" />

          {/* Needle */}
          <line
            x1={CX}
            y1={PIVOT_Y}
            x2={needleTip.x}
            y2={needleTip.y}
            stroke="#f0eee8"
            strokeWidth="5"
            strokeLinecap="round"
            style={{
              transition: "x2 1s cubic-bezier(0.34, 1.56, 0.64, 1), y2 1s cubic-bezier(0.34, 1.56, 0.64, 1)",
              opacity: isIdle ? 0.5 : 1,
            }}
          />
          <circle cx={CX} cy={PIVOT_Y} r="6" fill="#f0eee8" />
        </svg>

        {/* Score readout, overlaid in the lower portion of the face */}
        <div className="absolute inset-x-0 bottom-[12%] flex flex-col items-center gap-1">
          {showDemoBadge && (
            <span className="px-2 py-0.5 text-[10px] font-bold bg-amber-500 text-amber-950 rounded-full mb-1">
              DEMO
            </span>
          )}
          {displayScore !== null && scoreInfo ? (
            <div className="text-center animate-fade-up">
              <div className="text-4xl sm:text-5xl font-display font-bold" style={{ color: scoreInfo.colorVar }}>
                {Math.round(displayScore)}
              </div>
              <div
                className="text-xs sm:text-sm font-display font-bold tracking-widest mt-1"
                style={{ color: scoreInfo.colorVar }}
              >
                {scoreInfo.label}
              </div>
            </div>
          ) : (
            <div className="text-muted-foreground/50 text-sm tracking-widest font-display">— — —</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Gauge;
