/* THE RANDOMISER'S ENGINE for kolbox (round 4, W11): what the real MobileView and MobileOverlay read
 * (packages/design-editor/src/editor/mobile) that Labs' seam (../labs/engine.js) does not already give, reached through the
 * same SOURCE alias, so these are the package's own instances. Labs' seam is shared, so this file adds beside it rather
 * than in it. */
export * from '../labs/engine.js'
export { firstPresetPatch } from '../../../loops/registry.js'
export { computePresetRoll, computeFilterRoll } from '../../params/rolls.jsx'
export { effectHost, flatCategories } from '../../compose/inspectors/effectCategories.js'
export { GROUP_ICONS } from '../../labs/catalog.js'
export { PRESET_SIZES } from '../../shell/aspects.js'
export { CANVAS_W } from '../../compose/state.jsx'
export { pack } from '../../packs.js'
