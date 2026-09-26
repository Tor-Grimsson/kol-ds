import { CatalogPage } from '@kolkrabbi/kol-shell'
import { Button } from '@kolkrabbi/kol-component'
import { Icon } from '@kolkrabbi/kol-icons'
import NoteThumb from './NoteThumb.jsx'
import { previewOf } from './notes.js'

/* taxonomy-ok: organism — composes kol-shell's CatalogPage over note rows with NoteThumb as the card media */

/**
 * NotesCatalog — the notes list (kol-olina's brand `/notes`, ported; the prop shapes are that page's,
 * which were copied from its SlideDeckManager rather than invented).
 *
 * `CatalogPage preset="shelf"` with `article` cards and rows — `slide` is a 16:9 cover card built for
 * decks, and a note has no cover. LIST is the default: a document listing reads as a list. The card's
 * media IS the note's first lines (`NoteThumb`); a note with no body passes `media: false` — omitted
 * would draw the placeholder, which means an image that FAILED.
 *
 * FAVOURITES IS A FILTER GROUP, not a view: `views` belongs to the preset and overriding it broke the
 * header once. `bucket` is derived per row because ContentFilters filters by a KEY on the item.
 *
 * @param {Array}    notes        rows `{ slug, title, preview, favourite, updated_at }`; `null` while loading
 * @param {Function} onOpen       (note) => void
 * @param {Function} onNew        () => void — the New note button
 * @param {Function} onFavourite  (note) => void
 * @param {Function} onDelete     (note) => void
 * @param {Object}   header       PageHeader props (default: Notes + olina's subtitle)
 */
export default function NotesCatalog({ notes, onOpen, onNew, onFavourite, onDelete, header }) {
  return (
    <CatalogPage
      preset="shelf"
      cardVariant="article"
      rowVariant="article"
      defaultLayout="list"
      header={header ?? {
        title: 'Notes',
        subtitle: 'Working notes for this project. Markdown, with images from the media bucket. Stored in the shared database, not in this browser.',
      }}
      items={(notes ?? []).map((n) => ({ ...n, bucket: n.favourite ? 'Favourites' : 'All' }))}
      filtersTitle="Notes"
      searchKeys={['title']}
      filterGroups={[
        { label: 'Show', key: 'bucket', values: ['All', 'Favourites'] },
      ]}
      iconComponent={Icon}
      toCard={(n) => ({
        key: n.slug,
        title: n.title || 'Untitled',
        kicker: n.favourite ? 'Favourite' : 'Note',
        /* `body`, NOT `summary` — ContentText's slots are title · body · eyebrow · detail · date ·
           size · meta · tags, and an unknown prop is silently dropped */
        body: previewOf(n.preview),
        media: n.preview ? <NoteThumb note={n} /> : false,
        date: n.updated_at ? new Date(n.updated_at).toISOString().slice(0, 10) : undefined,
        favourited: n.favourite,
        href: '#',
        onNavigate: (e) => { e.preventDefault(); onOpen?.(n) },
        onFavourite: onFavourite ? () => onFavourite(n) : undefined,
        onDelete: onDelete ? () => onDelete(n) : undefined,
      })}
      actions={onNew && <Button size="md" iconRight="plus" onClick={onNew}>New note</Button>}
    />
  )
}
