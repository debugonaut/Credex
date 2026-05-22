'use client'

import React from 'react'
import type { UseFormReturn } from 'react-hook-form'
import { getToolConfig } from '@/constants/tools'
import { getPricingConfig } from '@/engine/pricing'
import type { ToolId } from '@/types'
import type { AuditInputSchema } from '@/lib/validation'

interface ToolCardProps {
  index: number
  toolId: ToolId
  form: UseFormReturn<AuditInputSchema>
  remove: () => void
}

export function ToolCard({ index, toolId, form, remove }: ToolCardProps) {
  const { register, watch, setValue, formState: { errors } } = form

  const toolConfig = getToolConfig(toolId)
  if (!toolConfig) return null

  // Watch fields for dynamic calculations
  const planId = watch(`tools.${index}.planId`)
  const seats = watch(`tools.${index}.seats`) ?? 1
  const monthlySpendUSD = watch(`tools.${index}.monthlySpendUSD`) ?? 0

  // Lookup official pricing
  const pricingConfig = getPricingConfig(toolId, planId)
  const officialMonthlyPricePerSeatUSD = pricingConfig ? pricingConfig.monthlyPerSeatCents / 100 : 0
  const expectedMonthlySpendUSD = officialMonthlyPricePerSeatUSD * seats

  // Warnings / helpers
  const showEstimation = !toolConfig.isApiOnly && (monthlySpendUSD === 0 || !monthlySpendUSD)
  const showUnderpaidWarning =
    !toolConfig.isApiOnly &&
    monthlySpendUSD > 0 &&
    monthlySpendUSD < expectedMonthlySpendUSD * 0.5

  const handleSeatChange = (delta: number) => {
    const current = watch(`tools.${index}.seats`) ?? 1
    const nextVal = Math.max(1, current + delta)
    setValue(`tools.${index}.seats`, nextVal, { shouldValidate: true })
  }

  const toolErrors = errors.tools?.[index]

  return (
    <div className="relative group w-full bg-[#121214]/80 backdrop-blur-md rounded-2xl border border-[#27272A] p-6 shadow-xl transition-all duration-300 hover:border-gray-600">
      {/* Delete Button */}
      <button
        type="button"
        onClick={remove}
        aria-label={`Remove ${toolConfig.displayName}`}
        className="absolute top-4 right-4 flex items-center justify-center w-8 h-8 rounded-full border border-[#27272A] bg-[#1C1C1E] text-gray-400 hover:text-red-400 hover:border-red-400/50 transition-all duration-300"
      >
        <span className="text-lg font-medium leading-none">&times;</span>
      </button>

      {/* Card Header */}
      <div className="pr-8 mb-6">
        <h3 className="text-lg font-semibold text-white tracking-tight">
          {toolConfig.displayName}
        </h3>
        <p className="text-xs text-gray-400 mt-1 leading-relaxed">
          {toolConfig.description}
        </p>
      </div>

      {/* Fields Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        {/* Plan Selector */}
        <div className="flex flex-col space-y-2">
          <label className="text-xs font-medium text-gray-300">Plan</label>
          <div className="relative">
            <select
              {...register(`tools.${index}.planId`)}
              className="w-full bg-[#1C1C1E] border border-[#27272A] rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-[#00E5A0] focus:border-[#00E5A0] appearance-none cursor-pointer"
            >
              {toolConfig.plans.map(plan => (
                <option key={plan.planId} value={plan.planId}>
                  {plan.displayName} ({plan.monthlyPriceLabel})
                </option>
              ))}
            </select>
            {/* Custom arrow down icon */}
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3.5 text-gray-400">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
              </svg>
            </div>
          </div>
          {toolErrors?.planId && (
            <p className="text-[11px] text-red-400">{toolErrors.planId.message}</p>
          )}
        </div>

        {/* Seat Count (Hidden for API-only tools) */}
        {!toolConfig.isApiOnly ? (
          <div className="flex flex-col space-y-2">
            <label className="text-xs font-medium text-gray-300">Seats</label>
            <div className="flex items-center bg-[#1C1C1E] border border-[#27272A] rounded-xl overflow-hidden h-[42px]">
              <button
                type="button"
                onClick={() => handleSeatChange(-1)}
                className="w-12 h-full flex items-center justify-center text-gray-400 hover:text-white hover:bg-[#27272A] active:bg-[#1E1E21] transition-all"
              >
                &minus;
              </button>
              <input
                type="number"
                {...register(`tools.${index}.seats`, { valueAsNumber: true })}
                className="flex-1 bg-transparent text-center text-sm text-white font-medium focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
              <button
                type="button"
                onClick={() => handleSeatChange(1)}
                className="w-12 h-full flex items-center justify-center text-gray-400 hover:text-white hover:bg-[#27272A] active:bg-[#1E1E21] transition-all"
              >
                +
              </button>
            </div>
            {toolErrors?.seats && (
              <p className="text-[11px] text-red-400">{toolErrors.seats.message}</p>
            )}
          </div>
        ) : (
          /* Placeholder to align spacing on desktop grid */
          <div className="hidden sm:block" />
        )}

        {/* Monthly Spend */}
        <div className="flex flex-col space-y-2">
          <label className="text-xs font-medium text-gray-300">
            {toolConfig.isApiOnly ? 'Monthly spend (required)' : 'Monthly spend ($)'}
          </label>
          <div className="relative flex items-center">
            <span className="absolute left-3.5 text-sm text-gray-400">$</span>
            <input
              type="number"
              step="any"
              placeholder="0.00"
              {...register(`tools.${index}.monthlySpendUSD`, { valueAsNumber: true })}
              className="w-full bg-[#1C1C1E] border border-[#27272A] rounded-xl pl-8 pr-3.5 py-2.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-[#00E5A0] focus:border-[#00E5A0]"
            />
          </div>
          {toolErrors?.monthlySpendUSD && (
            <p className="text-[11px] text-red-400">{toolErrors.monthlySpendUSD.message}</p>
          )}

          {/* Dynamic Helper Notes */}
          {showEstimation && expectedMonthlySpendUSD > 0 && (
            <p className="text-[11px] text-gray-400 font-mono italic animate-fade-in">
              Estimated: ${expectedMonthlySpendUSD.toFixed(0)}/mo ({seats} × ${officialMonthlyPricePerSeatUSD}/mo)
            </p>
          )}
          {showUnderpaidWarning && (
            <p className="text-[10px] text-amber-400/80 leading-normal bg-amber-950/20 border border-amber-900/30 rounded-lg p-2 mt-1">
              ⚠️ Below standard pricing — annual or discounted plan?
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
