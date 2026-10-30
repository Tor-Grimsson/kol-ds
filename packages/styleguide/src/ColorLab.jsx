import { useEffect, useRef, useState } from 'react'
import { Button, ColorPickerPopover, Dropdown, Icon, IconFrame, PaletteHarmonyWheel, SettingsSections, Slider, Tooltip, hexToHsl, hslToHex } from '@kolkrabbi/kol-component'
import { COLOR_RELATIONS, CVD_TYPES, DEFAULT_COLOR_LAB, colorLab, colorLabCss, contrastGrade, contrastRatio, hexToOklch, inkOn, midColor, oklchToHex, paletteFromPixels, rollColorLab, simulateCvd, tintLadder } from './colorLab.js'
import LabWindow, { CopyAction, LabHistory, useLabValue } from './lab/LabWindow.jsx'

/* taxonomy-ok: organism — the colour generator in the lab window: sources and harmonies in the rail, the colours on the stage, the two accessibility views */

/**
 * ColorLab — A brand's colour, generated from one base colour. kol-fxr's engine (`colorLab.js`): colour 1 is the base,
 * every colour given its job by how it looks — the darkest the Background, the lightest the Ink, the most saturated the
 * Accent.
 *
 * Adobe Color's anatomy, the user's reference (BrandLabToolWindow reviews 1–3, plan-2026-10-29-lab-window-review-1):
 *   header   three views — Create palette · Contrast checker · Color blindness simulator — then undo · redo
 *   palette  rail: Base (the picker, its modes HEX · RGB · HSB · Lab, the base's lock) · Image (Adobe's drop zone, then
 *            `samples` — images from the bucket, each with its palette — and the `library` link) · Wheel (the wheel, the
 *            harmony tiles under it — the DS's `clr-*` glyphs, the mode named; review 6: on the Wheel tab only). Stage:
 *            the colours as columns — lock · edit tint (seven steps) · drag · delete, the hex opening Edit color, copy, a +
 *            on every seam — then the palette small, Generate random and Copy CSS. 2 to 8 colours, added and removed on
 *            the swatches; a hand edit makes the harmony Custom.
 *   contrast the same window (review 6 — *"why is it totally different from color lab?"*): the rail's tabs Summary ·
 *            Suggestions · Set a ratio (Adobe's three, short enough for the rail) over the pair (foreground and background from the palette, each
 *            with its lightness, swap between them, the ratio above); the stage Adobe's preview — the image beside the pair
 *            as a page — and the palette small under it
 *   vision   the rail names the conflicts and plots the palette on the wheel; the stage the palette, then a row per colour
 *            vision, a warning where two colours become too close to tell apart; the palette small under it
 *   output   the palette as a table and CSS. Color Lab owns the palette; Combo Lab combines it.
 *
 * @param {Object}   value     `{ base, relation, count, seed, colors, locked }` — controlled; omit for internal
 * @param {Function} onChange  `(next) => void`
 * @param {Array}    [samples] `[{ src, label }]` — images to try (the Image tab's "Try one of ours"); `src` must be
 *                             same-origin or CORS-clean, since the pixels are read (kol-media-client's `proxied(url)`)
 * @param {Object}   [library] `{ label, href }` — where the samples live, linked beside them ("Media: R2B2")
 * @param {string}   className classes on the root
 */
const hexToOklchL = (hex) => hexToOklch(hex)[0]
const isHex = (hex) => /^#[0-9a-f]{6}$/i.test(hex)
const ratioText = (r) => (Math.floor(r * 100) / 100).toFixed(2)
const rgb = (hex) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16)).join(' ')

/* THE HARMONIES AS THE DS DRAWS THEM (review 3 — *"I know we have some icons for this in DS"*): kol-icons' signal set,
 * `color` group. `clr-split`, `clr-tet` and `clr-rnd` were drawn 2026-10-29 in the same style, for his review */
const HARMONY_ICON = { analogous: 'clr-anl', monochromatic: 'clr-mono', complementary: 'clr-comp', split: 'clr-split', triadic: 'clr-tri', tetradic: 'clr-tet', compound: 'clr-cmpd', shades: 'clr-shd', custom: 'clr-rnd' }
/* Adobe's order (review 5): custom first, then by how far the hues reach */
const HARMONY_TILES = ['custom', 'analogous', 'monochromatic', 'shades', 'complementary', 'split', 'triadic', 'tetradic', 'compound']
/* the relations the wheel can draw (kol-component HARMONIES) */
const WHEEL_HARMONIES = ['analogous', 'complementary', 'split', 'triadic', 'tetradic']
const harmonyLabel = (id) => (id === 'custom' ? 'Custom' : COLOR_RELATIONS.find((r) => r.id === id)?.label ?? id)

/* a glyph on a column, in the column's ink: kol-component's IconFrame — a click, no button chrome (ref 1) */
const Glyph = ({ icon, label, ink, ...props }) => (
  <Tooltip label={label}><IconFrame name={icon} variant="ghost" size="sm" aria-label={label} style={{ color: ink, background: 'transparent' }} {...props} /></Tooltip>
)

