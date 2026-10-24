import { useEffect, useRef, useState } from 'react'
import { ActionButton, AppItemMenuProvider, ContentCard, ContentFilters, ContentRow, SizeOrDownload, formatSize, useMediaQuery } from '@kolkrabbi/kol-component'
import PageShell from './PageShell.jsx'
import { PageHeader } from '@kolkrabbi/kol-component'
import WalkthroughPanel from './WalkthroughPanel.jsx'
import CatalogGrid from './CatalogGrid.jsx'

/* taxonomy-ok: organism — nests PageShell / PageHeader / WalkthroughPanel / CatalogGrid (relative) + kol-component's ContentFilters + ContentCard / ContentRow */

/**
 * CatalogPage — An app's home or library page. the app tier's Home / Library page, shipped once (ShellHomeSystem,
 * kol-fxr 2026-08-27 — fxr's HomePage / LibraryPage and monitor's HomePage were
 * the same page written three times): `PageHeader` → `ContentFilters` (title ·
 * filter · search, the view strip in the header, LIST / GRID below the divider)
 * → the catalog grid — cards `repeat(6, 1fr)` gap 24, rows `repeat(4, 1fr)` gap
 * 8, `ContentCard` / `ContentRow variant="catalog"` — → the bottom action row
 * (`marginTop: 48`, `alignSelf: flex-start`, gap 12). The walkthrough panel
 * sits over the catalog while `walkthrough.open`; the strip hides and the grid
 * yields, as both apps do.
 *
 * Semantics are the consumer's: what RECENT / SAVED mean, what an item is,
 * what a click does. `toCard(item, { view, layout })` → `{ key, title, detail,
 * …every prop ContentCard / ContentRow takes }` — `title`, `detail`, `media`,
 * `actions`, `onClick`, `href`, `onNavigate`, `expanded`, `expandedContent`, `fit`,
 * `ratio`, `date`, `size`, `meta`, `tags`, `selected`, `variant`, … — is the whole
 * contract: the return is SPREAD onto the card or the row (user ruling 2026-09-03,
 * a composition forwards the whole contract of what it composes) — `expanded` / `expandedContent` reach `ContentCard catalog`'s
 * 2×2 cell (ShellHomeSystemMonitorGaps, kol-monitor 2026-08-27) — and the page
 * HIDES the cell's three neighbours itself (CatalogPageMonitorParity: the
 * consumer never sees the filtered row order, so it cannot; monitor's
 * `computeHiddenSet` for the 6-column grid, verbatim — the grid stays still
 * instead of reflowing around the expanded card); `fit` (`cover` default | `natural` | `compact`) is the
 * card's media fit, PER CARD because one catalog mixes photographs (cover) and
 * diagrams (natural) — CatalogPageCardFit, kol-monitor: a rack preview wider
 * than the card lost its left rail to `cover`; `ratio` (catalogpage-card-ratio, kol-client-olina
 * 2026-09-03) is the card's aspect, PER CARD for the same reason — one page renders the same artwork
 * at 1:1, 4:5 and 9:16 side by side, and a deck is a 16:9 stage — unset falling through to the
 * variant's A4, so nothing existing moves. Anything `ContentFilters` takes that the page has no
 * prop for goes through `filtersProps` — `mutuallyExclusiveFilters` was the gap.
 *
 * @param {'catalog'|'app'|'shelf'} preset  the whole page as one word (default `catalog` = today's defaults). `app` = an
 *                                 app's saved files: the `app` card and row (`toCard` returns `verbs` · `download` ·
 *                                 `menuItems` · `date` ms · `size` bytes · `media` src) and one shared menu. `shelf` = a
 *                                 shelf of slide decks: capped · 3 tracks on a 280 floor · `slide` card and row · stacked
 *                                 list · `kol-tone-secondary` on the root · the All / Recent view strip; `toCard` returns
 *                                 the deck's fields and handlers — `title date bytes count cover href onNavigate onDownload
 *                                 onFavourite onDelete favourited` — and the page renders the slots. Explicit props win.
 * @param {Object}   header        PageHeader props — `{ title, subtitle, size, voice, eyebrow, masthead }`; inside a
 *                                 Shell the app's masthead wins, and a Catalog with NO Shell sets `masthead` here (2026-09-29)
 * @param {Array}    items         the objects `ContentFilters` filters and searches
 * @param {Function} toCard        (item, { view, layout }) => card props (see above)
 * @param {string}   filtersTitle  ContentFilters' title (e.g. "All Chromes")
 * @param {Array}    filterGroups  ContentFilters' `[{ label, key, values }]`
 * @param {string[]} searchKeys    fields the search reads (default `['title', 'name']`)
 * @param {Array}    views         the header strip `[{ value, label }]` (RECENT / SAVED); omit for none
 * @param {string}   view · onViewChange   controlled view; or `defaultView`
 * @param {Array}    layouts       LIST / GRID (default both)
 * @param {string}   defaultLayout 'grid' (default) | 'list'
 * @param {{steps: Array, open: boolean, onClose?: Function, iconComponent?: ElementType}} walkthrough  the panel over the catalog; `onClose` draws its X inside the card
 * @param {ReactNode} actions      the bottom row's buttons
 * @param {'scroll'|'fixed'} mode  the page's HEIGHT (plan-2026-10-23 § 4.12, his idea: *"100vh and have the content vertically
 *                                 scroll … new file and walkthrough are always at the same place regardless of content"*):
 *                                 `scroll` (default) is the page as it was; `fixed` holds the page at the viewport's height,
 *                                 the catalog scrolls in its own region and the action row sits at the foot, in the same
 *                                 place with one item or a hundred
 * @param {boolean}  actionsOnPhone  draw the action row below `md` (default true); false when the phone bar's More sheet carries it
 * @param {'bleed'|'capped'} width   the page's TIER, forwarded to PageShell (two-page-scaffolds-one-job, 2026-09-03):
 *                                 `bleed` (default) fills the window — the app tier; `capped` centres on the
 *                                 framework container — the site tier, so a brand book adopting this page keeps its geometry
 * @param {ReactNode} trailingActions  the header's RIGHT slot (ContentFilters' — MediaLibrary's SELECT / FLAT); never empty beside the divider
 * @param {number}    minColumn      the grid track's floor in px (default 160) — a minimum, never a count
 * @param {number}    maxColumns     the grid's ceiling (default 6, the ruling); a three-deck shelf passes 3 and the tracks share the width
 * @param {string}    cardVariant    the grid card's variant, per page (default `catalog`); `toCard` may return `variant` per card
 * @param {'catalog'|'file'|'app'} rowVariant  the list row (default `catalog`, the 36px no-thumb row); `file` = the 48px thumb row, for a catalog whose grid shows a cover —
 *                                 its slots (`date` · `size` · `meta` · `selected`) come from `toCard` like everything else
 * @param {number}  listColumns  the list grid's column ceiling (default 3 for a file, app or slide row, else 4); tracks never go under 240
 * @param {'grid'|'stack'} listLayout   the list's container (default `grid`, rows four across — monitor's ruling); `stack` = one row per line
 * @param {'list'|'grid'} phoneLayout  below `md` (768, the shell's `drawerBelow` rung): `list` (default) draws the list with the
 *                                 preset's row and no LIST / GRID strip — a phone gets rows, the grid card breaks its
 *                                 layout (studio-hub review 2, § 7.2 — *"I do like just using row contentcard for mobile …
 *                                 if we opt for just using row card on mobile, then we don't need to show it at all"*);
 *                                 `grid` keeps the desk's strip and layouts on a phone
 * @param {ReactNode} lead         a node between the masthead and the catalog (HubHome's quick links on a phone)
 * @param {ElementType} iconComponent  icon renderer seam for ContentFilters
 * @param {boolean}  showCountOnlyWhenFiltering  (default true)
 * @param {Object}   filtersProps  spread onto ContentFilters last — e.g. `{ mutuallyExclusiveFilters: ['category', 'u_label'] }`
 */
