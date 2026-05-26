import type { PricingConfig } from '@/types'

// CRITICAL: All monetary values are integer CENTS — never floats.
// $20/month = 2000, $40/month = 4000, $19/month = 1900
// Floating point math on financial values causes rounding bugs that
// are embarrassing and obvious in a financial tool.

export const PRICING_CONFIGS: PricingConfig[] = [
  // --- Cursor ---
  {
    toolId: 'cursor',
    planId: 'cursor-hobby',
    displayName: 'Cursor Hobby',
    monthlyPerSeatCents: 0,
    annualPerSeatCents: null,
    minSeats: 1,
    maxSeats: null,
    targetUseCases: ['coding'],
    isApiOnly: false,
    sourceUrl: 'https://cursor.com/pricing',
    verifiedAt: '2026-05-21',
  },
  {
    toolId: 'cursor',
    planId: 'cursor-pro',
    displayName: 'Cursor Pro',
    monthlyPerSeatCents: 2000,
    annualPerSeatCents: null,
    minSeats: 1,
    maxSeats: null,
    targetUseCases: ['coding'],
    isApiOnly: false,
    sourceUrl: 'https://cursor.com/pricing',
    verifiedAt: '2026-05-21',
  },
  {
    toolId: 'cursor',
    planId: 'cursor-business',
    displayName: 'Cursor Business',
    monthlyPerSeatCents: 4000,
    annualPerSeatCents: null,
    minSeats: 5, // Below 5 seats, Pro is more economical (or individual users can downgrade)
    maxSeats: null,
    targetUseCases: ['coding'],
    isApiOnly: false,
    sourceUrl: 'https://cursor.com/pricing',
    verifiedAt: '2026-05-21',
  },

  // --- GitHub Copilot ---
  {
    toolId: 'github-copilot',
    planId: 'copilot-individual',
    displayName: 'GitHub Copilot Individual',
    monthlyPerSeatCents: 1000,
    annualPerSeatCents: 10000, // $100/yr
    minSeats: 1,
    maxSeats: 1,
    targetUseCases: ['coding'],
    isApiOnly: false,
    sourceUrl: 'https://github.com/features/copilot#pricing',
    verifiedAt: '2026-05-21',
  },
  {
    toolId: 'github-copilot',
    planId: 'copilot-business',
    displayName: 'GitHub Copilot Business',
    monthlyPerSeatCents: 1900,
    annualPerSeatCents: null,
    minSeats: 1,
    maxSeats: null,
    targetUseCases: ['coding'],
    isApiOnly: false,
    sourceUrl: 'https://github.com/features/copilot#pricing',
    verifiedAt: '2026-05-21',
  },
  {
    toolId: 'github-copilot',
    planId: 'copilot-enterprise',
    displayName: 'GitHub Copilot Enterprise',
    monthlyPerSeatCents: 3900,
    annualPerSeatCents: null,
    minSeats: 1,
    maxSeats: null,
    targetUseCases: ['coding'],
    isApiOnly: false,
    sourceUrl: 'https://github.com/features/copilot#pricing',
    verifiedAt: '2026-05-21',
  },

  // --- Claude (claude.ai) ---
  {
    toolId: 'claude',
    planId: 'claude-free',
    displayName: 'Claude Free',
    monthlyPerSeatCents: 0,
    annualPerSeatCents: null,
    minSeats: 1,
    maxSeats: null,
    targetUseCases: ['writing', 'research', 'coding', 'mixed'],
    isApiOnly: false,
    sourceUrl: 'https://claude.ai/pricing',
    verifiedAt: '2026-05-21',
  },
  {
    toolId: 'claude',
    planId: 'claude-pro',
    displayName: 'Claude Pro',
    monthlyPerSeatCents: 2000,
    annualPerSeatCents: null,
    minSeats: 1,
    maxSeats: null,
    targetUseCases: ['writing', 'research', 'coding', 'mixed'],
    isApiOnly: false,
    sourceUrl: 'https://claude.ai/pricing',
    verifiedAt: '2026-05-21',
  },
  {
    toolId: 'claude',
    planId: 'claude-team',
    displayName: 'Claude Team',
    monthlyPerSeatCents: 2500,
    annualPerSeatCents: null,
    minSeats: 5, // minimum 5 seats
    maxSeats: null,
    targetUseCases: ['writing', 'research', 'coding', 'mixed'],
    isApiOnly: false,
    sourceUrl: 'https://claude.ai/pricing',
    verifiedAt: '2026-05-21',
  },
  {
    toolId: 'claude',
    planId: 'claude-enterprise',
    displayName: 'Claude Enterprise',
    monthlyPerSeatCents: 5000, // conservative estimate for engine math
    annualPerSeatCents: null,
    minSeats: 15,
    maxSeats: null,
    targetUseCases: ['writing', 'research', 'coding', 'mixed'],
    isApiOnly: false,
    sourceUrl: 'https://claude.ai/pricing',
    verifiedAt: '2026-05-21',
  },

  // --- ChatGPT ---
  {
    toolId: 'chatgpt',
    planId: 'chatgpt-free',
    displayName: 'ChatGPT Free',
    monthlyPerSeatCents: 0,
    annualPerSeatCents: null,
    minSeats: 1,
    maxSeats: null,
    targetUseCases: ['writing', 'research', 'data', 'mixed'],
    isApiOnly: false,
    sourceUrl: 'https://openai.com/chatgpt/pricing',
    verifiedAt: '2026-05-21',
  },
  {
    toolId: 'chatgpt',
    planId: 'chatgpt-plus',
    displayName: 'ChatGPT Plus',
    monthlyPerSeatCents: 2000,
    annualPerSeatCents: null,
    minSeats: 1,
    maxSeats: null,
    targetUseCases: ['writing', 'research', 'data', 'mixed'],
    isApiOnly: false,
    sourceUrl: 'https://openai.com/chatgpt/pricing',
    verifiedAt: '2026-05-21',
  },
  {
    toolId: 'chatgpt',
    planId: 'chatgpt-team',
    displayName: 'ChatGPT Team',
    monthlyPerSeatCents: 3000, // monthly billing ($25 for annual, $30 for monthly)
    annualPerSeatCents: 30000, // $25 * 12 = 30000
    minSeats: 2, // minimum 2 seats
    maxSeats: null,
    targetUseCases: ['writing', 'research', 'data', 'mixed'],
    isApiOnly: false,
    sourceUrl: 'https://openai.com/chatgpt/pricing',
    verifiedAt: '2026-05-21',
  },
  {
    toolId: 'chatgpt',
    planId: 'chatgpt-enterprise',
    displayName: 'ChatGPT Enterprise',
    monthlyPerSeatCents: 6000, // conservative estimate for custom quotes
    annualPerSeatCents: null,
    minSeats: 10,
    maxSeats: null,
    targetUseCases: ['writing', 'research', 'data', 'mixed'],
    isApiOnly: false,
    sourceUrl: 'https://openai.com/chatgpt/pricing',
    verifiedAt: '2026-05-21',
  },

  // --- Anthropic API ---
  {
    toolId: 'anthropic-api',
    planId: 'anthropic-api-direct',
    displayName: 'Anthropic API Pay-as-you-go',
    monthlyPerSeatCents: 0,
    annualPerSeatCents: null,
    minSeats: 1,
    maxSeats: null,
    targetUseCases: ['coding', 'data', 'mixed'],
    isApiOnly: true,
    sourceUrl: 'https://anthropic.com/pricing',
    verifiedAt: '2026-05-21',
  },

  // --- OpenAI API ---
  {
    toolId: 'openai-api',
    planId: 'openai-api-direct',
    displayName: 'OpenAI API Pay-as-you-go',
    monthlyPerSeatCents: 0,
    annualPerSeatCents: null,
    minSeats: 1,
    maxSeats: null,
    targetUseCases: ['coding', 'data', 'mixed'],
    isApiOnly: true,
    sourceUrl: 'https://openai.com/api/pricing',
    verifiedAt: '2026-05-21',
  },

  // --- Gemini ---
  {
    toolId: 'gemini',
    planId: 'gemini-advanced',
    displayName: 'Gemini Advanced',
    monthlyPerSeatCents: 1999,
    annualPerSeatCents: null,
    minSeats: 1,
    maxSeats: null,
    targetUseCases: ['research', 'writing', 'mixed'],
    isApiOnly: false,
    sourceUrl: 'https://ai.google.dev/gemini-api/docs/pricing',
    verifiedAt: '2026-05-21',
  },
  {
    toolId: 'gemini',
    planId: 'gemini-api',
    displayName: 'Gemini API Pay-as-you-go',
    monthlyPerSeatCents: 0,
    annualPerSeatCents: null,
    minSeats: 1,
    maxSeats: null,
    targetUseCases: ['research', 'coding', 'data', 'mixed'],
    isApiOnly: true,
    sourceUrl: 'https://ai.google.dev/gemini-api/docs/pricing',
    verifiedAt: '2026-05-21',
  },

  // --- v0 ---
  {
    toolId: 'v0',
    planId: 'v0-free',
    displayName: 'v0 Free',
    monthlyPerSeatCents: 0,
    annualPerSeatCents: null,
    minSeats: 1,
    maxSeats: null,
    targetUseCases: ['coding', 'mixed'],
    isApiOnly: false,
    sourceUrl: 'https://v0.dev/pricing',
    verifiedAt: '2026-05-21',
  },
  {
    toolId: 'v0',
    planId: 'v0-premium',
    displayName: 'v0 Premium',
    monthlyPerSeatCents: 2000,
    annualPerSeatCents: null,
    minSeats: 1,
    maxSeats: null,
    targetUseCases: ['coding', 'mixed'],
    isApiOnly: false,
    sourceUrl: 'https://v0.dev/pricing',
    verifiedAt: '2026-05-21',
  },
  {
    toolId: 'v0',
    planId: 'v0-enterprise',
    displayName: 'v0 Enterprise',
    monthlyPerSeatCents: 5000,
    annualPerSeatCents: null,
    minSeats: 10,
    maxSeats: null,
    targetUseCases: ['coding', 'mixed'],
    isApiOnly: false,
    sourceUrl: 'https://v0.dev/pricing',
    verifiedAt: '2026-05-21',
  },
]

import { logger } from '@/lib/logger'

// Add a dev-time warning for stale pricing data
if (process.env.NODE_ENV === 'development') {
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
  PRICING_CONFIGS.forEach(config => {
    if (new Date(config.verifiedAt) < thirtyDaysAgo) {
      logger.warn(
        `[pricing] Stale data for ${config.displayName} — verified ${config.verifiedAt}. Update PRICING_DATA.md.`
      )
    }
  })
}


// Primary lookup helper
export function getPricingConfig(
  toolId: string,
  planId: string
): PricingConfig | undefined {
  return PRICING_CONFIGS.find(
    p => p.toolId === toolId && p.planId === planId
  )
}

// Get all plans for a tool, sorted cheapest first
export function getToolPlans(toolId: string): PricingConfig[] {
  return PRICING_CONFIGS
    .filter(p => p.toolId === toolId)
    .sort((a, b) => a.monthlyPerSeatCents - b.monthlyPerSeatCents)
}
