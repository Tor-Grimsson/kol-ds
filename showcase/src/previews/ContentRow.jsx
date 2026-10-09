import { ContentRow } from '@kolkrabbi/kol-component'
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

/* catalog's thumb shows only when it is given media (kol-component 0.247.0) */
const glyph = <div className="flex h-full w-full items-center justify-center bg-white text-black"><Icon name="layout" size={20} /></div>

export default function ContentRowPreview({ variant = 'default' }) {
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
