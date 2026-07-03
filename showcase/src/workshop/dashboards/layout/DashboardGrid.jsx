import React from 'react'

/**
 * DashboardGrid - Flexible grid system for chess dashboard layouts
 *
 * Layouts:
 * - '4-col': 4 columns × 200px rows (default)
 * - '6-col': 6 columns × 180px rows (dense)
 * - 'board-focus': 3fr/2fr columns × 240px rows (board emphasis)
 * - '3-col': 3 columns × 200px rows (simple)
 *
 * @param {string} layout - Grid configuration preset
 * @param {string} className - Additional CSS classes
 * @param {React.ReactNode} children - GridCard components
 */
const DashboardGrid = ({
  layout = '4-col',
  className = '',
  children
}) => {
  return (
    <div style={{ containerType: 'inline-size' }}>
      <div className={`dash-grid ${className}`.trim()}>
        {children}
      </div>
    </div>
  )
}

export default DashboardGrid
