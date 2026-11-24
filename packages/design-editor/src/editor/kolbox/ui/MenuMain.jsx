import { Menu } from '@kolkrabbi/kol-component'
import { isSignedIn, openMedia, openSettings, signIn } from '../app/SettingsHost.jsx'

/* The one menu on the logo (round 3, 10.1; his model is Figma's main menu): "Actions…" with the lens and ⌘K, which
   asks for the search modal (the `kolbox:search` event); then each menu as a row that opens its own rows as a child
   panel; then the app's rows (Home, the chromes, Settings…) as the last group. Generic: the host passes the menus.
   menus: [{ label, groups }] (Menu's groups); app: rows. The mark that opens it is RailSwitcher's (W1.1). */
export const openSearch = () => window.dispatchEvent(new CustomEvent('kolbox:search'))

const go = (path) => () => { window.location.hash = path }

/* The app's own rows (the real FXR menu's): Home, the chromes with the current one checked (Library is #/library, its
   own screen, round 4 W10), and Settings… where the screen has a settings window.
   Round 4, W12, the rest of the real rail's rows: Dev (a dev server's only, as the real row; kolbox's dev pages), then
   the rail's foot, Media, Sign in (Signed in once signed in) and Settings…, on every screen through the shell's doors
   (app/SettingsHost.jsx). settings: a screen's own Settings… row; absent, the shell's (`,`, the screen answers first).
   Moved here with the rest of the retired top rail's exports (W1.2). */
export function appRows({ mode, settings } = {}) {
  return [
    { label: 'Home', run: go('#/home') },
    /* Home first among them, checked on Home, so each screen checks its own row (round 4 seams) */
    { label: 'Chromes', submenu: [[
      { label: 'Home', check: mode === 'home', run: go('#/home') },
      { label: 'Library', check: mode === 'library', run: go('#/library') },
      { label: 'Editor', check: mode === 'editor', run: go('#/editor') },
      { label: 'Labs', check: mode === 'labs', run: go('#/labs') },
      /* round 4, W11: the Randomiser screen, a chrome in this list as the real one */
      { label: 'Randomiser', check: mode === 'randomiser', run: go('#/randomiser') },
      { label: 'Morph', check: mode === 'morph', run: go('#/morph') },
    ]] },
    ...(import.meta.env.DEV ? [{ label: 'Dev', run: go('#/dev/controls') }] : []),
    { label: 'Media', run: openMedia },
    { label: isSignedIn() ? 'Signed in' : 'Sign in', run: signIn },
    { label: 'Settings…', shortcut: '⌘,', run: () => openSettings(), ...settings },
  ]
}

/* Labs and Morph (round 4, 6.1, 6.2, 7.3): the mark's menu, Export and Preview reach the dock's windows and verbs through
   one event, `kolbox:labs` with the action as its detail, answered by labs/LabsWindows.jsx inside the screen's engine
   providers. The real Labs dock's Output and File, the real File menu's Save and Files…, its Window rows. */
export const labsAction = (action) => () => window.dispatchEvent(new CustomEvent('kolbox:labs', { detail: action }))
export const LABS_MENUS = [
  { label: 'File', groups: [
    [{ label: 'Save', shortcut: '⌘S', run: labsAction('save') }, { label: 'Files…', shortcut: '⌘O', run: labsAction('files') }],
    [{ label: 'Export PNG', run: labsAction('export-png') }, { label: 'Export loop (webm)', run: labsAction('export-loop') }],
  ] },
  { label: 'Window', groups: [
    [{ label: 'Output', run: labsAction('output') }, { label: 'File', run: labsAction('file') }],
    [{ label: 'Shortcuts', shortcut: 'S', run: labsAction('shortcuts') }, { label: 'Settings', shortcut: '⌘,', run: labsAction('settings') }, { label: 'Media', run: labsAction('media') }],
  ] },
]

export default function MenuMain({ anchor, open, onClose, menus = [], app = [] }) {
  /* Figma's order: the way home on top (its "Back to files"), Actions…, the menus, then the app's rows */
  const home = app.filter((r) => r.label === 'Home')
  const groups = [
    home,
    [{ label: 'Actions…', icon: 'search', shortcut: '⌘K', run: openSearch }],
    menus.map((m) => ({ label: m.label, submenu: m.groups })),
    app.filter((r) => r.label !== 'Home'),
  ].filter((g) => g.length)
  return <Menu variant="kolbox" aria-label="Main menu" minWidth={196} anchor={anchor} open={open} onClose={onClose} onSelect={(row) => row.run?.()} groups={groups} />
}
