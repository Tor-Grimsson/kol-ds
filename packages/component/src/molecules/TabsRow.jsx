import { useLayoutEffect, useRef, useState } from 'react'
import useScrollFade from '../hooks/useScrollFade.js'
import CloseButton from '../atoms/CloseButton.jsx'
import Button from '../atoms/Button.jsx'
import { Icon } from '@kolkrabbi/kol-icons'
import { RAIL_ROW } from '../hooks/railRow.js'
import { Tooltip } from '../utilities/Popover.jsx'
import { floatSurfaceClass } from '../utilities/tone.js'

/* taxonomy-ok: nests kol-icons's Icon */

/**
 * TabsRow — Text tabs with an underline. labeled underline tab strip: text tabs where the active tab gets
 * a 2px bottom underline and emphasis color; inactive tabs are muted and
 * brighten on hover. Optional leading close button and trailing minimise
 * chevron render only when their handlers are passed — no outer chrome, the
 * consumer wraps it. Controlled: the parent owns `value`.
 *
 * Real tablist semantics: `role="tablist"`/`role="tab"` + `aria-selected`,
 * roving tabindex, ArrowLeft/ArrowRight move focus and activate (wrapping).
 * Labels render verbatim from `tabs` — no text-transform.
 *
 * @param {Array}    tabs       [{ id, label }] — tab items, authored at the call site
 * @param {string}   value      id of the active tab (controlled)
 * @param {Function} onChange   (id) => void — fires on tab click or arrow-key move
 * @param {Function} onClose    () => void — show + wire the leading close button
 * @param {Function} onMinimise () => void — show + wire the trailing minimise chevron
 *
 * ONE TAB COMPONENT, FOUR VARIANTS (TabsStackedLayout, kol-monitor 2026-10-17 — four components drew one control). The prop
 * is `variant`, the one word the DS uses for a look (control-chrome: "variant is the look"); `look` was an agent's coinage
 * on the merge and is read as a silent alias until no published consumer passes it (the user, 2026-10-30: *"USE VARIANT"*).
 * @param {'scroll'|'wrap'} [overflow='scroll']  A ROW WIDER THAN ITS COLUMN (TabsRowOverflow, kol-website 2026-10-29 — six
 *   underline tabs are 394px, so at 390 the page scrolled sideways and record wrapped the row in its own div): `scroll`
 *   keeps one line that scrolls sideways with no scrollbar, `.kol-scroll-fade--x` fading the clipped edge(s), and the
 *   active tab scrolled into view when it changes — arrow keys included; `wrap` breaks the tabs onto a second line.
 *   Every variant but `stacked`, which has its phone bar
 * @param {'underline'|'chip'|'text'|'stacked'|'float'} [variant='underline']  `float` (W16, round 3): `chip`'s row as the floating
 *        style's capsules — float heights (28/36/44, touch 36/44/52), 4 apart, the selected one oq-16
 * @param {string} [look]  @deprecated 2026-10-30 — the old spelling of `variant`; `variant` wins when both are passed
 * @param {'mono'|'sans'|'mono-light'} [type='mono']  `underline` only: the tab's type — `mono-light` is `sans`'s row on JetBrains Mono at 300 (his word, 2026-10-30)
 * @param {boolean} [filled=false] - `chip` only: every chip shows at rest (Button `tab-filled`), so the row reads as choices
 *        underline — this row, as it always was; a tab's `icon` sits before its label. `type` picks its type: `mono`
 *                    (default, the mono-12 row) or `sans` (the neutral sans at 300, a 20px glyph in a 40px row — the
 *                    user's ref, Adobe's tab strip, 2026-10-29; named `type` by him, 2026-10-30)
 *        chip      — the active tab a filled chip, the rest quiet (was `TabChips`); `size` is the control rung
 *        text      — flat helper-type tabs, the active one bright (was kol-shell's `TabStrip`); `size` is the
 *                    helper size (default 14), `tracked` adds 1px tracking
 *        stacked   — icon over label (was `MobileTabBar`); tabs take `icon`
 * @param {'inline'|'phone'} [placement='inline']  `phone` floats a stacked bar fixed to the bottom below `md`
 *        (MobileTabBar's placement — the consumer owes the list `--kol-tabbar-h` of bottom padding)
 * @param {'bar'|'pill'} [shape='bar']  the phone bar's shape: `bar` spans the bottom edge; `pill` floats a rounded,
 *        centred bar `TABBAR_PILL_INSET` off it, hugging its tabs, the active tab a filled pill (user 2026-10-23, iOS Files)
 * @param {boolean}  [collapsed=false]  THE COLLAPSE (user 2026-10-23: *"why not the entire rail? closing it gives it back"*): the
 *        phone bar collapses into one round × at its right end — the pill shrinks to a 56 circle where More was, the bar
 *        keeps its width and shows the × in More's slot — while a sheet is open; `onExpand` is the ×. It expands back
 * @param {Function} [onExpand]  the ×'s press
 * THE PILL'S OPTIONS (PhoneNavTopAndFold + TransportPill, kol-fxr 2026-10-27, frame E — one pill that the phone nav and
 * the transport both compose, so the two stay one size and one look):
 * @param {'bottom'|'top'} [edge='bottom']  the pill's edge; `top` sits TABBAR_PILL_INSET under the top safe-area inset
 * @param {boolean} [border=true]   the pill's 1px oq-08 hairline
 * @param {boolean} [dock=false]  THE DOCK (PhoneNavDock, kol-fxr 2026-10-28, frame B2 — user: *"I moved the Phone nav in desktop,
 *                                 that component shoudl probablyget its own variant"*): the pill on a DESK — shown from md up, hidden
 *                                 below (the phone has its own nav), placed at the content's bottom-left, 64 in from the rail's edge
 *                                 (`--kol-shell-rail-width`) and 64 up, not centred
 * @param {boolean} [shadow=false]  the KOL float shadow (`--kol-shadow-float`) — for a pill that floats over content (the transport,
 *                                 a nav over a clashing canvas). Every pill slot names itself on hover in the KOL `Tooltip`
 * @param {'fill'|'circle'} [active='fill']  the lit slot — since W16 (round 3, 2026-10-31) both are the whole 56 slot as a circle,
 *                                 oq-16; the prop stays so call sites keep working
 * THE FLOAT (W16, round 3 — 2026-10-31, accepted: *"accept the style, both glass styles"*). The pill is fxr's live nav: 66 tall, 56
 * buttons 4 apart, 5 in, 28 glyphs — the same on mouse and touch. Its name on hover is the float Tooltip.
 * @param {'solid'|'glass-dark'|'glass-light'} [surface='solid']  the pill's material (`floatSurfaceClass`); a glass has no
 *                                 hairline (its rim is the edge) and always its own shadow; `solid` keeps `border` and `shadow`
 * @param {boolean} [split=false]  the LAST tab (AppFloatNav's ···) stands apart as its own 66 circle, 8 off the bar (iOS 27's
 *                                 grouped toolbar); while `collapsed` the bar fades and the circle is the ×
 * @param {boolean} [labels=false]  the tab bar with labels: 66 tall, items 58 tall and 84 wide, 4 in, a 24 glyph over an 11 label
 * @param {boolean} [foldable=false]  a sideways swipe (> 40px) folds the pill into a 28×72 edge tab; a tap restores it
 * @param {boolean} [folded] · {Function} [onFoldChange]  the folded state, controlled (else the pill holds it)
 * @param {'left'|'right'|'swipe'} [foldSide='left']  the screen edge the tab sits on; `swipe` — the edge the swipe went toward
 *        (FloatFoldBothSidesGrey, kol-fxr 2026-11-03)
 * @param {'ground'|'handle'} [foldTone='ground']  the edge tab's look: `ground` is the pill's own; `handle` is the grey edge
 *        handle (iOS's), `--kol-oq-24` with an `--kol-oq-96` chevron, whatever the pill's `surface`
 * THE FLOAT ROW'S PARTS (float-everything W5 rows 67 · 78 and W9 row 137, 2026-11-04 — kol-float--style 46:1948, 46:2316,
 * 48:4586), `variant="float"` only:
 * @param {'xs'|'sm'|'md'|'lg'} [size]  `xs` — the inspector's chip tabs: 26 capsules in `kol-float-label`, 10 in, the
 *        selected one fg-16 (row 67); sm · md · lg are the float button heights
 * @param {'mono'} [type]  `mono` — text tabs: mono labels (`kol-float-timecode`) at the sm height on the list radius, the
 *        selected one FILLED fg-16, the rest fg-48 (row 137 — the underline's rule replaced by the fill)
 * A float tab takes `icon` (before the label, oq) and `count` (after it, mono, fg-64) — `Tasks 5` (row 78).
 * @param {'solid'|'glass-dark'|'glass-light'} [surface]  on `float`: the row sits in its own capsule — the float material,
 *        6 in, so `size="lg"` tabs make the 56 pill (row 78). Unset, the row is bare as before
 * @param {ReactNode} [trailing]  inside the pill, after the tabs: the float capsule's (with `surface`) or the stacked
 *        phone pill's — AppFloatNav's transport puts its Timecode here. With `trailing` the phone pill anchors its LEFT
 *        edge where a centred pill without it would start, so every slot stays where it was; it grows to the right
 * Tabs are `{ id, label }` or `{ value, label }` (either key), plus `icon` for stacked; a stacked tab's `selected`
 * lights it whatever `value` is — action slots (the transport) light more than one.
 */
