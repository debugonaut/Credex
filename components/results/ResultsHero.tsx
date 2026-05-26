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
      className="relative w-full py-12 text-center overflow-hidden"
    >
      {/* Background dynamic ambient glow element */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 60% 40% at 50% 50%, rgba(0, 229, 160, 0.05) 0%, transparent 70%)',
        }}
      />

      {/* Eyebrow label */}
      <p className="text-xs font-mono uppercase tracking-widest text-accent mb-4 relative z-10">
        Potential Monthly Savings
      </p>

      {/* Hero number — this is what gets screenshotted */}
      {/* aria-label provides the full readable value for screen readers */}
      <div
        aria-label={`Total monthly savings: $${animatedMonthlySavings}`}
        aria-live="polite"
        className="font-mono font-bold leading-none tracking-tight select-all cursor-pointer relative z-10"
        style={{ fontSize: 'clamp(2.5rem, 10vw, 6rem)', color: 'var(--color-accent)' }}
      >
        ${animatedMonthlySavings}
        <span className="text-2xl sm:text-3xl ml-2 font-medium opacity-60 text-text-secondary">/mo</span>
      </div>

      {/* Annual savings — secondary stat */}
      <p className="mt-4 text-lg text-text-secondary font-mono relative z-10">
        ${annualSavings} saved per year
      </p>

      {/* Context line */}
      <p className="mt-6 text-text-muted text-xs sm:text-sm relative z-10">
        Across {toolCount} tool{toolCount !== 1 ? 's' : ''} in your stack
      </p>
    </section>
  )
}
