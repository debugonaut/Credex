import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { createServerSupabaseClient } from '@/lib/supabase'
import { sanitizeAuditForPublic } from '@/lib/sanitize'
import { ResultsHero } from '@/components/results/ResultsHero'
import { ToolBreakdown } from '@/components/results/ToolBreakdown'
import { CredexCTA } from '@/components/results/CredexCTA'
import { OptimalBadge } from '@/components/results/OptimalBadge'
import { AISummaryBlock } from '@/components/results/AISummaryBlock'
import { ShareButton } from '@/components/results/ShareButton'

// Cache results pages for 1 hour
// Audit results don't change after creation — but the AI summary
// might be populated minutes after the page is first visited
export const revalidate = 3600

interface Props {
  params: { slug: string }
}

// Generate Open Graph metadata dynamically per audit
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const supabase = createServerSupabaseClient()
    const { data } = await supabase
      .from('audits')
      .select('result, slug')
      .eq('slug', params.slug)
      .single()

    if (!data) return { title: 'Audit Not Found | StackTally' }

    const result = data.result as { totalMonthlySavingsCents: number; isAlreadyOptimal: boolean }
    const savingsDollars = (result.totalMonthlySavingsCents / 100).toLocaleString('en-US', {
      maximumFractionDigits: 0,
    })

    const title = result.isAlreadyOptimal
      ? 'My AI Stack is Already Optimized — StackTally'
      : `I Found $${savingsDollars}/mo in AI Tool Savings — StackTally`

    const description = result.isAlreadyOptimal
      ? 'I ran a professional AI spend audit and my stack is already well-optimized. Check yours free.'
      : `My AI tools spend audit identified $${savingsDollars}/month in potential savings. See the breakdown — and check your own stack for free.`

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        url: `${process.env.NEXT_PUBLIC_APP_URL || ''}/results/${params.slug}`,
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
      },
    }
  } catch (error) {
    // If client initialization fails during pre-rendering, fallback to default metadata
    return {
      title: 'Spend Audit Results | StackTally',
      description: 'Stop overpaying for AI tools. Audit your startup\'s AI stack in 60 seconds.',
    }
  }
}

export default async function ResultsPage({ params }: Props) {
  let data: any = null
  let devModeMissingEnv = false

  try {
    const supabase = createServerSupabaseClient()
    const { data: row, error } = await supabase
      .from('audits')
      .select('*')
      .eq('slug', params.slug)
      .single()

    if (error || !row) {
      notFound()
    }
    data = row
  } catch (error: any) {
    // Handle lack of environment variables locally for high-quality developer experience
    if (
      error.message?.includes('Missing SUPABASE_URL') ||
      error.message?.includes('env')
    ) {
      devModeMissingEnv = true
    } else {
      throw error
    }
  }

  // Developer-friendly guide when environment variables are not yet setup
  if (devModeMissingEnv) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[#0A0A0B] p-6 text-white">
        <div className="max-w-md w-full bg-white/[0.02] border border-amber-500/30 p-8 rounded-2xl space-y-6">
          <div className="flex items-center gap-3 text-amber-400">
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <h1 className="text-lg font-bold tracking-tight">Supabase Keys Required</h1>
          </div>
          <p className="text-sm text-gray-300 leading-relaxed">
            This results page relies on a server-side fetch from your Supabase database. To run locally, please copy the `.env.example` file to `.env.local` and fill in your Supabase variables.
          </p>
          <div className="bg-white/[0.04] p-4 rounded-xl border border-white/[0.08] text-xs font-mono text-gray-400 space-y-1">
            <p>SUPABASE_URL=https://your-project.supabase.co</p>
            <p>SUPABASE_SERVICE_ROLE_KEY=your-role-key</p>
            <p>NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co</p>
            <p>NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key</p>
          </div>
          <p className="text-xs text-gray-500">
            Once variables are set, submit an audit from the homepage to save a result and generate a valid slug URL.
          </p>
        </div>
      </main>
    )
  }

  const audit = sanitizeAuditForPublic(data)
  
  // Assert typed fields safely
  const result = data.result as {
    recommendations: typeof audit.recommendations
    totalMonthlySavingsCents: number
    totalAnnualSavingsCents: number
    isAlreadyOptimal: boolean
    triggersCredexCTA: boolean
    savingsBreakdown: any[]
  }

  return (
    <main className="min-h-screen" style={{ backgroundColor: '#0A0A0B' }}>
      <div className="max-w-2xl mx-auto px-4 py-20 space-y-16">
        {/* Hero: big savings number or optimal badge */}
        {result.isAlreadyOptimal ? (
          <OptimalBadge />
        ) : (
          <ResultsHero
            totalMonthlySavingsCents={result.totalMonthlySavingsCents}
            totalAnnualSavingsCents={result.totalAnnualSavingsCents}
            isAlreadyOptimal={result.isAlreadyOptimal}
            toolCount={audit.tools.length}
          />
        )}

        {/* AI summary — client component, loads async */}
        <AISummaryBlock
          slug={params.slug}
          initialSummary={audit.aiSummary}
        />

        {/* Per-tool breakdown cards */}
        {!result.isAlreadyOptimal && (
          <ToolBreakdown
            recommendations={result.recommendations}
            savingsBreakdown={result.savingsBreakdown}
          />
        )}

        {/* Credex CTA — only for high-savings audits */}
        {result.triggersCredexCTA && !result.isAlreadyOptimal && (
          <CredexCTA totalMonthlySavingsCents={result.totalMonthlySavingsCents} />
        )}

        {/* Share section */}
        <section aria-label="Share your audit" className="w-full space-y-4 border-t border-white/[0.06] pt-10">
          <div>
            <h2 className="text-xs font-mono uppercase tracking-widest text-gray-500 font-semibold mb-1">
              Share This Audit
            </h2>
            <p className="text-sm text-gray-400 leading-relaxed">
              This secure link displays your optimization recommendations without exposing any email addresses, team parameters, or actual spending amounts. Safe to share with teammates, executives, or social media.
            </p>
          </div>
          <ShareButton slug={params.slug} />
        </section>
      </div>
    </main>
  )
}
