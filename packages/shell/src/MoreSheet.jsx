import { createContext, useContext, useEffect, useRef, useState } from 'react'
import { Button, ModalHeader, usePopover, PopoverPanel } from '@kolkrabbi/kol-component'
import { Icon } from '@kolkrabbi/kol-icons'

/* the open level a row sits in (FloatMenu); null outside one, where a row's `sub` is ignored as before */
const Level = (globalThis[Symbol.for('@kolkrabbi/kol-shell/FloatMenuLevel')] ??= createContext(null))
const FLOAT_ROW = 'w-full justify-start kol-btn-float'

/* taxonomy-ok: molecule — a column of nav Buttons */

/**
 * MoreRows — The sheet's rows, wherever the sheet opens. the one list of 44px nav rows (mono-16, 22px glyphs,
 * the pill's rounding on each) that the phone bar's More sheet and Home's masthead button both draw
 * (user 2026-10-23: *"we could even make similar dropdown as we use in phone nav"*). The sheet's chrome is
 * `.kol-more-sheet` — the pill's ground and hairline, a 24px rounding, 8px pad — on whatever box holds the rows.
 *
 * @param {Array}    actions  `[{ label, icon?, avatar?, onPress, checked? }]` — the page's own buttons, first. `avatar` (a picture
 *                            url — the account row) draws in the glyph's place. A row with `checked`
 *                            (a pick list — TransportPill's loop lengths) draws the 22px check, or keeps its space when false
 * @param {Array}    items    `[{ path, label, icon? }]` — destinations, after a divider's worth of nothing
 * @param {string}   active   the item path that is current
 * @param {Function} onPick   `(item | action) => void` — after the row's own press; the sheet closes here
 * @param {'float'} variant  the floating style (round 3, W16 2026-10-31): each row a `kol-btn-float` pill — 40 (48 on touch)
 *                            tall, 12 in, an 18 (20) glyph, the current row oq-16 — in a `.kol-more-sheet-float`; AppFloatNav
 *                            and the signed-out Home pass it. Unset, the rows are A
 * @param {boolean}  itemsFirst  the destinations above the actions (PhoneNav's More, 2026-10-28: the whole nav, then the
 *                            page's buttons); Home's masthead button keeps actions first
 */
export default function MoreRows({ actions = [], items = [], active, onPick, itemsFirst = false, variant }) {
  /* the float row's height, inset and gap are the theme's (`.kol-more-sheet-float`, round 3) — no h-11 / gap-3 utility,
   * which would outrank the components layer */
  const float = variant === 'float'
  const rowCls = float ? FLOAT_ROW : 'w-full justify-start h-11 gap-3'
  const level = useContext(Level)
  const glyph = float ? 'var(--kol-float-ic)' : 22
  const acts = (
    <>
      {actions.map((a) => {
        /* a row with `sub` inside a FloatMenu opens its level instead of picking — the chevron at the row's end */
        const nests = level && a.sub?.length > 0
        /* the account row is the ModalHeader (menu-system W4.1) — avatar · title, pressable */
        if (a.avatar && !nests) return <ModalHeader key={a.label} variant={float ? 'float' : 'default'} avatar={a.avatar} title={a.label} onClick={() => { onPick?.(a); a.onPress?.() }} />
        return (
          /* a nesting row draws its own glyph so the label can take the room between it and the chevron; 8 apart, as Button's */
          <Button key={a.label} variant="nav" size="lg" iconLeft={a.checked === undefined && !nests ? a.icon : undefined} iconSize={glyph}
            className={rowCls} style={nests ? { gap: 8 } : undefined}
            aria-haspopup={nests ? 'menu' : undefined} aria-expanded={nests ? level.isOpen(a) : undefined}
            onClick={(e) => { if (nests) { level.open(a, e.currentTarget); return } onPick?.(a); a.onPress?.() }}>
            {a.checked !== undefined && (
              <span className="inline-flex items-center justify-center shrink-0" style={{ width: float ? 'var(--kol-float-ic)' : 22, height: float ? 'var(--kol-float-ic)' : 22 }}>{a.checked && <Icon name="check" size={22} />}</span>
            )}
            {nests ? <>{a.icon && <Icon name={a.icon} size={glyph} />}<span className="flex-1 text-left">{a.label}</span><Icon name="chevron-right" size={glyph} className="shrink-0 text-oq-48" /></> : a.label}
          </Button>
        )
      })}
    </>
  )
  const dests = (
    <>
      {items.map((i) => (
        <Button
          key={i.path ?? i.id ?? i.label}
          variant="nav"
          size="lg"
          iconLeft={i.icon}
          iconSize={glyph}
          aria-current={i.path != null && i.path === active ? 'page' : undefined}
          className={rowCls}
          onClick={() => onPick?.(i)}
        >
          {i.label}
        </Button>
      ))}
    </>
  )
  return itemsFirst ? <>{dests}{acts}</> : <>{acts}{dests}</>
}

