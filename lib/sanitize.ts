import type { PublicAudit } from '@/types'

// The raw audit row from Supabase — includes PII fields from input
interface RawAuditRow {
  id: string
  slug: string
  input: {
    tools: Array<{ toolId: string; planId: string; seats: number; monthlySpendUSD: number }>
    teamSize: number
    primaryUseCase: string
    submittedAt: string
  }
  result: {
    recommendations: PublicAudit['recommendations']
    totalMonthlySavingsCents: number
    totalAnnualSavingsCents: number
    isAlreadyOptimal: boolean
    triggersCredexCTA: boolean
  }
  ai_summary: string | null
  created_at: string
}

export function sanitizeAuditForPublic(row: RawAuditRow): PublicAudit {
  return {
    slug: row.slug,

    // Strip monthlySpendUSD — actual spend amounts could identify a company
    // Keep toolId, planId, seats — these are generic enough to be non-identifying
    tools: row.input.tools.map(({ toolId, planId, seats }) => ({
      toolId: toolId as PublicAudit['tools'][number]['toolId'],
      planId,
      seats,
    })),

    recommendations: row.result.recommendations,
    totalMonthlySavingsCents: row.result.totalMonthlySavingsCents,
    totalAnnualSavingsCents: row.result.totalAnnualSavingsCents,
    isAlreadyOptimal: row.result.isAlreadyOptimal,
    aiSummary: row.ai_summary,
    createdAt: row.created_at,
  }
  // Note what is NOT here:
  // - input.teamSize (combined with tools could narrow company identity)
  // - input.monthlySpendUSD per tool (actual spend is sensitive)
  // - anything from the leads table (email, company name, role)
  // - the internal UUID (only the slug is public)
}
