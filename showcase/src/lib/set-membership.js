import { SETS } from './sets-registry.js'
import { BLOCKS } from './blocks-registry.js'
import { getComponentBySlug, slugify } from '../nav/registry.js'

/**
 * Where a component is used — ONE derivation, read in both directions.
 *
 * A set page listed nothing and a component page never said where it appeared
 * (user ruling 2026-08-01: "you should also be able to see which sets a
 * component is a part of").
 *
 * The first pass answered SETS ONLY, and that was too narrow a question:
 * ContentFilters is composed by four showcase surfaces and by zero sets, so its
 * page rendered blank while the mechanism was working perfectly. The map now
 * covers every surface that composes a component — sets, blocks and demos —
 * and the two facts stay SEPARATE rows so neither can mislead:
 *
 *   in_sets  — sets only. Absent when zero. Never padded with demos.
 *   used_in  — the wider answer, each entry labelled with its kind.
 *
 * Derived, never authored: every registry already carries each file's raw
 * source (the same string the Code tab shows), so membership is read from its
 * `@kolkrabbi/*` imports. An authored list would be a second copy of those
 * imports and would drift the first time a surface changed a line.
 */
const IMPORT_RE = /import\s+\{([^}]+)\}\s+from\s+'@kolkrabbi\/[^']+'/g

function namesIn(source = '') {
  const found = new Set()
  for (const m of source.matchAll(IMPORT_RE)) {
    for (const raw of m[1].split(',')) {
      const name = raw.replace(/\bas\b[\s\S]*/, '').trim()
      /* Components are PascalCase; hooks and helpers are not members. */
      if (/^[A-Z]\w*$/.test(name)) found.add(name)
    }
  }
  return [...found]
}

/* Demos are globbed here rather than taken from demos-registry, because a demo's
 * KIND matters: it proves usage but it is not a composition. */
const demoSources = import.meta.glob('../demos/*.jsx', { eager: true, query: '?raw', import: 'default' })
const demoName = (path) => (path.split('/').pop() || '').replace('.jsx', '')

/* Pages are surfaces too — ContentFilters' only real consumer is /references,
 * and leaving pages out was exactly the too-narrow question this file was
 * rewritten to fix. */
const pageSources = import.meta.glob('../pages/*.jsx', { eager: true, query: '?raw', import: 'default' })
const pageName = (path) => (path.split('/').pop() || '').replace('.jsx', '')

/* one flat surface list: { kind, key, title, uses[] } */
const SURFACES = [
  ...SETS.map((s) => ({ kind: 'set', key: s.key, title: s.title, uses: namesIn(s.source) })),
  ...BLOCKS.map((b) => ({ kind: 'block', key: b.key, title: b.title, uses: namesIn(b.source) })),
  ...Object.entries(demoSources).map(([path, src]) => ({
    kind: 'demo', key: demoName(path), title: `${demoName(path)} demo`, uses: namesIn(src),
  })),
  ...Object.entries(pageSources).map(([path, src]) => ({
    kind: 'page', key: pageName(path), title: pageName(path), uses: namesIn(src),
  })),
]

/** set key → the component names it composes, in source order. */
export const MEMBERS_BY_SET = Object.fromEntries(
  SETS.map((s) => [s.key, namesIn(s.source)]),
)

/** component name → every surface that composes it, kind included. */
export const SURFACES_BY_COMPONENT = (() => {
  const out = {}
  for (const s of SURFACES) {
    for (const name of s.uses) {
      /* a demo of X is not "usage of X" — it IS X's own page */
      if (s.kind === 'demo' && s.key === name) continue
      ;(out[name] ||= []).push(s)
    }
  }
  return out
})()

/** Members of one set, resolved to roster entries where the component exists. */
export const membersOf = (setKey) =>
  (MEMBERS_BY_SET[setKey] ?? [])
    .map((name) => ({ name, comp: getComponentBySlug(slugify(name)) }))
    .filter((m) => m.comp)

/** Sets only — the narrow, literal answer. Empty when no set composes it. */
export const setsOf = (name) =>
  (SURFACES_BY_COMPONENT[name] ?? []).filter((s) => s.kind === 'set')

/**
 * Everything that composes it, as display strings. Blocks and sets print by
 * title; demos collapse to one "N demos" entry so a widely-demoed component
 * does not bury its real compositions.
 */
export const usedIn = (name) => {
  const all = SURFACES_BY_COMPONENT[name] ?? []
  const named = all.filter((s) => s.kind !== 'demo').map((s) => s.title)
  const demos = all.filter((s) => s.kind === 'demo').length
  return demos ? [...named, `${demos} ${demos === 1 ? 'demo' : 'demos'}`] : named
}
