import { useState } from 'react'
import { MetricsDashboard } from '@kolkrabbi/kol-dashboards'

export const stage = 'full'

/* The full analytics apparatus — presentation only, so the demo plays the
 * consumer's data adapter: one inline payload feeds all four tabs (Site /
 * Project / Infrastructure / Sessions). Range + host state live out here;
 * the fixture is static, so toggling them re-labels rather than re-fetches. */

const now = Date.now()
const H = 3600000
const D = 86400000

// --- Site ---------------------------------------------------------------

const dailyVisits = [
  { win: 42, draw: 31, loss: 12, total: 85 },
  { win: 48, draw: 28, loss: 15, total: 91 },
  { win: 39, draw: 35, loss: 11, total: 85 },
  { win: 55, draw: 30, loss: 18, total: 103 },
  { win: 61, draw: 34, loss: 14, total: 109 },
  { win: 46, draw: 41, loss: 16, total: 103 },
  { win: 52, draw: 38, loss: 13, total: 103 },
  { win: 67, draw: 36, loss: 19, total: 122 },
  { win: 58, draw: 44, loss: 15, total: 117 },
  { win: 71, draw: 39, loss: 21, total: 131 },
  { win: 64, draw: 47, loss: 17, total: 128 },
  { win: 78, draw: 42, loss: 20, total: 140 },
  { win: 82, draw: 49, loss: 18, total: 149 },
  { win: 90, draw: 53, loss: 22, total: 165 },
]

const SITE = {
  visitors: { today: '1,284', delta: '+12% vs prev period' },
  pageviews: { today: '4,912', delta: '+8% vs prev period' },
  session: { avg: '2m 41s', delta: '+14s vs prev period' },
  bounce: { rate: '38%', delta: '-3% vs prev period' },
  dailyVisits,
  totalVisitsMonth: '2,777',
  totalSessions: '2,777',
  weeklyTraffic: { diff: '+212' },
  devices: [
    { range: 'Desktop', count: 1483 },
    { range: 'Mobile', count: 1108 },
    { range: 'Tablet', count: 186 },
  ],
  topPages: [
    { label: '/', value: '1,204', percent: 44, color: 'var(--kol-palette-blue)' },
    { label: '/prints', value: '812', percent: 30, color: 'var(--kol-palette-green)' },
    { label: '/stack', value: '486', percent: 18, color: 'var(--kol-palette-orange)' },
    { label: '/about', value: '214', percent: 8, color: 'var(--kol-palette-purple)' },
  ],
  topCountries: [
    { label: 'Iceland', value: '812', detail: '29%', color: 'var(--kol-palette-blue)' },
    { label: 'Germany', value: '534', detail: '19%', color: 'var(--kol-palette-green)' },
    { label: 'United States', value: '498', detail: '18%', color: 'var(--kol-palette-orange)' },
    { label: 'Denmark', value: '301', detail: '11%', color: 'var(--kol-palette-purple)' },
  ],
  topHosts: [
    { label: 'kolkrabbi.io', value: '2,102', percent: 76, color: 'var(--kol-palette-yellow)', delta: '+9%' },
    { label: 'stack.kolkrabbi.io', value: '486', percent: 18, color: 'var(--kol-palette-teal)', delta: '+21%' },
    { label: 'metrics.kolkrabbi.io', value: '189', percent: 6, color: 'var(--kol-palette-blue)', delta: '+4%' },
  ],
  blogPosts: [
    { label: 'Severing a design system from its monorepo', value: '312' },
    { label: 'Container queries in dashboard grids', value: '248' },
    { label: 'The √2 print card', value: '187' },
  ],
  referrers: [
    { label: 'google.com', value: '488', percent: 52, color: 'var(--kol-palette-blue)' },
    { label: 'github.com', value: '236', percent: 25, color: 'var(--kol-palette-green)' },
    { label: 'news.ycombinator.com', value: '129', percent: 14, color: 'var(--kol-palette-orange)' },
    { label: 'are.na', value: '84', percent: 9, color: 'var(--kol-palette-purple)' },
  ],
}

const ALL_HOSTS = [
  { label: 'kolkrabbi.io' },
  { label: 'stack.kolkrabbi.io' },
  { label: 'metrics.kolkrabbi.io' },
]

const HOST_SUMMARIES = {
  'kolkrabbi.io': { visitors: '2,102', visitorsDelta: '+9%', trend: [52, 61, 58, 70, 66, 79, 84] },
  'stack.kolkrabbi.io': { visitors: '486', visitorsDelta: '+21%', trend: [12, 18, 15, 22, 26, 24, 31] },
  'metrics.kolkrabbi.io': { visitors: '189', visitorsDelta: '+4%', trend: [6, 8, 7, 9, 8, 11, 10] },
}

// --- Project + CMS --------------------------------------------------------

const PROJECT = {
  components: '128',
  routes: '24',
  linesOfCode: '48,210',
  commits: '412',
  atoms: '54',
  molecules: '38',
  sessionLogs: '96',
  docsFiles: '61',
  packages: '9',
  fonts: '12',
}

