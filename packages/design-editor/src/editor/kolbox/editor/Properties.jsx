import { useEffect, useRef, useState } from 'react'
import {
  BLEND_MODES, BOOL_OP_LABELS, canMask, COVER_TYPES, effectDef, effectHost, findLayerDeep,
  flatCategories, isBooleanable, LAYER_EFFECTS, layerEffectsOf, makeEffect, MAX_FILTERS, pack,
  presetParamOf, presetPatchFor, resolvedChain, rowLabelForLayer, scalePathNodes, useComposeState, useLayerEdit,
  VECTOR_FX_SCHEMA, visibleParams, FAMILIES,
  CONTENT_LABELS, contentOf, ContentScope, editContent, familyOf, makeContent, morphRowOf, paramsForFamily, tunable, tuneRowOf,
} from './engine.js'
import { openTune } from './tune/TuneMode.jsx'
import { editContentAll } from './generate/GeneratorWindow.jsx'
import ContentScopeAll from './generate/ContentScopeAll.jsx'
import { pickMedia } from './windows/WindowMediaPicker.jsx'
import { Menu } from '@kolkrabbi/kol-component'
import { paramTab } from '../labs/engine.js'
import { FX_TABS, StageHead, StageRolls } from './properties/Effects.jsx'
import { SweepStack } from '../labs/Parts.jsx'
import CanvasProperties from './properties/Canvas.jsx'
import Typography from './properties/Typography.jsx'
import { InlineParams, MorphSettings, ParametersBody, paramTabs, shapeParamsOf, TypePanes } from './properties/Parameters.jsx'
import { Act, Dim, Field, shown, useBeside, WHY } from './properties/parts.jsx'
import { AlignmentRow, AppearanceSection, HeaderActions, LayoutSection, PaintRows, PositionSection, promoteFill, promoteStroke, StrokeLine, TailSections } from './properties/Sections.jsx'
import { canAlignStroke, canSideStroke } from '../../compose/stroke.js'
import { ColorStylesButton, StyledSlot, topSlot, valueAt } from './properties/Styles.jsx'
import RightRail from '../ui/RightRail.jsx'
import Icon from '../ui/Icon.jsx'
import MenuBoolean, { BOOLEAN_OPS } from '../ui/MenuBoolean.jsx'
import MenuBlendMode from '../ui/MenuBlendMode.jsx'
import MenuEffects, { VECTOR_EFFECTS, vectorEffectsGroup } from '../ui/MenuEffects.jsx'
import { SHAPE_PARAMS_EVENT } from '../ui/MenuVector.jsx'
import PopoverStroke from '../ui/PopoverStroke.jsx'
import PopoverEffect from '../ui/PopoverEffect.jsx'
import PopoverEffects from '../ui/PopoverEffects.jsx'
import WindowLineSwell from './lineSwell/WindowLineSwell.jsx'
import LineSwellSettings from './lineSwell/LineSwellSettings.jsx'
import { lineSwellLabel, valuesOn, SPEC as LINE_SWELL } from '../../../generate/lineSwell/index.js'
import { ButtonGroup, DividerLabel, FieldPair, LabeledControlSection, ColorInputRow, ColorPickerPopover } from '@kolkrabbi/kol-component'

/* RightRail editor (his design 149:26890, W19.1): with a layer selected, the header (its name; Use
   as mask, the boolean operation and its chevron, Edit object), then Position, Layout, Appearance, Fill, Stroke,
   Effects, Export (./properties/Sections.jsx); nothing selected or the frame, the canvas inspector (./properties/Canvas.jsx).
   Every value is the selected layer's own, read from and written to the engine's compose store; a control the file
   draws that the engine cannot do yet is drawn the same and does nothing (no-function-inspector.md). Effects are the
   engine's three systems: the Layer Effects window's ten (`layer.effects`), the filter chain's stages (`layer.filters`)
   and the seven vector effects (the layer's own `offsetOn` … `distressOn` and their params, VECTOR_FX_SCHEMA): an
   effect's settings open in PopoverEffect, never in the rail. One overlay is open at a time (`open`).
   A generative, misc, kinetic or photo layer keeps the Generate, Style and Animation tabs (a photo, Labs' Effect and
   Motion); the first holds the sections below (./properties/Parameters.jsx). Two or more layers take the
   multi-selection inspector. */

/* the ten in the plus menu and their rows: glyphs from your icons, picked by meaning (no effect glyphs exist) */
const FX_ICONS = { bevel: 'cube', outline: 'select-frame', threeD: '3d-cube', innerShadow: 'drop-hatch', innerGlow: 'sparkle', colorOverlay: 'drop', gradientOverlay: 'gen-gradient', outerGlow: 'wand-sparkles', outerShadow: 'drop-circle', gaussianBlur: 'transparency' }
/* W22: the effects that draw in the layer (layer.content), their glyphs; Generate's row names its family */
const CONTENT_ICONS = { generate: 'grid-3x3', repeat: 'copy', pattern: 'grid-3x3', kinetic: 'font-01', loop: 'keyframe', morph: 'bold', lineSwell: 'hatch' }
const contentLabel = (row) => (row.type === 'generate' ? familyOf(row.params).label : row.type === 'lineSwell' ? lineSwellLabel(row.params) : CONTENT_LABELS[row.type] ?? row.type)
/* the Effects list's group headings: a Generate row under Generate, the other drawn rows with the Layer effects */
const fxHeading = (r) => (r.kind === 'content' ? (r.type === 'generate' || r.type === 'repeat' ? 'Generate' : 'Layer Effects') : { stage: 'Shader effects', vector: 'Vector effects' }[r.kind] ?? 'Layer Effects')
/* a drawn row's settings: the old layer's Parameters, read inside its ContentScope (the scoped layer is the row) */
function ContentBody({ tabs, tab }) {
  const { layers, selectedId } = useComposeState()
  const view = findLayerDeep(layers, selectedId)
  const edit = useLayerEdit(view?.id ?? null, { history: 'coalesce' })
  if (!view) return null
  return tabs ? <ParametersBody layer={view} tab={tab} edit={edit} /> : <InlineParams layer={view} edit={edit} />
}
/* the stroke style as the real Stroke panel stores it: a dash array (and a round cap for dots) */
const DASH_FOR_STYLE = { Solid: '', Dashed: '8 6', Dotted: '2 6' }
const styleFromDash = (dash, cap) => (!dash ? 'Solid' : cap === 'round' && /^[0-2]\s+[3-9]/.test(dash) ? 'Dotted' : 'Dashed')
const word = (s) => s[0].toUpperCase() + s.slice(1)
/* W6.2: the layers that take more than one fill and stroke (layerModel paintStack), and a new row's paint: Figma's
   new shape grey for a fill, black for a stroke */
const STACKS = ['shape', 'path']
const NEW_FILL = { color: '#d9d9d9', opacity: 1 }
const NEW_STROKE = { color: '#000000', opacity: 1 }
/* the shape kinds the engine rounds (shape-math's roundCorners, SHAPE_SCHEMA's radius) */
const RADIUS_KINDS = ['rect', 'triangle', 'polygon', 'star']
/* each vector effect's settings: the schema's entries after its toggle, up to the next toggle */
const VFX_PARAMS = Object.fromEntries(VECTOR_EFFECTS.map((e) => {
  const i = VECTOR_FX_SCHEMA.findIndex((p) => p.key === e.key)
  const rest = VECTOR_FX_SCHEMA.slice(i + 1)
  const end = rest.findIndex((p) => p.type === 'toggle')
  return [e.key, (end < 0 ? rest : rest.slice(0, end)).map(({ when: _w, ...p }) => p)]
}))

/* an effect row: FillRow's look (W11.4) with the effect's glyph and name in place of the swatch and hex, then eye and
   minus; the accent line while its settings are open. A vector effect has no glyph: its place is kept. On the rail's
   grid (FieldPair kolbox, R3.1): the row over both field columns, eye and minus on the icon columns. */
function EffectRow({ rowRef, icon, label, note, on, lit, onOpen, onEye, onRemove }) {
  return (
    <div ref={rowRef} data-effect-row={label}>
      <FieldPair variant="kolbox" span trailing={(
        <>
          <Act icon={on ? 'eye-on' : 'eye-off'} label={on ? 'Hide effect' : 'Show effect'} onClick={onEye} />
          <Act icon="minus" label="Remove effect" onClick={onRemove} />
        </>
      )} first={(
      <button
        type="button"
        onClick={onOpen}
        disabled={!onOpen}
        aria-pressed={lit}
        className={`flex h-control min-w-0 flex-1 items-center gap-2 rounded-control bg-field pr-2 pl-1.5 text-left text-help outline-none focus-visible:outline-solid focus-visible:outline-1 focus-visible:-outline-offset-1 focus-visible:outline-accent ${lit ? 'outline-1 -outline-offset-1 outline-accent' : ''} ${on ? 'text-text' : 'text-muted'}`}
      >
        {icon ? <Icon name={icon} className="text-muted" /> : <span className="size-4 shrink-0" />}
        <span className="min-w-0 flex-1 truncate">{label}</span>
        {note && <span className="shrink-0 text-muted">{note}</span>}
      </button>
      )} />
    </div>
  )
}


/* Window › Right rail (round 3, 4.1): Inspector, Parameters and Effects ask the rail for that part of the selection by
   `kolbox:rail-tab`, as the real rows' `kol:open-tab` asks for a tab: the rail opens the tab that holds it (the open
   tab is this rail's own state) and brings its section into view. */
const RAIL_TAB = 'kolbox:rail-tab'
export const openRailTab = (tab) => window.dispatchEvent(new CustomEvent(RAIL_TAB, { detail: { tab } }))
const reveal = (section) => requestAnimationFrame(() => {
  const body = document.querySelector('[data-rail="right"] [data-rail-body]')
  /* 'params': a tab-less layer's Parameters block (its first section) */
  const el = section && body?.querySelector(section === 'params' ? '[data-rail-params] > *' : `[data-rail-section="${section}"]`)
  if (el) el.scrollIntoView({ block: 'start' })
  else if (body) body.scrollTop = 0
})

/* the real Parameters and Effects tabs with nothing selected (round 4, items 22 and 23): their own line, nothing else */
const NONE_HINTS = { Parameters: 'Select a layer to edit its parameters.', Effects: 'Select a layer to edit its effect.' }

