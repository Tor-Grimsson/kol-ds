import { useEffect, useState } from 'react'
import { Notes, NEW_NOTE } from '@kolkrabbi/kol-notes'
import { createFixtureClient } from 'media-fixture'
import { useNotesTool } from 'media-fixture/wiring'

/* THE NOTES TOOL, ALONE (notes and presentation as tools, 2026-09-27) — kol-notes' `Notes` over the
 * fixture's fake D1 `notes` table. The wiring is media-fixture's `useNotesTool`, shared with
 * media-hub's Notes tab, so both render the same tool; this app keeps only its routing — the open
 * note in the hash (`#<slug>`), so Back leaves a note and a reload lands in it.
 *
 * IT OPENS ON A BLANK NOTE (apps review 2026-09-29): no hash = `NEW_NOTE`, the editor, empty — you
 * write first and decide later. The list is `#list`. */

const client = createFixtureClient()
const LIST = 'list'
const parse = () => {
  const h = decodeURIComponent(location.hash.slice(1))
  return h === LIST ? null : h || NEW_NOTE
}

export default function App() {
  const [open, setOpen] = useState(parse)
  useEffect(() => {
    const on = () => setOpen(parse())
    window.addEventListener('hashchange', on)
    return () => window.removeEventListener('hashchange', on)
  }, [])
  const onOpenChange = (slug) => { location.hash = slug === NEW_NOTE ? '' : slug ? encodeURIComponent(slug) : LIST; setOpen(slug) }
  const notes = useNotesTool({ client })

  return <Notes {...notes.props} open={open} onOpenChange={onOpenChange} />
}
