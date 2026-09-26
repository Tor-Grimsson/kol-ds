import { useEffect, useState } from 'react'
import { Button, SettingsRow, SettingsChoice, useModal, listDrafts, clearDraft, mediaSettingsSections } from '@kolkrabbi/kol-component'

/* SETTINGS ON THE HUB — ONE SETTINGS SYSTEM (user, 2026-09-26: "are we saying the shell has
 * settings different from media?"). kol-shell's HubSettings draws the page and its drawer; the rows
 * are this app's (Browse · Data) followed by the DS's own media display rows
 * (`mediaSettingsSections`) — the same rows the browse page's gear opens, over the same per-bucket
 * settings object the app holds and saves through the client (the fake D1 here, olina's D1 live).
 * Whichever surface changes a row, the others read it. A hook: AppHub renders the page. */

const VIEWS = [
  { value: 'columns', label: 'Columns' },
  { value: 'rows', label: 'Rows' },
  { value: 'grid', label: 'Grid' },
]
const viewPatch = (v) => ({ view: v, folderView: v === 'rows' ? 'rows' : 'columns', ...(v === 'grid' && { layout: 'grid' }) })

export function useSettings({ client, media, view, setView, resetView }) {
  const modal = useModal()
  const bucket = media.bucketId
  const [data, setData] = useState({ objects: [], folders: {} })
  const [nonce, setNonce] = useState(0)
  useEffect(() => {
    let live = true
    Promise.all([client.listMedia('', { bucket }), client.folderInfo(bucket)])
      .then(([objects, folders]) => live && setData({ objects, folders }))
    return () => { live = false }
  }, [bucket, nonce, media.refreshKey]) // eslint-disable-line react-hooks/exhaustive-deps

  const setDefaultView = (v) => setView({ ...view, ...viewPatch(v) })

  /* TAGS: counted across files and folders; a rename rewrites every row that carries it */
  const counts = {}
  for (const o of data.objects) for (const t of o.tags ?? []) counts[t] = (counts[t] ?? 0) + 1
  for (const f of Object.values(data.folders)) for (const t of f.tags ?? []) counts[t] = (counts[t] ?? 0) + 1
  const tags = Object.entries(counts).sort((a, b) => a[0].localeCompare(b[0]))
  const renameTag = async (from) => {
    const to = (await modal.prompt(`Rename #${from} everywhere (an existing tag's name merges the two):`, from, { okLabel: 'Rename' }))?.trim().toLowerCase()
    if (!to || to === from) return
    const swap = (list) => [...new Set(list.map((t) => (t === from ? to : t)))]
    for (const o of data.objects) if (o.tags?.includes(from)) await client.setTags(o.key, swap(o.tags), bucket)
    for (const [path, f] of Object.entries(data.folders)) if (f.tags?.includes(from)) await client.setTags(path, swap(f.tags), bucket)
    setNonce((n) => n + 1)
  }
  const removeTag = async (tag) => {
    if (!(await modal.confirm(`Remove #${tag} from ${counts[tag]} item${counts[tag] === 1 ? '' : 's'}? The files stay.`, { okLabel: 'Remove' }))) return
    for (const o of data.objects) if (o.tags?.includes(tag)) await client.setTags(o.key, o.tags.filter((t) => t !== tag), bucket)
    for (const [path, f] of Object.entries(data.folders)) if (f.tags?.includes(tag)) await client.setTags(path, f.tags.filter((t) => t !== tag), bucket)
    setNonce((n) => n + 1)
  }

  const clearDrafts = async () => {
    const all = listDrafts(bucket)
    if (!all.length) { await modal.alert('No unsaved drafts in this bucket.'); return }
    if (!(await modal.confirm(`Throw away ${all.length} unsaved draft${all.length === 1 ? '' : 's'}? Saved files are not touched.`, { okLabel: 'Throw away' }))) return
    for (const d of all) clearDraft(bucket, d.key)
  }

  const sections = [
    { label: 'Browse', rows: [
      { label: 'Default view', hint: 'where Browse opens, for this bucket',
        render: () => <SettingsChoice options={VIEWS} value={view.view ?? 'columns'} onChange={setDefaultView} ariaLabel="Default view" /> },
      { label: 'Default bucket', hint: 'which store Browse opens on',
        render: () => <SettingsChoice options={media.buckets.map((b) => ({ value: b.id, label: b.label }))} value={bucket} onChange={(v) => media.switchBucket(v)} ariaLabel="Default bucket" /> },
    ] },
    { label: 'Data', rows: [
      { label: 'Unsaved drafts', hint: 'kept in this browser only, never sent anywhere',
        render: () => <Button size="sm" onClick={clearDrafts}>Throw away drafts</Button> },
      { label: 'Clear changes', hint: "the fixture's files, tags and favourites back to the seed",
        render: () => <Button size="sm" onClick={() => { media.clearChanges(); setNonce((n) => n + 1) }}>Clear changes</Button> },
    ] },
    ...mediaSettingsSections({ settings: view, onChange: setView }),
  ]

  const tagsTab = {
    value: 'tags', label: 'TAGS', title: 'Tags', subtitle: `${tags.length} in ${media.bucket.label}`,
    content: (
      <div className="flex flex-col gap-2 max-w-[720px]">
        {tags.length === 0 && <p className="kol-mono-12 text-fg-48">No tags yet — add them in Browse, in a file's preview.</p>}
        {tags.map(([t, n]) => (
          <SettingsRow key={t} label={`#${t}`} hint={`${n} item${n === 1 ? '' : 's'}`}>
            <span className="flex items-center gap-2">
              <Button size="sm" variant="nav" onClick={() => renameTag(t)}>Rename</Button>
              <Button size="sm" variant="nav" onClick={() => removeTag(t)}>Remove</Button>
            </span>
          </SettingsRow>
        ))}
      </div>
    ),
  }

  return { sections, tabs: [tagsTab], drawer: { onReset: resetView }, themeIn: 'drawer' }
}
