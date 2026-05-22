import type { AuditInput, AuditResult, Recommendation, SavingsBreakdown } from '@/types'
import { runPlanFitRules } from './rules/planFit'
import { runVendorDowngradeRules } from './rules/vendorDowngrade'
import { runToolOverlapRules } from './rules/toolOverlap'
import { runCreditsOpportunityRules } from './rules/creditsOpportunity'

const ALREADY_OPTIMAL_THRESHOLD_CENTS = 100   // < $1/month savings = already optimal
const CREDEX_CTA_THRESHOLD_CENTS = 50000      // > $500/month savings = show Credex CTA

export function runAudit(input: AuditInput): AuditResult {
  // Run all four rule sets independently
  const allRecommendations: Recommendation[] = [
    ...runPlanFitRules(input),
    ...runVendorDowngradeRules(input),
    ...runToolOverlapRules(input),
    ...runCreditsOpportunityRules(input),
  ]

  // Deduplication: per toolId, keep only the recommendation with the highest savings.
  // Two rules firing on the same tool (e.g. planFit + vendorDowngrade both suggest
  // downgrading Cursor) would double-count savings. The higher-savings recommendation
  // subsumes the lower one.
  const deduped = deduplicateByTool(allRecommendations)

  // All monetary math stays in integer cents until the display layer
  const totalMonthlySavingsCents = deduped.reduce(
    (sum, r) => sum + r.monthlySavingsCents, 0
  )
  // Annual is exactly 12x — no independent calculation that could drift
  const totalAnnualSavingsCents = totalMonthlySavingsCents * 12

  const savingsBreakdown: SavingsBreakdown[] = input.tools.map(tool => {
    const rec = deduped.find(r => r.toolId === tool.toolId)
    const monthlySavingsCents = rec?.monthlySavingsCents ?? 0
    return {
      toolId: tool.toolId,
      currentMonthlyUSD: tool.monthlySpendUSD,
      recommendedMonthlyUSD: tool.monthlySpendUSD - monthlySavingsCents / 100,
      monthlySavingsCents,
    }
  })

  return {
    recommendations: deduped,
    totalMonthlySavingsCents,
    totalAnnualSavingsCents,
    isAlreadyOptimal: totalMonthlySavingsCents < ALREADY_OPTIMAL_THRESHOLD_CENTS,
    triggersCredexCTA: totalMonthlySavingsCents >= CREDEX_CTA_THRESHOLD_CENTS, // >= $500/mo triggers CTA
    savingsBreakdown,
    generatedAt: new Date().toISOString(),
  }
}

function deduplicateByTool(recommendations: Recommendation[]): Recommendation[] {
  const bestPerTool = new Map<string, Recommendation>()

  for (const rec of recommendations) {
    const existing = bestPerTool.get(rec.toolId)
    if (!existing || rec.monthlySavingsCents > existing.monthlySavingsCents) {
      bestPerTool.set(rec.toolId, rec)
    }
  }

  return Array.from(bestPerTool.values())
}
