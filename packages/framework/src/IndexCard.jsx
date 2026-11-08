import { IconLoader } from '@kolkrabbi/kol-icons'

/* taxonomy-ok: molecule — one contents row as a card: label · title · meta · the arrow */

/**
 * IndexCard — The contents card: a chapter or page as one linked card — a label, the title, one small line and the arrow
 * (kol-branding's IndexCard, the in-page anchor half). The brand book's Chapters, a folder's DocumentIndex and the site
 * markdown page's Chapters are lists of these (`Contents`). Its own file since 2026-11-08 (it was private to
 * DocumentIndex.jsx) so the brand chapter card is one component, in code and in the Figma library.
 *
 * @param {string}    href     the link — a route, a file or an in-page `#anchor`
 * @param {Function}  onClick  the app's router or the anchor scroll
 * @param {ReactNode} label    the eyebrow (a chapter number, an entry's parent)
 * @param {ReactNode} title    the chapter's title
 * @param {ReactNode} meta     one small line under the title
 */
export default function IndexCard({ href, onClick, label, title, meta }) {
  return (
    <a href={href} onClick={onClick} className="kol-card kol-card-interactive flex items-center justify-between gap-4 px-4 py-3 no-underline group">
      <span className="flex min-w-0 flex-col gap-1">
        {label && <span className="kol-mono-12 text-meta uppercase">{label}</span>}
        <span className="kol-mono-14 text-emphasis">{title}</span>
        {meta && <span className="kol-mono-10 text-meta mt-1">{meta}</span>}
      </span>
      <IconLoader name="arrow-right" size={16} className="shrink-0 text-oq-48 group-hover:text-emphasis transition-colors" />
    </a>
  )
}
