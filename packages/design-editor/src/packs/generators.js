// The GENERATORS pack — the loop catalog (loops/) and the inspectors that edit it, registered
// into the core through the seam (editor/packs.js). Owns the `loop` and `misc` layer types.
import { registerPack } from '../editor/packs'
import {
  GROUPS, loopById, loopDrawParams, resolveCameraKeys, loopBgToggleable, presetById, presetParams,
  presetsInGroup, presetsInSub, presetLayerPatch, isToolPreset, groupById,
} from '../loops/registry'
import { drawLoopFrame } from '../editor/lib/viewport'
import { GENERATIVE_TREE, MISC_TREE } from '../loops/taxonomy'
import { THEME_OPTIONS } from '../editor/lib/themes'
import { buildParatypeFlattenGroup } from '../loops/paratype/flatten.js'
import { LoopPicker } from '../editor/compose/inspectors/LoopPicker'
import { LoopFields } from '../editor/compose/inspectors/LoopFields'
import { stepFromPreset } from '../editor/morph/StepPicker'
/* fxr's generate engine (W7.6) — the `generate` layer type is this pack's: its params, marks, SVG body and canvas render */
import { paramsFor as generateParamsFor } from '../generate/index.js'
import { generateMarks, generateBody } from '../editor/generate/generateCore'
import GenerateLayer from '../editor/generate/GenerateLayer'
/* the generator tools — Generate · Repeat · Paratype letter, the Rail and the settings dialog (W7) */
import GeneratorRail from '../editor/generate/GeneratorRail'
import { GeneratorWindows } from '../editor/generate/GeneratorWindow'

export const generators = {
  layerTypes: ['loop', 'misc', 'generate'],
  GROUPS, loopById, loopDrawParams, resolveCameraKeys, loopBgToggleable, presetById, presetParams,
  presetsInGroup, presetsInSub, presetLayerPatch, isToolPreset, groupById,
  drawLoopFrame, GENERATIVE_TREE, MISC_TREE, THEME_OPTIONS, buildParatypeFlattenGroup,
  LoopPicker, LoopFields, stepFromPreset,
  generateParamsFor, generateMarks, generateBody, GenerateLayer, GeneratorRail, GeneratorWindows,
  /* the three.js engines stay lazy — loaded when an engine layer first renders */
  loadGlHost: () => import('../loops/gl/host.js'),
}

registerPack('generators', generators)
