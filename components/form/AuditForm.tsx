'use client'

import React from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { auditInputSchema, type AuditInputSchema } from '@/lib/validation'
import { useFormPersistence } from '@/hooks/useFormPersistence'
import { ToolSelector } from './ToolSelector'
import { ToolCard } from './ToolCard'
import { TeamContextFields } from './TeamContextFields'
import { runAudit } from '@/engine'

export function AuditForm() {
  const form = useForm<AuditInputSchema>({
    resolver: zodResolver(auditInputSchema),
    defaultValues: {
      tools: [],
      teamSize: 1,
      primaryUseCase: 'coding',
      submittedAt: new Date().toISOString(),
    },
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'tools',
  })

  // Wire LocalStorage persistence — loads on mount, auto-saves on changes
  useFormPersistence(form.watch, form.reset)

  const onSubmit = (data: AuditInputSchema) => {
    // Phase 2: Calculate audit and log result to console
    const result = runAudit({
      ...data,
      submittedAt: new Date().toISOString(),
    })
    console.log('[AuditResult]', result)
    alert(`Audit ran successfully! Check your browser console to inspect the complete, modular AuditResult. Total Potential Monthly Savings: $${(result.totalMonthlySavingsCents / 100).toFixed(2)}`)
  }

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      noValidate
      className="w-full max-w-4xl mx-auto space-y-8 animate-fade-in"
    >
      {/* 1. Tool Selection Chips */}
      <ToolSelector fields={fields} append={append} remove={remove} />

      {/* Selected Tool Inputs */}
      {fields.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold tracking-tight text-white">
              Configure Your Stack Details
            </h2>
            <p className="text-xs text-gray-400">
              Provide exact seats and actual monthly spends for standard accuracy.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-4">
            {fields.map((field, index) => (
              <ToolCard
                key={field.id}
                index={index}
                toolId={field.toolId}
                form={form}
                remove={() => remove(index)}
              />
            ))}
          </div>
        </div>
      )}

      {/* 2. Team Size & Context Fields */}
      <TeamContextFields form={form} />

      {/* Validation Error Message Alert if tools array is empty */}
      {form.formState.errors.tools && (
        <div className="p-4 rounded-xl border border-red-900/30 bg-red-950/20 text-red-400 text-sm">
          ⚠️ {form.formState.errors.tools.message}
        </div>
      )}

      {/* Submit Button */}
      <div className="flex justify-end pt-4">
        <button
          type="submit"
          className="relative inline-flex items-center justify-center px-8 py-3.5 text-sm font-semibold rounded-xl bg-[#00E5A0] text-black shadow-lg hover:bg-[#00D090] active:scale-[0.98] transition-all duration-200"
        >
          Run Spend Audit
        </button>
      </div>
    </form>
  )
}
