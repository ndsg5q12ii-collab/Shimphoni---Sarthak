import { GlowGradient, GoldGradient } from './GoldGradient'
import { LightString } from './LightString'
import { palette, round, useSvgIds } from './svg'

/* Geometry of the steamer on a 720 × 360 grid; the waterline sits at y = 300. */
const MAIN_WINDOWS = Array.from({ length: 21 }, (_, i) => 92 + i * 26)
const SALOON_WINDOWS = Array.from({ length: 12 }, (_, i) => 208 + i * 22)
const PORTHOLES = [104, 134, 164, 194, 224, 254, 284, 488, 518, 548, 578, 608, 638]
const BALUSTERS = [...Array.from({ length: 12 }, (_, i) => 108 + i * 8), ...Array.from({ length: 15 }, (_, i) => 486 + i * 8)]
const PADDLE = { cx: 386, cy: 264, r: 78 }
const RAYS = Array.from({ length: 9 }, (_, i) => ((180 + (i + 1) * 18) * Math.PI) / 180)
const PEARLS = Array.from({ length: 15 }, (_, i) => ((186 + i * 12) * Math.PI) / 180)

function scallops(x0: number, x1: number, y: number, step = 16, depth = 7) {
  let d = `M${x0} ${y}`
  for (let x = x0; x < x1; x += step) d += `Q${x + step / 2} ${y + depth} ${Math.min(x + step, x1)} ${y}`
  return d
}

/**
 * The venue: a two-deck paddle steamer drawn in gold on navy, with its arched
 * sunburst paddle box, raked funnel, lit saloon windows and strings of lights
 * dressed from bow mast to funnel to stern staff.
 *
 * Rendered as a <g> so it can be composed inside the invitation card's SVG.
 * Children carrying `.bulb` / `.lit` classes take part in the "lights on" reveal.
 */
