#!/usr/bin/env node
/**
 * check-float-commands — every command of the classic editor has a home in the float chrome
 * (plan-2026-11-05-float-editor W2.2). Lists the commands of today's editor —
 *
 *   MenuTop      every row label of the menu bar (shell/MenuTop.jsx)
 *   keymap       every editor shortcut id (state/keymap.js, not hidden, not Labs')
 *   rail         the tool strip's tools and folds, the action band's verbs, the rail footer's tabs
 *   panels       every tab of the panels registry (shell/panels/tabs.jsx) — each in a float card (W2.3)
 *
 * — and checks each against the float chrome's data: the menu bar (float/useFloatMenus.jsx), the top cluster and the
 * cards (float/FloatEditorShell.jsx), the tool rail and its ⋮ (float/FloatCompose.jsx). A MenuTop row is home when its
 * label is a row label there; a shortcut is home when a row runs it (`key('id')` / `cmd('id')`), a rail slot arms its
 * tool (`tool-<id>`), or it is in HOMES below with where it lives. Exits 1 with the missing list.
 *
 *   node scripts/check-float-commands.mjs
 */
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const ED = join(dirname(fileURLToPath(import.meta.url)), '../src/editor')
const read = (p) => readFileSync(join(ED, p), 'utf8')
/* comments out, so a label named only in prose is not a home */
const code = (s) => s.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '').replace(/\{\s*\/\*[\s\S]*?\*\/\s*\}/g, '')

