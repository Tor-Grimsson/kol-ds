import { useEffect, useRef } from 'react'
import {
  ASPECTS, blendLayers, BOOL_OP_LABELS, canBlend, canMask, CASES, comboLabel, docOf, findLayerDeep,
  isBooleanable, isDirty, layerTypes, markSaved, openFiles, pack, shortcutById, STARTERS, toggleDots, toggleTimelinePinned, useBindDots,
  useColorTarget, useComposeFile, useComposeState, useEffectTarget, useGeneratorLibrary, useSavedMark, useTimelinePinned, useZoomSettled,
} from './engine.js'
import { appRows, openSearch } from '../ui/MenuMain.jsx'
import { anchorStore, openRailTab } from './Properties.jsx'
import { shapeParamsOf } from './properties/Parameters.jsx'
import { openShapeParams, vectorGroups } from '../ui/MenuVector.jsx'
import { insertImage } from './windows/InsertImage.jsx'
import { applyWorkspace, currentWorkspaceName, resetWorkspace, saveWorkspace, setLayout, toggleLeftRail, useLayout } from './windows/workspace.js'
import { askPrompt } from '../ui/ask.js'
import { askConfirm } from '../ui/ask.js'
import { toast } from '@kolkrabbi/kol-component'
import { openSaveAs, useFileVerbs } from '../files/useFileVerbs.js'

/* The real editor's menus (packages/design-editor/src/editor/shell/MenuTop.jsx): FXR, File, Edit, Layer, Text,
   Vector, Tools, View, Window, Help, the same rows in the same order and groups, the same writes, greyed where the real
   one greys. They are no longer a bar (round 3, 10.1: the bar is in _tmp/2026-11-18-menubar/): the logo's menu
   (ui/MenuMain.jsx) opens each as a child. Rows are data for kolbox's Menu: { label, shortcut, check, icon, tag,
   submenu, disabled, run }.
   Keyboard verbs go through `kol:command`, which the engine's canvas runs, so a row and its key share every guard.
   A row that opens a window calls onWindow(id) and is live only for the ids in `windows`. The rows whose targets the
   real editor keeps in parts kolbox does not mount go where his rulings put those parts (round 3, 4.1): the left rail
   tabs his rail no longer holds open as windows, the right rail tabs ask the rail for their tab, the eyedropper and
   Insert image have hosts of their own (editor/windows/), the workspace is kolbox's layout (editor/windows/workspace.js).
   No row is drawn disabled for want of a target; rows greyed here do not apply to the selection, as the real ones. */
const gen = () => pack('generators')
const fx = () => pack('effects')
const motion = () => pack('motion')
const key = (id) => { const s = shortcutById(id); return s ? comboLabel(s.combo) : undefined }
const cmd = (id) => () => window.dispatchEvent(new CustomEvent('kol:command', { detail: { id } }))
const noTimeline = () => false

/* Window › Left rail › Layers: the rail's own Layers section, open, in view, its selected row (or first) focused */
const focusLayers = () => {
  setLayout({ leftCollapsed: false })
  requestAnimationFrame(() => {
    const sec = document.querySelector('[data-rail="left"] [data-rail-section="Layers"]')
    sec?.scrollIntoView({ block: 'nearest' })
    ;(sec?.querySelector('[aria-current]') ?? sec?.querySelector('button'))?.focus({ preventScroll: true })
  })
}
/* the editor's FXR rows (the real CHROMES): Library is the library route, kolbox's Home (#/home); Randomiser is the
   Randomiser screen (round 4, W11), listed as on every other screen */
const fxrRows = (rows) => rows.map((r) => (r.label !== 'Chromes' ? r : {
  ...r,
  submenu: [r.submenu[0].map((c) => (c.label === 'Library' ? { label: 'Library', check: false, run: () => { window.location.hash = '#/home' } } : c))],
}))

