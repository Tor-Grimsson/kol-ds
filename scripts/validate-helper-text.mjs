#!/usr/bin/env node
/**
 * validate-helper-text — no `kol-helper-*` on a sentence.
 *
 * THE LAW (docs/documentation/01-foundations/03-typography.md:29): the helper scale is `line-height: 1` — single-line
 * chrome only (labels, chips, readouts). Text that can wrap sets solid in it, so a sentence wears `kol-mono-*` with
 * `text-meta` / `text-fg-*` instead. The user, studio-hub review 2 (2026-10-23): *"I hate that you still use helper for
 * paragraphs even though I have said this LAW … you are the DS agent, why does this happen?"* — it happened because no
 * gate read it. This one does.
 *
 *   H1  an element whose LITERAL `className` carries `kol-helper-*` and whose direct literal text has five or more
 *       words, or contains ". ", or ends with a period
 *   H2  `kol-helper-*` in the same literal `className` as `whitespace-normal`, `line-clamp-*` or `text-wrap` —
 *       asking a helper to wrap
 *
 * Literal text and literal classes only: `{expressions}` are not read, so a label passed in from data is the
 * caller's to keep short (SettingsRow's label truncates by construction, kol-component 0.296.0).
 * Scope: packages/*\/src, apps/*\/src, showcase/src/{pages,lib,nav,previews} — `.jsx`.
 * `--self-test` runs the cases below. Exit 1 on a violation.
 */
import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join, relative, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')

/* the end of a tag that starts at `i` (on '<'): skips quotes and `{…}` so an `=>` inside an attribute never ends it */
function tagEnd(src, i) {
  let depth = 0, q = null
  for (let j = i + 1; j < src.length; j++) {
    const c = src[j]
    if (q) { if (c === '\\') j++; else if (c === q) q = null; continue }
    if (depth > 0 && (c === '"' || c === "'" || c === '`')) { q = c; continue }
    if (depth === 0 && (c === '"' || c === "'")) { q = c; continue }
    if (c === '{') depth++
    else if (c === '}') depth--
    else if (c === '>' && depth === 0) return j
  }
  return -1
}

/* skip a balanced `{…}` starting at `i`; returns the index after it */
function skipBraces(src, i) {
  let depth = 0, q = null
  for (let j = i; j < src.length; j++) {
    const c = src[j]
    if (q) { if (c === '\\') j++; else if (c === q) q = null; continue }
    if (c === '"' || c === "'" || c === '`') { q = c; continue }
    if (c === '{') depth++
    else if (c === '}' && --depth === 0) return j + 1
  }
  return src.length
}

/* the element's DIRECT literal text: its own text runs, never a child element's, never an expression */
function directText(src, from) {
  let depth = 0, text = ''
  for (let j = from; j < src.length;) {
    const c = src[j]
    if (c === '{') { j = skipBraces(src, j); text += ' '; continue }
    if (c === '<') {
      if (src[j + 1] === '/') { if (depth === 0) return text; depth--; j = src.indexOf('>', j) + 1; continue }
      if (src[j + 1] === '>' ) { depth++; j += 2; continue }
      const e = tagEnd(src, j); if (e < 0) return text
      if (src[e - 1] !== '/') depth++
      j = e + 1; continue
    }
    if (depth === 0) text += c
    j++
  }
  return text
}

