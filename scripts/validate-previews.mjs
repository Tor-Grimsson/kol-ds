#!/usr/bin/env node
/**
 * validate-previews.mjs — every component page shows a working preview (pnpm validate:previews,
 * 2026-10-01).
 *
 * The user asked three times for the components without a preview to be found by a scan instead
 * of by eye. validate-preview-files proves a preview FILE exists; nothing proved it draws anything — a preview
 * can exist and render an empty stage, throw into its error boundary, or never be placed on the
 * page. This reads the RENDERED page, like validate-rail-pages.
 *
 * For every component in the A–Z index (/search/index):
 *
 *   V1  the page has a preview card at all
 *   V2  the preview draws something — an element with a real box inside the stage
 *   V3  the preview did not fall into its error boundary, and the page threw nothing
 *
 * Browser gate: not part of the default `pnpm validate`. Starts the showcase on its own port,
 * kills it. `--list` prints the failures as bare names, for working the backlog down.
 */
import { spawn } from 'node:child_process'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { chromium } from 'playwright'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const PORT = 5395
const BASE = `http://127.0.0.1:${PORT}`
const LIST = process.argv.includes('--list')

async function waitFor(url, ms = 90000) {
  const end = Date.now() + ms
  while (Date.now() < end) {
    try { if ((await fetch(url)).ok) return true } catch { /* not up yet */ }
    await new Promise((r) => setTimeout(r, 300))
  }
  return false
}

/* runs IN the page */
function readPreview() {
  const fig = document.querySelector('main .kol-doc-figure')
  if (!fig) return { v: 'V1', why: 'no preview card on the page' }
  const text = fig.textContent ?? ''
  if (/no live preview|No preview registered/.test(text)) return { v: 'V1', why: 'the card says there is no preview' }
  /* the stage is the card's body — everything after the toolbar row */
  const body = [...fig.children].slice(1)
  /* a framed preview (previews-registry `frame`) draws in its own document — look inside it */
  const inFrame = (f) => { try { return [...(f.contentDocument?.body?.querySelectorAll('*') ?? [])].some((el) => { const r = el.getBoundingClientRect(); return r.width > 4 && r.height >= 1 && el.children.length === 0 }) } catch { return false } }
  const drawn = body.some((b) => [b, ...b.querySelectorAll('iframe')].some((f) => f.tagName === 'IFRAME' && inFrame(f))) || body.some((b) => [...b.querySelectorAll('*')].some((el) => {
    const r = el.getBoundingClientRect()
    /* a rule is a drawing too: a Divider is one pixel tall */
    return el.tagName !== 'IFRAME' && r.width > 4 && r.height >= 1 && el.children.length === 0
  }))
  if (!drawn) return { v: 'V2', why: 'the stage is empty' }
  if (/Something went wrong|failed to render/i.test(text)) return { v: 'V3', why: 'the preview fell into its error boundary' }
  return null
}

const server = spawn('pnpm', ['--filter', 'showcase', 'exec', 'vite', '--port', String(PORT), '--strictPort', '--host', '127.0.0.1'], { cwd: ROOT, detached: true, stdio: 'ignore' })
const failures = []
let total = 0
try {
  if (!(await waitFor(`${BASE}/`))) throw new Error('showcase dev server did not start')
  const browser = await chromium.launch()
  const ctx = await browser.newContext({ viewport: { width: 1600, height: 1000 } })
  const first = await ctx.newPage()
  await first.goto(`${BASE}/search/index`, { waitUntil: 'load', timeout: 60000 })
  await first.waitForSelector('main a[href^="/components/"]', { timeout: 30000 })
  const hrefs = await first.$$eval('main a[href^="/components/"]', (as) => [...new Set(as.map((a) => a.getAttribute('href')))])
  await first.close()
  total = hrefs.length
  const visit = async (p, href) => {
    const errs = []
    const onErr = (e) => errs.push(e.message.split('\n')[0])
    p.on('pageerror', onErr)
    try { await p.goto(BASE + href, { waitUntil: 'load', timeout: 45000 }) } catch { /* reported as no preview below */ }
    await p.waitForSelector('main h1', { timeout: 8000 }).catch(() => {})
    /* a framed preview needs its own document to load */
    if (await p.$('main .kol-doc-figure iframe')) {
      await p.waitForFunction(() => { try { return (document.querySelector('main .kol-doc-figure iframe')?.contentDocument?.getElementById('root')?.querySelectorAll('*').length ?? 0) > 2 } catch { return false } }, null, { timeout: 15000 }).catch(() => {})
    }
    await p.waitForTimeout(400)
    const bad = await p.evaluate(readPreview).catch((e) => ({ v: 'V3', why: e.message.split('\n')[0] }))
    p.off('pageerror', onErr)
    if (bad) failures.push({ href, ...bad })
    else if (errs.length) failures.push({ href, v: 'V3', why: `threw — ${errs[0]}` })
  }
  const workers = await Promise.all(Array.from({ length: 8 }, () => ctx.newPage()))
  await Promise.all(workers.map(async (p, w) => {
    for (let i = w; i < hrefs.length; i += workers.length) await visit(p, hrefs[i])
  }))
  await browser.close()
} catch (e) {
  failures.push({ href: '-', v: 'V0', why: `the gate itself failed — ${e.message.split('\n')[0]}` })
} finally {
  try { process.kill(-server.pid, 'SIGTERM') } catch { /* already gone */ }
}

failures.sort((a, b) => a.href.localeCompare(b.href))
if (LIST) { for (const f of failures) console.log(f.href.replace('/components/', '')); process.exit(failures.length ? 1 : 0) }
if (failures.length) {
  console.log(`previews: ${failures.length} of ${total} component pages have no working preview\n\n  ${failures.map((f) => `${f.v}  ${f.href} — ${f.why}`).join('\n  ')}`)
  process.exit(1)
}
console.log(`previews: clean (${total} component pages, every one draws its preview)`)