const FX_PATTERN_CATEGORIES = [
  { label: 'Moiré', group: 'optic', sub: 'Moiré' },
  { label: 'Mesh Gradient', group: 'gradients', sub: 'Mesh' },
  { label: 'Reaction', group: 'optic', sub: 'Reaction' },
  { label: 'Halftone', group: 'optic', sub: 'Halftone' },
]
/* AlignmentPanel's H_OPTS / V_OPTS: value, icon, label */
const H_OPTS = [['start', 'align-horizontal-left', 'Align left'], ['center', 'align-horizontal-center', 'Align horizontal center'], ['end', 'align-horizontal-right', 'Align right'], ['distribute', 'space-evenly-horizontal', 'Distribute horizontally']]
const V_OPTS = [['start', 'align-vertical-top', 'Align top'], ['center', 'align-vertical-center', 'Align vertical center'], ['end', 'align-vertical-bottom', 'Align bottom'], ['distribute', 'space-evenly-vertical', 'Distribute vertically']]
/* the origin picker's nine points, as rows of three */
const ORIGINS = [
  [['Top left', [0, 0]], ['Top', [0.5, 0]], ['Top right', [1, 0]]],
  [['Left', [0, 0.5]], ['Center', [0.5, 0.5]], ['Right', [1, 0.5]]],
  [['Bottom left', [0, 1]], ['Bottom', [0.5, 1]], ['Bottom right', [1, 1]]],
]
const SLOTS = [['palette', 'Palettes'], ['pattern', 'Patterns'], ['type', 'Types'], ['preset', 'Presets']]
/* Layer › Insert (22.1, temporary): the engine's layer types with no other door. Shape and Text are their tools, a
   photo is a dropped image (or Tools › Insert image), Empty layer is Group selection; Pattern, Kinetic type, Generate
   and Loop are effects on a layer now (W22, the Effects menu). Misc waits on his ruling (22.5); the row goes with it */
const INSERT_TYPES = ['misc']
/* the old Layers footer's Adjustment list (LiveFilterRows.jsx ADJUSTMENTS): the colour filters that adjust a picture */
const ADJUSTMENTS = ['filter-adjustment', 'fx-brightness', 'fx-contrast', 'filter-hsl-adjustment', 'fx-hsl', 'fx-hsv', 'fx-rgb', 'fx-invert', 'fx-grayscale', 'fx-sepia', 'fx-posterize', 'fx-threshold', 'filter-color-gradient', 'filter-color-map', 'filter-color-replace']

/* a list in file order, its sub-buckets as titled groups (the real menu's eyebrows) */
const bySub = (presets, pick) => {
  const out = []
  for (const p of presets) {
    if (!out.length || (p.sub && p.sub !== out[out.length - 1].title)) out.push({ title: p.sub, rows: [] })
    out[out.length - 1].rows.push({ label: p.label, run: () => pick(p) })
  }
  return out
}

