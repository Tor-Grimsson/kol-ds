import { useRef } from 'react'
import { Icon } from '@kolkrabbi/kol-loader'

/* taxonomy-ok: nests kol-loader's Icon */

/**
 * TabsRow — labeled underline tab strip: text tabs where the active tab gets
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
 */
export default function TabsRow({ tabs = [], value, onChange, onClose, onMinimise }) {
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
    <div className="flex items-stretch gap-4 px-3 h-10">
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="text-meta hover:text-emphasis self-center"
          style={{ lineHeight: 0 }}
        >
          <Icon name="close" size={12} />
        </button>
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
          className="ml-auto text-meta hover:text-emphasis self-center"
          style={{ lineHeight: 0 }}
        >
          <Icon name="chevron-down" size={12} />
        </button>
      )}
    </div>
  )
}
