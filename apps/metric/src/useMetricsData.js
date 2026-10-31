import { useState, useEffect, useRef, useCallback } from 'react'
import { RANGES } from '@kolkrabbi/kol-dashboards'

/* The live adapter for @kolkrabbi/kol-dashboards' MetricsDashboard: it fetches
 * the six functions in api/ and hands the component its `data`. Moved from
 * apps/web/src/hooks/useMetricsData.js (2026-10-05); the view constants that
 * lived beside it are the package's now. */

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

const rangeMs = (range) => RANGES.find(r => r.id === range)?.ms

export default function useMetricsData({ mainHost, initialRange = '30d' } = {}) {
  const [range, setRange] = useState(initialRange)
  const [host, setHostState] = useState(readHostFromUrl) // null = All hosts; init from URL
  const setHost = useCallback((next) => {
    setHostState(next)
    writeHostToUrl(next)
  }, [])
  const [allData, setAllData] = useState(SITE_FALLBACK)   // unfiltered — source of truth for host pills
  const [filteredData, setFilteredData] = useState(null)  // null when host === null; else scoped to host
  const [projectData, setProjectData] = useState(PROJECT_FALLBACK)
  const [sanityData, setSanityData] = useState(SANITY_FALLBACK)
  const [deploys, setDeploys] = useState([])
  const [b2Data, setB2Data] = useState(B2_FALLBACK)
  const [hostSummaries, setHostSummaries] = useState({})
  const [error, setError] = useState(null)
  const prevLatestDeployId = useRef(null)
  const prevLatestDeployState = useRef(null)

  // Unfiltered /api/metrics — refetches on range change. Populates allData.
  useEffect(() => {
    const ms = rangeMs(range)
    const rangeParam = ms ? `?range=${ms}` : ''
    setAllData(prev => ({ ...prev, visitors: { today: '...', delta: 'loading' } }))
    fetch(`/api/metrics${rangeParam}`)
      .then(r => { if (!r.ok) throw new Error(`${r.status}`); return r.json() })
      .then(setAllData)
      .catch(e => setError(e.message))
  }, [range])

  // Filtered /api/metrics?host=X — only runs when a specific host is selected.
  useEffect(() => {
    if (!host) { setFilteredData(null); return }
    const ms = rangeMs(range)
    const rangeParam = ms ? `range=${ms}&` : ''
    fetch(`/api/metrics?${rangeParam}host=${encodeURIComponent(host)}`)
      .then(r => { if (!r.ok) throw new Error(`${r.status}`); return r.json() })
      .then(setFilteredData)
      .catch(e => setError(e.message))
  }, [range, host])

  const siteData = host ? (filteredData ?? SITE_FALLBACK) : allData

  useEffect(() => {
    // Each endpoint names itself in the error so the status line says which one
    // died — the two ranged fetches above already surface theirs this way.
    const report = (name) => (e) => setError(`${name}: ${e.message}`)

    fetch('/api/metrics-repo')
      .then(r => { if (!r.ok) throw new Error(`${r.status}`); return r.json() })
      .then(setProjectData)
      .catch(report('repo'))

    fetch('/api/metrics-sanity')
      .then(r => { if (!r.ok) throw new Error(`${r.status}`); return r.json() })
      .then(setSanityData)
      .catch(report('sanity'))

    fetch('/api/metrics-deploys')
      .then(r => { if (!r.ok) throw new Error(`${r.status}`); return r.json() })
      .then(d => setDeploys(d.deploys || []))
      .catch(report('deploys'))

    fetch('/api/metrics-b2')
      .then(r => { if (!r.ok) throw new Error(`${r.status}`); return r.json() })
      .then(d => !d.error && setB2Data(d))
      .catch(report('b2'))

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
        // ponytail: the 5s poll stays silent on purpose — a transient failure
        // would flash the status line every tick. The one-shot fetch above reports.
        .catch(() => {})
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  // Host filter pills are always derived from the unfiltered fetch, so they
  // remain stable regardless of the currently-selected host.
  const allHosts = allData.topHosts || []

  // Per-host visitor summaries, keyed by host — the dashboard shows two cards:
  // the main site, and the selected host or else the busiest other one. Each
  // was fetched inside its own card while the page lived in apps/web.
  const summaryHosts = [...new Set([mainHost, host, allHosts.find(h => h.label !== mainHost)?.label].filter(Boolean))].join(',')
  useEffect(() => {
    setHostSummaries({})
    if (!summaryHosts) return
    const ms = rangeMs(range) ?? 30 * 86400000
    let stale = false
    for (const h of summaryHosts.split(',')) {
      fetch(`/api/metrics-summary?host=${encodeURIComponent(h)}&range=${ms}`)
        .then(r => r.ok ? r.json() : null)
        .then(d => { if (d && !stale) setHostSummaries(prev => ({ ...prev, [h]: d })) })
        .catch(() => {})
    }
    return () => { stale = true }
  }, [summaryHosts, range])

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
