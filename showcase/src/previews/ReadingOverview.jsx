import { ReadingOverview } from '@kolkrabbi/kol-component'

export const stage = 'full'

/* a stand-in jacket — the consumer brings the real cover */
function Cover() {
  return (
    <div className="flex h-full w-full flex-col justify-between bg-[#a9c3d9] p-6 text-[#354e66]">
      <span className="font-[family-name:var(--kol-font-family-float)] text-[10px] font-semibold uppercase">The Folio Editions</span>
      <span className="font-[family-name:var(--kol-font-family-float)] text-[38px] font-bold leading-none">The<br />Waves</span>
      <span className="font-[family-name:var(--kol-font-family-float)] text-[10px] font-semibold uppercase">Virginia Woolf</span>
    </div>
  )
}

/* a book before you open it — cover, what it is, where you left it */
export default function ReadingOverviewPreview() {
  return (
    <ReadingOverview className="w-full max-w-[1272px]" onBack={() => {}} cover={<Cover />} title="The Waves" author="Virginia Woolf" meta={['Fiction', 'EPUB', 'Reading']}
      description="Your place is saved at the third interlude. Open this copy, browse its contents, or return to your reading note."
      place={{ title: 'The third interlude', line: 'Page 125 of 297', progress: 42 }} onResume={() => {}} onCollect={() => {}} />
  )
}
