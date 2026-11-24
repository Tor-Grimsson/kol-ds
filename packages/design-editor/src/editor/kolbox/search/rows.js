/* The search modal's rows (round 3, 9.1): FloatCommandSearch.jsx's logic carried line for line (packages/design-editor/
   src/editor/float/FloatCommandSearch.jsx). None of it is exported there (actionRows, the seed, the recents, the
   suggestion and result lists are module locals), so it is copied; what changes is only the input shape: kolbox's menus
   are Menu data ({ label, groups } with rows { label, shortcut, icon, submenu, disabled, run }) where float's are
   { label, items } with { label, kbd, icon, items, disabled, onClick }.
   The tabs are his: the first shows every row but the tab-only ones, the rest the rows whose `tab` is their value.
   Round 4, 14.1, the real hub's search (kol-shell AppHub's ⌘K) on top of it: FILES (the library's saved files),
   PAGES (every page the app has, the rail as drawn) and SHORTCUTS (the screen's keymap, each section a fold that starts
   open), in that order and before float's Recent, Tools and Actions. Typed, a row matches on its label as the real
   one's do, and the groups keep that order, so "grid" lights Show/hide grid before any Grid preset. */
export const TABS = [{ value: 'all', label: 'Overview' }, { value: 'actions', label: 'Actions' }, { value: 'tools', label: 'Tools' }, { value: 'pages', label: 'Pages' }]

/* Empty, the modal opens on Recent: the last four run, Text, Rectangle, Pen and Layers until something is (float's seed;
   kolbox's menus have no View › Cards › Layers, so that one finds no row and drops out, as a missing seed does there) */
const SEED = ['tool:text', 'tool:rect', 'tool:pen', 'action:View›Cards›Layers']
let recent = [] /* this session's last runs, newest first: kept across opens and across the screens, not across reloads */
export const remember = (id) => { recent = [id, ...recent.filter((x) => x !== id)].slice(0, 8) }

/* the menus' leaves as rows: a row's path is its id, its key (or its menu) the hint; a disabled row (and all under it)
   is left out */
export function actionRows(menus) {
  const out = []
  const walk = (groups, path) => (groups ?? []).forEach((g) => (Array.isArray(g) ? g : g.rows ?? []).forEach((it) => {
    if (!it || it.disabled) return
    if (it.submenu?.length) return walk(it.submenu, [...path, it.label])
    if (typeof it.run !== 'function' || !it.label) return
    out.push({ id: `action:${[...path, it.label].join('›')}`, label: it.label, icon: it.icon ?? 'command', hint: it.shortcut ?? path.join(' › '), kbd: !!it.shortcut, tab: 'actions', menu: path[0], run: it.run })
  }))
  menus.forEach((m) => walk(m.groups, [m.label]))
  /* a label met twice keeps its first row */
  const seen = new Set()
  return out.filter((r) => (seen.has(r.id) ? false : seen.add(r.id)))
}

/* PRESSING A SHORTCUT (14.1): a shortcut row performs its key, as the real sheet lists it but never runs it. The key is
   pressed on the page (a keydown and keyup on the body, so no field holds it) and whatever the screen binds to it answers,
   with every guard the key itself has. Combo grammar is the keymap's (`Mod+Shift+Alt+Key`, Mod is ⌘ on a Mac); "00" is
   the zero pressed twice; a range ("1–9") names keys, not one key, so its row reads and does not run. */
const NAMED = { Plus: ['+', 'Equal'], Space: [' ', 'Space'] }
const PUNCT = { ',': 'Comma', '.': 'Period', '/': 'Slash', '\\': 'Backslash', ';': 'Semicolon', "'": 'Quote', '[': 'BracketLeft', ']': 'BracketRight', '-': 'Minus', '=': 'Equal', '`': 'Backquote' }
export const pressable = (combo) => !!combo && !combo.includes('–')
export function press(combo) {
  if (!pressable(combo)) return
  if (combo === '00') { press('0'); press('0'); return }
  const parts = combo.split('+')
  const name = parts.pop() || '+'
  const mod = parts.includes('Mod'), shift = parts.includes('Shift') || name === '?', alt = parts.includes('Alt')
  const mac = /Mac|iPhone|iPad/.test(navigator.platform)
  let [key, code] = NAMED[name] ?? [name, name]
  if (name.length === 1) {
    key = /[a-z]/i.test(name) ? (shift ? name.toUpperCase() : name.toLowerCase()) : name
    code = /[a-z]/i.test(name) ? `Key${name.toUpperCase()}` : /[0-9]/.test(name) ? `Digit${name}` : PUNCT[name] ?? ''
  }
  const init = { key, code, shiftKey: shift, altKey: alt, metaKey: mod && mac, ctrlKey: mod && !mac, bubbles: true, cancelable: true }
  document.body.dispatchEvent(new KeyboardEvent('keydown', init))
  document.body.dispatchEvent(new KeyboardEvent('keyup', init))
}

