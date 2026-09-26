/**
 * Slide document — a slide as DATA (kol-olina's brand decks, 2026-09-03).
 *
 * A slide is a 1920×1080 stage with a background and z-ordered layers, every number in stage px
 * (first layer = bottom). The model is kol-fxr's compose editor cut to what a deck needs:
 *
 *   text   { text, x, y, w, h, font:'sans'|'mono'|<web family>, size, weight, italic,
 *            tracking, lineHeight, case:'upper'|'none', align, valign, color, stroke, rotate }
 *   image  { src, x, y, w, h, fit }
 *   rule   { x, y, w, h, color, stroke }   — a line, a box, a divider
 *
 * A DECK is `{ slides: [{ id, doc }] }` — instances of documents, so one layout can sit in a deck
 * twice. `SlideRenderer` draws a doc; the thumb, the stage, the presentation and every export render
 * from the same document, so an edit shows everywhere at once.
 *
 * Colours are the deck's own ramp tokens (`var(--grey-N)`), which the renderer defines on the slide
 * itself — so a slide renders the same in any app, with no stylesheet to import. The layouts a deck
 * starts from are the CONSUMER's (olina's fourteen credentials slides are the fixture's seed).
 */
export const SLIDE_W = 1920
export const SLIDE_H = 1080

/* 8 random base36 chars — fxr's minting, with its collision lesson */
export const newId = (type) => `${type}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`

/* the deck's voices as layer presets */
export const CHROME  = { font: 'mono', size: 16, weight: 500, tracking: '0.06em', lineHeight: 1, case: 'upper', color: 'var(--grey-400)' }
export const DISPLAY = { font: 'sans', weight: 800, tracking: '-0.035em', lineHeight: 0.84, case: 'upper', color: 'var(--grey-50)' }

export const text  = (p) => ({ id: newId('text'),  type: 'text',  align: 'left', valign: 'start', italic: false, visible: true, ...p })
export const image = (p) => ({ id: newId('image'), type: 'image', fit: 'cover', visible: true, ...p })
export const rule  = (p) => ({ id: newId('rule'),  type: 'rule',  visible: true, ...p })

/* a fresh copy — new ids, so two instances of one layout are two slides */
export const clone = (doc) => ({ ...doc, layers: doc.layers.map((l) => ({ ...l, id: newId(l.type) })) })

/* THE DECK'S RAMP, token → hex. Documents only ever carry the TOKEN; the hex exists for the
   consumers that cannot resolve a CSS variable — the renderer defines the variables from it, the
   inspector's swatches paint it, and the SVG / PPTX exporters write it. */
export const GREYS = Object.fromEntries(
  [['50', '#FCFBFB'], ['100', '#EBEBEB'], ['200', '#DBDBDB'], ['300', '#A3A3A4'], ['400', '#5B5B5D'],
   ['500', '#363639'], ['600', '#2E2E30'], ['700', '#242427'], ['800', '#1B1B1E'], ['900', '#131316']]
    .map(([n, hex]) => [`var(--grey-${n})`, hex]),
)
export const ABSOLUTE_BLACK = '#000000'
export const BLACK = 'var(--kol-color-absolute-black)'

/** Resolve a document colour to something a standalone SVG or a PPTX can paint. */
export const resolveColor = (c) => {
  if (!c) return undefined
  if (c === BLACK) return ABSOLUTE_BLACK
  if (c === 'var(--kol-color-absolute-white)') return '#FFFFFF'
  return GREYS[c] ?? c
}

/* LAYER ROLES — the seam deck-wide settings write through. Settings cannot target layers by
   matching their TEXT (two slides say the same words for different reasons; a renamed deck stops
   matching itself), so the well-known slots carry a `role`. Anything without one is ordinary copy. */
export const ROLE = { NAME: 'deck-name', DATE: 'deck-date', NUMBER: 'slide-number' }

/** The empty layout — what a deck can always add, whatever layouts the consumer brings. */
export const BLANK_LAYOUT = { slug: 'blank', name: 'Blank', doc: { bg: BLACK, layers: [] } }
