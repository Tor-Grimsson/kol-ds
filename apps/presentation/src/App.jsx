import { useEffect, useState } from 'react'
import { Decks, NEW_DECK } from '@kolkrabbi/kol-deck'
import { createFixtureClient } from 'media-fixture'
import { useDecksTool } from 'media-fixture/wiring'

/* THE PRESENTATION TOOL, ALONE (notes and presentation as tools, 2026-09-27) — kol-deck's `Decks` over
 * the fixture's fake D1 `decks` table. The wiring (layouts, the bucket as picker and upload target) is
 * media-fixture's `useDecksTool`, shared with media-hub's Decks tab, so both render the same tool;
 * this app keeps only its routing — the open deck in the hash (`#<slug>`).
 *
 * IT OPENS ON A BLANK DECK (apps review 2026-09-29): no hash = `NEW_DECK`, the editor on the first
 * layout — you build first and decide later. The shelf is `#list`. */

const client = createFixtureClient()
const LIST = 'list'
const parse = () => {
  const h = decodeURIComponent(location.hash.slice(1))
  return h === LIST ? null : h || NEW_DECK
}

export default function App() {
  const [open, setOpen] = useState(parse)
  useEffect(() => {
    const on = () => setOpen(parse())
    window.addEventListener('hashchange', on)
    return () => window.removeEventListener('hashchange', on)
  }, [])
  const onOpenChange = (slug) => { location.hash = slug === NEW_DECK ? '' : slug ? encodeURIComponent(slug) : LIST; setOpen(slug) }
  const decks = useDecksTool({ client })

  return <Decks {...decks.props} open={open} onOpenChange={onOpenChange} />
}
