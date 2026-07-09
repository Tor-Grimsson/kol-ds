import React from 'react'

/**
 * GridCard - Wrapper for components in the dashboard grid
 *
 * Span configurations:
 * - '1x1': Single cell (default)
 * - '2x1': 2 columns × 1 row
 * - '2x2': 2 columns × 2 rows
 * - '3x2': 3 columns × 2 rows
 * - '4x2': 4 columns × 2 rows (full width, double height)
 * - '1x2': 1 column × 2 rows (tall card)
 * - '3x1': 3 columns × 1 row
 * - '4x1': 4 columns × 1 row (full width strip)
 *
 * @param {string} span - Grid span configuration
 * @param {string} className - Additional CSS classes
 * @param {React.ReactNode} children - Component to display
 * @param {boolean} asCard - Wrap in card styling (for non-component content)
 */
const GridCard = ({
  span = '1x1',
  className = '',
  children,
  asCard = false
}) => {
  const [cols, rows] = (span || '1x1').split('x').map(Number)

  const style = {
    gridColumn: `span ${cols || 1}`,
    gridRow: `span ${rows || 1}`
  }

  // If asCard, add card styling; otherwise just grid positioning
  const cardClass = asCard ? 'dash-card' : ''

  return (
    <div data-cols={cols || 1} style={style} className={`h-full ${cardClass} ${className}`.trim()}>
      {children}
    </div>
  )
}

export default GridCard
