import { eventConfig } from '@/config/eventConfig'
import { publicAsset } from '@/utils/assets'
import { Couple } from './artwork/Couple'
import { LightString } from './artwork/LightString'
import { GlowGradient } from './artwork/GoldGradient'
import { palette, useSvgIds } from './artwork/svg'

/** The couple on the ghat steps, looking out at a string of river lights. */
export function CoupleFigure({ className = '' }: { className?: string }) {
  const { coupleIllustration } = eventConfig.media
  const ids = useSvgIds(['halo', 'glow', 'water', 'horizon'] as const)
  const label = `Illustration of ${eventConfig.brideName} and ${eventConfig.groomName}, seen from behind, looking out over the river lights`

  if (coupleIllustration) {
    const customLabel = `Illustration of ${eventConfig.brideName} and ${eventConfig.groomName} aboard a royal river barge at night under fairy lights`
    return (
      <figure
        className={`group relative m-0 mx-auto overflow-hidden rounded-2xl border border-gold/40 bg-navy shadow-[0_20px_60px_-15px_rgba(0,0,0,0.7),0_0_40px_-10px_rgba(200,164,93,0.3)] transition-all duration-700 hover:shadow-[0_25px_70px_-10px_rgba(0,0,0,0.8),0_0_55px_-5px_rgba(200,164,93,0.45)] ${className}`}
      >
        <img
          src={publicAsset(coupleIllustration)}
          alt={customLabel}
          loading="lazy"
          decoding="async"
          className="h-auto w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
        />
        <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-champagne/25" aria-hidden="true" />
      </figure>
    )
  }

  return (
    <figure className={`m-0 ${className}`}>
      <svg viewBox="0 0 360 470" role="img" aria-label={label} className="h-auto w-full overflow-visible">
        <defs>
          <radialGradient id={ids.halo.id} cx="0.5" cy="0.5" r="0.5">
            <stop offset="0" stopColor={palette.champagne} stopOpacity="0.28" />
            <stop offset="0.55" stopColor={palette.gold} stopOpacity="0.07" />
            <stop offset="1" stopColor={palette.gold} stopOpacity="0" />
          </radialGradient>
          <GlowGradient id={ids.glow.id} opacity={0.85} />
          <radialGradient id={ids.water.id} cx="0.5" cy="0" r="0.5">
            <stop offset="0" stopColor="#123064" stopOpacity="0.95" />
            <stop offset="0.6" stopColor="#0B2149" stopOpacity="0.45" />
            <stop offset="1" stopColor="#071B3A" stopOpacity="0" />
          </radialGradient>
          <linearGradient id={ids.horizon.id} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor={palette.champagne} stopOpacity="0" />
            <stop offset="0.5" stopColor={palette.champagne} stopOpacity="0.45" />
            <stop offset="1" stopColor={palette.champagne} stopOpacity="0" />
          </linearGradient>
        </defs>
        <circle cx="180" cy="236" r="196" fill={ids.halo.url} />
        <path d="M0 286H360V460H0Z" fill={ids.water.url} />
        <path d="M0 286H360" stroke={ids.horizon.url} />
        <g stroke={palette.champagne} strokeOpacity="0.28" strokeLinecap="round">
          <path d="M40 304H80M250 300H300M120 318H150M280 330H320M60 344H90" strokeWidth="1.4" />
        </g>
        <LightString
          from={[14, 238]}
          control={[108, 300]}
          to={[200, 252]}
          bulbs={7}
          glow={ids.glow.url}
          radius={2.6}
          halo={9}
          skipEnds={false}
        />
        <LightString
          from={[200, 252]}
          control={[280, 296]}
          to={[352, 236]}
          bulbs={6}
          glow={ids.glow.url}
          radius={2.6}
          halo={9}
          skipEnds={false}
        />
        <path d="M24 452H336" stroke={palette.gold} strokeOpacity="0.7" strokeWidth="1.2" />
        <path d="M44 462H316" stroke={palette.gold} strokeOpacity="0.3" strokeWidth="0.8" />
        <Couple transform="translate(50 42)" />
      </svg>
    </figure>
  )
}
