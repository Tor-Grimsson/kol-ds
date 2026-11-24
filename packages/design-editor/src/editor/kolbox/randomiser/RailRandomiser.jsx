import { useEffect, useRef, useState } from 'react'
import {
  allScopeParams, computeFilterRoll, computePresetRoll, computeRoll, deriveScopes, effectHost, groupById, loopById, openFiles, pack,
  presetLayerPatch, presetsInGroup, resolvedChain, transport, useComposeFile, useComposeState, useLabsKeys, useRollSeed,
} from './engine.js'
import { useClock } from '../labs/Transport.jsx'
import ModalRollScopes from '../labs/ModalRollScopes.jsx'
import { CategoryScreen, EffectScreen, Row } from './Screens.jsx'
import Icon from '../ui/Icon.jsx'
import { Button, ButtonGroup, Input, TabsRow, Tooltip, Rail } from '@kolkrabbi/kol-component'

/* The randomiser's control panel (the real MobileOverlay, editor/mobile/MobileOverlay.jsx), in kolbox's kit. Its parts
   and order are the real one's:
     header   the title (the generator and the preset, or Media) is the collapse control; Start over at its right
     tabs     Generate, Effects, Transport, Output (a picture has no Generate; no Effects where the layer takes none)
     Generate Preset (shuffles the preset), Generator (the generator list); Randomize all, What Randomize all rolls (the
              Randomize all rolls window, Labs' own), Reset to defaults (R); the scopes as strips, then Re-trigger
     Effects  Add effect (the effect list), Randomize (while there is a chain); the chain in render order, a row removes
              its effect, its scopes under it
     Transport Play and Pause, the loop length, Stop and Rewind; the 2, 4, 8 and 16 s loop chips
     Output   the aspects 9:16, 3:5, 4:5, 1:1 and 5:4, 5:3, 16:9, Fill; Save…, Download, Hide UI, Start over
   Collapsed: the preset name to open it again, then Randomize all, Download, Hide UI and Fill as icons. Hide UI: nothing
   but the stage, a tap anywhere brings it back. R resets, Shift+R rolls everything (the real useLabsKeys).
   The frame is the device's, as the real: at a desk the right Rail (kolbox's 240), on a phone or a window under 768 a
   Rail along the bottom, half the display (tall on the grab, which also drags), the stage above it (onSheet).
   Morph files open in Morph in kolbox, so the real Morph tab (a morph file opened here) has nothing to show. */
const TABS_LOOP = [{ value: 'generate', label: 'Generate' }, { value: 'effects', label: 'Effects' }, { value: 'transport', label: 'Transport' }, { value: 'output', label: 'Output' }]
const TABS_MEDIA = TABS_LOOP.filter((t) => t.value !== 'generate')
const ASPECT_ROW_1 = ['9:16', '3:5', '4:5', '1:1'].map((v) => ({ value: v, label: v }))
const ASPECT_ROW_2 = [...['5:4', '5:3', '16:9'].map((v) => ({ value: v, label: v })), { value: 'fill', label: 'Fill' }]
const LOOP_CHIPS = [2, 4, 8, 16].map((s) => ({ value: String(s), label: `${s}s` }))
const SHEET_H = { half: '50dvh', tall: '85dvh' }
const SHEET_MIN = 96

/* The real packRows: a strip holds cells while (cells × the widest label) fits the panel; the labels stay whole and the
   rows bend. ponytail: 7px a character is Inter 12's advance, estimated; 24 is a tab's padding. */
const CH = 7
const CELL_PAD = 24
function packRows(cells, budget) {
  const rows = []
  let row = [], maxW = 0
  for (const c of cells) {
    const w = c.label.length * CH + CELL_PAD
    const m = Math.max(maxW, w)
    if (row.length && (row.length + 1) * m > budget) { rows.push(row); row = [c]; maxW = w } else { row.push(c); maxW = m }
  }
  if (row.length) rows.push(row)
  return rows
}
/* stateless strips: Tabs with no current tab, each cell a one-shot action (the real ButtonGroup value={null}) */
function ScopeStrips({ cells, budget }) {
  return packRows(cells, budget).map((row, i) => (
    <TabsRow variant="kolbox" key={i} tabs={row} value={null} onChange={(v) => row.find((c) => c.value === v)?.run()} className="w-full" />
  ))
}

