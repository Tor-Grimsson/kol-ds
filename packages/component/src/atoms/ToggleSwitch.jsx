import React from 'react'

/**
 * ToggleSwitch — An on/off switch. bare by default (2026-07-08 chrome law rewrite).
 *
 *   variant="bare" (default) — label + track, no box
 *   variant="primary"        — filled shell (surface-secondary), button geometry
 *   variant="outline"        — bordered shell (border-oq-16), button geometry
 *   variant="float"          — the float switch (float-everything W2 row 21, 2026-11-04): a 32 × 20 track with a 14
 *                              thumb 3 in, off oq-16 / oq-64, on fg-64 / the emphasis ink, the label in Inter 500;
 *                              one size, the focus ring on the track, disabled 40%
 *   variant="kolbox"         — kolbox's switch (plan-2026-11-18-kolbox-system W31.2, 2026-11-18), carried class for class:
 *                              a 28 × 16 track with a 12 knob 2 in, inside a 28-high hit box at radius 4; off the oq-24
 *                              track and the ink knob, on the accent track and the on-accent knob; one size, no label
 *                              (name it with `aria-label`; a row's LabeledControl gives the words), role="switch" with
 *                              aria-checked, the focus ring the accent's, disabled 40%. Chrome in kol-theme
 *                              `.kol-toggle-switch--kolbox`.
 *
 *   variant="folio"          — Folio's switch (Folio migration batch A, 2026-11-22), carried class for class: a 20 × 12
 *                              track round an 8 knob that travels 8, the hit box 24 high; off the rule track, on the
 *                              accent, the knob the paper; one size, no label (`aria-label`), role="switch" with
 *                              aria-checked. Chrome in kol-theme `.kol-toggle-switch--folio`.
 *
 *   size="xs" / "sm" / "md" (default) / "lg" — shells match button heights
 *     (22/26/32/40); the track scales with size in all variants. xs is the
 *     panel rung (2026-09-01).
 *
 * `label` (and its `hint`) is DEPRECATED 2026-11-12 (plan-2026-11-12-one-header W6.1, LAW 17 — the user: *"illegal
 * toggleswitch that has LABEL!! no toggle with label is LABELEDCONTROL"*): a switch is the bare control; its words are a
 * `LabeledControl` (`horizontal`) around it. It still draws, and warns once in dev.
 *
 * Legacy aliases: 'plain' → bare · 'default' (the old boxed look) → outline.
 * Type via kol-mono-{12,14,16}; no auto-uppercase — casing is authored at
 * the call site (KOL no-auto-casing rule).
 */

const SIZE_TYPE = { xs: 'kol-mono-8', sm: 'kol-mono-12', md: 'kol-mono-14', lg: 'kol-mono-16' }
const LEGACY_VARIANTS = { plain: 'bare', default: 'outline' }
let warnedLabel = false

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

  if (import.meta.env?.DEV && (label != null || hint != null) && !warnedLabel) {
    warnedLabel = true
    console.warn('ToggleSwitch: `label` is deprecated — wrap the switch in <LabeledControl horizontal label="…">')
  }

  if (variant === 'kolbox') {
    return (
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={handleClick}
        className={`kol-toggle-switch--kolbox inline-flex h-(--kol-kolbox-ctl) shrink-0 items-center px-1 outline-none focus-visible:outline-solid focus-visible:outline-1 disabled:opacity-40 ${className}`}
        data-state={checked ? 'on' : 'off'}
        {...props}
      >
        <span className="kol-toggle-switch-track flex h-4 w-7 items-center rounded-full p-0.5 transition-colors">
          <span className={`kol-toggle-switch-knob size-3 rounded-full transition-transform${checked ? ' translate-x-3' : ''}`} />
        </span>
      </button>
    )
  }

  /* folio (Folio migration batch A, 2026-11-22): Folio's Switch carried class for class (apps/folio Chrome.jsx) */
  if (variant === 'folio') {
    return (
      <button type="button" role="switch" aria-checked={checked} onClick={handleClick} {...props}
        className={`kol-toggle-switch--folio relative h-[12px] w-[20px] shrink-0 rounded-full transition-colors before:absolute before:inset-x-0 before:top-1/2 before:h-[24px] before:-translate-y-1/2 before:content-[''] ${className}`}>
        <span className={`kol-toggle-switch-knob absolute left-[2px] top-[2px] size-[8px] rounded-full transition-transform ${checked ? 'translate-x-[8px]' : ''}`} />
      </button>
    )
  }

  const resolvedVariant = LEGACY_VARIANTS[variant] || variant
  const float = resolvedVariant === 'float'

  const cls = [
    'toggle-switch',
    `toggle-switch--${resolvedVariant}`,
    /* a float switch is one size and types in Inter (the theme's `.toggle-switch--float`) */
    !float && `toggle-switch--${size}`,
    !float && SIZE_TYPE[size],
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
