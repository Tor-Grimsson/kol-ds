import { useEffect, useRef, useState } from 'react'
import { ASPECTS, audioSourceKind, disableAudio, enableAudio, useComposeFile, useComposeState, useTransport } from './engine.js'
import Button from '../ui/Button.jsx'
import InputNumber from '../ui/InputNumber.jsx'
import Select from '../ui/Select.jsx'
import { clock } from '../ui/clock.js'
import { MenuButton, MenuDivider, MenuRow } from '../ui/Menu.jsx'
import { Toolbar, ToolbarDivider } from '../ui/Toolbar.jsx'

/* The real dock (Transport, Output, File) as round 1's floating pill under the canvas: the transport and the time, the
   aspect, the audio source, then File and Export, each a menu. Every write is the package's own. */

/* its own component: the clock re-renders it every tick */
function Transport() {
  const { playing, loopSeconds, t, play, pause, stop, rewind, setLoopSeconds } = useTransport()
  return (
    <>
      <Button icon="rewind" aria-label="Rewind" onClick={rewind} />
      <Button icon={playing ? 'pause' : 'play'} aria-label={playing ? 'Pause' : 'Play'} onClick={playing ? pause : play} />
      <Button icon="stop" aria-label="Stop" onClick={stop} />
      <ToolbarDivider />
      <span className="flex items-center px-1 font-mono text-label whitespace-nowrap">
        <span className="text-fg">{clock(t * loopSeconds)}</span>
        <span className="text-faint">&nbsp;/&nbsp;</span>
        {/* the loop length, edited in place */}
        <InputNumber
          value={loopSeconds}
          chars={String(loopSeconds).length}
          unit="s"
          aria-label="Loop length in seconds"
          className="h-6 !gap-0 bg-transparent px-0 hover:bg-transparent"
          onCommit={(s) => { const n = Number(s); if (Number.isFinite(n) && n > 0) setLoopSeconds(n) }}
        />
      </span>
    </>
  )
}

const AUDIO = [{ value: 'off', label: 'Off' }, { value: 'mic', label: 'Mic' }, { value: 'file', label: 'File' }]

export default function ToolbarDock() {
  const { aspect, setAspect, canvasW, canvasH } = useComposeState()
  const { onExportPng, onExportWebm, onRecordStart, onRecordStop, openOutputWindow, onSaveSettings, onLoadSettings } = useComposeFile()
  const [scale, setScale] = useState(1)
  const [recording, setRecording] = useState(false)
  const [kind, setKind] = useState(audioSourceKind() ?? 'off')
  const [err, setErr] = useState('')
  const jsonRef = useRef(null)
  const audioRef = useRef(null)
  /* a recording stops with the screen, as the real dock's does */
  useEffect(() => () => { onRecordStop() }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const aspects = ASPECTS.filter((a) => a.id !== 'custom' || aspect === 'custom').map((a) => ({ value: a.id, label: a.label }))
  const toggleRecord = async () => {
    if (recording) { await onRecordStop(); setRecording(false); return }
    if (await onRecordStart(scale)) setRecording(true)
  }
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
    <div className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2" data-pill>
      {err && <span className="font-mono text-label text-muted">{err}</span>}
      <Toolbar>
        <Transport />
        <ToolbarDivider />
        <Select value={aspect} onChange={setAspect} options={aspects} className="w-16 flex-none bg-transparent" />
        <span className="pl-1 text-label text-faint">Audio</span>
        <Select value={kind} onChange={onAudio} options={AUDIO} className="w-16 flex-none bg-transparent" />
        <ToolbarDivider />
        <MenuButton label="File" place="above" align="right" width={200}>
          <MenuRow icon="download" onClick={onSaveSettings}>Save to file</MenuRow>
          <MenuRow icon="upload" onClick={() => jsonRef.current?.click()}>Load from file</MenuRow>
        </MenuButton>
        <MenuButton label="Export" variant="filled" place="above" align="right" width={240}>
          {[1, 2, 3].map((k) => (
            <MenuRow key={k} checked={scale === k} onClick={() => setScale(k)}>{`@${k}x, ${canvasW * k} × ${canvasH * k}`}</MenuRow>
          ))}
          <MenuDivider />
          <MenuRow onClick={() => onExportPng(scale)}>Export PNG</MenuRow>
          <MenuRow onClick={() => onExportWebm(scale, () => {})}>Export loop (webm)</MenuRow>
          <MenuRow onClick={toggleRecord}>{recording ? 'Stop recording' : 'Record'}</MenuRow>
          {/* the batch window is the package's own, not redrawn here: greyed */}
          <MenuRow disabled>Batch export</MenuRow>
          <MenuDivider />
          <MenuRow onClick={openOutputWindow}>Open output window</MenuRow>
        </MenuButton>
      </Toolbar>
      <input ref={jsonRef} type="file" accept="application/json,.json" className="hidden" onChange={(e) => {
        const f = e.target.files?.[0]; e.target.value = ''
        if (f) onLoadSettings(f).then(() => setErr('')).catch((ex) => setErr(ex.message || 'Load failed'))
      }} />
      <input ref={audioRef} type="file" accept="audio/*" className="hidden" onChange={async (e) => {
        const f = e.target.files?.[0]; e.target.value = ''
        if (!f) return
        const ok = await enableAudio({ file: f })
        setKind(ok ? 'file' : 'off')
        if (!ok) setErr('Could not play that audio file')
      }} />
    </div>
  )
}
