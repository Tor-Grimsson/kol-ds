#!/usr/bin/env node
/**
 * figma-tokens.mjs — the KOL Figma library's input (plan-2026-10-31-figma-library W1).
 *
 * Reads kol-theme in a headless browser and writes _tmp/figma/tokens.json:
 * every USED `--kol-*` token's computed value in light and dark, and every used
 * type class's computed text style. Unused ones go to _tmp/figma/unused.md.
 *
 * Used = read by packages/<pkg>/src or kol-theme's component / role / utility CSS,
 * plus whatever a used alias points at. Values flow code → Figma, never back.
 */
import { readFileSync, writeFileSync, mkdirSync, readdirSync, statSync } from 'node:fs'
import { join, dirname, relative } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { chromium } from 'playwright'

const REPO = join(dirname(fileURLToPath(import.meta.url)), '..')
const THEME = join(REPO, 'packages/theme')
const OUT = join(REPO, '_tmp/figma')

const TOKEN_FILES = ['kol-base-tokens.css', 'kol-color.css', 'kol-opacity.css', 'kol-opaque.css', 'kol-typography.css', 'kol-typography-mono.css', 'kol-design-tokens.css']
const TYPE_FILES = ['kol-type-mono-classes.css', 'kol-typography.css', 'kol-type-roles.css']
// Figma has nothing to attach these to (plan 1.2).
const SKIP = /^--kol-(z|transition|ease)(-|$)/

const walk = (dir, out = []) => {
  for (const n of readdirSync(dir)) {
    if (n === 'node_modules') continue
    const p = join(dir, n)
    statSync(p).isDirectory() ? walk(p, out) : /\.(jsx|js|css)$/.test(n) && out.push(p)
  }
  return out
}

// ── what is defined ───────────────────────────────────────────────────────────
const defs = new Map() // name → { file, line, raw }
for (const f of TOKEN_FILES) {
  readFileSync(join(THEME, f), 'utf8').split('\n').forEach((l, i) => {
    const m = l.match(/^\s*(--kol-[a-z0-9-]+)\s*:\s*([^;]+);/)
    if (m && !defs.has(m[1])) defs.set(m[1], { file: f, line: i + 1, raw: m[2].trim() })
  })
}

// ── what is read ──────────────────────────────────────────────────────────────
const pkgSrc = readdirSync(join(REPO, 'packages')).flatMap((p) => {
  try { return walk(join(REPO, 'packages', p, 'src')) } catch { return [] }
})
const themeReaders = readdirSync(THEME).filter((f) => /^kol-(components-.*|type-roles|utilities)\.css$/.test(f)).map((f) => join(THEME, f))
const corpus = [...pkgSrc, ...themeReaders].map((f) => readFileSync(f, 'utf8')).join('\n')

