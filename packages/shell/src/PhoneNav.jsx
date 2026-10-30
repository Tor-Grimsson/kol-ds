import { useEffect, useState } from 'react'
import { TabsRow, TABBAR_H, TABBAR_PILL_INSET, tabbarPillWidth } from '@kolkrabbi/kol-component'
import MoreRows from './MoreSheet.jsx'

/* taxonomy-ok: molecule — MobileTabBar + a More sheet of Buttons */

/**
 * PhoneNav — The rail as a phone tab bar. the rail, on a phone, as a bottom bar (AppShell `touch="bar"`, apps review
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
 * @param {boolean} moreKeepsOpen  More opens its sheet without collapsing the pill to the ×, and More lights only while
 *                              its sheet is open; nothing else closes
 * An item may carry `onPress` (a panel, not a route — the app owns what it opens and whether a second tap closes it) and
 * `selected` (lit whatever the route says; more than one may be).
 *
 * VARIANTS (PhoneNavVariants, kol-fxr 2026-10-28 — user: *"So we should ship variants? or presets? because if we only ship
 * props then each repo has to tune to the same settiings and we get drift"*). A variant is a preset of the pill props above;
 * any prop still overrides it. `PHONE_NAV_VARIANTS` is the table, and TransportPill reads its own row from it.
 * @param {'nav'|'panel'|'transport'} variant  `nav` — an app's phone nav: no hairline, no shadow, the lit slot a circle
 *                              (AppShell's default). `panel` — frame E's panel picker: on top, foldable, More keeps the panel
 *                              open, no hairline. `transport` — TransportPill's look: the shadow, it floats over content.
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
 * `dock`), no More (the rail is right there). An app shows it beside the rail, not instead of it.
 */
export const PHONE_NAV_VARIANTS = {
  nav: { border: false, shadow: false, active: 'circle' },
  panel: { placement: 'top', foldable: true, moreKeepsOpen: true, border: false, shadow: false, active: 'circle' },
  transport: { border: false, shadow: true, active: 'circle' },
  dock: { dock: true, border: false, shadow: false, active: 'circle' },
}

const MORE = '__more'
const MAX = 5

const activePath = (items, path) => items
  .filter((i) => (i.path === '/' ? path === '/' : path === i.path || path.startsWith(`${i.path}/`)))
  .sort((a, b) => b.path.length - a.path.length)[0]?.path

