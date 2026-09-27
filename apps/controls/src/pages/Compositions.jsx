import { useState } from 'react'
import {
  Knob, Toggle, LED, IconButton, LabeledJack, PanelLabel, ModuleFrame, ChannelStrip, FlipCard,
} from '@kolkrabbi/kol-hardware'
import {
  Button, RotaryDial, Slider, Dropdown, SegmentedToggle, ToggleSwitch, LabeledControl, LabeledControlSection,
  LayerStack, TimelineDock, CurveEditor, defaultCurveFor,
} from '@kolkrabbi/kol-component'
import Specimen from '../Specimen.jsx'

/* THE COMPOSITIONS — the panels consumers build. The frames are kol-hardware's since 2026-09-27
 * (user ruling: frames are the package's fifth group) — ModuleFrame, ChannelStrip and FlipCard —
 * so the module and the channel below ARE the shipped frames; each specimen still lists where the
 * same thing is hand-built, which is the adoption list. Reference, not wired. */

function ModuleFront() {
  const [on, setOn] = useState(true)
  const [rate, setRate] = useState(40)
  const [depth, setDepth] = useState(70)
  const [sync, setSync] = useState(false)
  return (
    <div className="w-40 border border-oq-08">
      <ModuleFrame label="LFO" enabled={on} onToggle={() => setOn((o) => !o)} className="bg-surface-primary">
        <div className="grid grid-cols-2 place-items-center gap-y-4">
          <Knob value={rate} onChange={setRate} label="rate" size="md" />
          <Knob value={depth} onChange={setDepth} label="depth" size="md" />
          <Toggle value={sync} onChange={setSync} label="sync" />
          <PanelLabel label="clk"><LED color="yellow" active={on} size="md" /></PanelLabel>
          <LabeledJack type="in" label="cv" color="#497DA2" />
          <LabeledJack type="out" label="out" />
        </div>
      </ModuleFrame>
    </div>
  )
}

const DIALS = ['INT', 'HUE', 'SAT', 'BRT', 'CTR', 'BLR']
const TILES = ['library', 'save', 'video']

function ChannelFront() {
  const [on, setOn] = useState(true)
  const [vals, setVals] = useState({ INT: 60, HUE: 0, SAT: 33, BRT: 33, CTR: 33, BLR: 0 })
  const [speed, setSpeed] = useState(100)
  const [opacity, setOpacity] = useState(80)
  const [tile, setTile] = useState(null)
  return (
    <ChannelStrip
      power={<Toggle value={on} onChange={setOn} label="on" horizontal />}
      controls={(
        <div className="grid grid-cols-3 gap-x-2 gap-y-1">
          {DIALS.map((d) => <RotaryDial key={d} label={d} value={vals[d]} onChange={(x) => setVals((v) => ({ ...v, [d]: x }))} size={36} />)}
        </div>
      )}
      actions={TILES.map((i) => <IconButton key={i} icon={i} active={tile === i} onClick={() => setTile((t) => (t === i ? null : i))} title={i} iconSize={14} />)}
      faders={(
        <>
          <Slider label="Speed" min={0} max={200} value={speed} onChange={setSpeed} formatValue={(x) => `${Math.round(x)}%`} />
          <Slider label="Opacity" min={0} max={100} value={opacity} onChange={setOpacity} formatValue={(x) => `${Math.round(x)}%`} />
        </>
      )}
      footer={<span className="kol-helper-10 text-fg-48">RESET · REC/LOOP · BOOST</span>}
    />
  )
}

function ChannelBack() {
  return (
    <div className="flex h-full flex-col gap-4 rounded-[4px] border border-oq-08 p-4" style={{ background: 'var(--kol-oq-04)' }}>
      <span className="kol-helper-10 text-meta">PATCH</span>
      <div className="grid grid-cols-4 place-items-center gap-4">
        {['in', 'cv', 'mod', 'key'].map((l) => <LabeledJack key={l} type="in" label={l} color="#4ade80" />)}
        {['out', 'fx', 'rec', 'mix'].map((l) => <LabeledJack key={l} type="out" label={l} />)}
      </div>
    </div>
  )
}

function Channel() {
  const [flipped, setFlipped] = useState(false)
  return (
    <div className="flex flex-col items-start gap-3">
      <FlipCard flipped={flipped} width={320} front={<ChannelFront />} back={<ChannelBack />} />
      <Button variant="grey" size="sm" onClick={() => setFlipped((f) => !f)}>{flipped ? 'Show front' : 'Show back'}</Button>
    </div>
  )
}

