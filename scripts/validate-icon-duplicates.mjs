#!/usr/bin/env node
/**
 * validate-icon-duplicates.mjs — one drawing per idea (pnpm validate:icon-duplicates).
 *
 * The rule (docs/documentation/02-icons/02-loader.md § Rules): the same drawing is not in the set twice. Since W21.1
 * (2026-11-21) every icon is one flat file; bases and their settings live in the Figma workshop file
 * `iconset--kol-ds-ui`, never in code. A turned, flipped or badged icon built on another's base is a real icon, and
 * the pair goes in `allowed` with its reason; a second NAME for one drawing goes in packages/icons/src/aliases.json, never a
 * second file (an alias is not a duplicate).
 *
 * Two drawing files in the interface and signal sets fail when one equals the other after a flip, a mirror, or a turn
 * in eighths (16 poses), allowing for size: each is rendered at 96 px with its strokes thinned to centrelines (so stroke
 * weight does not count, the geometry does), its ink centred and scaled to one radius; a pair is equal when, in its best
 * pose, at least MATCH of each one's ink lies within REACH of the other's, both ways.
 *
 * scripts/icon-duplicates-baseline.json: `pairs` the set had when the check was written (2026-11-20), still to settle;
 * `allowed` the pairs settled as two real icons, with the reason. Only a NEW pair fails. `--all` prints every pair found,
 * `--write-baseline` rewrites `pairs` (keeping `allowed`), `--src <dir>` reads another copy of packages/icons/src.
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'
import { drawings, filledShapes, ICONS_SRC } from './icon-set.mjs'

const BASELINE = join(dirname(fileURLToPath(import.meta.url)), 'icon-duplicates-baseline.json')
const argSrc = process.argv.indexOf('--src')
const SRC = argSrc > 0 ? process.argv[argSrc + 1] : ICONS_SRC
const N = 96
/* tuned 2026-11-20 on the set as it was: pen-nib and pen-tool-02 0.966, color-swatch and swatch-book-02 0.982, crop and
 * crop-02 0.971; a different drawing of the same idea (pencil-simple and pencil-ferrule) 0.929, two clocks 0.897 */
const REACH = 3     // px at 96: three quarters of a unit of the 24 grid
const MATCH = 0.95
const SIG_GAP = 0.4  // the radii signatures of two equal drawings differ by less (prefilter only)
const SIZE = 1.25   // two drawings of one drawing differ in size by less than a quarter (swatch-book-02 was 0.9 of color-swatch)

const errors = []
const all = drawings(SRC)
/* aliases.json (W20.1): his names that resolve to an icon; the target must exist and an alias never shadows a name */
const ALIASES = existsSync(join(SRC, 'aliases.json')) ? JSON.parse(readFileSync(join(SRC, 'aliases.json'), 'utf8')) : {}
for (const [name, target] of Object.entries(ALIASES)) {
  if (!all.has(target)) errors.push(`aliases.json ${name}: its icon "${target}" is not in the set`)
  if (all.has(name)) errors.push(`aliases.json ${name}: the name is already an icon; an alias never shadows one`)
}

/* ink pixels of one drawing, centred on their centroid and scaled to unit RMS radius, plus a distance field */
async function ink(svg) {
  const thin = svg.replaceAll('currentColor', '#000').replace(/stroke-width="[^"]*"/g, 'stroke-width="0.6"')
  const { data } = await sharp(Buffer.from(thin), { density: 72 * N / 24 })
    .resize(N, N).ensureAlpha().extractChannel(3).raw().toBuffer({ resolveWithObject: true })
  /* the edge of the ink, so a filled shape compares by its outline and a thin stroke by itself */
  const on = (x, y) => x >= 0 && y >= 0 && x < N && y < N && data[y * N + x] > 127
  const edge = new Uint8Array(N * N)
  const pts = []
  for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) {
    if (on(x, y) && !(on(x - 1, y) && on(x + 1, y) && on(x, y - 1) && on(x, y + 1))) { edge[y * N + x] = 1; pts.push([x + 0.5, y + 0.5]) }
  }
  if (pts.length < 8) return null
  const cx = pts.reduce((s, p) => s + p[0], 0) / pts.length
  const cy = pts.reduce((s, p) => s + p[1], 0) / pts.length
  const r = Math.sqrt(pts.reduce((s, p) => s + (p[0] - cx) ** 2 + (p[1] - cy) ** 2, 0) / pts.length) || 1
  const q = pts.map(([x, y]) => [(x - cx) / r, (y - cy) / r])
  /* chamfer distance field (3-4), in px */
  const dt = new Float32Array(N * N).fill(1e4)
  for (let i = 0; i < N * N; i++) if (edge[i]) dt[i] = 0
  const at = (x, y) => (x < 0 || y < 0 || x >= N || y >= N ? 1e4 : dt[y * N + x])
  for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) dt[y * N + x] = Math.min(dt[y * N + x], at(x - 1, y) + 1, at(x, y - 1) + 1, at(x - 1, y - 1) + 1.4, at(x + 1, y - 1) + 1.4)
  for (let y = N - 1; y >= 0; y--) for (let x = N - 1; x >= 0; x--) dt[y * N + x] = Math.min(dt[y * N + x], at(x + 1, y) + 1, at(x, y + 1) + 1, at(x + 1, y + 1) + 1.4, at(x - 1, y + 1) + 1.4)
  /* rotation and flip invariant signature: the radii in 10 bins */
  const sig = new Array(10).fill(0)
  for (const [x, y] of q) sig[Math.min(9, Math.floor(Math.hypot(x, y) * 4))] += 1 / q.length
  return { q, cx, cy, r, dt, sig, n: pts.length }
}

