import { Outlet, useLocation } from 'react-router-dom'
import Navbar from './Navbar'
import { Footer } from './Footer'
import { CursorProvider } from '../cursor/CursorContext'
import { WorkViewProvider } from '../../context/WorkViewContext'
import CursorOverlay from '../cursor/CursorOverlay'
import AsciiCursor from '../ui/AsciiCursor'

export default function WebsiteLayout() {
  const location = useLocation()
  const hideChrome = location.pathname.startsWith('/workshop') || location.pathname.startsWith('/docs')

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
          {!hideChrome && <Navbar />}
          <Outlet />
          {!hideChrome && <Footer />}
          <CursorOverlay />
          <AsciiCursor />
        </div>
      </CursorProvider>
    </WorkViewProvider>
  )
}
