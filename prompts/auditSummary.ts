import type { AuditInput, AuditResult } from '@/types'
import { getToolConfig } from '@/constants/tools'

// PROMPT VERSION: v1
// Change CURRENT_PROMPT_VERSION in lib/anthropic.ts whenever you update this.
// Document the change and reason in PROMPTS.md.
export function buildAuditSummaryPrompt(input: AuditInput, result: AuditResult): string {
  const toolLines = result.recommendations.map(rec => {
    const toolName = getToolConfig(rec.toolId)?.displayName ?? rec.toolId
    const savingsDollars = (rec.monthlySavingsCents / 100).toFixed(0)
    return `- ${toolName} (${rec.currentPlanId}): ${rec.reason} Potential saving: $${savingsDollars}/month.`
  }).join('\n')

  const totalMonthly = (result.totalMonthlySavingsCents / 100).toFixed(0)
  const totalAnnual = (result.totalAnnualSavingsCents / 100).toLocaleString('en-US')

  return `You are a concise financial advisor summarizing an AI tool spend audit for a startup team.

The team has ${input.teamSize} people. Their primary use case is ${input.primaryUseCase}.

Here are the audit findings:
${result.isAlreadyOptimal ? '- No significant savings found. The team appears to be on appropriate plans.' : toolLines}

Total potential savings: $${totalMonthly}/month ($${totalAnnual}/year).

Write an 80–120 word summary paragraph addressed to the team lead.
Rules:
- Be specific: use the actual tool names and dollar amounts above.
- Do not invent recommendations or dollar amounts not listed above.
- Do not use phrases like "in conclusion", "in summary", or "overall".
- End with exactly one concrete action they should take this week.
- If savings are zero, tell them their stack is well-optimized and suggest they reassess in 3 months when pricing may have changed.
- Tone: direct, friendly, finance-literate. Not salesy.`
}

// Fallback template: used when the Anthropic API call fails.
// Must be indistinguishable in quality from the real AI output.
// All numbers are injected — this never hallucinates figures.
export function FALLBACK_SUMMARY_TEMPLATE(input: AuditInput, result: AuditResult): string {
  if (result.isAlreadyOptimal) {
    return `Your ${input.teamSize}-person team is running a well-optimized AI stack for ${input.primaryUseCase} work. Based on current pricing, your plan selections align with your team size — you're not paying for seat tiers or features you don't need. AI tool pricing changes frequently; revisit this audit in 90 days to catch any new plan options or price adjustments that could affect your stack.`
  }

  const totalMonthly = (result.totalMonthlySavingsCents / 100).toFixed(0)
  const totalAnnual = (result.totalAnnualSavingsCents / 100).toLocaleString('en-US')
  const topRec = result.recommendations[0]
  const topToolName = topRec ? (getToolConfig(topRec.toolId)?.displayName ?? topRec.toolId) : 'your top tool'
  const topSavings = topRec ? (topRec.monthlySavingsCents / 100).toFixed(0) : '0'

  return `Your ${input.teamSize}-person team is spending more than necessary on AI tools for ${input.primaryUseCase} work. The audit found $${totalMonthly}/month ($${totalAnnual}/year) in potential savings across your stack. The highest-impact change is adjusting your ${topToolName} setup, which alone could recover $${topSavings}/month. This week: review the recommendations below, pick the highest-confidence one, and make the plan change — it takes under 10 minutes and the savings start immediately.`
}
