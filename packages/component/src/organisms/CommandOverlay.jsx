import { useEffect, useId, useRef, useState } from 'react'
import { Icon } from '@kolkrabbi/kol-icons'
import SearchInput from '../molecules/SearchInput.jsx'
import Tag from '../atoms/Tag.jsx'
import Kbd from '../atoms/Kbd.jsx'
import OptionRow from '../molecules/OptionRow.jsx'
import Button from '../atoms/Button.jsx'
import { Tooltip } from '../utilities/Popover.jsx'
import { shortcutInScope } from './ShortcutsOverlay.jsx'

/* ONE COLUMN (2026-09-30): rows, headings and footer sit on the field's own
 * geometry — the p-2 inset, then the md control's 1px ring + 16px pad — so
 * every glyph and word lines up under the field's icon and caret. */

/* Rows bucketed by `group` in first-seen order, rank kept inside a group —
 * one heading per group; arrows rove this order, not the engine's. */
function groupRows(rows) {
  const order = []
  const byGroup = new Map()
  rows.forEach((r) => {
    const g = r.group ?? ''
    if (!byGroup.has(g)) { byGroup.set(g, []); order.push(g) }
    byGroup.get(g).push(r)
  })
  return order.flatMap((g) => byGroup.get(g))
}

/**
 * HighlightMatch — default row renderer: underlines the first
 * case-insensitive `query` slice inside `label` at full ink. Exported for
 * consumers building their own rows; not in the package barrel.
 *
 * @param {string} label full row label
 * @param {string} query current query (empty / no match → plain label)
 */
