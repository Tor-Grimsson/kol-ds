import { DocsToc } from '@kolkrabbi/kol-component'

export const stage = 'full'

/* Ids are prefixed so they can't collide with the docs page's own anchors.
 * The spy runs against the window scroller — scroll the page through the
 * sections to see the highlight move. */
const TOC = [
  { id: 'toc-preview-overview', label: 'Overview' },
  { id: 'toc-preview-anatomy', label: 'Anatomy' },
  /* `children` — on the rail, one tick per entry under its section in place of
   * the inert graduations; hover the rail to read them. */
  {
    id: 'toc-preview-props',
    label: 'Props',
    children: [
      { id: 'toc-preview-props-toc', label: 'toc' },
      { id: 'toc-preview-props-variant', label: 'variant' },
      { id: 'toc-preview-props-onnavigate', label: 'onNavigate' },
      { id: 'toc-preview-props-rootmargin', label: 'rootMargin' },
    ],
  },
  { id: 'toc-preview-theming', label: 'Theming' },
]

const BODY = {
  'toc-preview-overview': 'A flat table of contents that tracks the heading currently in view and highlights its link.',
  'toc-preview-anatomy': 'A nav wrapping a list of anchors — one per heading id, linking to the matching in-page element.',
  'toc-preview-props': 'Pass toc as an array of { id, label }; onNavigate hooks the click; rootMargin tunes the active band.',
  'toc-preview-theming': 'Links are mono type at reduced emphasis, lifting to full emphasis on hover and while active.',
}

export const variants = ['list', 'rail']

export default function DocsTocPreview({ variant = 'list' }) {
  return (
    <div className="flex w-full items-start gap-10">
      <div className="w-40 shrink-0">
        <p className="kol-helper-10 text-meta mb-3">On this page</p>
        <DocsToc toc={TOC} variant={variant} />
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-6">
        {TOC.map(({ id, label, children }) => (
          <section key={id} id={id} className="flex min-h-[16rem] flex-col gap-2 rounded border border-fg-08 p-6">
            <h3 className="kol-sans-body-01 text-emphasis">{label}</h3>
            <p className="kol-sans-body-02 text-meta">{BODY[id]}</p>
            {children?.map((c) => (
              <h4 key={c.id} id={c.id} className="kol-mono-14 text-body min-h-[12rem] pt-10">{c.label}</h4>
            ))}
          </section>
        ))}
      </div>
    </div>
  )
}
