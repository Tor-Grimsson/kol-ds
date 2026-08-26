import { PageSection } from '@kolkrabbi/kol-framework'
import ExhibitCard from './ExhibitCard.jsx'
import useExhibitToc from './useExhibitToc.js'

/**
 * ExhibitPage — an exhibit's inner page, declared as CONTENT.
 *
 * The two page shapes kol-website hand-built per section collapse into one
 * component, because they were never structurally different: a showcase page is
 * a list of PageSections whose bodies are specimen grids, and a prose companion
 * is a list of PageSections whose bodies are paragraphs. A section picks its
 * body by which field it carries.
 *
 * ```jsx
 * <ExhibitPage
 *   toc={{ links: DOC_LINKS }}
 *   sections={[
 *     { id: 'intro', label: 'Dashboard', title: 'Dashboard components',
 *       body: 'Cards for metrics, charts and data.' },
 *
 *     { id: 'metric-cards', label: 'Metric cards', title: 'DashMetricCard',
 *       body: 'Label, value, delta.',
 *       specimens: [
 *         { name: 'KPI variant', description: 'Left border accent.',
 *           details: 'Variant: borderColor present', code: 'label value delta borderColor',
 *           demo: <DashMetricCard label="GAMES" value="2,847" borderColor="…" /> },
 *       ] },
 *
 *     { id: 'tracking', label: 'Tracking', title: 'Umami', prose: true,
 *       children: <><p>…</p><p>…</p></> },
 *   ]}
 * />
 * ```
 *
 * @param {Array}  sections  the page, in order. Each: `{ id, label, title, body }`
 *   plus at most one body shape — `specimens` (a grid of ExhibitCard-headed
 *   demos), or `children` (anything), optionally with `prose: true` for the
 *   reading measure. `columns` overrides the specimen grid width (default 2).
 * @param {object} [toc]  ExhibitSidebar props — `{ links, sections, basePath, docHref }`.
 *   Omit entirely to leave the shell's rail alone.
 */
export default function ExhibitPage({ sections = [], toc }) {
  useExhibitToc(toc ?? {})

  return (
    <div>
      {sections.map(({ id, label, title, body, specimens, children, prose, columns = 2 }) => (
        <PageSection key={id} id={id} label={label} title={title} body={body}>
          {specimens?.length > 0 && (
            <div
              className="mt-8 grid gap-6 items-start"
              style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
            >
              {specimens.map((s) => (
                <div key={s.name} className="space-y-4">
                  <ExhibitCard
                    name={s.name}
                    description={s.description}
                    details={s.details}
                    code={s.code}
                  />
                  {s.demo}
                </div>
              ))}
            </div>
          )}

          {/* The reading measure is the reference implementation's, kept
            * verbatim — kol-website's prose companions all wrap at 60ch on the
            * body-02 rung. */}
          {children && (
            <div className={prose ? 'mt-8 max-w-[60ch] space-y-6 kol-sans-body-02' : 'mt-8'}>
              {children}
            </div>
          )}
        </PageSection>
      ))}
    </div>
  )
}
