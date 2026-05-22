import { useEffect, useRef } from 'react'
import { UseFormWatch, UseFormReset } from 'react-hook-form'
import { useMounted } from './useMounted'
import type { AuditInput } from '@/types'

const STORAGE_KEY = 'credex-audit-form-state'
const DEBOUNCE_MS = 500

export function useFormPersistence(
  watch: UseFormWatch<any>,
  reset: UseFormReset<any>
) {
  const mounted = useMounted()
  const debounceRef = useRef<ReturnType<typeof setTimeout>>()

  // Rehydrate from localStorage on mount
  useEffect(() => {
    if (!mounted) return
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored) as AuditInput
        reset(parsed)
      }
    } catch {
      // Corrupted localStorage state — silently ignore, start fresh
      localStorage.removeItem(STORAGE_KEY)
    }
  }, [mounted, reset])

  // Persist on every change, debounced
  useEffect(() => {
    if (!mounted) return
    const subscription = watch(values => {
      clearTimeout(debounceRef.current)
      debounceRef.current = setTimeout(() => {
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(values))
        } catch {
          // localStorage quota exceeded or unavailable — fail silently
        }
      }, DEBOUNCE_MS)
    })
    return () => subscription.unsubscribe()
  }, [mounted, watch])
}
