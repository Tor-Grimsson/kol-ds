import { useCallback, useEffect, useRef, useState } from 'react'
import { Button } from '@kolkrabbi/kol-component'
import NavRail from './NavRail.jsx'
import { NavHiddenContext } from './navHidden.js'
import { SettingsToggleContext } from './settingsToggle.js'
import TouchDeviceOverlay, { useTouchPrimary } from './TouchDeviceOverlay.jsx'

/**
 * AppShell — layout root: the rail + the content column. No header, no
 * footer. Router-agnostic: render your router's element (e.g. `<Outlet/>`) as
 * children and wire `currentPath`/`onNavigate` from your router at the call
 * site.
 *
 * THE RAIL IS FLAT AGAIN (RailFlatGrabOpen, kol-mirror 2026-08-28 — user: "the
 * div structure is super simple ok … it's 1 div parent and everything is just
 * in that container"): 0.13.0 had made it a collapsed kol-framework `SideNav`
 * inside the brand grid; 0.16.0 reverses that. The root is a plain wrapper, the
 * rail is `position: fixed`, and the content is offset by
 * `margin-left: var(--kol-shell-rail-width)` — the ONE variable the rail writes
 * per pointermove during a grab-drag and tweens on release, so the page is
 * pushed live through both. Hidden rail = `0px`.
 *
 * `kol-framework.css` is no longer required by the shell (it was, for one
 * grid rule, 0.13–0.15).
 *
 * `railComponent` (RailTwoLevelSections, kol-fxr 2026-08-28) — the rail is
 * rendered directly here, so proving a rail change in a consumer meant forking
 * BOTH this file and `NavRail`. Pass a component with `NavRail`'s props to
 * render your own; default is `NavRail`. A seam for experiments, not an
 * invitation to keep a fork.
 *
 * @param {Array}  props.items         nav items `{ icon, path, label }`
 * @param {Array}  props.bottomItems   items pinned below the theme toggle
 * @param {Object} props.logomark      `{ svgUrl, title }` — the rail's header mark, at the top in both states, navigates to '/'
 * @param {string} props.currentPath   the router's current pathname
 * @param {Function} props.onNavigate  `(path) => void`
 * @param {ElementType} props.iconComponent  icon renderer seam (see Button)
 * NOTE (0.16.0): `settings` and `themeToggle` left with the SideNav-backed rail
 * — the flat rail carries neither. Settings is a `bottomItems` rung whose
 * open/close is the consumer's `onNavigate` (kol-mirror's model: navigating to
 * `/settings` while already there returns to the last page), and the theme
 * toggle lives on the settings page, not in the rail (user, 2026-08-28).
 * @param {string}  props.railToggleKey  a key that toggles the rail (e.g. '\\') — ignored while typing in a field;
 *                                        the rail comes back on every `currentPath` change (ShellHomeSystem, 2026-08-27)
 * @param {'shell'|'bare'|'overlay'|'drawer'} props.touch  the touch-primary policy (default 'shell' = the rail regardless):
 *                                        'drawer' takes the rail OFF-CANVAS below `drawerBelow`, hands its width
 *                                        back to the content, and renders a trigger that brings it in over a scrim.
 *                                        Tapping a destination closes it. (ShellRailNoDrawerOnMobile, kol-chess
 *                                        2026-08-31: at 390 the 48px rail is 12.3% of the viewport, and
 *                                        `railToggleKey` is a KEY — a phone has no keyboard, so on the device where
 *                                        the rail costs most it could not be dismissed at all. `bare` was the only
 *                                        other way to reclaim the width and it throws navigation away entirely.)
 * @param {number} [props.drawerBelow=768]  viewport width under which `touch="drawer"` folds. A width, not a
 *                                        pointer test: an iPad is coarse and has room, a narrow desktop window is
 *                                        fine-pointered and does not.
 *                                        `bare` renders the children with NO shell on a coarse-pointer device unless
 *                                        localStorage `kol-desktop` is '1' (fxr's gate); `overlay` keeps the shell and
 *                                        mounts TouchDeviceOverlay once (monitor's)
 * @param {string[]} [props.drawerOpenOn=[]]  paths whose ENTRY opens the drawer (ShellDrawerOpenOnRoute,
 *                                        kol-mirror 2026-09-01 — user: "the rail should load open on home, not
 *                                        everywhere"): a home that is a catalog IS navigation, and arriving there
 *                                        with the nav folded hides the one thing the page is for. Matched like the
 *                                        rail's active row — `'/'` exact, anything else by prefix. Every other path
 *                                        keeps the close-on-navigate rule; above `drawerBelow` there is no drawer
 *                                        and the list is inert. A list, not a boolean: the policy is per-route and
 *                                        the shell already owns the route.
 * @param {string}  props.appName       TouchDeviceOverlay's subject
 * @param {boolean} props.navKeys       Option+1…9 navigates to the rail's nth ROW through `onNavigate` — with a
 *                                        `logomark` that is the mark ('/') then the items, which is the order on
 *                                        screen (AppShellNavKeysHomeFirst, 2026-08-28); without one, `items[n-1]`. The
 *                                        rail-order counterpart of `railToggleKey` (AppShellNavKeys, kol-monitor
 *                                        2026-08-28 — user: "make command or alt 1234 go from home 1 2 3 4 in the
 *                                        sidenav without clicking"). Option, not Command: ⌘1–9 is the browser's
 *                                        tab switch. Matched on `e.code` (`Digit1`…) because Opt+digit yields
 *                                        `¡ ™ £ ¢` as `e.key` on macOS; ignored while typing in a field; only
 *                                        digits with an item; `preventDefault` on a match. Default off.
 * @param {string}  props.pageWash      a CSS colour painted by `PageShell` OVER the shell's primary back
 *                                        (ShellPageWash, kol-monitor 2026-08-27 — user: "the back of the back
 *                                        should be primary — then you can just add transparent on top to step
 *                                        up the lightness"): `'var(--kol-fg-12)'` steps the page a rung lighter
 *                                        without swapping the surface. Set as `--kol-shell-page-wash` on the
 *                                        content wrapper, so a page root that is not `PageShell` reads it too.
 *                                        Default none — unset renders exactly as before. A prop, not a token
 *                                        an app binds, because fxr's stylesheet is imports-only by rule.
 * @param {string}  props.settingsPath  a destination the shell TOGGLES rather than navigates to
 *                                        (SettingsToggleGesture, user 2026-08-30): pressing the key or
 *                                        picking its rail row again returns you where you were, instead of
 *                                        stranding you on the page. Three repos had built this each for
 *                                        themselves. Unset = every destination behaves exactly as before.
 * @param {string}  props.settingsKey   the key that toggles `settingsPath` — `','` in the apps that asked.
 *                                        Bare and with ⌥, ignored while typing in a field. Needs
 *                                        `settingsPath`; alone it does nothing.
 */
