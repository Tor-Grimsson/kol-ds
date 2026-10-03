#!/usr/bin/env node
/**
 * validate-render.mjs — what the apps actually RENDER, measured (pnpm validate:render).
 *
 * The static gates read source; these three read the page. Each app under apps/ is served on its
 * own port (started here, killed here), every route in ROUTES is opened at desktop (1440) and phone
 * (390), and three things are measured. Required before a publish (plan-2026-09-29-apps-review D1).
 *
 * Why (the user, 2026-09-29): *"its stressful not being able to trust your own site … why do buttons
 * and dropdown or other similar controls use different sizes … is there no thought when implementing
 * f.e. media and shell to make sure buttons dont overlap each other"* — and a settings dropdown one
 * tone lighter than the rest of its section.
 *
 *   R1  ROW HEIGHT — controls (`.kol-btn` · `.kol-control` · `.kol-seg` · `.kol-menu-btn`) on one row of one flex parent
 *       render the same height (±1px). One row, one size (01-foundations/09-sizes.md).
 *   R2  OVERLAP — a visible interactive element whose centre is covered by ANOTHER interactive
 *       element. The hamburger over the masthead, buttons on buttons.
 *   R0  a page that throws — a crash must not read as "no violations".
 *   R3  TONE SIBLINGS — dropdown triggers in one settings section (the block under one
 *       `.kol-eyebrow`) paint the same fill and ink.
 *
 * Usage: node scripts/validate-render.mjs [app …]   (no args = every app)
 */
import { spawn } from 'node:child_process'
import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { chromium } from 'playwright'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const BASE_PORT = 5290
const VIEWPORTS = [
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'phone', width: 390, height: 844, isMobile: true, hasTouch: true },
]
/* app → hash routes worth opening (default: the landing only) */
const ROUTES = {
  'media-hub': ['#/', '#/library', '#/settings', '#/notes', '#/decks', '#/brand'],
  'media-hub': ['#/', '#/settings'],
  hub: ['#/', '#/settings', '#/tool'],
  shell: ['#/one', '#/settings'],
  brand: ['colour/ramps', 'colour/anchors', 'colour/combinations', 'type/families', 'logo/displays', 'logo/clearspace', 'logo/scaling', 'stationery/business-card', 'stationery/set', 'assets/downloads', 'assets/imagery', 'assets/business'],
  notes: ['', '#list'],
  presentation: ['', '#list'],
  'notes-hub': ['#/', '#/notes'],
  'presentation-hub': ['#/', '#/decks'],
  editor: ['', 'labs', 'randomiser', 'core'],
  studio: ['#/', '#/library', '#/create', '#/use', '#/stage', '#/settings'],
  panels: ['#/effects', '#/generators/pattern', '#/inspector/text', '#/inspector/photo'],
  'brand-hub': ['#/', '#/assets', '#/notes', '#/decks', '#/media', '#/editor', '#/settings'],
  'rack-hub': ['#/', '#/rack', '#/library', '#/create', '#/stage', '#/settings'],
  'mixer-hub': ['#/', '#/library', '#/create', '#/studio', '#/expressions', '#/mixer', '#/tape', '#/fronts', '#/icons', '#/settings'],
  fixtures: ['#media/buckets', '#media/files', '#workshop/docs', '#workshop/components', '#voyager/files', '#voyager/brand', '#voyager/business'],
}

/* KNOWN AND MEANT, or parked on a ruling — every entry names why, and the run prints how many it
 * allowed, so an allowance is never a silent hole. `match` is tested against the violation line. */
const ALLOWED = [
  { app: 'editor', match: /R2 overlap: "(Stroke color" and "Fill color|Fill color" and "Stroke color)"/, why: 'SwatchStack overlaps fill + stroke on purpose (the pair model, editor-chrome-review #16)' },
  /* the COMPOSITOR only — labs and the randomiser have phone layouts and are held to them; a phone
   * at `/` is gated to the randomiser, so only /core shows the compositor at 390 */
  { app: 'editor', vp: 'phone', match: /^editor (core )?@phone .*R2 overlap/, why: 'the compositor has no phone layout yet — parked with the editor rulings, not a regression' },
]

const apps = readdirSync(join(ROOT, 'apps')).filter((a) => {
  const pkg = join(ROOT, 'apps', a, 'package.json')
  return existsSync(pkg) && JSON.parse(readFileSync(pkg, 'utf8')).scripts?.dev && existsSync(join(ROOT, 'apps', a, 'index.html'))
})
const only = process.argv.slice(2)
const targets = only.length ? apps.filter((a) => only.includes(a)) : apps

