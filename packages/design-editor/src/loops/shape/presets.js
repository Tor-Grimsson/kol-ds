// Simple (shape) loops — the base draw-fn modules + the picker presets. A preset
// names a base loop + a partial param override; the picker lists presets, the
// player resolves `{...loopDefaults(loop), ...preset.params}`. Add a base loop to
// SHAPE_LOOPS, add picker entries to SHAPE_PRESETS.

import morphCircle from './morphCircle.js'
import squareToCircle from './squareToCircle.js'
import barsWave from './barsWave.js'
import ringPulse from './ringPulse.js'
import lissajous from './lissajous.js'
import spiral from './spiral.js'
import starMorph from './starMorph.js'
import orbitDots from './orbitDots.js'
import waveGrid from './waveGrid.js'
import checkerPulse from './checkerPulse.js'
import arcSweep from './arcSweep.js'
import concentricArcs from './concentricArcs.js'
import rose from './rose.js'
import gridRotor from './gridRotor.js'
import blob from './blob.js'
import radialBars from './radialBars.js'
import slicedSolid from './slicedSolid.js'
import cubeLattice from './cubeLattice.js'
import signalSpikes from './signalSpikes.js'
import signalBars from './signalBars.js'
import signalRing from './signalRing.js'
import signalMonitor from './signalMonitor.js'
import signalSteps from './signalSteps.js'
import dotWarp from './dotWarp.js'
import recordTape from './recordTape.js'

export const SHAPE_LOOPS = [
  morphCircle, squareToCircle, barsWave, ringPulse, lissajous, spiral,
  starMorph, orbitDots, waveGrid, checkerPulse, arcSweep, concentricArcs,
  rose, gridRotor, blob, radialBars, slicedSolid, cubeLattice,
  signalSpikes, signalBars, signalRing, signalMonitor, signalSteps, dotWarp, recordTape,
]

const P = (id, label, loop, params = {}, sub) => ({ id, label, loop, params, sub })
/* the navy boards' lattice: 112 x 128 cells from 24 px, dashed 8 on 8, nodes that pulse, no growing waves */
const CUBE_DASH = {
  speed: 1, scroll: 0, loopLength: 106 / 3, start: 2, cubes: 1440 / 224, margin: 0, cubeHeight: 128 / 112, whole: false, offsetX: -88, offsetY: 24,
  breath: 0, line: 1, lineOpacity: 0.9, roundJoins: false, dash: 8, dashGap: 8, dashSpeed: 24, waves: false,
  nodes: true, nodeLine: 1, nodeDot: 3 / 14,
}

