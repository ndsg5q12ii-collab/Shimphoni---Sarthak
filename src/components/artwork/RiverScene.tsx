import { memo, useMemo } from 'react'
import { palette, round, seededRandom, type Point } from './svg'

const HORIZON = 642

const SHIMMER_STYLES = [
  { name: 'shimmer-a', width: 1.5, opacity: 0.24 },
  { name: 'shimmer-b', width: 1.2, opacity: 0.18 },
  { name: 'shimmer-c', width: 2, opacity: 0.11 },
] as const

/* Howrah Bridge profile in local units: deck at y = 0, towers at ±176. */
const TOP_CHORD: Point[] = [
  [-292, -4],
  [-176, -96],
  [-62, -42],
  [0, -37],
  [62, -42],
  [176, -96],
  [292, -4],
]

function topY(x: number): number {
  for (let i = 0; i < TOP_CHORD.length - 1; i++) {
    const [x1, y1] = TOP_CHORD[i]
    const [x2, y2] = TOP_CHORD[i + 1]
    if (x >= x1 && x <= x2) return y1 + ((x - x1) / (x2 - x1)) * (y2 - y1)
  }
  return 0
}

function samplePolyline(points: Point[], spacing: number): Point[] {
  const out: Point[] = []
  for (let i = 0; i < points.length - 1; i++) {
    const [x1, y1] = points[i]
    const [x2, y2] = points[i + 1]
    const length = Math.hypot(x2 - x1, y2 - y1)
    const steps = Math.max(1, Math.round(length / spacing))
    for (let s = 0; s < steps; s++) out.push([x1 + ((x2 - x1) * s) / steps, y1 + ((y2 - y1) * s) / steps])
  }
  out.push(points[points.length - 1])
  return out
}

function buildBridge() {
  let truss = ''
  const xs: number[] = []
  for (let x = -280; x <= 280; x += 16) xs.push(x)
  for (const x of xs) truss += `M${x} 0V${round(topY(x))}`
  for (let i = 0; i < xs.length - 1; i++) {
    const a = xs[i]
    const b = xs[i + 1]
    truss += `M${a} ${round(topY(a))}L${b} 0M${a} 0L${b} ${round(topY(b))}`
  }
  const chord = `M${TOP_CHORD.map(([x, y]) => `${x} ${y}`).join('L')}`
  const topLights = samplePolyline(TOP_CHORD, 11)
  const deckLights: Point[] = []
  for (let x = -380; x <= 380; x += 9) deckLights.push([x, -1])
  return { truss, chord, topLights, deckLights }
}

function buildSkyline() {
  const rand = seededRandom(20270101)
  let path = `M0 ${HORIZON}`
  const windows: { x: number; y: number; o: number }[] = []
  let x = 0
  while (x < 1600) {
    const w = 14 + rand() * 38
    const tall = rand() > 0.9
    const h = tall ? 34 + rand() * 30 : 5 + rand() * 26
    const top = HORIZON - h
    path += `V${round(top)}H${round(x + w)}`
    if (h > 12) {
      for (let wy = top + 4; wy < HORIZON - 4; wy += 6) {
        for (let wx = x + 3; wx < x + w - 3; wx += 5) {
          if (rand() > 0.86) windows.push({ x: round(wx), y: round(wy), o: round(0.25 + rand() * 0.6, 2) })
        }
      }
    }
    x += w
  }
  path += `V${HORIZON}Z`
  const shore: { x: number; o: number }[] = []
  for (let sx = 6; sx < 1600; sx += 14 + rand() * 18) shore.push({ x: round(sx), o: round(0.35 + rand() * 0.6, 2) })
  return { path, windows, shore }
}

function buildShimmer(seed: number, count: number, x0: number, x1: number, y0: number, y1: number) {
  const rand = seededRandom(seed)
  let d = ''
  for (let i = 0; i < count; i++) {
    const y = y0 + Math.pow(rand(), 1.6) * (y1 - y0)
    const x = x0 + rand() * (x1 - x0)
    const len = 6 + rand() * 34 * (1 - (y - y0) / (y1 - y0) / 2)
    d += `M${round(x)} ${round(y)}h${round(len)}`
  }
  return d
}

/**
 * Cinematic night river: deep navy sky, the far-bank skyline of Kolkata, the
 * illuminated truss silhouette of the Howrah Bridge, river mist and gently
 * shimmering reflections. `lit` brightens the haze when the invitation is revealed.
 */
