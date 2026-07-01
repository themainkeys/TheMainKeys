/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Read from Vite env. On Netlify these are configured as
// VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY (Site settings > Environment variables).
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

if (!isSupabaseConfigured) {
  // Non-fatal: the app still boots on its in-memory seed data.
  console.warn(
    '[supabase] VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY are not set — ' +
      'running on local seed data only.'
  );
}

// A single shared client for the whole app. Falls back to empty strings so the
// module never throws at import time when env vars are missing.
export const supabase: SupabaseClient = createClient(
  supabaseUrl ?? '',
  supabaseAnonKey ?? ''
);
