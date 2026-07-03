/**
 * Demo data for the metrics dashboard set — same shapes as the live
 * /api/metrics(-repo/-sanity/-deploys/-b2) responses, so the ported dashboard
 * renders as the product instead of empty fallbacks. Consumed by
 * useMetricsData.js when MOCK is true. Values are plausible fiction.
 */

const DAY = 86400000
const now = Date.now()

/* 30 days of traffic — win = new, draw = returning, loss = bounced
 * (the chess program's field naming, kept verbatim). */
const dailyVisits = Array.from({ length: 30 }, (_, i) => {
  const wave = Math.sin(i / 4.2) * 18 + (i % 7 === 5 || i % 7 === 6 ? -22 : 0)
  const win = Math.max(14, Math.round(52 + wave + (i % 5) * 3))
  const draw = Math.max(8, Math.round(34 + wave * 0.6 - (i % 3) * 2))
  const loss = Math.max(4, Math.round(19 + wave * 0.3))
  return { win, draw, loss, total: win + draw + loss }
})

const P = {
  blue: 'var(--kol-palette-blue)',
  green: 'var(--kol-palette-green)',
  orange: 'var(--kol-palette-orange)',
  teal: 'var(--kol-palette-teal)',
  red: 'var(--kol-palette-red)',
  purple: 'var(--kol-palette-purple)',
}

