/* kol-icon-set-identity (2026-10-28, 0.49.0) — the marks: the brand's own and each app's; its own set because a mark
 * is not app chrome. ONE FOLDER PER IDENTITY (0.50.0): `<id>/<id>.svg` is the icon — the file named like its folder,
 * on the keyline — and the ONLY file this map takes. Everything else in the folder (`<id>-logomark` · `-wordmark` ·
 * `-lockup-h` · `-lockup-v` · `-favicon` · `-app-icon`, the rendered PNGs) is an asset read by path through the
 * `./identity/*` export, never squashed into a 24 box. Its own chunk (1.5): fetched only when an identity name renders. */
const mods = import.meta.glob('../kol-icon-set-identity/*/*.svg', { eager: true, query: '?raw', import: 'default' })
const c = {}
for (const [path, svg] of Object.entries(mods)) {
  const parts = path.split('/')
  const name = (parts.pop() || '').replace('.svg', '')
  if (name === parts.pop()) c[name] = svg
}
export default c
