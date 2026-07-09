import { useState, useEffect, useRef, useCallback } from 'react'

/* Showcase adaptation (the ONLY change from the monorepo source): the live
 * deploy wires /api/metrics(-repo/-sanity/-deploys/-b2); the showcase has no
 * backend, so MOCK short-circuits every fetch and the *_FALLBACK data renders
 * — same shape as the real responses. Flip to false in an app that serves
 * the APIs. (Was `import.meta.env.DEV` in the monorepo.) */
import { DEMO, DEMO_HOST_SUMMARY } from './demo-data.js'
import {
  RANGES,
  DEPLOY_STATE_COLORS,
  DEPLOY_STATE_LABELS,
  TYPE_COLORS,
  formatB2Size,
  timeAgo,
} from '@kolkrabbi/kol-dashboards'
const MOCK = true

// =============================================================================
// Constants + formatters — now owned by @kolkrabbi/kol-dashboards.
// Re-exported here so existing consumers (Home.jsx imports `timeAgo`) keep
// resolving them from this module.
// =============================================================================

export { RANGES, DEPLOY_STATE_COLORS, DEPLOY_STATE_LABELS, TYPE_COLORS, formatB2Size, timeAgo }

export const durationBuckets = [
  { range: '0-10s', count: 0, percentage: 0 },
  { range: '10-30s', count: 0, percentage: 0 },
  { range: '30-60s', count: 0, percentage: 0 },
  { range: '1-2m', count: 0, percentage: 0 },
  { range: '2-5m', count: 0, percentage: 0 },
  { range: '5m+', count: 0, percentage: 0 },
]

// =============================================================================
// Fallbacks
// =============================================================================

export const SITE_FALLBACK = {
  visitors: { today: '—', delta: 'loading...' },
  pageviews: { today: '—', delta: '' },
  session: { avg: '—', delta: '' },
  bounce: { rate: '—', delta: '' },
  dailyVisits: [],
  totalVisitsMonth: '—',
  durationBuckets: [],
  topPages: [],
  topCountries: [],
  blogPosts: [],
  referrers: [],
  b2: null,
  weeklyTraffic: { delta: '—', diff: '' },
  devices: [],
  totalSessions: '0',
}

export const PROJECT_FALLBACK = {
  components: '—', routes: '—', linesOfCode: '—', commits: '—',
  packages: '—', cssFiles: '—', atoms: '—', molecules: '—',
  sessionLogs: '—', docsFiles: '—', icons: '—', fonts: '—',
}

export const SANITY_FALLBACK = {
  totalDocuments: 0,
  types: { blog: 0, project: 0, page: 0, category: 0, author: 0, tag: 0 },
  recentEdits: [],
}

export const B2_FALLBACK = {
  totalBytes: 0,
  totalFiles: 0,
  totalFormatted: '—',
  bucketCount: 0,
  buckets: [],
}

// =============================================================================
// Hook
// =============================================================================

function playDing() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.type = 'sine'
    osc.frequency.setValueAtTime(1047, ctx.currentTime)
    osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15)
    gain.gain.setValueAtTime(0.4, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6)
    osc.start(ctx.currentTime)
    osc.stop(ctx.currentTime + 0.6)
  } catch {}
}

function readHostFromUrl() {
  if (typeof window === 'undefined') return null
  const value = new URLSearchParams(window.location.search).get('host')
  return value && value.trim() ? value.trim() : null
}

function writeHostToUrl(host) {
  if (typeof window === 'undefined') return
  const url = new URL(window.location.href)
  if (host) url.searchParams.set('host', host)
  else url.searchParams.delete('host')
  window.history.replaceState({}, '', url)
}