function ParamsRail() {
  const [speed, setSpeed] = useState(50)
  const [scale, setScale] = useState(30)
  const [theme, setTheme] = useState('kol')
  const [mode, setMode] = useState('loop')
  const [invert, setInvert] = useState(false)
  return (
    <div className="flex w-72 flex-col gap-6 rounded-[var(--kol-radius-sm)] bg-surface-primary p-4">
      <LabeledControlSection label="Generator">
        <LabeledControl label="MODE"><SegmentedToggle value={mode} onChange={setMode} options={[{ value: 'loop', label: 'Loop' }, { value: 'once', label: 'Once' }]} size="xs" /></LabeledControl>
        <LabeledControl label={`SPEED · ${speed}`}><Slider min={0} max={100} value={speed} onChange={setSpeed} /></LabeledControl>
        <LabeledControl label={`SCALE · ${scale}`}><Slider min={0} max={100} value={scale} onChange={setScale} /></LabeledControl>
      </LabeledControlSection>
      <LabeledControlSection label="Colour" divided>
        <LabeledControl label="THEME">
          <Dropdown value={theme} onChange={setTheme} variant="grey" size="sm" options={[{ value: 'kol', label: 'KOL' }, { value: 'paper', label: 'Paper' }, { value: 'dark', label: 'Dark' }]} />
        </LabeledControl>
        <ToggleSwitch label="Invert" checked={invert} onChange={setInvert} />
      </LabeledControlSection>
    </div>
  )
}

const LAYERS = [
  { id: 'g1', type: 'group', visible: true, children: [
    { id: 'p1', type: 'photo', visible: true },
    { id: 's1', type: 'shape', kind: 'rect', visible: true },
  ] },
  { id: 't1', type: 'text', text: 'Headline', visible: true },
  { id: 'l1', type: 'loop', presetLabel: 'Penrose', visible: true },
]
const TRACKS = [
  { id: 'circle:x', label: 'Circle · x', keys: [{ t: 0, v: 0, easing: 'linear' }, { t: 0.5, v: 100, easing: 'ease' }, { t: 1, v: 0, easing: 'linear' }] },
  { id: 'circle:opacity', label: 'Circle · opacity', keys: [{ t: 0.2, v: 0.2, easing: 'in-out' }, { t: 0.8, v: 1, easing: 'hold' }] },
]

function EditorParts() {
  const [sel, setSel] = useState(['t1'])
  const [tracks, setTracks] = useState(TRACKS)
  const [t, setT] = useState(0.3)
  const [curve, setCurve] = useState(defaultCurveFor('polar'))
  return (
    <>
      <div className="w-72 rounded border border-fg-08 bg-surface-primary">
        <LayerStack layers={LAYERS} selectedIds={sel} onSelect={(id) => setSel([id])} onSelectCanvas={() => setSel(['canvas'])} />
      </div>
      <div className="w-64"><CurveEditor value={curve} onChange={(next) => setCurve(next)} /></div>
      <div className="w-full overflow-hidden rounded border border-fg-08 bg-surface-primary">
        <TimelineDock tracks={tracks} t={t} onSeek={setT}
          onChange={(id, keys) => setTracks((all) => all.map((tr) => (tr.id === id ? { ...tr, keys } : tr)))} />
      </div>
    </>
  )
}

export default function Compositions() {
  return (
    <div className="mt-8">
      <Specimen title="Module front" ships="kol-hardware · ModuleFrame"
        handBuilt={['kol-monitor — the module frame: header pinned, body below, eurorack padding, edit context (modules/utility/Module.jsx)']}>
        <ModuleFront />
      </Specimen>

      <Specimen title="Mixer channel · front and back" ships="kol-hardware · ChannelStrip · FlipCard"
        handBuilt={[
          'kol-mirror — the channel strip, power dot and icon tiles (hall-of-mirrors/SymphonyMixer.jsx:358)',
          'kol-mirror — the front/back flip (styles/components.css:35, .mirror-flip-*)',
          'kol-mirror — its own RotaryDial (hall-of-mirrors/RotaryDial.jsx)',
        ]}>
        <Channel />
      </Specimen>

      <Specimen title="Params rail" ships="composed · LabeledControlSection + LabeledControl"
        handBuilt={['design-editor — labs params and the parameters inspector build this from the same parts (labs/LabsParams.jsx, params/AutoControls.jsx)']}>
        <ParamsRail />
      </Specimen>

      <Specimen title="Editor parts" ships="kol-component · LayerStack · CurveEditor · TimelineDock"
        handBuilt={[
          'design-editor — its own LayerStack (compose/LayerStack.jsx, 583 lines)',
          'design-editor — its own TimelineDock (params/TimelineDock.jsx) and CurveEditor / KeyframeEditor (compose/inspectors/)',
          'design-editor — its own ToolPalette and InspectorRail (shell/panels/ToolPalette.jsx, compose/InspectorRail.jsx)',
        ]}>
        <EditorParts />
      </Specimen>
    </div>
  )
}
