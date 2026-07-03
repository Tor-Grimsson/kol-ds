import { useEffect, useId, useRef, useState } from 'react'
import SearchInput from '../atoms/SearchInput.jsx'

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
  query = '',
  onQueryChange,
  onSelect,
  placeholder = 'Search…',
}) {
  const panelRef = useRef(null)
  const listRef = useRef(null)
  const listId = useId()
  const [activeIndex, setActiveIndex] = useState(0)
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
  useEffect(() => { setActiveIndex(0) }, [query, open])

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
      setActiveIndex((i) => Math.min(i + 1, results.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIndex((i) => Math.max(i - 1, 0))
    } else if (e.key === 'Enter' && active >= 0) {
      e.preventDefault()
      select(results[active])
    } else if (e.key === 'Tab') {
      /* Focus trap — the input is the palette's only tab stop. */
      e.preventDefault()
    }
  }

  return (
    <div className="fixed inset-0 z-[300] flex items-start justify-center pt-[20vh]">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-[1px]"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Search"
        className="relative w-full max-w-lg mx-4 overflow-hidden bg-surface-primary border border-fg-08 rounded-[var(--kol-radius-2xl)] shadow-[0_20px_60px_rgba(0,0,0,0.4)]"
      >
        <SearchInput
          bare
          value={query}
          onChange={(e) => onQueryChange?.(e.target.value)}
          placeholder={placeholder}
          onKeyDown={handleKeyDown}
          role="combobox"
          aria-expanded={results.length > 0}
          aria-controls={listId}
          aria-activedescendant={active >= 0 ? optionId(results[active]) : undefined}
        />

        {results.length > 0 && (
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
                onMouseEnter={() => setActiveIndex(i)}
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
