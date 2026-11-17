import { useEffect, useId, useRef, useState, type ReactNode } from 'react'

export interface MenuItem {
  key: string
  label: string
  description?: string
  icon: ReactNode
  href?: string
  external?: boolean
  onSelect?: () => void
}

interface MenuProps {
  label: string
  icon: ReactNode
  items: MenuItem[]
  /** Lets the trigger try something first (e.g. the native share sheet). Return true to open the menu. */
  onTrigger?: () => Promise<boolean> | boolean
  className?: string
  buttonClassName?: string
}

/**
 * Disclosure menu with keyboard support: Escape closes, focus moves into the
 * panel on open and returns to the trigger on close, outside clicks dismiss it.
 */
export function Menu({ label, icon, items, onTrigger, className = '', buttonClassName = 'btn' }: MenuProps) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const panelId = useId()

  useEffect(() => {
    if (!open) return
    const first = rootRef.current?.querySelector<HTMLElement>('[role="menuitem"]')
    first?.focus()
    const onPointer = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false)
    }
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false)
        triggerRef.current?.focus()
      }
      if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
        const entries = Array.from(rootRef.current?.querySelectorAll<HTMLElement>('[role="menuitem"]') ?? [])
        const index = entries.indexOf(document.activeElement as HTMLElement)
        const next = event.key === 'ArrowDown' ? index + 1 : index - 1
        entries[(next + entries.length) % entries.length]?.focus()
        event.preventDefault()
      }
    }
    document.addEventListener('pointerdown', onPointer)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('pointerdown', onPointer)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  const toggle = async () => {
    if (open) return setOpen(false)
    const shouldOpen = onTrigger ? await onTrigger() : true
    if (shouldOpen) setOpen(true)
  }

  const close = () => {
    setOpen(false)
    triggerRef.current?.focus()
  }

  return (
    <div ref={rootRef} className={`relative ${className}`}>
      <button
        ref={triggerRef}
        type="button"
        className={`${buttonClassName} w-full`}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? panelId : undefined}
        onClick={toggle}
      >
        {icon}
        {label}
      </button>
      {open && (
        <div
          id={panelId}
          role="menu"
          aria-label={label}
          className="menu-panel absolute bottom-[calc(100%+0.5rem)] left-1/2 z-30 w-[min(18rem,calc(100vw-2rem))] -translate-x-1/2 p-1.5"
        >
          {items.map((item) => {
            const content = (
              <>
                <span className="mt-0.5 text-gold [&_svg]:h-4 [&_svg]:w-4" aria-hidden="true">
                  {item.icon}
                </span>
                <span className="flex flex-col text-left">
                  <span className="text-[0.95rem] text-ivory">{item.label}</span>
                  {item.description && <span className="text-xs leading-snug text-mist">{item.description}</span>}
                </span>
              </>
            )
            const itemClass =
              'flex w-full items-start gap-3 px-3.5 py-3 transition-colors hover:bg-gold/10 focus-visible:bg-gold/10 focus-visible:outline-none'
            return item.href ? (
              <a
                key={item.key}
                role="menuitem"
                href={item.href}
                className={itemClass}
                target={item.external ? '_blank' : undefined}
                rel={item.external ? 'noopener noreferrer' : undefined}
                onClick={() => {
                  item.onSelect?.()
                  setOpen(false)
                }}
              >
                {content}
              </a>
            ) : (
              <button
                key={item.key}
                role="menuitem"
                type="button"
                className={itemClass}
                onClick={() => {
                  item.onSelect?.()
                  close()
                }}
              >
                {content}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