const LAYOUTS = [
  { value: 'list', label: 'LIST' },
  { value: 'grid', label: 'GRID' },
]

/* The 2×2 expanded card's three neighbours — the cell to the right, the two
 * beneath — skipped so the grid stays still (monitor's computeHiddenSet, verbatim). */
function computeHiddenSet(items, expandedIdx) {
  if (expandedIdx < 0) return new Set()
  const hiddenSet = new Set()
  const blockCol = Math.floor((expandedIdx % 6) / 2)
  const blockRow = Math.floor(Math.floor(expandedIdx / 6) / 2)
  const base = blockRow * 12 + blockCol * 2
  ;[base, base + 1, base + 6, base + 7].forEach(i => {
    if (i !== expandedIdx && i < items.length) hiddenSet.add(i)
  })
  return hiddenSet
}

/* PRESETS — a whole page frozen as one word (slide-variant-and-shelf-preset,
 * kol-client-olina 2026-09-03; user, after building /slide-deck by hand through
 * eleven props: "this is a look I DO NOT want to do this again… this is a
 * layout SET" · "freeze this so I can use AS IS again"). `catalog` is today's
 * defaults, byte-identical. `shelf` is olina's /slide-deck as it stood, every
 * value read off the render. An explicit prop always wins over its preset. */
