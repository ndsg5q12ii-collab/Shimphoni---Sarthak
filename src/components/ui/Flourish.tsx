/** Small gold ornament used between headings and copy: hairlines, a lotus bud and two pearls. */
export function Flourish({ className = '', width = 180 }: { className?: string; width?: number }) {
  return (
    <svg viewBox="0 0 180 20" width={width} height={(width / 180) * 20} className={className} aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id="rr-flourish-l" x1="0" x2="1">
          <stop offset="0" stopColor="#C8A45D" stopOpacity="0" />
          <stop offset="1" stopColor="#C8A45D" />
        </linearGradient>
        <linearGradient id="rr-flourish-r" x1="1" x2="0">
          <stop offset="0" stopColor="#C8A45D" stopOpacity="0" />
          <stop offset="1" stopColor="#C8A45D" />
        </linearGradient>
      </defs>
      <path d="M0 10H70" stroke="url(#rr-flourish-l)" strokeWidth="1" />
      <path d="M110 10H180" stroke="url(#rr-flourish-r)" strokeWidth="1" />
      <circle cx="74" cy="10" r="1.6" fill="#C8A45D" />
      <circle cx="106" cy="10" r="1.6" fill="#C8A45D" />
      <path
        d="M90 2C94 6 96 8 96 10.5C96 14 93 17 90 18C87 17 84 14 84 10.5C84 8 86 6 90 2Z"
        fill="none"
        stroke="#E7CD91"
        strokeWidth="1"
      />
      <path
        d="M90 6.5C91.8 8.5 92.6 9.6 92.6 11C92.6 12.8 91.4 14.2 90 14.8C88.6 14.2 87.4 12.8 87.4 11C87.4 9.6 88.2 8.5 90 6.5Z"
        fill="#C8A45D"
      />
      <path d="M80 10C82.5 8 84 9 85 10.5M100 10C97.5 8 96 9 95 10.5" fill="none" stroke="#C8A45D" strokeWidth="0.8" />
    </svg>
  )
}
