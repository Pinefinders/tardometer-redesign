import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const BOT_USER_AGENTS = [
  'twitterbot', 'facebookexternalhit', 'linkedinbot', 'slackbot',
  'discordbot', 'telegrambot', 'whatsapp', 'googlebot', 'bingbot',
  'embedly', 'quora', 'outbrain', 'pinterest', 'vkshare', 'tumblr',
];

function isBot(userAgent: string): boolean {
  const ua = userAgent.toLowerCase();
  return BOT_USER_AGENTS.some(bot => ua.includes(bot));
}

function getOgImage(zone: string): string {
  switch (zone) {
    case 'GOAT': return 'https://retardometer.com/og-goat.png';
    case 'REKT': return 'https://retardometer.com/og-rekt.png';
    default: return 'https://retardometer.com/og-mid.png';
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
    const userAgent = req.headers.get('user-agent') || '';

    const ogImageUrl = getOgImage(zone);
    const siteUrl = 'https://retardometer.com';

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Retard Score: ${score}/100 — ${zone} | Retardometer</title>
  <meta name="description" content="This tweet scored ${score}/100 — ${zone} on the Retardometer. The Retard Score doesn't lie." />
  
  <!-- Open Graph -->
  <meta property="og:title" content="Retard Score: ${score}/100 — ${zone} 💀" />
  <meta property="og:description" content="This tweet scored ${score}/100 — ${zone} on the Retardometer. The Retard Score doesn't lie." />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="${siteUrl}/?score=${score}&zone=${zone}" />
  <meta property="og:image" content="${ogImageUrl}" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  
  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:site" content="@Retardometer" />
  <meta name="twitter:title" content="Retard Score: ${score}/100 — ${zone} 💀" />
  <meta name="twitter:description" content="The Retard Score doesn't lie." />
  <meta name="twitter:image" content="${ogImageUrl}" />
  
  ${!isBot(userAgent) ? `<meta http-equiv="refresh" content="0;url=${siteUrl}" />` : ''}
</head>
<body>
  <p>Redirecting to <a href="${siteUrl}">Retardometer</a>...</p>
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