export const RiverScene = memo(function RiverScene({ lit = false, className = '' }: { lit?: boolean; className?: string }) {
  const bridge = useMemo(buildBridge, [])
  const skyline = useMemo(buildSkyline, [])
  const shimmer = useMemo(
    () => [
      buildShimmer(11, 46, 0, 1600, HORIZON + 6, 1000),
      buildShimmer(23, 40, 0, 1600, HORIZON + 6, 1000),
      buildShimmer(37, 34, 0, 1600, HORIZON + 30, 1000),
    ],
    [],
  )

  return (
    <div className={`river-scene-wrap ${className}`} aria-hidden="true">
      <svg viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMax slice" className={`river-scene ${lit ? 'is-lit' : ''}`} focusable="false">
        <defs>
          <linearGradient id="rr-scene-sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#020A1A" />
            <stop offset="0.4" stopColor="#061329" />
            <stop offset="0.58" stopColor="#0A2148" />
            <stop offset="0.642" stopColor="#14315E" />
          </linearGradient>
          <linearGradient id="rr-scene-river" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#0C2652" />
            <stop offset="0.3" stopColor="#081D40" />
            <stop offset="1" stopColor="#040C1F" />
          </linearGradient>
          <radialGradient id="rr-scene-haze" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0" stopColor={palette.gold} stopOpacity="0.26" />
            <stop offset="0.5" stopColor={palette.gold} stopOpacity="0.08" />
            <stop offset="1" stopColor={palette.gold} stopOpacity="0" />
          </radialGradient>
          <linearGradient id="rr-scene-mist" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={palette.mist} stopOpacity="0" />
            <stop offset="0.5" stopColor={palette.mist} stopOpacity="0.12" />
            <stop offset="1" stopColor={palette.mist} stopOpacity="0" />
          </linearGradient>
          <radialGradient id="rr-scene-glow">
            <stop offset="0" stopColor={palette.champagne} stopOpacity="0.7" />
            <stop offset="1" stopColor={palette.champagne} stopOpacity="0" />
          </radialGradient>
        </defs>

        <rect width="1600" height="1000" fill="url(#rr-scene-sky)" />
        <ellipse className="scene-haze" cx="800" cy={HORIZON} rx="900" ry="150" fill="url(#rr-scene-haze)" />

        <path d={skyline.path} fill="#081833" />
        <g fill={palette.champagne}>
          {skyline.windows.map((w) => (
            <rect key={`${w.x}-${w.y}`} x={w.x} y={w.y} width="1.8" height="1.8" opacity={w.o * 0.6} />
          ))}
        </g>

        <g className="scene-bridge">
          <path d={bridge.truss} stroke="#040E22" strokeWidth="1.1" fill="none" />
          <path d={bridge.chord} stroke="#030B1C" strokeWidth="2.6" fill="none" strokeLinejoin="round" />
          <path d="M-176 0V-104M176 0V-104" stroke="#030B1C" strokeWidth="3.4" />
          <path d="M-380 0H380" stroke="#030B1C" strokeWidth="3.2" />
          <path d="M-176 0V16M176 0V16" stroke="#030B1C" strokeWidth="7" />
          <g fill={palette.champagne}>
            {bridge.topLights.map(([x, y], i) => (
              <circle key={`t${i}`} cx={round(x)} cy={round(y)} r="1.7" opacity={i % 2 ? 0.65 : 0.95} />
            ))}
            {bridge.deckLights.map(([x, y], i) => (
              <circle key={`d${i}`} cx={x} cy={y} r="1.5" opacity={0.8} />
            ))}
          </g>
          <g>
            {bridge.topLights
              .filter((_, i) => i % 4 === 0)
              .map(([x, y], i) => (
                <circle key={`g${i}`} cx={round(x)} cy={round(y)} r="7" fill="url(#rr-scene-glow)" opacity="0.5" />
              ))}
          </g>
          <g className="scene-bridge-reflection" stroke={palette.champagne} strokeLinecap="round" fill="none">
            {bridge.topLights
              .filter((_, i) => i % 3 === 0)
              .map(([x, y], i) => (
                <path
                  key={`r${i}`}
                  d={`M${round(x)} ${round(16 - y * 0.5)}V${round(16 - y * 1.35)}`}
                  strokeWidth="1.6"
                  strokeDasharray="3 4"
                  opacity="0.28"
                />
              ))}
            {bridge.deckLights
              .filter((_, i) => i % 3 === 0)
              .map(([x], i) => (
                <path key={`q${i}`} d={`M${x} 18V${46 + ((i * 7) % 22)}`} strokeWidth="2" strokeDasharray="4 3" opacity="0.32" />
              ))}
          </g>
        </g>

        <rect y={HORIZON} width="1600" height={1000 - HORIZON} fill="url(#rr-scene-river)" />
        <path d={`M0 ${HORIZON}H1600`} stroke={palette.champagne} strokeOpacity="0.16" strokeWidth="1" />
        <g fill={palette.champagne}>
          {skyline.shore.map((s) => (
            <circle key={s.x} cx={s.x} cy={HORIZON - 1.5} r="1.3" opacity={s.o} />
          ))}
        </g>
        <g stroke={palette.champagne} strokeLinecap="round" strokeWidth="1.6" strokeDasharray="2 4">
          {skyline.shore
            .filter((_, i) => i % 2 === 0)
            .map((s, i) => (
              <path key={s.x} d={`M${s.x} ${HORIZON + 4}V${HORIZON + 22 + ((i * 5) % 26)}`} opacity={s.o * 0.35} />
            ))}
        </g>
        <rect y={HORIZON - 60} width="1600" height="120" fill="url(#rr-scene-mist)" />
      </svg>
      {/* Shimmer lives in separate layers so its drift is composited instead of repainting the scene. */}
      {SHIMMER_STYLES.map((style, i) => (
        <svg
          key={style.name}
          viewBox="0 0 1600 1000"
          preserveAspectRatio="xMidYMax slice"
          className={`shimmer-layer ${style.name}`}
          focusable="false"
        >
          <path
            d={shimmer[i]}
            fill="none"
            stroke={palette.champagne}
            strokeLinecap="round"
            strokeWidth={style.width}
            strokeOpacity={style.opacity}
          />
        </svg>
      ))}
    </div>
  )
})