export const DEMO = {
  site: {
    visitors: { today: '1,284', delta: '+12% vs prev period' },
    pageviews: { today: '4,931', delta: '+8% vs prev period' },
    session: { avg: '2m 41s', delta: '+14s vs prev period' },
    bounce: { rate: '38%', delta: '−3% vs prev period' },
    dailyVisits,
    totalVisitsMonth: '9,412',
    durationBuckets: [],
    topPages: [
      { label: '/stack/design-systems', value: '1,204', percent: 42, color: P.blue },
      { label: '/work/kol-editor', value: '861', percent: 30, color: P.teal },
      { label: '/', value: '640', percent: 22, color: P.green },
      { label: '/stack/type-foundry', value: '512', percent: 18, color: P.orange },
      { label: '/collections/grids', value: '347', percent: 12, color: P.purple },
    ],
    topCountries: [
      { label: 'Iceland', value: '512', detail: '31%', color: P.blue },
      { label: 'United States', value: '389', detail: '24%', color: P.teal },
      { label: 'Germany', value: '221', detail: '13%', color: P.green },
      { label: 'United Kingdom', value: '164', detail: '10%', color: P.orange },
      { label: 'Denmark', value: '98', detail: '6%', color: P.purple },
    ],
    topHosts: [
      { label: 'kolkrabbi.io', value: '3,201', delta: '+9%' },
      { label: 'brand.kolkrabbi.io', value: '842', delta: '+21%' },
      { label: 'kol.kolkrabbi.io', value: '517', delta: '+4%' },
    ],
    blogPosts: [
      { label: 'Building the KOL design system', value: '742' },
      { label: 'A type foundry in the terminal', value: '531' },
      { label: 'Opacity tokens over flat pairs', value: '388' },
      { label: 'FEN, PGN, and a chess apparatus', value: '256' },
    ],
    referrers: [
      { label: 'google.com', value: '1,872', percent: 46, color: P.blue },
      { label: 'instagram.com', value: '733', percent: 18, color: P.teal },
      { label: 'grapevine.is', value: '402', percent: 10, color: P.green },
      { label: 'github.com', value: '297', percent: 7, color: P.orange },
    ],
    weeklyTraffic: { delta: '+6%', diff: '+512' },
    devices: [
      { range: 'Desktop', count: 1483 },
      { range: 'Mobile', count: 1108 },
      { range: 'Tablet', count: 186 },
    ],
    totalSessions: '1,893',
  },

  project: {
    components: '57', routes: '23', linesOfCode: '48,210', commits: '312',
    packages: '8', cssFiles: '13', atoms: '29', molecules: '17',
    sessionLogs: '21', docsFiles: '86', icons: '892', fonts: '11',
  },

  sanity: {
    totalDocuments: 214,
    types: { blog: 38, project: 26, page: 12, category: 9, author: 2, tag: 127 },
    recentEdits: [
      { type: 'blog', title: 'Building the KOL design system', updated: now - 2 * DAY },
      { type: 'project', title: 'kol-editor', updated: now - 3 * DAY },
      { type: 'blog', title: 'A type foundry in the terminal', updated: now - 5 * DAY },
      { type: 'page', title: 'Studio', updated: now - 8 * DAY },
      { type: 'project', title: 'Chess apparatus', updated: now - 11 * DAY },
    ],
  },

  deploys: [
    { id: 'dpl_01', state: 'READY', created: now - 2 * 3600000, duration: 42, source: 'push', branch: 'main' },
    { id: 'dpl_02', state: 'READY', created: now - 26 * 3600000, duration: 39, source: 'push', branch: 'main' },
    { id: 'dpl_03', state: 'ERROR', created: now - 2 * DAY, duration: 18, source: 'push', branch: 'feat/metrics' },
    { id: 'dpl_04', state: 'READY', created: now - 3 * DAY, duration: 44, source: 'merge', branch: 'main' },
    { id: 'dpl_05', state: 'READY', created: now - 5 * DAY, duration: 41, source: 'push', branch: 'main' },
    { id: 'dpl_06', state: 'CANCELED', created: now - 6 * DAY, duration: null, source: 'push', branch: 'feat/sets' },
    { id: 'dpl_07', state: 'READY', created: now - 8 * DAY, duration: 46, source: 'merge', branch: 'main' },
    { id: 'dpl_08', state: 'READY', created: now - 9 * DAY, duration: 38, source: 'push', branch: 'main' },
  ],

  b2: {
    totalBytes: 19_764_000_000,
    totalFiles: 4_312,
    totalFormatted: '18.4 GB',
    bucketCount: 3,
    buckets: [
      {
        name: 'website', bytes: 12_996_000_000, bytesFormatted: '12.1 GB',
        recentFiles: [
          { name: 'art-prints/aurora-01.png', size: 18_400_000, uploaded: now - 1 * DAY },
          { name: 'asset-library/hero-loop.mp4', size: 92_100_000, uploaded: now - 2 * DAY },
          { name: 'hls/reel-04/master.m3u8', size: 1_200, uploaded: now - 4 * DAY },
        ],
      },
      {
        name: 'kol-media', bytes: 5_690_000_000, bytesFormatted: '5.3 GB',
        recentFiles: [
          { name: 'photoshoot/studio-12.jpg', size: 9_800_000, uploaded: now - 1 * DAY },
          { name: 'radar/dither-1718.png', size: 2_400_000, uploaded: now - 3 * DAY },
        ],
      },
      {
        name: 'chess-data', bytes: 1_078_000_000, bytesFormatted: '1.0 GB',
        recentFiles: [
          { name: 'data-library/chess-data/2020-08.json', size: 310_000, uploaded: now - 12 * DAY },
        ],
      },
    ],
  },
}

/* Per-host summaries for the hero HostSummaryCards (/api/metrics-summary shape). */
export const DEMO_HOST_SUMMARY = {
  'kolkrabbi.io': { visitors: '3,201', visitorsDelta: '+9%', trend: [38, 42, 51, 47, 58, 61, 55, 66, 72, 64, 78, 81] },
  'brand.kolkrabbi.io': { visitors: '842', visitorsDelta: '+21%', trend: [8, 11, 9, 14, 17, 15, 21, 24, 22, 28, 31, 29] },
  'kol.kolkrabbi.io': { visitors: '517', visitorsDelta: '+4%', trend: [6, 7, 9, 8, 11, 10, 12, 14, 13, 15, 14, 16] },
}
