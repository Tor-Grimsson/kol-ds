// Library entry — the embeddable editor package (@kolkrabbi/design-editor).
// The standalone app boots from main.jsx instead; this file is ONLY the
// npm/library surface. Nothing in the app imports it.
//
// CSS: index.lib.css, NOT the app's index.css — the app sheet ships Tailwind
// preflight + framework page chrome, which would restyle the HOST page when
// the built dist/design-editor.css is imported. The lib sheet scopes its
// resets under .kol-design-editor (the root class stamped below).
import './index.lib.css'
import Editor, { EditorProviders } from './editor/Editor'
import LabsView, { LABS_DRAFT_KEY } from './editor/labs/LabsView'
import MobileView from './editor/mobile/MobileView'
import OutputView, { OutputCanvas, OutputStage } from './editor/OutputView'
import { useRailExtras, setRailExtras, RAIL_EXTRA_PREFIX } from './railExtras'
import FilesDialog from './editor/library/FilesDialog'
import { openFiles, closeFiles, useFilesDialog } from './editor/library/filesDialogStore'
import { setNavigator, VIEW_PATHS } from './editor/mode'
import { isMobileDevice, wantsDesktop, setWantsDesktop } from './editor/mobile/device'
import { MODES, setMode, withView, currentView } from './editor/mode'
import { GeneratorLibraryProvider, useGeneratorLibrary, LIBRARY_SLOT_KEYS } from './editor/library/LibraryProvider'
import { shortcutsBySection, comboLabel } from './editor/state/keymap'
import { useSettingsSections, AppSettingsSections, DisplaySettingsDrawer } from './settings/AppSettings'
import { BRAND } from './brand/config'
import { setMediaProxyBase } from './editor/library/mediaLibrary'
import { useTheme } from '@kolkrabbi/kol-framework'

/**
 * <DesignEditor /> — the whole editor as one embeddable component.
 *
 * @param {object}  props
 * @param {string} [props.mediaProxyBase='/media/'] same-origin path the host
 *   proxies to https://media.kolkrabbi.io. Load-bearing for photo-filter and
 *   export paths: the CDN sends no CORS headers, so a cross-origin media load
 *   taints the canvas. Stand up a rewrite on your host (e.g. /media/* → the
 *   CDN) and pass its path here. Default assumes the host proxies `/media`.
 */
export function DesignEditor({ mediaProxyBase } = {}) {
  // ponytail: module-global config knob, set at render — idempotent, runs
  // before children mount. A context/prop-drill would be pure ceremony here.
  if (mediaProxyBase != null) setMediaProxyBase(mediaProxyBase)

  // Re-stamp a persisted theme choice on mount (the app does this pre-paint in
  // index.html; embeds have no boot script). kol-framework's useTheme does it
  // only when the host has NOT set data-theme itself — a fresh embed keeps the
  // host's theme untouched.
  useTheme()

  return (
    <div className="kol-design-editor">
      <Editor />
    </div>
  )
}

export default DesignEditor

/**
 * EditorProviders — the full context stack (error boundary + library > tool >
 * compose > palette > pattern > type) WITHOUT the compose chrome. Exported so
 * a host can mount its own chrome over the same engine: kol-fxr's labs view,
 * mobile view and chromeless output window each import exactly this and
 * nothing else (traced there 2026-09-03). Nesting order is load-bearing — see
 * `editor/Editor.jsx`.
 */
export { EditorProviders }

/**
 * The alternate CHROMES over the same engine — exported because they are
 * built FROM the editor's internals, not on top of its component
 * (2026-09-03, found on kol-fxr's step-3 adoption: `LabsView` reaches 41
 * module paths inside the engine, `compose/state` six times over). A host
 * that kept them local got two copies of every context and
 * `useComposeState must be inside <ComposeStateProvider>` from the package's
 * own provider — a context object is identity-compared, so the second copy
 * can never satisfy the first. One package, every chrome; the host is a router.
 *
 *   LabsView    — the labs / randomiser mode: one loop under a params rail
 *   MobileView  — the touch chrome
 *   OutputView  — the chromeless output window (OutputCanvas / OutputStage are
 *                 its parts, for a host that frames them itself)
 */
export { LabsView, LABS_DRAFT_KEY, MobileView, OutputView, OutputCanvas, OutputStage }

/**
 * railExtras — the tiny external store labs PUBLISHES its category rows into
 * and the host's rail READS (ONE RAIL, user 2026-08-28: labs used to mount its
 * own SideNav). It moved in with labs and is exported so both ends read one
 * store — a host that kept its own copy would subscribe to a store labs never
 * writes to, the same two-copies failure as the contexts, one level down.
 * `RAIL_EXTRA_PREFIX` marks a row's path as a dispatch sentinel rather than a
 * route; the host's layout routes anything under it to `dispatch`.
 */
export { useRailExtras, setRailExtras, RAIL_EXTRA_PREFIX }

/* the files dialog — the component and the store the File surfaces open it
 * with, so a host can put `Files…` anywhere it likes */
export { FilesDialog, openFiles, closeFiles, useFilesDialog }

/**
 * The navigator bridge and the device gate — module-singleton state the HOST
 * must set on the package's copy, not its own (found on kol-fxr's step-3
 * adoption, 2026-09-03). `mode.js` keeps `let navigator = null`, set by
 * `setNavigator(fn)`; every in-package navigation (`goMode`, `goEditor`,
 * `goLabs`, `goRandomiser`, `goChooser`, `device.js`'s `goDesktop` /
 * `goMobile`) routes through it and FALLS BACK to `window.location.assign` —
 * so a host registering its router on a local copy got the right route via a
 * full page load, silently, with in-memory state gone. Same single-copy rule
 * as `railExtras` and the contexts. `VIEW_PATHS` is the route table the host
 * mounts; the device trio is the mobile gate the host's router reads.
 */
export { setNavigator, VIEW_PATHS, isMobileDevice, wantsDesktop, setWantsDesktop }

/**
 * What a HOST'S OWN PAGES reach for — found on kol-fxr's step-4 build with the
 * editor source moved out (2026-09-03): its home, library and settings pages
 * are the app's, and they read the editor's library store, its mode table,
 * its shortcut list and its settings sections. Exported rather than shimmed:
 * a host copying any of these would be back to two stores.
 *
 *   MODES · setMode · withView · currentView      the mode table and view router
 *   GeneratorLibraryProvider · useGeneratorLibrary · LIBRARY_SLOT_KEYS
 *                                                  the saved-generators library
 *   shortcutsBySection · comboLabel               the keymap, for a cheat sheet
 *   useSettingsSections · AppSettingsSections · DisplaySettingsDrawer
 *                                                  the settings rows, defined once
 *   BRAND                                          the brand config a host's
 *                                                  page-title hook reads
 */
export {
  MODES, setMode, withView, currentView,
  GeneratorLibraryProvider, useGeneratorLibrary, LIBRARY_SLOT_KEYS,
  shortcutsBySection, comboLabel,
  useSettingsSections, AppSettingsSections, DisplaySettingsDrawer,
  BRAND,
}
