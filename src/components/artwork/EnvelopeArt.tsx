import { palette, useSvgIds } from './svg'

/*
 * Layered envelope surfaces. Every face shares the 600 × 930 envelope grid
 * (flap faces use the top 600 × 560 of it), so the layers line up exactly.
 */

function PaperGrain({ id }: { id: string }) {
  return (
    <filter id={id} x="0" y="0" width="1" height="1">
      <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed="7" result="noise" />
      <feColorMatrix in="noise" type="matrix" values="0 0 0 0 0.92  0 0 0 0 0.95  0 0 0 0 1  0 0 0 0.075 0" result="grain" />
      <feComposite in="grain" in2="SourceAlpha" operator="in" />
    </filter>
  )
}

function LinerPattern({ id }: { id: string }) {
  // Fine diamond trellis with a pearl at each crossing — a classic foil-printed envelope liner.
  return (
    <pattern id={id} width="30" height="30" patternUnits="userSpaceOnUse">
      <path d="M15 0L30 15L15 30L0 15Z" fill="none" stroke={palette.gold} strokeOpacity="0.26" strokeWidth="0.6" />
      <path d="M15 9.5L20.5 15L15 20.5L9.5 15Z" fill="none" stroke={palette.champagne} strokeOpacity="0.2" strokeWidth="0.5" />
      <circle cx="15" cy="15" r="1.3" fill={palette.champagne} fillOpacity="0.5" />
      <circle cx="0" cy="0" r="1" fill={palette.gold} fillOpacity="0.45" />
      <circle cx="30" cy="0" r="1" fill={palette.gold} fillOpacity="0.45" />
      <circle cx="0" cy="30" r="1" fill={palette.gold} fillOpacity="0.45" />
      <circle cx="30" cy="30" r="1" fill={palette.gold} fillOpacity="0.45" />
    </pattern>
  )
}