const PRESETS = {
  /* the app tier holds still (user 2026-10-23: *"I do like the heading fixed at the top … a rule to avoid vertical
   * scroll"*): the masthead and filter row stay, the catalog scrolls, the action row is the foot. `mode` below. */
  catalog: { mode: 'fixed' },
  /* an app's saved files (CatalogAppVariant, kol-fxr 2026-10-23): the `app` card and row — `toCard`
   * returns `verbs` · `download` · `menuItems` · `date` · `size` · `media` and the page draws the rest */
  /* 208 FLOOR (user 2026-10-24: *"the layout of the card CAN NOT CHANGE on resolution available"*): the card's text
   * column is the track less 24 of plate pad and the 28 the cog and trash reserve; `2026-10-23` · 24 gap · `999.9 KB`
   * at mono-12 is 72 + 24 + 58 = 154, so a 208 track holds the pair on one line for every size, and a narrower page
   * drops a column (CatalogGrid's measured count) instead of breaking the row. Was 160, where the size wrapped by file. */
  app: { cardVariant: 'app', rowVariant: 'app', mode: 'fixed', minColumn: 208 },
  shelf: {
    width: 'capped', maxColumns: 3, minColumn: 280,
    cardVariant: 'slide', rowVariant: 'slide', listLayout: 'stack',
    /* one word tones every control on the page (tone-is-the-ground-axis) */
    className: 'kol-tone-secondary',
    /* the header's right slot is the view strip — ContentFilters' own idiom */
    views: [{ value: 'all', label: 'All' }, { value: 'recent', label: 'Recent' }], defaultView: 'all',
  },
}
const stop = (e) => { e.preventDefault(); e.stopPropagation() }
/* the shelf's DATA → the slide variant's slots, the media admin's idiom
 * (MediaLibraryPages:704) verbatim from olina's /slide-deck: download is the
 * control ON the image (chrome="media"), the plate carries star (toggle) and
 * trash (confirm) in a column, the row carries download · star · trash inline;
 * the size cell is SizeOrDownload; `count` is the slide count. A slot the
 * consumer supplies itself is left alone. The consumer writes no JSX for
 * actions — that is the point of the preset. */
/* THE FOLD (user 2026-10-23, Firefox's rail as the example: *"the first row is clipped, like we want … a slight shadow"*):
 * the fixed mode's scroll region with a 32px fade from the page's ground at its TOP edge, only once rows have scrolled
 * under it, so a cut row reads as folded under the edge. The top alone (user 2026-10-23: *"I dont think we need it on bottom"*). A fade, not a
 * shadow: on this ground a shadow has nothing to fall on. `bleed` runs the region through the page's bottom pad. */