/* The ten menus, as data: [{ label, groups }]. The File menu's groups are also MenuFile's (one list). */
export function useMenus({ onWindow, windows = [] } = {}) {
  const {
    aspect, setAspect, view, setView, layers, selectedId, selectedIds, select, updateLayer, addLayer,
    flattenSelected, releaseBoolean, booleanSelected, convertShapeToPath, groupLayers, palette, alignSelected, flattenText,
    beginTransaction, commitTransaction, canUndo, canRedo, undo, redo, undoLabel, clearLayers, currentPresetId,
    loadPreset, loadPalette, insertFromLibrary, snapEnabled, toggleSnap, showGrid, toggleGrid, showRulers,
    duplicateLayer, deleteSelected,
  } = useComposeState()
  /* the dock's old paint pair (W19.2), its swap and its none, now Tools rows */
  const paint = useColorTarget({ history: 'coalesce' })
  const { library } = useGeneratorLibrary()
  const file = useComposeFile()
  const { openOutputWindow } = file
  /* the open file's verbs, one model (files/useFileVerbs.js, plan-2026-11-19 C8) */
  const verbs = useFileVerbs()
  const openPortable = async () => { const err = await verbs.openFile(); if (err) askConfirm({ title: err, action: 'OK', cancel: null }) }
  /* dev only: the file verbs, for the acceptance scripts (W22's export checks), as Properties hands them the store */
  if (import.meta.env.DEV) window.__kolboxFile = file
  const dots = useBindDots()
  const timelinePinned = useTimelinePinned()
  const zoom = useZoomSettled() /* the zoom rows' check marks read the settled zoom (W18): live, this hook re-rendered the whole screen per pinch step */
  const layout = useLayout()
  const workspaceName = currentWorkspaceName(layout, timelinePinned)
  /* the transport shows with the timeline, as the real footer's Transport tab (plan 29 § 9) */
  const timelineUp = (motion()?.useTimelineUp ?? noTimeline)()
  const filters = useEffectTarget()

  const win = (id) => (onWindow && windows.includes(id) ? { run: () => onWindow(id) } : { disabled: true })

  const sel = (selectedIds ?? []).filter((id) => id !== 'canvas').map((id) => findLayerDeep(layers, id)).filter(Boolean)
  const layer = selectedId && selectedId !== 'canvas' ? findLayerDeep(layers, selectedId) : null
  const editable = !!layer && !layer.locked
  const positioned = sel.some((l) => typeof l.x === 'number' && !l.locked)
  const textLayer = layer?.type === 'text' && !layer.locked ? layer : null

  const addGenerative = (preset, groupId) => addLayer('loop', { loopGroup: groupId, presetId: preset.id, presetLabel: preset.label, loopId: preset.loop, ...gen().presetParams(preset) })
  const generative = (groupId) => bySub(gen()?.presetsInGroup(groupId) ?? [], (p) => addGenerative(p, groupId))

  const canFlatten = (sel.length === 1 && sel[0].type === 'bool') || (sel.length >= 2 && sel.every(isBooleanable))
  const canRelease = layers.some((l) => l.id === selectedId && l.type === 'bool')
  const convertible = sel.length === 1 && sel[0].type === 'shape' && !sel[0].locked && ['rect', 'ellipse', 'triangle', 'polygon', 'star', 'line'].includes(sel[0].kind)
  const onConvert = () => (convertible ? convertShapeToPath(sel[0].id) : flattenSelected())
  const blendable = sel.length === 2 && canBlend(sel[0], sel[1])
  const shapeParams = sel.length === 1 && !sel[0].locked && shapeParamsOf(sel[0]).length > 0
  /* the real MenuTop's modal.prompt and modal.confirm, in kolbox's ModalPrompt and ModalConfirm (round 3, 3.1) */
  const onBlend = async () => {
    const raw = await askPrompt({ title: 'Blend steps', value: '5' })
    const steps = Math.max(1, Math.min(50, Math.round(Number(raw)) || 0))
    if (raw == null || !steps) return
    const ids = blendLayers(sel[0], sel[1], steps, palette).map((patch) => addLayer('path', patch))
    if (ids.length) groupLayers(ids)
  }
  const canBool = sel.filter(isBooleanable).length >= 2
  /* the right rail's controls the file does not draw (14, lost controls): the rotate fold, skew, the origin and the
     aspect lock are the Layer menu's; a selected boolean's operation and node edit are the Vector menu's */
  const xform = editable && typeof layer.x === 'number'
  const boolLayer = sel.length === 1 && layer?.type === 'bool' && !layer.locked ? layer : null
  const rotateBy = (d) => updateLayer(layer.id, { rotation: ((Math.round((layer.rotation ?? 0) + d) % 360) + 360) % 360 })
  const onSkew = async (prop, title) => {
    const raw = await askPrompt({ title, value: String(Math.round(layer[prop] ?? 0)) })
    const n = Number(raw)
    if (raw != null && Number.isFinite(n)) updateLayer(layer.id, { [prop]: Math.max(-89, Math.min(89, Math.round(n))) })
  }
  const aspectLocked = Number.isFinite(layer?.aspectLocked) && layer.aspectLocked > 0
  /* a rectangle's own corners (W19.1: the rail's four corner fields went): one number rounds all four, four set top
     left, top right, bottom right, bottom left (the engine's radii order) */
  const cornerable = editable && layer.type === 'shape' && layer.kind === 'rect'
  const onCorners = async () => {
    const now = Array.isArray(layer.radii) ? layer.radii : [layer.radius ?? 0, layer.radius ?? 0, layer.radius ?? 0, layer.radius ?? 0]
    const raw = await askPrompt({ title: 'Corner radius (top left, top right, bottom right, bottom left)', value: now.map((n) => Math.round(n)).join(', ') })
    if (raw == null) return
    const ns = raw.split(/[\s,]+/).filter(Boolean).map(Number)
    if (!ns.length || ns.some((n) => !Number.isFinite(n))) return
    const r = ns.map((n) => Math.max(0, Math.round(n)))
    if (r.length === 1 || r.every((n) => n === r[0])) updateLayer(layer.id, { radius: r[0], radii: null })
    else if (r.length === 4) updateLayer(layer.id, { radii: r })
  }
  const nodeEditable = editable && (layer.type === 'path' || (layer.type === 'shape' && ['rect', 'ellipse', 'triangle', 'polygon', 'star', 'line'].includes(layer.kind)))
  const maskSel = sel.length === 1 ? sel[0] : null
  const maskIdx = maskSel ? layers.findIndex((l) => l.id === maskSel.id) : -1
  const canUseAsMask = !!maskSel && !maskSel.isMask && maskIdx > 0 && canMask(maskSel)
  const onUseAsMask = () => { beginTransaction(); updateLayer(maskSel.id, { isMask: true }); updateLayer(layers[maskIdx - 1].id, { maskedBy: maskSel.id }); commitTransaction() }
  const onReleaseMask = () => {
    beginTransaction()
    updateLayer(maskSel.id, { isMask: false })
    layers.filter((l) => l.maskedBy === maskSel.id).forEach((l) => updateLayer(l.id, { maskedBy: null }))
    commitTransaction()
  }
  const confirmReplace = async () => layers.length === 0 || (currentPresetId && !canUndo) || askConfirm({ title: 'Discard the current canvas? Unsaved changes will be lost.' })
  const onNew = async () => { if (!(await confirmReplace())) return; try { localStorage.removeItem('kol.editor.draft') } catch { /* ignore */ } window.location.reload() }
  /* a palette also opens the colour pane in the real one; kolbox has none, the load is the write */
  const onOpenItem = async (slot, item) => {
    if (slot === 'preset' && !(await confirmReplace())) return
    if (slot === 'palette') loadPalette(item)
    else if (slot === 'preset') loadPreset(item)
    else insertFromLibrary(slot, item)
  }
  const kinetic = motion()
  const paratype = gen() ? gen().presetsInGroup('paratype') : []
  const saved = Object.keys(layout.saved)
  /* Save workspace…, the real prompt's words (MenuTop's onSaveWorkspace) */
  const onSaveWorkspace = async () => {
    const name = (await askPrompt({ title: 'Workspace name', value: workspaceName ?? '' }))?.trim()
    if (name) saveWorkspace(name, timelinePinned)
  }

  /* the old Layers footer's Mask Layer (W19.4): two selected, the upper clips the lower; one, a rectangle its size set
     as its mask */
  const pair = sel.length === 2 ? [...sel].sort((a, b) => layers.findIndex((l) => l.id === b.id) - layers.findIndex((l) => l.id === a.id)) : null
  const canMaskPair = !!pair && pair.every((l) => layers.some((x) => x.id === l.id)) && canMask(pair[0]) && !pair[1].isMask
  const canMaskOne = !!maskSel && !maskSel.isMask && !maskSel.maskedBy && maskIdx >= 0 && maskSel.w != null
  const onMaskLayer = () => {
    beginTransaction()
    if (canMaskPair) { updateLayer(pair[0].id, { isMask: true }); updateLayer(pair[1].id, { maskedBy: pair[0].id }) } else if (canMaskOne) {
      const m = addLayer('shape', { kind: 'rect', x: maskSel.x ?? 0, y: maskSel.y ?? 0, w: maskSel.w, h: maskSel.h, isMask: true, name: 'Mask' })
      if (m) updateLayer(maskSel.id, { maskedBy: m })
    }
    commitTransaction()
  }
  const adjustRows = ADJUSTMENTS.map((id) => fx()?.filterById(id)).filter((f) => f && filters.options.includes(f))
    .map((f) => ({ label: `${fx().liveFilterLabel(f)}…`, check: filters.inChain(f.id), disabled: !filters.target, run: () => filters.apply(f) }))
  const insertRows = layerTypes().filter((t) => INSERT_TYPES.includes(t.id)).map((t) => ({ label: t.label, run: () => addLayer(t.id) }))

  const liveFilters = [[{ label: 'None', run: filters.clear, disabled: filters.chain.length === 0 }], []]
  for (const g of fx()?.liveFilterGroups(filters.options) ?? []) {
    if (g.divider) { liveFilters.push([]); continue }
    liveFilters[liveFilters.length - 1].push({
      label: g.label,
      disabled: !filters.target,
      submenu: [g.filters.map((f) => ({ label: `${fx().liveFilterLabel(f)}…`, check: filters.inChain(f.id), run: () => filters.apply(f) }))],
    })
  }

  return [
    /* FXR: Home, the chromes and Settings…, the rows the logo menu ends on (ui/TopRail.jsx appRows, one list for
       every screen) */
    { label: 'FXR', groups: [fxrRows(appRows({ mode: 'editor', settings: { shortcut: key('settings-drawer'), ...win('settings') } }))] },
    { label: 'File', groups: [
      [
        { label: 'New', run: onNew },
        { label: 'Files…', shortcut: key('open-files'), run: () => openFiles() },
        { label: 'Starters', submenu: [STARTERS.map((s) => ({ label: s.name, run: async () => { if (await confirmReplace()) loadPreset(s.preset) } }))] },
      ],
      [
        { label: currentPresetId ? 'Save' : 'Save…', shortcut: key('save'), run: verbs.save },
        { label: 'Save as…', shortcut: key('save-as'), run: openSaveAs },
      ],
      [
        { label: 'Open file…', run: openPortable },
        { label: 'Export as file…', run: verbs.exportFile },
      ],
      [
        { label: 'Aspect', submenu: [ASPECTS.map((a) => ({ label: a.label, check: aspect === a.id, run: () => setAspect(a.id) }))] },
        { label: 'Clear', run: clearLayers, disabled: layers.length === 0 },
      ],
      [{ label: 'Library', submenu: [SLOTS.map(([slot, name]) => {
        const items = library[slot] ?? []
        return {
          label: name,
          tag: String(items.length),
          disabled: items.length === 0,
          submenu: [items.map((item, i) => ({
            label: item.name ?? (slot === 'type' && item.text ? item.text.slice(0, 24) : null) ?? (slot === 'preset' && item.aspect ? `${item.aspect}${Array.isArray(item.layers) ? `, ${item.layers.length}L` : ''}` : null) ?? `${name.slice(0, -1)} ${i + 1}`,
            run: () => onOpenItem(slot, item),
          }))],
        }
      })] }],
      [
        /* the one Export window (plan-2026-11-19 C8): what, format, scale, fill, name and a preview */
        { label: 'Export…', ...win('export') },
        { label: 'Batch export…', ...win('batch-export') },
        { label: 'Open output window', run: openOutputWindow },
      ],
    ] },
    { label: 'Edit', groups: [
      [
        /* a named step says what it undoes (C1: "Undo Delete Frame and its 3 layers") */
        { label: undoLabel ? `Undo ${undoLabel}` : 'Undo', shortcut: key('undo'), run: undo, disabled: !canUndo },
        { label: 'Redo', shortcut: key('redo'), run: redo, disabled: !canRedo },
      ],
      [
        { label: 'Duplicate selection', shortcut: key('duplicate'), run: cmd('duplicate'), disabled: !editable },
        { label: 'Delete selection', shortcut: key('delete-back'), run: cmd('delete-back'), disabled: !sel.some((l) => !l.locked) },
      ],
      [
        { label: 'Select all layers', shortcut: key('select-all'), run: cmd('select-all'), disabled: layers.length === 0 },
        { label: 'Deselect', shortcut: key('deselect'), run: () => select(null), disabled: (selectedIds ?? []).length === 0 },
      ],
      [
        /* the eyedropper is the canvas's `kol:command`, as the real row (windows/eyedrop.jsx answers it); Color opens the
           Color window, the real row's colour pane, greyed with nothing selected (Figma has no colour window without one) */
        { label: 'Eyedropper', shortcut: key('eyedrop'), run: cmd('eyedrop') },
        { label: 'Color', ...(sel.length ? win('color') : { disabled: true }) },
        { label: 'Color Modes', ...win('color-modes') },
      ],
    ] },
    { label: 'Layer', groups: [
      /* the old Layers footer's rows (W19.4): Insert (22.1, temporary), Duplicate, Delete */
      [
        ...(insertRows.length ? [{ label: 'Insert', submenu: [insertRows] }] : []),
        { label: 'Duplicate', run: () => sel.forEach((l) => duplicateLayer(l.id)), disabled: sel.length === 0 },
        { label: 'Delete', run: deleteSelected, disabled: sel.length === 0 },
      ],
      [
        { label: 'Group selection', shortcut: key('group'), run: cmd('group'), disabled: sel.length < 2 },
        { label: 'Ungroup', shortcut: key('ungroup'), run: cmd('ungroup'), disabled: layer?.type !== 'group' },
      ],
      [
        { label: 'Align', disabled: !positioned, submenu: [
          H_OPTS.map(([v, icon, label]) => ({ label, icon, run: () => alignSelected('h', v), disabled: v === 'distribute' && sel.length < 3 })),
          V_OPTS.map(([v, icon, label]) => ({ label, icon, run: () => alignSelected('v', v), disabled: v === 'distribute' && sel.length < 3 })),
        ] },
        { label: 'Flip horizontal', shortcut: key('flip-h'), run: cmd('flip-h'), disabled: !positioned },
        { label: 'Flip vertical', shortcut: key('flip-v'), run: cmd('flip-v'), disabled: !positioned },
      ],
      [
        { label: 'Rotate', disabled: !xform, submenu: [[
          { label: 'Rotate 90° left', run: () => rotateBy(-90) },
          { label: 'Rotate 90° right', run: () => rotateBy(90) },
          { label: 'Rotate 180°', run: () => rotateBy(180) },
        ]] },
        { label: 'Skew horizontal…', run: () => onSkew('skewX', 'Skew horizontal (°)'), disabled: !xform },
        { label: 'Skew vertical…', run: () => onSkew('skewY', 'Skew vertical (°)'), disabled: !xform },
        { label: 'Corner radius…', run: onCorners, disabled: !cornerable },
        /* the transform origin the rail's typed W, H and rotation work about (the rail's anchorStore) */
        { label: 'Transform origin', disabled: !xform, submenu: ORIGINS.map((row) => row.map(([label, v]) => (
          { label, check: anchorStore.value[0] === v[0] && anchorStore.value[1] === v[1], run: () => { anchorStore.value = v } }
        ))) },
        { label: 'Constrain proportions', check: aspectLocked, run: () => updateLayer(layer.id, { aspectLocked: aspectLocked ? null : layer.w / Math.max(1, layer.h) }), disabled: !xform || layer.w == null },
      ],
      [
        ...(fx() ? [{ label: 'Live Filters', submenu: liveFilters.filter((g) => g.length) }] : []),
        ...(adjustRows.length ? [{ label: 'Adjustment', disabled: sel.length === 0, submenu: [adjustRows] }] : []),
        { label: 'Layer Effects…', ...(editable ? win('layer-effects') : { disabled: true }) },
      ],
      [
        maskSel?.isMask ? { label: 'Release mask', run: onReleaseMask } : { label: 'Use as mask', run: onUseAsMask, disabled: !canUseAsMask },
        { label: 'Mask layer', run: onMaskLayer, disabled: !(canMaskPair || canMaskOne) },
      ],
      [
        { label: 'Toggle lock', shortcut: key('toggle-lock'), run: cmd('toggle-lock'), disabled: !layer },
        { label: 'Toggle visibility', shortcut: key('toggle-visibility'), run: cmd('toggle-visibility'), disabled: !layer },
      ],
    ] },
    { label: 'Text', groups: [
      [
        { label: 'Alignment', disabled: !textLayer, submenu: [[['left', 'text-align-left', 'Align text left'], ['center', 'text-align-center', 'Center text'], ['right', 'text-align-right', 'Align text right']].map(([v, icon, label]) => (
          { label, icon, check: (textLayer?.textAlign ?? 'center') === v, run: () => updateLayer(textLayer.id, { textAlign: v }) }
        ))] },
        { label: 'Vertical alignment', disabled: !textLayer, submenu: [[['top', 'text-valign-top', 'Align top'], ['middle', 'text-valign-middle', 'Align middle'], ['bottom', 'text-valign-bottom', 'Align bottom']].map(([v, icon, label]) => (
          { label, icon, check: (textLayer?.verticalAlign ?? 'middle') === v, run: () => updateLayer(textLayer.id, { verticalAlign: v }) }
        ))] },
      ],
      [
        { label: 'Case', disabled: !textLayer, submenu: [CASES.map((c) => ({ label: c.label, check: (textLayer?.case ?? 'original') === c.id, run: () => updateLayer(textLayer.id, { case: c.id }) }))] },
        { label: 'Italic', check: !!textLayer?.italic, run: () => updateLayer(textLayer.id, { italic: !textLayer.italic }), disabled: !textLayer },
      ],
      [{ label: 'Convert to path', run: () => flattenText(textLayer.id), disabled: !textLayer }],
    ] },
    /* MenuVector's rows (W11.2): Shape parameters… opens the selected shape's parameters beside the right rail */
    { label: 'Vector', groups: vectorGroups({
      /* a selected boolean layer: its own operation, checked, as the rail header's button set it */
      ops: Object.entries(BOOL_OP_LABELS).map(([op, label]) => (boolLayer
        ? { label, check: boolLayer.op === op, run: () => updateLayer(boolLayer.id, { op }) }
        : { label, run: () => booleanSelected(op), disabled: !canBool })),
      nodes: { shortcut: key('node-edit'), run: () => window.dispatchEvent(new CustomEvent('kol:node-edit')), disabled: !nodeEditable },
      release: { run: () => releaseBoolean(), disabled: !canRelease },
      shapeParams: { run: openShapeParams, disabled: !shapeParams },
      convert: { shortcut: key('convert-path'), run: onConvert, disabled: !canFlatten && !convertible },
      blend: { run: onBlend, disabled: !blendable },
    }) },
    { label: 'Tools', groups: [
      [
        /* the generator window (editor/generate/GeneratorWindow.jsx) opens on the engine's own event, as float's Tools rows do */
        ...[['Generate…', 'generate'], ['Repeat…', 'repeat'], ['Paratype letter…', 'type']].map(([label, win]) => (
          { label, run: () => window.dispatchEvent(new CustomEvent('kol:open-generator-window', { detail: { window: win } })) })),
        ...(gen() ? [{ label: 'Generative', submenu: [gen().GENERATIVE_TREE.map((parent) => (parent.groups.length === 1
          ? { label: parent.label, submenu: generative(parent.groups[0]) }
          : { label: parent.label, submenu: [parent.groups.map((gid) => ({ label: parent.labels?.[gid] ?? gen().groupById(gid).label, submenu: generative(gid) }))] }))] }] : []),
        ...(gen() ? [{ label: 'Pattern', submenu: [FX_PATTERN_CATEGORIES.map((c) => ({
          label: c.label,
          submenu: [gen().presetsInSub(c.group, c.sub).map((p) => ({ label: p.label, run: () => addGenerative(p, c.group) }))],
        }))] }] : []),
        { label: 'Type', submenu: [[
          { label: 'Text tool', shortcut: key('tool-text'), run: cmd('tool-text') },
          ...(kinetic ? [{ label: 'Kinetic type', submenu: kinetic.KINETIC_TREE.map((parent) => ({
            title: parent.label,
            rows: parent.subs.map((sub) => ({
              label: sub,
              submenu: [kinetic.KINETIC_PRESETS.filter((p) => p.sub === sub).map((p) => ({ label: p.label, run: () => addLayer('kinetic', { presetId: p.id, presetLabel: p.label, comp: kinetic.presetComp(p) }) }))],
            })),
          })) }] : []),
          ...(paratype.length ? [{ label: gen().MISC_TREE[0].label, submenu: bySub(paratype, (p) => addLayer('misc', gen().presetLayerPatch(p, 'paratype'))) }] : []),
        ]] },
        { label: 'Color Modes', ...win('color-modes') },
      ],
      /* Insert image: the real row's event, answered by windows/InsertImage.jsx in place of the action bar */
      [{ label: 'Insert image', run: insertImage }],
      /* the dock's old well (W19.2), here until he rules where it lives: the search cell and the paint pair (its swap,
         its none marker, its press, which opened the color on the focused paint) */
      [
        { label: 'Search…', shortcut: '⌘K', run: openSearch },
        { label: 'Swap fill and stroke', run: () => paint.swap() },
        { label: 'Set paint to none', run: () => paint.onChange(null) },
        { label: 'Fill and stroke color…', ...win('color') },
      ],
    ] },
    { label: 'View', groups: [
      [{ label: 'Zoom', submenu: [
        [
          { label: 'In', shortcut: key('zoom-in'), run: cmd('zoom-in') },
          { label: 'Out', shortcut: key('zoom-out'), run: cmd('zoom-out') },
          { label: 'To Fit', shortcut: key('zoom-fit'), run: cmd('zoom-fit') },
          { label: 'To Width', shortcut: key('zoom-width'), run: cmd('zoom-width') },
          { label: 'To Selection', shortcut: key('zoom-selection'), run: cmd('zoom-selection'), disabled: !sel.length },
        ],
        [[1, 'zoom-100'], [2, 'zoom-200'], [4, 'zoom-400'], [8, 'zoom-800']].map(([z, id]) => ({ label: `${z * 100}%`, check: Math.abs(zoom - z) < 0.005, shortcut: key(id), run: cmd(id) })),
      ] }],
      [{ label: 'Preview mode', shortcut: key('view-preview'), run: cmd('view-preview') }],
      [
        { label: 'Show / hide rulers', check: !!showRulers, shortcut: key('toggle-rulers'), run: cmd('toggle-rulers') },
        { label: 'Show/hide grid', check: !!showGrid, shortcut: key('toggle-grid'), run: toggleGrid },
        { label: 'Show / hide modulation dots', check: !!dots, shortcut: key('toggle-dots'), run: toggleDots },
      ],
      [{ label: 'Snap to objects, guides and canvas', check: !!snapEnabled, run: toggleSnap }],
      [{ label: 'Layout', submenu: [[
        { label: 'Single', check: view === 'single', run: () => setView('single') },
        { label: 'Social', check: view === 'social', run: () => setView('social') },
      ]] }],
    ] },
    /* Window (round 3, 4.1): Layers is the rail's own section; the other left rail tabs open as windows at the rail's
       edge; Transport shows the transport toolbar with the timeline, as the real footer's tab pins the timeline first;
       the right rail rows ask the rail for their tab (Parameters and Effects need a layer); Timeline is the engine's
       pin; Workspace saves kolbox's layout; Show / hide rail collapses and expands the left rail */
    { label: 'Window', groups: [
      [
        { label: 'Left rail', submenu: [
          [{ label: 'Layers', run: focusLayers }, ...[['Assets', 'assets'], ['History', 'history'], ['Navigator', 'navigator']].map(([t, id]) => ({ label: t, ...win(id) }))],
          [{ label: 'Stroke', ...win('stroke') }, { label: 'Color', ...(sel.length ? win('color') : { disabled: true }) }, { label: 'Swatches', ...win('swatches') }, { label: 'Color Modes', ...win('color-modes') }],
          [
            ...(kinetic ? [{ label: 'Transport', run: () => { if (!timelineUp) toggleTimelinePinned(); setLayout({ transport: true }) } }] : []),
            { label: 'Output', ...win('output') },
            { label: 'File', ...win('file') },
          ],
        ] },
        { label: 'Right rail', submenu: [[
          { label: 'Inspector', run: () => openRailTab('Inspector') },
          /* with nothing selected the rail answers with the real tabs' own line (round 4, items 22 and 23) */
          { label: 'Parameters', run: () => openRailTab('Parameters') },
          ...(fx() ? [{ label: 'Effects', run: () => openRailTab('Effects') }] : []),
        ]] },
        ...(kinetic ? [{ label: 'Timeline', check: !!timelinePinned, run: toggleTimelinePinned }] : []),
      ],
      [{ label: 'Workspace', submenu: [
        [{ label: 'Save workspace…', run: onSaveWorkspace }],
        ...(saved.length ? [saved.map((n) => ({ label: n, check: n === workspaceName, run: () => applyWorkspace(n, timelinePinned) }))] : []),
        [{ label: 'Reset workspace', run: () => resetWorkspace(timelinePinned) }],
      ] }],
      [
        { label: 'Show / hide rail', shortcut: key('kolbox-toggle-rail'), run: toggleLeftRail },
        { label: 'Show / hide settings', shortcut: key('settings-drawer'), ...win('settings') },
      ],
    ] },
    { label: 'Help', groups: [[{ label: 'Show / hide shortcuts', shortcut: key('show-shortcuts'), ...win('shortcuts') }]] },
  ]
}