export default function Properties() {
  const state = useComposeState()
  const { selectedId, selectedIds, layers } = state
  /* dev only: the store, for the acceptance script to read every write back */
  if (import.meta.env.DEV) window.__kolboxCompose = state
  /* the real InspectorRail's routing: the canvas wins, then two or more layers take the multi-selection inspector */
  const canvas = selectedIds.includes('canvas')
  const ids = selectedIds.filter((id) => id !== 'canvas')
  const layer = !canvas && ids.length === 1 && selectedId && selectedId !== 'canvas' ? findLayerDeep(layers, selectedId) : null
  const multi = !canvas && ids.length > 1
  const none = !layer && !multi
  /* nothing selected: Inspector shows the canvas from the top, Parameters and Effects their line */
  const [hint, setHint] = useState(null)
  useEffect(() => { setHint(null) }, [selectedId, ids.length])
  useEffect(() => {
    if (!none) return undefined
    const on = (e) => { setHint(canvas ? null : NONE_HINTS[e.detail?.tab] ?? null); reveal(null) }
    window.addEventListener(RAIL_TAB, on)
    return () => window.removeEventListener(RAIL_TAB, on)
  }, [none, canvas])
  if (multi) return <MultiProperties ids={ids} />
  if (none && hint) {
    return <RightRail variant="editor"><LabeledControlSection variant="kolbox"><p className="text-help text-muted" data-rail-hint>{hint}</p></LabeledControlSection></RightRail>
  }
  if (!layer) return <CanvasProperties frame={canvas} />
  /* a frame is a layer you draw (C1): its own inspector, the one the built-in frame had */
  if (layer.type === 'frame') return <CanvasProperties key={layer.id} frame={layer} />
  return <LayerProperties key={layer.id} layer={layer} />
}

/* a layer's effect rows, in the Effects list's order: the rows that draw (layer.content, and a text layer's Morph from
   before it was a row), the Layer effects, the shader stages, the vector effects */
function fxRowsOf(layer) {
  const content = contentOf(layer)
  const legacyMorph = layer.type === 'text' && layer.axisOn === true && !morphRowOf(layer)
  const vectorable = layer.type === 'shape' || layer.type === 'path'
  return [
    ...content.map((c) => ({ key: c.key, kind: 'content', type: c.type, label: contentLabel(c), icon: CONTENT_ICONS[c.type] ?? 'sparkles', on: c.enabled !== false })),
    ...(legacyMorph ? [{ key: 'morph-legacy', kind: 'content', type: 'morph', legacy: true, label: CONTENT_LABELS.morph, icon: CONTENT_ICONS.morph, on: true }] : []),
    ...layerEffectsOf(layer).map((e, i) => ({ key: e.key, kind: 'effect', label: effectDef(e.id)?.label ?? e.id, icon: FX_ICONS[e.id] ?? 'sparkles', on: e.enabled !== false, index: i })),
    ...resolvedChain(layer).map((s, i) => ({ key: s.key, kind: 'stage', label: s.def?.label ?? s.id, icon: 'sparkles', on: s.enabled !== false, index: i })),
    ...(vectorable ? VECTOR_EFFECTS.filter((e) => layer[e.key] !== undefined) : []).map((e) => ({ key: `vfx:${e.key}`, kind: 'vector', label: e.label, icon: null, on: !!layer[e.key], toggle: e.key })),
  ]
}
/* a row's eye and minus on any layer, through the store's own verbs (the caller holds the undo step) */
function rowEye(st, l, r) {
  const content = contentOf(l)
  if (r.legacy) return st.updateLayer(l.id, { axisOn: false, content: [...content, { ...makeContent('morph'), enabled: false }] })
  if (r.kind === 'content') return st.updateLayer(l.id, { content: content.map((c) => (c.key === r.key ? { ...c, enabled: c.enabled === false } : c)) })
  if (r.kind === 'vector') return st.updateLayer(l.id, { [r.toggle]: !l[r.toggle] })
  if (r.kind === 'stage') return st.toggleFilter(l.id, r.index)
  return st.updateLayer(l.id, { effects: layerEffectsOf(l).map((e) => (e.key === r.key ? { ...e, enabled: e.enabled === false } : e)) })
}
function rowRemove(st, l, r) {
  if (r.legacy) return st.updateLayer(l.id, { axisOn: false })
  if (r.kind === 'content') return st.updateLayer(l.id, { content: contentOf(l).filter((c) => c.key !== r.key) })
  if (r.kind === 'vector') return st.updateLayer(l.id, { [r.toggle]: undefined })
  if (r.kind === 'stage') return st.removeFilter(l.id, r.index)
  return st.updateLayer(l.id, { effects: layerEffectsOf(l).filter((e) => e.key !== r.key) })
}
/* the rows of several layers, one per effect: the same effect on each layer is one row. They are drawn only when every
   layer carries the same rows in the same order (`fxSigOf`); otherwise the section reads Figma's one line (15.5) */
const fxSig = (r) => `${r.kind}:${r.type ?? ''}:${r.label}`
const fxSigOf = (l) => fxRowsOf(l).map(fxSig).join('|')
/* a layer with no effect rows (the Effects plus on mixed content clears every row before it adds the new one) */
function fxCleared(l) {
  const vfx = Object.fromEntries(VECTOR_EFFECTS.filter((e) => l[e.key] !== undefined).map((e) => [e.key, undefined]))
  return { content: [], effects: [], filters: [], ...(l.axisOn === true ? { axisOn: false } : {}), ...vfx }
}
/* the keys whose value differs across the layers, read per layer by `get(layer, key)`: their field reads Mixed */
const mixedKeys = (keys, ls, get) => keys.filter((k) => ls.some((l) => JSON.stringify(get(l, k)) !== JSON.stringify(get(ls[0], k))))
function sharedFxRows(sel) {
  const sig = fxSig
  const per = sel.map((l) => ({ l, rows: fxRowsOf(l) }))
  const order = []
  for (const { rows } of per) for (const r of rows) if (!order.some((o) => o.sig === sig(r))) order.push({ sig: sig(r), r })
  return order.map(({ sig: k, r }) => {
    const hits = per.map(({ l, rows }) => ({ l, r: rows.find((x) => sig(x) === k) })).filter((h) => h.r)
    return { key: k, kind: r.kind, type: r.type, label: r.label, icon: r.icon, hits, mixed: hits.length < sel.length, on: hits.every((h) => h.r.on) }
  })
}

/* a shared row's card on several layers (W8): every row opens on the layers that have it. Generate, Repeat and Tune
   open their window or mode on them (MultiProperties' openShared); pattern, kinetic type and loop their card here */
function sharedFxSettings(r, writeAll, begin, commit, updateLayer, close, removeAll, eyeAll, tab, onTab) {
  const each = (fn) => { begin(); r.hits.forEach((h) => fn(h.l, h.r)); commit() }
  const first = r.hits[0]
  const more = [[{ label: r.on ? 'Disable effect' : 'Enable effect', value: 'toggle' }], [{ label: 'Delete effect', value: 'delete' }]]
  const onMore = (m) => { if (m.value === 'toggle') eyeAll(r); else if (m.value === 'delete') { close(); removeAll(r) } }
  if (r.kind === 'content' && r.type === 'lineSwell') {
    const row = contentOf(first.l).find((c) => c.key === first.r.key)
    const setOn = (params) => each((l, hr) => updateLayer(l.id, { content: contentOf(l).map((c) => (c.key === hr.key ? { ...c, params: { ...c.params, ...params(c) } } : c)) }))
    return {
      params: [],
      width: 'var(--spacing-pane)',
      foot: (
        <div className="-mx-4 flex flex-col">
          <LineSwellSettings key={`${row.key}-${row.params.form}`} form={row.params.form} values={row.params.values}
            layerSource={r.hits.every((h) => h.l.type === 'shape' || h.l.type === 'path')}
            onChange={(k, v) => setOn((c) => ({ values: { ...c.params.values, [k]: v } }))} onValues={(values) => setOn(() => ({ values }))} />
        </div>
      ),
      more, onMore,
    }
  }
  if (r.kind === 'content' && r.type === 'morph') {
    return { params: [], foot: <MorphSettings layer={first.l} setProp={(k, v) => each((l) => updateLayer(l.id, { [k]: v }))} />, more, onMore }
  }
  if (r.kind === 'vector') {
    const params = VFX_PARAMS[first.r.toggle]
    return { params, values: Object.fromEntries(params.map((p) => [p.key, first.l[p.key] ?? p.default])), mixed: mixedKeys(params.map((p) => p.key), r.hits, (h, k) => h.l[k] ?? params.find((p) => p.key === k)?.default ?? null), onChange: (k, v) => writeAll({ [k]: v }), more, onMore }
  }
  if (r.kind === 'effect') {
    const e = layerEffectsOf(first.l).find((x) => x.key === first.r.key)
    const def = effectDef(e?.id)
    return {
      params: def?.params ?? [],
      values: { ...Object.fromEntries((def?.params ?? []).map((p) => [p.key, p.default])), ...e?.params },
      mixed: mixedKeys((def?.params ?? []).map((p) => p.key), r.hits, (h, k) => layerEffectsOf(h.l).find((x) => x.key === h.r.key)?.params?.[k] ?? def.params.find((p) => p.key === k)?.default ?? null),
      onChange: (k, v) => each((l, hr) => updateLayer(l.id, { effects: layerEffectsOf(l).map((x) => (x.key === hr.key ? { ...x, params: { ...x.params, [k]: v } } : x)) })),
      more, onMore,
    }
  }
  if (r.kind === 'stage') {
    const s = resolvedChain(first.l)[first.r.index]
    const view = { ...first.l, ...s?.params, id: first.l.id }
    return {
      params: s?.def ? visibleParams(s.def.params, view).filter((p) => paramTab(p) !== 'anim') : [],
      values: s?.params ?? {},
      mixed: mixedKeys(Object.keys(s?.params ?? {}), r.hits, (h, k) => resolvedChain(h.l)[h.r.index]?.params?.[k] ?? null),
      onChange: (k, v) => each((l, hr) => {
        const bare = resolvedChain(l).map(({ def: _d, ...x }) => x)
        updateLayer(l.id, { filters: bare.map((x, j) => (j === hr.index ? { ...x, params: { ...x.params, [k]: v } } : x)) })
      }),
      more, onMore,
    }
  }
  if (r.kind === 'content') {
    /* pattern, kinetic type, a loop: the layer's own settings on the first row; a write lands in every row */
    const view = { ...contentOf(first.l).find((c) => c.key === first.r.key)?.params, type: r.type, id: first.l.id }
    const tabs = paramTabs(view)
    return {
      params: [], tabs: tabs ?? undefined, tab, onTab,
      foot: <ContentScopeAll hits={r.hits.map((h) => ({ hostId: h.l.id, rowKey: h.r.key }))}><ContentBody tabs={tabs} tab={tab} /></ContentScopeAll>,
      more, onMore,
    }
  }
  return null
}

/* MULTI-SELECTION: the one-layer inspector over every selected unlocked layer. The header is the count with mask, the
   boolean and more (Group selection); then Position (align, X, Y, rotation, distribute), Layout (W, H, the gap between),
   Appearance, Fill, Stroke, Effects and Export. A field whose layers disagree reads Mixed; an edit writes every selected
   layer in one undo step. */
const mixedOf = (list, get) => (list.length && list.every((l) => get(l) === get(list[0])) ? get(list[0]) : null)
/* FILL AND STROKE on several layers (15.5, read in Figma 2026-11-20): a layer with none is left out; the others' lists
   (bottom first: the own row, then `fills` / `strokes`) are compared row by row, a styled row by its style. The same
   lists draw the first layer's rows and an edit writes every layer that has them; lists that differ read Figma's one
   line, and the plus replaces every layer's list with one new row */
