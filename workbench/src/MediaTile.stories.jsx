import { useState } from 'react'
import { MediaTile, FileIcon } from '@kolkrabbi/kol-component'
import { Icon } from '@kolkrabbi/kol-icons'

const FILES = [['notes.md', 'md'], ['data.json', 'json', 'code'], ['voice.wav', 'wav', 'music-note'], ['a-very-long-file-name-that-wraps.txt', 'txt']]

export const Grid = () => {
  const [picked, setPicked] = useState('notes.md')
  const [opened, setOpened] = useState('—')
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 140px)', gap: 16 }}>
        {FILES.map(([name, ext, glyph]) => (
          <MediaTile key={name} name={name} selected={picked === name}
            onClick={() => setPicked(name)} onDoubleClick={() => setOpened(name)}
            preview={<FileIcon ext={ext} glyph={glyph} className="w-[56%]" />} />
        ))}
      </div>
      <span className="kol-helper-10 text-meta">picked: {picked} · opened: {opened}</span>
    </div>
  )
}

export const Folder = () => (
  <div style={{ width: 140 }}>
    <MediaTile name="projects" preview={<Icon name="folder" size="100%" className="text-oq-48" />} />
  </div>
)
