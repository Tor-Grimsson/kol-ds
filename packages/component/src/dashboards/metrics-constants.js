/**
 * Metrics dashboard — view-level constants + formatters.
 *
 * These are presentation tokens the MetricsDashboard view needs (ranges, deploy
 * state colours/labels, the categorical palette, byte + relative-time
 * formatters). The DATA that flows through the dashboard is injected by the
 * consumer via the `data` prop — see MetricsDashboard.jsx. A consumer's own
 * data adapter (e.g. a useMetricsData hook) imports RANGES from here so the
 * range→ms mapping stays single-sourced.
 */

export const RANGES = [
  { id: 'today', label: 'Today', ms: 86400000 },
  { id: '7d', label: '7d', ms: 7 * 86400000 },
  { id: '30d', label: '30d', ms: 30 * 86400000 },
  { id: '90d', label: '90d', ms: 90 * 86400000 },
  { id: 'year', label: '1y', ms: 365 * 86400000 },
]

export const DEPLOY_STATE_COLORS = {
  READY: 'var(--kol-palette-green)',
  ERROR: 'var(--kol-palette-red)',
  BUILDING: 'var(--kol-palette-orange)',
  QUEUED: 'var(--kol-palette-purple)',
  CANCELED: 'var(--kol-palette-red)',
}

export const DEPLOY_STATE_LABELS = {
  READY: 'Live',
  ERROR: 'Failed',
  BUILDING: 'Building...',
  QUEUED: 'Queued',
  CANCELED: 'Canceled',
}

export const TYPE_COLORS = {
  blog: 'var(--kol-palette-green)',
  project: 'var(--kol-palette-blue)',
  page: 'var(--kol-palette-purple)',
  category: 'var(--kol-palette-orange)',
  author: 'var(--kol-palette-teal)',
  tag: 'var(--kol-palette-red)',
}

/* Categorical series palette (donut segments, bucket bars, milestone dots). */
export const PALETTE = [
  'var(--kol-palette-blue)',
  'var(--kol-palette-green)',
  'var(--kol-palette-orange)',
  'var(--kol-palette-purple)',
  'var(--kol-palette-red)',
  'var(--kol-palette-teal)',
  'var(--kol-palette-yellow)',
]

export const MILESTONE_COLORS = {
  ship: 'var(--kol-palette-green)',
  launch: 'var(--kol-palette-blue)',
  warn: 'var(--kol-palette-orange)',
  fail: 'var(--kol-palette-red)',
}

export function formatB2Size(bytes) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`
}

export function timeAgo(ts) {
  const diff = Date.now() - ts
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  const days = Math.floor(hrs / 24)
  return `${days}d ago`
}
