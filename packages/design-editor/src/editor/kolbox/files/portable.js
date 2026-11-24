import { inlineMedia, safeName } from '../editor/export/render.js'

/* ONE PORTABLE FILE (plan-2026-11-19-kolbox-whats-left C8, W30.3): the document as one `.kol.json` that opens anywhere
 * KOL runs. It is the engine's own settings envelope (useComposeFile onSaveSettings: `page`, `version`, `spec`), so the
 * engine's "Load from file" reads it too, with the media inside it as data (a photo's blob or library address does not
 * travel). What a saved file keeps (Save as's checks) is applied by `keep` below, for the library and for this file alike. */
const PAGE = 'kol-design-editor'
const VERSION = 1
export const EXT = '.kol.json'

/* VIDEO CLIPS (W11.4) travel as data like photos. A portable file takes any clip; the library is this browser's
   storage, a few MB for every file together, so a clip over LIBRARY_CLIP_BYTES keeps its address there (a library
   clip opens; a dropped clip's address lasts the session) instead of making every later save fail */
export const LIBRARY_CLIP_BYTES = 1.5e6

/* a spec with what it keeps: media as data (clips up to `clips` bytes), the theme (its palette) or none */
export async function keep(spec, { media = true, theme = true } = {}, clips = LIBRARY_CLIP_BYTES) {
  const out = { ...spec }
  if (media) out.layers = await inlineMedia(spec.layers ?? [], { clips })
  if (!theme) out.palette = null
  return out
}

/* spec → the file's Blob and name */
export async function portableFile(spec, name) {
  const env = { page: PAGE, version: VERSION, spec: await keep(spec, { media: true, theme: true }, Infinity) }
  return { blob: new Blob([JSON.stringify(env, null, 2)], { type: 'application/json' }), name: `${safeName(name)}${EXT}` }
}

/* a picked File → its spec, or a thrown Error that says what is wrong (the engine's messages) */
export async function readPortable(file) {
  let env
  try { env = JSON.parse(await file.text()) } catch { throw new Error('Not a JSON file') }
  if (!env || env.page !== PAGE) throw new Error('Not a KOL file')
  if (env.version !== VERSION) throw new Error(`Unsupported file version (${env.version})`)
  if (!env.spec || typeof env.spec !== 'object' || !Array.isArray(env.spec.layers)) throw new Error('No document in file')
  return { ...env.spec, name: env.spec.name || file.name.replace(/\.kol\.json$|\.json$/i, '') }
}

/* the browser's file picker, for one portable file; resolves the File or null */
export const pickPortable = () => new Promise((resolve) => {
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = `${EXT},.json,application/json`
  input.onchange = () => resolve(input.files?.[0] ?? null)
  input.addEventListener('cancel', () => resolve(null))
  input.click()
})
