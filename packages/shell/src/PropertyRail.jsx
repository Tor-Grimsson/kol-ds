import { Button, Input, Dropdown, RailFloat, LabeledControl, LabeledControlSection, LayerRow, Slider, ToggleSwitch, TabsRow } from '@kolkrabbi/kol-component'
import { IconLoader } from '@kolkrabbi/kol-icons'

/* taxonomy-ok: organism — kol-component's RailFloat holding LayerRow, LabeledControlSection and kol-component fields (Input · Dropdown · Slider · ToggleSwitch · TabsRow) */

/**
 * PropertyRail — The float inspector (float-everything W5 rows 65 · 66, 2026-11-04): a 264 sheet (`--kol-float-menu-r`,
 * 16 in, 18 between) holding its header (Header variant="property": the title in `kol-float-panel` and the collapse-h ⇥), chip tabs (TabsRow float),
 * the selected object's line (kol-component's `LayerRow variant="head"`: glyph, name and eye, W8.1) and sections — each a
 * float `LabeledControlSection` (W10.1: the `kol-float-label` head with an optional + or meta over its rows) of rows that
 * kol-component draws: `fields` two-up Inputs float, `select` a Dropdown, `slider` a Slider float with its
 * readout, `switch` a ToggleSwitch float, or `render`. Every labelled row is `LabeledControl variant="float"`. Nothing is forked: the sheet is the only new chrome. The
 * exploration's `Floating properties inspector` (kol-float--style 9:9273); the section hairlines stay out (no-borders law).
 * Since 0.123.0 the sheet, header, collapse-v and its pill are kol-component's `RailFloat` (plan-2026-11-12-float-system
 * W4.1) — the one shell NavRail float and ReadingContents draw on too; the body scrolls under the header.
 *
 * @param {string}   title       the header (Properties)
 * @param {ReactNode} kind       the quiet second text beside the title (the preset beside the effect — no middot, W10.1)
 * @param {Array}    windows     `[{ id, title, kind, sections, children, footer, defaultCollapsedV, … }]` — the Rail as a stack
 *                               of separate RailFloat windows (W10.1): each window takes this component's props over the
 *                               shared ones, its own Header with collapse-v, collapsing alone; 24 between them; the stack
 *                               scrolls only when they outgrow it. Unset, one Rail as before
 * @param {Function} onCollapseH the collapse-h ⇥'s press (the Rail collapses sideways out of view); unset, no ⇥.
 *                               `onCollapse` is its deprecated alias
 * @param {Array}    tabs        TabsRow tabs `[{ value, label }]` at the inspector size (xs, 26 — float-operational W1.3);
 *                               `tab` the current value, the lit chip (`aria-selected`) · `onTab` `(value) => void`
 * @param {Object}   selected    `{ icon, name, visible?, onVisible? }` — the object line; unset, none
 * @param {Array}    sections    `[{ id?, label, onAdd?, meta?, rows }]` — a row is one of:
 *                               `{ type: 'fields', fields: [{ id, prefix?, unit?, value, onChange }] }` (two-up, Input float, `prefix` the X · Y · W · H letter) ·
 *                               `{ type: 'select', id?, label?, options, value, onChange }` (Dropdown) ·
 *                               `{ type: 'slider', id?, label, value, onChange, min?, max?, step?, formatValue? }` (Slider float) ·
 *                               `{ type: 'switch', id?, label, icon?, on, onChange }` (ToggleSwitch float) ·
 *                               `{ id?, render }` — anything else
 *                               `{ type: 'labeled', id?, label, render }` — the tool Rail's row (generator Rails, plan-2026-11-05-float-editor
 *                               W7.6): LabeledControl float `horizontal` — the label in the `--kol-float-label-w` column, the control in the rest ·
 *                               `{ type: 'subhead', id?, label, meta? }` — a group's caps head inside a section (LIGHTS / POINT EDITOR): it and the rows
 *                               under it are a float LabeledControlSection of their own ·
 *                               a section may also be `collapsible` (`open` · `onToggle(open)`): LabeledControlSection's own
 *                               collapsible head — the title in `kol-float-panel`, `meta`, the 12 chevron at the right end; its
 *                               rows shown while open. No section pads itself: the space between sections is the body's gap
 * @param {'regular'|'compact'} density  `compact` — the tool Rail's rhythm (his generator frames 32:16215): 8 between rows
 *                               and between sections (the body's gap, W10.1); `regular` (default) the inspector's 18
 * @param {Function} onExpand    the ↗ in the header — the tool's expanded form (the settings dialog); unset, none
 * @param {ReactNode} footer     the Rail's foot (a status line, the tool's action), after the sections
 * @param {'solid'|'glass-dark'|'glass-light'} surface  what the sheet is made of (default `solid`)
 * @param {boolean}  wide        the wide module (`--kol-float-module-w-wide`, 360): a tool Rail whose rows carry two controls;
 *                               unset, the inspector (`--kol-float-module-w`, 264) — the two module widths of the float spec
 * @param {number|string} width  an explicit width (a phone's `100%`); unset, the module width
 * @param {boolean}  collapsibleV the collapse-v ⌃ in the header: the Rail collapses up to its header pill and opens again —
 *                               every float panel is a module (the user, 2026-11-12: *"EVERYTHING IS FLOAT everything is MODULES"*)
 * @param {boolean}  collapsedV  controlled; `defaultCollapsedV` uncontrolled · `onCollapseV(collapsedV)` on every press.
 *                               Collapsed, only the header shows, on the same sheet. Deprecated aliases: `foldable` ·
 *                               `folded` · `defaultFolded` · `onFold`
 * @param {ReactNode} children   the body slot, after the sections — a panel that is not rows (ReadingContents, Labs' params)
 * @param {string}   className
 */
