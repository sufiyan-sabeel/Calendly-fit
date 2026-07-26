/**
 * Calendy Fit - Supabase Client
 * Platform-aware client factory for both mobile and web
 */

import { createClient } from '@supabase/supabase-js';
import type { SupabaseClient } from '@supabase/supabase-js';
import { config } from '@calendy/config';

let supabaseClient: SupabaseClient | null = null;

export type { SupabaseClient };

/**
 * Get or create the Supabase client instance
 * Uses platform-specific configuration from the shared config
 */
export function getSupabaseClient(): SupabaseClient {
  if (supabaseClient) return supabaseClient;

  const url = config.supabaseUrl;
  const anonKey = config.supabaseAnonKey;

  if (!url || !anonKey) {
    throw new Error(
      'Supabase URL and Anon Key must be configured. ' +
      'Set EXPO_PUBLIC_SUPABASE_URL / EXPO_PUBLIC_SUPABASE_ANON_KEY for mobile, ' +
      'or NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY for web.'
    );
  }

  supabaseClient = createClient(url, anonKey, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
    realtime: {
      params: {
        eventsPerSecond: 10,
      },
    },
    global: {
      headers: {
        'x-app-name': 'calendy-fit',
      },
    },
  });

  return supabaseClient;
}

/**
 * Create a Supabase client with service role key (server-side only)
 */
export function getServiceClient(): SupabaseClient {
  const url = config.supabaseUrl;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

  return createClient(url, serviceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

/**
 * Reset the client (useful for testing or re-initialization)
 */
export function resetClient(): void {
  supabaseClient = null;
}