/* the physical-key name for a bound character. Only the keys people actually
 * bind — a full layout table would be a lie about coverage. */
const CODE_FOR_KEY = {
  ',': 'Comma', '.': 'Period', '/': 'Slash', ';': 'Semicolon', "'": 'Quote',
  '[': 'BracketLeft', ']': 'BracketRight', '\\': 'Backslash', '`': 'Backquote',
  '-': 'Minus', '=': 'Equal',
}

/* A STABLE DEFAULT (ShellDrawerOpenOnUnstableDep, kol-mirror 2026-09-01 —
 * found by the user on his phone): `drawerOpenOn = []` in the signature was a
 * fresh array every render, and it sat in an effect's deps, so the route effect
 * re-ran on every render and closed the drawer straight after every tap. The
 * trigger did nothing on every consumer taking the default. */
const NO_PATHS = []

export default function AppShell({
  items,
  bottomItems,
  logomark,
  currentPath,
  onNavigate,
  iconComponent,
  railComponent: Rail = NavRail,
  railToggleKey,
  touch = 'shell',
  appName,
  pageWash,
  navKeys = false,
  settingsPath,
  settingsKey,
  drawerBelow = 768,
  drawerOpenOn = NO_PATHS,
  children,
}) {
  const [navHidden, setNavHidden] = useState(false)
  const coarse = useTouchPrimary()

  /* DRAWER MODE. A width query, not a pointer one — see `drawerBelow`. */
  const [narrow, setNarrow] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(`(max-width: ${drawerBelow - 1}px)`).matches,
  )
  useEffect(() => {
    if (typeof window === 'undefined') return undefined
    const mq = window.matchMedia(`(max-width: ${drawerBelow - 1}px)`)
    const on = (e) => setNarrow(e.matches)
    setNarrow(mq.matches)
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [drawerBelow])
  const drawer = touch === 'drawer' && narrow
  const [drawerOpen, setDrawerOpen] = useState(false)
  useEffect(() => { if (!drawer) setDrawerOpen(false) }, [drawer])
  useEffect(() => {
    if (!drawer || !drawerOpen) return undefined
    const onKey = (e) => { if (e.key === 'Escape') setDrawerOpen(false) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [drawer, drawerOpen])

  /* TOGGLING A DESTINATION (user 2026-08-30: "comma opens and closes the
   * settings page, and clicking the icon in sidebar opens and clicking again
   * closes"). The shell already owned two keyboard behaviours; this is a third
   * of the same kind, and it was about to be written three times — fxr, mirror
   * and monitor all render this page.
   *
   * The only new state is WHERE YOU CAME FROM. Navigation stays the consumer's
   * (`onNavigate`); the shell just decides which path to hand back. `useRef`,
   * not state: the return path must not re-render anything when it changes. */
  const returnPath = useRef(null)
  const toggleSettings = useCallback(() => {
    if (!settingsPath) return
    if (currentPath === settingsPath) {
      /* nothing remembered (deep link straight onto /settings) → the mark, which
       * is where the rail's first row goes anyway. Never a dead key. */
      onNavigate?.(returnPath.current ?? '/')
      returnPath.current = null
    } else {
      returnPath.current = currentPath
      onNavigate?.(settingsPath)
    }
  }, [settingsPath, currentPath, onNavigate])

  useEffect(() => {
    if (!settingsKey || !settingsPath) return undefined
    const onKey = (e) => {
      /* MATCH THE PHYSICAL KEY (SettingsToggleGestureConsumerSeam, kol-fxr
       * 2026-08-30). Option rewrites `e.key` on macOS — **the chord for `,` is
       * `≤`** — so an `e.key` comparison silently drops it while the bare key
       * works, which is the worst way to fail. `e.code` is the same physical key
       * either way; it is why the Option-digit handler above reads `Digit1…`
       * rather than `¡ ™ £`. `e.key` still matches too, so a character with no
       * entry in the table below is unaffected. */
      const wanted = CODE_FOR_KEY[settingsKey]
      if (!(e.key === settingsKey || (wanted && e.code === wanted)) || e.metaKey || e.ctrlKey) return
      const t = e.target
      if (t?.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t?.tagName)) return
      e.preventDefault()
      toggleSettings()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [settingsKey, settingsPath, toggleSettings])

  /* the drawer's rule for a path — matched like the rail's active row */
  const opensOn = (p) => drawerOpenOn.some((x) => (x === '/' ? p === '/' : p.startsWith(x)))

  /* the rail row for that path toggles too — one gesture, two ways to reach it.
   * THE TAP DECIDES THE DRAWER, not only the route change
   * (ShellDrawerCloseOnSamePath, kol-monitor 2026-09-02): a rung whose path is
   * the one already shown — Create tapped on /create, "new case" — changes no
   * pathname, so the route effect below never fires and the drawer stayed open
   * over the page. The tap itself now sets the drawer to that path's rule;
   * `drawerOpenOn` rungs stay open, every other rung closes it, same path or not. */
  const navigate = useCallback(
    (path, ...rest) => {
      if (drawer) setDrawerOpen(opensOn(path))
      if (settingsPath && path === settingsPath) return toggleSettings()
      return onNavigate?.(path, ...rest)
    },
    [settingsPath, toggleSettings, onNavigate, drawer, drawerOpenOn], // eslint-disable-line react-hooks/exhaustive-deps
  )

  /* THE ROUTE CHANGE MEANS THE OPPOSITE IN EACH MODE. For `railToggleKey` the
   * rail comes back on every navigation (ShellHomeSystem, 2026-08-27); for a
   * drawer, tapping a destination must CLOSE it. The old unconditional
   * `setNavHidden(false)` also made `navHidden` unusable as a consumer seam —
   * child effects run before parent effects, so a consumer hiding the rail on a
   * path change was overwritten in the same commit. */
  /* …unless the destination is one where nav IS the page (`drawerOpenOn`):
   * there the entry OPENS it. Runs on mount, on the fold and on navigation
   * alike — `drawer` is a dep — so a phone arriving on home gets the rail. */
  /* Keyed on the BOOLEAN, not the array: a consumer's inline `['/']` is a new
   * identity every render too (the showcase set passes one), and the effect
   * must fire on route entry only — never on a re-render, or it undoes the tap. */
  const opensHere = opensOn(currentPath)
  useEffect(() => {
    if (drawer) setDrawerOpen(opensHere)
    else setNavHidden(false)
  }, [currentPath, drawer, opensHere])

  /* THE WASH ALSO GOES ON THE ROOT (2026-08-30). It is set on the content
   * wrapper below, which every page inherits — but a PORTALLED surface does
   * not: `.kol-dd-panel` renders at document.body, so it read the fallback
   * `transparent` while its own trigger, inside the shell, took the wash. The
   * two halves of one connected control rendered at different values, which is
   * exactly what the user saw. Anything floating over the page is still ON the
   * page as far as this film is concerned. */
  useEffect(() => {
    const root = document.documentElement
    if (pageWash == null) { root.style.removeProperty('--kol-shell-page-wash'); return undefined }
    root.style.setProperty('--kol-shell-page-wash', pageWash)
    return () => root.style.removeProperty('--kol-shell-page-wash')
  }, [pageWash])
  /* one key toggles the rail — never while typing in a field */
  useEffect(() => {
    if (!railToggleKey) return undefined
    const onKey = (e) => {
      if (e.key !== railToggleKey || e.metaKey || e.ctrlKey || e.altKey) return
      const t = e.target
      if (t?.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t?.tagName)) return
      e.preventDefault()
      setNavHidden((h) => !h)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [railToggleKey])

  /* Option+digit → the rail ROW in that position (never while typing).
   *
   * THE MARK IS ROW 1 (AppShellNavKeysHomeFirst, kol-monitor 2026-08-28 — user:
   * "alt 1 skips home and goes straight to 2"). 0.12.0 navigated to
   * `items[n - 1]`, but the rail's first row is the LOGOMARK, which `NavRail`
   * renders above the items and wires to '/'. So ⌥1 landed on the second rung
   * and every key after it was off by one, with Home having no key at all —
   * against the sentence that asked for the feature, quoted in the prop's own
   * docblock above: "make command or alt 1234 go from HOME 1 2 3 4". Home was
   * position 1 in the ask; the implementation counted a list it was never in.
   *
   * With a `logomark`, the order is the order you see: the mark, then the items.
   * Without one, `items[n - 1]` exactly as before, so an app that renders no
   * mark is untouched. */
  /* …and the BOTTOM rows after them (the Hub, 2026-09-26): the rail read top to bottom,
   * Settings included. kol-fxr kept a local ⌥-digit handler for exactly this — its ⌥6 is
   * Settings — and monitor and mirror kept theirs; three copies of one key map. */
  const navPaths = (logomark ? ['/'] : []).concat([...(items ?? []), ...(bottomItems ?? [])].map((i) => i?.path)).filter(Boolean)
  useEffect(() => {
    if (!navKeys) return undefined
    const onKey = (e) => {
      const m = /^Digit([1-9])$/.exec(e.code)
      if (!m || !e.altKey || e.metaKey || e.ctrlKey) return
      const t = e.target
      if (t?.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t?.tagName)) return
      const path = navPaths[Number(m[1]) - 1]
      if (!path) return
      e.preventDefault()
      navigate(path)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [navKeys, navPaths.join('\u0000'), navigate]) // eslint-disable-line react-hooks/exhaustive-deps

  let wantsDesktop = false
  try { wantsDesktop = typeof localStorage !== 'undefined' && localStorage.getItem('kol-desktop') === '1' } catch { /* storage blocked */ }
  /* the wash variable rides the bare wrapper too (custom properties inherit
   * through `display: contents`); there is no box here to paint the back on */
  if (touch === 'bare' && coarse && !wantsDesktop) return <div className="kol-app-shell contents" style={{ '--kol-shell-page-wash': pageWash }}>{children}</div>

  return (
    <NavHiddenContext.Provider value={{ navHidden, setNavHidden }}>
      <SettingsToggleContext.Provider value={toggleSettings}>
      {/* `kol-app-shell` = the app tier: neutral ::selection (kol-theme).
        * A hidden rail zeroes the live width token, so the content's own
        * margin closes with it — one variable, both sides. */}
      <div
        className="kol-app-shell min-h-dvh bg-surface-primary"
        /* A DRAWER ZEROES THE TOKEN TOO. Off-canvas means the content owns the
         * whole viewport, so the same one variable that closes the content's
         * margin for `navHidden` closes it here — the rail then takes its own
         * `--kol-shell-drawer-width` rather than this token. */
        data-rail-drawer={drawer ? (drawerOpen ? 'open' : 'closed') : undefined}
        style={navHidden || drawer ? { '--kol-shell-rail-width': '0px' } : undefined}
      >
      {touch === 'overlay' && <TouchDeviceOverlay appName={appName} />}
      {/* THE TRIGGER SHIPS HERE, not in every consumer's page header — the rail
        * is the shell's, so the only way to reach it is too. Hamburger closed,
        * × open; 32px square clears the 24px touch floor. */}
      {drawer && (
        <Button
          variant="nav"
          iconOnly={drawerOpen ? 'x' : 'hamburger'}
          iconComponent={iconComponent}
          aria-label={drawerOpen ? 'Close navigation' : 'Open navigation'}
          aria-expanded={drawerOpen}
          className="kol-shell-drawer-trigger"
          onClick={() => setDrawerOpen((o) => !o)}
        />
      )}
      {drawer && drawerOpen && (
        /* A BUTTON, not a div (the OverlayScrimTapDismiss line, 2026-09-01):
         * iOS Safari does not bubble tap-clicks from non-interactive elements,
         * and this scrim exists ONLY on touch devices. */
        <button
          type="button"
          aria-label="Close navigation"
          className="kol-shell-drawer-scrim"
          onClick={() => setDrawerOpen(false)}
        />
      )}
      {!navHidden && (
        <Rail
          items={items}
          bottomItems={bottomItems}
          logomark={logomark}
          currentPath={currentPath}
          /* the rail routes through `navigate`, so its settings row toggles like the key */
          onNavigate={navigate}
          iconComponent={iconComponent}
          drawer={drawer}
        />
      )}
      {/* THE BACK OF THE BACK — surface-primary, always, in every app; the
        * page paints its wash over it (ShellPageWash). */}
      {/* the margin IS the rail's live width, so the content is pushed
        * through the drag and the snap (RailFlatGrabOpen) */}
      <div className="bg-surface-primary min-w-0" style={{ marginLeft: `var(--kol-shell-rail-width)`, '--kol-shell-page-wash': pageWash }}>
        {children}
      </div>
      </div>
      </SettingsToggleContext.Provider>
    </NavHiddenContext.Provider>
  )
}
