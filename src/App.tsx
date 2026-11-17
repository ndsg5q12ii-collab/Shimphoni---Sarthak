import { useCallback, useEffect, useRef, useState } from 'react'
import { RsvpDialog } from '@/components/RSVP'
import { SiteHeader } from '@/components/SiteHeader'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'
import { ArrivalSection } from '@/sections/ArrivalSection'
import { CelebrationSection } from '@/sections/CelebrationSection'
import { ClosingSection } from '@/sections/ClosingSection'
import { InvitationReveal } from '@/sections/InvitationReveal'

type Stage = 'arrival' | 'opening' | 'revealed'
type Overlay = 'shown' | 'leaving' | 'hidden'

const DEEP_LINKS = ['invitation', 'celebration', 'details', 'venue', 'countdown', 'rsvp']
const OVERLAY_FADE_MS = 520

/** A link straight to a section (e.g. …/#venue) skips the envelope so guests reach details at once. */
function readDeepLink(): string | null {
  const id = window.location.hash.slice(1)
  return DEEP_LINKS.includes(id) ? id : null
}

export default function App() {
  const reducedMotion = usePrefersReducedMotion()
  const [deepLink] = useState(readDeepLink)
  const [stage, setStage] = useState<Stage>(deepLink ? 'revealed' : 'arrival')
  const [overlay, setOverlay] = useState<Overlay>(deepLink ? 'hidden' : 'shown')
  const [instant, setInstant] = useState(Boolean(deepLink))
  const [fontsReady, setFontsReady] = useState(false)
  const [rsvpOpen, setRsvpOpen] = useState(false)
  const [arrivalKey, setArrivalKey] = useState(0)
  const cardRef = useRef<HTMLDivElement>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const triggeredRef = useRef(false)
  const revealedRef = useRef(stage === 'revealed')
  const timersRef = useRef<number[]>([])

  const later = (fn: () => void, ms: number) => timersRef.current.push(window.setTimeout(fn, ms))

  // Hold the arrival copy back until the display faces are ready (max 1.6 s), so it never flashes.
  useEffect(() => {
    let alive = true
    const done = () => alive && setFontsReady(true)
    const timeout = window.setTimeout(done, 1600)
    if (document.fonts?.load) {
      Promise.all([document.fonts.load('italic 400 32px "Cormorant Garamond"'), document.fonts.load('500 12px Cinzel')]).then(done, done)
    } else {
      done()
    }
    return () => {
      alive = false
      window.clearTimeout(timeout)
    }
  }, [])

  // The page behind the envelope does not scroll until the invitation is revealed.
  useEffect(() => {
    document.documentElement.classList.toggle('is-locked', stage !== 'revealed')
  }, [stage])

  useEffect(() => {
    if (deepLink) {
      const el = document.getElementById(deepLink)
      if (el) {
        requestAnimationFrame(() => {
          el.scrollIntoView({ behavior: 'instant' as ScrollBehavior })
        })
      }
    }
    const timers = timersRef.current
    return () => timers.forEach((t) => window.clearTimeout(t))
  }, [deepLink])

  const focusInvitation = () => headingRef.current?.focus({ preventScroll: true })

  const open = useCallback(() => {
    if (triggeredRef.current) return // guards against double taps and seal + button firing together
    triggeredRef.current = true
    setStage('opening')
  }, [])

  const reveal = useCallback((skipTransitions: boolean) => {
    if (revealedRef.current) return // a skip may already have revealed the card
    revealedRef.current = true
    triggeredRef.current = true
    setInstant(skipTransitions)
    setStage('revealed')
    setOverlay('leaving')
    later(() => setOverlay('hidden'), OVERLAY_FADE_MS)
    later(focusInvitation, 60)
  }, [])

  const complete = useCallback(() => reveal(false), [reveal])
  const skip = useCallback(() => reveal(true), [reveal])

  // A section link opened while the envelope is still showing skips straight to that section.
  useEffect(() => {
    const onHashChange = () => {
      const target = readDeepLink()
      if (!target || revealedRef.current) return
      skip()
      requestAnimationFrame(() => document.getElementById(target)?.scrollIntoView())
    }
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [skip])

  const replay = useCallback(() => {
    timersRef.current.forEach((t) => window.clearTimeout(t))
    timersRef.current = []
    setRsvpOpen(false)
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior })
    history.replaceState(null, '', window.location.pathname + window.location.search)
    triggeredRef.current = false
    revealedRef.current = false
    setInstant(true)
    setStage('arrival')
    setOverlay('shown')
    setArrivalKey((k) => k + 1)
  }, [])

  const openRsvp = useCallback(() => setRsvpOpen(true), [])
  const closeRsvp = useCallback(() => setRsvpOpen(false), [])
  const getTargetRect = useCallback(() => cardRef.current?.getBoundingClientRect() ?? null, [])

  const revealed = stage === 'revealed'

  return (
    <>
      <SiteHeader enabled={revealed} onRsvp={openRsvp} />

      <main inert={!revealed}>
        <InvitationReveal revealed={revealed} instant={instant} cardVisible={revealed} cardRef={cardRef} headingRef={headingRef} />
        <CelebrationSection />
        <ClosingSection onRsvp={openRsvp} onReplay={replay} />
      </main>

      {overlay !== 'hidden' && (
        <ArrivalSection
          key={arrivalKey}
          opening={stage !== 'arrival'}
          leaving={overlay === 'leaving'}
          ready={fontsReady}
          reducedMotion={reducedMotion}
          onOpen={open}
          onComplete={complete}
          onSkip={skip}
          getTargetRect={getTargetRect}
        />
      )}

      <RsvpDialog open={rsvpOpen} onClose={closeRsvp} />
    </>
  )
}
