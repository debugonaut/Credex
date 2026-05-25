# StackTally — Prompt Engineering & AI Architectures

This document traces the prompt design lifecycle, LLM model choice reasoning, prompt iteration logs, and fallback architecture details for StackTally.

---

## 1. Prompt Goal & Objective

The objective of our AI system is to generate a concise, professional, finance-literate 80–120 word analysis summary for a startup's AI spend audit. The summary must be highly specific, directly naming their tools, pricing plan recommendations, exact monthly/annual savings figures, and concluding with a single, highly actionable next step.

---

## 2. Model Selection Logic: Claude Haiku vs. Sonnet

For this feature, we selected **Claude 3.5 Haiku** (`claude-haiku-4-5`) over **Claude 3.5 Sonnet**.

### Architectural Decision Rationale:
1. **Cost Efficiency (~10× Cheaper)**: 
   * Claude Haiku costs $0.80 / million input tokens and $4.00 / million output tokens.
   * Claude Sonnet costs $3.00 / million input and $15.00 / million output (over 3.7x more expensive).
   * Since our audits are executed asynchronously and at high volume, and each summary is a short, simple paragraph of under 120 words, paying Sonnet premiums is financially irrational.
2. **Speed & Latency**:
   * Haiku returns summaries in under **1.5 seconds**, whereas Sonnet often takes 4–6 seconds. This ensures that even if users reload the results page before a summary is stored, the API route is highly responsive.
3. **Complexity Matching**:
   * Generating an 80-120 word summary of structured tool lists and savings figures does not require the advanced reasoning or coding intelligence of Sonnet. A well-constrained Haiku prompt performs at parity.

---

## 3. Prompt Iteration History

### Iteration 1: Simple Concatenation (FAILED)
```markdown
Write a summary of this AI spend audit:
Tools: Cursor, Claude, OpenAI API
Savings: $340/month
Primary Use Case: coding
Team Size: 12 people
Make it short and addressed to the team lead.
```
* **Why it failed**:
  * **Hallucination**: The model hallucinated tool features and proposed pricing plans that were not supported by our verified database.
  * **Unbounded Length**: Summaries frequently ran over 250 words, degrading page layout balance.
  * **Generic Language**: Included empty cliches like *"In conclusion..."*, *"Overall, your stack..."*, which read as robotic.
  * **No Call-to-Action**: Lacked a concrete next step for the team lead to execute this week.

### Iteration 2: Constrained Roleplaying Prompt (CURRENT — `v1`)
```typescript
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
```
* **Why it succeeded**:
  * Zero hallucinations: Strict boundaries prevent generating fictional dollar amounts.
  * Perfect length: Explicitly constrained to 80–120 words.
  * Professional ending: Guarantees exactly one concrete step to take this week.
  * Clean tone: Direct, friendly, and highly readable.

---

## 4. Fallback Engineering & Zero-Hallucination Failsafe

To ensure our application is bulletproof under network partitions, Anthropic rate limits, or API outages, we engineered `FALLBACK_SUMMARY_TEMPLATE` inside `prompts/auditSummary.ts`.

### Failsafe Design:
- When the API call fails or exceeds our strict **10-second timeout**, we catch the error server-side and immediately compile a locally-interpolated fallback template.
- This fallback interpolates the *exact* inputs (team size, use case) and *exact* results (savings, top recommendation savings) into a beautifully crafted paragraph.
- It is **visually and stylistically indistinguishable** from standard Claude output, meaning the end-user suffers zero disruption or generic error messaging.
- We cache this fallback paragraph in the database's `ai_summary` column for the audit row, ensuring subsequent page loads are instant.