/* runs IN the page: returns { r1: [], r2: [], r3: [] } */
function measure() {
  const vis = (e) => {
    const r = e.getBoundingClientRect()
    if (r.width < 2 || r.height < 2) return false
    const s = getComputedStyle(e)
    return s.visibility !== 'hidden' && s.display !== 'none' && Number(s.opacity) > 0.05 && !e.closest('[aria-hidden="true"],[inert]')
  }
  /* the part of the box actually on screen — clipped by every overflow ancestor (a row scrolled
   * out of its container is not "under" the phone bar, it is out of view) */
  const shown = (e) => {
    let r = e.getBoundingClientRect()
    let box = { left: r.left, top: r.top, right: r.right, bottom: r.bottom }
    for (let p = e.parentElement; p && p !== document.documentElement; p = p.parentElement) {
      const s = getComputedStyle(p)
      if (s.overflowX === 'visible' && s.overflowY === 'visible') continue
      const c = p.getBoundingClientRect()
      box = { left: Math.max(box.left, c.left), top: Math.max(box.top, c.top), right: Math.min(box.right, c.right), bottom: Math.min(box.bottom, c.bottom) }
      if (box.right <= box.left || box.bottom <= box.top) return null
    }
    return box
  }
  const label = (e) => (e.getAttribute('aria-label') || e.textContent || e.getAttribute('placeholder') || e.className).trim().replace(/\s+/g, ' ').slice(0, 32)

  /* R1 */
  const CONTROL = '.kol-btn, .kol-control, .kol-seg, .kol-menu-btn'
  const controls = [...document.querySelectorAll(CONTROL)].filter((e) => vis(e) && !e.parentElement.closest(CONTROL))
  /* A ROW IS WHAT THE EYE SEES, not a DOM parent: a Tooltip's span or a wrapper div between two
   * controls hid them from each other. Controls whose centres sit within 4px and whose edges are
   * within 32px of each other are one row. */
  const boxes = controls.map((c) => ({ c, r: c.getBoundingClientRect() })).filter((x) => x.r.width > 2).sort((p, q) => p.r.left - q.r.left)
  const r1 = []
  let compared = 0
  const used = new Set()
  for (const start of boxes) {
    if (used.has(start)) continue
    const cy = start.r.top + start.r.height / 2
    const row = [start]
    let right = start.r.right
    for (const x of boxes) {
      if (x === start || used.has(x) || row.includes(x)) continue
      if (Math.abs(x.r.top + x.r.height / 2 - cy) > 4) continue
      if (x.r.left - right > 32 || x.r.left < start.r.left) continue
      row.push(x); right = Math.max(right, x.r.right)
    }
    if (row.length < 2) continue
    row.forEach((x) => used.add(x))
    compared++
    const hs = row.map((x) => Math.round(x.r.height * 10) / 10)
    if (Math.max(...hs) - Math.min(...hs) > 1) r1.push(row.map((x, i) => `${label(x.c)}=${hs[i]}`).join(' · '))
  }

  /* R2 */
  const INTERACTIVE = 'button, a[href], input:not([type=hidden]), select, textarea, [role=button], [role=tab]'
  /* pairwise: two controls whose boxes share more than 16px² — and the overlap is really drawn
   * (the element on top at the overlap's centre is one of the two, not a scrim or a closed layer) */
  const r2 = []
  const seen = new Set()
  const hits = [...document.querySelectorAll(INTERACTIVE)].filter((e) => {
    if (!vis(e)) return false
    const r = shown(e)
    return r && r.bottom > 0 && r.right > 0 && r.top < innerHeight && r.left < innerWidth
  })
  for (let i = 0; i < hits.length; i++) {
    for (let j = i + 1; j < hits.length; j++) {
      const a = hits[i], b = hits[j]
      if (a.contains(b) || b.contains(a)) continue
      const ra = shown(a), rb = shown(b)
      const w = Math.min(ra.right, rb.right) - Math.max(ra.left, rb.left)
      const h = Math.min(ra.bottom, rb.bottom) - Math.max(ra.top, rb.top)
      if (w <= 0 || h <= 0 || w * h <= 16) continue
      /* A CONTROL PLACED ON A TILE is a pattern, not a collision — a card's corner actions sit wholly
       * inside the card's box. An accident overlaps PART of a neighbour (the hamburger on the gear). */
      const inside = (x, y) => x.left >= y.left - 0.5 && x.top >= y.top - 0.5 && x.right <= y.right + 0.5 && x.bottom <= y.bottom + 0.5
      if (inside(ra, rb) || inside(rb, ra)) continue
      /* THE PHONE BAR FLOATS: content under it at rest is fine when it can scroll clear — the column
       * owes it the bar's height (`--kol-shell-bar-h`), and the scroller still has that much room */
      const bar = (e) => e.closest('.kol-mobile-tabbar, .kol-phone-nav-more')
      const under = bar(a) ? b : bar(b) ? a : null
      if (under) {
        let sc = under.parentElement
        while (sc && sc !== document.documentElement && !(/(auto|scroll)/.test(getComputedStyle(sc).overflowY) && sc.scrollHeight > sc.clientHeight)) sc = sc.parentElement
        const room = !sc || sc === document.documentElement
          ? document.documentElement.scrollHeight - innerHeight - scrollY
          : sc.scrollHeight - sc.clientHeight - sc.scrollTop
        if (room >= h) continue
      }
      const top = document.elementFromPoint(Math.max(ra.left, rb.left) + w / 2, Math.max(ra.top, rb.top) + h / 2)
      if (!top || !(a.contains(top) || b.contains(top) || top === a || top === b)) continue
      const key = [label(a), label(b)].sort().join('|')
      if (seen.has(key)) continue
      seen.add(key)
      r2.push(`"${label(a)}" and "${label(b)}" overlap by ${Math.round(w)}×${Math.round(h)}px`)
    }
  }

  /* R3 */
  const r3 = []
  for (const eyebrow of document.querySelectorAll('.kol-eyebrow')) {
    const section = eyebrow.parentElement
    const triggers = [...section.querySelectorAll('.kol-dd-trigger')].filter(vis)
    if (triggers.length < 2) continue
    const paints = triggers.map((t) => { const s = getComputedStyle(t); return `${s.backgroundColor}/${s.color}` })
    if (new Set(paints).size > 1) {
      const odd = triggers.filter((_, i) => paints.filter((p) => p === paints[i]).length === 1)
      r3.push(`${eyebrow.textContent.trim()}: ${odd.map(label).join(', ')} paints differently from its siblings`)
    }
  }
  return { r1, r2, r3, compared }
}

