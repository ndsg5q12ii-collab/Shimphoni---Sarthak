import type { InvitationConfig } from '../config/eventConfig'
import { coupleNames } from './event'

export interface RsvpResponse {
  name: string
  attending: boolean
  guests: number
  message: string
}

export type RsvpDestination = { kind: 'form'; endpoint: string } | { kind: 'whatsapp'; number: string | null; recipientLabel: string }

/** Digits only, so "+91 98xxx xxxxx" and "9198xxxxxxxx" both work. */
export function normaliseWhatsAppNumber(raw: string): string | null {
  const digits = raw.replace(/\D/g, '')
  return digits.length >= 8 ? digits : null
}

export function resolveRsvpDestination(config: InvitationConfig): RsvpDestination {
  const { channel, formEndpoint, whatsappNumber, whatsappRecipientLabel } = config.rsvp
  const endpoint = formEndpoint.trim()
  if ((channel === 'form' || channel === 'auto') && endpoint) return { kind: 'form', endpoint }
  return { kind: 'whatsapp', number: normaliseWhatsAppNumber(whatsappNumber), recipientLabel: whatsappRecipientLabel.trim() }
}

export function buildRsvpMessage(config: InvitationConfig, response: RsvpResponse): string {
  const lines = [
    `RSVP — ${config.wording.engagementOf} ${coupleNames(config)}`,
    `${config.wording.invitationDate}, ${config.wording.timeText}`,
    '',
    `Name: ${response.name}`,
    response.attending ? `Joyfully accepts — ${response.guests} ${response.guests === 1 ? 'guest' : 'guests'}` : 'Regretfully declines',
  ]
  if (response.message.trim()) lines.push(`Message: ${response.message.trim()}`)
  return lines.join('\n')
}

export function whatsappRsvpUrl(number: string | null, message: string): string {
  const text = encodeURIComponent(message)
  return number ? `https://wa.me/${number}?text=${text}` : `https://wa.me/?text=${text}`
}

/** POSTs the reply as JSON. Resolves only when the endpoint answers with a 2xx status. */
export async function submitRsvpForm(endpoint: string, config: InvitationConfig, response: RsvpResponse): Promise<void> {
  const result = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({
      event: `${config.eventName} — ${coupleNames(config)}`,
      eventDate: config.eventDate,
      name: response.name,
      attending: response.attending ? 'yes' : 'no',
      guests: response.attending ? response.guests : 0,
      message: response.message,
      submittedAt: new Date().toISOString(),
    }),
  })
  if (!result.ok) throw new Error(`RSVP endpoint responded with ${result.status}`)
}
