import { useState } from 'react'
import useCountUp from '../shared/useCountUp'

const DashMetricCard = ({
  label,
  value,
  delta,
  borderColor,
  metrics,
  sparkline,
  className = ''
}) => {
  const [activeIdx, setActiveIdx] = useState(0)
  const [fading, setFading] = useState(false)

  const isInteractive = Array.isArray(metrics) && metrics.length > 1
  const current = isInteractive ? metrics[activeIdx] : { label, value, delta, borderColor }

  const borderStyle = current.borderColor
    ? { borderLeftWidth: '3px', borderLeftColor: current.borderColor }
    : undefined

  const { displayValue, ref: countRef } = useCountUp(current.value, {
    enabled: current.value != null
  })

  const handleClick = () => {
    if (!isInteractive) return
    setFading(true)
    setTimeout(() => {
      setActiveIdx((activeIdx + 1) % metrics.length)
      setFading(false)
    }, 150)
  }

  return (
    <div
      className={`dash-card ${isInteractive ? 'dash-metric--interactive' : ''} ${className}`.trim()}
      style={borderStyle}
      onClick={handleClick}
    >
      <span className="dash-detail text-fg-64">{current.label}</span>
      <span className={`dash-value dash-metric-value ${fading ? 'dash-metric-value--fading' : ''}`} ref={countRef}>
        {displayValue}
      </span>
      {current.delta && <span className="dash-body text-fg-80">{current.delta}</span>}
      {sparkline && <div className="mt-auto">{sparkline}</div>}
      {isInteractive && (
        <div className="dash-metric-dots">
          {metrics.map((_, idx) => (
            <span key={idx} className={`dash-metric-dot ${idx === activeIdx ? 'dash-metric-dot--active' : ''}`} />
          ))}
        </div>
      )}
    </div>
  )
}

export default DashMetricCard
