'use client'

import { useState, useEffect } from 'react'

interface LeadCaptureModalProps {
  slug: string
  totalMonthlySavingsCents: number
  isAlreadyOptimal: boolean
  triggersCredexCTA: boolean
}

export function LeadCaptureModal({
  slug,
  totalMonthlySavingsCents,
  isAlreadyOptimal,
  triggersCredexCTA,
}: LeadCaptureModalProps) {
  const [visible, setVisible] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [email, setEmail] = useState('')
  const [companyName, setCompanyName] = useState('')
  const [role, setRole] = useState('')

  // Delay before showing — let users read their results first
  useEffect(() => {
    // Don't show again if they've already submitted in this session
    if (sessionStorage.getItem(`lead-captured-${slug}`)) return

    const timer = setTimeout(() => setVisible(true), 3000)
    return () => clearTimeout(timer)
  }, [slug])

  const handleSubmit = async () => {
    if (!email) {
      setError('Email is required')
      return
    }

    setSubmitting(true)
    setError(null)

    try {
      const res = await fetch('/api/lead/capture', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug, email, companyName, role }),
      })

      if (!res.ok) {
        const data = await res.json() as { error?: string }
        setError(data.error ?? 'Something went wrong. Try again.')
        return
      }

      setSubmitted(true)
      sessionStorage.setItem(`lead-captured-${slug}`, 'true')

    } catch {
      setError('Network error. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (!visible) return null

  const savingsDollars = (totalMonthlySavingsCents / 100).toFixed(0)

  const headline = isAlreadyOptimal
    ? 'Get notified when better options are available'
    : triggersCredexCTA
    ? `Lock in your $${savingsDollars}/mo savings`
    : `Get your full savings report`

  const body = isAlreadyOptimal
    ? 'AI tool pricing changes frequently. We\'ll email you when a better plan becomes available for your stack.'
    : triggersCredexCTA
    ? `We'll send you this audit and connect you with Credex to access discounted credits — estimated $${savingsDollars}/month back.`
    : `We'll email you this audit so you can share it with your team or revisit it later.`

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="lead-modal-title"
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(4px)' }}
      onClick={e => { if (e.target === e.currentTarget) setVisible(false) }}
    >
      <div
        className="w-full sm:max-w-md rounded-2xl p-8 animate-fade-in"
        style={{ 
          backgroundColor: '#111113', 
          border: '1px solid rgba(255,255,255,0.08)',
          boxShadow: '0 10px 40px rgba(0,0,0,0.5)'
        }}
      >
        {submitted ? (
          <div className="text-center py-4 space-y-4">
            <div
              className="inline-flex items-center justify-center w-12 h-12 rounded-full"
              style={{ backgroundColor: 'rgba(0,229,160,0.1)', border: '1px solid #00E5A0' }}
              aria-hidden="true"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M5 12l5 5L20 7" stroke="#00E5A0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div>
              <h2 className="text-white font-semibold text-lg">Check your inbox</h2>
              <p className="text-gray-400 text-sm mt-2">
                We&apos;ve sent your audit results to {email}.
              </p>
            </div>
            <button
              onClick={() => setVisible(false)}
              className="mt-6 text-[#00E5A0] hover:text-[#00C080] text-sm font-medium transition-colors cursor-pointer"
            >
              Back to results
            </button>
          </div>
        ) : (
          <>
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 id="lead-modal-title" className="text-white font-bold text-xl tracking-tight">
                  {headline}
                </h2>
                <p className="text-gray-400 text-sm mt-2 leading-relaxed">{body}</p>
              </div>
              <button
                onClick={() => setVisible(false)}
                aria-label="Close dialog"
                className="text-gray-500 hover:text-gray-300 ml-4 mt-0.5 flex-shrink-0 transition-colors cursor-pointer"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label htmlFor="lead-email" className="text-xs font-mono uppercase tracking-wider text-gray-500 block mb-1">
                  Work email <span aria-hidden="true" className="text-[#00E5A0]">*</span>
                </label>
                <input
                  id="lead-email"
                  type="email"
                  placeholder="you@company.com"
                  required
                  aria-required="true"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl text-sm text-white placeholder:text-gray-600 focus:outline-none focus:ring-1 focus:ring-[#00E5A0] transition-all"
                  style={{ backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}
                  aria-describedby={error ? 'lead-error' : undefined}
                />
              </div>

              {triggersCredexCTA && (
                <>
                  <div>
                    <label htmlFor="lead-company" className="text-xs font-mono uppercase tracking-wider text-gray-500 block mb-1">
                      Company name <span className="text-gray-700">(optional)</span>
                    </label>
                    <input
                      id="lead-company"
                      type="text"
                      placeholder="Acme Inc."
                      value={companyName}
                      onChange={e => setCompanyName(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl text-sm text-white placeholder:text-gray-600 focus:outline-none focus:ring-1 focus:ring-[#00E5A0] transition-all"
                      style={{ backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}
                    />
                  </div>
                  <div>
                    <label htmlFor="lead-role" className="text-xs font-mono uppercase tracking-wider text-gray-500 block mb-1">
                      Your role <span className="text-gray-700">(optional)</span>
                    </label>
                    <input
                      id="lead-role"
                      type="text"
                      placeholder="CTO, Founder, Finance Lead..."
                      value={role}
                      onChange={e => setRole(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl text-sm text-white placeholder:text-gray-600 focus:outline-none focus:ring-1 focus:ring-[#00E5A0] transition-all"
                      style={{ backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}
                    />
                  </div>
                </>
              )}

              {error && (
                <p id="lead-error" role="alert" className="text-xs font-mono text-red-400">
                  ⚠️ {error}
                </p>
              )}

              <button
                onClick={handleSubmit}
                disabled={submitting}
                aria-busy={submitting}
                className="w-full py-3 rounded-xl font-bold text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] cursor-pointer text-center"
                style={{ backgroundColor: '#00E5A0', color: '#0A0A0B' }}
              >
                {submitting ? 'Sending…' : triggersCredexCTA ? 'Send report + savings plan →' : 'Send me my results →'}
              </button>

              <p className="text-[10px] font-mono text-gray-600 text-center uppercase tracking-wider">
                No spam. One transactional email with your results.
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
