import { useState } from 'react'
import { DocsToc, ViewToggle } from '@kolkrabbi/kol-component'
import BrandBook from './BrandBook.jsx'
import BrandAssets from './BrandAssets.jsx'
import { BRAND_VIEWS, brandToc, scrollToAnchor } from './brandBook.js'

/* taxonomy-ok: organism — the brand tool: BrandBook ⇄ BrandAssets under a view switch, with the page's section rail */

/**
 * Brand — the whole brand tool: the brand book's two pages over one manifest, BRAND (the identity)
 * and ASSETS (what you download or reproduce), a switch between them, and the page's sections on a
 * rail. ONE component so every app that carries a brand renders the same tool (apps/brand alone,
 * media-shell's Brand tab) — kol-notes' `Notes` shape.
 *
 * The manifest is `@kolkrabbi/kol-brand-template`'s schema; its `book` field carries the copy. The
 * marks come from `Logo` (a component taking `variant`) or `logoSources` (id → raw SVG, which the
 * Logos table also needs for dimensions and downloads — pass it either way).
 *
 * @param {Object}   brand        the manifest
 * @param {Function} Logo         optional `<Logo variant="wordmark" />`
 * @param {Object}   logoSources  `{ [logoId]: rawSvg }`
 * @param {'brand'|'assets'} view · onViewChange   controlled page; or internal
 * @param {string}   className    classes on the root
 */
export default function Brand({ brand, Logo, logoSources, view: viewProp, onViewChange, className = '' }) {
  const [viewState, setViewState] = useState('brand')
  const view = viewProp ?? viewState
  const setView = (v) => { if (viewProp === undefined) setViewState(v); onViewChange?.(v) }
  const Page = view === 'assets' ? BrandAssets : BrandBook

  return (
    /* `xl:pr-32` — the rail is `position: fixed` on the right edge from xl up, and the pages' grids
       run to the frame's edge; the padding keeps the last column out from under it */
    <div className={`xl:pr-32 ${className}`.trim()}>
      <div className="kol-page flex justify-end pt-6 pb-0">
        <ViewToggle variant="text" options={BRAND_VIEWS} viewMode={view} onViewChange={setView} />
      </div>
      <Page brand={brand} Logo={Logo} logoSources={logoSources} />
      <DocsToc key={view} variant="rail" toc={brandToc(brand, view)} onNavigate={scrollToAnchor} className="hidden xl:flex" />
    </div>
  )
}
