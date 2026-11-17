import { useId } from 'react'

export type Point = readonly [number, number]

/** Royal River palette, shared by every illustration. */
export const palette = {
  navy: '#071B3A',
  midnight: '#061329',
  invitation: '#173D78',
  gold: '#C8A45D',
  champagne: '#E7CD91',
  goldDeep: '#9C7B3C',
  goldPale: '#F2DEA6',
  ivory: '#F4EBDD',
  mist: '#7890AF',
  bulb: '#FFF1CC',
  window: '#F8D58D',
} as const

/** Stable, selector-safe ids for SVG gradients/filters (several SVGs can share a page). */
export function useSvgIds<const K extends readonly string[]>(keys: K): Record<K[number], { id: string; url: string }> {
  const base = useId().replace(/[^a-zA-Z0-9_-]/g, '')
  return Object.fromEntries(keys.map((key) => [key, { id: `rr-${base}-${key}`, url: `url(#rr-${base}-${key})` }])) as Record<
    K[number],
    { id: string; url: string }
  >
}

/** Evenly spaced points (by parameter) along a quadratic Bézier curve, end points included. */
export function quadraticPoints(p0: Point, p1: Point, p2: Point, count: number): Point[] {
  const points: Point[] = []
  for (let i = 0; i < count; i++) {
    const t = count === 1 ? 0.5 : i / (count - 1)
    const mt = 1 - t
    points.push([mt * mt * p0[0] + 2 * mt * t * p1[0] + t * t * p2[0], mt * mt * p0[1] + 2 * mt * t * p1[1] + t * t * p2[1]])
  }
  return points
}

/** Deterministic PRNG so generated scenery is identical on every render. */
export function seededRandom(seed: number) {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export const round = (n: number, digits = 1) => Number(n.toFixed(digits))
