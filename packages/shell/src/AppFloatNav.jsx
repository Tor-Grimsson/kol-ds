import { useCallback, useEffect, useRef, useState } from 'react'
import { Button, TabsRow, Tooltip, TABBAR_H, TABBAR_PILL_H, TABBAR_PILL_INSET, tabbarPillWidth, tabbarPillSlot, floatSurfaceClass, usePopover, PopoverPanel, useMediaQuery } from '@kolkrabbi/kol-component'
import { hasIcon, IconLoader } from '@kolkrabbi/kol-icons'
import { MenuFloatRows, MenuFloat } from '@kolkrabbi/kol-component'
import Timecode from './Timecode.jsx'
import ToolRail, { ToolRailSlot } from './ToolRail.jsx'
import { Input, Menu } from '@kolkrabbi/kol-component'

/* taxonomy-ok: molecule — TabsRow's pill + MenuFloatRows sheets of Buttons */

/**
 * AppFloatNav — The floating nav, one family. (AppFloatNav, kol-fxr 2026-10-30 — the user's name, canvas Round 3's board:
 * *"AppFloatNav"*.) What shipped as `PhoneNav` (the phone's pill and bar, the desk's `dock`, frame E's `panel`) and
 * `TransportPill` (Labs' transport) is one component now; both names stay as deprecated aliases on the retirement ledger
 * (PhoneNav's `nav` is `mobile` here, TransportPill is `variant="transport"`). The
 * board's variants: the app's rail rows in rail order, then ··· which opens the whole nav and turns into ×, on a desk
 * (`dock`) and a phone; a row with `sub` opens its rows above it; Labs' top pill (`panel`) and its transport
 * (`transport`); each slot named on hover by the KOL Tooltip (TabsRow's pill).
 *
 * Was PhoneNav — The rail as a phone tab bar. the rail, on a phone, as a bottom bar (AppShell `touch="bar"`, apps review
 * 2026-09-29). The user: *"what about when there are like 10 pages? … this seems like something
 * shell or hub should account for and ship, but not have per app fixes."*
 *
 * Up to FIVE destinations sit in the bar. More than five → the first FOUR, then **More**, a sheet
 * holding the rest (Settings included). Ten pages = four + More. The bar is kol-component's
 * `MobileTabBar` — the pill media already floated — not a second bar.
 *
 * Active = the rail's rule: `/` exact, anything else by prefix, the longest match wins. A
 * destination inside More lights More.
 *
 * @param {Array}    items        `{ icon, path, label }` in rail order, bottom rows last
 * @param {string}   currentPath
 * @param {Function} onNavigate   `(path) => void`
 * @param {Array}    actions      `[{ label, icon?, onPress }]` — the page's own buttons, at the top of More (Home's New and
 *                                Walkthrough on a phone, user 2026-10-23); with any, More shows even with five or fewer rows
 * @param {'bar'|'pill'} shape    TabsRow's phone shape (AppShell `touch="pill"`); the More sheet floats above either
 *
 * THE PANEL PICKER (PhoneNavTopAndFold, kol-fxr 2026-10-27, frame E — the nav on top, the open panel at the bottom). The
 * pill only; a `bar` ignores these:
 * @param {'bottom'|'top'} placement  the pill's edge; at `top` the More sheet opens below it
 * @param {boolean} border      the pill's hairline (default true; frame E has none)
 * @param {'fill'|'circle'} active  the lit slot's shape (TabsRow `active`); frame E is `circle`
 * @param {boolean} foldable    a sideways swipe folds the pill into a left edge tab; a tap on the tab restores it
 * @param {boolean} folded · {Function} onFoldChange  the folded state, so the app can keep it (else PhoneNav holds it)
 * @param {'left'|'right'|'swipe'} foldSide · {'ground'|'handle'} foldTone  TabsRow's, forwarded (FloatFoldBothSidesGrey, kol-fxr
 *                              2026-11-03): `swipe` folds to the edge the swipe went toward, `handle` is the grey edge tab.
 *                              Unset: the nav's left edge (the transport's right) and the pill's ground, as before
 * @param {boolean} moreKeepsOpen  More opens its sheet without collapsing the pill to the ×, and More lights only while
 *                              its sheet is open; nothing else closes
 * An item may carry `onPress` (a panel, not a route — the app owns what it opens and whether a second tap closes it) and
 * `selected` (lit whatever the route says; more than one may be).
 *
 * VARIANTS (PhoneNavVariants, kol-fxr 2026-10-28 — user: *"So we should ship variants? or presets? because if we only ship
 * props then each repo has to tune to the same settiings and we get drift"*). A variant is a preset of the pill props above;
 * any prop still overrides it. `PHONE_NAV_VARIANTS` is the table, and TransportPill reads its own row from it.
 * @param {'mobile'|'dock'|'panel'|'transport'} variant  `mobile` (was `nav`) — an app's phone nav: no hairline, no shadow, the lit slot a circle
 *                              (AppShell's default). `panel` — frame E's panel picker: on top, foldable, More keeps the panel
 *                              open, no hairline, the shadow (it floats over the stage and the Rail — FloatsRailOverlaysShadow). `transport` — TransportPill's look: the shadow, it floats over content.
 *                              Unset, the props alone decide, as before
 * @param {boolean} shadow      the pill's drop shadow (TabsRow `shadow`) — for a pill that floats over content
 *
 * MORE IS THE WHOLE NAV (PhoneMoreWholeNav, kol-fxr 2026-10-28 — user: *"when you press [...] you should get the entire Nav
 * menu list … but also ship with prop so you can customise"*). The sheet lists every row the rail has, the ones in the pill
 * included and the pinned foot last, then the page's actions. Before, it held only what did not fit.
 * @param {string[]|Function} moreItems  which rows More lists — an allow-list of paths, or `(item) => boolean`. Unset: all
 * @param {Array}    sheetItems  the More rows themselves, when they are not the pill's (HubHomeSignedOut, 2026-10-28: the pill holds
 *                              the app's chromes and More holds the rail). Rows flagged `foot` (the pinned Media · Sign in · Settings)
 *                              sit AFTER the page's actions, the rest before — frame A2's order
 *
 * `dock` (PhoneNavDock, kol-fxr 2026-10-28, frame B2): the pill on a DESK — md and up, at the content's bottom-left (TabsRow
 * `dock`). An app shows it beside the rail, not instead of it. With `sheetItems` or `actions` it has a More (the Round 3
 * board, 2026-10-30: the signed-out desk has no rail, so ··· is the whole nav). ROUND 4 (HomeDockRound4, kol-fxr 2026-10-31 —
 * user: *"I dont love this being disconnected"*): ··· is the pill's last slot, not its own circle, and opens a card BESIDE
 * it the way HubHome's + opens its menu — the same `usePopover` + `PopoverPanel` card, right of the pill, bottom edges on
 * one line, ··· lit while open (no × swap, no "Close"). Every dock slot lights on hover as a menu row does: the nav row's
 * `--kol-oq-04` ground and `--kol-surface-on-primary` ink (`.kol-btn-nav`'s hover tokens).
 *
 * THE FLOAT (AppFloatNav, 2026-10-30):
 * @param {Array}   items[].sub   `[{ label, icon?, onPress?, path?, sub? }]` — a row that opens its own rows above its slot instead of
 *                              routing (fxr: Randomiser → Generate, Effects); lit while they are open. A row without
 *                              `onPress` routes to its `path`
 * NESTED LEVELS (FloatsOwnItems, kol-fxr 2026-10-31): a sub row with its own `sub` opens a level, the same row shape to any
 * depth — `sub`, the More's `actions` and the transport's `sheetFor` rows alike (MenuFloat). On the `dock` a
 * level opens BESIDE its row (the + menu's popover); on every phone variant it REPLACES the card's rows under a Back row. A
 * leaf runs and closes every level; Escape and an outside press close all; ↑ ↓ move, → / Enter open a level, ← goes back one.
 * Its menus are the floating style B (`variant="float"` on the rows, `.kol-more-sheet-float`) — the board's.
 * @param {boolean} menuBorder  the sheets' 1px hairline (`.kol-more-sheet-bordered`) — off by default, the board's menus have none
 * THE FOUR VARIANTS (user ruling 2026-10-30): `mobile` · `dock` · `panel` · `transport` — nothing else.
 *
 * ROUND 3 (W16, accepted 2026-10-31 — *"accept the style, both glass styles"*): the pill is fxr's live nav, 66 tall, 56 buttons
 * 4 apart, 28 glyphs, the same on mouse and touch; ··· stands apart as its own 66 circle, 8 off the bar; the menus are r 26
 * (30 on touch), 6 in, pill rows 40 (48).
 * @param {'solid'|'glass-dark'|'glass-light'} surface  what the pill, its circle and its menus are made of (default `solid`).
 *                              A glass is kol-theme's `.kol-float-glass-*` — no hairline, its own shadow; glass-dark puts
 *                              dark-theme ink on what sits on it in either theme. Every variant takes it
 * @param {boolean} labels      the tab bar with labels: items 58 tall, 84 wide, a 24 glyph over an 11 label (pill only)
 * @param {'transport'} variant  `transport` — Labs' transport, what TransportPill drew: `items` are actions
 *                              `[{ id, icon, label, onPress?, selected? }]`, `sheetFor` `{ [id]: rows }` opens rows above a
 *                              slot, it folds to the RIGHT edge; see `Transport` below
 */