export default function PropertyRail({ windows, ...props }) {
  /* WINDOWS (plan-2026-11-12-one-header W10.1, P15: *"you just split the content into windows and they expand and collapse as
   * you see fit"*): a vertical stack of separate RailFloat windows, the float layout's gap (24) between them, each its own
   * Header (property, collapse-v) collapsing alone; the stack scrolls only when the windows outgrow it. A window is this
   * component's own props (`{ id, title, kind, sections, children, footer, defaultCollapsedV … }`) over the shared ones. */
  if (windows?.length) {
    const { className = '', title, kind, sections, children, footer, tabs, tab, onTab, selected, ...shared } = props
    return (
      <div data-property-rail-windows="" className={`flex min-h-0 flex-col gap-6 overflow-y-auto [scrollbar-width:none] ${className}`.trim()}>
        {windows.map((w, i) => <PropertyRailWindow key={w.id ?? i} collapsibleV {...shared} {...w} className={`shrink-0 ${w.className ?? ''}`.trim()} />)}
      </div>
    )
  }
  return <PropertyRailWindow {...props} />
}

function PropertyRailWindow({ title, kind, onCollapseH, onCollapse, onExpand, density = 'regular', tabs, tab, onTab, selected, sections = [], footer, surface = 'solid', wide = false, width, collapsibleV, collapsedV, defaultCollapsedV, onCollapseV, foldable, folded, defaultFolded, onFold, children, className = '' }) {
  const compact = density === 'compact'
  return (
    <RailFloat title={title} kind={kind} onExpand={onExpand} onCollapseH={onCollapseH ?? onCollapse}
      collapsibleV={collapsibleV ?? foldable} collapsedV={collapsedV ?? folded} defaultCollapsedV={defaultCollapsedV ?? defaultFolded} onCollapseV={onCollapseV ?? onFold}
      compact={compact} wide={wide} width={width} surface={surface} className={`kol-property-rail ${className}`.trim()}
      footer={footer && compact ? <div className="pt-4">{footer}</div> : footer}>
      {tabs?.length > 0 && <TabsRow variant="float" size="xs" tabs={tabs} value={tab} onChange={onTab} ariaLabel={`${title} tabs`} />}
      {selected && (
        <LayerRow variant="head" icon={selected.icon} name={selected.name} visible={selected.visible !== false}
          onToggleVisible={selected.onVisible && (() => selected.onVisible(selected.visible === false))} />
      )}
      {sections.map((s, i) => {
        const add = s.onAdd && <Button variant="float" tone="ghost" size="sm" iconOnly="plus" aria-label={`Add to ${s.label}`} onClick={s.onAdd} />
        const meta = s.meta && <span className="kol-float-timecode text-emphasis">{s.meta}</span>
        /* a collapsible section is LabeledControlSection's own `collapsible`: the title, the meta, the 12 chevron at the head's
         * right end (W10.1). No section pads itself: the space between sections is the body's gap */
        const label = s.collapsible ? <span className="kol-float-panel text-emphasis min-w-0">{s.label}</span> : s.label
        const end = s.collapsible ? (s.meta && <span className="kol-float-timecode text-oq-64">{s.meta}</span>) : (add || meta) && <>{add}{meta}</>
        return (
          <LabeledControlSection key={s.id ?? s.label ?? i} variant="float" data-section={s.id ?? s.label} label={label} end={end}
            collapsible={!!s.collapsible} open={s.collapsible ? !!s.open : undefined} onToggle={s.onToggle}
            gap={compact ? 2 : 'module'} rowGap={compact ? 2 : 'module'}>
            {groups(s.rows ?? []).map((g, j) => (g.head
              ? <LabeledControlSection key={g.head.id ?? `g${j}`} variant="float" label={g.head.label} end={g.head.meta && <span className="kol-float-label text-fg-emphasis">{g.head.meta}</span>}
                  gap={compact ? 2 : 'module'} rowGap={compact ? 2 : 'module'}>
                  {g.rows.map((r, k) => <Row key={r.id ?? k} row={r} />)}
                </LabeledControlSection>
              : g.rows.map((r, k) => <Row key={r.id ?? k} row={r} />)))}
          </LabeledControlSection>
        )
      })}
      {children}
    </RailFloat>
  )
}

