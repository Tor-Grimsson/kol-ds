import { useRef, useState } from 'react'
import {
  audioSourceKind, disableAudio, enableAudio, ensureWebcam, findLayerDeep, saveClip, stillToDataUrl, useComposeFile,
  useComposeState, useLayerEdit,
} from '../engine.js'
import WindowPane from './WindowPane.jsx'
import { pickMedia } from './WindowMediaPicker.jsx'
import { Button, TabsRow } from '@kolkrabbi/kol-component'

/* File, as the real footer's File tab (shell/panels/EditorFooter.jsx `fileBody`): with a photo layer selected, its
   source (Upload image, Upload video, From library, Webcam, and Clear image while it has one); otherwise the document
   to and from disk (Save to file, Load from file, the load's error under them). Then the audio input for the audio
   modulation sources (AudioInputRow: Audio, Off, Mic, File, its error). Every write is the engine's; From library opens
   kolbox's media picker on that layer. */
function PhotoFile({ layer }) {
  const { patch } = useLayerEdit(layer.id)
  const imageRef = useRef(null)
  const videoRef = useRef(null)
  const onPick = (e) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (file) stillToDataUrl(file).then((src) => patch({ src, srcType: 'image' }))
  }
  const onPickVideo = (e) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    saveClip(layer.id, file)
    patch({ src: URL.createObjectURL(file), srcType: 'video' })
  }
  const onWebcam = () => ensureWebcam(layer.id).then(() => patch({ src: null, srcType: 'webcam' })).catch(() => { /* camera denied: keep the source */ })
  return (
    <div className="flex flex-col gap-2" data-file-photo>
      <input ref={imageRef} type="file" accept="image/*" className="hidden" onChange={onPick} />
      <input ref={videoRef} type="file" accept="video/*" className="hidden" onChange={onPickVideo} />
      <Button variant="kolbox" iconLeft="upload" className="w-full" onClick={() => imageRef.current?.click()}>Upload image</Button>
      <Button variant="kolbox" iconLeft="upload" className="w-full" onClick={() => videoRef.current?.click()}>Upload video</Button>
      <Button variant="kolbox" iconLeft="nav-library" className="w-full" onClick={() => pickMedia({ accept: ['image', 'video'], layerId: layer.id })}>From library</Button>
      <Button variant="kolbox" iconLeft="camera" className="w-full" onClick={onWebcam}>Webcam</Button>
      {(layer.src || layer.srcType === 'webcam') && (
        <Button variant="kolbox" iconLeft="trash" className="w-full" onClick={() => { patch({ src: null, srcType: 'image' }); if (imageRef.current) imageRef.current.value = '' }}>Clear image</Button>
      )}
    </div>
  )
}

function SettingsFile() {
  const { onSaveSettings, onLoadSettings } = useComposeFile()
  const fileRef = useRef(null)
  const [err, setErr] = useState('')
  const onPick = (e) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    onLoadSettings(file).then(() => setErr('')).catch((ex) => setErr(ex.message || 'Load failed'))
  }
  return (
    <div className="flex flex-col gap-2" data-file-settings>
      <Button variant="kolbox" iconLeft="download" className="w-full" onClick={() => onSaveSettings()}>Save to file</Button>
      <Button variant="kolbox" iconLeft="upload" className="w-full" onClick={() => fileRef.current?.click()}>Load from file</Button>
      <input ref={fileRef} type="file" accept="application/json,.json" className="hidden" onChange={onPick} data-load-file />
      {err && <span className="font-mono text-meta text-error">{err}</span>}
    </div>
  )
}

const AUDIO = [{ value: 'off', label: 'Off' }, { value: 'mic', label: 'Mic' }, { value: 'file', label: 'File' }]
function AudioInput() {
  const [kind, setKind] = useState(audioSourceKind() ?? 'off')
  const [err, setErr] = useState(null)
  const fileRef = useRef(null)
  const onPick = async (v) => {
    setErr(null)
    if (v === 'off') { disableAudio(); setKind('off') }
    else if (v === 'mic') {
      if (!window.isSecureContext) { setErr('Mic needs https or localhost'); setKind('off'); return }
      const ok = await enableAudio()
      setKind(ok ? 'mic' : 'off')
      if (!ok) setErr('Mic blocked — allow it for this site (check the address bar)')
    } else fileRef.current?.click()
  }
  const onFile = async (e) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    setErr(null)
    const ok = await enableAudio({ file })
    setKind(ok ? 'file' : 'off')
    if (!ok) setErr('Could not play that audio file')
  }
  return (
    <div className="mt-1 flex flex-col gap-1" data-file-audio>
      <div className="flex items-center gap-2">
        <span className="shrink-0 text-help text-muted">Audio</span>
        <TabsRow variant="kolbox" tabs={AUDIO} value={kind} onChange={onPick} className="flex-1" />
        <input ref={fileRef} type="file" accept="audio/*" onChange={onFile} className="hidden" />
      </div>
      {err && <span className="font-mono text-meta text-muted">{err}</span>}
    </div>
  )
}

export default function WindowFile({ onClose }) {
  const { selectedId, layers } = useComposeState()
  const layer = selectedId && selectedId !== 'canvas' ? findLayerDeep(layers, selectedId) : null
  return (
    <WindowPane title="File" name="file" onClose={onClose}>
      {layer?.type === 'photo' ? <PhotoFile layer={layer} /> : <SettingsFile />}
      <AudioInput />
    </WindowPane>
  )
}
