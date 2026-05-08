// Edge Function: grade-vetting-test
// Scores teacher Stage 1 proficiency test; writes mastery_score; sets vetting_status to stage_1_passed or applies 7-day locked_until on fail

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const PASS_THRESHOLD = 70;
const LOCKOUT_DAYS = 7;

serve(async (req: Request) => {
  const { teacher_id, test_id, answers } = await req.json();

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
  );

  // TODO: fetch vetting_tests questions, score answers, update mastery_score, set vetting_status or locked_until

  return new Response(JSON.stringify({ message: 'not implemented' }), {
    headers: { 'Content-Type': 'application/json' },
    status: 200,
  });
});
