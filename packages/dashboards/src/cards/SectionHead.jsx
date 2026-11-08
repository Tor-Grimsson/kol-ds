/** SectionHead — a float card's head: the title with its count, a meta line or description under it, a value at the
 * right, the card's controls and the fold chevron (float-everything W7 row 98, 2026-11-04; the exploration's "Briefs ·
 * 1 · ··· · ⌃").
 *
 * `title` in Inter body, `count` in mono beside it (an open count, a row count), `meta` (a support line: "Last 30 days")
 * or `description` under it, `value` at the right in mono (a chart card's total). `controls` is the right group (a
 * `MenuMore`); `onFold` adds the chevron — ⌃ open, ⌄ when `folded`. `Card variant="float"` draws this head; it is
 * exported for a card that draws its own body.
 *
 * `tabs` (`[{ key, label }]`, the editor card — plan-2026-11-05-float-editor W1.2) puts a tab row where the title was:
 * the lit tab (`tab`) in `kol-float-panel` at fg-96 on its 2px rule, the rest in `kol-float-label` at fg-48, 12 apart on
 * one baseline, uppercase; `onTab(key)`. Its chevron sits flush with the card's right inset (his frame 20:14470). */
import { Button } from '@kolkrabbi/kol-component'

export default function SectionHead({ title, count, meta, description, value, controls, folded = false, onFold, tabs, tab, onTab, className = '' }) {
  /* the tab form's chevron at oq-64, a step up from the ghost's oq-48 (his frame 20:14470) */
  const chevron = onFold && (
    <Button variant="float" tone="ghost" size="sm" iconOnly={folded ? 'chevron-down' : 'chevron-up'}
      aria-label={folded ? 'Expand' : 'Collapse'} aria-expanded={!folded} onClick={onFold}
      className={tabs?.length ? '[--kol-tone-fg:var(--kol-oq-64)]' : undefined} />
  )
  if (tabs?.length) {
    return (
      <header className={`flex items-start gap-3 min-w-0 ${className}`.trim()}>
        <div role="tablist" className="flex-1 min-w-0 flex items-baseline gap-3">
          {tabs.map((t) => {
            const lit = t.key === tab
            return (
              <button key={t.key} type="button" role="tab" aria-selected={lit} onClick={() => onTab?.(t.key)}
                className={`relative shrink-0 inline-flex items-start h-[26px] bg-transparent border-0 p-0 uppercase whitespace-nowrap cursor-pointer transition-colors focus-visible:outline-none focus-visible:shadow-[var(--kol-float-focus)] ${lit ? 'kol-float-panel text-fg-96' : 'kol-float-label text-fg-48 hover:text-fg-80'}`}>
                {t.label}
                {lit && <span className="absolute left-0 right-0 -bottom-px h-0.5 bg-fg-96" aria-hidden="true" />}
              </button>
            )
          })}
        </div>
        {(controls || onFold) && <span className="flex items-center gap-1 shrink-0 -mt-[3px]">{controls}{chevron}</span>}
      </header>
    )
  }
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
          {chevron}
        </span>
      )}
    </header>
  )
}
