import type { ToolId, PlanId, UseCase } from '@/types'

export interface ToolConfig {
  toolId: ToolId
  displayName: string
  description: string        // one sentence shown under the tool name in the form
  primaryUseCases: UseCase[] // which use cases this tool is relevant for
  isApiOnly: boolean         // hides seat count field in ToolCard
  plans: PlanConfig[]
}

export interface PlanConfig {
  planId: PlanId
  displayName: string        // shown in the plan selector dropdown
  monthlyPriceLabel: string  // e.g. "$20/seat/mo" — pulled from PRICING_DATA.md
}

export const TOOL_CONFIGS: ToolConfig[] = [
  {
    toolId: 'cursor',
    displayName: 'Cursor',
    description: 'AI-powered code editor with inline completion and chat',
    primaryUseCases: ['coding'],
    isApiOnly: false,
    plans: [
      { planId: 'cursor-hobby',    displayName: 'Hobby',    monthlyPriceLabel: 'Free' },
      { planId: 'cursor-pro',      displayName: 'Pro',      monthlyPriceLabel: '$20/mo' },
      { planId: 'cursor-business', displayName: 'Business', monthlyPriceLabel: '$40/seat/mo' },
    ],
  },
  {
    toolId: 'github-copilot',
    displayName: 'GitHub Copilot',
    description: 'AI code completion tool for various IDEs',
    primaryUseCases: ['coding'],
    isApiOnly: false,
    plans: [
      { planId: 'copilot-individual', displayName: 'Individual', monthlyPriceLabel: '$10/mo' },
      { planId: 'copilot-business',   displayName: 'Business',   monthlyPriceLabel: '$19/seat/mo' },
      { planId: 'copilot-enterprise', displayName: 'Enterprise', monthlyPriceLabel: '$39/seat/mo' },
    ],
  },
  {
    toolId: 'claude',
    displayName: 'Claude (claude.ai)',
    description: 'Anthropic\'s conversational assistant for analysis, writing, and coding',
    primaryUseCases: ['writing', 'research', 'coding', 'mixed'],
    isApiOnly: false,
    plans: [
      { planId: 'claude-free',       displayName: 'Free',       monthlyPriceLabel: 'Free' },
      { planId: 'claude-pro',        displayName: 'Pro',        monthlyPriceLabel: '$20/mo' },
      { planId: 'claude-team',       displayName: 'Team',       monthlyPriceLabel: '$25/seat/mo' },
      { planId: 'claude-enterprise', displayName: 'Enterprise', monthlyPriceLabel: 'Custom' },
    ],
  },
  {
    toolId: 'chatgpt',
    displayName: 'ChatGPT',
    description: 'OpenAI\'s general-purpose chatbot with GPT-4o capabilities',
    primaryUseCases: ['writing', 'research', 'data', 'mixed'],
    isApiOnly: false,
    plans: [
      { planId: 'chatgpt-free',       displayName: 'Free',       monthlyPriceLabel: 'Free' },
      { planId: 'chatgpt-plus',       displayName: 'Plus',       monthlyPriceLabel: '$20/mo' },
      { planId: 'chatgpt-team',       displayName: 'Team',       monthlyPriceLabel: '$30/seat/mo' },
      { planId: 'chatgpt-enterprise', displayName: 'Enterprise', monthlyPriceLabel: 'Custom' },
    ],
  },
  {
    toolId: 'anthropic-api',
    displayName: 'Anthropic API',
    description: 'Direct API access to Claude 3.5 Sonnet, Opus, and Haiku models',
    primaryUseCases: ['coding', 'data', 'mixed'],
    isApiOnly: true,
    plans: [
      { planId: 'anthropic-api-direct', displayName: 'Pay-as-you-go', monthlyPriceLabel: 'Usage-based' },
    ],
  },
  {
    toolId: 'openai-api',
    displayName: 'OpenAI API',
    description: 'Direct API access to GPT-4o and GPT-4o mini models',
    primaryUseCases: ['coding', 'data', 'mixed'],
    isApiOnly: true,
    plans: [
      { planId: 'openai-api-direct', displayName: 'Pay-as-you-go', monthlyPriceLabel: 'Usage-based' },
    ],
  },
  {
    toolId: 'gemini',
    displayName: 'Gemini (Google)',
    description: 'Google\'s conversational assistant and direct API access',
    primaryUseCases: ['research', 'writing', 'mixed'],
    isApiOnly: false, // Gemini has both seat-based Advanced and API versions
    plans: [
      { planId: 'gemini-advanced', displayName: 'Gemini Advanced', monthlyPriceLabel: '$19.99/mo' },
      { planId: 'gemini-api',      displayName: 'Gemini API',      monthlyPriceLabel: 'Usage-based' },
    ],
  },
  {
    toolId: 'v0',
    displayName: 'v0 (Vercel)',
    description: 'Generative UI system for quick React/HTML prototypes',
    primaryUseCases: ['coding', 'mixed'],
    isApiOnly: false,
    plans: [
      { planId: 'v0-free',       displayName: 'Free',       monthlyPriceLabel: 'Free' },
      { planId: 'v0-premium',    displayName: 'Premium',    monthlyPriceLabel: '$20/mo' },
      { planId: 'v0-enterprise', displayName: 'Enterprise', monthlyPriceLabel: 'Custom' },
    ],
  },
]

// Lookup helper — used in ToolCard to populate dropdowns
export function getToolConfig(toolId: ToolId): ToolConfig | undefined {
  return TOOL_CONFIGS.find(t => t.toolId === toolId)
}
