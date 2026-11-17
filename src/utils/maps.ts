import type { InvitationConfig } from '../config/eventConfig'

/**
 * Google Maps directions to the venue, in order of reliability:
 * an explicitly configured share link → verified coordinates → a search for the venue's name.
 * The Maps URL API opens the Google Maps app on phones and the website elsewhere.
 */
export function getDirectionsUrl(config: InvitationConfig): string {
  const { mapsUrl, coordinates, mapsQuery } = config.venue
  if (mapsUrl.trim()) return mapsUrl.trim()
  const destination = coordinates ? `${coordinates.lat},${coordinates.lng}` : mapsQuery
  const params = new URLSearchParams({ api: '1', destination })
  return `https://www.google.com/maps/dir/?${params.toString()}`
}

export function isVerifiedLocation(config: InvitationConfig): boolean {
  return Boolean(config.venue.mapsUrl.trim() || config.venue.coordinates)
}