export const TABBAR_H = 56
/* the pill's height (W16, round 3 — fxr's live nav: was TABBAR_H) — a page under it owes TABBAR_PILL_H + TABBAR_PILL_INSET */
export const TABBAR_PILL_H = 66
/* the pill's air off the bottom edge */
export const TABBAR_PILL_INSET = 16
/* the pill's geometry, shared with the sheets that align to it: 56 per tab, 4 between, 5 in (4 + the 1px hairline) each side;
 * with labels 84 per tab, none between, 4 in; a split last tab is a TABBAR_PILL_H circle 8 off the bar */
export const TABBAR_PILL_TAB = 56
export const TABBAR_PILL_GAP = 4
export const TABBAR_PILL_LABEL_TAB = 84
export const TABBAR_PILL_SPLIT_GAP = 8
const pillBar = (n, labels) => (labels ? n * TABBAR_PILL_LABEL_TAB + 8 : n * TABBAR_PILL_TAB + Math.max(0, n - 1) * TABBAR_PILL_GAP + 10)
/* the whole pill's width — the bar, plus the split circle when `split` */
export const tabbarPillWidth = (count, { labels = false, split = false } = {}) => (split
  ? pillBar(count - 1, labels) + TABBAR_PILL_SPLIT_GAP + TABBAR_PILL_H
  : pillBar(count, labels))
