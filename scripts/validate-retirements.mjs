#!/usr/bin/env node
/**
 * validate-retirements.mjs — the retirement system (pnpm validate:retirements
 * · pnpm retirements for the sweep alone).
 *
 * Until 2026-08-26 an alias had no lifetime. "Removed at the next major" was
 * written on every one and nothing scheduled a major, so the only list of
 * aliases the DS was carrying was the showcase's DEPRECATED array — and the
 * older ones were not even on that. User: "just so we can forget it? whats the
 * lifetime there? … is there any system behind it" — there was none.
 *
 * THE SYSTEM, three rules:
 *   R1  every alias the barrels ship has a row in the ledger
 *       (docs/operations/01-release/04-retirements.md), and every row names an
 *       alias the barrels still ship — no unlisted alias, no ghost row.
 *   R2  an alias is DROPPED when no repo in the estate imports it — decided by
 *       grepping the estate, not by waiting for a major. This gate prints who
 *       still imports each alias on every run.
 *   R3  an alias older than 30 days with NO importers anywhere is drop-ready,
 *       and a drop-ready alias FAILS the gate until it is removed. Reinforced,
 *       not remembered.
 *   R4  an alias may NOT gain behaviour (2026-08-27 — three tickets shipped
 *       frame / zoom / a hero rung on the retiring ListingCard and nothing
 *       connected "on the ledger" to "being worked on"): a CHANGELOG entry
 *       dated after the alias's `since` that names the alias and is not its
 *       drop fails the gate — features go on the replacement. Enforced for
 *       entries dated from R4_FROM; the 08-27 entries are the incident.
 *
 * What counts as an alias — detected from source, so nothing already shipped
 * is missed: (a) a barrel line exporting one default under two names
 * (`default as SectionHero, default as FullBleedHero` — the second is the
 * alias); (b) an exported component whose file opens with a `@deprecated`
 * note; (c) a kol-theme CSS class whose rule sits directly under a
 * `/* @deprecated YYYY-MM-DD → replacement *\/` line (2026-08-27 — type
 * classes retire too; `kol-display-lg` was the first). Read-only; `--check`
 * is the gate, without it the sweep is a report.
 */
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs'
import { join, dirname, basename } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const DEV = join(ROOT, '..')
const LEDGER = join(ROOT, 'docs/operations/01-release/04-retirements.md')
const CHECK = process.argv.includes('--check')
const TODAY = new Date().toISOString().slice(0, 10)
const DROP_AFTER_DAYS = 30
const R4_FROM = process.env.R4_FROM ?? '2026-08-28' // env override = a dry run against older entries

/* ── 1. the aliases the barrels ship ─────────────────────────────────────── */
const PKGS = readdirSync(join(ROOT, 'packages')).filter((p) => existsSync(join(ROOT, 'packages', p, 'src/index.js')))
const aliases = new Map() // name → { pkg, canonical, file }
for (const pkg of PKGS) {
  const barrelPath = join(ROOT, 'packages', pkg, 'src/index.js')
  const barrel = readFileSync(barrelPath, 'utf8')
  for (const m of barrel.matchAll(/export\s*\{([^}]*)\}\s*from\s*['"]([^'"]+)['"]/g)) {
    const specs = m[1].split(',').map((s) => s.trim()).filter(Boolean)
    const from = m[2]
    const defaults = specs.filter((s) => /^default\s+as\s+/.test(s)).map((s) => s.replace(/^default\s+as\s+/, ''))
    // (a) one default, two names — every name after the first is an alias
    for (const name of defaults.slice(1)) aliases.set(name, { pkg, canonical: defaults[0], file: from })
    // (b) an export whose source file opens with @deprecated
    for (const spec of specs) {
      const name = spec.split(/\s+as\s+/).pop().trim()
      const src = join(ROOT, 'packages', pkg, 'src', from)
      const candidate = existsSync(src) ? src : existsSync(`${src}.jsx`) ? `${src}.jsx` : null
      if (!candidate) continue
      const source = readFileSync(candidate, 'utf8')
      /* the file's opening comment (an alias file, or a whole deprecated
       * component) — or the JSDoc sitting right above THIS export's own
       * declaration (a named export sharing a file, e.g. MediaPicker) */
      /* the banner = the file's FIRST doc block, wherever it sits (a retired
       * component carries it above its own definition, after the imports) */
      const head = source.match(/\/\*\*[\s\S]*?\*\//)?.[0] ?? ''
      const own = source.match(new RegExp(`/\\*\\*(?:(?!\\*/)[\\s\\S])*?\\*/\\s*export\\s+(?:default\\s+)?(?:function\\s+${name}\\b|const\\s+${name}\\b)`))?.[0] ?? ''
      if ((/@deprecated/.test(head) || /@deprecated/.test(own)) && !aliases.has(name)) {
        aliases.set(name, { pkg, canonical: null, file: from })
      }
    }
  }
}

