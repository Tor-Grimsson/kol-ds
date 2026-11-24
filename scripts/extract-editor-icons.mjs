#!/usr/bin/env node
/**
 * extract-editor-icons.mjs — the icons the editor draws, read from its code (W18.4, plan-2026-11-20-kolbox-everything-left).
 *
 * Parses every .js/.jsx file under packages/design-editor/src/editor and apps/editor/src, plus RailSwitcher (the
 * editor's left switcher, a kol-component organism), and keeps each string that names a glyph in the set when it sits
 * where an icon name goes:
 *   - the `name` or `icon` prop of an element whose name holds "Icon" (IconLoader, IconC, IconButton…)
 *   - any prop, object key or default parameter whose name is `icon` or ends in `Icon` / `icon` / `glyph`
 *   - the value of a variable whose name holds "icon" (`TYPE_ICONS`, `iconFor`)
 *   - the argument a local helper takes in a parameter whose name holds "icon" (`act(label, icon, …)`)
 * Strings are read inside conditionals and maps too (`visible ? 'eye' : 'eye-off'`).
 *
 * node scripts/extract-editor-icons.mjs           prints the names, one a line, and the count
 * node scripts/extract-editor-icons.mjs --write   sets the `editor` tag in packages/icons/src/tags.json on exactly these
 *                                                 names (added where missing, taken off names the editor no longer draws)
 */
import { readdirSync, readFileSync, writeFileSync, statSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createRequire } from 'node:module'
import { drawings } from './icon-set.mjs'

/* @babel/parser is react-docgen's own (a root devDependency); resolved through it, so nothing new is installed */
const require = createRequire(import.meta.url)
const { parse } = createRequire(require.resolve('react-docgen'))('@babel/parser')

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const ICONS = join(ROOT, 'packages', 'icons', 'src')
const TAGS_FILE = join(ICONS, 'tags.json')
const TAG = 'editor'
const SOURCES = [
  'packages/design-editor/src/editor',
  'apps/editor/src',
  'packages/component/src/organisms/RailSwitcher.jsx',
]

const walk = (p, keep) => statSync(p).isDirectory()
  ? readdirSync(p).flatMap((e) => walk(join(p, e), keep))
  : keep(p) ? [p] : []

/* every name the set ships (identity: the mark whose file names its folder; modified icons, W19) */
const names = new Set(drawings().keys())

const ICONISH = /(^icon$|icon$|^icon|glyph)/i
const keyName = (k) => k?.type === 'Identifier' ? k.name : k?.type === 'StringLiteral' ? k.value : k?.type === 'JSXIdentifier' ? k.name : null
const elName = (n) => n?.type === 'JSXIdentifier' ? n.name : n?.type === 'JSXMemberExpression' ? `${elName(n.object)}.${n.property.name}` : ''

/* every string under a node, skipping nothing: a map, a ternary or a JSX child all count */
function strings(node, out) {
  if (!node || typeof node.type !== 'string') return
  if (node.type === 'StringLiteral') out.push(node.value)
  else if (node.type === 'TemplateLiteral' && node.expressions.length === 0) out.push(node.quasis[0].value.cooked)
  for (const k of Object.keys(node)) {
    if (k === 'loc' || k === 'start' || k === 'end' || k === 'leadingComments' || k === 'trailingComments') continue
    const v = node[k]
    if (Array.isArray(v)) v.forEach((c) => c && typeof c.type === 'string' && strings(c, out))
    else if (v && typeof v.type === 'string') strings(v, out)
  }
}

function visit(node, fn) {
  if (!node || typeof node.type !== 'string') return
  fn(node)
  for (const k of Object.keys(node)) {
    if (k === 'loc' || k === 'leadingComments' || k === 'trailingComments') continue
    const v = node[k]
    if (Array.isArray(v)) v.forEach((c) => visit(c, fn))
    else if (v && typeof v.type === 'string') visit(v, fn)
  }
}

const found = new Map() // name → first file:line
const files = SOURCES.flatMap((s) => walk(join(ROOT, s), (p) => /\.(jsx?|mjs)$/.test(p)))
for (const file of files) {
  const ast = parse(readFileSync(file, 'utf8'), { sourceType: 'module', plugins: ['jsx'], errorRecovery: true })
  const take = (node) => {
    const out = []
    strings(node, out)
    for (const s of out) if (names.has(s) && !found.has(s)) found.set(s, `${file.slice(ROOT.length + 1)}:${node.loc.start.line}`)
  }
  /* pass 1: local helpers that take an icon by position — `const act = (label, icon, …) =>` */
  const helpers = new Map()
  const params = (fn) => fn.params.map((p) => p.type === 'AssignmentPattern' ? p.left : p).map((p) => p.type === 'Identifier' ? p.name : '')
  visit(ast.program, (n) => {
    if (n.type === 'FunctionDeclaration' && n.id) helpers.set(n.id.name, params(n))
    if (n.type === 'VariableDeclarator' && n.id.type === 'Identifier' && /Function/.test(n.init?.type ?? '')) helpers.set(n.id.name, params(n.init))
  })
  /* pass 2 */
  visit(ast.program, (n) => {
    if (n.type === 'JSXOpeningElement') {
      const iconEl = /Icon/.test(elName(n.name))
      for (const a of n.attributes) {
        if (a.type !== 'JSXAttribute') continue
        const k = keyName(a.name)
        if ((iconEl && (k === 'name' || k === 'icon')) || ICONISH.test(k ?? '')) take(a.value)
      }
    }
    if ((n.type === 'ObjectProperty' || n.type === 'AssignmentPattern') && ICONISH.test(keyName(n.key ?? n.left) ?? '')) take(n.value ?? n.right)
    if (n.type === 'VariableDeclarator' && n.id.type === 'Identifier' && /icon/i.test(n.id.name)) take(n.init)
    if (n.type === 'FunctionDeclaration' && /icon/i.test(n.id?.name ?? '')) take(n.body)
    if (n.type === 'CallExpression' && n.callee.type === 'Identifier' && helpers.has(n.callee.name)) {
      helpers.get(n.callee.name).forEach((p, i) => { if (/icon/i.test(p) && n.arguments[i]) take(n.arguments[i]) })
    }
  })
}

const list = [...found.keys()].sort()
if (process.argv.includes('--write')) {
  const tags = JSON.parse(readFileSync(TAGS_FILE, 'utf8'))
  const want = new Set(list)
  let added = 0, removed = 0
  for (const [n, t] of Object.entries(tags)) {
    const has = t.includes(TAG)
    if (want.has(n) && !has) { t.push(TAG); added++ }
    if (!want.has(n) && has) { tags[n] = t.filter((x) => x !== TAG); removed++ }
  }
  const missing = list.filter((n) => !tags[n])
  if (missing.length) console.warn(`no tags.json entry (not tagged): ${missing.join(', ')}`)
  /* the file's own shape: one entry a line */
  writeFileSync(TAGS_FILE, '{\n' + Object.entries(tags).map(([n, t]) => `${JSON.stringify(n)}: ${JSON.stringify(t)}`).join(',\n') + '\n}\n')
  console.log(`editor icons: ${list.length}, tag added ${added}, removed ${removed}`)
} else {
  for (const n of list) console.log(`${n}\t${found.get(n)}`)
  console.log(`${list.length} icons`)
}
