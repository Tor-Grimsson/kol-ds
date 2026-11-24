import { cover } from './covers.js'
import {
  CANVAS_H, CANVAS_W, GROUPS, KINETIC_PRESETS, PRESETS, getAppSettings, groupOfPreset, listShipped, presetById,
  presetComp, presetLayerPatch, readShippedRaw,
} from './engine.js'

/* WHAT THE LIBRARY LISTS (round 4, W10), by chrome, as the real Library page (apps/editor-hub pages/Library.jsx) builds it:
 *
 *   LABS         every loops preset (under its catalog group, its sub the category) and every kinetic preset, one file each
 *   RANDOMISER   the same pool; a Randomiser file records the pick
 *   EDITOR       the ten editor files the package ships (shipped.js), which the engine opens: the hub's ten are stand-ins
 *                named Preset 1a … for these (its note: "kol-fxr makes these from the editor's own layer kinds")
 *   MORPH        the ten morph files the package ships, the same way (the hub's: "kol-fxr generates these on first load")
 *
 * The card's fields are the hub's: date and size from the item's place (SHIP_DATE less a day per place, 640 B plus 97 a
 * place), the cover `cover(i % 40)`, tags the group and category, the details Group, Category, Aspect (Kind, Layers,
 * Aspect for an editor file; Steps, From, To for a morph). Only what ships: the user's own files are Home's (a
 * Duplicate is the user's and lists there, as the package's applyDuplicate says). This device's renames and removals of
 * a shipped file are the package's own
 * override store (shipped.js `renameShipped` / `removeShipped`), applied to every shipped item here by its id. */
const SHIP_DATE = Date.parse('2026-10-19T12:00:00Z')
const DAY = 86400000
export const CHROMES = {
  editor: { icon: 'desktop', label: 'Editor' },
  labs: { icon: 'globe', label: 'Labs' },
  randomiser: { icon: 'refresh', label: 'Randomiser' },
  morph: { icon: 'swap', label: 'Morph' },
}
export const VIEWS = [{ value: 'editor', label: 'EDITOR' }, { value: 'labs', label: 'LABS' }, { value: 'randomiser', label: 'RANDOMISER' }, { value: 'morph', label: 'MORPH' }]
const ASPECTS = ['1:1', '4:5', '16:9']

const groupLabel = (p) => { const gid = groupOfPreset(p.id); return GROUPS.find((g) => g.id === gid)?.label ?? gid ?? GROUPS[0].label }
const full = { x: 0, y: 0, w: CANVAS_W, h: CANVAS_H }
const layer = (type, fields) => ({ id: `ship-${type}`, type, visible: true, opacity: 1, blend: 'normal', ...fields })

/* where an item opens: the query it carries and the screen; a new history entry, so back returns to the Library */
export function openAt(params, hash) {
  const url = new URL(window.location.href)
  for (const k of ['open', 'new', 'preset', 'cat']) url.searchParams.delete(k)
  for (const [k, v] of Object.entries(params)) if (v != null) url.searchParams.set(k, v)
  url.hash = hash
  window.history.pushState(null, '', url.pathname + url.search + url.hash)
  window.dispatchEvent(new HashChangeEvent('hashchange'))
}
/* a Randomiser file opens in the Randomiser (round 4, W11), on its pick */
const SCREEN = { editor: '#/editor', labs: '#/labs', randomiser: '#/randomiser', morph: '#/morph' }

/* the hub's item, with what kolbox needs to open, copy and download it */
const item = (chrome, i, f) => ({
  chrome, date: SHIP_DATE - (i % 60) * DAY, bytes: 640 + (i * 97) % 2400, cover: cover(i % 40),
  tags: [f.group, ...(f.sub ? [f.sub] : [])].map((t) => t.toLowerCase()), ...f,
})

/* the labs pool: the hub's LABS_POOL */
function pool(chrome, offset) {
  const loops = PRESETS.map((p) => ({ p, name: p.label ?? p.name ?? p.id, group: groupLabel(p), sub: p.sub ?? null, kind: 'loop' }))
  const kinetic = KINETIC_PRESETS.map((p) => ({ p, name: p.label, group: 'Kinetic type', sub: p.sub ?? null, kind: 'kinetic' }))
  return [...loops, ...kinetic].map(({ p, name, group, sub, kind }, i) => {
    const aspect = ASPECTS[(i + offset) % 3]
    const gid = kind === 'loop' ? groupOfPreset(p.id) : null
    return item(chrome, i + offset, {
      id: `ship:${chrome}:${kind === 'kinetic' ? 'type-' : ''}${p.id}`, slug: p.id, name, group, sub,
      details: [{ label: 'Group', value: group }, ...(sub ? [{ label: 'Category', value: sub }] : []), { label: 'Aspect', value: aspect }],
      /* Labs' deep link, the real `?preset=<id>&cat=<group>`; a kinetic preset has no loops group, its id alone */
      open: () => openAt({ preset: p.id, cat: gid }, SCREEN[chrome]),
      spec: () => ({
        mode: chrome, aspect, group, ...(sub ? { sub } : {}), intent: 'whole', palette: null,
        layers: [kind === 'loop'
          ? layer('loop', { ...full, ...presetLayerPatch(presetById(p.id), gid), themeId: getAppSettings().defaultTheme })
          : layer('kinetic', { ...full, presetId: p.id, presetLabel: p.label, comp: presetComp(p) })],
      }),
    })
  })
}

/* a file the package ships: opened through the package's `?open=<id>` intent */
const specOf = (f) => { const { v, id, savedAt, updatedAt, shipped, name, thumb, ...spec } = f; return spec }

function shipped(chrome, offset) {
  return listShipped().filter((f) => f.mode === chrome).map((f, i) => {
    const details = chrome === 'morph'
      ? [{ label: 'Steps', value: f.morph?.steps?.length ?? 0 }, { label: 'From', value: f.name.split(' → ')[0] }, { label: 'To', value: f.name.split(' → ')[1] ?? '' }]
      : [{ label: 'Kind', value: f.group }, { label: 'Layers', value: f.layers.length }, { label: 'Aspect', value: f.aspect }]
    return item(chrome, i + offset, {
      id: f.id, slug: f.id.replace(`ship:${chrome}:`, ''), name: f.name, group: f.group, sub: f.sub ?? null, details,
      ...(f.morph ? { steps: f.name.split(' → ') } : {}),
      open: () => openAt({ open: f.id }, SCREEN[chrome]),
      spec: () => specOf(f),
    })
  })
}

/* the hub's place offsets per chrome: labs i, randomiser i + 7, morph i + 3, editor i + 11 */
let built = null
const shippedLists = () => (built ??= {
  labs: pool('labs', 0), randomiser: pool('randomiser', 7), editor: shipped('editor', 11), morph: shipped('morph', 3),
})

const overrides = () => { try { return JSON.parse(readShippedRaw() || '{}') } catch { return {} } }

/** The Library's list for a chrome: the shipped files with this device's renames and removals. */
export function libraryList(chrome) {
  const { removed = [], names = {} } = overrides()
  const gone = new Set(removed)
  const ship = shippedLists()[chrome].filter((f) => !gone.has(f.id)).map((f) => (names[f.id] ? { ...f, name: names[f.id] } : f))
  return ship
}

