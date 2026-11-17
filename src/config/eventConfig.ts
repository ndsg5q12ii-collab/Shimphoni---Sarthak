/**
 * ROYAL RIVER — central invitation configuration
 * ----------------------------------------------
 * Every guest-facing word, date, link and media slot lives in this one file.
 *
 * It is deliberately plain data (no imports) because the build also reads it to
 * generate the downloadable calendar file and the link-preview metadata.
 *
 * PLACEHOLDERS — values left as '' or null have not been provided yet. The site
 * adapts gracefully until they are filled in (see README → "Before you share").
 * Never put guessed phone numbers, coordinates or addresses here.
 */

export type RsvpChannel = 'auto' | 'whatsapp' | 'form'

export interface ResponsiveImage {
  /** Paths relative to /public. Each entry is `path widthDescriptor`, e.g. `images/a-800.avif 800w`. */
  avif: string[]
  webp: string[]
  /** Single JPEG/PNG fallback for very old browsers. */
  fallback: string
  width: number
  height: number
  alt: string
}

export interface InvitationConfig {
  experienceTitle: string
  brideName: string
  groomName: string
  eventName: string

  /** Local date at the venue, YYYY-MM-DD. */
  eventDate: string
  /** Local start time at the venue, 24-hour HH:mm. */
  eventTime: string
  /** IANA time zone of the venue. */
  timezone: string
  /** UTC offset of the venue on the event date, ±HH:MM. India Standard Time has no daylight saving. */
  utcOffset: string
  /** Length of the calendar entry only. The invitation itself says "onwards"; this is never shown to guests. */
  calendarDurationMinutes: number
  /** Calendar reminder before the start, in minutes. Set to null for no reminder. */
  calendarReminderMinutes: number | null

  /** Wording, kept exactly as on the original invitation where it exists. */
  wording: {
    arrivalEyebrow: string
    arrivalTitle: string
    arrivalSubtitle: string
    arrivalHint: string
    engagementOf: string
    /** Date exactly as printed on the invitation card. */
    invitationDate: string
    timeLabel: string
    /** Time exactly as printed on the invitation card. */
    timeText: string
    /** Venue line as printed on the card, split where it should break. Joined with a space it reads as one line. */
    cardVenueLines: [string, string]
    togetherness: { eyebrow: string; title: string; body: string }
    closing: { lead: string; sub: string; signoffAccent: string; signoff: string }
  }

  venue: {
    name: string
    operator: string
    area: string
    city: string
    region: string
    /** Address shown to guests. Only what the original invitation states, plus the state and country. */
    address: string
    description: string
    /** PLACEHOLDER — paste the verified Google Maps share link of the jetty here for production. */
    mapsUrl: string
    /** PLACEHOLDER — verified coordinates of the jetty, e.g. { lat: 22.5, lng: 88.3 }. Leave null rather than guessing. */
    coordinates: { lat: number; lng: number } | null
    /** Used for Google Maps directions when neither mapsUrl nor coordinates are set. */
    mapsQuery: string
  }

  rsvp: {
    /** 'auto' uses the form endpoint when one is set, otherwise WhatsApp. */
    channel: RsvpChannel
    /**
     * PLACEHOLDER — WhatsApp number that receives replies, international format, digits only
     * (country code first, no + or spaces). While empty, guests choose the recipient inside WhatsApp.
     */
    whatsappNumber: string
    /** Optional name shown on the WhatsApp button, e.g. "the Sarkar family". */
    whatsappRecipientLabel: string
    /** PLACEHOLDER — CORS-enabled endpoint that accepts a JSON POST (e.g. Formspree). Success is only shown on a 2xx reply. */
    formEndpoint: string
    /** Upper limit for the guest-count stepper in the RSVP form. */
    maxGuests: number
    /** Optional reply-by line, e.g. "Kindly reply by 15th December 2026". Not on the original invitation, so empty. */
    replyBy: string
  }

  share: {
    /** PLACEHOLDER — the public URL once deployed. Falls back to the address the guest opened. */
    publicInvitationUrl: string
    title: string
    intro: string
  }

