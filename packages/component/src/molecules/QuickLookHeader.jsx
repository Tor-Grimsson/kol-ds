import { Icon } from '@kolkrabbi/kol-icons'
import Button from '../atoms/Button.jsx'
import CloseButton from './CloseButton.jsx'

/* taxonomy-ok: molecule — nests Button (atom) + CloseButton (utility). */

/**
 * QuickLookHeader — A window's title row. Lifted out of QuickLookFrame (float-everything W6 row 82, 2026-11-04) so a
 * Dialog, a confirm and the utility window wear the same header. Unset `variant` is QuickLookFrame's header as it was,
 * class for class: ‹ › n / N · the file's name · its facts · the actions · the close, on `.kol-quicklook-header`.
 *
 * `variant="float"` is the exploration's window header (kol-float--style 46:2500): the window's glyph (16, oq-64) · its
 * title in `kol-float-panel` (Inter 13/500) · − minimise · × close, 12 apart, the controls quiet on oq-64 and bright
 * under the pointer. No rule under it — the no-borders law holds on float.
 *
 * @param {'float'} [variant]
 * @param {string}    [icon]      float: the window's glyph (`user`, `alert-triangle`, …)
 * @param {ReactNode} title
 * @param {ReactNode} [meta]      default look: the facts after the name
 * @param {ReactNode} [actions]   controls before the close
 * @param {Object}    [nav]       default look: `{ index, total, onPrev, onNext }`
 * @param {Function}  [onMinimise] float: shows the − control
 * @param {Function}  [onClose]   shows the × control
 * @param {string}    [className]
 */
export default function QuickLookHeader({ variant, icon, title, meta, actions, nav, onMinimise, onClose, className = '' }) {
  if (variant === 'float') {
    const ctl = 'inline-flex size-6 shrink-0 items-center justify-center rounded-full text-oq-64 hover:text-oq-96 hover:bg-fg-08 focus-visible:outline-none focus-visible:shadow-[var(--kol-float-focus)] cursor-pointer'
    return (
      <div className={`flex min-h-6 w-full items-center gap-3 ${className}`.trim()}>
        {icon && <Icon name={icon} size={16} className="shrink-0 text-oq-64" />}
        <span className="kol-float-panel min-w-0 flex-1 truncate text-fg-emphasis">{title}</span>
        {actions}
        {onMinimise && <button type="button" aria-label="Minimise" onClick={onMinimise} className={ctl}><Icon name="minus" size={14} /></button>}
        {onClose && <button type="button" aria-label="Close" onClick={onClose} className={ctl}><Icon name="x" size={16} /></button>}
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
