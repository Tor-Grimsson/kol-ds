import { useRef, useState } from 'react'
import { ASPECTS, audioSourceKind, disableAudio, enableAudio, useComposeFile, useComposeState, useTransport } from './engine.js'
import { Group, ParamSelect } from './Params.jsx'
import Button from '../ui/Button.jsx'
import ButtonSplit from '../ui/ButtonSplit.jsx'
import Icon from '../ui/Icon.jsx'
import InputNumber from '../ui/InputNumber.jsx'
import Segmented from '../ui/Segmented.jsx'
import Select from '../ui/Select.jsx'

/* The dock at the foot of the property rail (the package's EditorFooter, labs at a desk): Transport, Output, File. */
const TABS = [{ value: 'transport', label: 'Transport' }, { value: 'output', label: 'Output' }, { value: 'file', label: 'File' }]

/* its own component: the clock re-renders it */
function Transport() {
  const { playing, loopSeconds, play, pause, stop, rewind, setLoopSeconds } = useTransport()
  return (
    <div className="flex items-center gap-2">
      <Segmented
        className="shrink-0"
        value={playing ? 'play' : 'pause'}
        onChange={(v) => (v === 'play' ? play() : pause())}
        options={[{ value: 'play', ariaLabel: 'Play', label: <IconCell name="play" /> }, { value: 'pause', ariaLabel: 'Pause', label: <IconCell name="pause" /> }]}
      />
      <InputNumber className="min-w-0 flex-1" lead="Loop /" unit="s" chars={3} value={loopSeconds} aria-label="Loop length in seconds" onCommit={(s) => { const n = Number(s); if (Number.isFinite(n)) setLoopSeconds(n) }} />
      <div className="flex shrink-0 gap-0.5 rounded-field bg-field p-0.5">
        <Button icon="stop" aria-label="Stop" className="h-6 w-6 rounded-inner" onClick={stop} />
        <Button icon="rewind" aria-label="Rewind" className="h-6 w-6 rounded-inner" onClick={rewind} />
      </div>
    </div>
  )
}

function IconCell({ name }) {
  return <span className="flex items-center justify-center"><Icon name={name} size={14} /></span>
}

function Output() {
  const { aspect, setAspect, canvasW, canvasH } = useComposeState()
  const { onExportPng, onExportWebm, openOutputWindow } = useComposeFile()
  const [scale, setScale] = useState(1)
  const aspects = ASPECTS.filter((a) => a.id !== 'custom' || aspect === 'custom').map((a) => ({ value: a.id, label: a.label }))
  const scales = [1, 2, 3].map((k) => ({ value: k, label: `@${k}x, ${canvasW * k} × ${canvasH * k}` }))
  return (
    <div className="flex flex-col gap-3">
      <Group divided={false} label="Aspect"><Select value={aspect} options={aspects} onChange={setAspect} /></Group>
      <Group divided={false} label="Export">
        <ParamSelect value={scale} options={scales} onChange={setScale} />
        <div className="flex items-center gap-2">
          {/* the loop bake is reachable; Record and Batch export are the package's own windows, inert here */}
          <ButtonSplit className="flex-1" icon="download" onClick={() => onExportPng(scale)} items={[
            { label: 'Export PNG', onPress: () => onExportPng(scale) },
            { label: 'Export loop (webm)', onPress: () => onExportWebm(scale, () => {}) },
            { label: 'Record' },
            { label: 'Batch export' },
          ]}>Export PNG</ButtonSplit>
          <Button variant="outline" icon="maximize" onClick={openOutputWindow}>Open output window</Button>
        </div>
      </Group>
    </div>
  )
}

const AUDIO = [{ value: 'off', label: 'Off' }, { value: 'mic', label: 'Mic' }, { value: 'file', label: 'File' }]
function File() {
  const { onSaveSettings, onLoadSettings } = useComposeFile()
  const jsonRef = useRef(null)
  const audioRef = useRef(null)
  const [err, setErr] = useState('')
  const [kind, setKind] = useState(audioSourceKind() ?? 'off')
  const onAudio = async (v) => {
    setErr('')
    if (v === 'off') { disableAudio(); setKind('off'); return }
    if (v === 'file') { audioRef.current?.click(); return }
    if (!window.isSecureContext) { setErr('Mic needs https or localhost'); setKind('off'); return }
    const ok = await enableAudio()
    setKind(ok ? 'mic' : 'off')
    if (!ok) setErr('Mic blocked — allow it for this site (check the address bar)')
  }
  return (
    <div className="flex flex-col gap-2">
      <Button variant="outline" icon="download" className="w-full" onClick={onSaveSettings}>Save to file</Button>
      <Button variant="outline" icon="upload" className="w-full" onClick={() => jsonRef.current?.click()}>Load from file</Button>
      <input ref={jsonRef} type="file" accept="application/json,.json" className="hidden" onChange={(e) => {
        const f = e.target.files?.[0]; e.target.value = ''
        if (f) onLoadSettings(f).then(() => setErr('')).catch((ex) => setErr(ex.message || 'Load failed'))
      }} />
      <div className="mt-3 flex items-center gap-2">
        <span className="shrink-0 text-label text-muted">Audio</span>
        <Segmented className="flex-1" options={AUDIO} value={kind} onChange={onAudio} />
        <input ref={audioRef} type="file" accept="audio/*" className="hidden" onChange={async (e) => {
          const f = e.target.files?.[0]; e.target.value = ''
          if (!f) return
          const ok = await enableAudio({ file: f })
          setKind(ok ? 'file' : 'off')
          if (!ok) setErr('Could not play that audio file')
        }} />
      </div>
      {err && <span className="font-mono text-label text-muted">{err}</span>}
    </div>
  )
}

export default function Dock() {
  const [tab, setTab] = useState('transport')
  return (
    <div className="flex shrink-0 flex-col gap-3 border-t border-line px-4 pt-4 pb-5" data-dock>
      <Segmented options={TABS} value={tab} onChange={setTab} />
      {/* the transport stays mounted, as the real one does */}
      <div className={tab === 'transport' ? undefined : 'hidden'}><Transport /></div>
      {tab === 'output' && <Output />}
      {tab === 'file' && <File />}
    </div>
  )
}

/* the collapsed rail's foot: one play or pause */
export function DockCollapsed() {
  const { playing, play, pause } = useTransport()
  return <Button icon={playing ? 'pause' : 'play'} aria-label={playing ? 'Pause' : 'Play'} onClick={playing ? pause : play} />
}
