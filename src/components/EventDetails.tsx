import { eventConfig } from '@/config/eventConfig'
import { formatDayMonthYear, formatStartTime, formatWeekday, zoneAbbreviation } from '@/utils/event'
import { GetDirections } from './GetDirections'
import { SaveTheDate } from './SaveTheDate'

/** Section B — the essentials, set in readable type with fine gold separators. */
export function EventDetails() {
  const { venue } = eventConfig
  const details = [
    { term: 'Date', main: formatDayMonthYear(eventConfig), sub: formatWeekday(eventConfig) },
    {
      term: 'Time',
      main: `${formatStartTime(eventConfig)} onwards`,
      sub: zoneAbbreviation(eventConfig) === 'IST' ? 'India Standard Time (IST)' : zoneAbbreviation(eventConfig),
    },
    { term: 'Venue', main: venue.name, sub: venue.operator },
    { term: 'Address', main: `${venue.area}, ${venue.city}`, sub: venue.region },
  ]

  return (
    <div className="details-frame mx-auto max-w-4xl">
      <span className="details-corner left-0 top-0" aria-hidden="true" />
      <span className="details-corner right-0 top-0 rotate-90" aria-hidden="true" />
      <span className="details-corner bottom-0 right-0 rotate-180" aria-hidden="true" />
      <span className="details-corner bottom-0 left-0 -rotate-90" aria-hidden="true" />
      <dl className="grid sm:grid-cols-2">
        {details.map((item) => (
          <div key={item.term} className="detail-cell">
            <dt className="eyebrow">{item.term}</dt>
            <dd className="mt-3">
              <span className="block font-display text-[clamp(1.6rem,4.6vw,2.15rem)] leading-tight text-ivory">{item.main}</span>
              <span className="mt-1 block text-[0.95rem] text-mist">{item.sub}</span>
            </dd>
          </div>
        ))}
      </dl>
      <div className="flex flex-col items-stretch justify-center gap-3 border-t border-gold/20 px-6 py-6 sm:flex-row sm:items-center sm:px-10">
        <SaveTheDate className="sm:min-w-56" />
        <GetDirections className="btn sm:min-w-56" />
      </div>
    </div>
  )
}
