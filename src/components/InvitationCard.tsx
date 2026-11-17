import type { CSSProperties, Ref } from 'react'
import { eventConfig } from '@/config/eventConfig'
import { CardFrame } from './artwork/CardFrame'
import { Couple } from './artwork/Couple'
import { GlowGradient, GoldGradient } from './artwork/GoldGradient'
import { LightString } from './artwork/LightString'
import { OrnamentCorner } from './artwork/OrnamentCorner'
import { PaddleSteamer } from './artwork/PaddleSteamer'
import { palette, useSvgIds } from './artwork/svg'
import { publicAsset } from '@/utils/assets'

/** Reveal order (ms after the card lands): borders → "Engagement of" → names → date → venue → boat & lights → time. */
export const REVEAL = {
  corners: 0,
  engagementOf: 380,
  bride: 700,
  amp: 920,
  groom: 1080,
  divider: 1500,
  date: 1700,
  venue: 1950,
  scene: 2250,
  lights: 2550,
  couple: 2750,
  time: 3250,
} as const

export const REVEAL_TOTAL_MS = REVEAL.time + 1300

const delay = (ms: number) => ({ '--rv-delay': `${ms}ms` }) as CSSProperties

const CORNERS = [
  { transform: 'translate(35 35)', origin: '0% 0%' },
  { transform: 'translate(865 35) scale(-1 1)', origin: '100% 0%' },
  { transform: 'translate(35 1465) scale(1 -1)', origin: '0% 100%' },
  { transform: 'translate(865 1465) scale(-1 -1)', origin: '100% 100%' },
] as const

/** Renders "1st January 2027" with the ordinal set as a small superscript. */
function InvitationDate({ text }: { text: string }) {
  const match = text.match(/^(\d+)(st|nd|rd|th)\b(.*)$/i)
  if (!match) return <>{text}</>
  return (
    <>
      {match[1]}
      <sup>{match[2]}</sup>
      {match[3]}
    </>
  )
}

interface InvitationCardProps {
  revealed: boolean
  /** Skip the staggered transitions (skip intro, replay reset, reduced motion). */
  instant?: boolean
  cardRef?: Ref<HTMLDivElement>
  headingRef?: Ref<HTMLHeadingElement>
}

/**
 * The invitation: the original composition (royal navy, gold corners, light strings,
 * paddle-steamer and couple) rebuilt as layered vector art, with all wording as live,
 * selectable text. If a flattened export of the original card is configured, it is
 * shown instead and the text remains available to assistive technology.
 */
