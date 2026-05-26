import type { Recommendation, SavingsBreakdown, ToolId } from '@/types'
import { getToolConfig } from '@/constants/tools'

interface ToolBreakdownProps {
  recommendations: Recommendation[]
  savingsBreakdown: SavingsBreakdown[]
}

interface ToolCardProps {
  toolId: ToolId
  recommendation: Recommendation | undefined
  breakdown: SavingsBreakdown
}

function RecommendationCard({ toolId, recommendation, breakdown }: ToolCardProps) {
  const toolConfig = getToolConfig(toolId)
  const currentSpend = breakdown.currentMonthlyUSD.toLocaleString('en-US', {
    maximumFractionDigits: 0,
  })
  const savingsDollars = recommendation
    ? (recommendation.monthlySavingsCents / 100).toLocaleString('en-US', {
        maximumFractionDigits: 0,
      })
    : '0'

  const confidenceLabel = {
    high: 'High Confidence',
    medium: 'Medium Confidence',
    low: 'Low Confidence',
  }

  const typeLabel = {
    'downgrade-plan': 'Downgrade Plan',
    'switch-vendor': 'Switch Vendor',
    'eliminate-redundancy': 'Eliminate Redundancy',
    'credits-opportunity': 'Credits Available',
  }

  return (
    <article
      aria-label={`${toolConfig?.displayName ?? toolId} audit recommendation`}
      className="rounded bg-bg-elevated border border-border p-6 shadow-md transition-colors hover:border-border-strong"
      style={
        recommendation
          ? { borderLeft: '3px solid var(--color-danger)' }
          : { borderLeft: '3px solid var(--color-border)' }
      }
    >
      {/* Top row: tool name (left) + current spend (right) */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-semibold text-white text-base sm:text-lg">
            {toolConfig?.displayName ?? toolId}
          </h3>
          {recommendation && (
            <span className="text-xs font-mono tracking-wide uppercase text-text-muted mt-1 block">
              {typeLabel[recommendation.type]}
            </span>
          )}
        </div>
        <span
          className="font-mono text-sm sm:text-base font-semibold"
          style={{ color: recommendation ? 'var(--color-danger)' : 'var(--color-text-muted)' }}
          aria-label={`Current spend: $${currentSpend} per month`}
        >
          ${currentSpend}/mo
        </span>
      </div>

      {/* Recommendation reason */}
      {recommendation ? (
        <div className="space-y-4">
          <p className="text-sm text-text-secondary leading-relaxed">
            {recommendation.reason}
          </p>

          {/* Bottom row: confidence (left) + savings (right) */}
          <div className="flex items-center justify-between border-t border-border pt-4">
            <span 
              className={`text-xs px-2.5 py-1 rounded font-medium ${
                recommendation.confidence === 'high' 
                  ? 'bg-emerald-500/10 text-emerald-400' 
                  : recommendation.confidence === 'medium'
                  ? 'bg-amber-500/10 text-amber-400'
                  : 'bg-blue-500/10 text-blue-400'
              }`}
            >
              {confidenceLabel[recommendation.confidence]}
            </span>
            <span
              className="font-mono font-bold text-sm sm:text-base"
              style={{ color: 'var(--color-accent)' }}
              aria-label={`Potential savings: $${savingsDollars} per month`}
            >
              −${savingsDollars}/mo
            </span>
          </div>
        </div>
      ) : (
        <p className="text-xs text-text-muted italic mt-2">
          No optimization changes recommended for this tool. You are on the ideal plan.
        </p>
      )}
    </article>
  )
}

export function ToolBreakdown({ recommendations, savingsBreakdown }: ToolBreakdownProps) {
  return (
    <section aria-label="Per-tool recommendations" className="w-full space-y-6">
      <div className="flex flex-col space-y-1">
        <h2 className="text-base font-bold tracking-tight text-white">
          Tool-by-Tool Breakdown
        </h2>
        <p className="text-xs text-text-secondary">
          A modular audit of each individual subscription in your current stack.
        </p>
      </div>
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
        {savingsBreakdown.map(breakdown => (
          <RecommendationCard
            key={breakdown.toolId}
            toolId={breakdown.toolId}
            recommendation={recommendations.find(r => r.toolId === breakdown.toolId)}
            breakdown={breakdown}
          />
        ))}
      </div>
    </section>
  )
}
