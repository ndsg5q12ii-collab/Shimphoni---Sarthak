import { memo, useMemo, type CSSProperties } from 'react'
import { round, seededRandom } from './svg'

/** Slow, sparse golden motes drifting upward. Pure CSS animation; static for reduced motion. */
export const GoldParticles = memo(function GoldParticles({ count = 26, className = '' }: { count?: number; className?: string }) {
  const particles = useMemo(() => {
    const rand = seededRandom(1717)
    return Array.from({ length: count }, (_, i) => ({
      left: round(rand() * 100, 2),
      top: round(30 + rand() * 70, 2),
      size: round(1.4 + rand() * 2.4, 2),
      opacity: round(0.25 + rand() * 0.55, 2),
      duration: round(16 + rand() * 16, 1),
      delay: round(-rand() * 30, 1),
      drift: round((rand() - 0.5) * 60, 1),
      key: i,
    }))
  }, [count])

  return (
    <div className={`gold-particles ${className}`} aria-hidden="true">
      {particles.map((p) => (
        <span
          key={p.key}
          style={
            {
              left: `${p.left}%`,
              top: `${p.top}%`,
              width: `${p.size}px`,
              height: `${p.size}px`,
              '--o': p.opacity,
              '--dx': `${p.drift}px`,
              animationDuration: `${p.duration}s`,
              animationDelay: `${p.delay}s`,
            } as CSSProperties
          }
        />
      ))}
    </div>
  )
})
