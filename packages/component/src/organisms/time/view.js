/* The timeline views: model (model.js) in, HTML out — Timeline (Gantt) · Month · Week · Day, a phase's detail on click.
 * No imports and no framework, so the timeline on Plan (/plan) and the artifact (scripts/timeline-artifact.mjs) run
 * this same file. Styles: timeline.css, every colour a --tl-* variable each host sets.
 *
 * kol-atlas's apps/workspace/src/timeline/view.js, carried verbatim into kol-component (TimeSetAndSiteRailFade, kol-website
 * 2026-10-29 — *"we might just need day? and then we have a full 'time' set?"*). Added: DAY — one day by hour, the phases
 * running that day and its untimed checkpoints in an all-day lane, timed ones on their hour, the Today line at the hour
 * now; the view is remembered under `kol-time-view`. The styles are kol-theme's kol-components-time.css. */

const MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const MONTH = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
const WD = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const VIEWS = [['timeline', 'Timeline'], ['month', 'Month'], ['week', 'Week'], ['day', 'Day']]

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c])
const D = (s) => new Date(s + 'T00:00:00Z')
const add = (s, n) => { const d = D(s); d.setUTCDate(d.getUTCDate() + n); return d.toISOString().slice(0, 10) }
const diff = (a, b) => Math.round((D(b) - D(a)) / 864e5)
const wd = (s) => (D(s).getUTCDay() + 6) % 7 // 0 = Monday
const monday = (s) => add(s, -wd(s))
const day = (s) => D(s).getUTCDate() + ' ' + MON[D(s).getUTCMonth()]
const dayY = (s) => day(s) + ' ' + D(s).getUTCFullYear()
const range = (a, b) => (a === b ? day(a) : D(a).getUTCMonth() === D(b).getUTCMonth() ? D(a).getUTCDate() + ' – ' + day(b) : day(a) + ' – ' + day(b))
const weekNo = (s) => { const d = D(s); d.setUTCDate(d.getUTCDate() + 3 - wd(s)); const y = new Date(Date.UTC(d.getUTCFullYear(), 0, 4)); return 1 + Math.round((d - y) / 864e5 / 7) }
const workdays = (a, b) => { let n = 0; for (let d = a; d <= b; d = add(d, 1)) if (wd(d) < 5) n++; return n }
const clamp = (s, a, b) => (s < a ? a : s > b ? b : s)
const inBreak = (m, s) => m.breaks.some(([a, b]) => s >= a && s <= b)

const phases = (m) => m.milestones.flatMap((ms, i) => ms.phases.map((p) => ({ ...p, msi: i, ms })))
const msClass = (i, ms) => 'tl-m' + (i + 1) + (ms.optional ? ' tl-opt' : '')
const marks = (p) => (p.confirm ? '<span class="tl-confirm" title="To confirm: ' + esc(p.confirm) + '"><i></i>To confirm</span>' : '')

function legend(m) {
  return '<div class="tl-legend">' + m.milestones.map((ms, i) => '<span><b class="tl-sw ' + msClass(i, ms) + '"></b>' + esc(ms.num + ' ' + ms.name) + (ms.optional ? ' (optional)' : '') + '</span>').join('') +
    '<span><b class="tl-dia"></b>Checkpoint</span><span class="tl-confirm"><i></i>To confirm</span><span><b class="tl-sw tl-sw-break"></b>Break</span><span><b class="tl-sw tl-sw-today"></b>Today</span></div>'
}

