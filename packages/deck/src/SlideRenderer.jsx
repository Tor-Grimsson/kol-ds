import { SLIDE_W, SLIDE_H, GREYS } from './slideDoc.js'
import { ensureFont } from './webFonts.js'

/* taxonomy-ok: atom — draws one slide document at 1920×1080 */

/**
 * SlideRenderer — draws a slide document at 1920×1080, nothing scaled here (kol-olina's brand decks).
 * Whoever holds it (SlideThumb, SlideStage) sets the zoom. Every layer carries `data-layer-id`, which
 * is what the stage's pointer router reads — the renderer is the same in the editor and out of it, so
 * what you drag is what you present.
 *
 * THE RAMP IS DEFINED ON THE SLIDE. olina injected `--grey-*` from a deck stylesheet; here the root
 * carries them from `GREYS`, so a slide renders the same in any app with nothing to import.
 *
 * @param {Object}    doc       `{ bg, layers }`
 * @param {ReactNode} children  the stage's chrome, in the same coordinate space
 */
const FONT = {
  sans: 'var(--kol-font-family-sans)',
  mono: 'var(--kol-font-family-mono)',
}
const fontFamilyFor = (v) => FONT[v ?? 'sans'] ?? `'${v}', ${FONT.sans}`
const JUSTIFY = { start: 'flex-start', center: 'center', end: 'flex-end' }
const RAMP = Object.fromEntries(Object.entries(GREYS).map(([token, value]) => [token.slice(4, -1), value]))

function Layer({ l }) {
  const box = { position: 'absolute', left: l.x, top: l.y, width: l.w, height: l.h, transform: l.rotate ? `rotate(${l.rotate}deg)` : undefined }
  if (l.type === 'image') {
    /* a fresh image layer has `src: ''` until one is picked, and `<img src="">` re-requests the PAGE —
       draw the empty box instead, which also gives the layer something to select and drag */
    if (!l.src) return <div data-layer-id={l.id} style={{ ...box, outline: '1px dashed var(--grey-500)', outlineOffset: -1 }} />
    return <img data-layer-id={l.id} src={l.src} alt="" draggable={false} style={{ ...box, objectFit: l.fit, userSelect: 'none' }} />
  }
  if (l.type === 'rule') {
    return <div data-layer-id={l.id} style={{ ...box, background: l.color, border: l.stroke ? `1px solid ${l.stroke}` : undefined, boxSizing: 'border-box' }} />
  }
  return (
    <div
      data-layer-id={l.id}
      style={{
        ...box,
        display: 'flex', flexDirection: 'column', justifyContent: JUSTIFY[l.valign] ?? 'flex-start',
        fontFamily: fontFamilyFor(l.font),
        fontSize: l.size, fontWeight: l.weight, fontStyle: l.italic ? 'italic' : 'normal',
        letterSpacing: l.tracking, lineHeight: l.lineHeight,
        textTransform: l.case === 'upper' ? 'uppercase' : 'none',
        textAlign: l.align, color: l.color,
        border: l.stroke ? `1px solid ${l.stroke}` : undefined,
        whiteSpace: 'pre-line', userSelect: 'none',
      }}
    >
      {l.text}
    </div>
  )
}

export default function SlideRenderer({ doc, children }) {
  /* every non-theme family the document uses; idempotent, a Set lookup per render */
  doc.layers.forEach((l) => { if (l.type === 'text') ensureFont(l.font) })

  return (
    <div style={{ ...RAMP, position: 'relative', width: SLIDE_W, height: SLIDE_H, overflow: 'hidden', background: doc.bg }}>
      {doc.layers.filter((l) => l.visible !== false).map((l) => <Layer key={l.id} l={l} />)}
      {children}
    </div>
  )
}
