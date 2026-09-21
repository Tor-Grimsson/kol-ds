import { useState } from 'react'
import { InspectorRail, Button } from '@kolkrabbi/kol-component'

export const stage = 'md'

/* The routing shell and nothing else: the three panels here are stand-ins the
 * demo supplies, exactly as a consumer does. Click the chips to change the
 * selection and watch the precedence — canvas beats two layers, which is the
 * rule everyone gets wrong (editor-panels-the-held-specs A7). */
const CASES = [
  { label: 'none', ids: [] },
  { label: 'one layer', ids: ['a'] },
  { label: 'two layers', ids: ['a', 'b'] },
  { label: 'canvas + two', ids: ['canvas', 'a', 'b'] },
]

export default function InspectorRailDemo() {
  const [ids, setIds] = useState(['a'])
  return (
    <div className="flex w-full max-w-sm flex-col gap-4">
      <div className="flex flex-wrap gap-2">
        {CASES.map((c) => (
          <Button key={c.label} size="xs" variant="outline" pressed={ids === c.ids} onClick={() => setIds(c.ids)}>{c.label}</Button>
        ))}
      </div>
      <InspectorRail
        selectedIds={ids}
        className="min-h-24 rounded border border-fg-08 p-4"
        renderers={{
          canvas: () => <p className="kol-mono-12 text-emphasis">Canvas inspector — fill · opacity</p>,
          single: (id) => <p className="kol-mono-12 text-emphasis">Layer inspector for <code>{id}</code></p>,
          multi: (list) => <p className="kol-mono-12 text-emphasis">{list.length} layers selected — Group</p>,
        }}
      />
    </div>
  )
}
