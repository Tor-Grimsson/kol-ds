// Library entry — the embeddable editor package (@kolkrabbi/design-editor): the full editor.
// The standalone app boots from main.jsx instead; this file is ONLY the npm/library surface.
//
// Since the cut (deconstruction T5, 2026-09-27) it is the core (./core.jsx) plus every layer pack
// plus the two chromes built from them. Same exports as before, so a host on the root entry
// sees no change; a host that wants less imports `@kolkrabbi/design-editor/core` and the packs
// it needs.
import './packs'
import { lazy, Suspense, useEffect } from 'react'
import { useTheme } from '@kolkrabbi/kol-framework'
import { DesignEditor as CoreDesignEditor, setMediaClient, setMediaProxyBase, setSettingsStore } from './core'
import { setKolboxHost } from './editor/kolbox/host'
import LabsView, { LABS_DRAFT_KEY } from './editor/labs/LabsView'
import MobileView from './editor/mobile/MobileView'

export * from './core'

/**
 * <DesignEditor /> — core's editor, plus the editor's style (plan-2026-11-19-kolbox-whats-left C3).
 * @param {'default'|'kolbox'} [props.variant] kolbox mounts the kolbox screens (Editor, Labs and Morph on their mode
 *   track, editor/kolbox/) in place of the default shell. A host reads the Style row's app setting (`style`) to pass it;
 *   the prop wins over that row. Never the theme. The host loads the kolbox sheet beside it (editor/kolbox/kolbox.css
 *   under its own Tailwind root: apps/editor/src/kolbox.css). Every other prop is core's.
 * @param {Object<string, Function>} [props.pages] kolbox only: the host's own screens on the hash (`{ '/home': Home,
 *   '/library': Library }`; a key also takes its subpaths), drawn in the kolbox screens' frame. The engine owns none of
 *   them; with '/home' given, the bare address opens it, as apps/kolbox does.
 * @param {{ session: ({ name?: string, email?: string, picture?: string }|null), signIn: Function, signOut: Function }} [props.account]
 *   kolbox only (plan-2026-11-20 W4.1): the host's account. The Sign in window and the account menus call these and
 *   nothing else; with none, the menus read "Not signed in" and Sign in… says no account is connected.
 * @param {object} [props.mediaClient] kolbox: the host's media client (kol-media-client's shape: `buckets()`,
 *   `listMedia(prefix, { bucket })`, `mediaUrl(key, bucket)`), read by the Media space and the media window; with none
 *   they read the editor's sample library and say so in one line (W4.2).
 */
export function DesignEditor(props = {}) {
  return props.variant === 'kolbox' ? <KolboxEditor {...props} /> : <CoreDesignEditor {...props} />
}
export default DesignEditor

/* the kolbox screens load only under the kolbox style */
const KolboxView = lazy(() => import('./editor/kolbox/KolboxView.jsx'))
function KolboxEditor({ mediaProxyBase, mediaClient, settingsStore, pages, account }) {
  /* core's three module setters and theme re-stamp, as DesignEditor calls them */
  if (mediaProxyBase != null) setMediaProxyBase(mediaProxyBase)
  if (mediaClient) setMediaClient(mediaClient)
  useEffect(() => {
    if (!settingsStore) return
    setSettingsStore(settingsStore)
    return () => setSettingsStore(null)
  }, [settingsStore])
  useTheme()
  /* the kolbox screens name their own settings rows as they load; here every name is this editor's one row */
  setKolboxHost({ client: mediaClient ?? null, store: () => settingsStore ?? null, account: account ?? null })
  return <Suspense fallback={null}><KolboxView pages={pages} /></Suspense>
}

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
 *
 * Both are built from the packs, so they live here and not in ./core.jsx
 * (OutputView, which needs none, moved there).
 */
export { LabsView, LABS_DRAFT_KEY, MobileView }
/* FloatLabsView — Labs in the float chrome, on kol-shell's FloatLayout (plan-2026-11-05-float-editor 3.2) */
export { default as FloatLabsView } from './editor/labs/FloatLabs'