export const APP_FLOAT_NAV_VARIANTS = {
  /* `mobile` was PhoneNav's `nav` (user ruling 2026-10-30: renamed so it is not reached for off mobile); there is no `nav` */
  mobile: { border: false, shadow: false, active: 'circle' },
  panel: { placement: 'top', foldable: true, moreKeepsOpen: true, border: false, shadow: true, active: 'circle' },
  transport: { border: false, shadow: true, active: 'circle' },
  dock: { dock: true, border: false, shadow: false, active: 'circle' },
}

const MORE = '__more'
const MAX = 5

const activePath = (items, path) => items
  .filter((i) => (i.path === '/' ? path === '/' : path === i.path || path.startsWith(`${i.path}/`)))
  .sort((a, b) => b.path.length - a.path.length)[0]?.path

export default function AppFloatNav(props) {
  if (props.variant === 'folio') return <TransportFolio {...props} />
  if (props.variant === 'kolbox') return props.transport ? <TransportKolbox {...props} /> : <PhoneNavKolbox {...props} />
  return props.variant === 'transport' ? <Transport {...props} /> : <FloatNav {...props} />
}

function FloatNav({ items = [], currentPath = '/', onNavigate, actions = [], shape = 'bar', variant, placement: placementProp, border: borderProp, shadow: shadowProp, active: activeProp, foldable: foldableProp, folded, onFoldChange, moreKeepsOpen: keepsOpenProp, moreItems, sheetItems, dock: dockProp, menuBorder = false, surface = 'solid', labels = false, foldSide = 'left', foldTone }) {
  const preset = APP_FLOAT_NAV_VARIANTS[variant] ?? {}
  const placement = placementProp ?? preset.placement ?? 'bottom'
  const border = borderProp ?? preset.border ?? true
  const shadow = shadowProp ?? preset.shadow ?? false
  const activeShape = activeProp ?? preset.active
  const foldable = foldableProp ?? preset.foldable ?? false
  const dock = dockProp ?? preset.dock ?? false
  /* the dock keeps its pill whole (the board); its ··· opens a card beside it (round 4) */
  const moreKeepsOpen = keepsOpenProp ?? preset.moreKeepsOpen ?? dock
  const [open, setOpen] = useState(false)
  /* the dock's ··· card is the +'s (HubHome HomeMenu): a popover anchored to the ··· slot, which TabsRow draws */
  const [moreEl, setMoreEl] = useState(null)
  const findMore = useCallback((n) => setMoreEl(n?.querySelector('button[aria-label="More"]') ?? null), [])
  /* offset: 12 off the pill — the slot sits 4 inside it; crossAxis drops the card's bottom to the pill's */
  /* an outside press closes it — except one on a nested level, which hangs beside it in its own portal (MenuFloat) */
  const morePop = usePopover({ open: dock && open, onOpenChange: setOpen, placement: 'right-end', offset: { mainAxis: 16, crossAxis: 4 }, click: false, referenceElement: moreEl, dismiss: { outsidePress: (e) => !e.target?.closest?.('.kol-float-level') } })
  /* the row whose `sub` rows are open */
  const [sub, setSub] = useState(null)
  useEffect(() => { setOpen(false); setSub(null) }, [currentPath])
  useEffect(() => {
    if (!open && !sub) return undefined
    const onKey = (e) => { if (e.key === 'Escape') { setOpen(false); setSub(null) } }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, sub])

  const overflow = items.length > MAX || (actions.length > 0 && items.length >= MAX)
  const hasMore = (dock ? false : overflow) || actions.length > 0 || (sheetItems?.length ?? 0) > 0
  const inBar = overflow ? items.slice(0, MAX - 1) : items
  const inMore = overflow ? items.slice(MAX - 1) : []
  /* the sheet's rows: the whole nav, filtered by `moreItems` */
  const allow = typeof moreItems === 'function' ? moreItems : Array.isArray(moreItems) ? (i) => moreItems.includes(i.path) : () => true
  const moreRows = (sheetItems ?? items).filter(allow)
  const before = moreRows.filter((i) => !i.foot)
  const after = moreRows.filter((i) => i.foot)
  const active = activePath(items, currentPath)
  const value = open || inMore.some((i) => i.path != null && i.path === active) ? MORE : active

  const key = (i) => i.path ?? i.id ?? i.label
  const tabs = inBar.map((i) => ({ value: key(i), label: i.label, icon: i.icon, selected: sub === key(i) || (i.selected ?? (moreKeepsOpen ? key(i) === active : undefined)) }))
  /* with the pill kept whole, the More slot itself turns to × while its sheet is open, and a press closes it
   * (PhonePillMoreTurnsToClose, kol-fxr 2026-10-28 — frame A2: *"[...] that makes a list and nav turns to (X)"*) */
  const turnsToX = open && moreKeepsOpen && !dock
  if (hasMore) tabs.push({ value: MORE, label: turnsToX ? 'Close' : 'More', icon: turnsToX ? 'x' : 'more', selected: moreKeepsOpen ? open : undefined })
  /* THE SHEET HUGS ITS WORDS AND SITS BESIDE THE × (user 2026-10-23, his reference: iOS Photos' menu next to its ×, *"but
   * align to bottom"*) — to the left of the collapsed ×, a 12px gap, the two bottom edges on one line */
  const pill = shape === 'pill'
  const top = pill && placement === 'top'
  /* ··· is its own circle on a pill (round 3) — but inside the dock's pill (round 4) */
  const split = pill && hasMore && !dock
  const geo = { count: tabs.length, labels, split }
  /* a sheet over one slot — a row's `sub`, the dock's More: the pill's left edge (the dock's 64 in, else centred), then the
   * slot's centre (`tabbarPillSlot`); the sheet stands 12 off the pill's face */
  const W = tabbarPillWidth(tabs.length, geo)
  const pillLeft = dock ? 'calc(var(--kol-shell-rail-width, 48px) + 64px)' : `calc(50% - ${W / 2}px)`
  const face = dock ? `${64 + TABBAR_PILL_H + 12}px` : `calc(env(safe-area-inset-${top ? 'top' : 'bottom'}, 0px) + ${TABBAR_PILL_INSET + TABBAR_PILL_H + 12}px)`
  const overSlot = (at) => (pill ? {
    left: `calc(${pillLeft} + ${tabbarPillSlot(at, geo)}px)`, right: 'auto', transform: 'translateX(-50%)',
    [top ? 'top' : 'bottom']: face, ...(top ? { bottom: 'auto' } : {}), width: 'max-content', minWidth: 220,
  } : {
    /* the bar: over the slot's share of the width, 8 off the bar */
    left: `${((at + 0.5) * 100) / tabs.length}%`, right: 'auto', transform: 'translateX(-50%)',
    bottom: `calc(env(safe-area-inset-bottom, 0px) + ${TABBAR_H + 8}px)`, width: 'max-content', minWidth: 220,
  })
  const sheetStyle = moreKeepsOpen && pill ? {
    /* the pill stays whole, so the sheet hangs off its right end, 12 off its face (frame E: below a top pill) */
    left: 'auto',
    right: `calc(50% - ${W / 2}px)`,
    [top ? 'top' : 'bottom']: face,
    ...(top ? { bottom: 'auto' } : {}),
    width: 'max-content', minWidth: 220, maxWidth: 'calc(100vw - 24px)',
  } : {
    left: 'auto',
    right: pill ? `calc(50% - ${W / 2}px + ${TABBAR_PILL_H + 12}px)` : `calc(${100 / tabs.length}% + 8px)`,
    ...(top
      ? { top: `calc(env(safe-area-inset-top, 0px) + ${TABBAR_PILL_INSET}px)`, bottom: 'auto' }
      : { bottom: pill ? `calc(env(safe-area-inset-bottom, 0px) + ${TABBAR_PILL_INSET}px)` : 'env(safe-area-inset-bottom, 0px)' }),
    width: 'max-content', minWidth: 220, maxWidth: `calc(100vw - ${(pill ? TABBAR_PILL_H : TABBAR_H) + 36}px)`,
  }
  const card = `kol-more-sheet kol-more-sheet-float ${floatSurfaceClass(surface, true)}${menuBorder ? ' kol-more-sheet-bordered' : ''}`
  /* a sub row (any level) picked: close everything; its `onPress` has run, else it routes */
  const pickSub = (x) => { setSub(null); if (!x.onPress && x.path) onNavigate?.(x.path) }
  /* a nested leaf in More: close it; its `onPress` has run, else it routes */
  const pickMoreLeaf = (x) => { setOpen(false); if (!x.onPress && x.path) onNavigate?.(x.path) }
  const press = (v) => {
    if (v === MORE) { setSub(null); setOpen((o) => !o); return }
    const item = inBar.find((i) => key(i) === v)
    if (item?.sub?.length) { setOpen(false); setSub((s) => (s === v ? null : v)); return }
    setSub(null)
    if (item?.onPress) { item.onPress(); return }
    onNavigate?.(v)
  }

  return (
    <>
      {sub && (
        <button type="button" aria-label="Close" className="kol-phone-nav-scrim" onClick={() => setSub(null)} />
      )}
      {sub && (
        <div className={`kol-phone-nav-more ${card}`} role="menu" aria-label={inBar.find((i) => key(i) === sub)?.label} style={overSlot(inBar.findIndex((i) => key(i) === sub))}>
          <MenuFloat beside={dock} cardClass={card} onLeaf={pickSub} title={inBar.find((i) => key(i) === sub)?.label}>
            <MenuFloatRows variant="float" actions={inBar.find((i) => key(i) === sub)?.sub} onPick={pickSub} />
          </MenuFloat>
        </div>
      )}
      {open && !dock && (
        /* a BUTTON scrim — iOS does not bubble a tap from a div (OverlayScrimTapDismiss, 2026-09-01) */
        /* with `moreKeepsOpen` the panel under it stays in view: a clear scrim, a tap off the sheet still closes it */
        <button type="button" aria-label="Close more" className={`kol-phone-nav-scrim${moreKeepsOpen ? '' : ' kol-overlay-scrim'}`} onClick={() => setOpen(false)} />
      )}
      {open && !dock && (
        <div className={`kol-phone-nav-more ${card}`} role="menu" aria-label="More" style={sheetStyle}>
          {/* the nav, the page's actions, then the pinned foot (frame A2) */}
          <MenuFloat cardClass={card} onLeaf={pickMoreLeaf} title="More">
          <MenuFloatRows variant="float" actions={actions} items={before} itemsFirst active={active} onPick={(x) => { setOpen(false); if (x.onPress && !actions.includes(x)) { x.onPress(); return } if (x.path) onNavigate?.(x.path) }} />
          {after.length > 0 && <MenuFloatRows variant="float" items={after} active={active} onPick={(x) => { setOpen(false); if (x.onPress) { x.onPress(); return } if (x.path) onNavigate?.(x.path) }} />}
          </MenuFloat>
        </div>
      )}
      {dock && (
        <PopoverPanel popover={morePop} panel={false} focus={false} className={card} style={{ minWidth: 220, maxWidth: 'calc(100vw - 24px)' }}>
          <MenuFloat beside cardClass={card} onLeaf={pickMoreLeaf} title="More">
          <MenuFloatRows variant="float" actions={actions} items={before} itemsFirst active={active} onPick={(x) => { setOpen(false); if (x.onPress && !actions.includes(x)) { x.onPress(); return } if (x.path) onNavigate?.(x.path) }} />
          {after.length > 0 && <MenuFloatRows variant="float" items={after} active={active} onPick={(x) => { setOpen(false); if (x.onPress) { x.onPress(); return } if (x.path) onNavigate?.(x.path) }} />}
          </MenuFloat>
        </PopoverPanel>
      )}
      {/* `contents` — no box; it only hands the ··· slot to the popover */}
      <div className="contents" ref={dock ? findMore : undefined}>
      <TabsRow
        variant="stacked"
        placement="phone"
        shape={shape}
        collapsed={open && !moreKeepsOpen}
        onExpand={() => setOpen(false)}
        edge={top ? 'top' : 'bottom'}
        border={border}
        shadow={shadow}
        surface={surface}
        split={split}
        labels={labels}
        dock={dock}
        active={activeShape}
        foldable={foldable}
        folded={folded}
        onFoldChange={(v) => { if (v) setOpen(false); onFoldChange?.(v) }}
        foldSide={foldSide}
        foldTone={foldTone}
        tabs={tabs}
        value={value}
        onChange={press}
      />
      </div>
    </>
  )
}

