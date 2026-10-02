/* THE RACK, AS ITS PARTS (2026-10-01 — user: "I need to be able to find the collection of parts
 * that make up things like the rack"). The case and its 1U / 3U rows, a slot per module, the
 * module frame, and the panel controls inside: knobs, a slider, switches, lights and jacks.
 *
 * IT IS apps/rack's OWN ENTRY FILE (2026-10-02), mounted here — the set and the app cannot drift. */
export { default } from '../../../apps/rack/src/App.jsx'

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
