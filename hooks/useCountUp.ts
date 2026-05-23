import { useEffect, useRef, useState } from 'react'

interface UseCountUpOptions {
  end: number           // target value in cents
  duration?: number     // animation duration in ms, default 1500
  startOnMount?: boolean
}

export function useCountUp({
  end,
  duration = 1500,
  startOnMount = true,
}: UseCountUpOptions): number {
  const [current, setCurrent] = useState(0)
  const frameRef = useRef<number>()
  const startTimeRef = useRef<number>()

  useEffect(() => {
    if (!startOnMount) return

    // Reset the start time so that if the target changes, the animation restarts cleanly
    startTimeRef.current = undefined

    // Ease-out cubic: decelerates toward the end
    // t is progress from 0 to 1 — returns eased progress
    const easeOutCubic = (t: number): number => 1 - Math.pow(1 - t, 3)

    const animate = (timestamp: number) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp

      const elapsed = timestamp - startTimeRef.current
      const progress = Math.min(elapsed / duration, 1)
      const easedProgress = easeOutCubic(progress)

      setCurrent(Math.round(easedProgress * end))

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate)
      }
    }

    frameRef.current = requestAnimationFrame(animate)

    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current)
    }
  }, [end, duration, startOnMount])

  return current
}
