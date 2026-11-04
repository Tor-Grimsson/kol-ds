import { useState } from 'react'
import { TocRow } from '@kolkrabbi/kol-component'

export const stage = 'md'

/* a numbered contents list — the current entry lifted */
const CH = ['First interlude', 'The sun rises', 'Second interlude', 'Bernard']

export default function TocRowPreview() {
  const [at, setAt] = useState(0)
  return (
    <div className="flex w-full max-w-[816px] flex-col gap-0.5">
      {CH.map((c, i) => <TocRow key={c} number={i + 1} label={c} current={at === i} onClick={() => setAt(i)} />)}
    </div>
  )
}
