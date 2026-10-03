/* THE MIXER, AS ITS PARTS (2026-10-01 — user: "channel strip is … part of mirror system more
 * channel mixer based. but still hardware. it would be its own collection"). A channel strip per
 * source: power, a grid of knobs, a column of actions, the sliders, a footer.
 *
 * IT IS apps/mixer's OWN STUDIO (2026-10-03), mounted here — the set and the app cannot drift.
 * `Standalone.jsx` is kol-mirror's studio without the app's router (a router cannot nest in the
 * showcase's). */
export { default } from '../../../apps/mixer/src/Standalone.jsx'

export const meta = {
  title: 'Mixer',
  description: 'The parts a channel mixer is built from',
  category: 'hardware',
  featured: true,
  type: 'reference',
  status: 'active',
  updated: '2026-10-03',
  tags: ['domain/hardware', 'pattern/structure'],
}
export const stage = 'full'
