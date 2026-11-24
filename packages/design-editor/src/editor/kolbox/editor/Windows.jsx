import { useCallback, useEffect } from 'react'
import WindowBatchExport from './windows/WindowBatchExport.jsx'
import WindowShortcuts from './windows/WindowShortcuts.jsx'
import WindowSettings from './windows/WindowSettings.jsx'
import WindowLayerEffects from './windows/WindowLayerEffects.jsx'
import WindowAssets from './windows/WindowAssets.jsx'
import WindowHistory from './windows/WindowHistory.jsx'
import WindowNavigator from './windows/WindowNavigator.jsx'
import WindowStroke from './windows/WindowStroke.jsx'
import WindowColor from './windows/WindowColor.jsx'
import WindowSwatches from './windows/WindowSwatches.jsx'
import WindowOutput from './windows/WindowOutput.jsx'
import WindowFile from './windows/WindowFile.jsx'
import WindowExport from './export/WindowExport.jsx'
import { SaveAsHost } from './windows/WindowSaveAs.jsx'
import { EyedropHost } from './windows/eyedrop.jsx'
import { InsertImageHost } from './windows/InsertImage.jsx'
import { GeneratorWindowHost } from './generate/GeneratorWindow.jsx'
import { MotionWindowHost } from './generate/MotionWindow.jsx'
import { WindowBakingHost } from './windows/WindowBaking.jsx'
import { WindowMediaPickerHost } from './windows/WindowMediaPicker.jsx'
import { askPrompt } from '../ui/ask.js'
import { askConfirm } from '../ui/ask.js'

/* The editor's five windows on Modal (round 2, 2.2). Each opens on the real editor's own window event, so a menu row,
   the real key and any engine part that fires the event all reach it: ⌘, fires kol:open-settings (app/SettingsHost.jsx,
   14.2), S fires kol:show-shortcuts (the engine's canvas binds it). Settings and Shortcuts toggle, as
   the real ones do. Color Modes' rows fire the engine's kol:open-color-modes, which kolbox's ColorModesHost answers
   (app/Providers.jsx, C5.1), so Labs and the menus open the one window; it is not listened for here. Files stays the
   package's own window. */
const WINDOWS_BY_ID = {
  'batch-export': { event: 'kol:open-batch-export', Window: WindowBatchExport },
  'color-modes': { event: 'kol:open-color-modes', Window: null },
  shortcuts: { event: 'kol:show-shortcuts', Window: WindowShortcuts, toggles: true },
  settings: { event: 'kol:open-settings', Window: WindowSettings, toggles: true },
  'layer-effects': { event: 'kol:open-layer-effects', Window: WindowLayerEffects },
  /* the real rail tabs his left rail no longer holds (round 3, 4.1: Window › Left rail), each its own window at the
     rail's edge (windows/WindowPane.jsx); opened by their rows directly, as Color Modes */
  assets: { event: null, Window: WindowAssets },
  history: { event: null, Window: WindowHistory },
  navigator: { event: null, Window: WindowNavigator },
  stroke: { event: null, Window: WindowStroke },
  color: { event: null, Window: WindowColor },
  swatches: { event: null, Window: WindowSwatches },
  output: { event: null, Window: WindowOutput },
  file: { event: null, Window: WindowFile },
  /* plan-2026-11-19 C8: the one Export window (the top rail's Export, File › Export…) */
  export: { event: null, Window: WindowExport },
}
export const WINDOWS = Object.keys(WINDOWS_BY_ID)

/* a menu row opens its window the way the real one does: by its event */
const fire = (id) => window.dispatchEvent(new CustomEvent(WINDOWS_BY_ID[id].event, { cancelable: true }))

/* the events, into the page's open-window state; returns the menu rows' onWindow */
export function useWindowEvents(setOpen) {
  useEffect(() => {
    const offs = Object.entries(WINDOWS_BY_ID).filter(([, w]) => w.event && w.Window).map(([id, { event, toggles }]) => {
      const on = (e) => { e.preventDefault?.(); setOpen((cur) => (toggles && cur === id ? null : id)) }
      window.addEventListener(event, on)
      return () => window.removeEventListener(event, on)
    })
    const closeShortcuts = () => setOpen((cur) => (cur === 'shortcuts' ? null : cur))
    /* ⌘, (14.2) is app/SettingsHost.jsx's key: it asks this screen first with kol:open-settings, answered above */
    window.addEventListener('kol:close-shortcuts', closeShortcuts)
    return () => {
      offs.forEach((off) => off())
      window.removeEventListener('kol:close-shortcuts', closeShortcuts)
    }
  }, [setOpen])
  return useCallback((id) => (WINDOWS_BY_ID[id].event ? fire(id) : setOpen(id)), [setOpen])
}

/* the generator window (round 3, 1.1) is mounted beside them and opens on the engine's own generator state, not here */
/* view: the chrome the windows open on (Shortcuts lists its keys), 'editor' unless Labs or Morph says (round 4, 7.3) */
export default function Windows({ open, onClose, view }) {
  const Window = WINDOWS_BY_ID[open]?.Window
  return (
    <>
      {Window && <Window onClose={onClose} view={view} />}
      <GeneratorWindowHost />
      <MotionWindowHost />
      {/* the small dialogs (round 3, 3.1): the bake's progress, the media picker. The prompt and the confirm every
          caller shares are mounted once for the app (App.jsx, round 4 W9), so the draft restore has them on every screen */}
      <WindowBakingHost />
      {/* Save as (C8): File › Save as…, the file name's menu, ⇧⌘S, and ⌘S on a file never saved */}
      <SaveAsHost />
      <WindowMediaPickerHost />
      {/* the real colour pane's eyedropper and the action bar's Insert image, which kolbox does not mount (round 3, 4.1) */}
      <EyedropHost />
      <InsertImageHost />
    </>
  )
}

/* The engine's own prompts and confirms (Save… "Name this frame:", "Save as:", "Edit text", the draft restore) call
   kol-component's useModal(), which EditorProviders answers with kol-component's ModalProvider: a box in another
   style. This answers them with kolbox's ModalPrompt and ModalConfirm instead, the same signatures (prompt(title,
   value, { okLabel, cancelLabel, placeholder }), confirm(title, { okLabel, cancelLabel, options }), alert). The
   context is the one kol-component keeps on globalThis for exactly this sharing (Modal.jsx's ModalCtx); it is read at
   render, after the engine has loaded kol-component. app/Providers.jsx mounts it where EditorProviders mounts
   kol-component's ModalProvider (round 4, W9), so the provider's own draft restore asks through it too. */
const ENGINE_MODALS = {
  prompt: (title, value = '', { okLabel, cancelLabel, placeholder } = {}) => askPrompt({ title, value, placeholder, action: okLabel, cancel: cancelLabel }),
  confirm: async (title, { okLabel, cancelLabel, options } = {}) => {
    const ok = await askConfirm({ title, action: okLabel, cancel: cancelLabel })
    return options?.length ? { ok, values: Object.fromEntries(options.map((o) => [o.id, !!o.defaultValue])) } : ok
  },
  alert: async (title, { okLabel } = {}) => { await askConfirm({ title, action: okLabel, cancel: null }) },
}
export function ModalEngineProvider({ children }) {
  const Ctx = globalThis[Symbol.for('@kolkrabbi/kol-component/ModalCtx')]
  return Ctx ? <Ctx.Provider value={ENGINE_MODALS}>{children}</Ctx.Provider> : children
}
