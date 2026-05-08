// DEVELOPER NOTE: When you get your Supabase keys from
// supabase.com → Settings → API, replace the
// PASTE_YOUR_PROJECT_URL_HERE and
// PASTE_YOUR_ANON_KEY_HERE values in this file.
// Also replace PASTE_YOUR_PAYSTACK_PUBLIC_KEY_HERE
// with your Paystack public key from
// dashboard.paystack.com → Settings → API Keys

/**
 * AMI-Teach Environment Configuration
 * This file reads environment variables and makes them
 * available to the frontend safely.
 * Never hardcode keys — always read from this file.
 */

const ENV = {
  SUPABASE_URL: 'https://lidpcaqswbjfialklvpu.supabase.co',
  SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxpZHBjYXFzd2JqZmlhbGtsdnB1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgxNjQ2MDUsImV4cCI6MjA5Mzc0MDYwNX0.mWOhe5sf9jsKxs-fX4DWHu6UGJSnRWULVSMDk0lrbu4',
  PAYSTACK_PUBLIC_KEY: 'PASTE_YOUR_PAYSTACK_PUBLIC_KEY_HERE',
};

window.__ENV__ = ENV;
