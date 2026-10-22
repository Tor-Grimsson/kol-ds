import { useState } from 'react'
import { ActionButton, Button, ContentCard } from '@kolkrabbi/kol-component'
/* a flat placeholder so the media (and its zoom rung) has something to render */
const bg = 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="900"><rect width="1600" height="900" fill="#6b7280"/></svg>')
const img = <img src={bg} alt="" />

/* the preview spans the panel (user 2026-10-22: "wrong width") — each variant keeps its own column count */
export const stage = 'full'

/* catalog's 2×2 expand — the GridCard behaviour the three catalog repos
 * (monitor · mirror · fxr) run on: click toggles, the info field + button are
 * the consumer's `expandedContent`. */
function CatalogExpand() {
  const [open, setOpen] = useState(true)
  return (
    <div className="grid w-full grid-cols-4 gap-4">
      <ContentCard
        variant="catalog"
        title="Empty 7U"
        detail="7U — power, perf, patch"
        expanded={open}
        onClick={() => setOpen((v) => !v)}
        expandedContent={
          <>
            <div className="flex flex-col gap-2">
              <p className="kol-mono-14 text-emphasis">Empty 7U</p>
              <p className="kol-mono-12 text-body">Seven units, power, performance and patch panels left open — the rack you start from.</p>
            </div>
            <Button size="sm" onClick={(e) => e.stopPropagation()}>Use preset</Button>
          </>
        }
      />
      <ContentCard variant="catalog" title="Studio 12U" detail="12U — full desk" />
      <ContentCard variant="catalog" title="Live 4U" detail="4U — stage" />
    </div>
  )
}

/* `flip` (the print fold): `selected` turns the card, PrintGridCard's 3D turn */
function CatalogFlip() {
  const [on, setOn] = useState(false)
  return <ContentCard variant="catalog" flip title="Poster 04" detail="A2 · click to turn" selected={on} onClick={() => setOn((v) => !v)} media={img} />
}

const S = {
  kicker: 'Field notes',
  title: 'Kolkrabbi Identity',
  body: 'Why two ways to say one thing diverge.',
  date: '15 Aug 2026',
  size: '2.4 MB',
}

const stop = (e) => { e.preventDefault(); e.stopPropagation() }
/* the SLIDE card as CatalogPage's `shelf` preset builds it (toSlideCard) — download is the control ON
 * the cover, star (toggle) and trash (confirm) stand in the plate. The card the user went looking for
 * (2026-10-22: "the card that had the download gsap animation hover and icons for favorite, trash and download"). */
const slide = (title, i) => (
  <ContentCard
    key={title}
    variant="slide"
    title={title}
    date={S.date}
    size={S.size}
    meta={`${12 + i} slides`}
    media={img}
    control={<ActionButton chrome="media" icon="download" confirmIcon="check" label="Download" confirmLabel="Downloaded" onAction={() => {}} />}
    actions={
      <div className="flex h-full flex-col items-center justify-between" onClick={stop}>
        <ActionButton chrome="inline" size="sm" icon="star" confirmIcon="star-solid" label="Favourite" toggle onAction={() => {}} />
        <ActionButton chrome="inline" size="sm" icon="trash" confirmIcon="check" label="Delete" confirmLabel="Deleted" onAction={() => {}} />
      </div>
    }
  />
)

/* ONE VARIANT AT A TIME, IN THE PICKER (2026-10-09 — user: "just show default and give options to
 * variants, thats the rule"). The five content KINDS plus canvas (2026-10-22 — the picker listed the old
 * alias names, default · print · work · typeface, and had no slide). */
export const variants = ['file', 'catalog', 'slide', 'article', 'showcase', 'canvas']

/* THE PROPS NO SPECIMEN SHOWED (2026-10-22, "missing properties"), as the third axis: `specimens` is the
 * variant's own set; every other state draws that prop on the picked variant */
export const states = ['specimens', 'no cover', 'corner controls', 'fit', 'ratio', 'fade']

const grid = 'grid w-full grid-cols-3 items-start gap-4'
const kind = (v) => (v === 'canvas' ? { variant: 'showcase', layout: 'canvas' } : { variant: v })
const caption = (t) => <span className="kol-mono-12 text-meta">{t}</span>