export default function useMetricsData(initialRange = '30d') {
  const [range, setRange] = useState(initialRange)
  const [host, setHostState] = useState(readHostFromUrl) // null = All hosts; init from URL
  const setHost = useCallback((next) => {
    setHostState(next)
    writeHostToUrl(next)
  }, [])
  const [allData, setAllData] = useState(MOCK ? DEMO.site : SITE_FALLBACK)   // unfiltered — source of truth for host pills
  const [filteredData, setFilteredData] = useState(null)  // null when host === null; else scoped to host
  const [projectData, setProjectData] = useState(MOCK ? DEMO.project : PROJECT_FALLBACK)
  const [sanityData, setSanityData] = useState(MOCK ? DEMO.sanity : SANITY_FALLBACK)
  const [deploys, setDeploys] = useState(MOCK ? DEMO.deploys : [])
  const [b2Data, setB2Data] = useState(MOCK ? DEMO.b2 : B2_FALLBACK)
  const [error, setError] = useState(null)
  const prevLatestDeployId = useRef(null)
  const prevLatestDeployState = useRef(null)

  // Unfiltered /api/metrics — refetches on range change. Populates allData.
  useEffect(() => {
    if (MOCK) return
    const r = RANGES.find(r => r.id === range)
    const rangeParam = r ? `?range=${r.ms}` : ''
    setAllData(prev => ({ ...prev, visitors: { today: '...', delta: 'loading' } }))
    fetch(`/api/metrics${rangeParam}`)
      .then(r => { if (!r.ok) throw new Error(`${r.status}`); return r.json() })
      .then(setAllData)
      .catch(e => setError(e.message))
  }, [range])

  // Filtered /api/metrics?host=X — only runs when a specific host is selected.
  useEffect(() => {
    if (MOCK) return
    if (!host) { setFilteredData(null); return }
    const r = RANGES.find(r => r.id === range)
    const rangeParam = r ? `range=${r.ms}&` : ''
    fetch(`/api/metrics?${rangeParam}host=${encodeURIComponent(host)}`)
      .then(r => { if (!r.ok) throw new Error(`${r.status}`); return r.json() })
      .then(setFilteredData)
      .catch(e => setError(e.message))
  }, [range, host])

  const siteData = host ? (filteredData ?? SITE_FALLBACK) : allData

  useEffect(() => {
    if (MOCK) return

    fetch('/api/metrics-repo')
      .then(r => { if (!r.ok) throw new Error(`${r.status}`); return r.json() })
      .then(setProjectData)
      .catch(() => {})

    fetch('/api/metrics-sanity')
      .then(r => { if (!r.ok) throw new Error(`${r.status}`); return r.json() })
      .then(setSanityData)
      .catch(() => {})

    fetch('/api/metrics-deploys')
      .then(r => { if (!r.ok) throw new Error(`${r.status}`); return r.json() })
      .then(d => setDeploys(d.deploys || []))
      .catch(() => {})

    fetch('/api/metrics-b2')
      .then(r => { if (!r.ok) throw new Error(`${r.status}`); return r.json() })
      .then(d => !d.error && setB2Data(d))
      .catch(() => {})

    const interval = setInterval(() => {
      fetch('/api/metrics-deploys')
        .then(r => r.ok ? r.json() : null)
        .then(d => {
          if (!d) return
          const latest = d.deploys?.[0]
          if (latest) {
            const wasBuilding = ['BUILDING', 'QUEUED'].includes(prevLatestDeployState.current)
            const isNowReady = latest.state === 'READY'
            if (wasBuilding && isNowReady && latest.id === prevLatestDeployId.current) playDing()
            prevLatestDeployId.current = latest.id
            prevLatestDeployState.current = latest.state
          }
          setDeploys(d.deploys || [])
        })
        .catch(() => {})
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  // Host filter pills are always derived from the unfiltered fetch, so they
  // remain stable regardless of the currently-selected host.
  const allHosts = allData.topHosts || []

  // Per-host visitor summaries. MOCK serves the demo map; a live app would
  // populate this from /api/metrics-summary in its own adapter.
  const hostSummaries = MOCK ? DEMO_HOST_SUMMARY : {}

  return {
    siteData,
    allHosts,
    host,
    setHost,
    projectData,
    sanityData,
    deploys,
    b2Data,
    error,
    range,
    setRange,
    hostSummaries,
  }
}
