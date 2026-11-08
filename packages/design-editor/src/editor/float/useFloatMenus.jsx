import { useModal } from '@kolkrabbi/kol-component'
import { openColorModes } from '../color/ColorModesWindow'
import { ASPECTS } from '../shell/aspects'
import { useComposeState, COVER_TYPES } from '../compose/state'
import { useGeneratorLibrary } from '../library/LibraryProvider'
import { STARTERS } from '../library/starters'
import { useComposeFile } from '../compose/useComposeFile'
import { openFiles } from '../library/filesDialogStore'
import { goMode, navigateTo } from '../mode'
import { findLayerDeep } from '../compose/helpers'
import { isBooleanable } from '../compose/boolean-ops'
import { BOOL_OP_LABELS } from '../compose/labels'
import { comboLabel, shortcutById } from '../state/keymap'
import { pack } from '../packs'
import { blendLayers, canBlend } from '../compose/blend'
import { canMask } from '../compose/masks'
import { H_OPTS, V_OPTS } from '../compose/AlignmentPanel'
import { CASES } from '../modes/type/cuts'
import { toggleDots, useBindDots } from '../params/dotVisibility'
import { toggleTimelinePinned, useTimelinePinned } from '../params/timelinePinned'
import { useEffectTarget } from '../shell/LiveFilterRows'
import { useZoom } from '../shell/zoomStore'
import { applyWorkspace, currentWorkspaceName, resetWorkspace, saveWorkspace, useWorkspace } from '../state/workspace'

/**
 * useFloatMenus — the float editor's menu bar AS DATA (plan-2026-11-05-float-editor W2.2): every command of today's
 * MenuTop, in the shape kol-shell's `MenuBar` takes (`{ label, onClick, kbd, disabled, checked, items, divider }`), over
 * the same compose state and the same verbs — a keyboard verb runs through `kol:command` (CanvasArea's keymap switch), so
 * a row and its key share every guard, and a key label comes from the keymap, never typed here. Section 5's bar: FXR ·
 * File, Edit, Layer, Text, Vector, Tools, View · Help; MenuTop's Window menu has no bar slot in his frame — its rows open
 * cards, so they live in View › Cards and View › Workspace. What MenuTop reached only by a key (nudge, opacity digits, the
 * fps chip) gets a row too, so every command has a home (`scripts/check-float-commands.mjs`).
 *
 * Returns `{ app, menus, end }` for `<MenuBar>`; `toMoreRows` folds the same data into the document capsule's ▾ on a phone.
 *
 * @param {Object}   cards     `{ open(tab), toggleTimeline? }` — the card stack's opener (View › Cards)
 * @param {Function} toggleRail  `\` — show / hide the float chrome
 * @param {Object}   tools     `{ place, setPlace }` — View › Tools: Rail or Dock (plan 7.7)
 */
const gen = () => pack('generators')
const fx = () => pack('effects')
const motion = () => pack('motion')

const key = (id) => { const s = shortcutById(id); return s ? comboLabel(s.combo) : undefined }
const cmd = (id) => () => window.dispatchEvent(new CustomEvent('kol:command', { detail: { id } }))
const openColorPane = (tab = 'Colour') => window.dispatchEvent(new CustomEvent('kol:open-color-pane', { detail: { tab } }))
const settings = () => window.dispatchEvent(new CustomEvent('kol:open-settings'))
const DIV = { divider: true }

