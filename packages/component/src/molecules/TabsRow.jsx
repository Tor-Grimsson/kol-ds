import { useLayoutEffect, useRef, useState } from 'react'
import useScrollFade from '../hooks/useScrollFade.js'
import CloseButton from '../atoms/CloseButton.jsx'
import Button from '../atoms/Button.jsx'
import { Icon } from '@kolkrabbi/kol-icons'
import { RAIL_ROW } from '../hooks/railRow.js'

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
 * @param {'underline'|'chip'|'text'|'stacked'} [variant='underline']
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
 * @param {boolean} [shadow=false]  a drop shadow — for a pill that floats over content (the transport), not the nav
 * @param {'fill'|'circle'} [active='fill']  the lit slot: `fill` its whole 56 slot (today), `circle` a 44×44 1:1 circle
 * @param {boolean} [foldable=false]  a sideways swipe (> 40px) folds the pill into a 28×72 edge tab; a tap restores it
 * @param {boolean} [folded] · {Function} [onFoldChange]  the folded state, controlled (else the pill holds it)
 * @param {'left'|'right'} [foldSide='left']  the screen edge the tab sits on
 * Tabs are `{ id, label }` or `{ value, label }` (either key), plus `icon` for stacked; a stacked tab's `selected`
 * lights it whatever `value` is — action slots (the transport) light more than one.
 */
export const TABBAR_H = 56
/* the pill's air off the bottom edge — a page under it owes TABBAR_H + this */
export const TABBAR_PILL_INSET = 16
/* the pill's geometry, shared with the sheet that aligns to it: 56 per tab, 6px pad and 1px hairline each side */
export const TABBAR_PILL_TAB = 56
export const tabbarPillWidth = (count) => count * TABBAR_PILL_TAB + 14
/* the collapse's motion — one duration for the width and the glyph swap (300, user 2026-10-23: 180 read as abrupt) */
const COLLAPSE_MS = 300

