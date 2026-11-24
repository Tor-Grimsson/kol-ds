import {
  applyWorkspace, ASPECTS, blendLayers, BOOL_OP_LABELS, canBlend, canMask, CASES, comboLabel, currentWorkspaceName,
  findLayerDeep, goMode, isBooleanable, navigateTo, openColorModes, openFiles, openTab, pack, resetWorkspace,
  saveWorkspace, shortcutById, STARTERS, toggleDots, toggleTimelinePinned, useBindDots, useComposeFile, useComposeState,
  useEffectTarget, useGeneratorLibrary, useTimelinePinned, useWorkspace, useZoom,
} from './engine.js'
import { MenuBar, MenuDivider, MenuEyebrow, MenuNest, MenuRow } from '../ui/Menu.jsx'

/* The menu bar as the real one is (the package's MenuTop): FXR, File, Edit, Layer, Text, Vector, Tools, View, Window,
   Help, the same rows in the same order, the same writes, greyed where the real one greys. Keyboard verbs go through
   `kol:command`, which the engine's canvas runs, so a row and its key share every guard. */
const gen = () => pack('generators')
const fx = () => pack('effects')
const motion = () => pack('motion')
const key = (id) => { const s = shortcutById(id); return s ? comboLabel(s.combo) : undefined }
const cmd = (id) => () => window.dispatchEvent(new CustomEvent('kol:command', { detail: { id } }))
const send = (name, detail) => () => window.dispatchEvent(new CustomEvent(name, detail ? { detail } : undefined))
const openColorPane = (tab = 'Colour') => send('kol:open-color-pane', { tab })()

const CHROMES = [
  { label: 'Library', go: () => navigateTo('/library') },
  { label: 'Editor', current: true },
  { label: 'Labs', go: () => goMode('labs') },
  { label: 'Randomiser', go: () => goMode('randomiser') },
  { label: 'Morph', go: () => navigateTo('/morph') },
]
const SLOTS = [['palette', 'Palettes'], ['pattern', 'Patterns'], ['type', 'Types'], ['preset', 'Presets']]
const FX_PATTERN_CATEGORIES = [
  { label: 'Moiré', group: 'optic', sub: 'Moiré' },
  { label: 'Mesh Gradient', group: 'gradients', sub: 'Mesh' },
  { label: 'Reaction', group: 'optic', sub: 'Reaction' },
  { label: 'Halftone', group: 'optic', sub: 'Halftone' },
]
const H_OPTS = [['start', 'align-horizontal-left', 'Align left'], ['center', 'align-horizontal-center', 'Align horizontal center'], ['end', 'align-horizontal-right', 'Align right'], ['distribute', 'space-evenly-horizontal', 'Distribute horizontally']]
const V_OPTS = [['start', 'align-vertical-top', 'Align top'], ['center', 'align-vertical-center', 'Align vertical center'], ['end', 'align-vertical-bottom', 'Align bottom'], ['distribute', 'space-evenly-vertical', 'Distribute vertically']]

/* Layer › Live Filters, and the layers bar's filter menu: None, then each family's filters */
export function LiveFilterRows() {
  const t = useEffectTarget()
  if (!fx()) return null
  return (
    <>
      <MenuRow onClick={t.clear} disabled={t.chain.length === 0}>None</MenuRow>
      <MenuDivider />
      {fx().liveFilterGroups(t.options).map((g, i) => (g.divider ? <MenuDivider key={`d${i}`} /> : (
        <MenuNest key={g.label} label={g.label} disabled={!t.target} scroll>
          {g.filters.map((f) => <MenuRow key={f.id} onClick={() => t.apply(f)} checked={t.inChain(f.id)}>{fx().liveFilterLabel(f)}…</MenuRow>)}
        </MenuNest>
      )))}
    </>
  )
}