/* ---------- Timeline: one row per milestone and phase across the whole project ---------- */
function timeline(m, st) {
  const total = diff(m.start, m.end) + 1
  const x = (s) => (diff(m.start, s) / total) * 100
  const w = (a, b) => ((diff(a, b) + 1) / total) * 100
  const rows = []
  m.milestones.forEach((ms, i) => {
    rows.push({ kind: 'ms', ms, i })
    ms.phases.forEach((p) => rows.push({ kind: 'ph', ms, i, p }))
  })
  const H = 34
  let scale = '', bg = '', firstLab = true
  for (let d = m.start; d <= m.end; d = add(d, 1)) {
    /* a month label on each 1st, and on the range's first day only when its month has room before the next 1st; the year on the first label and on January */
    if (D(d).getUTCDate() === 1 || (d === m.start && D(d).getUTCDate() < 20)) { scale += '<span class="tl-mo" style="left:' + x(d) + '%">' + MONTH[D(d).getUTCMonth()] + (D(d).getUTCMonth() === 0 || firstLab ? ' ' + D(d).getUTCFullYear() : '') + '</span>'; firstLab = false }
    if (wd(d) === 0) scale += '<span class="tl-wk" style="left:' + x(d) + '%">' + D(d).getUTCDate() + '</span>', bg += '<i class="tl-vline" style="left:' + x(d) + '%"></i>'
    if (wd(d) === 5) bg += '<i class="tl-weekend" style="left:' + x(d) + '%;width:' + w(d, add(d, 1)) + '%"></i>'
  }
  m.breaks.forEach(([a, b]) => { bg += '<i class="tl-break" style="left:' + x(a) + '%;width:' + w(a, b) + '%"><span>Break</span></i>' })
  if (st.today >= m.start && st.today <= m.end) bg += '<i class="tl-today" style="left:' + (x(st.today) + 50 / total) + '%"><span>Today</span></i>'
  const labels = rows.map((r) => r.kind === 'ms'
    ? '<div class="tl-lab tl-lab-ms" style="height:' + H + 'px"><b>' + esc(r.ms.num) + '</b> ' + esc(r.ms.name) + (r.ms.optional ? ' <span class="tl-tag">Optional</span>' : '') + '</div>'
    : '<button class="tl-lab' + (st.sel === r.p.id ? ' is-sel' : '') + '" data-phase="' + r.p.id + '" style="height:' + H + 'px"><span class="tl-num">' + esc(r.p.num) + '</span>' + esc(r.p.name) + marks(r.p) + '</button>').join('')
  const bars = rows.map((r, k) => {
    const top = k * H + 7
    if (r.kind === 'ms') return '<div class="tl-band ' + msClass(r.i, r.ms) + '" style="top:' + top + 'px;left:' + x(r.ms.start) + '%;width:' + w(r.ms.start, r.ms.end) + '%" title="' + esc(r.ms.num + ' ' + r.ms.name + ' · ' + range(r.ms.start, r.ms.end)) + '"></div>'
    const p = r.p
    const cps = p.items.filter((it) => it.checkpoint && it.date).map((it) => '<span class="tl-cp' + (x(it.date) > 82 ? ' is-left' : '') + '" style="top:' + (top + 2) + 'px;left:' + (x(it.date) + 50 / total) + '%" title="' + esc(day(it.date) + ' · ' + it.text) + '"><b class="tl-dia"></b><em>' + esc(it.text.replace(/^[^:]+:\s*/, '')) + '</em></span>').join('')
    return '<button class="tl-barp ' + msClass(r.i, r.ms) + (st.sel === p.id ? ' is-sel' : '') + '" data-phase="' + p.id + '" style="top:' + top + 'px;left:' + x(p.start) + '%;width:' + w(p.start, p.end) + '%" title="' + esc(p.num + ' ' + p.name + ' · ' + range(p.start, p.end)) + '"></button>' + cps
  }).join('')
  return '<div class="tl-gantt"><div class="tl-ggrid"><div class="tl-gl"><div class="tl-gh">Phase</div>' + labels + '</div>' +
    '<div class="tl-gr"><div class="tl-gh tl-scale">' + scale + '</div><div class="tl-plot" style="height:' + rows.length * H + 'px">' + bg + bars + '</div></div></div></div>'
}

