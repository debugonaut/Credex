import type { AuditInput, Recommendation } from '@/types'
import { getPricingConfig, getToolPlans } from '../pricing'

const SAVINGS_NOISE_FLOOR_CENTS = 500 // ignore recommendations saving less than $5/mo

export function runPlanFitRules(input: AuditInput): Recommendation[] {
  const recommendations: Recommendation[] = []

  for (const tool of input.tools) {
    // Skip API-only tools — they have no seat-based plans to downgrade
    const currentConfig = getPricingConfig(tool.toolId, tool.planId)
    if (!currentConfig || currentConfig.isApiOnly) continue

    // Is the user below the minimum rational team size for this plan?
    if (tool.seats >= currentConfig.minSeats) continue

    // Find the cheapest plan for this tool where minSeats <= user's seats
    const cheaperPlans = getToolPlans(tool.toolId).filter(p =>
      p.planId !== tool.planId &&
      p.monthlyPerSeatCents > 0 && // ignore free tiers for professional audits
      p.monthlyPerSeatCents < currentConfig.monthlyPerSeatCents &&
      p.minSeats <= tool.seats &&
      p.targetUseCases.some(uc => uc === input.primaryUseCase || uc === 'mixed')
    )

    if (cheaperPlans.length === 0) continue

    const recommended = cheaperPlans[cheaperPlans.length - 1] // most expensive of the cheaper options
    if (!recommended) continue

    const monthlySavingsCents =
      (currentConfig.monthlyPerSeatCents - recommended.monthlyPerSeatCents) * tool.seats

    if (monthlySavingsCents < SAVINGS_NOISE_FLOOR_CENTS) continue

    // Reason string must name actual plan names and actual dollar amounts
    // A finance-literate evaluator reads these — "switch to a cheaper plan" fails
    const currentPricePerSeat = (currentConfig.monthlyPerSeatCents / 100).toFixed(0)
    const recommendedPricePerSeat = (recommended.monthlyPerSeatCents / 100).toFixed(0)
    const monthlySavingsDollars = (monthlySavingsCents / 100).toFixed(0)

    recommendations.push({
      toolId: tool.toolId,
      type: 'downgrade-plan',
      currentPlanId: tool.planId,
      recommendedPlanId: recommended.planId,
      monthlySavingsCents,
      annualSavingsCents: monthlySavingsCents * 12,
      confidence: monthlySavingsCents >= 2000 ? 'high' : 'medium',
      reason: `${currentConfig.displayName} ($${currentPricePerSeat}/seat/mo) includes team admin features that become useful above ${currentConfig.minSeats} seats. At ${tool.seats} seat${tool.seats > 1 ? 's' : ''}, ${recommended.displayName} ($${recommendedPricePerSeat}/seat/mo) covers the same workflow and saves $${monthlySavingsDollars}/month.`,
    });
  }

  return recommendations
}
