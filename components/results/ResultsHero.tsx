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
      className="relative w-full text-center"
    >
      <div className="border-2 border-black p-8 md:p-12 bg-white relative bg-monochrome-grid overflow-hidden">
        {/* Eyebrow label */}
        <p className="text-xs font-mono uppercase tracking-widest text-text-secondary mb-6 relative z-10">
          Potential Monthly Savings
        </p>

        {/* Hero number — oversized editorial Playfair Display serif */}
        <div
          aria-label={`Total monthly savings: $${animatedMonthlySavings}`}
          aria-live="polite"
          className="font-serif font-bold leading-none tracking-tighter text-black select-all cursor-pointer relative z-10"
          style={{ fontSize: 'clamp(3rem, 12vw, 7.5rem)' }}
        >
          ${animatedMonthlySavings}
          <span className="text-xl sm:text-2xl ml-2 font-mono font-medium tracking-wide uppercase opacity-60 text-text-secondary">/mo</span>
        </div>

        {/* Geometric divider line */}
        <div className="w-16 h-1 bg-black mx-auto my-6 relative z-10" />

        {/* Annual savings — secondary stat */}
        <p className="text-xs sm:text-sm text-black font-mono uppercase tracking-widest relative z-10 font-bold">
          ${annualSavings} saved per year
        </p>
      </div>

      {/* Context line below the boxed cards */}
      <p className="mt-6 text-text-secondary font-serif text-sm italic relative z-10">
        Identified across {toolCount} software tool{toolCount !== 1 ? 's' : ''} in your active stack.
      </p>
    </section>
  )
}