/* a section's rows in groups: the rows before the first `subhead`, then each subhead with the rows under it — a subhead is
 * a float LabeledControlSection of its own (W10.1), never a loose head row */
function groups(rows) {
  const out = [{ rows: [] }]
  for (const r of rows) r.type === 'subhead' ? out.push({ head: r, rows: [] }) : out[out.length - 1].rows.push(r)
  return out[0].rows.length ? out : out.slice(1)
}

/* every row with a label is LabeledControl float (plan-2026-11-12-float-system W2.1): the label column and gap are the
 * spec's tokens, the control bare in its cell */
function Row({ row: r }) {
  if (r.type === 'labeled') {
    return (
      <LabeledControl variant="float" horizontal label={r.label} className="w-full">
        <div className="flex w-full min-w-0 items-center gap-1.5" data-control={r.label}>{r.render()}</div>
      </LabeledControl>
    )
  }
  if (r.render) return r.render()
  if (r.type === 'fields') {
    return (
      <div className="flex gap-2">
        {r.fields.map((f) => (
          <Input key={f.id} variant="float" size="md" prefix={f.prefix} suffix={f.unit} value={f.value} onChange={(e) => f.onChange?.(e.target.value)} aria-label={f.label ?? f.prefix ?? f.id} className="flex-1 min-w-0" />
        ))}
      </div>
    )
  }
  if (r.type === 'select') {
    const dd = <Dropdown variant="float" size="md" options={r.options} value={r.value} onChange={r.onChange} aria-label={r.label} className="w-full" />
    return r.label ? <LabeledControl variant="float" label={r.label}>{dd}</LabeledControl> : dd
  }
  if (r.type === 'slider') {
    const shown = r.formatValue ? r.formatValue(r.value) : r.value
    return (
      <LabeledControl variant="float" label={r.label} hint={shown}>
        <Slider variant="float" aria-label={r.label} value={r.value} onChange={r.onChange} min={r.min} max={r.max} step={r.step} className="w-full" />
      </LabeledControl>
    )
  }
  if (r.type === 'switch') {
    const label = r.icon ? <span className="inline-flex items-center gap-1.5"><IconLoader name={r.icon} size={16} className="text-oq-96" />{r.label}</span> : r.label
    return (
      <LabeledControl variant="float" horizontal label={label}>
        <div className="flex w-full justify-end"><ToggleSwitch variant="float" checked={!!r.on} onChange={r.onChange} aria-label={r.label} /></div>
      </LabeledControl>
    )
  }
  return null
}
