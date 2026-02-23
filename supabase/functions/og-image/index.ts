import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

function getZoneColor(zone: string): { bg: string; text: string; accent: string } {
  switch (zone) {
    case 'GOAT': return { bg: '#0a1a0a', text: '#22c55e', accent: '#16a34a' };
    case 'MID': return { bg: '#1a1a0a', text: '#eab308', accent: '#ca8a04' };
    case 'REKT': return { bg: '#1a0a0a', text: '#ef4444', accent: '#dc2626' };
    default: return { bg: '#0a0a0a', text: '#ffffff', accent: '#888888' };
  }
}

function generateSVG(score: number, zone: string): string {
  const colors = getZoneColor(zone);
  
  const cx = 300, cy = 220, r = 150;
  const startAngle = Math.PI;
  const endAngle = 0;
  const scoreAngle = startAngle - (score / 100) * Math.PI;
  
  const arcStartX = cx + r * Math.cos(startAngle);
  const arcStartY = cy + r * Math.sin(startAngle);
  const arcEndX = cx + r * Math.cos(endAngle);
  const arcEndY = cy + r * Math.sin(endAngle);
  
  const needleX = cx + (r - 20) * Math.cos(scoreAngle);
  const needleY = cy + (r - 20) * Math.sin(scoreAngle);

  return `<svg width="600" height="315" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg-grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#0a0a0a"/>
      <stop offset="100%" style="stop-color:${colors.bg}"/>
    </linearGradient>
    <linearGradient id="arc-grad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:#22c55e"/>
      <stop offset="50%" style="stop-color:#eab308"/>
      <stop offset="100%" style="stop-color:#ef4444"/>
    </linearGradient>
  </defs>
  
  <rect width="600" height="315" fill="url(#bg-grad)"/>
  <rect x="1" y="1" width="598" height="313" fill="none" stroke="${colors.accent}" stroke-opacity="0.3" stroke-width="2"/>
  
  <text x="300" y="45" text-anchor="middle" font-family="Arial Black, Arial, sans-serif" font-size="28" font-weight="900" fill="white" letter-spacing="4">TARDOMETER</text>
  
  <path d="M ${arcStartX} ${arcStartY} A ${r} ${r} 0 0 1 ${arcEndX} ${arcEndY}" 
        fill="none" stroke="#333333" stroke-width="20" stroke-linecap="round"/>
  <path d="M ${arcStartX} ${arcStartY} A ${r} ${r} 0 0 1 ${arcEndX} ${arcEndY}" 
        fill="none" stroke="url(#arc-grad)" stroke-width="20" stroke-linecap="round" opacity="0.6"/>
  
  <line x1="${cx}" y1="${cy}" x2="${needleX}" y2="${needleY}" 
        stroke="${colors.text}" stroke-width="4" stroke-linecap="round"/>
  <circle cx="${cx}" cy="${cy}" r="8" fill="${colors.text}"/>
  
  <text x="300" y="265" text-anchor="middle" font-family="Arial Black, Arial, sans-serif" font-size="48" font-weight="900" fill="${colors.text}">${score}</text>
  <text x="300" y="300" text-anchor="middle" font-family="Arial Black, Arial, sans-serif" font-size="24" font-weight="900" fill="${colors.text}" opacity="0.8">${zone}</text>
</svg>`;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const score = Math.max(0, Math.min(100, parseInt(url.searchParams.get('score') || '50', 10)));
    const zone = url.searchParams.get('zone') || 'MID';

    const svg = generateSVG(score, zone);

    return new Response(svg, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'image/svg+xml',
        'Cache-Control': 'public, max-age=86400, s-maxage=86400',
      },
    });
  } catch (error) {
    console.error('Error generating OG image:', error);
    return new Response('Error generating image', { status: 500, headers: corsHeaders });
  }
});
