import { useMemo } from 'react'
import { getManifest, getMonthlySummary } from '../data/sample-games.js'

const MetricCard = ({ icon, label, value, delta, trend = 'up' }) => {
  return (
    <div className="chess-hero-metric">
      <div className="chess-hero-metric__header">
        <div className="chess-hero-metric__icon">{icon}</div>
        <button type="button" className="chess-hero-metric__menu">⋯</button>
      </div>
      <div className="chess-hero-metric__label">{label}</div>
      <div className="chess-hero-metric__value">{value}</div>
      <div className={`chess-hero-metric__delta chess-hero-metric__delta--${trend}`}>
        {delta}
      </div>
    </div>
  )
}

const ChessHero = () => {
  const manifest = useMemo(() => getManifest(), [])
  const monthlySummary = useMemo(() => getMonthlySummary(), [])

  const metrics = useMemo(() => {
    const totals = monthlySummary.reduce(
      (acc, month) => {
        acc.win += month.results?.win ?? 0
        acc.draw += month.results?.draw ?? 0
        acc.loss += month.results?.loss ?? 0
        return acc
      },
      { win: 0, draw: 0, loss: 0 }
    )

    const totalGames = manifest?.totalGames ?? 0
    const winRate = totalGames > 0 ? (totals.win / totalGames) * 100 : 0
    const ratedGames = manifest?.ratedGames ?? 0
    const ratedPct = totalGames > 0 ? (ratedGames / totalGames) * 100 : 0

    return {
      totalGames,
      winRate,
      ratedGames,
      ratedPct,
      wins: totals.win,
      draws: totals.draw,
      losses: totals.loss
    }
  }, [manifest, monthlySummary])

  const monthlyData = useMemo(() => {
    return monthlySummary.slice(-12).map((month) => {
      const total = month.total ?? 0
      const wins = month.results?.win ?? 0
      const losses = month.results?.loss ?? 0
      const winRate = total > 0 ? (wins / total) * 100 : 0

      return {
        month: month.month,
        total,
        wins,
        losses,
        winRate,
        netScore: wins - losses
      }
    })
  }, [monthlySummary])

  const chartPath = useMemo(() => {
    if (!monthlyData.length) return ''

    const maxWinRate = Math.max(...monthlyData.map(d => d.winRate), 100)
    const points = monthlyData.map((d, i) => {
      const x = (i / Math.max(monthlyData.length - 1, 1)) * 100
      const y = 100 - (d.winRate / maxWinRate) * 80
      return { x, y, winRate: d.winRate }
    })

    return points
      .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(2)} ${p.y.toFixed(2)}`)
      .join(' ')
  }, [monthlyData])

  const volumePath = useMemo(() => {
    if (!monthlyData.length) return ''

    const maxTotal = Math.max(...monthlyData.map(d => d.total), 1)
    const points = monthlyData.map((d, i) => {
      const x = (i / Math.max(monthlyData.length - 1, 1)) * 100
      const y = 100 - (d.total / maxTotal) * 80
      return { x, y }
    })

    return points
      .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(2)} ${p.y.toFixed(2)}`)
      .join(' ')
  }, [monthlyData])

  const timeControlBars = useMemo(() => {
    const distribution = manifest?.timeClassDistribution ?? []
    const maxCount = Math.max(...distribution.map(d => d.count), 1)

    return distribution.slice(0, 6).map((entry) => ({
      label: entry.key,
      count: entry.count,
      height: (entry.count / maxCount) * 100
    }))
  }, [manifest])

  const formatMonth = (monthKey) => {
    if (!monthKey) return ''
    const [year, month] = monthKey.split('-').map(Number)
    const date = new Date(year, (month ?? 1) - 1)
    return date.toLocaleString('default', { month: 'short' })
  }

  return (
    <div className="chess-hero">
      <div className="chess-hero__metrics">
        <MetricCard
          icon="♔"
          label="Total games"
          value={metrics.totalGames.toLocaleString()}
          delta="106 months"
          trend="neutral"
        />
        <MetricCard
          icon="⚡"
          label="Win rate"
          value={`${metrics.winRate.toFixed(1)}%`}
          delta={`${metrics.wins} wins`}
          trend="up"
        />
        <MetricCard
          icon="⭐"
          label="Rated games"
          value={metrics.ratedGames.toLocaleString()}
          delta={`${metrics.ratedPct.toFixed(1)}%`}
          trend="up"
        />
        <MetricCard
          icon="🎯"
          label="Net score"
          value={`+${metrics.wins - metrics.losses}`}
          delta={`${metrics.losses} losses`}
          trend={metrics.wins > metrics.losses ? 'up' : 'down'}
        />
      </div>

      <div className="chess-hero__card">
        <div className="chess-hero__main">
          <div className="chess-hero__header">
            <div>
              <h3 className="chess-hero__title">Performance trend</h3>
              <div className="chess-hero__subtitle">
                <span className="chess-hero__value">
                  {metrics.winRate.toFixed(1)}%
                </span>
                <span className="chess-hero__delta">
                  {metrics.winRate > 50 ? '+' : ''}{(metrics.winRate - 50).toFixed(1)}%
                </span>
              </div>
            </div>
            <div className="chess-hero__legend">
              <span className="chess-hero__legend-item">
                <span className="chess-hero__legend-dot chess-hero__legend-dot--primary" />
                Win rate
              </span>
              <span className="chess-hero__legend-item">
                <span className="chess-hero__legend-dot chess-hero__legend-dot--secondary" />
                Volume
              </span>
            </div>
          </div>

          <div className="chess-hero__chart">
            <div className="chess-hero__chart-grid" />
            <svg
              className="chess-hero__chart-svg"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id="winRateGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="rgba(245, 210, 69, 0.3)" />
                  <stop offset="100%" stopColor="rgba(245, 210, 69, 0)" />
                </linearGradient>
              </defs>

              {/* Volume line (yellow) */}
              {volumePath && (
                <path
                  d={volumePath}
                  fill="none"
                  stroke="rgba(245, 210, 69, 0.7)"
                  strokeWidth="2"
                  strokeLinejoin="round"
                  strokeLinecap="round"
                />
              )}

              {/* Win rate line and fill (orange) */}
              {chartPath && (
                <>
                  <path
                    d={`${chartPath} L 100 100 L 0 100 Z`}
                    fill="url(#winRateGradient)"
                  />
                  <path
                    d={chartPath}
                    fill="none"
                    stroke="rgba(255, 140, 60, 0.9)"
                    strokeWidth="2.5"
                    strokeLinejoin="round"
                    strokeLinecap="round"
                  />
                </>
              )}
            </svg>

            <div className="chess-hero__chart-axis">
              {monthlyData.map((d, i) => (
                <span key={d.month} className="chess-hero__chart-label">
                  {formatMonth(d.month)}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="chess-hero__side">
          <div className="chess-hero__side-metric">
            <div className="chess-hero__side-icon">📊</div>
            <div className="chess-hero__side-label">Games by time</div>
            <div className="chess-hero__side-value">
              {timeControlBars[0]?.label ?? '—'}
            </div>
            <div className="chess-hero__side-delta">
              {timeControlBars[0]?.count ?? 0} games
            </div>
          </div>

          <div className="chess-hero__bar-chart">
            {timeControlBars.slice(0, 5).map((bar, i) => (
              <div key={bar.label} className="chess-hero__bar">
                <div
                  className="chess-hero__bar-fill"
                  style={{ height: `${bar.height}%` }}
                />
              </div>
            ))}
          </div>

          <div className="chess-hero__side-footer">
            <span className="chess-hero__side-period">Last 12 months</span>
            <button type="button" className="chess-hero__side-link">View report</button>
          </div>

          <div className="chess-hero__side-metric">
            <div className="chess-hero__side-icon">🔥</div>
            <div className="chess-hero__side-label">Monthly avg</div>
            <div className="chess-hero__side-value">
              {monthlyData.length > 0
                ? Math.round(
                    monthlyData.reduce((sum, d) => sum + d.total, 0) / monthlyData.length
                  )
                : 0}
            </div>
            <div className="chess-hero__side-delta">games/month</div>
          </div>

          <div className="chess-hero__line-chart">
            <svg viewBox="0 0 100 50" preserveAspectRatio="none">
              {volumePath && (
                <path
                  d={volumePath.replace(/100/g, '50')}
                  fill="none"
                  stroke="rgba(255, 140, 60, 0.8)"
                  strokeWidth="2"
                  strokeLinejoin="round"
                  strokeLinecap="round"
                />
              )}
            </svg>
          </div>

          <div className="chess-hero__side-footer">
            <span className="chess-hero__side-status">
              <span className="chess-hero__side-status-dot" />
              Live data
            </span>
            <button type="button" className="chess-hero__side-link">View report</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChessHero
