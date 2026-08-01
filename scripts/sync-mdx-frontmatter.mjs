#!/usr/bin/env node
/**
 * sync-mdx-frontmatter.mjs — one metadata contract across every doc surface
 * (pnpm sync:mdx-frontmatter).
 *
 * The showcase carried THREE unrelated metadata dialects: kol-docs YAML in the
 * vault's 46 markdown files, `{ id, slug }` in the 66 component MDX pages, and
 * `{ title, description, category, featured }` in the 30 set/block JSX modules.
 * "Frontmatter" meant three different things depending on which page you were
 * looking at, and the reader could only ever show two rows.
 *
 * This converges the MDX surface onto the kol-docs contract
 * (`.kol/docs-framework/01-conventions.md`): required title/type/status/
 * updated/tags, plus description and aliases. It is IDEMPOTENT and
 * NON-DESTRUCTIVE — an author's hand-written value always wins; the generator
 * only fills fields that are absent. `updated` is left alone once set, because
 * a generator stamping today's date on every run would make the field a lie.
 *
 * The predecessor was a one-shot codemod in a scratchpad that emitted 65 files
 * and was never committed, which is why the schema it wrote could not be
 * revisited. This one lives in scripts/ and re-runs.
 *
 * Usage:  node scripts/sync-mdx-frontmatter.mjs [--check]
 *         --check exits non-zero if any file would change (CI-safe).
 */
import { readFileSync, writeFileSync, readdirSync, existsSync } from 'node:fs'
import { join, dirname, basename, relative } from 'node:path'
import { fileURLToPath } from 'node:url'
import { parseBarrelExports, isComponentName, folderOf } from './lib/parse-barrel.mjs'
import { TIERS, FUNCTIONS_BY_NAME } from '../showcase/src/nav/classification.js'

const REPO = join(dirname(fileURLToPath(import.meta.url)), '..')
const MDX_DIR = join(REPO, 'showcase/src/docs/components')
const CHECK = process.argv.includes('--check')
/* `--regen-reuses` overrides author-wins for the reuses field ONLY.
 * Author-wins is right in steady state and wrong exactly once: when a generator
 * bug has already written values, the rule freezes the bug in place forever —
 * the same trap the tags block below documents. This is the deliberate,
 * named escape hatch for that case. Never wire it into a pnpm script. */
const REGEN = process.argv.includes('--regen-reuses')

const readJson = (p) => {
  try { return JSON.parse(readFileSync(join(REPO, p), 'utf8')) } catch { return {} }
}
const descriptions = readJson('showcase/src/usage/descriptions.json')
const origins = readJson('showcase/src/usage/component-origins.json')

/* ── reuses ────────────────────────────────────────────────────────────────
 * The reference graph, written onto the page of the thing that DID the reusing.
 * A component declares what it derived from; who derived from IT is the inbound
 * side and already lives in showcase/src/usage/components/<Name>.md.
 *
 * Carried as string[] — `"Button 4★"` — because parseMeta below understands
 * strings and string arrays and nothing else. An object list would be reported
 * as unparseable and skipped, which is a silent hole in the contract.
 *
 * COMPUTED, then adjustable. A hand-edited star is never overwritten; it is
 * reported as a disagreement. A self-rated graph looks authoritative while lying,
 * so the machine proposes and the author decides — the same rule every other
 * field in this file already follows. */
const composition = readJson('showcase/src/usage/composition-index.json')
const tokenIndex = readJson('showcase/src/usage/token-index.json')
const MAX_REUSES = 12
const stemOf = (p) => basename(p).replace(/\.\w+$/, '')

const reuseEdges = {}
const addEdge = (owner, target, stars) => {
  if (!owner) return
  ;(reuseEdges[owner] ||= []).push({ target, stars })
}
/* Only a component's OWN source may author its edges. `showcase/src/demos/` holds
 * a same-named file per component, and a demo rendering <Accordion> made the
 * AccordionPanel page claim it reused Accordion — an edge that belongs to the
 * demo, not to the component. Sources live under packages/<pkg>/src/. */
