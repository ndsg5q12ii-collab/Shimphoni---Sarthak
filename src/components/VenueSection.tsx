import { eventConfig } from '@/config/eventConfig'
import { useParallax } from '@/hooks/useParallax'
import { publicAsset, publicSrcSet } from '@/utils/assets'
import { GetDirections } from './GetDirections'
import { Flourish } from './ui/Flourish'
import { Reveal } from './ui/Reveal'

/** Section C — The Bengal Paddle Jetty, with a parallax photograph of its river setting. */
export function VenueSection() {
  const { venue, media } = eventConfig
  const photo = media.venueImage
  const { frameRef, targetRef } = useParallax<HTMLDivElement, HTMLDivElement>(0.1)

  return (
    <section id="venue" aria-labelledby="venue-title" className="relative scroll-mt-16 pb-24 md:pb-32">
      <figure className="relative m-0">
        <div ref={frameRef} className="venue-frame">
          <div ref={targetRef} className="venue-photo">
            <picture>
              <source type="image/avif" srcSet={publicSrcSet(photo.avif)} sizes="100vw" />
              <source type="image/webp" srcSet={publicSrcSet(photo.webp)} sizes="100vw" />
              <img
                src={publicAsset(photo.fallback)}
                alt={photo.alt}
                width={photo.width}
                height={photo.height}
                loading="lazy"
                decoding="async"
                className="h-full w-full object-cover object-[72%_50%]"
              />
            </picture>
          </div>
          <div className="venue-shade" aria-hidden="true" />
          <div className="venue-inset" aria-hidden="true" />
        </div>
        <figcaption className="venue-caption">
          {photo.caption} ·{' '}
          <a
            href={photo.creditUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="underline decoration-gold/40 underline-offset-2 hover:text-champagne"
          >
            {photo.credit}
          </a>
        </figcaption>
      </figure>

      <div className="relative z-10 mx-auto -mt-32 max-w-4xl px-6 text-center md:-mt-40">
        <Reveal>
          <p className="eyebrow">The venue</p>
        </Reveal>
        <Reveal delay={100}>
          <h2 id="venue-title" className="mt-4 font-display text-[clamp(2.6rem,9vw,4.6rem)] font-medium leading-[0.98] text-balance text-ivory">
            {venue.name}
          </h2>
        </Reveal>
        <Reveal delay={200}>
          <p className="mt-4 font-caps text-[0.78rem] tracking-[0.24em] text-champagne">
            {venue.operator} · {venue.area}, {venue.city}
          </p>
        </Reveal>
        <Reveal delay={260}>
          <Flourish className="mx-auto mt-7" />
        </Reveal>
        <Reveal delay={320}>
          <p className="mx-auto mt-6 max-w-lg font-display text-[1.3rem] leading-relaxed text-ivory/85">{venue.description}</p>
        </Reveal>
        <Reveal delay={400}>
          <div className="mt-9 flex justify-center">
            <GetDirections className="btn btn-primary min-w-60" />
          </div>
        </Reveal>
      </div>
    </section>
  )
}
