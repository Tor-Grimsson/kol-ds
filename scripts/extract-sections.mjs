#!/usr/bin/env node
/**
 * extract-sections.mjs — every page's sections, read off the RENDERED page (pnpm extract:sections,
 * 2026-10-01) → showcase/src/nav/page-sections.json.
 *
 * Why: a rail row with no children looked dislocated under its group (user: "cant we just use # to
 * link to sections? something so the sidebar doesnt look so dislocated when there are no sub
 * items?"). A row's sections are only known once its page has rendered — headings come from MDX,
 * from data files, from `DocSection` props — so they are read the way the right rail reads them
 * (h2 with an anchor, specimens excluded) and written down, like the usage and composition
 * manifests. Re-run after a page gains or loses a section.
 *
 * Covers the spaces whose rails list sections: Styles, Search, Development. Starts the showcase
 * on its own port, kills it.
 */
import { spawn } from 'node:child_process'
import { writeFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { chromium } from 'playwright'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const OUT = join(ROOT, 'showcase/src/nav/page-sections.json')
const PORT = 5398
const BASE = `http://127.0.0.1:${PORT}`
const SEEDS = ['/styles', '/search', '/development']
const OWNED = /^\/(styles|foundations|icons|search|development|references$|quarantine$)/

async function waitFor(url, ms = 90000) {
  const end = Date.now() + ms
  while (Date.now() < end) {
    try { if ((await fetch(url)).ok) return true } catch { /* not up yet */ }
    await new Promise((r) => setTimeout(r, 300))
  }
  return false
}

/* runs IN the page — the right rail's own rule (ShellChrome useHeadings), h2 only */
function read() {
  const main = document.getElementById('main') ?? document.querySelector('main')
  const links = [...new Set([...document.querySelectorAll('a[href^="/"]')].map((a) => a.getAttribute('href').split(/[?#]/)[0]))]
  if (!main) return { links, sections: [] }
  const sections = [...main.querySelectorAll('h2')]
    .filter((h) => !h.closest('[data-toc-skip], .kol-doc-figure, .kol-preview-stage'))
    .map((h) => ({ id: h.id || h.closest('section[id]')?.id, label: h.textContent.trim() }))
    .filter((x, i, all) => x.id && x.label && all.findIndex((y) => y.id === x.id) === i)
  return { links, sections }
}

for (const sig of ['SIGINT', 'SIGTERM']) process.on(sig, () => { try { process.kill(-server.pid, 'SIGTERM') } catch { /* gone */ } process.exit(1) })
const server = spawn('pnpm', ['--filter', 'showcase', 'exec', 'vite', '--port', String(PORT), '--strictPort', '--host', '127.0.0.1'], { cwd: ROOT, detached: true, stdio: 'ignore' })
const out = {}
try {
  if (!(await waitFor(`${BASE}/`))) throw new Error('showcase dev server did not start')
  const browser = await chromium.launch()
  const ctx = await browser.newContext({ viewport: { width: 1600, height: 1000 } })
  const seen = new Set(SEEDS)
  const queue = [...SEEDS]
  let busy = 0
  const worker = async () => {
    const p = await ctx.newPage()
    for (;;) {
      const href = queue.shift()
      if (!href) { if (busy === 0) break; await new Promise((r) => setTimeout(r, 100)); continue }
      busy++
      try {
        await p.goto(BASE + href, { waitUntil: 'domcontentloaded', timeout: 45000 })
        await p.waitForFunction(() => { const m = document.querySelector('main'); return m && m.querySelector('h1, h2, section, article') && document.querySelectorAll('a[href^="/"]').length > 3 }, null, { timeout: 15000 }).catch(() => {})
        await p.waitForTimeout(900)
        const once = () => p.evaluate(read)
        const { links, sections } = await once().catch(async () => { await p.waitForTimeout(1500); return once() })
        /* the page that answered, in case the route redirected */
        const at = new URL(p.url()).pathname
        if (at === href && sections.length > 1) out[href] = sections
        for (const l of links) if (!seen.has(l) && OWNED.test(l) && !/^\/references\/./.test(l)) { seen.add(l); queue.push(l) }
      } catch (e) { process.stderr.write(`sections: could not read ${href} — ${e.message.split('\n')[0]}\n`) }
      busy--
    }
    await p.close()
  }
  await Promise.all(Array.from({ length: 6 }, worker))
  await browser.close()
  const sorted = Object.fromEntries(Object.keys(out).sort().map((k) => [k, out[k]]))
  writeFileSync(OUT, JSON.stringify(sorted, null, 2) + '\n')
  console.log(`sections: ${Object.keys(sorted).length} of ${seen.size} pages have sections → showcase/src/nav/page-sections.json`)
} catch (e) {
  console.error(`sections: failed — ${e.message.split('\n')[0]}`)
  process.exitCode = 1
} finally {
  try { process.kill(-server.pid, 'SIGTERM') } catch { /* already gone */ }
}
