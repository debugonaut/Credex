import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createServerSupabaseClient } from '@/lib/supabase'
import { getResendClient } from '@/lib/resend'
import { AuditConfirmationEmail } from '@/emails/AuditConfirmation'
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'
import { logger } from '@/lib/logger'

// Rate limiting: 5 lead submissions per IP per 15 minutes.
let ratelimit: Ratelimit | null = null
try {
  if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
    ratelimit = new Ratelimit({
      redis: Redis.fromEnv(),
      limiter: Ratelimit.slidingWindow(5, '15 m'),
      analytics: false,
    })
  }
} catch (error) {
  logger.warn('[lead/capture] Upstash rate limiting initialization failed/skipped:', error)
}

const bodySchema = z.object({
  slug: z.string().min(1).max(20),
  email: z.string().email('Invalid email address'),
  companyName: z.string().max(100).optional(),
  role: z.string().max(100).optional(),
})

export async function POST(req: NextRequest) {
  // Step 1: Rate limiting
  if (ratelimit) {
    const ip = req.headers.get('x-forwarded-for') ?? '127.0.0.1'
    try {
      const { success: withinLimit } = await ratelimit.limit(ip)
      if (!withinLimit) {
        return NextResponse.json(
          { error: 'Too many submissions. Please try again in 15 minutes.' },
          { status: 429 }
        )
      }
    } catch (error) {
      logger.error('[lead/capture] Rate limiting check failed:', error)
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
    return NextResponse.json(
      { error: 'Invalid input', details: parsed.error.flatten() },
      { status: 422 }
    )
  }

  const { slug, email, companyName, role } = parsed.data
  
  let auditId: string | null = null
  let result = { totalMonthlySavingsCents: 8000, isAlreadyOptimal: false }
  let input = { teamSize: 10 }
  let isHighValue = false

  let supabase = null
  try {
    supabase = createServerSupabaseClient()
  } catch (error) {
    logger.warn('[lead/capture] Supabase client initialization failed:', error)
  }

  if (slug === 'test-slug') {
    // Preview Mode Mock Data (matches ResultsPage mock results)
    auditId = null
    result = { totalMonthlySavingsCents: 8000, isAlreadyOptimal: false }
    input = { teamSize: 10 }
    isHighValue = false
  } else {
    if (!supabase) {
      return NextResponse.json({ error: 'Database is not configured.' }, { status: 500 })
    }

    try {
      // Fetch the audit to get savings data and audit ID
      const { data: audit, error: auditError } = await supabase
        .from('audits')
        .select('id, result, input')
        .eq('slug', slug)
        .single()

      if (auditError || !audit) {
        return NextResponse.json({ error: 'Audit not found' }, { status: 404 })
      }

      auditId = audit.id
      result = audit.result as { totalMonthlySavingsCents: number; isAlreadyOptimal: boolean }
      input = audit.input as { teamSize: number }
      isHighValue = result.totalMonthlySavingsCents > 50_000 // > $500/month
    } catch (dbError) {
      logger.error('[lead/capture] Database query failed:', dbError)
      return NextResponse.json({ error: 'Failed to retrieve audit. Please try again.' }, { status: 500 })
    }
  }

  let dbSuccess = false

  // Insert lead record if supabase is active
  if (supabase) {
    try {
      const { error: insertError } = await supabase.from('leads').insert({
        audit_id: auditId,
        email,
        company_name: companyName ?? null,
        role: role ?? null,
        team_size: input.teamSize,
        monthly_savings_usd: result.totalMonthlySavingsCents,
        high_value: isHighValue,
        email_sent: false,
      })

      if (insertError) {
        throw insertError
      }
      dbSuccess = true
    } catch (insertError) {
      logger.error('[lead/capture] Lead insert failed:', insertError)
      // For preview mode, allow progression to still mock transactional emails
      if (slug !== 'test-slug') {
        return NextResponse.json({ error: 'Failed to save lead. Please try again.' }, { status: 500 })
      }
    }
  } else if (slug !== 'test-slug') {
    return NextResponse.json({ error: 'Database is unconfigured.' }, { status: 500 })
  }

  // Send confirmation email asynchronously — do not block the HTTP return payload
  const sendEmailAsync = async () => {
    try {
      const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://your-domain.com'
      const resultsUrl = `${appUrl}/results/${slug}`
      const htmlContent = AuditConfirmationEmail({
        resultsUrl,
        totalMonthlySavingsCents: result.totalMonthlySavingsCents,
        isAlreadyOptimal: result.isAlreadyOptimal,
      })

      const resend = getResendClient()
      await resend.emails.send({
        from: process.env.EMAIL_FROM ?? 'onboarding@resend.dev',
        to: email,
        subject: result.isAlreadyOptimal
          ? 'Your AI stack is already optimized'
          : `You found $${(result.totalMonthlySavingsCents / 100).toFixed(0)}/mo in AI savings`,
        html: htmlContent,
      })

      // Use a new client instance for safety in asynchronous scope
      if (supabase && dbSuccess && auditId) {
        const asyncSupabase = createServerSupabaseClient()
        await asyncSupabase
          .from('leads')
          .update({ email_sent: true })
          .eq('audit_id', auditId)
          .eq('email', email)
      }

    } catch (emailError) {
      logger.error('[lead/capture] Background email send failed:', emailError)
      // Capture failure in Sentry
      const Sentry = await import('@sentry/nextjs')
      Sentry.captureException(emailError)
    }
  }


  // Fire and forget background transactional email send
  sendEmailAsync()

  // Log analytics event (only if supabase is active and db insert succeeded)
  if (supabase && dbSuccess) {
    try {
      await supabase.from('events').insert({
        audit_id: auditId,
        event_type: 'email_captured',
        metadata: { highValue: isHighValue },
      })
    } catch (analyticsError) {
      logger.error('[lead/capture] Failed to log analytics event:', analyticsError)
    }
  }

  return NextResponse.json({ success: true }, { status: 201 })
}
