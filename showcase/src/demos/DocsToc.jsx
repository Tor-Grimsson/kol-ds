import { DocsToc } from '@kolkrabbi/kol-component'

export const stage = 'full'

/* Ids are prefixed so they can't collide with the docs page's own anchors.
 * The spy runs against the window scroller — scroll the page through the
 * sections to see the highlight move. */
const TOC = [
  { id: 'toc-demo-overview', label: 'Overview' },
  { id: 'toc-demo-anatomy', label: 'Anatomy' },
  { id: 'toc-demo-props', label: 'Props' },
  { id: 'toc-demo-theming', label: 'Theming' },
]

const BODY = {
  'toc-demo-overview': 'A flat table of contents that tracks the heading currently in view and highlights its link.',
  'toc-demo-anatomy': 'A nav wrapping a list of anchors — one per heading id, linking to the matching in-page element.',
  'toc-demo-props': 'Pass toc as an array of { id, label }; onNavigate hooks the click; rootMargin tunes the active band.',
  'toc-demo-theming': 'Links are mono type at reduced emphasis, lifting to full emphasis on hover and while active.',
}

export default function DocsTocDemo() {
  return (
    <div className="flex w-full items-start gap-10">
      <div className="w-40 shrink-0">
        <p className="kol-helper-10 text-meta mb-3">On this page</p>
        <DocsToc toc={TOC} />
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-6">
        {TOC.map(({ id, label }) => (
          <section key={id} id={id} className="flex min-h-[16rem] flex-col gap-2 rounded border border-fg-08 p-6">
            <h3 className="kol-sans-body-01 text-emphasis">{label}</h3>
            <p className="kol-sans-body-02 text-meta">{BODY[id]}</p>
          </section>
        ))}
      </div>
    </div>
  )
}
