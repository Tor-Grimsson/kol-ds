import { ContentRow } from '@kolkrabbi/kol-component'

export const stage = 'lg'

const S = {
  kicker: 'Field notes',
  title: 'Kolkrabbi Identity',
  body: 'Why two ways to say one thing diverge.',
  date: '15 Aug 2026',
  size: '2.4 MB',
}

export default function ContentRowDemo() {
  return (
    <div className="flex w-full max-w-[40rem] flex-col divide-y divide-fg-08">
      <ContentRow variant="default" title={S.title} date={S.date} size={S.size} />
      <ContentRow variant="catalog" title={S.title} detail={S.body} />
      <ContentRow variant="article" thumb={120} ratio="16 / 9" title={S.title} kicker={S.kicker} body={S.body} date={S.date} size={S.size} />
      {/* the filled /work row keeps the `tertiary` chip it was minted for (CardTagsNoVisibleFill) */}
      <ContentRow variant="work" title={S.title} body={S.body} meta={S.date} tags={['branding', 'editorial']} />
      <ContentRow variant="typeface" thumb={0} title={S.title} body={S.body} date={S.date} />
    </div>
  )
}