// A token is read as var(--kol-x) or through a utility class (text-fg-64, bg-oq-08 …).
const isRead = (name) => new RegExp(`(?<![a-z0-9-])(--kol-)?${name.slice(6).replace(/[-]/g, '\\-')}(?![a-z0-9-])`).test(corpus)
const used = new Set([...defs.keys()].filter((n) => !SKIP.test(n) && isRead(n)))
// A used alias keeps its target.
for (let grew = true; grew;) {
  grew = false
  for (const n of [...used]) for (const [, t] of (defs.get(n)?.raw ?? '').matchAll(/var\((--kol-[a-z0-9-]+)/g)) {
    if (defs.has(t) && !SKIP.test(t) && !used.has(t)) { used.add(t); grew = true }
  }
}

// ── type classes ──────────────────────────────────────────────────────────────
const typeClasses = new Set()
for (const f of TYPE_FILES) for (const [, c] of readFileSync(join(THEME, f), 'utf8').matchAll(/^\.(kol-(?:mono|helper|sans|prose|doc|card)-[a-z0-9-]+)\s*[,{]/gm)) typeClasses.add(c)
const jsx = pkgSrc.filter((f) => /\.jsx?$/.test(f)).map((f) => readFileSync(f, 'utf8')).join('\n')
const usedType = [...typeClasses].filter((c) => new RegExp(`(?<![a-z0-9-])${c}(?![a-z0-9-])`).test(jsx))
const PROSE_TAGS = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'li', 'code', 'blockquote']

// ── computed values ───────────────────────────────────────────────────────────
const browser = await chromium.launch()
const page = await browser.newPage()
const html = join(OUT, 'probe.html')
mkdirSync(OUT, { recursive: true })
writeFileSync(html, `<!doctype html><html><head><link rel="stylesheet" href="${pathToFileURL(join(THEME, 'kol-theme.css'))}"></head><body></body></html>`)
await page.goto(pathToFileURL(html).href)

const read = (theme) => page.evaluate(({ names, theme, usedType, PROSE_TAGS }) => {
  document.documentElement.setAttribute('data-theme', theme)
  const root = getComputedStyle(document.documentElement)
  const probe = document.createElement('div')
  document.body.appendChild(probe)
  const tokens = {}
  for (const n of names) {
    const raw = root.getPropertyValue(n).trim()
    probe.style.cssText = `color: var(${n}); width: var(${n}); box-shadow: var(${n}); opacity: var(${n})`
    const cs = getComputedStyle(probe)
    tokens[n] = { raw, color: cs.color, width: cs.width, shadow: cs.boxShadow, opacity: cs.opacity }
  }
  const style = (el) => {
    const cs = getComputedStyle(el)
    return { family: cs.fontFamily, size: cs.fontSize, weight: cs.fontWeight, lineHeight: cs.lineHeight, tracking: cs.letterSpacing, transform: cs.textTransform, color: cs.color }
  }
  const type = {}
  for (const c of usedType) { const el = document.createElement('div'); el.className = c; el.textContent = 'x'; document.body.appendChild(el); type[c] = style(el) }
  const prose = document.createElement('div'); prose.className = 'kol-prose'; document.body.appendChild(prose)
  for (const t of PROSE_TAGS) { const el = document.createElement(t); el.textContent = 'x'; (t === 'li' ? prose.appendChild(document.createElement('ul')) : prose).appendChild(el); type[`kol-prose ${t}`] = style(el) }
  return { tokens, type }
}, { names: [...used], theme, usedType, PROSE_TAGS })

const light = await read('light')
const dark = await read('dark')
await browser.close()

// ── write ─────────────────────────────────────────────────────────────────────
const tokens = {}
for (const n of [...used].sort()) {
  const alias = defs.get(n).raw.match(/^var\((--kol-[a-z0-9-]+)\)$/)?.[1]
  tokens[n] = { file: defs.get(n).file, alias: alias && used.has(alias) ? alias : undefined, light: light.tokens[n], dark: dark.tokens[n] }
}
writeFileSync(join(OUT, 'tokens.json'), JSON.stringify({ tokens, type: { light: light.type, dark: dark.type } }, null, 2))

const unused = [...defs.keys()].filter((n) => !used.has(n)).sort()
writeFileSync(join(OUT, 'unused.md'), [
  '# Not in the Figma library',
  '',
  'Defined in kol-theme, read by nothing in packages/*/src or the component CSS (or z-index / transition / easing, which Figma cannot hold). Pull any back in during review.',
  '',
  ...unused.map((n) => `- \`${n}\` — packages/theme/${defs.get(n).file}:${defs.get(n).line}`),
  '',
  '## Type classes not used in JSX',
  '',
  ...[...typeClasses].filter((c) => !usedType.includes(c)).sort().map((c) => `- \`.${c}\``),
].join('\n') + '\n')

console.log(`used ${used.size} / defined ${defs.size} tokens · type ${usedType.length}/${typeClasses.size} classes + ${PROSE_TAGS.length} prose tags → ${relative(REPO, OUT)}/`)
