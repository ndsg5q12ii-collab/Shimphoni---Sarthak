import { useEffect, useRef, useState } from 'react'

/** Becomes true once the element scrolls into view (and stays true). */
export function useInView<T extends Element>(options: { rootMargin?: string; threshold?: number } = {}) {
  const ref = useRef<T | null>(null)
  const [inView, setInView] = useState(false)
  const { rootMargin = '0px 0px -12% 0px', threshold = 0.15 } = options

  useEffect(() => {
    const node = ref.current
    if (!node || inView) return
    if (typeof IntersectionObserver === 'undefined') {
      setInView(true)
      return
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setInView(true)
          observer.disconnect()
        }
      },
      { rootMargin, threshold },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [inView, rootMargin, threshold])

  return [ref, inView] as const
}
