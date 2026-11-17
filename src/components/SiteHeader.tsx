import { useEffect, useState } from 'react'
import { eventConfig } from '@/config/eventConfig'
import { SoundToggle } from './SoundToggle'

const LINKS = [
  { href: '#details', label: 'Details' },
  { href: '#venue', label: 'Venue' },
  { href: '#countdown', label: 'Countdown' },
]

/** Slim header that fades in once the guest scrolls past the invitation card. */
export function SiteHeader({ enabled, onRsvp }: { enabled: boolean; onRsvp: () => void }) {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    if (!enabled) {
      setScrolled(false)
      return
    }
    let raf = 0
    const update = () => {
      raf = 0
      setScrolled(window.scrollY > window.innerHeight * 0.7)
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [enabled])

  const visible = enabled && scrolled
  const initials = `${eventConfig.brideName.charAt(0)}${eventConfig.groomName.charAt(0)}`

  return (
    <header className={`site-header ${visible ? 'is-visible' : ''}`} inert={!visible}>
      <a href="#invitation" className="flex items-baseline gap-1.5 font-display text-2xl text-champagne">
        <span aria-hidden="true">{initials.charAt(0)}</span>
        <span aria-hidden="true" className="font-script text-xl text-gold">
          &amp;
        </span>
        <span aria-hidden="true">{initials.charAt(1)}</span>
        <span className="sr-only">Back to the invitation</span>
      </a>
      <nav aria-label="Sections" className="hidden items-center gap-8 md:flex">
        {LINKS.map((link) => (
          <a
            key={link.href}
            href={link.href}
            className="font-caps text-[0.7rem] tracking-[0.26em] text-ivory/75 transition-colors hover:text-champagne"
          >
            {link.label}
          </a>
        ))}
      </nav>
      <div className="flex items-center gap-2">
        <SoundToggle />
        <button type="button" className="btn btn-primary min-h-10 px-5 py-2 text-[0.68rem]" onClick={onRsvp}>
          RSVP
        </button>
      </div>
    </header>
  )
}
