import { useState } from 'react'
import { ActionButton, Button, PopoverPanel, SegmentedToggle, SizeOrDownload, ToggleCheckbox, usePopover } from '@kolkrabbi/kol-component'
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
 * segmented row per CatalogPage axis. A preset sets the other axes to its own values, because an explicit
 * prop beats the preset — `shelf` with `cardVariant="catalog"` still passed would not be the shelf. */
const PRESET_AXES = {
  catalog: { card: 'catalog', row: 'catalog', list: 'grid', width: 'bleed' },
  app: { card: 'app', row: 'app', list: 'grid', width: 'bleed', cols: '3' },
  shelf: { card: 'slide', row: 'slide', list: 'stack', width: 'capped' },
}
const AXES = [
  { key: 'preset', label: 'Preset', values: ['catalog', 'app', 'shelf'] },
  { key: 'card', label: 'Card', values: ['catalog', 'file', 'app', 'slide', 'article', 'showcase'] },
  { key: 'row', label: 'Row', values: ['catalog', 'file', 'app', 'slide'] },
  { key: 'list', label: 'List', values: ['grid', 'stack'] },
  /* the list grid's column ceiling — CatalogPage's `listColumns` */
  { key: 'cols', label: 'Columns', values: ['1', '2', '3', '4'] },
  { key: 'width', label: 'Width', values: ['bleed', 'capped'] },
  /* image = a colour in the slot (default — the cards are built around a cover, user 2026-10-22:
   * *"everything breaks if there isnt one in the slot"*) · none = `media={false}` · missing = the dashed MISSING plate */
  { key: 'media', label: 'Media', values: ['image', 'pattern', 'none', 'missing'] },
  /* the cover's hover zoom — ContentCard's opt-in `zoom` prop (off by default on file) */
  { key: 'zoom', label: 'Zoom', values: ['off', 'on'] },
]
const cap = (v) => v[0].toUpperCase() + v.slice(1)
/* a plain colour in the slot — inline, because the build ships no public/ */
const PLACEHOLDER = 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 4 4"><rect width="4" height="4" fill="#6b7280"/></svg>')
const placeholder = <img src={PLACEHOLDER} alt="" />
/* PATTERN — stripes and a disc, so the cover's hover zoom is visible (user 2026-10-22: *"I cant see what hover
 * does with solid color"*) */
const PATTERN = 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400"><defs><pattern id="s" width="20" height="20" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="20" height="20" fill="#6b7280"/><rect width="10" height="20" fill="#7c8391"/></pattern></defs><rect width="400" height="400" fill="url(#s)"/><circle cx="200" cy="200" r="90" fill="#9ca3af"/></svg>')
const pattern = <img src={PATTERN} alt="" />
/* the shelf draws download · star · trash only when the handlers exist — placeholders, so the reference shows them */
const noop = () => {}
const SHELF_SLOTS = { count: 12, onDownload: noop, onFavourite: noop, onDelete: noop }
/* the APP card and row (CatalogAppVariant, kol-component 0.291.0): raw writes in, the page draws download,
 * cog over trash, Rename / Duplicate / Delete on right-click and the file's info rail on the cog (tags, details —
 * 2026-10-23) — placeholders, so the reference shows them */
const APP_SLOTS = { download: noop, verbs: { rename: noop, duplicate: noop, remove: noop }, onClick: noop, onTags: noop }
/* the FILE card as the media library draws it (MediaLibraryPages' grid): download on the cover, the select
 * checkbox in the cover's other corner, copy · rename · delete in the plate, the size as a download link,
 * click selects. Without these the reference showed a bare card (user 2026-10-22: *"where are the icons,
 * the interaction the overlay on image?"*) */
