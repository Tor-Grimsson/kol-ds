import { Link, Outlet, useLocation } from 'react-router-dom'
import ScrollToTop from './ScrollToTop'
import { ExitPreview } from '@kolkrabbi/kol-component'

const clientSurfacePatterns = [/^\/site/]

export default function Layout() {
  const { pathname } = useLocation()
  const isClientSiteRoute = clientSurfacePatterns.some((re) => re.test(pathname))

  return (
    <div className="min-h-dvh flex flex-col">
      <ScrollToTop />
      {/* SKIP LINK (layout-skip-link, kol-client-olina 2026-09-03). Without it a
        * keyboard user tabs the whole sidenav on every page before reaching
        * content — an a11y basic, which is why the one consumer that had it kept
        * its fork of this file rather than retire onto the package.
        *
        * It lives HERE and not in a nested layout because a skip link must
        * PRECEDE the landmark it targets, and `BrandLayout` renders inside this
        * `<main>`.
        *
        * EVERY CLASS HERE EMITS, which is not a given: the consumer's copy
        * shipped `bg-accent-primary text-surface-primary` for a month and
        * neither is a utility that exists, so the link rendered with no fill at
        * all. `bg-surface-inverse` carries its own ink, and `z-modal` is a real
        * class only since kol-theme registered the z ladder with Tailwind the
        * same day — before that it emitted nothing either. */}
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-modal focus:rounded focus:px-4 focus:py-2 bg-surface-inverse kol-mono-14"
      >
        Skip to content
      </a>
      <main id="main" className="flex-1 min-w-0">
        <Outlet />
      </main>
      {isClientSiteRoute && <ExitPreview linkComponent={Link} />}
    </div>
  )
}
