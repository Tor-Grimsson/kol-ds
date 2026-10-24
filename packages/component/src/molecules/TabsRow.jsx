import { useRef } from 'react'
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
 * ONE TAB COMPONENT, FOUR LOOKS (TabsStackedLayout, kol-monitor 2026-10-17 — four components drew one control):
 * @param {'underline'|'chip'|'text'|'stacked'} [look='underline']
 *        underline — this row, as it always was
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
 * Tabs are `{ id, label }` or `{ value, label }` (either key), plus `icon` for stacked.
 */
export const TABBAR_H = 56
/* the pill's air off the bottom edge — a page under it owes TABBAR_H + this */
export const TABBAR_PILL_INSET = 16
/* the pill's geometry, shared with the sheet that aligns to it: 56 per tab, 6px pad and 1px hairline each side */
export const TABBAR_PILL_TAB = 56
export const tabbarPillWidth = (count) => count * TABBAR_PILL_TAB + 14
/* the collapse's motion — one duration for the width and the glyph swap (300, user 2026-10-23: 180 read as abrupt) */
const COLLAPSE_MS = 300

export default function TabsRow({ tabs: raw = [], value, onChange, onClose, onMinimise, look = 'underline', placement = 'inline', shape = 'bar', collapsed = false, onExpand, size, tracked = false, ariaLabel, className, style }) {
  const tabs = raw.map((t) => ({ ...t, id: t.id ?? t.value }))
  if (look === 'chip') return <ChipTabs tabs={tabs} value={value} onChange={onChange} size={size ?? 'sm'} ariaLabel={ariaLabel} className={className ?? ''} />
  if (look === 'text') return <TextTabs tabs={tabs} value={value} onChange={onChange} size={size ?? 14} tracked={tracked} className={className ?? 'gap-6'} style={style} />
  if (look === 'stacked') return <StackedTabs tabs={tabs} value={value} onChange={onChange} placement={placement} shape={shape} collapsed={collapsed} onExpand={onExpand} className={className ?? ''} />
  return <UnderlineTabs tabs={tabs} value={value} onChange={onChange} onClose={onClose} onMinimise={onMinimise} />
}

/* chip — TabChips verbatim */
function ChipTabs({ tabs, value, onChange, size, ariaLabel, className }) {
  return (
    <div className={`flex items-center gap-1 ${className}`.trim()} role="tablist" aria-label={ariaLabel}>
      {tabs.map((t) => {
        const active = t.id === value
        return (
          /* a tab is selected, not pressed — the role's own attribute replaces Button's aria-pressed */
          <Button key={t.id} variant="tab" size={size} pressed={active} role="tab" aria-selected={active} aria-pressed={undefined} onClick={() => onChange?.(t.id)}>
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
function StackedTabs({ tabs, value, onChange, placement, shape = 'bar', collapsed = false, onExpand, className }) {
  if (tabs.length === 0) return null
  const phone = placement === 'phone'
  const pill = phone && shape === 'pill'
  const isCollapsed = phone && collapsed
  const W = tabbarPillWidth(tabs.length)
  return (
    <nav
      className={`${pill
        ? 'kol-mobile-tabbar kol-mobile-tabbar-pill md:hidden fixed z-[calc(var(--kol-z-sticky)+1)] rounded-full p-1.5 overflow-hidden '
        : phone ? 'kol-mobile-tabbar md:hidden fixed inset-x-0 bottom-0 z-[var(--kol-z-sticky)] ' : ''}flex items-stretch ${className}`.trim()}
      style={pill ? {
        /* THE PILL (user 2026-10-23, iOS Files beside the full-width bar): floats off the bottom edge, hugs its tabs,
         * the same ground and hairline as the bar, no shadow (user 2026-10-23). Anchored by its RIGHT edge at the
         * centre line, so the collapse shrinks it toward where More was and the × lands under the same thumb. */
        height: TABBAR_H,
        width: isCollapsed ? TABBAR_H : W,
        right: `calc(50% - ${W / 2}px)`,
        bottom: `calc(env(safe-area-inset-bottom, 0px) + ${TABBAR_PILL_INSET}px)`,
        background: 'var(--kol-surface-secondary)',
        border: '1px solid var(--kol-oq-08)',
        transition: `width ${COLLAPSE_MS}ms ease`,
      } : phone ? {
        height: TABBAR_H,
        /* the pill's own ground, not the page's — it floats OVER content, so a
         * transparent bar would show rows sliding through the labels */
        background: 'var(--kol-surface-primary)',
        borderTop: '1px solid var(--kol-oq-08)',
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
      } : { height: TABBAR_H }}
      aria-label="Sections"
    >
      <div className={`flex items-stretch ${pill ? 'flex-none' : 'flex-1 min-w-0'}`} style={{ width: pill ? W - 14 : undefined, opacity: isCollapsed ? 0 : 1, pointerEvents: isCollapsed ? 'none' : 'auto', transition: `opacity ${COLLAPSE_MS}ms ease` }}>
      {tabs.map((t) => {
        const active = t.id === value
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
            style={{ background: pill && active ? 'var(--kol-oq-08)' : 'transparent', border: 'none', width: pill ? 56 : undefined, color: phone ? (active ? RAIL_ROW.active : RAIL_ROW.rest) : (active ? 'var(--kol-fg-default)' : 'var(--kol-fg-48)') }}
          >
            {t.icon && <Icon name={t.icon} size={pill ? 28 : phone ? 24 : 18} />}
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

function UnderlineTabs({ tabs, value, onChange, onClose, onMinimise }) {
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
    <div className="flex items-stretch gap-4 h-10">
      {onClose && (
        /* the one close, at the rung whose glyph is the 12 this hand-rolled
         * (2026-09-03) — xs SOLO is 12, so the drawing does not move */
        <CloseButton onClick={onClose} size="xs" className="self-center" />
      )}

      <div ref={listRef} role="tablist" onKeyDown={onKeyDown} className="flex items-stretch gap-4">
        {tabs.map((t, i) => {
          const isActive = t.id === value
          return (
            <button
              key={t.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              tabIndex={isActive || (activeIdx === -1 && i === 0) ? 0 : -1}
              onClick={() => onChange?.(t.id)}
              className={[
                'kol-mono-12 flex items-center cursor-pointer border-b-2',
                isActive
                  ? 'text-emphasis border-fg'
                  : 'text-meta hover:text-emphasis border-transparent',
              ].join(' ')}
            >
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
