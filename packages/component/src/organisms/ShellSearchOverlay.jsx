import { useEffect, useId, useRef, useState } from 'react'
import SearchInput from '../molecules/SearchInput.jsx'
import Tag from '../atoms/Tag.jsx'

/**
 * HighlightMatch — default row renderer: underlines the first
 * case-insensitive `query` slice inside `label` at full ink. Exported for
 * consumers building their own rows; not in the package barrel.
 *
 * @param {string} label full row label
 * @param {string} query current query (empty / no match → plain label)
 */
export function HighlightMatch({ label, query }) {
  const idx = query ? label.toLowerCase().indexOf(query.toLowerCase()) : -1
  if (idx === -1) return <span>{label}</span>
  return (
    <>
      <span>{label.slice(0, idx)}</span>
      <span className="text-fg underline decoration-2 underline-offset-[3px]">
        {label.slice(idx, idx + query.length)}
      </span>
      <span>{label.slice(idx + query.length)}</span>
    </>
  )
}

/**
 * ShellSearchOverlay — the ⌘K command palette: fullscreen dim + centered
 * panel, a bare SearchInput on top, result rows beneath (HighlightMatch
 * label, dim hint line, right-aligned group label). Distinct from Modal
 * (prompt/confirm only) — this is the search/command primitive.
 *
 * Content-agnostic: the consumer filters and passes `results`; selection
 * emits `onSelect(item)` (no navigation here — ported off react-router).
 * The ⌘K binding itself lives in the shell's key handler, not here.
 *
 * Keyboard: ArrowUp/ArrowDown rove the active row (mouse hover roves too),
 * Enter selects it (index starts at 0 → Enter-selects-first preserved),
 * Escape closes. Focus trap: focus moves into the input on open, returns to
 * the opener on close, and Tab is pinned — rows are combobox options driven
 * via aria-activedescendant, never tab stops.
 *
 * @param {boolean}  open          mount/unmount the overlay
 * @param {Function} onClose       () => void — backdrop click, Escape, post-select
 * @param {Array}    results       pre-filtered rows: { id, label, group?, hint? }
 * @param {string}   query         controlled query (drives the highlight slice)
 * @param {Function} onQueryChange (string) => void — input change
 * @param {Function} onSelect      (item) => void — row click / Enter; consumer navigates
 * @param {string}   placeholder   input placeholder
 */
