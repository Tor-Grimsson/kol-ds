import { useRef, useState } from 'react'
import Button from '@kolkrabbi/kol-component/atoms/Button'
import fixtureClient from './fixture/client'

/* Ported from kol-r2b2 verbatim — markup and classes unchanged. The only
 * difference is where the bytes go: `uploadFile` is the fixture's, so an upload
 * lands in the in-memory tree instead of an R2 bucket.
 *
 * This is the surface that exists TWICE in the estate (here and forked in
 * kol-client-olina, where a folder field and browser-side conversion were added
 * because there was nowhere in the DS to put them). It stays app-local for now
 * — it becomes a package the moment its shape is settled, per the tier rules. */

export default function UploadZone({ pathPrefix, bucket, onUploaded }) {
  const inputRef = useRef(null)
  const [dragOver, setDragOver] = useState(false)
  const [items, setItems] = useState([])

  const startUploads = async (files) => {
    const cleanPrefix = pathPrefix.replace(/^\/+|\/+$/g, '')
    const incoming = Array.from(files).map((f) => ({
      id: `${f.name}-${Date.now()}-${Math.random()}`,
      name: f.name,
      file: f,
      key: cleanPrefix ? `${cleanPrefix}/${f.name}` : f.name,
      progress: 0,
      done: false,
      error: null,
    }))
    setItems((prev) => [...incoming, ...prev])

    let anySuccess = false
    for (const item of incoming) {
      try {
        // No transfer, so no progress to report — it lands at once.
        await fixtureClient.uploadFile(item.file, item.key, bucket)
        anySuccess = true
        setItems((prev) => prev.map((u) => (u.id === item.id ? { ...u, progress: 1, done: true } : u)))
      } catch (err) {
        setItems((prev) => prev.map((u) => (u.id === item.id ? { ...u, error: err.message } : u)))
      }
    }
    if (anySuccess) onUploaded?.()
  }

  return (
    <section>
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => { e.preventDefault(); setDragOver(false); if (e.dataTransfer.files?.length) startUploads(e.dataTransfer.files) }}
        onClick={() => inputRef.current?.click()}
        className={`flex flex-col items-center justify-center gap-3 rounded border-2 border-dashed cursor-pointer transition-colors py-12 px-6 ${dragOver ? 'bg-fg-08 border-fg-48' : 'bg-fg-02 border-fg-12 hover:bg-fg-04'}`}
        style={{ borderColor: dragOver ? 'var(--kol-fg-48)' : 'var(--kol-fg-12)' }}
      >
        <p className="kol-sans-body-02 text-fg-default">Drop files to upload</p>
        <p className="kol-mono-12 text-fg-64">or click anywhere in this box</p>
        <input
          ref={inputRef}
          type="file"
          multiple
          className="hidden"
          onChange={(e) => { if (e.target.files?.length) startUploads(e.target.files); e.target.value = '' }}
        />
      </div>

      {items.length > 0 && (
        <ul className="mt-4 space-y-1">
          {items.map((u) => (
            <li key={u.id} className="kol-mono-12 flex items-center gap-3">
              <span className={`flex-1 truncate ${u.error ? 'text-ui-error' : u.done ? 'text-fg-default' : 'text-fg-64'}`}>
                {u.key}
              </span>
              <span className="text-fg-48 shrink-0">
                {u.error ? `error: ${u.error}` : u.done ? 'done' : `${Math.round(u.progress * 100)}%`}
              </span>
            </li>
          ))}
          {items.some((u) => u.done || u.error) && (
            <li>
              <Button variant="ghost" size="sm" onClick={() => setItems((prev) => prev.filter((u) => !u.done && !u.error))}>
                Clear finished
              </Button>
            </li>
          )}
        </ul>
      )}
    </section>
  )
}
