/* THE DATA LAYER — every file in every identity folder, read straight from the package (plan-2026-10-28-identity
 * 2.1: "reading the sets straight from @kolkrabbi/kol-icons by name and by path, nothing drawn in the app").
 *
 * Two globs over the workspace symlink: every file as a served URL (the PNGs, the cards), every SVG as raw text
 * (inlined so `currentColor` can ink it on either pane). A consumer writes the same thing with the package's
 * `./identity/*` export — `@kolkrabbi/kol-icons/identity/<id>/<file>?url` — which is the path printed under
 * every cell here. */
const urls = import.meta.glob('../node_modules/@kolkrabbi/kol-icons/src/kol-icon-set-identity/*/*', { eager: true, query: '?url', import: 'default' })
const raws = import.meta.glob('../node_modules/@kolkrabbi/kol-icons/src/kol-icon-set-identity/*/*.svg', { eager: true, query: '?raw', import: 'default' })

/* the names the home screen shows (apple-mobile-web-app-title) — the identity id is the folder, the name is the app's */
const NAMES = { kolkrabbi: 'Kolkrabbi', 'kol-ds': 'KDS', fxr: 'FXR', mirror: 'Mirror', monitor: 'Monitor', metric: 'Metric', r2b2: 'R2B2', record: 'Record', studio: 'Studio', brand: 'Brand', workshop: 'Workshop' }
export const nameOf = (id) => NAMES[id] ?? id

const strip = (svg) => svg.replace(/<\?xml[^>]*>/, '').replace(/<!--[\s\S]*?-->/g, '').trim()

const byId = {}
for (const [p, url] of Object.entries(urls)) {
  const parts = p.split('/')
  const file = parts.pop()
  const id = parts.pop()
  ;(byId[id] ||= { id, files: {} }).files[file] = { file, url, path: `@kolkrabbi/kol-icons/identity/${id}/${file}`, raw: raws[p] ? strip(raws[p]) : null }
}

/* the roles (02-icons/01-inventory § Identity set): the file named like the folder is the icon; the rest by suffix */
const ROLES = [
  ['icon', (id, f) => f === `${id}.svg`, 'the icon on the 24 keyline', '<Icon name="<id>">'],
  ['logomark', (id, f) => f === `${id}-logomark.svg`, 'the raw mark in its own box', 'VectorLoader · the boot loader · lockups'],
  ['wordmark', (id, f) => f === `${id}-wordmark.svg`, 'the name set as type', 'the share card · the boot loader'],
  ['lockup-h', (id, f) => f === `${id}-lockup-h.svg`, 'mark + wordmark, wide', 'brand pages · the share card'],
  ['lockup-v', (id, f) => f === `${id}-lockup-v.svg`, 'mark + wordmark, stacked', 'brand pages'],
  ['favicon', (id, f) => f === `${id}-favicon.svg`, 'the tab icon, scheme style baked in', '<link rel="icon">'],
  ['app-icon', (id, f) => f === `${id}-app-icon.svg`, 'the app icon (Apple\'s word) on its dark ground, the 60 % rule', 'apple-touch-icon · the PNGs render from it'],
  ['app-icon-light', (id, f) => f === `${id}-app-icon-light.svg`, 'the same on the light ground, for the record', '—'],
  ['legacy', (id, f) => f === `${id}-tile.svg` || f === `${id}-tile-light.svg`, 'the app icon under its 0.50.0 name, kept until 2026-11-27', 'nothing new'],
  ['alt', (id, f) => f.startsWith(`${id}-alt-`) && f.endsWith('.svg'), 'an alternate drawing kept for a round', 'this app'],
  ['png', (id, f) => (f.endsWith('.png') && f !== 'og.png') || f === 'favicon.ico', 'the rendered sizes', 'apple-touch-icon · the manifest · favicon.ico + favicon-96 (a host asking by name)'],
  ['og', (id, f) => f === 'og.png' || f === 'og.svg', 'the share card, 1200 × 630', 'og:image · twitter:image'],
]
export const ROLE_NOTES = ROLES.map(([role, , what, readBy]) => ({ role, what, readBy }))

export const roleOf = (id, file) => ROLES.find(([, test]) => test(id, file))?.[0] ?? 'other'

/* every identity, with its files by role — sorted so the brand's own come first, then the apps A→Z */
const FIRST = ['kolkrabbi', 'kol-ds']
export const IDENTITIES = Object.values(byId)
  .map((x) => {
    const by = {}
    for (const f of Object.values(x.files)) {
      const role = roleOf(x.id, f.file)
      ;(by[role] ||= []).push(f)
    }
    for (const list of Object.values(by)) list.sort((a, b) => a.file.localeCompare(b.file))
    const one = (role) => by[role]?.[0] ?? null
    return {
      id: x.id,
      name: NAMES[x.id] ?? x.id,
      files: Object.values(x.files).sort((a, b) => a.file.localeCompare(b.file)),
      by,
      icon: one('icon'), logomark: one('logomark'), wordmark: one('wordmark'), lockupH: one('lockup-h'), lockupV: one('lockup-v'),
      favicon: one('favicon'), appIcon: one('app-icon'), appIconLight: one('app-icon-light'), alts: by.alt ?? [], pngs: by.png ?? [],
      og: x.files['og.png'] ?? null, ogSvg: x.files['og.svg'] ?? null,
      png: (file) => x.files[file] ?? null,
    }
  })
  .sort((a, b) => (FIRST.indexOf(a.id) + 1 || 99) - (FIRST.indexOf(b.id) + 1 || 99) || a.id.localeCompare(b.id))

export const identity = (id) => IDENTITIES.find((x) => x.id === id) ?? null

