import { useState } from 'react'
import { MediaTile, FileIcon } from '@kolkrabbi/kol-component'

export const stage = 'md'

export default function MediaTileDemo() {
  const [picked, setPicked] = useState('notes.md')
  const files = [['notes.md', 'md'], ['data.json', 'json'], ['voice.wav', 'wav']]
  return (
    <div className="grid grid-cols-3 gap-4 w-full max-w-lg">
      {files.map(([name, ext]) => (
        <MediaTile key={name} name={name} selected={picked === name} onClick={() => setPicked(name)}
          preview={<FileIcon ext={ext} glyph={ext === 'wav' ? 'music-note' : ext === 'json' ? 'code' : undefined} className="w-[56%]" />} />
      ))}
    </div>
  )
}
