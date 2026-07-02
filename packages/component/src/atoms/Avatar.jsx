const SIZE_MAP = {
  sm: 'w-8 h-8 kol-helper-12',
  md: 'w-10 h-10 kol-helper-14',
  lg: 'w-14 h-14 kol-helper-16',
  xl: 'w-24 h-24 kol-helper-20',
}

export default function Avatar({ initial, size = 'sm', className = '' }) {
  const sizeCls = SIZE_MAP[size] ?? SIZE_MAP.sm
  return (
    <span
      className={`kol-avatar inline-flex items-center justify-center rounded-full bg-surface-secondary text-emphasis font-narrow font-semibold shrink-0 ${sizeCls} ${className}`}
    >
      {initial}
    </span>
  )
}
