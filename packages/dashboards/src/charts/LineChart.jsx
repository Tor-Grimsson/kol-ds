/* LineChart — one or more series as lines over a plot, hover tooltips, optional area and dots, y labels left and x
 * labels under.
 *
 * `variant="float"` (float-everything W10 row 153, 2026-11-04) is the exploration's traffic trend: a head row with the
 * metric selector (`tabs` + `tab` + `onTab`, KOL tab buttons) and a `Legend` from `legend` + `interval`; the y scale in
 * mono ruler at fg-64 with a grid rule per label (fg-08); the series in the ink at 1.5 — a series with `dashed` draws at
 * 1 dashed in fg-48 (the previous period), `fill` or `showArea` a faint area; `peak` (an index) marks the high point
 * with a dot and a guide; the date axis in ruler under. `rules` sets the grid rule count without a scale (default one
 * per y label, else 5). The record card form is a `Card variant="float"` with `title`, `meta` and `value` around it,
 * `rules` 4 and `xLabels` ['30 days ago', 'Today']. */
import { useId, useMemo } from 'react'
import { Button } from '@kolkrabbi/kol-component'
import useChartTooltip from '../shared/useChartTooltip.js'
import DashTooltip from '../shared/DashTooltip.jsx'
import Legend from './Legend.jsx'

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
  showDots = false,
  variant,
  tabs,
  tab,
  onTab,
  legend,
  interval,
  peak,
  rules
}) => {
  const resolvedSeries = useMemo(() => {
    if (series) return series
    if (data) return [{ data, color: 'var(--kol-accent-primary)' }]
    return []
  }, [data, series])

  const normalizedSeries = useMemo(() => normalizeAll(resolvedSeries), [resolvedSeries])

  const tooltip = useChartTooltip()
  const { activeIndex, handlers, containerHandlers, containerRef } = tooltip

  if (variant === 'float') {
    return (
      <FloatLineChart normalized={normalizedSeries} tooltip={tooltip} height={height} fill={fill} xLabels={xLabels} yLabels={yLabels}
        showArea={showArea} tabs={tabs} tab={tab} onTab={onTab} legend={legend} interval={interval} peak={peak} rules={rules} />
    )
  }

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

/* the float plot: selector + legend over it, the scale and its grid rules, the ink line, a dashed comparison, the peak */
function FloatLineChart({ normalized, tooltip, height, fill, xLabels, yLabels, showArea, tabs, tab, onTab, legend, interval, peak, rules: ruleCount }) {
  const { activeIndex, handlers, containerHandlers, containerRef } = tooltip
  const gid = useId()
  const rules = Math.max(2, ruleCount ?? yLabels?.length ?? 5)
  const peakPt = peak != null ? normalized[0]?.points[peak] : null
  const first = normalized[0]?.points ?? []
  return (
    <div className={`flex flex-col gap-4 min-w-0${fill ? ' h-full' : ''}`}>
      {(tabs || legend) && (
        <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 min-w-0">
          <span className="flex items-center gap-1">
            {tabs?.map((t) => <Button key={t.key} variant="tab" size="sm" pressed={t.key === tab} onClick={() => onTab?.(t.key)}>{t.label}</Button>)}
          </span>
          {legend && <Legend items={legend} interval={interval} />}
        </div>
      )}
      <div className={`flex gap-3 min-w-0${fill ? ' flex-1 min-h-0' : ''}`}>
        {yLabels && (
          <div className="flex flex-col justify-between w-10 shrink-0 kol-float-ruler text-fg-64 tabular-nums" style={fill ? undefined : { height }}>
            {[...yLabels].reverse().map((label, i) => <span key={i} className="leading-none">{label}</span>)}
          </div>
        )}
        <div className="flex-1 flex flex-col gap-3 min-w-0" ref={containerRef} {...containerHandlers}>
          <div className={`relative${fill ? ' flex-1' : ''}`} style={fill ? undefined : { height }}>
            {Array.from({ length: rules }, (_, i) => (
              <span key={i} className="absolute left-0 right-0 h-px bg-fg-08" style={{ top: `${(i / (rules - 1)) * 100}%`, transform: i === rules - 1 ? 'translateY(-100%)' : undefined }} aria-hidden="true" />
            ))}
            {peakPt && <span className="absolute top-0 bottom-0 w-px bg-fg-16" style={{ left: `${peakPt.x}%` }} aria-hidden="true" />}
            <svg className="absolute inset-0 w-full h-full" viewBox={`0 0 100 ${SVG_HEIGHT}`} preserveAspectRatio="none">
              <defs>
                <linearGradient id={gid} x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="var(--kol-surface-on-primary)" stopOpacity="0.08" />
                  <stop offset="100%" stopColor="var(--kol-surface-on-primary)" stopOpacity="0.02" />
                </linearGradient>
              </defs>
              {normalized.map((s, i) => {
                const path = buildPath(s.points)
                const color = s.color ?? (s.dashed ? 'var(--kol-fg-48)' : 'var(--kol-surface-on-primary)')
                return (
                  <g key={i}>
                    {(showArea || s.fill) && !s.dashed && <path d={buildAreaPath(path)} fill={`url(#${gid})`} />}
                    <path d={path} fill="none" stroke={color} strokeWidth={s.dashed ? 1 : 1.5} strokeDasharray={s.dashed ? '3 3' : undefined}
                      strokeLinejoin="round" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
                  </g>
                )
              })}
            </svg>
            {peakPt && (
              <span className="absolute block w-[7px] h-[7px] rounded-full bg-fg-96" aria-hidden="true"
                style={{ left: `${peakPt.x}%`, top: `${peakPt.y}%`, transform: 'translate(-50%, -50%)' }} />
            )}
            {first.map((p, pi) => (
              <span key={pi} className="absolute top-0 bottom-0"
                style={{ left: `${p.x}%`, width: `${100 / Math.max(first.length - 1, 1)}%`, transform: 'translateX(-50%)' }} {...handlers(pi)} />
            ))}
            <DashTooltip visible={activeIndex !== null}>
              {activeIndex !== null && (
                <div className="flex flex-col gap-0.5">
                  {normalized.map((s, si) => {
                    const pt = s.points[activeIndex]
                    if (!pt) return null
                    return <span key={si} className="dash-caption">{pt.raw.x != null ? `${pt.raw.x}: ` : ''}{pt.raw.y}</span>
                  })}
                </div>
              )}
            </DashTooltip>
          </div>
          {xLabels && (
            <div className="flex justify-between gap-2 kol-float-ruler text-fg-64 tabular-nums max-sm:[&>:nth-child(even)]:hidden">
              {xLabels.map((label, i) => <span key={i}>{label}</span>)}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default LineChart
