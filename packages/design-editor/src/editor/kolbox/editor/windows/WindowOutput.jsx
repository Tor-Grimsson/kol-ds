import { useEffect, useRef, useState } from 'react'
import { ASPECTS, useComposeFile, useComposeState } from '../engine.js'
import WindowPane from './WindowPane.jsx'
import { bakeLoop } from './WindowBaking.jsx'
import { Button, ButtonSplit, Dropdown, LabeledControl, Menu } from '@kolkrabbi/kol-component'

/* Output, as the real footer's Output tab (shell/panels/EditorFooter.jsx `outputBody`): Aspect; Export, the @Nx scale
   (the real label's middot is a slash here) over one split button, Export PNG, its chevron the four exports (Export PNG,
   Export loop (webm) through the bake window, Record and Stop recording, Batch export), and Open output window (under
   it here, beside it in the real one). Every action is the engine's (useComposeFile); a recording stops when the window closes, as the real tab's
   unmount stops it. Custom aspect is listed only while it is the frame's. */
export default function WindowOutput({ onClose }) {
  const { aspect, setAspect, canvasW, canvasH } = useComposeState()
  const { onExportPng, onRecordStart, onRecordStop, openOutputWindow } = useComposeFile()
  const [scale, setScale] = useState(1)
  const [recording, setRecording] = useState(false)
  const [menu, setMenu] = useState(false)
  const split = useRef(null)
  const stop = useRef(onRecordStop); stop.current = onRecordStop
  useEffect(() => () => { stop.current() }, [])

  const toggleRecord = async () => {
    if (recording) { await onRecordStop(); setRecording(false); return }
    if (await onRecordStart(scale)) setRecording(true)
  }
  const aspects = ASPECTS.filter((a) => a.id !== 'custom' || aspect === 'custom').map((a) => ({ value: a.id, label: a.label }))
  const scales = [1, 2, 3].map((k) => ({ value: k, label: `@${k}x / ${canvasW * k} × ${canvasH * k}` }))
  const rows = [
    { label: 'Export PNG', icon: 'download', run: () => onExportPng(scale) },
    { label: 'Export loop (webm)', icon: 'download', run: () => bakeLoop(scale) },
    { label: recording ? 'Stop recording' : 'Record', icon: recording ? 'eye-on' : 'download', run: toggleRecord },
    { label: 'Batch export', icon: 'layers', run: () => window.dispatchEvent(new CustomEvent('kol:open-batch-export', { cancelable: true })) },
  ]
  return (
    <WindowPane title="Output" name="output" onClose={onClose}>
      <LabeledControl variant="kolbox" label="Aspect">
        <Dropdown variant="kolbox" ariaLabel="Aspect" options={aspects} value={aspect} onChange={setAspect} className="min-w-0 flex-1" />
      </LabeledControl>
      <LabeledControl variant="kolbox" label="Export">
        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <Dropdown variant="kolbox" ariaLabel="Export scale" options={scales} value={scale} onChange={(v) => setScale(Number(v))} className="w-full" />
          {/* the real row holds both; at kolbox's type they do not fit 288, so the output window takes the row under it */}
          <span ref={split} className="flex [&>div]:flex-1 [&>div>button:first-child]:flex-1">
            <ButtonSplit variant="kolbox" tone="primary" icon="download" onClick={() => onExportPng(scale)} onMenu={() => setMenu((o) => !o)} menuLabel="Export options">Export PNG</ButtonSplit>
          </span>
          <Button variant="kolbox" iconLeft="maximize" className="w-full" onClick={openOutputWindow}>Open output window</Button>
        </div>
      </LabeledControl>
      <Menu variant="kolbox" anchor={split} open={menu} onClose={() => setMenu(false)} aria-label="Export" groups={[rows]} onSelect={(r) => r.run()} />
    </WindowPane>
  )
}
