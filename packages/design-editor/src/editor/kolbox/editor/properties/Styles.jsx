import { useEffect, useState } from 'react'
import { Button, ColorInputRow, ColorPickerPopover, Dropdown, FieldPair, Input, PopoverPanel } from '@kolkrabbi/kol-component'
import { FAMILY_OPTIONS, familyCssFor, useComposeState } from '../engine.js'
import { colorPatch, detachPatch, styleAt, textPatch, textValueOf } from '../../../compose/styles.js'
import { Act, Field, shown, useBeside } from './parts.jsx'

/* STYLES (plan-2026-11-20-kolbox-everything-left W7, Figma's style picker). A section's Styles button opens this beside
   the rail: the file's color styles (a swatch and the name) or text styles ("Ag" in the style's font, the name, its size
   and line height), the one in use checked; a press applies it, the plus saves the section's current value as a new
   style, a row's edit button opens it here (its name, its value, Delete style). The styles are the file's own
   (compose/styles.js), so an edit reaches every layer that uses one, one undo step. */

const swatch = (s, palette) => <span aria-hidden className="size-4 shrink-0 rounded-xs ring-1 ring-border" style={{ background: shown(s.color, palette) ?? s.color, opacity: s.opacity ?? 1 }} />
const textMeta = (v) => `${Math.round(v.size ?? 0)}/${Math.round((v.lineHeight ?? 1) * 100)}%`

/* one style row: the press applies, the edit button opens it */
function StyleRow({ kind, style, palette, on, onApply, onEdit }) {
  return (
    <div className="flex items-center gap-1 pr-2" data-style-row={style.name}>
      <button type="button" onClick={onApply} aria-pressed={on}
        className={`flex h-(--kol-kolbox-ctl) min-w-0 flex-1 items-center gap-2 rounded-control pl-4 text-left text-help outline-none hover:bg-field focus-visible:outline-solid focus-visible:outline-1 focus-visible:-outline-offset-1 focus-visible:outline-accent ${on ? 'text-accent' : 'text-text'}`}>
        {kind === 'text'
          ? <span aria-hidden className="w-4 shrink-0 text-center" style={{ fontFamily: familyCssFor(style.value), fontWeight: style.value.weight }}>Ag</span>
          : swatch(style, palette)}
        <span className="min-w-0 flex-1 truncate">{style.name}</span>
        {kind === 'text' && <span className="shrink-0 text-muted">{textMeta(style.value)}</span>}
      </button>
      <Act icon="sliders-rows" label={`Edit ${style.name}`} onClick={onEdit} />
    </div>
  )
}

/* a style's own settings: its name, its value, Delete style */
function StyleEdit({ kind, style, palette, onBack }) {
  const { updateStyle, removeStyle } = useComposeState()
  const v = style.value ?? {}
  const setText = (patch) => updateStyle(style.id, { value: { ...v, ...patch } })
  return (
    <div className="flex flex-col gap-2 px-4 pb-4" data-style-edit={style.name}>
      <Input variant="kolbox" aria-label="Style name" value={style.name} className="w-full" onCommit={(t) => { const n = String(t).trim(); if (n) updateStyle(style.id, { name: n }) }} />
      {kind === 'color' && (
        <ColorInputRow variant="kolbox" picker={ColorPickerPopover} label="Style color"
          value={shown(style.color, palette) ?? style.color} resolved={shown(style.color, palette)}
          onChange={(c) => updateStyle(style.id, { color: c })}
          opacity={(style.opacity ?? 1) * 100} onOpacity={(n) => updateStyle(style.id, { opacity: n / 100 })} />
      )}
      {kind === 'text' && (
        <>
          <Dropdown variant="kolbox" ariaLabel="Style font" className="w-full" value={v.family} options={FAMILY_OPTIONS} onChange={(id) => setText({ family: id })} />
          <FieldPair variant="kolbox"
            first={<Field aria-label="Style size" lead="S" value={Math.round(v.size ?? 0)} onCommit={(n) => setText({ size: Math.max(1, Math.round(n)) })} />}
            second={<Field aria-label="Style weight" lead="W" value={Math.round(v.weight ?? 400)} onCommit={(n) => setText({ weight: Math.round(n) })} />} />
          <FieldPair variant="kolbox"
            first={<Field aria-label="Style line height" icon="line-height" trailing="%" value={Math.round((v.lineHeight ?? 1) * 100)} onCommit={(n) => setText({ lineHeight: Math.round(n) / 100 })} />}
            second={<Field aria-label="Style letter spacing" icon="letter-spacing" trailing="%" value={Math.round((v.tracking ?? 0) * 1000) / 10} onCommit={(n) => setText({ tracking: Math.round(n / 100 / 0.005) * 0.005 })} />} />
        </>
      )}
      <span className="flex items-center justify-between gap-2">
        <Button variant="kolbox" onClick={onBack}>Done</Button>
        <Button variant="kolbox" onClick={() => { removeStyle(style.id); onBack() }}>Delete style</Button>
      </span>
    </div>
  )
}

