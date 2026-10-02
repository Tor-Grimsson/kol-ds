import { RackProvider } from '../hooks/useRackContext.jsx'
import VideoModulo from './VideoModulo.jsx'
import '../rack.css'

/* THE RACK TAB ALONE — the rack's providers around its page, no router of its own and no nav
 * rail. The showcase's Rack set mounts this file (it already sits inside the showcase's router,
 * and a second router cannot nest), so the set and the app's rack tab are one component. */
export default function Standalone() {
  return (
    /* THE GROUND THE SHELL WOULD PAINT. In the app, AppShell's main is `surface-primary` and the rack
     * page lays its 4% wash and its dot grid over that. Alone there is no shell, so the wash sat on
     * the browser's white and the dots (ink at 12%) vanished into it (user 2026-10-02: "rack
     * background missing … it should show the rack background with the dots"). */
    <div className="bg-surface-primary">
      <RackProvider>
        <VideoModulo />
      </RackProvider>
    </div>
  )
}
