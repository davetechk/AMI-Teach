// AMI-Teach — Single Supabase client. Import from here — never initialise elsewhere.

import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const SUPABASE_URL      = window.__ENV__?.SUPABASE_URL      || '';
const SUPABASE_ANON_KEY = window.__ENV__?.SUPABASE_ANON_KEY || '';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

/**
 * checkSession()
 * Returns { session, profile } for an authenticated user, or null.
 */
export async function checkSession() {
  try {
    const { data: { session }, error: sessionError } =
      await supabase.auth.getSession();

    if (sessionError || !session) return null;

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', session.user.id)
      .single();

    if (profileError || !profile) return null;

    return { session, profile };
  } catch (err) {
    console.error('AMI-Teach checkSession:', err);
    return null;
  }
}

/**
 * redirectByRole(role)
 * Sends user to their correct dashboard.
 */
export function redirectByRole(role) {
  const routes = {
    student:  '/pages/dashboards/student.html',
    guardian: '/pages/dashboards/guardian.html',
    teacher:  '/pages/dashboards/teacher.html',
    admin:    '/pages/dashboards/admin.html',
  };
  window.location.href = routes[role] || '/pages/auth/login.html';
}
