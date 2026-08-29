import { useEffect, useRef, useState } from 'react'
import { ContentCard, ContentCollection, ContentFilters, ContentRow, MediaCard, MediaRow, SegmentedToggle } from '@kolkrabbi/kol-component'
import { ActionButton, Pill, SizeOrDownload, Tag } from '@kolkrabbi/kol-component'
import { Icon } from '@kolkrabbi/kol-icons'
import { GridCard, PageHeader, PageShell } from '@kolkrabbi/kol-shell'
import { PrintGridCard } from '@kolkrabbi/kol-store'
import { ListingCard, WorkCard, WorkListItem } from '@kolkrabbi/kol-content'
import { TypefaceLibraryItem } from '@kolkrabbi/kol-foundry'

export const meta = {
  /* THE SET is the whole composition — ContentFilters drives ContentCollection
   * drives ContentCard/ContentRow. Naming it after the card alone described a
   * part; the filter strip is not decoration around the set, it is the thing
   * that owns `layout` and hands it down, and the switch is the duplication
   * this whole family exists to remove. */
  title: 'Content Set',
  description: 'ContentFilters → ContentCollection → ContentCard/ContentRow: the full listing set, each variant rendered beside the shipped component it absorbs, with the resolved diff beside each pair',
  category: 'listing',
  type: 'reference',
  status: 'draft',
  updated: '2026-08-15',
  tags: ['domain/design-system', 'pattern/sets'],
}
export const stage = 'full'

/* The review surface for 06-content-card-system.md. Nothing here is a mockup:
 * the left column imports the REAL shipped component out of its real package,
 * the right column is the REAL ContentCard/ContentRow at kol-component 0.46.0
 * (unpublished). Both sides get the same strings and the same image, and the
 * table beside each pair carries the RESOLVED values — padding, radius, type
 * class, ink, and what each side nests — read from source, not eyeballed.
 *
 * The diff data is the same log written into
 * docs/documentation/03-components/06-content-card-system.md § "The diff".
 * Nothing in it is ruled; it is what the rulings get made against. */

const S = {
  title: 'Kolkrabbi Identity',
  kicker: 'Field notes',
  body: 'Why two ways to say one thing always diverge.',
  detail: '2026 · Print',
  date: '15 Aug 2026',
  size: '2.4 MB',
  read: '4 min',
}

const IMG = '/kol-images/tt-01.jpg'
/* the wall gets DISTINCT images — twelve copies of one shot says nothing about
 * how a listing reads, and the whole point of a collection is many entries. */
const IMGS = ['01', '02', '03', '04', '05', '06', '07'].map((n) => `/kol-images/tt-${n}.jpg`)
const Shot = ({ src = IMG }) => <img src={src} alt="" />

/* One actions node, passed to BOTH sides — MediaCard has had an `actions` slot
 * all along and ContentCard just gained one, so the comparison is like-for-like
 * instead of shipped-has-it / new-doesn't. */
/* SizeOrDownload was promoted into the package 2026-08-27 (ContentFiltersCollection) — imported above */

/* Real DS Tag chips — the family's new `tags` slot takes a node, so what goes
 * in it is the consumer's; this is what both shipped cards put there. */
/* `hash={false}` — the hash defaults ON, which is where the stray `#identity`
 * came from. The variant differs by form: the article card takes the light
 * `inverse` chip, the work row the grey filled `primary` one (WorkListItem
 * ships `secondary`, the outlined chip — overruled 2026-08-15). */
const Tags = ({ list = ['identity', 'editorial'], variant = 'inverse' }) => (
  <>
    {list.map((t) => (
      <Tag key={t} variant={variant} hash={false} size="sm" className="kol-tag--data">{t}</Tag>
    ))}
  </>
)

const Actions = ({
  row = false,
  saveIcon = 'star',
  saveOnIcon = 'star-solid',
  deleteIcon = 'trash',
  confirmIcon = 'check',
}) => (
  <div className={row
    /* +2px: the row centres both boxes, but the meta text rides the TITLE's
     * baseline — 20px/125% — which sits ~2px below the line box's centre. */
    ? 'flex translate-y-[2px] items-center gap-2'
    : 'flex h-full flex-col items-center justify-between'}>
    <ActionButton chrome="inline" toggle size="sm" icon={saveIcon} confirmIcon={saveOnIcon} label="Save" confirmLabel="Saved" className="kol-inline-control--accent" onAction={() => {}} />
    <ActionButton chrome="inline" size="sm" icon={deleteIcon} confirmIcon={confirmIcon} label="Delete" confirmLabel="Deleted" onAction={() => {}} />
  </div>
)

/* PrintGridCard picks detailImages[0] over image at random on mount — pass no
 * detailImages so the comparison is stable between reloads. */
const PRINT = { image: IMG, name: S.title, slug: 'kolkrabbi-identity' }
const TYPEFACE = { name: 'TG Rót', styles: '6 styles', classification: 'Grotesque', year: '2026' }

/* MediaCard/MediaRow root as <li> — they want a list parent. */
const List = ({ children }) => <ul className="m-0 list-none p-0">{children}</ul>
/* GridCard's card branch sets gridColumn/gridRow span — it wants a grid parent. */
const Grid = ({ children }) => <div className="grid grid-cols-1">{children}</div>

/* A listing card is ~260px in every real consumer; a row ~420 in a listing
 * column. A grid track of a full-bleed viewport is not a card, it is a
 * billboard — and it leaves no room for the table. */
const CARD_W = 260
const ROW_W = 420

/* [concern, part, current, new, suggested]
 * concern = the PROPERTY under review — a closed set: Composition · Padding ·
 *   Spacing · Radius · Ratio · Type · Ink · Structure · Surface · Border ·
 *   State · Motion · Behaviour · A11y · Element
 * part    = the VISIBLE thing it is about, so a row maps to a place on the card
 * The first three columns are resolved from source on both sides; `suggested`
 * is a recommendation for the new component, NOT a ruling.
 *
 * ✅ = RULED AND LANDED; the `new` column beside it already shows the shipped
 * result. ❌ = considered and REJECTED, with the reason in the cell — a
 * rejection is a decision and belongs on the board, not left looking unread.
 * ⚠️ = it landed and cost something. ⬜ = named, still open. EMPTY = the two
 * sides already agree, nothing to decide. Anything else is a recommendation
 * still waiting on a ruling. */
