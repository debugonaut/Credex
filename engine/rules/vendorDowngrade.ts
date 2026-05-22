import type { AuditInput, Recommendation } from '@/types'
import { getPricingConfig, getToolPlans } from '../pricing'

const SAVINGS_NOISE_FLOOR_CENTS = 500

export function runVendorDowngradeRules(input: AuditInput): Recommendation[] {
  const recommendations: Recommendation[] = []

  for (const tool of input.tools) {
    const currentConfig = getPricingConfig(tool.toolId, tool.planId)
    if (!currentConfig || currentConfig.isApiOnly) continue

    // Find cheaper plans from same vendor that fit use case AND team size
    const alternatives = getToolPlans(tool.toolId).filter(p =>
      p.planId !== tool.planId &&
      p.monthlyPerSeatCents > 0 && // ignore free tiers for professional audits
      p.monthlyPerSeatCents < currentConfig.monthlyPerSeatCents &&
      p.minSeats <= tool.seats &&
      (p.maxSeats === null || p.maxSeats >= tool.seats) &&
      p.targetUseCases.some(uc =>
        uc === input.primaryUseCase || uc === 'mixed' || input.primaryUseCase === 'mixed'
      )
    )

    if (alternatives.length === 0) continue

    // Take the best-fit alternative: highest price among cheaper options
    // (avoids recommending a free tier when a paid tier is more appropriate)
    const recommended = alternatives[alternatives.length - 1]
    if (!recommended) continue
    
    const monthlySavingsCents =
      (currentConfig.monthlyPerSeatCents - recommended.monthlyPerSeatCents) * tool.seats

    if (monthlySavingsCents < SAVINGS_NOISE_FLOOR_CENTS) continue

    const monthlySavingsDollars = (monthlySavingsCents / 100).toFixed(0)
    const currentPricePerSeat = (currentConfig.monthlyPerSeatCents / 100).toFixed(0)
    const recommendedPricePerSeat = (recommended.monthlyPerSeatCents / 100).toFixed(0)

    recommendations.push({
      toolId: tool.toolId,
      type: 'downgrade-plan',
      currentPlanId: tool.planId,
      recommendedPlanId: recommended.planId,
      monthlySavingsCents,
      annualSavingsCents: monthlySavingsCents * 12,
      confidence: monthlySavingsCents >= 2000 ? 'high' : 'medium',
      reason: `For a ${input.primaryUseCase}-focused team of ${tool.seats}, ${recommended.displayName} ($${recommendedPricePerSeat}/seat/mo) covers the same capabilities as ${currentConfig.displayName} ($${currentPricePerSeat}/seat/mo). The higher tier adds compliance and enterprise features your current use case doesn't require, saving $${monthlySavingsDollars}/month.`,
    })
  }

  return recommendations
}