/* a slot's centre, from the pill's left edge (a split last slot is the circle's) */
export const tabbarPillSlot = (at, { count, labels = false, split = false } = {}) => {
  if (split && at === count - 1) return pillBar(count - 1, labels) + TABBAR_PILL_SPLIT_GAP + TABBAR_PILL_H / 2
  return labels ? 4 + at * TABBAR_PILL_LABEL_TAB + TABBAR_PILL_LABEL_TAB / 2 : 5 + at * (TABBAR_PILL_TAB + TABBAR_PILL_GAP) + TABBAR_PILL_TAB / 2
}
/* the collapse's motion — one duration for the width and the glyph swap (300, user 2026-10-23: 180 read as abrupt) */
const COLLAPSE_MS = 300

export default function TabsRow({ tabs: raw = [], value, onChange, onClose, onMinimise, variant, look: lookLegacy, type, trailing, filled = false, placement = 'inline', shape = 'bar', collapsed = false, onExpand, edge, border, shadow, dock, active, foldable, folded, onFoldChange, foldSide, foldTone, surface, split, labels, size, tracked = false, overflow = 'scroll', ariaLabel, className, style }) {
  const tabs = raw.map((t) => ({ ...t, id: t.id ?? t.value }))
  const look = variant ?? lookLegacy ?? 'underline'
  const wrap = overflow === 'wrap'
  /* `float` (W16, round 3): the chip row as capsules — float heights, pills 4 apart, the selected one oq-16 */
  if (look === 'float') {
    const row = <ChipTabs tabs={tabs} value={value} onChange={onChange} size={size ?? 'md'} float floatType={type} ariaLabel={ariaLabel} className={`${wrap ? 'flex-wrap ' : ''}${surface ? '' : className ?? ''}`} />
    /* the capsule (row 78): the float material, 6 in, the tabs then the trailing slot */
    if (surface) {
      return (
        <div className={`inline-flex max-w-full items-center gap-1 rounded-full p-1.5 ${floatSurfaceClass(surface)} ${className ?? ''}`.trim()}>
          <Overflow mode={overflow} value={value}>{row}</Overflow>
          {trailing && <div className="flex shrink-0 items-center gap-1">{trailing}</div>}
        </div>
      )
    }
    return <Overflow mode={overflow} value={value}>{row}</Overflow>
  }
  if (look === 'chip') return <Overflow mode={overflow} value={value}><ChipTabs tabs={tabs} value={value} onChange={onChange} size={size ?? 'sm'} filled={filled} ariaLabel={ariaLabel} className={`${wrap ? 'flex-wrap ' : ''}${className ?? ''}`} /></Overflow>
  if (look === 'text') return <Overflow mode={overflow} value={value}><TextTabs tabs={tabs} value={value} onChange={onChange} size={size ?? 14} tracked={tracked} className={`${wrap ? 'flex-wrap gap-y-2 ' : ''}${className ?? 'gap-6'}`} style={style} /></Overflow>
  if (look === 'stacked') return <StackedTabs trailing={trailing} tabs={tabs} value={value} onChange={onChange} placement={placement} shape={shape} collapsed={collapsed} onExpand={onExpand} edge={edge} border={border} shadow={shadow} dock={dock} active={active} foldable={foldable} folded={folded} onFoldChange={onFoldChange} foldSide={foldSide} foldTone={foldTone} surface={surface} split={split} labels={labels} ariaLabel={ariaLabel} className={className ?? ''} />
  return <Overflow mode={overflow} value={value}><UnderlineTabs tabs={tabs} value={value} onChange={onChange} onClose={onClose} onMinimise={onMinimise} wrap={wrap} type={type ?? 'mono'} /></Overflow>
}

