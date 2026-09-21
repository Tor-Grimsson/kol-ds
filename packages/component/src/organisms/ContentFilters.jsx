import { useState, useMemo } from 'react'
import Tag from '../atoms/Tag.jsx'
import Divider from '../atoms/Divider.jsx'
import Button from '../atoms/Button.jsx'
import { Icon } from '@kolkrabbi/kol-icons'
import { glyphSize } from '../hooks/glyphLadders.js'
import SearchInput from '../molecules/SearchInput.jsx'
import IconFrame from '../atoms/IconFrame.jsx'

/**
 * ContentFilters — universal filter component for content grids.
 *
 * Reusable filter component with expandable panel, tag-based filtering,
 * search, and view-mode toggle. Used across Shop, Collections, Specimens,
 * Typefaces, etc.
 *
 * @param {Object} props
 * @param {Array} props.items — array of items to filter
 * @param {string} props.title — section title (e.g., "Shop", "Collections")
 * @param {number} props.totalCount — total count before filtering
 * @param {Array} props.filterGroups — [{label, key, values}, ...]
 * @param {Function} props.renderItem — (filteredItems, viewMode, layout) => ReactNode
 * @param {Array} props.viewModeOptions — optional view mode options for the view strip
 * @param {'auto'|'header'|'below'} props.viewPlacement — WHERE the RECENT/SAVED strip sits (ContentFiltersViewStripOverflow,
 *   kol-mirror 2026-09-02): `auto` (default) rides the header row from `md` and takes its OWN line under the divider
 *   below it, full width and wrapping — five views at 390 were 440px in a 390px page, two cut off and unreachable;
 *   `header` always the header row; `below` always its own line. Same family, same rung as LIST/GRID's drop.
 * @param {string} props.defaultViewMode — default view mode (falls back to the FIRST option)
 * @param {string} props.layout — controlled LIST/GRID value (kol-r2b2 2026-08-27: a consumer that persists
 *   layout per bucket needs the strip's value back; `defaultLayout` alone kept it internal)
 * @param {Function} props.onLayoutChange — (layout) => void, fires on every strip click
 * @param {ReactNode} props.leadingActions — the LEFT half of the below-divider row, beside the
 *   LIST/GRID strip (kol-r2b2 2026-08-27: the selection bar lives there, not on a row of its own)
 * @param {ReactNode} props.belowActions — the RIGHT half of the below-divider row, beside the count
 *   (kol-r2b2 2026-08-27: the sort group, once SELECT/FLAT moved up into the header strip)
 * @param {ReactNode} props.trailingActions — the header's RIGHT slot, where the view strip sits
 * @param {'auto'|'header'|'below'} props.trailingPlacement — WHERE `trailingActions` sit (the showcase's icons page,
 *   2026-09-02: brand's ground + guide cluster in this slot measured 223px and scrolled `main` sideways at 390):
 *   `auto` (default) the header from `md`, their OWN line under the divider below it — full width, wrapping; `header` / `below` pin it.
 *   The same rung `viewPlacement` and LIST/GRID have.
 *   (kol-r2b2 2026-08-27: a consumer's own controls — sort, flat, select — belong there;
 *   `headerActions` is the left group beside search and was never that)
 * @param {Function} props.onFilterChange — optional callback when filters change
 * @param {Array} props.mutuallyExclusiveFilters — filter keys that should be mutually exclusive
 * @param {string[]} props.initialFilters — chips active on FIRST paint, as `"<groupKey>:<value>"`
 *                  (e.g. `['kind:preset']`). Initial only: the component owns the set after that
 * @param {Array} props.customFilterKeys — filter keys handled by renderItem, not by ContentFilters
 * @param {ElementType} props.iconComponent — icon seam (defaults to DS Icon; needs `filter` + `search`)
 *
 * Look seams — all default to the shipped values, pass nothing and nothing changes:
 * @param {string}  props.titleClassName      — header title type/ink
 * @param {boolean} props.titleUppercase      — cases the title (default false)
 * @param {string}  props.labelClassName      — filter-group label type/ink (default `kol-eyebrow text-fg-96`)
 * @param {boolean} props.labelUppercase      — cases the group label (default true)
 * groups: `{ label, key, values, stack?, className?, wrapClassName? }` — THE FIRST GROUP IS ONE CATALOG COLUMN
 * WIDE (`(row − 120px) / 6`, the `1fr` of `repeat(6, 1fr)` gap 24 — a fraction, never a px; `.kol-filters-first`,
 * kol-theme ≥0.73.0), EVERY GROUP AFTER IT FLOWS (user law 2026-08-27, by position, never by chip count —
 * the hug's width overruled the same day: "nope not hug, fix a size"); `stack` is the explicit
 * override; `className` / `wrapClassName` are per-group seams
 * @param {string}  props.tagVariant          — filter chip variant ('primary' grey fill)
 * @param {string}  props.tagSize             — filter chip size
 * @param {string}  props.tagActiveClassName  — chip ink, selected
 * @param {string}  props.tagRestClassName    — chip ink, unselected
 * @param {string}  props.viewClassName       — RECENT/SAVED strip type
 * @param {string}  props.layoutClassName     — LIST/GRID strip type
 * @param {string}  props.stripActiveClassName — strip ink, selected (both strips)
 * @param {string}  props.stripRestClassName  — strip ink, unselected (both strips)
 * @param {string}  props.countClassName      — the "N of N" type/ink
 * @param {string}  props.tone                — 'default' | 'inverse' — forwarded to the search field (ControlToneInverse,
 *                                              2026-08-27): a page on a wash sets its header row's tone in one place
 */