/**
 * Transport (`variant="transport"`, was TransportPill) — The transport, on a phone, as a pill (TransportPill, kol-fxr 2026-10-27, frame E). PhoneNav's pill —
 * the same TabsRow, so the slots, the 28px glyphs and the 44×44 circle are the nav's — holding ACTIONS instead of
 * destinations. It floats over the open Rail and carries the shadow, as the `panel` nav does, and folds to a RIGHT edge tab.
 *
 * A slot fires `onPress`; `selected` lights it (play and pause are a radio pair the consumer owns, so both are just
 * `selected`). A slot named in `sheetFor` opens a sheet of rows anchored above it instead, lit while open; a row runs its
 * `onPress` and closes the sheet.
 *
 * @param {Array}  items         `[{ id, icon, label, onPress?, selected? }]` in pill order
 * @param {Object} sheetFor      `{ [id]: [{ label, icon?, onPress, checked?, sub? }] }` — rows for a slot that opens a sheet;
 *                               `checked` marks the current pick with the 22px check (MenuFloatRows); `sub` opens a level in place
 * @param {'bottom'|'top'} placement  the pill's edge (default bottom)
 * @param {boolean} collapsibleH collapse-h (plan-2026-11-12-one-header W11; was `foldable`, aliased): the pill — a sideways swipe
 *                              folds it into the right edge tab; the inline capsule — it collapses to its LAST item (the
 *                              play/pause, one button in both states) + the timecode + any item that is lit (Loop on); ONE
 *                              regular 12 chevron (`--kol-float-chev-sm`, oq-64) directly left of the play/pause, Figma-style:
 *                              ‹ collapsed, › expanded; the other items open to its left, so the play/pause and the right
 *                              edge never move. It starts collapsed (`defaultCollapsedH`, default true) and remembers the
 *                              choice (localStorage `kol-float-transport:collapsed-h`)
 * @param {boolean} collapsedH · {Function} onCollapseH  the collapsed state, controlled (else the transport holds it);
 *                              `folded` · `onFoldChange` are their deprecated aliases
 * @param {Object|string} timecode  THE TIMECODE (float-everything W5 rows 69 · 70, 2026-11-04): `{ current, total? }` (or the
 *                               current alone) drawn by `Timecode` INSIDE the pill, after the slots — TabsRow's `trailing`
 *                               (kol-component ≥0.335.0); the slots stay where a pill without it puts them. Unset, no readout
 * @param {boolean} inline       THE DESKTOP CAPSULE (plan-2026-11-04-float-operational W1.2; kol-float--style 9:8791): at ≥ md
 *                               the transport is a 48 capsule IN FLOW where the consumer places it — 6 in, the float
 *                               Buttons (ghost, icon-only, 36) 4 apart, the lit slot fg-16, each named by the float Tooltip,
 *                               the Timecode 12 in after them (374 wide with a timecode); a `sheetFor` slot opens its rows
 *                               12 above the slot. Below md it is the phone pill as before. Default false — the pill everywhere
 * @param {string} className     the inline capsule's (ignored by the pill)
 */
