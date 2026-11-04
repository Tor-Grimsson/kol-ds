import Button from '../atoms/Button.jsx'

/**
 * PanelsMenu — Which panels are shown, and the button that changes it. `Side panel · Hidden · Show` (float-everything
 * W4 row 57, 2026-11-04 — the exploration's workspace panels menu). A float sheet (`--kol-float-menu-r`, 16 in) with
 * a title and one row per panel on the list radius: the panel's name over its meta at the left, its state in the
 * middle, its action as a float button at the end — `primary` draws the inverted capsule (the one the user most
 * likely wants: Show), the rest the secondary tone. A press is `onAction(panel)`.
 *
 * @param {string} [title]    default `Workspace panels`
 * @param {Array}  panels     `[{ id, name, meta?, state, action, primary?, onAction? }]` — `state` the word
 *                            (`Hidden`, `Folded`), `action` the button's (`Show`, `Expand`)
 * @param {Function} [onAction]  `(panel) => void`, after the panel's own `onAction`
 * @param {string} [className]
 */
export default function PanelsMenu({ title = 'Workspace panels', panels = [], onAction, className = '' }) {
  return (
    <div className={`flex w-full max-w-md flex-col gap-3 rounded-[var(--kol-float-menu-r)] bg-surface-secondary p-4 ${className}`.trim()}>
      <span className="kol-float-panel text-fg-emphasis">{title}</span>
      <ul className="flex flex-col gap-2">
        {panels.map((p) => (
          <li key={p.id ?? p.name} className="flex items-center gap-4 rounded-[var(--kol-float-list-r)] bg-[var(--kol-float-well)] py-2 pl-4 pr-2">
            <span className="flex min-w-0 flex-1 flex-col gap-0.5">
              <span className="kol-float-hint truncate text-fg-emphasis">{p.name}</span>
              {p.meta && <span className="kol-float-label truncate text-fg-64">{p.meta}</span>}
            </span>
            {p.state && <span className="kol-float-label shrink-0 text-fg-64">{p.state}</span>}
            <Button variant="float" size="md" tone={p.primary ? 'inverted' : 'secondary'} className="shrink-0 min-w-20" onClick={() => { p.onAction?.(p); onAction?.(p) }}>{p.action}</Button>
          </li>
        ))}
      </ul>
    </div>
  )
}
