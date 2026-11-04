import Button from '../atoms/Button.jsx'

/* taxonomy-ok: molecule — nests Button (atom). */

/**
 * NoticeBanner — Something needs attention, and the one thing that fixes it. `Calendar needs attention · Reconnect`
 * (float-everything W6 row 93, 2026-11-04 — kol-float--style 46:3097). A full-width float strip on the sheet radius
 * (`--kol-float-menu-r`), `kol-float-solid`'s ground without its shadow (it sits in the page, not over it), 16 in: the
 * title in `kol-float-hint` on the emphasis ink over the detail in `kol-float-label` on fg-64, the action at the right
 * as a float button in the secondary tone. No icon and no tint — the words carry it; no hairline edge.
 *
 * @param {ReactNode} title
 * @param {ReactNode} [body]
 * @param {string}    [action]    the button's label (`Reconnect`)
 * @param {Function}  [onAction]
 * @param {string}    [className]
 */
export default function NoticeBanner({ title, body, action, onAction, className = '' }) {
  return (
    <div role="status" className={`flex w-full items-center gap-4 rounded-[var(--kol-float-menu-r)] bg-surface-secondary py-2.5 pl-4 pr-2.5 ${className}`.trim()}>
      <span className="flex min-w-0 flex-1 flex-col">
        <span className="kol-float-hint truncate text-fg-emphasis">{title}</span>
        {body && <span className="kol-float-label truncate text-fg-64">{body}</span>}
      </span>
      {action && <Button variant="float" tone="secondary" size="md" className="shrink-0" onClick={onAction}>{action}</Button>}
    </div>
  )
}