function paintsOf(l, slot) {
  if (slot === 'fill') return l.color == null ? [] : [{ color: l.color, opacity: l.fillOpacity ?? 1, hidden: !!l.fillHidden, style: l.fillStyle }, ...(l.fills ?? [])]
  return l.stroke && (l.strokeWidth ?? 0) > 0 ? [{ color: l.stroke, opacity: l.strokeOpacity ?? 1, hidden: !!l.strokeHidden, style: l.strokeStyle }, ...(l.strokes ?? [])] : []
}
const paintKey = (r) => JSON.stringify(r.style ? [r.style, !!r.hidden] : [r.color ?? null, r.opacity ?? 1, !!r.hidden])
const listKey = (l, slot) => paintsOf(l, slot).map(paintKey).join('|')
const sameLists = (ls, slot) => ls.every((l) => listKey(l, slot) === listKey(ls[0], slot))
const FILL_REPLACE = { color: NEW_FILL.color, fillOpacity: 1, fillHidden: false, fillStyle: undefined, fill: null, fills: [] }
const strokeReplace = (l) => ({ stroke: NEW_STROKE.color, strokeOpacity: 1, strokeHidden: false, strokeStyle: undefined, strokes: [], strokeWidth: (l.strokeWidth ?? 0) > 0 ? l.strokeWidth : 1 })
/* Figma's words where the layers' rows differ */
const MixedContent = () => <p data-mixed-content className="text-help text-muted">Click + to replace mixed content</p>
function MultiProperties({ ids }) {
  const state = useComposeState()
  const { layers, palette, groupLayers, updateLayer, alignSelected, booleanSelected, beginTransaction, commitTransaction, addFilter, addContent } = state
  const sel = ids.map((id) => findLayerDeep(layers, id)).filter((l) => l && !l.locked)
  const [op, setOp] = useState('unite')
  const [open, setOpen] = useState(null)
  const toggle = (key) => setOpen((cur) => (cur === key ? null : key))
  const closeIf = (key) => () => setOpen((cur) => (cur === key ? null : cur))
  const boolRef = useRef(null)
  const moreRef = useRef(null)
  const blendRef = useRef(null)
  const [fxPlusRef, fxPlusAnchor] = useBeside()
  const canBool = layers.filter((l) => ids.includes(l.id) && isBooleanable(l)).length >= 2
  const runOp = (next) => { setOp(next); booleanSelected(next) }
  const writeAll = (patch) => {
    beginTransaction()
    sel.forEach((l) => updateLayer(l.id, typeof patch === 'function' ? patch(l) : patch))
    commitTransaction()
  }
  const num = (get) => { const v = mixedOf(sel, (l) => Math.round(get(l) ?? 0)); return v == null ? { value: '', placeholder: 'Mixed' } : { value: v } }
  /* the mask: the top selected layer masks the selected layers under it */
  const order = sel.map((l) => ({ l, i: layers.findIndex((m) => m.id === l.id) })).filter((x) => x.i >= 0).sort((a, b) => b.i - a.i)
  const top = order[0]?.l
  const canMaskSel = order.length >= 2 && canMask(top)
  const onMask = () => {
    if (!canMaskSel) return
    beginTransaction()
    updateLayer(top.id, { isMask: true })
    order.slice(1).forEach(({ l }) => updateLayer(l.id, { maskedBy: top.id }))
    commitTransaction()
  }
  /* the gap between: along the axis the selection spreads further on, each layer after the first set that far past the one
     before it */
  const boxes = sel.filter((l) => typeof l.x === 'number' && l.w != null)
  const spreadX = boxes.length ? Math.max(...boxes.map((l) => l.x + l.w)) - Math.min(...boxes.map((l) => l.x)) : 0
  const spreadY = boxes.length ? Math.max(...boxes.map((l) => l.y + l.h)) - Math.min(...boxes.map((l) => l.y)) : 0
  const gapAxis = spreadX >= spreadY ? 'x' : 'y'
  const gapSize = gapAxis === 'x' ? 'w' : 'h'
  const gapOrder = [...boxes].sort((a, b) => a[gapAxis] - b[gapAxis])
  const gaps = gapOrder.slice(1).map((l, i) => Math.round(l[gapAxis] - (gapOrder[i][gapAxis] + gapOrder[i][gapSize])))
  const gap = gaps.length && gaps.every((g) => g === gaps[0]) ? gaps[0] : null
  const setGap = (n) => {
    beginTransaction()
    let at = gapOrder[0][gapAxis] + gapOrder[0][gapSize]
    gapOrder.slice(1).forEach((l) => { updateLayer(l.id, { [gapAxis]: Math.round(at + n) }); at += n + l[gapSize] })
    commitTransaction()
  }
  const painted = sel.filter((l) => 'color' in l)
  const filled = painted.filter((l) => paintsOf(l, 'fill').length)
  const stroked = painted.filter((l) => paintsOf(l, 'stroke').length)
  const fillTop = sameLists(filled, 'fill') ? filled[0] : null
  const strokeTop = sameLists(stroked, 'stroke') ? stroked[0] : null
  const writeTo = (ls, patch) => { beginTransaction(); ls.forEach((l) => updateLayer(l.id, typeof patch === 'function' ? patch(l) : patch)); commitTransaction() }
  const opacity = mixedOf(sel, (l) => Math.round((l.opacity ?? 1) * 100))
  const radiusLayers = sel.filter((l) => (l.type === 'shape' && RADIUS_KINDS.includes(l.kind)) || l.type === 'text')
  const radius = mixedOf(radiusLayers, (l) => (Array.isArray(l.radii) ? JSON.stringify(l.radii) : String(Math.round(l.radius ?? 0))))
  const radiusRow = radius != null && radius.startsWith('[') ? JSON.parse(radius) : null
  const blend = mixedOf(sel, (l) => l.blend ?? 'normal')
  /* the Effects rows differ: the plus replaces, every layer's rows cleared in the undo step that adds the new one;
     `fxView` is a layer as it reads after the clear */
  const fxMixed = sel.some((l) => fxSigOf(l) !== fxSigOf(sel[0]))
  const fxView = (l) => (fxMixed ? { ...l, ...fxCleared(l) } : l)
  const replaceFx = (add) => {
    if (!fxMixed) return add()
    beginTransaction()
    sel.forEach((l) => updateLayer(l.id, fxCleared(l)))
    add()
    return commitTransaction()
  }
  /* the Effects plus: the chosen effect added to every selected layer that can take it, in one undo step */
  const addFxToAll = (value) => {
    const v = String(value)
    beginTransaction()
    sel.map(fxView).forEach((l) => {
      if (v.startsWith('stage:')) { if (effectHost(l).effectable && resolvedChain(l).length < MAX_FILTERS) addFilter(l.id, v.slice(6)) }
      else if (v.startsWith('vfx:')) { if (l.type === 'shape' || l.type === 'path') updateLayer(l.id, { [v.slice(4)]: true }) }
      else {
        const fx = layerEffectsOf(l)
        if (effectDef(v)?.stack || !fx.some((e) => e.id === v)) updateLayer(l.id, { effects: [...fx, makeEffect(v)] })
      }
    })
    commitTransaction()
  }
  /* the Effects list: the rows the layers share; eye and minus act on every layer that has the row */
  const fxRows = sharedFxRows(sel)
  const eyeAll = (row) => { beginTransaction(); row.hits.forEach((h) => { if (h.r.on === row.on) rowEye(state, h.l, h.r) }); commitTransaction() }
  const removeAll = (row) => { beginTransaction(); row.hits.forEach((h) => rowRemove(state, h.l, h.r)); commitTransaction() }
  /* a shared row opens its card on the first layer's values; an edit there writes every layer that has the row, one
     undo step */
  const [fxRowRef, fxRowAnchor] = useBeside()
  const openFx = fxRows.find((r) => open === `fx:${r.key}`)
  const [fxTab, setFxTab] = useState('generate')
  const fxSettings = openFx ? sharedFxSettings(openFx, writeAll, beginTransaction, commitTransaction, updateLayer, () => setOpen(null), (r) => removeAll(r), (r) => eyeAll(r), fxTab, setFxTab) : null
  /* a shared row opens on every layer that has it: Generate and Repeat their window, Tune its mode, the rest their card */
  const openShared = (r) => {
    const rows = r.hits.map((h) => ({ l: h.l, r: contentOf(h.l).find((c) => c.key === h.r.key) }))
    if (r.kind === 'content' && (r.type === 'generate' || r.type === 'repeat')) { setOpen(null); return editContentAll(r.type, rows) }
    if (r.kind === 'content' && r.type === 'tune') { setOpen(null); return openTune(rows[0].l, rows[0].r, rows.slice(1).map((x) => x.l)) }
    setFxTab('generate')
    return toggle(`fx:${r.key}`)
  }
  /* the menu's window effects on the selection: Generate adds its row to each layer and opens its window on all of them;
     Tune opens on every layer it can tune, the first on the stage; Morph adds its row to each text layer without one; Line Swell's
     picker adds the picked form to each layer */
  const pickFx = (row) => {
    const v = String(row.value)
    if (v === 'line-swell') return setOpen('line-swell')
    setOpen(null)
    return replaceFx(() => addPicked(v))
  }
  const addPicked = (v) => {
    if (v === 'tune') { const [l, ...rest] = sel.map(fxView).filter(tunable); if (l) openTune(l, tuneRowOf(l), rest); return undefined }
    if (v === 'gen:motion') { window.dispatchEvent(new CustomEvent('kol:open-motion-window')); return undefined }
    if (v.startsWith('gen:')) {
      const fam = v.slice(4)
      const type = fam === 'repeat' ? 'repeat' : 'generate'
      beginTransaction()
      const made = sel.map((l) => ({ l, r: fam === 'repeat' ? addContent(l.id, 'repeat', { sourceId: l.id }) : addContent(l.id, 'generate', paramsForFamily(fam)) }))
      commitTransaction()
      const first = made.find((m) => m.r)
      if (first) editContentAll(type, made.filter((m) => m.r))
      return undefined
    }
    if (v.startsWith('content:')) { beginTransaction(); sel.forEach((l) => addContent(l.id, v.slice(8))); commitTransaction(); return undefined }
    if (v === 'morph') {
      beginTransaction()
      sel.map(fxView).filter((l) => l.type === 'text' && !morphRowOf(l) && l.axisOn !== true).forEach((l) => updateLayer(l.id, { axisOn: false, content: [...contentOf(l), { ...makeContent('morph'), enabled: true }] }))
      commitTransaction()
      return undefined
    }
    return addFxToAll(v)
  }
  return (
    <RightRail
      variant="editor"
      title={`${ids.length} selected`}
      actions={(
        <span className="flex items-center gap-2">
          <Act icon="blend" label="Use as mask" onClick={onMask} disabled={!canMaskSel} />
          <span ref={boolRef} className="inline-flex items-center gap-1">
            <Act icon={BOOLEAN_OPS.find((o) => o.value === op).icon} label={BOOL_OP_LABELS[op]} onClick={() => (canBool ? runOp(op) : toggle('bool'))} />
            <Act icon="chevron-down" label="Boolean operations" lit={open === 'bool'} onClick={() => toggle('bool')} />
          </span>
          <span ref={moreRef} className="inline-flex"><Act icon="more" label="More" lit={open === 'more'} onClick={() => toggle('more')} /></span>
        </span>
      )}
    >
      <LabeledControlSection variant="kolbox" label="Position">
        <AlignmentRow onAlign={alignSelected} />
        <FieldPair variant="kolbox"
          first={<Field lead="X" aria-label="X position" {...num((l) => l.x)} onCommit={(n) => writeAll({ x: Math.round(n) })} />}
          second={<Field lead="Y" aria-label="Y position" {...num((l) => l.y)} onCommit={(n) => writeAll({ y: Math.round(n) })} />}
        />
        <FieldPair variant="kolbox"
          first={<Field icon="rotate-left" aria-label="Rotation" {...num((l) => l.rotation)} onCommit={(n) => writeAll({ rotation: ((Math.round(n) % 360) + 360) % 360 })} />}
          second={(() => {
            const group = <ButtonGroup layout="joined" variant="kolbox" className="w-full" options={[
              { icon: 'space-evenly-horizontal', ariaLabel: 'Distribute horizontal spacing', onPress: () => alignSelected('h', 'distribute') },
              { icon: 'space-evenly-vertical', ariaLabel: 'Distribute vertical spacing', onPress: () => alignSelected('v', 'distribute') },
            ]}/>
            /* distributing needs three: the ends stay, the middle moves (Figma greys it with two) */
            return sel.length >= 3 ? group : <Dim reason="Needs three or more layers">{group}</Dim>
          })()}
        />
      </LabeledControlSection>
      <LabeledControlSection variant="kolbox" label="Layout">
        <FieldPair variant="kolbox"
          first={<Field lead="W" aria-label="Width" {...num((l) => l.w)} onCommit={(n) => writeAll({ w: Math.max(8, Math.round(n)) })} />}
          second={<Field lead="H" aria-label="Height" {...num((l) => l.h)} onCommit={(n) => writeAll({ h: Math.max(8, Math.round(n)) })} />}
        />
        {gapOrder.length >= 2 && (
          <FieldPair variant="kolbox"
            first={<Field icon={gapAxis === 'x' ? 'space-evenly-horizontal' : 'space-evenly-vertical'} aria-label="Gap between" {...(gap == null ? { value: '', placeholder: 'Mixed' } : { value: gap })} onCommit={(n) => setGap(Math.round(n))} />}
            second={null}
          />
        )}
      </LabeledControlSection>
      <AppearanceSection
        visible={sel.every((l) => l.visible !== false)} onVisible={() => { const hide = sel.every((l) => l.visible !== false); writeAll({ visible: !hide }) }}
        blendRef={blendRef} blendLit={open === 'blend'} onBlend={() => toggle('blend')}
        opacity={opacity} onOpacity={(n) => writeAll({ opacity: n / 100 })}
        radius={radiusRow ? radiusRow[0] : radius == null ? null : Number(radius)} radii={radiusRow}
        onRadius={(n) => writeAll((l) => (Array.isArray(l.radii) ? { radii: [n, n, n, n] } : { radius: n }))}
        onRadii={(i, n) => writeAll((l) => { const r0 = Math.round(l.radius ?? 0); const next = Array.isArray(l.radii) ? [...l.radii] : [r0, r0, r0, r0]; next[i] = n; return { radii: next } })}
      />
      {painted.length > 0 && (
        <LabeledControlSection variant="kolbox" label="Fill" end={(
          <>
            {fillTop && <ColorStylesButton layers={filled} slot={topSlot(fillTop, 'fill')} value={valueAt(fillTop, topSlot(fillTop, 'fill'))} write={(l, patch) => updateLayer(l.id, patch)} />}
            <Act icon="plus" label="Add fill" onClick={() => writeTo(painted, !filled.length || fillTop ? (l) => (l.color == null ? { fill: null, color: 'palette:primary' } : STACKS.includes(l.type) ? { fills: [...(l.fills ?? []), NEW_FILL] } : {}) : FILL_REPLACE)} />
          </>
        )}>
          {filled.length > 0 && !fillTop && <MixedContent />}
          {fillTop && <PaintRows kind="Fill" rows={fillTop.fills} palette={palette} onRows={(fills) => writeTo(filled, { fills })} layer={fillTop} />}
          {fillTop && (() => {
            const acts = (
              <>
                <Act icon={fillTop.fillHidden ? 'eye-off' : 'eye-on'} label={fillTop.fillHidden ? 'Show fill' : 'Hide fill'} onClick={() => writeTo(filled, { fillHidden: !fillTop.fillHidden })} />
                <Act icon="minus" label="Remove fill" onClick={() => writeTo(filled, promoteFill)} />
              </>
            )
            return fillTop.fillStyle
              ? <StyledSlot layer={fillTop} slot="fill" hidden={!!fillTop.fillHidden} write={(patch) => writeTo(filled, patch)} actions={acts} />
              : <ColorInputRow variant="kolbox" picker={ColorPickerPopover} label="Fill"
                  value={shown(fillTop.color, palette) ?? fillTop.color} resolved={shown(fillTop.color, palette)}
                  onChange={(v) => writeTo(filled, { color: v })}
                  opacity={(fillTop.fillOpacity ?? 1) * 100} onOpacity={(n) => writeTo(filled, { fillOpacity: n / 100 })}
                  actions={acts} />
          })()}
        </LabeledControlSection>
      )}
      {painted.length > 0 && (
        <LabeledControlSection variant="kolbox" label="Stroke" end={(
          <>
            {strokeTop && <ColorStylesButton layers={stroked} slot={topSlot(strokeTop, 'stroke')} value={valueAt(strokeTop, topSlot(strokeTop, 'stroke'))} write={(l, patch) => updateLayer(l.id, patch)} />}
            <Act icon="plus" label="Add stroke" onClick={() => writeTo(painted, !stroked.length || strokeTop ? (l) => (!paintsOf(l, 'stroke').length ? { stroke: l.stroke ?? 'palette:dark', strokeWidth: 1 } : STACKS.includes(l.type) ? { strokes: [...(l.strokes ?? []), NEW_STROKE] } : {}) : strokeReplace)} />
          </>
        )}>
          {stroked.length > 0 && !strokeTop && <MixedContent />}
          {strokeTop && <PaintRows kind="Stroke" rows={strokeTop.strokes} palette={palette} onRows={(strokes) => writeTo(stroked, { strokes })} layer={strokeTop} />}
          {strokeTop && (() => {
            const acts = (
              <>
                <Act icon={strokeTop.strokeHidden ? 'eye-off' : 'eye-on'} label={strokeTop.strokeHidden ? 'Show stroke' : 'Hide stroke'} onClick={() => writeTo(stroked, { strokeHidden: !strokeTop.strokeHidden })} />
                <Act icon="minus" label="Remove stroke" onClick={() => writeTo(stroked, promoteStroke)} />
              </>
            )
            return strokeTop.strokeStyle
              ? <StyledSlot layer={strokeTop} slot="stroke" hidden={!!strokeTop.strokeHidden} write={(patch) => writeTo(stroked, patch)} actions={acts} />
              : <ColorInputRow variant="kolbox" picker={ColorPickerPopover} label="Stroke"
                  value={shown(strokeTop.stroke, palette) ?? strokeTop.stroke} resolved={shown(strokeTop.stroke, palette)}
                  onChange={(v) => writeTo(stroked, { stroke: v })}
                  opacity={(strokeTop.strokeOpacity ?? 1) * 100} onOpacity={(n) => writeTo(stroked, { strokeOpacity: n / 100 })}
                  actions={acts} />
          })()}
          {strokeTop && (
            /* the weight and position: a value the layers do not share reads Mixed */
            <StrokeLine layer={{ ...strokeTop, strokeWidth: mixedOf(stroked, (l) => l.strokeWidth), strokeAlign: mixedOf(stroked, (l) => l.strokeAlign ?? 'inside') ?? strokeTop.strokeAlign, strokeSides: undefined }}
              canAlign={stroked.every(canAlignStroke)} canSides={false} onPatch={(patch) => writeTo(stroked, patch)} />
          )}
        </LabeledControlSection>
      )}
      <LabeledControlSection variant="kolbox" label="Effects" end={<span ref={fxPlusRef} className="inline-flex"><Act icon="plus" label="Add effect" lit={open === 'effects-menu'} onClick={() => toggle('effects-menu')} /></span>}>
        {fxMixed && <MixedContent />}
        {!fxMixed && fxRows.length > 0 && (
          <div className="flex flex-col gap-2">
            {fxRows.map((r, i) => (
              <div key={r.key} className="contents">
                {fxHeading(r) !== (i ? fxHeading(fxRows[i - 1]) : null) && <DividerLabel>{fxHeading(r)}</DividerLabel>}
                <EffectRow rowRef={openFx?.key === r.key ? fxRowRef : undefined} icon={r.icon} label={r.label} on={r.on} lit={open === `fx:${r.key}`}
                  onOpen={() => openShared(r)}
                  onEye={() => eyeAll(r)} onRemove={() => { if (open === `fx:${r.key}`) setOpen(null); removeAll(r) }} />
              </div>
            ))}
          </div>
        )}
      </LabeledControlSection>
      <TailSections />
      <MenuEffects anchor={fxPlusRef} open={open === 'effects-menu'} onClose={closeIf('effects-menu')} groups={multiFxGroups(sel)} onSelect={pickFx} />
      {open === 'line-swell' && (
        <WindowLineSwell anchor={fxPlusAnchor} onClose={() => setOpen(null)} onPick={(t) => {
          replaceFx(() => {
            beginTransaction()
            sel.map(fxView).forEach((l) => updateLayer(l.id, { content: [...contentOf(l), makeContent('lineSwell', { form: t.form, values: valuesOn(l, t.form, t.values) })] }))
            commitTransaction()
          })
          setOpen(null)
        }} />
      )}
      {openFx && fxSettings && (
        <PopoverEffect key={openFx.key} anchor={fxRowAnchor} open onClose={closeIf(`fx:${openFx.key}`)} name={openFx.label} icon={openFx.icon ?? 'sliders-rows'} {...fxSettings} />
      )}
      <MenuBoolean anchor={boolRef} open={open === 'bool'} onClose={closeIf('bool')} value={op} onChange={runOp} disabled={!canBool} />
      <MenuBlendMode anchor={blendRef} open={open === 'blend'} onClose={closeIf('blend')} modes={BLEND_MODES} value={blend ?? ''} onChange={(v) => writeAll({ blend: v })} />
      <Menu variant="kolbox" aria-label="More" anchor={moreRef} open={open === 'more'} onClose={closeIf('more')}
        groups={[[{ label: 'Group selection', value: 'group', shortcut: '⌘G' }]]}
        onSelect={(row) => { setOpen(null); if (row.value === 'group') groupLayers(ids) }} />
    </RightRail>
  )
}

