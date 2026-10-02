/* THE RACK, AS ITS PARTS (2026-10-01 — user: "I need to be able to find the collection of parts
 * that make up things like the rack"). The case and its 1U / 3U rows, a slot per module, the
 * module frame, and the panel controls inside: knobs, a slider, switches, lights and jacks.
 *
 * IT IS apps/rack's OWN RACK TAB (2026-10-02), mounted here — the set and the app cannot drift.
 * `Standalone.jsx` is that tab without the app's router and nav rail (a router cannot nest in the
 * showcase's). */
export { default } from '../../../apps/rack/src/rack/Standalone.jsx'

export const meta = {
  title: 'Rack',
  description: 'The parts a eurorack is built from',
  category: 'hardware',
  featured: true,
  type: 'reference',
  status: 'active',
  updated: '2026-10-02',
  tags: ['domain/hardware', 'pattern/structure'],
}
export const stage = 'full'
