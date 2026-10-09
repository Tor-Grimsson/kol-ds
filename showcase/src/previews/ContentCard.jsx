import { useState } from 'react'
import { Button, ContentCard } from '@kolkrabbi/kol-component'
/* a flat 16/9 placeholder so the hero's media (and its zoom rung) has something to render */
const bg = 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="900"><rect width="1600" height="900" fill="#6b7280"/></svg>')

export const stage = 'lg'

/* catalog's 2×2 expand — the GridCard behaviour the three catalog repos
 * (monitor · mirror · fxr) run on: click toggles, the info field + button are
 * the consumer's `expandedContent`. */
function CatalogExpand() {
  const [open, setOpen] = useState(true)
  return (
    <div className="grid w-full max-w-[48rem] grid-cols-4 gap-4">
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

function PrintFlip() {
  const [on, setOn] = useState(false)
  return <ContentCard variant="print" title="Poster 04" detail="A2" selected={on} onClick={() => setOn((v) => !v)} media={<img src={bg} alt="" />} />
}

const S = {
  kicker: 'Field notes',
  title: 'Kolkrabbi Identity',
  body: 'Why two ways to say one thing diverge.',
  date: '15 Aug 2026',
  size: '2.4 MB',
}

/* ONE VARIANT AT A TIME, IN THE PICKER (2026-10-09 — user: "just show default and give options to
 * variants, thats the rule"). Each variant keeps the specimens it had in the stacked preview. */
export const variants = ['default', 'catalog', 'print', 'article', 'work', 'typeface']

const grid = 'grid w-full max-w-[48rem] grid-cols-3 items-start gap-4'

export default function ContentCardPreview({ variant = 'default' }) {
  if (variant === 'default') return (
    <div className={grid}>
      <ContentCard variant="default" title={S.title} date={S.date} size={S.size} />
      <ContentCard variant="default" selected title={S.title} date={S.date} size={S.size} />
      {/* `bg` + `text` (contentcard-bg-and-text-props, 2026-09-03): `bg` writes `--kol-card-bg`,
        * NOT a background — a `bg-*` utility loses to the property the hover step needs */}
      <ContentCard variant="default" bg="var(--kol-oq-48)" title={S.title} date={S.date} size={S.size} />
    </div>
  )
  if (variant === 'catalog') return (
    <div className="flex w-full flex-col gap-8">
      <div className={grid}>
        {/* catalog + actions: the slot sits bottom-right of the plate on the two-value pad (ContentCardActionsInsetShorthand) */}
        <ContentCard variant="catalog" title={S.title} detail={S.body} actions={<span className="kol-helper-10 text-meta" data-card-action>INSERT ●</span>} />
      </div>
      <CatalogExpand />
    </div>
  )
  /* print: `selected` turns the card (PrintGridCard's flip), the media fades in */
  if (variant === 'print') return <div className="w-full max-w-[16rem]"><PrintFlip /></div>
  if (variant === 'article') return (
    <div className="flex w-full flex-col gap-8">
      {/* the HERO — the featured card riding a page's fold: header row (label · meta chips), media
        * on the 1.02 zoom rung, display-03 title */}
      <div className="w-full max-w-[48rem]">
        <ContentCard variant="article" hero label="Featured" meta={['15 Aug 2026', '5 min read']} kicker={S.kicker} title={S.title} body={S.body} tags={['design-system', 'type']} media={<img src={bg} alt="" />} href="#" onNavigate={(e) => e.preventDefault()} />
      </div>
      <div className={grid}>
        {/* a titleClass override keeps the hover dim — the hook is behaviour, not voice; tags on a
          * plain-surface card draw the `primary` chip (CardTagsNoVisibleFill) */}
        <ContentCard variant="article" title={S.title} kicker={S.kicker} body={S.body} date={S.date} size={S.size} tags={['design-system', 'type']} titleClass="kol-sans-display-03 uppercase truncate" href="#" onNavigate={(e) => e.preventDefault()} />
        {/* article + bg + media: a grounded card must CLIP, so the still squares off with the plate (fixed 0.183.1) */}
        <ContentCard variant="article" bg="var(--kol-fg-04)" title={S.title} kicker={S.kicker} media={<img src={bg} alt="" />} />
        {/* `text` re-inks every slot, INCLUDING a `<slot>Class` override */}
        <ContentCard variant="article" text="meta" kickerClass="kol-sans-body-01" title={S.title} kicker={S.kicker} body={S.body} date={S.date} />
      </div>
    </div>
  )
  if (variant === 'work') return <div className={grid}><ContentCard variant="work" pad="sm" title={S.title} body={S.body} meta={S.date} /></div>
  /* typeface: `reveal` — on hover the plate + glyph fade out and the pangram fades in */
  return (
    <div className={grid}>
      <ContentCard variant="typeface" title="Right Grotesk" body="6 styles" date="2024" href="#" onNavigate={(e) => e.preventDefault()} media={<div className="flex h-full w-full items-center justify-center kol-sans-display-01">Ðð</div>} reveal={<p className="text-auto-inverse kol-sans-heading-03 text-center">The quick brown fox jumps over the lazy dog</p>} />
    </div>
  )
}
