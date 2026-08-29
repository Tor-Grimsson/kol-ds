import { useEffect, useState } from 'react'
import NavRail from './NavRail.jsx'
import { NavHiddenContext } from './navHidden.js'
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
 * @param {'shell'|'bare'|'overlay'} props.touch  the touch-primary policy (default 'shell' = the rail regardless):
 *                                        `bare` renders the children with NO shell on a coarse-pointer device unless
 *                                        localStorage `kol-desktop` is '1' (fxr's gate); `overlay` keeps the shell and
 *                                        mounts TouchDeviceOverlay once (monitor's)
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
 */
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
  children,
}) {
  const [navHidden, setNavHidden] = useState(false)
  const coarse = useTouchPrimary()

  /* the rail comes back on every route change */
  useEffect(() => { setNavHidden(false) }, [currentPath])
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
  const navPaths = (logomark ? ['/'] : []).concat((items ?? []).map((i) => i?.path)).filter(Boolean)
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
      onNavigate?.(path)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [navKeys, navPaths.join('\u0000'), onNavigate]) // eslint-disable-line react-hooks/exhaustive-deps

  let wantsDesktop = false
  try { wantsDesktop = typeof localStorage !== 'undefined' && localStorage.getItem('kol-desktop') === '1' } catch { /* storage blocked */ }
  /* the wash variable rides the bare wrapper too (custom properties inherit
   * through `display: contents`); there is no box here to paint the back on */
  if (touch === 'bare' && coarse && !wantsDesktop) return <div className="kol-app-shell contents" style={{ '--kol-shell-page-wash': pageWash }}>{children}</div>

  return (
    <NavHiddenContext.Provider value={{ navHidden, setNavHidden }}>
      {/* `kol-app-shell` = the app tier: neutral ::selection (kol-theme).
        * A hidden rail zeroes the live width token, so the content's own
        * margin closes with it — one variable, both sides. */}
      <div
        className="kol-app-shell min-h-dvh bg-surface-primary"
        style={navHidden ? { '--kol-shell-rail-width': '0px' } : undefined}
      >
      {touch === 'overlay' && <TouchDeviceOverlay appName={appName} />}
      {!navHidden && (
        <Rail
          items={items}
          bottomItems={bottomItems}
          logomark={logomark}
          currentPath={currentPath}
          onNavigate={onNavigate}
          iconComponent={iconComponent}
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
    </NavHiddenContext.Provider>
  )
}