/* The file name's own rows (round 3, 10.1): what the real editor does to the open file, never the whole File menu
   again. Rename and Duplicate are the Files window's own file rows (FilesDialog), on the open file; Save, Save as… and
   Files… are the File menu's. A document never saved has no file, so Rename and Duplicate are greyed. onRename opens
   the host's name box. */
export function useFileRows({ onRename } = {}) {
  const { currentPresetId } = useComposeState()
  /* Save, Save as, Duplicate and the portable file are one model (files/useFileVerbs.js, plan-2026-11-19 C8): a file
     lives in one folder and keeps what Save as said; a duplicate sits beside it */
  const verbs = useFileVerbs()
  const none = !currentPresetId
  const openPortable = async () => { const err = await verbs.openFile(); if (err) askConfirm({ title: err, action: 'OK', cancel: null }) }
  return [
    [
      { label: currentPresetId ? 'Save' : 'Save…', shortcut: key('save'), run: verbs.save },
      { label: 'Save as…', shortcut: key('save-as'), run: openSaveAs },
    ],
    [
      { label: 'Rename…', run: onRename, disabled: none || !onRename },
      { label: 'Duplicate', run: verbs.duplicate, disabled: none },
    ],
    [
      { label: 'Open file…', run: openPortable },
      { label: 'Export as file…', run: verbs.exportFile },
    ],
    [{ label: 'Files…', shortcut: key('open-files'), run: () => openFiles() }],
  ]
}

