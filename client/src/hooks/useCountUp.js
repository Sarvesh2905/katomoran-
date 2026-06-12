import { useState, useEffect, useRef } from 'react'

/**
 * Animates a number from 0 to target with cubic ease-out.
 * @param {number} target - The target number to count up to
 * @param {number} duration - Animation duration in ms (default 1500)
 * @returns {number} - The current animated value
 */
export const useCountUp = (target, duration = 1500) => {
  const [count, setCount] = useState(0)
  const rafRef = useRef(null)
  const prevTargetRef = useRef(0)

  useEffect(() => {
    if (target === undefined || target === null || isNaN(target)) return

    const start = performance.now()
    const startVal = prevTargetRef.current

    const animate = (now) => {
      const elapsed = now - start
      const progress = Math.min(elapsed / duration, 1)
      // Cubic ease-out: 1 - (1 - t)^3
      const eased = 1 - Math.pow(1 - progress, 3)
      const current = Math.round(startVal + (target - startVal) * eased)
      setCount(current)

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate)
      } else {
        setCount(target)
        prevTargetRef.current = target
      }
    }

    if (rafRef.current) cancelAnimationFrame(rafRef.current)
    rafRef.current = requestAnimationFrame(animate)

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [target, duration])

  return count
}
