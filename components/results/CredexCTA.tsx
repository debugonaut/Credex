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
      className="w-full rounded border p-6 sm:p-8 backdrop-blur-md transition-all duration-300"
      style={{
        borderColor: 'var(--color-accent)',
        backgroundColor: 'rgba(0, 229, 160, 0.04)',
        boxShadow: '0 0 32px rgba(0, 229, 160, 0.08)',
      }}
    >
      <div className="flex flex-col space-y-4">
        <div>
          <p className="text-xs font-mono uppercase tracking-widest mb-2 font-semibold text-accent">
            You qualify for a Credex consultation
          </p>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Capture ${savingsDollars}/mo in savings with discounted AI credits
          </h2>
        </div>
        <p className="text-sm text-text-secondary leading-relaxed">
          Credex sources discounted AI infrastructure credits from high-growth companies that
          overforecasted their usage commitments. At your spend level, that is an estimated{' '}
          <strong className="text-white">${annualDollars}/year</strong> in direct, recoverable costs.
          A 20-minute consultation is completely free — we will show you exactly what is available
          for your stack.
        </p>
      </div>

      {/* CTA button — links to server-side redirect endpoint to ensure zero client-side hydration */}
      <div className="mt-8 flex flex-col sm:flex-row sm:items-center sm:gap-6">
        <a
          href={`/api/cta-redirect?slug=${slug}`}
          className="inline-flex items-center justify-center px-6 py-3 rounded text-sm font-semibold transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] text-center"
          style={{ backgroundColor: 'var(--color-accent)', color: '#0A0A0B' }}
        >
          Book a free consultation →
        </a>
        <p className="text-xs text-text-muted mt-3 sm:mt-0 leading-normal max-w-xs">
          No commitments. 20 minutes. We will map current credit availability to your specific tools.
        </p>
      </div>
    </aside>
  )
}
