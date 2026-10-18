/* MONITOR'S REAL CONTENT, copied 2026-10-18 from kol-monitor (user: *"loook at monitor search content ANND USE THAT AS A
 * FUCKING DEMO CONTENT"*) — `src/modules/registry.js` (label · hp · u · category) and `src/data/shortcuts.js`.
 * A snapshot: re-copy when monitor's lists change. */

export const CATEGORIES = ['control', 'math', 'generators', 'display', 'utility']

export const MODULES = [{"id": "clock", "label": "Clock", "hp": 4, "u": 3, "category": "control"}, {"id": "clockDiv", "label": "Clk Div", "hp": 4, "u": 3, "category": "control"}, {"id": "lfo", "label": "LFO", "hp": 6, "u": 3, "category": "control"}, {"id": "envelope", "label": "Envelope", "hp": 6, "u": 3, "category": "control"}, {"id": "sequencer", "label": "Sequencer", "hp": 16, "u": 3, "category": "control"}, {"id": "constant", "label": "Constant", "hp": 4, "u": 1, "category": "control"}, {"id": "logic", "label": "Logic", "hp": 8, "u": 1, "category": "control"}, {"id": "comparator", "label": "Comparator", "hp": 6, "u": 1, "category": "control"}, {"id": "sampleHold", "label": "S&H", "hp": 6, "u": 1, "category": "control"}, {"id": "pen", "label": "Pen", "hp": 6, "u": 3, "category": "control"}, {"id": "joystick", "label": "Joystick", "hp": 12, "u": 1, "category": "control"}, {"id": "expression", "label": "Expr", "hp": 20, "u": 1, "category": "control"}, {"id": "mult", "label": "Mult", "hp": 8, "u": 1, "category": "math"}, {"id": "attenuator", "label": "Atten", "hp": 26, "u": 1, "category": "math"}, {"id": "vca", "label": "VCA", "hp": 8, "u": 1, "category": "math"}, {"id": "quadVca", "label": "QVCA", "hp": 16, "u": 3, "category": "math"}, {"id": "switch", "label": "Switch", "hp": 10, "u": 1, "category": "math"}, {"id": "quantizer", "label": "Quantizer", "hp": 4, "u": 1, "category": "math"}, {"id": "ruttEtra", "label": "Rutt/Etra", "hp": 10, "u": 3, "category": "math"}, {"id": "colorize", "label": "Colorize", "hp": 8, "u": 1, "category": "math"}, {"id": "scaleOfs", "label": "Scale/Ofs", "hp": 4, "u": 1, "category": "math"}, {"id": "window", "label": "Window", "hp": 8, "u": 1, "category": "math"}, {"id": "ringMod", "label": "Ring Mod", "hp": 6, "u": 1, "category": "math"}, {"id": "waveshaper", "label": "Waveshaper", "hp": 6, "u": 3, "category": "math"}, {"id": "delay", "label": "Delay", "hp": 6, "u": 3, "category": "math"}, {"id": "reverb", "label": "Ghost", "hp": 10, "u": 1, "category": "math"}, {"id": "mixer", "label": "Mixer", "hp": 6, "u": 3, "category": "math"}, {"id": "maths", "label": "Maths", "hp": 20, "u": 3, "category": "math"}, {"id": "filter", "label": "Filter", "hp": 6, "u": 3, "category": "math"}, {"id": "transform", "label": "Xform", "hp": 6, "u": 3, "category": "math"}, {"id": "magneto", "label": "Magneto", "hp": 28, "u": 3, "category": "math"}, {"id": "kaleidoscope", "label": "Kaleido", "hp": 10, "u": 3, "category": "math"}, {"id": "s2v", "label": "S2V", "hp": 8, "u": 1, "category": "math"}, {"id": "v2s", "label": "V2S", "hp": 4, "u": 1, "category": "math"}, {"id": "rgb", "label": "RGB Osc", "hp": 8, "u": 3, "category": "generators"}, {"id": "waveform", "label": "Waveform", "hp": 6, "u": 3, "category": "generators"}, {"id": "wireframe", "label": "Gen 3D", "hp": 8, "u": 3, "category": "generators"}, {"id": "noise", "label": "Noise", "hp": 22, "u": 1, "category": "generators"}, {"id": "ramp", "label": "Ramp", "hp": 6, "u": 1, "category": "generators"}, {"id": "smx3", "label": "SMX3", "hp": 8, "u": 3, "category": "generators"}, {"id": "lineGen", "label": "LineGen", "hp": 6, "u": 3, "category": "generators"}, {"id": "radialGen", "label": "Radial", "hp": 12, "u": 3, "category": "generators"}, {"id": "modGen", "label": "Modulator", "hp": 14, "u": 3, "category": "generators"}, {"id": "generator", "label": "Gen Lofi", "hp": 10, "u": 3, "category": "generators"}, {"id": "generator2", "label": "Gen Hifi", "hp": 10, "u": 3, "category": "generators"}, {"id": "dither", "label": "Dither", "hp": 14, "u": 3, "category": "generators"}, {"id": "svg", "label": "SVG", "hp": 10, "u": 1, "category": "generators"}, {"id": "life", "label": "Life", "hp": 12, "u": 3, "category": "generators"}, {"id": "scope", "label": "Scope", "hp": 16, "u": 1, "category": "display"}, {"id": "oscilloscope", "label": "Scope+", "hp": 28, "u": 3, "category": "display"}, {"id": "monitor", "label": "Monitor", "hp": 12, "u": 3, "category": "display"}, {"id": "raster", "label": "Raster", "hp": 12, "u": 3, "category": "display"}, {"id": "slitEcho", "label": "Slit-Echo", "hp": 24, "u": 3, "category": "display"}, {"id": "output", "label": "Output", "hp": 16, "u": 3, "category": "display"}, {"id": "console", "label": "Console", "hp": 48, "u": 3, "category": "display"}, {"id": "recorder", "label": "Recorder", "hp": 20, "u": 3, "category": "display"}, {"id": "patch", "label": "Patch", "hp": 6, "u": 1, "category": "utility"}, {"id": "power", "label": "Power", "hp": 4, "u": 1, "category": "utility"}, {"id": "perf", "label": "Perf", "hp": 4, "u": 1, "category": "utility"}]

