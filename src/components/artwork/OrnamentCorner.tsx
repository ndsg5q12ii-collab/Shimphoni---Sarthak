import { palette } from './svg'

const PETAL = 'M0 -4C5.5 -9 5.5 -15.5 0 -21C-5.5 -15.5 -5.5 -9 0 -4Z'

/** One edge of the filigree: a scrolling vine with leaves, a curl and a fading tendril. */
function Vine({ gold }: { gold: string }) {
  return (
    <g>
      <path
        d="M62 26C86 11 113 12 128 29C140 42 159 45 171 34C179 27 176 16 168 17C162 18 162 26 167 27"
        fill="none"
        stroke={gold}
        strokeWidth="1.7"
        strokeLinecap="round"
      />
      <path d="M128 29C150 15 184 10 226 16" fill="none" stroke={gold} strokeWidth="1" strokeLinecap="round" opacity="0.85" />
      <path d="M100 20C112 14 122 16 128 22" fill="none" stroke={gold} strokeWidth="0.8" strokeLinecap="round" opacity="0.7" />
      <g fill={gold}>
        <path d="M86 19C90 8 101 3 114 4C107 13 98 18 86 19Z" />
        <path d="M113 27C122 34 126 45 124 56C116 50 111 39 113 27Z" />
        <path d="M150 42C158 48 162 57 160 66C152 60 148 51 150 42Z" />
        <path d="M190 13C196 6 205 3 214 5C208 11 200 14 190 13Z" opacity="0.85" />
        <circle cx="168" cy="22" r="2.4" />
        <circle cx="228" cy="16" r="1.8" opacity="0.8" />
        <circle cx="202" cy="16" r="1.2" opacity="0.7" />
      </g>
    </g>
  )
}

/**
 * Gold ornamental floral corner (top-left orientation, 230 × 230).
 * A lotus rosette at the corner, scrolling vines along both edges and a
 * leaf spray pointing into the card. Mirror it with transforms for the other corners.
 */
export function OrnamentCorner({ gold, transform }: { gold: string; transform?: string }) {
  return (
    <g transform={transform}>
      <path d="M0 74V0H74" fill="none" stroke={gold} strokeWidth="2.6" strokeLinecap="square" />
      <path d="M10 52V10H52" fill="none" stroke={gold} strokeWidth="1" opacity="0.8" />
      <circle
        cx="34"
        cy="34"
        r="27"
        fill="none"
        stroke={gold}
        strokeWidth="0.8"
        strokeDasharray="0 5.2"
        strokeLinecap="round"
        opacity="0.9"
      />
      <g transform="translate(34 34)" fill={gold}>
        {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
          <path key={angle} d={PETAL} transform={`rotate(${angle})`} opacity={angle % 90 === 0 ? 1 : 0.7} />
        ))}
        <circle r="4.6" fill={palette.goldPale} />
        <circle r="2" fill={palette.goldDeep} />
      </g>
      <Vine gold={gold} />
      <g transform="matrix(0 1 1 0 0 0)">
        <Vine gold={gold} />
      </g>
      <g fill={gold}>
        <path d="M54 54C66 54 77 63 79 79C65 77 55 67 54 54Z" />
        <path d="M58 58C66 62 72 68 75 75" fill="none" stroke={palette.goldDeep} strokeWidth="0.8" />
        <circle cx="86" cy="86" r="2.2" />
        <circle cx="94" cy="94" r="1.5" opacity="0.8" />
        <circle cx="101" cy="101" r="1" opacity="0.6" />
      </g>
    </g>
  )
}
