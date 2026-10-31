import { LayoutText, DEFAULT_TYPE_LAB } from '@kolkrabbi/kol-styleguide'
import { VOYAGER_GUIDE } from 'voyager-fixture'

export const stage = 'full'

/* Voyager's voice chapter, as the lines view lays out a brand's words with where they come from */
const voice = VOYAGER_GUIDE.book.voice
const CHAPTERS = [{
  title: 'Voice', lede: voice.lede, source: 'Voyager brand guide',
  blocks: [
    { type: 'table', columns: voice.spec.columns, rows: voice.spec.rows },
    { type: 'list', items: voice.words.use },
  ],
}]

export default function Preview() {
  return <LayoutText view="lines" chapters={CHAPTERS} type={DEFAULT_TYPE_LAB} />
}
