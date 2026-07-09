import { useMemo } from 'react'
import useChartTooltip from '../shared/useChartTooltip'
import DashTooltip from '../shared/DashTooltip'

const DonutChart = ({
  segments = [],
  size = 120,
  thickness = 20,
  centerLabel,
  showLegend = false
}) => {
  const total = useMemo(() => segments.reduce((sum, s) => sum + s.value, 0), [segments])
  const { activeIndex, handlers, containerHandlers, containerRef } = useChartTooltip()

  const radius = (size - thickness) / 2
  const circumference = 2 * Math.PI * radius
  const center = size / 2

  const arcs = useMemo(() => {
    let offset = 0
    return segments.map((seg) => {
      const pct = total > 0 ? seg.value / total : 0
      const dash = pct * circumference
      const gap = circumference - dash
      const rotation = (offset / total) * 360
      offset += seg.value
      return { ...seg, dash, gap, rotation, pct }
    })
  }, [segments, total, circumference])

  return (
    <div className="inline-flex flex-col items-center gap-3">
      <div
        className="relative"
        style={{ width: size, height: size }}
        ref={containerRef}
        {...containerHandlers}
      >
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          {arcs.map((arc, i) => (
            <circle
              key={i}
              className={`dash-donut-segment ${activeIndex === i ? 'dash-chart-element--active' : ''}`}
              cx={center}
              cy={center}
              r={radius}
              fill="none"
              stroke={arc.color}
              strokeWidth={thickness}
              strokeDasharray={`${arc.dash} ${arc.gap}`}
              transform={`rotate(${arc.rotation - 90} ${center} ${center})`}
              style={{ cursor: 'default' }}
              {...handlers(i)}
            />
          ))}
        </svg>

        {centerLabel && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <span className="dash-body text-fg-88">{centerLabel}</span>
          </div>
        )}

        <DashTooltip visible={activeIndex !== null}>
          {activeIndex !== null && arcs[activeIndex] && (
            <span className="dash-caption">
              {arcs[activeIndex].label ? `${arcs[activeIndex].label}: ` : ''}{arcs[activeIndex].value} ({(arcs[activeIndex].pct * 100).toFixed(1)}%)
            </span>
          )}
        </DashTooltip>
      </div>

      {showLegend && (
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 justify-center">
          {segments.map((seg, i) => (
            <div key={i} className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: seg.color }} />
              <span className="dash-caption text-fg-64">{seg.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default DonutChart
