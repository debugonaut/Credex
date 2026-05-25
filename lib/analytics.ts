import { createServerSupabaseClient } from './supabase'

type EventType = 'form_started' | 'audit_completed' | 'email_captured' | 'cta_clicked' | 'link_shared'

export async function logEvent(
  eventType: EventType,
  auditId: string | null,
  metadata?: Record<string, unknown>
): Promise<void> {
  try {
    const supabase = createServerSupabaseClient()
    await supabase.from('events').insert({
      audit_id: auditId,
      event_type: eventType,
      metadata: metadata ?? null,
    })
  } catch (error) {
    // Analytics failures are never fatal — log and move on
    console.error('[analytics] logEvent failed:', error)
  }
}
