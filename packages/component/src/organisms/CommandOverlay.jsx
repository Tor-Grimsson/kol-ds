import { Fragment, useEffect, useId, useRef, useState } from 'react'
import Input from '../atoms/Input.jsx'
import Kbd, { KbdKeys } from '../atoms/Kbd.jsx'
import TreeRow from '../molecules/TreeRow.jsx'
import OptionRow from '../molecules/OptionRow.jsx'
import { PopoverLayer } from '../utilities/Popover.jsx'
import { IconLoader } from '@kolkrabbi/kol-icons'
import SearchInput from '../molecules/SearchInput.jsx'
import ModalShell from '../molecules/ModalShell.jsx'
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
 * @param {'default'|'float'|'kolbox'|'folio'} [variant='default']  the look. `folio`: Folio's search modal and command list (`mode`
 *                                 search, commands), see `CommandOverlayFolio`. `default` is the KOL search modal (the overlay
 *                                 panel on oq-04, the field in a grey tone, OptionRow rows, the Kbd footer), as it was
 *                                 drawn up to 0.341.1. `float` is the float card (plan-2026-11-05-float-editor 7.7, his
 *                                 frame float-more 30:914): RailTrigger's (`kol-more-sheet-float` on `--kol-float-menu-r`,
 *                                 the float surface and shadow), the float SearchInput, the float rows (Inter,
 *                                 `--kol-float-row`, the lit row fg-16, the hint right), eyebrow groups, and the key-hint
 *                                 foot under a full-width rule. Float apps only (his ruling 2026-11-20, plan W17.1)
 * @param {'solid'|'glass-dark'|'glass-light'} [surface='solid']  with `variant="float"`, what the card is made of
 * @param {Array}    [tabs]        `[{ id, label }]` — his All · Actions · Tools · Pages: the first shows every row, the
 *                                 rest the rows whose `tab` is their id. Tab / ⇧Tab step through them from the field
 * @param {Object|Element} [anchor] a ref (or element) the card ANCHORS ABOVE — the dock's ⌘K: the card takes the anchor's
 *                                 left and width, 16 over its top, the page undimmed. Unset, the card is centred
 * @param {string}   [shortcutHint] the field's key cap while it is empty (his `⌘K`)
 * @param {boolean|Object} [motion=true]  with `surface`, the card fades and scales in and out over a fading scrim, held in
 *                                 the tree while it leaves (FloatActionStatesAndMotion, 2026-11-04): `true` the
 *                                 `--kol-float-*` tokens · `false` none · `{ duration, ease }` per app
 */
