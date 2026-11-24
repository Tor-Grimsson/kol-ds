/* THE FILE LIBRARY, for Home (round 3 plan 5.1): the package's own store, the one the Files window lists and every Save
 * writes (localStorage `kol.editor.library.v3`), reached through the SOURCE alias as ../editor/engine.js does. A file is
 * a stored `preset`; `shipped` ones are fxr's own and Home leaves them out, as the package's Files window and fxr's Home
 * do. A file opens through the package's own `?open=<id>` intent (library/UrlIntents.jsx), read when the editor mounts. */
export { GeneratorLibraryProvider, useGeneratorLibrary } from '@design-editor-src/editor/library/LibraryProvider.jsx'
export { getAppSettings } from '@design-editor-src/editor/lib/appSettings.js'
/* a new file is in today's models (R1): frames drawn by the user, so it opens on an empty page */
export { FRAME_MODEL } from '@design-editor-src/editor/compose/frame.js'
export { LAYER_MODEL } from '@design-editor-src/editor/compose/layerModel.js'
export { useAccount } from '@design-editor-src/editor/library/libraryApi.js'
/* the sample files (home/samples.js): the engine's own material (the File menu's starters, the shipped Labs and Morph
   files built from the generator presets) and the engine's own thumbnail path (useComposeFile `captureThumb`: the
   layers' export SVG, fonts warmed first, rasterised at 240 on the long side) */
export { STARTERS } from '@design-editor-src/editor/library/starters.js'
export { shippedFiles } from '@design-editor-src/editor/library/shipped.js'
export { buildLayersSvg } from '@design-editor-src/editor/compose/build.js'
export { warmTextFonts } from '@design-editor-src/editor/modes/type/textOutline.js'
export { PRESET_SIZES } from '@design-editor-src/editor/shell/aspects.js'
export { POOLS } from '@design-editor-src/editor/modes/palette/pools.js'
export { pack } from '@design-editor-src/editor/packs.js'
/* the file verbs' helpers, kol-component's own (as the real FILE rail and card use them), from its source, as
   apps/editor-hub reads design-editor's: the cover picker (Upload image, a webp data URL), a size as the card reads it
   ("5.5 KB"), and the one download anchor */
export { pickImage } from '../../../../../packages/component/src/utilities/imageToDataUrl.js'
export { default as formatSize } from '../../../../../packages/component/src/utilities/formatSize.js'
export { downloadBlob } from '../../../../../packages/component/src/hooks/svgExport.js'
