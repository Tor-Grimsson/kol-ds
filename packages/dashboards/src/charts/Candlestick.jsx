import useChartTooltip from '../shared/useChartTooltip'
import DashTooltip from '../shared/DashTooltip'

const candlestickColors = {
  accent: 'var(--kol-palette-yellow)',
  neutral: 'var(--kol-palette-purple)'
}

const Candlestick = ({
  data = [],
  height = 288
}) => {
  const allValues = data.flatMap(d => [d.high, d.low, d.open, d.close])
  const minValue = Math.min(...allValues)
  const maxValue = Math.max(...allValues)
  const range = maxValue - minValue || 1
  const { activeIndex, handlers, containerHandlers, containerRef } = useChartTooltip()

  const scale = (value) => ((value - minValue) / range) * 80 + 10

  return (
    <div className="relative w-full rounded" style={{ height }} ref={containerRef} {...containerHandlers}>
      {[20, 40, 60, 80].map((y) => (
        <div
          key={y}
          className="absolute left-0 right-0 border-t border-fg-08"
          style={{ top: `${100 - y}%` }}
        />
      ))}

      <div className="absolute inset-0 flex items-end gap-3">
        {data.map((item, idx) => {
          const color = candlestickColors[item.variant] || candlestickColors.accent
          const scaledHigh = scale(item.high)
          const scaledLow = scale(item.low)
          const scaledOpen = scale(item.open)
          const scaledClose = scale(item.close)
          const wickHeight = Math.max(scaledHigh - scaledLow, 1)
          const bodyHeight = Math.max(Math.abs(scaledClose - scaledOpen), 3)
          const bodyBottom = Math.min(scaledOpen, scaledClose)

          return (
            <div
              key={idx}
              className={`relative flex-1 h-full ${activeIndex === idx ? 'dash-chart-element--active' : ''}`}
              {...handlers(idx)}
            >
              <span
                className="absolute left-1/2 -translate-x-1/2 w-[1.5px]"
                style={{ height: `${wickHeight}%`, bottom: `${scaledLow}%`, background: color }}
              />
              <span
                className="absolute left-1/2 -translate-x-1/2 w-2 rounded-sm"
                style={{ height: `${bodyHeight}%`, bottom: `${bodyBottom}%`, background: color }}
              />
            </div>
          )
        })}
      </div>

      <DashTooltip visible={activeIndex !== null}>
        {activeIndex !== null && data[activeIndex] && (
          <div className="grid grid-cols-2 gap-x-3 gap-y-0.5">
            <span className="dash-caption text-fg-64">O</span>
            <span className="dash-caption">{data[activeIndex].open}</span>
            <span className="dash-caption text-fg-64">H</span>
            <span className="dash-caption">{data[activeIndex].high}</span>
            <span className="dash-caption text-fg-64">L</span>
            <span className="dash-caption">{data[activeIndex].low}</span>
            <span className="dash-caption text-fg-64">C</span>
            <span className="dash-caption">{data[activeIndex].close}</span>
          </div>
        )}
      </DashTooltip>
    </div>
  )
}

export default Candlestick
