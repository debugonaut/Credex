import type { AuditInput, Recommendation, ToolId } from '@/types'

// Tools Credex can source at a discount
const CREDEX_COVERED_TOOLS: ToolId[] = [
  'cursor',
  'claude',
  'chatgpt',
  'anthropic-api',
  'openai-api',
]

// Conservative discount estimate — do not overclaim
// Actual discount varies by availability and negotiation
const CONSERVATIVE_DISCOUNT_RATE = 0.15 // 15%

// Only surface this for meaningful monthly spend
// Below $100/mo the absolute savings ($15) don't justify the switching friction
const MIN_MONTHLY_SPEND_FOR_RECOMMENDATION = 10000 // $100 in cents

export function runCreditsOpportunityRules(input: AuditInput): Recommendation[] {
  const recommendations: Recommendation[] = []

  for (const tool of input.tools) {
    if (!CREDEX_COVERED_TOOLS.includes(tool.toolId)) continue

    const monthlySpendCents = Math.round(tool.monthlySpendUSD * 100)
    if (monthlySpendCents < MIN_MONTHLY_SPEND_FOR_RECOMMENDATION) continue

    const estimatedMonthlySavingsCents = Math.round(
      monthlySpendCents * CONSERVATIVE_DISCOUNT_RATE
    )

    const currentSpendDollars = tool.monthlySpendUSD.toFixed(0)
    const estimatedSavingsDollars = (estimatedMonthlySavingsCents / 100).toFixed(0)

    recommendations.push({
      toolId: tool.toolId,
      type: 'credits-opportunity',
      currentPlanId: tool.planId,
      recommendedPlanId: null, // same plan, just sourced differently
      monthlySavingsCents: estimatedMonthlySavingsCents,
      annualSavingsCents: estimatedMonthlySavingsCents * 12,
      confidence: 'medium', // always medium — actual discount varies
      reason: `At $${currentSpendDollars}/mo, you may qualify for discounted credits through Credex — typically 15–20% off retail pricing for this tool. Estimated saving: ~$${estimatedSavingsDollars}/month. Availability depends on current credit inventory.`,
    })
  }

  return recommendations
}
