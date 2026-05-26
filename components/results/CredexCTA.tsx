interface CredexCTAProps {
  slug: string
  totalMonthlySavingsCents: number
}

export function CredexCTA({ slug, totalMonthlySavingsCents }: CredexCTAProps) {
  const savingsDollars = (totalMonthlySavingsCents / 100).toLocaleString('en-US', {
    maximumFractionDigits: 0,
  })
  const annualDollars = ((totalMonthlySavingsCents * 12) / 100).toLocaleString('en-US', {
    maximumFractionDigits: 0,
  })

  return (
    <aside
      aria-label="Credex consultation offer"
      className="w-full border border-white bg-black p-6 sm:p-8 relative bg-inverted-lines bg-inverted-radial overflow-hidden rounded-none shadow-none"
    >
      <div className="flex flex-col space-y-6 relative z-10">
        <div className="space-y-2">
          <p className="text-xs font-mono uppercase tracking-widest font-bold text-white/70">
            {"// High-Savings Advisory Qualify"}
          </p>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-tight leading-none">
            Capture ${savingsDollars}/mo in savings with discounted AI credits.
          </h2>
        </div>
        <p className="text-sm text-white/80 leading-relaxed font-serif">
          Credex sources discounted AI infrastructure credits from high-growth companies that
          overforecasted their usage commitments. At your spend level, that is an estimated{' '}
          <strong className="text-white underline decoration-white/40 decoration-2 underline-offset-4">${annualDollars}/year</strong> in direct, recoverable costs.
          A 20-minute consultation is completely free — we will show you exactly what is available
          for your stack.
        </p>
      </div>

      {/* CTA button — links to server-side redirect endpoint to ensure zero client-side hydration */}
      <div className="mt-8 flex flex-col sm:flex-row sm:items-center sm:gap-6 relative z-10">
        <a
          href={`/api/cta-redirect?slug=${slug}`}
          className="inline-flex items-center justify-center px-8 py-4 bg-white text-black border border-white font-mono text-xs uppercase tracking-widest font-bold transition-all duration-100 hover:bg-transparent hover:text-white rounded-none text-center"
        >
          Book a free consultation →
        </a>
        <p className="text-xs text-white/50 mt-3 sm:mt-0 leading-normal max-w-xs font-mono uppercase tracking-wider">
          No commitments. 20 minutes. We will map current credit availability to your specific tools.
        </p>
      </div>
    </aside>
  )
}
