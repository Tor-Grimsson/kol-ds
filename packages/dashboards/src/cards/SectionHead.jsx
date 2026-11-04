/** SectionHead — a float card's head: the title with its count, a meta line or description under it, a value at the
 * right, the card's controls and the fold chevron (float-everything W7 row 98, 2026-11-04; the exploration's "Briefs ·
 * 1 · ··· · ⌃").
 *
 * `title` in Inter body, `count` in mono beside it (an open count, a row count), `meta` (a support line: "Last 30 days")
 * or `description` under it, `value` at the right in mono (a chart card's total). `controls` is the right group (a
 * `MenuMore`); `onFold` adds the chevron — ⌃ open, ⌄ when `folded`. `Card variant="float"` draws this head; it is
 * exported for a card that draws its own body. */
import { Button } from '@kolkrabbi/kol-component'

export default function SectionHead({ title, count, meta, description, value, controls, folded = false, onFold, className = '' }) {
  return (
    <header className={`flex items-start gap-3 min-w-0 ${className}`.trim()}>
      <div className="flex-1 min-w-0 flex flex-col gap-1">
        <div className="flex items-baseline gap-3 min-w-0">
          <span className="kol-float-body text-fg-96 truncate">{title}</span>
          {count != null && <span className="kol-float-timecode text-fg-64 shrink-0 tabular-nums">{count}</span>}
        </div>
        {meta && <span className="kol-float-label text-fg-64">{meta}</span>}
        {description && <span className="kol-float-hint text-fg-64">{description}</span>}
      </div>
      {value != null && <span className="kol-float-timecode text-fg-64 shrink-0 tabular-nums pt-0.5">{value}</span>}
      {(controls || onFold) && (
        <span className="flex items-center gap-1 shrink-0 -my-1.5 -mr-2">
          {controls}
          {onFold && (
            <Button variant="float" tone="ghost" size="sm" iconOnly={folded ? 'chevron-down' : 'chevron-up'}
              aria-label={folded ? 'Expand' : 'Collapse'} aria-expanded={!folded} onClick={onFold} />
          )}
        </span>
      )}
    </header>
  )
}