/* the picker: `kind` 'color' | 'text'; `current` the style in use (checked); `onApply(style)`; `onCreate()` saves the
   section's value as a new style and applies it */
export default function StylesPopover({ kind, anchor, open, onClose, current = null, onApply, onCreate, editId = null }) {
  const { styles, palette } = useComposeState()
  const [editing, setEditing] = useState(null)
  /* `editId`: opened on that style's settings (the page's Styles list) */
  useEffect(() => { if (open) setEditing(editId) }, [open, editId])
  const list = kind === 'text' ? styles.texts : styles.colors
  const edited = list.find((s) => s.id === editing)
  const close = () => { setEditing(null); onClose() }
  return (
    <PopoverPanel variant="kolbox" anchor={anchor} open={open} onClose={close} width="var(--spacing-pane, 240px)"
      title={edited ? edited.name : kind === 'text' ? 'Text styles' : 'Color styles'}
      leading={edited ? <Button variant="kolbox" iconOnly="arrow-left" aria-label="Back to styles" onClick={() => setEditing(null)} /> : undefined}
      actions={!edited && onCreate ? <Button variant="kolbox" iconOnly="plus" aria-label="Create style" onClick={() => setEditing(onCreate())} /> : undefined}>
      {edited
        ? <StyleEdit kind={kind} style={edited} palette={palette} onBack={() => setEditing(null)} />
        : (
          <div className="flex flex-col pb-2" data-styles-list={kind}>
            {list.length === 0 && <p className="px-4 pb-2 text-help text-muted">No styles in this file. The plus saves this one.</p>}
            {list.map((s) => (
              <StyleRow key={s.id} kind={kind} style={s} palette={palette} on={s.id === current}
                onApply={() => { onApply(s); close() }} onEdit={() => setEditing(s.id)} />
            ))}
          </div>
        )}
    </PopoverPanel>
  )
}

/* a fill or stroke row that uses a style: the swatch and the style's name in place of the hex, then detach, eye and
   minus (Figma's row with a style) */
export function StyledPaintRow({ style, palette, hidden, onOpen, onDetach, actions }) {
  return (
    <FieldPair variant="kolbox" span data-style-paint={style.name} trailing={(
      <>
        <Act icon="link" label="Detach style" onClick={onDetach} />
        {actions}
      </>
    )} first={(
      <button type="button" onClick={onOpen} aria-label={`Style ${style.name}`}
        className={`flex h-control min-w-0 flex-1 items-center gap-2 rounded-control bg-field pr-2 pl-1.5 text-left text-help outline-none focus-visible:outline-solid focus-visible:outline-1 focus-visible:-outline-offset-1 focus-visible:outline-accent ${hidden ? 'text-muted' : 'text-text'}`}>
        {swatch(style, palette)}
        <span className="min-w-0 flex-1 truncate">{style.name}</span>
      </button>
    )} />
  )
}

/* a text style applied: the layer's type becomes the style's, pointing at it */
export const applyTextStyle = (style) => ({ ...textPatch(style.value), textStyle: style.id })

/* A SECTION'S STYLES BUTTON for a color: it opens the picker for `slot` on each of `layers` (one, or the selection);
   a pick writes the style's color there, the plus saves `value` ({ color, opacity }) as a new style and applies it.
   `write(layer, patch)` lands each patch (one undo step is the caller's) */
export function ColorStylesButton({ layers, slot, value, write, label = 'Styles' }) {
  const { saveStyle, beginTransaction, commitTransaction } = useComposeState()
  const [ref, anchor] = useBeside()
  const [open, setOpen] = useState(false)
  /* one undo step for every layer it lands on (and, from the plus, the new style with it) */
  const apply = (st) => { beginTransaction(); layers.forEach((l) => write(l, colorPatch(l, slot, st))); commitTransaction() }
  return (
    <>
      <span ref={ref} className="inline-flex"><Act icon="circles-grid" label={label} lit={open} onClick={() => setOpen((o) => !o)} /></span>
      <StylesPopover kind="color" anchor={anchor} open={open} onClose={() => setOpen(false)} current={layers.length === 1 ? styleAt(layers[0], slot) : null}
        onApply={apply}
        onCreate={value?.color ? () => {
          beginTransaction('Create style')
          const id = saveStyle('color', { color: value.color, opacity: value.opacity ?? 1 })
          apply({ id, color: value.color, opacity: value.opacity ?? 1 })
          commitTransaction()
          return id
        } : undefined} />
    </>
  )
}

