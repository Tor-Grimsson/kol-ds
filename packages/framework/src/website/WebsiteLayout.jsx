import { Outlet, useLocation } from 'react-router-dom'
import Navbar from './Navbar.jsx'
import { Footer } from './Footer.jsx'
import { CursorProvider } from './CursorContext.jsx'
import { WorkViewProvider } from './WorkViewContext.jsx'
import CursorOverlay from './CursorOverlay.jsx'
/* kol-component's AsciiCursor — one, not two: touch and reduced-motion gated, and since kol-component 0.311.3 carrying the
 * site's 2026-08-25 fixes (the firework's setState-in-render, the context menu left alone). `hideCursor`: the site always hid
 * the native cursor under it (AsciiCursorFireworkSetStateInRender, 2026-10-29) */
import { AsciiCursor } from '@kolkrabbi/kol-component'

/**
 * WebsiteLayout — a website's frame: the top bar and its takeover menu, full-bleed pages, the footer, an optional cursor
 * layer. kolkrabbi.io's `components/layout/WebsiteLayout.jsx`, carried verbatim into kol-framework (LayoutsAndWebsiteLayout,
 * kol-website 2026-10-28 — *"copy it, don't redesign it"*). The one change is the seams: what the site says comes in.
 *
 *   wordmark · logomark   raw SVG strings — the bar's wordmark, the takeover's big mark
 *   name                  the site's name, for the marks' labels ("<name> wordmark", "<name> home")
 *   navItems              `[{ to, label }]` — the takeover's links (kolkrabbi.io: Studio · Work · Foundry · Stack · Prints · Workshop)
 *   takeover              `{ lines: [string], blurb, social: { href, label, icon } }` — the takeover's studio block
 *   owner                 the footer's line: `© <year> <owner>`
 *   hideChrome            `(pathname) => bool`, or an array of path prefixes — routes that drop the bar and footer
 *   tools                 `{ routes: [path], node }` — a page control that rides the bar's tools slot on those routes
 *   cursor                true → the cursor ring and the ASCII cursor (opt-in)
 *   children              the page; without it, the router's `<Outlet />` (a layout route)
 *
 * The intro (`IntroLoader`) and `RouteLoader` are mounted by the site, outside the frame, as kolkrabbi.io does.
 */
export default function WebsiteLayout({ wordmark, logomark, name, navItems = [], takeover, owner, hideChrome: hide, tools, cursor = false, children }) {
  const location = useLocation()
  const hideChrome = typeof hide === 'function' ? hide(location.pathname) : (hide ?? []).some((p) => location.pathname.startsWith(p))

  return (
    <WorkViewProvider>
      <CursorProvider>
        <div className="min-h-dvh bg-surface-primary">
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[60] focus:px-4 focus:py-2 focus:rounded bg-accent-primary text-surface-primary kol-mono-14"
          >
            Skip to content
          </a>
          {!hideChrome && <Navbar wordmark={wordmark} logomark={logomark} name={name} navItems={navItems} takeover={takeover} tools={tools} />}
          {children ?? <Outlet />}
          {!hideChrome && <Footer owner={owner} />}
          {cursor && <CursorOverlay />}
          {cursor && <AsciiCursor hideCursor />}
        </div>
      </CursorProvider>
    </WorkViewProvider>
  )
}