async function waitFor(url, ms = 30000) {
  const end = Date.now() + ms
  while (Date.now() < end) {
    try { if ((await fetch(url)).ok) return true } catch { /* not up yet */ }
    await new Promise((r) => setTimeout(r, 300))
  }
  return false
}

const browser = await chromium.launch()
const failures = []
const allowed = []
const push = (app, vp, line) => {
  const a = ALLOWED.find((x) => x.app === app && (!x.vp || x.vp === vp) && x.match.test(line))
  ;(a ? allowed : failures).push(a ? `${line}  — ${a.why}` : line)
}
let checked = 0
let rowsCompared = 0
for (const [i, app] of targets.entries()) {
  const port = BASE_PORT + i
  const server = spawn('pnpm', ['--filter', app, 'exec', 'vite', '--port', String(port), '--strictPort', '--host', '127.0.0.1'], { cwd: ROOT, detached: true, stdio: 'ignore' })
  try {
    const base = `http://127.0.0.1:${port}/`
    if (!(await waitFor(base))) { failures.push(`${app}: server did not start`); continue }
    for (const vp of VIEWPORTS) {
      const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height }, isMobile: vp.isMobile, hasTouch: vp.hasTouch })
      const page = await ctx.newPage()
      let errs = []
      page.on('pageerror', (e) => errs.push(e.message.split('\n')[0]))
      for (const route of ROUTES[app] ?? ['']) {
        errs = []
        await page.goto(base + route, { waitUntil: 'networkidle' })
        await page.waitForTimeout(400)
        const { r1, r2, r3, compared } = await page.evaluate(measure)
        checked++
        rowsCompared += compared
        const where = `${app}${route ? ` ${route}` : ''} @${vp.name}`
        for (const m of r1) push(app, vp.name, `${where}  R1 row height: ${m}`)
        for (const m of r2) push(app, vp.name, `${where}  R2 overlap: ${m}`)
        for (const m of r3) push(app, vp.name, `${where}  R3 tone: ${m}`)
        for (const m of errs) push(app, vp.name, `${where}  R0 page error: ${m}`)
      }
      await ctx.close()
    }
  } finally {
    try { process.kill(-server.pid, 'SIGTERM') } catch { /* already gone */ }
  }
}
await browser.close()
if (allowed.length) console.log(`render: ${allowed.length} allowed (see ALLOWED in this script)${process.env.RENDER_SHOW_ALLOWED ? "\n  " + allowed.join("\n  ") : ""}`)

if (failures.length) {
  console.error(`render: ${failures.length} violation(s) over ${checked} page views, ${rowsCompared} control rows\n`)
  for (const f of failures) console.error('  ' + f)
  process.exit(1)
}
console.log(`render: clean (${checked} page views, ${targets.length} apps, ${rowsCompared} control rows measured)`)
