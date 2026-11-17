import { Minus, Plus, Send, X } from 'lucide-react'
import { useEffect, useId, useRef, useState, type FormEvent } from 'react'
import { eventConfig } from '@/config/eventConfig'
import { buildRsvpMessage, resolveRsvpDestination, submitRsvpForm, whatsappRsvpUrl, type RsvpResponse } from '@/utils/rsvp'
import { Flourish } from './ui/Flourish'

type Status = 'editing' | 'sending' | 'received' | 'handed-off' | 'error'

/**
 * RSVP form in a native modal dialog (focus trap, Escape to close).
 * Replies go to the configured destination:
 *  - a form endpoint (JSON POST; "received" is only shown after a 2xx response), or
 *  - WhatsApp, pre-filled — to the configured number, or to a contact the guest picks while none is set.
 */
export function RsvpDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const nameRef = useRef<HTMLInputElement>(null)
  const titleId = useId()
  const destination = resolveRsvpDestination(eventConfig)
  const { rsvp, wording } = eventConfig

  const [name, setName] = useState('')
  const [attending, setAttending] = useState<boolean | null>(null)
  const [guests, setGuests] = useState(1)
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState<Status>('editing')
  const [problem, setProblem] = useState('')
  const [whatsappLink, setWhatsappLink] = useState('')

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (open && !dialog.open) {
      dialog.showModal()
      document.documentElement.classList.add('has-dialog')
      window.setTimeout(() => nameRef.current?.focus(), 30)
    } else if (!open && dialog.open) {
      dialog.close()
    }
  }, [open])

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    const handleClose = () => {
      document.documentElement.classList.remove('has-dialog')
      onClose()
    }
    dialog.addEventListener('close', handleClose)
    return () => dialog.removeEventListener('close', handleClose)
  }, [onClose])

  const reset = () => {
    setStatus('editing')
    setProblem('')
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!name.trim()) {
      setProblem('Please add your name so we know who is replying.')
      nameRef.current?.focus()
      return
    }
    if (attending === null) {
      setProblem('Please let us know whether you can join us.')
      return
    }
    setProblem('')
    const response: RsvpResponse = { name: name.trim(), attending, guests: attending ? guests : 0, message }

    if (destination.kind === 'form') {
      setStatus('sending')
      try {
        await submitRsvpForm(destination.endpoint, eventConfig, response)
        setStatus('received')
      } catch {
        setStatus('error')
      }
      return
    }

    const link = whatsappRsvpUrl(destination.number, buildRsvpMessage(eventConfig, response))
    setWhatsappLink(link)
    window.open(link, '_blank', 'noopener,noreferrer')
    setStatus('handed-off')
  }

  const whatsappTarget =
    destination.kind === 'whatsapp' && destination.number
      ? destination.recipientLabel
        ? `Your reply will be sent to ${destination.recipientLabel} on WhatsApp.`
        : 'Your reply will open in WhatsApp, ready to send.'
      : 'WhatsApp will open with your reply written out — choose the person who sent you this invitation.'

  return (
    <dialog ref={dialogRef} className="rsvp-dialog" aria-labelledby={titleId}>
      <div className="relative max-h-[inherit] overflow-y-auto px-6 pb-7 pt-8 sm:px-9 sm:pb-9 sm:pt-10">
        <button
          type="button"
          className="absolute right-3 top-3 grid h-11 w-11 place-items-center rounded-full text-mist transition-colors hover:text-champagne"
          onClick={() => dialogRef.current?.close()}
        >
          <X aria-hidden="true" className="h-5 w-5" />
          <span className="sr-only">Close</span>
        </button>

        <div className="text-center">
          <p className="eyebrow">Répondez s’il vous plaît</p>
          <h2 id={titleId} className="mt-3 font-display text-[2.4rem] leading-none text-ivory">
            Kindly reply
          </h2>
          <Flourish className="mx-auto mt-4" width={150} />
          <p className="mt-4 font-display text-lg leading-snug text-ivory/85">
            {wording.engagementOf} {eventConfig.brideName} &amp; {eventConfig.groomName}
            <br />
            <span className="text-mist">
              {wording.invitationDate} · {wording.timeText}
            </span>
          </p>
          {rsvp.replyBy && <p className="mt-2 text-sm text-champagne">{rsvp.replyBy}</p>}
        </div>

        {status === 'received' ? (
          <div className="mt-8 text-center" role="status">
            <p className="font-display text-2xl text-champagne">Thank you, {name.trim()}.</p>
            <p className="mt-2 text-ivory/80">Your reply has been received.</p>
            <button type="button" className="btn mt-7" onClick={() => dialogRef.current?.close()}>
              Close
            </button>
          </div>
        ) : status === 'handed-off' ? (
          <div className="mt-8 text-center" role="status">
            <p className="font-display text-2xl text-champagne">Almost there</p>
            <p className="mx-auto mt-2 max-w-sm text-ivory/80">
              Your reply is waiting in WhatsApp — just press send.{' '}
              {destination.kind === 'whatsapp' && !destination.number && 'Choose the person who sent you this invitation.'}
            </p>
            <div className="mt-7 flex flex-col items-center gap-3">
              <a className="btn" href={whatsappLink} target="_blank" rel="noopener noreferrer">
                <Send aria-hidden="true" />
                Open WhatsApp again
              </a>
              <button type="button" className="btn btn-quiet" onClick={reset}>
                Edit my reply
              </button>
            </div>
          </div>
        ) : (
          <form className="mt-8 space-y-7" onSubmit={handleSubmit} noValidate>
            <div>
              <label htmlFor="rsvp-name" className="eyebrow block">
                Your name
              </label>
              <input
                ref={nameRef}
                id="rsvp-name"
                className="field mt-1.5"
                autoComplete="name"
                maxLength={80}
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Full name"
                required
              />
            </div>

            <fieldset>
              <legend className="eyebrow">Will you join us?</legend>
              <div className="mt-3 grid grid-cols-2 gap-3">
                {[
                  { value: true, label: 'Joyfully accept' },
                  { value: false, label: 'Regretfully decline' },
                ].map((option) => (
                  <label
                    key={String(option.value)}
                    className={`flex min-h-12 cursor-pointer items-center justify-center border px-3 py-3 text-center font-display text-[1.05rem] leading-tight transition-colors has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-champagne ${
                      attending === option.value
                        ? 'border-champagne bg-gold/15 text-champagne'
                        : 'border-gold/35 text-ivory/80 hover:border-gold/70'
                    }`}
                  >
                    <input
                      type="radio"
                      name="rsvp-attending"
                      className="sr-only"
                      checked={attending === option.value}
                      onChange={() => setAttending(option.value)}
                    />
                    {option.label}
                  </label>
                ))}
              </div>
            </fieldset>

            {attending && (
              <div>
                <span id="rsvp-guests-label" className="eyebrow block">
                  Guests, including you
                </span>
                <div className="mt-3 flex items-center gap-4" role="group" aria-labelledby="rsvp-guests-label">
                  <button
                    type="button"
                    className="grid h-11 w-11 place-items-center border border-gold/40 text-champagne transition-colors hover:border-champagne disabled:opacity-40"
                    onClick={() => setGuests((g) => Math.max(1, g - 1))}
                    disabled={guests <= 1}
                  >
                    <Minus aria-hidden="true" className="h-4 w-4" />
                    <span className="sr-only">Fewer guests</span>
                  </button>
                  <output className="min-w-10 text-center font-display text-3xl text-ivory" aria-live="polite">
                    {guests}
                  </output>
                  <button
                    type="button"
                    className="grid h-11 w-11 place-items-center border border-gold/40 text-champagne transition-colors hover:border-champagne disabled:opacity-40"
                    onClick={() => setGuests((g) => Math.min(rsvp.maxGuests, g + 1))}
                    disabled={guests >= rsvp.maxGuests}
                  >
                    <Plus aria-hidden="true" className="h-4 w-4" />
                    <span className="sr-only">More guests</span>
                  </button>
                </div>
              </div>
            )}

            <div>
              <label htmlFor="rsvp-message" className="eyebrow block">
                A note for the couple <span className="normal-case tracking-normal text-mist">(optional)</span>
              </label>
              <textarea
                id="rsvp-message"
                className="field mt-1.5 min-h-20 resize-y"
                maxLength={500}
                rows={2}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Your wishes"
              />
            </div>

            {problem && (
              <p className="text-sm text-champagne" role="alert">
                {problem}
              </p>
            )}
            {status === 'error' && (
              <p className="text-sm text-champagne" role="alert">
                We couldn’t send your reply just now. Please check your connection and try again.
              </p>
            )}

            <div className="flex flex-col items-center gap-3 pt-1">
              <button type="submit" className="btn btn-primary w-full sm:w-auto sm:min-w-64" disabled={status === 'sending'}>
                <Send aria-hidden="true" />
                {status === 'sending' ? 'Sending…' : destination.kind === 'form' ? 'Send my reply' : 'Reply via WhatsApp'}
              </button>
              {destination.kind === 'whatsapp' && (
                <p className="max-w-xs text-center text-xs leading-relaxed text-mist">{whatsappTarget}</p>
              )}
            </div>
          </form>
        )}
      </div>
    </dialog>
  )
}