export function InvitationCard({ revealed, instant = false, cardRef, headingRef }: InvitationCardProps) {
  const { wording, brideName, groomName, media } = eventConfig
  const ids = useSvgIds(['gold', 'glow', 'illum', 'water', 'step'] as const)
  const stateClass = `${revealed ? 'is-revealed' : ''} ${instant ? 'is-instant' : ''}`

  const text = (
    <div className={`invite-text ${media.invitationImage ? 'sr-only' : ''}`}>
      <h1 ref={headingRef} tabIndex={-1} className="invite-heading">
        <span data-step className="invite-of" style={delay(REVEAL.engagementOf)}>
          {wording.engagementOf}
        </span>{' '}
        <span data-step className="invite-name text-foil" style={delay(REVEAL.bride)}>
          {brideName}
        </span>{' '}
        <span data-step className="invite-amp" style={delay(REVEAL.amp)}>
          &amp;
        </span>{' '}
        <span data-step className="invite-name text-foil" style={delay(REVEAL.groom)}>
          {groomName}
        </span>
      </h1>
      <span data-step className="invite-divider" style={delay(REVEAL.divider)} aria-hidden="true" />
      <p data-step className="invite-date" style={delay(REVEAL.date)}>
        <InvitationDate text={wording.invitationDate} />
      </p>
      <p data-step className="invite-venue" style={delay(REVEAL.venue)}>
        <span>{wording.cardVenueLines[0]}</span> <span>{wording.cardVenueLines[1]}</span>
      </p>
      <p data-step className="invite-time" style={delay(REVEAL.time)}>
        <span className="invite-time-label">{wording.timeLabel}:</span> {wording.timeText}
      </p>
    </div>
  )

  if (media.invitationImage) {
    return (
      <div ref={cardRef} className={`invite-card ${stateClass}`}>
        <img
          src={publicAsset(media.invitationImage)}
          alt=""
          data-step
          className="absolute inset-0 h-full w-full rounded-[6px] object-cover"
          decoding="async"
        />
        {text}
      </div>
    )
  }

  return (
    <div ref={cardRef} className={`invite-card ${stateClass}`} style={{ '--lights-delay': `${REVEAL.lights}ms` } as CSSProperties}>
      <svg viewBox="0 0 900 1500" aria-hidden="true" focusable="false">
        <defs>
          <GoldGradient id={ids.gold.id} />
          <GlowGradient id={ids.glow.id} opacity={0.8} />
          <radialGradient id={ids.illum.id} cx="0.5" cy="0.5" r="0.5">
            <stop offset="0" stopColor={palette.champagne} stopOpacity="0.3" />
            <stop offset="0.45" stopColor={palette.gold} stopOpacity="0.1" />
            <stop offset="1" stopColor={palette.gold} stopOpacity="0" />
          </radialGradient>
          <linearGradient id={ids.water.id} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#0E2A57" stopOpacity="0.9" />
            <stop offset="1" stopColor="#061532" stopOpacity="0.2" />
          </linearGradient>
          <linearGradient id={ids.step.id} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#0A1E42" />
            <stop offset="1" stopColor="#050F26" />
          </linearGradient>
        </defs>

        <CardFrame />

        {media.coupleIllustration && !media.boatIllustration ? (
          <g data-step style={delay(REVEAL.scene)}>
            <defs>
              <clipPath id="card-art-clip">
                <rect x="36" y="740" width="828" height="726" rx="4" />
              </clipPath>
              <linearGradient id="art-fade-top" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#0B2149" stopOpacity="0.95" />
                <stop offset="0.2" stopColor="#0B2149" stopOpacity="0" />
              </linearGradient>
            </defs>
            <g clipPath="url(#card-art-clip)">
              <image
                href={publicAsset(media.coupleIllustration)}
                x="36"
                y="740"
                width="828"
                height="726"
                preserveAspectRatio="xMidYMid slice"
              />
              <rect x="36" y="740" width="828" height="140" fill="url(#art-fade-top)" />
              <line x1="120" y1="740" x2="780" y2="740" stroke={ids.gold.url} strokeWidth="1.2" strokeOpacity="0.35" />
            </g>
          </g>
        ) : (
          <>
            <g data-step style={delay(REVEAL.scene)}>
              <ellipse cx="505" cy="950" rx="430" ry="270" fill={ids.illum.url} />
            </g>

            <g data-step style={delay(REVEAL.scene)}>
              <rect x="36" y="1052" width="828" height="248" fill={ids.water.url} />
              <path d="M36 1052H864" stroke={palette.champagne} strokeOpacity="0.22" strokeWidth="1" />
              <g stroke={palette.champagne} strokeLinecap="round" fill="none" strokeOpacity="0.3">
                <path
                  d="M86 1110H140M600 1104H690M720 1132H770M150 1158H190M480 1176H560M660 1196H700M110 1220H150M380 1232H430"
                  strokeWidth="1.6"
                />
                <path d="M300 1250H330M560 1262H600M760 1240H800M210 1270H240" strokeWidth="1.1" strokeOpacity="0.2" />
              </g>
            </g>

            <g data-step style={delay(REVEAL.scene)}>
              {media.boatIllustration ? (
                <image
                  href={publicAsset(media.boatIllustration)}
                  x="196"
                  y="800"
                  width="620"
                  height="310"
                  preserveAspectRatio="xMidYMax meet"
                />
              ) : (
                <PaddleSteamer transform="translate(196 800) scale(0.86)" />
              )}
            </g>

            <g data-step style={delay(REVEAL.scene + 150)}>
              <path d="M36 1296H864V1466H36Z" fill={ids.step.url} />
              <path d="M36 1296H864" stroke={ids.gold.url} strokeWidth="1.4" opacity="0.8" />
              <path d="M36 1322H864" stroke={palette.gold} strokeWidth="0.8" opacity="0.4" />
              <path d="M36 1350H864" stroke={palette.gold} strokeWidth="0.7" opacity="0.22" />
            </g>

            <g data-step style={delay(REVEAL.couple)}>
              {media.coupleIllustration ? (
                <image
                  href={publicAsset(media.coupleIllustration)}
                  x="56"
                  y="972"
                  width="210"
                  height="330"
                  preserveAspectRatio="xMidYMax meet"
                />
              ) : (
                <Couple transform="translate(56 947) scale(0.86)" />
              )}
            </g>
          </>
        )}

        {CORNERS.map((corner, i) => (
          <g key={corner.origin} data-step="corner" style={{ ...delay(REVEAL.corners + i * 90), transformOrigin: corner.origin }}>
            <OrnamentCorner gold={ids.gold.url} transform={corner.transform} />
          </g>
        ))}

        <g className="card-lights">
          <LightString from={[214, 60]} control={[318, 168]} to={[436, 72]} bulbs={8} glow={ids.glow.url} drop={7} radius={4.2} halo={15} />
          <LightString
            from={[464, 72]}
            control={[582, 168]}
            to={[686, 60]}
            bulbs={8}
            glow={ids.glow.url}
            drop={7}
            radius={4.2}
            halo={15}
            sequenceStart={8}
          />
        </g>
      </svg>
      {text}
    </div>
  )
}
