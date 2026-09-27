/**
 * The reference — examples, the language and usage notes for the expression engine, and the
 * presets and usage for ADSR (signal engine, 2026-09-27). DATA, one copy: before this the same
 * lists lived in kol-mirror's ExpressionReference, kol-monitor's Scope+ EX/REF popovers and the
 * design editor's labs shortcuts sheet, and had already drifted (mirror 20 examples, labs 9).
 * The expression sections are kol-mirror's `SECTIONS`, verbatim; the Functions rows gained the
 * helpers the engine took from labs (tan · atan2 · clamp · lerp · mod · frac · smooth · TAU · E).
 *
 * A row is `[code, label]`, or `{ codes, label }` for a multi-code row. `SignalReference` renders
 * any of these as tabs, popovers or a sheet.
 */

export const EXPRESSION_SECTIONS = {
  examples: { title: 'Examples', rows: [
    ['wave(t*2)', 'Fast sine'], ['saw(t)*0.8', 'Ramp to 80'], ['tri(t*0.5)', 'Slow bounce'], ['ease(t*2, 4)', 'Fast + punchy'],
    ['pulse(t*3)', 'Fast toggle'], ['pulse(t, 0.3)', 'PWM 30%'], ['sin(t)*30+50', 'Sine 20–80'], ['abs(sin(t*3))*max', 'Bouncing'],
    ['rand()', 'Noise'], ['t*20 % max', 'Linear ramp'], ['exp(t)', 'Exponential'], ['log(t)', 'Logarithmic'], ['bell(t)', 'Bell curve'],
    ['step(t, 4)', '4 steps'], ['step(t, 8)', '8 steps'], ['exp(t)*0.5+25', 'Exp 25–75'], ['bell(t*2)', 'Fast bell'],
    ['wave(t)+saw(t*2)*0.3', 'Layered'], ['tri(t)*pulse(t*4)', 'Gated bounce'], ['step(t, 6)*0.8+10', 'Steps 10–90'], ['ease(t*0.3, 3)*0.6+20', 'Slow dramatic'],
  ] },
  waves: { title: 'Waves', rows: [
    ['wave(t)', 'Smooth up and down'], ['saw(t)', 'Ramp up, jump back'], ['tri(t)', 'Ramp up, ramp down'], ['pulse(t)', 'Snap on/off'],
    ['rand()', 'Random every frame'], ['bell(t)', 'Bell curve'], ['exp(t)', 'Exponential ramp'], ['log(t)', 'Logarithmic ramp'], ['step(t, 4)', 'Staircase'],
  ] },
  functions: { title: 'Functions', grid: true, rows: [
    ['sin', '-1 to 1'], ['cos', '-1 to 1'], ['tan', 'Tangent'], ['atan2', 'Angle of y, x'], ['abs', 'Absolute'],
    ['floor', '↓ Round'], ['ceil', '↑ Round'], ['round', 'Nearest'], ['sqrt', '√'], ['pow', 'Power'],
    ['clamp', 'Hold in a, b'], ['lerp', 'a → b by u'], ['mod', 'Wrap, never negative'], ['frac', 'Fractional part'], ['smooth', 'Smoothstep 0…1'],
    ['PI', '3.14159'], ['TAU', '6.28318'], ['PHI', '1.61803'], ['E', '2.71828'],
  ] },
  variables: { title: 'Variables', rows: [
    { codes: ['t', 'f'], label: 'Second / Frame count' }, ['min', 'Knob minimum'], ['max', 'Knob maximum'],
  ] },
  curves: { title: 'Curves', rows: [
    ['ease(t)', 'Gentle breath'], ['ease(t, 1)', 'Linear, no curve'], ['ease(t, 5)', 'Dramatic punch'], ['ease(t, 0.5)', 'Quick flick'],
  ] },
  range: { title: 'Range', rows: [
    ['saw(t)*0.8', '0 to 80'], ['wave(t)*0.5+25', '25 to 75'], ['tri(t)*0.3+70', '70 to 100'], ['ease(t)*0.2', '0 to 20'],
  ] },
  speed: { title: 'Speed', rows: [
    ['wave(t*0.5)', 'Half speed'], ['saw(t*2)', 'Double speed'], ['tri(t*3)', '3x faster'], ['ease(t*5)', '5x faster'], ['pulse(t*0.1)', 'Very slow'],
  ] },
  tips: { title: 'Tips', tips: [
    '→ Click numbers for expression input',
    '→ Alt+click number to reset',
    '→ Cmd+click expression to append to oscilloscope',
  ] },
}

/* kol-mirror's fold: Examples alone; Language = what the language has; Usage = how to shape it.
 * `saved` is the host's own list (a library) — the component renders what it is handed. */
export const EXPRESSION_TABS = [
  { id: 'examples', label: 'Examples', sections: ['examples'] },
  { id: 'saved', label: 'Saved', sections: [] },
  { id: 'language', label: 'Language', sections: ['waves', 'functions', 'variables'] },
  { id: 'usage', label: 'Usage', sections: ['curves', 'range', 'speed', 'tips'] },
]

/* ADSR — a preset is `{ id, label, params }`, knob values 0…100. */
export const ADSR_PRESETS = [
  { id: 'pluck', label: 'Pluck', params: { attack: 0, decay: 12, sustain: 0, release: 10 } },
  { id: 'pad', label: 'Pad', params: { attack: 60, decay: 40, sustain: 80, release: 70 } },
  { id: 'swell', label: 'Swell', params: { attack: 85, decay: 10, sustain: 100, release: 40 } },
  { id: 'gate', label: 'Gate', params: { attack: 0, decay: 0, sustain: 100, release: 0 } },
  { id: 'stab', label: 'Stab', params: { attack: 2, decay: 25, sustain: 30, release: 15 } },
  { id: 'fade', label: 'Slow fade', params: { attack: 5, decay: 90, sustain: 0, release: 90 } },
]

export const ADSR_SECTIONS = {
  presets: { title: 'Presets', rows: ADSR_PRESETS.map((p) => [p.id, p.label]) },
  stages: { title: 'Stages', rows: [
    ['A', 'Attack — rise to full'], ['D', 'Decay — fall to sustain'], ['S', 'Sustain — held while the gate is open'], ['R', 'Release — fall to zero after the gate'],
  ] },
  timing: { title: 'Timing', rows: [
    ['0', '5 ms'], ['50', '≈ 1 s'], ['100', '2 s'],
  ] },
  tips: { title: 'Tips', tips: [
    '→ Sustain is a level, not a time',
    '→ Gate holds sustain; a trigger runs A → D → R once',
    '→ With sustain 0, a trigger folds D and R into one long decay',
    '→ Cycle loops the whole envelope',
  ] },
}

export const ADSR_TABS = [
  { id: 'presets', label: 'Presets', sections: ['presets'] },
  { id: 'saved', label: 'Saved', sections: [] },
  { id: 'usage', label: 'Usage', sections: ['stages', 'timing', 'tips'] },
]