const isSource = (p) => /(^|\/)packages\/[^/]+\/src\//.test(p)
for (const [file, list] of Object.entries(composition)) {
  if (!isSource(file)) continue
  for (const e of Array.isArray(list) ? list : []) addEdge(stemOf(file), e.target, e.stars)
}
for (const node of Array.isArray(tokenIndex) ? tokenIndex : []) {
  for (const e of node.edges || []) if (isSource(e.file)) addEdge(stemOf(e.file), node.name, e.stars)
}
/** -> ["Button 4★", "--kol-surface-primary 2★"] — strongest first, deduped, capped. */
const deriveReuses = (name) => {
  const edges = reuseEdges[name]
  if (!edges?.length) return undefined
  const best = new Map()
  for (const e of edges) best.set(e.target, Math.max(best.get(e.target) ?? 0, e.stars))
  return [...best]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, MAX_REUSES)
    .map(([target, stars]) => `${target} ${stars}★`)
}
const disagreements = []

/* Descriptions may be flat strings or {description} objects depending on which
 * extractor last wrote the file — read both rather than assuming. */
const describe = (name) => {
  const d = descriptions[name]
  const text = typeof d === 'string' ? d : d?.description
  return text?.trim() || undefined
}

/* ── Tags ──────────────────────────────────────────────────────────────────
 * These were a flat constant — every page got the same two tags. That is worse
 * than useless for the node graph: co-occurrence draws an edge between tags
 * that share a doc, so 66 identical pairs produce ONE edge with weight 66 and
 * no structure at all. Obsidian-style graphs need tags that VARY with content.
 *
 * So each page derives tags from what it actually is, and — critically —
 * REUSES the leaves the vault already uses (`domain/typography`,
 * `domain/chess`, `pattern/app-shell` …). A shared leaf is the edge: it is what
 * connects the Button page to the docs about actions, and every foundry
 * component to the typography reference. Inventing a parallel vocabulary here
 * would produce a graph with two disconnected islands.
 *
 * Top-level namespaces are the closed set (`.kol/docs-framework/03-tag-taxonomy.md`);
 * nesting stays within the 3-level maximum. */
const BASE_TAGS = ['domain/design-system', 'domain/components']

/** Tier → a nested leaf under the components domain. */
const TIER_TAG = {
  atoms: 'domain/components/atoms',
  molecules: 'domain/components/molecules',
  organisms: 'domain/components/organisms',
  hooks: 'domain/components/hooks',
}

/** The package a component ships from → the vault leaf for that subject. */
const PKG_TAG = {
  chess: 'domain/chess',
  content: 'domain/content',
  dashboards: 'domain/dashboards',
  foundry: 'domain/foundry',
  store: 'domain/store',
  styleguide: 'domain/styleguide',
  framework: 'pattern/app-shell',
  workshop: 'domain/docs',
  icons: 'domain/iconography',
}

/** Subject facets, matched on the component's own name + description. Kept
 *  deliberately narrow — a wrong tag is a wrong edge, and a graph of wrong
 *  edges is worse than a sparse one. */
const SUBJECT_TAGS = [
  [/\b(type|font|glyph|typeface|specimen|prose|text)\b/i, 'domain/typography'],
  [/\b(color|colour|palette|swatch|hue|spectrum|gradient)\b/i, 'domain/color'],
  [/\b(icon|glyph|graphic)\b/i, 'domain/iconography'],
  [/\b(grid|layout|column|shell|page|section|responsive)\b/i, 'domain/layout'],
  [/\b(token|scale|variable)\b/i, 'domain/tokens'],
  [/\b(aria|a11y|accessib|keyboard|screen reader|focus)\b/i, 'domain/accessibility'],
]

/** true when `tags` is absent or is exactly the old flat constant */
const isGeneratedBaseTags = (tags) =>
  !Array.isArray(tags) || tags.length === 0 ||
  (tags.length === BASE_TAGS.length && BASE_TAGS.every((t) => tags.includes(t)))

