import { useEffect, useRef } from 'react'
import { prefersReducedMotion } from './usePrefersReducedMotion'

/**
 * Subtle scroll parallax: translates the target relative to its frame while the frame
 * is on screen. Uses one rAF-throttled passive listener and only transform, so it
 * stays on the compositor. Disabled for reduced-motion users.
 */
export function useParallax<F extends HTMLElement, T extends HTMLElement>(strength = 0.12) {
  const frameRef = useRef<F | null>(null)
  const targetRef = useRef<T | null>(null)

  useEffect(() => {
    const frame = frameRef.current
    const target = targetRef.current
    if (!frame || !target || prefersReducedMotion()) return

    let raf = 0
    let visible = false
    const update = () => {
      raf = 0
      const rect = frame.getBoundingClientRect()
      const viewport = window.innerHeight
      // -1 when the frame's centre is one viewport below centre, +1 when one viewport above.
      const progress = (viewport / 2 - (rect.top + rect.height / 2)) / viewport
      const offset = Math.max(-1, Math.min(1, progress)) * rect.height * strength
      target.style.transform = `translate3d(0, ${offset.toFixed(1)}px, 0) scale(1.18)`
    }
    const onScroll = () => {
      if (visible && !raf) raf = requestAnimationFrame(update)
    }
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      if (visible) onScroll()
    })
    observer.observe(frame)
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    update()
    return () => {
      observer.disconnect()
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [strength])

  return { frameRef, targetRef }
}
