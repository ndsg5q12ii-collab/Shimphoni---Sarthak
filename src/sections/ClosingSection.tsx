import { MailCheck, RotateCcw } from 'lucide-react'
import { GetDirections } from '@/components/GetDirections'
import { SaveTheDate } from '@/components/SaveTheDate'
import { ShareInvitation } from '@/components/ShareInvitation'
import { Flourish } from '@/components/ui/Flourish'
import { Reveal } from '@/components/ui/Reveal'
import { eventConfig } from '@/config/eventConfig'

/** Screen 05 — final invitation, RSVP and every guest action. */
export function ClosingSection({ onRsvp, onReplay }: { onRsvp: () => void; onReplay: () => void }) {
  const { closing } = eventConfig.wording
  const { media } = eventConfig

  return (
    <>
      <section
        id="rsvp"
        aria-labelledby="closing-title"
        className="closing relative scroll-mt-16 overflow-hidden px-6 pb-20 pt-24 md:pb-28 md:pt-32"
      >
        <div className="relative z-10 mx-auto max-w-3xl text-center">
          <Reveal>
            <Flourish className="mx-auto" width={210} />
          </Reveal>
          <Reveal delay={100}>
            <h2
              id="closing-title"
              className="mx-auto mt-8 max-w-2xl font-display text-[clamp(1.9rem,5.6vw,3rem)] font-normal italic leading-[1.18] text-balance text-ivory"
            >
              {closing.lead}
            </h2>
          </Reveal>
          <Reveal delay={200}>
            <p className="mx-auto mt-6 max-w-lg font-display text-[1.3rem] leading-relaxed text-mist">{closing.sub}</p>
          </Reveal>

          <Reveal delay={280} className="mx-auto mt-12 grid max-w-xl gap-3 sm:grid-cols-2">
            <button type="button" className="btn btn-primary sm:col-span-2" onClick={onRsvp}>
              <MailCheck aria-hidden="true" />
              RSVP
            </button>
            <GetDirections className="btn w-full" />
            <SaveTheDate />
            <ShareInvitation className="sm:col-span-2" buttonClassName="btn" />
          </Reveal>

          <Reveal delay={340} className="mt-6">
            <button type="button" className="btn btn-quiet" onClick={onReplay}>
              <RotateCcw aria-hidden="true" />
              Replay invitation
            </button>
          </Reveal>

          <Reveal delay={120} className="mt-20">
            <p className="font-display text-[clamp(1.5rem,4.4vw,2.1rem)] leading-snug text-ivory/90">
              <span className="font-script text-[1.5em] text-champagne">{closing.signoffAccent}</span> {closing.signoff}
            </p>
            <p className="mt-6 font-script text-[clamp(2.4rem,8vw,3.4rem)] leading-none text-foil">
              {eventConfig.brideName} &amp; {eventConfig.groomName}
            </p>
          </Reveal>
        </div>
      </section>

      <footer className="border-t border-gold/15 px-6 pb-[max(env(safe-area-inset-bottom),2rem)] pt-8 text-center text-xs leading-relaxed text-mist">
        <p className="font-caps tracking-[0.24em] text-gold/80">
          {eventConfig.brideName} &amp; {eventConfig.groomName} · {eventConfig.wording.invitationDate}
        </p>
        <p className="mt-2">
          {media.venueImage.caption} — {media.venueImage.credit}.
        </p>
      </footer>
    </>
  )
}
