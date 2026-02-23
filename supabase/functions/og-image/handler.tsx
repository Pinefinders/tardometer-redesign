import React from "https://esm.sh/react@18.2.0";
import { ImageResponse } from "https://deno.land/x/og_edge@0.0.6/mod.ts";

function getZoneColor(zone: string): { bg: string; text: string; accent: string } {
  switch (zone) {
    case 'GOAT': return { bg: '#0a1a0a', text: '#22c55e', accent: '#16a34a' };
    case 'MID': return { bg: '#1a1a0a', text: '#eab308', accent: '#ca8a04' };
    case 'REKT': return { bg: '#1a0a0a', text: '#ef4444', accent: '#dc2626' };
    default: return { bg: '#0a0a0a', text: '#ffffff', accent: '#888888' };
  }
}

export default function handler(req: Request) {
  const url = new URL(req.url);
  const score = Math.max(0, Math.min(100, parseInt(url.searchParams.get('score') || '50', 10)));
  const zone = url.searchParams.get('zone') || 'MID';
  const colors = getZoneColor(zone);

  // Gauge geometry
  const cx = 600, cy = 340, r = 180;
  const scoreAngle = Math.PI - (score / 100) * Math.PI;
  const needleX = cx + (r - 25) * Math.cos(scoreAngle);
  const needleY = cy + (r - 25) * Math.sin(scoreAngle);

  // Arc segment endpoints
  const seg = (pct: number) => ({
    x: cx + r * Math.cos(Math.PI - pct * Math.PI),
    y: cy + r * Math.sin(Math.PI - pct * Math.PI),
  });

  const s0 = seg(0), s35 = seg(0.35), s70 = seg(0.7), s100 = seg(1);

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: `linear-gradient(135deg, #0a0a0a, ${colors.bg})`,
          fontFamily: 'Arial, sans-serif',
          position: 'relative',
        }}
      >
        {/* Title */}
        <div
          style={{
            fontSize: 52,
            fontWeight: 900,
            color: 'white',
            letterSpacing: 8,
            marginTop: -20,
            display: 'flex',
          }}
        >
          TARDOMETER
        </div>

        {/* Gauge */}
        <svg width="800" height="260" viewBox="250 80 700 300">
          {/* Background track */}
          <path
            d={`M ${s0.x} ${s0.y} A ${r} ${r} 0 0 1 ${s100.x} ${s100.y}`}
            fill="none"
            stroke="#333333"
            stroke-width="26"
            stroke-linecap="round"
          />
          {/* Green */}
          <path
            d={`M ${s0.x} ${s0.y} A ${r} ${r} 0 0 1 ${s35.x} ${s35.y}`}
            fill="none"
            stroke="#22c55e"
            stroke-width="20"
            stroke-linecap="round"
            opacity="0.7"
          />
          {/* Yellow */}
          <path
            d={`M ${s35.x} ${s35.y} A ${r} ${r} 0 0 1 ${s70.x} ${s70.y}`}
            fill="none"
            stroke="#eab308"
            stroke-width="20"
            stroke-linecap="round"
            opacity="0.7"
          />
          {/* Red */}
          <path
            d={`M ${s70.x} ${s70.y} A ${r} ${r} 0 0 1 ${s100.x} ${s100.y}`}
            fill="none"
            stroke="#ef4444"
            stroke-width="20"
            stroke-linecap="round"
            opacity="0.7"
          />
          {/* Needle */}
          <line
            x1={cx}
            y1={cy}
            x2={needleX}
            y2={needleY}
            stroke={colors.text}
            stroke-width="5"
            stroke-linecap="round"
          />
          <circle cx={cx} cy={cy} r="10" fill={colors.text} />
          <circle cx={cx} cy={cy} r="4" fill="#0a0a0a" />
        </svg>

        {/* Score */}
        <div
          style={{
            fontSize: 96,
            fontWeight: 900,
            color: colors.text,
            marginTop: -40,
            display: 'flex',
            lineHeight: 1,
          }}
        >
          {score}
        </div>

        {/* Zone */}
        <div
          style={{
            fontSize: 42,
            fontWeight: 900,
            color: colors.text,
            opacity: 0.8,
            marginTop: 4,
            display: 'flex',
          }}
        >
          {zone}
        </div>

        {/* Footer */}
        <div
          style={{
            position: 'absolute',
            bottom: 20,
            fontSize: 22,
            color: '#666666',
            display: 'flex',
          }}
        >
          tardometer.com
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      headers: {
        'Cache-Control': 'public, max-age=86400, s-maxage=86400',
      },
    }
  );
}
