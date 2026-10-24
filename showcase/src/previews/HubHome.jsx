import { useState } from 'react'
import { Button } from '@kolkrabbi/kol-component'
import { HubHome } from '@kolkrabbi/kol-shell'

export const stage = 'full'

const IMG = (h) => 'data:image/svg+xml,' + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="600" height="600"><rect width="600" height="600" fill="hsl(${h} 25% 50%)"/></svg>`)
const SEED = [
  { id: 'f1', name: 'Morph W 1791484577796', updatedAt: Date.parse('2026-10-22'), bytes: 18400, cover: IMG(20), kind: 'final', tags: ['poster', 'loop'], details: [{ label: 'Modules', value: 12 }, { label: 'Connections', value: 9 }] },
  { id: 'f2', name: 'Poster 04', updatedAt: Date.parse('2026-10-20'), bytes: 6200, kind: 'draft', tags: ['poster'], details: [{ label: 'Layers', value: 3 }, { label: 'Aspect', value: '1:1' }] },
  { id: 'f3', name: 'Loop study', updatedAt: Date.parse('2026-10-18'), bytes: 41000, cover: IMG(200), kind: 'draft', tags: ['loop', 'social'], details: [{ label: 'Layers', value: 5 }, { label: 'Aspect', value: '4:5' }] },
]

/* the Hub's Home: the app's masthead over a Catalog, RECENT · SAVED, and a walkthrough that opens only
 * from its button — the X inside the card closes it. HOME IS A DATA CONTRACT (HubHomeContract,
 * 2026-10-23): the consumer hands files and handlers; the Hub draws every card — title, date, size —
 * and the cog opens the file's rail: name, tags, details, the verbs. New is the action button. */
export default function HubHomePreview() {
  const [files, setFiles] = useState(SEED)
  return (
    <HubHome
      app={{ name: 'Shell', subtitle: 'The Hub around a placeholder tool' }}
      files={files}
      onOpen={() => {}}
      onDownload={() => {}}
      onRename={(f, name) => setFiles((fs) => fs.map((x) => (x.id === f.id ? { ...x, name } : x)))}
      onDuplicate={(f) => setFiles((fs) => [{ ...f, id: `${f.id}-${Date.now()}`, name: `${f.name} copy`, updatedAt: Date.now() }, ...fs])}
      onRemove={(f) => setFiles((fs) => fs.filter((x) => x.id !== f.id))}
      onTags={(f, tags) => setFiles((fs) => fs.map((x) => (x.id === f.id ? { ...x, tags } : x)))}
      filterGroups={[{ label: 'Kind', key: 'kind', values: ['draft', 'final'], exclusive: true }]}
      action={{ label: 'New', onClick: () => {} }}
      walkthrough={[
        { title: '1. Home', text: ['What you opened last and what you saved.'] },
        { title: 'Get started', actions: (close) => <Button tone="grey" size="md" onClick={close}>Start</Button> },
      ]}
    />
  )
}
