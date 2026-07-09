import { WorkCard } from '@kolkrabbi/kol-content'

export const stage = 'md'

/* Inline data-URI SVG cover — no network. 4:5 art-print frame. */
const cover = (label, bg, fg) =>
  `data:image/svg+xml,` +
  encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='400' height='500' viewBox='0 0 400 500'>
      <rect width='400' height='500' fill='${bg}'/>
      <circle cx='200' cy='210' r='110' fill='none' stroke='${fg}' stroke-width='2'/>
      <path d='M60 380 L200 250 L340 380' fill='none' stroke='${fg}' stroke-width='2'/>
      <rect x='150' y='160' width='100' height='100' fill='${fg}' opacity='0.15'/>
      <text x='32' y='60' fill='${fg}' font-family='monospace' font-size='18'>${label}</text>
      <text x='32' y='470' fill='${fg}' font-family='monospace' font-size='12' opacity='0.6'>KOL EDITIONS</text>
    </svg>`,
  )

const preventNav = (href, e) => e.preventDefault()

export default function WorkCardDemo() {
  return (
    <div className="flex items-end gap-8">
      <WorkCard
        title="Kría Editions"
        thumbnail={cover('01 / KRIA', '#1a1712', '#e8df00')}
        client="Kría"
        year="2026"
        type="client"
        index={0}
        href="#"
        onNavigate={preventNav}
      />
      <WorkCard
        title="Norðurljós"
        thumbnail={cover('02 / NORD', '#0e1a1a', '#5fd0c0')}
        year="2025"
        type="typeface"
        index={1}
        href="#"
        onNavigate={preventNav}
      />
    </div>
  )
}
