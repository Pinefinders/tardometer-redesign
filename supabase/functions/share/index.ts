import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Resvg, initWasm } from "npm:@resvg/resvg-wasm@2.6.2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Bot user agents that fetch OG tags
const BOT_USER_AGENTS = [
  'twitterbot', 'facebookexternalhit', 'linkedinbot', 'slackbot',
  'discordbot', 'telegrambot', 'whatsapp', 'googlebot', 'bingbot',
  'embedly', 'quora', 'outbrain', 'pinterest', 'vkshare', 'tumblr',
];

function isBot(userAgent: string): boolean {
  const ua = userAgent.toLowerCase();
  return BOT_USER_AGENTS.some(bot => ua.includes(bot));
}

function getZoneColor(zone: string): string {
  switch (zone) {
    case 'GOAT': return '#22c55e';
    case 'MID': return '#eab308';
    case 'REKT': return '#ef4444';
    default: return '#ffffff';
  }
}

let wasmInitialized = false;

async function ensureWasm() {
  if (wasmInitialized) return;
  const wasmResponse = await fetch("https://unpkg.com/@resvg/resvg-wasm@2.6.2/index_bg.wasm");
  await initWasm(wasmResponse);
  wasmInitialized = true;
}

function generatePng(score: number, zone: string): Uint8Array {
  const color = getZoneColor(zone);
  const svg = `<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#0a0a0a"/>
      <stop offset="100%" stop-color="#1a1a1a"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>
  <text x="600" y="120" text-anchor="middle" font-family="Arial,sans-serif" font-size="52" font-weight="900" fill="white" letter-spacing="8">TARDOMETER</text>
  <text x="600" y="340" text-anchor="middle" font-family="Arial,sans-serif" font-size="160" font-weight="900" fill="${color}">${score}</text>
  <text x="600" y="420" text-anchor="middle" font-family="Arial,sans-serif" font-size="56" font-weight="900" fill="${color}" opacity="0.8">${zone}</text>
  <text x="600" y="600" text-anchor="middle" font-family="Arial,sans-serif" font-size="22" fill="#666666">tardometer.com</text>
</svg>`;

  const resvg = new Resvg(svg, { fitTo: { mode: 'width', value: 1200 } });
  const pngData = resvg.render();
  return pngData.asPng();
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const score = Math.max(0, Math.min(100, parseInt(url.searchParams.get('score') || '50', 10)));
    const zone = url.searchParams.get('zone') || 'MID';
    const format = url.searchParams.get('format');
    const userAgent = req.headers.get('user-agent') || '';

    // If format=image, serve the PNG directly from this same function
    if (format === 'image') {
      await ensureWasm();
      const pngBuffer = generatePng(score, zone);
      return new Response(pngBuffer, {
        headers: {
          ...corsHeaders,
          'Content-Type': 'image/png',
          'Cache-Control': 'public, max-age=86400, s-maxage=86400',
        },
      });
    }

    // Otherwise serve the HTML with OG tags
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    // Point og:image to THIS function with format=image so it comes from the same origin
    const ogImageUrl = `${supabaseUrl}/functions/v1/share?score=${score}&zone=${zone}&format=image&v=4`;
    const siteUrl = 'https://tardometer.com';

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Tard Score: ${score}/100 — ${zone} | Tardometer</title>
  <meta name="description" content="This tweet scored ${score}/100 — ${zone} on the Tardometer. The Tard Score doesn't lie." />
  
  <!-- Open Graph -->
  <meta property="og:title" content="Tard Score: ${score}/100 — ${zone} 💀" />
  <meta property="og:description" content="This tweet scored ${score}/100 — ${zone} on the Tardometer. The Tard Score doesn't lie." />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="${siteUrl}/?score=${score}&zone=${zone}" />
  <meta property="og:image" content="${ogImageUrl}" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  
  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:site" content="@Tardometer" />
  <meta name="twitter:title" content="Tard Score: ${score}/100 — ${zone} 💀" />
  <meta name="twitter:description" content="The Tard Score doesn't lie." />
  <meta name="twitter:image" content="${ogImageUrl}" />
  
  ${!isBot(userAgent) ? `<meta http-equiv="refresh" content="0;url=${siteUrl}" />` : ''}
</head>
<body>
  <p>Redirecting to <a href="${siteUrl}">Tardometer</a>...</p>
  ${!isBot(userAgent) ? `<script>window.location.replace("${siteUrl}");</script>` : ''}
</body>
</html>`;

    return new Response(html, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600',
      },
    });
  } catch (error) {
    console.error('Error in share function:', error);
    return new Response('Error', { status: 500, headers: corsHeaders });
  }
});
