import Anthropic from '@anthropic-ai/sdk'
import type { LLMGeneratedSummary } from '@/types'
import { buildAuditSummaryPrompt, FALLBACK_SUMMARY_TEMPLATE } from '@/prompts/auditSummary'
import type { AuditInput, AuditResult } from '@/types'

const SUMMARY_MODEL = 'claude-haiku-4-5'
const SUMMARY_MAX_TOKENS = 200
const SUMMARY_TIMEOUT_MS = 10_000
const CURRENT_PROMPT_VERSION = 'v1'

// Lazy singleton — only instantiated when first called
// Avoids import-time errors if ANTHROPIC_API_KEY is not set in dev
let client: Anthropic | null = null

function getClient(): Anthropic {
  if (!client) {
    const apiKey = process.env.ANTHROPIC_API_KEY
    if (!apiKey) throw new Error('ANTHROPIC_API_KEY is not set')
    client = new Anthropic({ apiKey })
  }
  return client
}

export async function generateAuditSummary(
  input: AuditInput,
  result: AuditResult
): Promise<LLMGeneratedSummary> {
  const prompt = buildAuditSummaryPrompt(input, result)

  // AbortController enforces our 10-second timeout
  // The Anthropic SDK respects the signal on the fetch it makes internally
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), SUMMARY_TIMEOUT_MS)

  try {
    const response = await getClient().messages.create(
      {
        model: SUMMARY_MODEL,
        max_tokens: SUMMARY_MAX_TOKENS,
        messages: [{ role: 'user', content: prompt }],
      },
      { signal: controller.signal }
    )

    clearTimeout(timeoutId)

    const text = response.content
      .filter(block => block.type === 'text')
      .map(block => block.text)
      .join('')
      .trim()

    return {
      text,
      generatedAt: new Date().toISOString(),
      model: SUMMARY_MODEL,
      promptVersion: CURRENT_PROMPT_VERSION,
      isFallback: false,
    }
  } catch (error) {
    clearTimeout(timeoutId)

    // Log for debugging — never surface to user
    console.error('[anthropic] generateAuditSummary failed:', error)

    // Return the fallback — indistinguishable to users from a real summary
    return {
      text: FALLBACK_SUMMARY_TEMPLATE(input, result),
      generatedAt: new Date().toISOString(),
      model: 'fallback',
      promptVersion: CURRENT_PROMPT_VERSION,
      isFallback: true,
    }
  }
}