const menuTop = code(read('shell/MenuTop.jsx'))
const floatSrc = code(read('float/useFloatMenus.jsx')) + code(read('float/FloatEditorShell.jsx')) + code(read('float/FloatCompose.jsx'))
const strings = new Set([...floatSrc.matchAll(/'([^'\n]+)'/g)].map((m) => m[1]))
const all = (re, s) => [...s.matchAll(re)].map((m) => m[1].trim())

/* ── MenuTop's rows ─────────────────────────────────────────────────────────────────────────────────────────────── */
const menuLabels = new Set([
  ...all(/>([^<>{}\n]+)<\/MenuDropdownItem>/g, menuTop),
  ...all(/<MenuDropdownNest[^>]*\blabel="([^"]+)"/g, menuTop),
  ...all(/<MenuItem label="([^"]+)"/g, menuTop),
  ...all(/\{ label: '([^']+)',\s+(?:go|current)/g, menuTop), /* CHROMES */
  ...all(/\['[^']+', '[^']+', '([^']+)'\]/g, menuTop), /* the text alignment rows */
  ...all(/\? '[^']+' : '([^']+)'/g, menuTop), /* Save / Save… */
  ...[...menuTop.matchAll(/\{(?:\.\.\.\([a-z]+\(?\)? \? )?\[([^\]]*'[^\]]*)\](?: : \[\]\))?(?:\.map\(\((?:t|\[id, label\])\))/g)].flatMap((m) => all(/'([^']+)'/g, m[1])),
  ...all(/\['[^']+', '([^']+)'\]/g, menuTop), /* the colour tabs' labels */
])
/* dynamic rows that read from data the float menus read too (Library counts, Starters, Aspect, presets) */
for (const dyn of ['Palettes', 'Patterns', 'Types', 'Presets']) menuLabels.delete(dyn)
/* MenuTop's Window menu and its two submenus are containers, not commands — their rows open cards (View › Cards) */
const CONTAINERS = { Window: 'View › Cards', 'Left rail': 'View › Cards', 'Right rail': 'View › Cards' }
const menuMissing = [...menuLabels].filter((l) => !strings.has(l) && !CONTAINERS[l])

/* ── the keymap ─────────────────────────────────────────────────────────────────────────────────────────────────── */
const keymapSrc = read('state/keymap.js')
const shortcuts = [...keymapSrc.matchAll(/\{ id: '([^']+)',\s+combo: '([^']*)',\s+label: '([^']+)'[^}]*\}/g)]
  .map((m) => ({ id: m[1], combo: m[2], label: m[3], raw: m[0] }))
  .filter((s) => !/hidden: true/.test(s.raw) && !s.id.startsWith('labs-') && (!/views:/.test(s.raw) || /'editor'/.test(s.raw)))
const runs = new Set([...all(/\b(?:key|cmd)\('([^']+)'\)/g, floatSrc)])
const toolIds = new Set(all(/\{ id: '([^']+)', icon:/g, code(read('float/FloatCompose.jsx'))))
/* the ones a row cannot run by id — where each lives in the float chrome */
const HOMES = {
  'tool-select': 'rail', 'node-edit': 'rail ⋮ › Node select', 'tool-zoom': 'rail',
  'opacity-digits': 'Layer › Opacity (10–90%)',
  pan: 'transport (play / pause) + rail ⋮ › Hand',
  'toggle-rail': 'View › Show / hide rail (the float chrome)',
}
const keyMissing = shortcuts.filter((s) => !runs.has(s.id) && !strings.has(s.id) && !HOMES[s.id] && !toolIds.has(s.id.replace(/^tool-/, '')))

/* ── the rail: the tool strip, the action band, the rail footer ─────────────────────────────────────────────────── */
const strip = code(read('shell/panels/ToolStrip.jsx')) + code(read('shell/panels/toolItems.js'))
const band = code(read('shell/panels/ActionBar.jsx'))
const stripTools = [...new Set([
  ...all(/variant\('([^']+)'\)/g, strip), ...all(/tool\('([^']+)'\)/g, strip),
  ...strip.match(/\['rect', 'ellipse', 'triangle', 'polygon', 'star'\]/) ? ['rect', 'ellipse', 'triangle', 'polygon', 'star'] : [],
])]
const stripActions = all(/label: '(Node select|Kinetic type)'/g, strip)
const bandLabels = [...all(/label: '([^']+)'/g, band)].filter((l) => !['Rotate', 'Boolean'].includes(l))
const footerTabs = all(/\{ value: '[a-z]+', label: '([^']+)' \}/g, code(read('shell/panels/EditorFooter.jsx')))
const answers = all(/answers: \[([^\]]+)\]/g, floatSrc).flatMap((s) => all(/'([^']+)'/g, s))
/* a band verb whose menu row says more */
const BAND_AS = { Duplicate: 'Duplicate selection' }
const railMissing = [
  ...stripTools.filter((id) => !toolIds.has(id)).map((id) => `tool ${id}`),
  ...stripActions.filter((l) => !strings.has(l)).map((l) => `strip ${l}`),
  /* the band's booleans run from Vector (BOOL_OP_LABELS — the same four, named once) */
  ...bandLabels.filter((l) => !strings.has(l) && !strings.has(BAND_AS[l]) && !/^(Unite|Subtract|Intersect|Exclude)$/.test(l)).map((l) => `band ${l}`),
  ...footerTabs.filter((t) => !answers.includes(t)).map((t) => `footer ${t}`),
]
/* ── the panels registry (W2.3): every tab of the compose registry sits in a float card ─────────────────────────── */
const registryTabs = all(/\{ tab: '([^']+)'/g, code(read('shell/panels/tabs.jsx')))
const composeSrc = code(read('float/FloatCompose.jsx'))
/* a card's own tabs, and the tabs it HOLDS (the inspector's Design holds Inspector · Parameters · Pattern) */
const cardTabs = [
  ...all(/tabs: \[([^\]]+)\]/g, composeSrc).flatMap((s) => all(/'([^']+)'/g, s)),
  ...all(/holds: \{([^}]+)\}/g, composeSrc).flatMap((s) => all(/([A-Za-z]+):/g, s)),
]
const panelMissing = registryTabs.filter((t) => !cardTabs.includes(t)).map((t) => `panel ${t}`)

const missing = [...menuMissing.map((l) => `MenuTop "${l}"`), ...keyMissing.map((s) => `key ${s.id} (${s.combo})`), ...railMissing, ...panelMissing]
console.log(`MenuTop rows ${menuLabels.size} · shortcuts ${shortcuts.length} · rail ${stripTools.length + stripActions.length + bandLabels.length + footerTabs.length} · registry panels ${registryTabs.length} — missing ${missing.length}`)
if (missing.length) { console.log(missing.map((m) => `  ✗ ${m}`).join('\n')); process.exit(1) }
