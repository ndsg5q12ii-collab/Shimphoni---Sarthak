/** Antique-gold foil gradient used for linework and fills. */
export function GoldGradient({ id, angle = 'diagonal' }: { id: string; angle?: 'diagonal' | 'vertical' }) {
  const coords = angle === 'vertical' ? { x1: '0', y1: '0', x2: '0', y2: '1' } : { x1: '0', y1: '0', x2: '1', y2: '1' }
  return (
    <linearGradient id={id} {...coords}>
      <stop offset="0" stopColor="#F4E2AE" />
      <stop offset="0.32" stopColor="#E7CD91" />
      <stop offset="0.62" stopColor="#C8A45D" />
      <stop offset="1" stopColor="#9C7B3C" />
    </linearGradient>
  )
}

/** Soft radial halo for light bulbs and lit windows. */
export function GlowGradient({ id, color = '#F7D58B', opacity = 0.75 }: { id: string; color?: string; opacity?: number }) {
  return (
    <radialGradient id={id}>
      <stop offset="0" stopColor={color} stopOpacity={opacity} />
      <stop offset="0.45" stopColor={color} stopOpacity={opacity * 0.35} />
      <stop offset="1" stopColor={color} stopOpacity="0" />
    </radialGradient>
  )
}
