import React from 'react'

/* `variant="media"` (ContentFiltersCollection, kol-r2b2 2026-08-27): inside a
 * media frame the unchecked hairline vanished over a photo; this variant's
 * UNCHECKED box carries the media control's solid plate (`--kol-oq-12`) so it
 * reads over any image. Checked stays the white plate + black check. */
const ToggleCheckbox = ({
  label,
  checked = false,
  onChange,
  variant = 'default',
  className = '',
  hint,
  ...props
}) => {
  const handleChange = (event) => {
    const next = event.target.checked
    if (onChange) onChange(next)
  }

  return (
    <label
      className={`toggle-checkbox ${variant === 'media' ? 'toggle-checkbox--media' : ''} ${checked ? 'is-active' : ''} ${className}`.replace(/\s+/g, ' ').trim()}
      {...props}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={handleChange}
        aria-checked={checked}
      />
      <span className="toggle-checkbox-indicator" aria-hidden="true">
        <svg viewBox="0 0 12 9" width="12" height="9">
          <polyline points="1 5 4 8 11 1" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
      <span className="toggle-checkbox-label kol-helper-12 tracking-[0.08em]">
        {label}
        {hint ? <span className="ml-2 opacity-60 tracking-normal kol-helper-10">{hint}</span> : null}
      </span>
    </label>
  )
}

export default ToggleCheckbox
