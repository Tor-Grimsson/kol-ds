import {
  ComposeStateProvider, EditorErrorBoundary, GeneratorLibraryProvider, PaletteStateProvider,
  PatternStateProvider, ToolProvider, TypeStateProvider, UrlIntents,
} from '../editor/engine.js'
import { ModalEngineProvider } from '../editor/Windows.jsx'
import { ColorModesHost } from '../editor/windows/WindowColorModes.jsx'

/* The engine's providers for a kolbox screen (round 4, W9): the real EditorProviders (design-editor Editor.jsx), piece
   for piece and in its order, with one swap: kolbox's ModalEngineProvider stands where kol-component's ModalProvider
   stood, outermost of the state stack, so every useModal() under it (the draft restore "Restore your last canvas?",
   the Files window's prompts, Save's names) opens kolbox's ModalConfirm and ModalPrompt (app/Hosts mounts them).
   Mounted per screen under the route, as the real hub mounts EditorProviders per chrome: what survives a move or a
   reload is the draft each chrome autosaves (`draftKey`) and the restore prompt that brings it back. `layerModel`: the
   Editor works in layer model 2 (W22: photo is a fill; pattern, kinetic type, generate and motion are effects); Labs,
   Morph and the Randomiser keep the old layer types their stages are built from. `frames`: the Editor's frames are
   objects the user draws (plan-2026-11-19-kolbox-whats-left C1); Labs and Morph keep their one stage. */
export default function Providers({ children, persistDraft = true, draftKey, layerModel = false, frames = false }) {
  return (
    <EditorErrorBoundary>
      <ModalEngineProvider>
        <GeneratorLibraryProvider>
          <ToolProvider>
            <ComposeStateProvider persistDraft={persistDraft} draftKey={draftKey} layerModel={layerModel} frames={frames}>
              <PaletteStateProvider>
                <PatternStateProvider>
                  <TypeStateProvider>
                    <UrlIntents />
                    {children}
                    <ColorModesHost />
                  </TypeStateProvider>
                </PatternStateProvider>
              </PaletteStateProvider>
            </ComposeStateProvider>
          </ToolProvider>
        </GeneratorLibraryProvider>
      </ModalEngineProvider>
    </EditorErrorBoundary>
  )
}