/* the 16 poses: 8 turns of 45 degrees, each with and without a mirror */
const POSES = []
for (let k = 0; k < 8; k++) for (const f of [1, -1]) {
  const a = (k * Math.PI) / 4, c = Math.cos(a), s = Math.sin(a)
  POSES.push({ label: `${f < 0 ? 'mirrored, ' : ''}turned ${k * 45}`, m: [c * f, -s, s * f, c] })
}
/* the share of A's ink that lands within REACH of B's ink, A posed by m into B's frame */
const cover = (A, B, m) => {
  let hit = 0
  for (const [x, y] of A.q) {
    const px = Math.floor((m[0] * x + m[1] * y) * B.r + B.cx), py = Math.floor((m[2] * x + m[3] * y) * B.r + B.cy)
    if (px >= 0 && py >= 0 && px < N && py < N && B.dt[py * N + px] <= REACH) hit++
  }
  return hit / A.q.length
}
const inverse = ([a, b, c, d]) => [a, c, b, d]  // the poses are orthonormal: the inverse is the transpose

const files = [...all.values()].filter((d) => d.set === 'interface' || d.set === 'editor' || d.set === 'signal')
const ink_ = new Map()
/* a line drawing is compared with line drawings, a solid with solids: a solid cut of a line icon is the rule, not a copy */
const solid = (d) => filledShapes(d.svg).length > 0
for (const d of files) { const v = await ink(d.svg); if (v) ink_.set(d.name, { ...v, solid: solid(d) }) }
const names = [...ink_.keys()].sort()
const pairs = []
for (let i = 0; i < names.length; i++) for (let j = i + 1; j < names.length; j++) {
  const A = ink_.get(names[i]), B = ink_.get(names[j])
  if (A.solid !== B.solid || Math.max(A.r / B.r, B.r / A.r) > SIZE) continue
  const sd = A.sig.reduce((s, v, k) => s + Math.abs(v - B.sig[k]), 0)
  if (process.env.SIG && process.env.SIG.split(',').includes(`${names[i]}:${names[j]}`)) console.log('sig', names[i], names[j], sd.toFixed(3))
  if (sd > SIG_GAP) continue
  let best = null
  for (const p of POSES) {
    const score = Math.min(cover(A, B, p.m), cover(B, A, inverse(p.m)))
    if (!best || score > best.score) best = { score, label: p.label }
  }
  if (best.score >= MATCH) pairs.push({ a: names[i], b: names[j], ...best })
}

let base = [], allowed = {}
try { const b = JSON.parse(readFileSync(BASELINE, 'utf8')); base = b.pairs ?? []; allowed = b.allowed ?? {} } catch { /* none yet */ }
const key = (p) => `${p.a} ${p.b}`
if (process.argv.includes('--write-baseline')) {
  writeFileSync(BASELINE, JSON.stringify({ written: '2026-11-20', allowed, pairs: pairs.map(key).filter((k) => !allowed[k]) }, null, 2) + '\n')
  console.log(`icon-duplicates: baseline written, ${pairs.length} pair(s) → scripts/icon-duplicates-baseline.json`)
  process.exit(0)
}
const fresh = pairs.filter((p) => !base.includes(key(p)) && !allowed[key(p)])
const line = (p) => `  ${p.a} = ${p.b} ${p.label} (${(p.score * 100).toFixed(1)} percent within reach)`
if (process.argv.includes('--all')) { console.log(`icon-duplicates: ${pairs.length} pair(s) in the set`); pairs.forEach((p) => console.log(line(p))) }
const cleared = [...base, ...Object.keys(allowed)].filter((k) => !pairs.some((p) => key(p) === k))
if (cleared.length) console.log(`icon-duplicates: ${cleared.length} baseline pair(s) gone, take them off the baseline: ${cleared.join(', ')}`)
for (const p of fresh) errors.push(`${line(p).trim()}: two drawings of one drawing. If they are one idea, keep the better drawing and add the other name to packages/icons/src/aliases.json (its file moved to _tmp/); if one is the other's base with another setting (turned, flipped, a badge), add the pair to "allowed" in scripts/icon-duplicates-baseline.json with its reason`)
if (errors.length) {
  console.error(`icon-duplicates: ${errors.length} violation(s)\n`)
  for (const e of errors) console.error('  ' + e)
  process.exit(1)
}
console.log(`icon-duplicates: clean (${files.length} drawings, ${Object.keys(allowed).length} allowed, ${base.length} baseline pair(s), 0 new)`)