/* ---------- Month: weeks as rows, phases as bars across the days, checkpoints on their day ---------- */
function month(m, st) {
  const c = D(st.cursor), y = c.getUTCFullYear(), mo = c.getUTCMonth()
  const first = new Date(Date.UTC(y, mo, 1)).toISOString().slice(0, 10)
  const last = new Date(Date.UTC(y, mo + 1, 0)).toISOString().slice(0, 10)
  const all = phases(m)
  let out = '<div class="tl-month"><div class="tl-wdays">' + WD.map((d) => '<span>' + d + '</span>').join('') + '</div>'
  for (let ws = monday(first); ws <= last; ws = add(ws, 7)) {
    const we = add(ws, 6)
    const segs = all.filter((p) => p.start <= we && p.end >= ws).map((p) => ({ p, s: p.start < ws ? ws : p.start, e: p.end > we ? we : p.end }))
    const lanes = []
    segs.forEach((g) => { let l = lanes.findIndex((end) => end < g.s); if (l < 0) { l = lanes.length; lanes.push('') } lanes[l] = g.e; g.lane = l })
    const span = 3 + lanes.length // day row, checkpoint row, the lanes, a closing gap
    let cells = '', cps = ''
    for (let i = 0; i < 7; i++) {
      const d = add(ws, i)
      const cls = ['tl-day', d < first || d > last ? 'is-out' : '', i > 4 ? 'is-we' : '', inBreak(m, d) ? 'is-break' : '', d === st.today ? 'is-today' : ''].filter(Boolean).join(' ')
      cells += '<div class="' + cls + '" style="grid-column:' + (i + 1) + ';grid-row:1 / span ' + span + '"><span class="tl-dn">' + D(d).getUTCDate() + '</span></div>'
      const here = m.checkpoints.filter((k) => k.date === d)
      if (here.length) cps += '<div class="tl-mcp" style="grid-column:' + (i + 1) + ';grid-row:2">' + here.map((k) => '<button data-phase="' + k.phase + '" title="' + esc(k.label) + '"><b class="tl-dia"></b>' + esc(k.label.replace(/^[^:]+:\s*/, '')) + '</button>').join('') + '</div>'
    }
    const bars = segs.map((g) => '<button class="tl-seg ' + msClass(g.p.msi, g.p.ms) + (g.s === g.p.start ? ' is-start' : '') + (g.e === g.p.end ? ' is-end' : '') + (st.sel === g.p.id ? ' is-sel' : '') + '" data-phase="' + g.p.id + '" style="grid-column:' + (wd(g.s) + 1) + ' / ' + (wd(g.e) + 2) + ';grid-row:' + (g.lane + 3) + '" title="' + esc(g.p.num + ' ' + g.p.name + ' · ' + range(g.p.start, g.p.end)) + '"><span>' + esc(g.p.num + ' ' + g.p.name) + '</span></button>').join('')
    out += '<div class="tl-week" style="grid-template-rows:30px auto' + ' auto'.repeat(lanes.length) + ' 8px">' + cells + cps + bars + '</div>'
  }
  return out + '</div>'
}

/* ---------- Week: the seven days with their checkpoints, then what is running ---------- */
function week(m, st) {
  const ws = monday(st.cursor), we = add(ws, 6)
  let strip = ''
  for (let i = 0; i < 7; i++) {
    const d = add(ws, i)
    const here = m.checkpoints.filter((k) => k.date === d)
    strip += '<div class="tl-wday' + (i > 4 ? ' is-we' : '') + (inBreak(m, d) ? ' is-break' : '') + (d === st.today ? ' is-today' : '') + '"><span class="tl-wdh">' + WD[i] + ' <b>' + D(d).getUTCDate() + '</b></span>' +
      here.map((k) => '<button class="tl-wcp" data-phase="' + k.phase + '"><b class="tl-dia"></b><span>' + esc(k.label) + '</span><em>' + esc(k.num) + '</em></button>').join('') + '</div>'
  }
  const act = phases(m).filter((p) => p.start <= we && p.end >= ws)
  const state = (p) => p.start >= ws ? 'Starts ' + WD[wd(p.start)] + ' ' + day(p.start) : p.end <= we ? 'Ends ' + WD[wd(p.end)] + ' ' + day(p.end) : 'Day ' + workdays(p.start, ws < p.start ? p.start : ws) + ' of ' + workdays(p.start, p.end)
  const list = act.length
    ? act.map((p) => '<button class="tl-act' + (st.sel === p.id ? ' is-sel' : '') + '" data-phase="' + p.id + '"><b class="tl-sw ' + msClass(p.msi, p.ms) + '"></b><span class="tl-act-t"><span class="tl-num">' + esc(p.num) + '</span>' + esc(p.name) + marks(p) + '</span><span class="tl-act-d">' + esc(range(p.start, p.end)) + '</span><span class="tl-act-s">' + esc(state(p)) + '</span>' + (p.acceptance ? '<span class="tl-act-a"><b>Acceptance:</b> ' + esc(p.acceptance) + '</span>' : '') + '</button>').join('')
    : '<p class="tl-empty">' + (inBreak(m, ws) || inBreak(m, we) ? 'Break: no phase runs this week.' : 'No phase runs this week.') + '</p>'
  return '<div class="tl-weekv"><div class="tl-wstrip">' + strip + '</div><h3 class="tl-h">Running this week</h3>' + list + '</div>'
}

