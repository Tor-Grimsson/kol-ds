/* LABS' ENGINE, for this chrome (the editor screen's engine.js is the same idea). The public entry gives a host its
 * providers and its output canvas; the state the real Labs chrome reads (the labs layer, the catalog, the presets, the
 * rolls, the palette, the transport) is not exported. It is reached here, in one file, through the SOURCE alias
 * (vite.config.js): `@design-editor-src/*` resolves to the very files `@kolkrabbi/design-editor` imports, so these are
 * the package's own instances, never a second copy. Nothing is copied out of the package. */
export { EditorProviders, OutputCanvas, setMediaClient, setSettingsStore } from '@kolkrabbi/design-editor'

export { useComposeState, resolveColor } from '@design-editor-src/editor/compose/state.jsx'
export { useLayerEdit } from '@design-editor-src/editor/compose/useLayerEdit.js'
export { useComposeFile } from '@design-editor-src/editor/compose/useComposeFile.js'
export { resolvedChain, MAX_FILTERS } from '@design-editor-src/editor/compose/filterChain.js'
export { effectCategories, categoryOf, presetParamOf, presetPatchFor, FX_RACK_GROUPS, rackGroupFilters, postProcessingFilters } from '@design-editor-src/editor/compose/inspectors/effectCategories.js'
export { FILTERS } from '@design-editor-src/filters/index.js'

export { useLabsLayer } from '@design-editor-src/editor/labs/useLabsLayer.js'
export { useLabsBoot } from '@design-editor-src/editor/labs/LabsView.jsx'
export { useLabsKeys } from '@design-editor-src/editor/labs/useLabsKeys.js'
export { buildLabsCatalog, SECTION_ICONS } from '@design-editor-src/editor/labs/catalog.js'
export { sheetLabels } from '@design-editor-src/editor/labs/sheetLabels.js'
export { stepPreset, STEP_KEYS, randomPresetPatch, nudgeSettings, canRandomLevel, randomEffectId, randomEffectPreset, canEffectLevel } from '@design-editor-src/editor/labs/presetStep.js'

export { groupById, loopById, presetsInGroup, presetsInSub, presetLayerPatch, presetParams, loopBgToggleable, groupOfPreset, presetById } from '@design-editor-src/loops/registry.js'
export { GENERATIVE_TREE, MISC_TREE, PICKER_TREE, LEGACY_GROUP_LABELS } from '@design-editor-src/loops/taxonomy.js'
export { themeParams } from '@design-editor-src/loops/theme.js'
export { aboutOf } from '@design-editor-src/loops/about.js'
export { THEME_OPTIONS, DEFAULT_THEME } from '@design-editor-src/editor/lib/themes.js'
export { RELATIONS, rollPalette, resolvePalette } from '@design-editor-src/editor/color/palette.js'
export { openColorModes } from '@design-editor-src/editor/color/ModalColorModes.jsx'
export { mulberry32, randomSeed } from '@design-editor-src/editor/lib/rng.js'
export { getAppSettings, setAppSetting, useAppSettings } from '@design-editor-src/editor/lib/appSettings.js'
export { stillToDataUrl } from '@design-editor-src/editor/lib/stillUpload.js'
export { ensureWebcam } from '@design-editor-src/editor/lib/webcam.js'
export { isTyping } from '@design-editor-src/editor/state/keymap.js'
export { useMorph } from '@design-editor-src/editor/morph/morphStore.js'

export { deriveScopes, tidyScopes, allScopeParams, computeRoll, useRollSeed, SEED_MIN_PARAMS } from '@design-editor-src/editor/params/rolls.jsx'
export { motionPresetsFor, axisKeys } from '@design-editor-src/editor/params/motionPresets.js'
export { lookPresetsFor } from '@design-editor-src/editor/params/lookPresets.js'
export { visibleParams, paramTab, paramSection } from '@design-editor-src/editor/params/schema.js'
export { isBinding, resolveValue } from '@design-editor-src/editor/params/resolve.js'
export { compileExpr } from '@design-editor-src/editor/params/expr.js'
export { getSource } from '@design-editor-src/editor/params/sources.js'
export { transport, useTransport, useTransportCtx } from '@design-editor-src/editor/params/transport.js'
export { enableAudio, disableAudio, audioSourceKind } from '@design-editor-src/editor/params/audioBands.js'
export { PHOTO_SCHEMA } from '@design-editor-src/editor/params/schemas/photo.js'
export { ASPECTS } from '@design-editor-src/editor/shell/aspects.js'
export { KINETIC_TREE, KINETIC_PRESETS } from '@design-editor-src/kinetic/presets.js'