  media: {
    /**
     * Original artwork slots. Leave null to use the built-in illustrations.
     * To use an original export, place it in /public/images/original/ and set its path here,
     * e.g. 'images/original/couple.webp'. Transparent PNG/WebP works best for the couple, boat and seal.
     */
    invitationImage: string | null
    coupleIllustration: string | null
    boatIllustration: string | null
    waxSealImage: string | null
    venueImage: ResponsiveImage & {
      caption: string
      credit: string
      creditUrl: string
      /** False while the photo shows the river setting rather than the venue itself. */
      isVenuePhoto: boolean
    }
    /** Optional ambient audio (path in /public). Never autoplays; guests opt in. */
    backgroundMusic: string | null
    /** Link-preview image in /public (1200 × 630). */
    ogImage: string
  }
}

export const eventConfig: InvitationConfig = {
  experienceTitle: 'Royal River — A Celebration of Two Hearts',

  // CONFIRM BEFORE PRODUCTION: the spelling "Shimphoni" is taken from the brief and must be checked with the couple.
  brideName: 'Shimphoni',
  groomName: 'Sarthak',
  eventName: 'Engagement Ceremony',

  eventDate: '2027-01-01',
  eventTime: '17:00',
  timezone: 'Asia/Kolkata',
  utcOffset: '+05:30',
  calendarDurationMinutes: 240,
  calendarReminderMinutes: 24 * 60,

  wording: {
    arrivalEyebrow: 'A celebration of two hearts',
    arrivalTitle: 'A special invitation awaits…',
    arrivalSubtitle: 'An evening of love, laughter & togetherness.',
    arrivalHint: 'Tap to open your invitation',
    engagementOf: 'Engagement of',
    invitationDate: '1st January 2027',
    timeLabel: 'Time',
    timeText: '5:00 PM Onwards',
    cardVenueLines: ['The Bengal Paddle Jetty', '(The Barge Company), Babu Ghat'],
    togetherness: {
      eyebrow: 'A celebration of togetherness',
      title: 'Two hearts, one beautiful beginning.',
      body: 'With love and blessings, we invite you to join us as we celebrate a special milestone in the journey of Shimphoni & Sarthak.',
    },
    closing: {
      lead: 'We would be delighted to have you with us as we celebrate this special occasion.',
      sub: 'Your presence will make our celebration even more memorable.',
      signoffAccent: 'With love,',
      signoff: 'we look forward to celebrating with you.',
    },
  },

  venue: {
    name: 'The Bengal Paddle Jetty',
    operator: 'The Barge Company',
    area: 'Babu Ghat',
    city: 'Kolkata',
    region: 'West Bengal, India',
    address: 'Babu Ghat, Kolkata, West Bengal, India',
    description: 'On the banks of the Hooghly at Babu Ghat, as the city lights settle on the water, our evening of celebration begins.',
    mapsUrl: '',
    coordinates: null,
    mapsQuery: 'The Bengal Paddle Jetty, The Barge Company, Babu Ghat, Kolkata',
  },

  rsvp: {
    channel: 'auto',
    whatsappNumber: '',
    whatsappRecipientLabel: '',
    formEndpoint: '',
    maxGuests: 10,
    replyBy: '',
  },

  share: {
    publicInvitationUrl: '',
    title: 'Engagement of Shimphoni & Sarthak',
    intro: 'You are warmly invited to the',
  },

  media: {
    invitationImage: null,
    coupleIllustration: 'images/original/couple-illustration.jpg',
    boatIllustration: null,
    waxSealImage: null,
    venueImage: {
      avif: ['images/venue/hooghly-800.avif 800w', 'images/venue/hooghly-1400.avif 1400w', 'images/venue/hooghly-2200.avif 2200w'],
      webp: ['images/venue/hooghly-800.webp 800w', 'images/venue/hooghly-1400.webp 1400w', 'images/venue/hooghly-2200.webp 2200w'],
      fallback: 'images/venue/hooghly-1400.jpg',
      width: 2200,
      height: 1467,
      alt: 'The Howrah Bridge and the lights of Kolkata reflected in the Hooghly River at blue hour.',
      caption: 'The Hooghly at blue hour, Kolkata',
      credit: 'Photograph by Aman Yadav on Unsplash',
      creditUrl: 'https://unsplash.com/@the_manupulator?utm_source=royal_river_invitation&utm_medium=referral',
      isVenuePhoto: false,
    },
    backgroundMusic: null,
    ogImage: 'og-image.jpg',
  },
}
