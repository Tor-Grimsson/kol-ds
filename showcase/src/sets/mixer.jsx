/* THE MIXER, AS ITS PARTS (2026-10-01 — user: "channel strip is … part of mirror system more
 * channel mixer based. but still hardware. it would be its own collection"). A channel strip per
 * source: power, a grid of knobs, a column of actions, the sliders, a footer.
 *
 * IT IS apps/mixer's OWN ENTRY FILE (2026-10-02), mounted here — the set and the app cannot drift. */
export { default } from '../../../apps/mixer/src/App.jsx'

export const meta = {
  title: 'Mixer',
  description: 'The parts a channel mixer is built from',
  category: 'hardware',
  featured: true,
  type: 'reference',
  status: 'active',
  updated: '2026-10-02',
  tags: ['domain/hardware', 'pattern/structure'],
}
export const stage = 'full'
