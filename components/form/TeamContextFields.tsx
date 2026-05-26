'use client'

import React from 'react'
import type { UseFormReturn } from 'react-hook-form'
import type { AuditInputSchema } from '@/lib/validation'
import type { UseCase } from '@/types'

interface TeamContextFieldsProps {
  form: UseFormReturn<AuditInputSchema>
}

interface UseCaseOption {
  value: UseCase
  label: string
  description: string
}

const USE_CASE_OPTIONS: UseCaseOption[] = [
  { value: 'coding',   label: 'Coding',   description: 'Writing, refactoring, and reviewing code' },
  { value: 'writing',  label: 'Writing',  description: 'Copywriting, marketing, support docs, and emails' },
  { value: 'data',     label: 'Data Science', description: 'SQL querying, notebook analysis, and data modeling' },
  { value: 'research', label: 'Research', description: 'Summarizing long PDFs, synthesising market research' },
  { value: 'mixed',    label: 'Mixed Usecase', description: 'A balance of coding, writing, research, and data' },
]

export function TeamContextFields({ form }: TeamContextFieldsProps) {
  const { register, watch, setValue, formState: { errors } } = form

  const activeUseCase = watch('primaryUseCase')

  const handleUseCaseSelect = (val: UseCase) => {
    setValue('primaryUseCase', val, { shouldValidate: true })
  }

  const handleTeamSizeChange = (delta: number) => {
    const current = watch('teamSize') ?? 1
    const nextVal = Math.max(1, current + delta)
    setValue('teamSize', nextVal, { shouldValidate: true })
  }

  return (
    <div className="w-full bg-bg-elevated/60 backdrop-blur-sm border border-border rounded-lg p-6 space-y-6 shadow-lg">
      <h2 className="text-base font-semibold tracking-tight text-white">
        2. Set Team & Workflow Context
      </h2>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Total Team Size Input */}
        <div className="flex flex-col space-y-2">
          <label
            htmlFor="team-size-input"
            className="text-xs font-medium text-text-secondary"
          >
            Total Team Size
          </label>
          <p className="text-xs text-text-muted">
            Including both technical and non-technical staff.
          </p>
          <div className="flex items-center bg-bg border border-border rounded overflow-hidden h-[38px] max-w-[150px] mt-1">
            <button
              type="button"
              onClick={() => handleTeamSizeChange(-1)}
              aria-label="Decrease team size"
              className="w-12 h-full flex items-center justify-center text-text-secondary hover:text-white hover:bg-bg-subtle active:bg-bg-elevated transition-all min-w-[44px]"
            >
              &minus;
            </button>
            <input
              id="team-size-input"
              type="number"
              aria-invalid={!!errors.teamSize}
              aria-describedby={errors.teamSize ? 'team-size-error' : undefined}
              {...register('teamSize', { valueAsNumber: true })}
              className="flex-1 bg-transparent text-center text-sm text-white font-medium focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none w-12"
            />
            <button
              type="button"
              onClick={() => handleTeamSizeChange(1)}
              aria-label="Increase team size"
              className="w-12 h-full flex items-center justify-center text-text-secondary hover:text-white hover:bg-bg-subtle active:bg-bg-elevated transition-all min-w-[44px]"
            >
              +
            </button>
          </div>
          {errors.teamSize && (
            <p
              role="alert"
              id="team-size-error"
              className="text-xs text-danger mt-1"
            >
              {errors.teamSize.message}
            </p>
          )}
        </div>

        {/* Primary Usecase Selection Grid */}
        <div className="flex flex-col space-y-2 md:col-span-2">
          <span className="text-xs font-medium text-text-secondary">
            Primary AI Usecase
          </span>
          <p className="text-xs text-text-muted">
            What is the primary workload that drives your team&apos;s AI spend?
          </p>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5 mt-2">
            {USE_CASE_OPTIONS.map(opt => {
              const isSelected = activeUseCase === opt.value
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => handleUseCaseSelect(opt.value)}
                  aria-pressed={isSelected}
                  aria-label={`Select primary usecase: ${opt.label}`}
                  className="flex flex-col text-left p-4 rounded-sm border transition-colors cursor-pointer min-h-[44px] min-w-[44px]"
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
                  <span className="text-xs sm:text-sm font-semibold">
                    {opt.label}
                  </span>
                  <span className="mt-1.5 text-[10px] text-text-muted leading-normal line-clamp-3">
                    {opt.description}
                  </span>
                </button>
              )
            })}
          </div>
          {errors.primaryUseCase && (
            <p
              role="alert"
              id="usecase-error"
              className="text-xs text-danger mt-1"
            >
              {errors.primaryUseCase.message}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
