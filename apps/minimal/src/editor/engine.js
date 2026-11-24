/* THE EDITOR'S ENGINE, for this chrome (Labs' engine.js is the same idea). The public entry gives a host its providers;
 * the state the real editor chrome reads (the compose store, the tools, the workspace, the paint pair, the zoom, the
 * menus' verbs, the canvas with its rulers) is not exported. It is reached here, in one file, through the SOURCE alias
 * (vite.config.js): `@design-editor-src/*` resolves to the very files `@kolkrabbi/design-editor` imports, so these are
 * the package's own instances, never a second copy. Nothing is copied out of the package; every line below is a gap
 * the package can close by exporting it. */
export { EditorProviders, setMediaClient, setSettingsStore } from '@kolkrabbi/design-editor'

export { useComposeState, layerTypes, resolveColor, COVER_TYPES, CANVAS_W, CANVAS_H } from '@design-editor-src/editor/compose/state.jsx'
export { findLayerDeep } from '@design-editor-src/editor/compose/helpers.js'
export { useLayerEdit } from '@design-editor-src/editor/compose/useLayerEdit.js'
export { useComposeFile } from '@design-editor-src/editor/compose/useComposeFile.js'
export { rowLabelForLayer, TYPE_LABELS, BOOL_OP_LABELS } from '@design-editor-src/editor/compose/labels.js'
export { BLEND_MODES } from '@design-editor-src/editor/compose/LayerStackView.jsx'
export { isBooleanable } from '@design-editor-src/editor/compose/boolean-ops.js'
export { blendLayers, canBlend } from '@design-editor-src/editor/compose/blend.js'
export { canMask } from '@design-editor-src/editor/compose/masks.js'
export { scalePathNodes } from '@design-editor-src/editor/compose/path-math.js'
export { buildLayersSvg } from '@design-editor-src/editor/compose/build.js'
export { docOf, isDirty, markSaved, useSavedMark } from '@design-editor-src/editor/compose/savedMark.js'
export { resolvedChain, MAX_FILTERS } from '@design-editor-src/editor/compose/filterChain.js'
export { effectHost, flatCategories, presetParamOf, presetPatchFor } from '@design-editor-src/editor/compose/inspectors/effectCategories.js'
export { VECTOR_FX_SCHEMA } from '@design-editor-src/editor/compose/vectorEffects.js'
/* the canvas: the real one, with its rulers, frame, aspect label, tools and the menus' `kol:command` verbs */
export { default as CanvasArea } from '@design-editor-src/editor/compose/CanvasArea.jsx'
/* the package's own windows, mounted as the real editor mounts them (their look is the package's) */
export { default as ModalLayerEffects } from '@design-editor-src/editor/shell/ModalLayerEffects.jsx'
export { default as ShortcutsOverlay } from '@design-editor-src/editor/shell/ShortcutsOverlay.jsx'
export { default as FilesDialogHost } from '@design-editor-src/editor/library/FilesDialogHost.jsx'

export { useTool, TOOL_META } from '@design-editor-src/editor/state/tools.jsx'
export { shortcutById, comboLabel } from '@design-editor-src/editor/state/keymap.js'
export { useGlobalShortcuts } from '@design-editor-src/editor/state/useGlobalShortcuts.js'
export { seedWorkspace, useWorkspace, setActive, applyWorkspace, currentWorkspaceName, resetWorkspace, saveWorkspace } from '@design-editor-src/editor/state/workspace.js'
export { composePanes, composeTabs, WorkspaceEffects } from '@design-editor-src/editor/shell/panels/tabs.jsx'
export { openTab } from '@design-editor-src/editor/shell/openTab.js'
export { useZoom } from '@design-editor-src/editor/shell/zoomStore.js'
export { ASPECTS } from '@design-editor-src/editor/shell/aspects.js'
export { useEffectTarget } from '@design-editor-src/editor/shell/LiveFilterRows.jsx'

export { useColorTarget } from '@design-editor-src/editor/color/useColorTarget.js'
export { pickFromCanvas } from '@design-editor-src/editor/color/canvasEyedropper.js'
export { resolveCssVar } from '@design-editor-src/editor/color/cssVar.js'
export { openColorModes } from '@design-editor-src/editor/color/ModalColorModes.jsx'

export { getAppSettings } from '@design-editor-src/editor/lib/appSettings.js'
export { transport, useTransport } from '@design-editor-src/editor/params/transport.js'
export { paramTab } from '@design-editor-src/editor/params/schema.js'
export { deriveScopes, tidyScopes, SEED_MIN_PARAMS, allScopeParams, computeRoll, useRollSeed } from '@design-editor-src/editor/params/rolls.jsx'
export { toggleDots, useBindDots } from '@design-editor-src/editor/params/dotVisibility.js'
export { toggleTimelinePinned, useTimelinePinned } from '@design-editor-src/editor/params/timelinePinned.js'
export { SHAPE_SCHEMA } from '@design-editor-src/editor/params/schemas/shape.js'
export { PATTERN_SCHEMA } from '@design-editor-src/editor/params/schemas/pattern.js'
export { TEXT_SCHEMA } from '@design-editor-src/editor/params/schemas/text.js'
export { PHOTO_SCHEMA } from '@design-editor-src/editor/params/schemas/photo.js'
export { TEXT_TAB_KEYS } from '@design-editor-src/editor/compose/inspectors/TextPanel.jsx'
export { editLayer } from '@design-editor-src/editor/generate/store.js'

export { useGeneratorLibrary } from '@design-editor-src/editor/library/LibraryProvider.jsx'
export { STARTERS } from '@design-editor-src/editor/library/starters.js'
export { openFiles } from '@design-editor-src/editor/library/filesDialogStore.js'
export { listMedia, mediaSrc, isImageType, bucketOptions, DEFAULT_BUCKET } from '@design-editor-src/editor/library/mediaLibrary.js'
export { goMode, navigateTo } from '@design-editor-src/editor/mode.js'
export { layerFamily, isOutlineFamily } from '@design-editor-src/editor/modes/type/families.js'
export { CASES } from '@design-editor-src/editor/modes/type/cuts.js'
export { pack } from '@design-editor-src/editor/packs.js'
export { default as KolLogo, KOL_LOGO_VARIANTS, KOL_LOGO_NATURAL_DIMS } from '@design-editor-src/brand/logos/KolLogo.jsx'
