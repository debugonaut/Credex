'use client'

import { useCountUp } from '@/hooks/useCountUp'

interface ResultsHeroProps {
  totalMonthlySavingsCents: number
  totalAnnualSavingsCents: number
  isAlreadyOptimal: boolean
  toolCount: number
}

export function ResultsHero({
  totalMonthlySavingsCents,
  totalAnnualSavingsCents,
  isAlreadyOptimal,
  toolCount,
}: ResultsHeroProps) {
  const animatedMonthlyCents = useCountUp({ end: totalMonthlySavingsCents })
  const animatedMonthlySavings = (animatedMonthlyCents / 100).toLocaleString('en-US', {
    maximumFractionDigits: 0,
  })
  const annualSavings = (totalAnnualSavingsCents / 100).toLocaleString('en-US', {
    maximumFractionDigits: 0,
  })

  if (isAlreadyOptimal) {
    return null
  }

  return (
    <section
      aria-label="Audit result summary"
      className="w-full py-16 text-center"
    >
      {/* Eyebrow label */}
      <p className="text-xs font-mono uppercase tracking-widest text-[#00E5A0] mb-4">
        Potential Monthly Savings
      </p>

      {/* Hero number — this is what gets screenshotted */}
      {/* aria-label provides the full readable value for screen readers */}
      <div
        aria-label={`Total monthly savings: $${animatedMonthlySavings}`}
        aria-live="polite"
        className="font-mono font-bold leading-none tracking-tight select-all cursor-pointer"
        style={{ fontSize: 'clamp(3.5rem, 9vw, 6.5rem)', color: '#00E5A0' }}
      >
        ${animatedMonthlySavings}
        <span className="text-2xl sm:text-3xl ml-2 font-medium opacity-60 text-gray-400">/mo</span>
      </div>

      {/* Annual savings — secondary stat */}
      <p className="mt-4 text-xl text-gray-400 font-mono">
        ${annualSavings} saved per year
      </p>

      {/* Context line */}
      <p className="mt-6 text-gray-500 text-sm">
        Across {toolCount} tool{toolCount !== 1 ? 's' : ''} in your stack
      </p>
    </section>
  )
}
