import { useSearchParams } from 'react-router-dom'
import LangToggle from '../components/LangToggle'
import { kitSections } from '../lib/kitSections'
import { KIT_PAGES } from '../lib/kitOptions'
import { readLang } from '../lib/i18n'

/* The kit as plain text: every section on one page, in kit order, no sheet
 * framing — the source every Library treatment renders. Section labels come
 * from KIT_PAGES, so this page, the options panel and the A4 sheets agree.
 *
 * ponytail: the section components are reused verbatim — each still renders
 * its own <main> with page padding, and Cover/Back their framed A-sheet;
 * kol-resume-source.css flattens them. Upgrade path: have the five render a
 * <section> once nothing renders them as standalone routes. */
export default function ResumeSource() {
  const [params] = useSearchParams()
  const lang = readLang(params)
  const nodes = kitSections(lang)

  return (
    <div className="kol-resume-source p-8 md:p-12 max-w-5xl">
      <header className="mb-10 flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="kol-helper-12 text-meta uppercase mb-2">Resume</p>
          <h1 className="kol-sans-display-03 text-emphasis mb-2">Source</h1>
          <p className="kol-sans-body-02 text-body max-w-prose">
            The application kit as plain text — every section on one page, in kit order. Treatments and exports live in the Library.
          </p>
        </div>
        <LangToggle className="print:hidden" />
      </header>

      {KIT_PAGES.map(({ id, label }, i) => (
        <section key={id} id={id} aria-label={label} className="border-t border-fg-08 pt-6 mb-14">
          <p className="kol-helper-10 text-subtle uppercase mb-6">
            {String(i + 1).padStart(2, '0')} · {label}
          </p>
          {nodes[id]}
        </section>
      ))}
    </div>
  )
}
