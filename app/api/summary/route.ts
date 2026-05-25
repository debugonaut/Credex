import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createServerSupabaseClient } from '@/lib/supabase'
import { generateAuditSummary } from '@/lib/anthropic'
import type { AuditInput, AuditResult } from '@/types'

const bodySchema = z.object({
  slug: z.string().min(1).max(20),
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
    return NextResponse.json({ error: 'Invalid slug' }, { status: 422 })
  }

  const { slug } = parsed.data
  const supabase = createServerSupabaseClient()

  // Fetch the audit record
  const { data: audit, error } = await supabase
    .from('audits')
    .select('id, input, result, ai_summary')
    .eq('slug', slug)
    .single()

  if (error || !audit) {
    return NextResponse.json({ error: 'Audit not found' }, { status: 404 })
  }

  // Idempotency: if we already have a summary, return it without calling the API
  if (audit.ai_summary) {
    return NextResponse.json({ summary: audit.ai_summary })
  }

  // Generate the summary
  const summary = await generateAuditSummary(
    audit.input as AuditInput,
    audit.result as AuditResult
  )

  // Store it — even if it's a fallback, store it so subsequent loads are instant
  await supabase
    .from('audits')
    .update({ ai_summary: summary.text })
    .eq('id', audit.id)

  return NextResponse.json({ summary: summary.text })
}
