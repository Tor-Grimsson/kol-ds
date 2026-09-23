/* Media classification — kol-r2b2's `lib/media.js` kinds, promoted 2026-08-27
 * (SettingsPanelChromeAndColumnPreview) so ColumnBrowser and KindPreview
 * classify the same way the app does. contentType is unreliable for text /
 * code (B2 hands back application/octet-stream), so the extension decides. */

const EXT_KINDS = {
  /* markdown · json · yaml are their own kinds (user ruling 2026-08-27 — "I want
   * md always to show, make it unique"); text is the rest */
  md: 'markdown', json: 'json', yaml: 'yaml', yml: 'yaml',
  txt: 'text', csv: 'text', tsv: 'text', pgn: 'text', xml: 'text', svg: 'image',
  js: 'code', mjs: 'code', cjs: 'code', ts: 'code', jsx: 'code', tsx: 'code',
  css: 'code', html: 'code', sh: 'code', py: 'code',
  m3u8: 'playlist',
  /* A PDF IS ITS OWN KIND (user 2026-09-23: *"File I guess is pdf? weird name"*). It fell through
   * to `other`, so the one document type with a real page-one preview was labelled "File". */
  pdf: 'pdf',
  woff: 'font', woff2: 'font', ttf: 'font', otf: 'font',
  zip: 'archive', gz: 'archive', tar: 'archive', rar: 'archive', '7z': 'archive',
}

export function extOf(key = '') {
  const base = key.slice(key.lastIndexOf('/') + 1)
  const dot = base.lastIndexOf('.')
  return dot === -1 ? '' : base.slice(dot + 1).toLowerCase()
}

const SYSTEM_NAMES = new Set(['.ds_store', 'thumbs.db', 'desktop.ini', '.bzempty'])
export function isSystemFile(key = '') {
  return SYSTEM_NAMES.has(key.slice(key.lastIndexOf('/') + 1).toLowerCase())
}

export function kindOf(o) {
  if (o.forcedKind) return o.forcedKind
  if (isSystemFile(o.key)) return 'system'
  const ct = o.contentType || ''
  if (ct.startsWith('image/')) return 'image'
  if (ct.startsWith('video/')) return 'video'
  if (ct.startsWith('audio/')) return 'audio'
  const ext = extOf(o.key)
  if (EXT_KINDS[ext]) return EXT_KINDS[ext]
  if (ct === 'text/markdown') return 'markdown'
  if (ct === 'application/json') return 'json'
  if (ct.startsWith('text/')) return 'text'
  if (ct.startsWith('font/')) return 'font'
  return 'other'
}

export const KINDS = ['audio', 'video', 'image', 'pdf', 'markdown', 'json', 'yaml', 'text', 'code', 'playlist', 'font', 'archive', 'other']

/* A LABEL IS CAPITALISED, AN ACRONYM IS AN ACRONYM (user 2026-09-22). These read as values in a
 * facts table ("Kind · Markdown") and beside them sit the MIME type and the filename, which are
 * DATA and stay exactly as stored. The filter chips are unaffected — `.kol-tag` uppercases. */
export const KIND_LABEL = {
  image: 'Image', video: 'Video', audio: 'Audio', pdf: 'PDF', markdown: 'Markdown', json: 'JSON', yaml: 'YAML', text: 'Text', code: 'Code',
  playlist: 'HLS', font: 'Font', archive: 'Archive', segments: 'HLS segments',
  system: 'System', other: 'File',
}

/* The chips a bucket always shows (user ruling 2026-08-27): media, then the text
 * kinds, then code. Every other kind appears only when the bucket has some. */
export const DEFAULT_KINDS = ['audio', 'video', 'image', 'markdown', 'json', 'yaml', 'text', 'code']

/* ── The rest of kol-r2b2's lib/media.js, promoted verbatim 2026-08-27
 * (MediaLibraryPages) — segments, poster pairing, variant grouping, partition. */

const SEGMENT_RE = /^segment_\d+\.ts$/i
export function isSegment(key) {
  return SEGMENT_RE.test(key.slice(key.lastIndexOf('/') + 1))
}

/** Fold each folder's segment_*.ts files into one synthetic entry carrying the
 *  set's file count and total bytes — one row saying "231 segments, 340 MB". */
export function groupSegments(files) {
  const bins = new Map()
  const out = []
  for (const f of files) {
    if (!isSegment(f.key)) { out.push(f); continue }
    const dir = f.displayKey.includes('/') ? f.displayKey.slice(0, f.displayKey.lastIndexOf('/') + 1) : ''
    const list = bins.get(dir) || []
    list.push(f)
    bins.set(dir, list)
  }
  for (const [dir, list] of bins) {
    if (list.length === 1) { out.push(list[0]); continue }
    const bytes = list.reduce((n, f) => n + (f.size || 0), 0)
    out.push({ ...list[0], displayKey: `${dir}segment_*.ts`, segmentCount: list.length, totalSize: bytes, size: bytes, contentType: null, forcedKind: 'segments' })
  }
  return out
}

/** The sibling <name>.png beside a video — the poster, so preload="none" stays honest. */
export function posterFor(videoKey, keySet) {
  const stem = videoKey.slice(0, videoKey.lastIndexOf('.'))
  for (const ext of ['png', 'jpg', 'jpeg', 'webp']) {
    const candidate = `${stem}.${ext}`
    if (keySet.has(candidate)) return candidate
  }
  return null
}

const VARIANT_RE = /^(.*)-(\d{2,5})$/
const MIN_VARIANT_WIDTH = 100
function splitVariant(displayKey) {
  const dot = displayKey.lastIndexOf('.')
  if (dot === -1) return null
  const stem = displayKey.slice(0, dot)
  const ext = displayKey.slice(dot)
  const m = VARIANT_RE.exec(stem)
  if (!m) return null
  const width = Number(m[2])
  if (width < MIN_VARIANT_WIDTH) return null
  return { base: m[1] + ext, width }
}

/** Collapse resolution sets (name-566 / -1132 / -1700 / -2840) into one entry —
 *  the SMALLEST variant, carrying `variants` (ascending) and `totalSize`. */
export function groupVariants(files) {
  const groups = new Map()
  const out = []
  for (const f of files) {
    const v = kindOf(f) === 'image' ? splitVariant(f.displayKey) : null
    if (!v) { out.push(f); continue }
    const list = groups.get(v.base) || []
    list.push({ ...f, width: v.width })
    groups.set(v.base, list)
  }
  for (const [base, list] of groups) {
    if (list.length < 2) { out.push(list[0]); continue }
    list.sort((a, b) => a.width - b.width)
    out.push({ ...list[0], displayKey: base, variants: list, totalSize: list.reduce((n, f) => n + (f.size || 0), 0) })
  }
  return out
}

/** Split a flat key list into { folders, files } relative to `prefix`. */
export function partition(objects, prefix) {
  const folderSet = new Set()
  const files = []
  for (const o of objects) {
    const rel = prefix ? o.key.slice(prefix.length) : o.key
    const slash = rel.indexOf('/')
    if (slash !== -1) folderSet.add(rel.slice(0, slash + 1))
    else files.push({ ...o, displayKey: rel })
  }
  return { folders: [...folderSet].sort(), files }
}
