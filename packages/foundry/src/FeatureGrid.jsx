import { useState } from 'react'
import FeatureCard from './FeatureCard.jsx'

/**
 * FeatureGrid — responsive layout of FeatureCard atoms. Tracks the last-hovered
 * card to keep it visually active.
 *
 * Layout variants:
 * - `grid`: 2-col (desktop) / 1-col (mobile).
 * - `row`: flex-row (desktop) / flex-col (mobile).
 *
 * @param {Object} props
 * @param {Array<{title:string, description:string, icon?:string}>} props.features - Feature objects.
 * @param {'grid'|'row'} props.variant - Layout variant (default 'grid').
 * @param {string} props.className - Additional classes.
 */
const FeatureGrid = ({ features, variant = 'grid', className = '' }) => {
  const [activeIndex, setActiveIndex] = useState(null)

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
          isActive={activeIndex === index}
          onMouseEnter={() => setActiveIndex(index)}
          className={cardClass}
        />
      ))}
    </div>
  )
}

export default FeatureGrid
