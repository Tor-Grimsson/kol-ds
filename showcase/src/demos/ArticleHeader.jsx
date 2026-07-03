import { ArticleHeader } from '@kolkrabbi/kol-component'

export const stage = 'full'

const hero = `data:image/svg+xml,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 800"><rect width="1600" height="800" fill="#1d1d21"/><circle cx="1150" cy="300" r="300" fill="none" stroke="#8a8a94" stroke-width="2"/><circle cx="1150" cy="300" r="180" fill="none" stroke="#5a5a63" stroke-width="2"/><line x1="0" y1="560" x2="1600" y2="560" stroke="#3a3a41" stroke-width="2"/><line x1="420" y1="0" x2="420" y2="800" stroke="#3a3a41" stroke-width="2"/></svg>',
)}`

export default function ArticleHeaderDemo() {
  return (
    <ArticleHeader
      tags={['Design systems', 'Typography', 'Long read']}
      title="The measure of a page: setting type for reading, not for looks"
      authorName="Thordur Grimsson"
      authorTitle="Principal design engineer"
      authorInitial="TG"
      date="July 3, 2026"
      readingTime="9 min read"
      excerpt="Line length, leading, and contrast do more for comprehension than any typeface choice. A working note on the small decisions that make long-form actually readable."
      heroImage={hero}
    />
  )
}
