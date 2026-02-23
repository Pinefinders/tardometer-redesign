import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Resvg, initWasm } from "https://esm.sh/@aspect-dev/resvg-wasm@1.0.4";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

let wasmInitialized = false;

async function ensureWasmInitialized() {
  if (!wasmInitialized) {
    const wasmUrl = "https://esm.sh/@aspect-dev/resvg-wasm@1.0.4/resvg.wasm";
    const wasmResponse = await fetch(wasmUrl);
    const wasmBuffer = await wasmResponse.arrayBuffer();
    await initWasm(wasmBuffer);
    wasmInitialized = true;
  }
}

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
  
  const width = 1200;
  const height = 630;
  const cx = 600, cy = 380, r = 220;
  const startAngle = Math.PI;
  const endAngle = 0;
  const scoreAngle = startAngle - (score / 100) * Math.PI;
  
  const arcStartX = cx + r * Math.cos(startAngle);
  const arcStartY = cy + r * Math.sin(startAngle);
  const arcEndX = cx + r * Math.cos(endAngle);
  const arcEndY = cy + r * Math.sin(endAngle);
  
  const needleX = cx + (r - 30) * Math.cos(scoreAngle);
  const needleY = cy + (r - 30) * Math.sin(scoreAngle);

  // Zone label positions along the arc
  const goatAngle = Math.PI - (17.5 / 100) * Math.PI;
  const midAngle = Math.PI - (52.5 / 100) * Math.PI;
  const rektAngle = Math.PI - (85 / 100) * Math.PI;
  const labelR = r + 40;

  return `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
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
  
  <rect width="${width}" height="${height}" fill="url(#bg-grad)"/>
  <rect x="2" y="2" width="${width - 4}" height="${height - 4}" fill="none" stroke="${colors.accent}" stroke-opacity="0.3" stroke-width="3" rx="12"/>
  
  <text x="${width / 2}" y="75" text-anchor="middle" font-family="Arial Black, Arial, sans-serif" font-size="52" font-weight="900" fill="white" letter-spacing="8">TARDOMETER</text>
  
  <!-- Background track -->
  <path d="M ${arcStartX} ${arcStartY} A ${r} ${r} 0 0 1 ${arcEndX} ${arcEndY}" 
        fill="none" stroke="#333333" stroke-width="30" stroke-linecap="round"/>
  <!-- Colored arc -->
  <path d="M ${arcStartX} ${arcStartY} A ${r} ${r} 0 0 1 ${arcEndX} ${arcEndY}" 
        fill="none" stroke="url(#arc-grad)" stroke-width="24" stroke-linecap="round" opacity="0.7"/>
  
  <!-- Zone labels -->
  <text x="${cx + labelR * Math.cos(goatAngle)}" y="${cy + labelR * Math.sin(goatAngle)}" text-anchor="middle" font-family="Arial, sans-serif" font-size="22" font-weight="700" fill="#22c55e" opacity="0.6">GOAT</text>
  <text x="${cx + labelR * Math.cos(midAngle)}" y="${cy + labelR * Math.sin(midAngle)}" text-anchor="middle" font-family="Arial, sans-serif" font-size="22" font-weight="700" fill="#eab308" opacity="0.6">MID</text>
  <text x="${cx + labelR * Math.cos(rektAngle)}" y="${cy + labelR * Math.sin(rektAngle)}" text-anchor="middle" font-family="Arial, sans-serif" font-size="22" font-weight="700" fill="#ef4444" opacity="0.6">REKT</text>
  
  <!-- Needle -->
  <line x1="${cx}" y1="${cy}" x2="${needleX}" y2="${needleY}" 
        stroke="${colors.text}" stroke-width="6" stroke-linecap="round"/>
  <circle cx="${cx}" cy="${cy}" r="12" fill="${colors.text}"/>
  <circle cx="${cx}" cy="${cy}" r="6" fill="#0a0a0a"/>
  
  <!-- Score -->
  <text x="${width / 2}" y="${cy + 60}" text-anchor="middle" font-family="Arial Black, Arial, sans-serif" font-size="96" font-weight="900" fill="${colors.text}">${score}</text>
  <text x="${width / 2}" y="${cy + 110}" text-anchor="middle" font-family="Arial Black, Arial, sans-serif" font-size="42" font-weight="900" fill="${colors.text}" opacity="0.8">${zone}</text>
  
  <!-- Footer -->
  <text x="${width / 2}" y="${height - 25}" text-anchor="middle" font-family="Arial, sans-serif" font-size="22" fill="#666666">tardometer.com</text>
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

    await ensureWasmInitialized();
    
    const resvg = new Resvg(svg, {
      fitTo: { mode: 'width', value: 1200 },
    });
    const pngData = resvg.render();
    const pngBuffer = pngData.asPng();

    return new Response(pngBuffer, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'image/png',
        'Cache-Control': 'public, max-age=86400, s-maxage=86400',
      },
    });
  } catch (error) {
    console.error('Error generating OG image:', error);
    // Fallback: return SVG if PNG conversion fails
    try {
      const url = new URL(req.url);
      const score = Math.max(0, Math.min(100, parseInt(url.searchParams.get('score') || '50', 10)));
      const zone = url.searchParams.get('zone') || 'MID';
      const svg = generateSVG(score, zone);
      return new Response(svg, {
        headers: { ...corsHeaders, 'Content-Type': 'image/svg+xml' },
      });
    } catch {
      return new Response('Error generating image', { status: 500, headers: corsHeaders });
    }
  }
});
