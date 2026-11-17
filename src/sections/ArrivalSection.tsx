import { MailOpen } from 'lucide-react'
import { eventConfig } from '@/config/eventConfig'
import { Envelope } from '@/components/Envelope'

interface ArrivalSectionProps {
  opening: boolean
  leaving: boolean
  ready: boolean
  reducedMotion: boolean
  onOpen: () => void
  onComplete: () => void
  onSkip: () => void
  getTargetRect: () => DOMRect | null
}

/**
 * Screen 01 — Cinematic arrival. A fixed, transparent layer over the river scene of the
 * invitation section, holding the sealed envelope and its prompts. Screen 02 (the opening)
 * plays inside the same layer.
 */
export function ArrivalSection({ opening, leaving, ready, reducedMotion, onOpen, onComplete, onSkip, getTargetRect }: ArrivalSectionProps) {
  const { wording } = eventConfig
  const state = [ready ? 'is-ready' : '', opening ? 'is-opening' : '', leaving ? 'is-leaving' : ''].join(' ')

  return (
    <section className={`arrival ${state}`} aria-labelledby="arrival-title">
      <header className="arrival-copy arrival-top">
        <p className="eyebrow arrive" style={{ animationDelay: '150ms' }}>
          {wording.arrivalEyebrow}
        </p>
        <h2 id="arrival-title" className="arrival-title arrive" style={{ animationDelay: '350ms' }}>
          {wording.arrivalTitle}
        </h2>
        <p className="arrival-subtitle arrive" style={{ animationDelay: '650ms' }}>
          {wording.arrivalSubtitle}
        </p>
      </header>

      <div className="arrival-envelope arrive-envelope">
        <Envelope
          opening={opening}
          reducedMotion={reducedMotion}
          onRequestOpen={onOpen}
          onComplete={onComplete}
          getTargetRect={getTargetRect}
          sealLabel="Open your invitation by pressing the wax seal"
        />
      </div>

      <footer className="arrival-copy arrival-bottom">
        <p className="arrival-hint arrive" style={{ animationDelay: '1300ms' }} aria-hidden="true">
          {wording.arrivalHint}
        </p>
        <button type="button" className="btn arrive" style={{ animationDelay: '1450ms' }} onClick={onOpen} disabled={opening}>
          <MailOpen aria-hidden="true" />
          Open invitation
        </button>
      </footer>

      {opening && !leaving && (
        <button type="button" className="arrival-skip btn btn-quiet" onClick={onSkip}>
          Skip intro
        </button>
      )}
    </section>
  )
}
