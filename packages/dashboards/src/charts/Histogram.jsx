import useChartTooltip from '../shared/useChartTooltip'
import DashTooltip from '../shared/DashTooltip'

const Histogram = ({
  data = [],
  barColor = 'var(--kol-accent-primary)'
}) => {
  const maxCount = Math.max(...data.map(d => d.count), 1)
  const { activeIndex, handlers, containerHandlers, containerRef } = useChartTooltip()

  return (
    <div className="flex min-w-0 flex-1 min-h-0">
      <div className="flex flex-col justify-between pr-2 shrink-0">
        <span className="dash-caption text-fg-64 text-right">{maxCount}</span>
        <span className="dash-caption text-fg-64 text-right">{Math.round(maxCount / 2)}</span>
        <span className="dash-caption text-fg-64 text-right">0</span>
      </div>

      <div className="flex-1 flex flex-col gap-2 min-w-0" ref={containerRef} {...containerHandlers}>
        <div className="relative flex items-end gap-1 flex-1">
          {data.map((bucket, idx) => {
            const pct = Math.round((bucket.count / maxCount) * 100)
            return (
              <div
                key={idx}
                className={`flex-1 flex items-end min-w-0 h-full ${activeIndex === idx ? 'dash-chart-element--active' : ''}`}
                {...handlers(idx)}
              >
                <div
                  className="w-full rounded-t-sm"
                  style={{ height: `${pct}%`, backgroundColor: barColor }}
                />
              </div>
            )
          })}

          <DashTooltip visible={activeIndex !== null}>
            {activeIndex !== null && data[activeIndex] && (
              <span className="dash-caption">{data[activeIndex].range}: {data[activeIndex].count}</span>
            )}
          </DashTooltip>
        </div>

        <div className="flex items-start gap-1">
          {data.map((bucket, idx) => (
            <div key={idx} className="flex-1 flex flex-col items-center min-w-0 overflow-hidden">
              <span className="dash-caption text-fg-64 truncate w-full text-center">{bucket.range}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Histogram