const DIFF = {
  collection: [
    ['Composition', 'The switch', 'hand-written at EVERY call site — `layout === \'list\' ? <Row> : <Card>` beside a second ternary for the container (kol-monitor HomePage.jsx:124 + :138, LibraryPage.jsx:95 + :161, MediaLibrary, kol-website Work, both foundry grids, StackLatest)', 'ContentCollection form="grid|list" — ONE component owns both', '✅ this is the duplication the family exists to remove. Not the cards — the switch'],
    ['Structure', 'Grid track', 'repeat(6, 1fr) — a FIXED six columns regardless of width', 'repeat(auto-fill, minmax(20rem, 1fr)) — the count derives from the WALL\'s width', '✅ the card-wall law (05-layout-systems:50): a forced count compresses every card, because the shell rails eat width the viewport cannot see. 20rem is the law\'s minimum'],
    ['Structure', 'List track', 'repeat(4, 1fr) — a grid, four columns of rows', 'ONE full-width column', '✅ a list is one entry per line — kol-website /work is exactly that, and so is every listing anyone has built. monitor\'s 4-up is a dense file-browser cut, available via `listMin`, not the general case'],
    ['Spacing', 'Gap', '24 grid / 8 list, re-typed as a ternary at NINE call sites', '--kol-gap-wall-grid / --kol-gap-wall-list, read per form', '✅ tokenised, the same treatment --kol-pad-card-* got. A value repeated nine times has already drifted somewhere'],
    ['Element', 'Root', '<div> with inline gridTemplateColumns', '<ul> / <li>', '✅ a listing is a list; the shipped div gives screen readers no item count'],
    ['Motion', 'Enter', 'none', 'stagger keyed to `form`, 40ms step, house curve, reduced-motion aware', '✅ animation lives in the wrapper — cards never animate themselves'],
    ['Behaviour', 'Form change', 'the ternary re-renders; nothing re-runs', 'keyed on `form`, so the stagger replays on every switch', '⬜ no FLIP — card↔list does not tween. Add measure→invert→play if a consumer needs it'],
  ],
  default: [
    ['Composition', 'Whole component', 'Icon — SHOWN in the specimen: download glyph on the card, select box on the row', 'ContentMedia · ContentText + control and actions slots — LANDED', '✅ both slots landed'],
    ['Padding', 'Text plate (card)', 'p-3 = 12px', '--kol-pad-card-sm = 12px', ''],
    ['Padding', 'Whole row', 'py-2 = 8px · gap-3 = 12px', '--kol-spacing-2 = 8px · --kol-spacing-3 = 12px', ''],
    ['Radius', 'Card frame', 'rounded — Tailwind literal, 4px', '--kol-radius-sm = 4px', ''],
    ['Radius', 'Media', 'none — the card clips it. ONE radius', 'radius off when the card clips; the row keeps its own', '✅ card only, row untouched'],
    ['Ratio', 'Media', 'aspect-square box, but the thumb is NOT sized — a raw img overruns the square', '1 / 1, object-cover forced on the child', 'Keep — the component owns containment'],
    ['Type', 'Title', 'no class at all — falls through to the page body font, 400 / 16px', 'card kol-sans-heading-04 · row kol-sans-heading-05 · truncate', '✅ card moved to heading-04, row keeps 05'],
    ['Ink', 'Title', 'inherited', 'text-emphasis', 'Keep text-emphasis'],
    ['Structure', 'Meta', 'one joined string, consumer joins with ·', 'two slots, date + size, 16px gap, no separator', 'Keep 2 slots, add a separator prop'],
    ['Type', 'Meta', 'kol-mono-12', 'kol-mono-12 both fields', '✅ off helper onto mono-12 — helper ruled out here'],
    ['Ink', 'Meta', 'text-fg-48 — one raw opacity for both fields', 'date text-meta · size text-oq-80', '✅ size rest lifted to oq-80 so hover changes nothing but the swap'],
    ['Spacing', 'Title ↔ meta', 'gap-2 = 8px', 'card 12px · row --kol-spacing-2 = 8px', '✅ row dropped to 8px. Card still 12px'],
    ['Structure', 'Row columns', 'w-24 / w-20 — tunable via dateWidth / sizeWidth', 'columns REMOVED — fields hug content on the 24px group gap', '✅ removed so a row spaces its meta like a card. ⚠️ costs cross-row column alignment; dateWidth / sizeWidth still unexposed'],
    ['State', 'Row, selected', 'bg-fg-08', 'bg fg-04', 'Use fg-08 — match shipped'],
    ['Element', 'Root', '<li> — needs a <ul>', '<article> / <div>', 'Keep — the collection wraps in <li>'],
    ['Behaviour', 'In-frame control', 'download + select hardcoded, now on .kol-frame-control', 'control slot — ActionButton, animated confirm-flip SHOWN', '✅ flip lifted out of CopyButton, reusable. ✅ confirmIcon="check" passed so the click reads'],
    ['Composition', 'Actions', 'actions slot below the meta (card) / trailing edge (row) — SHOWN', 'same two positions — SHOWN', '✅ card stacks vertically, row lays them horizontal at gap-2, nudged +2px onto the meta baseline'],
  ],
  catalog: [
    ['Composition', 'Whole component', 'nothing — zero imports', 'ContentMedia · ContentText', 'Keep — nothing nested is lost'],
    ['Padding', 'Text plate (card)', '12px 16px', '--kol-pad-card-sm --kol-pad-card-md = 12px 16px', ''],
    ['Padding', 'Whole row', 'px-3, fixed height 36', '0 12px, min-height 36 — renders AT 36', '✅ Y padding dropped; minH is the whole height budget'],
    ['Radius', 'Card frame', 'borderRadius: 4 — a raw number', '--kol-radius-sm', ''],
    ['Ratio', 'Card frame', '1 / 1.41421', '1 / 1.41421', '⬜ A4 is still the open question'],
    ['Type', 'Title', 'card kol-helper-14 · row kol-helper-12', 'card kol-mono-14 · row kol-mono-12', 'Keep — ruled. Flag to monitor'],
    ['Ink', 'Title', 'text-fg-96 (card) / text-fg-64 (row)', 'text-emphasis', 'Keep — one role replaces two opacities'],
    ['Type', 'Detail', 'card kol-helper-8 — 8px — · row kol-helper-10', 'kol-mono-10, both forms', 'Keep mono-10 — helper-8 is illegible'],
    ['Ink', 'Detail', 'text-fg-32', 'text-meta', 'Keep text-meta'],
    ['Spacing', 'Title ↔ detail', 'margin-bottom: 4px', '--kol-spacing-1 = 4px', '✅ back to 4px'],
    ['Surface', 'Whole row', 'bg-surface-tertiary', '--kol-surface-tertiary', '✅ on surface-tertiary'],
    ['State', 'Whole card / row', 'hover bg step on both forms', 'oq-04 step, card and row', '✅ one .kol-content-hover rule driven by a per-variant custom property'],
    ['Motion', 'Card frame', 'all 300ms var(--kol-ease-house) — tokenised 2026-08-15', '300ms var(--kol-ease-house) on bg + border', '✅ GridCard:42 reads the token; the new side now moves on it too'],
    ['Behaviour', 'Media', 'previewFit — natural / compact / cover', 'ContentMedia fit — cover | natural | compact', '✅ added as `fit`; cover stays the default'],
    ['State', 'Media, hover', 'none', 'ContentMedia `zoom` — the artwork creeps to 1.06 inside its own frame, 600ms', '✅ a state the house serves. ON for the image-led variants (print · article · work), off where the media is a diagram or a 48px chip'],
    ['Behaviour', 'Whole card', 'expanded 2×2 + expandedContent + grid spans', 'expanded + expandedContent — span 2×2, media right at 50%, content on pad-card-lg (0.72.0)', 'Kept — the swap loses nothing'],
    ['Composition', 'Row right slot', 'action slot — replaces detail when set', 'ContentRow actions, trailing edge', '✅ the row already had `actions`; catalog now uses it'],
  ],
  print: [
    ['Composition', 'Whole component', 'nothing — react only', 'ContentMedia · ContentText', 'Keep — nothing nested is lost'],
    ['Structure', 'Text plate', 'NONE — the shipped card is image-only', 'adds a title + detail plate', 'Default print to no text slots'],
    ['Padding', 'Text plate', 'no plate to pad', '12px 16px', 'Keep for when the plate is used'],
    ['Radius', 'Card frame', 'rounded ×2 — the box and the ring', '--kol-radius-sm', '✅ the ring inherits the media radius'],
    ['Ratio', 'Card frame', 'aspect-[1/1.41421]', '1 / 1.41421', '⬜ A4 is still the open question'],
    ['Border', 'Media', 'absolute inset-0 ring, border-fg-08, sits OVER the artwork', 'ContentMedia ring — inset overlay, pointer-events-none', '✅ restored as an overlay ring, and it keeps the radius'],
    ['Type', 'Title / detail', 'no text slots exist on this card', 'kol-mono-14 / kol-mono-10', 'Keep as opt-in'],
    ['A11y', 'Whole card', 'role="button" · tabIndex={0} · Enter + Space', 'href → <a> + onNavigate · onClick → role/tabIndex/Enter+Space', '✅ family-wide, card and row: the root follows the affordance'],
    ['Motion', 'Whole card', '3D flip — isFlipped, rotateY, perspective 1000px', 'none', 'Leave the flip in PrintGridCard'],
    ['Behaviour', 'Media', 'fade-in 500ms on load · loading="lazy"', 'none — deliberately', '❌ REJECTED. The media is consumer-injected, so lazy is one attribute on their own <img>; owning it means cloneElement-ing a node the family does not own to attach an onLoad that never fires for a cached image'],
    ['Behaviour', 'Whole card', 'onCardClick(rect, slug) — the FLIP-transition seam', 'onClick with no payload', 'Leave the rect seam in PrintGridCard'],
    ['Type', 'No-image fallback', 'kol-mono-sm — a retired t-shirt stop', 'AssetPlaceholder', 'Fix PrintGridCard to mono-14 anyway'],
    ['Structure', 'Row', 'none shipped — the exception', 'renders variant="catalog" — print has NO row of its own', '✅ print listings render as catalog rows. A second 36px between-header differing only by a type rung is the divergence this family exists to remove'],
  ],
  article: [
    ['Composition', 'Whole component', 'Pill · Image → AssetPlaceholder · CardLink', 'ContentMedia · ContentText', 'Two losses — Pill and CardLink, own rows'],
    ['Padding', 'Whole card', 'none — mb-4 under the media only', 'pad 0, media gap --kol-spacing-4 = 16px', ''],
    ['Ratio', 'Row thumb', '120 × 120 — SQUARE', '120 × 120 — SQUARE', '✅ back to 1/1'],
    ['Spacing', 'Whole row', 'gap-6 = 24px · inner gap-2.5 = 10px', '24px · 10px raw literal', 'Keep — no 10px rung on the scale'],
    ['Border', 'Media', 'bg-fg-04 + border border-fg-08 + rounded', 'ContentMedia frame — OFF by default since 0.88.0, `frame` opts it in', '⬜ off by ruling 2026-08-27 — "I hate border"; ListingCard got the same `frame` seam (content 0.10.0), default off'],
    ['Type', 'Title', 'card kol-sans-heading-03 (ListingCard.jsx:148) · row kol-mono-14 (:173)', 'card kol-sans-heading-03 · row kol-sans-heading-05', 'Card already MATCHES — only the row moves. Was logged as card mono-20; that value was wrong'],
    ['Type', 'Body', 'kol-mono-14', 'kol-mono-14', ''],
    ['Ink', 'Body', 'card text-fg-48 (:153) · row text-fg-64 (:176) — two opacities for one role', 'text-body', 'Keep text-body'],
    ['Behaviour', 'Body', 'line-clamp-3 (card) / -2 (row)', 'clamp prop → line-clamp-N on the body', '✅ added; the specimen passes 3 card / 2 row'],
    ['Structure', 'Meta', 'ONE Pill chip — date • readingTime', 'ONE Pill in the date slot — the slot takes a node', '✅ reversed: the chip IS the meta here. Two bare fields read as a table row, which is the default variant, not this one'],
    ['Structure', 'Kicker', 'hero-only — absent at both these sizes', 'slot exists, NOT passed at these sizes', '✅ the slot self-hides; the specimen no longer passes it'],
    ['Composition', 'Tags', 'Pill variant="inverse" chips, wrap, gap-2 — SHOWN in the specimen', 'tags slot — flex-wrap chip row', '✅ added at family level, card and row'],
    ['State', 'Whole card / row', 'title group-hover:opacity-70 · row hover:opacity-80', 'none — article publishes no hover', '❌ REJECTED as an opacity dim. 05-control-chrome.md rules state as an oq-* FILL, never a translucent wash; article has no surface of its own to step, so it takes no hover rather than a dim the law forbids'],
    ['A11y', 'Root', 'CardLink → <a>, external/internal split, onNavigate seam', 'href → real <a>, onNavigate is the SPA seam', '✅ fixed — the biggest regression on the board'],
  ],
  work: [
    ['Composition', 'Whole component', 'TiltCard → framer-motion · AssetPlaceholder · Image · Tag', 'ContentMedia · ContentText', 'TiltCard right to drop, Tag not'],
    ['Structure', 'Text plate (card)', 'hover-revealed drawer OVER the image, bg-surface-inverse', 'a `drawer` layout — inverse plate, absolute, revealed on hover; opaque at touch sizes', '✅ BUILT. My rejection was wrong: the live /work shelf IS a wall of images with the caption as the reveal, and the drawer is the design, not chrome. Touch gets it permanently, since there is no hover to give'],
    ['Ratio', 'Card frame', 'fixed w-[280px] md:w-[400px] + ragged heights by index % 3', 'fluid width, ratio 3 / 4', 'Keep fluid — the skyline is the shelf’s job'],
    ['Padding', 'Text plate (card)', 'drawer p-4 md:p-6 = 16→24', '--kol-pad-card-md = 16px', 'Honour the md: step if the drawer returns'],
    ['Padding', 'Whole row', 'p-4 md:p-6 · gap-4 md:gap-6 = 16→24', '16 → 24 at md', '✅ restored, via --kol-row-pad-md'],
    ['Ratio', 'Row thumb', 'w-16 h-16 md:w-28 md:h-28 = 64→112', '64 → 112 at md', '✅ restored, via --kol-row-thumb-md'],
    ['Radius', 'Row thumb', 'rounded-[2px]', '--kol-radius-xs = 2px', '✅ on radius-xs'],
    ['Border', 'Row thumb', 'border-fg-08', 'ContentMedia frame — border-fg-08', '✅ restored'],
    ['Structure', 'Whole row', 'min-h-24 md:min-h-40 = 96→160', '96 → 160 at md', '✅ restored — and this is what lets display-03 fit'],
    ['Structure', 'Row big line', 'description is the big line, title is the small one', 'same — description big, title small', '✅ CORRECTED. The fields were never crossed; the live listing renders small-title → tags → big description, and the "uncrossing" would have inverted a working design'],
    ['Type', 'Row big line', 'kol-sans-heading-03', 'kol-sans-display-03 on the DESCRIPTION, truncated', '✅ the big line is display-03 and it is the description; the row steps to 160 at md so 48px fits'],
    ['Type', 'Title (card)', 'kol-sans-display-02', 'kol-sans-display-02', ''],
    ['Ink', 'Title (card)', 'text-fg-inverse — it sits on the drawer', 'text-emphasis', 'Follows the placement decision'],
    ['Structure', 'Meta', 'type + year each in its own right column; card composes client || TYPE_LABELS[type] · year', 'meta + date — two slots', '✅ split; work now takes meta and date separately'],
    ['Ink', 'Meta (card)', 'inverse, opacity-60, tracking-widest', 'text-body', 'Keep — the tracking is drawer-specific'],
    ['State', 'Row border', 'transparent → fg-16 on hover / active', 'transparent at rest, fg-16 on hover', '✅ done, via .kol-content-hover-frame'],
    ['Composition', 'Tags', 'Tag chips + tagsSeparator — chips SHOWN in the specimen', 'tags slot', '✅ same family-level slot as article'],
    ['Motion', 'Whole card', 'pointer tilt + per-index entrance stagger', 'collection stagger only', 'Keep tilt out of the family'],
    ['A11y', 'Root', '<a href> + onNavigate + onMouseEnter / active', 'href → real <a> + onNavigate', '✅ restored'],
  ],
  typeface: [
    ['Composition', 'Whole component', 'nothing — react only, own name→font-family map', 'ContentMedia · ContentText', 'Keep the font map consumer-side'],
    ['Structure', 'Media (card)', 'live Ðð at 140→160px, face resolved from typeface.name, swaps to a pangram on hover', 'consumer-injected glyph', 'Keep consumer-injected'],
    ['Structure', 'Media (row)', 'width-clipped alphabet, 48px / leading-52, via ResizeObserver', 'media slot with its own thumb + ratio', '✅ the row takes media now'],
    ['Ratio', 'Card frame', 'h-[500px] fixed', 'A4, fluid', '✅ already A4 and fluid — the 500px never came over'],
    ['Structure', 'Whole row', 'min-h-40 = 160', 'min-height 160', '✅ floor restored'],
    ['Padding', 'Whole card / row', 'p-6 = 24px', '--kol-pad-card-lg / --kol-spacing-6 = 24px', ''],
    ['Type', 'Name', 'card kol-helper-16 · row kol-mono-14 uppercase', 'card kol-mono-20 · row kol-mono-14', 'Keep — and fix the shipped uppercase'],
    ['Type', 'Styles', 'card kol-helper-14 · row kol-mono-12', 'kol-mono-14', 'Keep mono-14 — styles can wrap'],
    ['Ink', 'Styles', 'text-fg-64', 'text-body', 'Keep text-body'],
    ['Structure', 'Right column', 'classification + year — TWO values, own lines', 'detail over date, a stacked right column', '✅ ContentText render is recursive now — [\'stack\', \'detail\', \'date\'] inside the between'],
    ['Structure', 'Year (card)', 'not shown on the card', 'date slot added', 'Keep — ruled'],
    ['Surface', 'Whole row', 'transparent', 'transparent', '✅ back to transparent'],
    ['State', 'Whole card', 'inverse wash, details fade out, pangram in', 'none', 'Leave to the consumer — specimen behaviour'],
    ['State', 'Whole row', 'color-mix wash + border step', 'color-mix wash + border step on hover', '✅ both, matching the shipped values'],
  ],
}

