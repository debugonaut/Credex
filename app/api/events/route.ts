import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { logEvent } from '@/lib/analytics'
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'
import { logger } from '@/lib/logger'

// Rate limiting: 60 event logs per IP per minute.
let ratelimit: Ratelimit | null = null
try {
  if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
    ratelimit = new Ratelimit({
      redis: Redis.fromEnv(),
      limiter: Ratelimit.slidingWindow(60, '1 m'),
      analytics: false,
    })
  }
} catch (error) {
  logger.warn('[events] Upstash rate limiting initialization failed/skipped:', error)
}

const bodySchema = z.object({
  slug: z.string().max(20).nullable(),
  eventType: z.enum(['form_started', 'audit_completed', 'email_captured', 'cta_clicked', 'link_shared']),
  metadata: z.record(z.string(), z.any()).optional(),
})

export async function POST(req: NextRequest) {
  // Step 1: Rate limiting
  if (ratelimit) {
    const ip = req.headers.get('x-forwarded-for') ?? '127.0.0.1'
    try {
      const { success: withinLimit } = await ratelimit.limit(ip)
      if (!withinLimit) {
        return NextResponse.json(
          { error: 'Too many analytics pings. Please wait a minute.' },
          { status: 429 }
        )
      }
    } catch (error) {
      logger.error('[events] Rate limiting check failed:', error)
    }
  }

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const parsed = bodySchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 422 })
  }

  // If slug is provided, resolve it to an audit ID
  let auditId: string | null = null
  if (parsed.data.slug) {
    const { createServerSupabaseClient } = await import('@/lib/supabase')
    const supabase = createServerSupabaseClient()
    const { data } = await supabase
      .from('audits')
      .select('id')
      .eq('slug', parsed.data.slug)
      .single()
    auditId = data?.id ?? null
  }

  await logEvent(parsed.data.eventType, auditId, parsed.data.metadata)

  return NextResponse.json({ ok: true })
}
