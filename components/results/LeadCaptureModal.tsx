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
  const [linkCopied, setLinkCopied] = useState(false)

  // Delay before showing — let users read their results first
  useEffect(() => {
    // Don't show again if they've already submitted in this session
    if (localStorage.getItem(`lead-captured-${slug}`)) return

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
        let errorMessage = 'Something went wrong. Try again.'
        try {
          const data = await res.json() as { error?: string }
          if (data?.error) {
            errorMessage = data.error
          }
        } catch {
          errorMessage = `Server error (${res.status}). Please try again.`
        }
        setError(errorMessage)
        return
      }

      setSubmitted(true)
      localStorage.setItem(`lead-captured-${slug}`, 'true')

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
    ? 'AI tool pricing changes frequently. We\'ll alert you when a better plan becomes available for your stack.'
    : triggersCredexCTA
    ? `Save your audit link and connect with Credex to access discounted credits — estimated $${savingsDollars}/month back.`
    : `Save your shareable audit link to revisit or share with your team.`

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="lead-modal-title"
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={e => { if (e.target === e.currentTarget) setVisible(false) }}
    >
      <div
        className="w-full sm:max-w-md bg-white border-4 border-black p-8 relative rounded-none shadow-none animate-fade-in"
      >
        {submitted ? (
          <div className="py-4 space-y-6">
            <div
              className="inline-flex items-center justify-center p-1 border border-black"
              aria-hidden="true"
            >
              <div className="border border-black bg-black text-white px-4 py-2 font-mono text-xs uppercase tracking-widest font-bold">
                ✓ Saved
              </div>
            </div>
            <div>
              <h2 className="text-black font-serif font-bold text-2xl">Your audit is saved</h2>
              <p className="text-text-secondary text-sm mt-3 leading-relaxed font-serif">
                Copy this link to revisit or share with your team — no login required.
              </p>
            </div>
            <button
              onClick={() => {
                const url = typeof window !== 'undefined' ? window.location.href : ''
                navigator.clipboard.writeText(url).then(() => setLinkCopied(true))
              }}
              className="w-full border-2 border-black text-black hover:bg-black hover:text-white py-3 text-xs font-mono uppercase tracking-widest font-bold transition-all duration-100 rounded-none cursor-pointer text-center"
            >
              {linkCopied ? '✓ Link copied!' : 'Copy shareable link'}
            </button>
            <button
              onClick={() => setVisible(false)}
              className="w-full text-black hover:underline text-xs font-mono uppercase tracking-widest font-bold transition-colors cursor-pointer text-center"
            >
              Back to results
            </button>
          </div>
        ) : (
          <>
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 id="lead-modal-title" className="text-black font-serif font-bold text-2xl tracking-tight leading-none">
                  {headline}
                </h2>
                <p className="text-text-secondary text-sm mt-3 leading-relaxed font-serif">{body}</p>
              </div>
              <button
                onClick={() => setVisible(false)}
                aria-label="Close dialog"
                className="text-black hover:opacity-60 ml-4 mt-0.5 flex-shrink-0 transition-opacity cursor-pointer"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <label htmlFor="lead-email" className="text-xs font-mono uppercase tracking-widest text-text-secondary block mb-1">
                  Work email <span aria-hidden="true" className="text-black font-bold">*</span>
                </label>
                <input
                  id="lead-email"
                  type="email"
                  placeholder="you@company.com"
                  required
                  aria-required="true"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full border-b-2 border-black bg-transparent text-black text-sm px-2 py-3 focus:border-b-4 focus:outline-none rounded-none placeholder:text-text-muted/60"
                  aria-describedby={error ? 'lead-error' : undefined}
                />
              </div>

              {triggersCredexCTA && (
                <>
                  <div>
                    <label htmlFor="lead-company" className="text-xs font-mono uppercase tracking-widest text-text-secondary block mb-1">
                      Company name <span className="text-text-muted/70">(optional)</span>
                    </label>
                    <input
                      id="lead-company"
                      type="text"
                      placeholder="Acme Inc."
                      value={companyName}
                      onChange={e => setCompanyName(e.target.value)}
                      className="w-full border-b-2 border-black bg-transparent text-black text-sm px-2 py-3 focus:border-b-4 focus:outline-none rounded-none placeholder:text-text-muted/60"
                    />
                  </div>
                  <div>
                    <label htmlFor="lead-role" className="text-xs font-mono uppercase tracking-widest text-text-secondary block mb-1">
                      Your role <span className="text-text-muted/70">(optional)</span>
                    </label>
                    <input
                      id="lead-role"
                      type="text"
                      placeholder="CTO, Founder, Finance Lead..."
                      value={role}
                      onChange={e => setRole(e.target.value)}
                      className="w-full border-b-2 border-black bg-transparent text-black text-sm px-2 py-3 focus:border-b-4 focus:outline-none rounded-none placeholder:text-text-muted/60"
                    />
                  </div>
                </>
              )}

              {error && (
                <p id="lead-error" role="alert" className="text-xs font-mono text-black font-bold">
                  ⚠️ {error}
                </p>
              )}

              <button
                onClick={handleSubmit}
                disabled={submitting}
                aria-busy={submitting}
                className="w-full bg-black text-white hover:bg-white hover:text-black hover:border hover:border-black py-3 text-xs font-mono uppercase tracking-widest font-bold transition-all duration-100 rounded-none cursor-pointer text-center"
              >
                {submitting ? 'Sending…' : triggersCredexCTA ? 'Send report + savings plan →' : 'Send me my results →'}
              </button>

              <p className="text-[10px] font-mono text-text-muted text-center uppercase tracking-widest font-medium">
                No spam. One transactional email with your results.
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