const stop = (e) => e.stopPropagation()
const fileSlots = (it, selected, toggle) => ({
  control: <ActionButton chrome="media" icon="download" confirmIcon="check" label="Download" confirmLabel="Downloaded" onAction={noop} />,
  controlStart: <ToggleCheckbox variant="media" checked={selected} onChange={toggle} onClick={stop} aria-label={`Select ${it.title}`} />,
  size: <SizeOrDownload href="#">{it.size}</SizeOrDownload>,
  actions: (
    /* VERTICAL, spread over the text section's padded height — the card's plate and the row's alike (user 2026-10-22) */
    <div className="flex h-full flex-col items-center justify-between" onClick={stop}>
      <ActionButton chrome="inline" size="sm" icon="copy" confirmIcon="check" label="Copy URL" confirmLabel="Copied" onAction={noop} />
      <ActionButton chrome="inline" size="sm" icon="trash" confirmIcon="check" label="Delete" confirmLabel="Deleted" onAction={noop} />
    </div>
  ),
  selected,
  onClick: toggle,
})

function VariantsButton({ axes, onChange }) {
  const [open, setOpen] = useState(false)
  /* each axis is a SEGMENTED row, not a dropdown (user 2026-10-22, on a dropdown list opening over the panel
   * in the panel's own color): every option visible, one click, nothing floats over the panel */
  const popover = usePopover({ open, onOpenChange: setOpen, placement: 'bottom-end', offset: 8 })
  return (
    <div className="fixed z-10" style={{ top: 'var(--kol-shell-page-pad)', right: 'var(--kol-shell-page-pad)' }}>
      <span ref={popover.refs.setReference} {...popover.getReferenceProps()} className="inline-flex">
        <Button iconOnly="slider-01" size="lg" tone="inverted" radius="full" aria-label="Variants" style={{ boxShadow: 'var(--kol-shadow-lg)' }} pressed={open} />
      </span>
      <PopoverPanel popover={popover} className="grid grid-cols-[auto_1fr] items-center gap-x-4 gap-y-2 p-3">
        {AXES.map((a) => [
          <span key={`${a.key}-l`} className="kol-mono-12 text-fg-64">{a.label}</span>,
          <SegmentedToggle key={a.key} size="sm" ariaLabel={a.label} value={axes[a.key]} onChange={(v) => onChange(a.key, v)}
            options={a.values.map((v) => ({ value: v, label: cap(v) }))} />,
        ])}
      </PopoverPanel>
    </div>
  )
}

export default function App() {
  const [view, setView] = useState('recent')
  const [picked, setPicked] = useState(() => new Set())
  const toggle = (key) => setPicked((p) => { const n = new Set(p); n.has(key) ? n.delete(key) : n.add(key); return n })
  const [axes, setAxes] = useState({ preset: 'catalog', ...PRESET_AXES.catalog, media: 'image', zoom: 'off', cols: '4' })
  /* picking a row kind sets Columns the way CatalogPage defaults it: file and slide 3, catalog 4 */
  const change = (key, value) => setAxes((a) => (key === 'preset' ? { ...a, preset: value, ...PRESET_AXES[value] }
    : key === 'row' ? { ...a, row: value, cols: value === 'catalog' ? '4' : '3' }
    : { ...a, [key]: value }))
  return (
    <>
      <CatalogPage
        preset={axes.preset}
        cardVariant={axes.card}
        rowVariant={axes.row}
        listLayout={axes.list}
        listColumns={Number(axes.cols)}
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
        toCard={(it) => ({ key: it.name, title: it.title, detail: `${it.kind} · ${it.tags.map((t) => `#${t}`).join(' ')}`, date: it.date, size: it.size, zoom: axes.zoom === 'on', ...(axes.media === 'image' ? { media: placeholder } : axes.media === 'pattern' ? { media: pattern } : axes.media === 'none' ? { media: false } : null), ...(axes.preset === 'shelf' ? SHELF_SLOTS : null), ...(axes.card === 'file' ? fileSlots(it, picked.has(it.name), () => toggle(it.name)) : null), ...(axes.card === 'app' || axes.row === 'app' ? { ...APP_SLOTS, tags: it.tags, details: [{ label: 'Kind', value: it.kind }] } : null) })}
      />
      <VariantsButton axes={axes} onChange={change} />
    </>
  )
}
