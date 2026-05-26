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
        <span className="text-xs font-mono uppercase tracking-widest text-text-secondary">
          Click tiles to activate/deactivate
        </span>
        <span
          className="text-xs font-mono px-3 py-1 bg-black text-white font-bold uppercase tracking-wider"
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
              className={`px-4 py-3 border transition-colors cursor-pointer min-h-[48px] flex flex-col items-center justify-center gap-0.5 focus-visible:outline focus-visible:outline-3 focus-visible:outline-black focus-visible:outline-offset-2 ${
                isSelected
                  ? 'bg-black text-white border-black'
                  : 'bg-white text-black border-black/20 hover:border-black hover:bg-black/[0.02]'
              }`}
            >
              <span className="font-serif font-bold text-sm tracking-tight">
                {tool.displayName}
              </span>
              <span className={`text-[9px] font-mono uppercase tracking-widest ${
                isSelected ? 'text-text-muted' : 'text-text-secondary'
              }`}>
                {tool.isApiOnly ? 'API' : `${tool.plans.length} tiers`}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