/* Saved or not, the real float chrome's rule (FloatEditorShell useDocStatus, DocTitle's mark): a fresh or opened
   document is the saved state, every save marks it again, an edit since reads unsaved.
   The save toast (W12): every mark this hook did not set itself is a save (the engine marks only in its save path,
   useComposeFile buildSavedSpec), so it raises "Saved" with Show in Files, which opens the Files window. */
export function useSaved() {
  const state = useComposeState()
  const doc = docOf(state)
  const mark = useSavedMark()
  const docRef = useRef(doc); docRef.current = doc
  /* the marks this hook did not raise as a save: the one in place when the screen mounted and each it set on an open.
     Compared by identity, never a consumed flag: React's development double effect ran the toast effect twice on
     mount, the flag was spent by the first run and the second raised "Saved" on every open, an empty new file
     included (R1, his capture: "Saved, Show in Files" under "Not saved") */
  const seen = useRef(mark)
  useEffect(() => {
    const id = requestAnimationFrame(() => { seen.current = docRef.current; markSaved(docRef.current) })
    return () => cancelAnimationFrame(id)
  }, [state.currentPresetId])
  useEffect(() => {
    if (!mark || mark === seen.current) return
    seen.current = mark
    toast({ message: 'Saved', action: 'Show in Files', onAction: () => openFiles() })
  }, [mark])
  return !isDirty(doc, mark)
}
