import { useSvgIds } from './svg'

const OUTER =
  'M100 184C92 178 78 170 66 161C40 142 6 116 7 70C7 34 34 7 66 8C80 8 92 14 100 24C108 14 120 7 135 8C167 8 194 35 193 71C193 116 160 142 134 161C122 170 108 178 100 184Z'
const IMPRESSION =
  'M100 156C77 139 36 112 36 74C36 51 53 34 73 34C86 34 95 41 100 51C105 41 114 34 127 34C147 34 164 51 164 74C164 112 123 139 100 156Z'
const RING =
  'M100 140C82 127 50 106 50 76C50 59 62 47 77 47C87 47 95 52 100 61C105 52 113 47 123 47C138 47 150 59 150 76C150 106 118 127 100 140Z'
const EMBOSS =
  'M100 122C90 115 72 103 72 87C72 78 79 71 87 71C93 71 97 74 100 79C103 74 107 71 113 71C121 71 128 78 128 87C128 103 110 115 100 122Z'

/**
 * Golden heart-shaped wax seal: an irregular poured-wax heart with a pressed
 * impression, raised beaded ring and embossed heart. `.seal-glint` is animated
 * by the envelope sequence to throw a sweep of light across the surface.
 */
export function WaxSealArt({ className }: { className?: string }) {
  const ids = useSvgIds(['wax', 'rim', 'recess', 'emboss', 'glint', 'clip', 'soft', 'shadow'] as const)
  return (
    <svg viewBox="0 0 200 192" className={className} aria-hidden="true" focusable="false">
      <defs>
        <radialGradient id={ids.wax.id} gradientUnits="userSpaceOnUse" cx="70" cy="52" r="176">
          <stop offset="0" stopColor="#F8E8B8" />
          <stop offset="0.28" stopColor="#E8CC8A" />
          <stop offset="0.58" stopColor="#CBA760" />
          <stop offset="0.84" stopColor="#9E7838" />
          <stop offset="1" stopColor="#765626" />
        </radialGradient>
        <linearGradient id={ids.rim.id} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#FFF4D2" stopOpacity="0.95" />
          <stop offset="0.38" stopColor="#F2DCA2" stopOpacity="0.15" />
          <stop offset="0.7" stopColor="#5E4318" stopOpacity="0.25" />
          <stop offset="1" stopColor="#4B3412" stopOpacity="0.7" />
        </linearGradient>
        <linearGradient id={ids.recess.id} x1="0.1" y1="0" x2="0.9" y2="1">
          <stop offset="0" stopColor="#8A6629" />
          <stop offset="0.45" stopColor="#B99349" />
          <stop offset="1" stopColor="#E6CB8B" />
        </linearGradient>
        <linearGradient id={ids.emboss.id} x1="0.1" y1="0" x2="0.9" y2="1">
          <stop offset="0" stopColor="#FFF2C8" />
          <stop offset="0.45" stopColor="#E5C885" />
          <stop offset="1" stopColor="#A47E3B" />
        </linearGradient>
        <linearGradient id={ids.glint.id} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#FFFFFF" stopOpacity="0" />
          <stop offset="0.5" stopColor="#FFFBEA" stopOpacity="0.9" />
          <stop offset="1" stopColor="#FFFFFF" stopOpacity="0" />
        </linearGradient>
        <clipPath id={ids.clip.id}>
          <path d={OUTER} />
        </clipPath>
        <filter id={ids.soft.id} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="2.4" />
        </filter>
        <filter id={ids.shadow.id} x="-20%" y="-20%" width="140%" height="150%">
          <feGaussianBlur stdDeviation="4" />
        </filter>
      </defs>

      <path d={OUTER} transform="translate(3 7)" fill="#01060F" opacity="0.5" filter={ids.shadow.url} />
      <path d={OUTER} fill={ids.wax.url} />
      <path d={OUTER} fill="none" stroke={ids.rim.url} strokeWidth="2.2" />

      <path d={IMPRESSION} fill={ids.recess.url} />
      <path d={IMPRESSION} fill="none" stroke="#5E4318" strokeOpacity="0.55" strokeWidth="1.6" transform="translate(-0.8 -1.2)" />
      <path d={IMPRESSION} fill="none" stroke="#FFF1C9" strokeOpacity="0.45" strokeWidth="1.2" transform="translate(1 1.6)" />

      <path d={RING} fill="none" stroke={ids.emboss.url} strokeWidth="3.6" strokeLinecap="round" strokeDasharray="0 8.2" />
      <path d={EMBOSS} fill={ids.emboss.url} />
      <path d={EMBOSS} fill="none" stroke="#6E501F" strokeOpacity="0.55" strokeWidth="1.1" transform="translate(0.8 1.2)" />

      <g filter={ids.soft.url} fill="#FFFDF1">
        <ellipse cx="58" cy="50" rx="17" ry="7" transform="rotate(-38 58 50)" opacity="0.42" />
        <ellipse cx="140" cy="40" rx="9" ry="4" transform="rotate(-20 140 40)" opacity="0.3" />
      </g>

      <g clipPath={ids.clip.url}>
        <g transform="rotate(24 100 96)">
          <rect className="seal-glint" x="-150" y="-60" width="54" height="320" fill={ids.glint.url} opacity="0" />
        </g>
      </g>
    </svg>
  )
}