const SLOT_META = { palette: 'Palettes', pattern: 'Patterns', type: 'Types', preset: 'Presets' }
const SLOT_KEYS = ['palette', 'pattern', 'type', 'preset']
const CHROMES = [
  { label: 'Library', go: () => navigateTo('/library') },
  { label: 'Editor', current: true },
  { label: 'Labs', go: () => goMode('labs') },
  { label: 'Randomiser', go: () => goMode('randomiser') },
  { label: 'Morph', go: () => navigateTo('/morph') },
]
const FX_PATTERN_CATEGORIES = [
  { label: 'Moiré', group: 'optic', sub: 'Moiré' },
  { label: 'Mesh Gradient', group: 'gradients', sub: 'Mesh' },
  { label: 'Reaction', group: 'optic', sub: 'Reaction' },
  { label: 'Halftone', group: 'optic', sub: 'Halftone' },
]
const NUDGES = [['nudge-left', 'Nudge ← 1px'], ['nudge-right', 'Nudge → 1px'], ['nudge-up', 'Nudge ↑ 1px'], ['nudge-down', 'Nudge ↓ 1px']]
const NUDGES_10 = [['nudge-left-10', 'Nudge ← 10px'], ['nudge-right-10', 'Nudge → 10px'], ['nudge-up-10', 'Nudge ↑ 10px'], ['nudge-down-10', 'Nudge ↓ 10px']]
const LEFT_TABS = ['Layers', 'Assets', 'History', 'Navigator']
const COLOR_TABS = [['Stroke', 'Stroke'], ['Colour', 'Color'], ['Swatches', 'Swatches']]

