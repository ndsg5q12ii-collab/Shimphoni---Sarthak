import { Check, Link2, MessageCircle, Share2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { eventConfig } from '@/config/eventConfig'
import { buildShareText, copyToClipboard, getInvitationUrl, shareNatively, whatsappShareUrl } from '@/utils/sharing'
import { Menu } from './ui/Menu'

/**
 * Share the invitation: the native share sheet where supported (most phones),
 * otherwise a menu with WhatsApp and copy-link. Always shares the public invitation URL.
 */
export function ShareInvitation({ className, buttonClassName }: { className?: string; buttonClassName?: string }) {
  const [notice, setNotice] = useState('')
  const url = getInvitationUrl(eventConfig)
  const text = buildShareText(eventConfig)

  useEffect(() => {
    if (!notice) return
    const timer = window.setTimeout(() => setNotice(''), 2800)
    return () => window.clearTimeout(timer)
  }, [notice])

  return (
    <div className={`relative ${className ?? ''}`}>
      <Menu
        label="Share invitation"
        icon={<Share2 aria-hidden="true" />}
        buttonClassName={buttonClassName}
        onTrigger={async () => (await shareNatively({ title: eventConfig.share.title, text, url })) === 'unsupported'}
        items={[
          {
            key: 'whatsapp',
            label: 'Share on WhatsApp',
            description: 'Send the invitation link to a chat',
            icon: <MessageCircle />,
            href: whatsappShareUrl(text, url),
            external: true,
          },
          {
            key: 'copy',
            label: 'Copy invitation link',
            description: url.replace(/^https?:\/\//, ''),
            icon: <Link2 />,
            onSelect: async () =>
              setNotice((await copyToClipboard(url)) ? 'Invitation link copied' : 'Copying failed — please copy the address bar'),
          },
        ]}
      />
      <p
        role="status"
        aria-live="polite"
        className={`pointer-events-none absolute left-1/2 top-[calc(100%+0.6rem)] flex -translate-x-1/2 items-center gap-1.5 whitespace-nowrap text-xs text-champagne transition-opacity duration-300 ${notice ? 'opacity-100' : 'opacity-0'}`}
      >
        {notice && <Check aria-hidden="true" className="h-3.5 w-3.5" />}
        {notice}
      </p>
    </div>
  )
}
