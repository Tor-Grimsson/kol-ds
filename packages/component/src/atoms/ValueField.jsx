import { Icon } from '@kolkrabbi/kol-icons'

/**
 * ValueField — A read-only value in a field's capsule. `○ Open` (float-everything W3 row 45, 2026-11-04 — the
 * exploration's task status). The float field's shape — a 36 capsule on the float well, 16 in, Inter 500 — with no
 * input in it: a value the row shows and the user does not type (a status, a kind, an owner). A glyph before it
 * (`icon`, 14, oq-64) or any node (`prefix`). Sizes are the float heights.
 *
 * @param {ReactNode} children   the value
 * @param {string} [icon]        a kol-icons name before the value
 * @param {ReactNode} [prefix]   a node before the value, in place of `icon`
 * @param {'sm'|'md'|'lg'} [size]  the float height (default md)
 * @param {string} [className]
 */
const H = { sm: 'h-[var(--kol-float-h-sm)] px-3 text-[length:var(--kol-float-t-sm)]', md: 'h-[var(--kol-float-h-md)] px-4 text-[length:var(--kol-float-t-md)]', lg: 'h-[var(--kol-float-h-lg)] px-5 text-[length:var(--kol-float-t-lg)]' }

export default function ValueField({ children, icon, prefix, size = 'md', className = '', ...rest }) {
  return (
    <span className={`inline-flex items-center gap-2 rounded-full bg-[var(--kol-float-well)] font-[family-name:var(--kol-font-family-float)] font-medium leading-none text-fg-emphasis ${H[size] ?? H.md} ${className}`.trim()} {...rest}>
      {prefix ?? (icon && <Icon name={icon} size={14} className="text-oq-64" />)}
      {children}
    </span>
  )
}
