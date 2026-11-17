import { ChevronDown } from 'lucide-react'
import type { Ref } from 'react'
import { GoldParticles } from '@/components/artwork/GoldParticles'
import { RiverScene } from '@/components/artwork/RiverScene'
import { InvitationCard } from '@/components/InvitationCard'

interface InvitationRevealProps {
  revealed: boolean
  instant: boolean
  /** False while the envelope is still on screen, so only the envelope's card is visible. */
  cardVisible: boolean
  cardRef: Ref<HTMLDivElement>
  headingRef: Ref<HTMLHeadingElement>
}

/** Screen 03 — Grand invitation reveal, centred on a full-width night river. */
export function InvitationReveal({ revealed, instant, cardVisible, cardRef, headingRef }: InvitationRevealProps) {
  return (
    <section id="invitation" aria-label="Invitation" className="hero film-grain">
      <RiverScene lit={revealed} />
      <GoldParticles />
      <div className="hero-vignette" aria-hidden="true" />
      <div className="hero-card" style={{ opacity: cardVisible ? 1 : 0 }}>
        <InvitationCard revealed={revealed} instant={instant} cardRef={cardRef} headingRef={headingRef} />
      </div>
      <a href="#celebration" className={`scroll-cue ${revealed ? 'is-visible' : ''} ${instant ? 'is-instant' : ''}`}>
        <span className="sr-only">Continue to the celebration details</span>
        <span aria-hidden="true" className="scroll-cue-line" />
        <ChevronDown aria-hidden="true" className="h-4 w-4" />
      </a>
    </section>
  )
}
