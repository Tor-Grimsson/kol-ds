import useChartTooltip from '../shared/useChartTooltip'
import DashTooltip from '../shared/DashTooltip'

const Heatmap = ({
  data = [],
  rows = [],
  cols = [],
  colorScale = ['var(--kol-palette-blue)', 'var(--kol-palette-yellow)'],
  cellSize = 32,
  fill = false
}) => {
  const { activeIndex, handlers, containerHandlers, containerRef } = useChartTooltip()

  const cells = Array.isArray(data[0])
    ? data.flatMap((row, r) => row.map((value, c) => ({ row: r, col: c, value })))
    : data

  const maxValue = Math.max(...cells.map(c => c.value), 1)
  const colCount = cols.length || (Array.isArray(data[0]) ? data[0].length : Math.max(...cells.map(c => c.col)) + 1)

  return (
    <div className={`flex gap-2 min-w-0${fill ? ' h-full' : ''}`} ref={containerRef} {...containerHandlers}>
      {rows.length > 0 && (
        <div
          className="grid shrink-0 items-center"
          style={{ gridTemplateRows: `repeat(${rows.length}, ${fill ? '1fr' : `${cellSize}px`})`, gap: '4px' }}
        >
          {rows.map((label, i) => (
            <span key={i} className="dash-caption text-fg-64 text-right">{label}</span>
          ))}
        </div>
      )}

      <div className="flex-1 flex flex-col gap-2 min-w-0">
        <div
          className={`grid gap-1${fill ? ' flex-1' : ''}`}
          style={{
            gridTemplateColumns: `repeat(${colCount}, 1fr)`,
            gridAutoRows: fill ? '1fr' : `${cellSize}px`
          }}
        >
          {cells.map((cell, idx) => {
            const pct = Math.round((cell.value / maxValue) * 100)
            return (
              <div
                key={idx}
                className={`dash-heatmap-cell rounded-sm ${activeIndex === idx ? 'dash-chart-element--active' : ''}`}
                style={{
                  backgroundColor: `color-mix(in srgb, ${colorScale[1]} ${pct}%, ${colorScale[0]})`
                }}
                {...handlers(idx)}
              />
            )
          })}
        </div>

        {cols.length > 0 && (
          <div className="flex justify-around">
            {cols.map((label, i) => (
              <span key={i} className="dash-caption text-fg-64 text-center">{label}</span>
            ))}
          </div>
        )}

        <DashTooltip visible={activeIndex !== null}>
          {activeIndex !== null && cells[activeIndex] && (
            <span className="dash-caption">
              {rows[cells[activeIndex].row] ?? `R${cells[activeIndex].row}`},{' '}
              {cols[cells[activeIndex].col] ?? `C${cells[activeIndex].col}`}:{' '}
              {cells[activeIndex].value}
            </span>
          )}
        </DashTooltip>
      </div>
    </div>
  )
}

export default Heatmap