const ContentFilters = ({
  tone = 'default',
  items,
  title,
  totalCount,
  titleIcon,
  filterGroups = [],
  initialFilters,
  renderItem,
  viewModeOptions,
  viewMode: viewModeProp,
  onViewModeChange,
  /* NO literal default. A strip always has exactly one active item, so the
   * fallback must be the FIRST OPTION, not a guess — `'list'` matched nothing
   * in a RECENT/SAVED strip, so any consumer that passed options without also
   * passing a default rendered BOTH items in the rest state and the strip
   * looked broken rather than unset. Same for `defaultLayout`. */
  defaultViewMode,
  layoutOptions,
  defaultLayout,
  layout: layoutProp,
  onLayoutChange,
  /* WHERE the LIST/GRID strip sits — the two arrangements kol-monitor and
   * kol-website each settled on, made interchangeable (user ruling 2026-08-15).
   *
   *   'below'   header carries RECENT/SAVED; LIST/GRID sits below the divider
   *             beside the count. monitor's shape, and the default.
   *   'header'  LIST/GRID rides the header row instead.
   *
   * "N of N" is below the divider in BOTH — it is a count of what the filters
   * did, so it belongs with them, and it only renders while they are open. */
  layoutPlacement = 'below',
  viewPlacement = 'auto',
  onFilterChange,
  mutuallyExclusiveFilters = [],
  customFilterKeys = [],
  searchKeys = ['label', 'name', 'title', 'type'],
  headerActions,
  trailingActions,
  trailingPlacement = 'auto',
  leadingActions,
  belowActions,
  showCountOnlyWhenFiltering = false,
  iconComponent,
  className = '',
  /* THE LOOK SEAMS. Every one defaults to what the component shipped, so
   * passing nothing renders exactly as before — these exist because the
   * hardcoded values were the wrong call for every consumer but one. */
  /* HELPER + UPPERCASE. The title is part of the header STRIP — same chrome as
   * RECENT/SAVED beside it — and helper is the single-line ramp that strip
   * runs on. Casing and ramp are separate props precisely so a consumer whose
   * titles wrap can move to `kol-mono-14` without losing the casing. */
  titleClassName = 'kol-helper-14',
  titleUppercase = true,
  /* the category label is the EYEBROW role (ContentFiltersEqualColumns, what stood —
   * kol-fxr 2026-08-27: every section / category label in the app tier is
   * kol-eyebrow; the role carries the uppercase) */
  labelClassName = 'kol-eyebrow text-fg-96',
  labelUppercase = true,
  tagVariant = 'primary',
  tagSize = 'sm',
  tagActiveClassName = 'text-fg-96',
  tagRestClassName = 'text-fg-48',
  viewClassName = 'kol-helper-14',
  layoutClassName = 'kol-helper-12',
  /* REST WAS TOO DARK (user ruling 2026-08-15). `fg-32` is a third of the ink
   * and read as DISABLED rather than unselected — the same complaint the
   * IconFrame `nav` variant already settled ("the dimmed row read as disabled
   * beside the ThemeToggle"). Rest is now the ghost rung, oq-48, and the whole
   * pair moves to the opaque tier so it never washes out over a tinted surface. */
  stripActiveClassName = 'text-oq-96',
  stripRestClassName = 'text-oq-48 hover:text-oq-64',
  /* THE COUNT IS PART OF THE STRIP IT SITS ON — same rung as LIST/GRID
   * (`kol-helper-12`), same opaque tier. It carried `text-fg-64`, a
   * translucent value on neither the active nor the rest rung, so it read as a
   * third state that means nothing. It is static information: the REST ink. */
  countClassName = 'kol-helper-12 text-oq-48',
}) => {
  /* Icon seam — consumers on a local icon shelf pass their own component
   * rather than being forced onto the DS set. Needs `filter` + `search`. */
  const IconSeam = iconComponent || Icon
  /* SEEDED, not controlled (FilesDialog, kol-fxr 2026-09-04). A consumer that
   * opens onto one chip — the files dialog opens on `preset` — had no way to
   * say so: the set started empty and the first paint showed everything. An
   * INITIAL value, not a controlled prop, because the filters are this
   * component's own state everywhere else and a half-controlled set is two
   * sources of truth. Entries are `"<groupKey>:<value>"`, the same strings the
   * chips toggle. */
  const [activeFilters, setActiveFilters] = useState(() => new Set(initialFilters))
  const [isExpanded, setIsExpanded] = useState(false)
  const [internalViewMode, setInternalViewMode] = useState(defaultViewMode ?? viewModeOptions?.[0]?.value)
  const viewMode = viewModeProp !== undefined ? viewModeProp : internalViewMode
  /* Controlled when `layout` is passed, internal otherwise — the same pair viewMode uses. */
  const [internalLayout, setInternalLayout] = useState(defaultLayout ?? layoutOptions?.[0]?.value ?? 'grid')
  const layout = layoutProp !== undefined ? layoutProp : internalLayout
  const setLayout = (next) => {
    setInternalLayout(next)
    onLayoutChange?.(next)
  }
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchText, setSearchText] = useState('')


  const toggleFilter = (filterType, value) => {
    const newFilters = new Set(activeFilters)
    const filterKey = `${filterType}:${value}`
    if (newFilters.has(filterKey)) {
      newFilters.delete(filterKey)
    } else {
      if (mutuallyExclusiveFilters.includes(filterType)) {
        Array.from(newFilters).forEach((existing) => {
          if (existing.startsWith(`${filterType}:`)) newFilters.delete(existing)
        })
      }
      newFilters.add(filterKey)
    }
    setActiveFilters(newFilters)
    onFilterChange?.(newFilters, viewMode)
  }

  const clearAllFilters = () => {
    setActiveFilters(new Set())
    onFilterChange?.(new Set(), viewMode)
  }

  const handleViewModeChange = (mode) => {
    if (onViewModeChange) onViewModeChange(mode)
    else setInternalViewMode(mode)
    onFilterChange?.(activeFilters, mode)
  }

  const filteredItems = useMemo(() => {
    let result = items
    if (searchText) {
      const q = searchText.toLowerCase()
      result = result.filter((item) =>
        searchKeys.some((key) => {
          const val = item[key]
          return val && String(val).toLowerCase().includes(q)
        }),
      )
    }
    if (activeFilters.size === 0) return result
    return result.filter((item) => {
      let matches = true
      activeFilters.forEach((filter) => {
        const [filterType, value] = filter.split(':')
        if (customFilterKeys.includes(filterType)) return
        const itemValue = item[filterType]
        if (Array.isArray(itemValue)) {
          if (!itemValue.includes(value)) matches = false
        } else if (itemValue !== value) {
          matches = false
        }
      })
      return matches
    })
  }, [items, activeFilters, customFilterKeys, searchText, searchKeys])

  const showCount = !showCountOnlyWhenFiltering || isExpanded || searchOpen || activeFilters.size > 0

  /* THE FILTER VALUE IS A TAG — the atom's whole reason to exist ("a Tag with
   * no handler is a Pill wearing the wrong name"). Three defects lived here
   * until 2026-08-15, all of them working around the atom instead of using it:
   *
   *   variant="default"  — not a declared variant; `VARIANTS[v] ?? primary`
   *                        silently rendered the FILLED chip — which is what
   *                        the chip should be. `primary` is now declared, not
   *                        fallen through to. (An outlined `secondary` shipped
   *                        2026-08-15 and was ruled wrong the same day: the
   *                        grey filled chip is the look.)
   *   className border-* — hand-rolled active state beside the atom's own
   *                        `active` prop, which is what drives `.is-active`.
   *   <div onClick>      — the handler on a wrapper, so Tag rendered a <span>
   *                        and the interactive chip was not interactive.
   *
   * Casing is the atom's too: `.kol-tag` carries `text-transform: uppercase`
   * as the component tier's ONE documented exception to the no-casing law,
   * because a filter value is data with no authoring site. Consumers must not
   * uppercase these themselves. */
  /* A group either STACKS its values in a narrow column or WRAPS them across
   * the room it is given (`group.stack`). Both shapes are live on kol-website's
   * /work: a short closed set like Type reads as a column you scan down, while
   * ~45 tags must wrap or they run off the page. One shape for both meant the
   * short group ate a full row it did not need. */
  const layoutStrip = layoutOptions ? (
    <div className="flex items-center gap-4">
      {layoutOptions.map((opt) => (
        <span
          key={opt.value}
          onClick={opt.onClick ?? (() => setLayout(opt.value))}
          aria-pressed={opt.active !== undefined ? !!opt.active : undefined}
          title={opt.title}
          className={`${layoutClassName} cursor-pointer select-none ${(opt.active ?? layout === opt.value) ? stripActiveClassName : stripRestClassName}`}
          style={{ letterSpacing: 1 }}
        >
          {opt.label}
        </span>
      ))}
    </div>
  ) : null

  const renderFilterGroup = (group, index = 0) => {
    /* THE LAW (user ruling 2026-08-27, said "for the 10th time" — ContentFiltersFirstGroupHugs,
     * its WIDTH overruled the same day — ContentFiltersFirstGroupFixedWidth, kol-monitor: "nope
     * not hug, fix a size … if columns, maybe just use one?"): THE FIRST FILTER GROUP IS ONE
     * CATALOG COLUMN WIDE — `.kol-filters-first` (kol-theme): one track of the catalog grid AT THE
     * COUNT IT RENDERS (theme ≥0.137.0 — was `(100cqw − 120px) / 6`, true only at six tracks), the `1fr`
     * of the catalog's `repeat(6, 1fr)` gap 24, measured on the header row as a container so
     * the count/strip beside the groups never narrows it. It sits over the first card; EVERY
     * GROUP AFTER IT FLOWS across the rest of the row, starting over the second. By POSITION,
     * never by chip count. A page without a 6-column catalog gets the same fraction of its row.
     * Not a hug (0.104.3 — the column was 78px on one surface and 92 on the next), not equal
     * columns (0.104.1), not "short groups stack" (0.101). `stack` stays the explicit override
     * (`stack: false` on the first makes it flow); `group.className` still wins on width — the
     * rule sits in the components layer. */
    const stacked = group.stack ?? index === 0
    const first = index === 0 && stacked
    return (
    <div key={group.key} className={`flex flex-col gap-3 ${first ? 'kol-filters-first' : stacked ? 'shrink-0' : 'min-w-0 flex-1'} ${group.className ?? ''}`.trim()}>
      {/* THE CATEGORY LABEL IS THE ACTIVE INK — `kol-helper-12` at `text-fg-96`,
        * the same full opacity a SELECTED layout item wears (user ruling
        * 2026-08-15: "TAGS and other categories are ACTIVE state full opacity").
        *
        * Read the RENDER, not the default: the retired fork defaulted this to
        * `text-fg-32` and kol-monitor overrode it per call site with
        * `labelClassName="kol-helper-12 text-fg-96"` — so the fork's default was
        * never what anyone looked at. No inline letter-spacing: the helper ramp
        * carries its own, and the override the fork added was not in the
        * rendered path either. */}
      <h4 className={labelClassName} style={labelUppercase && !/\bkol-eyebrow\b/.test(labelClassName) ? { textTransform: 'uppercase' } : undefined}>
        {group.label}
      </h4>
      {/* the fluid group keeps 48px of room on its right (it ran flush to the
        * panel's edge); `group.wrapClassName` is the per-group seam */}
      <div className={`${stacked ? 'flex flex-col items-start gap-2' : 'flex flex-wrap gap-2 pr-12'} ${group.wrapClassName ?? ''}`.trim()}>
        {group.values.map((value) => (
          <Tag
            key={value}
            size={tagSize}
            variant={tagVariant}
            hash={false}
            active={activeFilters.has(`${group.key}:${value}`)}
            onClick={() => toggleFilter(group.key, value)}
            className={activeFilters.has(`${group.key}:${value}`) ? tagActiveClassName : tagRestClassName}
          >
            {value}
          </Tag>
        ))}
      </div>
    </div>
  )
  }

  /* RECENT / SAVED — one node, two homes (header from md, its own line below) */
  const viewStrip = (wrapCls) => (
    <div className={`${wrapCls} items-center gap-4`}>
      {viewModeOptions.map((opt) => (
        <span
          key={opt.value}
          onClick={() => handleViewModeChange(opt.value)}
          className={`${viewClassName} cursor-pointer select-none ${viewMode === opt.value ? stripActiveClassName : stripRestClassName}`}
          style={{ textTransform: 'uppercase', letterSpacing: 1 }}
        >
          {opt.label}
        </span>
      ))}
    </div>
  )

  return (
    /* minHeight 0 on both this root and the body below: without it a flex
     * child refuses to shrink past its content, so a scrollable body pushed
     * the whole card taller instead of scrolling inside it. */
    <div className={`w-full ${className}`.trim()} style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
      {/* ONE VERTICAL RHYTHM for the whole block, chosen together instead of
        * four independent literals (header mb-4, divider mb-4, strip row pb-4,
        * body mt-8 — none of which knew about the others):
        *
        *   header  → divider   12  the divider belongs TO the header, close
        *   divider → strip     12  same, it belongs to what follows
        *   strip   → content   24  the one real break, wall starts here
        *
        * 12/12/24 on the --kol-spacing-* rungs. The old 16/16/32 spaced the
        * divider equally from both sides, so it read as a free-floating line
        * rather than the header's own baseline. */}
      <div className="flex items-center justify-between" style={{ marginBottom: 'var(--kol-spacing-3)' }}>
        <div className="flex items-center gap-3 md:gap-6">
          {/* IconFrame, NOT a kol-btn span: this is decoration and clicks
            * nothing, so it must not wear a button's chrome. The atom exists
            * for exactly this (lobby ruling 2026-07-30 — "icons only, NO
            * states"); the span here was the same defect that promoted it. */}
          {/* the icon gap matches the specimen header — 16 from md (FoundrySpecimenSections, 2026-08-27) */}
          <h2 className={`flex items-center gap-2 md:gap-4 ${searchOpen ? 'max-md:hidden' : ''}`}>
            {titleIcon && <IconFrame name={titleIcon} variant="secondary" size="md" />}
            {/* `pr-4` by rule (ContentFiltersTitleGap, kol-website 2026-08-27): the
              * divider sat 24px from the title's text edge but 32 from the
              * icon glyphs (the frames carry 8px of air a side) and read pushed
              * toward the title; 16px on the title side balances it. The seam
              * `titleClassName` stays what it was.
              * MOBILE RUNG (ContentFiltersMobileGaps, 2026-09-01): the seam and
              * the pad both halve below md — gap-3 + pr-2 keeps the same
              * frame-air balance (12+8 glyph side · 12+8 title side) without
              * spending 40px of a 390px viewport on one divider. */}
            <span className={`${titleClassName} pr-2 md:pr-4`} style={titleUppercase ? { textTransform: 'uppercase', letterSpacing: 1 } : undefined}>{title}</span>
          </h2>
          <Divider variant="vertical" className={searchOpen ? 'max-md:hidden' : ''} />
          {/* THE OPEN SEARCH TAKES THE ROW BELOW `md` (2026-09-02, the showcase
            * held to its own law): the pill is a fixed 200px, and beside the
            * title at 390 it scrolled `main` sideways. Title and divider step
            * aside while searching and return on close; the group grows to the
            * row so the pill fits. */}
          <div className="flex items-center gap-1 min-w-0 max-md:flex-1">
            {/* IconFrame, not a kol-btn with its chrome cancelled inline.
              * 05-control-chrome.md:109 — "any icon-only control in chrome is
              * IconFrame; nothing hand-writes the square". This wore
              * `kol-btn-md kol-btn-icon` and then removed the background, the
              * border and the colour by inline style, which is the whole button
              * paid for and thrown away — and it left the control with no
              * states at all while the search beside it had hover.
              *
              * `nav` rests at oq-64 and lights to full ink when the panel is
              * open, so the toggle finally SHOWS that it is on. */}
            {/* 16 GLYPH IN A 32 BOX — the house's quiet-control pairing (user
              * ruling 2026-08-15). `.kol-copy-btn` is exactly this: an 8px pad
              * around a `sm` 16px glyph, giving a 32 box. A 20 glyph fills a 32
              * square far harder, which is why this row read too intense. The
              * square stays md; only the glyph steps down. */}
            <IconFrame
              name="filter"
              /* `nav` ALWAYS — no container. The open state is the panel
               * appearing below; painting a filled square behind the glyph as
               * well says the same thing twice and puts a box in a row that
               * has none. */
              variant="nav"
              size="md"
              iconSize={16}
              onClick={() => setIsExpanded(!isExpanded)}
              aria-label="Toggle filters"
            />
            {/* THE SEARCH IS `SearchInput expanding` — the DS component, fully
              * round, the same pill the nav shelf uses (user ruling
              * 2026-08-15). This organism hand-rolled its own: a rounded-sm box
              * with its own width animation, its own input, its own Escape and
              * blur handling — a second search field the DS could not see, in
              * a different shape from the one every other surface serves.
              *
              * Open state stays HERE because the filter row reads it (the count
              * shows while searching); SearchInput takes it controlled. */}
            <SearchInput
              expanding
              tone={tone}
              open={searchOpen}
              onOpenChange={(next) => { setSearchOpen(next); if (!next) setSearchText('') }}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              expandedWidth={200}
              className="max-w-full"
              triggerLabel="Search"
              /* NO placeholder. The field opens from a glyph you just clicked —
               * the caret is the affordance, and a greyed "Search…" sitting in
               * a 200px pill is the widest thing in the header saying the least.
               * The organism's own field never had one. */
              placeholder=""
              size="md"
              /* 16 in the 32 box, matching the filter beside it and the copy
               * button everywhere else. */
              iconSize={16}
              /* a rung under the 32 square: this field sits beside two BARE
               * glyphs, and at the full square it read as a chunky input. */
              fieldHeight={28}
            />
            {headerActions}
          </div>
          {activeFilters.size > 0 && (
            <span
              className="kol-helper-12 text-fg-48 cursor-pointer select-none group flex items-center gap-2"
              onClick={(e) => { e.stopPropagation(); clearAllFilters() }}
            >
              <span className="underline">({activeFilters.size}) {activeFilters.size === 1 ? 'filter' : 'filters'} active</span>
              <span className="hidden group-hover:inline text-fg-64">×</span>
            </span>
          )}
        </div>

        <div className="flex items-center gap-6">
          {/* the consumer's trailing controls ride the header from `md` under
            * `auto`; below it they move to the below-divider row (same rung as
            * the view strip and LIST/GRID) so the header row never scrolls */}
          {trailingActions && trailingPlacement !== 'below' && (
            <div className={`${trailingPlacement === 'auto' ? 'hidden md:flex' : 'flex'} items-center gap-6`}>
              {trailingActions}
              {/* The divider between a consumer's trailing controls and the strip is
                * the organism's, as it is on the left between title and icons. */}
              {layoutPlacement === 'header' && layoutStrip && <Divider variant="vertical" />}
            </div>
          )}
          {layoutPlacement === 'header' && layoutStrip}
          {/* RECENT / SAVED is the SAME STRIP as LIST / GRID, not a ViewToggle.
            * Read off kol-monitor's original (_tmp/2026-08-15-shell-adoption/
            * ContentFilters.jsx:225-232): inline spans, `kol-helper-14`,
            * uppercase + 1px tracking, `text-fg-96` active / `text-fg-32` rest.
            * That file imports ViewToggle and never renders it for this.
            *
            * This REPLACES the filled-chip reading of the 2026-07-28 ruling on
            * this surface — user ruling 2026-08-15: the fork's look, everywhere.
            * One family across the whole row. */}
          {/* THE STRIP HAS A NARROW RUNG (ContentFiltersViewStripOverflow,
            * kol-mirror 2026-09-02): in the header it is `hidden md:flex` under
            * `auto`, and the same options render on their own line under the
            * divider below `md` — full width, wrapping. */}
          {viewModeOptions && viewPlacement !== 'below' && viewStrip(viewPlacement === 'auto' ? 'hidden md:flex' : 'flex')}
        </div>
      </div>

      {/* Divider takes className, NOT style — a style prop here is silently
        * dropped, which is how this margin nearly went missing. */}
      <Divider className="mb-3" />

      {/* the view family's own line below md (`auto`) or always (`below`) —
        * full width, wrapping, so no view is ever off the page */}
      {viewModeOptions && viewPlacement !== 'header' && (
        <div className={`${viewPlacement === 'auto' ? 'md:hidden ' : ''}mb-3`}>
          {viewStrip('flex flex-wrap gap-y-2')}
        </div>
      )}
      {/* the consumer's trailing controls: their OWN line below md (`auto`) or
        * always (`below`) — full width, wrapping. In the below row's right
        * group they measured 223px beside LIST/GRID in a 342px track. */}
      {trailingActions && trailingPlacement !== 'header' && (
        <div className={`${trailingPlacement === 'auto' ? 'md:hidden ' : ''}mb-3 flex flex-wrap items-center gap-6 gap-y-2`}>
          {trailingActions}
        </div>
      )}

      {/* BELOW the divider: the filter GROUPS only. Left-aligned columns —
        * label above values — visible only while the filter toggle is open.
        *
        * The count + layout strip moved ABOVE the divider into the header row
        * (user ruling 2026-08-15, later pass), reversing the earlier "one row
        * below the divider" cut. It also settles the defect that ruling was
        * fighting for good: the strip cannot be pushed down the page by an
        * expanding filter group if it is not in the same row as one. */}
      {/* The row renders whenever it has ANYTHING to show. LIST/GRID is always
        * visible — it is how you change the view, not a detail of filtering —
        * while the groups and the count appear only with the panel open. Gating
        * the whole row on `isExpanded` hid the strip until you opened filters,
        * which is not a state anyone would guess at. */}
      {(isExpanded || (layoutPlacement === 'below' && layoutStrip) || leadingActions || belowActions) && (
        <div className="kol-filters-row flex items-start justify-between gap-8 md:gap-16">
          <div className="flex min-w-0 flex-1 items-start gap-8 md:gap-16">
            {leadingActions}
            {isExpanded && filterGroups.map((group, i) => renderFilterGroup(group, i))}
            {isExpanded && activeFilters.size > 0 && (
              <button
                type="button"
                onClick={clearAllFilters}
                className="kol-helper-12 transition-colors underline text-fg-32 hover:text-fg-48"
                style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}
              >
                Clear all ({activeFilters.size})
              </button>
            )}
          </div>

          {/* BELOW the divider: the count, and LIST/GRID when the arrangement
            * puts it here. The count is a report of what the filters did, so it
            * lives with them and appears only while they are open — unfiltered
            * it always reads "N of N", a number that has never told anyone
            * anything. Ink stays `text-fg-64`: static information, not a
            * toggle, so it takes neither the 96 active nor the 32 rest. */}
          {/* ONE LINE — the count sits BESIDE LIST/GRID, not stacked above it.
            * They are the same strip of chrome reading left to right. */}
          {/* ONE LINE, and the count needs room off the strip — at gap-4 the
            * two read as one run of text rather than a label and a control. */}
          <div className="flex flex-shrink-0 items-center gap-6">
            {showCount && isExpanded && (
              <span className={countClassName} style={{ letterSpacing: 1 }}>
                {filteredItems.length} of {totalCount}
              </span>
            )}
            {layoutPlacement === 'below' && layoutStrip}
            {belowActions}
          </div>
        </div>
      )}

      <div style={{ marginTop: 'var(--kol-spacing-6)', display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
        {/* the items panel is a CONTAINER (WorkListingRowsAndFilters, 2026-08-27) — rows step on its width.
          * It is ALSO the next link in the fill chain (ContentFiltersFillChain, kol-monitor 2026-08-28):
          * `container-type: inline-size` contains only the inline axis, but the wrapper sat `flex: 0 1 auto`
          * in the flex body above, so a `PageShell mode="fixed"` fill died here — a consumer's `renderItem`
          * root with `flex: 1; min-height: 0` had nothing to fill and monitor's rack clipped its bottom row. */}
        <div style={{ containerType: 'inline-size', display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>{renderItem(filteredItems, viewMode, layout)}</div>
      </div>
    </div>
  )
}

export default ContentFilters
