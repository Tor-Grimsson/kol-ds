import { ArticleCard } from '@kolkrabbi/kol-component'

export const meta = {
  title: 'Article grid',
  description: 'A blog index — hero article over a three-up row and a mini reading list',
  category: 'content',
}
export const stage = 'full'

/* Inline editorial thumbnail — standalone SVG document, no network. */
const thumb = (a, b, seed = 0) =>
  `data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='1200' height='800'>` +
      `<defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'>` +
      `<stop offset='0' stop-color='${a}'/><stop offset='1' stop-color='${b}'/>` +
      `</linearGradient></defs>` +
      `<rect width='1200' height='800' fill='url(#g)'/>` +
      `<circle cx='${240 + seed * 120}' cy='260' r='210' fill='#ffffff' opacity='0.08'/>` +
      `<rect x='${640 - seed * 60}' y='420' width='380' height='380' rx='24' fill='#000000' opacity='0.10'/>` +
      `</svg>`,
  )}`

const HERO = {
  title: 'How a small studio built its own type foundry from scratch',
  summary:
    'Two years, one revived grotesk, and a lot of late nights. We spent a week with the team behind the release to learn how a side project became the backbone of the practice.',
  kicker: 'Long read',
  label: 'From the journal',
  meta: ['Issue 14', '18 min read'],
  thumbnail: thumb('#1E3A8A', '#22D3EE', 0),
  href: '#/journal/type-foundry',
}

const ROW = [
  {
    title: 'The quiet revival of risograph printing',
    excerpt: 'Why designers keep coming back to a machine built for parish newsletters.',
    tags: ['Print', 'Craft'],
    date: 'Jun 12',
    readingTime: '6 min',
    thumbnail: thumb('#7C2D12', '#F59E0B', 1),
    href: '#/journal/risograph',
  },
  {
    title: 'Designing a colour system that survives dark mode',
    excerpt: 'Tokens, contrast, and the one rule that keeps a palette honest across themes.',
    tags: ['Systems', 'Colour'],
    date: 'Jun 05',
    readingTime: '9 min',
    thumbnail: thumb('#065F46', '#84CC16', 2),
    href: '#/journal/colour-system',
  },
  {
    title: 'Field notes from a coastal residency',
    excerpt: 'A month of kelp, salt, and slow making on the far edge of the map.',
    tags: ['Field', 'Craft'],
    date: 'May 28',
    readingTime: '7 min',
    thumbnail: thumb('#4C1D95', '#EC4899', 3),
    href: '#/journal/residency',
  },
]

const MINI = [
  {
    title: 'What we learned shipping a component library to five teams',
    summary: 'Versioning, naming, and the docs that actually got read.',
    meta: ['Engineering', '5 min'],
    thumbnail: thumb('#0F766E', '#22D3EE', 0),
    href: '#/journal/component-library',
  },
  {
    title: 'A short defence of the boring layout',
    summary: 'Grids are not the enemy of expression.',
    meta: ['Opinion', '4 min'],
    thumbnail: thumb('#312E81', '#F43F5E', 1),
    href: '#/journal/boring-layout',
  },
  {
    title: 'The tools we stopped using this year',
    summary: 'And the two we would not give up.',
    meta: ['Workflow', '6 min'],
    thumbnail: thumb('#78350F', '#FBBF24', 2),
    href: '#/journal/tools',
  },
]

export default function ArticleGrid() {
  return (
    <div className="flex flex-col gap-12">
      <ArticleCard size="hero" {...HERO} />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {ROW.map((a) => (
          <ArticleCard key={a.href} size="default" {...a} />
        ))}
      </div>

      <div className="flex flex-col gap-6 border-t border-fg-08 pt-8">
        <div className="kol-label-mono-xs text-fg-64">More to read</div>
        {MINI.map((a) => (
          <ArticleCard key={a.href} size="mini" {...a} />
        ))}
      </div>
    </div>
  )
}
