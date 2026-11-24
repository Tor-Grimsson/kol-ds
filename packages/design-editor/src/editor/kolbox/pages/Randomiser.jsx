import { useEffect, useRef, useState, useSyncExternalStore } from 'react'
import { hostClient, hostStore } from '../host.js'
import { sampleMediaClient } from '../app/sampleMedia.js'
import {
  CANVAS_W, FilesDialogHost, firstPresetPatch, groupOfPreset, KINETIC_PRESETS, loopById, OutputCanvas, presetById,
  presetComp, presetLayerPatch, PRESET_SIZES, setMediaClient, setMountedView, setSettingsStore, transport, useComposeState,
  useTool,
} from '../randomiser/engine.js'
import { EntryScreen, CategoryScreen, SourceScreen } from '../randomiser/Screens.jsx'
import RailRandomiser from '../randomiser/RailRandomiser.jsx'
import { WindowMediaPickerHost } from '../editor/windows/WindowMediaPicker.jsx'
import Providers from '../app/Providers.jsx'
import MenuMain, { appRows } from '../ui/MenuMain.jsx'
import Icon from '../ui/Icon.jsx'
import ModalSearchHost from '../search/ModalSearchHost.jsx'
import { Tooltip } from '@kolkrabbi/kol-component'

/* The Randomiser (round 4, W11): the real MobileView (packages/design-editor/src/editor/mobile/MobileView.jsx), its
   flow and rules, in kolbox's kit, on the engine through this screen's own providers. His ruling: a simplified Labs,
   mainly for a phone, reached from Labs' rail (and the mark's Chromes, search and a Randomiser file), never a tab on the
   mode track; a phone opens on it.
   Flow: entry (Generate or Effects) → category (the generators, Insert image or video, Back) → live (the stage and the
   panel, randomiser/RailRandomiser.jsx). Effects makes the empty photo layer and asks for its media first (From library,
   Upload, Camera, Back); once it lands, the effect list opens. The session is EPHEMERAL, as the real one: no draft,
   nothing autosaved; a reload starts fresh. A file opened by address (`?open=`) lands live; a Randomiser file from the
   Library (`?preset=<id>&cat=<group>`, kolbox's form of the pick) lands live on that preset; `?start=category|effects`
   skips the entry card, as the real Home's phone doors do. The doors' params are read once and dropped.
   The stage: 4:5 in the space the panel leaves, letterboxed (Fill covers the display); one tap plays and pauses (not on
   Penrose, whose presses are the piece), two fingers pinch about their midpoint and move it, until Start over.
   The way out is the KOL mark with the one menu, as Home has it, held above the cards' dim. */
/* the host's media, or the sample library when it passed none (W4.2) */
setMediaClient(hostClient() ?? sampleMediaClient)
setSettingsStore(hostStore('kolbox-randomiser'))

/* the real frame rule (mobile/device.js): a touch device, or a window under 768, takes the bottom rail */
const NARROW = '(max-width: 767px), (pointer: coarse)'
const subscribe = (cb) => { const mq = window.matchMedia(NARROW); mq.addEventListener('change', cb); return () => mq.removeEventListener('change', cb) }
const useSheetFrame = () => useSyncExternalStore(subscribe, () => window.matchMedia(NARROW).matches)

const viewCss = (v) => `translate(${v.x}px, ${v.y}px) scale(${v.s})`

