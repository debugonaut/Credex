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

  const inputClass = `
    w-full px-3 py-2 rounded text-sm text-white
    bg-bg-elevated border border-border
    placeholder:text-text-muted
    focus:outline-none focus:border-border-strong
    transition-colors
  `

  return (
    <div className="relative group w-full bg-bg-elevated/80 backdrop-blur-md rounded-lg border border-border p-6 shadow-xl transition-all duration-300 hover:border-border-strong animate-fade-slide-up">
      {/* Delete Button */}
      <button
        type="button"
        onClick={remove}
        aria-label={`Remove ${toolConfig.displayName}`}
        className="absolute top-4 right-4 flex items-center justify-center w-11 h-11 rounded-full border border-border bg-bg text-text-secondary hover:text-danger hover:border-danger/50 transition-all duration-300 min-w-[44px] min-h-[44px]"
      >
        <span className="text-xl font-medium leading-none">&times;</span>
      </button>

      {/* Card Header */}
      <div className="pr-12 mb-6">
        <h3 className="text-lg font-semibold text-white tracking-tight">
          {toolConfig.displayName}
        </h3>
        <p className="text-xs text-text-secondary mt-1 leading-relaxed">
          {toolConfig.description}
        </p>
      </div>

      {/* Fields Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        {/* Plan Selector */}
        <div className="flex flex-col space-y-2">
          <label
            htmlFor={`plan-select-${index}`}
            className="text-xs font-medium text-text-secondary"
          >
            Plan
          </label>
          <div className="relative">
            <select
              id={`plan-select-${index}`}
              {...register(`tools.${index}.planId`)}
              className={`${inputClass} appearance-none cursor-pointer pr-10`}
            >
              {toolConfig.plans.map(plan => (
                <option key={plan.planId} value={plan.planId}>
                  {plan.displayName} ({plan.monthlyPriceLabel})
                </option>
              ))}
            </select>
            {/* Custom arrow down icon */}
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3.5 text-text-secondary">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
              </svg>
            </div>
          </div>
          {toolErrors?.planId && (
            <p
              role="alert"
              id={`plan-error-${index}`}
              className="text-xs text-danger"
            >
              {toolErrors.planId.message}
            </p>
          )}
        </div>

        {/* Seat Count (Hidden for API-only tools) */}
        {!toolConfig.isApiOnly ? (
          <div className="flex flex-col space-y-2">
            <label
              htmlFor={`seat-input-${index}`}
              className="text-xs font-medium text-text-secondary"
            >
              Seats
            </label>
            <div className="flex items-center bg-bg border border-border rounded overflow-hidden h-[38px] max-w-[150px]">
              <button
                type="button"
                onClick={() => handleSeatChange(-1)}
                aria-label={`Decrease seat count for ${toolConfig.displayName}`}
                className="w-12 h-full flex items-center justify-center text-text-secondary hover:text-white hover:bg-bg-subtle active:bg-bg-elevated transition-all min-w-[44px]"
              >
                &minus;
              </button>
              <input
                id={`seat-input-${index}`}
                type="number"
                aria-invalid={!!toolErrors?.seats}
                aria-describedby={toolErrors?.seats ? `seat-error-${index}` : undefined}
                {...register(`tools.${index}.seats`, { valueAsNumber: true })}
                className="flex-1 bg-transparent text-center text-sm text-white font-medium focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none w-12"
              />
              <button
                type="button"
                onClick={() => handleSeatChange(1)}
                aria-label={`Increase seat count for ${toolConfig.displayName}`}
                className="w-12 h-full flex items-center justify-center text-text-secondary hover:text-white hover:bg-bg-subtle active:bg-bg-elevated transition-all min-w-[44px]"
              >
                +
              </button>
            </div>
            {toolErrors?.seats && (
              <p
                role="alert"
                id={`seat-error-${index}`}
                className="text-xs text-danger"
              >
                {toolErrors.seats.message}
              </p>
            )}
          </div>
        ) : (
          /* Placeholder to align spacing on desktop grid */
          <div className="hidden sm:block" />
        )}

        {/* Monthly Spend */}
        <div className="flex flex-col space-y-2">
          <label
            htmlFor={`spend-input-${index}`}
            className="text-xs font-medium text-text-secondary"
          >
            {toolConfig.isApiOnly ? 'Monthly spend (required)' : 'Monthly spend ($)'}
          </label>
          <div className="relative flex items-center">
            <span className="absolute left-3 text-sm text-text-secondary">$</span>
            <input
              id={`spend-input-${index}`}
              type="number"
              step="any"
              placeholder="0.00"
              aria-invalid={!!toolErrors?.monthlySpendUSD}
              aria-describedby={
                toolErrors?.monthlySpendUSD
                  ? `spend-error-${index}`
                  : showEstimation
                  ? `spend-helper-${index}`
                  : undefined
              }
              {...register(`tools.${index}.monthlySpendUSD`, { valueAsNumber: true })}
              className={`${inputClass} pl-7`}
            />
          </div>
          {toolErrors?.monthlySpendUSD && (
            <p
              role="alert"
              id={`spend-error-${index}`}
              className="text-xs text-danger"
            >
              {toolErrors.monthlySpendUSD.message}
            </p>
          )}

          {/* Dynamic Helper Notes */}
          {showEstimation && expectedMonthlySpendUSD > 0 && (
            <p
              id={`spend-helper-${index}`}
              className="text-xs text-text-secondary font-mono italic animate-fade-in"
            >
              Estimated: ${expectedMonthlySpendUSD.toFixed(0)}/mo ({seats} × ${officialMonthlyPricePerSeatUSD}/mo)
            </p>
          )}
          {showUnderpaidWarning && (
            <p className="text-[10px] text-amber-400 leading-normal bg-amber-950/20 border border-amber-900/30 rounded p-2 mt-1">
              ⚠️ Below standard pricing — annual or discounted plan?
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