const deriveTags = (name, description, { tier, pkg, fn }) => {
  const tags = new Set(BASE_TAGS)
  if (TIER_TAG[tier]) tags.add(TIER_TAG[tier])
  if (PKG_TAG[pkg]) tags.add(PKG_TAG[pkg])
  /* function = a reusable UI role, sibling to the existing pattern/blocks and
   * pattern/app-shell leaves */
  if (fn && fn !== 'non-component') tags.add(`pattern/${fn}`)
  const haystack = `${name} ${description ?? ''}`
  for (const [re, tag] of SUBJECT_TAGS) if (re.test(haystack)) tags.add(tag)
  return [...tags].sort()
}

/* Parse `export const meta = { … }` — a small object literal of scalars and
 * string arrays, which is all these files carry. Anything more complex is left
 * untouched and reported rather than mangled by a regex. */
const parseMeta = (src) => {
  const m = src.match(/export const meta = \{([\s\S]*?)\n\}/)
  if (!m) return null
  const body = m.group ?? m[1]
  const keys = [...body.matchAll(/^\s{2}([A-Za-z_][\w]*)\s*:/gm)].map((k) => k[1])
  return { block: m[0], body, keys }
}

/* A JS string literal's escapes must be UNDONE on read, or every pass
 * re-escapes what the last one wrote: a description carrying \" grew a pair of
 * backslashes per run until it was unreadable. Escape-aware body, real
 * unescape — the round trip has to be lossless for the script to be safe to
 * re-run, which is the whole point of it living in scripts/. */
const STRING_LITERAL = String.raw`(['"\x60])((?:\\.|(?!\1)[^\\])*)\1`
const unescape = (s) => s.replace(/\\(u[0-9a-fA-F]{4}|x[0-9a-fA-F]{2}|.)/g, (m, g) => {
  if (g[0] === 'u' || g[0] === 'x') return String.fromCodePoint(parseInt(g.slice(1), 16))
  return { n: '\n', t: '\t', r: '\r', b: '\b', f: '\f', v: '\v', 0: '\0' }[g] ?? g
})

const serialize = (fields) => {
  const lines = fields.map(([k, v]) => {
    if (Array.isArray(v)) {
      const items = v.map((s) => `    ${JSON.stringify(s)},`).join('\n')
      return `  ${k}: [\n${items}\n  ],`
    }
    return `  ${k}: ${JSON.stringify(v)},`
  })
  return `export const meta = {\n${lines.join('\n')}\n}`
}

/* Which package + folder each component ships from — the same barrel walk the
 * roster gate uses, so tags can never disagree with the sidebar about what a
 * component IS. */
const facets = {}
const PKGS = join(REPO, 'packages')
for (const pkg of readdirSync(PKGS)) {
  const src = join(PKGS, pkg, 'src')
  if (!existsSync(join(src, 'index.js'))) continue
  const barrels = {}
  const walk = (dir) => {
    for (const e of readdirSync(dir, { withFileTypes: true })) {
      const full = join(dir, e.name)
      if (e.isDirectory() && e.name !== 'node_modules') walk(full)
      else if (e.name === 'index.js') barrels[relative(src, full)] = readFileSync(full, 'utf8')
    }
  }
  walk(src)
  for (const { name, src: from } of parseBarrelExports(barrels)) {
    if (!isComponentName(name) && !/^use[A-Z]/.test(name)) continue
    if (facets[name]) continue // first owner wins, as in roster.js
    const folder = folderOf(from)
    facets[name] = {
      pkg,
      tier: /^use[A-Z]/.test(name) ? 'hooks' : (pkg === 'component' ? folder : TIERS[name]),
      fn: FUNCTIONS_BY_NAME[name],
    }
  }
}

const TODAY = '2026-07-30'
const files = readdirSync(MDX_DIR).filter((f) => f.endsWith('.mdx')).sort()
const changed = []
const skipped = []

