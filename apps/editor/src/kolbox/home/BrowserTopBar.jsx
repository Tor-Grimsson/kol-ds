import { Fragment } from 'react'

/* The browser's top bar (Figma `BrowserTopBar`): 49 high, the breadcrumb at the left, inset 32; actions at the right
   (Create, Share, the adjust icon, the star). crumbs: strings. lead: a node before the breadcrumb (Home's KOL mark and
   its one menu, round 4 W12: Home has no top rail, so the way out sits here). */
export default function BrowserTopBar({ crumbs = [], lead, actions }) {
  return (
    <header className="flex h-[49px] shrink-0 items-center gap-4 px-8 max-md:order-first max-md:gap-2 max-md:px-4" data-browser-top-bar>
      {lead}
      <nav aria-label="Breadcrumb" className="flex min-w-0 flex-1 items-center gap-4 text-[13px] leading-[22px] font-[450] text-muted">
        {crumbs.map((c, i) => (
          <Fragment key={i}>
            {i > 0 && <span aria-hidden>/</span>}
            <span className="truncate">{c}</span>
          </Fragment>
        ))}
      </nav>
      <div className="flex shrink-0 items-center gap-2">{actions}</div>
    </header>
  )
}
