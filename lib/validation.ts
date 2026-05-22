import { z } from 'zod'

export const toolSelectionSchema = z.object({
  toolId: z.enum(['cursor', 'github-copilot', 'claude', 'chatgpt', 'anthropic-api', 'openai-api', 'gemini', 'v0']),
  planId: z.string().min(1, 'Select a plan'),
  seats: z.number().int().min(1).max(10000),
  monthlySpendUSD: z.number().min(0, 'Monthly spend cannot be negative'),
})

export const auditInputSchema = z.object({
  tools: z.array(toolSelectionSchema).min(1, 'Select at least one tool'),
  teamSize: z.number().int().min(1, 'Team size must be at least 1'),
  primaryUseCase: z.enum(['coding', 'writing', 'data', 'research', 'mixed']),
  submittedAt: z.string().datetime(),
})

export type AuditInputSchema = z.infer<typeof auditInputSchema>
