import Tag from '../atoms/Tag.jsx'
import SegmentedToggle from '../atoms/SegmentedToggle.jsx'
import TabsRow from './TabsRow.jsx'

/* taxonomy-ok: molecule — composes Tag, SegmentedToggle (atoms) and TabsRow (a molecule of chips) into one strip */

/**
 * PageControls — The page's own controls, one strip. the controls a PAGE carries for itself — which series show,
 * which view, where to jump, what the dots mean, how many are showing — in one sticky strip under the page
 * header, every page the same (site-hub W4, user 2026-10-24: kol-branding's Compare and Moods carried the same
 * five pieces in two orders, each page hand-laying its own sticky bar). Not content filters: `ContentFilters`
 * narrows a COLLECTION by its facets; this strip drives the page's rendering.
 *
 * The slots, in the order they are drawn — an empty slot is not there:
 *   row 1   toggles · views · count     the series chips (Tag), the view switches (SegmentedToggle), the readout
 *   row 2   jump                        the section tabs (TabsRow variant="chip"), scrolling sideways when long
 *   row 3   legend                      a dot and a name per series, as many columns as series
 *
 * STICKY by default: `sticky top-0` on the page's z-sticky rung, a hairline under it, the surface painted so the
 * page scrolls beneath — kol-branding's StickyBar line, carried. The host page gives it the page's horizontal
 * edge (a `kol-shell-page-bleed` in the app shell, nothing on a site plane).
 *
 * @param {Object}   [toggles]   `{ label, items: [{ id, label, active }], onToggle(id) }` — Tag chips, pressed = showing
 * @param {Array}    [views]     `[{ label, value, onChange, options: [{ value, label }] }]` — one SegmentedToggle each
 * @param {ReactNode}[count]     the readout on the row's right (`15 / 15`)
 * @param {Object}   [jump]      `{ label, value, onChange, tabs: [{ id, label }] }` — TabsRow chips
 * @param {Array}    [legend]    `[{ id, label, color }]` — a dot (`color`, a CSS color) and a name per series
 * @param {boolean}  [sticky=true]
 * @param {string}   [className]
 */
export default function PageControls({ toggles, views = [], count, jump, legend, sticky = true, className = '' }) {
  const rowOne = toggles || views.length > 0 || count != null
  return (
    <div
      className={`${sticky ? 'md:sticky top-0 z-[calc(var(--kol-z-sticky)-1)]' : ''} flex flex-col gap-3 border-b border-fg-08 bg-surface-primary bg-[linear-gradient(var(--kol-shell-page-wash,transparent),var(--kol-shell-page-wash,transparent))] py-3 ${className}`.replace(/\s+/g, ' ').trim()}
    >
      {rowOne && (
        <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
          {toggles && (
            <div className="flex flex-wrap items-center gap-2" role="group" aria-label={toggles.label}>
              {toggles.items.map((t) => (
                <Tag key={t.id} hash={false} active={t.active} onClick={() => toggles.onToggle(t.id)}>{t.label}</Tag>
              ))}
            </div>
          )}
          {views.map((v) => (
            <SegmentedToggle key={v.label} ariaLabel={v.label} size="sm" value={v.value} onChange={v.onChange} options={v.options} />
          ))}
          {count != null && <span className="kol-mono-12 text-fg-48 ml-auto">{count}</span>}
        </div>
      )}
      {jump && (
        <div className="overflow-x-auto">
          <TabsRow variant="chip" size="sm" ariaLabel={jump.label} value={jump.value} onChange={jump.onChange} tabs={jump.tabs} />
        </div>
      )}
      {legend && legend.length > 0 && (
        <div className="grid grid-cols-1 gap-4 xl:[grid-template-columns:var(--cols)]" style={{ '--cols': `repeat(${legend.length}, minmax(0, 1fr))` }}>
          {legend.map((l) => (
            <span key={l.id} className="flex items-center gap-2 min-w-0">
              <span className="h-2.5 w-2.5 flex-none rounded-full border border-fg-24" style={{ background: l.color }} aria-hidden="true" />
              <span className="kol-mono-12 truncate">{l.label}</span>
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
