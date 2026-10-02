#!/usr/bin/env node
/**
 * validate-gaps.mjs — no rule sits flush against the content beside it (pnpm validate:gaps,
 * 2026-10-01).
 *
 * The user, on the tokens page, the last swatch's caption touching the next section's rule:
 * "also scan for these gap bugs, i keep finding them". They were found one page at a time and
 * patched one wrapper at a time (`mt-8`, `mt-10`), so the next page had the bug again. This reads
 * every RENDERED page, like validate-rail-pages and validate-previews.
 *
 * For every page reachable from the header's spaces, inside <main>:
 *
 *   G1  a rule (a top border, or an <hr>) has the content ABOVE it closer than 6px
 *   G2  a rule (a bottom border) has the content BELOW it closer than 6px
 *
 * "Content" is the ink — text and leaf boxes — not the neighbour's own box, so a list row that
 * carries its padding inside is not a finding. Table cells, controls and the preview stage (a
 * component's own drawing) are skipped.
 *
 * Browser gate: not part of the default `pnpm validate` — the full crawl is ~1,100 pages and half
 * an hour. Starts the showcase on its own port, kills it. The report groups by the rule's own class string, so one cause reads as one line.
 */
import { spawn } from 'node:child_process'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { chromium } from 'playwright'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const PORT = 5396
const BASE = `http://127.0.0.1:${PORT}`
const MIN = 6
/* `node scripts/validate-gaps.mjs /a /b` reads only those pages — for re-checking a fix without the
 * half-hour crawl */
const ONLY = process.argv.slice(2).filter((a) => a.startsWith('/'))
const SEEDS = ONLY.length ? ONLY : ['/', '/library', '/styles', '/docs', '/search', '/development', '/search/index']
/* ONE TEMPLATE, A FEW SAMPLES. The reference graph has a page per node (thousands) and they are
 * one layout; five of them prove it. Everything else is visited. */
const SAMPLED = [[/^\/references\/./, 5]]
const sampled = new Map()
const admit = (href) => {
  for (const [re, max] of SAMPLED) if (re.test(href)) { const n = sampled.get(re) ?? 0; if (n >= max) return false; sampled.set(re, n + 1) }
  return !href.startsWith('/components/preview/')
}

async function waitFor(url, ms = 90000) {
  const end = Date.now() + ms
  while (Date.now() < end) {
    try { if ((await fetch(url)).ok) return true } catch { /* not up yet */ }
    await new Promise((r) => setTimeout(r, 300))
  }
  return false
}

