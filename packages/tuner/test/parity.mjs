/* Parity: 50 fixed setting sets drawn by this package and by the reference engine (kol-branding's line-swell.js), every
 * path, label and number compared as a string. The reference draws colors and the port does not, so the color fields
 * (ink, ground, fill, c, keyColor, diagColor) and their geometry-only stand-ins (grey, light) are left out of the compare. */

const COLOR = new Set(['ink', 'ground', 'fill', 'c', 'keyColor', 'diagColor', 'grey', 'light'])
const strip = (v) => Array.isArray(v) ? v.map(strip) : v && typeof v === 'object' ? Object.fromEntries(Object.entries(v).filter(([k]) => !COLOR.has(k)).map(([k, x]) => [k, strip(x)])) : v
const recipeRef = 'x circle 0 -2.160 2.951; x circle 0 -0.705 1.439; x circle 0 -0.236 1.028; x circle 0 0.029 0.704; x circle 0 0.148 0.526; x circle 0 0.315 0.302; + bar 0 0.791 1 0.849; + bar 0.47 0.849 1 1; - circle 0.47 1 0.151; angle 0 0.315 -72; line 0 0.315 0.302 0.315; steps -0.2 0.617 0.849 4 x; label -0.035 0.31 y; label 0.435 1.01 0.50y'

export const SETS = [
  ['system', {}], ...[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => ['system', { random: n }]),
  ['system', { harmony: 'fifth 2:3', circles: 9, steps: 6 }], ['system', { join: 'flip', circles: 7 }], ['system', { invert: true }],
  ['system', { mirror: true, flip: true, angle: 30 }], ['system', { harmony: 'pentatonic', circles: 12, steps: 8, axisAt: 0.5 }],
  ['system', { foot: false, bar: false, y: 0.4, x: 0.09 }], ['system', { size: 1.4, footAt: 0.7, footSize: 1.2 }],
  ['system', { over: { y: 0.385, x: 0.037 } }], ['system', { harmony: 'lydian', y: 0.25, axisAt: 0.382 }],
  ['systemSeeds', {}], ['systemSeeds', { join: 'flip', construction: false, math: false }],
  ['construct', { seed: 20, shapes: 6, harmony: 'octave 1:2', size: 1.02 }], ['construct', { seed: 7, family: 'circles', combine: 'union' }],
  ['construct', { seed: 3, family: 'bars', slant: -30, combine: 'subtract', frame: 'wide' }], ['construct', { seed: 11, family: 'bands', combine: 'overlap', frame: 'tall', clip: false }],
  ['construct', { recipe: recipeRef, harmony: 'golden' }], ['constructSeeds', { harmony: 'golden', shapes: 3, construction: true }],
  ['tuner', {}], ['tuner', { preset: 'golden' }], ['tuner', { preset: 'faithful' }], ['tuner', { preset: 'fifth' }], ['tuner', { preset: 'bold' }], ['tuner', { preset: 'smooth', comb: true }],
  ['tuner', { strength: 1, curves: 'bezier', harmonize: true, drift: 0.5 }], ['tuner', { strength: 1, curves: 'circles', comb: true, combScale: 2.5 }],
  ['tuner', { grid: 'auto', strength: 0 }], ['tuner', { grid: 'hexagonal', gridStep: 2, gridTurn: 15 }], ['tuner', { corner: 'round', cornerSize: -3, strength: 1 }],
  ['tuner', { view: 'fitted', detail: 0.61, corners: 43 }], ['tuner', { view: 'original' }], ['tuner', { reset: true, preset: 'bold', detail: 0.9 }],
  ['tuner', { effect: 50, preset: 'golden', help: true }], ['tuner', { preset: 'custom', unit: 0.421, strength: 0.46, curves: 'bezier', harmonize: false, drift: 2.8 }],
  ['tuner', { harmony: 'major scale', strength: 1, raster: 1024 }], ['tuner', { preset: 'custom', unit: 1, corners: 10, detail: 0.69, strength: 1, size: 1.3 }],
  ['grid', ['square', 40, 0]], ['grid', ['isometric', 25, 10]], ['grid', ['hexagonal', 30, 0]], ['keylines', [576, '#f4f4f4', 12, -8]],
]

export function parity(port, ref) {
  let same = 0
  const diffs = []
  for (const [fn, a] of SETS) {
    const args = Array.isArray(a) ? a : [a]
    const p = JSON.stringify(strip(port[fn](...args))), r = JSON.stringify(strip(ref[fn](...args)))
    if (p === r) same++
    else { let i = 0; while (p[i] === r[i]) i++; diffs.push(fn + ' ' + JSON.stringify(a).slice(0, 60) + ' differs at ' + i + ': ' + p.slice(i, i + 40) + ' | ' + r.slice(i, i + 40)) }
  }
  return { sets: SETS.length, same, diffs }
}
