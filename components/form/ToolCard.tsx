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

  // Pure bottom-bordered black focus inputs matching design system
  const inputClass = `
    w-full px-2 py-2 text-sm text-black
    bg-white border-b-2 border-black
    placeholder:text-text-secondary placeholder:italic
    focus:outline-none focus:border-b-[4px]
    transition-all duration-100
  `

  return (
    <div className="relative group w-full bg-white border border-black p-6 md:p-8 animate-fade-slide-up hover:bg-bg-subtle transition-colors duration-100">
      {/* Sharp Delete Button */}
      <button
        type="button"
        onClick={remove}
        aria-label={`Remove ${toolConfig.displayName}`}
        className="absolute top-4 right-4 flex items-center justify-center w-10 h-10 border border-black bg-white text-black hover:bg-black hover:text-white transition-colors duration-100 min-w-[40px] min-h-[40px] focus-visible:outline focus-visible:outline-3 focus-visible:outline-black focus-visible:outline-offset-2"
      >
        <span className="text-xl font-bold leading-none">&times;</span>
      </button>

      {/* Card Header */}
      <div className="pr-12 mb-6">
        <h3 className="font-serif font-bold text-xl text-black tracking-tight">
          {toolConfig.displayName}
        </h3>
        <p className="text-xs text-text-secondary mt-1 leading-relaxed font-serif">
          {toolConfig.description}
        </p>
      </div>

      {/* Fields Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        {/* Plan Selector */}
        <div className="flex flex-col space-y-2">
          <label
            htmlFor={`plan-select-${index}`}
            className="text-xs font-mono uppercase tracking-widest text-text-secondary"
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
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-black">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
              </svg>
            </div>
          </div>
          {toolErrors?.planId && (
            <p
              role="alert"
              id={`plan-error-${index}`}
              className="text-xs font-mono uppercase tracking-wider text-black mt-1"
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
              className="text-xs font-mono uppercase tracking-widest text-text-secondary"
            >
              Seats
            </label>
            <div className="flex items-center bg-white border-2 border-black h-[38px] max-w-[150px]">
              <button
                type="button"
                onClick={() => handleSeatChange(-1)}
                aria-label={`Decrease seat count for ${toolConfig.displayName}`}
                className="w-12 h-full flex items-center justify-center text-black border-r border-black hover:bg-black hover:text-white transition-colors duration-100 min-w-[40px] focus-visible:outline focus-visible:outline-3 focus-visible:outline-black focus-visible:outline-offset-1"
              >
                &minus;
              </button>
              <input
                id={`seat-input-${index}`}
                type="number"
                aria-invalid={!!toolErrors?.seats}
                aria-describedby={toolErrors?.seats ? `seat-error-${index}` : undefined}
                {...register(`tools.${index}.seats`, { valueAsNumber: true })}
                className="flex-1 bg-transparent text-center text-sm text-black font-mono font-bold focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none w-12"
              />
              <button
                type="button"
                onClick={() => handleSeatChange(1)}
                aria-label={`Increase seat count for ${toolConfig.displayName}`}
                className="w-12 h-full flex items-center justify-center text-black border-l border-black hover:bg-black hover:text-white transition-colors duration-100 min-w-[40px] focus-visible:outline focus-visible:outline-3 focus-visible:outline-black focus-visible:outline-offset-1"
              >
                +
              </button>
            </div>
            {toolErrors?.seats && (
              <p
                role="alert"
                id={`seat-error-${index}`}
                className="text-xs font-mono uppercase tracking-wider text-black mt-1"
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
            className="text-xs font-mono uppercase tracking-widest text-text-secondary"
          >
            {toolConfig.isApiOnly ? 'Monthly spend (required)' : 'Monthly spend ($)'}
          </label>
          <div className="relative flex items-center">
            <span className="absolute left-1 text-sm font-mono text-text-secondary">$</span>
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
              className={`${inputClass} pl-5`}
            />
          </div>
          {toolErrors?.monthlySpendUSD && (
            <p
              role="alert"
              id={`spend-error-${index}`}
              className="text-xs font-mono uppercase tracking-wider text-black mt-1"
            >
              {toolErrors.monthlySpendUSD.message}
            </p>
          )}

          {/* Dynamic Helper Notes */}
          {showEstimation && expectedMonthlySpendUSD > 0 && (
            <p
              id={`spend-helper-${index}`}
              className="text-xs text-text-secondary font-mono tracking-wide uppercase italic animate-fade-in"
            >
              Estimated: ${expectedMonthlySpendUSD.toFixed(0)}/mo
            </p>
          )}
          {showUnderpaidWarning && (
            <p className="text-[10px] text-black leading-normal border border-black bg-white p-2 mt-2 font-mono uppercase tracking-wider">
              ⚠️ Standard pricing discrepancy flagged — custom discount?
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
