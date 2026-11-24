import { groupById } from '../../loops/registry'
import { resolvedChain } from '../compose/filterChain'
import { getMorph } from '../morph/morphStore'

/* What labs' touch sheet reads for the one layer — the generator's two forms: the group on the open panel's header with the
 * preset as its quiet second text (`kind`; no middot in a UI title, plan-2026-11-12-one-header W10.1 — it was
 * `group · preset`), the preset alone on the collapsed pill (user ruling 2026-08-12). */
export function sheetLabels(layer) {
  if (getMorph().active) return { title: 'Morph', pill: 'Morph' }
  if (!layer) return { title: 'Labs', pill: 'Labs' }
  if (layer.type === 'loop' || layer.type === 'misc') {
    return { title: groupById(layer.loopGroup)?.label ?? 'Labs', kind: layer.presetLabel, pill: layer.presetLabel }
  }
  if (layer.type === 'photo') {
    const fx = resolvedChain(layer)[0]?.def?.label ?? 'Media'
    return { title: fx, pill: fx }
  }
  const name = layer.presetLabel ?? 'Labs'
  return { title: name, pill: name }
}
