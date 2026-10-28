import { useRef } from 'react'
import { LinkPreview } from '@kolkrabbi/kol-framework'
import { TABS, docSource, assetUrl } from 'document-fixture'
import { splitFrontmatter } from '@kolkrabbi/kol-markdown'

export const stage = 'full'

/* The hover card: pause on a link in the sheet and a card opens under it — the page's title and first line from the
 * document fixture, its first image. `cardFor` is what an app writes from its own corpus; here it reads three of
 * kol-atlas's pages by their `#page` link. */
const PAGES = Object.fromEntries(['brief', 'brand', 'media'].map((id) => {
  const t = TABS.find((x) => x.id === id)
  const body = splitFrontmatter(docSource(t.file) ?? '').body
  const text = body.split('\n').find((l) => l.trim() && !/^(#|!\[|%%|Dates:|Covers:)/.test(l.trim())) ?? ''
  const image = /!\[\[([^\]|]+)/.exec(body)?.[1]
  return [id, { title: t.title, text, image: image ? assetUrl(t.file, image.trim()) : null, site: 'Reference', href: `#${id}` }]
}))
const cardFor = (a) => PAGES[(a.getAttribute('href') || '').slice(1)] ?? null

export default function LinkPreviewPreview() {
  const root = useRef(null)
  return (
    <div ref={root} className="w-full">
      <article className="kol-sheet" style={{ maxWidth: 720 }}>
        <p>
          The <a href="#brief">brief</a> sets the goals, the <a href="#brand">brand summary</a> holds the voice, and the{' '}
          <a href="#media">media</a> page is the reference wall. Rest on a link and its card opens under it.
        </p>
      </article>
      <LinkPreview root={root} cardFor={cardFor} />
    </div>
  )
}
