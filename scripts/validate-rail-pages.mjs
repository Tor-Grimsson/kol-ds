#!/usr/bin/env node
/**
 * validate-rail-pages.mjs — every category and every group in every rail opens its OWN page
 * (pnpm validate:rail-pages, 2026-09-30).
 *
 * The law (user, said six times before it was a gate): *"each fucking category or subcategory GETS
 * A FUCKING PAGE"*. Styles › Foundations opened Tokens, the Packages tiers opened their first
 * package, the Docs and Development eyebrows opened nothing — and every static gate stayed green,
 * because the rail trees are built in the browser from Vite globs no Node script can read. So this
 * one reads the RENDERED rails, like validate-render reads rendered pages.
 *
 * For each space root, every fold is opened (the rail's own fold-all event), then:
 *
 *   P1  every CATEGORY (L1 eyebrow) and every GROUP (a chapter at any depth) carries a link
 *   P2  a group's link is not one of its own children's — its page is its own, never its first
 *       row's. The vault chapter's `About` row is its index shown as a row (ruled 2026-08-02), the
 *       one allowed alias
 *   P3  the page behind the link renders — a heading, no page error, and after any redirect it is
 *       not a child's page either
 *
 * Components are checked in both Group-by modes. Starts the showcase on its own port, kills it.
 */
import { spawn } from 'node:child_process'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { chromium } from 'playwright'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const PORT = 5393
const BASE = `http://127.0.0.1:${PORT}`
const SPACES = ['/styles', '/library', '/docs', '/search', '/development']
/* the one child row allowed to share its group's page — the vault chapter's own index */
const ALIAS = new Set(['About'])

async function waitFor(url, ms = 40000) {
  const end = Date.now() + ms
  while (Date.now() < end) {
    try { if ((await fetch(url)).ok) return true } catch { /* not up yet */ }
    await new Promise((r) => setTimeout(r, 300))
  }
  return false
}

/* runs IN the page: every category and group of the left rail, with its link and its children's */
function readRail() {
  const rail = document.querySelector('.shell-rail--nav')
  if (!rail) return []
  const hrefOf = (el) => el?.getAttribute('href') ?? null
  const text = (el) => (el?.textContent ?? '').replace(/\(\d+\)\s*$/, '').trim()
  const out = []
  for (const eb of rail.querySelectorAll('.shell-sidebar-toggle, .shell-sidebar-label')) {
    const a = eb.matches('a') ? eb : eb.querySelector('a')
    out.push({ kind: 'category', label: text(eb), href: hrefOf(a), children: [] })
  }
  for (const head of rail.querySelectorAll('.shell-nav-group-header[role="button"]')) {
    const body = head.nextElementSibling
    const kids = body ? [...body.children].map((c) => {
      const link = c.matches('a') ? c : c.querySelector('.shell-nav-group-header a') ?? c.querySelector('a')
      return { label: text(c.matches('a') ? c : c.querySelector('.shell-nav-group-header') ?? c), href: hrefOf(link) }
    }) : []
    out.push({ kind: 'group', label: text(head), href: hrefOf(head.querySelector('a')), children: kids })
  }
  return out
}

const server = spawn('pnpm', ['--filter', 'showcase', 'exec', 'vite', '--port', String(PORT), '--strictPort', '--host', '127.0.0.1'], { cwd: ROOT, detached: true, stdio: 'ignore' })
const failures = []
let groups = 0
let pages = 0
try {
  if (!(await waitFor(`${BASE}/`, 90000))) throw new Error('showcase dev server did not start')
  const browser = await chromium.launch()
  const ctx = await browser.newContext({ viewport: { width: 1600, height: 1000 } })
  const page = await ctx.newPage()
  const found = new Map()
  for (const mode of ['atomic', 'function']) {
    await page.goto(`${BASE}/`)
    await page.evaluate((m) => localStorage.setItem('kol-showcase-grouping', m), mode)
    for (const space of SPACES) {
      if (mode === 'function' && space !== '/library') continue
      await page.goto(BASE + space, { waitUntil: 'load', timeout: 60000 })
      await page.waitForSelector('.shell-rail--nav', { timeout: 20000 }).catch(() => failures.push(`P0  ${space}: no left rail rendered`))
      /* open every fold at every depth — twice, since a nested group mounts only once its parent is open */
      for (let i = 0; i < 4; i++) {
        await page.evaluate(() => window.dispatchEvent(new CustomEvent('kol-rail-fold', { detail: { collapsed: false } })))
        await page.waitForTimeout(150)
      }
      for (const node of await page.evaluate(readRail)) {
        /* two groups may share a name (the Apps layer Engine and the Packages tier Engine) — the
         * first child tells them apart */
        const key = `${space} · ${node.kind} ${node.label}${node.children[0]?.href ? ` (over ${node.children[0].href})` : ''}`
        if (found.has(key)) continue
        found.set(key, node)
        groups++
        if (!node.href) { failures.push(`P1  ${key}: no page — the label links nowhere`); continue }
        const clash = node.children.find((c) => c.href === node.href && !ALIAS.has(c.label))
        if (clash) failures.push(`P2  ${key}: opens ${node.href}, which is its child "${clash.label}"'s page`)
      }
    }
  }
  /* P3 — visit each distinct page once, eight at a time */
  const hrefs = [...new Set([...found.values()].map((n) => n.href).filter(Boolean))]
  const visited = new Map()
  const visit = async (p, href) => {
    const errs = []
    const onErr = (e) => errs.push(e.message.split('\n')[0])
    p.on('pageerror', onErr)
    /* `load`, not networkidle — a page with a live stream never goes idle; the heading is the signal.
     * One retry: a cold dev server can time out a first compile, and a crash here used to fail the
     * gate with no violation printed (2026-09-30) */
    try { await p.goto(BASE + href, { waitUntil: 'load', timeout: 45000 }) }
    catch { try { await p.goto(BASE + href, { waitUntil: 'load', timeout: 45000 }) } catch (e) { errs.push(`did not load — ${e.message.split('\n')[0]}`) } }
    await p.waitForSelector('main h1', { timeout: 4000 }).catch(() => {})
    const h1 = await p.evaluate(() => document.querySelector('main h1')?.textContent?.trim() ?? '')
    p.off('pageerror', onErr)
    visited.set(href, { h1, landed: new URL(p.url()).pathname, errs })
  }
  const workers = await Promise.all(Array.from({ length: 8 }, () => ctx.newPage()))
  await Promise.all(workers.map(async (p, w) => {
    for (let i = w; i < hrefs.length; i += workers.length) await visit(p, hrefs[i])
  }))
  pages = visited.size
  for (const [key, node] of found) {
    if (!node.href) continue
    const { h1, landed, errs } = visited.get(node.href)
    if (!h1) failures.push(`P3  ${key}: ${node.href} renders no heading`)
    for (const e of errs) failures.push(`P3  ${key}: ${node.href} threw — ${e}`)
    const clash = node.children.find((c) => c.href && c.href === landed && landed !== node.href && !ALIAS.has(c.label))
    if (clash) failures.push(`P3  ${key}: ${node.href} redirects to its child "${clash.label}"`)
  }
  await browser.close()
} catch (e) {
  failures.push(`P0  the gate itself failed — ${e.message.split('\n')[0]}`)
} finally {
  try { process.kill(-server.pid, 'SIGTERM') } catch { /* already gone */ }
}

if (failures.length) {
  console.log(`rail-pages: ${failures.length} violation(s)\n\n  ${failures.join('\n  ')}`)
  process.exit(1)
}
console.log(`rail-pages: clean (${groups} categories and groups, ${pages} pages, every one its own)`)