/* the literal parts of a className attribute: "…", {'…'}, {"…"}, {`…`} (template holes dropped) */
function classLiteral(attrs) {
  const m = /\bclassName\s*=\s*(?:"([^"]*)"|'([^']*)'|\{\s*(?:'([^']*)'|"([^"]*)"|`([^`]*)`))/.exec(attrs)
  if (!m) return null
  return (m[1] ?? m[2] ?? m[3] ?? m[4] ?? m[5] ?? '').replace(/\$\{[^}]*\}/g, ' ')
}

export function check(src) {
  const out = []
  const OPEN = /<([A-Za-z][\w.]*)(?=[\s>/])/g
  for (const m of src.matchAll(OPEN)) {
    const end = tagEnd(src, m.index)
    if (end < 0) continue
    const attrs = src.slice(m.index, end)
    const cls = classLiteral(attrs)
    if (!cls || !/\bkol-helper-\d+/.test(cls)) continue
    const line = src.slice(0, m.index).split('\n').length
    if (/\b(whitespace-normal|line-clamp-\d+|line-clamp-none|text-wrap)\b/.test(cls)) out.push({ rule: 'H2', line, text: cls.trim() })
    if (src[end - 1] === '/') continue
    const text = directText(src, end + 1).replace(/\s+/g, ' ').trim()
    if (!text) continue
    const words = text.split(' ').filter((w) => /[A-Za-z]/.test(w)).length
    if (words >= 5 || /\.\s/.test(text) || /[A-Za-z]\.$/.test(text)) out.push({ rule: 'H1', line, text, index: m.index, end })
  }
  return out
}

const MAIN = import.meta.url === `file://${process.argv[1]}`
if (MAIN && process.argv.includes('--self-test')) {
  const cases = [
    ['H1 fires — the old placeholder line', '<span className="kol-helper-12 text-meta">Chrome, the point of entry. Enter it for Editor.</span>', ['H1']],
    ['H1 fires — five words', '<div className="kol-helper-10 text-fg-32">no rows yet add one</div>', ['H1']],
    ['H1 fires — ends with a period', '<p className={`kol-helper-12 ${x}`}>Saved.</p>', ['H1']],
    ['H2 fires — a helper told to wrap', '<span className="kol-helper-12 whitespace-normal">{label}</span>', ['H2']],
    ['clean — a label', '<span className="kol-helper-10 text-fg-32">Empty 3U row</span>', []],
    ['clean — mono on a sentence', '<span className="kol-mono-12 text-meta">No rows yet. Add one from the bar below.</span>', []],
    ['clean — an expression is not read', '<span className="kol-helper-12">{text}</span>', []],
    ['clean — a child element\'s text is its own', '<div className="kol-helper-12 flex">Tags <p className="kol-mono-12">a long sentence that wraps here.</p></div>', []],
    ['clean — an arrow in an attribute does not end the tag', '<span onClick={() => go(1)} className="kol-helper-12">Open in Studio</span>', []],
  ]
  let failed = 0
  for (const [name, src, want] of cases) {
    const got = check(src).map((v) => v.rule)
    const ok = JSON.stringify(got) === JSON.stringify(want)
    if (!ok) failed++
    console.log(`  ${ok ? 'ok  ' : 'FAIL'}  ${name}${ok ? '' : ` → expected [${want}] got [${got}]`}`)
  }
  console.log(failed ? `\n${failed} self-test(s) FAILED` : `\nself-test: all ${cases.length} pass`)
  process.exit(failed ? 1 : 0)
}

if (MAIN) {
const walk = (dir) => {
  let out = []
  let entries = []
  try { entries = readdirSync(dir) } catch { return out }
  for (const e of entries) {
    if (e === 'node_modules' || e === 'dist' || e.startsWith('.')) continue
    const p = join(dir, e)
    const st = statSync(p)
    if (st.isDirectory()) out = out.concat(walk(p))
    else if (e.endsWith('.jsx')) out.push(p)
  }
  return out
}
const roots = [
  ...readdirSync(join(ROOT, 'packages')).map((d) => join(ROOT, 'packages', d, 'src')),
  ...readdirSync(join(ROOT, 'apps')).map((d) => join(ROOT, 'apps', d, 'src')),
  ...['pages', 'lib', 'nav', 'previews'].map((d) => join(ROOT, 'showcase/src', d)),
]
const violations = []
let files = 0
for (const r of roots) for (const f of walk(r)) {
  files++
  for (const v of check(readFileSync(f, 'utf8'))) violations.push(`${v.rule}  ${relative(ROOT, f)}:${v.line}  ${v.text.slice(0, 90)}`)
}
if (violations.length) {
  console.log(`helper-text: ${violations.length} violation(s) — kol-helper-* is single-line chrome; a sentence wears kol-mono-* (01-foundations/03-typography.md:29)\n`)
  for (const v of violations) console.log(`  ${v}`)
  process.exit(1)
}
console.log(`helper-text: clean (${files} files — no kol-helper-* on a sentence)`)
}