/* (c) theme CSS classes — the marker line names the date and the replacement */
const THEME = join(ROOT, 'packages/theme')
for (const file of readdirSync(THEME).filter((f) => f.endsWith('.css'))) {
  const css = readFileSync(join(THEME, file), 'utf8')
  for (const m of css.matchAll(/\/\*\s*@deprecated\s+\d{4}-\d{2}-\d{2}\s*→\s*([a-z][a-z0-9-]*)\s*\*\/\s*\n\s*\.([a-z][a-z0-9-]*)\s*\{/g)) {
    aliases.set(m[2], { pkg: 'theme', canonical: m[1], file, css: true })
  }
}

/* ── 2. the ledger ───────────────────────────────────────────────────────── */
const ledgerText = existsSync(LEDGER) ? readFileSync(LEDGER, 'utf8') : ''
const rows = new Map()
for (const line of ledgerText.split('\n')) {
  const m = line.match(/^\|\s*`([A-Za-z0-9_-]+)`\s*\|\s*([^|]*)\|\s*([^|]*)\|\s*(\d{4}-\d{2}-\d{2})\s*\|/)
  if (m) rows.set(m[1], { pkg: m[2].trim(), replacement: m[3].trim(), since: m[4] })
}

/* ── 3. the estate — who still imports each alias ───────────────────────── */
const SKIP = new Set(['node_modules', 'dist', '.git', '.vite', 'build', '.next', 'coverage', '_tmp', 'public'])
const CODE = /\.(jsx|tsx|js|ts|mdx)$/
function walk(dir, out = []) {
  let entries = []
  try { entries = readdirSync(dir) } catch { return out }
  for (const e of entries) {
    if (SKIP.has(e)) continue
    const p = join(dir, e)
    let st; try { st = statSync(p) } catch { continue }
    if (st.isDirectory()) walk(p, out)
    else if (CODE.test(e)) out.push(p)
  }
  return out
}
const roots = []
for (const repo of readdirSync(DEV)) {
  if (!repo.startsWith('kol-') || repo === 'kol-ds-ui') continue
  for (const sub of ['src', 'app/src', 'apps']) {
    const p = join(DEV, repo, sub)
    if (existsSync(p)) roots.push({ repo, path: p })
  }
}
roots.push({ repo: 'kol-ds-ui (showcase · workbench)', path: join(ROOT, 'showcase/src') }, { repo: 'kol-ds-ui (showcase · workbench)', path: join(ROOT, 'workbench/src') })
const files = roots.flatMap((r) => walk(r.path).map((f) => ({ repo: r.repo, f })))
/* an IMPORT of the name from its own package — a comment that merely names it
 * does not keep it alive, and kol-dashboards' GridCard is not kol-shell's */
const usesOf = (name, pkg, css) => {
  /* a CSS alias is used wherever the class string appears in a code file */
  const re = css
    ? new RegExp(`(?<![\\w-])${name}(?![\\w-])`)
    : new RegExp(`import\\s*\\{[^}]*\\b${name}\\b[^}]*\\}\\s*from\\s*['"]@kolkrabbi/kol-${pkg}(?:/[^'"]*)?['"]`)
  const hits = new Map()
  for (const { repo, f } of files) {
    if (basename(f).replace(/\.\w+$/, '') === name) continue // the alias's own demo/usage page
    if (f.includes('/usage/')) continue // mined reference material, not a consumer
    let src; try { src = readFileSync(f, 'utf8') } catch { continue }
    if (re.test(src)) hits.set(repo, (hits.get(repo) ?? 0) + 1)
  }
  return hits
}

/* ── 4. the rules ────────────────────────────────────────────────────────── */
const errors = []
const lines = []
const ageDays = (since) => Math.floor((Date.parse(TODAY) - Date.parse(since)) / 86400000)
for (const [name, a] of [...aliases].sort()) {
  const row = rows.get(name)
  const uses = usesOf(name, a.pkg, a.css)
  const who = [...uses].map(([r, n]) => `${r} ×${n}`).join(' · ') || 'nobody'
  const age = row ? ageDays(row.since) : null
  const dropReady = row && uses.size === 0 && age >= DROP_AFTER_DAYS
  lines.push(`  ${dropReady ? '✂' : uses.size ? '·' : '○'} ${name.padEnd(22)} ${a.pkg.padEnd(10)} → ${(row?.replacement ?? a.canonical ?? '?').padEnd(36)} since ${row?.since ?? '????-??-??'}${age != null ? ` (${age}d)` : ''} · imports: ${who}`)
  if (!row) errors.push(`R1  ${name} (kol-${a.pkg}) is an alias the barrel ships with NO ledger row — add it to 04-retirements.md`)
  if (dropReady) errors.push(`R3  ${name} (kol-${a.pkg}) is DROP-READY — ${age} days old, nobody imports it. Remove the export (or the CSS rule), BREAKING-flag the changelog, delete the row.`)
}
for (const [name] of rows) if (!aliases.has(name)) errors.push(`R1  ledger row \`${name}\` names nothing the barrels ship — delete the row (or the alias detection missed it)`)

/* ── R4 — an alias may not gain behaviour ────────────────────────────────── */
const changelogs = new Map()
const sectionsOf = (pkg) => {
  if (!changelogs.has(pkg)) {
    const file = join(ROOT, 'packages', pkg, 'CHANGELOG.md')
    const text = existsSync(file) ? readFileSync(file, 'utf8') : ''
    const out = []
    for (const m of text.matchAll(/^## (\S+) — (\d{4}-\d{2}-\d{2})\n([\s\S]*?)(?=^## |\Z)/gm)) out.push({ version: m[1], date: m[2], body: m[3] })
    changelogs.set(pkg, out)
  }
  return changelogs.get(pkg)
}
for (const [name, row] of rows) {
  const a = aliases.get(name); if (!a) continue
  for (const { version, date, body } of sectionsOf(row.pkg)) {
    if (date <= row.since || date < R4_FROM) continue
    const named = new RegExp(`(?<![\\w-])${name}(?![\\w-])`).test(body)
    const drop = /\b(dropped|removed|deleted|retired)\b/i.test(body)
    if (named && !drop) errors.push(`R4  ${name} (kol-${row.pkg}) gained behaviour in ${version} (${date}) — an alias only drops; put the feature on ${row.replacement}`)
  }
}

console.log(`retirements: ${aliases.size} alias(es) shipped · ${rows.size} ledger row(s) · estate ${roots.length} root(s), ${files.length} files\n`)
console.log(lines.join('\n'))
console.log('\n  ○ nobody imports it (drops at 30 days)   · still imported   ✂ drop-ready — the gate fails on it')
if (errors.length) {
  console.log(`\nretirements: ${errors.length} violation(s)`)
  for (const e of errors) console.log(`  ${e}`)
  if (CHECK) process.exit(1)
} else console.log('\nretirements: clean')
