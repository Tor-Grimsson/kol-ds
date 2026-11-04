import { ReaderBar } from '@kolkrabbi/kol-shell'

/* back · Contents · search · bookmark · Aa Reading tools (the gap map's row 80) */
export const stage = 'full'

export default function ReaderBarPreview() {
  return <ReaderBar path={['My library', 'The Waves']} onBack={() => {}} onContents={() => {}} onSearch={() => {}} onBookmark={() => {}} onTools={() => {}} />
}
