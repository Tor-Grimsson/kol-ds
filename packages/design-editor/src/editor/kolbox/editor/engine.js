/* THE EDITOR'S ENGINE, for the kolbox chrome: the seam copied from apps/minimal/src/editor/engine.js (plan 4.2, W5),
 * cut to what this screen reads. The public entry gives a host its providers; the compose store, the tools and the
 * canvas are not exported, so they are reached through the SOURCE alias (vite.config.js): `@design-editor-src/*`
 * resolves to the very files `@kolkrabbi/design-editor` imports, the package's own instances, never a second copy. */
export { EditorProviders, setMediaClient, setSettingsStore } from '../../../index.jsx'
/* the pieces of EditorProviders, in its order (round 4, W9): app/Providers.jsx mounts them with kolbox's modals in the
   place of kol-component's ModalProvider, so the engine's own prompts (the draft restore first) are kolbox's dialogs */
export { default as EditorErrorBoundary } from '../../EditorErrorBoundary.jsx'
export { GeneratorLibraryProvider } from '../../library/LibraryProvider.jsx'
export { ToolProvider } from '../../state/tools.jsx'
export { ComposeStateProvider } from '../../compose/state.jsx'
export { PaletteStateProvider } from '../../modes/palette/state.jsx'
export { PatternStateProvider } from '../../modes/pattern/state.jsx'
export { TypeStateProvider } from '../../modes/type/state.jsx'
export { default as UrlIntents, urlIntent } from '../../library/UrlIntents.jsx'
export { default as ModalColorModes } from '../../color/ModalColorModes.jsx'

export { useComposeState, resolveColor, COVER_TYPES } from '../../compose/state.jsx'
export { findLayerDeep } from '../../compose/helpers.js'
/* the layer model (W22): an image fill, the effect rows that draw, their settings scope */
export { CONTENT_LABELS, contentOf, hasImageFill, photoOf, makeContent, morphRowOf } from '../../compose/layerModel.js'
/* the Tune row (C6.2): its geometry, written by the tune mode (./tune/) */
export { fitRings, outlineBox, outlineSvg, ringsFromD, tunable, tuneRowOf } from '../../compose/tune.js'
export { default as ContentScope } from '../../compose/ContentScope.jsx'
export { useLayerEdit } from '../../compose/useLayerEdit.js'
export { useComposeFile } from '../../compose/useComposeFile.js'
export { rowLabelForLayer } from '../../compose/labels.js'
export { BLEND_MODES } from '../../compose/LayerStackView.jsx'
export { isBooleanable } from '../../compose/boolean-ops.js'
export { canMask } from '../../compose/masks.js'
export { resolvedChain } from '../../compose/filterChain.js'
export { effectHost, flatCategories } from '../../compose/inspectors/effectCategories.js'
/* the canvas: the real one, with its rulers, frame, aspect tag and the `kol:command` verbs */
export { default as CanvasArea } from '../../compose/CanvasArea.jsx'
/* the package's Files window, mounted as the real editor mounts it (its look is the package's) */
export { default as FilesDialogHost } from '../../library/FilesDialogHost.jsx'

export { useTool, TOOL_META, canOrbit, ORBIT_REASON } from '../../state/tools.jsx'
export { comboLabel } from '../../state/keymap.js'
/* Settings on ⌘, (Ctrl+, off macOS; 14.2), kolbox's rebind of the engine's bare `,`: every menu row, the Shortcuts tab
   and the search modal read the combo here; app/SettingsHost.jsx binds it */
