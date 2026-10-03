import { MemoryRouter } from 'react-router-dom'
import { registerIcons } from '@kolkrabbi/kol-icons'
import Standalone from './Standalone.jsx'

/* THE MIXER ALONE (apps-tier naming D2: `apps/<tool>` is the tool). kol-mirror's studio on this
 * repo's packages — `Standalone.jsx` and everything under it. Mirror's shell, its Home, Library,
 * Create and Settings and its development tabs are not here (plan-2026-10-03-mixer-and-mixer-hub).
 *
 * The studio reads the router (the sidebar's logomark, a deep link's state), so it sits in a
 * MemoryRouter: one location, no address bar. */

/* Mirror's own glyphs, handed to the DS resolver once at boot — as mirror's `App.jsx` does. Here
 * and not in Standalone: registered names win over the packaged sets, and in the showcase that
 * would redraw its icons. */
registerIcons(import.meta.glob('./components/icons/svg/**/*.svg', { eager: true, query: '?raw', import: 'default' }))

export default function App() {
  return (
    <MemoryRouter>
      <Standalone />
    </MemoryRouter>
  )
}