/* the + on a seam: a hover zone on the column's edge, the round control centred on the seam */
const AddSeam = ({ side, label, onClick }) => (
  <span className="group/seam absolute inset-y-0 z-[1] flex w-6 items-center justify-center" style={{ [side]: -13 }}>
    <span className="opacity-0 transition-opacity group-hover/seam:opacity-100 focus-within:opacity-100">
      <Tooltip label={label}><IconFrame name="plus" variant="secondary" radius="full" size="sm" aria-label={label} onClick={onClick} /></Tooltip>
    </span>
  </span>
)

/* the palette's outer corners take the system's 4px (review 3 — *"4px rounding is missing"*) */
const corners = (i, n) => ({ ...(i === 0 ? { borderTopLeftRadius: 4, borderBottomLeftRadius: 4 } : null), ...(i === n - 1 ? { borderTopRightRadius: 4, borderBottomRightRadius: 4 } : null) })

/* ONE COLUMN, ADOBE'S (review 1): the colour edge to edge; top right lock · edit tint · drag · delete; bottom left the hex,
 * which is the "Edit color" button, and copy at the bottom right */
function Column({ s, n, inks, tint, onTint, onLock, onEdit, onCopy, onDelete, canDelete, drag, add }) {
  const ink = inkOn(s.hex, inks).ink
  if (tint) {
    /* EDIT TINT (review 2 — *"tints are 7, and overlay shows info"*): seven steps, the colour 4th and outlined */
    return (
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden" style={corners(s.index, n)}>
        {tintLadder(s.hex).map((hex, i) => (
          <Tooltip key={`${hex}${i}`} label={`${s.roleLabel}, ${i + 1} of 7, ${hex}`}>
            <button type="button" aria-label={`${s.roleLabel}, ${i + 1} of 7, ${hex}`} onClick={() => onTint(hex)} className="flex-1 cursor-pointer border-0"
              style={{ background: hex, boxShadow: i === 3 ? `inset 0 0 0 2px ${inkOn(hex, inks).ink}, inset 0 0 0 4px ${hex}` : undefined }} />
          </Tooltip>
        ))}
      </div>
    )
  }
  return (
    /* DRAG SHOWS ITSELF (review 2): the dragged column dims; the one under the pointer shows a bar on the side the colour
     * lands; the dropped column is ringed for a moment */
    <div {...drag.target} className={`group relative flex min-w-0 flex-1 flex-col justify-end p-3 transition-opacity ${drag.source ? 'opacity-40' : ''}`}
      style={{ background: s.hex, color: ink, boxShadow: drag.landed ? `inset 0 0 0 2px ${ink}` : undefined, ...corners(s.index, n) }}>
      {drag.side && <span aria-hidden="true" className="absolute inset-y-0 w-0.5" style={{ [drag.side]: -2, background: 'var(--kol-fg-96)' }} />}
      {add.left && <AddSeam side="left" label="Add color left" onClick={add.left} />}
      {add.right && <AddSeam side="right" label="Add color right" onClick={add.right} />}
      <div className={`absolute right-2 top-2 flex flex-col gap-1 transition-opacity ${s.locked ? '' : 'opacity-0 group-hover:opacity-100 focus-within:opacity-100'}`}>
        <Glyph ink={ink} icon={s.locked ? 'lock' : 'unlock'} label={s.locked ? 'Unlock color' : 'Lock color'} onClick={onLock} />
        <span className={s.locked ? 'opacity-0 group-hover:opacity-100 focus-within:opacity-100 flex flex-col gap-1' : 'flex flex-col gap-1'}>
          <Glyph ink={ink} icon="drop" label="Edit tint" onClick={() => onTint(null)} />
          <Glyph ink={ink} icon="drag-handle" label="Drag to reorder" {...drag.handle} />
          {canDelete && <Glyph ink={ink} icon="trash" label="Delete" onClick={onDelete} />}
        </span>
      </div>
      <div className="flex items-center justify-between gap-2">
        <Tooltip label="Edit color">
          <ColorPickerPopover color={s.hex} label="Edit color" title="Edit color" modes placement="top-start" alpha={false}
            className="kol-lab-hex"
            trigger={<span className="kol-mono-12 px-2 py-1">{s.hex}</span>}
            onChange={(hex) => isHex(hex.slice(0, 7)) && onEdit(hex.slice(0, 7).toUpperCase())} />
        </Tooltip>
        <Glyph ink={ink} icon="copy" label="Copy hex" onClick={onCopy} />
      </div>
    </div>
  )
}

/* the wheel takes the rail's width and follows it as the rail is dragged (review 2) */
function WheelFill({ children }) {
  const ref = useRef(null)
  const [w, setW] = useState(248)
  useEffect(() => {
    const el = ref.current
    if (!el) return undefined
    const ro = new ResizeObserver(([e]) => setW(Math.max(160, Math.floor(e.contentRect.width))))
    ro.observe(el)
    return () => ro.disconnect()
  }, [])
  return <div ref={ref} className="w-full">{children(w)}</div>
}

/* an image's palette, read off a canvas at 200px (k-means in OKLab, `paletteFromPixels`) — a sample tile's strip, or the
 * palette itself when an image is chosen */
