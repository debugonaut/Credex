import { NextRequest, NextResponse } from 'next/server'
import { auditInputSchema } from '@/lib/validation'
import { runAudit } from '@/engine'
import { generateUniqueSlug } from '@/lib/slug'
import { createServerSupabaseClient } from '@/lib/supabase'
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'
import { logger } from '@/lib/logger'

// Rate limiting: 5 audit submissions per IP per hour.
// We defensively initialize Upstash Redis to ensure the build and local development
// do not crash if UPSTASH environment variables are not yet configured.
let ratelimit: Ratelimit | null = null
try {
  if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
    ratelimit = new Ratelimit({
      redis: Redis.fromEnv(),
      limiter: Ratelimit.slidingWindow(5, '1 h'),
      analytics: false,
    })
  }
} catch (error) {
  logger.warn('[audit/create] Upstash rate limiting initialization failed/skipped:', error)
}

export async function POST(req: NextRequest) {
  // Step 1: Rate limiting (if configured)
  if (ratelimit) {
    const ip = req.headers.get('x-forwarded-for') ?? '127.0.0.1'
    try {
      const { success: withinLimit } = await ratelimit.limit(ip)
      if (!withinLimit) {
        return NextResponse.json(
          { error: 'Too many audit requests. Please try again in an hour.' },
          { status: 429 }
        )
      }
    } catch (error) {
      logger.error('[audit/create] Rate limiting check failed:', error)
    }
  }


  // Step 2: Parse and validate request body
  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const parsed = auditInputSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Invalid audit input', details: parsed.error.flatten() },
      { status: 422 }
    )
  }

  const input = { ...parsed.data, submittedAt: new Date().toISOString() }

  // Step 3: Run the audit engine — pure function, no async, always fast
  const result = runAudit(input)

  // Step 4: Generate unique slug
  let slug: string
  try {
    slug = await generateUniqueSlug()
  } catch (error) {
    logger.error('[audit/create] Slug generation failed:', error)
    return NextResponse.json(
      { error: 'Failed to create audit. Please try again.' },
      { status: 500 }
    )
  }

  // Step 5: Store in Supabase
  const supabase = createServerSupabaseClient()
  const { error: insertError } = await supabase.from('audits').insert({
    slug,
    input,
    result,
    ai_summary: null,              // populated async by /api/summary
    monthly_savings_usd: Math.round(result.totalMonthlySavingsCents / 100),
  })

  if (insertError) {
    logger.error('[audit/create] Supabase insert failed:', insertError)
    return NextResponse.json(
      { error: 'Failed to save audit. Please try again.' },
      { status: 500 }
    )
  }

  // Step 6: Log analytics event
  try {
    await supabase.from('events').insert({
      event_type: 'audit_completed',
      metadata: {
        totalMonthlySavingsCents: result.totalMonthlySavingsCents,
        toolCount: input.tools.length,
        triggersCredexCTA: result.triggersCredexCTA,
      },
    })
  } catch (error) {
    // Analytics logging failure should not fail the user-facing request
    logger.error('[audit/create] Failed to log analytics event:', error)
  }


  // Step 7: Return slug — client redirects to /results/[slug]
  return NextResponse.json({ slug }, { status: 201 })
}
