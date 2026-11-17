import { GoldGradient } from './GoldGradient'
import { useSvgIds } from './svg'

export const CARD_W = 900
export const CARD_H = 1500

const CREST_HEART =
  'M450 82C444.5 77.5 436 72 436 64.5C436 60 439.5 56.5 444 56.5C447 56.5 449 58 450 60.5C451 58 453 56.5 456 56.5C460.5 56.5 464 60 464 64.5C464 72 455.5 77.5 450 82Z'

/**
 * Base of the invitation card: royal-navy paper with a soft moonlit glow, a fine
 * double gold rule and the heart crest. Shared by the card inside the envelope and
 * the full invitation, so the hand-off between them is seamless.
 */
export function CardFrame() {
  const ids = useSvgIds(['paper', 'moon', 'gold'] as const)
  return (
    <g>
      <defs>
        <linearGradient id={ids.paper.id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#0A2047" />
          <stop offset="0.5" stopColor="#081C3E" />
          <stop offset="1" stopColor="#061532" />
        </linearGradient>
        <radialGradient id={ids.moon.id} cx="0.5" cy="0.3" r="0.62">
          <stop offset="0" stopColor="#1A3A70" stopOpacity="0.75" />
          <stop offset="1" stopColor="#1A3A70" stopOpacity="0" />
        </radialGradient>
        <GoldGradient id={ids.gold.id} />
      </defs>
      <rect width={CARD_W} height={CARD_H} rx="6" fill={ids.paper.url} />
      <rect width={CARD_W} height={CARD_H} rx="6" fill={ids.moon.url} />
      <rect x="22" y="22" width="856" height="1456" fill="none" stroke={ids.gold.url} strokeWidth="2.4" />
      <rect x="35" y="35" width="830" height="1430" fill="none" stroke={ids.gold.url} strokeWidth="0.9" opacity="0.85" />
      <g fill={ids.gold.url}>
        <path d={CREST_HEART} />
        <path d="M430 66C418 66 408 59 394 62C404 66 414 71 430 69Z" opacity="0.9" />
        <path d="M470 66C482 66 492 59 506 62C496 66 486 71 470 69Z" opacity="0.9" />
        <circle cx="386" cy="63" r="2" />
        <circle cx="514" cy="63" r="2" />
      </g>
    </g>
  )
}
