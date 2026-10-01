import { ContentCard } from '@kolkrabbi/kol-component'
import { heroBg, photo, splitFill, gradient } from '../lib/card-media.js'

export const meta = {
  title: 'Article card',
  description: "A featured article card and its smaller variants",
  category: 'content',
  type: 'reference',
  status: 'active',
  updated: '2026-09-30',
  tags: ['domain/cards', 'domain/content', 'pattern/website-cards'],
}
export const stage = 'lg'

const S = { kicker: 'Field notes', title: 'Kolkrabbi Identity', body: 'Why two ways to say one thing diverge.', date: '15 Aug 2026', size: '2.4 MB' }

export default function ContentArticle() {
  return (
    <div className="flex w-full max-w-[48rem] flex-col gap-4">
      <ContentCard variant="article" hero label="Featured" meta={['15 Aug 2026', '5 min read']} kicker={S.kicker} title={S.title} body={S.body} tags={['design-system', 'type']} media={<img src={heroBg} alt="" />} href="#" onNavigate={(e) => e.preventDefault()} />
      <div className="grid grid-cols-3 items-start gap-4">
        <ContentCard variant="default" title={S.title} date={S.date} size={S.size} />
        <ContentCard variant="article" title={S.title} kicker={S.kicker} body={S.body} date={S.date} tags={['design-system']} href="#" onNavigate={(e) => e.preventDefault()} />
        <ContentCard variant="work" pad="sm" title={S.title} body={S.body} meta={S.date} />
      </div>
    </div>
  )
}
