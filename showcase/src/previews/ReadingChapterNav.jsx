import { ReadingChapterNav } from '@kolkrabbi/kol-component'

export const stage = 'lg'

/* the chapters either side */
export default function ReadingChapterNavPreview() {
  return (
    <div className="w-full max-w-[760px]">
      <ReadingChapterNav prev={{ label: 'Previous interlude', title: 'Second interlude', onClick: () => {} }} next={{ label: 'Next interlude', title: 'Fourth interlude', onClick: () => {} }} />
    </div>
  )
}