export default function TabsRow({ tabs: raw = [], value, onChange, onClose, onMinimise, variant, look: lookLegacy, type = 'mono', filled = false, placement = 'inline', shape = 'bar', collapsed = false, onExpand, edge, border, shadow, dock, active, foldable, folded, onFoldChange, foldSide, size, tracked = false, overflow = 'scroll', ariaLabel, className, style }) {
  const tabs = raw.map((t) => ({ ...t, id: t.id ?? t.value }))
  const look = variant ?? lookLegacy ?? 'underline'
  const wrap = overflow === 'wrap'
  if (look === 'chip') return <Overflow mode={overflow} value={value}><ChipTabs tabs={tabs} value={value} onChange={onChange} size={size ?? 'sm'} filled={filled} ariaLabel={ariaLabel} className={`${wrap ? 'flex-wrap ' : ''}${className ?? ''}`} /></Overflow>
  if (look === 'text') return <Overflow mode={overflow} value={value}><TextTabs tabs={tabs} value={value} onChange={onChange} size={size ?? 14} tracked={tracked} className={`${wrap ? 'flex-wrap gap-y-2 ' : ''}${className ?? 'gap-6'}`} style={style} /></Overflow>
  if (look === 'stacked') return <StackedTabs tabs={tabs} value={value} onChange={onChange} placement={placement} shape={shape} collapsed={collapsed} onExpand={onExpand} edge={edge} border={border} shadow={shadow} dock={dock} active={active} foldable={foldable} folded={folded} onFoldChange={onFoldChange} foldSide={foldSide} ariaLabel={ariaLabel} className={className ?? ''} />
  return <Overflow mode={overflow} value={value}><UnderlineTabs tabs={tabs} value={value} onChange={onChange} onClose={onClose} onMinimise={onMinimise} wrap={wrap} type={type} /></Overflow>
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
function ChipTabs({ tabs, value, onChange, size, filled, ariaLabel, className }) {
  return (
    <div className={`flex items-center ${filled ? 'gap-2' : 'gap-1'} ${className}`.trim()} role="tablist" aria-label={ariaLabel}>
      {tabs.map((t) => {
        const active = t.id === value
        return (
          /* a tab is selected, not pressed — the role's own attribute replaces Button's aria-pressed */
          <Button key={t.id} variant={filled ? 'tab-filled' : 'tab'} size={size} pressed={active} role="tab" aria-selected={active} aria-pressed={undefined} data-active={active || undefined} onClick={() => onChange?.(t.id)}>
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

function StackedTabs({ tabs, value, onChange, placement, shape = 'bar', collapsed = false, onExpand, edge = 'bottom', border = true, shadow = false, dock = false, active: activeShape = 'fill', foldable = false, folded: foldedProp, onFoldChange, foldSide = 'left', ariaLabel = 'Sections', className }) {
  const [foldedOwn, setFoldedOwn] = useState(false)
  const swipe = useRef({ x: null, swiped: false })
  if (tabs.length === 0) return null
  const phone = placement === 'phone'
  const pill = phone && shape === 'pill'
  const isCollapsed = phone && collapsed
  const W = tabbarPillWidth(tabs.length)
  const top = pill && edge === 'top'
  const isFolded = pill && foldable && (foldedProp ?? foldedOwn)
  const setFolded = (v) => { if (foldedProp === undefined) setFoldedOwn(v); onFoldChange?.(v) }
  /* the edge offset: the pill's inset from the safe area on its edge */
  const inset = `calc(env(safe-area-inset-${top ? 'top' : 'bottom'}, 0px) + ${TABBAR_PILL_INSET}px)`
  const swipeProps = pill && foldable ? {
    onPointerDown: (e) => { swipe.current.x = e.clientX },
    onPointerUp: (e) => {
      const { x } = swipe.current
      swipe.current.x = null
      if (x != null && Math.abs(e.clientX - x) > FOLD_SWIPE) { swipe.current.swiped = true; setFolded(true) }
    },
    /* a swipe that ended on a slot must not also press it */
    onClickCapture: (e) => { if (swipe.current.swiped) { swipe.current.swiped = false; e.stopPropagation(); e.preventDefault() } },
    style: { touchAction: 'pan-y' },
  } : {}
  if (isFolded) {
    /* THE EDGE TAB (frame E): 28×72 flush to the screen edge, the pill's ground, no border, a chevron pointing back in */
    return (
      <button
        type="button"
        aria-label={`Show ${ariaLabel.toLowerCase()}`}
        onClick={() => setFolded(false)}
        className="kol-mobile-tabbar-tab md:hidden fixed z-[calc(var(--kol-z-sticky)+1)] flex items-center justify-center cursor-pointer"
        style={{
          [foldSide]: 0,
          [top ? 'top' : 'bottom']: `calc(env(safe-area-inset-${top ? 'top' : 'bottom'}, 0px) + ${TABBAR_PILL_INSET + 8}px)`,
          width: 28, height: 72, padding: 0, border: 'none',
          borderRadius: foldSide === 'left' ? '0 16px 16px 0' : '16px 0 0 16px',
          background: 'var(--kol-surface-secondary)', color: RAIL_ROW.rest,
        }}
      >
        <Icon name={foldSide === 'left' ? 'chevron-right' : 'chevron-left'} size={18} />
      </button>
    )
  }
  return (
    <nav
      {...swipeProps}
      className={`${pill
        ? `kol-mobile-tabbar kol-mobile-tabbar-pill ${dock ? 'hidden md:flex' : 'md:hidden'} fixed z-[calc(var(--kol-z-sticky)+1)] rounded-full p-1.5 overflow-hidden `
        : phone ? 'kol-mobile-tabbar md:hidden fixed inset-x-0 bottom-0 z-[var(--kol-z-sticky)] ' : ''}flex items-stretch ${className}`.trim()}
      style={pill ? {
        /* THE PILL (user 2026-10-23, iOS Files beside the full-width bar): floats off the bottom edge, hugs its tabs,
         * the same ground and hairline as the bar, no shadow (user 2026-10-23). Anchored by its RIGHT edge at the
         * centre line, so the collapse shrinks it toward where More was and the × lands under the same thumb. */
        height: TABBAR_H,
        width: isCollapsed ? TABBAR_H : W,
        ...(dock
          ? { left: 'calc(var(--kol-shell-rail-width, 48px) + 64px)', bottom: 64 }
          : { right: `calc(50% - ${W / 2}px)`, [top ? 'top' : 'bottom']: inset }),
        background: 'var(--kol-surface-secondary)',
        /* without the hairline the 1px it took stays, transparent, so the slots never move */
        border: `1px solid ${border ? 'var(--kol-oq-08)' : 'transparent'}`,
        boxShadow: shadow ? '0 8px 40px rgba(0, 0, 0, 0.45)' : undefined,
        transition: `width ${COLLAPSE_MS}ms ease`,
        ...swipeProps.style,
      } : phone ? {
        height: TABBAR_H,
        /* the pill's own ground, not the page's — it floats OVER content, so a
         * transparent bar would show rows sliding through the labels */
        background: 'var(--kol-surface-primary)',
        borderTop: '1px solid var(--kol-oq-08)',
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
      } : { height: TABBAR_H }}
      aria-label={ariaLabel}
    >
      <div className={`flex items-stretch ${pill ? 'flex-none' : 'flex-1 min-w-0'}`} style={{ width: pill ? W - 14 : undefined, opacity: isCollapsed ? 0 : 1, pointerEvents: isCollapsed ? 'none' : 'auto', transition: `opacity ${COLLAPSE_MS}ms ease` }}>
      {tabs.map((t) => {
        const active = t.selected ?? t.id === value
        const circle = pill && activeShape === 'circle'
        return (
          <button
            key={t.id}
            type="button"
            onClick={() => onChange?.(t.id)}
            aria-current={active ? 'page' : undefined}
            /* the PHONE bar is icons alone (user 2026-10-23: *"skip the title and show just the icon bigger"*) — the
             * label is the button's accessible name */
            aria-label={phone ? t.label : undefined}
            className={pill ? 'flex items-center justify-center rounded-full cursor-pointer' : 'flex-1 min-w-0 flex flex-col items-center justify-center gap-1 cursor-pointer'}
            /* the PHONE bar wears the rail's row type and ink (review 2, § 7.1 — RAIL_ROW, the one constant the rail reads);
             * an inline stacked row keeps MobileTabBar's own */
            style={{ background: pill && active && !circle ? 'var(--kol-oq-08)' : 'transparent', border: 'none', width: pill ? 56 : undefined, color: phone ? (active ? RAIL_ROW.active : RAIL_ROW.rest) : (active ? 'var(--kol-fg-default)' : 'var(--kol-fg-48)') }}
          >
            {/* the circle: 44×44, 1:1 inside the 56 slot (frame E — the fill stretched to the slot's width) */}
            {t.icon && (circle
              ? <span className="inline-flex items-center justify-center rounded-full" style={{ width: 44, height: 44, background: active ? 'var(--kol-oq-08)' : 'transparent' }}><Icon name={t.icon} size={28} /></span>
              : <Icon name={t.icon} size={pill ? 28 : phone ? 24 : 18} />)}
            {/* helper is single-line chrome, which a tab label always is */}
            {!phone && <span className="kol-helper-10 truncate max-w-full px-1">{t.label}</span>}
          </button>
        )
      })}
      </div>
      {phone && (
        /* the isCollapsed × — the pill's one tab-sized circle, the bar's More slot; present always so it cross-fades */
        <button
          type="button"
          aria-label="Close"
          aria-hidden={!isCollapsed}
          tabIndex={isCollapsed ? 0 : -1}
          onClick={onExpand}
          className="absolute flex items-center justify-center rounded-full cursor-pointer"
          style={{
            /* no fill — the × is the only glyph, a filled circle inside the circle read as two rings (user 2026-10-23) */
            ...(pill ? { right: 6, top: 6, width: TABBAR_H - 14, height: TABBAR_H - 14 } : { right: 0, top: 0, bottom: 0, width: `${100 / tabs.length}%` }),
            background: 'transparent', border: 'none', color: RAIL_ROW.active,
            opacity: isCollapsed ? 1 : 0, pointerEvents: isCollapsed ? 'auto' : 'none', transition: `opacity ${COLLAPSE_MS}ms ease`,
          }}
        >
          <Icon name="x" size={pill ? 28 : 24} />
        </button>
      )}
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
