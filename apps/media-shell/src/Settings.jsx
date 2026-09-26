import { useEffect, useState } from 'react'
import { SettingsScaffold, SettingsShortcuts, SettingsLinks, SettingsColophon } from '@kolkrabbi/kol-shell'
import {
  Button, LabeledControlSection, SettingsRow, SettingsChoice, useModal, listDrafts, clearDraft,
} from '@kolkrabbi/kol-component'
import { ThemeToggle } from '@kolkrabbi/kol-framework'

/* SETTINGS (plan v2, P7) — the person's preferences, on the page every shell app has
 * (`SettingsScaffold`). The per-bucket VIEW settings stay in the browse page's drawer
 * (`SettingsPanel`); this page holds what is about the person, not the listing:
 *
 *   Preferences  default view · default bucket · theme · the fixture's data controls
 *   Tags         the vocabulary — rename a tag everywhere; rename onto an existing one merges them
 *   Shortcuts    the same array the `?` sheet shows
 *   About        links + colophon
 *
 * The default view is written into the bucket's settings through the client — the fake D1 here,
 * olina's D1 in a real deploy — so the browse page opens on it. */

const VIEWS = [
  { value: 'columns', label: 'Columns' },
  { value: 'rows', label: 'Rows' },
  { value: 'grid', label: 'Grid' },
]
const viewPatch = (v) => ({ view: v, folderView: v === 'rows' ? 'rows' : 'columns', ...(v === 'grid' && { layout: 'grid' }) })

export default function Settings({ client, media, shortcuts, onShowTour }) {
  const modal = useModal()
  const bucket = media.bucketId
  const [saved, setSaved] = useState(null)
  const [data, setData] = useState({ objects: [], folders: {} })
  const [nonce, setNonce] = useState(0)
  useEffect(() => {
    let live = true
    Promise.all([client.loadSettings(bucket), client.listMedia('', { bucket }), client.folderInfo(bucket)])
      .then(([s, objects, folders]) => live && (setSaved(s ?? {}), setData({ objects, folders })))
    return () => { live = false }
  }, [bucket, nonce, media.refreshKey]) // eslint-disable-line react-hooks/exhaustive-deps

  const setDefaultView = async (v) => {
    const next = { ...(saved ?? {}), ...viewPatch(v) }
    await client.saveSettings(bucket, next)
    setSaved(next)
  }

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

  const tabs = [
    { value: 'preferences', label: 'Preferences', title: 'Settings', subtitle: 'How media opens for you' },
    { value: 'tags', label: 'Tags', title: 'Tags', subtitle: `${tags.length} in ${media.bucket.label}` },
    { value: 'shortcuts', label: 'Shortcuts', title: 'Shortcuts', subtitle: 'The same list as the ? sheet' },
    { value: 'about', label: 'About', title: 'About', subtitle: 'Media, on the KOL design system', row: 'layout' },
  ]

  const content = (tab) => {
    if (tab === 'preferences') return (
      <div className="flex flex-col gap-10 max-w-[720px]">
        <LabeledControlSection label="Browse">
          <SettingsRow label="Default view" hint="where Browse opens, for this bucket">
            <SettingsChoice options={VIEWS} value={saved?.view ?? 'columns'} onChange={setDefaultView} ariaLabel="Default view" />
          </SettingsRow>
          <SettingsRow label="Default bucket" hint="which store Browse opens on">
            <SettingsChoice options={media.buckets.map((b) => ({ value: b.id, label: b.label }))} value={bucket}
              onChange={(v) => media.switchBucket(v)} ariaLabel="Default bucket" />
          </SettingsRow>
        </LabeledControlSection>
        <LabeledControlSection label="Data">
          <SettingsRow label="Unsaved drafts" hint="kept in this browser only, never sent anywhere">
            <Button size="sm" variant="secondary" onClick={clearDrafts}>Throw away drafts</Button>
          </SettingsRow>
          <SettingsRow label="Clear changes" hint="the fixture's files, tags and favourites back to the seed">
            <Button size="sm" variant="secondary" onClick={() => { media.clearChanges(); setNonce((n) => n + 1) }}>Clear changes</Button>
          </SettingsRow>
        </LabeledControlSection>
      </div>
    )
    if (tab === 'tags') return (
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
    )
    if (tab === 'shortcuts') return <SettingsShortcuts shortcuts={shortcuts} />
    return (
      <div className="flex flex-col gap-10 max-w-[720px]">
        <SettingsLinks links={[
          { label: 'Design system', url: 'https://ui.kolkrabbi.io' },
          { label: 'The media tool alone', url: 'https://ui.kolkrabbi.io/apps/media/', text: 'apps/media' },
        ]} />
        {onShowTour && <div><Button size="sm" variant="nav" iconLeft="info" onClick={onShowTour}>Show the walkthrough again</Button></div>}
        <SettingsColophon />
      </div>
    )
  }

  return <SettingsScaffold tabs={tabs} renderContent={content} themeToggle={<ThemeToggle />} />
}
