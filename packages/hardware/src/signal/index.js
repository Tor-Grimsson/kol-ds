// @kolkrabbi/kol-hardware/signal — the signal engine: plain JS, no React. One expression compiler
// and one ADSR for every scope, envelope and animated value in the estate, plus the reference
// they are explained with.
export { compileExpression, isExpression, fitRange, EXPRESSION_HELPERS } from './expression.js'
export { envelopeAt, envelopeLength, gateSeconds, createEnvelope, stageSeconds, toRange, ADSR_DEFAULTS } from './adsr.js'
export { EXPRESSION_SECTIONS, EXPRESSION_TABS, ADSR_PRESETS, ADSR_SECTIONS, ADSR_TABS } from './reference.js'
// the transport — one clock, its loop window, shaped time (2026-10-28, kol-mirror's + kol-fxr's)
export { createTransport, seekToSeconds, TRANSPORT_MODES, TRANSPORT_DEFAULTS } from './transport.js'
