import { useEffect, useRef } from 'react'
import { useGeneratorLibrary, STARTERS, shippedFiles, buildLayersSvg, warmTextFonts, PRESET_SIZES, POOLS, pack } from './engine.js'

/* SAMPLE FILES for Home (his words: "populate home with fake files so we see the function"). When the library holds no
   files of its own, Home writes these once through the library's own add path (`addItem('preset', …)`, as Create and
   Save do), so each is a real file: it opens in the editor with its layers, lists in the Files window, renames, sorts,
   filters and searches like any other. Their content is the engine's own material: the File menu's starters, the
   shipped Labs and Morph files (built from the generator presets) and a shape composition from the editor's own shape
   kinds. Each gets its thumb by the engine's own path (useComposeFile `captureThumb`).

   ONCE: the flag `kol.editor.library.samples.v1` (beside the library's own `kol.editor.library.shipped.v1`) is set the
   moment the seed runs, or found already set, or set without seeding when the library already has a file of the user's;
   so a reload, a second tab or an emptied library never seeds again, and nothing the user has is touched.

   Dates: `addItem` stamps every file now; the spread of created and modified times below is written straight after,
   through the provider's own `replaceAll`, on those ids only, so the two sorts differ and "Edited …" reads apart. */
const FLAG = 'kol.editor.library.samples.v1'
const THUMB_PX = 240 /* useComposeFile's */
const H = 36e5, D = 864e5

const flagged = () => { try { return localStorage.getItem(FLAG) != null } catch { return true } }
const flag = () => { try { localStorage.setItem(FLAG, String(Date.now())) } catch { /* storage blocked: nothing seeds either */ } }

/* the brand pool's six, as the editor's palette names them (compose/state's `palette`) */
function brandPalette() {
  const colors = POOLS.find((p) => p.id === 'brand')?.defaults ?? []
  return { poolId: 'brand', modeId: 'random', colors }
}
const named = ({ colors }) => ({ primary: colors[0], secondary: colors[1], light: colors[2], dark: colors[3], accent: colors[4], bg: colors[5] })

/* the engine's thumbnail path: warm the text fonts, build the export SVG, rasterise it at 240 on the long side */
async function thumbOf(spec) {
  try {
    const size = PRESET_SIZES[spec.aspect] ?? PRESET_SIZES['1:1']
    const args = { layers: spec.layers, palette: named(spec.palette), aspect: spec.aspect, canvasW: size.w, canvasH: size.h }
    await warmTextFonts(args.layers)
    const k = THUMB_PX / Math.max(size.w, size.h)
    const c = document.createElement('canvas')
    c.width = Math.round(size.w * k); c.height = Math.round(size.h * k)
    const url = URL.createObjectURL(new Blob([buildLayersSvg(args)], { type: 'image/svg+xml' }))
    try {
      const img = new Image()
      await new Promise((ok, no) => { img.onload = ok; img.onerror = no; img.src = url })
      c.getContext('2d').drawImage(img, 0, 0, c.width, c.height)
    } finally { URL.revokeObjectURL(url) }
    return c.toDataURL('image/webp', 0.8)
  } catch { return null }
}

const layer = (type, fields) => ({ visible: true, opacity: 1, blend: 'normal', type, ...fields })
/* a loop the export can draw without a mounted canvas (a GL engine loop is snapshotted live, so it is left out) */
const drawable = (f) => f.layers.every((l) => l.type !== 'loop' || pack('generators')?.loopById(l.loopId)?.kind !== 'engine')
const copy = (f) => JSON.parse(JSON.stringify(f.layers))

