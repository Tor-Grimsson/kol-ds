/* THE CONTROLS SET (plan-2026-10-31-menu-engine W3.1 — user 2026-10-31: *"in showcase controls also get 'SET' which is
 * a type of homespace for related elements"*): every value changer the KOL ships — parametric, app controls, the
 * menus on their one engine, and the compositions built from them. It is apps/controls' own page, mounted as is, so
 * the set and `pnpm controls` cannot drift (the Overlays set's pattern). */
export const meta = {
  title: 'Controls',
  description: 'Every KOL control and how it behaves, menus included',
  category: 'app',
  featured: true,
  type: 'reference',
  status: 'active',
  updated: '2026-10-31',
  tags: ['domain/components', 'pattern/input'],
}
export const stage = 'full'

export { default } from '../../../apps/controls/src/App.jsx'
