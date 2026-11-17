import { Countdown } from '@/components/Countdown'
import { CoupleFigure } from '@/components/CoupleFigure'
import { EventDetails } from '@/components/EventDetails'
import { Flourish } from '@/components/ui/Flourish'
import { Reveal } from '@/components/ui/Reveal'
import { VenueSection } from '@/components/VenueSection'
import { eventConfig } from '@/config/eventConfig'

/** Screen 04 — the celebration, continuing the same night-river language below the card. */
export function CelebrationSection() {
  const { togetherness } = eventConfig.wording

  return (
    <>
      {/* A — A celebration of togetherness */}
      <section
        id="celebration"
        aria-labelledby="togetherness-title"
        className="section-glow relative scroll-mt-10 px-6 pb-24 pt-28 md:pb-32 md:pt-40"
      >
        <div className="mx-auto grid max-w-6xl items-center gap-x-20 gap-y-10 [grid-template-areas:'head'_'art'_'body'] md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] md:[grid-template-areas:'art_head'_'art_body']">
          <div className="text-center [grid-area:head] md:self-end md:text-left">
            <Reveal>
              <p className="eyebrow">{togetherness.eyebrow}</p>
            </Reveal>
            <Reveal delay={120}>
              <h2
                id="togetherness-title"
                className="mt-5 font-display text-[clamp(2.7rem,8.4vw,4.9rem)] font-normal italic leading-[1.02] text-balance text-ivory"
              >
                {togetherness.title}
              </h2>
            </Reveal>
          </div>
          <Reveal delay={200} className="mx-auto w-full max-w-[22rem] [grid-area:art] md:max-w-[26rem]">
            <CoupleFigure />
          </Reveal>
          <div className="text-center [grid-area:body] md:self-start md:text-left">
            <Reveal delay={260}>
              <Flourish className="mx-auto md:mx-0" />
            </Reveal>
            <Reveal delay={340}>
              <p className="mx-auto mt-6 max-w-md font-display text-[1.35rem] leading-relaxed text-ivory/85 md:mx-0 md:text-[1.5rem]">
                {togetherness.body}
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* B — Event details */}
      <section id="details" aria-labelledby="details-title" className="relative scroll-mt-16 px-5 pb-28 md:pb-36">
        <Reveal className="text-center">
          <p className="eyebrow">Event details</p>
          <h2 id="details-title" className="mt-4 font-display text-[clamp(2.3rem,7vw,3.6rem)] font-medium leading-tight text-balance text-ivory">
            The {eventConfig.eventName}
          </h2>
          <Flourish className="mx-auto mt-5" />
        </Reveal>
        <Reveal delay={150} className="mt-12">
          <EventDetails />
        </Reveal>
      </section>

      {/* C — Venue showcase */}
      <VenueSection />

      {/* D — Countdown */}
      <section id="countdown" aria-labelledby="countdown-title" className="relative scroll-mt-16 px-5 pb-28 md:pb-36">
        <Reveal>
          <Countdown />
        </Reveal>
      </section>
    </>
  )
}
