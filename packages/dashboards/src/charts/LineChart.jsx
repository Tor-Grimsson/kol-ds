import { useMemo } from 'react'
import useChartTooltip from '../shared/useChartTooltip'
import DashTooltip from '../shared/DashTooltip'

const SVG_HEIGHT = 100

const normalizeAll = (seriesArr) => {
  const allValues = seriesArr.flatMap(s => s.data.map(d => d.y))
  const min = Math.min(...allValues)
  const max = Math.max(...allValues)
  const range = max - min || 1

  return seriesArr.map(s => ({
    ...s,
    points: s.data.map((d, i) => ({
      x: (i / Math.max(s.data.length - 1, 1)) * 100,
      y: SVG_HEIGHT - ((d.y - min) / range) * (SVG_HEIGHT * 0.8) - SVG_HEIGHT * 0.1,
      raw: d
    }))
  }))
}

const buildPath = (points) =>
  points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(2)} ${p.y.toFixed(2)}`).join(' ')

const buildAreaPath = (linePath) =>
  `${linePath} L 100 ${SVG_HEIGHT} L 0 ${SVG_HEIGHT} Z`

const LineChart = ({
  data,
  series,
  height = 240,
  fill = false,
  xLabels,
  yLabels,
  showArea = false,
  showDots = false
}) => {
  const resolvedSeries = useMemo(() => {
    if (series) return series
    if (data) return [{ data, color: 'var(--kol-accent-primary)' }]
    return []
  }, [data, series])

  const normalizedSeries = useMemo(() => normalizeAll(resolvedSeries), [resolvedSeries])

  const { activeIndex, handlers, containerHandlers, containerRef } = useChartTooltip()

  const gradientIds = normalizedSeries.map((_, i) => `line-area-grad-${i}`)

  return (
    <div className={`flex min-w-0${fill ? ' h-full' : ''}`}>
      {yLabels && (
        <div className="flex flex-col justify-between pr-2 shrink-0" style={fill ? undefined : { height }}>
          {[...yLabels].reverse().map((label, i) => (
            <span key={i} className="dash-caption text-fg-64 text-right">{label}</span>
          ))}
        </div>
      )}

      <div className="flex-1 flex flex-col gap-2 min-w-0" ref={containerRef} {...containerHandlers}>
        <div className={`relative${fill ? ' flex-1' : ''}`} style={fill ? undefined : { height }}>
          <svg
            className="absolute inset-0 w-full h-full"
            viewBox={`0 0 100 ${SVG_HEIGHT}`}
            preserveAspectRatio="none"
          >
            <defs>
              {normalizedSeries.map((s, i) => (showArea || s.fill) && (
                <linearGradient key={i} id={gradientIds[i]} x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor={s.color} stopOpacity="0.3" />
                  <stop offset="100%" stopColor={s.color} stopOpacity="0" />
                </linearGradient>
              ))}
            </defs>

            {normalizedSeries.map((s, i) => {
              const path = buildPath(s.points)
              return (
                <g key={i}>
                  {(showArea || s.fill) && (
                    <path
                      className="dash-line-area"
                      d={buildAreaPath(path)}
                      fill={`url(#${gradientIds[i]})`}
                    />
                  )}
                  <path
                    className="dash-line-path"
                    d={path}
                    fill="none"
                    stroke={s.color}
                    strokeWidth="2"
                    strokeLinejoin="round"
                    strokeLinecap="round"
                    vectorEffect="non-scaling-stroke"
                  />
                </g>
              )
            })}
          </svg>

          {showDots && normalizedSeries.map((s, si) =>
            s.points.map((p, pi) => (
              <span
                key={`${si}-${pi}`}
                className={`absolute block w-2 h-2 rounded-full ${activeIndex === pi ? 'dash-chart-element--active' : ''}`}
                style={{
                  backgroundColor: s.color,
                  left: `${p.x}%`,
                  top: `${p.y}%`,
                  transform: 'translate(-50%, -50%)'
                }}
                {...handlers(pi)}
              />
            ))
          )}

          {!showDots && normalizedSeries[0]?.points.map((p, pi) => (
            <span
              key={pi}
              className="absolute top-0 bottom-0"
              style={{ left: `${p.x}%`, width: `${100 / Math.max(normalizedSeries[0].points.length - 1, 1)}%`, transform: 'translateX(-50%)' }}
              {...handlers(pi)}
            />
          ))}

          <DashTooltip visible={activeIndex !== null}>
            {activeIndex !== null && (
              <div className="flex flex-col gap-0.5">
                {normalizedSeries.map((s, si) => {
                  const pt = s.points[activeIndex]
                  if (!pt) return null
                  return (
                    <span key={si} className="dash-caption">
                      {pt.raw.x != null ? `${pt.raw.x}: ` : ''}{pt.raw.y}
                    </span>
                  )
                })}
              </div>
            )}
          </DashTooltip>
        </div>

        {xLabels && (
          <div className="flex justify-between">
            {xLabels.map((label, i) => (
              <span key={i} className="dash-caption text-fg-64">{label}</span>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default LineChart