const extractPalette = (src, k) => new Promise((resolve) => {
  const img = new Image()
  img.onload = () => {
    const f = Math.min(1, 200 / Math.max(img.width, img.height))
    const cv = document.createElement('canvas')
    cv.width = Math.max(1, Math.round(img.width * f)); cv.height = Math.max(1, Math.round(img.height * f))
    const ctx = cv.getContext('2d')
    ctx.drawImage(img, 0, 0, cv.width, cv.height)
    try { resolve(paletteFromPixels(ctx.getImageData(0, 0, cv.width, cv.height).data, k)) } catch { resolve([]) }
  }
  img.onerror = () => resolve([])
  img.src = src
})

/* ADOBE'S SAMPLE TILE (review 6, ref 54): the image, its palette as a strip under it; a click makes it the image */
function SampleTile({ src, label, onPick }) {
  const [strip, setStrip] = useState([])
  useEffect(() => { let on = true; extractPalette(src, 4).then((cs) => { if (on) setStrip(cs) }); return () => { on = false } }, [src])
  return (
    <Tooltip label={label}>
      <button type="button" onClick={onPick} aria-label={`Try ${label}`} className="flex w-full cursor-pointer flex-col overflow-hidden rounded">
        <img src={src} alt="" className="aspect-square w-full object-cover" />
        <span className="flex h-3 w-full">{strip.map((hex, i) => <span key={i} className="flex-1" style={{ background: hex }} />)}</span>
      </button>
    </Tooltip>
  )
}

/* THE PALETTE ON THE WHEEL (review 6, Adobe's ref 59): each colour a dot at its hue (clockwise from the top) and
 * saturation (the radius) on the hue disc — a plot, not a picker */
function PaletteDots({ colors }) {
  return (
    <div aria-hidden="true" className="relative mx-auto aspect-square w-full max-w-[280px] rounded-full"
      style={{ background: 'radial-gradient(circle, #fff 0%, rgba(255,255,255,0) 70%), conic-gradient(#f00, #ff0, #0f0, #0ff, #00f, #f0f, #f00)' }}>
      {colors.map((hex, i) => {
        const { h: hue, s: sat } = hexToHsl(hex)
        const r = (sat / 100) * 46, a = (hue * Math.PI) / 180
        return <span key={i} className="absolute size-5 -translate-x-1/2 -translate-y-1/2 rounded-full" style={{ left: `${50 + r * Math.sin(a)}%`, top: `${50 - r * Math.cos(a)}%`, background: hex, boxShadow: '0 0 0 2px #fff, 0 1px 3px rgba(0,0,0,.35)' }} />
      })}
    </div>
  )
}

/* a pass or a fail, as a grade the Summary reads */
const Verdict = ({ ok, na }) => (na
  ? <span className="kol-mono-12 text-meta">N/A</span>
  : <span className={`inline-flex items-center gap-1 kol-mono-12 ${ok ? 'text-emphasis' : 'text-meta'}`}><Icon name={ok ? 'check' : 'x'} size={12} className={ok ? 'text-oq-96' : 'text-oq-48'} />{ok ? 'Pass' : 'Fail'}</span>)

/* two simulated colours too close to tell apart: OKLab distance under the threshold (≈ a just-noticeable step, doubled) */
const CONFLICT = 0.06
const oklab = (hex) => { const [L, C, h] = hexToOklch(hex); return [L, C * Math.cos((h * Math.PI) / 180), C * Math.sin((h * Math.PI) / 180)] }
const close = (a, b) => { const p = oklab(a), q = oklab(b); return Math.hypot(p[0] - q[0], p[1] - q[1], p[2] - q[2]) < CONFLICT }

/* the foreground over the background at an opacity, so the ladder measures what the eye sees */
const over = (fg, bg, a) => {
  const p = [1, 3, 5].map((i) => parseInt(fg.slice(i, i + 2), 16)), q = [1, 3, 5].map((i) => parseInt(bg.slice(i, i + 2), 16))
  return '#' + p.map((v, i) => Math.round(v * a + q[i] * (1 - a)).toString(16).padStart(2, '0')).join('')
}

