import { useEffect, useRef } from 'react'
import { Growth, densityFrom, mulberry32, orbCanvas, outline, pathCanvas, pathRing } from '@kolkrabbi/kol-growth'
import usePrefersReducedMotion from '../hooks/usePrefersReducedMotion.js'
import { claimIntro, endIntro, hideLoaderApp, releaseIntro } from '../utilities/loaderApp.js'

/* THE GROWING LINE AS A STAGE (GrowthLineStage, kol-atlas 2026-10-30) — kol-fxr's HomeStage sim loop on
 * @kolkrabbi/kol-growth: one closed line grows into `shape`, packing tighter where it is dark. One <canvas> filling its
 * box at dpr ≤ 2; the sim runs in CSS px, so the spacing reads the same on a phone as on a desk. Ink is the canvas's
 * computed `color` (a `text-*` class), a `data-theme` flip repaints a sleeping line; the stage clears to transparent.
 *
 * THE LINE SETTLES (engine `settle`, GrowthLineIntro 2026-10-31, kol-fxr plan 45): every node carries a heat its motion,
 * a split, the pointer or a pressing neighbour raise and that fades by itself; the loop steps while the line grows or
 * anything is warm — two steps a frame while it grows, one while it settles — and goes still without a hard stop. It runs
 * 48px past the edges (engine `bleed`), frozen there. THE POINTER IS A FORCE, soft: a move pushes the line aside as hard
 * as it moves (a resting pointer is no force), a press blasts a crater it regrows into. Read on the window, so the stage
 * can sit behind a page; a press on a control is the control's.
 *
 * A RESIZE KEEPS THE LINE — the nodes re-centre by half the size change, the shape is re-sampled at the new aspect, and
 * a bigger box wakes the line to grow on into it; it never reseeds. A SLOW WAVE (`wave`, default 24 s · 9 px · 640 px
 * crests) drifts the drawn line every frame, the sim untouched; `wave={false}` lets a settled line sleep (no rAF).
 *
 * THE INTRO (`intro`): one line from load to page. It grows on the shape's density (at `fit` 0.5) for 3.8 s, drawn only
 * through the shape in the emphasis ink; rests 4 s breathing (ink 0.7–1.0 on a 2 s period, growth off after the first
 * breath); then lets go over 4 s — the density blends shape → orb, `params` take over, every node warms, the stage's ink
 * fades up as the shape's fades out, and the pointer waits until it ends. `onIntroEnd` fires then; `onIntroBreath` fires
 * as the rest begins (HubHome fades its chrome in on it).
 *
 * THE LOADER IS THE LINE (LoaderAppIntro, kol-fxr 2026-11-01): on a page `loaderApp({ intro })` stamped `kol-intro`, the
 * intro claims it on mount, hides the app loader (its ground only) on its first drawn frame and ends it with the intro.
 * Without the stamp — another route, a SPA return, reduced motion — no loader is involved.
 *
 * REDUCED MOTION — no intro (`onIntroBreath` and `onIntroEnd` fire at once), no wave, no pointer force: the finished line is grown off
 * screen and drawn once.
 *
 * THE SEED (GrowthLineSeedOutline, kol-atlas 2026-11-01): `seed="centre"` (default) starts a small ring at the shape's
 * centre of darkness (the intro's at the box's centre); `seed="outline"` starts one ring on the shape's edge — the path
 * itself for a path `d`, the density's 0.5 iso-line otherwise — inset `minGap` so it starts inside, and the line fills
 * inward. A number is still the rng seed (the same number grows the same line).
 *
 * `shape` — 'orb' · an SVG path `d` (centred at `fit` of the box) · `(w, h) => canvas` (dark on light). */
const ORB_PARAMS = { minGap: 6, maxGap: 24, contrast: 1.4, growth: 2.5 }
const WAVE = { ms: 24000, a: 9, l: 640 }
/* the intro, ms from its first frame: the line fills the shape · it breathes · the shape lets go */
const INTRO_PARAMS = { minGap: 5, maxGap: 18, contrast: 1.2, growth: 5 }
const MARK_MS = 3800, REST_MS = 4000, BREATH_MS = 2000, RELEASE_MS = 4000