import { shortcutById as engineShortcutById, shortcutsBySection as engineShortcutsBySection } from '../../state/keymap.js'
const REBIND = { 'settings-drawer': 'Mod+,' }
const rebind = (s) => (s && REBIND[s.id] ? { ...s, combo: REBIND[s.id] } : s)
export const shortcutById = (id) => rebind(engineShortcutById(id))
export const shortcutsBySection = (view) => engineShortcutsBySection(view).map(({ section, items }) => ({ section, items: items.map(rebind) }))
export const SETTINGS_COMBO = REBIND['settings-drawer']
export { useGlobalShortcuts } from '../../state/useGlobalShortcuts.js'
export { getAppSettings } from '../../lib/appSettings.js'
export { openFiles } from '../../library/filesDialogStore.js'
export { pack } from '../../packs.js'
/* the right rail on the engine (round 2, 3.1): the Layer Effects window's ten, the param grammar, the boolean names */
export { LAYER_EFFECTS, effectDef, layerEffectsOf, makeEffect } from '../../compose/layerEffects.js'
export { visibleParams } from '../../params/schema.js'
export { BOOL_OP_LABELS } from '../../compose/labels.js'
/* the menu bar (round 2, 2.1): what the real MenuTop reads, from the same files it imports */
export { blendLayers, canBlend } from '../../compose/blend.js'
export { ASPECTS } from '../../shell/aspects.js'
export { useZoom, useZoomSettled } from '../../shell/zoomStore.js'
export { useEffectTarget } from '../../shell/LiveFilterRows.jsx'
export { useWorkspace, currentWorkspaceName } from '../../state/workspace.js'
export { toggleDots, useBindDots } from '../../params/dotVisibility.js'
export { useTimelinePinned } from '../../params/timelinePinned.js'
export { useGeneratorLibrary } from '../../library/LibraryProvider.jsx'
export { STARTERS } from '../../library/starters.js'
export { CASES } from '../../modes/type/cuts.js'
/* the text controls (round 2, 7.2): the font model and the Typography pane's family switch, the real editor's writes */
export { FAMILY_OPTIONS, layerFamily, layerWeight, weightRange, isOutlineFamily, stylesFor, styleValueFor, ensureFamilyLoaded, weightLabel, familyCssFor, fontStyleFor, VARIABLE_FAMILIES } from '../../modes/type/families.js'
export { applyCase } from '../../../data/typography-cuts.js'
export { fontFeatures } from '../../modes/type/fontLoader.js'
export { featureOn, textCss } from '../../modes/type/textSettings.js'
export { familyPatch } from '../../compose/inspectors/TextPanel.jsx'
/* the right rail's stage settings (round 2, 3.1): the chain's cap, a stage's preset param and its recipe */
export { MAX_FILTERS } from '../../compose/filterChain.js'
export { presetParamOf, presetPatchFor } from '../../compose/inspectors/effectCategories.js'
/* the windows (round 2, 2.2): what BatchExportModal, PaletteBody, ShortcutsOverlay and AppSettings read */
export { PRESET_SIZES } from '../../shell/aspects.js'
export { matchCombo, isTyping } from '../../state/keymap.js'
/* the search modal's FILES (round 4, 14.1): the library as the real hub reads it for ⌘K, from storage on every open */
export { loadLibrary } from '../../library/LibraryProvider.jsx'
export { setAppSetting, useAppSettings } from '../../lib/appSettings.js'
export { transport } from '../../params/transport.js'
export { ROLES, RELATIONS, generatePalette, assignRoles, contrast, oklchToHex, resolvePalette, allPalettes } from '../../color/palette.js'
export { mulberry32, randomSeed } from '../../lib/rng.js'
/* the generator window (round 3, 1.1): the tool's one state, its previews and Apply / Expand / Reset (generate/tool.jsx), the
   window definitions (generate/windows.js) and the open forms (generate/store.js), as float's ModalSettings reads them */
export { useGeneratorTool, ToolPreview } from '../../generate/tool.jsx'
export { CURVES, splitSection, visibleGroups, stepId, familyOf, familyStyles, rememberStyle, paramsForFamily, FAMILIES } from '../../generate/windows.js'
export { useToolUi, openTool, setUi, getTool, setTool } from '../../generate/store.js'
/* the saved mark (round 3, 10.1): what the real DocTitle and float's status read, for the top rail's Saved */
export { markSaved, docOf, isDirty, useSavedMark } from '../../compose/savedMark.js'
/* the per-type inspectors (round 3, 2.1): the Parameters tab's schemas and its writes, the canvas inspector's paint
   target, the generate and repeat layers' own opener (ParametersPanel's editLayer), the pattern surface's rules */