/* name, where the content comes from, created (days ago), modified (hours ago) */
function sources() {
  const shipped = shippedFiles()
  const starter = (id) => STARTERS.find((s) => s.id === id)?.preset
  const ship = (test) => shipped.find((f) => test(f) && drawable(f))
  const labs = (sub) => ship((f) => f.mode === 'labs' && f.sub === sub)
  const morphs = shipped.filter((f) => f.mode === 'morph' && drawable(f))
  const out = [
    ['Poster draft', 'editor', starter('social-portrait'), 34, 2],
    ['Flow study', 'labs', labs('Flow'), 12, 5],
    ['Type specimen', 'editor', shipped.find((f) => f.id === 'ship:editor:type-statement'), 27, 26],
    ['Pattern tile', 'editor', starter('compositor'), 40, 50],
    ['Morph study', 'morph', morphs[0], 9, 72],
    ['Launch card', 'editor', starter('social-square'), 21, 96],
    ['Penrose tiling', 'labs', labs('Penrose'), 30, 130],
    ['Shape study', 'editor', 'shapes', 8, 150],
    ['Story frame', 'editor', starter('social-story'), 18, 200],
    ['Curve study', 'labs', labs('Math'), 25, 260],
    ['Leaf form', 'editor', shipped.find((f) => f.id === 'ship:editor:vector-leaf'), 15, 330],
    ['Scanline study', 'labs', labs('Scanline'), 38, 410],
    ['Morph loop', 'morph', morphs[Math.floor(morphs.length / 2)], 33, 520],
    ['Header lockup', 'editor', starter('hero-lockup'), 42, 700],
  ]
  return out.filter(([, , src]) => src)
}

/* a few shapes in the editor's own kinds on the brand ground */
const SHAPES = [
  layer('background', { color: 'palette:light' }),
  layer('shape', { kind: 'rect', x: 140, y: 140, w: 420, h: 420, radius: 24, color: 'palette:primary' }),
  layer('shape', { kind: 'ellipse', x: 480, y: 360, w: 460, h: 460, color: 'palette:secondary' }),
  layer('shape', { kind: 'triangle', x: 200, y: 600, w: 320, h: 300, color: 'palette:dark' }),
]

async function build() {
  const palette = brandPalette()
  const now = Date.now()
  const files = []
  for (const [name, mode, src, createdDays, modifiedHours] of sources()) {
    const spec = src === 'shapes'
      ? { intent: 'whole', aspect: '1:1', layers: SHAPES }
      : { intent: src.intent ?? 'whole', aspect: src.aspect ?? '1:1', layers: copy(src), ...(src.morph ? { morph: JSON.parse(JSON.stringify(src.morph)) } : {}) }
    const full = { ...spec, mode, name, palette }
    const thumb = await thumbOf(full)
    files.push({ spec: { ...full, ...(thumb ? { thumb } : {}) }, dates: { savedAt: now - createdDays * D, updatedAt: now - modifiedHours * H } })
  }
  return files
}

/* Home's hook: seeds once, then writes the dates once the library holds the new ids */
export function useSampleFiles() {
  const { library, addItem, replaceAll } = useGeneratorLibrary()
  const pending = useRef(null)
  const libRef = useRef(library)
  libRef.current = library

  useEffect(() => {
    if (flagged()) return undefined
    if ((libRef.current.preset ?? []).some((p) => !p.shipped)) { flag(); return undefined }
    let alive = true
    build().then((files) => {
      /* StrictMode's first mount is gone by now; the flag is checked again for a second tab that got there first */
      if (!alive || flagged() || (libRef.current.preset ?? []).some((p) => !p.shipped)) return
      flag()
      const dates = new Map()
      for (const f of files) { const id = addItem('preset', f.spec); if (id) dates.set(id, f.dates) }
      pending.current = dates
    })
    return () => { alive = false }
  }, [addItem])

  useEffect(() => {
    const dates = pending.current
    const preset = library.preset ?? []
    if (!dates || ![...dates.keys()].every((id) => preset.some((p) => p.id === id))) return
    pending.current = null
    replaceAll({ ...library, preset: preset.map((p) => (dates.has(p.id) ? { ...p, ...dates.get(p.id) } : p)) })
  }, [library, replaceAll])
}