export const KEYMAP = [
  {
    section: 'App',
    items: [
      { label: 'Go to page', combo: '⌥ then 1–5' },
      { label: 'Settings', combo: ',' },
    ],
  },
  {
    section: 'Rack',
    routes: ['/rack'],
    items: [
      { label: 'Shortcuts', combo: 'S' },
      { label: 'Sidebar', combo: 'H' },
      { label: 'Add module', combo: '⌘ K' },
      { label: 'Edit mode', combo: 'E' },
      { label: 'Mute all', combo: 'M' },
    ],
  },
  {
    section: 'Stage',
    routes: ['/stage'],
    items: [
      { label: 'Modules', combo: 'H' },
    ],
  },
  {
    section: 'Cables',
    routes: ['/rack'],
    items: [
      { label: 'Cable lock', combo: 'C' },
      { label: 'Cable visibility', combo: 'O' },
      { label: 'Patch table', combo: 'P' },
      { label: 'Clear display', combo: 'D' },
    ],
  },
  {
    section: 'View',
    routes: ['/rack'],
    items: [
      { label: 'Lock view', combo: 'L' },
      { label: 'Zoom in / out', combo: '+ / −' },
      { label: 'Reset zoom', combo: '0' },
      { label: 'Snap positions', combo: '1–9' },
    ],
  },
  {
    section: 'Pointer',
    routes: ['/rack'],
    items: [
      { label: 'Pan', combo: 'Space' },
      { label: 'Zoom', combo: 'Alt+Scroll' },
      { label: 'Pan', combo: 'Scroll' },
      { label: 'Joystick axis lock', combo: 'Shift' },
    ],
  },
]