export function EnvelopeBackArt() {
  const ids = useSvgIds(['back', 'liner', 'shade'] as const)
  return (
    <svg viewBox="0 0 600 930" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id={ids.back.id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#0C2757" />
          <stop offset="0.55" stopColor="#0A2049" />
          <stop offset="1" stopColor="#081A3C" />
        </linearGradient>
        <LinerPattern id={ids.liner.id} />
        <linearGradient id={ids.shade.id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#01050E" stopOpacity="0.6" />
          <stop offset="1" stopColor="#01050E" stopOpacity="0" />
        </linearGradient>
      </defs>
      <rect width="600" height="930" rx="9" fill={ids.back.url} />
      <rect width="600" height="540" fill={ids.liner.url} opacity="0.55" />
      <rect width="600" height="200" fill={ids.shade.url} />
    </svg>
  )
}

export function EnvelopePocketArt() {
  const ids = useSvgIds(['left', 'right', 'bottom', 'falloff', 'grain', 'blur', 'clip'] as const)
  const left = 'M0 12Q0 0 12 3L287 472Q300 494 285 511L12 926Q0 930 0 918Z'
  const right = 'M600 12Q600 0 588 3L313 472Q300 494 315 511L588 926Q600 930 600 918Z'
  const bottom = 'M0 930L0 918L267 425Q300 377 333 425L600 918L600 930Z'
  return (
    <svg viewBox="0 0 600 930" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id={ids.left.id} x1="0" y1="0" x2="1" y2="0.7">
          <stop offset="0" stopColor="#285A97" />
          <stop offset="0.55" stopColor="#1D4886" />
          <stop offset="1" stopColor="#173E77" />
        </linearGradient>
        <linearGradient id={ids.right.id} x1="1" y1="0" x2="0" y2="0.7">
          <stop offset="0" stopColor="#15386F" />
          <stop offset="0.6" stopColor="#123264" />
          <stop offset="1" stopColor="#102D5B" />
        </linearGradient>
        <linearGradient id={ids.bottom.id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#21508F" />
          <stop offset="0.45" stopColor="#1A437F" />
          <stop offset="1" stopColor="#123462" />
        </linearGradient>
        <linearGradient id={ids.falloff.id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FFFFFF" stopOpacity="0.05" />
          <stop offset="0.5" stopColor="#FFFFFF" stopOpacity="0" />
          <stop offset="1" stopColor="#010714" stopOpacity="0.28" />
        </linearGradient>
        <PaperGrain id={ids.grain.id} />
        <filter id={ids.blur.id} x="-10%" y="-10%" width="120%" height="120%">
          <feGaussianBlur stdDeviation="7" />
        </filter>
        <clipPath id={ids.clip.id}>
          <rect width="600" height="930" rx="9" />
        </clipPath>
      </defs>
      <g clipPath={ids.clip.url}>
        <path d={left} fill={ids.left.url} />
        <path d={right} fill={ids.right.url} />
        <path d={bottom} transform="translate(0 -9)" fill="#020A1C" opacity="0.42" filter={ids.blur.url} />
        <path d={bottom} fill={ids.bottom.url} />
        <path d="M7 910L267 429Q300 382 333 429L593 910" fill="none" stroke="#3C6CAB" strokeOpacity="0.55" strokeWidth="1.5" />
        <path d="M3 14L284 476" stroke="#3C6CAB" strokeOpacity="0.45" strokeWidth="1.2" />
        <path d="M597 14L316 476" stroke="#0B2148" strokeOpacity="0.6" strokeWidth="1.2" />
        <rect width="600" height="930" fill={ids.falloff.url} />
        <rect width="600" height="930" filter={ids.grain.url} />
      </g>
      <rect x="1" y="1" width="598" height="928" rx="8.5" fill="none" stroke="#4373B2" strokeOpacity="0.35" strokeWidth="1.4" />
    </svg>
  )
}

/** Soft shadow the closed flap casts on the pocket; fades as the flap lifts. */
export function FlapShadowArt() {
  const ids = useSvgIds(['blur'] as const)
  return (
    <svg viewBox="0 0 600 640" aria-hidden="true" focusable="false">
      <defs>
        <filter id={ids.blur.id} x="-10%" y="-10%" width="120%" height="120%">
          <feGaussianBlur stdDeviation="9" />
        </filter>
      </defs>
      <path d="M0 0H600L334 516Q300 566 266 516Z" transform="translate(0 12)" fill="#01081A" opacity="0.55" filter={ids.blur.url} />
    </svg>
  )
}

export function FlapFrontArt() {
  const ids = useSvgIds(['flap', 'sheen', 'grain', 'gold'] as const)
  const shape = 'M0 0H600L334 508Q300 556 266 508Z'
  return (
    <svg viewBox="0 0 600 560" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id={ids.flap.id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#24548F" />
          <stop offset="0.55" stopColor="#1C4785" />
          <stop offset="1" stopColor="#163B74" />
        </linearGradient>
        <radialGradient id={ids.sheen.id} cx="0.24" cy="0.06" r="0.85">
          <stop offset="0" stopColor="#FFFFFF" stopOpacity="0.14" />
          <stop offset="1" stopColor="#FFFFFF" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={ids.gold.id} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#F2DEA6" />
          <stop offset="0.5" stopColor="#C8A45D" />
          <stop offset="1" stopColor="#E7CD91" />
        </linearGradient>
        <PaperGrain id={ids.grain.id} />
      </defs>
      <path d={shape} fill={ids.flap.url} />
      <path d={shape} fill={ids.sheen.url} />
      <path d="M3 1L266 507M597 1L334 507" stroke="#4A7BBC" strokeOpacity="0.5" strokeWidth="1.6" />
      <path d="M24 12L300 509L576 12" fill="none" stroke={ids.gold.url} strokeOpacity="0.85" strokeWidth="1.4" />
      <path d="M40 12L300 480L560 12" fill="none" stroke={ids.gold.url} strokeOpacity="0.3" strokeWidth="0.8" />
      <path d={shape} filter={ids.grain.url} />
    </svg>
  )
}

/** Inside of the flap (patterned liner), drawn as it appears once the flap is folded open. */
export function FlapBackArt() {
  const ids = useSvgIds(['base', 'liner', 'shade', 'gold'] as const)
  const shape = 'M0 560H600L334 52Q300 4 266 52Z'
  return (
    <svg viewBox="0 0 600 560" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id={ids.base.id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#0D2552" />
          <stop offset="1" stopColor="#0A1E44" />
        </linearGradient>
        <LinerPattern id={ids.liner.id} />
        <linearGradient id={ids.shade.id} x1="0" y1="1" x2="0" y2="0">
          <stop offset="0" stopColor="#01050E" stopOpacity="0.5" />
          <stop offset="0.5" stopColor="#01050E" stopOpacity="0" />
        </linearGradient>
        <linearGradient id={ids.gold.id} x1="0" y1="1" x2="1" y2="0">
          <stop offset="0" stopColor="#9C7B3C" />
          <stop offset="0.5" stopColor="#E7CD91" />
          <stop offset="1" stopColor="#C8A45D" />
        </linearGradient>
      </defs>
      <path d={shape} fill={ids.base.url} />
      <path d={shape} fill={ids.liner.url} />
      <path d={shape} fill={ids.shade.url} />
      <path d="M22 548L300 50L578 548" fill="none" stroke={ids.gold.url} strokeOpacity="0.8" strokeWidth="1.4" />
    </svg>
  )
}
