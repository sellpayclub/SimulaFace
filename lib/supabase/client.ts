'use client'

import { createBrowserClient } from '@supabase/ssr'
import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database'

let supabaseClient: SupabaseClient<Database> | null = null

export function createClient(): SupabaseClient<Database> {
  // Check if we have the required env vars
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  // During build time or if env vars are missing, return a mock client
  if (!supabaseUrl || !supabaseAnonKey) {
    // Return a placeholder that won't be used in production
    return {
      auth: {
        getUser: async () => ({ data: { user: null }, error: null }),
        signInWithPassword: async () => ({ data: { user: null, session: null }, error: null }),
        signUp: async () => ({ data: { user: null, session: null }, error: null }),
        signOut: async () => ({ error: null }),
      },
      from: () => ({
        select: () => ({
          eq: () => ({
            single: async () => ({ data: null, error: null }),
          }),
          order: () => ({
            then: async () => ({ data: [], error: null }),
          }),
        }),
        insert: async () => ({ data: null, error: null }),
        update: () => ({
          eq: async () => ({ data: null, error: null }),
        }),
        delete: () => ({
          eq: async () => ({ data: null, error: null }),
        }),
      }),
    } as unknown as SupabaseClient<Database>
  }

  // Client-side: reuse the singleton
  if (!supabaseClient) {
    supabaseClient = createBrowserClient<Database>(supabaseUrl, supabaseAnonKey)
  }

  return supabaseClient
}
