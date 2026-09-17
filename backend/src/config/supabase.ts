import { createClient } from '@supabase/supabase-js';
import { config } from './env.js';

if (!config.supabase.url || !config.supabase.anonKey) {
  console.warn('[SUPABASE] Missing SUPABASE_URL or SUPABASE_ANON_KEY in environment.');
}

export const supabase = createClient(config.supabase.url, config.supabase.anonKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});
