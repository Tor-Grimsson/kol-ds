import React from 'react'

/* `variant="media"` (ContentFiltersCollection, kol-r2b2 2026-08-27): inside a
 * media frame the unchecked hairline vanished over a photo; this variant's
 * UNCHECKED box carries the media control's solid plate (`--kol-oq-12`) so it
 * reads over any image. Checked stays the white plate + black check.
 * `variant="float"` (float-everything W2 row 22, 2026-11-04): an 18 plate on oq-08 with no hairline; checked is the
 * bare check glyph on nothing; the label is the float panel role (Inter 13/500); focus ring on the plate, disabled 40%. */
const VARIANT_CLASS = { media: 'toggle-checkbox--media', float: 'toggle-checkbox--float' }
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
      className={`toggle-checkbox ${VARIANT_CLASS[variant] ?? ''} ${checked ? 'is-active' : ''} ${className}`.replace(/\s+/g, ' ').trim()}
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
      <span className={`toggle-checkbox-label ${variant === 'float' ? 'kol-float-panel' : 'kol-helper-12 tracking-[0.08em]'}`}>
        {label}
        {hint ? <span className={`ml-2 opacity-60 tracking-normal ${variant === 'float' ? 'kol-float-label' : 'kol-helper-10'}`}>{hint}</span> : null}
      </span>
    </label>
  )
}

export default ToggleCheckbox
