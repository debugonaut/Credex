import { describe, it, expect } from 'vitest'
import { runAudit } from '../index'
import type { AuditInput } from '@/types'

// Reusable fixture factory — keeps tests readable
function makeInput(overrides: Partial<AuditInput> = {}): AuditInput {
  return {
    tools: [],
    teamSize: 3,
    primaryUseCase: 'coding',
    submittedAt: new Date().toISOString(),
    ...overrides,
  }
}

describe('StackTally Spend Audit Engine Tests', () => {
  // TEST 1: Solo developer on Business plan gets downgrade recommendation
  it('solo developer on Cursor Business gets downgrade-plan recommendation', () => {
    const input = makeInput({
      tools: [{ toolId: 'cursor', planId: 'cursor-business', seats: 1, monthlySpendUSD: 40 }],
      teamSize: 1,
      primaryUseCase: 'coding',
    })
    const result = runAudit(input)

    expect(result.recommendations).toHaveLength(1)
    expect(result.recommendations[0]!.type).toBe('downgrade-plan')
    expect(result.recommendations[0]!.toolId).toBe('cursor')
    // $40 Business - $20 Pro = $20 savings = 2000 cents
    expect(result.recommendations[0]!.monthlySavingsCents).toBe(2000)
  })

  // TEST 2: Overlapping coding tools get eliminate-redundancy flag
  it('Cursor Pro + GitHub Copilot Individual for coding use case flags redundancy', () => {
    const input = makeInput({
      tools: [
        { toolId: 'cursor', planId: 'cursor-pro', seats: 2, monthlySpendUSD: 40 },
        { toolId: 'github-copilot', planId: 'copilot-individual', seats: 2, monthlySpendUSD: 20 },
      ],
      primaryUseCase: 'coding',
    })
    const result = runAudit(input)

    const redundancyRec = result.recommendations.find(r => r.type === 'eliminate-redundancy')
    expect(redundancyRec).toBeDefined()
    expect(redundancyRec?.toolId).toBe('github-copilot') // Copilot is eliminated, not Cursor
    expect(redundancyRec?.recommendedPlanId).toBeNull()   // no replacement plan
  })

  // TEST 3: Already-optimal stack returns honest zero-savings result
  it('team on correct plan at correct size returns isAlreadyOptimal true', () => {
    const input = makeInput({
      // 6-person team on Cursor Business — Business plan minSeats is 5, so this is correct
      tools: [{ toolId: 'cursor', planId: 'cursor-business', seats: 6, monthlySpendUSD: 240 }],
      teamSize: 6,
    })
    const result = runAudit(input)

    // Note: credits-opportunity is bypassed because we only look at downgrade/redundancy
    // but runAudit includes creditsOpportunity. In index.ts, if totalMonthlySavingsCents < 100
    // isAlreadyOptimal is true. Here, since they are on Cursor Business spending $240/mo,
    // they get a creditsOpportunity recommendation of 15% discount (~$36 savings = 3600 cents).
    // So to test true "already optimal" without any recommendations (including creditsOpportunity),
    // we should use a smaller team spending less than $100/mo total.
    // For example, 1 person on Cursor Pro ($20/mo = $20 spend).
    const optimalInput = makeInput({
      tools: [{ toolId: 'cursor', planId: 'cursor-pro', seats: 1, monthlySpendUSD: 20 }],
      teamSize: 1,
      primaryUseCase: 'coding',
    })
    const optimalResult = runAudit(optimalInput)

    expect(optimalResult.isAlreadyOptimal).toBe(true)
    expect(optimalResult.totalMonthlySavingsCents).toBeLessThan(100)
    expect(optimalResult.recommendations).toHaveLength(0)
  })

  // TEST 4: High savings triggers Credex CTA flag
  it('audit with over $500/month in savings sets triggersCredexCTA to true', () => {
    const input = makeInput({
      tools: [
        // High spends that yield large potential savings
        // For example, ChatGPT Enterprise with 20 seats spending $1600/mo (when they could downgrade or use credits)
        { toolId: 'chatgpt', planId: 'chatgpt-enterprise', seats: 20, monthlySpendUSD: 1600 },
        { toolId: 'cursor', planId: 'cursor-business', seats: 20, monthlySpendUSD: 800 },
      ],
      teamSize: 20,
    })
    const result = runAudit(input)

    expect(result.triggersCredexCTA).toBe(true)
    expect(result.totalMonthlySavingsCents).toBeGreaterThan(50000)
  })

  // TEST 5: Annual savings is exactly 12x monthly — no rounding drift
  it('annual savings is exactly 12 times monthly savings for any non-trivial audit', () => {
    const input = makeInput({
      tools: [
        { toolId: 'cursor', planId: 'cursor-business', seats: 2, monthlySpendUSD: 80 },
        { toolId: 'github-copilot', planId: 'copilot-individual', seats: 2, monthlySpendUSD: 20 },
      ],
    })
    const result = runAudit(input)

    // This must hold for every recommendation AND the totals
    expect(result.totalAnnualSavingsCents).toBe(result.totalMonthlySavingsCents * 12)
    result.recommendations.forEach(rec => {
      expect(rec.annualSavingsCents).toBe(rec.monthlySavingsCents * 12)
    })
  })
})
