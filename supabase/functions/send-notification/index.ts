// Edge Function: send-notification
// Sends email and SMS notifications for booking confirmations, session reminders, and vetting status changes

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

serve(async (req: Request) => {
  const { user_id, type, payload } = await req.json();

  // TODO: implement email (SMTP/Resend) and SMS (Termii/Twilio) dispatch

  return new Response(JSON.stringify({ message: 'not implemented' }), {
    headers: { 'Content-Type': 'application/json' },
    status: 200,
  });
});
