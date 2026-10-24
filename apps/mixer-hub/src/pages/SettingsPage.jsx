import { useRenderQuality, setQuality, resetQuality, SCALE_OPTIONS, PIXEL_CAP_OPTIONS, PIXEL_RATIO_OPTIONS, FRAME_DIVISOR_OPTIONS } from '../../../mixer/src/hooks/renderQuality.js'

/**
 * ON THE HUB (apps/mixer-hub, 2026-10-03): Mirror's settings as the ROWS of the Hub's settings rail — studio-hub's
 * tier. Every word is Mirror's `SettingsPage.jsx`; the Hub draws every label, value and note in its own class (user
 * 2026-10-24: *"YOU ARE USING A HELPER text for paragraphs"* — the rows were JSX, and the JSX wore `kol-helper-12` on
 * sentences; the rail takes rows now and no JSX). Every section sits under Settings — the rail has no app tabs (user
 * 2026-10-24: a fifth tab does not fit the rail on one line, *"not 2 lines"*) — Memory first, then the render budget;
 * reset is the rail's footer control (`drawer.onReset`), as studio-hub's.
 */

const MEMORY_ROWS = [
  ['Save', 'Save to Slot in the studio sidebar, per variant'],
  ['Load', 'Home → Saved, Library → Memory, or the studio Memory list'],
]

/* THE LABEL ALONE in the dropdown (user 2026-10-24: *"every dropdown super long and gnarly"* — Mirror's own page had
 * joined `label — detail` into one string); the detail of the picked option rides the row's hint */
const opts = (list) => list.map((o) => ({ value: o.value, label: o.label }))
const detailOf = (list, v) => list.find((o) => o.value === v)?.detail
const SVG_OPTIONS = [
  { value: 1, label: '1x', detail: 'cheapest' },
  { value: 2, label: '2x', detail: 'default' },
  { value: 3, label: '3x' },
  { value: 4, label: '4x', detail: 'legacy' },
]
const TARGET_OPTIONS = [{ value: 30, label: '30 fps' }, { value: 45, label: '45 fps' }, { value: 55, label: '55 fps', detail: 'default' }]

/* the rail's rows need the live quality, so this is a hook — `AppStudio settings={useSettings()}` */
export function useSettings() {
  const q = useRenderQuality()
  return {
    sections: [
      {
        label: 'Memory',
        note: 'The mirror has no database or user accounts. The 9 memory slots persist in this browser\'s localStorage and survive refresh. Custom-uploaded images are not persisted with a slot — reloading one falls back to the default source image.',
        rows: MEMORY_ROWS.map(([label, desc]) => ({ label, value: desc, align: 'fill' })),
      },
        {
          label: 'Render Budget',
          note: 'The Symphony mixer composites every channel, bus and feedback buffer once per frame, so its cost scales with pixels rather than with how many effects are stacked. Render scale is the lever: at Half, every stage does a quarter of the work. Press F anywhere to see the per-stage breakdown live — fps, p95 and a jank count, because an average hides the stalls you actually feel. Device pixel ratio is the other big one: at 2x every WebGL channel draws four times the fragments for detail no display resolves on moving video. Changing it takes effect on the next channel reload.',
          rows: [
            { label: 'Render scale', type: 'choice', options: opts(SCALE_OPTIONS), value: q.scale, onChange: (v) => setQuality({ scale: v }), hint: detailOf(SCALE_OPTIONS, q.scale) },
            { label: 'Output pixel cap', type: 'choice', options: opts(PIXEL_CAP_OPTIONS), value: q.maxPixels, onChange: (v) => setQuality({ maxPixels: v }), hint: detailOf(PIXEL_CAP_OPTIONS, q.maxPixels) },
            { label: 'Device pixel ratio', type: 'choice', options: opts(PIXEL_RATIO_OPTIONS), value: q.pixelRatio, onChange: (v) => setQuality({ pixelRatio: v }), hint: detailOf(PIXEL_RATIO_OPTIONS, q.pixelRatio) },
            { label: 'Render every', type: 'choice', options: opts(FRAME_DIVISOR_OPTIONS), value: q.frameDivisor, onChange: (v) => setQuality({ frameDivisor: v }), hint: detailOf(FRAME_DIVISOR_OPTIONS, q.frameDivisor) },
          ],
        },
        {
          label: 'Adaptive',
          note: 'Let the measured frame rate pick the render scale. Your Render scale above becomes a ceiling — adaptive only ever goes below it, drops after two bad windows, and takes six good ones to climb back, because a loop that recovers as eagerly as it drops just oscillates. Stalls count as well as the average.',
          rows: [
            { label: 'Adaptive quality', type: 'switch', on: !!q.adaptive, onChange: (v) => setQuality({ adaptive: v }) },
            { label: 'Target', type: 'choice', options: opts(TARGET_OPTIONS), value: q.targetFps, onChange: (v) => setQuality({ targetFps: v }), hint: detailOf(TARGET_OPTIONS, q.targetFps) },
            ...(q.adaptive ? [{ label: 'Currently', value: q.autoScale && q.autoScale < q.scale ? `Holding ${q.autoScale}x — below your ceiling` : 'At your ceiling', align: 'fill' }] : []),
          ],
        },
        {
          label: 'Source Quality',
          note: 'Uploaded vectors are rasterised so the WebGL variants can sample them. The old fixed 4x turned a 1024px SVG into a 4096-square texture — around 67 MB in GPU memory per channel, for detail no display can resolve.',
          rows: [
            { label: 'Vector raster scale', type: 'choice', options: opts(SVG_OPTIONS), value: q.svgRasterScale, onChange: (v) => setQuality({ svgRasterScale: v }), hint: detailOf(SVG_OPTIONS, q.svgRasterScale) },
            { label: 'Channel pixel cap', type: 'choice', options: opts(PIXEL_CAP_OPTIONS), value: q.maxChannelPixels, onChange: (v) => setQuality({ maxChannelPixels: v }), hint: detailOf(PIXEL_CAP_OPTIONS, q.maxChannelPixels) },
          ],
        },
    ],
    /* Restore defaults — the rail's footer reset, studio-hub's */
    drawer: { onReset: () => resetQuality() },
  }
}

/* About as DATA — paragraphs the Hub draws (2026-10-24) */
export const ABOUT = [
  'An interactive image distortion playground. Three halls of distortion variants — Displacement (SVG turbulence), Movement (GSAP transforms), Copies (WebGL slicing, glitch, kaleidoscope) — feeding a compositing Symphony mixer with send/return buses, cross-channel routing, per-channel feedback, procedural generators, an expression engine, and loop recording.',
  'React 19 · PixiJS 8 · GSAP 3 · Tailwind CSS 4 · the @kolkrabbi design system (kol-theme, kol-component, kol-framework).',
]

export const LINKS = [
  { label: 'GitHub', url: 'https://github.com/Tor-Grimsson/kol-mirror' },
  { label: 'Kolkrabbi', url: 'https://mirror.kolkrabbi.io' },
  { label: 'Vercel', url: 'https://vercel.com/tor-grimssons-projects/kol-mirror' },
]
