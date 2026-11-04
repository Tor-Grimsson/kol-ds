/* Card — the dashboard card (DashboardCardSet, 2026-11-03; metric's Report card + Card11, carried verbatim).
 *
 * One anatomy: a header whose title sits ON the rule as the active tab, controls only on the right; a body that fills
 * the card's height; a foot with a legend on the left and totals / source on the right. Three head forms:
 *   - `title`            one title, drawn as the active tab
 *   - `tabs` + `tab`     a tab row — `onTab(key)` picks one
 *   - a tab with `options` opens a KOL `Menu` (caret, `search` + `empty` for a searchable list); the tab is active while
 *     `tab` is one of its options
 * `controls` is the right group (a ⋮, a note), `onExpand` adds the expand button before it. `footLeft` / `footRight`
 * draw the foot (`footPad` its top padding). `Card.Head` is the header alone, for a card that draws its own body.
 *
 * `variant="float"` (float-everything W7 rows 98 · 99 · 101 · 107, 2026-11-04) is the float sheet: a 20 round on the
 * secondary surface, Inter, no rim, 20 inset. Its head is a `SectionHead` — `title` with a mono `count` ("1 open"),
 * `meta` or `description` under it, `value` at the right, `controls` and the fold chevron (`onFold`; `folded` keeps
 * only the head — the collapsed group). `addLabel` + `onAdd` draw the add row under the body: a sunken float pill with
 * a + and the ↵ hint. Rows inside are `TaskCard size="sm"`. The float sheet has no tabs and no foot.
 *
 * Phone (kol-website metric, 2026-11-03): tabs 12 apart and the header gap 8 below md; the active underline sits
 * inside the scroller (pb-px / -mb-px), so a tab row never scrolls up and down and catches a phone's vertical swipe. */
import { Button, Menu } from '@kolkrabbi/kol-component'
import { Icon } from '@kolkrabbi/kol-icons'
import SectionHead from './SectionHead.jsx'
import { SHEET, WELL, PRESS } from './_shared/float.js'

const TabButton = ({ active, open, children, ...rest }) => (
  <Button
    variant="bare"
    {...rest}
    style={{ height: 'var(--kol-ctl-sm)' }}
    className={`relative inline-flex items-start kol-helper-12 uppercase tracking-wide whitespace-nowrap transition-colors ${active || open ? 'text-fg-96' : 'text-fg-48 hover:text-fg-80'}`}
  >
    {children}
    {active && <span className="absolute left-0 right-0 -bottom-px h-0.5 bg-fg-96" />}
  </Button>
)

export default function Card({ variant, title, count, meta, description, value, tabs, tab, onTab, controls, onExpand, folded, onFold, addLabel, onAdd, footLeft, footRight, footPad = 'pt-4', className = '', children }) {
  if (variant === 'float') {
    return (
      <FloatSheet title={title} count={count} meta={meta} description={description} value={value} controls={controls}
        folded={folded} onFold={onFold} addLabel={addLabel} onAdd={onAdd} className={className}>{children}</FloatSheet>
    )
  }
  const list = tabs ?? [{ key: 't', label: title }]
  const current = tabs ? tab : 't'
  const pick = onTab ?? (() => {})
  return (
    <section className={`bg-surface-secondary rounded flex flex-col min-w-0 ${className}`} style={{ padding: 'var(--kol-pad-card-lg)' }}>
      <header className="flex items-center gap-2 md:gap-4 border-b border-fg-08 min-w-0">
        <div className="flex items-end gap-3 md:gap-5 flex-1 min-w-0 overflow-x-auto overflow-y-hidden self-stretch pb-px -mb-px" style={{ scrollbarWidth: 'none' }}>
          {list.map((t) => {
            if (!t.options) return <TabButton key={t.key} active={t.key === current} onClick={() => pick(t.key)}>{t.label}</TabButton>
            const active = t.options.some((o) => o.key === current)
            return (
              <Menu key={t.key} minWidth={t.search ? 280 : undefined} search={t.search ? { empty: t.empty } : undefined}
                trigger={({ open, props }) => (
                  <TabButton active={active} open={open} {...props}>
                    {(t.search ? t : t.options.find((o) => o.key === current) || t).label}
                    <Icon name="chevron-down" size={10} className="ml-2" style={{ transform: open ? 'rotate(180deg)' : undefined, transition: 'transform 200ms' }} />
                  </TabButton>
                )}
                items={t.options.map((o) => ({ key: o.key, label: o.label, current: o.key === current, checked: o.key === current, onClick: () => pick(o.key) }))} />
            )
          })}
        </div>
        <div className="flex items-center gap-1 pb-2 shrink-0 box-content" style={{ height: 'var(--kol-ctl-sm)' }}>
          {onExpand && <Button tone="ghost" size="sm" iconOnly="maximize" aria-label="Expand" onClick={onExpand} />}
          {controls}
        </div>
      </header>
      <div className="flex-1 min-h-0 flex flex-col">{children}</div>
      {(footLeft || footRight) && (
        <footer className={`flex flex-wrap items-center justify-between gap-x-4 gap-y-2 ${footPad} kol-helper-12 text-fg-48`}>
          <span className="flex flex-wrap items-center gap-x-4 gap-y-1 min-w-0">{footLeft}</span>
          <span className="flex items-center gap-4 shrink-0">{footRight}</span>
        </footer>
      )}
    </section>
  )
}

/* the float sheet: SectionHead, the body, the add row; `folded` keeps the head alone (row 107) */
function FloatSheet({ title, count, meta, description, value, controls, folded = false, onFold, addLabel, onAdd, className = '', children }) {
  return (
    <section className={`${SHEET} flex flex-col p-5 ${className}`.trim()}>
      <SectionHead title={title} count={count} meta={meta} description={description} value={value} controls={controls} folded={folded} onFold={onFold} />
      {!folded && children && <div className="flex-1 min-h-0 flex flex-col pt-4">{children}</div>}
      {!folded && addLabel && (
        <button type="button" onClick={onAdd} style={WELL}
          className={`flex items-center gap-2.5 w-full h-[var(--kol-float-h-md)] px-3.5 mt-4 rounded-full text-left ${PRESS}`}>
          <Icon name="plus" size={16} className="text-oq-64 shrink-0" />
          <span className="kol-float-hint text-fg-64 truncate">{addLabel}</span>
          <span className="ml-auto kol-float-window text-fg-64" aria-hidden="true">↵</span>
        </button>
      )}
    </section>
  )
}

/* the header alone — one title as the active tab on the rule, controls at the right. Below md the title gives way to
 * the controls, which already name the view (a phone's ~300px card never fits both). */
const CardHead = ({ title, right, rightPad = 'pb-2' }) => (
  <header className="flex items-center gap-4 border-b border-fg-08 min-w-0">
    <div className="hidden md:flex items-end gap-5 flex-1 min-w-0 self-stretch"><TabButton active>{title}</TabButton></div>
    <div className={`flex items-center gap-4 ${rightPad} shrink-0 box-content md:ml-auto`} style={{ height: 'var(--kol-ctl-sm)' }}>{right}</div>
  </header>
)
Card.Head = CardHead
