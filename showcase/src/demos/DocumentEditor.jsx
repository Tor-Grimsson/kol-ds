import { useState } from 'react'
import { Button, DocumentEditor } from '@kolkrabbi/kol-component'

export const stage = 'hug'

/* Both modes. Edit opens a markdown file with frontmatter — the fields form over the body, the
 * rendered page beside it; New is the writing page (a name, a type, a starter). Saving writes back
 * into this demo's state; drafts are browser memory under the `demo` bucket. */
const SEED = `---
title: Field notes
date: 2026-09-26
tags: [notes, studio]
---

# Field notes

The **row** is the unit; the *column* is the path.

- one
- two
`
const ASSETS = [{ key: 'img/logo.svg', name: 'logo.svg', url: '/favicon/favicon-kol-ds.svg', contentType: 'image/svg+xml' }]

export default function DocumentEditorDemo() {
  const [text, setText] = useState(SEED)
  const [open, setOpen] = useState(null)
  const [log, setLog] = useState('—')
  return (
    <div className="flex flex-col items-start gap-3">
      <div className="flex gap-2">
        <Button size="sm" iconLeft="edit" onClick={() => setOpen('edit')}>Edit field-notes.md</Button>
        <Button size="sm" variant="secondary" iconLeft="plus" onClick={() => setOpen('new')}>New document</Button>
      </div>
      <span className="kol-helper-10 text-meta">last: {log}</span>
      {open === 'edit' && (
        <DocumentEditor name="field-notes.md" kind="markdown" text={text} draft={{ bucket: 'demo', key: 'field-notes.md' }} assets={ASSETS}
          onSave={async (t) => { setText(t); setLog('saved field-notes.md') }} onClose={() => setOpen(null)} />
      )}
      {open === 'new' && (
        <DocumentEditor mode="new" folder="notes/" onCreate={async ({ name }) => { setLog(`created notes/${name}`); setOpen(null) }} onClose={() => setOpen(null)} />
      )}
    </div>
  )
}