/* the Effects menu for two or more layers: the one-layer menu's rows (the shader effects but the engine loops), each
   added to every layer that can take it */
function multiFxGroups(sel) {
  const vectorable = sel.some((l) => l.type === 'shape' || l.type === 'path')
  const seen = new Set()
  const stages = flatCategories((pack('effects')?.FILTERS ?? []).filter((f) => f.kind !== 'engine'))
    .map((c) => ({ title: c.label, rows: c.filters.filter((f) => !seen.has(f.id) && seen.add(f.id)).map((f) => ({ label: f.label, value: `stage:${f.id}` })) }))
    .filter((g) => g.rows.length)
  return [[
    { label: 'Layer effects', icon: 'drop-circle', submenu: [
      LAYER_EFFECTS.map((d) => ({ label: d.label, value: d.id, icon: FX_ICONS[d.id] })),
      ['pattern', 'kinetic', 'loop'].map((t) => ({ label: CONTENT_LABELS[t], value: `content:${t}`, icon: CONTENT_ICONS[t] })),
    ] },
    { label: 'Shader effects', icon: 'sparkles', disabled: !sel.some((l) => effectHost(l).effectable), submenu: stages },
    { label: 'Vector effects', icon: 'pen', disabled: !vectorable, submenu: [vectorEffectsGroup(VECTOR_EFFECTS.map((e) => ({ label: e.label, icon: e.icon, value: `vfx:${e.key}` }))).rows.map(({ inset, ...r }) => r)] },
    { label: 'Generate', icon: 'grid-3x3', submenu: [[
      ...FAMILIES.map((f) => ({ label: f.label, value: `gen:${f.id}` })),
      { label: 'Repeat', value: 'gen:repeat' },
      { label: 'Motion', value: 'gen:motion' },
    ]] },
    { label: 'Tune', icon: 'bezier', value: 'tune', disabled: !sel.some(tunable) },
    { label: 'Morph', icon: CONTENT_ICONS.morph, value: 'morph', disabled: !sel.some((l) => l.type === 'text' && !morphRowOf(l) && l.axisOn !== true) },
    { label: 'Line Swell', icon: CONTENT_ICONS.lineSwell, value: 'line-swell' },
  ]]
}

