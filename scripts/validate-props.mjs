#!/usr/bin/env node
/**
 * validate-props.mjs — a component's docstring and its signature must agree
 * (pnpm validate:props · pnpm props for the sweep alone).
 *
 * WHY THIS EXISTS. On 2026-08-30 three tickets arrived from three repos, all
 * the same defect: a documented seam wired to nothing. `Slider`'s docstring
 * promised `style={{ '--kol-slider-track': … }}` and the component destructured
 * 21 named props with no rest spread, so a consumer's `style` was dropped on
 * the floor. `ContentRow` documented `ratio` as "overrides the ruled default",
 * destructured it, and then never read it — it passed `ratio={null}` down
 * instead. Both had shipped that way since the component was written.
 *
 * Neither was caught by the other 23 gates, and neither could be: they check
 * CSS, tokens, taxonomy, docs links. Nothing was reading the components against
 * their own documentation. Both were found by CONSUMERS, after a round trip —
 * kol-mirror carrying a cascade rule to work around the first, kol-website
 * setting an A-series ratio and seeing a square.
 *
 * A prop that silently does nothing is worse than no prop: it reads as working
 * code at the call site, so the consumer debugs their own app first.
 *
 * THE RULES
 *
 *   P1  Every `@param props.X` in the docstring names something the signature
 *       actually destructures (or a rest spread catches). "Documented, does
 *       not exist" — the Slider `style` case.
 *   P2  Every destructured prop is READ somewhere in the body. "Exists, goes
 *       nowhere" — the ContentRow `ratio` case.
 *
 * SCOPE: `packages/  * /src/  **  /*.jsx` whose default export is a component
 * with a destructured-object signature. A component with a rest spread
 * (`...rest`) is exempt from P1 for the props it forwards, since the spread is
 * the seam.
 */
import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join, relative, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const PKGS = join(ROOT, 'packages')
const CHECK = process.argv.includes('--check')

function walk(dir, out = []) {
  let entries = []
  try { entries = readdirSync(dir) } catch { return out }
  for (const e of entries) {
    if (e === 'node_modules' || e === 'dist' || e.startsWith('.')) continue
    const p = join(dir, e)
    let st; try { st = statSync(p) } catch { continue }
    if (st.isDirectory()) walk(p, out)
    else if (e.endsWith('.jsx')) out.push(p)
  }
  return out
}

/* EACH docblock paired with the signature it actually documents. The first cut
 * of this gate read only the first signature in a file and checked every
 * `@param` in the file against it — so `SettingsPanel.jsx`, which exports eight
 * components, produced eleven false positives on its first run. A gate that
 * cries wolf gets muted, which is worse than not having one. */
/* EXPORTED components only. An internal helper is not a public contract, and
 * pairing a component's docblock with the little `FadeImg` defined under it was
 * the second wave of false positives this gate produced on itself. */
const DEFS = /\/\*\*([\s\S]*?)\*\/\s*export\s+(?:default\s+)?(?:function\s+(\w+)\s*\(\{([\s\S]*?)\}\)|const\s+(\w+)\s*=\s*\(\{([\s\S]*?)\}\)\s*=>)/g

const IDENT = /^[A-Za-z_$][\w$]*$/

/* the destructured names of one signature. Deliberately not a parser — these
 * files are house-styled and one shape. Comments come off the WHOLE block
 * first: a comma inside one would otherwise split a sentence into two "props"
 * (this gate's own first run built a RegExp out of a user quote and threw). */
const propNames = (raw) => {
  const block = raw.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/[^\n]*/g, '')
  const names = []
  let depth = 0
  let cur = ''
  /* STRINGS ARE OPAQUE. A default like `sizes = '(max-width: 1400px) 100vw,
   * 1400px'` carries both brackets and a comma inside a literal; counting them
   * split one prop into two halves that matched no identifier, so the gate
   * reported the prop as undeclared. It found four of those in its own first
   * honest run — every one a false positive on a component that was fine. */
  let quote = null
  for (const ch of block) {
    if (quote) { cur += ch; if (ch === quote) quote = null; continue }
    if (ch === "'" || ch === '"' || ch === '`') { quote = ch; cur += ch; continue }
    if ('([{'.includes(ch)) depth++
    else if (')]}'.includes(ch)) depth--
    if (ch === ',' && depth === 0) { names.push(cur); cur = '' } else cur += ch
  }
  names.push(cur)
  return names
    .map((n) => n.trim())
    .filter(Boolean)
    .map((n) => {
      if (n.startsWith('...')) return { rest: true, name: n.slice(3) }
      /* THE DEFAULT COMES OFF FIRST. `variant: variantProp = 'file'` renames, and
       * the LOCAL name is what the body reads — but a default value can contain
       * its own colon (`sizes = '(max-width: 1400px) …'`), and splitting on `:`
       * before `=` read that as a rename and threw the prop away. Three of this
       * gate's four remaining false positives were this one line. */
      const head = n.split('=')[0]
      const outer = head.split(':')[0].trim()
      const local = (head.includes(':') ? head.split(':')[1] : head).trim()
      return { rest: false, name: outer, local }
    })
    .filter((p) => p.rest || (IDENT.test(p.name) && IDENT.test(p.local)))
}

/* SELF-TEST (`node scripts/validate-props.mjs --self-test`). A green gate that
 * was never seen to fire proves nothing — and this one produced 66, then 6,
 * then 4 false positives before it produced 0. Every shape that fooled it is a
 * case below, alongside the two real defects it was built for. */