/* the real TransportBar: Play and Pause with the state lit, the loop field filling the row, Stop and Rewind */
function TransportRow() {
  const c = useClock()
  const length = `${Math.round(c.loopSeconds * 100) / 100} s`
  const commit = (e) => { const n = parseFloat(e.target.value); if (n > 0) c.setLoopSeconds(n); else e.target.value = length }
  return (
    <div className="flex items-center gap-2">
      <ButtonGroup layout="joined" variant="kolbox" options={[
        { icon: 'play', ariaLabel: 'Play', pressed: c.playing, onPress: c.play },
        { icon: 'pause', ariaLabel: 'Pause', pressed: !c.playing, onPress: c.pause },
      ]}/>
      <Input variant="kolbox" key={length} prefix="Loop /" aria-label="Loop length in seconds" defaultValue={length} onBlur={commit} onKeyDown={(e) => e.key === 'Enter' && e.currentTarget.blur()} className="flex-1" />
      <ButtonGroup layout="joined" variant="kolbox" options={[
        { icon: 'stop', ariaLabel: 'Stop', onPress: c.stop },
        { icon: 'rewind', ariaLabel: 'Rewind', onPress: c.rewind },
      ]}/>
    </div>
  )
}
function LoopChips() {
  const c = useClock()
  return <TabsRow variant="kolbox" tabs={LOOP_CHIPS} value={String(c.loopSeconds)} onChange={(v) => c.setLoopSeconds(Number(v))} className="w-full" />
}

const Tip = ({ label, children }) => <Tooltip variant="kolbox" label={label}>{children}</Tooltip>

