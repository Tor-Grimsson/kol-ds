/* THE LIBRARY'S ENGINE for kolbox (round 4, W10): what the real Library page reads (apps/editor-hub's pages/Library.jsx:
 * the loops registry and the kinetic presets) and the package's own shipped files and file library, reached through the
 * SOURCE alias as ../home/engine.js does, so these are the package's own instances. */
export { PRESETS, GROUPS, groupOfPreset, presetById, presetLayerPatch } from '@design-editor-src/loops/registry.js'
export { KINETIC_PRESETS, presetComp } from '@design-editor-src/kinetic/presets.js'
export { listShipped, renameShipped, removeShipped, subscribeShipped, readShippedRaw } from '@design-editor-src/editor/library/shipped.js'
export { GeneratorLibraryProvider, useGeneratorLibrary } from '@design-editor-src/editor/library/LibraryProvider.jsx'
export { CANVAS_W, CANVAS_H } from '@design-editor-src/editor/compose/state.jsx'
export { getAppSettings } from '@design-editor-src/editor/lib/appSettings.js'
