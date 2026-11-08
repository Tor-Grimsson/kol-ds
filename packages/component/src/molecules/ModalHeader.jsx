import Button from '../atoms/Button.jsx'
import Avatar from '../atoms/Avatar.jsx'
import CloseButton from './CloseButton.jsx'
import { IconLoader } from '@kolkrabbi/kol-icons'

/* taxonomy-ok: molecule — Avatar (atom) or kol-icons's IconLoader, a title and trailing actions on Button's nav row; the window row nests Button (atom) + CloseButton (molecule) */

/* class-for-class MoreRows' avatar row (menu-system W4.1, 2026-11-07): the nav Button's lg row, `kol-btn-float` on the float */
const ROW = { float: 'w-full justify-start kol-btn-float', default: 'w-full justify-start h-11 gap-3' }
/* the classes Button emits for `variant="nav" size="lg"` — the static header draws the same row without the press */
const NAV_LG = 'kol-btn kol-btn-nav kol-btn-lg kol-mono-16'
const isSrc = (a) => /[/.:]/.test(a)
/* a window's controls — passing any of them (even undefined, as QuickLookFrame does) draws the window row */
const WINDOW = ['meta', 'nav', 'onMinimise', 'onClose']

/**
 * ModalHeader — The top row of every float sheet and modal: one header, two looks (`default` · `float`), two rows.
 * User 2026-11-07: *"why not just modalheader?"*; 2026-11-08: *"are you both accounting for default and float?"* — the
 * window row that was QuickLookHeader folded in, class for class (QuickLookHeader is its deprecated alias).
 *
 * THE MENU ROW (MoreRows' account row, PanelsMenu's title) — an avatar or a glyph, the title, trailing `actions`. With
 * `onClick` the row is the pressable nav Button; without, the same row as a heading that takes no press. Drawn when
 * `avatar` or `onClick` is set, or when no window control is passed.
 *
 * THE WINDOW ROW (Dialog float, the useModal float prompts, QuickLookFrame) — drawn when `meta`, `nav`, `onMinimise` or
 * `onClose` is passed. Default: ‹ › n / N · the file's name · its facts · the actions · the close, on
 * `.kol-quicklook-header`. Float (kol-float--style 46:2500): the window's glyph (16, oq-64) · its title in
 * `kol-float-panel` (Inter 13/500) · − minimise · × close, 12 apart, the controls quiet on oq-64 and bright under the
 * pointer. No rule under it — the no-borders law holds on float.
 *
 * @param {ReactNode} title
 * @param {'float'|'default'} [variant='default']
 * @param {string|ReactNode} [avatar]  menu row: a picture url, initials, or a node drawn as is
 * @param {string}    [icon]       a kol-icons name — the menu row's lead when there is no avatar; the float window's glyph
 * @param {ReactNode} [actions]    trailing controls (before the close on the window row)
 * @param {Function}  [onClick]    menu row: makes the row a press (the account row)
 * @param {ReactNode} [meta]       window, default look: the facts after the name
 * @param {Object}    [nav]        window, default look: `{ index, total, onPrev, onNext }`
 * @param {Function}  [onMinimise] window, float: shows the − control
 * @param {Function}  [onClose]    window: shows the × control
 * @param {string}    [className]
 */
export default function ModalHeader(props) {
  const { title, avatar, icon, actions, variant = 'default', onClick, meta, nav, onMinimise, onClose, className = '' } = props
  const float = variant === 'float'
  if (avatar == null && !onClick && WINDOW.some((k) => k in props)) {
    if (float) {
      const ctl = 'inline-flex size-6 shrink-0 items-center justify-center rounded-full text-oq-64 hover:text-oq-96 hover:bg-fg-08 focus-visible:outline-none focus-visible:shadow-[var(--kol-float-focus)] cursor-pointer'
      return (
        <div className={`flex min-h-6 w-full items-center gap-3 ${className}`.trim()}>
          {icon && <IconLoader name={icon} size={16} className="shrink-0 text-oq-64" />}
          <span className="kol-float-panel min-w-0 flex-1 truncate text-fg-emphasis">{title}</span>
          {actions}
          {onMinimise && <button type="button" aria-label="Minimise" onClick={onMinimise} className={ctl}><IconLoader name="minus" size={14} /></button>}
          {onClose && <button type="button" aria-label="Close" onClick={onClose} className={ctl}><IconLoader name="x" size={16} /></button>}
        </div>
      )
    }
    return (
      <div className={`kol-quicklook-header ${className}`.trim()}>
        {nav?.total > 1 && (
          /* the pager is its own group: the count sits off the chevrons, and the group sits clear of
           * the file's name (user 2026-09-23) */
          <span className="flex items-center gap-1 mr-3">
            <Button variant="nav" size="sm" iconOnly="chevron-left" onClick={nav.onPrev} aria-label="Previous" />
            <Button variant="nav" size="sm" iconOnly="chevron-right" onClick={nav.onNext} aria-label="Next" />
            <span className="kol-mono-12 text-meta tabular-nums ml-3">{nav.index + 1} / {nav.total}</span>
          </span>
        )}
        {title && <span className="kol-mono-12 text-strong truncate">{title}</span>}
        {meta && <span className="kol-mono-12 text-meta truncate">{meta}</span>}
        <span className="flex-1" />
        {actions}
        {/* THE ESTATE'S CLOSE IDIOM, and every header control wears it (user 2026-09-23): bare at
          * rest, a wash on hover — a filled container read as a second surface on the header. LAST, at the
          * far right (user 2026-10-18: *"X should be space between justify on the right"*) */}
        {onClose && <CloseButton size="sm" onClick={onClose} />}
      </div>
    )
  }
  const cls = `${ROW[float ? 'float' : 'default']} ${className}`.trim()
  const lead = avatar != null
    ? (typeof avatar === 'string' ? <Avatar {...(isSrc(avatar) ? { src: avatar } : { initial: avatar })} alt="" size="xs" /> : avatar)
    : icon && <IconLoader name={icon} size={float ? 'var(--kol-float-ic)' : 22} />
  const body = <>{lead}{actions ? <span className="flex-1 text-left">{title}</span> : title}{actions && <span className="ml-auto flex shrink-0 items-center pointer-events-auto">{actions}</span>}</>
  if (onClick) return <Button variant="nav" size="lg" className={cls} onClick={onClick}>{body}</Button>
  return <div role="heading" aria-level={2} className={`${NAV_LG} ${cls} cursor-default pointer-events-none`}>{body}</div>
}
