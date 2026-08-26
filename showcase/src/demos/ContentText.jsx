import { ContentText } from '@kolkrabbi/kol-component'

export const stage = 'lg'

/* ONE string set across variants — only the styling changes (the ruled table,
 * 06-content-card-system.md §3). */
const S = {
  kicker: 'Field notes',
  title: 'Kolkrabbi Identity',
  body: 'Why two ways to say one thing diverge.',
  date: '15 Aug 2026',
  size: '2.4 MB',
}

const VARIANTS = [
  { variant: 'default', props: { title: S.title, date: S.date, size: S.size } },
  { variant: 'catalog', props: { title: S.title, detail: S.body } },
  { variant: 'print', props: { title: S.title, detail: S.body } },
  { variant: 'article', props: { kicker: S.kicker, title: S.title, body: S.body, date: S.date, size: S.size } },
  { variant: 'work', props: { title: S.title, body: S.body, meta: S.date } },
  { variant: 'typeface', props: { title: S.title, body: S.body, date: S.date } },
]

export default function ContentTextDemo() {
  return (
    <div className="flex w-full max-w-[52rem] flex-col gap-8">
      {VARIANTS.map(({ variant, props }) => (
        <div key={variant} className="grid grid-cols-2 items-start gap-6">
          <div className="flex flex-col gap-2">
            <p className="kol-helper-10 text-meta">{variant} · card</p>
            <ContentText variant={variant} form="card" {...props} />
          </div>
          <div className="flex flex-col gap-2">
            <p className="kol-helper-10 text-meta">{variant} · row</p>
            <ContentText variant={variant} form="row" {...props} />
          </div>
        </div>
      ))}
    </div>
  )
}
