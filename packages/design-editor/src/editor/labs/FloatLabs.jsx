import '../styles/kol-labs.css'
import '../styles/kol-editor.css'
import { useEffect, useRef } from 'react'
import { useMediaQuery } from '@kolkrabbi/kol-component'
import { AppFloatNav, DocumentCapsule, FloatLayout, GlobalActions, PropertyRail } from '@kolkrabbi/kol-shell'
import { EditorProviders } from '../Editor'
import { OutputCanvas } from '../OutputView'
import { useComposeState } from '../compose/state'
import { useGlobalShortcuts } from '../state/useGlobalShortcuts'
import { openFiles } from '../library/filesDialogStore'
import FilesDialogHost from '../library/FilesDialogHost'
import EditorFooter from '../shell/panels/EditorFooter'
import { openTab } from '../shell/openTab'
import { transport } from '../params/transport'
import { navigateTo } from '../mode'
import { useLabsLayer } from './useLabsLayer'
import { buildLabsCatalog, SECTION_ICONS } from './catalog'
import LabsParams from './LabsParams'
import { LabsSourceCard } from './LabsSourcePicker'
import { sheetLabels } from './sheetLabels'
import { LABS_DRAFT_KEY } from './LabsView'
import { MODES, MODES_MORE, goPath, Transport } from '../float/FloatEditorShell'
import { toMoreRows } from '../float/useFloatMenus'

/**
 * FloatLabsView — Labs in the float chrome, on kol-shell's `FloatLayout` (plan-2026-11-05-float-editor 3.2, his ruling
 * 2026-11-06: A and B *"neither is using float correctly"* — they hand-placed a NavRail; A and B were the frame's own
 * expanded and collapsed Rail). `LabsView` stays as it is; this is a second chrome over the same labs engine — the
 * catalog (`buildLabsCatalog`, LabsNav's data), the one-layer invariant (`useLabsLayer`), LabsParams, the transport.
 *
 * The frame's nav Rail is the catalog (expanded 280 with every section open, collapsed 72 with a section's groups in the
 * flyout, hidden behind RailTrigger + the breadcrumb; `\` and `⇧\`). The bar: the document capsule (the commands in its
 * ▾) · the transport · undo · redo · Export · account. The inspector slot holds the params Rail (LabsParams and the
 * Transport · Output · File foot); the bottom Rail the mode switch. The stage is the content.
 */

/* the labs commands, in MenuBar's shape */
function useLabsMenus() {
  const { undo, redo, canUndo, canRedo } = useComposeState()
  const cmd = (fn) => () => fn()
  const event = (name) => () => window.dispatchEvent(new CustomEvent(name))
  const app = { label: 'FXR', items: [
    { label: 'Home', onClick: () => navigateTo('/') },
    { label: 'Settings', onClick: () => navigateTo('/settings') },
  ] }
  const menus = [
    { label: 'File', width: 240, items: [
      { label: 'Files…', kbd: '⌘O', onClick: cmd(() => openFiles()) },
      { label: 'Save patch', kbd: '⌘S', onClick: () => openTab('File') },
      { divider: true },
      { label: 'Output…', onClick: () => openTab('Output') },
      { label: 'File…', onClick: () => openTab('File') },
    ] },
    { label: 'Edit', width: 220, items: [
      { label: 'Undo', kbd: '⌘Z', disabled: !canUndo, onClick: undo },
      { label: 'Redo', kbd: '⇧⌘Z', disabled: !canRedo, onClick: redo },
    ] },
    { label: 'View', width: 240, items: [
      { label: 'Play / pause', kbd: 'Space', onClick: () => transport.toggle() },
      { label: 'Rewind', onClick: () => transport.rewind() },
      { divider: true },
      { label: 'Transport', onClick: () => openTab('Transport') },
      { label: 'Shortcuts', kbd: 'S', onClick: event('kol:show-shortcuts') },
    ] },
  ]
  const end = [{ label: 'Help', items: [{ label: 'Keyboard shortcuts', kbd: 'S', onClick: event('kol:show-shortcuts') }] }]
  return { app, menus, end }
}

