import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

function getZoneColor(zone: string): { text: string } {
  switch (zone) {
    case 'GOAT': return { text: '#22c55e' };
    case 'MID': return { text: '#eab308' };
    case 'REKT': return { text: '#ef4444' };
    default: return { text: '#ffffff' };
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const score = Math.max(0, Math.min(100, parseInt(url.searchParams.get('score') || '50', 10)));
    const zone = url.searchParams.get('zone') || 'MID';
    const colors = getZoneColor(zone);

    const svg = `<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#0a0a0a"/>
      <stop offset="100%" stop-color="#1a1a1a"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>
  <text x="600" y="120" text-anchor="middle" font-family="Arial,sans-serif" font-size="52" font-weight="900" fill="white" letter-spacing="8">TARDOMETER</text>
  <text x="600" y="340" text-anchor="middle" font-family="Arial,sans-serif" font-size="160" font-weight="900" fill="${colors.text}">${score}</text>
  <text x="600" y="420" text-anchor="middle" font-family="Arial,sans-serif" font-size="56" font-weight="900" fill="${colors.text}" opacity="0.8">${zone}</text>
  <text x="600" y="600" text-anchor="middle" font-family="Arial,sans-serif" font-size="22" fill="#666666">tardometer.com</text>
</svg>`;

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
