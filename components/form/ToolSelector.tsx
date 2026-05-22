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
        seats: config?.isApiOnly ? 1 : 1,
        monthlySpendUSD: 0,
      })
    }
  }

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold tracking-tight text-white">
          1. Select the AI Tools in your Stack
        </h2>
        <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-[#18181B] text-gray-400 border border-[#27272A]">
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
              className={`group relative flex flex-col items-center justify-center p-4 rounded-xl border text-center transition-all duration-300 ${
                isSelected
                  ? 'bg-[#00E5A0]/5 border-[#00E5A0] shadow-[0_0_15px_rgba(0,229,160,0.1)]'
                  : 'bg-[#121214] border-[#27272A] hover:border-gray-500 hover:bg-[#161619]'
              }`}
            >
              {/* Micro-glow effect on active state */}
              {isSelected && (
                <div className="absolute inset-0 -z-10 rounded-xl bg-gradient-to-tr from-[#00E5A0]/10 to-transparent blur-md opacity-70" />
              )}
              
              <span className={`text-sm font-medium transition-colors ${
                isSelected ? 'text-[#00E5A0]' : 'text-gray-300 group-hover:text-white'
              }`}>
                {tool.displayName}
              </span>
              <span className="mt-1 text-[10px] text-gray-500 group-hover:text-gray-400 line-clamp-1">
                {tool.isApiOnly ? 'API-only' : `${tool.plans.length} tiers`}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
