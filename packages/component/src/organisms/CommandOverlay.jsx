import { useEffect, useId, useRef, useState } from 'react'
import { IconLoader } from '@kolkrabbi/kol-icons'
import SearchInput from '../molecules/SearchInput.jsx'
import Tag from '../atoms/Tag.jsx'
import TabsRow from '../molecules/TabsRow.jsx'
import Button from '../atoms/Button.jsx'
import { floatSurfaceClass } from '../utilities/tone.js'
import { floatMotion } from '../utilities/motion.js'
import useFloatPresence from '../hooks/useFloatPresence.js'
import { shortcutInScope } from './ShortcutsOverlay.jsx'

/* ONE COLUMN (2026-09-30): rows, headings and footer sit on the field's own
 * geometry — the p-2 inset, then the md control's 1px ring + 16px pad — so
 * every glyph and word lines up under the field's icon and caret. */

/* the foot's rule runs the card's full width: out through the card's inset, the hints 12 in from the rows' edge */
const RULE = { margin: '6px calc(-1 * var(--kol-float-inset)) calc(-1 * var(--kol-float-inset))', paddingInline: 'calc(var(--kol-float-inset) + 12px)' }

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
/* `go` was `search` under another placeholder — folded into it (user 2026-10-18); still accepted as its old name */
const MODE_LABEL = { search: 'Go to page', add: 'Add' }
const MODE_PLACEHOLDER = { search: 'Search…', add: 'Add…' }

/* THE KEYMAP AS FOLDS (user 2026-10-18: *"shortcuts doesnt make any sense in command overlay, it should just be
 * shortcuts fold"*): this page's sections (plus those with no `routes`) as fold rows under "Shortcuts", each opening
 * its keys in place — label left, combo right, never run. The index keeps two keys with one label apart. */
function shortcutFolds(shortcuts, path) {
  return shortcuts.filter((s) => shortcutInScope(s, path)).map((s) => ({
    /* EVERY section starts OPEN (user 2026-10-23: *"you should see the shortcuts expanded, not choose navigate or
     * help, so expand all should be collapse all, with expanded the default"*) — the footer reads Collapse all on
     * open and folds them all in one press. Until then only a section with matching `routes` opened. */
    id: `cat:${s.section}`, label: s.section, group: 'Shortcuts', open: true,
    items: (s.items ?? []).map((it, i) => ({ id: it.id ?? `${i}:${it.label}`, label: it.label, hint: it.combo ?? it.keys })),
  }))
}

/* FOLD ROWS (user 2026-10-18: *"shortcuts could be used for things like add, where you wanna find category not a flat
 * list, and all could also be a category"*): any row carrying `items` is a category that opens its rows under it, in
 * place — the arrow turns down. Its children take its group and an indent; nothing else on the list moves. */
function unfold(rows, opened) {
  return rows.flatMap((r) => {
    if (!Array.isArray(r.items)) return [r]
    const on = opened.has(r.id)
    return [
      { ...r, icon: on ? 'arrow-down' : 'arrow-right', fold: true },
      ...(on ? r.items.map((c) => ({ ...c, id: `${r.id}/${c.id}`, group: r.group, indent: true, of: r.id })) : []),
    ]
  })
}

