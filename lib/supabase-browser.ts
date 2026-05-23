import { createClient } from '@supabase/supabase-js'

// Uses the anon key — safe to expose to the browser.
// Row Level Security controls what this key can access.
let client: ReturnType<typeof createClient> | null = null

export function getBrowserSupabaseClient() {
  if (client) return client

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !key) {
    throw new Error(
      'Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY'
    )
  }

  client = createClient(url, key)
  return client
}