export default function ShellSearchOverlay({
  open,
  onClose,
  results = [],
  /* EXPANDED — the palette's second state (user ruling 2026-08-01). Enter
   * commits the query and opens `children` as the results body; the palette
   * and the old tag overlay are one surface with two states, not two
   * components. `chips` are the committed tag facets of the same query. */
  expanded = false,
  onExpand,
  chips = [],
  onRemoveChip,
  children,
  query = '',
  onQueryChange,
  onSelect,
  placeholder = 'Search…',
}) {
  const panelRef = useRef(null)
  const listRef = useRef(null)
  const listId = useId()
  const [activeIndex, setActiveIndex] = useState(0)
  /* Has the user actually chosen a row? See the Enter branch — without this,
   * index 0 counts as a selection and Enter navigates somewhere unasked. */
  const [navigated, setNavigated] = useState(false)
  const active = results.length > 0 ? Math.min(activeIndex, results.length - 1) : -1

  /* Focus in on open, restore the opener on close. querySelector instead of
   * a ref through SearchInput — ref-as-prop needs React 19 and the package
   * peer range still allows 18. */
  useEffect(() => {
    if (!open) return undefined
    const prev = document.activeElement
    panelRef.current?.querySelector('input')?.focus()
    return () => { if (prev instanceof HTMLElement) prev.focus() }
  }, [open])

  /* Roving row resets to the top on every query change / reopen. */
  useEffect(() => { setActiveIndex(0); setNavigated(false) }, [query, open])

  /* Keep the active row visible inside the scrolling list. */
  useEffect(() => {
    if (active < 0) return
    listRef.current?.children[active]?.scrollIntoView({ block: 'nearest' })
  }, [active])

  if (!open) return null

  const select = (item) => {
    onSelect?.(item)
    onClose?.()
  }

  const optionId = (item) => `${listId}-${item.id}`

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      e.preventDefault()
      onClose?.()
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      setNavigated(true)
      setActiveIndex((i) => Math.min(i + 1, results.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setNavigated(true)
      setActiveIndex((i) => Math.max(i - 1, 0))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      /* Enter COMMITS the query and expands. It only selects when the user has
       * actually arrowed to a row — `activeIndex` starts at 0, so "a row is
       * highlighted" is true from the first keystroke and testing `active >= 0`
       * made Enter navigate to whatever happened to be first. Committing a
       * query must never be a navigation you didn't choose. */
      if (navigated) select(results[active])
      else onExpand?.()
    } else if (e.key === 'Tab') {
      /* Focus trap — the input is the palette's only tab stop. */
      e.preventDefault()
    }
  }

  return (
    <div className="fixed inset-0 z-[300] flex items-start justify-center pt-[20vh]">
      <div
        className="absolute inset-0 kol-overlay-scrim"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Search"
        className={`kol-overlay-panel mx-4 ${expanded ? 'max-w-[var(--kol-content-panel)]' : 'max-w-lg'}`}
      >
        {/* THE MODE, said out loud (user 2026-08-01: "how do you set search
          * mode? theres no helper, message or mode clearly readble"). Two
          * modes exist — FILTER (tags narrow a set) and FIND (a keyword jumps
          * to a destination) — and the only signal was whether chips happened
          * to be present. The chips ARE the mode, so they get a label. */}
        {chips.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5 px-4 pt-3">
            <span className="kol-helper-10 text-fg-48 shrink-0">FILTERING BY</span>
            {chips.map((t) => (
              <Tag key={t} onRemove={() => onRemoveChip?.(t)}>{t}</Tag>
            ))}
          </div>
        )}
        <SearchInput
          bare
          value={query}
          onChange={(e) => onQueryChange?.(e.target.value)}
          placeholder={chips.length > 0 ? 'Narrow these results…' : placeholder}
          onKeyDown={handleKeyDown}
          role="combobox"
          aria-expanded={results.length > 0}
          aria-controls={listId}
          aria-activedescendant={active >= 0 ? optionId(results[active]) : undefined}
        />

        {/* WHY THIS IS NOT `molecules/Dropdown` (asked 2026-08-01). Dropdown is
          * a SELECT: a trigger, a `value`, `onChange(value)`, and rows that are
          * options. This is a COMBOBOX — a text query filtering a live list
          * whose rows carry a `group`, a `hint`, and may fire an `action`
          * instead of selecting a value. Same ARIA family, different control.
          * Folding one into the other would mean giving Dropdown a query, a
          * hint slot and an action escape hatch, i.e. building this inside it.
          *
          * THE ROW CONTRACT (was documented nowhere):
          *   label     the row's text, match-highlighted against the query
          *   group     right-aligned origin — 'Atoms', 'Documentation', 'Tags'
          *   hint      subtext shown when the LABEL was not what matched
          *   href      a destination; dismisses the palette
          *   action    a closure; runs and KEEPS the palette open (tag rows)
          * Built by `buildShellSearchItems` (showcase/src/nav/shell-nav.js). */}
        {expanded ? (
          <div className="border-t border-fg-08 max-h-[70vh] overflow-y-auto">{children}</div>
        ) : results.length > 0 && (
          <ul
            ref={listRef}
            id={listId}
            role="listbox"
            className="border-t border-fg-08 max-h-80 overflow-y-auto py-1"
          >
            {results.map((item, i) => (
              <li
                key={item.id}
                id={optionId(item)}
                role="option"
                aria-selected={i === active}
                /* preventDefault keeps focus in the input through the click */
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => select(item)}
                onMouseEnter={() => { setActiveIndex(i); setNavigated(true) }}
                className={`flex items-center gap-2 px-4 py-1.5 cursor-pointer kol-mono-14 transition-colors ${
                  i === active ? 'bg-fg-08 text-fg' : 'text-fg-64'
                }`}
              >
                <span className="flex flex-col min-w-0">
                  <span className="truncate">
                    <HighlightMatch label={item.label} query={query} />
                  </span>
                  {item.hint && (
                    <span className="kol-mono-12 text-fg-48 truncate">{item.hint}</span>
                  )}
                </span>
                {item.group && (
                  <span className="ml-auto shrink-0 kol-helper-10 text-fg-48">{item.group}</span>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
