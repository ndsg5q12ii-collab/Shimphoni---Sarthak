import { GoldGradient } from './GoldGradient'
import { palette, round, useSvgIds } from './svg'

const SKIN = '#A46F51'
const SKIN_WARM = '#AC7656'
const HAIR = '#16121F'
const HAIR_LINE = '#2E2840'
const JASMINE = '#F8F1E2'

const SKIRT = 'M70 214C58 262 34 330 8 398C7 403 11 407 18 407C64 413 132 413 178 406C185 405 188 401 186 396C162 330 136 264 122 214Z'

const GAJRA = Array.from({ length: 12 }, (_, i) => {
  const a = (i / 12) * Math.PI * 2
  return [round(96 + Math.cos(a) * 18.5), round(108 + Math.sin(a) * 14.5)] as const
})

/**
 * The couple, seen from behind as they look out at the illuminated river:
 * she in a lavender lehenga with a jasmine-wrapped bun and sheer dupatta,
 * he in an ivory sherwani with a champagne stole, hands joined between them.
 * Drawn on a 260 × 420 grid as a <g> for composition inside other SVGs.
 */
export function Couple({ transform }: { transform?: string }) {
  const ids = useSvgIds(['gold', 'lehenga', 'blouse', 'ivory', 'ivoryShade', 'stole', 'skirtClip', 'rim'] as const)
  const gold = ids.gold.url
  return (
    <g transform={transform}>
      <defs>
        <GoldGradient id={ids.gold.id} />
        <linearGradient id={ids.lehenga.id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#BCA9DD" />
          <stop offset="0.55" stopColor="#A08BC9" />
          <stop offset="1" stopColor="#8670B5" />
        </linearGradient>
        <linearGradient id={ids.blouse.id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#B9A6DA" />
          <stop offset="1" stopColor="#9F8ACA" />
        </linearGradient>
        <linearGradient id={ids.ivory.id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#F4ECDD" />
          <stop offset="0.6" stopColor="#E4D7BF" />
          <stop offset="1" stopColor="#D2C2A4" />
        </linearGradient>
        <linearGradient id={ids.ivoryShade.id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#E6DAC4" />
          <stop offset="1" stopColor="#CDBC9D" />
        </linearGradient>
        <linearGradient id={ids.stole.id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#E4CB91" />
          <stop offset="1" stopColor="#BE9F60" />
        </linearGradient>
        <linearGradient id={ids.rim.id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={palette.champagne} stopOpacity="0.85" />
          <stop offset="1" stopColor={palette.champagne} stopOpacity="0" />
        </linearGradient>
        <clipPath id={ids.skirtClip.id}>
          <path d={SKIRT} />
        </clipPath>
      </defs>

      <ellipse cx="124" cy="409" rx="122" ry="7.5" fill="#020A18" opacity="0.6" />

      {/* ——— Him ——— */}
      <g>
        <path d="M158 322H177L176 398H160Z" fill={ids.ivoryShade.url} />
        <path d="M191 322H210L208 398H192Z" fill={ids.ivoryShade.url} />
        <g stroke="#C2AF8C" strokeWidth="0.8" fill="none">
          {[366, 374, 382, 390].map((y) => (
            <path key={y} d={`M160 ${y}Q168 ${y + 3} 176 ${y}M192 ${y}Q200 ${y + 3} 208 ${y}`} />
          ))}
        </g>
        <path d="M158 397C162 404 174 404 178 397V403C174 409 162 409 158 403Z" fill={gold} />
        <path d="M190 397C194 404 206 404 210 397V403C206 409 194 409 190 403Z" fill={gold} />

        <path
          d="M171 99C160 100 150 103 146 110C142 116 141 124 141 132L139 250C138 280 138 304 139 322H229C230 304 230 280 229 250L227 132C227 124 226 116 222 110C218 103 208 100 201 99Z"
          fill={ids.ivory.url}
        />
        <path d="M184 101V322" stroke="#C9B693" strokeWidth="0.9" opacity="0.8" />
        <path d="M150 296L151 322M218 296L217 322" stroke="#C2AE8B" strokeWidth="0.9" />
        <path d="M139 314H229V322H139Z" fill={gold} />
        <path d="M141 309.5H227" stroke={palette.goldPale} strokeWidth="1.6" strokeLinecap="round" strokeDasharray="0 5" />

        <path d="M222 110C230 130 234 190 233 284L217 286C217 220 215 160 212 124Z" fill={ids.ivoryShade.url} />
        <path d="M217 280L233 279V287L217 288Z" fill={gold} />
        <path d="M219 288C218 298 222 306 227 307C232 305 233 296 232 287Z" fill={SKIN} />

        <path d="M158 110C152 160 152 214 158 268L178 266C174 214 172 162 172 114Z" fill={ids.stole.url} />
        <path d="M158 110C152 160 152 214 158 268" fill="none" stroke={palette.goldDeep} strokeWidth="0.8" />
        <path d="M158 268L178 266" stroke={gold} strokeWidth="2.6" strokeDasharray="1.2 2.2" />
        <path d="M160 106C172 112 196 112 210 106L212 115C198 122 172 122 158 115Z" fill={ids.stole.url} />

        <path d="M146 110C138 130 135 170 137 232L154 233C153 190 155 150 158 122Z" fill={ids.ivoryShade.url} />
        <path d="M137 226L154 227V234L137 233Z" fill={gold} />
        <path d="M139 233C139 242 143 250 150 252C156 251 157 243 155 234Z" fill={SKIN} />

        <path d="M176 80Q186 85 196 80L197 97H175Z" fill={SKIN} />
        <path d="M172 92H200L201 101H171Z" fill={ids.ivoryShade.url} />
        <path d="M172 92H200" stroke={gold} strokeWidth="1" />
        <ellipse cx="164.5" cy="62" rx="3.2" ry="6.5" fill={SKIN} />
        <ellipse cx="207.5" cy="62" rx="3.2" ry="6.5" fill={SKIN} />
        <path d="M165 58C164 39 173 31 186 31C199 31 208 40 207 58C207 71 202 79 196 82Q186 86 176 82C169 79 165 71 165 58Z" fill={HAIR} />
        <path d="M172 44C178 38 194 38 200 44M169 54C178 48 194 48 203 54" stroke={HAIR_LINE} strokeWidth="0.8" fill="none" opacity="0.8" />
        <path d="M207 58C207 71 202 79 196 82" fill="none" stroke={ids.rim.url} strokeWidth="1.1" opacity="0.6" />
        <path d="M222 110C230 130 234 190 233 284" fill="none" stroke={ids.rim.url} strokeWidth="1" opacity="0.5" />
      </g>

      {/* ——— Her ——— */}
      <g>
        <path d={SKIRT} fill={ids.lehenga.url} />
        <g stroke="#8B76BC" strokeWidth="1.1" fill="none" opacity="0.55">
          <path d="M80 216C72 280 52 340 34 404" />
          <path d="M90 216C86 280 76 340 64 408" />
          <path d="M100 216C100 280 98 340 96 410" />
          <path d="M110 216C114 280 122 340 130 409" />
          <path d="M117 216C125 276 145 336 160 406" />
        </g>
        <g clipPath={ids.skirtClip.url}>
          <path d="M0 401C60 411 136 411 196 399" fill="none" stroke={gold} strokeWidth="18" />
          <path
            d="M4 393C62 402 134 402 192 391"
            fill="none"
            stroke={palette.goldPale}
            strokeWidth="2.6"
            strokeLinecap="round"
            strokeDasharray="0 6"
          />
          <path d="M6 387C62 396 134 396 192 385" fill="none" stroke={gold} strokeWidth="0.9" />
        </g>
        <path d="M70 214C86 219 106 219 122 214" fill="none" stroke={gold} strokeWidth="3.4" />

        <path d="M74 196C88 200 104 200 118 196L122 214C106 219 86 219 70 214Z" fill={SKIN} />
        <path d="M88 102H102L104 128H86Z" fill={SKIN} />
        <path d="M77 126C86 122 104 122 113 126L112 136C108 160 102 170 95 171C88 170 82 160 78 136Z" fill={SKIN} />

        <path
          d="M60 142C60 134 66 129 74 128H79C82 152 88 166 95 168C102 166 108 152 111 128H116C124 129 130 134 130 142L126 197C106 202 86 202 64 197Z"
          fill={ids.blouse.url}
        />
        <path d="M79 128C82 152 88 166 95 168C102 166 108 152 111 128" fill="none" stroke={gold} strokeWidth="1.6" />
        <path d="M64 197C86 202 106 202 126 197" fill="none" stroke={gold} strokeWidth="1.4" />
        <path d="M82 148C88 151 102 151 108 148" fill="none" stroke={gold} strokeWidth="1.1" />
        <circle cx="95" cy="150.5" r="1.8" fill={gold} />
        <path d="M94 151C93 165 91 178 89 190M96 151C97 165 99 178 101 192" fill="none" stroke={gold} strokeWidth="0.9" />
        <path d="M89 188C86 192 87 198 89 200C91 198 92 192 89 188ZM101 190C98 194 99 200 101 202C103 200 104 194 101 190Z" fill={gold} />

        <path d="M61 140C54 158 51 178 50 202L63 205C63 186 65 164 69 146Z" fill="#A893CF" />
        <path d="M50 202L63 205" stroke={gold} strokeWidth="1.6" />
        <path d="M51 203C49 226 51 246 55 262H63C63 244 63 224 63 205Z" fill={SKIN} />
        <path d="M52 248L63 249M52 252L63 253M52.5 256L63 257" stroke={gold} strokeWidth="1.6" />
        <path d="M54 262C54 270 57 276 60 277C64 275 65 268 63 262Z" fill={SKIN} />

        <path d="M129 140C135 158 137 176 137 198L125 201C125 182 123 164 120 146Z" fill="#A893CF" />
        <path d="M125 201L137 198" stroke={gold} strokeWidth="1.6" />
        <path d="M126 200C130 216 136 230 142 240L150 236C144 224 140 212 137 198Z" fill={SKIN} />
        <path d="M140 234L147 230M141.5 237.5L148.5 233.5" stroke={gold} strokeWidth="1.5" />
        <path d="M142 239C141 246 145 252 151 252C156 250 157 244 152 236Z" fill={SKIN_WARM} />

        <g opacity="0.92">
          <path d="M48 198C56 262 132 270 140 196L131 203C124 252 66 248 59 205Z" fill="#D3C7EE" fillOpacity="0.55" />
          <path d="M48 198C56 262 132 270 140 196" fill="none" stroke={gold} strokeWidth="1.3" />
          <path
            d="M53 211C62 258 126 264 136 208"
            fill="none"
            stroke={palette.goldPale}
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeDasharray="0 5"
            opacity="0.85"
          />
          <path d="M47 199C38 248 31 300 27 352L50 357C50 302 54 250 59 205Z" fill="#D3C7EE" fillOpacity="0.55" />
          <path d="M47 199C38 248 31 300 27 352" fill="none" stroke={gold} strokeWidth="1.1" />
          <path d="M27 352L50 357" stroke={gold} strokeWidth="3" />
          <path d="M27 353C24 358 25 364 27 366C29 364 30 358 27 353Z" fill={gold} />
        </g>

        <g transform="rotate(7 96 124)">
          <ellipse cx="95" cy="80" rx="20.5" ry="23.5" fill={HAIR} />
          <path d="M82 66C88 60 102 60 108 66M79 76C88 70 104 70 111 76" stroke={HAIR_LINE} strokeWidth="0.8" fill="none" opacity="0.8" />
          <path d="M74.5 92V97M115.5 92V97" stroke={gold} strokeWidth="0.9" />
          <circle cx="74.5" cy="99.5" r="2.7" fill={gold} />
          <circle cx="115.5" cy="99.5" r="2.7" fill={gold} />
          <ellipse cx="96" cy="108" rx="16" ry="12.5" fill={HAIR} />
          <path d="M84 104C90 99 102 99 108 104M85 111C92 115 101 115 107 111" stroke={HAIR_LINE} strokeWidth="0.8" fill="none" />
          <g fill={JASMINE} stroke="#D7CAB1" strokeWidth="0.5">
            {GAJRA.map(([x, y]) => (
              <circle key={`${x}-${y}`} cx={x} cy={y} r="2.6" />
            ))}
            {[124, 129, 134, 139, 144].map((y, i) => (
              <circle key={y} cx={92 - i * 0.5} cy={y} r="2" />
            ))}
          </g>
          <path d="M115.5 80C115.5 92 110 100 104 103" fill="none" stroke={ids.rim.url} strokeWidth="1" opacity="0.55" />
        </g>
      </g>
    </g>
  )
}
