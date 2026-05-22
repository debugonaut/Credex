import type { AuditInput, Recommendation, ToolId, UseCase } from '@/types'

interface OverlapDefinition {
  toolA: ToolId
  toolB: ToolId
  applicableUseCases: UseCase[]
  overlapPercentage: number  // 0-100, drives confidence scoring
  keepTool: ToolId           // which tool to keep (the one that subsumes the other)
  eliminateTool: ToolId      // which tool to recommend removing
  reasonTemplate: (seats: number, eliminateSavings: string) => string
}

// Define functional overlap between tools in the stack.
const OVERLAP_DEFINITIONS: OverlapDefinition[] = [
  {
    toolA: 'cursor',
    toolB: 'github-copilot',
    applicableUseCases: ['coding', 'mixed'],
    overlapPercentage: 85,
    keepTool: 'cursor',
    eliminateTool: 'github-copilot',
    reasonTemplate: (seats, savings) =>
      `Cursor includes inline code completion, multi-file chat, and editor integration — the full feature set of GitHub Copilot plus additional context-aware capabilities. For a coding team of ${seats}, running both is redundant. Eliminating GitHub Copilot saves ${savings}/month with no workflow loss.`,
  },
  {
    toolA: 'claude',
    toolB: 'chatgpt',
    applicableUseCases: ['writing', 'research', 'mixed'],
    overlapPercentage: 70,
    keepTool: 'claude',
    eliminateTool: 'chatgpt',
    reasonTemplate: (seats, savings) =>
      `Claude and ChatGPT have ~70% functional overlap for writing and research workflows. Running both at full seat count means paying twice for general-purpose LLM access. Consolidating to one saves ${savings}/month — evaluate which your team actually prefers and commit to it.`,
  },
  {
    toolA: 'anthropic-api',
    toolB: 'openai-api',
    applicableUseCases: ['coding', 'data', 'mixed'],
    overlapPercentage: 65,
    keepTool: 'anthropic-api',
    eliminateTool: 'openai-api',
    reasonTemplate: (seats, savings) =>
      `You're paying for both Anthropic API and OpenAI API. Unless your application requires model-specific outputs or you're A/B testing providers, consolidating to one API reduces cost and maintenance complexity. Evaluate benchmark results for your specific use case and eliminate the underperformer.`,
  },
]

export function runToolOverlapRules(input: AuditInput): Recommendation[] {
  const recommendations: Recommendation[] = []
  const activeToolIds = new Set(input.tools.map(t => t.toolId))

  for (const overlap of OVERLAP_DEFINITIONS) {
    // Both tools must be present and use case must apply
    if (!activeToolIds.has(overlap.toolA) || !activeToolIds.has(overlap.toolB)) continue
    if (!overlap.applicableUseCases.includes(input.primaryUseCase)) continue
    if (overlap.overlapPercentage < 60) continue

    // Find the tool to eliminate and calculate its full monthly cost as the savings
    const eliminateTool = input.tools.find(t => t.toolId === overlap.eliminateTool)
    if (!eliminateTool) continue

    const monthlySavingsCents = Math.round(eliminateTool.monthlySpendUSD * 100)
    if (monthlySavingsCents < 500) continue // noise floor

    const savingsDollars = `$${(monthlySavingsCents / 100).toFixed(0)}`

    recommendations.push({
      toolId: overlap.eliminateTool,
      type: 'eliminate-redundancy',
      currentPlanId: eliminateTool.planId,
      recommendedPlanId: null, // eliminating entirely — no replacement plan
      monthlySavingsCents,
      annualSavingsCents: monthlySavingsCents * 12,
      confidence: overlap.overlapPercentage >= 80 ? 'high' : 'medium',
      reason: overlap.reasonTemplate(eliminateTool.seats, savingsDollars),
    })
  }

  return recommendations
}