export const SHAPE_PRESETS = [
  // Discs
  P('circle-morph', 'Circle morph', 'morph-circle', {}, 'Discs'),
  P('circle-warm', 'Circle morph ember', 'morph-circle', { colA: '#f6c453', colB: '#7a1f12' }, 'Discs'),
  P('square-circle', 'Square ↔ circle', 'square-circle', {}, 'Discs'),
  P('star-classic', 'Star morph', 'star-morph', {}, 'Discs'),
  P('star-7', 'Heptagram', 'star-morph', { points: 7, colB: '#3a6ea5' }, 'Discs'),
  P('blob-soft', 'Blob', 'blob', {}, 'Discs'),
  P('blob-spiky', 'Blob spiky', 'blob', { amp: 0.34, lobes: 6, colA: '#2a8f8f', colB: '#f4f1ea' }, 'Discs'),
  // Curves
  P('lissajous-32', 'Lissajous 3:2', 'lissajous', { a: 3, b: 2 }, 'Curves'),
  P('lissajous-54', 'Lissajous 5:4', 'lissajous', { a: 5, b: 4, dot: '#7fd1ff' }, 'Curves'),
  P('spiral-arch', 'Spiral', 'spiral', {}, 'Curves'),
  P('spiral-tight', 'Spiral tight', 'spiral', { turns: 8, spin: 2, colB: '#c2502e' }, 'Curves'),
  P('rose-5', 'Rose 5', 'rose-curve', { k: 5 }, 'Curves'),
  P('signal-monitor', 'Monitor, three waves', 'signal-monitor', {}, 'Curves'),
  P('signal-monitor-one', 'Monitor, one wave', 'signal-monitor', { waves: 1, amp1: 0.35, cycles1: 1.5, dots1: 48, dot1: 0.012, cols: 40, rows: 16 }, 'Curves'),
  P('signal-monitor-dots', 'Monitor, dots only', 'signal-monitor', { line: 0, gridLine: 0, dots1: 200, dots2: 200, dots3: 200, dot3: 0.006 }, 'Curves'),
  P('rose-4', 'Rose 4', 'rose-curve', { k: 4, colB: '#c2502e' }, 'Curves'),
  // Rings
  P('signal-ring', 'Ring, three circles', 'signal-ring', {}, 'Rings'),
  P('signal-ring-fine', 'Ring, fine', 'signal-ring', { spokes: 180, w1: 0.001, w2: 0.003, w3: 0.007, off2: 0.2, off3: 0.06 }, 'Rings'),
  P('signal-ring-bold', 'Ring, bold', 'signal-ring', { spokes: 36, w1: 0.006, w2: 0.02, w3: 0.045, r1: 0.3, r2: 0.55, r3: 0.75, flare: 0.4 }, 'Rings'),
  P('ring-pulse', 'Ring pulse', 'ring-pulse', {}, 'Rings'),
  P('ring-dense', 'Ring pulse dense', 'ring-pulse', { rings: 28, weight: 2.5, colB: '#7fd1ff' }, 'Rings'),
  P('concentric', 'Concentric arcs', 'concentric-arcs', {}, 'Rings'),
  P('concentric-wide', 'Concentric wide', 'concentric-arcs', { rings: 4, gap: 0.5, spin: 2, colB: '#3a6ea5' }, 'Rings'),
  // Grids
  P('bars-wave', 'Bars wave', 'bars-wave', {}, 'Grids'),
  P('wave-grid', 'Wave grid', 'wave-grid', {}, 'Grids'),
  P('checker-pulse', 'Checker pulse', 'checker-pulse', {}, 'Grids'),
  P('grid-rotor', 'Grid rotor', 'grid-rotor', {}, 'Grids'),
  /* the Atlas Cube Motion boards (W29.3), their mechanism only: white-05-tuned, white-06-nodes, blue-01-pulse and
     blue-01-sweep as settings; colours stay the theme's. Loop length is where each board's own speeds close: white 70.6 s (its scroll, waves and breath exactly), navy 35.3 s (its dashes and pulse). */
  P('cube-waves', 'Cube waves', 'cube-lattice', {}, 'Grids'),
  P('cube-waves-nodes', 'Cube waves with nodes', 'cube-lattice', { nodes: true }, 'Grids'),
  /* white-01-slow (C7): one slow wave a loop, each cube nested at 0.82 with a ring opening out of it, then fading */
  /* signal-11-live-bridge (C7): a dot lattice read from your shape or image */
  P('dot-warp', 'Dot warp', 'dot-warp', {}, 'Grids'),
  P('dot-warp-star', 'Dot warp, star', 'dot-warp', { fieldSource: 'star', fieldSoften: 0.08, shift: 1.4, dotMax: 0.7 }, 'Grids'),
  P('dot-warp-fine', 'Dot warp, fine ring', 'dot-warp', { fieldSource: 'ring', fieldInvert: true, cols: 101, rows: 101, dotMin: 0.04, dotMax: 0.5, shift: 1, breath: 0.3 }, 'Grids'),
  P('cube-grow-slow', 'Cube grow, slow', 'cube-lattice', {
    speed: 1, scroll: 0, loopLength: 17.5, cubes: 10.5, margin: 84, breath: 0, sweep: 1.6, spacing: 22,
    nest: 0.82, ring: 0.15, fade: true, fadeAt: 8.5, fadeLength: 2.5,
  }, 'Grids'),
  P('cube-dash-pulse','Cube dashes, pulse', 'cube-lattice', CUBE_DASH, 'Grids'),
  P('cube-dash-band', 'Cube dashes, lit band', 'cube-lattice', { ...CUBE_DASH, pulse: 0, nodeDot: 0, band: true }, 'Grids'),
  // Lines
  P('arc-sweep', 'Arc sweep', 'arc-sweep', {}, 'Lines'),
  P('arc-double', 'Arc sweep double', 'arc-sweep', { turns: 2, sweep: '#f6c453' }, 'Lines'),
  P('radial-bars', 'Radial bars', 'radial-bars', {}, 'Lines'),
  P('radial-fan', 'Radial bars fan', 'radial-bars', { count: 48, waves: 5, colB: '#f6c453' }, 'Lines'),
  /* the Atlas signal set (C7), mechanism only: the boards' numbers as settings, the theme's colours */
  P('signal-spikes', 'Spikes, mirrored', 'signal-spikes', {}, 'Lines'),
  P('signal-spikes-hang', 'Spikes, hanging', 'signal-spikes', { flip: true, mirror: false }, 'Lines'),
  P('signal-spikes-dense', 'Spikes, dense', 'signal-spikes', { columns: 61, spread: 0.9, steps: 4, edge: 0.3, travel: 0.2, delay: 1.2, speed: 1 }, 'Lines'),
  P('signal-steps', 'Steps, tiers', 'signal-steps', {}, 'Lines'),
  P('signal-steps-ramp', 'Steps, ramp', 'signal-steps', { lengths: '0.2 0.35 0.5 0.65 0.8 1', rows: 12, depth: 0.4 }, 'Lines'),
  P('signal-steps-bold', 'Steps, bold', 'signal-steps', { lengths: '1 0.6 0.85', rows: 3, block: 0.8, bar: 0.4, thin: 0.12, blockEnd: 0.6, barEnd: 0.82 }, 'Lines'),
  /* web-08-record-card (C7): the tape of runs, your values or rolled ones */
  P('record-tape', 'Record tape', 'record-tape', {}, 'Lines'),
  P('record-tape-close', 'Record tape, close', 'record-tape', { shown: 21, step: 0.04, dot: 0.42, loopLength: 40.9, play: 2.2 }, 'Lines'),
  P('record-tape-plain', 'Record tape, plain', 'record-tape', { runs: 60, seed: 41, week: 0, flags: false, tips: 0.5, breath: 0.3, loopLength: 27.3 }, 'Lines'),
  P('signal-bars', 'Bars, two waves', 'signal-bars', {}, 'Lines'),
  P('signal-bars-tall', 'Bars, long blocks', 'signal-bars', { columns: 13, blocks: 2, length: 0.8, ampLen: 0.12, ampTop: 0.2, spread: 0.5, blockWidth: 0.7 }, 'Lines'),
  P('signal-bars-rain', 'Bars, rain', 'signal-bars', { columns: 48, blocks: 7, spread: 0.9, height: 1, length: 0.3, line: 0, blockWidth: 0.4, freqTop: 0.9, speedTop: 1.1 }, 'Lines'),
  // Particles
  P('orbit-dots', 'Orbit dots', 'orbit-dots', {}, 'Particles'),
  P('orbit-dense', 'Orbit dots dense', 'orbit-dots', { rings: 9, dotsPer: 3, dotR: 5, colB: '#7fd1ff' }, 'Particles'),
  P('orbit-wide', 'Orbit dots wide', 'orbit-dots', { rings: 4, dotsPer: 5, dotR: 11, colB: '#c2502e' }, 'Particles'),
  /* SLICED — a solid of revolution cut into translucent discs (plan 51 W2), presets after the user's references */
  P('sliced-bloom', 'Bloom', 'sliced-solid', { bgOn: true, bg: '#e6a2e2', colA: '#ff86cf', colB: '#e3233f', colC: '#6b4cff', shape: 'capsule', slices: 11, tilt: 30, width: 0.84, discAlpha: 0.34 }, 'Sliced'),
  P('sliced-tunnel', 'Tunnel', 'sliced-solid', { bgOn: true, bg: '#e6a2e2', colA: '#ff86cf', colB: '#f0457a', colC: '#6b4cff', shape: 'capsule', slices: 14, tilt: 34, width: 0.8, discAlpha: 0.26 }, 'Sliced'),
  P('sliced-lens', 'Lens', 'sliced-solid', { bgOn: true, bg: '#eaa6e6', colA: '#f6a0e4', colB: '#ff4f86', colC: '#7a5cff', shape: 'sphere', slices: 9, tilt: 36, width: 0.86, discAlpha: 0.24 }, 'Sliced'),
  P('sliced-dark-core', 'Dark core', 'sliced-solid', { bgOn: true, bg: '#e6a2e2', colA: '#5a1030', colB: '#d01534', colC: '#f07ad0', shape: 'capsule', slices: 13, tilt: 28, width: 0.84, discAlpha: 0.36 }, 'Sliced'),
  P('sliced-dome', 'Dome', 'sliced-solid', { bgOn: true, bg: '#e6a2e2', colA: '#ff86cf', colB: '#e3233f', colC: '#f6b8ee', shape: 'capsule', inner: 'dome', innerScale: 0.6, slices: 12, tilt: 30, width: 0.86, discAlpha: 0.242 }, 'Sliced'),
]
