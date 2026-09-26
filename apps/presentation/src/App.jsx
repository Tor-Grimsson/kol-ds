import { useEffect, useState } from 'react'
import { Decks } from '@kolkrabbi/kol-deck'
import { createFixtureClient } from 'media-fixture'
import { useDecksTool } from 'media-fixture/wiring'

/* THE PRESENTATION TOOL, ALONE (notes and presentation as tools, 2026-09-27) — kol-deck's `Decks` over
 * the fixture's fake D1 `decks` table. The wiring (layouts, the bucket as picker and upload target) is
 * media-fixture's `useDecksTool`, shared with media-shell's Decks tab, so both render the same tool;
 * this app keeps only its routing — the open deck in the hash (`#<slug>`). */

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
  const decks = useDecksTool({ client })

  return <Decks {...decks.props} open={open} onOpenChange={onOpenChange} />
}