const ADJUSTMENTS = ['filter-adjustment', 'fx-brightness', 'fx-contrast', 'filter-hsl-adjustment', 'fx-hsl', 'fx-hsv', 'fx-rgb', 'fx-invert', 'fx-grayscale', 'fx-sepia', 'fx-posterize', 'fx-threshold', 'filter-color-gradient', 'filter-color-map', 'filter-color-replace']
export function AdjustmentRows() {
  const t = useEffectTarget()
  if (!fx()) return null
  return ADJUSTMENTS.map((id) => fx().filterById(id)).filter((f) => f && t.options.includes(f)).map((f) => (
    <MenuRow key={f.id} onClick={() => t.apply(f)} disabled={!t.target} checked={t.inChain(f.id)}>{fx().liveFilterLabel(f)}…</MenuRow>
  ))
}

export default function Menus() {
  const {
    aspect, setAspect, view, setView, layers, selectedId, selectedIds, select, updateLayer, addLayer,
    flattenSelected, releaseBoolean, booleanSelected, convertShapeToPath, groupLayers, palette, alignSelected, flattenText,
    beginTransaction, commitTransaction, canUndo, canRedo, undo, redo, clearLayers, currentPresetId,
    loadPreset, loadPalette, insertFromLibrary, snapEnabled, toggleSnap, showGrid, toggleGrid, showRulers,
  } = useComposeState()
  const { library } = useGeneratorLibrary()
  const dots = useBindDots()
  const timelinePinned = useTimelinePinned()
  const zoom = useZoom()
  const workspace = useWorkspace()
  const workspaceName = currentWorkspaceName(workspace)
  const timelineUp = (motion()?.useTimelineUp ?? (() => false))()
  const { onSave, onExportSvg, onExportPng, openOutputWindow } = useComposeFile()

  const sel = (selectedIds ?? []).filter((id) => id !== 'canvas').map((id) => findLayerDeep(layers, id)).filter(Boolean)
  const layer = selectedId && selectedId !== 'canvas' ? findLayerDeep(layers, selectedId) : null
  const editable = !!layer && !layer.locked
  const positioned = sel.some((l) => typeof l.x === 'number' && !l.locked)
  const textLayer = layer?.type === 'text' && !layer.locked ? layer : null

  const addGenerative = (preset, groupId) => addLayer('loop', { loopGroup: groupId, presetId: preset.id, presetLabel: preset.label, loopId: preset.loop, ...gen().presetParams(preset) })
  const presetRows = (presets, pick) => {
    const out = []
    let lastSub = null
    for (const p of presets) {
      if (p.sub && p.sub !== lastSub) { lastSub = p.sub; out.push(<MenuEyebrow key={`sub-${p.sub}-${out.length}`}>{p.sub}</MenuEyebrow>) }
      out.push(<MenuRow key={p.id} onClick={() => pick(p)}>{p.label}</MenuRow>)
    }
    return out
  }
  const generativeItems = (groupId) => presetRows(gen()?.presetsInGroup(groupId) ?? [], (p) => addGenerative(p, groupId))

  const canFlatten = (sel.length === 1 && sel[0].type === 'bool') || (sel.length >= 2 && sel.every(isBooleanable))
  const canRelease = layers.some((l) => l.id === selectedId && l.type === 'bool')
  const convertible = sel.length === 1 && sel[0].type === 'shape' && !sel[0].locked && ['rect', 'ellipse', 'triangle', 'polygon', 'star', 'line'].includes(sel[0].kind)
  const onConvert = () => (convertible ? convertShapeToPath(sel[0].id) : flattenSelected())
  const blendable = sel.length === 2 && canBlend(sel[0], sel[1])
  /* the engine's modal hook is not reachable from here; the browser's own prompt and confirm stand in */
  const onBlend = () => {
    const raw = window.prompt('Blend steps', '5')
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
  const onReleaseMask = () => {
    beginTransaction()
    updateLayer(maskSel.id, { isMask: false })
    layers.filter((l) => l.maskedBy === maskSel.id).forEach((l) => updateLayer(l.id, { maskedBy: null }))
    commitTransaction()
  }
  const confirmReplace = () => layers.length === 0 || (currentPresetId && !canUndo) || window.confirm('Discard the current canvas? Unsaved changes will be lost.')
  const onNew = () => { if (!confirmReplace()) return; try { localStorage.removeItem('kol.editor.draft') } catch { /* ignore */ } window.location.reload() }
  const onOpenItem = (slot, item) => {
    if (slot === 'preset' && !confirmReplace()) return
    if (slot === 'palette') { loadPalette(item); openColorPane() } else if (slot === 'preset') loadPreset(item)
    else insertFromLibrary(slot, item)
  }
  const onSaveWorkspace = () => { const name = window.prompt('Workspace name', workspaceName ?? '')?.trim(); if (name) saveWorkspace(name) }
  const kinetic = motion()
  const paratype = gen() ? gen().presetsInGroup('paratype') : []

  const menus = [
    { label: 'FXR', bold: true, width: 200, children: (
      <>
        <MenuRow onClick={() => navigateTo('/')}>Home</MenuRow>
        <MenuNest label="Chromes">{CHROMES.map((d) => <MenuRow key={d.label} onClick={d.go} checked={d.current}>{d.label}</MenuRow>)}</MenuNest>
        <MenuDivider />
        {/* the settings window is the package's shell's own (not exported): the row sends its event, nothing opens */}
        <MenuRow onClick={send('kol:open-settings')} shortcut={key('settings-drawer')}>Settings…</MenuRow>
      </>
    ) },
    { label: 'File', children: (
      <>
        <MenuRow onClick={onNew}>New</MenuRow>
        <MenuRow onClick={() => openFiles()} shortcut={key('open-files')}>Files…</MenuRow>
        <MenuNest label="Starters" scroll>{STARTERS.map((s) => <MenuRow key={s.id} onClick={() => { if (confirmReplace()) loadPreset(s.preset) }}>{s.name}</MenuRow>)}</MenuNest>
        <MenuDivider />
        <MenuRow onClick={onSave} shortcut={key('save')}>{currentPresetId ? 'Save' : 'Save…'}</MenuRow>
        <MenuRow onClick={() => openFiles({ focusName: true })} shortcut={key('save-as')}>Save as…</MenuRow>
        <MenuDivider />
        <MenuNest label="Aspect" scroll>{ASPECTS.map((a) => <MenuRow key={a.id} onClick={() => setAspect(a.id)} checked={aspect === a.id}>{a.label}</MenuRow>)}</MenuNest>
        <MenuRow onClick={clearLayers} disabled={layers.length === 0}>Clear</MenuRow>
        <MenuDivider />
        <MenuNest label="Library">
          {SLOTS.map(([slot, name]) => {
            const items = library[slot] ?? []
            return (
              <MenuNest key={slot} label={`${name}, ${items.length}`} disabled={items.length === 0} scroll>
                {items.map((item, i) => (
                  <MenuRow key={item.id} onClick={() => onOpenItem(slot, item)}
                    prefix={slot === 'palette' && Array.isArray(item.colors) ? <span className="flex gap-px">{item.colors.slice(0, 6).map((c, j) => <span key={j} className="inline-block h-3.5 w-2" style={{ background: c ?? 'transparent' }} />)}</span> : undefined}>
                    {item.name ?? (slot === 'type' && item.text ? item.text.slice(0, 24) : null) ?? (slot === 'preset' && item.aspect ? `${item.aspect}${Array.isArray(item.layers) ? `, ${item.layers.length}L` : ''}` : null) ?? `${name.slice(0, -1)} ${i + 1}`}
                  </MenuRow>
                ))}
              </MenuNest>
            )
          })}
        </MenuNest>
        <MenuDivider />
        <MenuRow onClick={onExportSvg}>Export SVG</MenuRow>
        <MenuRow onClick={onExportPng}>Export PNG</MenuRow>
        <MenuRow onClick={send('kol:open-batch-export')}>Batch export…</MenuRow>
        <MenuRow onClick={openOutputWindow}>Open output window</MenuRow>
      </>
    ) },
    { label: 'Edit', children: (
      <>
        <MenuRow onClick={undo} disabled={!canUndo} shortcut={key('undo')}>Undo</MenuRow>
        <MenuRow onClick={redo} disabled={!canRedo} shortcut={key('redo')}>Redo</MenuRow>
        <MenuDivider />
        <MenuRow onClick={cmd('duplicate')} disabled={!editable} shortcut={key('duplicate')}>Duplicate selection</MenuRow>
        <MenuRow onClick={cmd('delete-back')} disabled={!sel.some((l) => !l.locked)} shortcut={key('delete-back')}>Delete selection</MenuRow>
        <MenuDivider />
        <MenuRow onClick={cmd('select-all')} disabled={layers.length === 0} shortcut={key('select-all')}>Select all layers</MenuRow>
        <MenuRow onClick={() => select(null)} disabled={(selectedIds ?? []).length === 0} shortcut={key('deselect')}>Deselect</MenuRow>
        <MenuDivider />
        <MenuRow onClick={cmd('eyedrop')} shortcut={key('eyedrop')}>Eyedropper</MenuRow>
        <MenuRow onClick={() => openColorPane()}>Color</MenuRow>
        <MenuRow onClick={openColorModes}>Color Modes</MenuRow>
      </>
    ) },
    { label: 'Layer', children: (
      <>
        <MenuRow onClick={cmd('group')} disabled={sel.length < 2} shortcut={key('group')}>Group selection</MenuRow>
        <MenuRow onClick={cmd('ungroup')} disabled={layer?.type !== 'group'} shortcut={key('ungroup')}>Ungroup</MenuRow>
        <MenuDivider />
        <MenuNest label="Align" disabled={!positioned}>
          {H_OPTS.map(([v, icon, label]) => <MenuRow key={`h-${v}`} icon={icon} onClick={() => alignSelected('h', v)} disabled={v === 'distribute' && sel.length < 3}>{label}</MenuRow>)}
          <MenuDivider />
          {V_OPTS.map(([v, icon, label]) => <MenuRow key={`v-${v}`} icon={icon} onClick={() => alignSelected('v', v)} disabled={v === 'distribute' && sel.length < 3}>{label}</MenuRow>)}
        </MenuNest>
        <MenuRow onClick={cmd('flip-h')} disabled={!positioned} shortcut={key('flip-h')}>Flip horizontal</MenuRow>
        <MenuRow onClick={cmd('flip-v')} disabled={!positioned} shortcut={key('flip-v')}>Flip vertical</MenuRow>
        <MenuDivider />
        {fx() && <MenuNest label="Live Filters"><LiveFilterRows /></MenuNest>}
        <MenuRow onClick={send('kol:open-layer-effects')} disabled={!editable}>Layer Effects…</MenuRow>
        <MenuDivider />
        {maskSel?.isMask ? <MenuRow onClick={onReleaseMask}>Release mask</MenuRow> : <MenuRow onClick={onUseAsMask} disabled={!canUseAsMask}>Use as mask</MenuRow>}
        <MenuDivider />
        <MenuRow onClick={cmd('toggle-lock')} disabled={!layer} shortcut={key('toggle-lock')}>Toggle lock</MenuRow>
        <MenuRow onClick={cmd('toggle-visibility')} disabled={!layer} shortcut={key('toggle-visibility')}>Toggle visibility</MenuRow>
      </>
    ) },
    { label: 'Text', children: (
      <>
        <MenuNest label="Alignment" disabled={!textLayer}>
          {[['left', 'text-align-left', 'Align text left'], ['center', 'text-align-center', 'Center text'], ['right', 'text-align-right', 'Align text right']].map(([v, icon, label]) => (
            <MenuRow key={v} icon={icon} onClick={() => updateLayer(textLayer.id, { textAlign: v })} checked={(textLayer?.textAlign ?? 'center') === v}>{label}</MenuRow>
          ))}
        </MenuNest>
        <MenuNest label="Vertical alignment" disabled={!textLayer}>
          {[['top', 'text-valign-top', 'Align top'], ['middle', 'text-valign-middle', 'Align middle'], ['bottom', 'text-valign-bottom', 'Align bottom']].map(([v, icon, label]) => (
            <MenuRow key={v} icon={icon} onClick={() => updateLayer(textLayer.id, { verticalAlign: v })} checked={(textLayer?.verticalAlign ?? 'middle') === v}>{label}</MenuRow>
          ))}
        </MenuNest>
        <MenuDivider />
        <MenuNest label="Case" disabled={!textLayer}>{CASES.map((c) => <MenuRow key={c.id} onClick={() => updateLayer(textLayer.id, { case: c.id })} checked={(textLayer?.case ?? 'original') === c.id}>{c.label}</MenuRow>)}</MenuNest>
        <MenuRow onClick={() => updateLayer(textLayer.id, { italic: !textLayer.italic })} disabled={!textLayer} checked={!!textLayer?.italic}>Italic</MenuRow>
        <MenuDivider />
        <MenuRow onClick={() => flattenText(textLayer.id)} disabled={!textLayer}>Convert to path</MenuRow>
      </>
    ) },
    { label: 'Vector', children: (
      <>
        {Object.entries(BOOL_OP_LABELS).map(([op, label]) => <MenuRow key={op} onClick={() => booleanSelected(op)} disabled={!canBool}>{label}</MenuRow>)}
        <MenuRow onClick={() => releaseBoolean()} disabled={!canRelease}>Release boolean</MenuRow>
        <MenuDivider />
        <MenuRow onClick={onConvert} disabled={!canFlatten && !convertible} shortcut={key('convert-path')}>Convert to path</MenuRow>
        <MenuRow onClick={onBlend} disabled={!blendable}>Blend…</MenuRow>
      </>
    ) },
    { label: 'Tools', width: 220, children: (
      <>
        {gen() && (
          <MenuNest label="Generative">
            {gen().GENERATIVE_TREE.map((parent) => (parent.groups.length === 1 ? (
              <MenuNest key={parent.label} label={parent.label} scroll>{generativeItems(parent.groups[0])}</MenuNest>
            ) : (
              <MenuNest key={parent.label} label={parent.label}>
                {parent.groups.map((gid) => <MenuNest key={gid} label={parent.labels?.[gid] ?? gen().groupById(gid).label} scroll>{generativeItems(gid)}</MenuNest>)}
              </MenuNest>
            )))}
          </MenuNest>
        )}
        {gen() && (
          <MenuNest label="Pattern">
            {FX_PATTERN_CATEGORIES.map((c) => (
              <MenuNest key={c.label} label={c.label} scroll>{gen().presetsInSub(c.group, c.sub).map((p) => <MenuRow key={p.id} onClick={() => addGenerative(p, c.group)}>{p.label}</MenuRow>)}</MenuNest>
            ))}
          </MenuNest>
        )}
        <MenuNest label="Type">
          <MenuRow onClick={cmd('tool-text')} shortcut={key('tool-text')}>Text tool</MenuRow>
          {kinetic && (
            <MenuNest label="Kinetic type">
              {kinetic.KINETIC_TREE.map((parent) => (
                <div key={parent.label} className="flex flex-col">
                  <MenuEyebrow>{parent.label}</MenuEyebrow>
                  {parent.subs.map((sub) => (
                    <MenuNest key={sub} label={sub} scroll>
                      {kinetic.KINETIC_PRESETS.filter((p) => p.sub === sub).map((p) => (
                        <MenuRow key={p.id} onClick={() => addLayer('kinetic', { presetId: p.id, presetLabel: p.label, comp: kinetic.presetComp(p) })}>{p.label}</MenuRow>
                      ))}
                    </MenuNest>
                  ))}
                </div>
              ))}
            </MenuNest>
          )}
          {paratype.length > 0 && <MenuNest label={gen().MISC_TREE[0].label} scroll>{presetRows(paratype, (p) => addLayer('misc', gen().presetLayerPatch(p, 'paratype')))}</MenuNest>}
        </MenuNest>
        <MenuRow onClick={openColorModes}>Color Modes</MenuRow>
        <MenuDivider />
        <MenuRow onClick={send('kol:insert-image')}>Insert image</MenuRow>
      </>
    ) },
    { label: 'View', width: 260, children: (
      <>
        <MenuNest label="Zoom">
          <MenuRow onClick={cmd('zoom-in')} shortcut={key('zoom-in')}>In</MenuRow>
          <MenuRow onClick={cmd('zoom-out')} shortcut={key('zoom-out')}>Out</MenuRow>
          <MenuRow onClick={cmd('zoom-fit')} shortcut={key('zoom-fit')}>To Fit</MenuRow>
          <MenuRow onClick={cmd('zoom-width')} shortcut={key('zoom-width')}>To Width</MenuRow>
          <MenuRow onClick={cmd('zoom-selection')} disabled={!sel.length} shortcut={key('zoom-selection')}>To Selection</MenuRow>
          <MenuDivider />
          {[[1, 'zoom-100'], [2, 'zoom-200'], [4, 'zoom-400'], [8, 'zoom-800']].map(([z, id]) => (
            <MenuRow key={id} onClick={cmd(id)} checked={Math.abs(zoom - z) < 0.005} shortcut={key(id)}>{z * 100}%</MenuRow>
          ))}
        </MenuNest>
        <MenuDivider />
        <MenuRow onClick={cmd('view-preview')} shortcut={key('view-preview')}>Preview mode</MenuRow>
        <MenuDivider />
        <MenuRow onClick={cmd('toggle-rulers')} checked={showRulers} shortcut={key('toggle-rulers')}>Show / hide rulers</MenuRow>
        <MenuRow onClick={toggleGrid} checked={showGrid} shortcut={key('toggle-grid')}>Show/hide grid</MenuRow>
        <MenuRow onClick={toggleDots} checked={dots} shortcut={key('toggle-dots')}>Show / hide modulation dots</MenuRow>
        <MenuDivider />
        <MenuRow onClick={toggleSnap} checked={snapEnabled}>Snap to objects, guides and canvas</MenuRow>
        <MenuDivider />
        <MenuNest label="Layout">
          <MenuRow onClick={() => setView('single')} checked={view === 'single'}>Single</MenuRow>
          <MenuRow onClick={() => setView('social')} checked={view === 'social'}>Social</MenuRow>
        </MenuNest>
      </>
    ) },
    { label: 'Window', children: (
      <>
        <MenuNest label="Left rail">
          {['Layers', 'Assets', 'History', 'Navigator'].map((t) => <MenuRow key={t} onClick={() => openTab(t)}>{t}</MenuRow>)}
          <MenuDivider />
          {[['Stroke', 'Stroke'], ['Colour', 'Color'], ['Swatches', 'Swatches']].map(([id, label]) => <MenuRow key={id} onClick={() => openColorPane(id)}>{label}</MenuRow>)}
          <MenuRow onClick={openColorModes}>Color Modes</MenuRow>
          <MenuDivider />
          {[...(kinetic ? ['Transport'] : []), 'Output', 'File'].map((t) => (
            <MenuRow key={t} onClick={() => { if (kinetic && !timelineUp) toggleTimelinePinned(); openTab(t) }}>{t}</MenuRow>
          ))}
        </MenuNest>
        <MenuNest label="Right rail">
          {['Inspector', 'Parameters', ...(fx() ? ['Effects'] : [])].map((t) => <MenuRow key={t} onClick={() => openTab(t)}>{t}</MenuRow>)}
        </MenuNest>
        {kinetic && <MenuRow onClick={toggleTimelinePinned} checked={timelinePinned}>Timeline</MenuRow>}
        <MenuDivider />
        <MenuNest label="Workspace">
          <MenuRow onClick={onSaveWorkspace}>Save workspace…</MenuRow>
          {Object.keys(workspace.saved).length > 0 && <MenuDivider />}
          {Object.keys(workspace.saved).map((n) => <MenuRow key={n} onClick={() => applyWorkspace(n)} checked={n === workspaceName}>{n}</MenuRow>)}
          <MenuDivider />
          <MenuRow onClick={resetWorkspace}>Reset workspace</MenuRow>
        </MenuNest>
        <MenuDivider />
        {/* no shell rail in this app: the row is greyed, as the real one is without a shell */}
        <MenuRow disabled shortcut={key('toggle-rail')}>Show / hide rail</MenuRow>
        <MenuRow onClick={send('kol:open-settings')} shortcut={key('settings-drawer')}>Show / hide settings</MenuRow>
      </>
    ) },
    { label: 'Help', children: <MenuRow onClick={send('kol:show-shortcuts')} shortcut={key('show-shortcuts')}>Show / hide shortcuts</MenuRow> },
  ]
  return <MenuBar menus={menus} />
}
