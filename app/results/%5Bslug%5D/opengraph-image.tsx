import { ImageResponse } from 'next/og'
import { createServerSupabaseClient } from '@/lib/supabase'

export const runtime = 'edge'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

interface Props {
  params: { slug: string }
}

interface AuditResultSummary {
  totalMonthlySavingsCents: number
  isAlreadyOptimal: boolean
  recommendations: Array<{ toolId: string }>
}

export default async function OGImage({ params }: Props) {
  let result: AuditResultSummary | undefined = undefined
  
  try {
    const supabase = createServerSupabaseClient()
    const { data } = await supabase
      .from('audits')
      .select('result')
      .eq('slug', params.slug)
      .single()

    result = data?.result
  } catch (error) {
    // Graceful fallback if Supabase keys are not set yet or database is unreachable
    console.warn('[og-image] Failed to fetch audit result for OG Image:', error)
  }

  const monthlySavings = result
    ? `$${(result.totalMonthlySavingsCents / 100).toLocaleString('en-US', {
        maximumFractionDigits: 0,
      })}`
    : null

  const isAlreadyOptimal = result?.isAlreadyOptimal ?? false

  const headline = isAlreadyOptimal
    ? 'AI Stack is Already Optimized'
    : monthlySavings
    ? `${monthlySavings}/mo in AI Savings Found`
    : 'Stop Overpaying for AI Tools'

  const toolCount = result?.recommendations?.length ?? 0
  const subline = isAlreadyOptimal
    ? 'No overspend detected across active plans'
    : toolCount > 0
    ? `${toolCount} actionable recommendation${toolCount !== 1 ? 's' : ''} for your stack`
    : 'Audit your startup\'s AI stack in 60 seconds'

  return new ImageResponse(
    (
      <div
        style={{
          width: '1200px',
          height: '630px',
          backgroundColor: '#0A0A0B',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'flex-start',
          padding: '80px',
          position: 'relative',
        }}
      >
        {/* Top Eyebrow */}
        <p
          style={{
            color: '#888888',
            fontSize: '20px',
            fontFamily: 'monospace',
            textTransform: 'uppercase',
            letterSpacing: '0.15em',
            margin: '0 0 32px 0',
            fontWeight: 600,
          }}
        >
          StackTally · AI Spend Audit
        </p>

        {/* Main large figure/headline */}
        <p
          style={{
            color: '#00E5A0',
            fontSize: isAlreadyOptimal || !monthlySavings ? '64px' : '96px',
            fontWeight: 800,
            margin: '0 0 16px 0',
            lineHeight: 1.1,
            fontFamily: 'monospace',
          }}
        >
          {headline}
        </p>

        {/* Secondary subtitle */}
        <p
          style={{
            color: '#ededed',
            fontSize: '32px',
            margin: '0 0 72px 0',
            fontWeight: 500,
          }}
        >
          {subline}
        </p>

        {/* Brand/Domain footer info */}
        <p
          style={{
            color: '#555555',
            fontSize: '20px',
            margin: 0,
            fontWeight: 400,
            fontFamily: 'monospace',
          }}
        >
          Find your leaks and get discounted AI credits at stacktally.com
        </p>

        {/* Elegant right side accent brand border */}
        <div
          style={{
            position: 'absolute',
            right: 0,
            top: 0,
            bottom: 0,
            width: '6px',
            backgroundColor: '#00E5A0',
          }}
        />
      </div>
    ),
    { ...size }
  )
}