export function HighlightMatch({ label, query, ranges }) {
  /* An engine that already knows where it matched (kol-search's `highlights`)
   * passes `ranges` — every hit, not just the first slice of the raw query. */
  if (Array.isArray(ranges)) {
    if (!ranges.length) return <span>{label}</span>
    const out = []
    let at = 0
    ranges.forEach(([s, e], i) => {
      if (s > at) out.push(<span key={`t${i}`}>{label.slice(at, s)}</span>)
      out.push(<span key={`m${i}`} className="text-fg underline decoration-2 underline-offset-[3px]">{label.slice(s, e)}</span>)
      at = e
    })
    if (at < label.length) out.push(<span key="rest">{label.slice(at)}</span>)
    return <>{out}</>
  }
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

/* THE MODES (CommandOverlayModes, kol-monitor 2026-10-17 — user: *"can we make the modal more general then just
 * search? … add module would be another, shortcuts could be a third"*). One field, one grouped list, one footer;
 * the mode only sets the footer's words and, for `shortcuts`, where the rows come from. */
const MODE_LABEL = { search: 'Go to page', go: 'Go to page', add: 'Add', shortcuts: 'Run' }
const MODE_PLACEHOLDER = { search: 'Search…', go: 'Go to…', add: 'Add…', shortcuts: 'Search shortcuts…' }

/* the keymap as rows: every section visible at once, this page's first, the rest muted and never run */
function shortcutRows(shortcuts, path, query) {
  const q = query.trim().toLowerCase()
  const rows = (sec, here) => (sec.items ?? []).map((it) => ({
    id: `${sec.section}:${it.id ?? it.label}`, label: it.label, hint: it.combo ?? it.keys,
    group: here ? sec.section : `Elsewhere · ${sec.section}`, disabled: !here, run: it.run,
  }))
  const all = [...shortcuts.filter((s) => shortcutInScope(s, path)).flatMap((s) => rows(s, true)),
    ...shortcuts.filter((s) => !shortcutInScope(s, path)).flatMap((s) => rows(s, false))]
  return q ? all.filter((r) => r.label.toLowerCase().includes(q) || String(r.hint ?? '').toLowerCase().includes(q)) : all
}

/**
 * CommandOverlay — The ⌘K overlay: search, add, go, shortcuts. Was `ShellSearchOverlay` (still exported, an
 * alias). `mode` names what the overlay is for — `search` (default) · `go` · `add` · `shortcuts`. In
 * `shortcuts` it draws `shortcuts` (the AppHub keymap) as rows: every section at once, the current page's
 * first, the rest muted under "Elsewhere"; typing filters; Enter runs a row's `run`.
 *
 * ARROWS (2026-10-17 — user: *"arrows up down can focus category and arrows left right can enter and back,
 * along with enter key"*): ↑↓ move through rows; → or Enter opens a category (a `keepOpen` row); ← goes back
 * (`onBack`). ← and → only step in and out while the field is empty — typing, they move the caret.
 *
 * Former ShellSearchOverlay — The ⌘K search modal. the ⌘K search modal: fullscreen dim + centered
 * panel, a bare SearchInput on top, result rows beneath (HighlightMatch
 * label, dim hint line, right-aligned group label). Distinct from Modal
 * (prompt/confirm only) — this is the search/command primitive.
 *
 * Content-agnostic: the consumer filters and passes `results`; selection
 * emits `onSelect(item)` (no navigation here — ported off react-router).
 * The ⌘K binding itself lives in the shell's key handler, not here.
 *
 * Keyboard: ArrowUp/ArrowDown rove the active row (mouse hover roves too),
 * Enter opens it (the top row from the first keystroke), ⌘/Ctrl+Enter opens every hit,
 * Escape closes. Focus trap: focus moves into the input on open, returns to
 * the opener on close, and Tab is pinned — rows are combobox options driven
 * via aria-activedescendant, never tab stops.
 *
 * @param {boolean}  open          mount/unmount the overlay
 * @param {Function} onClose       () => void — backdrop click, Escape, post-select
 * @param {Array}    results       pre-filtered rows: { id, label, group?, hint?, icon?, disabled?, disabledHint? }
 * @param {Array}    [suggestions] rows shown while the query is empty (same shape) —
 *                                 the search modal opens on somewhere to go, not a blank box
 * @param {string}   query         controlled query (drives the highlight slice)
 * @param {Function} onQueryChange (string) => void — input change
 * @param {Function} onSelect      (item) => void — row click / Enter; consumer navigates. A row
 *                                 with `keepOpen` or `action` selects and the modal stays open
 * @param {string}   placeholder   input placeholder
 * @param {string}   [enterLabel]  what Enter does when no row is picked — shown as
 *                                 the panel's last line, so Enter is never a surprise
 *                                 (e.g. `All results for “q”`). Rows may carry
 *                                 `highlights` ([start, end] ranges) from the engine.
 * @param {Function} [onOpenResults] (query) => void — ⌘/Ctrl+Enter: every hit, on the consumer's
 *                                 own results surface. Plain Enter keeps its meaning.
 * @param {string}   [resultsLabel] the footer's second line for ⌘Enter (e.g. `All results`)
 * @param {Function} [onBack]      a drill-in's way back (CommandOverlayModes, kol-monitor 2026-10-17): set, the
 *                                 field row leads with a back arrow, and Backspace on an empty field calls it —
 *                                 instead of a "← All" row that scrolls away with the list
 * @param {string}   [backLabel]   the arrow's tooltip (default `Back`) — name where it goes ("All modules")
 * @param {string}   [selectLabel] the footer's Enter line while a row is highlighted (default
 *                                 `Go to page`) — a modal whose rows are not pages says what
 *                                 Enter does instead (the rack's module search: `Add module`)
 */
export default function CommandOverlay({
  open,
  onClose,
  results: rawResults = [],
  suggestions = [],
  /* EXPANDED — the search modal's second state (user ruling 2026-08-01). Enter
   * commits the query and opens `children` as the results body; the search modal
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
  placeholder: placeholderProp,
  enterLabel,
  onOpenResults,
  resultsLabel = 'All results',
  selectLabel: selectLabelProp,
  onBack,
  backLabel = 'Back',
  mode = 'search',
  shortcuts = [],
  currentPath,
}) {
  const panelRef = useRef(null)
  const listRef = useRef(null)
  const listId = useId()
  const [activeIndex, setActiveIndex] = useState(0)
  /* Has the user actually chosen a row? See the Enter branch — without this,
   * index 0 counts as a selection and Enter navigates somewhere unasked. */
  const [navigated, setNavigated] = useState(false)
  const placeholder = placeholderProp ?? MODE_PLACEHOLDER[mode] ?? 'Search…'
  const selectLabel = selectLabelProp ?? MODE_LABEL[mode] ?? 'Go to page'
  const results = mode === 'shortcuts' ? shortcutRows(shortcuts, currentPath, query) : groupRows(query ? rawResults : suggestions)
  /* a `disabled` row is drawn but never active: ↑↓ step over it, Enter and click never reach
   * `onSelect` (ShellSearchDisabledRow, kol-monitor 2026-10-15 — a module with no room on the rack) */
  const clamped = Math.min(activeIndex, results.length - 1)
  const active = clamped >= 0 && !results[clamped].disabled ? clamped : -1
  const step = (from, dir) => {
    for (let i = from + dir; i >= 0 && i < results.length; i += dir) if (!results[i].disabled) return i
    return from
  }

  /* Focus in on open, restore the opener on close. querySelector instead of
   * a ref through SearchInput — ref-as-prop needs React 19 and the package
   * peer range still allows 18. */
  useEffect(() => {
    if (!open) return undefined
    const prev = document.activeElement
    panelRef.current?.querySelector('input')?.focus()
    return () => { if (prev instanceof HTMLElement) prev.focus() }
  }, [open])

  /* Roving row resets to the top on every query change / reopen — and when the ROWS change under an
   * unchanged query (ShellSearchOverlayActionKeepsOpen, kol-fxr 2026-10-13: a drill-in swaps the
   * suggestions for a category's presets). Keyed on the row ids, not the array's identity, so a
   * consumer passing a fresh array every render does not snap the highlight back to the top. */
  const rowsKey = results.map((r) => r.id).join('\u0000')
  useEffect(() => { setActiveIndex(Math.max(0, results.findIndex((r) => !r.disabled))); setNavigated(false) }, [query, open, rowsKey]) // eslint-disable-line react-hooks/exhaustive-deps

  /* Keep the active row visible inside the scrolling list. */
  useEffect(() => {
    if (active < 0) return
    listRef.current?.querySelectorAll('[role="option"]')[active]?.scrollIntoView({ block: 'nearest' })
  }, [active])

  if (!open) return null

  /* A row that KEEPS THE MODAL OPEN — `keepOpen`, or an `action` row (the contract below always said
   * so; until 0.252.0 every pick closed — ShellSearchOverlayActionKeepsOpen, kol-fxr 2026-10-13). It
   * still reaches `onSelect`, and the closure stays the consumer's to run there: the overlay running
   * it too would fire it twice in every shell that already does (workshop's tag rows). */
  const select = (item) => {
    if (item?.disabled) return
    if (mode === 'shortcuts') { onClose?.(); item?.run?.(); onSelect?.(item); return }
    onSelect?.(item)
    if (!(item?.keepOpen || typeof item?.action === 'function')) onClose?.()
  }

  const optionId = (item) => `${listId}-${item.id}`

  const handleKeyDown = (e) => {
    if (e.key === 'Backspace' && !query && onBack) {
      e.preventDefault()
      onBack()
    } else if (e.key === 'ArrowLeft' && !query && onBack) {
      e.preventDefault()
      onBack()
    } else if (e.key === 'ArrowRight' && !query && active >= 0 && results[active]?.keepOpen) {
      e.preventDefault()
      select(results[active])
    } else if (e.key === 'Escape') {
      e.preventDefault()
      onClose?.()
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      setNavigated(true)
      setActiveIndex((i) => step(Math.min(i, results.length - 1), 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setNavigated(true)
      setActiveIndex((i) => step(Math.min(i, results.length - 1), -1))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      /* ⌘ENTER OPENS EVERY HIT (user 2026-09-30: *"enter would focus searched item, and maybe
       * command enter would open the results page"*) — only where the consumer has a place for them. */
      if ((e.metaKey || e.ctrlKey) && onOpenResults && query) { onOpenResults(query); onClose?.(); return }
      /* ENTER OPENS THE HIGHLIGHTED ROW (user 2026-10-01: *"I think enter should also take you to
       * the atom but something like command enter take you to the index"* — reverses the
       * 2026-08-01 "Enter commits, it only selects once you have arrowed"). The top row is drawn
       * highlighted from the first keystroke, so Enter goes where the highlight says. With no
       * rows there is nothing to open and Enter commits the query. */
      if (active >= 0) select(results[active])
      else onExpand?.()
    } else if (e.key === 'Tab') {
      /* Focus trap — the input is the search modal's only tab stop. */
      e.preventDefault()
    }
  }

  return (
    <div className="fixed inset-0 flex items-start justify-center pt-[20vh]" style={{ zIndex: 'var(--kol-z-modal, 100)' }}>
      {/* A BUTTON, not a div (OverlayScrimTapDismiss, 2026-09-01): iOS Safari
        * does not bubble tap-clicks from non-interactive elements, so the div's
        * onClick never fired on a phone and the only way out was the close
        * control. A button always fires — and it ends the other half of the
        * defect, an interactive target carrying `aria-hidden`. */}
      <button
        type="button"
        aria-label="Close search"
        className="absolute inset-0 kol-overlay-scrim"
        onClick={onClose}
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
        {/* A REAL FIELD, inset in the panel (2026-09-30, shadcn's search modal as
          * the aim) — the flush `bare` strip read as a hole, not a control. */}
        <div className="kol-tone-grey p-2 flex items-center gap-2">
        {onBack && (
          <Tooltip label={backLabel}>
            {/* mousedown keeps focus in the field, as the rows do */}
            <Button iconOnly="arrow-left" tone="ghost" size="md" aria-label={backLabel} onMouseDown={(e) => e.preventDefault()} onClick={onBack} />
          </Tooltip>
        )}
        <SearchInput
          className="w-full min-w-0 flex-1"
          value={query}
          onChange={(e) => onQueryChange?.(e.target.value)}
          placeholder={chips.length > 0 ? 'Narrow these results…' : placeholder}
          onKeyDown={handleKeyDown}
          role="combobox"
          aria-expanded={results.length > 0}
          aria-controls={listId}
          aria-activedescendant={active >= 0 ? optionId(results[active]) : undefined}
        />
        </div>

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
          *   group     section heading the row files under — 'Atoms', 'Documentation', 'Tags'
          *   icon      optional leading glyph (kol-icons name)
          *   hint      subtext shown when the LABEL was not what matched
          *   href      a destination; dismisses the search modal
          *   action    a closure, run by the consumer's `onSelect`; the search modal STAYS OPEN (tag rows)
          *   disabled  drawn muted, skipped by ↑↓, never reaches `onSelect`; `disabledHint` replaces
          *             `hint` with the reason (a full rack: "no room")
          *   keepOpen  the row selects and the search modal STAYS OPEN — a drill-in (category →
          *             its items, a "← All" row back); the consumer swaps `suggestions`/`results`
          * Built by `buildShellSearchItems` (showcase/src/nav/shell-nav.js). */}
        {expanded ? (
          <div className="border-t border-fg-08 max-h-[70vh] overflow-y-auto">{children}</div>
        ) : results.length > 0 && (
          /* FIXED BODY HEIGHT — the panel holds still while the list narrows. */
          <ul
            ref={listRef}
            id={listId}
            role="listbox"
            className="kol-tone-grey h-80 overflow-y-auto px-2 pb-2"
          >
            {results.map((item, i) => {
              const heading = (item.group ?? '') !== (results[i - 1]?.group ?? '') || i === 0
              return (
                <li key={item.id} role="presentation">
                  {heading && item.group && (
                    <p className="kol-helper-12 text-fg-48 px-4 border-x border-transparent pt-3 pb-2">{item.group}</p>
                  )}
                  <OptionRow
                    id={optionId(item)}
                    role="option"
                    aria-selected={i === active}
                    aria-disabled={item.disabled || undefined}
                    active={i === active}
                    disabled={item.disabled}
                    icon={item.icon}
                    label={<HighlightMatch label={item.label} query={query} ranges={item.highlights} />}
                    hint={(item.disabled && item.disabledHint) || item.hint}
                    /* preventDefault keeps focus in the input through the click */
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => select(item)}
                    onMouseEnter={() => { if (!item.disabled) { setActiveIndex(i); setNavigated(true) } }}
                  />
                </li>
              )
            })}
          </ul>
        )}
        {/* THE FOOTER SAYS WHAT ENTER DOES — always, not only once typing. */}
        {!expanded && (results.length > 0 || (query && (enterLabel || onOpenResults))) && (
          <div className="border-t border-fg-08 py-2">
            {/* Enter's line names what Enter does NOW: a row is highlighted → it opens that row;
              * no rows → it commits the query. */}
            {(results.length > 0 || enterLabel) && (
              <p className="flex items-center gap-2 kol-helper-12 text-fg-48 mx-2 px-4 border-x border-transparent">
                <Kbd icon="corner-down-left" />
                {results.length > 0 ? selectLabel : enterLabel}
              </p>
            )}
            {/* THE RESULTS LINE IS A LINK (user 2026-10-01: *"make 'all results...' at the bottom
              * also be a link to the results page"*) — the same door ⌘Enter opens. */}
            {query && onOpenResults && (
              <button
                type="button"
                className="flex items-center gap-2 kol-helper-12 text-fg-48 hover:text-fg-default transition-colors mx-2 px-4 border-x border-transparent pt-1"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => { onOpenResults(query); onClose?.() }}
              >
                <Kbd icon="command"><Icon name="corner-down-left" size={12} /></Kbd>
                {resultsLabel}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