/* files [{ id, name, run }], pages [{ id, label, icon, hint, run }], shortcuts: the keymap's sections
   [{ section, items: [{ id, label, combo }] }], hint already drawn (`keys`) */
export function allRows({ menus = [], tools = [], layers = [], pages = [], files = [], shortcuts = [] }) {
  return [
    ...files.map((f) => ({ id: `file:${f.id}`, label: f.name, icon: 'file', hint: f.hint, tab: 'files', run: f.run })),
    ...layers.map((l) => ({ id: `layer:${l.id}`, label: l.name, icon: 'layers', hint: l.kind, tab: 'layers', run: l.run })),
    ...pages.map((p) => ({ ...p, id: `page:${p.id}`, tab: 'pages' })),
    ...shortcuts.flatMap((s) => s.items.map((k, i) => ({
      id: `key:${s.section}:${k.id ?? i}:${k.combo}`, label: k.label, hint: k.keys, kbd: true, tab: 'shortcuts', section: s.section,
      run: pressable(k.combo) ? () => setTimeout(() => press(k.combo)) : undefined,
    }))),
    ...actionRows(menus),
    ...tools.map((t) => ({ id: `tool:${t.id ?? t.label}`, label: t.label, icon: t.icon, hint: t.kbd, kbd: !!t.kbd, tab: 'tools', run: t.run, disabled: t.disabled, disabledHint: t.disabledHint })),
  ]
}

/* the keymap's rows as the real sheet draws them: one fold per section, open, its keys under it */
export function shortcutFolds(rows) {
  const out = []
  rows.filter((r) => r.tab === 'shortcuts').forEach((r) => {
    let fold = out[out.length - 1]
    if (fold?.label !== r.section) { fold = { id: `cat:${r.section}`, label: r.section, group: 'Shortcuts', tab: 'shortcuts', open: true, items: [] }; out.push(fold) }
    fold.items.push(r)
  })
  return out
}

/* the empty modal's rows: the real three (Files, Pages, the Shortcuts folds), then float's Recent; an empty Actions or
   Tools tab lists all of them, the first tab leaves them to Recent */
export function suggestions(rows) {
  const byId = new Map(rows.map((r) => [r.id, r]))
  const ids = [...recent, ...SEED.filter((s) => !recent.includes(s))].slice(0, 4)
  return [
    ...rows.filter((r) => r.tab === 'files').map((r) => ({ ...r, group: 'Files' })),
    ...rows.filter((r) => r.tab === 'pages').map((r) => ({ ...r, group: 'Pages' })),
    ...shortcutFolds(rows),
    ...ids.map((id) => byId.get(id)).filter(Boolean).map((r) => ({ ...r, id: `recent:${r.id}`, group: 'Recent', key: r.id })),
    ...rows.filter((r) => r.tab === 'actions' || r.tab === 'tools').map((r) => ({ ...r, group: r.tab === 'tools' ? 'Tools' : r.menu, tabOnly: true })),
  ]
}

/* typed: Files, Pages and Shortcuts as the real search ranks them (the label holds the query, in their own order), then
   float's Tools and Actions (the label or the hint holds it, labels that start with it first, 40 at most) */
const GROUP = { files: 'Files', layers: 'Layers', pages: 'Pages', shortcuts: 'Shortcuts', tools: 'Tools', actions: 'Actions' }
export function results(rows, query) {
  const q = query.trim().toLowerCase()
  if (!q) return []
  const has = (r) => r.label.toLowerCase().includes(q)
  const real = ['files', 'layers', 'pages', 'shortcuts'].flatMap((tab) => rows.filter((r) => r.tab === tab && has(r)))
  const float = rows
    .filter((r) => r.tab === 'tools' || r.tab === 'actions')
    .map((r) => ({ r, at: r.label.toLowerCase().indexOf(q), hinted: String(r.hint ?? '').toLowerCase().includes(q) }))
    .filter((x) => x.at >= 0 || x.hinted)
    .sort((a, b) => (b.at === 0) - (a.at === 0))
    .slice(0, 40)
    .map(({ r }) => r)
  return [...real, ...float].map((r) => ({ ...r, group: GROUP[r.tab] }))
}

/* the rows of one tab, bucketed by group in first-seen order (CommandOverlay's groupRows): [{ title, rows }] */
export function groupsFor(list, tab) {
  const inTab = (r) => (tab === TABS[0].value ? !r.tabOnly : r.tab === tab)
  const out = []
  const by = new Map()
  list.filter(inTab).forEach((r) => {
    const g = r.group ?? ''
    if (!by.has(g)) { by.set(g, { title: g, rows: [] }); out.push(by.get(g)) }
    by.get(g).rows.push(r)
  })
  return out
}
