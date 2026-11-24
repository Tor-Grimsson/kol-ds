/* MORPH'S ENGINE for kolbox: the package's morph (store, presets, the tween and the outline pairing), reached through the
 * same SOURCE alias as ../labs/engine.js (plan W5), so these are the package's own instances. */
export { useMorph, getMorph, setMorph, resetMorph, addStep, updateStep, removeStep, reorderStep, pickParams, stepLabel } from '../../morph/morphStore.js'
export { stepFromPreset, stepFromLayer } from '../../morph/StepPicker.jsx'
export { MORPH_TYPES, morphPresets, morphPresetById, firstMorphPreset } from '../../morph/presets.js'
export { buildMorph, keysFor, loopSnapshot, CURVES, CYCLES } from '../../morph/buildMorph.js'
export { hasOutline, canCrossfade, morphKeys } from '../../morph/shape.js'
export { PRESETS, isToolPreset } from '../../../loops/registry.js'
export { useTransportPlaying } from '../../params/transport.js'
/* the file library and its Files window: the package's own (Save writes here, the window lists and opens) */
export { useGeneratorLibrary, loadLibrary } from '../../library/LibraryProvider.jsx'
export { default as FilesDialog } from '../../library/FilesDialog.jsx'
export { useFilesDialog, openFiles, closeFiles } from '../../library/filesDialogStore.js'
export { matchCombo } from '../../state/keymap.js'
/* the timeline's rows, as the real Timeline names them and adds a key at the head (round 4, W4) */
export { rowLabelForLayer } from '../../compose/labels.js'
export { sampleTrack } from '../../params/Timeline.jsx'
