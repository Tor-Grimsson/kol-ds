import { useEffect, useState } from 'react'
import { AppHub } from '@kolkrabbi/kol-shell'
import { Decks, NEW_DECK } from '@kolkrabbi/kol-deck'
import logomark from '@kolkrabbi/kol-brand/svg/favicon-01.svg?url'
import { createFixtureClient } from 'media-fixture'
import { useDecksTool } from 'media-fixture/wiring'

/* PRESENTATION ON THE HUB (apps review 2026-09-29) — Shell + Hub + kol-deck, the same tool
 * apps/presentation shows alone. It LOADS ON A BLANK DECK in the editor: build first, name it later.
 *
 *   Edit    /          a blank deck (NEW_DECK) — the first Save files it
 *   Decks   /decks     the shelf · /decks/<slug> a deck
 *
 * Reference: kol-olina apps/brand (SlideDeckManager · SlideDeckEdit · SlideDeckView ·
 * SlideDeckTemplates) — templates are the fixture's layouts, offered inside the editor. No Home, no
 * Settings yet (AppHub opt-ins). Routing is the hash. */

const client = createFixtureClient()
const parse = () => decodeURIComponent(location.hash.slice(1)) || '/'

const ITEMS = [
  { icon: 'rectangle', path: '/', label: 'Edit' },
  { icon: 'layers', path: '/decks', label: 'Decks' },
]

export default function App() {
  const [path, setPath] = useState(parse)
  useEffect(() => {
    const on = () => setPath(parse())
    window.addEventListener('hashchange', on)
    return () => window.removeEventListener('hashchange', on)
  }, [])
  const navigate = (p) => { location.hash = encodeURI(p) }
  const decks = useDecksTool({ client })

  const slug = path.match(/^\/decks\/(.+)$/)?.[1]
  const open = path === '/' ? NEW_DECK : slug ? decodeURIComponent(slug) : null
  const onOpenChange = (s) => navigate(s === NEW_DECK ? '/' : s ? `/decks/${encodeURIComponent(s)}` : '/decks')

  return (
    <AppHub
      app={{ name: 'Presentation', logomark }}
      items={ITEMS}
      currentPath={path.startsWith('/decks') ? '/decks' : '/'}
      onNavigate={navigate}
    >
      <Decks {...decks.props} open={open} onOpenChange={onOpenChange} railLeft="var(--kol-shell-rail-width, 48px)" />
    </AppHub>
  )
}
