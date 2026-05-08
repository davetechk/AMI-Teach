// Edge Function: process-payment
// Verifies a Paystack transaction server-side, updates transactions table status, and releases teacher_earnings

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

serve(async (req: Request) => {
  const { paystack_ref } = await req.json();

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
  );

  // TODO: call Paystack verify endpoint, update transactions, release teacher_earnings

  return new Response(JSON.stringify({ message: 'not implemented' }), {
    headers: { 'Content-Type': 'application/json' },
    status: 200,
  });
});
