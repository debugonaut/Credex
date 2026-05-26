'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { auditInputSchema, type AuditInputSchema } from '@/lib/validation'
import { useFormPersistence } from '@/hooks/useFormPersistence'
import { ToolSelector } from './ToolSelector'
import { ToolCard } from './ToolCard'
import { TeamContextFields } from './TeamContextFields'

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

  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const router = useRouter()

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'tools',
  })

  // Wire LocalStorage persistence — loads on mount, auto-saves on changes
  useFormPersistence(form.watch, form.reset)

  // Fire form_started once when first tool is selected — marks funnel entry
  React.useEffect(() => {
    if (fields.length === 1) {
      fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug: null, eventType: 'form_started' }),
      }).catch(() => {})
    }
  }, [fields.length])

  const onSubmit = async (data: AuditInputSchema) => {
    setSubmitting(true)
    setSubmitError(null)

    try {
      const res = await fetch('/api/audit/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, submittedAt: new Date().toISOString() }),
      })

      if (res.status === 429) {
        setSubmitError('Too many submissions. Please wait an hour and try again.')
        return
      }

      if (!res.ok) {
        setSubmitError('Something went wrong during the audit. Please try again.')
        return
      }

      const { slug } = (await res.json()) as { slug: string }

      // Clear persisted form state after successful submission
      localStorage.removeItem('credex-audit-form-state')

      // Redirect to results page
      router.push(`/results/${slug}`)
    } catch {
      setSubmitError('Network error. Please check your internet connection and try again.')
    } finally {
      setSubmitting(false)
    }
  }

  // Running monthly spend total calculation
  const tools = form.watch('tools') || []
  const totalMonthlySpend = tools.reduce((sum, t) => sum + (Number(t?.monthlySpendUSD) || 0), 0)

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      noValidate
      className="w-full space-y-8 animate-fade-slide-up"
    >
      {/* 1. Tool Selection Chips */}
      <div className="space-y-4">
        <h2 className="font-serif font-bold text-2xl text-black uppercase tracking-tight">
          Select Your Paid Tools
        </h2>
        <ToolSelector fields={fields} append={append} remove={remove} />
      </div>

      {/* Selected Tool Inputs */}
      {fields.length > 0 && (
        <div className="space-y-6 pt-4 border-t border-black">
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
            <h2 className="font-serif font-bold text-2xl text-black uppercase tracking-tight">
              Configure Your Stack Details
            </h2>
            <p className="text-xs font-mono uppercase tracking-wider text-text-secondary">
              Provide exact seats and actual monthly spends.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6">
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
      <div className="pt-6 border-t border-black">
        <TeamContextFields form={form} />
      </div>

      {/* Running monthly spend summary — color inverted */}
      {totalMonthlySpend > 0 && (
        <div className="flex items-center justify-between p-6 bg-black text-white mt-8">
          <span className="font-mono text-xs uppercase tracking-widest text-text-muted">
            Current Monthly Spend
          </span>
          <span className="font-mono font-bold text-xl tracking-tight">
            ${totalMonthlySpend.toLocaleString('en-US')}/mo
          </span>
        </div>
      )}

      {/* Validation Error Message Alert if tools array is empty */}
      {form.formState.errors.tools && (
        <div
          role="alert"
          className="p-4 border-2 border-black bg-white text-black text-xs font-mono uppercase tracking-widest"
        >
          ⚠️ {form.formState.errors.tools.message}
        </div>
      )}

      {/* API Submission Error Message */}
      {submitError && (
        <div
          role="alert"
          className="p-4 border-2 border-black bg-white text-black text-xs font-mono uppercase tracking-widest"
        >
          ⚠️ {submitError}
        </div>
      )}

      {/* Submit Button */}
      <div className="flex justify-end pt-4 border-t border-black">
        <button
          type="submit"
          disabled={submitting}
          aria-busy={submitting}
          className="inline-flex items-center justify-center px-8 py-4 text-xs font-mono font-bold uppercase tracking-widest bg-black text-white border-2 border-black hover:bg-white hover:text-black transition-all duration-100 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer min-h-[48px] min-w-[200px] focus-visible:outline focus-visible:outline-3 focus-visible:outline-black focus-visible:outline-offset-3"
        >
          {submitting ? 'Running Audit…' : 'Run Spend Audit →'}
        </button>
      </div>
    </form>
  )
}
