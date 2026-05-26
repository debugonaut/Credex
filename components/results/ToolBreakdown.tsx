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
      className={`bg-white border border-black p-6 rounded-none shadow-none group transition-all duration-100 hover:bg-black hover:text-white ${
        recommendation
          ? 'border-l-4 border-l-black group-hover:border-l-white'
          : 'border-l-black border-l'
      }`}
    >
      {/* Top row: tool name (left) + current spend (right) */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-serif font-bold text-lg text-black group-hover:text-white transition-colors duration-100">
            {toolConfig?.displayName ?? toolId}
          </h3>
          {recommendation && (
            <span className="text-xs font-mono tracking-widest uppercase text-text-secondary group-hover:text-text-muted mt-1 block transition-colors duration-100">
              {"// "}{typeLabel[recommendation.type]}
            </span>
          )}
        </div>
        <span
          className="font-mono text-sm sm:text-base font-bold text-black group-hover:text-white transition-colors duration-100"
          aria-label={`Current spend: $${currentSpend} per month`}
        >
          ${currentSpend}/mo
        </span>
      </div>

      {/* Recommendation reason */}
      {recommendation ? (
        <div className="space-y-4">
          <p className="text-sm text-text-secondary group-hover:text-white/80 leading-relaxed font-serif transition-colors duration-100">
            {recommendation.reason}
          </p>

          {/* Bottom row: confidence (left) + savings (right) */}
          <div className="flex items-center justify-between border-t border-black group-hover:border-white/20 pt-4 transition-colors duration-100">
            <span 
              className="text-[10px] font-mono tracking-widest uppercase border border-black group-hover:border-white px-2 py-0.5 font-bold transition-all duration-100"
            >
              {confidenceLabel[recommendation.confidence]}
            </span>
            <span
              className="font-mono font-bold text-sm sm:text-base text-black group-hover:text-white transition-colors duration-100"
              aria-label={`Potential savings: $${savingsDollars} per month`}
            >
              −${savingsDollars}/mo
            </span>
          </div>
        </div>
      ) : (
        <p className="text-xs text-text-secondary group-hover:text-white/60 italic font-serif mt-2 transition-colors duration-100">
          No optimization changes recommended for this tool. You are on the ideal plan.
        </p>
      )}
    </article>
  )
}

export function ToolBreakdown({ recommendations, savingsBreakdown }: ToolBreakdownProps) {
  return (
    <section aria-label="Per-tool recommendations" className="w-full space-y-8">
      <div className="flex flex-col space-y-2 border-b border-black pb-4">
        <h2 className="text-xl font-serif font-bold tracking-tight text-black">
          Tool-by-Tool Audit Details
        </h2>
        <p className="text-sm text-text-secondary font-serif">
          A modular audit of each individual subscription in your current stack.
        </p>
      </div>
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2">
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
