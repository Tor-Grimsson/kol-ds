import { useMediaQuery } from '@kolkrabbi/kol-component'
import { AppFloatNav } from '@kolkrabbi/kol-shell'
import { isSignedIn, openMedia, signIn } from './SettingsHost.jsx'

/* THE PHONE'S BOTTOM BAR (C3 batch 6, moved whole from apps/kolbox's App.jsx): under 768, on every screen but the chromes,
   which own the phone's bottom edge. `dev` adds the Dev row (apps/kolbox's specimen pages, a dev server only). */

/* the phone nav's rows (round 4, W15; kolbox's RailPhone rows, W31.2 batch 5): the rail's rows with Home first, then the
   foot, Media, Sign in, Settings; Dev on a dev server only. AppFloatNav variant="kolbox" draws them. */
const go = (hash) => () => { window.location.hash = hash }
const phoneRows = (dev) => [
  { path: '/home', icon: 'home-01', label: 'Home', onPress: go('#/home') },
  { path: '/library', icon: 'nav-library', label: 'Library', onPress: go('#/library') },
  { path: '/editor', icon: 'desktop', label: 'Editor', onPress: go('#/editor') },
  { path: '/labs', icon: 'globe', label: 'Labs', onPress: go('#/labs') },
  { path: '/randomiser', icon: 'refresh', label: 'Randomiser', onPress: go('#/randomiser') },
  { path: '/morph', icon: 'swap', label: 'Morph', onPress: go('#/morph') },
  ...(dev ? [{ path: '/dev', icon: 'code', label: 'Dev', onPress: go('#/dev/controls') }] : []),
  { path: 'media', icon: 'image', label: 'Media', onPress: openMedia },
  { path: 'sign-in', icon: isSignedIn() ? 'cloud' : 'user', label: isSignedIn() ? 'Signed in' : 'Sign in', onPress: signIn },
  { path: '/settings', icon: 'nav-settings', label: 'Settings', onPress: go('#/settings') },
]

/* the chromes own the phone's bottom edge: the bar steps aside on them, as the real one's `bar: false` rows */
const NO_BAR = new Set(['/editor', '/labs', '/morph', '/randomiser', '/output'])

export default function PhoneNav({ path, shown, dev = false }) {
  const narrow = useMediaQuery('(max-width: 767px)')
  /* the phone's bottom bar (round 4, W15), under 768 on Home, Library, Settings and Dev, as the real one */
  return narrow && !NO_BAR.has(shown) ? <AppFloatNav variant="kolbox" items={phoneRows(dev)} currentPath={path || shown} /> : null
}
