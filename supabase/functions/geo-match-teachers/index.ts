// Edge Function: geo-match-teachers
// Uses PostGIS ST_DWithin to find verified teachers within a given radius of the student's location for home tutoring

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

serve(async (req: Request) => {
  const { latitude, longitude, subject, radius_km = 10 } = await req.json();

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
  );

  // TODO: query teachers with ST_DWithin(location, ST_Point(longitude, latitude)::geography, radius_km * 1000)
  // Filter by vetting_status = 'verified' and subject match

  return new Response(JSON.stringify({ teachers: [] }), {
    headers: { 'Content-Type': 'application/json' },
    status: 200,
  });
});
