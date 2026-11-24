import { useEffect } from 'react'
import { transport, useComposeFile, useComposeState } from '../labs/engine.js'
import { closeFiles, FilesDialog, matchCombo, openFiles, resetMorph, useFilesDialog, useGeneratorLibrary } from './engine.js'

/* The package's Files window on Morph: FilesDialogHost's wiring (library/FilesDialogHost.jsx), and ⌘O, with one line
   more on open, carried from UrlIntents (library/UrlIntents.jsx): a morph file also loads its steps into the morph
   store and its length into the transport, so it reopens with the same steps. Still until Play, as the real one. */
export default function MorphFiles() {
  const { open, focusName } = useFilesDialog()
  const { loadPreset, setCurrentPresetId, setCurrentPresetName } = useComposeState()
  const { onLoadSettings, onSaveSettings, buildSavedSpec } = useComposeFile()
  const { addItem } = useGeneratorLibrary()

  useEffect(() => {
    const onKey = (e) => {
      if (!matchCombo(e, 'Mod+O')) return
      e.preventDefault()
      if (open) closeFiles(); else openFiles()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <FilesDialog
      open={open}
      onClose={closeFiles}
      onOpenItem={(item) => {
        if (item.mode === 'morph' && item.morph) resetMorph({ active: true, ...item.morph, fileId: item.shipped ? null : item.id, fileName: item.name ?? null })
        else resetMorph({ active: true })
        loadPreset(item)
        if (item.mode === 'morph' && item.morph?.seconds > 0) transport.setLoopSeconds(item.morph.seconds)
        setCurrentPresetId(item.id)
        setCurrentPresetName(item.name ?? null)
      }}
      onImportFile={onLoadSettings}
      onExportItem={(item, name) => onSaveSettings(name, item)}
      onSaveCurrent={async (name) => {
        const id = addItem('preset', await buildSavedSpec(name))
        if (!id) return
        setCurrentPresetId(id)
        setCurrentPresetName(name)
      }}
      focusName={focusName}
    />
  )
}
