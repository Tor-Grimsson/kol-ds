import { ReadingHighlight } from '@kolkrabbi/kol-component'

export const stage = 'lg'

/* a marked passage and its note marker */
export default function ReadingHighlightPreview() {
  return (
    <div className="w-full max-w-[760px]">
      <ReadingHighlight note={1}>Attention is not always a matter of looking harder. Sometimes it is simply a willingness to remain.</ReadingHighlight>
    </div>
  )
}
