import { useRef, useState } from 'react'
import Icon from './Icon.jsx'
import { Button, Dropdown, Input, LabeledControl, Menu, PopoverPanel, Slider, TabsRow, ToggleSwitch, ColorInputRow, ColorPickerPopover } from '@kolkrabbi/kol-component'

/* W13 state 9: an effect's settings beside the rail: icon, name and chevron, more and close; then one labelled row
   per parameter, drawn from the parameter's own type (round 2, 3.1): range a Slider field, select or segmented a
   Dropdown, toggle a Toggle, color the color row, text an Input; a range pair named "… X" and "… Y" shares one row as
   two Inputs. The label column lives here, never in the rail. Generic: it knows no effect.
   params: [{ key, label, type, min, max, step, options, default }] (the engine's param grammar); values: { key: value };
   mixed: the keys whose value differs across the layers the card was opened on (15.5): their field reads Mixed;
   onChange(key, value). types, onType: the header's chevron opens a Menu of `types` (Menu groups) and hands the picked
   row to onType; more, onMore: the header's more opens a Menu of `more` rows the same way (round 4, 2.3: the real
   effect card's Move up, Move down, Disable, Reset to defaults, Delete). Without them the header shows the icon and
   name alone, and no more.
   head: nodes above the rows (the real card's Preset, notes, Camera drag); tabs, tab, onTab: a tab track under them
   (the card's Effect and Animation); foot: nodes after the rows (the card's rolls and its sweep rig). width: the
   panel's, when an effect's rows need more than the popover's own. */

const opts = (p) => (p.options ?? []).map((o) => (typeof o === 'object' ? o : { value: o, label: String(o) }))
const num = (raw) => { const n = parseFloat(raw); return Number.isFinite(n) ? n : null }
const pairOf = (a, b) => a && b && a.type === 'range' && b.type === 'range' && / X$/.test(a.label) && b.label === a.label.replace(/X$/, 'Y')

/* the params as rows: a pair is one row */
function rowsOf(params) {
  const out = []
  for (let i = 0; i < params.length; i++) {
    if (pairOf(params[i], params[i + 1])) { out.push([params[i], params[i + 1]]); i++ } else out.push([params[i]])
  }
  return out
}

function Control({ p, value, onChange, mixed }) {
  const v = value ?? p.default
  const set = (next) => onChange?.(p.key, next)
  if (p.type === 'range') return <Slider variant="kolbox" readout="input" aria-label={p.label} value={v} min={p.min} max={p.max} step={p.step} onChange={set} formatValue={mixed ? () => 'Mixed' : undefined} className="flex-1" />
  if (p.type === 'select' || p.type === 'segmented') {
    const o = opts(p)
    return <Dropdown variant="kolbox" ariaLabel={p.label} value={v} options={o} onChange={(s) => set(o.find((x) => String(x.value) === s)?.value ?? s)} className="flex-1" />
  }
  if (p.type === 'toggle') return <ToggleSwitch variant="kolbox" aria-label={p.label} checked={!!v} onChange={set} />
  if (p.type === 'color') return <ColorInputRow variant="kolbox" picker={ColorPickerPopover} label={p.label} value={mixed ? 'Mixed' : v} onChange={set} />
  return <Input variant="kolbox" aria-label={p.label} defaultValue={mixed ? '' : v ?? ''} placeholder={mixed ? 'Mixed' : undefined} key={mixed ? 'mixed' : v} onBlur={(e) => e.target.value !== v && set(e.target.value)} className="flex-1" />
}

/* a pair's cell: commits on Enter or blur, as the rail's number fields */
const Half = ({ p, lead, value, onChange, mixed }) => (
  <Input variant="kolbox" key={mixed ? 'mixed' : value} prefix={lead} aria-label={p.label} defaultValue={mixed ? '' : value ?? p.default} placeholder={mixed ? 'Mixed' : undefined} className="flex-1" data-param={p.key}
    onBlur={(e) => { const n = num(e.target.value); if (n == null) e.target.value = mixed ? '' : value ?? p.default; else onChange?.(p.key, Math.min(p.max ?? n, Math.max(p.min ?? n, n))) }}
    onKeyDown={(e) => e.key === 'Enter' && e.currentTarget.blur()} />
)

export default function PopoverEffect({ anchor, open, onClose, name = 'Effect', icon = 'sparkles', params = [], values = {}, mixed = [], onChange, types, onType, more: moreRows, onMore, head, tabs, tab, onTab, foot, width }) {
  const typeRef = useRef(null), moreRef = useRef(null)
  const [menu, setMenu] = useState(null)
  const canType = !!(types && onType), canMore = !!(moreRows && onMore)
  const type = (
    <button ref={typeRef} type="button" onClick={() => setMenu(menu === 'type' ? null : 'type')} disabled={!canType} aria-haspopup="menu" aria-expanded={menu === 'type'} aria-label={`${name}, change effect`} className="flex h-control min-w-0 items-center gap-2 rounded-control text-section text-text outline-none focus-visible:outline-solid focus-visible:outline-1 focus-visible:outline-accent disabled:cursor-default">
      <Icon name={icon} className="text-muted" />
      <span className="min-w-0 truncate">{name}</span>
      <Icon name="chevron-down" size={12} className="text-muted" />
    </button>
  )
  const more = <span ref={moreRef} className="inline-flex"><Button variant="kolbox" iconOnly="more" aria-label="More" pressed={menu === 'more'} onClick={() => setMenu(menu === 'more' ? null : 'more')} disabled={!canMore}/></span>
  return (
    <PopoverPanel variant="kolbox"
      anchor={anchor}
      open={open}
      onClose={onClose}
      aria-label={name}
      leading={<span className="mr-auto inline-flex min-w-0">{canType ? type : (
        <span className="flex h-control min-w-0 items-center gap-2 text-section text-text">
          <Icon name={icon} className="text-muted" />
          <span className="min-w-0 truncate">{name}</span>
        </span>
      )}</span>}
      actions={canMore ? more : null}
      width={width}
      className="max-h-120"
    >
      <div className="flex flex-col gap-2 px-4 pb-4" data-effect-params={params.length}>
        {head}
        {tabs && <TabsRow variant="kolbox" className="w-full" tabs={tabs} value={tab} onChange={onTab} />}
        {rowsOf(params).map(([a, b]) => (
          <LabeledControl variant="kolbox" horizontal key={a.key} label={b ? a.label.replace(/ X$/, '') : a.label}>
            {b
              ? <><Half p={a} lead="X" value={values[a.key]} mixed={mixed.includes(a.key)} onChange={onChange} /><Half p={b} lead="Y" value={values[b.key]} mixed={mixed.includes(b.key)} onChange={onChange} /></>
              : <div className="flex min-w-0 flex-1 items-center" data-param={a.key}><Control p={a} value={values[a.key]} mixed={mixed.includes(a.key)} onChange={onChange} /></div>}
          </LabeledControl>
        ))}
        {foot}
      </div>
      {canType && <Menu variant="kolbox" aria-label="Change effect" anchor={typeRef} open={menu === 'type'} onClose={() => setMenu(null)} groups={types} onSelect={onType} />}
      {canMore && <Menu variant="kolbox" aria-label="More" anchor={moreRef} open={menu === 'more'} onClose={() => setMenu(null)} groups={moreRows} onSelect={onMore} />}
    </PopoverPanel>
  )
}