/* ---------- Day: one day by hour — what runs all day, then each hour with its timed checkpoints, the Today line at now ---------- */
const H0 = 7, H1 = 20 // the hours a working day shows; a timed item outside them widens the range
const hourOf = (t) => (/^(\d{1,2})(?::(\d{2}))?/.exec(t || '') || []).slice(1).map((n) => +(n || 0))
function dayView(m, st) {
  const d = st.cursor
  const run = phases(m).filter((p) => p.start <= d && p.end >= d)
  const here = m.checkpoints.filter((k) => k.date === d)
  const timed = here.filter((k) => k.time), untimed = here.filter((k) => !k.time)
  const hs = timed.map((k) => hourOf(k.time)[0])
  /* on today the range also reaches the hour now, so the Today line always has a place */
  const nowH = d === st.today && st.now != null ? Math.floor(st.now / 60) : null
  const from = Math.min(H0, ...hs, ...(nowH != null ? [nowH] : [])), to = Math.max(H1, ...hs.map((h) => h + 1), ...(nowH != null ? [nowH + 1] : []))
  const all = '<div class="tl-dall"><span class="tl-dlab">All day</span><div class="tl-dall-b">' +
    (run.length || untimed.length
      ? run.map((p) => '<button class="tl-dseg ' + msClass(p.msi, p.ms) + (st.sel === p.id ? ' is-sel' : '') + '" data-phase="' + p.id + '" title="' + esc(p.num + ' ' + p.name + ' · ' + range(p.start, p.end)) + '"><span>' + esc(p.num + ' ' + p.name) + '</span></button>').join('') +
        untimed.map((k) => '<button class="tl-wcp" data-phase="' + k.phase + '"><b class="tl-dia"></b><span>' + esc(k.label) + '</span><em>' + esc(k.num) + '</em></button>').join('')
      : '<p class="tl-empty">' + (inBreak(m, d) ? 'Break: no phase runs today.' : 'No phase runs this day.') + '</p>') + '</div></div>'
  let rows = ''
  for (let h = from; h < to; h++) {
    const at = timed.filter((k) => hourOf(k.time)[0] === h)
    rows += '<div class="tl-hour"><span class="tl-hl">' + String(h).padStart(2, '0') + ':00</span><div class="tl-hb">' +
      at.map((k) => '<button class="tl-wcp" data-phase="' + k.phase + '"><b class="tl-dia"></b><span>' + esc(k.time + ' · ' + k.label) + '</span><em>' + esc(k.num) + '</em></button>').join('') + '</div></div>'
  }
  const now = d === st.today && st.now != null && st.now >= from * 60 && st.now < to * 60
    ? '<i class="tl-dnow" style="top:calc(' + ((st.now - from * 60) / ((to - from) * 60)) * 100 + '% )"><span>Today</span></i>' : ''
  return '<div class="tl-dayv' + (inBreak(m, d) ? ' is-break' : '') + '">' + all + '<div class="tl-hours">' + rows + now + '</div></div>'
}

function detail(m, st) {
  const p = phases(m).find((q) => q.id === st.sel)
  if (!p) return ''
  return '<aside class="tl-detail"><button class="tl-x" data-close aria-label="Close">×</button>' +
    '<p class="tl-eyebrow">' + esc(p.ms.num + ' ' + p.ms.name) + (p.ms.optional ? ' · Optional' : '') + '</p>' +
    '<h3><span class="tl-num">' + esc(p.num) + '</span>' + esc(p.name) + '</h3>' +
    '<p class="tl-meta"><b>Dates:</b> ' + esc(range(p.start, p.end)) + ' · ' + workdays(p.start, p.end) + ' working days</p>' +
    (p.confirm ? '<p class="tl-meta"><span class="tl-confirm"><i></i>To confirm</span> ' + esc(p.confirm) + '</p>' : '') +
    (p.acceptance ? '<p class="tl-meta"><b>Acceptance:</b> ' + esc(p.acceptance) + '</p>' : '') +
    '<ol class="tl-items">' + p.items.map((it) => '<li><span class="tl-num">' + esc(it.num) + '</span>' + (it.checkpoint ? '<b class="tl-dia"></b>' : '') + esc(it.text) + (it.date ? ' <em>' + esc(WD[wd(it.date)] + ' ' + day(it.date)) + '</em>' : '') + '</li>').join('') + '</ol></aside>'
}