const rowKey = (r) => r.id ?? r.path ?? r.label

/**
 * FloatMenu — A float's card with NESTED LEVELS (FloatsOwnItems, kol-fxr 2026-10-31 — *"does the float nav offer nested
 * menus"*). Wraps the card's first level (`children`, MoreRows); a MoreRows action with `sub` opens the next level, the same
 * row shape to any depth (`sub[].sub[].sub…`). How a level opens is one rule, by room:
 * - `beside` (the desk's `dock`) — a card of the same chrome beside its parent row, right of it, the bottom edges on one
 *   line, through the existing popover (`usePopover` + `PopoverPanel`, flips and shifts at the window's edge);
 * - else (every phone variant) — the level REPLACES the card's rows, under a Back row naming the parent.
 * A leaf runs its `onPress`, then `onLeaf(row)` closes every level (the caller closes the card — Escape and an outside press
 * are the card's, and closing it closes everything). Keys: ↑ ↓ move, → or Enter opens a level, ← goes back one.
 *
 * @param {boolean}  beside     levels open beside their row (else they replace the card's rows)
 * @param {string}   cardClass  a beside level's chrome — the first card's classes
 * @param {Function} onLeaf     `(row) => void` — a nested leaf was picked (its `onPress` has run); close everything here
 */
export function FloatMenu({ beside = false, cardClass = '', onLeaf, children }) {
  /* the open rows, outermost first — `{ row, el }`, `el` the row a beside level hangs off.
   * ponytail: the row object is kept as opened; a consumer that rebuilds its rows mid-open sees the old `sub` until reopened */
  const [trail, setTrail] = useState([])
  const at = (depth) => ({
    open: (row, el) => setTrail((t) => (t[depth] && rowKey(t[depth].row) === rowKey(row) ? t.slice(0, depth) : [...t.slice(0, depth), { row, el }])),
    isOpen: (row) => !!trail[depth] && rowKey(trail[depth].row) === rowKey(row),
  })
  const back = (depth) => { const parent = trail[depth - 1]?.el; setTrail((t) => t.slice(0, depth - 1)); if (beside) parent?.focus({ preventScroll: true }) }
  const keys = (depth) => (e) => {
    const rows = [...e.currentTarget.querySelectorAll('button')]
    const i = rows.indexOf(document.activeElement)
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') rows[(i + (e.key === 'ArrowDown' ? 1 : -1) + rows.length) % rows.length]?.focus()
    else if (e.key === 'ArrowRight' && e.target.getAttribute?.('aria-haspopup')) { if (e.target.getAttribute('aria-expanded') !== 'true') e.target.click() }
    else if (e.key === 'ArrowLeft' && depth > 0) back(depth)
    else return
    e.preventDefault()
    e.stopPropagation()
  }
  const level = (depth, rows, lead) => (
    <Level.Provider value={at(depth)}>
      <LevelRows key={`${depth}:${rowKey(trail[depth - 1].row)}`} onKeyDown={keys(depth)}>
        {lead}
        <MoreRows variant="float" actions={rows} onPick={onLeaf} />
      </LevelRows>
    </Level.Provider>
  )

  if (!beside && trail.length) {
    const d = trail.length
    return level(d, trail[d - 1].row.sub, (
      <Button variant="nav" size="lg" iconLeft="chevron-left" iconSize="var(--kol-float-ic)" className={FLOAT_ROW} onClick={() => back(d)}>{trail[d - 1].row.label}</Button>
    ))
  }
  return (
    <Level.Provider value={at(0)}>
      <div className="contents" onKeyDown={keys(0)}>{children}</div>
      {beside && trail.map((s, i) => (
        <Beside key={i} anchor={s.el} cardClass={cardClass}>{level(i + 1, s.row.sub)}</Beside>
      ))}
    </Level.Provider>
  )
}

/* a nested level's rows — its first row takes the focus when it opens, so the keys carry on in it */
function LevelRows({ onKeyDown, children }) {
  const ref = useRef(null)
  useEffect(() => { ref.current?.querySelector('button')?.focus({ preventScroll: true }) }, [])
  return <div ref={ref} className="contents" onKeyDown={onKeyDown}>{children}</div>
}

/* a level beside its row — the + menu's popover: right of the row, 12 off the card (the row sits 6 in), the bottom edges on
 * one line. `kol-float-level` marks it so a parent popover's outside press lets it be */
function Beside({ anchor, cardClass, children }) {
  const pop = usePopover({ open: true, placement: 'right-end', offset: { mainAxis: 18, crossAxis: 6 }, click: false, dismiss: false, role: 'menu', referenceElement: anchor })
  return <PopoverPanel popover={pop} panel={false} focus={false} className={`kol-float-level ${cardClass}`} style={{ minWidth: 220, maxWidth: 'calc(100vw - 24px)' }}>{children}</PopoverPanel>
}
