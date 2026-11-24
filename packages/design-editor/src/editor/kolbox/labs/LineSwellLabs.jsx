import { useEffect, useRef } from 'react'
import { LabeledControlSection } from '@kolkrabbi/kol-component'
import { loopById, presetLayerPatch, presetParams, presetsInGroup, transport, useComposeState, useLayerEdit } from './engine.js'
import { boardValues, keyOf, spanOf } from '../../../generate/lineSwell/labs.js'
import LineSwellSettings from '../editor/lineSwell/LineSwellSettings.jsx'

/* LINE SWELL in Labs (R8.4): the open board's page as picture tiles, each the board drawn by its own loop at its defaults,
   then the board's own Tweaks panel (`LineSwellSettings` on the loop's spec: his sections, names, ranges and defaults).
   The board's `loop` is the transport's length, times the cycles a `run` board needs to close (generate/lineSwell/labs.js). */
const GROUP = 'lineswell'

/* tiles draw one at a time after the first paint, so a page of still forms never holds the rail up */
let queue = Promise.resolve()
function Tile({ preset }) {
  const ref = useRef(null)
  useEffect(() => {
    let live = true
    queue = queue.then(() => new Promise((done) => setTimeout(() => {
      const cv = ref.current
      if (live && cv) {
        try { loopById(preset.loop).draw(cv.getContext('2d'), 0, cv.width, cv.height, presetParams(preset)) } catch { /* a board that cannot draw here stays blank */ }
      }
      done()
    })))
    return () => { live = false }
  }, [preset])
  return <canvas ref={ref} width={480} height={320} aria-hidden className="block aspect-[3/2] w-full rounded-control bg-field" />
}

export default function LineSwellLabs({ layer }) {
  const { updateLayer } = useComposeState()
  const edit = useLayerEdit(layer.id, { history: 'coalesce' })
  const def = loopById(layer.loopId)
  const { spec } = def.lineSwell
  const presets = presetsInGroup(GROUP)
  const sub = (presets.find((p) => p.id === layer.presetId) ?? presets.find((p) => p.loop === layer.loopId))?.sub
  const values = boardValues(spec, layer)

  const seconds = values.loop ? values.loop * spanOf(spec, values) : null
  useEffect(() => { if (seconds) transport.setLoopSeconds(seconds) }, [seconds])

  const toLayer = (vals) => Object.fromEntries(Object.entries(vals).map(([k, v]) => [keyOf(k), v]))
  return (
    <>
      <LabeledControlSection variant="kolbox" label={sub}>
        <div className="grid grid-cols-2 gap-2" data-line-swell-tiles={sub}>
          {presets.filter((p) => p.sub === sub).map((p) => (
            <button key={p.id} type="button" data-tile={p.id} aria-pressed={p.id === layer.presetId}
              onClick={() => p.id !== layer.presetId && updateLayer(layer.id, presetLayerPatch(p, GROUP))}
              className={`flex flex-col gap-1 rounded-well p-1 text-left outline-none focus-visible:outline-solid focus-visible:outline-1 focus-visible:outline-accent ${p.id === layer.presetId ? 'bg-accent-tint-soft' : 'hover:bg-field'}`}>
              <Tile preset={p} />
              <span className="line-clamp-2 px-1 text-help text-text">{p.label}</span>
            </button>
          ))}
        </div>
      </LabeledControlSection>
      <LineSwellSettings form={def.id.replace(/^lineswell-/, '')} spec={spec} values={values}
        onChange={(name, v) => edit.patch({ [keyOf(name)]: v })} onValues={(vals) => edit.patch(toLayer(vals))} />
    </>
  )
}
