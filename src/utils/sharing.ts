import type { InvitationConfig } from '../config/eventConfig'
import { coupleNames } from './event'

/** Public URL of the invitation: the configured one, otherwise the address the guest is viewing. */
export function getInvitationUrl(config: InvitationConfig): string {
  const configured = config.share.publicInvitationUrl.trim()
  if (configured) return configured
  if (typeof window === 'undefined') return ''
  return `${window.location.origin}${window.location.pathname}`
}

export function buildShareText(config: InvitationConfig): string {
  const { wording, venue } = config
  return (
    `${config.share.intro} ${config.eventName} of ${coupleNames(config)} — ` +
    `${wording.invitationDate}, ${wording.timeText.replace(/Onwards/i, 'onwards')} at ${venue.name}, ${venue.area}, ${venue.city}.`
  )
}

export function whatsappShareUrl(text: string, url: string): string {
  return `https://wa.me/?text=${encodeURIComponent(`${text}\n${url}`)}`
}

export type ShareOutcome = 'shared' | 'cancelled' | 'unsupported'

/** Native share sheet when available. Returns 'unsupported' so the caller can show its fallback. */
export async function shareNatively(data: { title: string; text: string; url: string }): Promise<ShareOutcome> {
  if (typeof navigator === 'undefined' || typeof navigator.share !== 'function') return 'unsupported'
  if (typeof navigator.canShare === 'function' && !navigator.canShare(data)) return 'unsupported'
  try {
    await navigator.share(data)
    return 'shared'
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') return 'cancelled'
    return 'unsupported'
  }
}

export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text)
      return true
    }
  } catch {
    // Fall through to the legacy path (e.g. insecure context or denied permission).
  }
  const area = document.createElement('textarea')
  area.value = text
  area.setAttribute('readonly', '')
  area.style.position = 'fixed'
  area.style.opacity = '0'
  document.body.appendChild(area)
  area.select()
  let ok = false
  try {
    ok = document.execCommand('copy')
  } catch {
    ok = false
  }
  area.remove()
  return ok
}
