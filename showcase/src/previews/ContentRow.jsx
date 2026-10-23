import { ActionButton, ContentRow } from '@kolkrabbi/kol-component'
import { Icon } from '@kolkrabbi/kol-icons'

export const stage = 'lg'

const S = {
  kicker: 'Field notes',
  title: 'Kolkrabbi Identity',
  body: 'Why two ways to say one thing diverge.',
  date: '15 Aug 2026',
  size: '2.4 MB',
}

/* ONE ROW, THE VARIANT IN THE PICKER (2026-10-09 — user: "why are we not using a dropdown for
 * variants on the showcase? … just show default and give options to variants, thats the rule").
 * The five used to stack. */
export const variants = ['default', 'catalog', 'article', 'work', 'typeface']
/* `tone` (ContentCardRowTone, kol-fxr 2026-10-22): the file row on two tones, rest + hover from the bundle */
export const states = ['specimen', 'tone', 'long title']

/* catalog's thumb shows only when it is given media (kol-component 0.247.0) */
const glyph = <div className="flex h-full w-full items-center justify-center bg-white text-black"><Icon name="layout" size={20} /></div>

export default function ContentRowPreview({ variant = 'default', state = 'specimen' }) {
  if (state === 'tone') return (
    <div className="flex w-full max-w-[40rem] flex-col gap-4">
      <ContentRow variant="default" tone="grey" onClick={() => {}} title={S.title} date={S.date} size={S.size} />
      <ContentRow variant="default" tone="sunken" onClick={() => {}} title={S.title} date={S.date} size={S.size} />
    </div>
  )
  /* a long title truncates LEFT of the actions (FileCardTitleClearsActions, kol-fxr 2026-10-22) */
  if (state === 'long title') return (
    <div className="flex w-full max-w-[40rem] flex-col">
      <ContentRow variant="default" title="Morph W 1791484577796 - a name far longer than the row it sits in, and then some" date={S.date} size={S.size}
        actions={<div className="flex h-full flex-col justify-between"><ActionButton chrome="inline" size="sm" icon="settings" label="Settings" onAction={() => {}} /><ActionButton chrome="inline" size="sm" icon="trash" label="Delete" onAction={() => {}} /></div>} />
    </div>
  )
  return (
    <div className="flex w-full max-w-[40rem] flex-col">
      {variant === 'default' && <ContentRow variant="default" title={S.title} date={S.date} size={S.size} />}
      {variant === 'catalog' && <ContentRow variant="catalog" title={S.title} detail={S.body} media={glyph} />}
      {variant === 'article' && <ContentRow variant="article" thumb={120} ratio="16 / 9" title={S.title} kicker={S.kicker} body={S.body} date={S.date} size={S.size} />}
      {/* the filled /work row keeps the `tertiary` chip it was minted for (CardTagsNoVisibleFill) */}
      {variant === 'work' && <ContentRow variant="work" title={S.title} body={S.body} meta={S.date} tags={['branding', 'editorial']} />}
      {variant === 'typeface' && <ContentRow variant="typeface" thumb={0} title={S.title} body={S.body} date={S.date} />}
    </div>
  )
}
