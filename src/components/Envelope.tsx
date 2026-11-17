import { useEffect, useRef } from 'react'
import { CardFrame } from './artwork/CardFrame'
import { EnvelopeBackArt, EnvelopePocketArt, FlapBackArt, FlapFrontArt, FlapShadowArt } from './artwork/EnvelopeArt'
import { WaxSeal } from './WaxSeal'

/** Opening choreography in ms from the tap. Total ≈ 4.5 s, then the invitation reveal takes over. */
const T = {
  pressMs: 560,
  glintAt: 240,
  flapAt: 760,
  flapMs: 1050,
  riseAt: 1650,
  riseMs: 1350,
  zoomAt: 3100,
  zoomMs: 1300,
} as const

const EASE_LIFT = 'cubic-bezier(0.55, 0.05, 0.3, 1)'
const EASE_SLIDE = 'cubic-bezier(0.3, 0, 0.2, 1)'
const EASE_CAMERA = 'cubic-bezier(0.65, 0, 0.3, 1)'

interface EnvelopeProps {
  opening: boolean
  reducedMotion: boolean
  onRequestOpen: () => void
  /** Called once the card has landed on the invitation's position. */
  onComplete: () => void
  /** Viewport rect of the invitation card the envelope card should fly into. */
  getTargetRect: () => DOMRect | null
  sealLabel: string
}

/**
 * A physical envelope built from layered HTML in one CSS 3D rendering context:
 * back panel (z 0) → card (z 1) → front pocket (z 2) → top flap (z 3, hinged on its top edge).
 * The flap carries the wax seal on its front face and the patterned liner on its back face,
 * so the seal turns away naturally as the flap folds open.
 */
