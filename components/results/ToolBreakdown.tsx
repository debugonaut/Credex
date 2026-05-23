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
      className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6 backdrop-blur-md transition-all hover:border-white/[0.15] hover:bg-white/[0.04]"
    >
      {/* Top row: tool name (left) + current spend (right) */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-semibold text-white text-lg">
            {toolConfig?.displayName ?? toolId}
          </h3>
          {recommendation && (
            <span className="text-xs font-medium tracking-wide uppercase text-gray-500 mt-1 block">
              {typeLabel[recommendation.type]}
            </span>
          )}
        </div>
        <span
          className="font-mono text-base font-medium"
          style={{ color: recommendation ? '#FF4D4D' : '#888' }}
          aria-label={`Current spend: $${currentSpend} per month`}
        >
          ${currentSpend}/mo
        </span>
      </div>

      {/* Recommendation reason */}
      {recommendation ? (
        <>
          <p className="text-sm text-gray-300 leading-relaxed mb-6">
            {recommendation.reason}
          </p>

          {/* Bottom row: confidence (left) + savings (right) */}
          <div className="flex items-center justify-between border-t border-white/[0.06] pt-4">
            <span 
              className={`text-xs px-2.5 py-1 rounded-full font-medium ${
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
              className="font-mono font-bold text-base"
              style={{ color: '#00E5A0' }}
              aria-label={`Potential savings: $${savingsDollars} per month`}
            >
              −${savingsDollars}/mo
            </span>
          </div>
        </>
      ) : (
        <p className="text-sm text-gray-500 italic mt-2">
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
        <h2 className="text-xl font-bold tracking-tight text-white">
          Tool-by-Tool Breakdown
        </h2>
        <p className="text-xs text-gray-400">
          A modular audit of each individual subscription in your current stack.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
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
