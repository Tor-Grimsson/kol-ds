import { FileIcon } from '@kolkrabbi/kol-component'

export const stage = 'md'

export default function FileIconDemo() {
  return (
    <div className="grid grid-cols-4 gap-6 w-full max-w-lg items-end">
      <FileIcon ext="wav" glyph="music-note" />
      <FileIcon ext="json" glyph="code" />
      <FileIcon ext="md" />
      <FileIcon />
    </div>
  )
}
