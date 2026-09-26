import { CatalogPage } from '@kolkrabbi/kol-shell'
import { Button } from '@kolkrabbi/kol-component'
import { Icon } from '@kolkrabbi/kol-icons'
import SlideThumb from './SlideThumb.jsx'

/* taxonomy-ok: organism — composes kol-shell's CatalogPage (shelf preset) over deck rows with SlideThumb covers */

/**
 * DecksCatalog — the shelf of decks (kol-olina's brand `/slide-deck` manager, ported).
 *
 * `CatalogPage preset="shelf"` — the eleven props that page once carried ARE the preset; `toCard`
 * returns fields and handlers and the page renders the slots (star, trash, the slide count). The
 * cover is the deck's first slide, drawn live by `SlideThumb`, so a card cannot drift from the deck.
 *
 * @param {Array}    decks        rows `{ slug, name, count, first, favourite, updated_at }` — `first` is slide 1's doc
 * @param {Function} onOpen       (deck) => void
 * @param {Function} onNew        () => void — the New deck button
 * @param {Function} onFavourite  (deck) => void
 * @param {Function} onDelete     (deck) => void
 * @param {Object}   header       PageHeader props
 */
export default function DecksCatalog({ decks, onOpen, onNew, onFavourite, onDelete, header }) {
  return (
    <CatalogPage
      preset="shelf"
      header={header ?? {
        title: 'Decks',
        subtitle: 'Every presentation. Open one to edit or present it; export as PDF, PNG or PPTX from its File menu.',
      }}
      items={(decks ?? []).map((d) => ({ ...d, show: d.favourite ? 'Favourites' : 'All' }))}
      filtersTitle="Decks"
      searchKeys={['name']}
      filterGroups={[{ label: 'Show', key: 'show', values: ['All', 'Favourites'] }]}
      iconComponent={Icon}
      toCard={(d) => ({
        key: d.slug,
        title: d.name,
        date: d.updated_at ? new Date(d.updated_at).toISOString().slice(0, 10) : undefined,
        count: d.count,
        media: d.first ? <SlideThumb doc={d.first} /> : undefined,
        favourited: d.favourite,
        href: '#',
        onNavigate: (e) => { e.preventDefault(); onOpen?.(d) },
        onFavourite: onFavourite ? () => onFavourite(d) : undefined,
        onDelete: onDelete ? () => onDelete(d) : undefined,
      })}
      actions={onNew && <Button size="md" iconRight="plus" onClick={onNew}>New deck</Button>}
    />
  )
}