function ScrollRegion({ bleed, children }) {
  const ref = useRef(null)
  const [under, setUnder] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return undefined
    const read = () => setUnder(el.scrollTop > 0)
    read()
    el.addEventListener('scroll', read, { passive: true })
    const ro = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(read)
    ro?.observe(el)
    if (el.firstElementChild) ro?.observe(el.firstElementChild)
    return () => { el.removeEventListener('scroll', read); ro?.disconnect() }
  }, [])
  const fade = (
    <div
      aria-hidden
      /* PAGE-WIDE, through the side pads, so the band has no visible ends (user 2026-10-23: "it clips the left and right");
       * the opaque surface under the wash, else a translucent wash fading to nothing is a band you hardly see */
      className="pointer-events-none absolute h-8 transition-opacity duration-150"
      style={{
        top: 0,
        left: 'calc(var(--kol-shell-page-pad) * -1)',
        right: 'calc(var(--kol-shell-page-pad) * -1)',
        opacity: under ? 1 : 0,
        background: 'linear-gradient(to bottom, var(--kol-shell-page-wash, transparent), transparent), linear-gradient(to bottom, var(--kol-surface-primary) 20%, transparent)',
      }}
    />
  )
  return (
    /* THE FOLD SITS RIGHT UNDER THE LIST / GRID ROW (user 2026-10-23: *"it could fade further up"*): ContentFilters puts 24px
     * of air above its items; the region takes that air INSIDE its scroll box, so at rest nothing moves and a scrolled row
     * folds under the row above, not 24px below it */
    <div className="relative flex min-h-0 flex-1 flex-col" style={{ marginTop: 'calc(var(--kol-spacing-6) * -1)', marginBottom: bleed ? 'calc(var(--kol-shell-page-pad) * -1)' : undefined }}>
      <div ref={ref} style={{ flex: 1, minHeight: 0, overflowY: 'auto', paddingTop: 'var(--kol-spacing-6)' }}>{children}</div>
      {fade}
    </div>
  )
}

function toSlideCard(c, { layout }) {
  const { bytes, count, cover, favourited, onDownload, onFavourite, onDelete, downloadHref, ...rest } = c
  const list = layout === 'list'
  return {
    ...rest,
    media: rest.media ?? (cover ? <img src={cover} alt="" loading="lazy" /> : null),
    size: rest.size ?? (bytes != null ? <SizeOrDownload href={downloadHref ?? '#'}>{formatSize(bytes)}</SizeOrDownload> : undefined),
    meta: rest.meta ?? (count ? `${count} slides` : undefined),
    control: rest.control ?? (!list && onDownload ? <ActionButton chrome="media" icon="download" confirmIcon="check" label="Download" confirmLabel="Downloaded" onAction={onDownload} /> : undefined),
    actions: rest.actions ?? ((onFavourite || onDelete || (list && onDownload)) ? (
      <div className={list ? 'flex items-center gap-2' : 'flex h-full flex-col items-center justify-between'} onClick={stop}>
        {list && onDownload && <ActionButton chrome="inline" size="sm" icon="download" label="Download" onAction={onDownload} />}
        {onFavourite && <ActionButton chrome="inline" size="sm" icon={favourited ? 'star-solid' : 'star'} label="Favourite" toggle onAction={onFavourite} />}
        {onDelete && <ActionButton chrome="inline" size="sm" icon="trash" confirmIcon="check" label="Delete" confirmLabel="Deleted" onAction={onDelete} />}
      </div>
    ) : undefined),
  }
}

