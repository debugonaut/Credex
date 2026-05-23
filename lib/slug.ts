import { nanoid } from 'nanoid'
import { createServerSupabaseClient } from './supabase'

const SLUG_LENGTH = 10
const MAX_COLLISION_RETRIES = 3

// Generate a unique slug, checking Supabase for collisions.
// Collision probability at 10 chars (alphanumeric) is ~1 in 10^17 per attempt —
// the retry loop is defensive programming, not a real concern at this scale.
export async function generateUniqueSlug(): Promise<string> {
  const supabase = createServerSupabaseClient()

  for (let attempt = 0; attempt < MAX_COLLISION_RETRIES; attempt++) {
    const slug = nanoid(SLUG_LENGTH)

    const { data } = await supabase
      .from('audits')
      .select('slug')
      .eq('slug', slug)
      .single()

    if (!data) return slug // no collision — safe to use
  }

  // Astronomically unlikely — but if it happens, throw so the caller
  // can surface an error rather than silently inserting a duplicate
  throw new Error('Failed to generate unique slug after maximum retries')
}
