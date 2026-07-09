import { ArticleCard } from '@kolkrabbi/kol-content'

export const stage = 'lg'

const svg = (body) =>
  `data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 450">${body}</svg>`,
  )}`

const heroThumb = svg(
  '<rect width="800" height="450" fill="#1d1d21"/><circle cx="560" cy="180" r="150" fill="none" stroke="#8a8a94" stroke-width="2"/><circle cx="560" cy="180" r="90" fill="none" stroke="#5a5a63" stroke-width="2"/><line x1="0" y1="320" x2="800" y2="320" stroke="#3a3a41" stroke-width="2"/>',
)
const defaultThumb = svg(
  '<rect width="800" height="450" fill="#1d1d21"/><rect x="120" y="90" width="560" height="270" fill="none" stroke="#8a8a94" stroke-width="2"/><line x1="120" y1="90" x2="680" y2="360" stroke="#3a3a41" stroke-width="2"/><line x1="680" y1="90" x2="120" y2="360" stroke="#3a3a41" stroke-width="2"/>',
)
const miniThumb = svg(
  '<rect width="800" height="450" fill="#1d1d21"/><path d="M0 340 L200 220 L360 300 L560 140 L800 260" fill="none" stroke="#8a8a94" stroke-width="3"/><line x1="0" y1="380" x2="800" y2="380" stroke="#3a3a41" stroke-width="2"/>',
)

export default function ArticleCardDemo() {
  return (
    <div className="flex w-full flex-col gap-10">
      <ArticleCard
        size="hero"
        label="Featured"
        meta={['Field notes', '12 min read']}
        kicker="Typography"
        title="The quiet grid: how baseline rhythm holds a page together"
        summary="A close read of vertical spacing — why a shared baseline unit turns a stack of unrelated blocks into something that scans as one document."
        thumbnail={heroThumb}
        href="#hero"
      />

      <ArticleCard
        size="default"
        title="Designing tokens that survive a redesign"
        excerpt="Semantic names outlive the palette. A short case for describing intent, not hex."
        tags={['Design systems', 'Tokens']}
        date="Jul 3, 2026"
        readingTime="6 min read"
        thumbnail={defaultThumb}
        href="#default"
      />

      <ArticleCard
        size="mini"
        title="What we learned shipping a monorepo of one"
        summary="Boundaries you enforce before you need them."
        meta={['Engineering', 'Aug 2026']}
        thumbnail={miniThumb}
        href="#mini"
      />
    </div>
  )
}
