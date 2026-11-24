import { useState } from 'react'
import { RailFloat, ReadingContents } from '@kolkrabbi/kol-component'

export const stage = 'hug'

const ORD = ['First', 'Second', 'Third', 'Fourth', 'Fifth', 'Sixth', 'Seventh', 'Eighth', 'Ninth']
const CHAPTERS = ORD.map((o, i) => ({ id: `i${i + 1}`, label: `${o} interlude` }))

/* the contents, where the reader is, how far through — the body of a RailFloat, its status line in the footer */
export const variants = ['default', 'folio']

export default function ReadingContentsPreview({ variant = 'default' }) {
  const [at, setAt] = useState('i3')
  /* folio (Folio batch E): Folio's contents in the reader's left Rail, the current chapter's headings under it */
  if (variant === 'folio') return <div data-folio-theme="light" className="w-full bg-[var(--kol-folio-paper)] p-6 leading-[1.21] text-[var(--kol-folio-ink)] [font-family:var(--kol-font-family-float)]"><div className="w-[264px]"><ReadingContents variant="folio" eyebrow="In your library / Work" book="The Waves" author="9 chapters" count="09" chapters={CHAPTERS.map((c) => ({ ...c, href: '#' }))} current="i3" sections={[{ id: 'h1', label: 'The house' }]} progress={33} progressText="3 / 9" /></div></div>
  return (
    <RailFloat as="aside" title="Contents" foldable footer={<span className="kol-float-label text-fg-64">Reading position saved</span>}>
      <ReadingContents book="The Waves" author="Virginia Woolf" count="9 interludes" chapters={CHAPTERS} current={at} onSelect={setAt} progress={42} />
    </RailFloat>
  )
}
