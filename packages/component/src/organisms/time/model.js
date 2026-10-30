/* The timeline's data, from parseProject's milestones: every date resolved to an ISO day, nothing typed here.
 * Pure and JSON-safe, so the dev page and the artifact build (scripts/timeline-artifact.mjs) read the same model.
 *
 * kol-atlas's apps/workspace/src/timeline/model.js, carried verbatim into kol-component (TimeSetAndSiteRailFade, kol-website
 * 2026-10-29). Two changes: atlas's `isOptional` is inlined (it lived in its render engine), and an item may carry a `time`
 * ("14:00") — the Day view places it on its hour. A milestone is `{ id, title, when, phases }`, a phase `{ id, title, when,
 * dw?, reason?, marks: [[mark, kind]], items: [{ num, text, kind: 'c' | …, date?, time? }] }` — parseProject's shape. */
/* a milestone is optional when every phase is parked (atlas's engine/render.js `isOptional`) */
const isOptional = (m) => m.phases.length > 0 && m.phases.every((p) => p.marks.some((k) => k[1] === 'park'))

const MONTHS = { jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5, jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11 }
const iso = (y, m, d) => new Date(Date.UTC(y, m, d)).toISOString().slice(0, 10)
const addDays = (s, n) => { const d = new Date(s + 'T00:00:00Z'); d.setUTCDate(d.getUTCDate() + n); return d.toISOString().slice(0, 10) }
const dayDiff = (a, b) => Math.round((new Date(b + 'T00:00:00Z') - new Date(a + 'T00:00:00Z')) / 864e5)

/* "26 – 30 Oct" · "26 Oct – 6 Nov" · "26 Oct – 16 Dec 2026" · "27 Oct" → [start, end]. A missing month takes the
 * end's; a missing year takes `year`, minus one when the day would land after `before` (a range crossing New Year). */
function parseRange(s, year, before) {
  const parts = s.replace(/\s+/g, ' ').trim().split(/\s*[–-]\s*/)
  const read = (p) => { const m = /^(\d{1,2})(?: ([A-Za-z]{3})[a-z]*)?(?: (\d{4}))?$/.exec(p.trim()); return m ? { d: +m[1], m: m[2] ? MONTHS[m[2].toLowerCase()] : undefined, y: m[3] ? +m[3] : undefined } : null }
  const a = read(parts[0]), b = read(parts[parts.length - 1])
  if (!a || !b) return null
  const y = b.y || year
  if (a.m === undefined) a.m = b.m
  const end = iso(y, b.m, b.d)
  let start = iso(a.y || y, a.m, a.d)
  if (start > end) start = iso((a.y || y) - 1, a.m, a.d)
  if (before && end > before) return [iso((a.y || y) - 1, a.m, a.d), iso(y - 1, b.m, b.d)]
  return [start, end]
}

const num = (t) => (/^((?:M)?\d+(?:\.\d+)?)\s+/.exec(t) || [])[1] || ''
const name = (t) => t.replace(/^(?:M?\d+(?:\.\d+)?)\s+/, '')

export function timelineModel(ms) {
  const milestones = ms.map((m) => {
    const yearOf = +(/(\d{4})\s*$/.exec(m.when) || [])[1]
    const [mStart, mEnd] = parseRange(m.when, yearOf)
    const slack = addDays(mEnd, 7)
    const phases = m.phases.map((p) => {
      const [start, end] = parseRange(p.when, yearOf, slack) || [mStart, mEnd]
      return {
        id: p.id, num: num(p.title), name: name(p.title), start, end, acceptance: p.dw || '',
        confirm: p.marks.some((k) => k[1] !== 'park') ? p.reason : '', optional: p.marks.some((k) => k[1] === 'park'),
        items: p.items.map((it) => ({ num: it.num, text: it.text, checkpoint: it.kind === 'c', date: it.date ? parseRange(it.date, yearOf, slack)[0] : '', time: it.time || '' })),
      }
    })
    return { id: m.id, num: num(m.title), name: name(m.title), start: mStart, end: mEnd, optional: isOptional(m), phases }
  })
  const checkpoints = milestones.flatMap((m) => m.phases.flatMap((p) => p.items.filter((i) => i.checkpoint && i.date).map((i) => ({ date: i.date, time: i.time, label: i.text, num: i.num, phase: p.id, ms: m.num }))))
  /* breaks: gaps of more than a weekend between one milestone's end and the next one's start */
  const breaks = milestones.slice(1).map((m, i) => [addDays(milestones[i].end, 1), addDays(m.start, -1)]).filter(([a, b]) => dayDiff(a, b) > 3)
  const first = milestones[0].start, last = milestones[milestones.length - 1].end
  const mon = (s) => addDays(s, -((new Date(s + 'T00:00:00Z').getUTCDay() + 6) % 7))
  return { start: mon(first), end: addDays(mon(last), 6), first, last, milestones, checkpoints, breaks }
}
