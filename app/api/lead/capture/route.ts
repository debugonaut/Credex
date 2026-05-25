import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createServerSupabaseClient } from '@/lib/supabase'
import { getResendClient } from '@/lib/resend'
import { AuditConfirmationEmail } from '@/emails/AuditConfirmation'

const bodySchema = z.object({
  slug: z.string().min(1).max(20),
  email: z.string().email('Invalid email address'),
  companyName: z.string().max(100).optional(),
  role: z.string().max(100).optional(),
})

export async function POST(req: NextRequest) {
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
  const supabase = createServerSupabaseClient()

  // Fetch the audit to get savings data and audit ID
  const { data: audit, error: auditError } = await supabase
    .from('audits')
    .select('id, result, input')
    .eq('slug', slug)
    .single()

  if (auditError || !audit) {
    return NextResponse.json({ error: 'Audit not found' }, { status: 404 })
  }

  const result = audit.result as { totalMonthlySavingsCents: number; isAlreadyOptimal: boolean }
  const input = audit.input as { teamSize: number }

  const isHighValue = result.totalMonthlySavingsCents > 50_000 // > $500/month

  // Insert lead record
  const { error: insertError } = await supabase.from('leads').insert({
    audit_id: audit.id,
    email,
    company_name: companyName ?? null,
    role: role ?? null,
    team_size: input.teamSize,
    monthly_savings_usd: result.totalMonthlySavingsCents,
    high_value: isHighValue,
    email_sent: false,
  })

  if (insertError) {
    // Log but do not expose Supabase error details to the client
    console.error('[lead/capture] Insert failed:', insertError)
    return NextResponse.json({ error: 'Failed to save. Please try again.' }, { status: 500 })
  }

  // Send confirmation email
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://your-domain.com'
  const resultsUrl = `${appUrl}/results/${slug}`
  const htmlContent = AuditConfirmationEmail({
    resultsUrl,
    totalMonthlySavingsCents: result.totalMonthlySavingsCents,
    isAlreadyOptimal: result.isAlreadyOptimal,
  })

  try {
    const resend = getResendClient()
    await resend.emails.send({
      from: process.env.EMAIL_FROM ?? 'onboarding@resend.dev',
      to: email,
      subject: result.isAlreadyOptimal
        ? 'Your AI stack is already optimized'
        : `You found $${(result.totalMonthlySavingsCents / 100).toFixed(0)}/mo in AI savings`,
      html: htmlContent,
    })

    // Mark email as sent
    await supabase
      .from('leads')
      .update({ email_sent: true })
      .eq('audit_id', audit.id)
      .eq('email', email)

  } catch (emailError) {
    // Email failure is non-fatal — the lead is saved, we just didn't send the email
    console.error('[lead/capture] Email send failed:', emailError)
    // Do not return an error to the user — the lead is captured, that's what matters
  }

  // Log analytics event
  await supabase.from('events').insert({
    audit_id: audit.id,
    event_type: 'email_captured',
    metadata: { highValue: isHighValue },
  })

  return NextResponse.json({ success: true }, { status: 201 })
}
