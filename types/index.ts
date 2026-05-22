// The five use cases the audit engine reasons about
export type UseCase = 'coding' | 'writing' | 'data' | 'research' | 'mixed'

// Exactly 8 tool identifiers — these are the keys everything else hangs off
export type ToolId =
  | 'cursor'
  | 'github-copilot'
  | 'claude'
  | 'chatgpt'
  | 'anthropic-api'
  | 'openai-api'
  | 'gemini'
  | 'v0'

// PlanId is a string but typed as its own alias so we never accidentally
// pass a raw string where a PlanId is expected
export type PlanId = string

// One tool the user is currently paying for
export interface ToolSelection {
  toolId: ToolId
  planId: PlanId
  seats: number
  monthlySpendUSD: number // what they actually pay — may differ from official price
}

// The complete input to the audit engine
export interface AuditInput {
  tools: ToolSelection[]
  teamSize: number
  primaryUseCase: UseCase
  submittedAt: string // ISO 8601 timestamp — set at form submission time
}

// The four recommendation types the engine can emit — no others
export type RecommendationType =
  | 'downgrade-plan'       // cheaper plan from same vendor fits their team size
  | 'switch-vendor'        // cheaper alternative tool for their use case
  | 'eliminate-redundancy' // two tools solving the same problem
  | 'credits-opportunity'  // Credex can source this at a discount

// How confident the engine is in this recommendation
export type ConfidenceLevel = 'high' | 'medium' | 'low'

// A single actionable recommendation for one tool
export interface Recommendation {
  toolId: ToolId
  type: RecommendationType
  currentPlanId: PlanId
  recommendedPlanId: PlanId | null // null for eliminate-redundancy (no replacement plan)
  monthlySavingsCents: number      // integer cents — NO floats
  annualSavingsCents: number       // always exactly monthlySavingsCents * 12
  reason: string                   // one sentence, names real plans and real dollar amounts
  confidence: ConfidenceLevel
}

// Per-tool savings breakdown for the results page breakdown cards
export interface SavingsBreakdown {
  toolId: ToolId
  currentMonthlyUSD: number
  recommendedMonthlyUSD: number
  monthlySavingsCents: number
}

// The complete output of runAudit()
export interface AuditResult {
  recommendations: Recommendation[]
  totalMonthlySavingsCents: number
  totalAnnualSavingsCents: number
  isAlreadyOptimal: boolean     // true when totalMonthlySavingsCents < 100
  triggersCredexCTA: boolean    // true when totalMonthlySavingsCents > 50000
  savingsBreakdown: SavingsBreakdown[]
  generatedAt: string           // ISO timestamp set inside runAudit()
}

// Lead data captured after results are shown — never shown publicly
export interface UserLead {
  auditId: string
  email: string
  companyName?: string
  role?: string
  teamSize?: number
}

// The sanitized audit object safe for public /results/[slug] pages
// Note what is ABSENT: email, companyName, role, raw spend amounts
export interface PublicAudit {
  slug: string
  tools: Pick<ToolSelection, 'toolId' | 'planId' | 'seats'>[]
  recommendations: Recommendation[]
  totalMonthlySavingsCents: number
  totalAnnualSavingsCents: number
  isAlreadyOptimal: boolean
  aiSummary: string | null
  createdAt: string
}

// One plan's pricing config — every value traces to PRICING_DATA.md
export interface PricingConfig {
  toolId: ToolId
  planId: PlanId
  displayName: string               // e.g. "Cursor Business"
  monthlyPerSeatCents: number       // integer cents — 0 for API-only tools
  annualPerSeatCents: number | null // null if vendor only offers monthly billing
  minSeats: number                  // below this, the plan is economically irrational
  maxSeats: number | null           // null means no upper limit
  targetUseCases: UseCase[]         // which use cases this plan is designed for
  isApiOnly: boolean                // true for anthropic-api, openai-api — no seat concept
  sourceUrl: string                 // exact vendor pricing page URL
  verifiedAt: string                // ISO date you pulled this price — MUST be this week
}

// The AI-generated summary paragraph
export interface LLMGeneratedSummary {
  text: string
  generatedAt: string
  model: string          // e.g. 'claude-haiku-4-5'
  promptVersion: string  // increment this when you change the prompt
  isFallback: boolean    // true if Anthropic API failed and you used the template
}