function CommandOverlayDefault({
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
  variant = 'default',
  surface = 'solid',
  tabs,
  anchor,
  shortcutHint,
  motion = true,
}) {
  const float = variant === 'float'
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
    <div className={`fixed inset-0 ${place ? '' : 'flex items-start justify-center pt-[20vh]'}`} style={{ zIndex: 'var(--kol-z-modal, 100)', ...(float ? fm.style : null) }}>
      {/* A BUTTON, not a div (OverlayScrimTapDismiss, 2026-09-01): iOS Safari
        * does not bubble tap-clicks from non-interactive elements, so the div's
        * onClick never fired on a phone and the only way out was the close
        * control. A button always fires — and it ends the other half of the
        * defect, an interactive target carrying `aria-hidden`. Anchored, the page stays undimmed. */}
      <button
        type="button"
        aria-label="Close search"
        className={`absolute inset-0 ${place ? 'cursor-default' : `kol-overlay-scrim${float ? ' kol-float-fade' : ''}`}`}
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
        className={float
          ? `kol-command kol-more-sheet kol-more-sheet-float kol-float-chrome kol-float-motion ${floatSurfaceClass(surface, true)} overflow-hidden ${place ? '' : `relative w-full mx-4 ${expanded ? 'max-w-[var(--kol-content-panel)]' : 'max-w-xl'}`} ${noField ? 'outline-none' : ''}`.replace(/\s+/g, ' ').trim()
          : `kol-overlay-panel ${place ? '' : 'mx-4 '}${noField ? 'outline-none ' : ''}${expanded ? 'max-w-[var(--kol-content-panel)]' : 'max-w-lg'}`}
      >
        {/* THE MODE, said out loud (user 2026-08-01: "how do you set search
          * mode? theres no helper, message or mode clearly readble"). Two
          * modes exist — FILTER (tags narrow a set) and FIND (a keyword jumps
          * to a destination) — and the only signal was whether chips happened
          * to be present. The chips ARE the mode, so they get a label. */}
        {chips.length > 0 && (float ? (
          <div className="flex flex-wrap items-center gap-1.5 px-3 pt-2 pb-1">
            <span className="kol-float-label text-oq-64 shrink-0">Filtering by</span>
            {chips.map((t) => (
              <Tag key={t} onRemove={() => onRemoveChip?.(t)}>{t}</Tag>
            ))}
          </div>
        ) : (
          <div className="flex flex-wrap items-center gap-1.5 px-4 pt-3">
            <span className="kol-helper-10 text-fg-48 shrink-0">FILTERING BY</span>
            {chips.map((t) => (
              <Tag key={t} onRemove={() => onRemoveChip?.(t)}>{t}</Tag>
            ))}
          </div>
        ))}
        {/* THE BACK ARROW TAKES THE SEARCH GLYPH'S SLOT (user 2026-10-18: *"why would the back move the input?!"*) —
          * a button beside the field shrank it and shifted the caret on every drill-in */}
        {!noField && !float && (
          /* A REAL FIELD, inset in the panel (2026-09-30, shadcn's search modal as the aim) */
          <div className="kol-tone-grey p-2 flex items-center gap-2">
            <SearchInput
              className="w-full min-w-0 flex-1"
              value={query}
              onChange={(e) => onQueryChange?.(e.target.value)}
              placeholder={chips.length > 0 ? 'Narrow these results…' : placeholder}
              onKeyDown={handleKeyDown}
              onBack={back}
              backLabel={backLabel}
              shortcutHint={shortcutHint}
              role="combobox"
              aria-expanded={results.length > 0}
              aria-controls={listId}
              aria-activedescendant={active >= 0 ? optionId(results[active]) : undefined}
            />
          </div>
        )}
        {!noField && float && (
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
          <TabsRow variant={float ? 'float' : undefined} size="md" tabs={tabs} value={tabNow} onChange={setTab} className={float ? 'pt-2' : 'px-2 pt-2'} />
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
          <div className="border-t border-fg-08 max-h-[70vh] overflow-y-auto" style={float ? RULE : undefined}>{children}</div>
        ) : results.length > 0 && (
          /* FIXED BODY HEIGHT — the panel holds still while the list narrows. */
          <ul ref={listRef} id={listId} role="listbox" className={float ? 'flex h-80 flex-col gap-[var(--kol-spacing-0-5)] overflow-y-auto' : `kol-tone-grey h-80 overflow-y-auto px-2 pb-2${noField ? ' pt-2' : ''}`}>
            {results.map((item, i) => {
              const heading = (item.group ?? '') !== (results[i - 1]?.group ?? '') || i === 0
              return (
                <li key={item.id} role="presentation">
                  {heading && item.group && (
                    /* the rail's eyebrow (user 2026-10-18: *"sections shoudl be uppercase eyebrow like in siderail"*) */
                    <p className={float ? 'kol-eyebrow text-oq-64 px-3 pt-3 pb-2' : 'kol-eyebrow text-fg-80 px-4 border-x border-transparent pt-3 pb-2'}>{item.group}</p>
                  )}
                  {float ? (
                  /* the float row: RailTrigger's card row, lit on the float selection while it is the cursor */
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
                  ) : (
                  <OptionRow
                    id={optionId(item)}
                    role="option"
                    aria-selected={i === active}
                    aria-disabled={item.disabled || undefined}
                    active={i === active}
                    disabled={item.disabled}
                    icon={typeof item.icon === 'string' ? item.icon : undefined}
                    /* a fold's key row sits under its category's label, past the chevron */
                    leading={item.indent ? <span className="inline-block w-4" /> : typeof item.icon === 'string' ? undefined : item.icon}
                    label={<HighlightMatch label={item.label} query={query} ranges={item.highlights} />}
                    hint={(item.disabled && item.disabledHint) || item.hint}
                    /* preventDefault keeps focus in the input through the click */
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => select(item)}
                    onMouseEnter={() => { if (!item.disabled) { setActiveIndex(i); setNavigated(true) } }}
                  />
                  )}
                </li>
              )
            })}
          </ul>
        )}
        {/* THE FOOT — his key hints under a rule that runs the card's full width; it always says what Enter does. */}
        {!expanded && !float && (results.length > 0 || (query && (enterLabel || onOpenResults))) && (
          <div className="border-t border-fg-08 py-2">
            {/* Enter's line names what Enter does NOW: a row is highlighted → it opens that row; no rows → it commits the query */}
            {enterWord && (
              /* 44px on touch — a finger-sized line */
              <p className="flex items-center gap-2 kol-helper-12 text-fg-48 mx-2 px-4 border-x border-transparent pointer-coarse:min-h-11">
                <Kbd icon="corner-down-left" />
                {enterWord}
                {/* the second action on the same line, right — ⌘↵, the footer's idiom for "the other one" */}
                {folds.length > 0 && !query && (
                  <button
                    type="button"
                    className="ml-auto flex items-center gap-2 text-fg-48 hover:text-fg-default transition-colors cursor-pointer"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={toggleAll}
                  >
                    <Kbd icon="command"><IconLoader name="corner-down-left" size={12} /></Kbd>
                    {allOpen ? 'Collapse all' : 'Expand all'}
                  </button>
                )}
              </p>
            )}
            {/* THE RESULTS LINE IS A LINK (user 2026-10-01) — the same door ⌘Enter opens */}
            {query && onOpenResults && (
              <button
                type="button"
                className="flex items-center gap-2 kol-helper-12 text-fg-48 hover:text-fg-default transition-colors mx-2 px-4 border-x border-transparent pt-1"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => { onOpenResults(query); onClose?.() }}
              >
                <Kbd icon="command"><IconLoader name="corner-down-left" size={12} /></Kbd>
                {resultsLabel}
              </button>
            )}
          </div>
        )}
        {!expanded && float && (results.length > 0 || (query && (enterLabel || onOpenResults))) && (
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

/* ── kolbox (plan-2026-11-18-kolbox-system W31.2 batch 5, 2026-11-18) ─────────────────────────────────────────────────
 * kolbox's ModalSearch (round 3, 9.1; round 4, 14.1), carried from apps/kolbox/src/ui/ModalSearch.jsx: the panel 576 wide
 * (`--kol-kolbox-search-w`), radius 16, on the one floating surface, in PopoverLayer's body on the dim, 20% down. The
 * field (Input kolbox lg, the lens, the ⌘K mark while empty), the tabs, then the groups: a title and its rows (TreeRow
 * kolbox lg, touching, the active one lit, the hint at the right), then a rule and the foot (↑↓ Navigate, ↵ Run, Esc
 * Close). Presentational: the host passes the rows and keeps the state. CommandOverlay's words: `open`, `onClose`,
 * `query`, `onQueryChange`, `placeholder`, `tabs` [{ value, label }], `onSelect(row)` (kolbox's onRun), `mode` ('search',
 * or 'shortcuts': the real S sheet, the same panel with no field and no tabs, Enter folds a key's section back up and
 * never runs it). kolbox's own: `tab`, `onTab`, `groups` [{ title, rows: [{ id, icon, label, body, hint, kbd, disabled,
 * disabledHint, items, open }] }] (a row with `items` is a fold), `active` (an index into the rows in group order),
 * `onActive(index)`, `empty` (what can be searched, said when nothing is found:
 * plan-2026-11-19 C5.1b). Keys in the field: ↑↓ move the lit row over disabled rows,
 * Enter runs it, Tab and ⇧Tab step the tabs, → and ← open and close a fold while the field is empty, ⌘↵ all folds;
 * Escape is the layer's. */
function MatchKolbox({ label, query }) {
  /* a label the host has marked itself (a node) is drawn as it is */
  if (typeof label !== 'string') return label
  const at = query ? label.toLowerCase().indexOf(query.toLowerCase()) : -1
  if (at < 0) return label
  return <>{label.slice(0, at)}<span className="underline decoration-2 underline-offset-[3px]">{label.slice(at, at + query.length)}</span>{label.slice(at + query.length)}</>
}
const KeyKolbox = ({ k, children }) => <span className="flex items-center gap-1"><KbdKeys variant="kolbox" size="sm" keys={k} />{children}</span>
/* a fold's rows indented to its label: the row's 12 inset, the 20 icon and its 12 gap */
const INDENT_KOLBOX = { paddingLeft: 'calc(var(--kol-spacing-3) * 2 + 20px)' }

function CommandOverlayKolbox({ open, onClose, mode = 'search', query = '', onQueryChange, placeholder = 'Search tools, actions, pages…', tabs = [], tab, onTab, groups = [], active = -1, onActive, onSelect, empty, mark = '⌘K', 'aria-label': ariaLabel }) {
  const field = mode !== 'shortcuts'
  const input = useRef(null)
  const panel = useRef(null)
  const list = useRef(null)
  const listId = useId()
  const folds = groups.flatMap((g) => g.rows).filter((r) => Array.isArray(r.items))
  const [opened, setOpened] = useState(() => new Set())
  const toggle = (id, on) => setOpened((o) => { const n = new Set(o); (on ?? !n.has(id)) ? n.add(id) : n.delete(id); return n })
  const allOpen = folds.length > 0 && folds.every((r) => opened.has(r.id))
  const toggleAll = () => setOpened(allOpen ? new Set() : new Set(folds.map((r) => r.id)))
  const shown = groups.map((g) => ({
    ...g,
    rows: g.rows.flatMap((r) => (Array.isArray(r.items)
      ? [{ ...r, icon: opened.has(r.id) ? 'arrow-down' : 'arrow-right', fold: true }, ...(opened.has(r.id) ? r.items.map((c) => ({ ...c, id: `${r.id}/${c.id}`, of: r.id })) : [])]
      : [r])),
  }))
  const rows = shown.flatMap((g) => g.rows)

  useEffect(() => {
    if (!open) return
    const back = document.activeElement
    ;(field ? input.current : panel.current)?.focus({ preventScroll: true })
    setOpened(new Set(folds.filter((r) => r.open).map((r) => r.id)))
    return () => back?.focus?.({ preventScroll: true })
  }, [open]) // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { list.current?.querySelector(`[data-search-row="${active}"]`)?.scrollIntoView({ block: 'nearest' }) }, [active])

  const step = (dir) => {
    for (let i = active + dir; i >= 0 && i < rows.length; i += dir) if (!rows[i].disabled) return i
    return active
  }
  const at = (id) => rows.findIndex((r) => r.id === id)
  const pick = (r) => {
    if (!r || r.disabled) return
    if (r.fold) return toggle(r.id)
    if (!field) { if (r.of) { toggle(r.of, false); onActive?.(at(r.of)) } return }
    onSelect?.(r)
  }
  const key = (e) => {
    if (e.key === 'Escape') return
    if (field || /^(Arrow|Enter$|Tab$)/.test(e.key)) e.stopPropagation()
    const r = rows[active]
    if (!query && (e.key === 'ArrowRight' || e.key === 'ArrowLeft') && r && (r.fold || r.of)) {
      e.preventDefault()
      if (e.key === 'ArrowRight' && r.fold) toggle(r.id, true)
      if (e.key === 'ArrowLeft') { toggle(r.fold ? r.id : r.of, false); if (!r.fold) onActive?.(at(r.of)) }
    }
    if (e.key === 'ArrowDown') { e.preventDefault(); onActive?.(step(1)) }
    if (e.key === 'ArrowUp') { e.preventDefault(); onActive?.(step(-1)) }
    if (e.key === 'Enter') {
      e.preventDefault()
      if ((e.metaKey || e.ctrlKey) && folds.length && !query) toggleAll()
      else pick(r)
    }
    if (e.key === 'Tab') {
      e.preventDefault()
      const now = tabs.findIndex((t) => t.value === tab)
      if (field && tabs.length) onTab?.(tabs[(now + (e.shiftKey ? -1 : 1) + tabs.length) % tabs.length].value)
    }
  }
  const enter = rows[active]?.fold ? (opened.has(rows[active].id) ? 'Collapse' : 'Expand') : field ? 'Run' : 'Collapse'

  let n = -1
  return (
    <PopoverLayer open={open} onClose={onClose} placement="center" kind="modal">
      <section
        ref={panel}
        role="dialog"
        aria-modal="true"
        aria-label={ariaLabel ?? (field ? 'Search' : 'Shortcuts')}
        data-kolbox-search=""
        tabIndex={field ? undefined : -1}
        onKeyDown={field ? undefined : key}
        className="kol-command--kolbox kol-kolbox-surface mt-[20vh] flex max-w-[calc(100vw-var(--kol-spacing-8))] flex-col self-start overflow-hidden outline-none"
      >
        {field && (
          <div className="flex flex-col gap-2 p-2">
            <Input variant="kolbox"
              ref={input}
              size="lg"
              iconLeft="search"
              placeholder={placeholder}
              aria-label="Search"
              role="combobox"
              aria-expanded={rows.length > 0}
              aria-controls={listId}
              aria-activedescendant={active >= 0 && rows[active] ? `${listId}-${active}` : undefined}
              value={query}
              onChange={(e) => onQueryChange?.(e.target.value)}
              onKeyDown={key}
              slotRight={!query && mark && <KbdKeys variant="kolbox" size="sm" keys={mark} />} />
            {tabs.length > 0 && <TabsRow variant="kolbox" tabs={tabs} value={tab} onChange={onTab} className="h-10! w-full [&>button]:flex-1 [&>button]:px-4" />}
          </div>
        )}
        {(rows.length > 0 || field) && (
          <>
            {rows.length === 0 && (
              <div className="flex h-80 flex-col items-center justify-center gap-2 px-8 text-center" data-search-empty="">
                <span className="kol-command-group">{query ? `Nothing found for “${query}”` : 'Nothing to show'}</span>
                {empty && <span className="kol-command-group">{empty}</span>}
              </div>
            )}
            {rows.length > 0 && <div ref={list} id={listId} role="listbox" className={`flex h-80 flex-col gap-0.5 overflow-y-auto px-2 ${field ? '' : 'pt-2'}`}>
              {shown.map((g, gi) => (
                <Fragment key={gi}>
                  {g.title && g.rows.length > 0 && <div className="kol-command-group shrink-0 px-3 pt-3 pb-2 tracking-wider uppercase">{g.title}</div>}
                  {g.rows.map((r) => {
                    const i = ++n
                    const hint = (r.disabled && r.disabledHint) || r.hint
                    return (
                      <TreeRow
                        key={r.id}
                        variant="kolbox"
                        size="lg"
                        id={`${listId}-${i}`}
                        role="option"
                        aria-selected={i === active}
                        aria-expanded={r.fold ? opened.has(r.id) : undefined}
                        tabIndex={-1}
                        data-search-row={i}
                        data-fold={r.fold ? '' : undefined}
                        icon={r.of ? undefined : r.icon}
                        label={r.body
                          /* `body`, an optional second line (Folio's word): the row grows to hold it; a row without one is as before */
                          ? <span className="flex min-w-0 flex-col"><span className="truncate"><MatchKolbox label={r.label} query={query} /></span><span className="kol-command-body truncate">{r.body}</span></span>
                          : <MatchKolbox label={r.label} query={query} />}
                        className={r.body ? 'h-auto! min-h-10 py-1.5' : undefined}
                        active={i === active}
                        disabled={r.disabled}
                        onMouseDown={(e) => e.preventDefault()}
                        onMouseEnter={() => !r.disabled && onActive?.(i)}
                        onClick={() => pick(r)}
                        trailing={hint && (r.kbd && hint === r.hint ? <KbdKeys variant="kolbox" keys={hint} size="md" className="pl-3" /> : <span className="kol-command-hint max-w-1/2 shrink-0 truncate pl-3">{hint}</span>)}
                        {...(r.of ? { style: INDENT_KOLBOX } : {})}
                      />
                    )
                  })}
                </Fragment>
              ))}
            </div>}
            <div role="separator" className="kol-command-rule mt-2 h-px shrink-0" />
            <footer className="kol-command-foot flex h-10 shrink-0 items-center gap-4 px-4">
              {rows.length > 1 && <KeyKolbox k="↑↓">Navigate</KeyKolbox>}
              {rows.length > 0 && <KeyKolbox k="↵">{enter}</KeyKolbox>}
              <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={onClose} className="outline-none">
                <KeyKolbox k="Esc">Close</KeyKolbox>
              </button>
              {folds.length > 0 && !query && (
                <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={toggleAll} className="ml-auto outline-none" data-fold-all>
                  <KeyKolbox k="⌘↵">{allOpen ? 'Collapse all' : 'Expand all'}</KeyKolbox>
                </button>
              )}
            </footer>
          </>
        )}
      </section>
    </PopoverLayer>
  )
}

/* ── folio (Folio migration batch B, 2026-11-22) ──────────────────────────────────────────────────────────────────────────
 * Folio's two search windows carried class for class, the chrome in kol-theme `.kol-command--folio`, on `ModalShell
 * variant="folio"`, 12% down, drawn in place (never portalled, so they keep the frame's `data-folio-*`); a press outside
 * closes. Presentational, as kolbox's: the host keeps the query, the rows and the lit row.
 *   mode 'search'    the search modal (Folio's SearchOverlay): 720 wide on the Folio dim, the field (the lens, `esc`),
 *                    then each row: `label` (a node, the matches marked by the host) with `group` at the right, `hint`
 *                    under it, `body` (Folio's word: a line of the text) under that
 *   mode 'commands'  the command list (Folio's CommandPalette, ⇧⌘P): 640 wide, no dim, the field, then rows of `label`
 *                    with `hint` (the keys) at the right
 * CommandOverlay's words: `open`, `onClose`, `query`, `onQueryChange`, `placeholder`, `results` `[{ id, label, group,
 * hint, body }]`, `onSelect(row)` (also on Enter with no row in `commands`, so Enter there always closes), `aria-label`.
 * kolbox's: `active`, `onActive`, `empty` (said under the field when it is set). Keys in the field: ↑↓ move the lit
 * row, Enter picks, Escape closes. */
function CommandOverlayFolio({ open, onClose, mode = 'search', query = '', onQueryChange, placeholder, results = [], active = 0, onActive, onSelect, empty, 'aria-label': label }) {
  const commands = mode === 'commands'
  const input = useRef(null)
  useEffect(() => { if (open && !commands) setTimeout(() => input.current?.focus(), 0) }, [open]) // eslint-disable-line react-hooks/exhaustive-deps
  if (!open) return null
  const onKey = (e) => {
    if (e.key === 'Escape') onClose?.()
    if (e.key === 'ArrowDown') { e.preventDefault(); onActive?.(Math.min(active + 1, results.length - 1)) }
    if (e.key === 'ArrowUp') { e.preventDefault(); onActive?.(Math.max(active - 1, 0)) }
    if (e.key === 'Enter') {
      if (commands) { e.preventDefault(); onSelect?.(results[active]) }
      else if (results[active]) onSelect?.(results[active])
    }
  }
  if (commands) {
    return (
      <div className="fixed inset-0 z-50 flex items-start justify-center px-[16px] pt-[12vh]" onMouseDown={onClose}>
        <ModalShell variant="folio" role="dialog" aria-label={label} onMouseDown={(e) => e.stopPropagation()} className="kol-command--folio kol-command--folio-commands max-h-[60vh] w-[640px] max-w-full overflow-hidden">
          <input autoFocus aria-label="Command" placeholder={placeholder} value={query} onChange={(e) => onQueryChange?.(e.target.value)} onKeyDown={onKey}
            className="kol-command-field--folio h-[48px] shrink-0 border-b bg-transparent px-[16px] outline-none" />
          <div role="listbox" aria-label={label} className="min-h-0 overflow-y-auto py-[6px]">
            {results.map((r, i) => (
              <button key={r.id ?? r.label} type="button" role="option" aria-selected={i === active} onMouseEnter={() => onActive?.(i)} onClick={() => onSelect?.(r)} className={`kol-command-row--folio${i === active ? ' is-active' : ''} flex h-[32px] w-full items-center px-[16px] text-left`}>
                {r.label}<span className="kol-command-hint--folio ml-auto">{r.hint ?? ''}</span>
              </button>
            ))}
            {empty && <p className="kol-folio-meta kol-command-empty--folio px-[16px] py-[8px]">{empty}</p>}
          </div>
        </ModalShell>
      </div>
    )
  }
  return (
    <div className="kol-modal-dim--folio fixed inset-0 z-50 flex items-start justify-center px-[16px] pt-[12vh]" onMouseDown={onClose}>
      <ModalShell variant="folio" role="dialog" aria-label={label} className="kol-command--folio kol-command--folio-search max-h-[70vh] w-full max-w-[720px] overflow-hidden" onMouseDown={(e) => e.stopPropagation()}>
        <label className="kol-command-head--folio flex h-[56px] shrink-0 items-center gap-[12px] border-b px-[18px]">
          <IconLoader name="search" size={18} />
          <input ref={input} value={query} onChange={(e) => onQueryChange?.(e.target.value)} onKeyDown={onKey} placeholder={placeholder} className="kol-command-search--folio min-w-0 flex-1 bg-transparent outline-none" />
          <span className="kol-folio-meta kol-command-hint--folio">esc</span>
        </label>
        <div className="overflow-y-auto">
          {empty && <p className="kol-folio-body kol-command-empty--folio px-[18px] py-[20px]">{empty}</p>}
          {results.map((r, i) => (
            <button key={r.id} type="button" onMouseEnter={() => onActive?.(i)} onClick={() => onSelect?.(r)} className={`kol-command-result--folio${i === active ? ' is-active' : ''} flex w-full flex-col gap-[6px] border-b px-[18px] py-[14px] text-left`}>
              <span className="flex items-baseline justify-between gap-[16px]">
                <span className="kol-folio-shelf">{r.label}</span>
                <span className="kol-folio-label kol-command-hint--folio shrink-0">{r.group}</span>
              </span>
              {r.hint && <span className="kol-folio-meta kol-command-hint--folio">{r.hint}</span>}
              {r.body && <span className="kol-folio-body kol-command-hint--folio">{r.body}</span>}
            </button>
          ))}
        </div>
      </ModalShell>
    </div>
  )
}

/* ── kolbox, from `results` (Folio on kolbox, 2026-11-22) ──
 * The folio branch's words under the kolbox look, so a host switches by the variant alone: `results` `[{ id, label, group,
 * hint, body }]` become kolbox's groups (each `group` a titled group, in the order they first come; `hint` at the row's
 * right, as key caps when it is one combo); `body`, when a row has one, is a second line under its label. `mode`
 * 'commands' is the same panel with no group titles: the command list. The row handed to `onSelect` is the host's own. */
export const isKeyCombo = (s) => typeof s === 'string' && /^[⌘⇧⌥⌃]*[^\s⌘⇧⌥⌃]+$/.test(s)
function CommandOverlayKolboxResults({ results, mode, ...props }) {
  const groups = []
  results.forEach((r, i) => {
    const title = mode === 'commands' ? undefined : r.group
    let g = groups.find((x) => x.title === title)
    if (!g) groups.push((g = { title, rows: [] }))
    g.rows.push({ ...r, id: r.id ?? `${i}:${typeof r.label === 'string' ? r.label : ''}`, hint: r.hint || undefined, kbd: isKeyCombo(r.hint) })
  })
  /* the field's ⌘K mark is the search modal's own key; the command list does not open on it */
  return <CommandOverlayKolbox {...props} mode="search" groups={groups} mark={mode === 'commands' ? null : undefined} />
}

export default function CommandOverlay(props) {
  if (props.variant === 'folio') return <CommandOverlayFolio {...props} />
  if (props.variant === 'kolbox') return props.results ? <CommandOverlayKolboxResults {...props} /> : <CommandOverlayKolbox {...props} />
  return <CommandOverlayDefault {...props} />
}