/* `overflow="scroll"`: the row in a sideways scroller that fades its clipped edges and keeps the active tab (`data-active`)
 * in view — by the scroller's own scrollLeft, never scrollIntoView, which would scroll the page too. `wrap` draws as is. */
function Overflow({ mode, value, children }) {
  const ref = useRef(null)
  const scroll = mode !== 'wrap'
  useScrollFade(ref, scroll, 'x')
  useLayoutEffect(() => {
    const strip = ref.current
    const tab = strip?.querySelector('[data-active]')
    if (!scroll || !strip || !tab) return
    const s = strip.getBoundingClientRect()
    const t = tab.getBoundingClientRect()
    if (t.left < s.left) strip.scrollLeft += t.left - s.left
    else if (t.right > s.right) strip.scrollLeft += t.right - s.right
  }, [value, scroll])
  if (!scroll) return children
  return <div ref={ref} className="kol-tabs-scroll kol-scroll-fade--x">{children}</div>
}

/* chip — TabChips verbatim */
function ChipTabs({ tabs, value, onChange, size, filled, float = false, floatType, ariaLabel, className }) {
  /* the float's two plain rows — the inspector's 26 chips (xs) and the mono text tabs — are drawn here, not by Button:
   * neither is a Button rung (26 is not a float height; a mono label is not the float button's type) */
  const plain = float && (size === 'xs' || floatType === 'mono')
  return (
    <div className={`flex items-center ${filled ? 'gap-2' : 'gap-1'}${float ? ' kol-tabs-float' : ''} ${className}`.trim()} role="tablist" aria-label={ariaLabel}>
      {tabs.map((t) => {
        const active = t.id === value
        if (plain) {
          const mono = floatType === 'mono'
          return (
            <button key={t.id} type="button" role="tab" aria-selected={active} data-active={active || undefined} onClick={() => onChange?.(t.id)}
              className={`inline-flex shrink-0 items-center whitespace-nowrap cursor-pointer focus-visible:outline-none focus-visible:shadow-[var(--kol-float-focus)] ${mono ? 'kol-float-timecode h-[var(--kol-float-h-sm)] rounded-[var(--kol-float-list-r)] px-3' : 'kol-float-label h-[26px] rounded-full px-2.5'} ${active ? 'bg-fg-16 text-fg-emphasis' : `${mono ? 'text-fg-48' : 'text-fg-64'} hover:bg-fg-08 hover:text-fg-emphasis`}`}>
              {t.label}
            </button>
          )
        }
        if (float && (t.icon || t.count != null)) {
          return (
            <Button key={t.id} variant="float" size={size} iconLeft={t.icon} pressed={active} role="tab" aria-selected={active} aria-pressed={undefined} data-active={active || undefined} onClick={() => onChange?.(t.id)}>
              {t.label}
              {t.count != null && <span className="kol-float-ruler ml-0.5 tabular-nums text-fg-64">{t.count}</span>}
            </Button>
          )
        }
        return (
          /* a tab is selected, not pressed — the role's own attribute replaces Button's aria-pressed */
          <Button key={t.id} variant={float ? 'float' : filled ? 'tab-filled' : 'tab'} size={size} pressed={active} role="tab" aria-selected={active} aria-pressed={undefined} data-active={active || undefined} onClick={() => onChange?.(t.id)}>
            {t.label}
          </Button>
        )
      })}
    </div>
  )
}

