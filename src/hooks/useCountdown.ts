import { useEffect, useState } from 'react'

export type CountdownStatus = 'upcoming' | 'live' | 'past'

export interface Countdown {
  days: number
  hours: number
  minutes: number
  seconds: number
  status: CountdownStatus
}

function compute(startMs: number, endMs: number, now: number): Countdown {
  if (now >= endMs) return { days: 0, hours: 0, minutes: 0, seconds: 0, status: 'past' }
  if (now >= startMs) return { days: 0, hours: 0, minutes: 0, seconds: 0, status: 'live' }
  const total = Math.floor((startMs - now) / 1000)
  return {
    days: Math.floor(total / 86_400),
    hours: Math.floor((total % 86_400) / 3_600),
    minutes: Math.floor((total % 3_600) / 60),
    seconds: total % 60,
    status: 'upcoming',
  }
}

/**
 * Live countdown to an absolute instant. Because the target is an epoch timestamp
 * (built from the venue's UTC offset), the result is identical in every guest's time zone.
 * Values are clamped at zero, so the countdown never shows negative numbers.
 */
export function useCountdown(startMs: number, endMs: number): Countdown {
  const [state, setState] = useState(() => compute(startMs, endMs, Date.now()))

  useEffect(() => {
    let timer = 0
    const tick = () => {
      const now = Date.now()
      setState(compute(startMs, endMs, now))
      // Re-align to the next whole second so the display never drifts.
      timer = window.setTimeout(tick, 1000 - (now % 1000) + 8)
    }
    tick()
    const onVisible = () => {
      if (document.visibilityState === 'visible') {
        window.clearTimeout(timer)
        tick()
      }
    }
    document.addEventListener('visibilitychange', onVisible)
    return () => {
      window.clearTimeout(timer)
      document.removeEventListener('visibilitychange', onVisible)
    }
  }, [startMs, endMs])

  return state
}
