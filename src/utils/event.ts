import type { InvitationConfig } from '../config/eventConfig'

/** Absolute start instant of the event (timezone-independent epoch). */
export function getEventStart(config: InvitationConfig): Date {
  return new Date(`${config.eventDate}T${config.eventTime}:00${config.utcOffset}`)
}

export function getEventEnd(config: InvitationConfig): Date {
  return new Date(getEventStart(config).getTime() + config.calendarDurationMinutes * 60_000)
}

export function coupleNames(config: InvitationConfig, joiner = '&'): string {
  return `${config.brideName} ${joiner} ${config.groomName}`
}

/** "Friday, 1 January 2027" — formatted in the venue's time zone so every guest sees the same date. */
export function formatLongDate(config: InvitationConfig, locale = 'en-GB'): string {
  return new Intl.DateTimeFormat(locale, {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: config.timezone,
  }).format(getEventStart(config))
}

export function formatWeekday(config: InvitationConfig, locale = 'en-GB'): string {
  return new Intl.DateTimeFormat(locale, { weekday: 'long', timeZone: config.timezone }).format(getEventStart(config))
}

/** "1 January 2027" in the venue's time zone. */
export function formatDayMonthYear(config: InvitationConfig, locale = 'en-GB'): string {
  return new Intl.DateTimeFormat(locale, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: config.timezone,
  }).format(getEventStart(config))
}

/** "5:00 PM" in the venue's time zone. */
export function formatStartTime(config: InvitationConfig): string {
  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    timeZone: config.timezone,
  }).format(getEventStart(config))
}

/** Short zone label for the venue, e.g. "IST" for Asia/Kolkata. */
export function zoneAbbreviation(config: InvitationConfig): string {
  if (config.timezone === 'Asia/Kolkata') return 'IST'
  const part = new Intl.DateTimeFormat('en-US', { timeZone: config.timezone, timeZoneName: 'short' })
    .formatToParts(getEventStart(config))
    .find((p) => p.type === 'timeZoneName')
  return part?.value ?? config.timezone
}