/* text — kol-shell's TabStrip verbatim */
function TextTabs({ tabs, value, onChange, size, tracked, className, style }) {
  return (
    <div className={`flex items-center ${className}`.trim()} style={style}>
      {tabs.map((opt) => (
        <span
          key={opt.id}
          data-active={value === opt.id || undefined}
          onClick={() => onChange?.(opt.id)}
          className={`kol-helper-${size} cursor-pointer select-none ${value === opt.id ? 'text-fg-96' : 'text-fg-32 hover:text-fg-48'}`}
          style={tracked ? { letterSpacing: 1 } : undefined}
        >
          {opt.label}
        </span>
      ))}
    </div>
  )
}

/* stacked — MobileTabBar's tab verbatim; its fixed bottom pill is `placement="phone"`, inline is a plain row */
/* the fold: a sideways swipe past this folds the pill, as frame E's prototype measures it */
const FOLD_SWIPE = 40

function StackedTabs({ trailing, tabs, value, onChange, placement, shape = 'bar', collapsed = false, onExpand, edge = 'bottom', border = true, shadow = false, dock = false, active: activeShape = 'fill', foldable = false, folded: foldedProp, onFoldChange, foldSide: foldSideProp = 'left', foldTone = 'ground', surface = 'solid', split: splitProp = false, labels = false, ariaLabel = 'Sections', className }) {
  const [foldedOwn, setFoldedOwn] = useState(false)
  const swipe = useRef({ x: null, swiped: false })
  const [swipeSide, setSwipeSide] = useState('left')
  if (tabs.length === 0) return null
  const phone = placement === 'phone'
  const pill = phone && shape === 'pill'
  const isCollapsed = phone && collapsed
  const split = pill && splitProp && tabs.length > 1
  const W = tabbarPillWidth(tabs.length, { labels, split })
  const top = pill && edge === 'top'
  const isFolded = pill && foldable && (foldedProp ?? foldedOwn)
  const setFolded = (v) => { if (foldedProp === undefined) setFoldedOwn(v); onFoldChange?.(v) }
  /* THE MATERIAL (W16): solid keeps the pill's ground, hairline and shadow props; a glass is the theme's class, no hairline */
  const glass = surface === 'glass-dark' || surface === 'glass-light'
  const material = glass ? floatSurfaceClass(surface) : ''
  const solidLook = glass ? {} : { background: 'var(--kol-surface-secondary)', boxShadow: shadow ? 'var(--kol-shadow-float)' : undefined }
  /* without the hairline the 1px it took stays, transparent, so the slots never move */
  const edgeLine = `1px solid ${border && !glass ? 'var(--kol-oq-08)' : 'transparent'}`
  /* the edge offset: the pill's inset from the safe area on its edge */
  const inset = `calc(env(safe-area-inset-${top ? 'top' : 'bottom'}, 0px) + ${TABBAR_PILL_INSET}px)`
  const swipeProps = pill && foldable ? {
    onPointerDown: (e) => { swipe.current.x = e.clientX },
    onPointerUp: (e) => {
      const { x } = swipe.current
      swipe.current.x = null
      if (x != null && Math.abs(e.clientX - x) > FOLD_SWIPE) { swipe.current.swiped = true; setSwipeSide(e.clientX < x ? 'left' : 'right'); setFolded(true) }
    },
    /* a swipe that ended on a slot must not also press it */
    onClickCapture: (e) => { if (swipe.current.swiped) { swipe.current.swiped = false; e.stopPropagation(); e.preventDefault() } },
    style: { touchAction: 'pan-y' },
  } : {}
  if (isFolded) {
    const foldSide = foldSideProp === 'swipe' ? swipeSide : foldSideProp
    const handle = foldTone === 'handle'
    /* THE EDGE TAB (frame E): 28×72 flush to the screen edge, the pill's ground, no border, a chevron pointing back in */
    return (
      <button
        type="button"
        aria-label={`Show ${ariaLabel.toLowerCase()}`}
        onClick={() => setFolded(false)}
        className={`kol-mobile-tabbar-tab md:hidden fixed z-[calc(var(--kol-z-sticky)+1)] flex items-center justify-center cursor-pointer ${handle ? '' : material}`.trim()}
        style={{
          [foldSide]: 0,
          [top ? 'top' : 'bottom']: `calc(env(safe-area-inset-${top ? 'top' : 'bottom'}, 0px) + ${TABBAR_PILL_INSET + 8}px)`,
          width: 28, height: 72, padding: 0, border: 'none',
          borderRadius: foldSide === 'left' ? '0 16px 16px 0' : '16px 0 0 16px',
          ...(handle ? { background: 'var(--kol-oq-24)' } : glass ? {} : { background: 'var(--kol-surface-secondary)' }), color: handle ? RAIL_ROW.active : RAIL_ROW.rest,
        }}
      >
        <Icon name={foldSide === 'left' ? 'chevron-right' : 'chevron-left'} size={18} />
      </button>
    )
  }
  const inBar = split ? tabs.slice(0, -1) : tabs
  const last = split ? tabs[tabs.length - 1] : null
  const slotW = labels ? TABBAR_PILL_LABEL_TAB : TABBAR_PILL_TAB
  const slotH = labels ? 58 : TABBAR_PILL_TAB
  const ink = (on) => (phone ? (on ? RAIL_ROW.active : RAIL_ROW.rest) : (on ? 'var(--kol-fg-default)' : 'var(--kol-fg-48)'))
  const tip = (t, el) => <Tooltip key={t.id} label={t.label} placement={top ? 'bottom' : 'top'} offset={10} variant="float" asChild>{el}</Tooltip>
  const slot = (t) => {
    const active = t.selected ?? t.id === value
    if (pill) {
      /* round 3: the lit slot is the whole slot as a circle (a capsule with labels), oq-16 */
      return tip(t, (
        <button
          key={t.id}
          type="button"
          onClick={() => onChange?.(t.id)}
          aria-current={active ? 'page' : undefined}
          aria-label={t.label}
          /* a DOCK slot lights on hover like a menu row — the nav row's oq-04 ground and on-primary ink (HomeDockRound4,
           * kol-fxr 2026-10-31; was forced from AppFloatNav with `!` over the inline ground). The rest ground and ink ride
           * variables so the hover class can win without `!`. */
          className={`flex flex-col items-center justify-center rounded-full cursor-pointer flex-none bg-[var(--slot-bg)] text-[var(--slot-ink)]${dock && !active ? ' hover:bg-[var(--kol-oq-04)] hover:text-[var(--kol-surface-on-primary)]' : ''}${labels ? ' gap-0.5' : ''}`}
          style={{ width: slotW, height: slotH, padding: 0, border: 'none', '--slot-bg': active ? 'var(--kol-oq-16)' : 'transparent', '--slot-ink': ink(active) }}
        >
          {t.icon && <Icon name={t.icon} size={labels ? 24 : 28} />}
          {labels && <span className="truncate max-w-full px-1.5" style={{ fontFamily: 'var(--kol-font-family-mono)', fontSize: 11, lineHeight: 1.2, fontWeight: 600 }}>{t.label}</span>}
        </button>
      ))
    }
    return (
      <button
        key={t.id}
        type="button"
        onClick={() => onChange?.(t.id)}
        aria-current={active ? 'page' : undefined}
        /* the PHONE bar is icons alone (user 2026-10-23: *"skip the title and show just the icon bigger"*) — the
         * label is the button's accessible name */
        aria-label={phone ? t.label : undefined}
        className="flex-1 min-w-0 flex flex-col items-center justify-center gap-1 cursor-pointer"
        /* the PHONE bar wears the rail's row type and ink (review 2, § 7.1 — RAIL_ROW, the one constant the rail reads);
         * an inline stacked row keeps MobileTabBar's own */
        style={{ background: 'transparent', border: 'none', color: ink(active) }}
      >
        {t.icon && <Icon name={t.icon} size={phone ? 24 : 18} />}
        {/* helper is single-line chrome, which a tab label always is */}
        {!phone && <span className="kol-helper-10 truncate max-w-full px-1">{t.label}</span>}
      </button>
    )
  }
  /* the isCollapsed × — the bar's More slot, or (a whole pill, no split) the pill shrunk to one circle; present always so it cross-fades */
  const closeX = phone && !split && (
    <button
      type="button"
      aria-label="Close"
      aria-hidden={!isCollapsed}
      tabIndex={isCollapsed ? 0 : -1}
      onClick={onExpand}
      className="absolute flex items-center justify-center rounded-full cursor-pointer"
      style={{
        /* no fill — the × is the only glyph, a filled circle inside the circle read as two rings (user 2026-10-23) */
        ...(pill ? { right: 4, top: 4, width: TABBAR_PILL_TAB, height: TABBAR_PILL_TAB } : { right: 0, top: 0, bottom: 0, width: `${100 / tabs.length}%` }),
        background: 'transparent', border: 'none', color: RAIL_ROW.active,
        opacity: isCollapsed ? 1 : 0, pointerEvents: isCollapsed ? 'auto' : 'none', transition: `opacity ${COLLAPSE_MS}ms ease`,
      }}
    >
      <Icon name="x" size={pill ? 28 : 24} />
    </button>
  )
  const row = (
    <div className={`flex items-stretch ${pill ? 'flex-none' : 'flex-1 min-w-0'}`} style={{ gap: pill && !labels ? TABBAR_PILL_GAP : undefined, opacity: isCollapsed ? 0 : 1, pointerEvents: isCollapsed ? 'none' : 'auto', transition: `opacity ${COLLAPSE_MS}ms ease` }}>
      {inBar.map(slot)}
    </div>
  )
  if (!pill) {
    return (
      <nav
        className={`${phone ? 'kol-mobile-tabbar md:hidden fixed inset-x-0 bottom-0 z-[var(--kol-z-sticky)] ' : ''}flex items-stretch ${className}`.trim()}
        style={phone ? {
          height: TABBAR_H,
          /* the pill's own ground, not the page's — it floats OVER content, so a
           * transparent bar would show rows sliding through the labels */
          background: 'var(--kol-surface-primary)',
          borderTop: '1px solid var(--kol-oq-08)',
          paddingBottom: 'env(safe-area-inset-bottom, 0px)',
        } : { height: TABBAR_H }}
        aria-label={ariaLabel}
      >
        {row}
        {closeX}
      </nav>
    )
  }
  const barW = W - (split ? TABBAR_PILL_SPLIT_GAP + TABBAR_PILL_H : 0)
  return (
    <nav
      {...swipeProps}
      className={`kol-mobile-tabbar kol-mobile-tabbar-pill ${dock ? 'hidden md:flex' : 'md:hidden'} fixed z-[calc(var(--kol-z-sticky)+1)] flex items-stretch ${className}`.trim()}
      style={{
        /* THE PILL (user 2026-10-23, iOS Files beside the full-width bar; round 3's size, W16): floats off the bottom edge,
         * hugs its tabs. Anchored by its RIGHT edge at the centre line, so the collapse shrinks it toward where More was
         * and the × lands under the same thumb. */
        height: TABBAR_PILL_H,
        gap: TABBAR_PILL_SPLIT_GAP,
        ...(dock
          ? { left: 'calc(var(--kol-shell-rail-width, 48px) + 64px)', bottom: 64 }
          /* with a trailing slot the pill grows rightward from where a centred one would start — the slots never move */
          : trailing ? { left: `calc(50% - ${W / 2}px)`, [top ? 'top' : 'bottom']: inset }
          : { right: `calc(50% - ${W / 2}px)`, [top ? 'top' : 'bottom']: inset }),
        ...swipeProps.style,
      }}
      aria-label={ariaLabel}
    >
      <div
        className={`relative flex items-center rounded-full overflow-hidden ${material}`.trim()}
        style={{
          height: TABBAR_PILL_H,
          width: isCollapsed && !split ? TABBAR_PILL_H : trailing ? 'auto' : barW,
          padding: labels ? 3 : 4,
          border: edgeLine,
          ...solidLook,
          opacity: isCollapsed && split ? 0 : 1,
          pointerEvents: isCollapsed && split ? 'none' : undefined,
          transition: `width ${COLLAPSE_MS}ms ease, opacity ${COLLAPSE_MS}ms ease`,
        }}
      >
        {row}
        {trailing && !isCollapsed && <div className="flex flex-none items-center pl-3 pr-4">{trailing}</div>}
        {closeX}
      </div>
      {split && tip(isCollapsed ? { id: last.id, label: 'Close' } : last, (
        /* the split circle (round 3, iOS 27's grouped toolbar): ··· on its own, 8 off the bar; the × while collapsed */
        <button
          key={last.id}
          type="button"
          onClick={() => (isCollapsed ? onExpand?.() : onChange?.(last.id))}
          aria-current={!isCollapsed && (last.selected ?? last.id === value) ? 'page' : undefined}
          aria-label={isCollapsed ? 'Close' : last.label}
          className={`flex items-center justify-center rounded-full cursor-pointer flex-none ${material}`.trim()}
          style={{ width: TABBAR_PILL_H, height: TABBAR_PILL_H, padding: 0, border: edgeLine, ...solidLook, color: ink(isCollapsed || (last.selected ?? last.id === value)) }}
        >
          <Icon name={isCollapsed ? 'x' : last.icon} size={labels ? 24 : 28} />
        </button>
      ))}
    </nav>
  )
}

