import { useRef } from 'react'
import CloseButton from '../atoms/CloseButton.jsx'
import Button from '../atoms/Button.jsx'
import { Icon } from '@kolkrabbi/kol-icons'

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
 * Tabs are `{ id, label }` or `{ value, label }` (either key), plus `icon` for stacked.
 */
export const TABBAR_H = 56

export default function TabsRow({ tabs: raw = [], value, onChange, onClose, onMinimise, look = 'underline', placement = 'inline', size, tracked = false, ariaLabel, className, style }) {
  const tabs = raw.map((t) => ({ ...t, id: t.id ?? t.value }))
  if (look === 'chip') return <ChipTabs tabs={tabs} value={value} onChange={onChange} size={size ?? 'sm'} ariaLabel={ariaLabel} className={className ?? ''} />
  if (look === 'text') return <TextTabs tabs={tabs} value={value} onChange={onChange} size={size ?? 14} tracked={tracked} className={className ?? 'gap-6'} style={style} />
  if (look === 'stacked') return <StackedTabs tabs={tabs} value={value} onChange={onChange} placement={placement} className={className ?? ''} />
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
function StackedTabs({ tabs, value, onChange, placement, className }) {
  if (tabs.length === 0) return null
  const phone = placement === 'phone'
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
      aria-label="Sections"
    >
      {tabs.map((t) => {
        const active = t.id === value
        return (
          <button
            key={t.id}
            type="button"
            onClick={() => onChange?.(t.id)}
            aria-current={active ? 'page' : undefined}
            className="flex-1 min-w-0 flex flex-col items-center justify-center gap-1 cursor-pointer"
            style={{ background: 'transparent', border: 'none', color: active ? 'var(--kol-fg-default)' : 'var(--kol-fg-48)' }}
          >
            {t.icon && <Icon name={t.icon} size={18} />}
            {/* helper is single-line chrome, which a tab label always is */}
            <span className="kol-helper-10 truncate max-w-full px-1">{t.label}</span>
          </button>
        )
      })}
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
