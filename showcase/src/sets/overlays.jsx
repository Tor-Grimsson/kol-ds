/* THE OVERLAYS SET (user 2026-10-18: "are these modal types we defined a set? … shouldnt they be?"): every overlay the
 * KOL ships — CommandOverlay (search · add · shortcuts), Modal, SettingsPanel (rail · overlay), Quick Look — opened
 * on kol-monitor's real content. It is apps/overlays' own list, mounted as is: the set and the app cannot drift. */
export const meta = {
  title: 'Overlays',
  description: 'Every KOL overlay, on monitor’s real content',
  category: 'app',
  type: 'reference',
  status: 'active',
  updated: '2026-10-18',
  tags: ['domain/components', 'pattern/overlay'],
}
export const stage = 'full'

export { default } from '../../../apps/overlays/src/Overlays.jsx'
