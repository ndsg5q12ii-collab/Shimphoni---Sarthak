import { Navigation } from 'lucide-react'
import { eventConfig } from '@/config/eventConfig'
import { getDirectionsUrl } from '@/utils/maps'

/** Opens Google Maps directions to the venue (the app on phones, the website elsewhere). */
export function GetDirections({ className = 'btn', label = 'Get directions' }: { className?: string; label?: string }) {
  return (
    <a className={className} href={getDirectionsUrl(eventConfig)} target="_blank" rel="noopener noreferrer">
      <Navigation aria-hidden="true" />
      {label}
      <span className="sr-only"> to {eventConfig.venue.name} (opens Google Maps)</span>
    </a>
  )
}
