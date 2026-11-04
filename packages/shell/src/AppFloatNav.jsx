import { useCallback, useEffect, useState } from 'react'
import { Button, TabsRow, Tooltip, TABBAR_H, TABBAR_PILL_H, TABBAR_PILL_INSET, tabbarPillWidth, tabbarPillSlot, floatSurfaceClass, usePopover, PopoverPanel, useMediaQuery } from '@kolkrabbi/kol-component'
import MoreRows, { FloatMenu } from './MoreSheet.jsx'
import Timecode from './Timecode.jsx'

/* taxonomy-ok: molecule — TabsRow's pill + MoreRows sheets of Buttons */

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
 * depth — `sub`, the More's `actions` and the transport's `sheetFor` rows alike (MoreSheet's `FloatMenu`). On the `dock` a
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
  /* an outside press closes it — except one on a nested level, which hangs beside it in its own portal (FloatMenu) */
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
          <FloatMenu beside={dock} cardClass={card} onLeaf={pickSub}>
            <MoreRows variant="float" actions={inBar.find((i) => key(i) === sub)?.sub} onPick={pickSub} />
          </FloatMenu>
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
          <FloatMenu cardClass={card} onLeaf={pickMoreLeaf}>
          <MoreRows variant="float" actions={actions} items={before} itemsFirst active={active} onPick={(x) => { setOpen(false); if (x.onPress && !actions.includes(x)) { x.onPress(); return } if (x.path) onNavigate?.(x.path) }} />
          {after.length > 0 && <MoreRows variant="float" items={after} active={active} onPick={(x) => { setOpen(false); if (x.onPress) { x.onPress(); return } if (x.path) onNavigate?.(x.path) }} />}
          </FloatMenu>
        </div>
      )}
      {dock && (
        <PopoverPanel popover={morePop} panel={false} focus={false} className={card} style={{ minWidth: 220, maxWidth: 'calc(100vw - 24px)' }}>
          <FloatMenu beside cardClass={card} onLeaf={pickMoreLeaf}>
          <MoreRows variant="float" actions={actions} items={before} itemsFirst active={active} onPick={(x) => { setOpen(false); if (x.onPress && !actions.includes(x)) { x.onPress(); return } if (x.path) onNavigate?.(x.path) }} />
          {after.length > 0 && <MoreRows variant="float" items={after} active={active} onPick={(x) => { setOpen(false); if (x.onPress) { x.onPress(); return } if (x.path) onNavigate?.(x.path) }} />}
          </FloatMenu>
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
 *                               `checked` marks the current pick with the 22px check (MoreRows); `sub` opens a level in place
 * @param {'bottom'|'top'} placement  the pill's edge (default bottom)
 * @param {boolean} foldable     a sideways swipe folds it into the right edge tab
 * @param {boolean} folded · {Function} onFoldChange  the folded state, controlled (else the pill holds it)
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
function Transport({ items = [], sheetFor = {}, placement = 'bottom', foldable = false, folded, onFoldChange, menuBorder = false, surface = 'solid', labels = false, foldSide = 'right', foldTone, timecode, inline = false, className = '' }) {
  const [sheet, setSheet] = useState(null)
  useEffect(() => {
    if (!sheet) return undefined
    const onKey = (e) => { if (e.key === 'Escape') setSheet(null) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [sheet])

  const top = placement === 'top'
  const tabs = items.map((i) => ({ value: i.id, label: i.label, icon: i.icon, selected: sheet === i.id || !!i.selected }))
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
    /* the desktop capsule — ToolRail's slots laid in a row; the sheet sits over its slot (6 in + 40 a slot + 18 its centre) */
    const capsuleSheet = { position: 'absolute', left: 6 + at * 40 + 18, right: 'auto', transform: 'translateX(-50%)', [top ? 'top' : 'bottom']: 'calc(100% + 12px)', width: 'max-content', minWidth: 160 }
    return (
      <div role="toolbar" aria-label="Transport" className={`kol-transport-capsule kol-float-chrome relative inline-flex items-center gap-1 p-1.5 rounded-full ${floatSurfaceClass(surface)} ${className}`.trim()}>
        {sheet && <button type="button" aria-label="Close" className="kol-phone-nav-scrim" onClick={() => setSheet(null)} />}
        {sheet && (
          <div className={`kol-phone-nav-more kol-more-sheet kol-more-sheet-float ${floatSurfaceClass(surface, true)}${menuBorder ? ' kol-more-sheet-bordered' : ''}`} role="menu" aria-label={items[at]?.label} style={capsuleSheet}>
            <FloatMenu onLeaf={() => setSheet(null)}>
              <MoreRows variant="float" actions={sheetFor[sheet]} onPick={() => setSheet(null)} />
            </FloatMenu>
          </div>
        )}
        {tabs.map((t) => (
          <Tooltip key={t.value} variant="float" placement={top ? 'bottom' : 'top'} offset={12} label={t.label}>
            <Button variant="float" tone="ghost" iconOnly={t.icon} aria-label={t.label} pressed={t.selected} onClick={() => press(t.value)} />
          </Tooltip>
        ))}
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
          <FloatMenu onLeaf={() => setSheet(null)}>
            <MoreRows variant="float" actions={sheetFor[sheet]} onPick={() => setSheet(null)} />
          </FloatMenu>
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
        foldable={foldable}
        folded={folded}
        onFoldChange={(v) => { if (v) setSheet(null); onFoldChange?.(v) }}
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
