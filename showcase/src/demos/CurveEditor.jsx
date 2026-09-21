import { useState } from 'react'
import { CurveEditor, defaultCurveFor } from '@kolkrabbi/kol-component'

export const stage = 'sm'

/* Starts on a STOCK clip, so the first commit forks it — watch `fork` flip
 * true once and the hint disappear. `validate` is the consumer's compiler;
 * here a stand-in that rejects an unbalanced bracket, so typing `sin(t` shows
 * the "doesn't compile — last good kept" hint while the value still commits
 * (editor-panels-the-held-specs A4). */
const balanced = (s) => (s.match(/\(/g) || []).length === (s.match(/\)/g) || []).length
const STOCK = { label: 'Mandala', copies: 6, spiral: 0, layerCopies: 1, layerSpiral: 0 }

export default function CurveEditorDemo() {
  const [def, setDef] = useState(defaultCurveFor('polar'))
  const [stock, setStock] = useState(STOCK)
  const [last, setLast] = useState(null)
  return (
    <div className="flex w-64 flex-col gap-3">
      <CurveEditor
        value={def}
        stock={stock}
        validate={balanced}
        onChange={(next, meta) => { setDef(next); setLast(meta); if (meta.fork) setStock(null) }}
      />
      <span className="kol-helper-10 text-meta">
        {stock ? 'stock clip — first edit forks' : `custom${last?.extras?.copies ? ` · seeded copies ${last.extras.copies}` : ''}`}
      </span>
    </div>
  )
}
