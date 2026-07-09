export const formatCompact = (n) => {
  if (n >= 1000000) {
    return `${(n / 1000000).toFixed(1).replace(/\.0$/, '')}M`
  }
  if (n >= 1000) {
    const formatted = (n / 1000).toFixed(n >= 10000 ? 0 : 1)
    return `${formatted.replace(/\.0$/, '')}K`
  }
  return n.toLocaleString()
}

export const formatPercent = (n) => {
  if (!Number.isFinite(n)) return '0'
  const formatted = n >= 10 ? n.toFixed(0) : n.toFixed(1)
  return `${formatted.replace(/\.0$/, '')}%`
}

export const formatDelta = (n) => {
  if (!Number.isFinite(n)) return '0%'
  const sign = n > 0 ? '+' : ''
  const formatted = Math.abs(n) >= 10 ? n.toFixed(0) : n.toFixed(1)
  return `${sign}${formatted.replace(/\.0$/, '')}%`
}

const formatMetric = { formatCompact, formatPercent, formatDelta }
export default formatMetric
