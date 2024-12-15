import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const REDIRECT_URL = 'http://localhost:8080/auth/callback';

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { provider } = await req.json();
    let authUrl = '';

    switch (provider) {
      case 'google_calendar':
        const GOOGLE_CLIENT_ID = Deno.env.get('GOOGLE_CLIENT_ID');
        if (!GOOGLE_CLIENT_ID) {
          throw new Error('Google client ID not configured');
        }

        const scope = encodeURIComponent('https://www.googleapis.com/auth/calendar.readonly');
        authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
          `client_id=${GOOGLE_CLIENT_ID}&` +
          `redirect_uri=${encodeURIComponent(REDIRECT_URL)}&` +
          `response_type=code&` +
          `scope=${scope}&` +
          `access_type=offline&` +
          `prompt=consent`;
        break;

      // Add other providers here as needed
      default:
        throw new Error(`Unsupported provider: ${provider}`);
    }

    return new Response(
      JSON.stringify({ url: authUrl }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    );
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    );
  }
});