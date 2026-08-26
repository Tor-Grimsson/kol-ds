import { useState } from 'react'

const SIZE_MAP = {
  sm: 'w-8 h-8 kol-helper-12',
  md: 'w-10 h-10 kol-helper-14',
  lg: 'w-14 h-14 kol-helper-16',
  xl: 'w-24 h-24 kol-helper-20',
}

/**
 * Avatar — the initials disc, or a photo at the same geometry.
 *
 * `src` was added when the ArticleHeader reconciliation (2026-08-15) found the
 * consumer hand-rolling `<img className="w-12 h-12 rounded-full object-cover">`
 * beside a grey-circle fallback, because the atom did initials only. The size
 * ladder is the atom's to own — a caller writing its own w-/h- pair is how a
 * fifth avatar size gets invented. Falls back to the initial on a broken src,
 * so a dead photo URL degrades to the disc instead of a torn-image glyph.
 *
 * @param {string} initial   glyph shown when there is no photo
 * @param {string} [src]     resolved image src — the consumer resolves it, this
 *                           atom never builds a URL
 * @param {string} [alt='']  photo alt text
 * @param {'sm'|'md'|'lg'|'xl'} [size='sm']
 */
export default function Avatar({ initial, src, alt = '', size = 'sm', className = '' }) {
  const sizeCls = SIZE_MAP[size] ?? SIZE_MAP.sm
  const [failed, setFailed] = useState(false)
  const shell = `kol-avatar rounded-full bg-surface-secondary shrink-0 ${sizeCls} ${className}`

  if (src && !failed) {
    return (
      <img
        src={src}
        alt={alt}
        className={`${shell} object-cover`}
        onError={() => setFailed(true)}
      />
    )
  }

  return (
    <span
      className={`${shell} inline-flex items-center justify-center text-emphasis font-narrow font-semibold`}
    >
      {initial}
    </span>
  )
}