/**
 * CommandOverlay — The ⌘K search modal. The ⌘K overlay: search, add, go, shortcuts. Was `ShellSearchOverlay` (still exported, an
 * alias). `mode` names what the overlay is for — `search` (default) · `add` · `shortcuts` (`go` is search's old name). In
 * `shortcuts` it draws `shortcuts` (the AppHub keymap) with NO field, as fold rows: the current page's sections
 * under "Shortcuts", every one open on arrival (its keys in place, label and combo, never run), the footer's
 * Collapse all folding them. AppHub's `S` opens this; its ⌘K opens `search` over files, pages and the same keymap.
 *
 * FOLD ROWS, any mode: a row with `items` is a category — Enter / → / click opens it in place, ← or Enter again
 * closes it; its children are ordinary rows (Enter selects them). An "All" category is just a fold row holding
 * every item. `open: true` on a fold row starts it open; ⌘/Ctrl+Enter (and the footer's second line) opens or
 * closes them all.
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
 *                                 search glyph becomes a back arrow in its slot (the field never moves); Backspace on an empty field calls it —
 *                                 instead of a "← All" row that scrolls away with the list
 * @param {string}   [backLabel]   the arrow's tooltip (default `Back`) — name where it goes ("All modules")
 * @param {string}   [selectLabel] the footer's Enter line while a row is highlighted (default
 *                                 `Go to page`) — a modal whose rows are not pages says what
 *                                 Enter does instead (the rack's module search: `Add module`)
 * @param {'solid'|'glass-dark'|'glass-light'} [surface='solid']  ONE SEARCH STYLE (plan-2026-11-05-float-editor 7.7, his
 *                                 frame float-more 30:914 — *"anchored search (along with same style regular search)"*):
 *                                 every search modal is the float card — RailTrigger's (`kol-more-sheet-float` on
 *                                 `--kol-float-menu-r`, the float surface and shadow), the float SearchInput, the float
 *                                 rows (Inter, `--kol-float-row`, the lit row fg-16, the hint right), eyebrow groups, and
 *                                 the key-hint foot under a full-width rule. `surface` only picks what the card is made of
 * @param {Array}    [tabs]        `[{ id, label }]` — his All · Actions · Tools · Pages: the first shows every row, the
 *                                 rest the rows whose `tab` is their id. Tab / ⇧Tab step through them from the field
 * @param {Object|Element} [anchor] a ref (or element) the card ANCHORS ABOVE — the dock's ⌘K: the card takes the anchor's
 *                                 left and width, 16 over its top, the page undimmed. Unset, the card is centred
 * @param {string}   [shortcutHint] the field's key cap while it is empty (his `⌘K`)
 * @param {boolean|Object} [motion=true]  with `surface`, the card fades and scales in and out over a fading scrim, held in
 *                                 the tree while it leaves (FloatActionStatesAndMotion, 2026-11-04): `true` the
 *                                 `--kol-float-*` tokens · `false` none · `{ duration, ease }` per app
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
  surface = 'solid',
  tabs,
  anchor,
  shortcutHint,
  motion = true,
}) {
  const float = true
  const fm = floatMotion(motion)
  const presence = useFloatPresence(open, float ? fm.ms : 0)
  const exit = float && presence.exiting ? '' : undefined
  const panelRef = useRef(null)
  const listRef = useRef(null)
  const listId = useId()
  const [activeIndex, setActiveIndex] = useState(0)
  /* Has the user actually chosen a row? See the Enter branch — without this,
   * index 0 counts as a selection and Enter navigates somewhere unasked. */
  const [navigated, setNavigated] = useState(false)
  /* the fold rows' open categories */
  const [opened, setOpened] = useState(() => new Set())
  const toggle = (c, on) => setOpened((o) => { const n = new Set(o); (on ?? !n.has(c)) ? n.add(c) : n.delete(c); return n })
  const noField = mode === 'shortcuts'
  const back = onBack
  if (mode === 'go') mode = 'search'
  const placeholder = placeholderProp ?? MODE_PLACEHOLDER[mode] ?? 'Search…'
  const selectLabel = selectLabelProp ?? MODE_LABEL[mode] ?? 'Go to page'
  const [tab, setTab] = useState(null)
  const tabNow = tabs?.some((t) => t.id === tab) ? tab : tabs?.[0]?.id
  const inTab = (r) => !tabs || (tabNow === tabs[0].id ? !r.tabOnly : r.tab === tabNow)
  const base = mode === 'shortcuts' ? shortcutFolds(shortcuts, currentPath) : groupRows((query ? rawResults : suggestions).filter(inTab))
  /* the anchored card: the anchor's left and width, 16 over its top — read as it draws (a hidden first frame could not
   * take the focus), and again on resize */
  const [, reflow] = useState(0)
  useEffect(() => {
    if (!open || !anchor) return undefined
    const on = () => reflow((n) => n + 1)
    window.addEventListener('resize', on)
    return () => window.removeEventListener('resize', on)
  }, [open, anchor])
  const anchorRect = presence.mounted && anchor ? (anchor.current ?? anchor)?.getBoundingClientRect?.() : null
  const place = anchorRect ? { left: anchorRect.left, width: anchorRect.width, bottom: window.innerHeight - anchorRect.top + 16 } : null
  const results = unfold(base, opened)
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
    ;(panelRef.current?.querySelector('input') ?? panelRef.current)?.focus()
    setOpened(new Set(base.filter((r) => r.items && r.open).map((r) => r.id)))
    return () => { setOpened(new Set()); setTab(null); if (prev instanceof HTMLElement) prev.focus() }
  }, [open])

  /* Roving row resets to the top on every query change / reopen — and when the ROWS change under an
   * unchanged query (ShellSearchOverlayActionKeepsOpen, kol-fxr 2026-10-13: a drill-in swaps the
   * suggestions for a category's presets). Keyed on the row ids, not the array's identity, so a
   * consumer passing a fresh array every render does not snap the highlight back to the top. */
  /* the BASE rows, not the unfolded ones: opening a category must not throw the highlight back to the top */
  const rowsKey = base.map((r) => r.id).join('\u0000')
  useEffect(() => { setActiveIndex(Math.max(0, results.findIndex((r) => !r.disabled))); setNavigated(false) }, [query, open, rowsKey, tabNow]) // eslint-disable-line react-hooks/exhaustive-deps

  /* Keep the active row visible inside the scrolling list. */
  useEffect(() => {
    if (active < 0) return
    listRef.current?.querySelectorAll('[role="option"]')[active]?.scrollIntoView({ block: 'nearest' })
  }, [active])

  if (!(float ? presence.mounted : open)) return null

  /* A row that KEEPS THE MODAL OPEN — `keepOpen`, or an `action` row (the contract below always said
   * so; until 0.252.0 every pick closed — ShellSearchOverlayActionKeepsOpen, kol-fxr 2026-10-13). It
   * still reaches `onSelect`, and the closure stays the consumer's to run there: the overlay running
   * it too would fire it twice in every shell that already does (workshop's tag rows). */
  const select = (item) => {
    if (item?.disabled) return
    if (item?.fold) { toggle(item.id); return }
    /* a key is never run: Enter on one folds its category back up, the highlight on the category */
    if (mode === 'shortcuts') {
      if (item?.of != null) { toggle(item.of, false); setActiveIndex(results.findIndex((x) => x.id === item.of)) }
      return
    }
    onSelect?.(item)
    if (!(item?.keepOpen || typeof item?.action === 'function')) onClose?.()
  }

  const optionId = (item) => `${listId}-${item.id}`

  /* EXPAND / COLLAPSE ALL (user 2026-10-18: *"needs a expand/collapse all shortcut next to expand in the bottom"*) */
  const folds = base.filter((r) => Array.isArray(r.items))
  const allOpen = folds.length > 0 && folds.every((r) => opened.has(r.id))
  const toggleAll = () => setOpened(allOpen ? new Set() : new Set(folds.map((r) => r.id)))

  const handleKeyDown = (e) => {
    if (e.key === 'Backspace' && !query && back) {
      e.preventDefault()
      back()
    } else if (e.key === 'ArrowLeft' && !query && back) {
      e.preventDefault()
      back()
    } else if (!query && (e.key === 'ArrowRight' || e.key === 'ArrowLeft') && active >= 0 && (results[active].fold || results[active].of != null)) {
      /* fold rows: → opens the highlighted category, ← closes it (from a child row, its own category) */
      e.preventDefault()
      const r = results[active]
      const c = r.fold ? r.id : r.of
      if (e.key === 'ArrowRight' && r.fold) toggle(c, true)
      if (e.key === 'ArrowLeft') { toggle(c, false); if (!r.fold) setActiveIndex(results.findIndex((x) => x.id === c)) }
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
      /* ⌘ENTER ON FOLDS opens every category, or closes them all when all are open */
      if ((e.metaKey || e.ctrlKey) && folds.length) { toggleAll(); return }
      /* ENTER OPENS THE HIGHLIGHTED ROW (user 2026-10-01: *"I think enter should also take you to
       * the atom but something like command enter take you to the index"* — reverses the
       * 2026-08-01 "Enter commits, it only selects once you have arrowed"). The top row is drawn
       * highlighted from the first keystroke, so Enter goes where the highlight says. With no
       * rows there is nothing to open and Enter commits the query. */
      if (active >= 0) select(results[active])
      else onExpand?.()
    } else if (e.key === 'Tab') {
      /* Focus trap — the input is the search modal's only tab stop; with `tabs`, Tab / ⇧Tab step through them */
      e.preventDefault()
      if (tabs?.length) {
        const at = tabs.findIndex((t) => t.id === tabNow)
        setTab(tabs[(at + (e.shiftKey ? -1 : 1) + tabs.length) % tabs.length].id)
      }
    }
  }

  /* the foot's hints — his "↑↓ Navigate · ↵ Run · Esc Close"; Enter's word names what Enter does NOW */
  const enterWord = results.length > 0
    ? (results[active]?.fold ? (opened.has(results[active].id) ? 'Collapse' : 'Expand') : noField ? 'Collapse' : selectLabel)
    : enterLabel
  const hint = 'flex items-center gap-1.5 text-oq-64'
  const hintBtn = `${hint} hover:text-fg-emphasis transition-colors cursor-pointer`

  return (
    <div className={`fixed inset-0 ${place ? '' : 'flex items-start justify-center pt-[20vh]'}`} style={{ zIndex: 'var(--kol-z-modal, 100)', ...fm.style }}>
      {/* A BUTTON, not a div (OverlayScrimTapDismiss, 2026-09-01): iOS Safari
        * does not bubble tap-clicks from non-interactive elements, so the div's
        * onClick never fired on a phone and the only way out was the close
        * control. A button always fires — and it ends the other half of the
        * defect, an interactive target carrying `aria-hidden`. Anchored, the page stays undimmed. */}
      <button
        type="button"
        aria-label="Close search"
        className={`absolute inset-0 ${place ? 'cursor-default' : 'kol-overlay-scrim kol-float-fade'}`}
        data-exit={exit}
        onClick={onClose}
      />
      <div
        ref={panelRef}
        /* no field (shortcuts): the panel takes focus and the keys */
        tabIndex={noField ? -1 : undefined}
        onKeyDown={noField ? handleKeyDown : undefined}
        role="dialog"
        aria-modal="true"
        aria-label="Search"
        data-exit={exit}
        data-side={place ? 'top' : undefined}
        style={place ? { position: 'fixed', left: place.left, width: place.width, bottom: place.bottom } : undefined}
        className={`kol-command kol-more-sheet kol-more-sheet-float kol-float-chrome kol-float-motion ${floatSurfaceClass(surface, true)} overflow-hidden ${place ? '' : `relative w-full mx-4 ${expanded ? 'max-w-[var(--kol-content-panel)]' : 'max-w-xl'}`} ${noField ? 'outline-none' : ''}`.replace(/\s+/g, ' ').trim()}
      >
        {/* THE MODE, said out loud (user 2026-08-01: "how do you set search
          * mode? theres no helper, message or mode clearly readble"). Two
          * modes exist — FILTER (tags narrow a set) and FIND (a keyword jumps
          * to a destination) — and the only signal was whether chips happened
          * to be present. The chips ARE the mode, so they get a label. */}
        {chips.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5 px-3 pt-2 pb-1">
            <span className="kol-float-label text-oq-64 shrink-0">Filtering by</span>
            {chips.map((t) => (
              <Tag key={t} onRemove={() => onRemoveChip?.(t)}>{t}</Tag>
            ))}
          </div>
        )}
        {/* THE BACK ARROW TAKES THE SEARCH GLYPH'S SLOT (user 2026-10-18: *"why would the back move the input?!"*) —
          * a button beside the field shrank it and shifted the caret on every drill-in */}
        {!noField && (
          <SearchInput
            className="w-full min-w-0"
            value={query}
            onChange={(e) => onQueryChange?.(e.target.value)}
            placeholder={chips.length > 0 ? 'Narrow these results…' : placeholder}
            onKeyDown={handleKeyDown}
            onBack={back}
            backLabel={backLabel}
            shortcutHint={shortcutHint}
            variant="float"
            size="lg"
            role="combobox"
            aria-expanded={results.length > 0}
            aria-controls={listId}
            aria-activedescendant={active >= 0 ? optionId(results[active]) : undefined}
          />
        )}
        {/* his tabs — All · Actions · Tools · Pages — the float TabsRow under the field */}
        {tabs?.length > 0 && !expanded && (
          <TabsRow variant="float" size="md" tabs={tabs} value={tabNow} onChange={setTab} className="pt-2" />
        )}

        {/* WHY THIS IS NOT `molecules/Dropdown` (asked 2026-08-01). Dropdown is
          * a SELECT: a trigger, a `value`, `onChange(value)`, and rows that are
          * options. This is a COMBOBOX — a text query filtering a live list
          * whose rows carry a `group`, a `hint`, and may fire an `action`
          * instead of selecting a value. Same ARIA family, different control.
          *
          * THE ROW CONTRACT:
          *   label     the row's text, match-highlighted against the query
          *   group     section heading the row files under — 'Atoms', 'Recent', 'Pages'
          *   tab       the `tabs` id it shows under (every row shows under the first); `tabOnly` — only under its own
          *             (an empty Actions tab lists every action, which All leaves to Recent)
          *   icon      optional leading glyph (kol-icons name)
          *   hint      the right-hand line — a key, a page, what matched when the LABEL did not
          *   href      a destination; dismisses the search modal
          *   action    a closure, run by the consumer's `onSelect`; the search modal STAYS OPEN (tag rows)
          *   disabled  drawn muted, skipped by ↑↓, never reaches `onSelect`; `disabledHint` replaces
          *             `hint` with the reason (a full rack: "no room")
          *   keepOpen  the row selects and the search modal STAYS OPEN — a drill-in (category →
          *             its items, a "← All" row back); the consumer swaps `suggestions`/`results`
          * Built by `buildShellSearchItems` (showcase/src/nav/shell-nav.js). */}
        {expanded ? (
          <div className="border-t border-fg-08 max-h-[70vh] overflow-y-auto" style={RULE}>{children}</div>
        ) : results.length > 0 && (
          /* FIXED BODY HEIGHT — the panel holds still while the list narrows. */
          <ul ref={listRef} id={listId} role="listbox" className="h-80 overflow-y-auto">
            {results.map((item, i) => {
              const heading = (item.group ?? '') !== (results[i - 1]?.group ?? '') || i === 0
              return (
                <li key={item.id} role="presentation">
                  {heading && item.group && (
                    /* the rail's eyebrow (user 2026-10-18: *"sections shoudl be uppercase eyebrow like in siderail"*) */
                    <p className="kol-eyebrow text-oq-64 px-3 pt-3 pb-2">{item.group}</p>
                  )}
                  {/* the float row: RailTrigger's card row, lit on the float selection while it is the cursor */}
                  <Button
                    id={optionId(item)}
                    role="option"
                    aria-selected={i === active}
                    aria-disabled={item.disabled || undefined}
                    tabIndex={-1}
                    variant="nav"
                    size="lg"
                    className={`kol-btn-float w-full justify-start${i === active ? ' kol-btn-pressed' : ''}${item.disabled ? ' opacity-40' : ''}`}
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => select(item)}
                    onMouseEnter={() => { if (!item.disabled) { setActiveIndex(i); setNavigated(true) } }}
                  >
                    {/* the glyph drawn here, not as `iconLeft` — Button would wrap it and the label in a span that does not take the row */}
                    <span className="flex min-w-0 flex-1 items-center" style={{ gap: 'var(--kol-float-gap-ic)' }}>
                      {item.indent ? <span className="inline-block w-4 shrink-0" /> : item.icon && (typeof item.icon === 'string' ? <IconLoader name={item.icon} size="var(--kol-float-ic)" className="shrink-0 text-oq-88" /> : item.icon)}
                      <span className="truncate text-left"><HighlightMatch label={item.label} query={query} ranges={item.highlights} /></span>
                      {((item.disabled && item.disabledHint) || item.hint) && <span className="kol-float-hint ml-auto truncate pl-3 text-oq-64">{(item.disabled && item.disabledHint) || item.hint}</span>}
                    </span>
                  </Button>
                </li>
              )
            })}
          </ul>
        )}
        {/* THE FOOT — his key hints under a rule that runs the card's full width; it always says what Enter does. */}
        {!expanded && (results.length > 0 || (query && (enterLabel || onOpenResults))) && (
          <div className="kol-float-hint flex flex-wrap items-center gap-x-5 gap-y-1 border-t border-fg-08 py-3 pointer-coarse:min-h-11" style={RULE}>
            {results.length > 1 && <span className={hint}><span aria-hidden>↑↓</span>Navigate</span>}
            {enterWord && <span className={hint}><span aria-hidden>↵</span>{enterWord}</span>}
            <button type="button" className={hintBtn} onMouseDown={(e) => e.preventDefault()} onClick={onClose}><span aria-hidden>Esc</span>Close</button>
            {/* ⌘↵ — the other one: every fold open or shut, or THE RESULTS LINK (user 2026-10-01: *"make 'all
              * results...' at the bottom also be a link to the results page"*) — the door ⌘Enter opens */}
            {folds.length > 0 && !query && (
              <button type="button" className={`${hintBtn} ml-auto`} onMouseDown={(e) => e.preventDefault()} onClick={toggleAll}>
                <span aria-hidden>⌘↵</span>{allOpen ? 'Collapse all' : 'Expand all'}
              </button>
            )}
            {query && onOpenResults && (
              <button type="button" className={`${hintBtn} ml-auto min-w-0`} onMouseDown={(e) => e.preventDefault()} onClick={() => { onOpenResults(query); onClose?.() }}>
                <span aria-hidden>⌘↵</span><span className="truncate">{resultsLabel}</span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
