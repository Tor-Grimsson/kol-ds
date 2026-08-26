import { ContentCard } from '@kolkrabbi/kol-component'

export const stage = 'lg'

const S = {
  kicker: 'Field notes',
  title: 'Kolkrabbi Identity',
  body: 'Why two ways to say one thing diverge.',
  date: '15 Aug 2026',
  size: '2.4 MB',
}

export default function ContentCardDemo() {
  return (
    <div className="grid w-full max-w-[48rem] grid-cols-3 items-start gap-4">
      <ContentCard variant="default" title={S.title} date={S.date} size={S.size} />
      <ContentCard variant="catalog" title={S.title} detail={S.body} />
      <ContentCard variant="article" title={S.title} kicker={S.kicker} body={S.body} date={S.date} size={S.size} />
      <ContentCard variant="work" pad="sm" title={S.title} body={S.body} meta={S.date} />
      <ContentCard variant="typeface" title={S.title} body={S.body} date={S.date} />
      <ContentCard variant="default" selected title={S.title} date={S.date} size={S.size} />
    </div>
  )
}
