import { useState } from 'react'
import {
  Knob, Fader, Toggle, FlipToggle, RockerSwitch, LED, IconButton, JackSocket, LabeledJack, PanelLabel, ModuleHeader, ParamSheet,
  EnvelopeGenerator,
} from '@kolkrabbi/kol-hardware'
import { Button } from '@kolkrabbi/kol-component'
import Specimen from '../Specimen.jsx'

/* The instrument rung — kol-hardware, on the surface its consumers mount it on. Sizes and props as the package
 * ships them; nothing restyled here. */
export default function Parametric() {
  const [v, setV] = useState(35)
  const [pan, setPan] = useState(-20)
  const [mix, setMix] = useState(64)
  const [lvl, setLvl] = useState(40)
  const [on, setOn] = useState(true)
  const [flip, setFlip] = useState(1)
  const [mode, setMode] = useState('wave-sin')
  const [sheet, setSheet] = useState(false)

  return (
    <div className="mt-8">
      <Specimen title="Knob" ships="kol-hardware · Knob">
        <Knob value={v} onChange={setV} label="gain" size="sm" />
        <Knob value={v} onChange={setV} label="gain" size="md" />
        <Knob value={v} onChange={setV} label="gain" size="lg" />
        <Knob value={v} onChange={setV} label="gain" size="xl" />
        <Knob value={pan} onChange={setPan} label="pan" bipolar size="md" />
        <Knob value={v} onChange={setV} label="rate" variant="row-right" labelMinWidth={28} size="sm" />
      </Specimen>

      <Specimen title="Fader" ships="kol-hardware · Fader">
        <div className="w-64"><Fader value={mix} onChange={setMix} label="mix" /></div>
        <Fader value={lvl} onChange={setLvl} label="lvl" direction="vertical" height={72} />
      </Specimen>

      <Specimen title="Toggle · FlipToggle · RockerSwitch" ships="kol-hardware"
        handBuilt={['kol-mirror — the channel power dot, a ring and a red fill (SymphonyMixer.jsx:396)']}>
        <Toggle value={on} onChange={setOn} label="sync" />
        <Toggle value={false} onChange={() => {}} label="trig" momentary />
        <Toggle value={on} onChange={setOn} label="clk" blink blinkPeriodMs={800} />
        <Toggle value={on} onChange={setOn} label="ok" color="var(--kol-ctl-led-green)" />
        <FlipToggle value={on} onChange={setOn} labelA="hi" labelB="lo" />
        <FlipToggle value={flip} onChange={setFlip} positions={3} labelA="a" labelB="b" labelC="c" />
        <RockerSwitch on={on} onToggle={() => setOn((o) => !o)} />
      </Specimen>

      <Specimen title="LED" ships="kol-hardware · LED">
        {['red', 'yellow', 'green', 'white', 'blue'].map((c) => <LED key={c} color={c} active size="md" />)}
        <LED color="red" active={false} size="md" />
      </Specimen>

      <Specimen title="IconButton" ships="kol-hardware · IconButton"
        handBuilt={[
          'kol-mirror — the channel strip’s 28px icon tiles (SymphonyMixer.jsx:420)',
          'kol-monitor — IconSelect, an IconButton grid for mode pickers (modules/parametric/IconSelect.jsx)',
        ]}>
        {['wave-sin', 'wave-tri', 'wave-sqr'].map((i) => (
          <IconButton key={i} icon={i} active={mode === i} onClick={() => setMode(i)} title={i} iconSize={12} />
        ))}
        <IconButton icon="play" momentary title="momentary" iconSize={12} />
        <IconButton icon="stop" disabled title="disabled" iconSize={12} />
      </Specimen>

      <Specimen title="Jacks" ships="kol-hardware · JackSocket · LabeledJack"
        handBuilt={[
          'kol-mirror — patch cables drawn between jacks (PatchCableOverlay)',
          'kol-monitor — patch routing and cables (hooks/usePatchRouting.jsx, rack/RackViewport.jsx)',
        ]}>
        <JackSocket type="out" label="out" />
        <JackSocket type="out" label="out" active />
        <JackSocket type="in" label="in" color="#4ade80" />
        <JackSocket type="in" label="cv" color="#497DA2" active />
        <LabeledJack type="in" label="in" labelPosition="top" color="#4ade80" />
        <LabeledJack type="out" icon="play" />
        <LabeledJack type="in" label="off" dim color="#4ade80" />
      </Specimen>

      <Specimen title="Jack + control pairs" ships="composed — not a component yet"
        handBuilt={['kol-monitor — CvKnob and CvSlider (modules/parametric/CvKnob.jsx, CvSlider.jsx)']}>
        <div className="flex items-center gap-2">
          <LabeledJack type="in" label="cv" labelPosition="left" color="#497DA2" />
          <Knob value={v} onChange={setV} label="freq" size="sm" />
        </div>
        <div className="flex w-56 items-center gap-2">
          <LabeledJack type="in" label="cv" labelPosition="left" color="#497DA2" />
          <Fader value={mix} onChange={setMix} label="amt" />
        </div>
      </Specimen>

      <Specimen title="PanelLabel" ships="kol-hardware · PanelLabel">
        <PanelLabel label="rate"><LED color="yellow" active size="md" /></PanelLabel>
        <PanelLabel label="sync" horizontal gap={6}><LED color="green" active /></PanelLabel>
      </Specimen>

      <Specimen title="ModuleHeader" ships="kol-hardware · ModuleHeader">
        <div className="flex w-52 flex-col gap-2">
          <ModuleHeader label="Feedback" enabled={on} onToggle={() => setOn((o) => !o)} />
          <ModuleHeader label="Keyer" enabled={on} onToggle={() => setOn((o) => !o)} editMode onRemove={() => {}} />
          <ModuleHeader label="Ramp" enabled powered={false} />
        </div>
      </Specimen>

      <Specimen title="ParamSheet" ships="kol-hardware · ParamSheet — the touch sheet a long-press opens">
        <Knob value={v} onChange={setV} label="gain" size="md" />
        <Button variant="grey" size="sm" onClick={() => setSheet(true)}>Open sheet</Button>
        {sheet && <ParamSheet label="gain" value={v} min={0} max={100} defaultValue={50} onChange={setV} onClose={() => setSheet(false)} />}
      </Specimen>

      <Specimen title="EnvelopeGenerator" ships="kol-hardware · EnvelopeGenerator — the whole tool, with its reference, is apps/curves"
        handBuilt={[
          'kol-monitor — Scope / Scope+ and the Env module (modules/display/OscilloscopeModule.jsx, modules/control/EnvelopeModule.jsx)',
          'kol-mirror — the /expressions oscilloscope and its reference (hall-of-mirrors/ExpressionReference.jsx)',
          'design-editor — the Math · Expression loop (loops/math/expression.js) and the modulation DSL (params/expr.js)',
        ]}>
        <div className="w-full"><EnvelopeGenerator reference={false} /></div>
      </Specimen>
    </div>
  )
}
