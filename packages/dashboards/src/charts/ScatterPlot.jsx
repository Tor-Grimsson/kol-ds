import useChartTooltip from '../shared/useChartTooltip'
import DashTooltip from '../shared/DashTooltip'

const ScatterPlot = ({
  data = [],
  maxX = 200,
  maxY = 3000,
  xLabels = [],
  yLabels = [],
  pointColor = 'var(--kol-palette-blue)',
  height = 320
}) => {
  const formatY = (v) => v === 0 ? '0' : v >= 1000 ? `${(v / 1000).toFixed(1).replace('.0', '')}K` : v
  const { activeIndex, handlers, containerHandlers, containerRef } = useChartTooltip()

  const minY = yLabels.length > 0 ? Math.min(...yLabels) : 0
  const rangeY = maxY - minY || 1
  const scaleY = (v) => ((v - minY) / rangeY) * 90 + 5
  const scaleX = (v) => (v / maxX) * 100

  return (
    <div className="flex">
      <div className="relative pr-2 shrink-0 w-10" style={{ height }}>
        {yLabels.map((yValue) => (
          <span
            key={yValue}
            className="absolute right-2 dash-caption text-fg-64"
            style={{ bottom: `${scaleY(yValue)}%`, transform: 'translateY(50%)' }}
          >
            {formatY(yValue)}
          </span>
        ))}
      </div>

      <div className="flex-1 flex flex-col min-w-0">
        <div className="relative rounded" style={{ height }} ref={containerRef} {...containerHandlers}>
          {yLabels.map((yValue) => (
            <div
              key={yValue}
              className="absolute left-0 right-0 border-t border-fg-08"
              style={{ bottom: `${scaleY(yValue)}%` }}
            />
          ))}

          {xLabels.map((xValue) => (
            <div
              key={xValue}
              className="absolute top-0 bottom-0 border-l border-fg-08"
              style={{ left: `${scaleX(xValue)}%` }}
            />
          ))}

          {data.map(point => (
            <span
              key={point.id}
              className={`absolute block dash-scatter-point ${activeIndex === point.id ? 'dash-chart-element--active' : ''}`}
              style={{
                background: pointColor,
                left: `${scaleX(point.x)}%`,
                bottom: `${scaleY(point.y)}%`,
                transform: 'translate(-50%, 50%)'
              }}
              {...handlers(point.id)}
            />
          ))}

          <DashTooltip visible={activeIndex !== null}>
            {activeIndex !== null && (() => {
              const point = data.find(p => p.id === activeIndex)
              if (!point) return null
              return (
                <div className="flex flex-col gap-0.5">
                  {point.id != null && <span className="dash-caption text-fg-64">{point.id}</span>}
                  <span className="dash-caption">x: {point.x}</span>
                  <span className="dash-caption">y: {point.y}</span>
                </div>
              )
            })()}
          </DashTooltip>
        </div>

        <div className="flex justify-between pt-2">
          <span className="dash-caption text-fg-64">0</span>
          {xLabels.map((xValue) => (
            <span key={xValue} className="dash-caption text-fg-64">{xValue}</span>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ScatterPlot