function DiffTable({ rows }) {
  return (
    <table className="w-full border-collapse text-left">
      <thead>
        <tr className="border-b border-fg-16">
          <th className="kol-helper-12 text-meta pb-2 pr-5 font-normal align-bottom w-[10%]">Concern</th>
          <th className="kol-helper-12 text-meta pb-2 pr-5 font-normal align-bottom w-[13%]">Part</th>
          <th className="kol-helper-12 text-meta pb-2 pr-5 font-normal align-bottom w-[24%]">Current — shipped</th>
          <th className="kol-helper-12 text-meta pb-2 pr-5 font-normal align-bottom w-[24%]">New — Content*</th>
          <th className="kol-helper-12 text-meta pb-2 font-normal align-bottom w-[29%]">Suggested — not ruled</th>
        </tr>
      </thead>
      <tbody>
        {rows.map(([concern, part, current, next, suggested], i) => (
          <tr key={`${concern}-${part}-${i}`} className="border-b border-fg-08 align-top">
            <td className="kol-mono-12 text-meta py-2 pr-5">{concern}</td>
            <td className="kol-mono-12 text-emphasis py-2 pr-5">{part}</td>
            <td className="kol-mono-12 text-meta py-2 pr-5">{current}</td>
            <td className="kol-mono-12 text-meta py-2 pr-5">{next}</td>
            <td className="kol-mono-12 text-body py-2">{suggested}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

const titleCase = (s) => s.charAt(0).toUpperCase() + s.slice(1)

/* `cardW` per variant — a listing card is ~260, but `work`'s shipped tile is a
 * FIXED w-[280px] md:w-[400px] shelf card and `typeface`'s is h-[500px]. Capping
 * those at 260 clipped the reference to nothing, which made the left column lie
 * about what ships. The cap is a default, not a law. */
/* enough entries that the wall WRAPS — six in a six-up is one strip, which is
 * why it read as nothing like a page. */
const CATALOG_ITEMS = [
  'Kolkrabbi Identity', 'Hraun', 'Rómur', 'TG Malrómur', 'Framburður', 'Flík',
  'Another Creation', 'Monitor', 'Mirror', 'Canalix', 'Skipholt', 'Tekdetek',
]

/* ContentFilters filters real objects and hands `layout` to renderItem — that
 * seam IS the switch, which is why the comparison drives both containers from
 * a live filter bar instead of a hardcoded form prop. */
/* FIFTY tags, because a filter panel that only ever holds two chips proves
 * nothing about how it behaves. This is the real shape — kol-website's /work
 * ships ~45 across two groups and wraps to four rows. ContentFilters already
 * matches array values (`itemValue.includes(value)`), so tags filter for real
 * rather than being decoration. */
const TAGS = [
  'animation', 'audio visual', 'brand marks', 'branded house', 'branding',
  'character', 'creative coding', 'editorial', 'form design', 'generative',
  'geometric', 'geometry', 'grid', 'grid systems', 'icon', 'illustration',
  'interactive', 'layout', 'logo construction', 'logo design',
  'motion graphics', 'pattern', 'placeholder', 'product', 'proportions',
  'repeat', 'symbol', 'system', 'technical', 'vector', 'visual identity',
  'web design', 'webgl', 'atelier', 'design system', 'e-commerce',
  'framburður', 'grotesk', 'identity', 'kolkrabbi-foundry', 'rómur', 'sanity',
  'sans-serif', 'serif', 'tg-malrómur', 'typeface', 'variable', 'wayfinding',
  'signage', 'packaging',
]

const FILTER_ITEMS = CATALOG_ITEMS.map((name, i) => ({
  id: name,
  name,
  type: ['Client', 'Collection', 'System', 'Tool', 'Typeface'][i % 5],
  img: IMGS[i % IMGS.length],
  /* five tags each, strided so no two entries carry the same set and every
   * tag in the group belongs to something — a chip that filters to zero
   * every time is not a test of the panel */
  tags: [0, 1, 2, 3, 4].map((k) => TAGS[(i * 4 + k * 7) % TAGS.length]),
}))

/* verbatim shape from kol-website /work: a short closed set STACKS in its own
 * narrow column, the long tag set WRAPS across the rest. */
const FILTER_GROUPS = [
  { label: 'Type', key: 'type', stack: true, values: ['Client', 'Collection', 'System', 'Tool', 'Typeface'] },
  { label: 'Tags', key: 'tags', values: TAGS },
]

/* ContentFilters only RENDERS the layout strip when it is given options —
 * without these, `layout` stays undefined and renderItem silently gets 'grid'
 * forever, which is why both walls looked identical. Shape verbatim from
 * kol-monitor LibraryPage.jsx:49. */
const LAYOUT_OPTIONS = [
  { value: 'list', label: 'LIST' },
  { value: 'grid', label: 'GRID' },
]

/* The OTHER strip — the bigger one (`kol-helper-14` against LIST/GRID's 12).
 * It rides the header ABOVE the divider, which is monitor's arrangement:
 * RECENT/SAVED up top, LIST/GRID below beside the count. */
const VIEW_MODE_OPTIONS = [
  { value: 'recent', label: 'RECENT' },
  { value: 'saved', label: 'SAVED' },
]

const VARIANTS = ['default', 'catalog', 'print', 'article', 'work', 'typeface']

/* PER-VARIANT TRACK MINIMUMS, derived from each variant's OWN shipped geometry
 * — not picked, and not the generic 20rem default.
 *
 * The method: take the shipped column count and gap, solve for the track at the
 * 1800px shell frame. PX, never rem — a track width is a layout measure, not
 * type, and rem ties it to the root font-size. `auto-fill` then reproduces the
 * shipped
 * rhythm at full width AND degrades on its own below it, which is the whole
 * point of the card-wall law — the count follows the wall, the CARD stays the
 * size it was designed at.
 *
 *   catalog/print  GridCard.jsx:13 — 6-up, gap 24 → (1752 − 120) / 6 ≈ 272px
 *   work           the shelf tile is a FIXED w-[400px] → 400px
 *   article        ListingCard's card is a 16/9 thumb over a title + excerpt
 *   typeface       a 500px specimen board needs width for the glyph
 *   default        a 48px thumb and two meta columns — the narrowest real card
 *
 * Before this, catalog sat at a generic 320px and rendered 5-up where the
 * shipped card renders 6-up, so the comparison was measuring the GRID when it
 * was supposed to be measuring the card. */
/* Real page copy, not a two-word stub — a masthead is a sentence, and a header
 * that reads "Catalog / 12 entries" tells you nothing about whether the type
 * scale holds at a real length. */
const PAGE_COPY = {
  default:  { title: 'Every asset, every version, in one place', subtitle: 'Files, exports and source — 12 items' },
  catalog:  { title: 'The module catalog: racks, patches and utilities', subtitle: 'Browse by type, filter by rack — 12 modules' },
  print:    { title: 'Prints, editions and one-off runs', subtitle: 'Archival pigment on cotton rag — 12 editions' },
  article:  { title: 'Field notes on building design systems that last', subtitle: 'Writing from the studio — 12 pieces' },
  work:     { title: 'Featured client work, collections, tools and ui systems', subtitle: 'Selected projects, 2019—2026 — 12 cases' },
  typeface: { title: 'The Kolkrabbi type library', subtitle: 'Variable and static families in progress — 12 typefaces' },
}

const TRACKS = {
  default:  { min: '256px' },
  catalog:  { min: '272px' },
  print:    { min: '272px' },
  article:  { min: '352px' },
  work:     { min: '400px' },
  typeface: { min: '352px' },
}


/* The CURRENT column, per variant — the real shipped component, in the form
 * the switch asks for. `print` is the stated exception: it ships no row. */
const CURRENT = {
  default: (it, form) => (form === 'list'
    ? <MediaRow thumb={<Shot src={it.img} />} name={it.name} date={S.date} size={S.size} />
    : <MediaCard thumb={<Shot src={it.img} />} name={it.name} meta={`${S.date} · ${S.size}`} downloadHref="#" />),
  catalog: (it, form) => <GridCard variant={form === 'list' ? 'list' : undefined} title={it.name} detail={it.type} preview={<Shot src={it.img} />} />,
  print: (it, form) => (form === 'list'
    ? <ExceptionNote>print ships no row</ExceptionNote>
    : <PrintGridCard print={{ ...PRINT, image: it.img, name: it.name }} />),
  article: (it, form) => (form === 'list'
    ? <ListingCard size="mini" title={it.name} excerpt={S.body} meta={`${S.date} · ${S.read}`} thumbnail={it.img} />
    : <ListingCard size="default" title={it.name} excerpt={S.body} date={S.date} readingTime={S.read} thumbnail={it.img} tags={it.tags.slice(0, 3)} />),
  work: (it, form) => (form === 'list'
    ? <WorkListItem title={it.name} type={it.type} year="2026" description={S.body} href="#" thumbnail={it.img} tags={it.tags} />
    : <WorkCard title={it.name} client={it.type} year="2026" href="#" index={0} thumbnail={it.img} />),
  typeface: (it, form) => <TypefaceLibraryItem variant={form === 'list' ? 'list' : 'card'} typeface={{ ...TYPEFACE, name: it.name }} />,
}

/* The NEW column — ONE component pair, six variants. That is the whole claim. */
const NEXT = {
  default: (it, form) => (form === 'list'
    ? <ContentRow variant="default" href="#" media={<Shot src={it.img} />} title={it.name} date={S.date} size={<SizeOrDownload>{S.size}</SizeOrDownload>} />
    : <ContentCard variant="default" href="#" media={<Shot src={it.img} />} title={it.name} date={S.date} size={<SizeOrDownload>{S.size}</SizeOrDownload>} />),
  catalog: (it, form) => (form === 'list'
    ? <ContentRow variant="catalog" href="#" title={it.name} detail={it.type} />
    : <ContentCard variant="catalog" href="#" media={<Shot src={it.img} />} title={it.name} detail={it.type} />),
  print: (it, form) => (form === 'list'
    ? <ContentRow variant="catalog" href="#" title={it.name} detail={it.type} />
    : <ContentCard variant="print" href="#" media={<Shot src={it.img} />} />),
  article: (it, form) => (form === 'list'
    ? <ContentRow variant="article" href="#" clamp={2} media={<Shot src={it.img} />} title={it.name} body={S.body} date={<Pill variant="subtle" size="sm">{`${S.date} • ${S.read}`}</Pill>} />
    : <ContentCard variant="article" href="#" clamp={3} tags={<Tags list={it.tags.slice(0, 3)} />} media={<Shot src={it.img} />} title={it.name} body={S.body} date={<Pill variant="subtle" size="sm">{`${S.date} • ${S.read}`}</Pill>} />),
  work: (it, form) => (form === 'list'
    ? <ContentRow variant="work" href="#" media={<Shot src={it.img} />} title={it.name} tags={<Tags variant="primary" list={it.tags} />} body={S.body} meta={it.type} date="2026" />
    : <ContentCard variant="work" href="#" media={<Shot src={it.img} />} title={it.name} meta={`${it.type} · 2026`} />),
  typeface: (it, form) => (form === 'list'
    ? <ContentRow variant="typeface" href="#" title={it.name} body={TYPEFACE.styles} detail={TYPEFACE.classification} date={TYPEFACE.year} footer={<Alphabet />} />
    : <ContentCard variant="typeface" href="#" media={<Glyph />} title={it.name} body={TYPEFACE.styles} />),
}

const ExceptionNote = ({ children }) => (
  <div className="kol-mono-12 text-meta flex min-h-[36px] items-center">{children} — the exception this removes.</div>
)
const Glyph = () => (
  <div className="flex h-full items-end justify-start p-8 text-[140px] leading-none text-emphasis lg:text-[160px]">Ðð</div>
)
const Alphabet = () => (
  <div className="w-full overflow-hidden whitespace-nowrap text-[44px] font-black leading-[52px] text-emphasis">
    Aa Bb Cc Dd Ee Ff Gg Hh Ii Jj Kk Ll Mm
  </div>
)

/* ONE surface for the whole family: pick a variant, flip LIST/GRID, and both
 * walls re-render from the same two maps. The picker and the filter strip
 * COMPOSE — the variant decides what a card is, the strip decides how the wall
 * lays them out, and neither knows about the other. */
function CollectionCompare() {
  const [variant, setVariant] = useState('catalog')
  /* the NEW page is the default view — the shipped side is the thing being
   * replaced, and leading with it made the surface read as a catalogue of the
   * old rather than a proposal for the new. It stays one click away. */
  const [mode, setMode] = useState('page')
  const track = TRACKS[variant]

  const wall = (side) => (
    <ContentFilters
      title={titleCase(variant)}
      items={FILTER_ITEMS}
      totalCount={FILTER_ITEMS.length}
      filterGroups={FILTER_GROUPS}
      viewModeOptions={VIEW_MODE_OPTIONS}
      defaultViewMode="recent"
      layoutOptions={LAYOUT_OPTIONS}
      defaultLayout="grid"
      renderItem={(items, _view, layout) => {
        const form = layout === 'list' ? 'list' : 'grid'
        const gap = form === 'list' ? 8 : 24 /* the CURRENT side still re-types this */
        const render = side === 'current' ? CURRENT[variant] : NEXT[variant]
        return side === 'current' ? (
          /* the hand-written switch, verbatim in shape from kol-monitor
            * HomePage.jsx:124 — a FIXED track count and the ternary re-typed
            * for the track, the gap and the child variant */
          <div style={{ display: 'grid', gridTemplateColumns: form === 'list' ? 'repeat(4, 1fr)' : 'repeat(6, 1fr)', gap }}>
            {items.map((it) => <div key={it.id}>{render(it, form)}</div>)}
          </div>
        ) : (
          <ContentCollection form={form} min={track.min}>
            {items.map((it) => <div key={it.id}>{render(it, form)}</div>)}
          </ContentCollection>
        )
      }}
    />
  )

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-wrap items-center gap-4">
        <SegmentedToggle
          value={variant}
          onChange={setVariant}
          ariaLabel="Variant"
          options={VARIANTS.map((v) => ({ value: v, label: titleCase(v) }))}
        />
        <SegmentedToggle
          value={mode}
          onChange={setMode}
          ariaLabel="View"
          options={[
            { value: 'page', label: 'As a page' },
            { value: 'compare', label: 'Compare with shipped' },
          ]}
        />
      </div>

      {mode === 'page' ? (
        /* A REAL PAGE, the monitor Library composition exactly: PageShell →
          * PageHeader → ContentFilters → the collection. Nothing here is a
          * demo wrapper; it is the four components a consumer actually
          * assembles, which is the only way to see whether they hold up. */
        <PageShell className="rounded-[var(--kol-radius-sm)] border border-fg-08" style={{ minHeight: 0 }}>
          <PageHeader
            eyebrow="Use cases"
            title={PAGE_COPY[variant].title}
            subtitle={PAGE_COPY[variant].subtitle}
          />
          {wall('next')}
        </PageShell>
      ) : (
        <>
          <div className="flex flex-col gap-3">
            <span className="kol-helper-12 text-meta">Current — the switch hand-written inside renderItem</span>
            {wall('current')}
          </div>

          <div className="flex flex-col gap-3">
            <span className="kol-helper-12 text-meta">New — renderItem returns ContentCollection</span>
            {wall('next')}
          </div>
        </>
      )}
    </div>
  )
}

function Variant({ name, absorbed, currentCard, newCard, currentRow, newRow, cardW = CARD_W, rowW = ROW_W }) {
  return (
    <section className="flex flex-col gap-6 border-t border-fg-08 pt-8">
      <header className="flex flex-col gap-1">
        <h2 className="kol-sans-heading-05 text-emphasis">Content Card, Variant: {titleCase(name)}</h2>
        <p className="kol-mono-12 text-meta">{absorbed}</p>
      </header>

      <div className="flex flex-wrap items-start gap-10">
        {/* The form label sits ABOVE its first specimen and spans both columns
          * — it used to hold a 3rem gutter column of its own, which cost the
          * width twice over (once in the gutter, once in the indent). */}
        <div
          className="grid shrink-0 items-start gap-x-8 gap-y-3"
          style={{ gridTemplateColumns: `${rowW}px ${rowW}px` }}
        >
          <span className="kol-helper-12 text-meta">Current — shipped</span>
          <span className="kol-helper-12 text-meta">New — Content*</span>

          <span className="kol-helper-12 text-emphasis mt-4" style={{ gridColumn: '1 / -1' }}>Card</span>
          <div className="min-w-0" style={{ maxWidth: cardW }}>{currentCard}</div>
          <div className="min-w-0" style={{ maxWidth: cardW }}>{newCard}</div>

          <span className="kol-helper-12 text-emphasis mt-4" style={{ gridColumn: '1 / -1' }}>Row</span>
          <div className="min-w-0">
            {currentRow ?? <span className="kol-mono-12 text-meta">No row shipped — the exception this removes.</span>}
          </div>
          <div className="min-w-0">{newRow}</div>
        </div>

        <div className="min-w-[28rem] flex-1">
          <DiffTable rows={DIFF[name]} />
        </div>
      </div>
    </section>
  )
}

export default function ContentCardComparisonSet() {
  return (
    /* the SHELL frame — `--kol-content-shell` is 1800px, the one-frame law's
      * outermost tier (01-foundations/05-layout-systems). `stage = 'full'`
      * hands over the whole viewport; the frame is what centres. */
    <div className="mx-auto flex w-full max-w-[var(--kol-content-shell)] flex-col gap-10 p-6">
      <header className="flex flex-col gap-2">
        <h1 className="kol-sans-heading-03 text-emphasis">Content Card — Current vs New</h1>
        <p className="kol-mono-14 text-body max-w-[46rem]">
          Six variants, two forms, the real components on both sides. The left column is what ships
          today; the right column is <span className="text-emphasis">kol-component 0.46.0</span> +{' '}
          <span className="text-emphasis">kol-theme 0.43.0</span>, unpublished. The table beside each
          pair carries the resolved values read from source — padding, radius, type class, ink, and
          what each side nests. Nothing in it is ruled.
        </p>
      </header>

      <Variant
        name="default"
        absorbed="Absorbs MediaCard / MediaRow — kol-component"
        /* downloadHref / selectMode are passed ON PURPOSE: they are the only
         * way MediaCard's and MediaRow's nested Icon renders at all. Without
         * them the specimen hides a capability the new family does not have. */
        currentCard={<List><MediaCard thumb={<Shot />} name={S.title} meta={`${S.date} · ${S.size}`} downloadHref="#" actions={<Actions />} /></List>}
        /* control = the in-frame slot, holding ActionButton — the confirm-flip
         * lifted out of CopyButton so anything can use it. Press it: the glyph
         * animates to `check` for 2s on the house curve, then back. `--grey` is
         * the OPAQUE fill (oq scale) — a translucent scrim is content-dependent
         * and vanishes on an image that matches it. */
        newCard={<ContentCard variant="default" onClick={() => {}} media={<Shot />} control={<ActionButton icon="download" confirmIcon="check" label="Download" confirmLabel="Downloaded" href="#" chrome="media" onAction={() => {}} />} actions={<Actions />} title={S.title} date={S.date} size={<SizeOrDownload>{S.size}</SizeOrDownload>} />}
        currentRow={<List><MediaRow thumb={<Shot />} name={S.title} date={S.date} size={S.size} selectMode actions={<Actions row />} /></List>}
        newRow={<ContentRow variant="default" onClick={() => {}} media={<Shot />} title={S.title} date={S.date} size={<SizeOrDownload>{S.size}</SizeOrDownload>} actions={<Actions row />} />}
      />

      <Variant
        name="catalog"
        absorbed="Absorbs GridCard — kol-shell (monitor modules, presets, patches)"
        currentCard={<Grid><GridCard title={S.title} detail={S.detail} preview={<Shot />} /></Grid>}
        newCard={<ContentCard variant="catalog" href="#" media={<Shot />} title={S.title} detail={S.detail} />}
        currentRow={<GridCard variant="list" title={S.title} detail={S.detail} />}
        newRow={<ContentRow variant="catalog" href="#" title={S.title} detail={S.detail} />}
      />

      <Variant
        name="print"
        absorbed="Absorbs PrintGridCard — kol-store"
        currentCard={<PrintGridCard print={PRINT} />}
        newCard={<ContentCard variant="print" href="#" media={<Shot />} />}
        currentRow={null}
        newRow={<ContentRow variant="catalog" href="#" title={S.title} detail={S.detail} />}
      />

      <Variant
        name="article"
        absorbed="Absorbs ListingCard — kol-content (kol-website Stack)"
        currentCard={
          <ListingCard
            size="default"
            title={S.title}
            excerpt={S.body}
            date={S.date}
            readingTime={S.read}
            thumbnail={IMG}
            /* tags passed so the nested Pill chips actually render — the new
             * family has no tags slot, and that has to be visible, not stated */
            tags={['Identity', 'Editorial']}
          />
        }
        newCard={
          <ContentCard
            variant="article"
            media={<Shot />}
            href="#"
            clamp={3}
            tags={<Tags />}
            title={S.title}
            body={S.body}
            /* ONE meta chip, not two bare fields — the `date` slot takes a node,
             * so the shipped `date • readingTime` Pill goes in whole. `kicker`
             * is not passed: it is hero-only in ListingCard and does not belong
             * on a default card. */
            date={<Pill variant="subtle" size="sm">{`${S.date} • ${S.read}`}</Pill>}
          />
        }
        currentRow={
          <ListingCard size="mini" title={S.title} excerpt={S.body} meta={`${S.date} · ${S.read}`} thumbnail={IMG} />
        }
        newRow={
          <ContentRow
            variant="article"
            media={<Shot />}
            href="#"
            clamp={2}
            title={S.title}
            body={S.body}
            date={<Pill variant="subtle" size="sm">{`${S.date} • ${S.read}`}</Pill>}
          />
        }
      />

      <Variant
        name="work"
        cardW={400}
        rowW={760}
        absorbed="Absorbs WorkCard / WorkListItem — kol-content"
        currentCard={<WorkCard title={S.title} client="Hraun" year="2026" href="#" index={0} thumbnail={IMG} />}
        /* WorkCard's drawer is TITLE + one meta line (client · year). No excerpt and
          * no tags — those are WorkListItem's, and passing them here invented a card
          * the reference does not have. */
        /* ONE meta line, client · year joined — WorkCard composes exactly that
          * internally. The ROW is the form that splits them into two columns. */
        newCard={<ContentCard variant="work" media={<Shot />} href="#" title={S.title} meta="Hraun · 2026" />}
        currentRow={
          /* tags passed so the nested Tag chips render — same reason as article */
          <WorkListItem title={S.title} type="Client" year="2026" description={S.body} href="#" thumbnail={IMG} tags={['Identity', 'Editorial']} />
        }
        newRow={
          <ContentRow
            variant="work"
            media={<Shot />}
            href="#"
            title={S.title}
            tags={<Tags variant="primary" list={['identity', 'e-commerce', 'design system', 'sanity', 'atelier']} />}
            body={S.body}
            meta="Client"
            date="2026"
          />
        }
      />

      <Variant
        name="typeface"
        absorbed="Absorbs TypefaceLibraryItem — kol-foundry"
        currentCard={<TypefaceLibraryItem variant="card" typeface={TYPEFACE} />}
        newCard={
          <ContentCard
            variant="typeface"
            href="#"
            /* the reference sets its specimen BOTTOM-LEFT at 140/160px inside
             * a p-8, with the name + styles at the top — not centred. The glyph
             * is consumer-injected, so matching it is the specimen's job. */
            media={
              <div className="flex h-full items-end justify-start p-8 text-[140px] leading-none text-emphasis lg:text-[160px]">
                Ðð
              </div>
            }
            title={TYPEFACE.name}
            body={TYPEFACE.styles}
          />
        }
        currentRow={<TypefaceLibraryItem variant="list" typeface={TYPEFACE} />}
        newRow={
          <ContentRow
            variant="typeface"
            href="#"
            title={TYPEFACE.name}
            body={TYPEFACE.styles}
            detail={TYPEFACE.classification}
            date={TYPEFACE.year}
            /* the shipped item clips a full alphabet at leading-52 across the
             * whole row — that band is the specimen, not a leading thumb. */
            footer={
              /* the shipped band is `leading-[52px]` at the FACE's own size —
                * mine had the leading and no font-size, so it rendered 16px
                * type inside a 52px line box. */
              <div className="w-full overflow-hidden whitespace-nowrap text-[44px] font-black leading-[52px] text-emphasis">
                Aa Bb Cc Dd Ee Ff Gg Hh Ii Jj Kk Ll Mm
              </div>
            }
          />
        }
      />

      {/* THE COLLECTION — the switch, which is the actual duplication. The six
        * variants above are one card rendered six ways; this is the container
        * that every consumer hand-writes instead. */}
      <section className="flex flex-col gap-6 border-t border-fg-08 pt-8">
        {/* the DS scaffold, not hand-written prose — PageHeader owns the rung
          * pair (kol-heading-sm over kol-mono-14 at fg-48) and its own 8/40
          * margins, which is exactly the page-top a ContentFilters sits under
          * in every consumer. */}
        <PageHeader
          title="Content Collection — the switch"
          subtitle="Both sides driven by a live ContentFilters. Flip LIST/GRID on either."
        />

        <CollectionCompare />

        <DiffTable rows={DIFF.collection} />
      </section>

      <section className="flex flex-col gap-3 border-t border-fg-08 pt-8">
        <h2 className="kol-sans-heading-05 text-emphasis">What repeats across all six</h2>
        <ol className="kol-mono-12 text-body flex list-decimal flex-col gap-1.5 pl-5">
          <li>Double rounding — FIXED 2026-08-15. ContentMedia takes radius, ContentCard turns it off on its framed variants; the row is untouched.</li>
          <li>No anchor — 4 of 6 shipped cards are &lt;a href&gt; with an onNavigate seam; the new family is &lt;article&gt;/&lt;div&gt; with onClick.</li>
          <li>No keyboard — PrintGridCard has role/tabIndex/Enter+Space. Nothing in the new family does.</li>
          <li>Hover dropped in 5 of 6 variants.</li>
          <li>Chips dropped — ListingCard&apos;s Pills, WorkListItem&apos;s Tags. No slot exists anywhere.</li>
          <li>Responsive steps flattened — WorkListItem&apos;s whole md: ladder, WorkCard&apos;s 280→400, the specimen&apos;s 140→160.</li>
          <li>Clamps dropped — line-clamp-2/-3 on both ListingCard sizes, nowrap ellipsis on WorkListItem.</li>
          <li>Action / overlay slots dropped — MediaCard actions + download + select, GridCard action.</li>
          <li>Two fields collapsed into one meta slot in work row and typeface row.</li>
          <li>Live behaviour dropped — the tilt, the flip, the font mapping, the alphabet clipping. (The expand-to-2×2 came back on ContentCard in 0.72.0.)</li>
          <li>4px is written five ways on the shipped side — rounded, borderRadius: 4, rounded-[4px], rounded-[2px], and the token.</li>
          <li>Raw fg-* inks throughout the shipped side — fg-96, fg-80, fg-64, fg-48, fg-32, fg-24 — against the three roles.</li>
        </ol>
      </section>
    </div>
  )
}