export default function CatalogPage({
  /* FIRST, so every default below can read it */
  preset = 'catalog',
  header,
  /* a site-tier page (`capped`, the shelf) is a document and scrolls; the app tier's presets hold still */
  mode,
  actionsOnPhone = true,
  width = PRESETS[preset]?.width ?? 'bleed',
  items = [],
  toCard,
  filtersTitle,
  filterGroups,
  searchKeys = ['title', 'name'],
  views = PRESETS[preset]?.views,
  view,
  onViewChange,
  defaultView = PRESETS[preset]?.defaultView,
  layouts = LAYOUTS,
  defaultLayout = 'grid',
  walkthrough,
  actions,
  /* the header's RIGHT slot — where MediaLibrary puts SELECT / FLAT. CatalogPage
     shipped with no way to fill it, so every catalog page rendered an empty slot
     beside the divider (kol-client-olina 2026-09-03, on /slide-deck). */
  trailingActions,
  /* the grid track's floor. 160 is a 26-tile catalog's; a shelf of three decks
     wants ~280 so the cards read at all. A ceiling of 6 tracks still applies. */
  minColumn = PRESETS[preset]?.minColumn ?? 160,
  /* the ceiling — the six-column ruling is a MAXIMUM; a three-deck shelf says 3
     (kol-client-olina 2026-09-03; user: "why are the cards so small? they could
     use 2 columns each" — raising the floor to force it was backwards) */
  maxColumns = PRESETS[preset]?.maxColumns ?? 6,
  /* the LIST row's variant. `catalog` (default) is the 36px GridCard row — title
     and detail on one line, no thumb — which is what every app-tier list was
     ruled on (CatalogPageMonitorParity). A catalog whose grid shows a cover
     passes `file`: the 48px thumb row, so the list shows the same cover small
     (kol-client-olina 2026-09-03; user, on the bare row: "ugly ugly ugly"). */
  rowVariant = PRESETS[preset]?.rowVariant ?? 'catalog',
  /* the GRID card's variant, per page; `toCard` may return `variant` per card */
  cardVariant = PRESETS[preset]?.cardVariant ?? 'catalog',
  /* the LIST's container. `grid` (default) is monitor's ruling — rows four across
     on a 240 floor, gap 8 (the documented `repeat(4, 1fr)`). `stack` is one row per
     line, which is what a list of files is (MediaLibrary stacks); olina's deck list
     rendered three 300px rows side by side (user: "why is it tiny?"). */
  listLayout = PRESETS[preset]?.listLayout ?? 'grid',
  /* the LIST grid's column ceiling (2026-10-22 — user: *"are you passing props on number of items/columns?"*). It was
     a hard 4 — monitor's ruling for the 36px catalog row. A file or slide row is a contained tile with a 72 thumb, so
     it defaults to 3 (user: *"change this one to 3"*). Tracks still never go under 240. */
  listColumns = rowVariant === 'file' || rowVariant === 'app' || rowVariant === 'slide' ? 3 : 4,
  iconComponent,
  showCountOnlyWhenFiltering = true,
  filtersProps,
  phoneLayout = 'list',
  lead,
  children,
  className = '',
  style,
}) {
  mode = mode ?? (width === 'capped' ? 'scroll' : PRESETS[preset]?.mode ?? 'scroll')
  const open = walkthrough?.open === true
  /* a phone gets rows: the list, and no LIST / GRID strip to choose from */
  const phoneRows = useMediaQuery('(max-width: 767px)') && phoneLayout !== 'grid'
  /* THE TRACK COUNT, MEASURED by `CatalogGrid` (CatalogFilterFirstGroupTrackCount, 2026-09-03) and set here on the
   * page too, where the filter row's `.kol-filters-first` reads the same `--kol-catalog-n`. `null` until measured →
   * the theme's fallback of 6, the pre-0.137.0 geometry. */
  const [cols, setCols] = useState(null)

  /* the page's ONE menu for its `app` cards and rows (AppItem.jsx) — closed, it renders nothing */
  return (
    <AppItemMenuProvider>
    <PageShell mode={mode} width={width} className={`${PRESETS[preset]?.className ?? ''} ${className}`.trim()} style={{ overflow: 'hidden', '--kol-catalog-n': cols ?? undefined, ...style }}>
      {header && <PageHeader level="app" {...header} />}
      {lead}
      <div style={mode === 'fixed' ? { flex: 1, minHeight: 0, position: 'relative', display: 'flex', flexDirection: 'column' } : { flex: 1, position: 'relative' }}>
        {open && <WalkthroughPanel steps={walkthrough.steps} iconComponent={walkthrough.iconComponent} onClose={walkthrough.onClose} />}
        <ContentFilters
          items={items}
          title={filtersTitle}
          totalCount={items.length}
          filterGroups={filterGroups}
          searchKeys={searchKeys}
          showCountOnlyWhenFiltering={showCountOnlyWhenFiltering}
          iconComponent={iconComponent}
          viewModeOptions={views}
          trailingActions={trailingActions}
          viewMode={view}
          onViewModeChange={onViewChange}
          defaultViewMode={defaultView}
          layoutOptions={open || phoneRows ? undefined : layouts}
          defaultLayout={defaultLayout}
          layout={phoneRows ? 'list' : undefined}
          renderItem={(rows, viewMode, layout) => {
            if (open) return null
            const cards = rows.map((item) => { const c = toCard ? toCard(item, { view: viewMode, layout }) : { title: item.title ?? item.name, detail: item.detail }; return preset === 'shelf' ? toSlideCard(c, { layout }) : c })
            const hidden = layout === 'list' ? new Set() : computeHiddenSet(rows, cards.findIndex((c) => c.expanded))
            /* COLS IS A CEILING, NOT A COMMAND (CatalogPageMobileColumns,
              * kol-monitor 2026-09-01) — the third home of the defect
              * ContentCollectionMinColumnWidth and ContentGridMinColumnWidth
              * closed, unreachable by either because this grid is drawn inline.
              * `repeat(6, 1fr)` computed six 29px slivers at 390. Same idiom as
              * ContentCollection:144 — up to 6 (grid) / 4 (list) columns, and a
              * track may not go under the floor (160 grid / 240 list) nor demand
              * more than the container. At monitor's desktop widths the sixth-
              * share clears the floor, so nothing moves there. NB the 2×2
              * expanded-card neighbour math (computeHiddenSet) stays a
              * six-column ruling — below the ceiling the hide-set is
              * desktop-only geometry. */
            /* the grid and the list are `CatalogGrid` (studio-hub review 2, § 3.1): the measured tracks, `.kol-catalog-grid`,
             * the list's `listColumns` — one piece, so StudioCreate's parts draw on the same one */
            const grid = (
            <CatalogGrid layout={layout} minColumn={minColumn} maxColumns={maxColumns} listColumns={listColumns} listLayout={listLayout} onColumns={setCols}>
              {rows.map((item, i) => {
                if (hidden.has(i)) return null
                const c = cards[i]
                const key = c.key ?? item.key ?? item.id ?? item.name ?? i
                /* A COMPOSITION FORWARDS THE WHOLE CONTRACT OF WHAT IT COMPOSES (user
                 * 2026-09-03: "why wouldn't we as standard practice ALLOW VARIANT CHANGE
                 * EVERY TIME WE USE THOSE CONTENT CARDS?"). `toCard`'s return is SPREAD
                 * onto the card and the row; `variant` per card beats the page's
                 * `cardVariant` / `rowVariant`; `fit` keeps its `cover` default. `key`
                 * is React's and is lifted out first. */
                const { key: _key, ...forwarded } = c
                return layout === 'list'
                  ? <ContentRow key={key} {...forwarded} variant={c.variant ?? rowVariant} />
                  : <ContentCard key={key} {...forwarded} variant={c.variant ?? cardVariant} fit={c.fit ?? 'cover'} />
              })}
            </CatalogGrid>
            )
            /* `fixed`: the catalog scrolls in its own region — the fill chain ContentFilters keeps for a fixed page
             * (ContentFiltersFillChain) ends here, in a scroller; the page itself never scrolls */
            /* TO THE PAGE'S EDGE (user 2026-10-23: *"padding bottom is still there clipping"*): with no foot row under it the
             * region bleeds through the page's bottom pad, so a cut row reads as scrolling under the edge, not stopped above a band */
            return mode === 'fixed' ? <ScrollRegion bleed={!actions}>{grid}</ScrollRegion> : grid
          }}
          {...filtersProps}
        />
      </div>
      {children}
      {/* `fixed`: the action row is the page's FOOT, the same place with one item or a hundred */}
      {actions && <div className={actionsOnPhone ? 'flex' : 'flex max-md:hidden'} style={{ gap: 12, marginTop: mode === 'fixed' ? 24 : 48, alignSelf: 'flex-start', flexShrink: 0 }}>{actions}</div>}
    </PageShell>
    </AppItemMenuProvider>
  )
}
