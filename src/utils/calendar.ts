import type { InvitationConfig } from '../config/eventConfig'
import { coupleNames, getEventEnd, getEventStart } from './event'

/**
 * Calendar helpers. This module is shared with vite.config.ts (which emits a static
 * .ics file at build time), so it must stay free of browser globals at import time.
 */

const pad = (n: number) => String(n).padStart(2, '0')

/** Wall-clock time in the given zone as an iCalendar local timestamp (YYYYMMDDTHHMMSS). */
function localStamp(date: Date, timeZone: string): string {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat('en-GB', {
      timeZone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hourCycle: 'h23',
    })
      .formatToParts(date)
      .map((p) => [p.type, p.value]),
  )
  return `${parts.year}${parts.month}${parts.day}T${parts.hour}${parts.minute}${parts.second}`
}

function utcStamp(date: Date): string {
  return (
    `${date.getUTCFullYear()}${pad(date.getUTCMonth() + 1)}${pad(date.getUTCDate())}` +
    `T${pad(date.getUTCHours())}${pad(date.getUTCMinutes())}${pad(date.getUTCSeconds())}Z`
  )
}

/** "+05:30" → "+0530" */
function icsOffset(offset: string): string {
  return offset.replace(':', '')
}

function escapeText(value: string): string {
  return value.replace(/\\/g, '\\\\').replace(/\n/g, '\\n').replace(/,/g, '\\,').replace(/;/g, '\\;')
}

/** Fold content lines to 75 octets as required by RFC 5545, never splitting an escape sequence such as "\,". */
function fold(line: string): string {
  const encoder = new TextEncoder()
  if (encoder.encode(line).length <= 75) return line
  const out: string[] = []
  let current = ''
  let currentBytes = 0
  for (const char of line) {
    const bytes = encoder.encode(char).length
    const limit = out.length === 0 ? 75 : 74
    if (currentBytes + bytes > limit) {
      const trailingBackslashes = current.length - current.replace(/\\+$/, '').length
      const carry = trailingBackslashes % 2 === 1 ? '\\' : ''
      out.push(carry ? current.slice(0, -1) : current)
      current = carry
      currentBytes = carry.length
    }
    current += char
    currentBytes += bytes
  }
  out.push(current)
  return out.join('\r\n ')
}

export function calendarTitle(config: InvitationConfig): string {
  return `${config.eventName} — ${coupleNames(config)}`
}

export function calendarLocation(config: InvitationConfig): string {
  const { name, operator, address } = config.venue
  return `${name} (${operator}), ${address}`
}

function calendarDescription(config: InvitationConfig, url?: string): string {
  const lines = [
    `${config.wording.engagementOf} ${coupleNames(config)}`,
    `${config.wording.invitationDate} · ${config.wording.timeText}`,
    calendarLocation(config),
  ]
  if (url) lines.push('', `Invitation: ${url}`)
  return lines.join('\n')
}

export function icsFileName(config: InvitationConfig): string {
  const slug = `${config.brideName}-${config.groomName}-engagement`
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
  return `${slug}.ics`
}

export function buildIcs(config: InvitationConfig, options: { url?: string; now?: Date } = {}): string {
  const start = getEventStart(config)
  const end = getEventEnd(config)
  const tz = config.timezone
  const offset = icsOffset(config.utcOffset)
  const uidSlug = icsFileName(config).replace(/\.ics$/, '')

  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Royal River//Engagement Invitation//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    `X-WR-CALNAME:${escapeText(calendarTitle(config))}`,
    `X-WR-TIMEZONE:${tz}`,
    'BEGIN:VTIMEZONE',
    `TZID:${tz}`,
    `X-LIC-LOCATION:${tz}`,
    'BEGIN:STANDARD',
    `TZOFFSETFROM:${offset}`,
    `TZOFFSETTO:${offset}`,
    `TZNAME:${tz === 'Asia/Kolkata' ? 'IST' : offset}`,
    'DTSTART:19700101T000000',
    'END:STANDARD',
    'END:VTIMEZONE',
    'BEGIN:VEVENT',
    `UID:${uidSlug}-${config.eventDate.replace(/-/g, '')}@royal-river-invitation`,
    `DTSTAMP:${utcStamp(options.now ?? new Date())}`,
    `DTSTART;TZID=${tz}:${localStamp(start, tz)}`,
    `DTEND;TZID=${tz}:${localStamp(end, tz)}`,
    `SUMMARY:${escapeText(calendarTitle(config))}`,
    `DESCRIPTION:${escapeText(calendarDescription(config, options.url))}`,
    `LOCATION:${escapeText(calendarLocation(config))}`,
    ...(options.url ? [`URL:${options.url}`] : []),
    'STATUS:CONFIRMED',
    'TRANSP:OPAQUE',
    ...(config.calendarReminderMinutes != null
      ? [
          'BEGIN:VALARM',
          'ACTION:DISPLAY',
          `DESCRIPTION:${escapeText(calendarTitle(config))}`,
          `TRIGGER:-PT${config.calendarReminderMinutes}M`,
          'END:VALARM',
        ]
      : []),
    'END:VEVENT',
    'END:VCALENDAR',
  ]

  return lines.map(fold).join('\r\n') + '\r\n'
}

export function googleCalendarUrl(config: InvitationConfig, url?: string): string {
  const tz = config.timezone
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: calendarTitle(config),
    dates: `${localStamp(getEventStart(config), tz)}/${localStamp(getEventEnd(config), tz)}`,
    ctz: tz,
    details: calendarDescription(config, url),
    location: calendarLocation(config),
  })
  return `https://calendar.google.com/calendar/render?${params.toString()}`
}

function isAppleTouchDevice(): boolean {
  const ua = navigator.userAgent
  return /iPad|iPhone|iPod/.test(ua) || (ua.includes('Macintosh') && navigator.maxTouchPoints > 1)
}

/**
 * Opens or downloads the calendar file.
 * - iOS/iPadOS: navigate to the static .ics emitted at build time, which opens the native "Add to Calendar" sheet.
 * - Elsewhere: download a freshly generated file (works offline and in every desktop calendar).
 */
export function saveToCalendar(config: InvitationConfig, staticIcsUrl: string, invitationUrl?: string): void {
  if (isAppleTouchDevice()) {
    window.location.href = staticIcsUrl
    return
  }
  const blob = new Blob([buildIcs(config, { url: invitationUrl })], { type: 'text/calendar;charset=utf-8' })
  const href = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = href
  link.download = icsFileName(config)
  link.rel = 'noopener'
  document.body.appendChild(link)
  link.click()
  link.remove()
  window.setTimeout(() => URL.revokeObjectURL(href), 4000)
}
