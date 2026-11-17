import type { CSSProperties, ElementType, ReactNode } from 'react'
import { useInView } from '@/hooks/useInView'

interface RevealProps {
  as?: ElementType
  delay?: number
  className?: string
  children: ReactNode
  id?: string
}

/** Fades and lifts its content into place the first time it scrolls into view. */
export function Reveal({ as: Tag = 'div', delay = 0, className = '', children, id }: RevealProps) {
  const [ref, inView] = useInView<HTMLElement>()
  return (
    <Tag
      ref={ref}
      id={id}
      className={`reveal ${inView ? 'is-visible' : ''} ${className}`}
      style={{ '--delay': `${delay}ms` } as CSSProperties}
    >
      {children}
    </Tag>
  )
}