if (process.argv.includes('--self-test')) {
  const cases = [
    ['P1 fires — Slider: documented `style`, no such prop, no rest spread',
      "/**\n * @param {Object} props.style - the seam\n */\nexport const S = ({ value, onChange }) => {\n  return onChange(value)\n}", ['P1']],
    ['P2 fires — ContentRow: `ratio` destructured and never read',
      "/**\n * @param {string} ratio x\n */\nexport const R = ({ ratio, thumb }) => {\n  return thumb\n}", ['P2']],
    ['clean — a rest spread is the seam, so P1 must not fire',
      "/**\n * @param {Object} props.style - the seam\n */\nexport const S = ({ value, ...rest }) => {\n  return value + rest\n}", []],
    ['clean — spread IS a read (SectionHero panelProps)',
      "/**\n * @param {object} panelProps x\n */\nexport const H = ({ panelProps }) => {\n  return <P {...panelProps} />\n}", []],
    ['clean — a comma inside a string default is not a separator (FramedMediaBand)',
      "/**\n * @param {string} sizes x\n */\nexport const F = ({ sizes = '(max-width: 1400px) 100vw, 1400px' }) => {\n  return sizes\n}", []],
    ['clean — a colon inside a default is not a rename (FramedMediaBand)',
      "/**\n * @param {string} a x\n */\nexport const C = ({ a = 'x: y' }) => {\n  return a\n}", []],
    ['clean — a real rename resolves to the LOCAL name (ContentRow variantProp)',
      "/**\n * @param {string} variant x\n */\nexport const V = ({ variant: variantProp = 'file' }) => {\n  return variantProp\n}", []],
  ]
  let failed = 0
  for (const [name, src, expect] of cases) {
    const got = []
    DEFS.lastIndex = 0
    for (const m of src.matchAll(DEFS)) {
      const doc = m[1], block = m[3] ?? m[5], end = m.index + m[0].length
      const props = propNames(block)
      const hasRest = props.some((p) => p.rest)
      const declared = new Set(props.filter((p) => !p.rest).map((p) => p.name))
      if (!hasRest) for (const d of doc.matchAll(/@param\s+\{[^}]*\}\s+(?:props\.)?([A-Za-z_$][\w$]*)/g)) {
        if (d[1] !== 'props' && !declared.has(d[1])) got.push('P1')
      }
      const body = src.slice(end)
      for (const pr of props) {
        if (pr.rest || pr.local === 'children') continue
        const n = pr.local.replace(/\$/g, '\\$')
        if (!new RegExp(`(?<![\\w$.])${n}(?![\\w$])|\\.\\.\\.${n}(?![\\w$])`).test(body)) got.push('P2')
      }
    }
    const ok = JSON.stringify(got) === JSON.stringify(expect)
    if (!ok) failed++
    console.log(`  ${ok ? 'ok  ' : 'FAIL'}  ${name}${ok ? '' : ` → expected [${expect}] got [${got}]`}`)
  }
  console.log(failed ? `\n${failed} self-test(s) FAILED` : '\nself-test: all 7 pass')
  process.exit(failed ? 1 : 0)
}

const violations = []
for (const file of walk(PKGS)) {
  const src = readFileSync(file, 'utf8')
  const rel = relative(ROOT, file)

  DEFS.lastIndex = 0
  const defs = [...src.matchAll(DEFS)].map((m) => ({
    doc: m[1],
    name: m[2] ?? m[4],
    block: m[3] ?? m[5],
    end: m.index + m[0].length,
    index: m.index,
  }))

  for (let i = 0; i < defs.length; i++) {
    const { doc, name, block, end } = defs[i]
    const props = propNames(block)
    if (!props.length) continue
    const hasRest = props.some((p) => p.rest)
    const declared = new Set(props.filter((p) => !p.rest).map((p) => p.name))
    const where = `${rel} · ${name}`

    /* P1 — documented but not accepted. A rest spread IS the seam, so a
     * component that carries one is exempt: the prop reaches the element. */
    if (!hasRest) {
      for (const m of doc.matchAll(/@param\s+\{[^}]*\}\s+(?:props\.)?([A-Za-z_$][\w$]*)/g)) {
        const p = m[1]
        if (p === 'props' || declared.has(p)) continue
        violations.push({ where, rule: 'P1', msg: `docstring documents \`${p}\` — the signature does not accept it` })
      }
    }

    /* P2 — accepted but never read. The body runs to the NEXT definition. */
    const body = src.slice(end, defs[i + 1]?.index ?? src.length)
    for (const p of props) {
      if (p.rest || p.local === 'children') continue
      /* SPREAD IS A READ. `{...panelProps}` and `...secondaryRows` are how half
       * the organisms forward a prop, and a plain `(?<![\w$.])` lookbehind reads
       * the third dot as property access and calls them dead — which is what
       * this gate did to SectionHero and SectionCta on its first honest run. */
      const n = p.local.replace(/\$/g, '\\$')
      const used = new RegExp(`(?<![\\w$.])${n}(?![\\w$])|\\.\\.\\.${n}(?![\\w$])`).test(body)
      if (!used) violations.push({ where, rule: 'P2', msg: `\`${p.local}\` is destructured and never read — a prop that silently does nothing` })
    }
  }
}

const byRule = { P1: 0, P2: 0 }
for (const v of violations) byRule[v.rule]++
console.log(`props: ${violations.length} violation(s)${violations.length ? '' : ' — every documented prop exists and every declared prop is read'}\n`)
for (const v of violations) console.log(`  ${v.rule}  ${v.where}\n      ${v.msg}`)
if (violations.length) console.log(`\n  P1 documented, does not exist: ${byRule.P1} · P2 exists, goes nowhere: ${byRule.P2}`)

if (CHECK && violations.length) process.exit(1)