function Specimens({ variant }) {
  if (variant === 'file') return (
    <div className={grid}>
      <ContentCard variant="file" title={S.title} date={S.date} size={S.size} />
      <ContentCard variant="file" selected title={S.title} date={S.date} size={S.size} />
      {/* `bg` + `text` (contentcard-bg-and-text-props, 2026-09-03): `bg` writes `--kol-card-bg`,
        * NOT a background — a `bg-*` utility loses to the property the hover step needs */}
      <ContentCard variant="file" bg="var(--kol-oq-48)" title={S.title} date={S.date} size={S.size} />
    </div>
  )
  if (variant === 'catalog') return (
    <div className="flex w-full flex-col gap-8">
      <div className={grid}>
        {/* catalog + actions: the slot sits bottom-right of the plate on the two-value pad (ContentCardActionsInsetShorthand) */}
        <ContentCard variant="catalog" title={S.title} detail={S.body} actions={<span className="kol-helper-10 text-meta" data-card-action>INSERT ●</span>} />
        <CatalogFlip />
      </div>
      <CatalogExpand />
    </div>
  )
  if (variant === 'slide') return <div className={grid}>{['Kolkrabbi Identity', 'Brand Review', 'Q4 Plan'].map(slide)}</div>
  if (variant === 'article') return (
    <div className="flex w-full flex-col gap-8">
      {/* the HERO — the featured card riding a page's fold: header row (label · meta chips), media
        * on the 1.02 zoom rung, display-03 title */}
      <ContentCard variant="article" hero label="Featured" meta={['15 Aug 2026', '5 min read']} kicker={S.kicker} title={S.title} body={S.body} tags={['design-system', 'type']} media={img} href="#" onNavigate={(e) => e.preventDefault()} />
      <div className={grid}>
        {/* a titleClass override keeps the hover dim — the hook is behaviour, not voice; tags on a
          * plain-surface card draw the `primary` chip (CardTagsNoVisibleFill) */}
        <ContentCard variant="article" title={S.title} kicker={S.kicker} body={S.body} date={S.date} size={S.size} tags={['design-system', 'type']} titleClass="kol-sans-display-03 uppercase truncate" href="#" onNavigate={(e) => e.preventDefault()} />
        {/* article + bg + media: a grounded card must CLIP, so the still squares off with the plate (fixed 0.183.1) */}
        <ContentCard variant="article" bg="var(--kol-fg-04)" title={S.title} kicker={S.kicker} media={img} />
        {/* `text` re-inks every slot, INCLUDING a `<slot>Class` override */}
        <ContentCard variant="article" text="meta" kickerClass="kol-sans-body-01" title={S.title} kicker={S.kicker} body={S.body} date={S.date} />
      </div>
    </div>
  )
  if (variant === 'showcase') return <div className={grid}><ContentCard variant="showcase" pad="sm" title={S.title} body={S.body} meta={S.date} media={img} /></div>
  /* canvas: `reveal` — on hover the plate + glyph fade out and the pangram fades in */
  return (
    <div className={grid}>
      <ContentCard variant="showcase" layout="canvas" title="Right Grotesk" body="6 styles" date="2024" href="#" onNavigate={(e) => e.preventDefault()} media={<div className="flex h-full w-full items-center justify-center kol-sans-display-01">Ðð</div>} reveal={<p className="text-auto-inverse kol-sans-heading-03 text-center">The quick brown fox jumps over the lazy dog</p>} />
    </div>
  )
}

/* one prop on the picked variant, a cell per value */
function PropState({ variant, state }) {
  const k = kind(variant)
  const text = { title: S.title, date: S.date, size: S.size }
  const cells =
    state === 'no cover' ? [
      ['media={false} · no cover', { media: false }],
      ['media omitted · placeholder', {}],
      ['media · a cover', { media: img }],
    ]
    : state === 'corner controls' ? [
      ['control · top-right', { media: img, control: <ActionButton chrome="media" icon="download" confirmIcon="check" label="Download" confirmLabel="Downloaded" onAction={() => {}} /> }],
      ['controlStart · top-left', { media: img, controlStart: <ActionButton chrome="media" icon="check" label="Select" toggle onAction={() => {}} /> }],
      ['both', { media: img, control: <ActionButton chrome="media" icon="download" confirmIcon="check" label="Download" onAction={() => {}} />, controlStart: <ActionButton chrome="media" icon="check" label="Select" toggle onAction={() => {}} /> }],
    ]
    : state === 'fit' ? ['cover', 'natural', 'compact'].map((f) => [`fit="${f}"`, { media: <img src={TALL} alt="" />, fit: f }])
    : state === 'ratio' ? ['1 / 1', '4 / 5', '16 / 9'].map((r) => [`ratio="${r}"`, { media: img, ratio: r }])
    : [['fade · cover fades in', { media: img, fade: true }], ['no fade', { media: img }]]
  return (
    <div className={grid}>
      {cells.map(([label, props]) => (
        <div key={label} className="flex flex-col gap-2">
          {caption(label)}
          <ContentCard {...k} {...text} {...props} />
        </div>
      ))}
    </div>
  )
}
/* a portrait cover, so `fit` has something to crop or letterbox */
const TALL = 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="600" height="1000"><rect width="600" height="1000" fill="#6b7280"/><circle cx="300" cy="500" r="240" fill="#9ca3af"/></svg>')

export default function ContentCardPreview({ variant = 'file', state = 'specimens' }) {
  return state === 'specimens' ? <Specimens variant={variant} /> : <PropState variant={variant} state={state} />
}
