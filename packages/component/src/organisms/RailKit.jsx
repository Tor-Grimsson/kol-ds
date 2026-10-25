import SegmentedToggle from '../atoms/SegmentedToggle.jsx'
import Button from '../atoms/Button.jsx'
import { Tooltip } from '../utilities/Popover.jsx'
import { RAIL_ROW } from '../hooks/railRow.js'

/* taxonomy-ok: organism — the parts a Rail's content is built from, beside SettingsPanel's LabeledControlSection and SettingsRow */

/**
 * The rail kit — the parts of a Rail's content, so an app composes a rail instead of improvising one (RailKit,
 * kol-monitor 2026-10-24 — user: *"FXR uses a system of components to structure their rails … does DS need to ship a
 * better rail instructions? … some sort of set or apps/rails? if we can have some reference source of truth"*).
 *
 * THE ANATOMY IS FXR'S INSPECTOR (`kol-fxr/src/editor/labs/LabsView.jsx` LabsRail + `params/AutoControls.jsx`, its own
 * `kol-editor.css` until now): an uppercase title; segmented tabs (Generate · Style · Animation); label / value rows (a
 * label column, a control column); a divider between groups; segmented Off / On rows; a hint line; full-width action
 * buttons and a row of icon buttons; a FOOT pinned under the scroller with its own tabs (Transport · Output · File)
 * and a transport row. Two of those parts the DS already shipped under the settings rail's names, and they are the same
 * components here — `RailSection` IS `LabeledControlSection`, `RailRow` IS `SettingsRow` (aliases in the barrel, not
 * copies). The rest are below. `SettingsPanel` wears `RailHeader`, so the settings rail and every page rail are one
 * thing; the SHELL (width, padding, scrim, the ×) is `Rail`'s, per tier (`variant="app" | "site"`).
 *
 *   RailHeader   title (helper-14 uppercase), a subtitle, the header's actions — the node Rail's `header` slot takes
 *   RailTabs     segmented tabs across the rail's width
 *   RailSection  = LabeledControlSection — an eyebrow over its rows, `divided` for the hairline above
 *   RailRow      = SettingsRow — label · control, the label column fixed (160) or `labelWidth="auto"` in a narrow rail
 *   RailHint     one quiet line under a row or a group (mono-10, meta ink — fxr's)
 *   RailActions  full-width buttons stacked, or `row` for a line of icon buttons
 *   RailFoot     the pinned foot — optional tabs, then the slot; passed to Rail's `footer` (the Rail draws the band's rule)
 *   RailNav      the collapsed nav rail's icon column INSIDE a rail (review 2, 2026-10-25 — the bottom rail over the nav
 *                rail: *"same icon system as collapsed siderail … just icons for Edit Rack and library, like a siderail
 *                in the bottom rail"*): 48 wide, the rail's 8px gutter, the nav rail's buttons, lit on the active view;
 *                passed to Rail's `nav`
 *
 * The reference is `apps/rails` (`pnpm rails`): every part on its own, then the whole rails — the settings rail, an
 * inspector like fxr's, a list rail like monitor's patch table, and the bottom rail — in both tiers.
 */

/** RailHeader — the rail's title line: title, subtitle, and the actions before the × (which Rail draws). */
export function RailHeader({ title, subtitle, actions }) {
  return (
    <div className="flex min-w-0 items-center gap-2">
      <div className="flex min-w-0 flex-1 flex-col">
        {title && <span className="kol-helper-14 uppercase text-emphasis">{title}</span>}
        {subtitle && <span className="kol-mono-12 text-meta">{subtitle}</span>}
      </div>
      {actions}
    </div>
  )
}

/** RailTabs — segmented tabs across the rail: `tabs` `[{ value, label }]`, controlled by `value` / `onChange`. */
export function RailTabs({ tabs = [], value, onChange, ariaLabel = 'Tabs', className = '' }) {
  return <SegmentedToggle size="sm" className={`w-full ${className}`.trim()} options={tabs} value={value} onChange={onChange} ariaLabel={ariaLabel} />
}

/** RailHint — one quiet line of guidance under a row or a group; a sentence, never a label. */
export function RailHint({ children, className = '' }) {
  return <p className={`kol-mono-10 text-meta ${className}`.trim()}>{children}</p>
}

/** RailActions — the rail's buttons: stacked full width (default), or `row` for a line of icon buttons. */
export function RailActions({ row = false, children, className = '' }) {
  return row
    ? <div className={`flex items-center gap-2 ${className}`.trim()}>{children}</div>
    : <div className={`flex flex-col gap-2 [&>*]:w-full ${className}`.trim()}>{children}</div>
}

/** RailFoot — the pinned foot for Rail's `footer` slot: its own tabs when it has them, then the slot (the rule is the Rail's band, 2026-10-25). */
export function RailFoot({ tabs, value, onChange, ariaLabel = 'Foot tabs', children, className = '' }) {
  return (
    <div className={`flex flex-col gap-4 ${className}`.trim()}>
      {tabs?.length > 0 && <RailTabs tabs={tabs} value={value} onChange={onChange} ariaLabel={ariaLabel} />}
      {children}
    </div>
  )
}

/** RailNav — the collapsed nav rail's icon column inside a rail: `items` `[{ id, icon, label }]`, the active `value`,
 *  `onChange(id)`. The nav rail's own geometry and ink (48 wide, `px-2 gap-2 pt-4`, md nav buttons with the 20 glyph at
 *  oq-96, `aria-current` on the active one, the DS tooltip to the right), no edge of its own (his review 2026-10-25:
 *  *"remove the border on the bottom rail siderail"*) — so a bottom rail over the nav rail carries its views exactly
 *  under the nav rail's rows. */
export function RailNav({ items = [], value, onChange, iconComponent, ariaLabel = 'Views', className = '' }) {
  return (
    <nav aria-label={ariaLabel} className={`kol-rail-nav flex w-12 shrink-0 self-stretch flex-col items-center gap-2 px-2 pt-4 pb-4 ${className}`.trim()}>
      {items.map((it) => (
        <Tooltip key={it.id} label={it.label} placement="right" triggerClassName="inline-flex shrink-0">
          <Button
            iconOnly={it.icon}
            iconSize={RAIL_ROW.glyph}
            iconComponent={iconComponent}
            variant="nav"
            size="md"
            aria-current={value === it.id ? 'page' : undefined}
            style={{ color: RAIL_ROW.active }}
            aria-label={it.label}
            onClick={() => onChange?.(it.id)}
          />
        </Tooltip>
      ))}
    </nav>
  )
}