export default function ColorLab({ value: valueProp, onChange, samples = [], library, className = '' }) {
  const h = useLabValue(valueProp, onChange, DEFAULT_COLOR_LAB)
  const { value, set } = h
  const c = colorLab(value)
  const [tinting, setTinting] = useState(null)
  const inks = { dark: c.roles.bg, light: c.roles.fg }
  const css = colorLabCss(value)
  const [view, setView] = useState('palette')
  const [tab, setTab] = useState('base')

  /* a change to the inputs regenerates the unlocked colours from the same seed; locked ones keep their place */
  const regenerate = (patch) => set((v) => rollColorLab({ ...v, ...patch, colors: c.colors }, v.seed))
  /* A HAND EDIT MAKES THE HARMONY CUSTOM (review 3, Adobe's "Color harmonies: Custom") */
  const setColors = (colors, locked = value.locked) => set({ colors, count: colors.length, locked, relation: 'custom' })
  const editAt = (i, hex) => { const colors = c.colors.map((x, j) => (j === i ? hex : x)); set({ colors, count: colors.length, relation: 'custom', ...(i === 0 ? { base: hex } : {}) }) }
  /* insert at `at` the colour between its neighbours (at an end, between the end colour and white or black) */
  const insert = (at) => {
    if (c.colors.length >= 8) return
    const prev = c.colors[at - 1], next = c.colors[at]
    const hex = midColor(prev ?? (next && hexToOklchL(next) < 0.5 ? '#FFFFFF' : '#000000'), next ?? (hexToOklchL(prev) < 0.5 ? '#FFFFFF' : '#000000'))
    setColors([...c.colors.slice(0, at), hex, ...c.colors.slice(at)], value.locked.map((j) => (j >= at ? j + 1 : j)))
  }
  const remove = (i) => setColors(c.colors.filter((_, j) => j !== i), value.locked.filter((j) => j !== i).map((j) => (j > i ? j - 1 : j)))
  const toggleLock = (i) => set({ colors: c.colors, locked: value.locked.includes(i) ? value.locked.filter((j) => j !== i) : [...value.locked, i] })
  /* Generate random rolls the chosen harmony; a Custom palette rolls freely and stays Custom */
  const roll = () => set((v) => ({ ...rollColorLab({ ...v, colors: c.colors, relation: v.relation === 'custom' ? 'random' : v.relation }), relation: v.relation }))
  const base = hexToHsl(c.colors[0])

  /* REORDER (the ⋮⋮): the first column is colour 1, the base, wherever the colours land; the locks travel with them */
  const [dragFrom, setDragFrom] = useState(null)
  const [dragOver, setDragOver] = useState(null)
  const [landed, setLanded] = useState(null)
  useEffect(() => { if (landed === null) return undefined; const t = setTimeout(() => setLanded(null), 900); return () => clearTimeout(t) }, [landed])
  const move = (from, to) => {
    if (to < 0 || to >= c.colors.length || to === from) return
    const order = c.colors.map((_, i) => i)
    order.splice(to, 0, order.splice(from, 1)[0])
    const colors = order.map((i) => c.colors[i])
    set({ colors, base: colors[0], relation: 'custom', locked: order.map((i, j) => (value.locked.includes(i) ? j : -1)).filter((j) => j >= 0) })
    setLanded(to)
  }
  const dragFor = (i) => ({
    source: dragFrom === i,
    side: dragOver === i && dragFrom !== null && dragFrom !== i ? (dragFrom > i ? 'left' : 'right') : null,
    landed: landed === i,
    target: {
      onDragOver: (e) => { if (dragFrom === null) return; e.preventDefault(); if (dragOver !== i) setDragOver(i) },
      onDrop: (e) => { e.preventDefault(); if (dragFrom !== null) move(dragFrom, i); setDragFrom(null); setDragOver(null) },
    },
    handle: {
      role: 'button', tabIndex: 0, draggable: true, className: 'cursor-grab active:cursor-grabbing',
      onDragStart: (e) => { e.dataTransfer.effectAllowed = 'move'; setDragFrom(i) },
      onDragEnd: () => { setDragFrom(null); setDragOver(null) },
      onKeyDown: (e) => { if (e.key === 'ArrowLeft') { e.preventDefault(); move(i, i - 1) } if (e.key === 'ArrowRight') { e.preventDefault(); move(i, i + 1) } },
    },
  })

  /* THE IMAGE SOURCE: an upload, a drop or a sample; its palette read off a canvas to the current number of colours */
  const [image, setImage] = useState(null)
  const fileInput = useRef(null)
  const [dropping, setDropping] = useState(false)
  const takeImage = async (src) => {
    const colors = await extractPalette(src, c.colors.length)
    if (colors.length >= 2) set({ colors, count: colors.length, base: colors[0], locked: [], relation: 'custom' })
    setImage(src)
  }
  const fromFile = (file) => {
    if (!file || !/^image\/(jpeg|png|webp)$/.test(file.type) || file.size > 40 * 1024 * 1024) return
    takeImage(URL.createObjectURL(file))
  }

  /* ── the palette view ── */
  const harmony = (
    /* HARMONIES (review 3): the DS's glyphs, each named on hover, the mode named in the label — on the Wheel tab only
     * (review 6 — *"you know there is a tab for wheel. why do you put it on every page?"*) */
    <div className="flex flex-col gap-3">
      {/* THE EYEBROW IS THE RAIL'S LABEL (review 8 — *"IT WAS PERFECT!!! I was saying why is it only used here"*): the
        * settings rail's section label, now on every label in the rail */}
      <p className="kol-eyebrow text-fg-80">Harmony: {harmonyLabel(c.relation)}</p>
      {/* review 5 — bigger glyphs across the rail's width, no chip, OPAQUE ink (oq, never fg), full when chosen */}
      <div className="grid w-full grid-cols-9">
        {HARMONY_TILES.map((id) => (
          <Tooltip key={id} label={harmonyLabel(id)}>
            <button type="button" aria-label={harmonyLabel(id)} aria-pressed={c.relation === id}
              className={`flex aspect-square w-full cursor-pointer items-center justify-center ${c.relation === id ? 'text-oq-96' : 'text-oq-40 hover:text-oq-72'}`}
              onClick={() => { if (id !== 'custom') regenerate({ relation: id }) }}>
              <Icon name={HARMONY_ICON[id]} size={28} />
            </button>
          </Tooltip>
        ))}
      </div>
    </div>
  )
  const sources = [
    { id: 'base', label: 'Base', icon: 'eyedrop', content: (
      <ColorPickerPopover inline modes title="Base" color={c.colors[0]} label="Base" alpha={false}
        hexEnd={<Glyph ink="currentColor" icon={value.locked.includes(0) ? 'lock' : 'unlock'} label={value.locked.includes(0) ? 'Unlock base' : 'Lock base'} onClick={() => toggleLock(0)} />}
        onChange={(hex) => isHex(hex.slice(0, 7)) && regenerate({ base: hex.slice(0, 7).toUpperCase() })} />
    ) },
    { id: 'image', label: 'Image', icon: 'image', content: (
      <div className="flex min-h-0 flex-1 flex-col gap-6">
        {/* THE DROP ZONE, ADOBE'S (review 6, refs 54 · 56 · 57): the dashed outline of the reference, the upload button
          * centred with its two lines, the whole zone a target; under the pointer or a drag it shows the checker */}
        <div
          role="button" tabIndex={0} aria-label={image ? 'Upload another image' : 'Upload your image'}
          className={`kol-lab-drop relative flex min-h-[280px] flex-1 cursor-pointer flex-col items-center justify-center gap-2 overflow-hidden rounded border border-dashed border-oq-16 p-6 text-center ${dropping ? 'is-dropping' : ''}`}
          onClick={() => fileInput.current?.click()}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); fileInput.current?.click() } }}
          onDragOver={(e) => { e.preventDefault(); setDropping(true) }}
          onDragLeave={() => setDropping(false)}
          onDrop={(e) => { e.preventDefault(); setDropping(false); fromFile(e.dataTransfer.files?.[0]) }}
        >
          {image
            ? <img src={image} alt="" className="absolute inset-0 h-full w-full object-cover" />
            : (
              <span className="relative flex flex-col items-center gap-6">
                <Button size="md" tone="inverted" iconLeft="upload" onClick={(e) => { e.stopPropagation(); fileInput.current?.click() }}>Upload your image</Button>
                <span className="flex flex-col items-center gap-1">
                  <span className="kol-mono-12 text-emphasis">Or drag and drop here</span>
                  <span className="whitespace-nowrap uppercase kol-mono-10 text-subtle">Files: JPG, PNG or WebP | Size: 40MB</span>
                </span>
              </span>
            )}
          <input ref={fileInput} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={(e) => { fromFile(e.target.files?.[0]); e.target.value = '' }} />
        </div>
        {samples.length > 0 && (
          /* "TRY ONE OF OURS" (ref 54): the samples with their palettes; the user's idea — they come from the bucket, named
           * and linked beside them */
          <div className="flex flex-col gap-3">
            <div className="flex items-baseline justify-between gap-3">
              <span className="min-w-0 truncate kol-mono-12 text-emphasis">Try one of ours:</span>
              {library && <a href={library.href} target="_blank" rel="noreferrer" className="group inline-flex shrink-0 items-center gap-1 kol-mono-12 text-meta hover:text-emphasis">{library.label}<Icon name="external-link" size={12} className="text-oq-48 group-hover:text-oq-96" /></a>}
            </div>
            <div className="grid grid-cols-4 gap-2">
              {samples.slice(0, 4).map((x) => <SampleTile key={x.src} src={x.src} label={x.label ?? x.src} onPick={() => takeImage(x.src)} />)}
            </div>
          </div>
        )}
      </div>
    ) },
    { id: 'wheel', label: 'Wheel', icon: 'color-wheel', content: (
      /* the Wheel tab's own air (the user, 2026-10-30: "MORE GAP between tabs, wheel and group"): 24 under the tabs on top of the rail's 16, 40 between the wheel and the harmony group */
      <div className="flex flex-col gap-10 pt-6">
        <WheelFill>{(size) => <PaletteHarmonyWheel size={size} hue={base.h} saturation={base.s} lightness={base.l} harmony={WHEEL_HARMONIES.includes(c.relation) ? c.relation : 'analogous'}
          onHueChange={(hue) => regenerate({ base: hslToHex(hue, base.s, base.l).toUpperCase() })} />}</WheelFill>
        {harmony}
      </div>
    ) },
  ]
  /* THE PALETTE SMALL (Adobe's) under every view's stage, Randomise at its right on the palette view (review 5 — *"under
   * the color, not siderail"*; review 6 — the views share the window) */
  const paletteFoot = (
    <div className="flex shrink-0 items-center gap-3">
      <div className="flex h-8 w-60 overflow-hidden rounded" aria-label="Palette">
        {c.swatches.map((s) => <span key={s.index} className="flex-1" style={{ background: s.hex }} title={s.hex} />)}
      </div>
      {/* RANDOMISE (review 6, Adobe's shuffle; review 8 — *"WRONG FUCKING BUTTON TONE"*): an explicit tone, so no wrapper's
        * ground repaints it — the inverted button this window already wears on Upload your image. Copy CSS is in the header,
        * where every lab keeps it. His review decides the rung. */}
      {view === 'palette' && <Button tone="inverted" size="sm" iconLeft="shuffle" className="ml-auto" onClick={roll}>Randomise</Button>}
    </div>
  )
  const paletteStage = (
    <div className="flex h-full min-h-[240px] flex-col gap-3">
      <div className="flex min-h-0 flex-1 gap-0.5">
        {c.swatches.map((s) => (
          <Column
            key={s.index}
            s={s}
            n={c.colors.length}
            inks={inks}
            tint={tinting === s.index}
            onTint={(hex) => { if (hex) editAt(s.index, hex); setTinting(tinting === s.index || hex ? null : s.index) }}
            onLock={() => toggleLock(s.index)}
            onEdit={(hex) => editAt(s.index, hex)}
            onCopy={() => navigator.clipboard?.writeText(s.hex)}
            onDelete={() => remove(s.index)}
            canDelete={c.colors.length > 2}
            drag={dragFor(s.index)}
            add={{ left: c.colors.length < 8 ? () => insert(s.index) : null, right: c.colors.length < 8 && s.index === c.colors.length - 1 ? () => insert(s.index + 1) : null }}
          />
        ))}
      </div>
      {paletteFoot}
    </div>
  )

  /* ── the contrast checker (Adobe's ref 58, review 6) ── */
  const [pair, setPair] = useState(null)
  const [ctab, setCtab] = useState('summary')
  const fgI = pair?.fg ?? c.roleIdx.fg
  const bgI = pair?.bg ?? c.roleIdx.bg
  const fg = c.colors[fgI] ?? c.roles.fg, bg = c.colors[bgI] ?? c.roles.bg
  const ratio = contrastRatio(fg, bg)
  const colourOptions = c.swatches.map((s) => ({ value: String(s.index), label: `${s.index + 1}  ${s.hex}` }))
  /* a colour's lightness, OKLCH L as 0–100 — moving it edits that palette colour */
  const lightness = (i) => Math.round(hexToOklch(c.colors[i])[0] * 100)
  const setLightness = (i, L) => { const [, C, hh] = hexToOklch(c.colors[i]); editAt(i, oklchToHex(L / 100, C, hh)) }
  const SUMMARY = [
    { id: 'large', label: 'Large text', aa: ratio >= 3, aaa: ratio >= 4.5 },
    { id: 'small', label: 'Small text', aa: ratio >= 4.5, aaa: ratio >= 7 },
    { id: 'ui', label: 'Graphics and UI', aa: ratio >= 3, aaa: null },
  ]
  /* CONTRAST SUGGESTIONS: the foreground's hue and chroma at other lightnesses that pass AA for small text, nearest first */
  const fgL = hexToOklch(fg)[0]
  const suggestions = (() => {
    const [, C, hh] = hexToOklch(fg)
    const out = []
    for (let L = 0.05; L <= 0.98; L += 0.05) { const hex = oklchToHex(L, C, hh); const r = contrastRatio(hex, bg); if (r >= 4.5 && hex !== fg) out.push({ hex, r, L }) }
    return out.sort((a, b) => Math.abs(a.L - fgL) - Math.abs(b.L - fgL)).slice(0, 6)
  })()
  /* SET A CONTRAST RATIO: the foreground's lightness moved away from the background until the pair reaches the target */
  const [target, setTarget] = useState(null)
  const solveFor = (t) => {
    const [, C, hh] = hexToOklch(fg)
    const Lb = hexToOklch(bg)[0]
    const far = Lb < 0.5
    let lo = 0, hi = 1, best = fg
    for (let k = 0; k < 24; k++) {
      const mid = (lo + hi) / 2
      const hex = oklchToHex(far ? Lb + mid * (1 - Lb) : Lb * (1 - mid), C, hh)
      best = hex
      if (contrastRatio(hex, bg) < t) lo = mid; else hi = mid
    }
    return best
  }
  /* THE CONTRAST RAIL ON SETTINGSSECTIONS ROWS (2026-10-30, the user: *"if you need to scroll in this siderail then you
   * are doing something wrong"*, *"we always have used mono sections and labels"*): the same rows the other labs use —
   * label left, control right, the rail's rhythm and its mono — and nothing taller than the rail. The eleven-step ladder
   * is three rows, each grade with the stops it holds. */
  const pairSection = { label: 'Pair', rows: [
    { id: 'ratio', label: 'Contrast ratio', value: `${ratioText(ratio)} : 1  ${contrastGrade(ratio)}` },
    { id: 'fg', label: 'Foreground', type: 'choice', value: String(fgI), onChange: (v) => setPair({ fg: Number(v), bg: bgI }), options: colourOptions },
    { id: 'fgL', label: 'Lightness', type: 'slider', min: 0, max: 100, step: 1, value: lightness(fgI), onChange: (L) => setLightness(fgI, L) },
    { id: 'bg', label: 'Background', type: 'choice', value: String(bgI), onChange: (v) => setPair({ fg: fgI, bg: Number(v) }), options: colourOptions },
    { id: 'bgL', label: 'Lightness', type: 'slider', min: 0, max: 100, step: 1, value: lightness(bgI), onChange: (L) => setLightness(bgI, L) },
    { id: 'swap', label: 'Swap', render: () => <Button variant="nav" size="sm" iconOnly="swap" aria-label="Swap foreground and background" onClick={() => setPair({ fg: bgI, bg: fgI })} /> },
  ] }
  const verdict = (ok) => (ok === null ? 'n/a' : ok ? 'pass' : 'fail')
  const wcagSection = { label: 'WCAG', rows: SUMMARY.map((r) => ({ id: r.id, label: r.label, value: `AA ${verdict(r.aa)}, AAA ${verdict(r.aaa)}` })) }
  /* KOL's text levels: the foreground at every ink stop over the background, grouped by the grade each stop earns */
  const levels = c.text.reduce((acc, x) => { const g = contrastGrade(contrastRatio(over(fg, bg, x.stop / 100), bg)); (acc[g] ??= []).push(x.stop); return acc }, {})
  const levelsSection = { label: 'Text levels', rows: ['AAA', 'AA', 'AA large', 'fail'].filter((g) => levels[g]).map((g) => ({ id: g, label: g === 'fail' ? 'Fail' : g, value: levels[g].length > 1 ? `${levels[g][0]} to ${levels[g][levels[g].length - 1]}` : String(levels[g][0]) })) }
  const contrastRail = [
    { id: 'summary', label: 'Summary', content: <SettingsSections divided sections={[pairSection, wcagSection, levelsSection]} /> },
    { id: 'suggest', label: 'Suggestions', content: (
      <SettingsSections divided sections={[pairSection, { label: 'Foreground colors that pass AA', note: suggestions.length === 0 ? 'None at this hue. Move the background’s lightness.' : undefined, rows: suggestions.length === 0 ? [] : [
        { id: 'pick', label: 'Use', type: 'choice', value: '', onChange: (hex) => editAt(fgI, hex), options: suggestions.map((x) => ({ value: x.hex, label: `${x.hex}  ${ratioText(x.r)} : 1 ${contrastGrade(x.r)}` })) },
      ] }]} />
    ) },
    { id: 'ratio', label: 'Set a ratio', content: (
      <SettingsSections divided sections={[pairSection, { label: 'Target', note: 'The foreground’s lightness moves until the pair reaches it.', rows: [
        { id: 'target', label: 'Ratio', type: 'slider', min: 1, max: 21, step: 0.5, value: target ?? Math.round(ratio * 2) / 2, displayWidth: 4, onChange: (t) => { setTarget(t); editAt(fgI, solveFor(t)) } },
      ] }]} />
    ) },
  ]
  /* THE PREVIEW IN THE PALETTE'S OWN FORMS (review 8 — *"how is this using ANYTHING but the colors?? … show some
   * forms that use the pallette"*): the page in bg and fg, the other colours as forms beside the text; the DS Button */
  /* KOL's own vector forms (public/kol-vector, the brand's art) in the palette's colours — each a single-fill SVG worn as a
   * CSS mask, so any colour fills it (the user, 2026-10-30: *"find a better SVG image to use, something that actually makes sense"*) */
  const FORMS = [
    { src: '/kol-vector/form-09.svg', box: { left: '6%', top: '8%', width: '50%', aspectRatio: '163 / 192' } },
    { src: '/kol-vector/form-05.svg', box: { right: '8%', top: '10%', width: '30%', aspectRatio: '187 / 233' } },
    { src: '/kol-vector/form-02.svg', box: { right: '12%', bottom: '8%', width: '34%', aspectRatio: '1 / 1' } },
    { src: '/kol-vector/form-13.svg', box: { left: '8%', bottom: '6%', width: '36%', aspectRatio: '267 / 107' } },
  ]
  const masked = (src) => ({ WebkitMaskImage: `url(${src})`, maskImage: `url(${src})`, WebkitMaskRepeat: 'no-repeat', maskRepeat: 'no-repeat', WebkitMaskSize: 'contain', maskSize: 'contain', WebkitMaskPosition: 'center', maskPosition: 'center' })
  const forms = c.colors.filter((_, i) => i !== fgI && i !== bgI)
  const contrastStage = (
    <div className="flex h-full min-h-[240px] flex-col gap-3">
      <div className="grid min-h-0 flex-1 grid-cols-2 grid-rows-[minmax(0,1fr)] overflow-hidden rounded" style={{ background: bg, color: fg }}>
        <div className="relative min-h-0 overflow-hidden">
          {(forms.length ? forms : [fg]).slice(0, 4).map((hex, i) => <span key={`${hex}${i}`} className="absolute" style={{ ...FORMS[i].box, background: hex, ...masked(FORMS[i].src) }} />)}
        </div>
        <div className="flex min-h-0 flex-col justify-center gap-6 p-10">
          <span className="kol-sans-heading-01 leading-none">The quick brown fox</span>
          <span className="max-w-[48ch] kol-sans-body-02">Body text in the foreground on the background, the size most of a page is read at. If this line is hard to read, so is the page.</span>
          <Button size="md" className="self-start" style={{ '--kol-tone-bg': fg, '--kol-tone-hover-bg': fg, '--kol-tone-fg': bg, '--kol-tone-hover-fg': bg, '--kol-tone-image': 'none', '--kol-tone-hover-image': 'none' }}>Button</Button>
        </div>
      </div>
      {paletteFoot}
    </div>
  )

  /* ── the colour blindness simulator (Adobe's ref 59, review 6) ── */
  const VISIONS = CVD_TYPES.filter((t) => t.id !== 'normal')
  const rows = VISIONS.map((t) => {
    const seen = c.colors.map((hex) => simulateCvd(hex, t.id))
    return { ...t, seen, conflict: seen.map((x, i) => seen.some((y, j) => j !== i && close(x, y))) }
  })
  const conflicts = rows.some((r) => r.conflict.some(Boolean))
  const visionRail = [{ id: 'conflicts', label: 'Conflicts', content: (
    <>
      <div className="flex items-center justify-between gap-3 rounded bg-oq-04 p-3">
        <span className="kol-eyebrow text-fg-80">Potential color blind conflicts</span>
        <span className={`inline-flex shrink-0 items-center gap-1 rounded px-2 py-0.5 kol-mono-12 ${conflicts ? 'bg-oq-08 text-emphasis' : 'text-meta'}`}>{conflicts && <Icon name="alert-triangle" size={12} className="text-oq-96" />}{conflicts ? 'Conflicts found' : 'None'}</span>
      </div>
      <PaletteDots colors={c.colors} />
    </>
  ) }]
  const n = c.colors.length
  const visionStage = (
    <div className="flex h-full min-h-[240px] flex-col gap-3">
      <div className="grid min-h-0 flex-1 gap-0.5" style={{ gridTemplateColumns: `112px repeat(${n}, minmax(0, 1fr))`, gridTemplateRows: `2fr repeat(${rows.length}, minmax(0, 1fr))` }}>
        <span />
        {c.swatches.map((s) => (
          <span key={s.index} className="flex items-end p-3 kol-mono-12" style={{ background: s.hex, color: inkOn(s.hex, inks).ink, ...(s.index === 0 ? { borderTopLeftRadius: 4 } : null), ...(s.index === n - 1 ? { borderTopRightRadius: 4 } : null) }}>{s.hex}</span>
        ))}
        {rows.flatMap((r, ri) => [
          <span key={`${r.id}-label`} className="flex items-center kol-helper-12 text-meta">{r.label}</span>,
          ...r.seen.map((hex, i) => (
            <span key={`${r.id}-${i}`} className="flex items-center justify-center" title={r.conflict[i] ? `${r.label}: too close to another colour` : hex}
              style={{ background: hex, color: inkOn(hex, inks).ink, ...(ri === rows.length - 1 && i === 0 ? { borderBottomLeftRadius: 4 } : null), ...(ri === rows.length - 1 && i === n - 1 ? { borderBottomRightRadius: 4 } : null) }}>
              {r.conflict[i] && <Icon name="alert-triangle" size={16} />}
            </span>
          )),
        ])}
      </div>
      {paletteFoot}
    </div>
  )

  const VIEWS = [
    { id: 'palette', icon: 'gen-color', label: 'Create palette' },
    { id: 'contrast', icon: 'brightness', label: 'Contrast checker' },
    { id: 'vision', icon: 'eye-on', label: 'Color blindness simulator' },
  ]
  return (
    <LabWindow
      className={className}
      title={view === 'palette' ? 'Color Lab' : VIEWS.find((v) => v.id === view).label}
      tabs={view === 'contrast' ? contrastRail : view === 'vision' ? visionRail : sources}
      tab={view === 'palette' ? tab : view === 'contrast' ? ctab : 'conflicts'}
      onTabChange={view === 'palette' ? setTab : view === 'contrast' ? setCtab : undefined}
      actions={(
        <>
          {/* THE THREE VIEWS (review 3 — *"the accessibility buttons should be its own thing window"*) */}
          {VIEWS.map((v) => (
            <Tooltip key={v.id} label={v.label}><Button variant="tab" size="sm" iconOnly={v.icon} aria-label={v.label} pressed={view === v.id} onClick={() => setView(v.id)} /></Tooltip>
          ))}
          <LabHistory h={h} />
          <CopyAction text={css} />
        </>
      )}
      output={{
        columns: [
          { header: 'Colour', accessor: 'name', render: (r) => <span className="flex items-center gap-3"><span className="size-4 shrink-0 rounded-[3px] border border-oq-12" style={{ background: r.swatch }} />{r.name}</span> },
          { header: 'Hex', accessor: 'hex' },
          { header: 'RGB', accessor: 'rgb' },
          { header: 'OKLCH', accessor: 'oklch' },
        ],
        rows: c.swatches.map((s) => ({ id: `c${s.index}`, swatch: s.hex, name: `${s.index + 1} ${s.roleLabel}`, hex: s.hex, rgb: rgb(s.hex), oklch: `${s.oklch[0].toFixed(2)} ${s.oklch[1].toFixed(3)} ${Math.round(s.oklch[2])}` })),
        css,
        filename: 'brand-color.css',
      }}
    >
      {view === 'contrast' ? contrastStage : view === 'vision' ? visionStage : paletteStage}
    </LabWindow>
  )
}
