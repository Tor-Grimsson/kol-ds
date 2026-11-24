import { useEffect, useRef, useState } from 'react'
import {
  FilesDialogHost, isTyping, matchCombo, openFiles, proxied, setMountedView, useComposeFile, useComposeState, useLabsLayer,
} from './engine.js'
import Windows, { useWindowEvents } from '../editor/Windows.jsx'
import { bakeLoop } from '../editor/windows/WindowBaking.jsx'
import { pickMedia } from '../editor/windows/WindowMediaPicker.jsx'

/* The editor's windows on Labs and Morph (round 4, 6.1, 6.2, 7.3), mounted inside the screen's engine providers as
   pages/Editor.jsx mounts them: Output (Aspect, Export, the split Export PNG with Export loop (webm), Record and Batch
   export, Open output window), File (Save to file, Load from file, a photo's source, Audio Off, Mic, File), Batch
   export, the bake, Shortcuts (the Labs keys), Settings, the media picker, the generator and the small hosts. The real
   Labs is the editor's chrome with a dock, so the same windows are the real dock's controls.
   They open from the mark's menu, Export and Preview (ui/TopRail.jsx's `kolbox:labs` event), the transport toolbar's
   cells (Labs) and the real keys: ⌘, Settings (app/SettingsHost.jsx, 14.2), S Shortcuts, ⌘O Files, ⌘S Save patch (the Files
   window on its name field, the real FilesDialogHost's rule for labs), as the real LabsBody and FilesDialogHost bind
   them. The mounted chrome is 'labs' for the engine, as the real LabsView sets it (Morph is labs on /morph).
   files: mount the package's Files window here (Labs); false where the screen mounts its own (Morph's morph/Files.jsx
   binds ⌘O), and ⌘S is bound here.
   Media: the media picker; its pick is the stage's photo layer, the real Labs' rule for a pick from the Media library
   (LabsBody's consumeMediaPicks: setOnly('photo')). */
export default function LabsWindows({ files = true }) {
  const [win, setWin] = useState(null)
  const onWindow = useWindowEvents(setWin)
  const { undo, redo } = useComposeState()
  const { onExportPng, openOutputWindow } = useComposeFile()
  const { setOnly } = useLabsLayer()

  useEffect(() => { setMountedView('labs'); return () => setMountedView(null) }, [])

  const act = useRef(null)
  act.current = {
    output: () => onWindow('output'),
    file: () => onWindow('file'),
    shortcuts: () => onWindow('shortcuts'),
    settings: () => onWindow('settings'),
    media: () => pickMedia({ accept: ['image', 'video'], place: false })
      .then((pick) => pick && setOnly('photo', { src: proxied(pick.url), srcType: pick.kind === 'video' ? 'video' : 'image' })),
    save: () => openFiles({ focusName: true }),
    files: () => openFiles(),
    'export-png': () => onExportPng(),
    'export-loop': () => bakeLoop(1),
    preview: () => openOutputWindow(),
    undo: () => undo(),
    redo: () => redo(),
  }

  useEffect(() => {
    const onAction = (e) => act.current[e.detail]?.()
    const onKey = (e) => {
      if (isTyping(e)) return
      if (!files && matchCombo(e, 'Mod+S')) { e.preventDefault(); act.current.save(); return }
      if ((e.key === 's' || e.key === 'S') && !e.metaKey && !e.ctrlKey && !e.altKey) { e.preventDefault(); act.current.shortcuts() }
    }
    window.addEventListener('kolbox:labs', onAction)
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('kolbox:labs', onAction)
      window.removeEventListener('keydown', onKey)
    }
  }, [files])

  return (
    <>
      <Windows open={win} onClose={() => setWin(null)} view="labs" />
      {files && <FilesDialogHost />}
    </>
  )
}
