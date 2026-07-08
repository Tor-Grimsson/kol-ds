import React from 'react'

/**
 * ToggleSwitch — bare by default (2026-07-08 chrome law rewrite).
 *
 *   variant="bare" (default) — label + track, no box
 *   variant="primary"        — filled shell (surface-secondary), button geometry
 *   variant="outline"        — bordered shell (border-oq-16), button geometry
 *
 *   size="sm" / "md" (default) / "lg" — shells match button heights
 *     (26/32/40); the track scales with size in all variants.
 *
 * Legacy aliases: 'plain' → bare · 'default' (the old boxed look) → outline.
 * Type via kol-mono-{12,14,16}; no auto-uppercase — casing is authored at
 * the call site (KOL no-auto-casing rule).
 */

const SIZE_TYPE = { sm: 'kol-mono-12', md: 'kol-mono-14', lg: 'kol-mono-16' }
const LEGACY_VARIANTS = { plain: 'bare', default: 'outline' }

const ToggleSwitch = ({
  label,
  checked = false,
  onChange,
  onToggle,
  variant = 'bare',
  size = 'md',
  className = '',
  hint,
  ...props
}) => {
  const handleClick = () => {
    if (onToggle) onToggle(!checked)
    if (onChange) onChange(!checked)
  }

  const resolvedVariant = LEGACY_VARIANTS[variant] || variant

  const cls = [
    'toggle-switch',
    `toggle-switch--${resolvedVariant}`,
    `toggle-switch--${size}`,
    SIZE_TYPE[size],
    className,
  ].filter(Boolean).join(' ')

  return (
    <button
      type="button"
      className={cls}
      data-state={checked ? 'on' : 'off'}
      onClick={handleClick}
      aria-pressed={checked}
      {...props}
    >
      <span className="toggle-switch-label">
        {label}
        {hint ? (
          <span className="ml-2 opacity-60 kol-helper-10">
            {hint}
          </span>
        ) : null}
      </span>
      <span className="toggle-switch-indicator" aria-hidden="true" />
    </button>
  )
}

export default ToggleSwitch
