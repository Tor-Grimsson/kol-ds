import { useState } from 'react'
import { FindBar } from '@kolkrabbi/kol-component'

export const stage = 'full'

/* a document's find and replace (Folio on kolbox, 2026-11-22): a query with its count, replace beside it */
export const variants = ['kolbox', 'folio']

export default function FindBarPreview({ variant = 'kolbox' }) {
  const [query, setQuery] = useState('stratagem')
  const [replacement, setReplacement] = useState('plan')
  const [matchCase, setMatchCase] = useState(false)
  const [open, setOpen] = useState(true)
  if (!open) return <button type="button" onClick={() => setOpen(true)}>Find &amp; replace</button>
  return (
    <div className="w-full">
      <FindBar variant={variant} query={query} onQueryChange={setQuery} replacement={replacement} onReplacementChange={setReplacement}
        count={query ? '3 found' : ''} onPrev={() => {}} onNext={() => {}} onReplace={() => {}} onReplaceAll={() => {}}
        matchCase={matchCase} onMatchCase={setMatchCase} onClose={() => setOpen(false)} />
    </div>
  )
}
