import { VOYAGER } from 'voyager-fixture'

/* the website frame's previews' site — VOYAGER's marks (currentColor, as the frame expects) and its links */
export const SITE = {
  name: VOYAGER.brand.meta.name,
  wordmark: VOYAGER.logoSources.wordmark,
  logomark: VOYAGER.logoSources.logomark,
  navItems: [{ to: '/routes', label: 'Routes' }, { to: '/kit', label: 'Kit' }, { to: '/journal', label: 'Journal' }, { to: '/about', label: 'About' }],
  takeover: { lines: [VOYAGER.brand.meta.name, 'Expeditions across the North Atlantic'], blurb: 'Routes, dates and kit lists for every trip.', social: { href: 'https://voyager.example', label: 'voyager.example', icon: 'globe' } },
}
