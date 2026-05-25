import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { logEvent } from '@/lib/analytics'

const bodySchema = z.object({
  slug: z.string().max(20).nullable(),
  eventType: z.enum(['form_started', 'audit_completed', 'email_captured', 'cta_clicked', 'link_shared']),
  metadata: z.record(z.string(), z.any()).optional(),
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
