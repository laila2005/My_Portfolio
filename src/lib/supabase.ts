import { createClient } from '@supabase/supabase-js';

/**
 * The content store behind the admin page. Both values are public by design (the
 * anon key only ever does what the row-level-security rules in
 * supabase/schema.sql allow), so they are safe to ship in the browser bundle.
 *
 * When they are missing the site simply keeps using its built-in content, so a
 * misconfigured store can never blank the portfolio.
 */
const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

export const supabaseConfigured = Boolean(url && anonKey);

export const supabase = supabaseConfigured
  ? createClient(url as string, anonKey as string, {
      auth: { persistSession: true, autoRefreshToken: true },
    })
  : null;

export const IMAGE_BUCKET = 'portfolio-images';