/* the catalog as NavRail float rows: a section, its groups under it; a group's press runs its first leaf (LabsNav's rule) */
function useLabsNav() {
  const { addFilter, patchFilter } = useComposeState()
  const { layer, setOnly } = useLabsLayer()
  const last = useRef(null)
  useEffect(() => {
    if (layer?.type === 'photo' && layer.src) last.current = { src: layer.src, srcType: layer.srcType, fit: layer.fit }
  }, [layer?.type, layer?.src, layer?.srcType, layer?.fit])
  const carriedSource = () => (layer?.type === 'photo' ? { src: layer.src, srcType: layer.srcType, fit: layer.fit } : (last.current ?? {}))
  const tree = buildLabsCatalog({ layer, setOnly, addFilter, patchFilter, carriedSource })
  const items = []
  const run = new Map()
  let active = null
  tree.forEach((e) => {
    if (e.id.startsWith('sec:')) { items.push({ icon: SECTION_ICONS[e.id.slice(4)] ?? 'square', label: e.label, path: e.id, sub: [] }); return }
    const pages = e.pages ?? []
    const own = e.onSelect ?? pages[0]?.onSelect ?? pages[0]?.children?.[0]?.onSelect
    if (own) run.set(e.id, own)
    if (e.active || pages.some((p) => p.active || p.children?.some((c) => c.active))) active = e.id
    const row = { icon: e.icon, label: e.label, path: e.id }
    const sec = items[items.length - 1]
    if (sec?.sub) sec.sub.push(row)
    else items.push(row)
  })
  return { items, active, pick: (path) => run.get(path)?.() }
}

/* the stage: the one labs layer at labs' resting fit, the source card while an effect waits for media */
function FloatLabsStage() {
  const { layer } = useLabsLayer()
  const { removeLayer } = useComposeState()
  const needsSource = layer?.type === 'photo' && !layer.src && layer.srcType !== 'webcam'
  return (
    <div className="kol-float-labs-stage relative h-full min-h-[360px] flex items-center justify-center overflow-hidden rounded-[var(--kol-float-window-r)]" style={{ background: 'var(--kol-surface-secondary)' }}>
      <div style={{ flex: 'none', width: '85%', height: '85%' }}><OutputCanvas /></div>
      {needsSource && <LabsSourceCard layer={layer} title={sheetLabels(layer).title} onBack={() => removeLayer(layer.id)} />}
    </div>
  )
}

function FloatLabsBody() {
  useGlobalShortcuts()
  const phone = useMediaQuery('(max-width: 767px)')
  const { layer } = useLabsLayer()
  const { undo, redo, canUndo, canRedo, selectedId, select } = useComposeState()
  /* labs' one layer stays selected — every inspector in the params Rail reads `selectedId` */
  useEffect(() => { if (layer && selectedId !== layer.id) select(layer.id) }, [layer, selectedId, select])
  const { menus, end } = useLabsMenus()
  const nav = useLabsNav()
  const title = layer ? sheetLabels(layer).title : 'Labs'
  /* every section opens on its groups while the Rail is expanded */
  const open = nav.items.filter((i) => i.sub?.length).map((i) => i.path)

  const capsule = <DocumentCapsule name={title || 'Untitled'} status="Labs" onBack={() => navigateTo('/')}
    menuItems={toMoreRows([...menus, ...end].map((m) => ({ label: m.label, items: m.items })))} />
  const actions = <GlobalActions onUndo={() => canUndo && undo()} onRedo={() => canRedo && redo()} onAction={() => openTab('Output')} onAccount={() => navigateTo('/settings')} />
  const modes = <AppFloatNav variant="mobile" shape="pill" labels={!phone} items={MODES} sheetItems={MODES_MORE} currentPath="/labs" onNavigate={goPath} />

  return (
    <div className="kol-float-labs kol-editor-shell" data-editor-keep-selection>
    <FloatLayout
      nav={nav.items} currentPath={nav.active ?? ''} onNavigate={nav.pick} title="Labs" icon="globe" defaultExpanded={open}
      breadcrumb={['FXR', 'Labs', title || 'Untitled']}
      bar={{ start: capsule, center: phone ? undefined : <Transport />, end: actions }}
      inspectorLabel="Parameters"
      inspector={({ hide }) => (
        <PropertyRail title={title || 'Parameters'} onCollapse={hide} width={phone ? '100%' : 352} density="compact" surface="solid"
          sections={[{ id: 'labs-params', label: 'Parameters', rows: [{ id: 'body', render: () => <div className="kol-editor-labs"><div className="kol-compose-inspector-body"><LabsParams /></div></div> }] }]}
          footer={<div className="kol-editor-labs"><EditorFooter /></div>} />
      )}
      bottom={phone ? modes : <div className="w-[418px] h-[66px] [transform:translateZ(0)] [&_.kol-mobile-tabbar]:!flex">{modes}</div>}
    >
      <FloatLabsStage />
    </FloatLayout>
    </div>
  )
}

export default function FloatLabsView() {
  return (
    <EditorProviders draftKey={LABS_DRAFT_KEY}>
      <FloatLabsBody />
      <FilesDialogHost />
    </EditorProviders>
  )
}
