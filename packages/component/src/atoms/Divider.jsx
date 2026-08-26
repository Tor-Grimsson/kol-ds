import React from 'react'

/**
 * Divider - Horizontal or vertical divider line
 *
 * Simple atom for creating separator lines
 * Uses bg-fg-08 for consistent 8% opacity across themes by default
 * Vertical variant includes wrapper div for proper flex behavior
 *
 * @param {Object} props
 * @param {string} props.variant - 'horizontal' or 'vertical' (default: 'horizontal')
 * @param {string} props.className - Additional classes
 * @param {number} props.height - vertical variant only: the rule's height in px
 *   (default 16 — sized to the type it separates, not to the row)
 * @param {string} props.opacity - Opacity level (01, 02, 04, 08, 12, 16, 24, 32, 48, 64, 80, 88, 96) (default: '08')
 */
const Divider = ({ variant = 'horizontal', className = '', opacity = '08', inverse = false, height = 16 }) => {
  const isVertical = variant === 'vertical'
  const opacityClass = inverse ? `bg-fg-inverse-${opacity}` : `bg-fg-${opacity}`

  if (isVertical) {
    /* THE RULE IS CENTRED ON WHAT IT SEPARATES, not stretched to the row.
     *
     * This hardcoded `self-stretch` AHEAD of `className`, so the wrapper always
     * filled the flex line — a row whose height comes from 32px icon buttons
     * gave a rule taller than the 18px type beside it, and any `self-*` passed
     * from a call site lost to the hardcoded one. `align-self: center` with an
     * explicit height puts it back on the type; `height` stays overridable. */
    return (
      <div className={`flex self-center items-center justify-center ${className}`.trim()} style={{ height }}>
        <div className={opacityClass} style={{ width: '1px', height: '100%' }} />
      </div>
    )
  }

  return (
    <div className={className}>
      <div className={`${opacityClass} h-px w-full`} />
    </div>
  )
}

export default Divider