const SANITY = {
  totalDocuments: 184,
  types: { blog: 32, project: 18, page: 14, category: 9, author: 3, tag: 41 },
  recentEdits: [
    { type: 'blog', title: 'Severing a design system from its monorepo', updated: now - 5 * H },
    { type: 'project', title: 'Hverfjall print series', updated: now - 22 * H },
    { type: 'blog', title: 'Container queries in dashboard grids', updated: now - 2 * D },
    { type: 'page', title: 'About', updated: now - 4 * D },
    { type: 'tag', title: 'giclée', updated: now - 6 * D },
  ],
}

// --- Infrastructure --------------------------------------------------------

const DEPLOYS = [
  { id: 'dp-16', state: 'READY', created: now - 2 * H, duration: 42, source: 'kol-ds-0009', branch: 'main' },
  { id: 'dp-15', state: 'READY', created: now - 9 * H, duration: 38, source: 'kol-ds-0008', branch: 'main' },
  { id: 'dp-14', state: 'ERROR', created: now - 1 * D - 3 * H, duration: 51, source: 'fix donut legend wrap', branch: 'main' },
  { id: 'dp-13', state: 'READY', created: now - 2 * D - 7 * H, duration: 40, source: 'kol-ds-0007', branch: 'main' },
  { id: 'dp-12', state: 'READY', created: now - 4 * D - 11 * H, duration: 44, source: 'store package demos', branch: 'main' },
  { id: 'dp-11', state: 'CANCELED', created: now - 6 * D - 5 * H, duration: null, source: 'superseded build', branch: 'main' },
  { id: 'dp-10', state: 'READY', created: now - 8 * D - 14 * H, duration: 39, source: 'kol-ds-0006', branch: 'main' },
  { id: 'dp-09', state: 'READY', created: now - 11 * D - 2 * H, duration: 47, source: 'styleguide combo lab', branch: 'main' },
  { id: 'dp-08', state: 'ERROR', created: now - 13 * D - 8 * H, duration: 62, source: 'chunk-size regression', branch: 'main' },
  { id: 'dp-07', state: 'READY', created: now - 16 * D - 6 * H, duration: 41, source: 'kol-ds-0005', branch: 'main' },
  { id: 'dp-06', state: 'READY', created: now - 20 * D - 10 * H, duration: 36, source: 'dashboards charts', branch: 'main' },
  { id: 'dp-05', state: 'READY', created: now - 24 * D - 4 * H, duration: 43, source: 'kol-ds-0004', branch: 'main' },
  { id: 'dp-04', state: 'READY', created: now - 29 * D - 13 * H, duration: 45, source: 'theme layer split', branch: 'main' },
  { id: 'dp-03', state: 'READY', created: now - 33 * D - 9 * H, duration: 37, source: 'kol-ds-0003', branch: 'main' },
  { id: 'dp-02', state: 'ERROR', created: now - 37 * D - 16 * H, duration: 58, source: 'icon set import', branch: 'main' },
  { id: 'dp-01', state: 'READY', created: now - 41 * D - 6 * H, duration: 40, source: 'kol-ds-0002', branch: 'main' },
]

const B2 = {
  totalFormatted: '42.6 GB',
  totalBytes: 45740000000,
  totalFiles: 1968,
  bucketCount: 3,
  buckets: [
    {
      name: 'art-prints',
      bytes: 28100000000,
      bytesFormatted: '26.2 GB',
      recentFiles: [
        { name: 'prints/hverfjall-study-3.tif', size: 412000000, uploaded: now - 5 * H },
        { name: 'prints/basalt-field-a1.tif', size: 388000000, uploaded: now - 2 * D },
        { name: 'prints/black-sand-a2.tif', size: 296000000, uploaded: now - 5 * D },
      ],
    },
    {
      name: 'asset-library',
      bytes: 12400000000,
      bytesFormatted: '11.5 GB',
      recentFiles: [
        { name: 'brand/wordmark-2026.svg', size: 18400, uploaded: now - 12 * H },
        { name: 'textures/tt-08.jpg', size: 2140000, uploaded: now - 3 * D },
      ],
    },
    {
      name: 'hls-video',
      bytes: 5240000000,
      bytesFormatted: '4.9 GB',
      recentFiles: [
        { name: 'reels/foundry-loop/master.m3u8', size: 1240, uploaded: now - 1 * D },
        { name: 'reels/foundry-loop/segment-012.ts', size: 8420000, uploaded: now - 1 * D },
      ],
    },
  ],
}

// --- Timeline milestones (consumer content) --------------------------------

const MILESTONES = [
  { type: 'launch', date: '2026-06-02', text: 'v2 storefront live' },
  { type: 'ship', date: '2026-06-18', text: 'dashboards package' },
  { type: 'warn', date: '2026-06-27', text: 'cdn latency spike' },
  { type: 'ship', date: '2026-07-08', text: 'styleguide combo lab' },
]

export default function MetricsDashboardDemo() {
  const [range, setRange] = useState('30d')
  const [host, setHost] = useState(null)

  const data = {
    siteData: SITE,
    allHosts: ALL_HOSTS,
    host,
    setHost,
    projectData: PROJECT,
    sanityData: SANITY,
    deploys: DEPLOYS,
    b2Data: B2,
    error: null,
    range,
    setRange,
    hostSummaries: HOST_SUMMARIES,
  }

  return <MetricsDashboard data={data} milestones={MILESTONES} mainHost="kolkrabbi.io" />
}