/* runs IN the page */
function readGaps(MIN) {
  const main = document.querySelector('main')
  if (!main) return { links: [], found: [] }
  const links = [...new Set([...document.querySelectorAll('a[href^="/"]')].map((a) => a.getAttribute('href').split(/[?#]/)[0]))]
  /* a specimen is not the page: the preview stage, a card's live thumbnail (`data-toc-skip`, the
   * same marker the outline uses) */
  const SKIP = 'table, button, input, select, textarea, [role="listbox"], [role="menu"], .kol-doc-figure > :not(:first-child), [data-toc-skip], iframe, svg, pre'
  /* A COMPONENT'S OWN RULE IS ITS DESIGN — a card's plate under its image, a header tab's
   * underline. Only the page's rules are judged: an <hr>, a utility border, a doc section. */
  const owned = (el) => [...el.classList].some((c) => c.startsWith('kol-') && !c.startsWith('kol-doc-'))
  const shown = (el) => { const r = el.getBoundingClientRect(); const cs = getComputedStyle(el); return r.width > 4 && r.height > 0 && cs.visibility !== 'hidden' && cs.display !== 'none' }
  /* the ink inside an element: its text runs and its leaf boxes */
  /* only what is SEEN: a rect inside a clipping ancestor (overflow hidden / auto / scroll) ends where
   * that ancestor does — a table's rows can measure past a scroller that hides them */
  const seen = (rect, from, root) => {
    let top = rect.top, bottom = rect.bottom
    for (let a = from; a && a !== root.parentElement; a = a.parentElement) {
      const cs = getComputedStyle(a)
      if (cs.overflowY !== 'visible' || cs.overflowX !== 'visible') { const b = a.getBoundingClientRect(); top = Math.max(top, b.top); bottom = Math.min(bottom, b.bottom) }
    }
    return bottom > top ? { top, bottom, width: rect.width, height: bottom - top } : null
  }
  const ink = (el) => {
    const rects = []
    const tw = document.createTreeWalker(el, NodeFilter.SHOW_TEXT)
    for (let n = tw.nextNode(); n; n = tw.nextNode()) {
      if (!n.textContent.trim()) continue
      /* text for a screen reader only (a table's caption, clipped to 1px) is not ink */
      const host = n.parentElement
      if (host?.closest('.sr-only') || (host && (() => { const b = host.getBoundingClientRect(); return b.width <= 1 || b.height <= 1 })())) continue
      const range = document.createRange(); range.selectNodeContents(n)
      for (const r of range.getClientRects()) if (r.width > 1 && r.height > 1) { const v = seen(r, host, el); if (v) rects.push(v) }
    }
    for (const leaf of [el, ...el.querySelectorAll('*')]) {
      if (leaf.children.length || leaf.textContent.trim()) continue
      const r = leaf.getBoundingClientRect()
      const cs = getComputedStyle(leaf)
      const painted = cs.backgroundColor !== 'rgba(0, 0, 0, 0)' || cs.backgroundImage !== 'none' || /^(IMG|VIDEO|CANVAS)$/.test(leaf.tagName)
      if (painted && r.width > 4 && r.height > 4) { const v = seen(r, leaf, el); if (v) rects.push(v) }
    }
    return rects
  }
  const ruled = (cs, side) => parseFloat(cs[`border${side}Width`]) > 0 && cs[`border${side}Style`] !== 'none' && !/rgba\(0, 0, 0, 0\)|transparent/.test(cs[`border${side}Color`])
  const name = (el) => `${el.tagName.toLowerCase()}${el.id ? `#${el.id}` : ''}.${[...el.classList].slice(0, 6).join('.')}`
  const found = []
  for (const el of main.querySelectorAll('*')) {
    if (el.closest(SKIP) || owned(el) || !shown(el)) continue
    const cs = getComputedStyle(el)
    const r = el.getBoundingClientRect()
    const top = el.tagName === 'HR' || ruled(cs, 'Top')
    const bottom = ruled(cs, 'Bottom')
    /* a box ruled on all four sides is a frame, not a divider */
    if (top && bottom && ruled(cs, 'Left')) continue
    if (top) {
      const prev = el.previousElementSibling
      if (prev && shown(prev) && !prev.closest(SKIP)) {
        const above = ink(prev).reduce((m, x) => Math.max(m, x.bottom), -Infinity)
        if (above > -Infinity && r.top - above < MIN && r.top - above > -40) found.push({ v: 'G1', sig: name(el), gap: Math.round(r.top - above), text: (prev.textContent ?? '').trim().slice(-40) })
      }
    }
    if (bottom) {
      const next = el.nextElementSibling
      if (next && shown(next) && !next.closest(SKIP)) {
        const below = ink(next).reduce((m, x) => Math.min(m, x.top), Infinity)
        if (below < Infinity && below - r.bottom < MIN && below - r.bottom > -40) found.push({ v: 'G2', sig: name(el), gap: Math.round(below - r.bottom), text: (next.textContent ?? '').trim().slice(0, 40) })
      }
    }
  }
  return { links, found }
}

/* a killed gate must not leave its server behind */
for (const sig of ['SIGINT', 'SIGTERM']) process.on(sig, () => { try { process.kill(-server.pid, 'SIGTERM') } catch { /* gone */ } process.exit(1) })
const server = spawn('pnpm', ['--filter', 'showcase', 'exec', 'vite', '--port', String(PORT), '--strictPort', '--host', '127.0.0.1'], { cwd: ROOT, detached: true, stdio: 'ignore' })
const findings = []
const seen = new Set(SEEDS)
const queue = [...SEEDS]
let failed = null
try {
  if (!(await waitFor(`${BASE}/`))) throw new Error('showcase dev server did not start')
  const browser = await chromium.launch()
  const ctx = await browser.newContext({ viewport: { width: 1600, height: 1000 } })
  let busy = 0
  let done = 0
  const worker = async () => {
    const p = await ctx.newPage()
    for (;;) {
      const href = queue.shift()
      if (!href) { if (busy === 0) break; await new Promise((r) => setTimeout(r, 100)); continue }
      busy++
      try {
        /* domcontentloaded, not load: a page with a streaming video or a dead font never finishes loading */
        await p.goto(BASE + href, { waitUntil: 'domcontentloaded', timeout: 45000 })
        /* the route is lazy: wait for the page itself, not the shell's Loading… fallback */
        await p.waitForFunction(() => { const m = document.querySelector('main'); return m && m.querySelector('h1, h2, section, article') && !/^\s*Loading…\s*$/.test(m.textContent ?? '') && document.querySelectorAll('a[href^="/"]').length > 3 }, null, { timeout: 15000 }).catch(() => {})
        await p.waitForTimeout(600)
        /* a client-side redirect can replace the document mid-read — read again once it settles */
        const read = () => p.evaluate(readGaps, MIN)
        const { links, found } = await read().catch(async () => { await p.waitForTimeout(1500); return read() })
        if (!ONLY.length) for (const l of links) if (!seen.has(l) && admit(l)) { seen.add(l); queue.push(l) }
        if (++done % 50 === 0) process.stderr.write(`gaps: ${done} pages read, ${queue.length} queued\n`)
        for (const f of found) findings.push({ href, ...f })
      } catch (e) { process.stderr.write(`gaps: could not read ${href} — ${e.message.split('\n')[0]}\n`) }
      busy--
    }
    await p.close()
  }
  await Promise.all(Array.from({ length: 8 }, worker))
  await browser.close()
} catch (e) {
  failed = e.message.split('\n')[0]
} finally {
  try { process.kill(-server.pid, 'SIGTERM') } catch { /* already gone */ }
}

if (failed) { console.log(`gaps: the gate itself failed — ${failed}`); process.exit(1) }
if (!findings.length) { console.log(`gaps: clean (${seen.size} pages, no rule flush against its neighbour)`); process.exit(0) }

/* one cause, one line: group by the rule's own class string */
const groups = new Map()
for (const f of findings) {
  const k = `${f.v}  ${f.sig}`
  const g = groups.get(k) ?? { pages: new Set(), gap: f.gap, text: f.text, n: 0 }
  g.pages.add(f.href); g.n++; g.gap = Math.min(g.gap, f.gap)
  groups.set(k, g)
}
const rows = [...groups].sort((a, b) => b[1].pages.size - a[1].pages.size)
console.log(`gaps: ${findings.length} flush rules in ${rows.length} patterns, across ${new Set(findings.map((f) => f.href)).size} of ${seen.size} pages\n`)
for (const [k, g] of rows) console.log(`  ${k}\n      ${g.n}× on ${g.pages.size} page(s), tightest ${g.gap}px — e.g. ${[...g.pages].slice(0, 3).join(' · ')} — beside "${g.text}"`)
process.exit(1)
