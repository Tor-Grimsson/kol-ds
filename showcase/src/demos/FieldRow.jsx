import { useState } from 'react'
import { FieldRow } from '@kolkrabbi/kol-component'

export const stage = 'md'

const thumb = `data:image/svg+xml,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80"><rect width="80" height="80" fill="#1d1d21"/><circle cx="40" cy="40" r="22" fill="none" stroke="#8a8a94" stroke-width="2"/></svg>',
)}`

/* One row per field type — text (with a derived-hint line), status, select,
 * media, file. Values live here; FieldRow hands every edit back untouched. */
export default function FieldRowDemo() {
  const [title, setTitle] = useState('Blue print No. 4')
  const [status, setStatus] = useState('Live')
  const [series, setSeries] = useState('editions')
  const [media, setMedia] = useState({ thumb, name: 'blue-print-04.png' })
  const [file, setFile] = useState({ name: 'certificate.pdf' })
  return (
    <>
      <FieldRow
        type="text"
        label="Title"
        value={title}
        onChange={setTitle}
        hint={`prints/${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
      />
      <FieldRow
        type="status"
        label="Status"
        value={status}
        onChange={setStatus}
        options={[
          { value: 'Live', label: 'Live', tone: 'success' },
          { value: 'Draft', label: 'Draft', tone: 'warning' },
          { value: 'Archived', label: 'Archived' },
        ]}
      />
      <FieldRow
        type="select"
        label="Series"
        value={series}
        onChange={setSeries}
        options={[
          { value: 'editions', label: 'Editions' },
          { value: 'studies', label: 'Studies' },
          { value: 'posters', label: 'Posters' },
        ]}
      />
      <FieldRow type="media" label="Artwork" value={media} onChange={setMedia} onPick={() => {}} />
      <FieldRow type="file" label="Certificate" value={file} onChange={setFile} onPick={() => {}} />
    </>
  )
}
