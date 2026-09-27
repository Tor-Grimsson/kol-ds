import { useState, useRef } from 'react'
import { Icon } from '@kolkrabbi/kol-icons'

const PULSE_MS = 100

/**
 * IconButton — the icon-only panel key (kol-monitor's rack, lifted 2026-09-01):
 * 1px border, radius 3, `active` lights the LED-red border and a 15% fill;
 * `momentary` flashes the active style for ~100ms on click — trigger-style
 * actions. Use with `PanelLabel` for a text label.
 *
 * @param {string}   icon         icon name
 * @param {boolean}  active · disabled · momentary
 * @param {Function} onClick
 * @param {string}   title
 * @param {number}   iconSize     (default 10)
 * @param {ElementType} iconComponent  icon renderer seam (default kol-icons `Icon`)
 */
export default function IconButton({ icon, active, onClick, title, momentary, disabled, iconSize = 10, iconComponent: IconCmp = Icon }) {
  const [pulse, setPulse] = useState(false)
  const timeoutRef = useRef(null)
  const isActive = active || pulse

  const handleClick = (e) => {
    if (disabled) return
    if (momentary) {
      setPulse(true)
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
      timeoutRef.current = setTimeout(() => setPulse(false), PULSE_MS)
    }
    onClick?.(e)
  }

  return (
    <button
      type="button"
      title={title}
      onClick={handleClick}
      disabled={disabled}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 3,
        borderRadius: 3,
        border: '1px solid',
        borderColor: isActive ? 'var(--kol-ctl-led-red)' : 'var(--kol-fg-08)',
        backgroundColor: isActive ? 'color-mix(in srgb, var(--kol-ctl-led-red) 15%, transparent)' : 'transparent',
        cursor: disabled ? 'not-allowed' : 'pointer',
        color: isActive ? 'var(--kol-fg-88)' : 'var(--kol-fg-32)',
        opacity: disabled ? 0.3 : 1,
        transition: pulse ? 'none' : `border-color ${PULSE_MS}ms, background-color ${PULSE_MS}ms, color ${PULSE_MS}ms, opacity ${PULSE_MS}ms`,
      }}
    >
      <IconCmp name={icon} size={iconSize} />
    </button>
  )
}
