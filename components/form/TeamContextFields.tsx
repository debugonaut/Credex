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
    <div className="w-full bg-[#121214]/60 backdrop-blur-sm border border-[#27272A] rounded-2xl p-6 space-y-6 shadow-lg">
      <h2 className="text-xl font-semibold tracking-tight text-white">
        2. Set Team & Workflow Context
      </h2>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Total Team Size Input */}
        <div className="flex flex-col space-y-2">
          <label className="text-sm font-medium text-gray-300">
            Total Team Size
          </label>
          <p className="text-xs text-gray-400">
            Including both technical and non-technical staff.
          </p>
          <div className="flex items-center bg-[#1C1C1E] border border-[#27272A] rounded-xl overflow-hidden h-[42px] max-w-[200px] mt-1">
            <button
              type="button"
              onClick={() => handleTeamSizeChange(-1)}
              className="w-12 h-full flex items-center justify-center text-gray-400 hover:text-white hover:bg-[#27272A] active:bg-[#1E1E21] transition-all"
            >
              &minus;
            </button>
            <input
              type="number"
              {...register('teamSize', { valueAsNumber: true })}
              className="flex-1 bg-transparent text-center text-sm text-white font-medium focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
            <button
              type="button"
              onClick={() => handleTeamSizeChange(1)}
              className="w-12 h-full flex items-center justify-center text-gray-400 hover:text-white hover:bg-[#27272A] active:bg-[#1E1E21] transition-all"
            >
              +
            </button>
          </div>
          {errors.teamSize && (
            <p className="text-xs text-red-400 mt-1">{errors.teamSize.message}</p>
          )}
        </div>

        {/* Primary Usecase Selection Grid */}
        <div className="flex flex-col space-y-2 md:col-span-2">
          <label className="text-sm font-medium text-gray-300">
            Primary AI Usecase
          </label>
          <p className="text-xs text-gray-400">
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
                  className={`flex flex-col text-left p-4 rounded-xl border transition-all duration-300 ${
                    isSelected
                      ? 'bg-[#00E5A0]/5 border-[#00E5A0] shadow-[0_0_12px_rgba(0,229,160,0.08)]'
                      : 'bg-[#1C1C1E] border-[#27272A] hover:border-gray-500 hover:bg-[#222225]'
                  }`}
                >
                  <span className={`text-sm font-semibold transition-colors ${
                    isSelected ? 'text-[#00E5A0]' : 'text-gray-200'
                  }`}>
                    {opt.label}
                  </span>
                  <span className="mt-1.5 text-[10px] text-gray-400 leading-normal line-clamp-3">
                    {opt.description}
                  </span>
                </button>
              )
            })}
          </div>
          {errors.primaryUseCase && (
            <p className="text-xs text-red-400 mt-1">{errors.primaryUseCase.message}</p>
          )}
        </div>
      </div>
    </div>
  )
}
