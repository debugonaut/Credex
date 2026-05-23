import { createClient } from '@supabase/supabase-js'

// This client has full database access via the service role key.
// NEVER import this in a client component — it would expose the key to the browser.
export function createServerSupabaseClient() {
  const url = process.env.SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !key) {
    throw new Error(
      'Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables'
    )
  }

  return createClient(url, key, {
    auth: { persistSession: false }, // server-side — no session needed
  })
}
