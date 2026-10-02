import { MemoryRouter } from 'react-router-dom'
import Standalone from './rack/Standalone.jsx'

/* THE RACK ALONE (apps-tier naming D2: `apps/<tool>` is the tool, `apps/<tool>-hub` adds the Shell
 * and Hub around it). kol-monitor's rack page — `rack/` · `modules/` · `hooks/` · `data/` are
 * monitor's files, copied — with nothing around it: no nav rail, no Home, Library, Create, Stage
 * or Settings. Those are apps/rack-hub, which imports the rack from here.
 *
 * The page reads the router (a preset in the URL, the Edit link to Create), so it sits in a
 * MemoryRouter: one location, no address bar. The showcase's Rack set mounts `Standalone`
 * directly — it is already inside the showcase's router. */
export default function App() {
  return (
    <MemoryRouter>
      <Standalone />
    </MemoryRouter>
  )
}
