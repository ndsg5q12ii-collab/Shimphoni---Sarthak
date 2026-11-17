import type { CSSProperties } from 'react'
import { quadraticPoints, round, type Point } from './svg'

interface LightStringProps {
  from: Point
  control: Point
  to: Point
  bulbs: number
  /** Ids of the shared glow gradient and wire colour. */
  glow: string
  wire?: string
  /** Length of the little drop between wire and bulb. */
  drop?: number
  radius?: number
  halo?: number
  /** Skip the bulbs at the two attachment points. */
  skipEnds?: boolean
  /** First bulb's index in a larger sequence, used for the staggered "lights on" reveal. */
  sequenceStart?: number
}

/**
 * A draped string of fairy lights along a quadratic curve. Each bulb carries a
 * `--i` custom property so CSS can switch them on one after another.
 */
export function LightString({
  from,
  control,
  to,
  bulbs,
  glow,
  wire = '#9C7B3C',
  drop = 0,
  radius = 3,
  halo = 10,
  skipEnds = true,
  sequenceStart = 0,
}: LightStringProps) {
  const total = skipEnds ? bulbs + 2 : bulbs
  const points = quadraticPoints(from, control, to, total).slice(skipEnds ? 1 : 0, skipEnds ? -1 : undefined)
  return (
    <g className="light-string">
      <path
        d={`M${from[0]} ${from[1]}Q${control[0]} ${control[1]} ${to[0]} ${to[1]}`}
        fill="none"
        stroke={wire}
        strokeWidth="0.9"
        strokeOpacity="0.75"
      />
      {points.map(([x, y], index) => {
        const cx = round(x)
        const cy = round(y + drop)
        return (
          <g key={index} className="bulb" style={{ '--i': sequenceStart + index } as CSSProperties}>
            {drop > 0 && <line x1={cx} y1={round(y)} x2={cx} y2={cy} stroke={wire} strokeWidth="0.7" strokeOpacity="0.7" />}
            <circle className="bulb-halo" cx={cx} cy={cy} r={halo} fill={glow} />
            <circle className="bulb-core" cx={cx} cy={cy} r={radius} fill="#FFF1CC" />
          </g>
        )
      })}
    </g>
  )
}
