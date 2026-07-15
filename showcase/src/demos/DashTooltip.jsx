import { DashTooltip, useChartTooltip } from '@kolkrabbi/kol-dashboards'

export const stage = 'md'

// Inline fixture — a week of deploys per day.
const BARS = [
  { label: 'Mon', value: 42 },
  { label: 'Tue', value: 61 },
  { label: 'Wed', value: 34 },
  { label: 'Thu', value: 78 },
  { label: 'Fri', value: 55 },
  { label: 'Sat', value: 19 },
  { label: 'Sun', value: 27 },
]

const MAX = Math.max(...BARS.map((b) => b.value))

/* The cursor-following chart tooltip: useChartTooltip writes --tx / --ty onto
 * the container as the pointer moves and tracks the hovered index; DashTooltip
 * renders at that point while `visible`. Same wiring every kol chart uses. */
export default function DashTooltipDemo() {
  const { activeIndex, handlers, containerHandlers, containerRef } = useChartTooltip()
  return (
    <div className="dash-card">
      <div className="relative flex items-end gap-1 h-32" ref={containerRef} {...containerHandlers}>
        {BARS.map((bar, idx) => (
          <div
            key={bar.label}
            className={`flex-1 flex items-end h-full ${activeIndex === idx ? 'dash-chart-element--active' : ''}`}
            {...handlers(idx)}
          >
            <div
              className="w-full rounded-t-sm"
              style={{ height: `${Math.round((bar.value / MAX) * 100)}%`, backgroundColor: 'var(--kol-palette-blue)' }}
            />
          </div>
        ))}

        <DashTooltip visible={activeIndex !== null}>
          {activeIndex !== null && (
            <span className="dash-caption">
              {BARS[activeIndex].label}: {BARS[activeIndex].value}
            </span>
          )}
        </DashTooltip>
      </div>
      <div className="dash-card__footer">
        <span className="dash-detail text-fg-64">hover the bars</span>
      </div>
    </div>
  )
}