export function Envelope({ opening, reducedMotion, onRequestOpen, onComplete, getTargetRect, sealLabel }: EnvelopeProps) {
  const stageRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<HTMLDivElement>(null)
  const bodyRef = useRef<HTMLDivElement>(null)
  const cardRef = useRef<HTMLDivElement>(null)
  const flapRef = useRef<HTMLDivElement>(null)
  const flapShadowRef = useRef<HTMLDivElement>(null)
  const shadowRef = useRef<HTMLDivElement>(null)
  const haloRef = useRef<HTMLDivElement>(null)
  const sealHaloRef = useRef<HTMLSpanElement>(null)
  const completeRef = useRef(onComplete)
  const targetRef = useRef(getTargetRect)
  completeRef.current = onComplete
  targetRef.current = getTargetRect

  useEffect(() => {
    if (!opening) return
    const stage = stageRef.current
    const scene = sceneRef.current
    const body = bodyRef.current
    const card = cardRef.current
    const flap = flapRef.current
    if (!stage || !scene || !body || !card || !flap) return

    const animations: Animation[] = []
    const timers: number[] = []
    let cancelled = false
    const play = (el: Element | null | undefined, keyframes: Keyframe[], options: KeyframeAnimationOptions) => {
      if (!el) return null
      const animation = el.animate(keyframes, { fill: 'forwards', ...options })
      animations.push(animation)
      return animation
    }
    const finish = () => {
      if (!cancelled) completeRef.current()
    }

    if (reducedMotion) {
      // Calm alternative: no 3D motion, the envelope simply dissolves into the invitation.
      play(stage, [{ opacity: 1 }, { opacity: 0 }], { duration: 420, easing: 'ease-out' })?.finished.then(finish, () => {})
      return () => {
        cancelled = true
        animations.forEach((a) => a.cancel())
      }
    }

    const height = stage.offsetHeight
    const rise = height * 0.56
    const descend = height * 0.44
    const seal = stage.querySelector('.env-seal .seal-art')
    const glint = stage.querySelector('.seal-glint')

    // Settle the idle float from wherever it currently is.
    const floating = getComputedStyle(scene).transform
    play(scene, [{ transform: floating === 'none' ? 'translate3d(0,0,0)' : floating }, { transform: 'translate3d(0,0,0)' }], {
      duration: 700,
      easing: 'cubic-bezier(0.33, 1, 0.68, 1)',
    })

    // 1–3. Seal press, a sweep of golden light, a soft flash.
    play(
      seal,
      [
        { transform: 'scale(1)' },
        { transform: 'scale(0.9)', offset: 0.3 },
        { transform: 'scale(1.045)', offset: 0.68 },
        { transform: 'scale(1)' },
      ],
      { duration: T.pressMs, easing: 'cubic-bezier(0.3, 0.7, 0.4, 1)', fill: 'none' },
    )
    play(
      glint,
      [
        { transform: 'translateX(0px)', opacity: 0 },
        { opacity: 1, offset: 0.25 },
        { opacity: 0.9, offset: 0.7 },
        { transform: 'translateX(340px)', opacity: 0 },
      ],
      { duration: 820, delay: T.glintAt, easing: 'cubic-bezier(0.4, 0, 0.2, 1)' },
    )
    play(
      sealHaloRef.current,
      [
        { opacity: 0.55, transform: 'scale(0.94)' },
        { opacity: 1, transform: 'scale(1.18)', offset: 0.35 },
        { opacity: 0, transform: 'scale(1.6)' },
      ],
      { duration: 1100, delay: 180 },
    )

    // 4. The flap lifts towards the viewer and folds back over the top edge.
    play(flap, [{ transform: 'rotateX(0deg) translateZ(3px)' }, { transform: 'rotateX(180deg) translateZ(3px)' }], {
      duration: T.flapMs,
      delay: T.flapAt,
      easing: EASE_LIFT,
    })
    play(flapShadowRef.current, [{ opacity: 1 }, { opacity: 0 }], { duration: 520, delay: T.flapAt, easing: 'ease-out' })

    // 5–6. The card is drawn up while the envelope is lowered away from it.
    play(card, [{ transform: 'translate3d(0,0,1px)' }, { transform: `translate3d(0,${-rise}px,1px)` }], {
      duration: T.riseMs,
      delay: T.riseAt,
      easing: EASE_SLIDE,
    })
    play(body, [{ transform: 'translate3d(0,0,0)' }, { transform: `translate3d(0,${descend}px,0)` }], {
      duration: T.riseMs,
      delay: T.riseAt + 60,
      easing: EASE_SLIDE,
    })
    play(
      shadowRef.current,
      [
        { transform: 'translate3d(0,0,0) scale(1)', opacity: 0.9 },
        { transform: `translate3d(0,${descend}px,0) scale(1.04)`, opacity: 0.6 },
      ],
      { duration: T.riseMs, delay: T.riseAt + 60, easing: EASE_SLIDE },
    )

    // 7–8. Camera pushes in until the card fills the invitation's frame.
    timers.push(
      window.setTimeout(() => {
        if (cancelled) return
        const from = card.getBoundingClientRect()
        const target = targetRef.current()
        const stageRect = stage.getBoundingClientRect()
        const fade = { duration: 820, delay: 120, easing: 'ease-in' }
        stage.querySelectorAll('.env-fade').forEach((el) => play(el, [{ opacity: 1 }, { opacity: 0 }], fade))
        play(haloRef.current, [{ opacity: 1 }, { opacity: 0 }], fade)
        play(shadowRef.current, [{ opacity: 0.6 }, { opacity: 0 }], fade)

        if (!target || from.width === 0) {
          play(stage, [{ opacity: 1 }, { opacity: 0 }], { duration: 600 })?.finished.then(finish, () => {})
          return
        }
        const scale = target.width / from.width
        const dx = target.left + target.width / 2 - (from.left + from.width / 2)
        const dy = target.top + target.height / 2 - (from.top + from.height / 2)
        stage.style.transformOrigin = `${from.left + from.width / 2 - stageRect.left}px ${from.top + from.height / 2 - stageRect.top}px`
        play(stage, [{ transform: 'translate3d(0,0,0) scale(1)' }, { transform: `translate3d(${dx}px,${dy}px,0) scale(${scale})` }], {
          duration: T.zoomMs,
          easing: EASE_CAMERA,
        })?.finished.then(finish, () => {})
      }, T.zoomAt),
    )

    return () => {
      cancelled = true
      timers.forEach((t) => window.clearTimeout(t))
      animations.forEach((a) => a.cancel())
    }
  }, [opening, reducedMotion])

  // Idle classes stay on while opening: the Web Animations take over from the CSS float without a jump.
  const idle = 'is-idle'

  return (
    <div ref={stageRef} className="envelope-stage" onClick={opening ? undefined : onRequestOpen}>
      <div ref={haloRef} className="envelope-halo" aria-hidden="true" />
      <div ref={shadowRef} className={`envelope-shadow ${idle}`} aria-hidden="true" />
      <div ref={sceneRef} className={`envelope-scene ${idle}`}>
        <div ref={bodyRef} className="env-body">
          <div className="env-layer env-back env-fade" aria-hidden="true">
            <EnvelopeBackArt />
          </div>
          <div className="env-layer env-pocket env-fade" aria-hidden="true">
            <EnvelopePocketArt />
            <div ref={flapShadowRef} className="env-flap-shadow">
              <FlapShadowArt />
            </div>
          </div>
          <div ref={flapRef} className="env-flap">
            <div className="flap-face flap-front env-fade">
              <FlapFrontArt />
              <button type="button" className="env-seal" aria-label={sealLabel} disabled={opening}>
                <span ref={sealHaloRef} className={`seal-halo ${idle}`} aria-hidden="true" />
                <WaxSeal />
              </button>
            </div>
            <div className="flap-face flap-back env-fade" aria-hidden="true">
              <FlapBackArt />
            </div>
          </div>
        </div>
        <div ref={cardRef} className="env-card" aria-hidden="true">
          <svg viewBox="0 0 900 1500" focusable="false">
            <CardFrame />
          </svg>
        </div>
      </div>
    </div>
  )
}
