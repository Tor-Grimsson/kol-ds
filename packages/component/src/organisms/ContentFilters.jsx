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
 * @param {string} props.defaultViewMode — default view mode (falls back to the FIRST option)
 * @param {Function} props.onFilterChange — optional callback when filters change
 * @param {Array} props.mutuallyExclusiveFilters — filter keys that should be mutually exclusive
 * @param {Array} props.customFilterKeys — filter keys handled by renderItem, not by ContentFilters
 * @param {ElementType} props.iconComponent — icon seam (defaults to DS Icon; needs `filter` + `search`)
 *
 * Look seams — all default to the shipped values, pass nothing and nothing changes:
 * @param {string}  props.titleClassName      — header title type/ink
 * @param {boolean} props.titleUppercase      — cases the title (default false)
 * @param {string}  props.labelClassName      — filter-group label type/ink
 * @param {boolean} props.labelUppercase      — cases the group label (default true)
 * @param {string}  props.tagVariant          — filter chip variant ('primary' grey fill)
 * @param {string}  props.tagSize             — filter chip size
 * @param {string}  props.tagActiveClassName  — chip ink, selected
 * @param {string}  props.tagRestClassName    — chip ink, unselected
 * @param {string}  props.viewClassName       — RECENT/SAVED strip type
 * @param {string}  props.layoutClassName     — LIST/GRID strip type
 * @param {string}  props.stripActiveClassName — strip ink, selected (both strips)
 * @param {string}  props.stripRestClassName  — strip ink, unselected (both strips)
 * @param {string}  props.countClassName      — the "N of N" type/ink
 */
const ContentFilters = ({
  items,
  title,
  totalCount,
  titleIcon,
  filterGroups = [],
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
  onFilterChange,
  mutuallyExclusiveFilters = [],
  customFilterKeys = [],
  searchKeys = ['label', 'name', 'title', 'type'],
  headerActions,
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
  labelClassName = 'kol-helper-12 text-fg-96',
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
  const [activeFilters, setActiveFilters] = useState(new Set())
  const [isExpanded, setIsExpanded] = useState(false)
  const [internalViewMode, setInternalViewMode] = useState(defaultViewMode ?? viewModeOptions?.[0]?.value)
  const viewMode = viewModeProp !== undefined ? viewModeProp : internalViewMode
  const [layout, setLayout] = useState(defaultLayout ?? layoutOptions?.[0]?.value ?? 'grid')
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
          onClick={() => setLayout(opt.value)}
          className={`${layoutClassName} cursor-pointer select-none ${layout === opt.value ? stripActiveClassName : stripRestClassName}`}
          style={{ letterSpacing: 1 }}
        >
          {opt.label}
        </span>
      ))}
    </div>
  ) : null

  const renderFilterGroup = (group) => (
    <div key={group.key} className={`flex flex-col gap-3 ${group.stack ? 'shrink-0' : 'min-w-0 flex-1'}`}>
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
      <h4 className={labelClassName} style={labelUppercase ? { textTransform: 'uppercase' } : undefined}>
        {group.label}
      </h4>
      <div className={group.stack ? 'flex flex-col items-start gap-2' : 'flex flex-wrap gap-2'}>
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
        <div className="flex items-center gap-6">
          {/* IconFrame, NOT a kol-btn span: this is decoration and clicks
            * nothing, so it must not wear a button's chrome. The atom exists
            * for exactly this (lobby ruling 2026-07-30 — "icons only, NO
            * states"); the span here was the same defect that promoted it. */}
          <h2 className="flex items-center gap-2">
            {titleIcon && <IconFrame name={titleIcon} variant="secondary" size="md" />}
            <span className={titleClassName} style={titleUppercase ? { textTransform: 'uppercase', letterSpacing: 1 } : undefined}>{title}</span>
          </h2>
          <Divider variant="vertical" />
          <div className="flex items-center gap-1">
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
              open={searchOpen}
              onOpenChange={(next) => { setSearchOpen(next); if (!next) setSearchText('') }}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              expandedWidth={200}
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

        <div className="flex items-center gap-8">
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
          {viewModeOptions && (
            <div className="flex items-center gap-4">
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
          )}
        </div>
      </div>

      {/* Divider takes className, NOT style — a style prop here is silently
        * dropped, which is how this margin nearly went missing. */}
      <Divider className="mb-3" />

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
      {(isExpanded || (layoutPlacement === 'below' && layoutStrip)) && (
        <div className="flex items-start justify-between gap-16">
          <div className="flex min-w-0 flex-1 items-start gap-16">
            {isExpanded && filterGroups.map((group) => renderFilterGroup(group))}
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
          </div>
        </div>
      )}

      <div style={{ marginTop: 'var(--kol-spacing-6)', display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
        {renderItem(filteredItems, viewMode, layout)}
      </div>
    </div>
  )
}

export default ContentFilters