/* the transform origin the typed W, H and rotation work about (the real anchorStore: panel state, top left by default,
   kept across selections) */
export const anchorStore = { value: [0, 0] }
const clampSkew = (n) => Math.max(-89, Math.min(89, Math.round(n)))
/* rotating about the anchor: the layer still turns about its centre, so the centre moves to hold the anchor still (the
   real rotateAboutAnchor) */
function rotateAboutAnchor(layer, next, [ax, ay]) {
  const prev = layer.rotation ?? 0
  const d = ((next - prev) * Math.PI) / 180
  if (!d || layer.w == null) return {}
  const cx = layer.x + layer.w / 2, cy = layer.y + layer.h / 2, r = (prev * Math.PI) / 180
  const lx = (ax - 0.5) * layer.w, ly = (ay - 0.5) * layer.h
  const ox = cx + lx * Math.cos(r) - ly * Math.sin(r), oy = cy + lx * Math.sin(r) + ly * Math.cos(r)
  const vx = cx - ox, vy = cy - oy
  return { x: Math.round(ox + vx * Math.cos(d) - vy * Math.sin(d) - layer.w / 2), y: Math.round(oy + vx * Math.sin(d) + vy * Math.cos(d) - layer.h / 2) }
}

function LayerProperties({ layer }) {
  const state = useComposeState()
  const { layers, palette, updateLayer, toggleLayer, flipLayer, alignSelected, beginTransaction, commitTransaction } = state
  const edit = useLayerEdit(layer.locked ? null : layer.id, { history: 'coalesce' })
  const set = edit.setProp
  const [open, setOpen] = useState(null)
  const toggle = (key) => setOpen((cur) => (cur === key ? null : key))
  const close = () => setOpen(null)
  /* the Generate, Style, Animation tabs (Effect, Motion for a photo); the first holds the inspector */
  const tabs = paramTabs(layer)
  /* the transform origin: the file draws no origin picker, so it is the Layer menu's Transform origin (14), read at
     each write; top left by default (the real anchorStore's) */
  /* the real useBoxSize: W and H at least 8, a path's nodes scaled with its box, the anchor held still */
  const isPath = layer.type === 'path' && Array.isArray(layer.nodes)
  const boxPatch = (p) => {
    const sx = p.w != null ? p.w / Math.max(1, layer.w) : 1, sy = p.h != null ? p.h / Math.max(1, layer.h) : 1
    const scaled = isPath ? { ...p, nodes: scalePathNodes(layer.nodes, sx, sy), ...(layer.holes?.length ? { holes: layer.holes.map((r) => scalePathNodes(r, sx, sy)) } : {}) } : p
    edit.patch({
      ...scaled,
      ...(p.w != null ? { x: Math.round(layer.x - (p.w - layer.w) * anchorStore.value[0]) } : {}),
      ...(p.h != null ? { y: Math.round(layer.y - (p.h - layer.h) * anchorStore.value[1]) } : {}),
    })
  }
  const aspect = Number.isFinite(layer.aspectLocked) && layer.aspectLocked > 0 ? layer.aspectLocked : null
  const [tab, setTab] = useState(tabs?.[0].value ?? null)
  const first = !tabs || tab === tabs[0].value
  /* Inspector: the first tab from the top; Parameters: the Style tab where the layer has one (the real Parameters tab's
     content, where the rail's own pointer row goes), else its Parameters section; Effects: the Effects section */
  useEffect(() => {
    const on = (e) => {
      const t = e.detail?.tab
      setOpen(null)
      if (t === 'Parameters' && tabs?.some((x) => x.value === 'style')) { setTab('style'); reveal(null); return }
      setTab(tabs?.[0].value ?? null)
      reveal(t === 'Inspector' ? null : t === 'Parameters' && !tabs ? 'params' : t)
    }
    window.addEventListener(RAIL_TAB, on)
    return () => window.removeEventListener(RAIL_TAB, on)
  }, [tabs])
  /* an overlay closes only itself: a row that opens the next overlay (Shader effects…) is not undone by its menu's close */
  const closeIf = (key) => () => setOpen((cur) => (cur === key ? null : cur))

  const blendRef = useRef(null)
  /* a quarter turn, kept in 0 to 359; the button turns right, as Figma's "Rotate 90° right" (2026-11-20) */
  const rotateBy = (delta) => set('rotation', (((Math.round((layer.rotation ?? 0) + delta)) % 360) + 360) % 360)
  const [fxPlusRef, fxPlusAnchor] = useBeside()
  const [fillRef, fillAnchor] = useBeside()
  const [strokeRef, strokeAnchor] = useBeside()
  const [strokeSetRef, strokeSetAnchor] = useBeside()
  const [fxRowRef, fxRowAnchor] = useBeside()
  const [headRef, headAnchor] = useBeside()
  /* the Vector menu's Shape parameters… opens the shape's parameters beside the rail (W11.2) */
  const shapeParams = shapeParamsOf(layer)
  useEffect(() => {
    const on = () => { if (shapeParams.length) setOpen('shape-params') }
    window.addEventListener(SHAPE_PARAMS_EVENT, on)
    return () => window.removeEventListener(SHAPE_PARAMS_EVENT, on)
  }, [shapeParams.length])

  const positioned = !COVER_TYPES.includes(layer.type) && typeof layer.x === 'number'
  /* Appearance's corner radius (W11: Geometry's went, "geometry corner radius is the same as appearance corner"): the
     shapes the engine rounds and text */
  const hasRadius = (layer.type === 'shape' && RADIUS_KINDS.includes(layer.kind)) || layer.type === 'text'
  const radii = Array.isArray(layer.radii)
  const hasPaint = 'color' in layer
  /* W22: an image fill on a shape or a path (the old photo layer's picture) */
  const imageFill = (layer.type === 'shape' || layer.type === 'path') && (layer.fill?.type === 'image' || layer.fill?.type === 'video') ? layer.fill : null
  const pickImage = () => pickMedia({ layerId: layer.id, fill: true })
  const fillPlusRef = useRef(null)
  const hasStroke = !!layer.stroke && (layer.strokeWidth ?? 0) > 0

  /* header (design 149:26890): the mask is the engine's verb; the boolean's chevron sets a boolean layer's operation (as
     the Vector menu does); Edit object is the keymap's node edit, on a path or a shape that converts */
  const boolRef = useRef(null)
  const boolLayer = layer.type === 'bool' && !layer.locked ? layer : null
  const nodeEditable = !layer.locked && (layer.type === 'path' || (layer.type === 'shape' && ['rect', 'ellipse', 'triangle', 'polygon', 'star', 'line'].includes(layer.kind)))
  const idx = layers.findIndex((l) => l.id === layer.id)
  const canUseAsMask = !layer.isMask && idx > 0 && canMask(layer)
  const onMask = () => {
    beginTransaction()
    if (layer.isMask) {
      updateLayer(layer.id, { isMask: false })
      layers.filter((l) => l.maskedBy === layer.id).forEach((l) => updateLayer(l.id, { maskedBy: null }))
    } else if (canUseAsMask) {
      updateLayer(layer.id, { isMask: true })
      updateLayer(layers[idx - 1].id, { maskedBy: layer.id })
    }
    commitTransaction()
  }

  /* effects: the Layer Effects window's ten are written to `layer.effects` as the window writes them; the shader
     effects are the filter chain's stages (the real Effects tab), added, moved, swapped, shown and removed by the engine's
     own verbs. Round 4, 2.3: an effect's row opens its card (PopoverEffect) beside the rail, which carries everything
     the real effect card has: its preset, its Effect and Animation params, the rolls with Reset to defaults, the sweep
     rig; its chevron swaps the effect (the real slot's dropdown); its more menu holds Move up, Move down, Disable or
     Enable, Reset to defaults and Delete (the real slot's buttons). */
  const { addFilter, removeFilter, toggleFilter, moveFilter, replaceFilter, addContent } = state
  const effects = layerEffectsOf(layer)
  /* R4.2: Morph is a row (layerModel MORPH); a text layer from before it (axisOn true, no row) shows its row as well,
     and its first eye or minus writes it the way a row does */
  const legacyMorph = layer.type === 'text' && layer.axisOn === true && !morphRowOf(layer)
  const hasMorph = !!morphRowOf(layer) || legacyMorph
  const writeFx = (next) => edit.patch({ effects: next })
  const chain = resolvedChain(layer)
  const { effectable, engineHost, engineLoop } = effectHost(layer)
  const hasEngine = chain.some((s) => s.def?.kind === 'engine')
  /* the real optionsFor: one engine stage at most, last; a slot may swap to an engine only if it is that stage */
  const stageGroups = (i) => {
    const engineOk = engineHost && (i == null ? !hasEngine : chain[i]?.def?.kind === 'engine' || (!hasEngine && i === chain.length - 1))
    const seen = new Set()
    return flatCategories((pack('effects')?.FILTERS ?? []).filter((f) => f.kind !== 'engine' || engineOk))
      .map((c) => ({ title: c.label, items: c.filters.filter((f) => !seen.has(f.id) && seen.add(f.id)).map((f) => ({ value: f.id, label: f.label })) }))
      .filter((g) => g.items.length)
  }
  const pickerGroups = stageGroups(null)
  const full = chain.length >= MAX_FILTERS
  /* the real tab's words where no stage can be added: the host cannot take one, or the chain is full */
  const fxReason = !effectable ? (engineLoop ? "Engine loops can't host effects yet." : "This layer can't host an effect.") : full ? `Chain is full (${MAX_FILTERS} effects)` : null
  /* the vector effects (W11.2: "Vector effects should load as effects"): an outline's, so a shape's or a path's. Added
     is its toggle set (true or false); the eye flips it; removing clears it, so the layer is as it was before */
  const vectorable = layer.type === 'shape' || layer.type === 'path'
  /* W23.0b: the Effects menu is four groups, each a submenu, so the menu stays on the screen: Layer effects, Shader
     effects (the filter chain's stages by category), Vector effects (a shape's or a path's), and Generate, whose rows are
     the generator families; a family opens its own window (23.0) on the style it last showed */
  const vectorRows = vectorEffectsGroup(VECTOR_EFFECTS.map((e) => ({ label: e.label, icon: e.icon, value: `vfx:${e.key}`, disabled: layer[e.key] !== undefined }))).rows.map(({ inset, ...r }) => r)
  const menuGroups = [[
    { label: 'Layer effects', icon: 'drop-circle', submenu: [
      LAYER_EFFECTS.map((d) => ({ label: d.label, value: d.id, icon: FX_ICONS[d.id], disabled: !d.stack && effects.some((e) => e.id === d.id) })),
      /* W22: the old layer types that are effects now (decided for review: here, beside the ten, since Generate lists
         the families and nothing else, 23.0b) */
      ['pattern', 'kinetic', 'loop'].map((t) => ({ label: CONTENT_LABELS[t], value: `content:${t}`, icon: CONTENT_ICONS[t] })),
    ] },
    { label: 'Shader effects', icon: 'sparkles', disabled: !!fxReason, submenu: pickerGroups.map((g) => ({ title: g.title, rows: g.items.map((it) => ({ label: it.label, value: `stage:${it.value}` })) })) },
    { label: 'Vector effects', icon: 'pen', disabled: !vectorable, submenu: [vectorRows] },
    { label: 'Generate', icon: 'grid-3x3', submenu: [[
      ...FAMILIES.map((f) => ({ label: f.label, value: `gen:${f.id}` })),
      { label: 'Repeat', value: 'gen:repeat' },
      { label: 'Motion', value: 'gen:motion' },
    ]] },
    /* C6.2: the tune mode on this shape, its own row beside Generate (on the layer's Tune row when it has one) */
    { label: 'Tune', icon: 'bezier', value: 'tune', disabled: !tunable(layer) },
    /* R4.2: Morph, a text layer's weight axis morph, one per layer */
    { label: 'Morph', icon: CONTENT_ICONS.morph, value: 'morph', disabled: layer.type !== 'text' || hasMorph },
    /* R8.1: Line Swell, one row: its picture picker */
    { label: 'Line Swell', icon: CONTENT_ICONS.lineSwell, value: 'line-swell' },
  ]]
  /* a stage just added opens its card, as the real tab opens a new stage */
  const [fxTab, setFxTab] = useState('effect')
  const added = useRef(false)
  const onPick = (id) => { added.current = true; addFilter(layer.id, id); close() }
  const lastKey = chain[chain.length - 1]?.key
  useEffect(() => { if (added.current && lastKey != null) { added.current = false; setFxTab('effect'); setOpen(`fx:${lastKey}`); reveal('Effects') } }, [lastKey])
  /* W22: pattern, kinetic type, generate and motion are rows too (layer.content), first, as they draw first */
  const content = contentOf(layer)
  const writeContent = (next) => edit.patch({ content: next })
  const fxRows = fxRowsOf(layer)
  const fxEye = (r) => (r.legacy ? edit.patch({ axisOn: false, content: [...content, { ...makeContent('morph'), enabled: false }] }) : r.kind === 'content' ? writeContent(content.map((c) => (c.key === r.key ? { ...c, enabled: c.enabled === false } : c))) : r.kind === 'vector' ? set(r.toggle, !layer[r.toggle]) : r.kind === 'stage' ? toggleFilter(layer.id, r.index) : writeFx(effects.map((e) => (e.key === r.key ? { ...e, enabled: e.enabled === false } : e))))
  const fxRemove = (r) => (r.legacy ? set('axisOn', false) : r.kind === 'content' ? writeContent(content.filter((c) => c.key !== r.key)) : r.kind === 'vector' ? set(r.toggle, undefined) : r.kind === 'stage' ? removeFilter(layer.id, r.index) : writeFx(effects.filter((e) => e.key !== r.key)))
  const openFx = fxRows.find((r) => open === `fx:${r.key}`)

  /* a Generate row's settings are its family's window (23.0), on the row; the other rows open their card */
  const openRow = (r) => {
    if (r.kind === 'content' && r.type === 'tune') { close(); return openTune(layer, content.find((c) => c.key === r.key)) }
    if (r.kind === 'content' && (r.type === 'generate' || r.type === 'repeat')) { const row = content.find((c) => c.key === r.key); editContent(r.type, layer, row, 'rail'); return close() }
    setFxTab(r.kind === 'content' ? 'generate' : 'effect')
    toggle(`fx:${r.key}`)
  }
  /* the open effect's card */
  let fxSettings = null
  if (openFx?.type === 'morph') {
    /* Morph's card: the text layer's own axis settings (Parameters.jsx MorphSettings), eye and minus on the row */
    fxSettings = {
      params: [],
      foot: <MorphSettings layer={layer} setProp={set} />,
      more: [[{ label: openFx.on ? 'Disable effect' : 'Enable effect', value: 'toggle' }], [{ label: 'Delete effect', value: 'delete' }]],
      onMore: (row) => {
        if (row.value === 'toggle') fxEye(openFx)
        else if (row.value === 'delete') { close(); fxRemove(openFx) }
      },
    }
  } else if (openFx?.type === 'lineSwell') {
    /* Line Swell's settings float beside the rail as every effect's do: the name switches the form (the picker's tiles),
       more holds Disable and Delete, the rows are the form's own controls */
    const row = content.find((c) => c.key === openFx.key)
    const setParams = (params) => writeContent(content.map((c) => (c.key === row.key ? { ...c, params: { ...c.params, ...params } } : c)))
    fxSettings = {
      params: [],
      types: LINE_SWELL.tiles.map((g) => ({ title: g.group, rows: g.items.map((t) => ({ label: t.label, value: t.id, check: t.form === row.params.form && t.label === openFx.label })) })),
      onType: (pick) => {
        const t = LINE_SWELL.tiles.flatMap((g) => g.items).find((x) => x.id === pick.value)
        if (t) setParams({ form: t.form, values: valuesOn(layer, t.form, t.values) })
      },
      width: 'var(--spacing-pane)',
      foot: (
        <div className="-mx-4 flex flex-col">
          <LineSwellSettings key={`${row.key}-${row.params.form}`} form={row.params.form} values={row.params.values}
            layerSource={layer.type === 'shape' || layer.type === 'path'}
            onChange={(k, v) => setParams({ values: { ...row.params.values, [k]: v } })} onValues={(values) => setParams({ values })} />
        </div>
      ),
      more: [[{ label: openFx.on ? 'Disable effect' : 'Enable effect', value: 'toggle' }], [{ label: 'Delete effect', value: 'delete' }]],
      onMore: (m) => {
        if (m.value === 'toggle') fxEye(openFx)
        else if (m.value === 'delete') { close(); fxRemove(openFx) }
      },
    }
  } else if (openFx?.kind === 'content') {
    /* the old layer's own settings, as its Parameters were (properties/Parameters.jsx), on the row's params: the
       scope makes the layer read as the row and lands every write in it */
    const view = { ...content.find((c) => c.key === openFx.key)?.params, type: openFx.type, id: layer.id }
    const tabs = paramTabs(view)
    fxSettings = {
      params: [],
      tabs: tabs ?? undefined,
      tab: fxTab,
      onTab: setFxTab,
      /* the body under the tab track (the card draws `head` above its tabs, `foot` below them) */
      foot: (
        <ContentScope hostId={layer.id} rowKey={openFx.key}>
          <ContentBody tabs={tabs} tab={fxTab} />
        </ContentScope>
      ),
      more: [[{ label: openFx.on ? 'Disable effect' : 'Enable effect', value: 'toggle' }], [{ label: 'Delete effect', value: 'delete' }]],
      onMore: (row) => {
        if (row.value === 'toggle') fxEye(openFx)
        else if (row.value === 'delete') { close(); fxRemove(openFx) }
      },
    }
  } else if (openFx?.kind === 'vector') {
    const params = VFX_PARAMS[openFx.toggle]
    fxSettings = {
      params,
      values: Object.fromEntries(params.map((p) => [p.key, layer[p.key] ?? p.default])),
      onChange: (k, v) => set(k, v),
      types: [VECTOR_EFFECTS.map((e) => ({ label: e.label, value: e.key, check: e.key === openFx.toggle, highlighted: e.key === openFx.toggle, disabled: e.key !== openFx.toggle && layer[e.key] !== undefined }))],
      onType: (row) => { if (row.value !== openFx.toggle) { close(); edit.patch({ [openFx.toggle]: undefined, [row.value]: true }) } },
      more: [[
        { label: openFx.on ? 'Disable effect' : 'Enable effect', value: 'toggle' },
        { label: 'Reset to defaults', value: 'reset' },
      ], [{ label: 'Delete effect', value: 'delete' }]],
      onMore: (row) => {
        if (row.value === 'toggle') fxEye(openFx)
        else if (row.value === 'reset') edit.patch(Object.fromEntries(params.map((p) => [p.key, undefined])))
        else if (row.value === 'delete') { close(); fxRemove(openFx) }
      },
    }
  } else if (openFx?.kind === 'effect') {
    const e = effects[openFx.index], def = effectDef(e.id)
    const i = openFx.index
    const move = (to) => { const next = [...effects]; const [m] = next.splice(i, 1); next.splice(to, 0, m); writeFx(next) }
    fxSettings = {
      params: def?.params ?? [],
      values: { ...Object.fromEntries((def?.params ?? []).map((p) => [p.key, p.default])), ...e.params },
      onChange: (k, v) => writeFx(effects.map((x) => (x.key === e.key ? { ...x, params: { ...x.params, [k]: v } } : x))),
      types: [LAYER_EFFECTS.map((d) => ({ label: d.label, value: d.id, icon: FX_ICONS[d.id], check: d.id === e.id, highlighted: d.id === e.id, disabled: d.id !== e.id && !d.stack && effects.some((x) => x.id === d.id) }))],
      onType: (row) => { if (row.value !== e.id) writeFx(effects.map((x) => (x.key === e.key ? { ...makeEffect(row.value), key: x.key, enabled: x.enabled } : x))) },
      more: [[
        { label: 'Move up', value: 'up', disabled: i === 0 },
        { label: 'Move down', value: 'down', disabled: i === effects.length - 1 },
        { label: e.enabled === false ? 'Enable effect' : 'Disable effect', value: 'toggle' },
        { label: 'Reset to defaults', value: 'reset' },
      ], [{ label: 'Delete effect', value: 'delete' }]],
      onMore: (row) => {
        if (row.value === 'up') move(i - 1)
        else if (row.value === 'down') move(i + 1)
        else if (row.value === 'toggle') fxEye(openFx)
        else if (row.value === 'reset') writeFx(effects.map((x) => (x.key === e.key ? { ...x, params: {} } : x)))
        else if (row.value === 'delete') { close(); fxRemove(openFx) }
      },
    }
  } else if (openFx?.kind === 'stage') {
    const i = openFx.index, s = chain[i], def = s.def
    const bare = chain.map(({ def: _d, ...x }) => x)
    const view = { ...layer, ...s.params, id: layer.id }
    const patchStage = (patch) => edit.patch({ filters: bare.map((x, j) => (j === i ? { ...x, params: { ...x.params, ...patch } } : x)) })
    const presetKey = def ? presetParamOf(def.id) : null
    const presetParam = presetKey ? def.params.find((p) => p.key === presetKey) : null
    const canUp = i > 0 && def?.kind !== 'engine'
    const canDown = i < chain.length - 1 && def?.kind !== 'engine' && chain[i + 1]?.def?.kind !== 'engine'
    const tabParams = def ? visibleParams(def.params, view).filter((p) => (fxTab === 'anim' ? paramTab(p) === 'anim' : paramTab(p) !== 'anim' && p !== presetParam)) : []
    fxSettings = {
      params: tabParams,
      values: s.params,
      onChange: (k, v) => (k === 'cameraDrag' ? set(k, v) : patchStage({ [k]: v })),
      head: def && <StageHead layer={layer} stage={s} presetParam={presetParam} onPreset={(v) => patchStage(presetPatchFor(def, v))} onCameraDrag={(v) => set('cameraDrag', v)} />,
      tabs: def ? FX_TABS : undefined,
      tab: fxTab,
      onTab: setFxTab,
      foot: def && (
        <>
          <StageRolls def={def} view={view} tab={fxTab} onPatch={patchStage} />
          {fxTab === 'anim' && def.sweeps && <div className="-mx-4 flex flex-col"><SweepStack sweeps={Array.isArray(s.params.sweeps) ? s.params.sweeps : []} onChange={(sweeps) => patchStage({ sweeps })} /></div>}
        </>
      ),
      types: stageGroups(i).map((g) => ({ title: g.title, rows: g.items.map((it) => ({ ...it, check: it.value === s.id, highlighted: it.value === s.id })) })),
      onType: (row) => { if (row.value !== s.id) replaceFilter(layer.id, i, row.value) },
      more: [[
        { label: 'Move up', value: 'up', disabled: !canUp },
        { label: 'Move down', value: 'down', disabled: !canDown },
        { label: s.enabled === false ? 'Enable effect' : 'Disable effect', value: 'toggle' },
        ...(def ? [{ label: 'Reset to defaults', value: 'reset' }] : []),
      ], [{ label: 'Delete effect', value: 'delete' }]],
      onMore: (row) => {
        if (row.value === 'up') moveFilter(layer.id, i, i - 1)
        else if (row.value === 'down') moveFilter(layer.id, i, i + 1)
        else if (row.value === 'toggle') toggleFilter(layer.id, i)
        else if (row.value === 'reset') patchStage(Object.fromEntries(def.params.filter((p) => p.default !== undefined).map((p) => [p.key, p.default])))
        else if (row.value === 'delete') { close(); removeFilter(layer.id, i) }
      },
    }
  }

  /* stroke settings: style and join are the engine's fields */
  const cap = layer.strokeLinecap ?? 'butt'
  const onStroke = ({ style, join }) => {
    if (style) edit.patch({ strokeDasharray: DASH_FOR_STYLE[style], strokeLinecap: style === 'Dotted' ? 'round' : cap === 'round' ? 'butt' : cap })
    if (join) set('strokeLinejoin', join.toLowerCase())
  }

  /* corner radius: one value, or each corner from Appearance's corners button */
  const r0 = Math.round(layer.radius ?? 0)

  return (
    <RightRail
      variant="editor"
      title={rowLabelForLayer(layer)}
      actions={<span ref={headRef} className="flex items-center gap-2"><HeaderActions
        mask={!!layer.isMask} onMask={layer.isMask || canUseAsMask ? onMask : undefined}
        maskReason={layer.locked ? WHY.locked : undefined}
        boolRef={boolRef} boolLit={open === 'bool'} onBool={() => toggle('bool')} onBoolMenu={() => toggle('bool')}
        onNodes={nodeEditable ? () => window.dispatchEvent(new CustomEvent('kol:node-edit')) : undefined}
        nodesReason={layer.locked ? WHY.locked : undefined}
      /></span>}
      tabs={tabs}
      tab={tab}
      onTab={(t) => { close(); setTab(t) }}
    >
      {!first && <ParametersBody layer={layer} tab={tab} edit={edit} />}
      {first && (<>
      {positioned && (
        <PositionSection
          x={layer.x} y={layer.y} rotation={layer.rotation ?? 0}
          onX={(n) => set('x', n)} onY={(n) => set('y', n)}
          onRotation={(n) => { const next = ((Math.round(n) % 360) + 360) % 360; edit.patch({ rotation: next, ...rotateAboutAnchor(layer, next, anchorStore.value) }) }}
          onAlign={alignSelected}
          onRotate={() => rotateBy(90)}
          onFlip={(axis) => flipLayer(layer.id, axis)} flipX={!!layer.flipX} flipY={!!layer.flipY}
        />
      )}

      {positioned && (
        <LayoutSection
          w={layer.w} h={layer.h}
          locked={!!aspect} onLock={layer.w == null ? undefined : () => set('aspectLocked', aspect ? null : layer.w / Math.max(1, layer.h))}
          onW={(n) => { const w = Math.max(8, Math.round(n)); boxPatch(aspect ? { w, h: Math.max(8, Math.round(w / aspect)) } : { w }) }}
          onH={(n) => { const h = Math.max(8, Math.round(n)); boxPatch(aspect ? { w: Math.max(8, Math.round(h * aspect)), h } : { h }) }}
        />
      )}
      {/* text: the real Transform pane's resizing row (fixed keeps the box; the auto modes measure the text) */}
      {positioned && layer.type === 'text' && (
        <LabeledControlSection variant="kolbox">
          <FieldPair variant="kolbox"
            first={<ButtonGroup layout="joined" variant="kolbox" className="w-full" options={[['fixed', 'resize-fixed', 'Fixed size'], ['auto-w', 'resize-auto-w', 'Auto width'], ['auto-h', 'resize-auto-h', 'Auto height']]
              .map(([v, icon, label]) => ({ icon, ariaLabel: label, pressed: (layer.resizing ?? 'fixed') === v, onPress: () => set('resizing', v) }))}/>}
            second={null}
          />
        </LabeledControlSection>
      )}

      {layer.type === 'text' && <Typography layer={layer} edit={edit} />}

      <AppearanceSection
        visible={layer.visible !== false} onVisible={() => toggleLayer(layer.id)}
        blendRef={blendRef} blendLit={open === 'blend'} onBlend={() => toggle('blend')}
        opacity={(layer.opacity ?? 1) * 100} onOpacity={(n) => set('opacity', n / 100)}
        radius={radii ? layer.radii[0] ?? 0 : r0} onRadius={hasRadius ? (n) => (radii ? set('radii', [n, n, n, n]) : set('radius', n)) : undefined}
        radii={radii ? layer.radii : null}
        onRadii={hasRadius ? (i, n) => { const next = radii ? [...layer.radii] : [r0, r0, r0, r0]; next[i] = n; set('radii', next) } : undefined}
      />

      {hasPaint && (
        <LabeledControlSection variant="kolbox"
          label="Fill"
          end={(
            <>
              {(layer.color != null || layer.fills?.length > 0) && !imageFill && <ColorStylesButton layers={[layer]} slot={topSlot(layer, 'fill')} value={valueAt(layer, topSlot(layer, 'fill'))} write={(_, patch) => edit.patch(patch)} />}
              <span ref={fillPlusRef} className="inline-flex"><Act icon="plus" label="Add fill" lit={open === 'fill-menu'} onClick={() => toggle('fill-menu')} /></span>
            </>
          )}
        >
          {/* W22: photo is a fill. An image fill is the layer's fill (its solid is kept, not drawn, until the image goes):
              the row shows the picture, a press on it swaps it from Media, the eye hides it, the minus removes it */}
          {imageFill && (
            <FieldPair variant="kolbox" span data-fill-row="image" trailing={(
              <>
                <Act icon={layer.fill.hidden ? 'eye-off' : 'eye-on'} label={layer.fill.hidden ? 'Show fill' : 'Hide fill'} onClick={() => set('fill', { ...layer.fill, hidden: !layer.fill.hidden })} />
                <Act icon="minus" label="Remove fill" onClick={() => set('fill', null)} />
              </>
            )} first={(
              <button type="button" onClick={pickImage} aria-label="Swap image"
                className="flex h-control min-w-0 flex-1 items-center gap-2 rounded-control bg-field pr-2 pl-1.5 text-left text-help text-text outline-none focus-visible:outline-solid focus-visible:outline-1 focus-visible:-outline-offset-1 focus-visible:outline-accent">
                <span aria-hidden className="size-4 shrink-0 rounded-sm bg-cover bg-center" style={layer.fill.src && layer.fill.srcType !== 'video' ? { backgroundImage: `url("${layer.fill.src}")` } : undefined} />
                <span className="min-w-0 flex-1 truncate">{layer.fill.srcType === 'video' ? 'Video' : 'Image'}</span>
              </button>
            )} />
          )}
          {STACKS.includes(layer.type) && <PaintRows kind="Fill" rows={layer.fills} palette={palette} onRows={(fills) => set('fills', fills)} layer={layer} />}
          {/* W7: the own fill with a style shows the style */}
          {!imageFill && layer.color != null && layer.fillStyle && (
            <StyledSlot layer={layer} slot="fill" hidden={!!layer.fillHidden} write={edit.patch} actions={(
              <>
                <Act icon={layer.fillHidden ? 'eye-off' : 'eye-on'} label={layer.fillHidden ? 'Show fill' : 'Hide fill'} onClick={() => set('fillHidden', !layer.fillHidden)} />
                <Act icon="minus" label="Remove fill" onClick={() => edit.patch(promoteFill(layer))} />
              </>
            )} />
          )}
          {!imageFill && layer.color != null && !layer.fillStyle && (
            <div ref={fillRef}>
              <ColorInputRow variant="kolbox" picker={ColorPickerPopover}
                label="Fill"
                value={shown(layer.color, palette) ?? layer.color}
                resolved={shown(layer.color, palette)}
                onChange={(v) => set('color', v)}
                onSwatch={() => toggle('color-fill')}
                lit={open === 'color-fill'}
                opacity={(layer.fillOpacity ?? 1) * 100}
                onOpacity={(n) => set('fillOpacity', n / 100)}
                actions={(
                  <>
                    <Act icon={layer.fillHidden ? 'eye-off' : 'eye-on'} label={layer.fillHidden ? 'Show fill' : 'Hide fill'} onClick={() => set('fillHidden', !layer.fillHidden)} />
                    <Act icon="minus" label="Remove fill" onClick={() => edit.patch(promoteFill(layer))} />
                  </>
                )}
              />
            </div>
          )}
        </LabeledControlSection>
      )}

      {hasPaint && (
        <LabeledControlSection variant="kolbox" label="Stroke" end={<>{hasStroke && <ColorStylesButton layers={[layer]} slot={topSlot(layer, 'stroke')} value={valueAt(layer, topSlot(layer, 'stroke'))} write={(_, patch) => edit.patch(patch)} />}{(!hasStroke || STACKS.includes(layer.type)) && <Act icon="plus" label="Add stroke" onClick={() => edit.patch(hasStroke ? { strokes: [...(layer.strokes ?? []), NEW_STROKE] } : { stroke: layer.stroke ?? 'palette:dark', strokeWidth: 1 })} />}</>}>
          {hasStroke && STACKS.includes(layer.type) && <PaintRows kind="Stroke" rows={layer.strokes} palette={palette} onRows={(strokes) => set('strokes', strokes)} layer={layer} />}
          {hasStroke && layer.strokeStyle && (
            <StyledSlot layer={layer} slot="stroke" hidden={!!layer.strokeHidden} write={edit.patch} actions={(
              <>
                <Act icon={layer.strokeHidden ? 'eye-off' : 'eye-on'} label={layer.strokeHidden ? 'Show stroke' : 'Hide stroke'} onClick={() => set('strokeHidden', !layer.strokeHidden)} />
                <Act icon="minus" label="Remove stroke" onClick={() => edit.patch(promoteStroke(layer))} />
              </>
            )} />
          )}
          {hasStroke && !layer.strokeStyle && (
            <div ref={strokeRef}>
              <ColorInputRow variant="kolbox" picker={ColorPickerPopover}
                label="Stroke"
                value={shown(layer.stroke, palette) ?? layer.stroke}
                resolved={shown(layer.stroke, palette)}
                onChange={(v) => set('stroke', v)}
                onSwatch={() => toggle('color-stroke')}
                lit={open === 'color-stroke'}
                opacity={(layer.strokeOpacity ?? 1) * 100}
                onOpacity={(n) => set('strokeOpacity', n / 100)}
                actions={(
                  <>
                    <Act icon={layer.strokeHidden ? 'eye-off' : 'eye-on'} label={layer.strokeHidden ? 'Show stroke' : 'Hide stroke'} onClick={() => set('strokeHidden', !layer.strokeHidden)} />
                    <Act icon="minus" label="Remove stroke" onClick={() => edit.patch(promoteStroke(layer))} />
                  </>
                )}
              />
            </div>
          )}
          {hasStroke && (
            /* W6.1: position on a rectangle and an ellipse, sides on a rectangle; other shapes draw their stroke one way */
            <StrokeLine lineRef={strokeSetRef} layer={layer} canAlign={canAlignStroke(layer)} canSides={canSideStroke(layer)} onPatch={edit.patch}
              settings={<Act icon="sliders-rows" label="Stroke settings" lit={open === 'stroke'} onClick={() => toggle('stroke')} />} />
          )}
        </LabeledControlSection>
      )}

      {/* the type's own panes (Image, Path, Group), then its Generate parameters (none for a shape or a path) */}
      <TypePanes layer={layer} edit={edit} onParams={() => { close(); if (tabs) setTab('style'); else reveal('params') }} />
      {tabs ? <ParametersBody layer={layer} tab={tab} edit={edit} /> : <InlineParams layer={layer} edit={edit} />}

      <LabeledControlSection variant="kolbox"
        label="Effects"
        end={<span ref={fxPlusRef} className="inline-flex"><Act icon="plus" label="Add effect" lit={open === 'effects-menu'} onClick={() => toggle('effects-menu')} /></span>}
      >
        {fxRows.length > 0 && (
          <div className="flex flex-col gap-2">
            {fxRows.map((r, i) => (
              <div key={r.key} className="contents">
                {fxHeading(r) !== (i ? fxHeading(fxRows[i - 1]) : null) && <DividerLabel>{fxHeading(r)}</DividerLabel>}
                <EffectRow
                  rowRef={openFx?.key === r.key ? fxRowRef : undefined}
                  icon={r.icon}
                  label={r.label}
                  on={r.on}
                  lit={open === `fx:${r.key}`}
                  onOpen={() => openRow(r)}
                  onEye={() => fxEye(r)}
                  onRemove={() => { if (open === `fx:${r.key}`) close(); fxRemove(r) }}
                />
              </div>
            ))}
          </div>
        )}
      </LabeledControlSection>

      <TailSections />
      </>)}

      <MenuBoolean anchor={boolRef} open={open === 'bool'} onClose={closeIf('bool')} value={boolLayer?.op ?? 'unite'} onChange={(op) => boolLayer && updateLayer(boolLayer.id, { op })} disabled={!boolLayer} />
      <Menu variant="kolbox" aria-label="Add fill" anchor={fillPlusRef} open={open === 'fill-menu'} onClose={closeIf('fill-menu')}
        groups={[[{ label: 'Solid', value: 'solid', icon: 'paint-solid' }, { label: 'Image', value: 'image', icon: 'image' }]]}
        onSelect={(row) => { close(); if (row.value === 'image') pickImage(); else if (imageFill || layer.color == null) edit.patch({ fill: null, ...(layer.color == null ? { color: 'palette:primary' } : {}) }); else if (STACKS.includes(layer.type)) set('fills', [...(layer.fills ?? []), NEW_FILL]) }} />
      <MenuBlendMode anchor={blendRef} open={open === 'blend'} onClose={closeIf('blend')} modes={BLEND_MODES} value={layer.blend ?? 'normal'} onChange={(v) => set('blend', v)} />
      <MenuEffects anchor={fxPlusRef} open={open === 'effects-menu'} onClose={closeIf('effects-menu')} groups={menuGroups} onSelect={(row) => {
        if (row.value === 'stages') return setOpen('effects-picker')
        if (row.value === 'tune') { close(); return openTune(layer, tuneRowOf(layer)) }
        if (row.value === 'line-swell') return setOpen('line-swell')
        /* R4.2: Morph adds its row (on) and opens its card; the layer's own axisOn stays off, the row is the switch */
        if (row.value === 'morph') {
          if (hasMorph) return close()
          const r = { ...makeContent('morph'), enabled: true }
          edit.patch({ axisOn: false, content: [...content, r] }); setFxTab('effect'); setOpen(`fx:${r.key}`); reveal('Effects')
          return
        }
        if (String(row.value).startsWith('stage:')) return onPick(row.value.slice(6))
        if (String(row.value).startsWith('gen:')) {
          const fam = row.value.slice(4)
          if (fam === 'motion') { window.dispatchEvent(new CustomEvent('kol:open-motion-window')); return close() }
          /* W22 / 23.0b: a family adds a Generate row to the layer and opens its window on that row */
          const r = fam === 'repeat' ? addContent(layer.id, 'repeat', { sourceId: layer.id }) : addContent(layer.id, 'generate', paramsForFamily(fam))
          if (r) editContent(fam === 'repeat' ? 'repeat' : 'generate', layer, r, 'rail')
          return close()
        }
        if (String(row.value).startsWith('content:')) {
          const r = addContent(layer.id, row.value.slice(8))
          if (r) { setFxTab('generate'); setOpen(`fx:${r.key}`) }
          return
        }
        /* a vector effect is added on, with its card open, as a stage is */
        if (String(row.value).startsWith('vfx:')) { const k = row.value.slice(4); set(k, true); setFxTab('effect'); setOpen(`fx:vfx:${k}`); return }
        writeFx([...effects, makeEffect(row.value)])
      }} />
      {open === 'line-swell' && (
        <WindowLineSwell anchor={fxPlusAnchor} onClose={close} onPick={(t) => {
          const r = makeContent('lineSwell', { form: t.form, values: valuesOn(layer, t.form, t.values) })
          writeContent([...content, r]); setOpen(`fx:${r.key}`); reveal('Effects')
        }} />
      )}
      <PopoverEffects anchor={fxPlusAnchor} open={open === 'effects-picker'} onClose={closeIf('effects-picker')} groups={pickerGroups} onChange={onPick} />
      {openFx && fxSettings && (
        <PopoverEffect
          key={openFx.key}
          anchor={fxRowAnchor}
          open
          onClose={closeIf(`fx:${openFx.key}`)}
          name={openFx.label}
          icon={openFx.icon ?? 'sliders-rows'}
          {...fxSettings}
        />
      )}
      {open === 'shape-params' && shapeParams.length > 0 && (
        <PopoverEffect
          anchor={headAnchor}
          open
          onClose={closeIf('shape-params')}
          name="Shape parameters"
          icon="sliders-rows"
          params={shapeParams.map(({ when: _w, ...p }) => p)}
          values={Object.fromEntries(shapeParams.map((p) => [p.key, layer[p.key] ?? p.default]))}
          onChange={(k, v) => set(k, v)}
        />
      )}
      <ColorPickerPopover variant="kolbox"
        anchor={open === 'color-stroke' ? strokeAnchor : fillAnchor}
        open={open === 'color-fill' || open === 'color-stroke'}
        onClose={() => setOpen((cur) => (cur === 'color-fill' || cur === 'color-stroke' ? null : cur))}
        color={shown(open === 'color-stroke' ? layer.stroke : layer.color, palette) ?? undefined}
        opacity={Math.round(((open === 'color-stroke' ? layer.strokeOpacity : layer.fillOpacity) ?? 1) * 100)}
        onChange={({ value, opacity }) => edit.patch(open === 'color-stroke'
          ? { stroke: value.toLowerCase(), strokeOpacity: opacity / 100 }
          : { color: value.toLowerCase(), fillOpacity: opacity / 100 })}
      />
      <PopoverStroke
        anchor={strokeSetAnchor}
        open={open === 'stroke'}
        onClose={closeIf('stroke')}
        value={{ style: styleFromDash(layer.strokeDasharray, cap), join: word(layer.strokeLinejoin ?? 'miter') }}
        onChange={onStroke}
      />
    </RightRail>
  )
}
