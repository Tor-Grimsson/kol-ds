import { useState } from 'react'
import { Button, Dropdown, PopoverPanel, usePopover } from '@kolkrabbi/kol-component'
import { CatalogPage } from '@kolkrabbi/kol-shell'

/* THE CATALOG'S REFERENCE APP (apps review 2026-09-29 — the user: *"that layout and arrangement is
 * highly used … you could decide if you wanted the classic mono header with description like in hub
 * or a uppercase sans like media"*). kol-shell's `CatalogPage` ALONE — no Shell, so the masthead is
 * the page's own prop (inside a Shell it would be the app's). The search in its ContentFilters is the
 * kol-search engine: `tag:brand`, `#motion`, `-draft`, `"a phrase"`, several words ANDed.
 * The DISPLAY · MONO masthead toggle went 2026-10-18: PageHeader is one header now (Round 11).
 *
 * Placeholder items; what a card IS is the consumer's (`toCard`). */

const KINDS = ['deck', 'note', 'image', 'video']
const TAGS = ['brand', 'motion', 'print', 'web', 'draft']
const NAMES = ['Alpha', 'Bravo', 'Charlie', 'Delta', 'Echo', 'Foxtrot', 'Golf', 'Hotel', 'India', 'Juliett', 'Kilo', 'Lima', 'Mike', 'November', 'Oscar', 'Papa', 'Quebec', 'Romeo']
const ITEMS = NAMES.map((name, i) => ({
  name,
  title: `${name} ${KINDS[i % KINDS.length]}`,
  kind: KINDS[i % KINDS.length],
  tags: [TAGS[i % TAGS.length], TAGS[(i + 2) % TAGS.length]],
  date: `2026-09-${String(28 - (i % 27)).padStart(2, '0')}`,
  size: `${(i + 1) * 64} KB`,
  saved: i % 3 === 0,
}))

const VIEWS = [{ value: 'recent', label: 'RECENT' }, { value: 'saved', label: 'SAVED' }]

/* THE VARIANTS BUTTON (plan-2026-10-22-catalog-variants-and-no-cover 2.1 — user: *"viewing catalog, to have
 * access to the variants, since this is supposed to be a reference site"*; placed and drawn per Round 16:
 * a round button in the empty top-right, inset by the page's padding, not part of the layout). One
 * dropdown per CatalogPage axis. A preset sets the other axes to its own values, because an explicit
 * prop beats the preset — `shelf` with `cardVariant="catalog"` still passed would not be the shelf. */
const PRESET_AXES = {
  catalog: { card: 'catalog', row: 'catalog', list: 'grid', width: 'bleed' },
  shelf: { card: 'slide', row: 'slide', list: 'stack', width: 'capped' },
}
const AXES = [
  { key: 'preset', label: 'Preset', values: ['catalog', 'shelf'] },
  { key: 'card', label: 'Card', values: ['catalog', 'file', 'slide', 'article', 'showcase'] },
  { key: 'row', label: 'Row', values: ['catalog', 'file', 'slide'] },
  { key: 'list', label: 'List', values: ['grid', 'stack'] },
  { key: 'width', label: 'Width', values: ['bleed', 'capped'] },
  /* none = `media={false}` (no cover declared) · missing = no media passed, the dashed placeholder */
  { key: 'media', label: 'Media', values: ['none', 'missing'] },
]
const cap = (v) => v[0].toUpperCase() + v.slice(1)
/* the shelf draws download · star · trash only when the handlers exist — placeholders, so the reference shows them */
const noop = () => {}
const SHELF_SLOTS = { count: 12, onDownload: noop, onFavourite: noop, onDelete: noop }

function VariantsButton({ axes, onChange }) {
  const [open, setOpen] = useState(false)
  /* the dropdowns portal to <body> as well — a click in one is not an outside press of this panel */
  const popover = usePopover({ open, onOpenChange: setOpen, placement: 'bottom-end', offset: 8, dismiss: { outsidePress: (e) => !e.target.closest?.('.kol-popover-float') } })
  return (
    <div className="fixed z-10" style={{ top: 'var(--kol-shell-page-pad)', right: 'var(--kol-shell-page-pad)' }}>
      <span ref={popover.refs.setReference} {...popover.getReferenceProps()} className="inline-flex">
        <Button iconOnly="slider-01" size="lg" tone="inverted" radius="full" aria-label="Variants" style={{ boxShadow: 'var(--kol-shadow-lg)' }} pressed={open} />
      </span>
      <PopoverPanel popover={popover} className="grid grid-cols-[auto_1fr] items-center gap-x-4 gap-y-2 p-3">
        {AXES.map((a) => [
          <span key={`${a.key}-l`} className="kol-mono-12 text-fg-64">{a.label}</span>,
          <Dropdown key={a.key} size="sm" value={axes[a.key]} onChange={(v) => onChange(a.key, v)}
            options={[{ heading: a.label }, { divider: true }, ...a.values.map((v) => ({ value: v, label: cap(v) }))]} />,
        ])}
      </PopoverPanel>
    </div>
  )
}

export default function App() {
  const [view, setView] = useState('recent')
  const [axes, setAxes] = useState({ preset: 'catalog', ...PRESET_AXES.catalog, media: 'none' })
  const change = (key, value) => setAxes((a) => (key === 'preset' ? { ...a, preset: value, ...PRESET_AXES[value] } : { ...a, [key]: value }))
  return (
    <>
      <CatalogPage
        preset={axes.preset}
        cardVariant={axes.card}
        rowVariant={axes.row}
        listLayout={axes.list}
        width={axes.width}
        header={{
          title: 'Catalog',
          subtitle: `${ITEMS.length} items`,
        }}
        items={view === 'saved' ? ITEMS.filter((i) => i.saved) : ITEMS}
        searchKeys={['title', 'kind']}
        filtersTitle="All Items"
        filterGroups={[{ label: 'Kind', key: 'kind', values: KINDS }, { label: 'Tag', key: 'tags', values: TAGS }]}
        views={VIEWS}
        view={view}
        onViewChange={setView}
        toCard={(it) => ({ key: it.name, title: it.title, detail: `${it.kind} · ${it.tags.map((t) => `#${t}`).join(' ')}`, date: it.date, size: it.size, ...(axes.media === 'none' ? { media: false } : null), ...(axes.preset === 'shelf' ? SHELF_SLOTS : null) })}
      />
      <VariantsButton axes={axes} onChange={change} />
    </>
  )
}
