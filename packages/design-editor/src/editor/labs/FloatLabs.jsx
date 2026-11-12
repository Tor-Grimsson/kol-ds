import '../styles/kol-labs.css'
import '../styles/kol-editor.css'
import { useEffect, useRef, useState } from 'react'
import { NavRail, useMediaQuery } from '@kolkrabbi/kol-component'
import { PropertyRail, RailDisplayControls, RailTrigger } from '@kolkrabbi/kol-shell'
import { EditorProviders } from '../Editor'
import { ChromeContext } from '../float/chrome'
import { OutputCanvas } from '../OutputView'
import { useComposeState } from '../compose/state'
import { useGlobalShortcuts } from '../state/useGlobalShortcuts'
import FilesDialogHost from '../library/FilesDialogHost'
import EditorFooter from '../shell/panels/EditorFooter'
import { useLabsLayer } from './useLabsLayer'
import { buildLabsCatalog, SECTION_ICONS } from './catalog'
import LabsParams from './LabsParams'
import { LabsSourceCard } from './LabsSourcePicker'
import { sheetLabels } from './sheetLabels'
import { LABS_DRAFT_KEY, useLabsBoot } from './LabsView'
import { Transport } from '../float/FloatEditorShell'
import Movable from '../float/Movable'

/**
 * FloatLabsView — Labs in float style: labs' two Rails, floating (the user, 2026-11-12: *"it should just be like labs,
 * 2 rails but in float style"*). The stage fills the window; the catalog Rail (NavRail float) floats left and the params
 * Rail (LabsParams and the Output · File foot) floats right, both over the stage at the 24 inset; the transport is its float
 * window, under the params Rail at the bottom-right, and movable. `LabsView`
 * stays as it is; this is a second chrome over the same labs engine.
 */

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
    <div className="kol-float-labs-stage absolute inset-0 flex items-center justify-center overflow-hidden bg-surface-primary">
      <div style={{ flex: 'none', width: '85%', height: '85%' }}><OutputCanvas /></div>
      {needsSource && <LabsSourceCard layer={layer} title={sheetLabels(layer).title} onBack={() => removeLayer(layer.id)} />}
    </div>
  )
}

function FloatLabsBody() {
  useGlobalShortcuts()
  useLabsBoot()
  const phone = useMediaQuery('(max-width: 767px)')
  const { layer } = useLabsLayer()
  const { selectedId, select } = useComposeState()
  /* labs' one layer stays selected — every inspector in the params Rail reads `selectedId` */
  useEffect(() => { if (layer && selectedId !== layer.id) select(layer.id) }, [layer, selectedId, select])
  const nav = useLabsNav()
  const title = layer ? sheetLabels(layer).title : 'Labs'
  /* every section opens on its groups while the Rail is expanded */
  const open = nav.items.filter((i) => i.sub?.length).map((i) => i.path)
  const [collapsed, setCollapsed] = useState(phone)
  const [hidden, setHidden] = useState(false)
  const [transportMoved, setTransportMoved] = useState(false)

  return (
    <div className="kol-float-labs kol-editor-shell relative h-dvh overflow-hidden" data-editor-keep-selection>
      <FloatLabsStage />
      {hidden
        ? <RailTrigger items={nav.items} currentPath={nav.active ?? ''} onNavigate={nav.pick} title="Labs" breadcrumb={['Labs', title]}
            onRestore={() => setHidden(false)} className="absolute left-6 top-6 z-[var(--kol-z-sticky)]" />
        : <NavRail variant="float" items={nav.items} currentPath={nav.active ?? ''} onNavigate={nav.pick} title="Labs" icon="globe"
            defaultExpanded={open} collapsed={collapsed} onCollapsedChange={setCollapsed} onHide={() => setHidden(true)}
            footer={collapsed ? undefined : <RailDisplayControls onCollapse={() => setCollapsed(true)} onHide={() => setHidden(true)} />}
            className="absolute inset-y-6 left-6 z-[var(--kol-z-sticky)] !h-auto" />}
      {/* under the params Rail, bottom-right; grab it to move it — while it sits there the Rail stops 24 above it (48 + 24) */}
      {!phone && <Movable id="labs-transport" start={{ right: 24, bottom: 24 }} onMoved={setTransportMoved}><Transport /></Movable>}
      <div className={`absolute top-6 right-6 ${!phone && !transportMoved ? 'bottom-24' : 'bottom-6'} z-[var(--kol-z-sticky)] flex flex-col pointer-events-none [&>*]:pointer-events-auto`}>
          <PropertyRail title={title || 'Parameters'} width={phone ? 300 : 352} density="compact" surface="solid"
            className="max-h-full min-h-0 overflow-y-auto [scrollbar-width:none] [&_.kol-compose-inspector-body]:!p-0"
            sections={[{ id: 'labs-params', label: 'Parameters', rows: [{ id: 'body', render: () => <div className="kol-editor-labs"><div className="kol-compose-inspector-body"><LabsParams /></div></div> }] }]}
            footer={<div className="kol-editor-labs"><EditorFooter /></div>} />
      </div>
    </div>
  )
}

export default function FloatLabsView() {
  return (
    <ChromeContext.Provider value="float">
      <EditorProviders draftKey={LABS_DRAFT_KEY} modalVariant="float">
        <FloatLabsBody />
        <FilesDialogHost />
      </EditorProviders>
    </ChromeContext.Provider>
  )
}
