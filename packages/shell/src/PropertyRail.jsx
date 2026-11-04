import { Button, Input, Dropdown, Slider, ToggleSwitch, TabsRow, floatSurfaceClass } from '@kolkrabbi/kol-component'
import { Icon } from '@kolkrabbi/kol-icons'

/* taxonomy-ok: organism — a float sheet of kol-component fields (Input · Dropdown · Slider · ToggleSwitch · TabsRow) */

/**
 * PropertyRail — The float inspector (float-everything W5 rows 65 · 66, 2026-11-04): a 272 sheet (`--kol-float-menu-r`,
 * 16 in, 18 between) holding its header (the title in `kol-float-panel` and the collapse ⇥), chip tabs (TabsRow float),
 * the selected object's line (glyph · name · eye) and sections — each a `kol-float-label` head with an optional + and
 * rows that kol-component draws: `fields` two-up Inputs float, `select` a Dropdown, `slider` a Slider float with its
 * readout, `switch` a ToggleSwitch float, or `render`. Nothing is forked: the sheet is the only new chrome. The
 * exploration's `Floating properties inspector` (kol-float--style 9:9273); the section hairlines stay out (no-borders law).
 *
 * @param {string}   title       the header (Properties)
 * @param {Function} onCollapse  the ⇥'s press; unset, no ⇥
 * @param {Array}    tabs        TabsRow tabs `[{ value, label }]` at the inspector size (xs, 26 — float-operational W1.3);
 *                               `tab` the current value, the lit chip (`aria-selected`) · `onTab` `(value) => void`
 * @param {Object}   selected    `{ icon, name, visible?, onVisible? }` — the object line; unset, none
 * @param {Array}    sections    `[{ id?, label, onAdd?, meta?, rows }]` — a row is one of:
 *                               `{ type: 'fields', fields: [{ id, prefix?, unit?, value, onChange }] }` (two-up, Input float, `prefix` the X · Y · W · H letter) ·
 *                               `{ type: 'select', id?, label?, options, value, onChange }` (Dropdown) ·
 *                               `{ type: 'slider', id?, label, value, onChange, min?, max?, step?, formatValue? }` (Slider float) ·
 *                               `{ type: 'switch', id?, label, icon?, on, onChange }` (ToggleSwitch float) ·
 *                               `{ id?, render }` — anything else
 * @param {'solid'|'glass-dark'|'glass-light'} surface  what the sheet is made of (default `solid`)
 * @param {number}   width       the sheet's width (default 272)
 * @param {string}   className
 */
export default function PropertyRail({ title, onCollapse, tabs, tab, onTab, selected, sections = [], surface = 'solid', width = 272, className = '' }) {
  return (
    <div className={`kol-property-rail kol-float-chrome flex flex-col gap-[18px] p-4 rounded-[var(--kol-float-menu-r)] ${floatSurfaceClass(surface, true)} ${className}`.trim()} style={{ width }}>
      <div className="flex items-center justify-between">
        <span className="kol-float-panel text-emphasis">{title}</span>
        {onCollapse && <Button variant="float" tone="ghost" size="sm" iconOnly="skip-end" aria-label="Collapse" onClick={onCollapse} />}
      </div>
      {tabs?.length > 0 && <TabsRow variant="float" size="xs" tabs={tabs} value={tab} onChange={onTab} ariaLabel={`${title} tabs`} />}
      {selected && (
        <div className="flex items-center gap-2">
          {selected.icon && <Icon name={selected.icon} size={18} className="text-oq-64" />}
          <span className="kol-float-panel text-emphasis flex-1 min-w-0 truncate">{selected.name}</span>
          {selected.onVisible && (
            <Button variant="float" tone="ghost" size="sm" iconOnly={selected.visible === false ? 'eye-off' : 'eye-on'} aria-label={selected.visible === false ? 'Show' : 'Hide'} aria-pressed={selected.visible !== false} onClick={() => selected.onVisible(selected.visible === false)} />
          )}
        </div>
      )}
      {sections.map((s, i) => (
        <section key={s.id ?? s.label ?? i} className="flex flex-col gap-[18px]">
          {(s.label || s.onAdd || s.meta) && (
            <div className="flex items-center justify-between">
              <span className="kol-float-label text-oq-64">{s.label}</span>
              {s.onAdd && <Button variant="float" tone="ghost" size="sm" iconOnly="plus" aria-label={`Add to ${s.label}`} onClick={s.onAdd} />}
              {s.meta && <span className="kol-float-timecode text-emphasis">{s.meta}</span>}
            </div>
          )}
          {(s.rows ?? []).map((r, j) => <Row key={r.id ?? j} row={r} />)}
        </section>
      ))}
    </div>
  )
}

function Row({ row: r }) {
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
    return (
      <div className="flex flex-col gap-[7px]">
        {r.label && <span className="kol-float-hint text-oq-64">{r.label}</span>}
        <Dropdown variant="float" size="md" options={r.options} value={r.value} onChange={r.onChange} aria-label={r.label} className="w-full" />
      </div>
    )
  }
  if (r.type === 'slider') {
    return <Slider variant="float" readout="value" label={r.label} value={r.value} onChange={r.onChange} min={r.min} max={r.max} step={r.step} formatValue={r.formatValue} className="w-full" />
  }
  if (r.type === 'switch') {
    return (
      <div className="flex items-center justify-between gap-2">
        <span className="kol-float-panel text-emphasis inline-flex items-center gap-1.5">
          {r.icon && <Icon name={r.icon} size={16} className="text-oq-96" />}
          {r.label}
        </span>
        <ToggleSwitch variant="float" checked={!!r.on} onChange={r.onChange} aria-label={r.label} />
      </div>
    )
  }
  return null
}
