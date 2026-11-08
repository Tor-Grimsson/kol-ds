import { TAU } from '../lib/util.js'

// The distress MODES — the per-point offset recipes and their option list, out of the vector-distress
// loop (loops/distress/engine.js) so the core's vector effects (vectorEffects.js) use them without
// reaching the generators pack. The loop imports them back from here.

/* seeded 0..1 — the source's sin-hash */
const random = (v) => {
  const x = Math.sin(v) * 10000
  return x - Math.floor(x)
}

/* the source's getModeOffset, verbatim recipes; uPhase is the one addition
 * (a whole-TAU phase advance per loop, so wave modes animate seamlessly) */
export const modeOffset = (mode, index, t, strength, freq, seed, uPhase) => {
  const base = random(seed + index * 12.9898)
  const alt = random(seed * 2.133 + index * 78.233)
  const a = base - 0.5
  const b = alt - 0.5
  const phase = (t * freq * 2 + seed * 0.1) * Math.PI + uPhase

  if (mode === 'noise') return { dx: Math.sin(phase) * strength, dy: Math.cos(phase) * strength }
  if (mode === 'jitter') return { dx: a * strength, dy: b * strength }
  if (mode === 'hand') return { dx: Math.sin(phase * 0.6) * strength * 0.8, dy: Math.sin(phase * 0.9) * strength * 0.8 }
  if (mode === 'roughen') {
    return { dx: (Math.round(a * 4) / 4) * strength * 1.2, dy: (Math.round(b * 4) / 4) * strength * 1.2 }
  }
  if (mode === 'tear') {
    const saw = ((t * freq * 0.6 + uPhase / TAU) % 1 + 1) % 1
    const spike = base > 0.86 ? 1.8 : 1
    return { dx: (saw - 0.5) * strength * 2.2 * spike, dy: b * strength * 0.6 * spike }
  }
  if (mode === 'ink-spread') return { dx: a * strength * 0.4, dy: b * strength * 0.4 }
  if (mode === 'offset') {
    const angle = (seed % 360) * (Math.PI / 180)
    return {
      dx: Math.cos(angle) * strength * 0.6 + a * strength * 0.2,
      dy: Math.sin(angle) * strength * 0.6 + b * strength * 0.2,
    }
  }
  /* print-press — the source's default branch */
  const spike = base > 0.9 ? 1.7 : 0.9
  return { dx: a * strength * spike, dy: b * strength * spike }
}

export const MODE_OPTIONS = [
  { value: 'print-press', label: 'Print press' },
  { value: 'noise', label: 'Noise' },
  { value: 'jitter', label: 'Jitter' },
  { value: 'hand', label: 'Hand-drawn' },
  { value: 'roughen', label: 'Roughen' },
  { value: 'tear', label: 'Torn edge' },
  { value: 'ink-spread', label: 'Ink spread' },
  { value: 'offset', label: 'Misregister' },
]
