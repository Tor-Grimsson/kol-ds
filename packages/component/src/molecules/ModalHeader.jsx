import Button from '../atoms/Button.jsx'
import Avatar from '../atoms/Avatar.jsx'
import { Icon } from '@kolkrabbi/kol-icons'

/* taxonomy-ok: molecule — Avatar (atom) or kol-icons's Icon, a title and trailing actions on Button's nav row */

/* class-for-class MoreRows' avatar row (menu-system W4.1, 2026-11-07): the nav Button's lg row, `kol-btn-float` on the float */
const ROW = { float: 'w-full justify-start kol-btn-float', default: 'w-full justify-start h-11 gap-3' }
/* the classes Button emits for `variant="nav" size="lg"` — the static header draws the same row without the press */
const NAV_LG = 'kol-btn kol-btn-nav kol-btn-lg kol-mono-16'
const isSrc = (a) => /[/.:]/.test(a)

/**
 * ModalHeader — The top row of a floating surface: an avatar or a glyph, the title, and trailing actions (a close).
 * One header for every float sheet and modal (menu-system W4, user 2026-11-07: *"why not just modalheader?"*) —
 * MoreRows' account row and PanelsMenu's title draw it. With `onClick` the row is the pressable nav Button it was in
 * MoreRows; without, the same row as a heading that takes no press.
 *
 * @param {string}    title
 * @param {string|ReactNode} [avatar]  a picture url, initials, or a node drawn as is
 * @param {string}    [icon]     a kol-icons name, in the avatar's place when there is none
 * @param {ReactNode} [actions]  trailing node — a close button
 * @param {'float'|'default'} [variant='default']  `float` the float row (`kol-btn-float`), else the 44px nav row
 * @param {Function}  [onClick]  makes the row a press (the account row)
 * @param {string}    [className]
 */
export default function ModalHeader({ title, avatar, icon, actions, variant = 'default', onClick, className = '' }) {
  const float = variant === 'float'
  const cls = `${ROW[float ? 'float' : 'default']} ${className}`.trim()
  const lead = avatar != null
    ? (typeof avatar === 'string' ? <Avatar {...(isSrc(avatar) ? { src: avatar } : { initial: avatar })} alt="" size="xs" /> : avatar)
    : icon && <Icon name={icon} size={float ? 'var(--kol-float-ic)' : 22} />
  const body = <>{lead}{actions ? <span className="flex-1 text-left">{title}</span> : title}{actions && <span className="ml-auto flex shrink-0 items-center pointer-events-auto">{actions}</span>}</>
  if (onClick) return <Button variant="nav" size="lg" className={cls} onClick={onClick}>{body}</Button>
  return <div role="heading" aria-level={2} className={`${NAV_LG} ${cls} cursor-default pointer-events-none`}>{body}</div>
}
