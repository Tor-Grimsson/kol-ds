import { DocHeader, DocSection, usePageMeta } from '@kolkrabbi/kol-workshop'

/* Round 8 — the media family on a phone (user, 2026-10-08: "I want to preview and sync every media
 * output, mobile desktop touch, every variant" … "figure it out"). Every surface has a route in
 * apps/media, the five were walked at 1440, 390 and 390 touch (`_tmp/2026-10-08-media-walk/`,
 * screenshots + walk.json), and the calls were made on the recommendation, for review. The
 * specimens are the live routes — the apps tier is the preview. Nothing here is published. */
export const meta = {
  round: 8,
  date: '2026-10-08',
  title: 'The media family on a phone',
  status: 'decided, review',
}

const cell = 'flex flex-col gap-2 rounded border border-fg-08 p-4'
const label = 'kol-doc-eyebrow'
const link = 'kol-mono-12 underline underline-offset-2 text-emphasis'

/* surface · route · what it is · 1440 · 390 · 390 touch — from walk.json after the fixes (fits = no sideways overflow) */
const SURFACES = [
  ['explorer', '/apps/media/', 'the browser and the wall as two views of one surface — media as it ships', 'fits', 'fits — the browser; views, sort and the wall behind ··· (the 2026-09-29 ruling)', 'same as 390'],
  ['browse', '/apps/media/browse', 'the column browser alone — bucket dropdown, crumb line, folders and files', 'fits', 'fits — the same picture as the explorer', 'same as 390'],
  ['library', '/apps/media/library', 'the files wall alone — FILES, filter · search, SELECT, FLAT, the icon views, the sort row (what kol-website’s brand app still runs)', 'fits', 'fits — the FILES row, then one ··· for views and sort, then the list', 'same as 390'],
  ['modal', '/apps/media/picker', 'the picker a consumer opens over its bucket (design-editor’s three doors, since 2026-10-07)', 'fits — a 64rem card over a scrim, the wall’s row', 'fits — a full-height sheet; ··· for views and sort, the store a row above the list', 'same as 390'],
  ['viewer', '/apps/media/viewer', 'MediaViewer, from MediaTileGallery’s tiles', 'fits — over a scrim, caption under the image, chips at the edges', 'fits — scrim, caption, 1 / 6 under the image; a swipe pages', 'same as 390'],
]

const DECIDED = [
  ['The explorer on a phone is the browser — already ruled', 'The Browse · Files · Kinds tab pill exists as phoneTabs and the user turned it off on 2026-09-29: the ··· carries view, sort and File formats, as the Files app does. Nothing changed; the recommendation to turn it on is withdrawn.'],
  ['The files wall folds below md', 'At 390 it stacked the FILES row, the three view icons and NAME · DATE · SIZE · KIND over the list. Below md the views and the sort are one ··· — the browse page’s fold (item 15), so the two pages fold the same way. The ··· takes the row ContentFilters gives it under the FILES row.'],
  ['The viewer shows what it always drew', 'It painted FullscreenOverlay’s opaque light surface, so its inverse ink — the caption, the paging chips at md and up — drew light on light. It passes scrim now, like the modal. On a phone, where the chips are off and a swipe pages, a 1 / 6 under the image says there is more.'],
  ['One row for the wall and the modal', 'The modal wore GRID · LIST as text and four sort cells in its header; it wears the wall’s row now — the view pair as icons on the trailing slot, the sort as the row below at md and up, one ··· below md. The pages’ MEDIA wordmark row stays: that is the product’s masthead, not the library’s header.'],
  ['The modal is an overlay, not a surface', 'It painted FullscreenOverlay’s opaque surface over the page it was opened from; it passes scrim.'],
  ['The modal has a phone layout and switches buckets', 'Under 768 it is a full-height sheet, tiles two across, the store a row above the list. A client with buckets() gets the Store dropdown, as the browse page has — what design-editor kept its own picker for.'],
  ['MediaTileGallery collapses to two across below sm', 'cols was an inline grid at every width: four 75px tiles at 390. Rule 6, first break sm.'],
  ['MediaViewer had a blank stage', 'Its root was w-full inside the content-hugging sheet; every slide laid out side by side and the first image sat 1.6k off the left edge. The stage is the viewport minus the overlay’s lane.'],
  ['The file context menu mounts on a read-only bucket', 'Copy URL and Download are read verbs and were gated with the write verbs (kol-website’s media on B2 could not download). Every bucket gets the menu; the write verbs fold away.'],
]

export default function OpenQuestionsRound8() {
  usePageMeta({ tags: [], related: [] })
  return (
    <div className="flex flex-col gap-10 pb-24">
      <DocHeader
        eyebrow="Open questions · Round 8 · 2026-10-08"
        title="The media family on a phone"
        lede="Every surface the media family ships has a route in apps/media, and the five were walked at 1440, 390 and 390 touch. The routes are the specimens. Nine calls, made on the recommendation and built; each is yours to overturn."
      />

      <DocSection id="surfaces" title="The five surfaces" lede="What each is, where it lives, and what it does at the three widths now. A row is one route; open it at the width in question.">
        <div className="grid grid-cols-1 gap-4">
          {SURFACES.map(([name, href, what, d, p, t]) => (
            <div key={name} className={cell}>
              <div className="flex flex-wrap items-baseline gap-3">
                <span className="kol-doc-body text-emphasis">{name}</span>
                <a className={link} href={href}>{href}</a>
              </div>
              <span className="kol-doc-body">{what}</span>
              <div className="grid grid-cols-1 gap-2 md:grid-cols-3">
                <span className="kol-mono-12 text-subtle">1440 · {d}</span>
                <span className="kol-mono-12 text-subtle">390 · {p}</span>
                <span className="kol-mono-12 text-subtle">390 touch · {t}</span>
              </div>
            </div>
          ))}
        </div>
      </DocSection>

      <DocSection id="decided" title="Decided on the walk — for review" lede="Built, unpublished; each has a changelog entry under Unreleased in kol-component or kol-theme. The first one is a standing ruling restated, not a change.">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {DECIDED.map(([title, what]) => (
            <div key={title} className={cell}>
              <span className="kol-doc-body text-emphasis">{title}</span>
              <span className="kol-doc-body">{what}</span>
            </div>
          ))}
        </div>
      </DocSection>

      <DocSection id="still-open" title="Still open" lede="One thing the walk could not settle alone.">
        <div className={cell}>
          <span className={label}>The phone ···</span>
          <span className="kol-doc-body">Below md, ContentFilters gives trailing actions their own row under the title row, so the wall’s and the modal’s ··· sits alone on a line. Beside SELECT · FLAT on the FILES row is where the eye looks for it; that is ContentFilters’ phone layout to change, and it touches every page on the organism.</span>
        </div>
      </DocSection>
    </div>
  )
}
