import { IconLoader } from '@kolkrabbi/kol-icons'

/* The glyphs are drawn at 1.5 on a 24 grid; at 16px that is 1.0, so the stroke is lifted to read ~1.25. */
export default function Icon({ name, size = 16, className = '' }) {
  return <IconLoader name={name} size={size} className={`shrink-0 [&_[stroke-width]]:[stroke-width:1.875] ${className}`} />
}
