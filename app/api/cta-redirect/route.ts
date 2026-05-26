import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const slug = searchParams.get('slug')

  if (slug) {
    try {
      const supabase = createServerSupabaseClient()
      await supabase.from('events').insert({
        slug,
        event_type: 'cta_clicked',
        metadata: { source: 'cta_redirect' },
      })
    } catch {
      // Gracefully continue redirect even if tracking fails to ensure seamless UX
    }
  }

  return NextResponse.redirect('https://credex.rocks', 302)
}
