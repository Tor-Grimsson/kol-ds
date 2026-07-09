import { Avatar } from '@kolkrabbi/kol-component'

/**
 * AuthorLine — the author cluster (DS Avatar + name + role), pulled out of
 * ArticleHeader so it stands on its own (bylines, cards, footers, work
 * credits). Strings render in their authored case — no text-transform (KOL
 * rule), no JS casing.
 *
 * @param {string} name     author name
 * @param {string} title    author role / title line (hidden when falsy)
 * @param {string} initial  avatar glyph; defaults to name's first char
 * @param {'sm'|'md'|'lg'} size  Avatar size (default 'lg')
 * @param {string} className extra classes on the root
 */
export default function AuthorLine({ name, title, initial, size = 'lg', className = '' }) {
  const glyph = initial ?? (name ? name.trim().charAt(0) : '')
  return (
    <div className={`flex items-center gap-4 ${className}`.trim()}>
      <Avatar initial={glyph} size={size} />
      <div className="flex flex-col">
        <span className="kol-helper-12 text-fg-48">{name}</span>
        {title && <span className="kol-mono-12 text-fg-64">{title}</span>}
      </div>
    </div>
  )
}