export default function PhoneNav({ items = [], currentPath = '/', onNavigate, actions = [], shape = 'bar', variant, placement: placementProp, border: borderProp, shadow: shadowProp, active: activeProp, foldable: foldableProp, folded, onFoldChange, moreKeepsOpen: keepsOpenProp, moreItems, sheetItems, dock: dockProp }) {
  const preset = PHONE_NAV_VARIANTS[variant] ?? {}
  const placement = placementProp ?? preset.placement ?? 'bottom'
  const border = borderProp ?? preset.border ?? true
  const shadow = shadowProp ?? preset.shadow ?? false
  const activeShape = activeProp ?? preset.active
  const foldable = foldableProp ?? preset.foldable ?? false
  const moreKeepsOpen = keepsOpenProp ?? preset.moreKeepsOpen ?? false
  const dock = dockProp ?? preset.dock ?? false
  const [open, setOpen] = useState(false)
  useEffect(() => { setOpen(false) }, [currentPath])
  useEffect(() => {
    if (!open) return undefined
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  const overflow = items.length > MAX || (actions.length > 0 && items.length >= MAX)
  const hasMore = !dock && (overflow || actions.length > 0 || (sheetItems?.length ?? 0) > 0)
  const inBar = overflow ? items.slice(0, MAX - 1) : items
  const inMore = overflow ? items.slice(MAX - 1) : []
  /* the sheet's rows: the whole nav, filtered by `moreItems` */
  const allow = typeof moreItems === 'function' ? moreItems : Array.isArray(moreItems) ? (i) => moreItems.includes(i.path) : () => true
  const moreRows = (sheetItems ?? items).filter(allow)
  const before = moreRows.filter((i) => !i.foot)
  const after = moreRows.filter((i) => i.foot)
  const active = activePath(items, currentPath)
  const value = open || inMore.some((i) => i.path === active) ? MORE : active

  const key = (i) => i.path ?? i.id ?? i.label
  const tabs = inBar.map((i) => ({ value: key(i), label: i.label, icon: i.icon, selected: i.selected ?? (moreKeepsOpen ? key(i) === active : undefined) }))
  /* with the pill kept whole, the More slot itself turns to × while its sheet is open, and a press closes it
   * (PhonePillMoreTurnsToClose, kol-fxr 2026-10-28 — frame A2: *"[...] that makes a list and nav turns to (X)"*) */
  if (hasMore) tabs.push({ value: MORE, label: open && moreKeepsOpen ? 'Close' : 'More', icon: open && moreKeepsOpen ? 'x' : 'more', selected: moreKeepsOpen ? open : undefined })
  /* THE SHEET HUGS ITS WORDS AND SITS BESIDE THE × (user 2026-10-23, his reference: iOS Photos' menu next to its ×, *"but
   * align to bottom"*) — to the left of the collapsed ×, a 12px gap, the two bottom edges on one line */
  const pill = shape === 'pill'
  const top = pill && placement === 'top'
  const sheetStyle = moreKeepsOpen && pill ? {
    /* the pill stays whole, so the sheet hangs off its right end, 12 off its face (frame E: below a top pill) */
    left: 'auto',
    right: `calc(50% - ${tabbarPillWidth(tabs.length) / 2}px)`,
    [top ? 'top' : 'bottom']: `calc(env(safe-area-inset-${top ? 'top' : 'bottom'}, 0px) + ${TABBAR_PILL_INSET + TABBAR_H + 12}px)`,
    ...(top ? { bottom: 'auto' } : {}),
    width: 'max-content', minWidth: 220, maxWidth: 'calc(100vw - 24px)',
  } : {
    left: 'auto',
    right: pill ? `calc(50% - ${tabbarPillWidth(tabs.length) / 2}px + ${TABBAR_H + 12}px)` : `calc(${100 / tabs.length}% + 8px)`,
    ...(top
      ? { top: `calc(env(safe-area-inset-top, 0px) + ${TABBAR_PILL_INSET}px)`, bottom: 'auto' }
      : { bottom: pill ? `calc(env(safe-area-inset-bottom, 0px) + ${TABBAR_PILL_INSET}px)` : 'env(safe-area-inset-bottom, 0px)' }),
    width: 'max-content', minWidth: 220, maxWidth: `calc(100vw - ${TABBAR_H + 36}px)`,
  }
  const press = (v) => {
    if (v === MORE) { setOpen((o) => !o); return }
    const item = inBar.find((i) => key(i) === v)
    if (item?.onPress) { item.onPress(); return }
    onNavigate?.(v)
  }

  return (
    <>
      {open && (
        /* a BUTTON scrim — iOS does not bubble a tap from a div (OverlayScrimTapDismiss, 2026-09-01) */
        /* with `moreKeepsOpen` the panel under it stays in view: a clear scrim, a tap off the sheet still closes it */
        <button type="button" aria-label="Close more" className={`kol-phone-nav-scrim${moreKeepsOpen ? '' : ' kol-overlay-scrim'}`} onClick={() => setOpen(false)} />
      )}
      {open && (
        <div className="kol-phone-nav-more kol-more-sheet" role="menu" aria-label="More" style={sheetStyle}>
          {/* the nav, the page's actions, then the pinned foot (frame A2) */}
          <MoreRows actions={actions} items={before} itemsFirst active={active} onPick={(x) => { setOpen(false); if (x.onPress && !actions.includes(x)) { x.onPress(); return } if (x.path) onNavigate?.(x.path) }} />
          {after.length > 0 && <MoreRows items={after} active={active} onPick={(x) => { setOpen(false); if (x.onPress) { x.onPress(); return } if (x.path) onNavigate?.(x.path) }} />}
        </div>
      )}
      <TabsRow
        variant="stacked"
        placement="phone"
        shape={shape}
        collapsed={open && !moreKeepsOpen}
        onExpand={() => setOpen(false)}
        edge={top ? 'top' : 'bottom'}
        border={border}
        shadow={shadow}
        dock={dock}
        active={activeShape}
        foldable={foldable}
        folded={folded}
        onFoldChange={(v) => { if (v) setOpen(false); onFoldChange?.(v) }}
        foldSide="left"
        tabs={tabs}
        value={value}
        onChange={press}
      />
    </>
  )
}