export function renderTimeline(m, st) {
  const nav = st.view === 'timeline' ? '<span class="tl-title">' + esc(dayY(m.first) + ' – ' + dayY(m.last)) + '</span>'
    : '<span class="tl-nav"><button data-nav="-1" aria-label="Previous">‹</button><span class="tl-title">' +
      (st.view === 'month' ? MONTH[D(st.cursor).getUTCMonth()] + ' ' + D(st.cursor).getUTCFullYear() : st.view === 'day' ? WD[wd(st.cursor)] + ' ' + dayY(st.cursor) : 'Week ' + weekNo(st.cursor) + ' · ' + range(monday(st.cursor), add(monday(st.cursor), 6)) + ' ' + D(add(monday(st.cursor), 6)).getUTCFullYear()) +
      '</span><button data-nav="1" aria-label="Next">›</button><button class="tl-todayb" data-nav="0">Today</button></span>'
  const body = st.view === 'month' ? month(m, st) : st.view === 'week' ? week(m, st) : st.view === 'day' ? dayView(m, st) : timeline(m, st)
  return '<div class="tl-bar"><div class="tl-switch" role="group" aria-label="View">' + VIEWS.map(([k, l]) => '<button data-view="' + k + '" aria-pressed="' + (st.view === k) + '">' + l + '</button>').join('') + '</div>' + nav + '</div>' +
    legend(m) + '<div class="tl-body is-' + st.view + (st.sel ? ' has-detail' : '') + '">' + body + detail(m, st) + '</div>'
}

/* the Timeline view alone, static, for print (scripts/timeline-print.mjs): legend and chart, no controls */
export function printTimeline(m, today) {
  return legend(m) + timeline(m, { today, sel: null })
}

/* the controller: one delegated click handler, state in a closure, the view remembered per viewer */
export function mountTimeline(root, m, opts = {}) {
  const today = opts.today || new Date().toISOString().slice(0, 10)
  const home = clamp(today, m.first, m.last)
  let saved = null
  try { saved = localStorage.getItem(opts.storageKey ?? 'kol-time-view') } catch { /* storage blocked: start on Timeline */ }
  /* `now` — minutes since midnight, for the Day view's Today line */
  const at = opts.now ? new Date(opts.now) : new Date()
  const st = { view: VIEWS.some(([k]) => k === (opts.view ?? saved)) ? (opts.view ?? saved) : 'timeline', cursor: home, sel: null, today, now: at.getHours() * 60 + at.getMinutes() }
  const draw = () => { root.innerHTML = renderTimeline(m, st) }
  const onClick = (e) => {
    const t = e.target.closest('[data-view],[data-nav],[data-phase],[data-close]')
    if (!t || !root.contains(t)) return
    if (t.dataset.view) { st.view = t.dataset.view; try { localStorage.setItem(opts.storageKey ?? 'kol-time-view', st.view) } catch { /* not remembered */ } }
    else if (t.dataset.nav !== undefined) {
      const n = +t.dataset.nav
      if (n === 0) st.cursor = home
      else if (st.view === 'month') { const d = D(st.cursor); d.setUTCDate(1); d.setUTCMonth(d.getUTCMonth() + n); st.cursor = clamp(d.toISOString().slice(0, 10), m.first.slice(0, 8) + '01', m.last) }
      else if (st.view === 'day') st.cursor = clamp(add(st.cursor, n), m.start, m.end)
      else st.cursor = clamp(add(st.cursor, 7 * n), monday(m.first), m.last)
    }
    else if (t.dataset.phase) st.sel = st.sel === t.dataset.phase ? null : t.dataset.phase
    else if (t.dataset.close !== undefined) st.sel = null
    draw()
  }
  root.classList.add('tl')
  root.addEventListener('click', onClick)
  draw()
  return () => root.removeEventListener('click', onClick)
}
