import { useState } from 'react'
import { ReadingContents } from '@kolkrabbi/kol-component'

export const stage = 'hug'

const ORD = ['First', 'Second', 'Third', 'Fourth', 'Fifth', 'Sixth', 'Seventh', 'Eighth', 'Ninth']
const CHAPTERS = ORD.map((o, i) => ({ id: `i${i + 1}`, label: `${o} interlude` }))

/* the contents, where the reader is, how far through */
export default function ReadingContentsPreview() {
  const [at, setAt] = useState('i3')
  return (
    <ReadingContents book="The Waves" author="Virginia Woolf" count="9 interludes" chapters={CHAPTERS} current={at} onSelect={setAt}
      progress={42} status="Reading position saved" onFold={() => {}} />
  )
}
