'use client'

import React from 'react'
import { TOOL_CONFIGS } from '@/constants/tools'
import type { ToolId } from '@/types'

interface ToolSelectorProps {
  fields: { id: string; toolId: ToolId }[]
  append: (value: { toolId: ToolId; planId: string; seats: number; monthlySpendUSD: number }) => void
  remove: (index: number) => void
}

export function ToolSelector({ fields, append, remove }: ToolSelectorProps) {
  const selectedToolIds = new Set(fields.map(f => f.toolId))

  const handleToggle = (toolId: ToolId) => {
    const existingIndex = fields.findIndex(f => f.toolId === toolId)
    if (existingIndex > -1) {
      remove(existingIndex)
    } else {
      const config = TOOL_CONFIGS.find(t => t.toolId === toolId)
      const defaultPlanId = config?.plans[0]?.planId ?? ''
      append({
        toolId,
        planId: defaultPlanId,
        seats: 1,
        monthlySpendUSD: 0,
      })
    }
  }

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold tracking-tight text-white">
          1. Select the AI Tools in your Stack
        </h2>
        <span
          className="text-xs font-mono px-2.5 py-1 rounded-sm bg-bg-elevated text-text-secondary border border-border"
          aria-live="polite"
        >
          {fields.length} {fields.length === 1 ? 'tool' : 'tools'} selected
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {TOOL_CONFIGS.map(tool => {
          const isSelected = selectedToolIds.has(tool.toolId)
          return (
            <button
              key={tool.toolId}
              type="button"
              onClick={() => handleToggle(tool.toolId)}
              aria-pressed={isSelected}
              aria-label={`Toggle ${tool.displayName} in your stack selection`}
              className="px-4 py-2 rounded-sm text-sm font-medium border transition-colors cursor-pointer min-h-[44px] min-w-[44px] flex flex-col items-center justify-center gap-0.5"
              style={
                isSelected
                  ? {
                      borderColor: 'var(--color-accent)',
                      backgroundColor: 'rgba(0, 229, 160, 0.08)',
                      color: 'var(--color-accent)',
                    }
                  : {
                      borderColor: 'var(--color-border)',
                      backgroundColor: 'transparent',
                      color: 'var(--color-text-secondary)',
                    }
              }
            >
              <span className="font-semibold text-xs sm:text-sm">
                {tool.displayName}
              </span>
              <span className="text-[9px] opacity-75 font-mono">
                {tool.isApiOnly ? 'API' : `${tool.plans.length} tiers`}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