const shapeCanvas = (shape, w, h, fit, W) => {
  if (typeof shape === 'function') return shape(w, h)
  if (shape === 'orb' || !shape) return orbCanvas(w / h, W)
  return pathCanvas(shape, w / h, fit, W)
}

export default function GrowthLineStage({ shape = 'orb', fit, params = ORB_PARAMS, cap, pointer = true, seed, wave = WAVE, intro = false, onIntroBreath, onIntroEnd, className = '' }) {
  const ref = useRef(null)
  const reduced = usePrefersReducedMotion()
  /* the props are read at (re)start; the effect re-runs when one changes by value */
  const key = JSON.stringify([typeof shape === 'function' ? null : shape, fit, params, cap, pointer, seed, wave, intro, reduced])
  const shapeRef = useRef(shape)
  shapeRef.current = shape
  const endRef = useRef(onIntroEnd)
  endRef.current = onIntroEnd
  const breathRef = useRef(onIntroBreath)
  breathRef.current = onIntroBreath

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return undefined
    const k = fit ?? (intro ? 0.5 : 0.6)
    const drift = wave && !reduced ? wave : null
    const capOf = () => cap ?? Math.round(w * h / 90)
    let sim = null, raf = 0, w = 0, h = 0, dpr = 1, it = null, orbed = false
    /* the app loader's intro: claimed on mount, handed over ('shown') on the first frame */
    let claim = false
    let ptr = null, sm = null
    const force = pointer && !reduced
    const fitCanvas = () => {
      const r = canvas.getBoundingClientRect()
      w = Math.max(1, r.width); h = Math.max(1, r.height); dpr = Math.min(2, window.devicePixelRatio || 1)
      canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr)
      canvas.getContext('2d').setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    /* the shape as an alpha mask at the canvas's own resolution (dark → opaque), and the layer the line is drawn on
     * before the mask cuts it */
    const masks = () => {
      const src = shapeCanvas(shapeRef.current, w, h, k, canvas.width)
      const m = document.createElement('canvas'); m.width = canvas.width; m.height = canvas.height
      const g = m.getContext('2d', { willReadFrequently: true })
      if (src) g.drawImage(src, 0, 0, m.width, m.height)
      const img = g.getImageData(0, 0, m.width, m.height), d = img.data
      for (let i = 0; i < d.length; i += 4) { d[i + 3] = 255 - (0.2126 * d[i] + 0.7152 * d[i + 1] + 0.0722 * d[i + 2]); d[i] = d[i + 1] = d[i + 2] = 0 }
      g.putImageData(img, 0, 0)
      it.mask = m
      it.layer = document.createElement('canvas'); it.layer.width = canvas.width; it.layer.height = canvas.height
    }
    const end = () => { it = null; if (claim) { claim = false; endIntro() } endRef.current?.() }
    const start = () => {
      fitCanvas()
      const src = shapeCanvas(shapeRef.current, w, h, k)
      if (!src) return false
      sim = new Growth({ w, h, density: densityFrom(src), rand: typeof seed === 'number' ? mulberry32(seed) : Math.random, cap: capOf() })
      sim.setParams({ bleed: 48, settle: 60, ...(intro && !reduced ? INTRO_PARAMS : params) })
      /* the outline seed: the path itself, or the density's iso-line; null (nothing traced) falls back to the centre */
      const ring = seed === 'outline' && (typeof shapeRef.current === 'string' && shapeRef.current !== 'orb' ? pathRing(shapeRef.current, w / h, k) : outline(sim.density))
      const seedAt = (...centre) => (ring ? sim.seed({ points: ring, inset: sim.minGap }) : sim.seed(...centre))
      if (intro && !reduced) {
        seedAt(0.5, 0.5)
        const probe = document.createElement('span'); probe.className = 'text-emphasis'; canvas.parentElement.append(probe)
        it = { t0: 0, ink: 1, out: 0, bright: getComputedStyle(probe).color, mark: sim.density, mix: null }
        probe.remove(); masks()
        claim = claimIntro()
      } else {
        seedAt()
        if (intro) { breathRef.current?.(); endRef.current?.() }
      }
      return true
    }
    /* the shape lets go: the page's spacing, every node warm, the density blending from the shape to the orb */
    const release = () => {
      orbed = true
      const orb = densityFrom(orbCanvas(w / h))
      it.orb = orb; it.mix = { cols: orb.cols, rows: orb.rows, data: new Float32Array(orb.data.length) }
      sim.density = it.mix
      sim.setParams(params)
      sim.full = false; sim.heat.fill(1); sim.hot = sim.x.length
    }
    const blend = (u) => {
      const a = it.mark.data, b = it.orb.data, m = it.mix.data
      /* the mark was sampled at its own grid; read it by position if the orb's differs */
      if (a.length === m.length) for (let i = 0; i < m.length; i++) m[i] = a[i] + (b[i] - a[i]) * u
      else for (let i = 0; i < m.length; i++) m[i] = b[i] * u
    }
    const paint = (now) => {
      const g = canvas.getContext('2d'), ink = getComputedStyle(canvas).color
      const wv = drift && { a: drift.a, k: (2 * Math.PI) / drift.l, p: (2 * Math.PI * now) / drift.ms }
      g.clearRect(0, 0, w, h)
      if (!it) { sim.draw(g, w, h, { ink, width: 1, wave: wv }); return }
      const L = it.layer.getContext('2d')
      L.globalCompositeOperation = 'source-over'; L.setTransform(1, 0, 0, 1, 0, 0); L.clearRect(0, 0, it.layer.width, it.layer.height)
      L.setTransform(dpr, 0, 0, dpr, 0, 0); sim.draw(L, w, h, { ink: it.bright, width: 1, wave: wv })
      /* the whole line in the stage's ink once the shape lets go, fading up; the shape's in the emphasis ink, at the breath */
      if (it.out > 0) { g.globalAlpha = it.out; sim.draw(g, w, h, { ink, width: 1, wave: wv }); g.globalAlpha = 1 }
      L.setTransform(1, 0, 0, 1, 0, 0); L.globalCompositeOperation = 'destination-in'; L.drawImage(it.mask, 0, 0)
      g.save(); g.setTransform(1, 0, 0, 1, 0, 0)
      g.globalAlpha = it.ink * (1 - it.out); g.drawImage(it.layer, 0, 0)
      g.restore()
    }
    /* the line steps while it grows or anything is warm; with a wave it is drawn every frame, without one it sleeps */
    const frame = (now) => {
      let steps = !sim.full ? 2 : sim.hot > 0 ? 1 : 0
      if (it) {
        if (!it.t0) { it.t0 = now; if (claim) { claim = 'shown'; hideLoaderApp({ minMs: 0 }) } }
        const t = now - it.t0
        if (t < MARK_MS) steps = 4
        else if (t < MARK_MS + REST_MS) {
          /* it keeps filling the shape's far corners through the first breath, then holds */
          if (!it.rest && t > MARK_MS + BREATH_MS) { it.rest = true; sim.setParams({ growth: 0 }) }
          it.ink = 0.7 + 0.3 * Math.cos((2 * Math.PI * (t - MARK_MS)) / BREATH_MS)
          if (!it.breath) { it.breath = true; breathRef.current?.() }
        } else {
          if (!it.free) { it.free = true; it.ink = 1; release() }
          const u = Math.min(1, (t - MARK_MS - REST_MS) / RELEASE_MS)
          blend(u); it.out = u
          if (u >= 1) { sim.density = it.orb; end() }
        }
      }
      if (ptr && !it) {
        /* low-passed — the raw one twitches; 0.35 follows without lag */
        const to = sm ? { x: sm.x + (ptr.x - sm.x) * 0.35, y: sm.y + (ptr.y - sm.y) * 0.35 } : { x: ptr.x, y: ptr.y }
        /* the push is the pointer's own speed — a resting pointer is no force, a slow drift a light brush, a sweep a shove */
        const speed = sm ? Math.hypot(to.x - sm.x, to.y - sm.y) : 0
        if (ptr.down || speed > 0.3) { sim.poke(to.x, to.y, ptr.down, ptr.down ? 1 : Math.min(1, speed / 6)); steps = Math.max(steps, 1) }
        sm = to
      } else sm = null
      for (let i = 0; i < steps; i++) sim.step()
      paint(now)
      raf = drift || it || ptr || !sim.full || sim.hot > 0 ? requestAnimationFrame(frame) : 0
    }
    const wake = () => { if (!raf && sim && !reduced) raf = requestAnimationFrame(frame) }
    /* reduced motion: grown to the end off screen, ~12ms of steps a frame so the page never blocks, then drawn once */
    const grow = () => {
      const t = performance.now()
      while ((!sim.full || sim.hot > 0) && performance.now() - t < 12) sim.step()
      if (!sim.full || sim.hot > 0) { raf = requestAnimationFrame(grow); return }
      raf = 0
      paint(0)
    }
    /* A RESIZE KEEPS THE LINE: re-centred by half the size change, the frame and the shape re-sampled, never reseeded */
    const resize = () => {
      const r = canvas.getBoundingClientRect()
      if (!sim || (Math.round(r.width) === Math.round(w) && Math.round(r.height) === Math.round(h))) return
      const ow = w, oh = h
      fitCanvas()
      const dx = (w - ow) / 2, dy = (h - oh) / 2
      for (let i = 0; i < sim.x.length; i++) { sim.x[i] += dx; sim.y[i] += dy }
      sim.w = w; sim.h = h
      sim.setParams({ cap: capOf() })
      if (it) masks()
      /* released from the intro, the line's shape is the orb */
      else { const src = orbed ? orbCanvas(w / h) : shapeCanvas(shapeRef.current, w, h, k); if (src) sim.density = densityFrom(src) }
      if (w > ow || h > oh) { sim.full = false; sim.heat.fill(0.5); sim.hot = sim.x.length }
      if (reduced) { cancelAnimationFrame(raf); raf = requestAnimationFrame(grow) } else wake()
    }
    if (start()) raf = requestAnimationFrame(reduced ? grow : frame)
    const ro = new ResizeObserver(resize)
    ro.observe(canvas)
    const at = (e) => {
      const r = canvas.getBoundingClientRect()
      const x = e.clientX - r.left, y = e.clientY - r.top
      return x >= 0 && y >= 0 && x <= r.width && y <= r.height ? { x, y } : null
    }
    const onMove = (e) => { const p = at(e); ptr = p && { ...p, down: ptr?.down ?? false }; if (ptr) wake() }
    const onDown = (e) => { if (e.target.closest?.('button, a, input, textarea, select, [role="menu"]')) return; const p = at(e); if (p) { ptr = { ...p, down: true }; wake() } }
    const onUp = () => { if (ptr) ptr = { ...ptr, down: false } }
    const onLeave = () => { ptr = null }
    if (force) {
      window.addEventListener('pointermove', onMove)
      window.addEventListener('pointerdown', onDown)
      window.addEventListener('pointerup', onUp)
      document.addEventListener('pointerleave', onLeave)
    }
    /* the ink follows a theme flip on a sleeping line too */
    const mo = new MutationObserver(() => { if (!raf && sim) paint(performance.now()) })
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })
    return () => {
      cancelAnimationFrame(raf); ro.disconnect(); mo.disconnect()
      /* gone before its first frame (StrictMode's first mount reclaims at once) → the loader's fallback; gone mid-intro → ended */
      if (claim === true) releaseIntro(); else if (claim) endIntro()
      if (force) {
        window.removeEventListener('pointermove', onMove)
        window.removeEventListener('pointerdown', onDown)
        window.removeEventListener('pointerup', onUp)
        document.removeEventListener('pointerleave', onLeave)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key])

  return <canvas ref={ref} aria-hidden="true" className={`block size-full ${className}`.trim()} />
}
