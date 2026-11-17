import { CalendarHeart, CalendarPlus, Download } from 'lucide-react'
import { eventConfig } from '@/config/eventConfig'
import { publicAsset } from '@/utils/assets'
import { googleCalendarUrl, icsFileName, saveToCalendar } from '@/utils/calendar'
import { getInvitationUrl } from '@/utils/sharing'
import { Menu } from './ui/Menu'

/** "Save the Date": an .ics file (Apple, Outlook, Android calendars) or Google Calendar, both in Asia/Kolkata time. */
export function SaveTheDate({ className, buttonClassName }: { className?: string; buttonClassName?: string }) {
  const invitationUrl = getInvitationUrl(eventConfig)
  return (
    <Menu
      label="Save the date"
      icon={<CalendarHeart aria-hidden="true" />}
      className={className}
      buttonClassName={buttonClassName}
      items={[
        {
          key: 'ics',
          label: 'Apple, Outlook & other calendars',
          description: 'Adds the evening as a calendar event (.ics)',
          icon: <Download />,
          onSelect: () => saveToCalendar(eventConfig, publicAsset(icsFileName(eventConfig)), invitationUrl),
        },
        {
          key: 'google',
          label: 'Google Calendar',
          description: 'Opens with every detail filled in',
          icon: <CalendarPlus />,
          href: googleCalendarUrl(eventConfig, invitationUrl),
          external: true,
        },
      ]}
    />
  )
}
