interface CredexCTAProps {
  totalMonthlySavingsCents: number
}

export function CredexCTA({ totalMonthlySavingsCents }: CredexCTAProps) {
  const savingsDollars = (totalMonthlySavingsCents / 100).toLocaleString('en-US', {
    maximumFractionDigits: 0,
  })
  const annualDollars = ((totalMonthlySavingsCents * 12) / 100).toLocaleString('en-US', {
    maximumFractionDigits: 0,
  })

  return (
    <aside
      aria-label="Credex consultation offer"
      className="w-full rounded-2xl p-8 border backdrop-blur-md transition-all duration-300"
      style={{
        borderColor: '#00E5A0',
        backgroundColor: 'rgba(0, 229, 160, 0.03)',
        boxShadow: '0 0 30px rgba(0, 229, 160, 0.05)',
      }}
    >
      <div className="flex flex-col space-y-4">
        <div>
          <p
            className="text-xs font-mono uppercase tracking-widest mb-2 font-semibold"
            style={{ color: '#00E5A0' }}
          >
            You qualify for a Credex consultation
          </p>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Capture ${savingsDollars}/mo in savings with discounted AI credits
          </h2>
        </div>
        <p className="text-sm text-gray-300 leading-relaxed">
          Credex sources discounted AI infrastructure credits from high-growth companies that
          overforecasted their usage commitments. At your spend level, that is an estimated{' '}
          <strong className="text-white">${annualDollars}/year</strong> in direct, recoverable costs.
          A 20-minute consultation is completely free — we will show you exactly what is available
          for your stack.
        </p>
      </div>

      {/* CTA button — links to Credex consultation booking */}
      <div className="mt-8 flex flex-col sm:flex-row sm:items-center sm:gap-6">
        <a
          href="https://credex.rocks"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] text-center"
          style={{ backgroundColor: '#00E5A0', color: '#0A0A0B' }}
        >
          Book a free consultation →
        </a>
        <p className="text-xs text-gray-500 mt-3 sm:mt-0 leading-normal max-w-xs">
          No commitments. 20 minutes. We will map current credit availability to your specific tools.
        </p>
      </div>
    </aside>
  )
}
