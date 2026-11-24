import { downloadBlob, useComposeFile, useComposeState, useGeneratorLibrary } from '../editor/engine.js'
import { DRAFTS, keepOf, moveFile, placeOf, setKeep } from './places.js'
import { keep, pickPortable, portableFile, readPortable } from './portable.js'

/* THE OPEN FILE'S VERBS (plan-2026-11-19-kolbox-whats-left C8, W30.3), one model for all of them: a file is the library's
 * stored preset, it lives in ONE folder (files/places.js) and keeps what Save as said (its media, its theme).
 *   save()           a saved file is written in place, keeping what it keeps; a new one opens Save as
 *   saveAs({ name, folder, keep })  a new file in that folder; the editor now holds it
 *   duplicate()      a copy beside it, in the same folder, keeping the same
 *   exportFile()     the document as one portable file (files/portable.js)
 *   openFile()       a portable file picked from disk: a new file in Drafts, opened here
 * Each write is the engine's own (buildSavedSpec marks the document saved and takes its cover; addItem, updateItem and
 * duplicateItem are the library's), so the save toast, Home and the Files window all see it. */
export const openSaveAs = () => window.dispatchEvent(new CustomEvent('kolbox:save-as'))

export function useFileVerbs() {
  const { currentPresetId, currentPresetName, setCurrentPresetId, setCurrentPresetName, loadPreset } = useComposeState()
  const { buildSpec, buildSavedSpec } = useComposeFile()
  const { addItem, updateItem, duplicateItem } = useGeneratorLibrary()

  const save = async () => {
    if (!currentPresetId) { openSaveAs(); return }
    updateItem('preset', currentPresetId, await keep(await buildSavedSpec(currentPresetName), keepOf(currentPresetId)))
  }
  const saveAs = async ({ name, folder = DRAFTS.id, keep: kept }) => {
    const n = String(name ?? '').trim() || null
    const id = addItem('preset', await keep(await buildSavedSpec(n), kept))
    if (!id) return null
    moveFile(id, folder)
    setKeep(id, kept)
    setCurrentPresetId(id)
    setCurrentPresetName(n)
    return id
  }
  const duplicate = () => {
    if (!currentPresetId) return null
    const id = duplicateItem('preset', currentPresetId)
    if (id) { moveFile(id, placeOf(currentPresetId)); setKeep(id, keepOf(currentPresetId)) }
    return id
  }
  const exportFile = async () => {
    const f = await portableFile(buildSpec(currentPresetName), currentPresetName || 'Untitled')
    downloadBlob(f.blob, f.name)
  }
  /* resolves null when nothing was picked, an Error's message when the file is not one */
  const openFile = async () => {
    const file = await pickPortable()
    if (!file) return null
    try {
      const spec = await readPortable(file)
      const id = addItem('preset', spec)
      if (!id) return 'The file holds no document'
      loadPreset({ ...spec, id })
      return null
    } catch (e) { return e.message }
  }
  return { save, saveAs, duplicate, exportFile, openFile }
}
