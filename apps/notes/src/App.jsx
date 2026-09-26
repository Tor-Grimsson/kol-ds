import { useEffect, useState } from 'react'
import { Notes } from '@kolkrabbi/kol-notes'
import { createFixtureClient } from 'media-fixture'
import { useNotesTool } from 'media-fixture/wiring'

/* THE NOTES TOOL, ALONE (notes and presentation as tools, 2026-09-27) — kol-notes' `Notes` over the
 * fixture's fake D1 `notes` table. The wiring is media-fixture's `useNotesTool`, shared with
 * media-shell's Notes tab, so both render the same tool; this app keeps only its routing — the open
 * note in the hash (`#<slug>`), so Back leaves a note and a reload lands in it. */

const client = createFixtureClient()
const parse = () => decodeURIComponent(location.hash.slice(1)) || null

export default function App() {
  const [open, setOpen] = useState(parse)
  useEffect(() => {
    const on = () => setOpen(parse())
    window.addEventListener('hashchange', on)
    return () => window.removeEventListener('hashchange', on)
  }, [])
  const onOpenChange = (slug) => { location.hash = slug ? encodeURIComponent(slug) : ''; setOpen(slug) }
  const notes = useNotesTool({ client })

  return <Notes {...notes.props} open={open} onOpenChange={onOpenChange} />
}