/* Typography's Styles button: the picker for the layer's type, the plus saving the layer's own as a new style */
export function TextStylesButton({ layer, write }) {
  const { saveStyle, beginTransaction, commitTransaction } = useComposeState()
  const [ref, anchor] = useBeside()
  const [open, setOpen] = useState(false)
  return (
    <>
      <span ref={ref} className="inline-flex"><Act icon="circles-grid" label="Styles" lit={open} onClick={() => setOpen((o) => !o)} /></span>
      <StylesPopover kind="text" anchor={anchor} open={open} onClose={() => setOpen(false)} current={layer.textStyle ?? null}
        onApply={(st) => write(applyTextStyle(st))}
        onCreate={() => { beginTransaction('Create style'); const id = saveStyle('text', { value: textValueOf(layer) }); write({ textStyle: id }); commitTransaction(); return id }} />
    </>
  )
}

/* A ROW THAT USES A STYLE (Figma's): the swatch and the style's name; a press opens the picker for this row, so another
   style lands on it; detach keeps the color and drops the style. `style` null: the row's style is gone, nothing drawn */
export function StyledSlot({ layer, slot, write, hidden, actions }) {
  const { styles, palette } = useComposeState()
  const [ref, anchor] = useBeside()
  const [open, setOpen] = useState(false)
  const id = styleAt(layer, slot)
  const style = styles.colors.find((s) => s.id === id)
  if (!style) return null
  return (
    <div ref={ref}>
      <StyledPaintRow style={style} palette={palette} hidden={hidden} onOpen={() => setOpen((o) => !o)}
        onDetach={() => write(detachPatch(layer, slot))} actions={actions} />
      <StylesPopover kind="color" anchor={anchor} open={open} onClose={() => setOpen(false)} current={id}
        onApply={(st) => write(colorPatch(layer, slot, st))} />
    </div>
  )
}

/* the slot a section's Styles button works on: its top row (Figma lists the top first), else the layer's own */
export const topSlot = (layer, kind) => {
  const list = kind === 'stroke' ? 'strokes' : 'fills'
  const n = Array.isArray(layer?.[list]) ? layer[list].length : 0
  return n ? `${list}:${n - 1}` : kind
}
/* the color at a slot, for the plus to save */
export const valueAt = (layer, slot) => {
  const [list, at] = slot.split(':')
  if (at != null) { const r = layer[list]?.[Number(at)]; return r ? { color: r.color, opacity: r.opacity ?? 1 } : null }
  return slot === 'stroke' ? { color: layer.stroke, opacity: layer.strokeOpacity ?? 1 } : { color: layer.color, opacity: layer.fillOpacity ?? 1 }
}

/* THE PAGE'S STYLES LIST (Figma's, nothing selected): the file's text styles, then its color styles, each row opening
   its settings; the plus saves the page color as a color style */
export function usePageStyles(pageColor) {
  const { styles, palette, saveStyle } = useComposeState()
  const [ref, anchor] = useBeside()
  const [edit, setEdit] = useState(null)
  const group = (kind, list, title) => list.length > 0 && (
    <div className="flex flex-col" data-styles-group={kind}>
      <span className="pb-1 text-help text-muted">{title}</span>
      {list.map((s) => (
        <button key={s.id} type="button" onClick={() => setEdit({ kind, id: s.id })} data-style-row={s.name}
          className="flex h-(--kol-kolbox-ctl) min-w-0 items-center gap-2 rounded-control text-left text-help text-text outline-none hover:bg-field focus-visible:outline-solid focus-visible:outline-1 focus-visible:outline-accent">
          {kind === 'text' ? <span aria-hidden className="w-4 shrink-0 text-center" style={{ fontFamily: familyCssFor(s.value), fontWeight: s.value.weight }}>Ag</span> : swatch(s, palette)}
          <span className="min-w-0 flex-1 truncate">{s.name}</span>
        </button>
      ))}
    </div>
  )
  return {
    end: <Act icon="plus" label="Create style" onClick={() => { if (pageColor) setEdit({ kind: 'color', id: saveStyle('color', { color: pageColor, opacity: 1 }) }) }} />,
    body: (
      <div ref={ref} className="flex flex-col gap-3">
        {group('text', styles.texts, 'Text styles')}
        {group('color', styles.colors, 'Color styles')}
        <StylesPopover kind={edit?.kind ?? 'color'} anchor={anchor} open={!!edit} editId={edit?.id ?? null} onClose={() => setEdit(null)} onApply={() => {}} />
      </div>
    ),
  }
}