export default function RailRandomiser({ layer, onSwitchCategory, onInsert, onRestart, aspectValue, onAspect, openEffects = false, rail = false, onRail, onSheet }) {
  const { updateLayer, addFilter, removeFilter, aspect } = useComposeState()
  const { onExportPng } = useComposeFile()
  const [uiHidden, setUiHidden] = useState(false)
  const [open, setOpen] = useState(true)
  const [showCats, setShowCats] = useState(false)
  const [showFx, setShowFx] = useState(false)
  const [tab, setTab] = useState('generate')
  const [tall, setTall] = useState(false)
  const [sheetPx, setSheetPx] = useState(null)
  const [scopesOpen, setScopesOpen] = useState(false)
  const seed = useRollSeed(layer)
  useEffect(() => { if (openEffects) { setOpen(true); setShowFx(true) } }, [openEffects])

  const railShown = rail && !!layer && open && !uiHidden
  useEffect(() => { onRail?.(railShown); return () => onRail?.(false) }, [railShown]) // eslint-disable-line react-hooks/exhaustive-deps
  const sheetShown = !rail && !!layer && open && !uiHidden
  const sheetH = sheetShown ? (sheetPx ? `${sheetPx}px` : tall ? SHEET_H.tall : SHEET_H.half) : null
  useEffect(() => { onSheet?.(sheetH); return () => onSheet?.(null) }, [sheetH]) // eslint-disable-line react-hooks/exhaustive-deps

  const resetLayer = () => {
    const preset = layer?.type === 'loop' && presetsInGroup(layer.loopGroup).find((p) => p.id === layer.presetId)
    if (preset) updateLayer(layer.id, presetLayerPatch(preset, layer.loopGroup))
  }
  useLabsKeys(resetLayer, () => {
    if (layer?.type !== 'loop') return
    updateLayer(layer.id, computeRoll(layer, allScopeParams(loopById(layer.loopId)?.params ?? [], layer), seed.take(), { withFilters: true }))
  })

  /* the sheet's grab: a tap swaps half and tall, a drag follows the finger and, let go under 96, collapses */
  const drag = useRef({ y: null, h0: 0, moved: false, swallow: false })
  if (!layer) return null
  if (uiHidden) return <button type="button" aria-label="Show controls" className="fixed inset-0 z-20" onClick={() => setUiHidden(false)} />

  const isLoop = layer.type === 'loop'
  const schema = isLoop ? (loopById(layer.loopId)?.params ?? []) : []
  const scopes = isLoop ? deriveScopes(schema, layer) : []
  const rollAll = () => updateLayer(layer.id, computeRoll(layer, allScopeParams(schema, layer), seed.take(), { withFilters: true }))
  const rollScope = (scope) => updateLayer(layer.id, computeRoll(layer, scope.params, seed.take(), { stripNoRandom: !!scope.motion }))
  const shufflePreset = () => { const patch = computePresetRoll(layer, seed.take()); if (patch) updateLayer(layer.id, patch) }
  const chain = resolvedChain(layer)
  const { effectable } = effectHost(layer)
  const rollFilters = () => { const filters = computeFilterRoll(layer, seed.take()); if (filters) updateLayer(layer.id, { filters }) }
  const budget = rail ? 208 : Math.min(window.innerWidth, 480) - 32
  const fill = aspectValue === 'fill'

  const sheets = (
    <>
      <ModalRollScopes open={scopesOpen} onClose={() => setScopesOpen(false)} schema={schema} layer={layer} />
      {showCats && (
        <CategoryScreen
          onPick={(entry) => { onSwitchCategory(entry); setShowCats(false) }}
          onInsert={() => { setShowCats(false); onInsert() }}
          onBack={() => { setShowCats(false); onRestart() }}
          onDismiss={() => setShowCats(false)}
        />
      )}
      {showFx && <EffectScreen layer={layer} chain={chain} onPick={(id) => { addFilter(layer.id, id); setShowFx(false) }} onBack={() => setShowFx(false)} />}
    </>
  )

  if (!open) {
    return (
      <>
        {sheets}
        <div className="pointer-events-none fixed inset-x-0 bottom-3 z-10 flex items-center gap-2 px-4 *:pointer-events-auto" data-randomiser-pills>
          <Button variant="kolbox" onClick={() => setOpen(true)} className="min-w-0 shrink">
            <span className="truncate">{isLoop ? layer.presetLabel : 'Media'}</span>
            <Icon name="chevron-down" className="rotate-180" />
          </Button>
          {(isLoop || chain.length > 0) && <Tip label="Randomize all"><Button variant="kolbox" iconLeft="bolt" aria-label="Randomize all" onClick={rollAll}/></Tip>}
          <Tip label="Download"><Button variant="kolbox" iconLeft="download" aria-label="Download" onClick={() => onExportPng(2)}/></Tip>
          <Tip label="Hide UI"><Button variant="kolbox" iconLeft="eye-off" aria-label="Hide UI" onClick={() => setUiHidden(true)}/></Tip>
          <Tip label={fill ? 'Back to the frame' : 'Fill the screen'}>
            <Button variant="kolbox" iconLeft="maximize" aria-label={fill ? 'Back to the frame' : 'Fill the screen'} aria-pressed={fill} onClick={() => onAspect(fill ? aspect : 'fill')}/>
          </Tip>
        </div>
      </>
    )
  }

  const tabs = (isLoop ? TABS_LOOP : TABS_MEDIA).filter((t) => (t.value !== 'effects' || effectable) && (t.value !== 'transport' || pack('motion')))
  const activeTab = tabs.some((t) => t.value === tab) ? tab : tabs[0].value

  const header = (
    <div className="flex h-12 items-center gap-2 px-4" data-rail-header>
      <button type="button" onClick={() => setOpen(false)} aria-label="Collapse" className="flex min-w-0 flex-1 items-center gap-2 rounded-control text-left outline-none focus-visible:outline-solid focus-visible:outline-1 focus-visible:outline-accent">
        {/* the real "group · preset", the two names on two lines as the real rail wraps them (no separator) */}
        <span className="flex min-w-0 flex-col">
          <span className="truncate text-section text-text">{isLoop ? groupById(layer.loopGroup).label : 'Media'}</span>
          {isLoop && <span className="truncate font-mono text-meta text-muted">{layer.presetLabel}</span>}
        </span>
        <Icon name="chevron-down" className="text-muted" />
      </button>
      <Button variant="kolbox" tone="ghost" onClick={onRestart}>Start over</Button>
    </div>
  )

  const body = (
    <div className="flex flex-col gap-2 px-4 pb-4" data-randomiser-body>
      <TabsRow variant="kolbox" tabs={tabs} value={activeTab} onChange={setTab} className="mb-1 w-full" />
      {activeTab === 'generate' && isLoop && (
        <>
          <div className="grid grid-cols-2 gap-2">
            <Button variant="kolbox" onClick={shufflePreset}>Preset<Icon name="refresh" /></Button>
            <Button variant="kolbox" onClick={() => setShowCats(true)}>Generator</Button>
          </div>
          <div className="flex gap-2">
            <Button variant="kolbox" className="min-w-0 flex-1" onClick={rollAll}>Randomize all</Button>
            <Tip label="What Randomize all rolls"><Button variant="kolbox" iconOnly="nav-settings" aria-label="What Randomize all rolls" className="bg-field" onClick={() => setScopesOpen(true)}/></Tip>
            <Tip label={<>Reset to defaults<span className="ml-2 font-mono text-meta text-muted">R</span></>}><Button variant="kolbox" iconOnly="refresh" aria-label="Reset to defaults" className="bg-field" onClick={resetLayer}/></Tip>
          </div>
          {scopes.length > 0 && (
            <ScopeStrips budget={budget} cells={[
              ...scopes.map((s) => ({ value: s.id, label: s.label, run: () => rollScope(s) })),
              { value: '__retrigger', label: 'Re-trigger', run: () => transport.rewind() },
            ]} />
          )}
        </>
      )}
      {activeTab === 'effects' && (
        <>
          <div className="grid grid-cols-2 gap-2">
            <Button variant="kolbox" onClick={() => setShowFx(true)}>Add effect</Button>
            {chain.length > 0 && <Button variant="kolbox" onClick={rollFilters}>Randomize</Button>}
          </div>
          {chain.map((stage, i) => {
            const view = { ...layer, ...stage.params, id: layer.id }
            const stageScopes = stage.def ? deriveScopes(stage.def.params, view) : []
            const rollStage = (sc) => {
              const patch = computeRoll(view, sc.params, seed.take(), { stripNoRandom: !!sc.motion })
              const bare = chain.map(({ def: _def, ...s }) => s)
              updateLayer(layer.id, { filters: bare.map((s, j) => (j === i ? { ...s, params: { ...s.params, ...patch } } : s)) })
            }
            return (
              <div key={stage.key ?? i} className="flex flex-col gap-2">
                <Row icon="trash" label={`${i + 1}. ${stage.def?.label ?? stage.id}`} onClick={() => removeFilter(layer.id, i)} />
                {stageScopes.length > 0 && <ScopeStrips budget={budget} cells={stageScopes.map((sc) => ({ value: sc.id, label: sc.label, run: () => rollStage(sc) }))} />}
              </div>
            )
          })}
        </>
      )}
      {activeTab === 'transport' && (
        <>
          <TransportRow />
          <LoopChips />
        </>
      )}
      {activeTab === 'output' && (
        <>
          <TabsRow variant="kolbox" tabs={ASPECT_ROW_1} value={aspectValue} onChange={onAspect} className="w-full" />
          <TabsRow variant="kolbox" tabs={ASPECT_ROW_2} value={aspectValue} onChange={onAspect} className="w-full" />
          <div className="grid grid-cols-2 gap-2">
            {/* a roll saved as a file, a labs file (the package's Files window, ⌘S), so it lists on Home */}
            <Button variant="kolbox" onClick={() => openFiles({ focusName: true })}>Save…</Button>
            <Button variant="kolbox" onClick={() => onExportPng(2)}>Download</Button>
            <Button variant="kolbox" onClick={() => setUiHidden(true)}>Hide UI</Button>
            <Button variant="kolbox" onClick={onRestart}>Start over</Button>
          </div>
        </>
      )}
    </div>
  )

  if (rail) {
    return (
      <>
        {sheets}
        <div className="fixed inset-y-0 right-0 z-10" data-randomiser-rail>
          <Rail variant="kolbox" side="right" aria-label="Randomiser" header={header}>{body}</Rail>
        </div>
      </>
    )
  }

  const d = drag.current
  const grab = {
    onPointerDown: (e) => { d.y = e.clientY; d.moved = false; d.h0 = window.innerHeight - e.currentTarget.getBoundingClientRect().top; e.currentTarget.setPointerCapture?.(e.pointerId) },
    onPointerMove: (e) => {
      if (d.y === null) return
      const dy = e.clientY - d.y
      if (Math.abs(dy) > 4) d.moved = true
      if (d.moved) setSheetPx(Math.max(SHEET_MIN, Math.min(window.innerHeight * 0.92, d.h0 - dy)))
    },
    onPointerUp: (e) => {
      if (d.y === null) return
      const px = d.h0 - (e.clientY - d.y); d.y = null
      if (!d.moved) return
      d.swallow = true
      if (px < SHEET_MIN) { setSheetPx(null); setOpen(false) }
    },
    onPointerCancel: () => { d.y = null },
    onClick: () => { if (d.swallow) { d.swallow = false; return } setSheetPx(null); setTall((v) => !v) },
  }
  return (
    <>
      {sheets}
      <section
        aria-label="Randomiser"
        data-randomiser-sheet
        className="fixed inset-x-0 bottom-0 z-10 flex flex-col bg-panel pb-[env(safe-area-inset-bottom)] before:absolute before:inset-x-0 before:top-0 before:h-px before:bg-border"
        style={{ top: `calc(100dvh - ${sheetH})` }}
      >
        <button type="button" aria-label={tall ? 'Lower the sheet' : 'Raise the sheet'} aria-pressed={tall} className="flex h-6 w-full shrink-0 touch-none items-center justify-center" {...grab}>
          <span className="h-1 w-9 rounded-full bg-border" />
        </button>
        {header}
        <div className="min-h-0 flex-1 overflow-y-auto">{body}</div>
      </section>
    </>
  )
}
