import React from 'react'
import FeatureCard from './FeatureCard.jsx'

/**
 * FeatureGrid - Responsive layout of feature cards
 *
 * Foundry molecule that composes multiple FeatureCard atoms
 * Supports two layout variants:
 * - grid: 2-column grid (desktop), 1 column (mobile), 24px column gap, 16px row gap
 * - row: flex-row (desktop), flex-col (mobile), 16px gap
 * Tracks last hovered card to keep it active
 *
 * @param {Object} props
 * @param {Array<{title: string, description: string, icon?: string}>} props.features - Array of feature objects
 * @param {string} props.variant - Layout variant: 'grid' or 'row' (default: 'grid')
 * @param {string} props.className - Additional classes
 */
const FeatureGrid = ({ features, variant = 'grid', className = '' }) => {
  const layoutClass = variant === 'row'
    ? 'flex flex-col md:flex-row gap-8 w-full'
    : 'grid grid-cols-1 md:grid-cols-2 gap-8'

  const cardClass = variant === 'row' ? 'flex-1' : ''

  return (
    <div className={`${layoutClass} ${className}`.trim()}>
      {features.map((feature, index) => (
        <FeatureCard
          key={index}
          title={feature.title}
          description={feature.description}
          icon={feature.icon}
          className={cardClass}
        />
      ))}
    </div>
  )
}

export default FeatureGrid
