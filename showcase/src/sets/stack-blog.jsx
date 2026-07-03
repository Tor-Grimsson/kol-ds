import {
  StackHero,
  ArticleHeader,
  PortableTextRenderer,
  ArticleCard,
} from '@kolkrabbi/kol-component'

export const meta = {
  title: 'Blog / editorial',
  description: 'A long-form STACK article — full-bleed hero, masthead, portable-text body, and a card index',
  category: 'editorial',
  featured: true,
}
export const stage = 'full'

/* ─── Self-contained placeholder art ───────────────────────────────────────
 * No Sanity, no CDN, no network: every image is an inline data-URI SVG so the
 * set renders identically offline. `ph()` returns a soft two-stop gradient
 * with a faint mono label — the editorial stand-in for a real photo. */
const ph = (label, a = '#1b1b21', b = '#33333d', w = 1200, h = 675) =>
  `data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">` +
      `<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">` +
      `<stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient></defs>` +
      `<rect width="${w}" height="${h}" fill="url(#g)"/>` +
      `<line x1="0" y1="${h / 2}" x2="${w}" y2="${h / 2}" stroke="#ffffff" stroke-opacity="0.06"/>` +
      `<line x1="${w / 2}" y1="0" x2="${w / 2}" y2="${h}" stroke="#ffffff" stroke-opacity="0.06"/>` +
      `<text x="56" y="${h - 48}" fill="#ffffff" fill-opacity="0.30" ` +
      `font-family="monospace" font-size="30" letter-spacing="2">${label}</text></svg>`,
  )}`

const heroArt = ph('STACK / 001', '#101014', '#2a2a34', 1600, 900)
const mastheadArt = ph('FIG.00 — the fixed grid', '#15151a', '#30303a')
const figCode = ph('FIG.01 — measuring the em', '#181820', '#2c2c38')
const videoStill = ph('REEL — cursor drift, 24s', '#12121a', '#26262f')

/* ─── The article body, as a plain block array (NOT Sanity Portable Text) ─── */
const body = [
  {
    type: 'paragraph',
    text: [
      'A monospaced grid is a promise you make to yourself before you write a single word. ',
      'Every glyph will take the same room as every other glyph, and there is nothing you can do about it. ',
      { mark: 'segmentTitle', text: 'That constraint is the point.' },
    ],
  },
  { type: 'heading', level: 2, text: 'The case for a fixed advance' },
  {
    type: 'paragraph',
    text:
      'Proportional type optimises for reading speed: narrow letters get narrow slots, wide letters get wide ' +
      'ones, and the eye glides. Monospace throws that away. Each character sits in an identical cell, so an ' +
      'i is as wide as an m and the whole page snaps to a column grid you never have to draw. What you lose in ' +
      'density you get back in structure — code, tables, and ledgers stop fighting you.',
  },
  {
    type: 'image',
    src: mastheadArt,
    alt: 'A fixed character grid rendered as a placeholder plate',
    label: 'Figure 1',
    caption: 'Every cell is the same width. The rhythm is doing the work, not the letterforms.',
    aspect: '16/9',
  },
  { type: 'heading', level: 3, text: 'Reading the em square' },
  {
    type: 'paragraph',
    text:
      'The unit that matters is the advance width — the horizontal step from one cell to the next. Fix it once ' +
      'and layout becomes arithmetic: eighty columns is eighty times one number. You can reason about wrapping, ' +
      'alignment, and gutters without ever opening a ruler.',
  },
  {
    type: 'list',
    style: 'bullet',
    items: [
      'One advance width — the whole grid derives from it.',
      'Line height is a multiple of that step, never a guess.',
      'Alignment is free: columns land because the cells already agree.',
    ],
  },
  {
    type: 'code',
    language: 'css',
    code:
      ':root {\n' +
      '  --cell: 0.6ch;          /* one advance width */\n' +
      '  --measure: 72ch;        /* 72 columns, no ruler */\n' +
      '  --leading: 1.5;\n' +
      '}\n' +
      '.ledger { font-family: var(--kol-font-family-mono); max-width: var(--measure); }',
  },
  {
    type: 'quote',
    text: 'Constraint is not the absence of freedom. It is the thing that makes a decision cheap enough to make a thousand times.',
    cite: 'from the studio notebook',
  },
  { type: 'heading', level: 2, text: 'When it breaks — and why that is fine' },
  {
    type: 'paragraph',
    text:
      'Monospace is a poor choice for a novel and a great one for a spec. The mistake is treating it as a mood ' +
      'rather than a tool. Set body copy in something proportional; reserve the fixed grid for the moments where ' +
      'the structure IS the message — the token table, the diff, the price column, the timestamp.',
  },
  {
    type: 'video',
    file: videoStill,
    poster: videoStill,
    controls: false,
    label: 'Reel',
    caption: 'Cursor drift across a fixed grid — the still stands in for the clip in this offline set.',
    aspect: '16/9',
  },
  {
    type: 'paragraph',
    text: [
      'The design system this article lives in leans on exactly one mono family and a short numeric scale. ',
      'If you want the long version, the ',
      { mark: 'link', href: '#type', text: 'type protocol' },
      ' spells out where the fixed grid earns its keep and where it gets out of the way.',
    ],
  },
  { type: 'divider' },
  { type: 'heading', level: 3, text: 'Reference — the mono scale' },
  {
    type: 'table',
    caption: 'The numeric mono scale used across the STACK.',
    columns: [
      { header: 'Token', accessor: 'token' },
      { header: 'Size', accessor: 'size' },
      { header: 'Use', accessor: 'use' },
    ],
    rows: [
      { id: 1, token: 'kol-mono-12', size: '12 / 16', use: 'meta, captions' },
      { id: 2, token: 'kol-mono-14', size: '14 / 18', use: 'body, summaries' },
      { id: 3, token: 'kol-mono-20', size: '20 / 26', use: 'card titles' },
    ],
  },
  { type: 'caption', text: 'All measurements are advance widths, not point sizes — the grid is the ruler.' },
]

/* ─── Card index fixtures ──────────────────────────────────────────────────*/
const featured = {
  label: 'Featured',
  meta: ['Typography', '8 min'],
  kicker: 'Field notes',
  title: 'Drawing with a keyboard: the return of the ASCII plate',
  excerpt:
    'Before the pixel there was the character cell, and it never really left. A look at how fixed-grid art ' +
    'keeps sneaking back into interfaces that swear they have moved on.',
  thumbnail: ph('FEATURE — ascii plate', '#101018', '#2e2e3a'),
  href: '#ascii-plate',
}

const grid = [
  {
    title: 'A type scale you can hold in your head',
    excerpt: 'Six sizes, one family, zero exceptions. The argument for a scale small enough to memorise.',
    date: 'Jul 1, 2026',
    readingTime: '5 min',
    tags: ['Systems'],
    thumbnail: ph('SCALE', '#141420', '#2a2a3a'),
    href: '#type-scale',
  },
  {
    title: 'Tables are an interface, not an afterthought',
    excerpt: 'Alignment, density, and the quiet dignity of a column that lines up on the first try.',
    date: 'Jun 24, 2026',
    readingTime: '6 min',
    tags: ['Craft'],
    thumbnail: ph('TABLES', '#151510', '#33302a'),
    href: '#tables',
  },
  {
    title: 'The scrim, the gradient, and the readable hero',
    excerpt: 'How to lay text over a photograph without either one giving up. A short tour of the bottom-up scrim.',
    date: 'Jun 18, 2026',
    readingTime: '4 min',
    tags: ['Layout'],
    thumbnail: ph('SCRIM', '#101418', '#26303a'),
    href: '#scrim',
  },
]

const more = [
  {
    title: 'On captions: the smallest type that still has a job',
    summary: 'Why the label above the frame does more work than the headline below it.',
    meta: ['Craft', '3 min'],
    thumbnail: ph('CAP', '#14141a', '#2c2c36', 240, 240),
    href: '#captions',
  },
  {
    title: 'Anchors, slugs, and the table of contents nobody asks for',
    summary: 'Give every heading an id and the long read navigates itself.',
    meta: ['Systems', '4 min'],
    thumbnail: ph('TOC', '#12161a', '#26303a', 240, 240),
    href: '#anchors',
  },
  {
    title: 'Placeholder art that admits it is a placeholder',
    summary: 'The honest missing-asset frame beats the broken-image icon every time.',
    meta: ['Craft', '2 min'],
    thumbnail: ph('PH', '#161210', '#302a26', 240, 240),
    href: '#placeholders',
  },
]

/* The STACK blog/editorial apparatus: a full-bleed StackHero, then the article
 * masthead (ArticleHeader), the portable-text body rendered by
 * PortableTextRenderer, and a card index built from the one ArticleCard family
 * (hero + default grid + mini list). Self-providing — all fixtures inline. */
export default function StackBlogSet() {
  return (
    <div className="pb-24">
      <StackHero
        title="On Monospace and the Discipline of Constraint"
        description="Field notes from the STACK on fixed grids, readable heroes, and the tools that earn their keep."
        src={heroArt}
        alt="STACK editorial hero"
        objectPosition="center"
      />

      <div className="max-w-[880px] mx-auto px-6 pt-16">
        <ArticleHeader
          tags={['Typography', 'Systems', 'Craft']}
          title="On Monospace and the Discipline of Constraint"
          authorName="Vera Halldórs"
          authorTitle="Editor, The Stack"
          date="Jul 3, 2026"
          readingTime="9 min read"
          excerpt="A fixed grid is a promise you make before you write a word — and the reason a spec, a ledger, and a diff can finally stop fighting you."
          heroImage={figCode}
        />

        <PortableTextRenderer blocks={body} className="pt-4" />
      </div>

      <section className="max-w-[1400px] mx-auto px-6 pt-24">
        <h2 className="kol-sans-heading-04 pb-8">More from the Stack</h2>

        <div className="pb-16">
          <ArticleCard size="hero" {...featured} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 pb-20">
          {grid.map((card) => (
            <ArticleCard key={card.href} size="default" {...card} />
          ))}
        </div>

        <div className="max-w-[720px] flex flex-col gap-8">
          <h3 className="kol-sans-heading-05 pb-2">Also worth your time</h3>
          {more.map((card) => (
            <ArticleCard key={card.href} size="mini" {...card} />
          ))}
        </div>
      </section>
    </div>
  )
}
