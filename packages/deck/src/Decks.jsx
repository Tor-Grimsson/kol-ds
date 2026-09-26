import { useEffect, useState } from 'react'
import { useModal } from '@kolkrabbi/kol-component'
import DecksCatalog from './DecksCatalog.jsx'
import DeckEditor from './DeckEditor.jsx'
import { BLANK_LAYOUT, clone, newId } from './slideDoc.js'

/* taxonomy-ok: organism — the presentation tool: DecksCatalog ⇄ DeckEditor over a consumer-injected client */

/**
 * Decks — the whole presentation tool: the shelf, and a deck open in the editor. ONE component so
 * every app that carries decks renders the same tool (apps/presentation alone, a shell tab later).
 *
 * THE CLIENT is olina's decks API, as verbs (the fixture fakes them; the real one is a Pages Function
 * over D1):
 *   listDecks()                         → [{ slug, name, count, first, favourite, updated_at }]
 *   loadDeck(slug)                      → { slug, name, slides, favourite, updated_at }
 *   saveDeck({ slug, name, slides?, favourite? }) → { updated_at }   upsert; an absent field is kept
 *   deleteDeck(slug)
 *
 * New deck asks for a name (the DS modal — needs `ModalProvider` above) and starts on the first
 * layout the consumer offers.
 *
 * @param {Object}   client       the verbs above
 * @param {Array}    layouts      `[{ slug, name, doc }]` — what a deck is built from
 * @param {Object}   mediaClient  the DS picker's client, for image layers
 * @param {Function} onUpload     (file) => Promise<url>
 * @param {string}   open · onOpenChange   controlled open deck slug (`null` = the shelf); or internal
 * @param {string}   railLeft     where the editor's filmstrip starts (DeckEditor) — an app with a rail passes its width
 */
const slugify = (s) => s.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

export default function Decks({ client, layouts = [], mediaClient, onUpload, header, open: openProp, onOpenChange, railLeft }) {
  const [openState, setOpenState] = useState(null)
  const open = openProp !== undefined ? openProp : openState
  const setOpen = (slug) => { if (openProp === undefined) setOpenState(slug); onOpenChange?.(slug) }

  const [decks, setDecks] = useState(null)
  const [deck, setDeck] = useState(null)
  const [error, setError] = useState(null)
  const [reload, setReload] = useState(0)
  const refresh = () => setReload((n) => n + 1)
  const { prompt, confirm } = useModal()
  const fail = (err) => setError(err.message || String(err))

  useEffect(() => {
    let ignore = false
    client.listDecks().then((rows) => { if (!ignore) { setDecks(rows); setError(null) } }, (err) => { if (!ignore) { setDecks([]); fail(err) } })
    return () => { ignore = true }
  }, [client, reload]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!open) { setDeck(null); return undefined }
    let ignore = false
    setDeck(null)
    client.loadDeck(open).then((d) => { if (!ignore) setDeck(d) }, (err) => { if (!ignore) { fail(err); setOpen(null) } })
    return () => { ignore = true }
  }, [client, open]) // eslint-disable-line react-hooks/exhaustive-deps

  const create = async () => {
    const name = await prompt('Name the new deck', 'Untitled deck', { okLabel: 'Create' })
    if (!name) return
    const taken = new Set((decks ?? []).map((d) => d.slug))
    let slug = slugify(name) || `deck-${Date.now().toString(36)}`
    if (taken.has(slug)) slug = `${slug}-${Date.now().toString(36).slice(-4)}`
    const start = layouts[0] ?? BLANK_LAYOUT
    try {
      await client.saveDeck({ slug, name, slides: [{ id: newId('slide'), doc: clone(start.doc) }], favourite: false })
      refresh()
      setOpen(slug)
    } catch (err) { fail(err) }
  }
  const toggleFavourite = async (d) => {
    try { await client.saveDeck({ slug: d.slug, name: d.name, favourite: !d.favourite }); refresh() } catch (err) { fail(err) }
  }
  const remove = async (d) => {
    if (!(await confirm(`Delete “${d.name}”?`, { okLabel: 'Delete' }))) return
    try { await client.deleteDeck(d.slug); refresh() } catch (err) { fail(err) }
  }

  if (open) {
    if (!deck) return <p className="kol-mono-12 text-fg-48 p-6">Loading…</p>
    return (
      <DeckEditor
        key={deck.slug}
        deck={deck}
        layouts={layouts}
        mediaClient={mediaClient}
        onUpload={onUpload}
        railLeft={railLeft}
        onSave={async (slides) => { await client.saveDeck({ slug: deck.slug, name: deck.name, slides }) }}
        onClose={() => { setOpen(null); refresh() }}
      />
    )
  }

  return (
    <>
      {error && <p className="kol-mono-12 text-fg-64 px-6 pt-4">{error}</p>}
      <DecksCatalog decks={decks} header={header} onOpen={(d) => setOpen(d.slug)} onNew={create} onFavourite={toggleFavourite} onDelete={remove} />
    </>
  )
}