export function useFloatMenus({ cards, toggleRail, tools } = {}) {
  const s = useComposeState()
  const {
    aspect, setAspect, view, setView,
    layers, selectedId, selectedIds, select, updateLayer, addLayer,
    releaseBoolean, booleanSelected, convertShapeToPath, flattenSelected, groupLayers, palette,
    alignSelected, flattenText, beginTransaction, commitTransaction,
    canUndo, canRedo, undo, redo, clearLayers, currentPresetId,
    loadPreset, loadPalette, insertFromLibrary, snapEnabled, toggleSnap, showGrid, toggleGrid, showRulers,
  } = s
  const { library } = useGeneratorLibrary()
  const modal = useModal()
  const dots = useBindDots()
  const timelinePinned = useTimelinePinned()
  const zoom = useZoom()
  const workspace = useWorkspace()
  const workspaceName = currentWorkspaceName(workspace)
  const fxTarget = useEffectTarget()
  const { onSave, onExportSvg, onExportPng, openOutputWindow } = useComposeFile()

  const sel = (selectedIds ?? []).filter((id) => id !== 'canvas').map((id) => findLayerDeep(layers, id)).filter(Boolean)
  const layer = selectedId && selectedId !== 'canvas' ? findLayerDeep(layers, selectedId) : null
  const editable = !!layer && !layer.locked
  const positioned = sel.some((l) => typeof l.x === 'number' && !l.locked)
  const textLayer = layer?.type === 'text' && !layer.locked ? layer : null
  const canXform = !!layer && !COVER_TYPES.includes(layer.type) && !layer.locked
  const rotateBy = (delta) => updateLayer(layer.id, { rotation: ((Math.round((layer.rotation ?? 0) + delta) % 360) + 360) % 360 })

  const presetParams = (preset) => gen().presetParams(preset)
  const addGenerative = (preset, groupId) => addLayer('loop', { loopGroup: groupId, presetId: preset.id, presetLabel: preset.label, loopId: preset.loop, ...presetParams(preset) })
  /* presets of a group, their sub-buckets as headings (MenuTop's eyebrows) */
  const presetRows = (presets, pick) => {
    const out = []
    let lastSub = null
    for (const p of presets) {
      if (p.sub && p.sub !== lastSub) { lastSub = p.sub; out.push({ heading: p.sub, key: `sub-${p.sub}` }) }
      out.push({ label: p.label, key: p.id, onClick: () => pick(p) })
    }
    return out
  }
  const generativeItems = (groupId) => presetRows(gen()?.presetsInGroup(groupId) ?? [], (p) => addGenerative(p, groupId))

  const canFlatten = (sel.length === 1 && sel[0].type === 'bool') || (sel.length >= 2 && sel.every(isBooleanable))
  const canRelease = layers.some((l) => l.id === selectedId && l.type === 'bool')
  const convertible = sel.length === 1 && sel[0].type === 'shape' && !sel[0].locked && ['rect', 'ellipse', 'triangle', 'polygon', 'star', 'line'].includes(sel[0].kind)
  const onConvert = () => (convertible ? convertShapeToPath(sel[0].id) : flattenSelected())
  const blendable = sel.length === 2 && canBlend(sel[0], sel[1])
  const onBlend = async () => {
    const raw = await modal.prompt('Blend steps', '5')
    const steps = Math.max(1, Math.min(50, Math.round(Number(raw)) || 0))
    if (raw == null || !steps) return
    const ids = blendLayers(sel[0], sel[1], steps, palette).map((patch) => addLayer('path', patch))
    if (ids.length) groupLayers(ids)
  }
  const canBool = sel.filter(isBooleanable).length >= 2

  const maskSel = sel.length === 1 ? sel[0] : null
  const maskIdx = maskSel ? layers.findIndex((l) => l.id === maskSel.id) : -1
  const canUseAsMask = !!maskSel && !maskSel.isMask && maskIdx > 0 && canMask(maskSel)
  const onUseAsMask = () => { beginTransaction(); updateLayer(maskSel.id, { isMask: true }); updateLayer(layers[maskIdx - 1].id, { maskedBy: maskSel.id }); commitTransaction() }
  const onReleaseMask = () => { beginTransaction(); updateLayer(maskSel.id, { isMask: false }); layers.filter((l) => l.maskedBy === maskSel.id).forEach((l) => updateLayer(l.id, { maskedBy: null })); commitTransaction() }

  const confirmReplaceIfUnsaved = async () => {
    if (layers.length === 0) return true
    if (currentPresetId && !canUndo) return true
    return modal.confirm('Discard the current canvas? Unsaved changes will be lost.')
  }
  const onNew = async () => {
    if (!(await confirmReplaceIfUnsaved())) return
    try { localStorage.removeItem('kol.editor.draft') } catch { /* ignore */ }
    window.location.reload()
  }
  const onOpenItem = async (slot, item) => {
    if (slot === 'preset' && !(await confirmReplaceIfUnsaved())) return
    if (slot === 'palette') { loadPalette(item); openColorPane() }
    else if (slot === 'pattern' || slot === 'type') insertFromLibrary(slot, item)
    else if (slot === 'preset') loadPreset(item)
  }
  const onOpenStarter = async (st) => { if (await confirmReplaceIfUnsaved()) loadPreset(st.preset) }
  const onSaveWorkspace = async () => {
    const name = (await modal.prompt('Workspace name', workspaceName ?? ''))?.trim()
    if (name) saveWorkspace(name)
  }
  /* the layer's opacity, as the digit keys write it (CanvasArea's bespoke 1–9 · 0 · 00) */
  const setOpacity = (v) => layer && !layer.locked && updateLayer(layer.id, { opacity: v })
  /* `f` is the canvas viewport's own key (CanvasView); the row presses it */
  const toggleFps = () => window.dispatchEvent(new KeyboardEvent('keydown', { key: 'f' }))

  const kinetic = motion()
  const paratype = gen() ? gen().presetsInGroup('paratype') : []

  const libraryRows = SLOT_KEYS.map((slot) => {
    const items = library[slot] ?? []
    return {
      label: `${SLOT_META[slot]} · ${items.length}`, disabled: items.length === 0,
      items: items.map((item, i) => ({
        key: item.id,
        label: item.name
          ?? (slot === 'type' && item.text ? item.text.slice(0, 24) : null)
          ?? (slot === 'preset' && item.aspect ? `${item.aspect}${Array.isArray(item.layers) ? ` · ${item.layers.length}L` : ''}` : null)
          ?? `${SLOT_META[slot].slice(0, -1)} ${i + 1}`,
        onClick: () => onOpenItem(slot, item),
      })),
    }
  })

  const liveFilterRows = fx() ? [
    { label: 'None', onClick: fxTarget.clear, disabled: fxTarget.chain.length === 0 },
    DIV,
    ...fx().liveFilterGroups(fxTarget.options).map((g, i) => (g.divider ? { divider: true, key: `d${i}` } : {
      label: g.label, disabled: !fxTarget.target,
      items: g.filters.map((f) => ({ key: f.id, label: `${fx().liveFilterLabel(f)}…`, checked: fxTarget.inChain(f.id), onClick: () => fxTarget.apply(f) })),
    })),
  ] : []

  const app = {
    label: 'FXR', width: 200, items: [
      { label: 'Home', onClick: () => navigateTo('/') },
      { label: 'Chromes', items: CHROMES.map((d) => ({ label: d.label, onClick: d.go, checked: !!d.current })) },
      DIV,
      { label: 'Settings…', kbd: key('settings-drawer'), onClick: settings },
    ],
  }

  const menus = [
    {
      label: 'File', items: [
        { label: 'New', onClick: onNew },
        { label: 'Files…', kbd: key('open-files'), onClick: () => openFiles() },
        { label: 'Starters', items: STARTERS.map((st) => ({ key: st.id, label: st.name, onClick: () => onOpenStarter(st) })) },
        DIV,
        { label: currentPresetId ? 'Save' : 'Save…', kbd: key('save'), onClick: onSave },
        { label: 'Save as…', kbd: key('save-as'), onClick: () => openFiles({ focusName: true }) },
        DIV,
        { label: 'Aspect', items: ASPECTS.map((a) => ({ key: a.id, label: a.label, checked: aspect === a.id, onClick: () => setAspect(a.id) })) },
        { label: 'Clear', onClick: clearLayers, disabled: layers.length === 0 },
        DIV,
        { label: 'Library', items: libraryRows },
        DIV,
        /* his frame 20:13601: Export opens beside its row */
        {
          label: 'Export', items: [
            { label: 'Export SVG', onClick: onExportSvg },
            { label: 'Export PNG', onClick: onExportPng },
            { label: 'Batch export…', onClick: () => window.dispatchEvent(new CustomEvent('kol:open-batch-export')) },
            { label: 'Open output window', onClick: openOutputWindow },
          ],
        },
      ],
    },
    {
      label: 'Edit', items: [
        { label: 'Undo', kbd: key('undo'), onClick: undo, disabled: !canUndo },
        { label: 'Redo', kbd: key('redo'), onClick: redo, disabled: !canRedo },
        DIV,
        { label: 'Duplicate selection', kbd: key('duplicate'), onClick: cmd('duplicate'), disabled: !editable },
        { label: 'Delete selection', kbd: key('delete-back'), onClick: cmd('delete-back'), disabled: !sel.some((l) => !l.locked) },
        DIV,
        { label: 'Select all layers', kbd: key('select-all'), onClick: cmd('select-all'), disabled: layers.length === 0 },
        { label: 'Deselect', kbd: key('deselect'), onClick: () => select(null), disabled: (selectedIds ?? []).length === 0 },
        DIV,
        { label: 'Eyedropper', kbd: key('eyedrop'), onClick: cmd('eyedrop') },
        { label: 'Color', onClick: () => openColorPane() },
        { label: 'Color Modes', onClick: openColorModes },
        DIV,
        { label: 'Default fill + stroke (white / black)', kbd: key('paint-default'), onClick: cmd('paint-default') },
        { label: 'Toggle fill / stroke focus', kbd: key('paint-toggle'), onClick: cmd('paint-toggle') },
        { label: 'Swap fill and stroke colors', kbd: key('paint-swap'), onClick: cmd('paint-swap') },
        { label: 'Clear focused paint (none)', kbd: key('paint-clear'), onClick: cmd('paint-clear') },
      ],
    },
    {
      label: 'Layer', items: [
        { label: 'Group selection', kbd: key('group'), onClick: cmd('group'), disabled: sel.length < 2 },
        { label: 'Ungroup', kbd: key('ungroup'), onClick: cmd('ungroup'), disabled: layer?.type !== 'group' },
        DIV,
        {
          label: 'Align', disabled: !positioned, items: [
            ...H_OPTS.map((o) => ({ key: `h-${o.value}`, label: o.ariaLabel, onClick: () => alignSelected('h', o.value), disabled: o.value === 'distribute' && sel.length < 3 })),
            DIV,
            ...V_OPTS.map((o) => ({ key: `v-${o.value}`, label: o.ariaLabel, onClick: () => alignSelected('v', o.value), disabled: o.value === 'distribute' && sel.length < 3 })),
          ],
        },
        { label: 'Flip horizontal', kbd: key('flip-h'), onClick: cmd('flip-h'), disabled: !positioned },
        { label: 'Flip vertical', kbd: key('flip-v'), onClick: cmd('flip-v'), disabled: !positioned },
        /* the action band's (ActionBar) — the float chrome has no band */
        { label: 'Rotate 90° left', onClick: () => rotateBy(-90), disabled: !canXform },
        { label: 'Rotate 90° right', onClick: () => rotateBy(90), disabled: !canXform },
        { label: 'Crop image', onClick: () => window.dispatchEvent(new CustomEvent('kol:enter-crop', { detail: layer.id })), disabled: layer?.type !== 'photo' || layer?.locked },
        {
          label: 'Nudge', disabled: !positioned, items: [
            ...NUDGES.map(([id, label]) => ({ key: id, label, kbd: key(id), onClick: cmd(id) })),
            DIV,
            ...NUDGES_10.map(([id, label]) => ({ key: id, label, kbd: key(id), onClick: cmd(id) })),
          ],
        },
        {
          label: 'Opacity', disabled: !editable, items: [
            ...[1, 2, 3, 4, 5, 6, 7, 8, 9].map((d) => ({ key: `o${d}`, label: `${d * 10}%`, kbd: String(d), onClick: () => setOpacity(d / 10) })),
            { label: '100%', kbd: key('opacity-full'), onClick: () => setOpacity(1) },
            { label: '0%', kbd: key('opacity-zero'), onClick: () => setOpacity(0) },
          ],
        },
        DIV,
        ...(fx() ? [{ label: 'Live Filters', items: liveFilterRows }] : []),
        { label: 'Layer Effects…', onClick: () => window.dispatchEvent(new CustomEvent('kol:open-layer-effects')), disabled: !editable },
        DIV,
        maskSel?.isMask ? { label: 'Release mask', onClick: onReleaseMask } : { label: 'Use as mask', onClick: onUseAsMask, disabled: !canUseAsMask },
        DIV,
        { label: 'Toggle lock', kbd: key('toggle-lock'), onClick: cmd('toggle-lock'), disabled: !layer },
        { label: 'Toggle visibility', kbd: key('toggle-visibility'), onClick: cmd('toggle-visibility'), disabled: !layer },
      ],
    },
    {
      label: 'Text', items: [
        {
          label: 'Alignment', disabled: !textLayer, items: [['left', 'text-align-left', 'Align text left'], ['center', 'text-align-center', 'Center text'], ['right', 'text-align-right', 'Align text right']]
            .map(([v, icon, label]) => ({ key: v, label, icon, checked: (textLayer?.textAlign ?? 'center') === v, onClick: () => updateLayer(textLayer.id, { textAlign: v }) })),
        },
        {
          label: 'Vertical alignment', disabled: !textLayer, items: [['top', 'text-valign-top', 'Align top'], ['middle', 'text-valign-middle', 'Align middle'], ['bottom', 'text-valign-bottom', 'Align bottom']]
            .map(([v, icon, label]) => ({ key: v, label, icon, checked: (textLayer?.verticalAlign ?? 'middle') === v, onClick: () => updateLayer(textLayer.id, { verticalAlign: v }) })),
        },
        DIV,
        { label: 'Case', disabled: !textLayer, items: CASES.map((c) => ({ key: c.id, label: c.label, checked: (textLayer?.case ?? 'original') === c.id, onClick: () => updateLayer(textLayer.id, { case: c.id }) })) },
        { label: 'Italic', checked: !!textLayer?.italic, disabled: !textLayer, onClick: () => updateLayer(textLayer.id, { italic: !textLayer.italic }) },
        DIV,
        { label: 'Convert to path', onClick: () => flattenText(textLayer.id), disabled: !textLayer },
      ],
    },
    {
      label: 'Vector', items: [
        ...Object.entries(BOOL_OP_LABELS).map(([op, label]) => ({ key: op, label, onClick: () => booleanSelected(op), disabled: !canBool })),
        { label: 'Release boolean', onClick: () => releaseBoolean(), disabled: !canRelease },
        DIV,
        { label: 'Convert to path', kbd: key('convert-path'), onClick: onConvert, disabled: !canFlatten && !convertible },
        { label: 'Blend…', onClick: onBlend, disabled: !blendable },
      ],
    },
    {
      label: 'Tools', width: 220, items: [
        /* the generator windows (W7): Generate · Repeat · the Paratype letter, on Dialog variant="settings" */
        ...(gen() ? [
          { label: 'Generate…', onClick: () => window.dispatchEvent(new CustomEvent('kol:open-generator-window', { detail: { window: 'generate' } })) },
          { label: 'Repeat…', onClick: () => window.dispatchEvent(new CustomEvent('kol:open-generator-window', { detail: { window: 'repeat' } })) },
          { label: 'Paratype letter…', onClick: () => window.dispatchEvent(new CustomEvent('kol:open-generator-window', { detail: { window: 'type' } })) },
          { divider: true },
        ] : []),
        ...(gen() ? [{
          label: 'Generative', items: gen().GENERATIVE_TREE.map((parent) => (parent.groups.length === 1
            ? { key: parent.label, label: parent.label, items: generativeItems(parent.groups[0]) }
            : { key: parent.label, label: parent.label, items: parent.groups.map((gid) => ({ key: gid, label: parent.labels?.[gid] ?? gen().groupById(gid).label, items: generativeItems(gid) })) })),
        }] : []),
        ...(gen() ? [{
          label: 'Pattern', items: FX_PATTERN_CATEGORIES.map((c) => ({
            key: c.label, label: c.label, items: (gen().presetsInSub(c.group, c.sub) ?? []).map((p) => ({ key: p.id, label: p.label, onClick: () => addGenerative(p, c.group) })),
          })),
        }] : []),
        {
          label: 'Type', items: [
            { label: 'Text tool', kbd: key('tool-text'), onClick: cmd('tool-text') },
            ...(kinetic ? [{
              label: 'Kinetic type', items: kinetic.KINETIC_TREE.flatMap((parent) => [
                { heading: parent.label, key: `h-${parent.label}` },
                ...parent.subs.map((sub) => ({
                  key: sub, label: sub,
                  items: kinetic.KINETIC_PRESETS.filter((p) => p.sub === sub).map((p) => ({ key: p.id, label: p.label, onClick: () => addLayer('kinetic', { presetId: p.id, presetLabel: p.label, comp: kinetic.presetComp(p) }) })),
                })),
              ]),
            }] : []),
            ...(paratype.length > 0 ? [{ label: gen().MISC_TREE[0].label, items: presetRows(paratype, (p) => addLayer('misc', gen().presetLayerPatch(p, 'paratype'))) }] : []),
          ],
        },
        { label: 'Color Modes', onClick: openColorModes },
        DIV,
        { label: 'Insert image', onClick: () => window.dispatchEvent(new CustomEvent('kol:insert-image')) },
      ],
    },
    {
      label: 'View', width: 260, items: [
        {
          label: 'Zoom', items: [
            { label: 'In', kbd: key('zoom-in'), onClick: cmd('zoom-in') },
            { label: 'Out', kbd: key('zoom-out'), onClick: cmd('zoom-out') },
            { label: 'To Fit', kbd: key('zoom-fit'), onClick: cmd('zoom-fit') },
            { label: 'To Width', kbd: key('zoom-width'), onClick: cmd('zoom-width') },
            { label: 'To Selection', kbd: key('zoom-selection'), onClick: cmd('zoom-selection'), disabled: !sel.length },
            DIV,
            ...[[1, 'zoom-100'], [2, 'zoom-200'], [4, 'zoom-400'], [8, 'zoom-800']].map(([z, id]) => ({ key: id, label: `${z * 100}%`, kbd: key(id), checked: Math.abs(zoom - z) < 0.005, onClick: cmd(id) })),
          ],
        },
        DIV,
        { label: 'Preview mode', kbd: key('view-preview'), onClick: cmd('view-preview') },
        DIV,
        { label: 'Show / hide rulers', kbd: key('toggle-rulers'), checked: showRulers, onClick: cmd('toggle-rulers') },
        { label: 'Show/hide grid', kbd: key('toggle-grid'), checked: showGrid, onClick: toggleGrid },
        { label: 'Show / hide modulation dots', kbd: key('toggle-dots'), checked: dots, onClick: toggleDots },
        { label: 'Toggle fps readout', kbd: key('fps'), onClick: toggleFps },
        DIV,
        { label: 'Snap to objects, guides and canvas', checked: snapEnabled, onClick: toggleSnap },
        DIV,
        /* plan 7.7: the tools as the left Rail or the bottom dock (the phone's default) */
        ...(tools ? [{ label: 'Tools', items: [{ label: 'Rail', checked: tools.place === 'rail', onClick: () => tools.setPlace('rail') }, { label: 'Dock', checked: tools.place === 'dock', onClick: () => tools.setPlace('dock') }] }] : []),
        { label: 'Layout', items: [{ label: 'Single', checked: view === 'single', onClick: () => setView('single') }, { label: 'Social', checked: view === 'social', onClick: () => setView('social') }] },
        DIV,
        /* MenuTop's Window menu: each row opens its card */
        {
          label: 'Cards', items: [
            ...LEFT_TABS.map((t) => ({ key: t, label: t, onClick: () => cards?.open(t) })),
            DIV,
            ...COLOR_TABS.map(([id, label]) => ({ key: id, label, onClick: () => openColorPane(id) })),
            DIV,
            ...['Inspector', 'Parameters', ...(fx() ? ['Effects'] : [])].map((t) => ({ key: t, label: t, onClick: () => cards?.open(t) })),
            DIV,
            ...[...(kinetic ? ['Transport'] : []), 'Output', 'File'].map((t) => ({ key: `f-${t}`, label: t, onClick: () => cards?.open(t) })),
          ],
        },
        ...(kinetic ? [{ label: 'Timeline', checked: timelinePinned, onClick: toggleTimelinePinned }] : []),
        {
          label: 'Workspace', items: [
            { label: 'Save workspace…', onClick: onSaveWorkspace },
            ...(Object.keys(workspace.saved).length ? [DIV] : []),
            ...Object.keys(workspace.saved).map((n) => ({ key: n, label: n, checked: n === workspaceName, onClick: () => applyWorkspace(n) })),
            DIV,
            { label: 'Reset workspace', onClick: resetWorkspace },
          ],
        },
        DIV,
        { label: 'Show / hide rail', kbd: key('toggle-rail'), onClick: toggleRail, disabled: !toggleRail },
        { label: 'Show / hide settings', kbd: key('settings-drawer'), onClick: settings },
      ],
    },
  ]

  const end = [{ label: 'Help', items: [{ label: 'Show / hide shortcuts', kbd: key('show-shortcuts'), onClick: () => window.dispatchEvent(new CustomEvent('kol:show-shortcuts')) }] }]
  return { app, menus, end }
}

/* the same data as the document capsule's ▾ rows on a phone (MoreRows: `{ label, icon?, onPress, checked?, sub? }`) —
 * the menu bar folds into the capsule (decided for review, plan W2.7). Headings and dividers drop; disabled rows drop. */
export function toMoreRows(items = []) {
  return items
    .filter((it) => !it.divider && !it.heading && !it.disabled)
    .map((it) => (it.items?.length
      ? { label: it.label, icon: it.icon, sub: toMoreRows(it.items) }
      : { label: it.label, icon: it.icon, checked: it.checked, onPress: it.onClick }))
    /* a submenu with nothing that applies right now is left out, as its rows are */
    .filter((it) => !it.sub || it.sub.length > 0)
}
