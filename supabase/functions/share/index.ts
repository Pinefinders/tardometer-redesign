import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

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

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const score = url.searchParams.get('score') || '50';
    const zone = url.searchParams.get('zone') || 'MID';
    const userAgent = req.headers.get('user-agent') || '';

    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const ogImageUrl = `${supabaseUrl}/functions/v1/og-image?score=${score}&zone=${zone}&v=2`;
    const siteUrl = 'https://tardometer.com';

    // Always serve the HTML with OG tags (bots need it, humans get redirected via JS)
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
  <meta name="twitter:description" content="The Tard Score doesn't lie. Check yours at tardometer.com" />
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
