import { DocsToc } from '@kolkrabbi/kol-component'

/* The spy runs against the window scroller, so each story renders sections
 * tall enough to scroll through. The toc column is sticky — it stays put
 * while the highlight walks the list. */

const TOC = [
  { id: 'toc-story-overview', label: 'Overview' },
  { id: 'toc-story-anatomy', label: 'Anatomy' },
  { id: 'toc-story-props', label: 'Props' },
  { id: 'toc-story-theming', label: 'Theming' },
]

const Sections = () => (
  <div className="flex w-[28rem] min-w-0 flex-col gap-6">
    {TOC.map(({ id, label }) => (
      <section key={id} id={id} className="flex min-h-[20rem] flex-col gap-2 rounded border border-fg-08 p-6">
        <h3 className="kol-sans-body-01 text-emphasis">{label}</h3>
        <p className="kol-sans-body-02 text-meta">
          Scroll the page — the toc highlights this section while its heading
          sits in the active band.
        </p>
      </section>
    ))}
  </div>
)

export const Default = () => (
  <div className="flex items-start gap-10">
    <div className="w-40 shrink-0">
      <div className="sticky top-8">
        <DocsToc toc={TOC} />
      </div>
    </div>
    <Sections />
  </div>
)

export const WideActiveBand = () => (
  <div className="flex items-start gap-10">
    <div className="w-40 shrink-0">
      <div className="sticky top-8">
        {/* useScrollSpy's own default band — mid-viewport instead of the
            ported source's near-top band. */}
        <DocsToc toc={TOC} rootMargin="-30% 0px -60% 0px" />
      </div>
    </div>
    <Sections />
  </div>
)
