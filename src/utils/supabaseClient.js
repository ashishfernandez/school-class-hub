import { createClient } from '@supabase/supabase-js';

// Configured via Vite env vars (set in a local .env / .env.local and in Vercel).
// The anon/public key is safe to expose in frontend code.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = (supabaseUrl && supabaseAnonKey)
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// When false, the app transparently falls back to browser localStorage.
export const isSupabaseEnabled = !!supabase;
