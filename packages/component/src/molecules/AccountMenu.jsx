import Avatar from '../atoms/Avatar.jsx'
import { Menu, MenuTrigger } from './Menu.jsx'

/**
 * AccountMenu — The account's circle and its menu. `(A) ⌄ Profile · Settings · Sign out` (float-everything W4 row 60,
 * 2026-11-04 — the exploration's 36 avatar button; KOL had Avatar and Menu, never composed). The trigger is a float
 * icon-only circle (36, the md float height): the `Avatar` when there is an `initial` or a `src`, the `user` glyph
 * when there is neither; lit while the menu is open. The menu is `Menu`'s rows as data (`items`), right-aligned
 * under the circle, in the float look — a `Sign out` row takes `tone: 'danger'`.
 *
 * @param {string}   [initial]   the avatar's letter
 * @param {string}   [src]       the avatar's photo
 * @param {string}   [name]      names the trigger for a screen reader (default `Account`)
 * @param {Array}    items       `Menu`'s rows
 * @param {'start'|'end'} [align]  default `end`
 * @param {'sm'|'md'|'lg'} [size]  the circle (default md)
 * @param {string}   [className]
 */
export default function AccountMenu({ initial, src, name = 'Account', items = [], align = 'end', size = 'md', className = '' }) {
  const avatar = (initial || src) ? <Avatar initial={initial} src={src} alt="" size="xs" /> : null
  return (
    <Menu align={align} offset={8} minWidth={200} items={items} variant="float" className={className}
      trigger={({ open, props }) => (
        <MenuTrigger variant="float" size={size} open={open} iconOnly="user" iconComponent={avatar ?? undefined} aria-label={name} {...props} />
      )} />
  )
}
