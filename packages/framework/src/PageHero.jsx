import { Link } from 'react-router-dom'
import { SectionText } from '@kolkrabbi/kol-component'

/**
 * PageHero — the page's opening band: label · title · lede, with an optional
 * mark beside the text and an optional back link above it.
 *
 * ONE HERO (page-family-is-not-a-set, kol-client-olina 2026-09-03; user, on
 * the brand kit: *"why do 3 of 4 prefix PAGE if they are a set?"*). `BrandHero`
 * and `SubPageHero` were the same core with one optional slot each — a `mark`
 * on one, a back link on the other — under two prefixes, and each hand-stacked
 * its own label / title / lede. Both names alias this; the retirements ledger
 * carries them.
 *
 * COMPOSES `SectionText`, the page tier's base, the way `PageHeader` does. The
 * voices are `BrandHero`'s verbatim — `.kol-prose-label` · `.kol-prose-display`
 * · `.kol-prose-lede` (kol-theme's section-head trio, each carrying its own
 * bottom margin, so the block's `gap` is 0 and the rhythm is the classes').
 * `SubPageHero` had no package consumer, so its private voices did not survive
 * the merge; its back link did, class-for-class.
 *
 * @param {string}    id         section id (default `hero`) — the sidenav's scroll-spy anchor
 * @param {string}    backTo     route for the back link; unset renders no link
 * @param {ReactNode} backLabel  the back link's text
 * @param {ReactNode} label      eyebrow above the title
 * @param {ReactNode} title      the h1
 * @param {ReactNode} lede       standfirst under the title, measured at 60ch
 * @param {ReactNode} mark       a node beside the text column (a logo); the text sits right of it
 * @param {string}    className  extra classes on the section
 */
export default function PageHero({ id = 'hero', backTo, backLabel, label, title, lede, mark, className = '' }) {
  return (
    <section id={id} className={`kol-page-hero ${className}`.trim()}>
      {backTo && (
        <Link
          to={backTo}
          className="kol-back-link kol-helper-12 tracking-widest text-body hover:text-emphasis no-underline"
        >
          {backLabel}
        </Link>
      )}
      <div className="flex items-center gap-12 flex-wrap">
        {mark}
        <div className="flex-1 min-w-[280px]">
          <SectionText
            eyebrow={label}
            eyebrowClass="kol-prose-label"
            headline={title}
            headlineAs="h1"
            headlineClass="kol-prose-display"
            body={lede}
            bodyClass="kol-prose-lede max-w-[60ch]"
            gap="gap-0"
          />
        </div>
      </div>
    </section>
  )
}