function Body() {
  const { layers, addLayer, removeLayer, updateLayer, canvasW, canvasH, aspect, setAspect } = useComposeState()
  const { setTool } = useTool()
  const sheet = useSheetFrame()
  const start = () => {
    const q = new URLSearchParams(window.location.search)
    return q.get('open') || q.get('preset') ? 'live' : q.get('start') === 'category' ? 'category' : 'entry'
  }
  const [screen, setScreen] = useState(start)
  const [fxFlow, setFxFlow] = useState(false)
  const [activeId, setActiveId] = useState(null)
  const [stageFit, setStageFit] = useState('contain')
  const [railShown, setRailShown] = useState(false)
  const [sheetH, setSheetH] = useState(null)

  useEffect(() => { setMountedView('randomiser'); return () => setMountedView(null) }, [])
  useEffect(() => {
    /* the provider seeds 1080 square under a 4:5 aspect; the real body sets 4:5 again, and the orbit tool for good */
    setAspect('4:5')
    setTool('orbit')
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const active = layers.find((l) => l.id === activeId) ?? (layers.length === 1 ? layers[0] : null)
  const pickerOpen = screen === 'live' && active?.type === 'photo' && !active.src && active.srcType !== 'webcam'
  /* the real Modal law: playback stops while the source picker is open (SourceScreen's sheet chrome) */

  const startGenerative = (entry) => {
    const patch = firstPresetPatch(entry)
    if (!patch) return
    setActiveId(addLayer('loop', patch))
    setScreen('live')
  }
  const switchCategory = (entry) => { const patch = firstPresetPatch(entry); if (patch && active) updateLayer(active.id, patch) }
  const startInsert = () => {
    const h = Math.round(CANVAS_W * canvasH / canvasW)
    setActiveId(addLayer('photo', { fit: 'cover', x: 0, y: 0, w: CANVAS_W, h }))
    setScreen('live')
  }

  /* the doors in the address, read once and dropped */
  useEffect(() => {
    const url = new URL(window.location.href)
    const door = url.searchParams.get('start')
    if (door === 'effects') { setFxFlow(true); startInsert() }
    const id = url.searchParams.get('preset')
    if (id) {
      const group = url.searchParams.get('cat') || groupOfPreset(id)
      const kt = KINETIC_PRESETS.find((p) => p.id === id)
      if (group && presetById(id)) setActiveId(addLayer('loop', presetLayerPatch(presetById(id), group)))
      else if (kt) setActiveId(addLayer('kinetic', { presetId: kt.id, presetLabel: kt.label, comp: presetComp(kt) }))
      else setScreen('entry')
    }
    if (!door && !id) return
    for (const k of ['start', 'preset', 'cat']) url.searchParams.delete(k)
    window.history.replaceState(window.history.state, '', url.pathname + url.search + url.hash)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  /* Output's aspect: a real aspect re-frames the composition and refits the layer to it; Fill only covers the display */
  const setStageAspect = (id) => {
    if (id === 'fill') { setStageFit('cover'); return }
    setStageFit('contain')
    setAspect(id)
    const sz = PRESET_SIZES[id]
    if (active && sz) updateLayer(active.id, { x: 0, y: 0, w: CANVAS_W, h: Math.round(CANVAS_W * sz.h / sz.w) })
  }

  /* the stage's view: pinch about the fingers and two-finger move; one tap plays and pauses */
  const [stageView, setStageView] = useState({ s: 1, x: 0, y: 0 })
  const stageRef = useRef(null)
  const pinch = useRef({ pts: new Map(), start: null, live: { s: 1, x: 0, y: 0 }, tap: null })
  const two = () => { const [a, b] = [...pinch.current.pts.values()]; return { d: Math.hypot(a.x - b.x, a.y - b.y), mx: (a.x + b.x) / 2, my: (a.y + b.y) / 2 } }
  const onDown = (e) => {
    const p = pinch.current
    p.pts.set(e.pointerId, { x: e.clientX, y: e.clientY })
    p.tap = p.pts.size === 1 ? { id: e.pointerId, x: e.clientX, y: e.clientY, t: performance.now() } : null
    if (p.pts.size === 2) {
      const r = stageRef.current?.getBoundingClientRect()
      const g = two()
      const ox = (r?.left ?? 0) - stageView.x, oy = (r?.top ?? 0) - stageView.y
      p.start = { ...g, ox, oy, v: stageView, px: (g.mx - ox - stageView.x) / stageView.s, py: (g.my - oy - stageView.y) / stageView.s }
      p.live = stageView
      transport.setStagePointer?.(null)
      e.stopPropagation()
    }
  }
  const onMove = (e) => {
    const p = pinch.current
    if (!p.pts.has(e.pointerId)) return
    p.pts.set(e.pointerId, { x: e.clientX, y: e.clientY })
    if (p.pts.size >= 2 && p.start) {
      e.stopPropagation()
      const g = two(), st = p.start
      const s = Math.min(4, Math.max(0.5, st.v.s * (g.d / st.d)))
      p.live = { s, x: g.mx - st.ox - s * st.px, y: g.my - st.oy - s * st.py }
      if (stageRef.current) stageRef.current.style.transform = viewCss(p.live)
    }
  }
  const onUp = (e) => {
    const p = pinch.current, tap = p.tap
    if (tap && tap.id === e.pointerId && e.type === 'pointerup' && screen === 'live'
        && performance.now() - tap.t < 350 && Math.hypot(e.clientX - tap.x, e.clientY - tap.y) < 12) {
      const def = active?.type === 'loop' ? loopById(active.loopId) : null
      if (def?.group !== 'penrose') transport.toggle()
    }
    if (tap?.id === e.pointerId) p.tap = null
    p.pts.delete(e.pointerId)
    if (p.pts.size < 2 && p.start) { p.start = null; setStageView(p.live) }
  }

  const restart = () => {
    for (const l of [...layers]) removeLayer(l.id)
    setActiveId(null)
    setStageView({ s: 1, x: 0, y: 0 })
    setFxFlow(false)
    setScreen(start())
  }

  /* the way out: the mark and the one menu, as Home has them; ⌘K asks for the search modal, as Home sends it */
  const markRef = useRef(null)
  const [mainOpen, setMainOpen] = useState(false)
  useEffect(() => {
    const on = (e) => {
      if (!(e.metaKey || e.ctrlKey) || e.key.toLowerCase() !== 'k' || e.target.closest?.('input, textarea, [contenteditable]')) return
      e.preventDefault()
      window.dispatchEvent(new CustomEvent('kolbox:search'))
    }
    window.addEventListener('keydown', on)
    return () => window.removeEventListener('keydown', on)
  }, [])

  return (
    <div className="relative h-dvh overflow-hidden bg-ground" data-randomiser>
      <div
        ref={stageRef}
        className="absolute inset-y-0 left-0 touch-none overflow-hidden"
        style={{ transform: viewCss(stageView), transformOrigin: '0 0', right: railShown ? 'var(--spacing-rail)' : 0, bottom: sheetH ?? 0 }}
        onPointerDownCapture={onDown}
        onPointerMoveCapture={onMove}
        onPointerUpCapture={onUp}
        onPointerCancelCapture={onUp}
        onPointerLeave={onUp}
        data-stage
      >
        <div className="kol-design-editor absolute inset-0" data-output><OutputCanvas fit={stageFit} /></div>
      </div>
      {screen === 'entry' && <EntryScreen onGenerate={() => setScreen('category')} onEffects={() => { setFxFlow(true); startInsert() }} />}
      {screen === 'category' && <CategoryScreen onPick={startGenerative} onInsert={startInsert} onBack={() => setScreen('entry')} />}
      {screen === 'live' && !pickerOpen && (
        <RailRandomiser
          layer={active}
          onSwitchCategory={switchCategory}
          onInsert={() => { restart(); startInsert() }}
          onRestart={restart}
          aspectValue={stageFit === 'cover' ? 'fill' : aspect}
          openEffects={fxFlow && !pickerOpen}
          onAspect={setStageAspect}
          rail={!sheet}
          onRail={setRailShown}
          onSheet={setSheetH}
        />
      )}
      {pickerOpen && <SourceScreen layer={active} onBack={restart} />}
      {/* the phone's way to the main menu: on a wide screen RailSwitcher's mark is (plan-2026-11-20 W1.1), under 768
          the switcher steps aside and this mark, the retired top rail's, stays over the stage's corner */}
      <Tooltip variant="kolbox" asChild label="Main menu">
      <button
        ref={markRef}
        type="button"
        aria-label="Main menu"
        aria-haspopup="menu"
        aria-expanded={mainOpen}
        onClick={() => setMainOpen((o) => !o)}
        data-mark
        className="fixed top-3 left-3 z-[60] inline-flex size-(--kol-ctl-28) shrink-0 items-center justify-center rounded-control bg-accent text-on-accent outline-none hover:brightness-110 focus-visible:outline-solid focus-visible:outline-1 focus-visible:outline-offset-1 focus-visible:outline-accent md:hidden"
      >
        <Icon name="wave" />
      </button>
      </Tooltip>
      <MenuMain anchor={markRef} open={mainOpen} onClose={() => setMainOpen(false)} app={appRows({ mode: 'randomiser' })} />
      <ModalSearchHost mode="randomiser" />
      <WindowMediaPickerHost />
      <FilesDialogHost />
    </div>
  )
}

/* the real MobileView's providers: no draft, nothing autosaved */
export default function Randomiser() {
  return (
    <Providers persistDraft={false}>
      <Body />
    </Providers>
  )
}
