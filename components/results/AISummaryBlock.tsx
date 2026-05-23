'use client'

import { useEffect, useState } from 'react'

interface AISummaryBlockProps {
  slug: string
  initialSummary: string | null // populated if already generated (cached)
}

export function AISummaryBlock({ slug, initialSummary }: AISummaryBlockProps) {
  const [summary, setSummary] = useState<string | null>(initialSummary)
  const [loading, setLoading] = useState(!initialSummary)

  useEffect(() => {
    // If we already have a summary (from the RSC), don't fetch again
    if (initialSummary) return

    // Fetch the AI summary after the page renders
    // This does not block the results page from showing
    const fetchSummary = async () => {
      try {
        const res = await fetch('/api/summary', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ slug }),
        })
        if (!res.ok) throw new Error('Summary fetch failed')
        const data = (await res.json()) as { summary: string }
        setSummary(data.summary)
      } catch {
        // Fail silently — the rest of the results page is still useful
        setSummary(null)
      } finally {
        setLoading(false)
      }
    }

    fetchSummary()
  }, [slug, initialSummary])

  if (loading) {
    return (
      <div aria-label="Generating AI summary" aria-busy="true" className="w-full space-y-4">
        <h2 className="text-xs font-mono uppercase tracking-widest text-gray-500 mb-2 font-semibold">
          AI Analysis Summary
        </h2>
        {/* Three-line skeleton — pure CSS animation, no library */}
        <div className="space-y-3">
          {[100, 92, 78].map((width, i) => (
            <div
              key={i}
              className="h-4 rounded animate-pulse bg-white/[0.08]"
              style={{ width: `${width}%` }}
              aria-hidden="true"
            />
          ))}
        </div>
      </div>
    )
  }

  if (!summary) return null // failed silently — don't show anything broken

  return (
    <section aria-label="AI-generated audit summary" className="w-full space-y-3 animate-fade-in">
      <h2 className="text-xs font-mono uppercase tracking-widest text-gray-500 font-semibold">
        AI Analysis Summary
      </h2>
      <p className="text-base text-gray-300 leading-relaxed font-sans">{summary}</p>
    </section>
  )
}
