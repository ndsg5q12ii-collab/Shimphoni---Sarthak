import { eventConfig } from '@/config/eventConfig'
import { useCountdown, type CountdownStatus } from '@/hooks/useCountdown'
import { formatLongDate, formatStartTime, getEventEnd, getEventStart, zoneAbbreviation } from '@/utils/event'

const START = getEventStart(eventConfig).getTime()
const END = getEventEnd(eventConfig).getTime()

const plural = (n: number, word: string) => `${n} ${word}${n === 1 ? '' : 's'}`

const EYEBROW: Record<CountdownStatus, string> = {
  upcoming: 'Counting down to',
  live: 'Happening now',
  past: 'Celebrated on',
}

/** Section heading that follows the countdown's state. */
function CountdownHeading({ status }: { status: CountdownStatus }) {
  return (
    <div className="text-center">
      <p className="eyebrow">{EYEBROW[status]}</p>
      <h2 id="countdown-title" className="mt-4 font-display text-[clamp(2.1rem,6.4vw,3.3rem)] font-medium leading-tight text-balance text-ivory">
        {formatLongDate(eventConfig)}
      </h2>
      <p className="mt-2 font-caps text-[0.75rem] tracking-[0.24em] text-champagne">
        {formatStartTime(eventConfig)} {zoneAbbreviation(eventConfig)} · {eventConfig.venue.city}
      </p>
    </div>
  )
}

/** Live countdown to 5:00 PM IST on the event date. Clamped at zero; changes to a message once the evening begins. */
export function Countdown() {
  const { days, hours, minutes, seconds, status } = useCountdown(START, END)

  if (status !== 'upcoming') {
    return (
      <>
        <CountdownHeading status={status} />
        <div className="mx-auto mt-12 max-w-xl text-center" role="status">
          <p className="font-display text-[clamp(2rem,6vw,3rem)] italic leading-tight text-champagne">
            {status === 'live' ? 'The celebration has begun' : 'Thank you for celebrating with us'}
          </p>
          <p className="mt-3 text-mist">
            {status === 'live' ? 'We are so glad you are here with us tonight.' : 'Your love and blessings made the evening unforgettable.'}
          </p>
        </div>
      </>
    )
  }

  const units = [
    { label: 'Days', value: String(days) },
    { label: 'Hours', value: String(hours).padStart(2, '0') },
    { label: 'Minutes', value: String(minutes).padStart(2, '0') },
    { label: 'Seconds', value: String(seconds).padStart(2, '0') },
  ]

  return (
    <>
      <CountdownHeading status={status} />
      <div role="timer" aria-live="off" aria-atomic="true" className="mt-12">
        <p className="sr-only">
          {plural(days, 'day')}, {plural(hours, 'hour')} and {plural(minutes, 'minute')} until the celebration.
        </p>
        <ol className="mx-auto grid max-w-3xl grid-cols-4" aria-hidden="true">
          {units.map((unit, i) => (
            <li key={unit.label} className={`relative flex flex-col items-center px-1 ${i > 0 ? 'countdown-divider' : ''}`}>
              <span className="countdown-value">{unit.value}</span>
              <span className="mt-2 font-caps text-[0.6rem] tracking-[0.28em] text-gold sm:text-[0.7rem]">{unit.label}</span>
            </li>
          ))}
        </ol>
      </div>
    </>
  )
}