export { SHAPE_SCHEMA } from '../../params/schemas/shape.js'
export { PATTERN_SCHEMA } from '../../params/schemas/pattern.js'
export { TEXT_SCHEMA } from '../../params/schemas/text.js'
export { VECTOR_FX_SCHEMA } from '../../compose/vectorEffects.js'
export { TEXT_TAB_KEYS } from '../../compose/inspectors/TextPanel.jsx'
export { CURVE_OPTIONS } from '../../modes/type/curveMath.js'
export { useColorTarget } from '../../color/useColorTarget.js'
export { resolveCssVar, cssColorHex } from '../../color/cssVar.js'
export { editLayer, editContent } from '../../generate/store.js'
export { newRule, randomRule, SELECT_OPTIONS, ROTATE_OPTIONS } from '../../modes/pattern/RuleRow.jsx'
export { patternFromSpec } from '../../compose/state.jsx'
export { allScopeParams, computeRoll, useRollSeed } from '../../params/rolls.jsx'
export { isBinding } from '../../params/resolve.js'
export { SIZE_PRESETS } from '../../compose/inspectors/TextPanel.jsx'
/* the small dialogs (round 3, 3.1): the media picker's client, its URL rule and sizes, and Insert image's frame (the
   real ActionBar centres a new photo on CANVAS_W by CANVAS_H) */
export { getMediaClient, proxied, formatSize } from '../../library/mediaLibrary.js'
export { CANVAS_W, CANVAS_H } from '../../compose/state.jsx'
/* the dead menu rows (round 3, 4.1): what the real rail tabs read (Assets, History, Navigator, Stroke, Color, Swatches,
   Output, File), the eyedropper's own canvas pick, the timeline's pin, clock and tracks */
export { default as KolLogo, KOL_LOGO_VARIANTS, KOL_LOGO_NATURAL_DIMS } from '../../../brand/logos/KolLogo.jsx'
export { listMedia, mediaSrc, isImageType, isVideoType, bucketOptions, DEFAULT_BUCKET } from '../../library/mediaLibrary.js'
export { buildLayersSvg } from '../../compose/build.js'
export { pickFromCanvas } from '../../color/canvasEyedropper.js'
export { useTransport } from '../../params/transport.js'
export { toggleTimelinePinned } from '../../params/timelinePinned.js'
export { sampleTrack } from '../../params/Timeline.jsx'
export { ensureWebcam } from '../../lib/webcam.js'
export { saveClip } from '../../lib/clipStore.js'
export { stillToDataUrl } from '../../lib/stillUpload.js'
export { enableAudio, disableAudio, audioSourceKind } from '../../params/audioBands.js'
/* the layers list (round 4, W1): the Add layer menu's types, as the real footer's AddLayerButton reads them */
export { layerTypes } from '../../compose/state.jsx'
/* the inspector (round 4, W2): the box writes' path scale (the real useBoxSize) */
export { scalePathNodes } from '../../compose/path-math.js'
/* the keys (round 4, W5): the engine reads the chrome on screen from the path (`/editor`), which kolbox does not have
   (`/#/editor`); the editor says it itself, as the real Labs and randomiser do, so ⌘S, ⇧⌘S and the shortcuts sheet answer */
export { setMountedView } from '../../mode.js'
/* export, Save as and the portable file (plan-2026-11-19 C8): what editor/export/render.js and files/ read, from the files
   the engine's own export (useComposeFile) imports */
export { expandLayersDeep } from '../../compose/layerModel.js'
export { membersOf } from '../../compose/frame.js'
/* the clipboard (C4.4): the layer menu asks whether anything is held */
export { getClip } from '../../compose/clipboard.js'
export { resolveLayersDeep, hasBindings } from '../../params/resolve.js'
export { warmTextFonts } from '../../modes/type/textOutline.js'
export { makeZip } from '../../lib/zipStore.js'
export { downloadBlob } from '../../lib/download.js'
export { setHoverLayer, useHoverLayer } from '../../compose/hoverStore.js'
