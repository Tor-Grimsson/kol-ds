import { DocHeader, DocSection, usePageMeta } from '@kolkrabbi/kol-workshop'
import { Icon } from '@kolkrabbi/kol-icons'
import { Button } from '@kolkrabbi/kol-component'

/* Round 9 — kol-fxr's two held editor-chrome-review items (#14 the transform glyphs, #15 the
 * primary hover), filed 2026-10-09. The hover was built on the recommendation (kol-theme 0.170.0);
 * the glyphs shipped as A (kol-icons 0.34.0), decided on the recommendation for review. */
export const meta = {
  round: 9,
  date: '2026-10-09',
  title: 'The transform glyphs and the primary hover',
  status: 'decided, review',
}

const cell = 'flex flex-col gap-3 rounded border border-fg-08 p-4'
const label = 'kol-doc-eyebrow'

/* the set's keyline: 24 box, 1.5 stroke, round caps — a candidate changes only what it names */
const svg = (body, sw = 1.5) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round">${body}</svg>`
const box = (x, y, w, h, solid) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="1"${solid ? ' fill="currentColor" stroke="none"' : ''} />`

/* ALIGN — A: solid boxes, the bar at 2 · B: outline boxes, the bar at 2.5 with a wider gap.
 * The fault named: the bar and the box share one stroke, so at 16 they smudge into one shape. */
const ALIGN = {
  'align-horizontal-left':   (s, bw) => `<path d="M4 3V21" stroke-width="${bw}" />${box(7, 5, 13, 5, s)}${box(7, 14, 8, 5, s)}`,
  'align-horizontal-center': (s, bw) => `<path d="M12 2.5V5M12 10V14M12 19V21.5" stroke-width="${bw}" />${box(5, 5, 14, 5, s)}${box(8, 14, 8, 5, s)}`,
  'align-horizontal-right':  (s, bw) => `<path d="M20 3V21" stroke-width="${bw}" />${box(4, 5, 13, 5, s)}${box(9, 14, 8, 5, s)}`,
  'align-vertical-top':      (s, bw) => `<path d="M3 4H21" stroke-width="${bw}" />${box(5, 7, 5, 13, s)}${box(14, 7, 5, 8, s)}`,
  'align-vertical-center':   (s, bw) => `<path d="M2.5 12H5M10 12H14M19 12H21.5" stroke-width="${bw}" />${box(5, 5, 5, 14, s)}${box(14, 8, 5, 8, s)}`,
  'align-vertical-bottom':   (s, bw) => `<path d="M3 20H21" stroke-width="${bw}" />${box(5, 4, 5, 13, s)}${box(14, 9, 5, 8, s)}`,
}
/* B pulls the boxes one unit off the bar so the heavier stroke has air */
const ALIGN_B = {
  'align-horizontal-left':   `<path d="M3.5 3V21" stroke-width="2.5" />${box(8, 5, 12, 5)}${box(8, 14, 7, 5)}`,
  'align-horizontal-center': `<path d="M12 2.5V4.5M12 10.5V13.5M12 19.5V21.5" stroke-width="2.5" />${box(5, 5, 14, 5)}${box(8, 14, 8, 5)}`,
  'align-horizontal-right':  `<path d="M20.5 3V21" stroke-width="2.5" />${box(4, 5, 12, 5)}${box(9, 14, 7, 5)}`,
  'align-vertical-top':      `<path d="M3 3.5H21" stroke-width="2.5" />${box(5, 8, 5, 12)}${box(14, 8, 5, 7)}`,
  'align-vertical-center':   `<path d="M2.5 12H4.5M10.5 12H13.5M19.5 12H21.5" stroke-width="2.5" />${box(5, 5, 5, 14)}${box(14, 8, 5, 8)}`,
  'align-vertical-bottom':   `<path d="M3 20.5H21" stroke-width="2.5" />${box(5, 4, 5, 12)}${box(14, 9, 5, 7)}`,
}

/* FLIP — the fault named: the dashed axis vanishes at 16 and the mirrored halves lose it.
 * A: a solid axis, the halves pulled off it by 2.5 · B: the same, with an arrow across the axis. */
const FLIP = {
  'flip-horizontal': {
    A: `<path d="M12 3V21" /><path d="M3.5 7L9 12L3.5 17Z" /><path d="M20.5 7L15 12L20.5 17Z" fill="currentColor" />`,
    B: `<path d="M12 2.5V21.5" /><path d="M3.5 8.5L8 12L3.5 15.5Z" /><path d="M20.5 8.5L16 12L20.5 15.5Z" fill="currentColor" /><path d="M7 4.5H17M15 3L17 4.5L15 6" />`,
  },
  'flip-vertical': {
    A: `<path d="M3 12H21" /><path d="M7 3.5L12 9L17 3.5Z" /><path d="M7 20.5L12 15L17 20.5Z" fill="currentColor" />`,
    B: `<path d="M2.5 12H21.5" /><path d="M8.5 3.5L12 8L15.5 3.5Z" /><path d="M8.5 20.5L12 16L15.5 20.5Z" fill="currentColor" /><path d="M4.5 7V17M3 15L4.5 17L6 15" />`,
  },
}

/* ROTATE — the fault named: a short arc reads as a hook. A: a 270° arc, the head on its end ·
 * B: the same arc with a solid head. Counter-clockwise, as `rotate-left` is. */
const ROTATE = {
  A: `<path d="M12 5A7 7 0 1 0 19 12" /><path d="M16.5 14.5L19 12L21.5 14.5" />`,
  B: `<path d="M12 5A7 7 0 1 0 19 12" /><path d="M16 13L19 9.5L22 13Z" fill="currentColor" stroke-linejoin="round" />`,
}

function Raw({ markup, size }) {
  return <span className="inline-flex text-oq-64" style={{ width: size, height: size }} dangerouslySetInnerHTML={{ __html: markup.replace('<svg ', `<svg width="${size}" height="${size}" `) }} />
}

/* one glyph across the three readings, at the inspector's 16 and the set's 24 */
function Row({ name, current, a, b }) {
  return (
    <div className="grid grid-cols-[minmax(0,1fr)_repeat(3,auto)] items-center gap-x-8 gap-y-2">
      <span className="kol-mono-12 text-subtle truncate">{name}</span>
      {[['now', current], ['A', a], ['B', b]].map(([k, m]) => (
        <span key={k} className="flex items-center gap-3">
          {typeof m === 'string' ? <><Raw markup={m} size={16} /><Raw markup={m} size={24} /></> : <><Icon name={name} size={16} className="text-oq-64" /><Icon name={name} size={24} className="text-oq-64" /></>}
        </span>
      ))}
    </div>
  )
}

const STEPS = [['rest', '--kol-tone-bg'], ['hover', '--kol-tone-hover-bg'], ['pressed', '--kol-tone-active-bg']]

export default function OpenQuestionsRound9() {
  usePageMeta({ tags: [], related: [] })
  return (
    <div className="flex flex-col gap-10 pb-24">
      <DocHeader
        eyebrow="Open questions · Round 9 · 2026-10-09"
        title="The transform glyphs and the primary hover"
        lede="Two items kol-fxr held from the editor-chrome review. The hover is built and yours to overturn. The nine glyphs are drawn here in two readings beside the shipped ones, at the inspector's 16 and the set's 24; nothing in the icon set changed until you pick."
      />

      <DocSection id="glyphs" title="The nine transform glyphs — A, decided, review" lede="Your words, 2026-09-03: alignment is not great, nor rotation, flip side, flip up. A shipped for all three families (kol-icons 0.34.0) — solid boxes, a solid flip axis, the 270° arc; the old drawings are in _tmp/2026-10-09-transform-glyphs-before/. The now column shows A, since it shipped; B stays here to overturn to.">
        <div className={cell}>
          <span className={label}>Align — A solid boxes, bar at 2 · B outline boxes, bar at 2.5 with more air</span>
          {Object.keys(ALIGN).map((n) => <Row key={n} name={n} current={null} a={svg(ALIGN[n](true, 2))} b={svg(ALIGN_B[n])} />)}
        </div>
        <div className={cell}>
          <span className={label}>Flip — A a solid axis, halves off it · B the same with an arrow across</span>
          {Object.keys(FLIP).map((n) => <Row key={n} name={n} current={null} a={svg(FLIP[n].A)} b={svg(FLIP[n].B)} />)}
        </div>
        <div className={cell}>
          <span className={label}>Rotate — A a 270° arc · B the same with a solid head</span>
          <Row name="rotate-left" current={null} a={svg(ROTATE.A)} b={svg(ROTATE.B)} />
        </div>
      </DocSection>

      <DocSection id="hover" title="Primary hover goes deeper — decided, review" lede="It stepped on the page's ladder, which runs the other way from the rest fill in each theme: light hover went lighter, dark press went lighter. It steps down from the rest fill now, 8 then 16, in both themes.">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {['light', 'dark'].map((t) => (
            <div key={t} data-theme={t} className={`${cell} bg-surface-primary`}>
              <span className={label}>{t}</span>
              <div className="kol-tone-primary flex flex-wrap gap-3">
                {STEPS.map(([k, v]) => (
                  <span key={k} className="kol-mono-12 rounded px-4 py-2" style={{ background: `var(${v})`, color: 'var(--kol-surface-on-primary)' }}>{k}</span>
                ))}
              </div>
              <div><Button tone="primary" size="sm">Hover me</Button></div>
            </div>
          ))}
        </div>
      </DocSection>
    </div>
  )
}