const COLLAPSED_H_KEY = 'kol-float-transport:collapsed-h'

function Transport({ items = [], sheetFor = {}, placement = 'bottom', collapsibleH, collapsedH, defaultCollapsedH = true, onCollapseH, foldable, folded, onFoldChange, menuBorder = false, surface = 'solid', labels = false, foldSide = 'right', foldTone, timecode, inline = false, className = '' }) {
  const [sheet, setSheet] = useState(null)
  const canH = collapsibleH ?? foldable ?? false
  const ctlH = collapsedH ?? folded
  const onH = onCollapseH ?? onFoldChange
  const [ownH, setOwnH] = useState(() => { try { const v = localStorage.getItem(COLLAPSED_H_KEY); return v == null ? defaultCollapsedH : v === '1' } catch { return defaultCollapsedH } })
  const isH = canH && (ctlH ?? ownH)
  const toggleH = () => {
    const next = !isH
    if (next) setSheet(null)
    if (ctlH === undefined) { setOwnH(next); try { localStorage.setItem(COLLAPSED_H_KEY, next ? '1' : '0') } catch { /* private window: kept for this visit */ } }
    onH?.(next)
  }
  useEffect(() => {
    if (!sheet) return undefined
    const onKey = (e) => { if (e.key === 'Escape') setSheet(null) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [sheet])

  const top = placement === 'top'
  /* OUTLINE AT REST, SOLID WHEN LIT (transport set, 2026-11-12): a lit slot draws its glyph's `-solid` cut when the set
     ships one — every transport glyph does since kol-icons 0.70.0, `loop` and `repeat` included */
  const lit = (icon) => (icon && hasIcon(`${icon}-solid`) ? `${icon}-solid` : icon)
  const tabs = items.map((i) => {
    const selected = sheet === i.id || !!i.selected
    return { value: i.id, label: i.label, icon: selected ? lit(i.icon) : i.icon, selected }
  })
  const press = (id) => {
    if (sheetFor[id]) { setSheet((s) => (s === id ? null : id)); return }
    setSheet(null)
    items.find((i) => i.id === id)?.onPress?.()
  }
  /* the sheet centres on its slot: the pill's left edge + the slot's centre */
  const geo = { count: items.length, labels }
  const W = tabbarPillWidth(items.length, geo)
  const at = items.findIndex((i) => i.id === sheet)
  const sheetStyle = {
    left: `calc(50% - ${W / 2}px + ${tabbarPillSlot(at, geo)}px)`,
    right: 'auto',
    transform: 'translateX(-50%)',
    [top ? 'top' : 'bottom']: `calc(env(safe-area-inset-${top ? 'top' : 'bottom'}, 0px) + ${TABBAR_PILL_INSET + TABBAR_PILL_H + 12}px)`,
    ...(top ? { bottom: 'auto' } : {}),
    width: 'max-content', minWidth: 160,
  }
  const tc = timecode == null ? null : typeof timecode === 'string' ? { current: timecode } : timecode
  const phone = useMediaQuery('(max-width: 767px)')

  if (inline && !phone) {
    /* collapse-h: the extras, the chevron, the play/pause (the last item); collapsed, only a lit extra stays */
    const main = canH ? tabs[tabs.length - 1] : null
    const shown = canH ? tabs.slice(0, -1).filter((t) => !isH || t.selected) : tabs
    const slot = (t) => (
      <Tooltip key={t.value} variant="float" placement={top ? 'bottom' : 'top'} offset={12} label={t.label}>
        <Button variant="float" tone="ghost" iconOnly={t.icon} aria-label={t.label} pressed={t.selected} onClick={() => press(t.value)} />
      </Tooltip>
    )
    /* the desktop capsule — ToolRail's slots laid in a row; the sheet sits over its slot (6 in + 40 a slot + 18 its centre,
       + the chevron's 16 + 4 for the play/pause) */
    const order = main ? [...shown, main] : shown
    const slotAt = order.findIndex((t) => t.value === sheet)
    const capsuleSheet = { position: 'absolute', left: 6 + slotAt * 40 + 18 + (main && sheet === main.value ? 20 : 0), right: 'auto', transform: 'translateX(-50%)', [top ? 'top' : 'bottom']: 'calc(100% + 12px)', width: 'max-content', minWidth: 160 }
    return (
      <div role="toolbar" aria-label="Transport" className={`kol-transport-capsule kol-float-chrome relative inline-flex items-center gap-1 p-1.5 rounded-full ${floatSurfaceClass(surface)} ${className}`.trim()}>
        {sheet && <button type="button" aria-label="Close" className="kol-phone-nav-scrim" onClick={() => setSheet(null)} />}
        {sheet && (
          <div className={`kol-phone-nav-more kol-more-sheet kol-more-sheet-float ${floatSurfaceClass(surface, true)}${menuBorder ? ' kol-more-sheet-bordered' : ''}`} role="menu" aria-label={items[at]?.label} style={capsuleSheet}>
            <MenuFloat onLeaf={() => setSheet(null)} title={items[at]?.label}>
              <MenuFloatRows variant="float" actions={sheetFor[sheet]} onPick={() => setSheet(null)} />
            </MenuFloat>
          </div>
        )}
        {shown.map(slot)}
        {main && (
          <button type="button" aria-label={isH ? 'Show transport controls' : 'Hide transport controls'} aria-expanded={!isH} onClick={toggleH} data-collapse-h=""
            className="inline-flex h-9 w-4 shrink-0 items-center justify-center rounded-full text-oq-64 hover:text-oq-96 cursor-pointer focus-visible:outline-none focus-visible:shadow-[var(--kol-float-focus)]">
            <IconLoader name={isH ? 'chevron-left' : 'chevron-right'} size="var(--kol-float-chev-sm)" />
          </button>
        )}
        {main && slot(main)}
        {tc && <Timecode {...tc} className="px-3" />}
      </div>
    )
  }

  return (
    <>
      {sheet && (
        /* a clear BUTTON scrim — the panel under it stays in view, a tap off the sheet closes it */
        <button type="button" aria-label="Close" className="kol-phone-nav-scrim" onClick={() => setSheet(null)} />
      )}
      {sheet && (
        <div className={`kol-phone-nav-more kol-more-sheet kol-more-sheet-float ${floatSurfaceClass(surface, true)}${menuBorder ? ' kol-more-sheet-bordered' : ''}`} role="menu" aria-label={items[at]?.label} style={sheetStyle}>
          <MenuFloat onLeaf={() => setSheet(null)} title={items[at]?.label}>
            <MenuFloatRows variant="float" actions={sheetFor[sheet]} onPick={() => setSheet(null)} />
          </MenuFloat>
        </div>
      )}
      <TabsRow
        variant="stacked"
        placement="phone"
        shape="pill"
        edge={top ? 'top' : 'bottom'}
        /* the `transport` row of APP_FLOAT_NAV_VARIANTS (2026-10-28) — one table, not a second tuning */
        border={APP_FLOAT_NAV_VARIANTS.transport.border}
        shadow={APP_FLOAT_NAV_VARIANTS.transport.shadow}
        active={APP_FLOAT_NAV_VARIANTS.transport.active}
        surface={surface}
        labels={labels}
        foldable={canH}
        folded={ctlH}
        onFoldChange={(v) => { if (v) setSheet(null); onH?.(v) }}
        foldSide={foldSide}
        foldTone={foldTone}
        ariaLabel="Transport"
        trailing={tc ? <Timecode {...tc} /> : undefined}
        tabs={tabs}
        onChange={press}
      />
    </>
  )
}

/* ── kolbox (plan-2026-11-18-kolbox-system W31.2 batch 5, 2026-11-18) ─────────────────────────────────────────────────
 * `variant="kolbox"`: kolbox's floating nav, both of its members (TransportPill and PhoneNav are this component's
 * aliases, so both kolbox twins land here). `transport` — kolbox's ToolbarTransport; unset — kolbox's RailPhone. */

/* THE TRANSPORT (Figma plan 19.1, W15, W20.1), carried from apps/kolbox/src/ui/ToolbarTransport.jsx: on ToolRail kolbox's
 * shell, Play and Pause each a slot with the current state lit, Rewind, Stop and the time; after a rule, Loop and its
 * length ("Loop / 4 s", the length's words as the field's prefix, on one line, the value hugging its text), the
 * Timeline slot (`onTimeline`, lit while `timeline` is up) and `more` (further slots). The length commits on Enter or
 * blur; a unit is part of the value. kolbox's words, no twin in the default transport's props: playing, time, loop,
 * loopLength, timeline, onPlay(on), onRewind, onStop, onLoop(on), onLoopLength(seconds), onTimeline, more. */
function TransportKolbox({ playing = false, time = 0, loop = false, loopLength = 4, timeline = false, onPlay, onRewind, onStop, onLoop, onLoopLength, onTimeline, more, className = '' }) {
  const length = `${loopLength} s`
  const commit = (e) => {
    const n = parseFloat(e.target.value)
    if (n > 0) onLoopLength?.(n)
    else e.target.value = length
  }
  return (
    <ToolRail
      variant="kolbox"
      className={`kol-transport--kolbox ${className}`.trim()}
      end={
        <>
          <ToolRailSlot icon="repeat" label="Loop" lit={loop} onClick={() => onLoop?.(!loop)} />
          <Input variant="kolbox"
            key={length}
            prefix="Loop /"
            aria-label="Loop length in seconds"
            defaultValue={length}
            onBlur={commit}
            onKeyDown={(e) => e.key === 'Enter' && e.currentTarget.blur()}
            hug
            className="[&>span:first-child]:w-auto [&>span:first-child]:whitespace-nowrap"
          />
          {onTimeline && <ToolRailSlot icon="panel-bottom" label="Timeline" lit={timeline} onClick={onTimeline} />}
          {more}
        </>
      }
    >
      <ToolRailSlot icon="play" label="Play" lit={playing} onClick={() => onPlay?.(true)} />
      <ToolRailSlot icon="pause" label="Pause" lit={!playing} onClick={() => onPlay?.(false)} />
      <ToolRailSlot icon="rewind" label="Rewind" onClick={onRewind} />
      <ToolRailSlot icon="stop" label="Stop" onClick={onStop} />
      <span className="kol-transport-time w-16 px-2 tabular-nums">{time.toFixed(2)} s</span>
    </ToolRail>
  )
}

/* ── folio (Folio migration batch D, 2026-11-22) ──────────────────────────────────────────────────────────────────────
 * `variant="folio" transport`: Folio's ToolTransport, carried from apps/folio's EditorChrome.jsx (Folio has no phone
 * nav, so the transport is the look's one member). Play (Pause while playing, lit), Stop and Loop (lit while on), each a
 * 32 square with a 20 glyph, 4 apart, then the time and its total. Words: `timecode` `{ current, total }` (the default
 * transport's; Folio's `time` and `total`); kolbox's `playing`, `onPlay(on)`, `onStop`, `loop`, `onLoop(on)`. The slots
 * are `Button variant="folio" iconOnly` (Folio's ToolIcon, batch A). */
function TransportFolio({ playing = false, onPlay, onStop, loop = false, onLoop, timecode, className = '' }) {
  const tc = timecode == null ? {} : typeof timecode === 'string' ? { current: timecode } : timecode
  return (
    <span role="group" aria-label="Transport" className={`kol-transport--folio flex shrink-0 items-center gap-[4px] ${className}`.trim()}>
      <Button variant="folio" iconOnly={playing ? 'pause' : 'play'} aria-label={playing ? 'Pause' : 'Play'} pressed={playing} onClick={() => onPlay?.(!playing)} />
      <Button variant="folio" iconOnly="stop" aria-label="Stop" onClick={onStop} />
      <Button variant="folio" iconOnly="repeat" aria-label="Loop" pressed={loop} onClick={() => onLoop?.(!loop)} />
      <span className="kol-transport-time whitespace-pre px-[8px] tabular-nums">{tc.current}{tc.total != null && <span className="kol-transport-total">{` / ${tc.total}`}</span>}</span>
    </span>
  )
}

/* THE PHONE NAV (round 4, W15), carried from apps/kolbox/src/ui/RailPhone.jsx: the real hub's phone nav in kolbox's
 * look. AppFloatNav's words: `items` [{ path, icon, label, onPress }] in rail order (the app's rows; kolbox's `run` is
 * `onPress`), `currentPath`. More than five, so the first four sit in the pill and the fifth slot is More; More is the
 * whole nav, titled "More", the current page lit; while it is open the pill gives way (its place kept) and More turns to
 * its × ("Close"); a pick or a press off it closes it. The active slot is the current page's (a page reached through More
 * lights More). Geometry: 66 high, 56 slots 4 apart, 28 glyphs, More its own 66 circle 8 off the pill, 16 off the
 * window's foot. */
const KOLBOX_IN_BAR = 4
const kolboxAt = (row, path) => path === row.path || path.startsWith(`${row.path}/`)
const SlotKolbox = ({ icon, label, lit, onClick, round = false, refEl }) => (
  <Tooltip variant="kolbox" label={label}>
    <button
      ref={refEl}
      type="button"
      aria-label={label}
      aria-current={lit || undefined}
      onClick={onClick}
      className={`kol-phone-nav-slot${lit ? ' is-lit' : ''}${round ? ' is-round size-[66px]' : ' size-14'} inline-flex shrink-0 items-center justify-center rounded-full outline-none focus-visible:outline-solid focus-visible:outline-1`}
    >
      <IconLoader name={icon} size={28} className="kol-kolbox-icon shrink-0" />
    </button>
  </Tooltip>
)

function PhoneNavKolbox({ items = [], currentPath = '/' }) {
  const [open, setOpen] = useState(false)
  const moreRef = useRef(null)
  const active = items.find((r) => kolboxAt(r, currentPath))
  const inBar = items.slice(0, KOLBOX_IN_BAR)
  const litMore = open || (active && !inBar.includes(active))
  return (
    <nav aria-label="Pages" className="kol-phone-nav--kolbox pointer-events-none fixed inset-x-0 bottom-4 z-40 flex items-center justify-center gap-2 pb-[env(safe-area-inset-bottom)] *:pointer-events-auto" data-rail-phone>
      <div className={`kol-phone-nav-pill flex h-[66px] items-center gap-1 rounded-full p-[5px] ${open ? 'invisible' : ''}`} data-rail-phone-pill>
        {inBar.map((r) => <SlotKolbox key={r.path} icon={r.icon} label={r.label} lit={r === active} onClick={r.onPress} />)}
      </div>
      <SlotKolbox round icon={open ? 'x' : 'more'} label={open ? 'Close' : 'More'} lit={litMore} onClick={() => setOpen((o) => !o)} refEl={moreRef} />
      <Menu variant="kolbox"
        aria-label="More"
        anchor={moreRef}
        open={open}
        placement="left-start"
        onClose={() => setOpen(false)}
        onSelect={(row) => row.run?.()}
        groups={[{ title: 'More', rows: items.map((r) => ({ label: r.label, icon: r.icon, highlighted: r === active, run: r.onPress })) }]}
      />
    </nav>
  )
}