export function PaddleSteamer({ transform }: { transform?: string }) {
  const ids = useSvgIds(['gold', 'hull', 'cabin', 'paddle', 'window', 'glow', 'bloom', 'streak', 'ripple'] as const)
  const gold = ids.gold.url
  return (
    <g transform={transform}>
      <defs>
        <GoldGradient id={ids.gold.id} />
        <linearGradient id={ids.hull.id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#11295A" />
          <stop offset="1" stopColor="#081733" />
        </linearGradient>
        <linearGradient id={ids.cabin.id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#132D5E" />
          <stop offset="1" stopColor="#0C2250" />
        </linearGradient>
        <linearGradient id={ids.paddle.id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#173670" />
          <stop offset="1" stopColor="#0E2552" />
        </linearGradient>
        <linearGradient id={ids.window.id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FFEBBB" />
          <stop offset="1" stopColor="#EDB560" />
        </linearGradient>
        <GlowGradient id={ids.glow.id} />
        <filter id={ids.bloom.id} x="-10%" y="-60%" width="120%" height="220%">
          <feGaussianBlur stdDeviation="6" />
        </filter>
        <linearGradient id={ids.streak.id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={palette.champagne} stopOpacity="0.55" />
          <stop offset="1" stopColor={palette.champagne} stopOpacity="0" />
        </linearGradient>
        <pattern id={ids.ripple.id} width="12" height="7" patternUnits="userSpaceOnUse">
          <rect width="12" height="3.4" fill="#fff" />
        </pattern>
        <mask id={`${ids.ripple.id}-mask`}>
          <rect x="0" y="300" width="720" height="70" fill={ids.ripple.url} />
        </mask>
      </defs>

      {/* Reflection on the river, broken into ripples */}
      <g className="lit">
        <path d="M82 300L664 300L648 316L98 316Z" fill="#040E24" opacity="0.65" />
        <g mask={`url(#${ids.ripple.id}-mask)`}>
          {MAIN_WINDOWS.filter((_, i) => i % 2 === 0).map((x, i) => (
            <rect key={x} x={x + 3} y="302" width="8" height={34 + ((i * 13) % 26)} fill={ids.streak.url} />
          ))}
          {[86, 160, 236, 540, 612, 650].map((x, i) => (
            <rect key={x} x={x} y="302" width="3" height={50 + ((i * 11) % 18)} fill={ids.streak.url} />
          ))}
        </g>
        <g stroke={palette.champagne} strokeLinecap="round" fill="none">
          <path d="M140 312H196M262 318H300M470 314H540M590 322H628M210 330H236M402 326H446" strokeWidth="1.4" strokeOpacity="0.45" />
          <path d="M120 340H150M330 344H360M520 338H566M250 352H270" strokeWidth="1" strokeOpacity="0.3" />
        </g>
      </g>

      {/* Masts, stays and flags */}
      <g stroke={gold} strokeLinecap="round">
        <path d="M654 222L642 66" strokeWidth="1.6" />
        <path d="M54 238L62 118" strokeWidth="1.5" />
        <path d="M642 70L708 218M642 72L572 86" strokeWidth="0.6" opacity="0.55" />
      </g>
      <g fill={gold}>
        <path d="M642 66L668 72L642 79Z" />
        <path d="M62 118L89 125L62 132Z" />
      </g>

      {/* Hull */}
      <path
        d="M34 236C190 247 520 247 710 219C697 254 683 281 664 300L82 300C62 287 45 265 34 236Z"
        fill={ids.hull.url}
        stroke={gold}
        strokeWidth="1.7"
      />
      <path d="M44 251C200 261 520 259 694 235" fill="none" stroke={gold} strokeWidth="1.1" opacity="0.85" />
      <path d="M86 293H660" stroke={gold} strokeWidth="0.8" opacity="0.45" />
      <g className="lit">
        {PORTHOLES.map((x) => (
          <g key={x}>
            <circle cx={x} cy="272" r="8" fill={ids.glow.url} />
            <circle cx={x} cy="272" r="3.1" fill={palette.window} stroke={gold} strokeWidth="0.6" />
          </g>
        ))}
      </g>

      {/* Main deck */}
      <path d="M78 240V184H630V229C470 240 250 243 78 240Z" fill={ids.cabin.url} stroke={gold} strokeWidth="1.3" />
      <g className="lit">
        <rect x="84" y="190" width="540" height="40" fill="#F3C46F" opacity="0.35" filter={ids.bloom.url} />
        {MAIN_WINDOWS.map((x) => (
          <path
            key={x}
            d={`M${x} 224V202Q${x} 192 ${x + 7} 192Q${x + 14} 192 ${x + 14} 202V224Z`}
            fill={ids.window.url}
            stroke={gold}
            strokeWidth="0.6"
          />
        ))}
      </g>
      <path d="M68 184H642L638 176H72Z" fill="#132E61" stroke={gold} strokeWidth="1.1" />

      {/* Upper deck: open promenade, saloon and canopy */}
      <path d="M104 158H196M482 158H606" stroke={gold} strokeWidth="1" />
      <g stroke={gold} strokeWidth="0.55" opacity="0.85">
        {BALUSTERS.map((x) => (
          <path key={x} d={`M${x} 158V176`} />
        ))}
      </g>
      <path d="M196 176V136H482V176Z" fill={ids.cabin.url} stroke={gold} strokeWidth="1.2" />
      <g className="lit">
        <rect x="200" y="140" width="278" height="30" fill="#F3C46F" opacity="0.3" filter={ids.bloom.url} />
        {SALOON_WINDOWS.map((x) => (
          <rect key={x} x={x} y="144" width="12" height="22" rx="1.5" fill={ids.window.url} stroke={gold} strokeWidth="0.5" />
        ))}
      </g>
      <path d="M104 126V176M606 126V176M196 126V136M482 126V136" stroke={gold} strokeWidth="1.1" />
      <path d={`${scallops(92, 618, 126)}V118H98Z`} fill="#14305F" stroke={gold} strokeWidth="1" strokeLinejoin="round" />
      <path d="M92 126L98 118H612L618 126" fill="none" stroke={gold} strokeWidth="1.1" />

      {/* Wheelhouse */}
      <path d="M498 118V92H568V118Z" fill={ids.cabin.url} stroke={gold} strokeWidth="1.2" />
      <g className="lit">
        {[506, 526, 546].map((x) => (
          <rect key={x} x={x} y="98" width="14" height="14" rx="1" fill={ids.window.url} stroke={gold} strokeWidth="0.5" />
        ))}
      </g>
      <path d="M492 92H574L568 84H498Z" fill="#14305F" stroke={gold} strokeWidth="1.1" />

      {/* Raked funnel */}
      <path d="M320 118L312 34H342L350 118Z" fill="#0C1F47" stroke={gold} strokeWidth="1.3" />
      <path d="M313 44H341L342 53H314Z" fill={gold} />
      <path d="M307 34H347L344 27H310Z" fill={palette.goldDeep} stroke={gold} strokeWidth="0.8" />

      {/* Sunburst paddle box */}
      <path
        d={`M${PADDLE.cx - PADDLE.r} ${PADDLE.cy}A${PADDLE.r} ${PADDLE.r} 0 0 1 ${PADDLE.cx + PADDLE.r} ${PADDLE.cy}Z`}
        fill={ids.paddle.url}
        stroke={gold}
        strokeWidth="2"
      />
      <path
        d={`M${PADDLE.cx - 68} ${PADDLE.cy}A68 68 0 0 1 ${PADDLE.cx + 68} ${PADDLE.cy}`}
        fill="none"
        stroke={gold}
        strokeWidth="0.9"
        opacity="0.8"
      />
      <g stroke={gold} strokeWidth="1.1" strokeLinecap="round">
        {RAYS.map((a) => (
          <path
            key={a}
            d={`M${round(PADDLE.cx + Math.cos(a) * 20)} ${round(PADDLE.cy + Math.sin(a) * 20)}L${round(PADDLE.cx + Math.cos(a) * 62)} ${round(PADDLE.cy + Math.sin(a) * 62)}`}
          />
        ))}
      </g>
      <g fill={palette.champagne}>
        {PEARLS.map((a) => (
          <circle key={a} cx={round(PADDLE.cx + Math.cos(a) * 73.5)} cy={round(PADDLE.cy + Math.sin(a) * 73.5)} r="1.5" />
        ))}
      </g>
      <path
        d={`M${PADDLE.cx - 16} ${PADDLE.cy}A16 16 0 0 1 ${PADDLE.cx + 16} ${PADDLE.cy}Z`}
        fill={palette.goldDeep}
        stroke={gold}
        strokeWidth="1.2"
      />
      <path d={`M${PADDLE.cx - 7} ${PADDLE.cy}A7 7 0 0 1 ${PADDLE.cx + 7} ${PADDLE.cy}Z`} fill="#0B1E44" />
      <path d="M302 264H470V272H302Z" fill="#0B1E44" stroke={gold} strokeWidth="1.2" />

      {/* Dressed overall with lights */}
      <g className="steamer-lights">
        <LightString from={[642, 70]} control={[488, 100]} to={[328, 31]} bulbs={11} glow={ids.glow.url} radius={2.3} halo={8} />
        <LightString
          from={[326, 31]}
          control={[188, 104]}
          to={[62, 120]}
          bulbs={11}
          glow={ids.glow.url}
          radius={2.3}
          halo={8}
          sequenceStart={11}
        />
        <LightString
          from={[104, 131]}
          control={[150, 141]}
          to={[196, 131]}
          bulbs={4}
          glow={ids.glow.url}
          radius={1.9}
          halo={6}
          sequenceStart={22}
        />
        <LightString
          from={[196, 131]}
          control={[262, 141]}
          to={[318, 131]}
          bulbs={4}
          glow={ids.glow.url}
          radius={1.9}
          halo={6}
          sequenceStart={26}
        />
        <LightString
          from={[352, 131]}
          control={[417, 141]}
          to={[482, 131]}
          bulbs={4}
          glow={ids.glow.url}
          radius={1.9}
          halo={6}
          sequenceStart={30}
        />
        <LightString
          from={[482, 131]}
          control={[544, 141]}
          to={[606, 131]}
          bulbs={4}
          glow={ids.glow.url}
          radius={1.9}
          halo={6}
          sequenceStart={34}
        />
        {[70, 166, 262, 358, 454, 550].map((x, i) => (
          <LightString
            key={x}
            from={[x, 186]}
            control={[x + 48, 193]}
            to={[x + 96, 186]}
            bulbs={4}
            glow={ids.glow.url}
            radius={1.6}
            halo={5.5}
            sequenceStart={38 + i * 4}
          />
        ))}
      </g>
    </g>
  )
}
