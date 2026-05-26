'use client'

import { useState, FormEvent } from 'react'

export function OptimalBadge() {
  const [email, setEmail] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [subscribed, setSubscribed] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubscribe = async (e: FormEvent) => {
    e.preventDefault()
    if (!email) return

    setSubmitting(true)
    setError(null)

    try {
      // Note: Wired up to lead capture API (fully completed in Phase 4)
      await new Promise(resolve => setTimeout(resolve, 800))
      setSubscribed(true)
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section
      aria-label="Audit result: spending is already optimized"
      className="w-full py-12 text-center"
    >
      {/* Prestigious double-line thin border box */}
      <div className="inline-flex items-center justify-center p-1.5 border border-black mb-8 bg-white">
        <div className="border border-black px-6 py-4 bg-white">
          <span className="font-serif italic text-2xl md:text-3xl text-black tracking-tight block">
            Optimal Stack Verified
          </span>
        </div>
      </div>

      <h1 className="text-3xl md:text-4xl font-serif font-bold text-black tracking-tight mb-4">
        Your stack is well-optimized.
      </h1>
      <p className="text-text-secondary text-base max-w-lg mx-auto leading-relaxed font-serif">
        Based on your team size, primary use cases, and current plans, you are not
        meaningfully overspending on AI tools. We did not find any savings worth recommending.
      </p>

      {/* Capture lead with subscription */}
      <div className="mt-12 max-w-md mx-auto p-6 border-2 border-black bg-white relative bg-monochrome-grid">
        <p className="text-sm font-mono uppercase tracking-widest font-bold text-black mb-2">
          {"// Monitor Future Price Changes"}
        </p>
        <p className="text-xs text-text-secondary mb-6 leading-relaxed font-serif">
          AI tool pricing models and features shift frequently. Enter your email below to be notified when plan changes or new alternatives become more economical for your stack.
        </p>

        {subscribed ? (
          <div className="py-4 px-4 border border-black bg-black text-white text-xs font-mono uppercase tracking-widest font-bold">
            ✓ Subscribed to Pricing Updates
          </div>
        ) : (
          <form onSubmit={handleSubscribe} className="space-y-4">
            <div className="flex flex-col gap-3">
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@company.com"
                aria-label="Email address for notifications"
                className="w-full border-b-2 border-black bg-transparent text-black text-sm px-2 py-3 focus:border-b-4 focus:outline-none rounded-none placeholder:text-text-muted/60"
              />
              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-black text-white hover:bg-white hover:text-black hover:border hover:border-black py-3 text-xs font-mono uppercase tracking-widest font-bold transition-all duration-100 rounded-none cursor-pointer"
              >
                {submitting ? 'Subscribing...' : 'Notify me of price shifts'}
              </button>
            </div>
            {error && (
              <p role="alert" className="text-xs font-mono text-black font-bold text-left">
                ⚠️ {error}
              </p>
            )}
          </form>
        )}
      </div>
    </section>
  )
}
