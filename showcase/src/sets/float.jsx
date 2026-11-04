/* THE FLOAT SET (plan-2026-11-04-float-set W2 — user 2026-11-04: *"why wouldnt you just group it as a set? … its a
 * fuckign family of UI components views and styles"*): every float part family by family, solid and glass, and the
 * screens built from them, on FloatLayout. It is apps/float's own App, mounted as is (the Controls set's pattern), so
 * the set and `pnpm float` cannot drift. */
export const meta = {
  title: 'Float',
  description: 'Every float part and screen, solid and glass',
  category: 'app',
  featured: true,
  type: 'reference',
  status: 'active',
  updated: '2026-11-04',
  tags: ['domain/components', 'pattern/layout'],
}
export const stage = 'full'

export { default } from '../../../apps/float/src/App.jsx'
