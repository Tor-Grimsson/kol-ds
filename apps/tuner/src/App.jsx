import { useEffect, useState } from 'react'
import { Button, LogoSystem, LogoTuner } from '@kolkrabbi/kol-component'
import RightRail from '../../../packages/design-editor/src/editor/kolbox/ui/RightRail.jsx'
import { SYSTEM_START, SystemPanel, TUNER_START, TunerPanel, systemWrite } from '../../../packages/design-editor/src/editor/kolbox/editor/tune/TunePanel.jsx'
import { readFile, usePeek, useStored } from './parts.jsx'

/* THE FORM TUNER (W27.3; kolbox's look since R7.4, 2026-11-19): @kolkrabbi/kol-tuner on its own, drawn as the editor's
 * Tune mode is: the board on the left, kolbox's right rail with System and Tuner and the same panels (the editor's
 * TunePanel.jsx, his canvas's boards one to one). H switches to the form alone and back. The float pages are in
 * _tmp/2026-11-19-tuner-system/retired/; the 24 rolls are in System's panel. */

const TABS = [{ value: 'system', label: 'System' }, { value: 'tuner', label: 'Tuner' }]
const parse = () => (location.hash === '#/tuner' ? 'tuner' : 'system')

export default function App() {
  const [tab, setTab] = useState(parse)
  const [sys, setSys] = useStored('kol-tuner:system:v2', SYSTEM_START)
  const [tun, setTun] = useStored('kol-tuner:tuner:v2', TUNER_START)
  const [advanced, setAdvanced] = useState(false)
  const [ref, setRef] = useState(null)
  const [img, setImg] = useState(null)
  const peek = usePeek()
  useEffect(() => {
    const on = () => setTab(parse())
    window.addEventListener('hashchange', on)
    return () => window.removeEventListener('hashchange', on)
  }, [])
  const loadRef = (f) => readFile(f, (im, src) => setRef({ src, w: im.naturalWidth, h: im.naturalHeight }))
  const pickRef = () => { const input = Object.assign(document.createElement('input'), { type: 'file', accept: 'image/*' }); input.onchange = () => loadRef(input.files[0]); input.click() }

  return (
    <div className="flex h-dvh min-h-0 flex-col bg-ground text-text md:flex-row">
      <main className="relative min-h-0 min-w-0 flex-1 bg-canvas p-6 max-md:aspect-[3/2] max-md:flex-none" data-tune-stage data-peek={peek ? '' : undefined}>
        {tab === 'system'
          ? <LogoSystem settings={sys} reference={ref} peek={peek} onFile={loadRef}
              onDrag={(k, v) => setSys((s) => ({ ...s, [k]: v, over: { ...(s.over || {}), [k]: v } }))} onDragReset={() => setSys((s) => ({ ...s, over: null }))} />
          : <LogoTuner settings={tun} image={img} peek={peek} onFile={(f) => readFile(f, (im) => setImg(im))} />}
        {tab === 'system' && sys.upload && !peek && (
          <Button variant="kolbox" tone="primary" className="absolute right-10 bottom-10" onClick={pickRef}>Add a reference image</Button>
        )}
      </main>
      <RightRail title="Tuner" tabs={TABS} tab={tab} onTab={(t) => { location.hash = `#/${t}` }}>
        <div data-tune-rail>
          {tab === 'system'
            ? <SystemPanel values={sys} onChange={(k, v) => setSys((s) => systemWrite(s, k, v))} />
            : <TunerPanel values={tun} onChange={(k, v) => setTun((s) => ({ ...s, [k]: v }))} advanced={advanced} onAdvanced={setAdvanced} />}
        </div>
      </RightRail>
    </div>
  )
}