for (const file of files) {
  const path = join(MDX_DIR, file)
  const src = readFileSync(path, 'utf8')
  const meta = parseMeta(src)
  if (!meta) { skipped.push(`${file} — no parseable meta block`); continue }

  const name = basename(file, '.mdx')
  const existing = {}
  /* keep every author value verbatim, including ones this script never writes */
  for (const key of meta.keys) {
    const scalar = meta.body.match(new RegExp(`^\\s{2}${key}:\\s*${STRING_LITERAL},?\\s*$`, 'm'))
    if (scalar) { existing[key] = unescape(scalar[2]); continue }
    const list = meta.body.match(new RegExp(`^\\s{2}${key}:\\s*\\[([\\s\\S]*?)\\n\\s{2}\\]`, 'm'))
    if (list) {
      existing[key] = [...list[1].matchAll(new RegExp(STRING_LITERAL, 'g'))].map((x) => unescape(x[2]))
      continue
    }
    skipped.push(`${file} — field '${key}' is not a string or string[]; left as-is`)
    existing[key] = undefined
  }
  if (Object.values(existing).some((v) => v === undefined)) continue

  /* AUTHOR WINS. Generated values only fill absences. */
  const filled = {
    id: existing.id,
    slug: existing.slug ?? name.toLowerCase(),
    title: existing.title ?? name,
    type: existing.type ?? 'reference',
    status: existing.status ?? 'active',
    updated: existing.updated ?? (origins[name]?.date || TODAY),
    /* The first pass of this script wrote BASE_TAGS onto all 66 pages. That is
     * machine output, not an authored choice, so it is regenerated rather than
     * preserved — otherwise the author-wins rule would freeze its own mistake
     * in place forever. Anything else in `tags` is treated as authored. */
    tags: isGeneratedBaseTags(existing.tags)
      ? deriveTags(name, describe(name), facets[name] ?? {})
      : existing.tags,
    description: existing.description ?? describe(name),
    aliases: existing.aliases ?? [name.toLowerCase()],
    /* AUTHOR WINS, and the disagreement is reported rather than swallowed —
     * that report is the only thing standing between a computed graph and a
     * graph that quietly agrees with itself. */
    ...(() => {
      const computed = deriveReuses(name)
      if (!existing.reuses || REGEN) return computed ? { reuses: computed } : {}
      const a = [...existing.reuses].sort().join('|')
      const b = [...(computed ?? [])].sort().join('|')
      if (computed && a !== b) disagreements.push(`${name}: declared ${existing.reuses.length}, computed ${computed.length}`)
      return { reuses: existing.reuses }
    })(),
    ...(existing.lede ? { lede: existing.lede } : {}),
    ...(existing.eyebrow ? { eyebrow: existing.eyebrow } : {}),
  }
  /* Provenance is deliberately NOT written here. `component-origins.json` is
   * already mined from the lobby and already rendered on every component page
   * ("Imported from <repo> · <date>"); copying it into frontmatter would give
   * the same fact two homes that drift apart. Origins are still read above —
   * for `updated`, where the import date is the truest value available. */

  const ordered = Object.entries(filled).filter(([, v]) =>
    v != null && v !== '' && !(Array.isArray(v) && v.length === 0))
  const next = serialize(ordered)

  if (next === meta.block) continue
  changed.push(relative(REPO, path))
  if (!CHECK) writeFileSync(path, src.replace(meta.block, next))
}

for (const s of skipped) console.warn(`  skip: ${s}`)

if (disagreements.length) {
  console.warn(`\n  ${disagreements.length} declared/computed reuses disagreement(s) — author's value kept:`)
  for (const d of disagreements) console.warn('    ' + d)
}

if (CHECK) {
  if (changed.length) {
    console.error(`mdx-frontmatter: ${changed.length} file(s) out of contract\n`)
    for (const c of changed) console.error('  ' + c)
    process.exit(1)
  }
  console.log(`mdx-frontmatter: clean (${files.length} files on contract)`)
} else {
  console.log(`mdx-frontmatter: ${changed.length} of ${files.length} file(s) updated`)
}