function UnderlineTabs({ tabs, value, onChange, onClose, onMinimise, wrap, type }) {
  /* `type="sans"` (2026-10-29, the user's ref — Adobe's tab strip): the neutral sans at 300 (his word, 2026-10-30), a 20px glyph at the
   * set's 1.5 stroke and a 1px underline (his word, 2026-10-30), a 40px row (his word, 2026-10-30), 24 between tabs — review 8: *"the problem … was thickness and stroke"* */
  const md = type === 'sans' || type === 'mono-light'
  const listRef = useRef(null)
  const activeIdx = tabs.findIndex((t) => t.id === value)

  const onKeyDown = (e) => {
    if ((e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') || !tabs.length) return
    e.preventDefault()
    const dir = e.key === 'ArrowRight' ? 1 : -1
    const next = ((activeIdx === -1 ? 0 : activeIdx) + dir + tabs.length) % tabs.length
    onChange?.(tabs[next].id)
    listRef.current?.querySelectorAll('[role="tab"]')[next]?.focus()
  }

  return (
    <div className={`flex items-stretch gap-4 ${wrap ? 'min-h-10' : 'h-10'}`}>
      {onClose && (
        /* the one close, at the rung whose glyph is the 12 this hand-rolled
         * (2026-09-03) — xs SOLO is 12, so the drawing does not move */
        <CloseButton onClick={onClose} size="xs" className="self-center" />
      )}

      <div ref={listRef} role="tablist" onKeyDown={onKeyDown} className={`flex items-stretch ${md ? 'gap-6' : 'gap-4'}${wrap ? ' flex-wrap gap-y-1' : ''}`}>
        {tabs.map((t, i) => {
          const isActive = t.id === value
          return (
            <button
              key={t.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              data-active={isActive || undefined}
              tabIndex={isActive || (activeIdx === -1 && i === 0) ? 0 : -1}
              onClick={() => onChange?.(t.id)}
              className={[
                `group ${md ? `${type === 'sans' ? 'kol-tab-sans' : 'kol-tab-mono-light'} kol-sans-body-02 font-light gap-2.5 border-b` : 'kol-mono-12 gap-2 border-b-2'} flex items-center cursor-pointer`,
                isActive
                  ? 'text-oq-96 border-fg'
                  : 'text-oq-48 hover:text-oq-80 border-transparent',
              ].join(' ')}
            >
              {/* a tab may carry its glyph before the label (2026-10-29, Adobe's Base color · Image · Color wheel) */}
              {/* the glyph in OPAQUE ink (icons take oq, never fg) — full when active, meta otherwise, full under the pointer */}
              {t.icon && <Icon name={t.icon} size={md ? 20 : 16} className={isActive ? 'text-oq-96' : 'text-oq-48 group-hover:text-oq-80'} />}
              {t.label}
            </button>
          )
        })}
      </div>

      {onMinimise && (
        <button
          type="button"
          onClick={onMinimise}
          aria-label="Minimise"
          className="ml-auto text-oq-48 hover:text-emphasis self-center"
          style={{ lineHeight: 0 }}
        >
          <Icon name="chevron-down" size={12} />
        </button>
      )}
    </div>
  )
}
