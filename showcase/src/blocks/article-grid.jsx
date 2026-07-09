import { ArticleCard } from '@kolkrabbi/kol-content'

export const meta = {
  title: 'Article grid',
  description: 'A blog index — hero article over a three-up row and a mini reading list',
  category: 'content',
}
export const stage = 'full'

/* Real editorial imagery (served at /kol-images), cycled through the grid. */
const KOL_IMAGES = Array.from({ length: 7 }, (_, i) => `/kol-images/tt-0${i + 1}.jpg`)
let _phi = 0
const thumb = () => KOL_IMAGES[_phi++ % KOL_IMAGES.length]

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
    <div className="flex flex-col gap-12 px-6 py-12 md:px-10">
      <ArticleCard size="hero" {...HERO} />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
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
