/* THE MEDIA WIRING, shared by apps/media and apps/media-shell (plan v2, 2026-09-26).
 *
 * Everything an app does to put the DS media surface on the fixture — the bucket, the verbs, the
 * trash, uploads, the three seams (counts, thumbnails, dates) — lifted out of apps/media's App.jsx
 * so the second app does not grow a second copy that drifts. Not a UI component: it returns the
 * PROPS the DS `MediaLibrary` takes. Each app keeps its own chrome and its own routing — how a
 * folder path reaches the URL is the app's business, so `setPrefix` is passed in.
 *
 *   const media = useFixtureMedia({ client, title: 'MEDIA', setPrefix })
 *   <MediaLibrary variant="explorer" {...media.props} prefix={prefix} onPrefix={setPrefix} />
 */
import { useState } from 'react'
import { kindOf } from '@kolkrabbi/kol-component/utilities/mediaKinds'

const THUMBABLE = new Set(['image', 'video'])

export const formatDate = (iso) => {
  if (!iso) return ''
  const d = new Date(iso)
  return Number.isNaN(+d) ? iso : `${d.getDate()}.${d.getMonth() + 1}.${d.getFullYear()}`
}

// The last-used bucket survives a reload (browser storage; falls back to r2).
const BUCKET_KEY = 'kol-media:bucket'

export function useFixtureMedia({ client, title = 'MEDIA', setPrefix = () => {}, defaults }) {
  const BUCKETS = Object.fromEntries(client.buckets().map((b) => [b.id, b]))
  const [bucketId, setBucketId] = useState(() => {
    try { const v = localStorage.getItem(BUCKET_KEY); if (v && BUCKETS[v]) return v } catch { /* private mode */ }
    return 'r2'
  })
  const bucket = BUCKETS[bucketId]
  const [refreshKey, setRefreshKey] = useState(0)

  /* The tree is read fresh after every mutation — the store IS the tree, so a folder created,
   * moved or emptied shows in the columns at once. */
  const [folderTree, setFolderTree] = useState(() => client.folderTree())
  const touched = () => { setFolderTree(client.folderTree()); setRefreshKey((k) => k + 1) }

  const switchBucket = (id) => {
    if (!BUCKETS[id]) return
    setBucketId(id)
    try { localStorage.setItem(BUCKET_KEY, id) } catch { /* private mode */ }
    setPrefix('')
    setRefreshKey((k) => k + 1)
  }

  /* CLEAR CHANGES — the fixture back to seed (bucket and every D1 row pointing into it). */
  const clearChanges = () => { client.reset(); setPrefix(''); touched() }

  /* Multi-bucket browse prefixes every key with a virtual root (`<title>/<bucket label>/`); the
   * seams need the bucket-relative key back. */
  const unroot = (p) => {
    const vroot = `${title}/${bucket.label}/`
    return p.startsWith(vroot) ? p.slice(vroot.length) : p
  }
  const folderMeta = (path) => {
    const c = folderTree[bucketId]?.counts?.[unroot(path)]
    return c ? `${c.files} item${c.files === 1 ? '' : 's'}` : ''
  }
  /* The tile: an image or a video draws itself (`#t=0.1` so a browser paints a frame); anything
   * else falls through to the DS's kind glyph. */
  const thumbnailFor = (o) => {
    const kind = kindOf(o)
    if (!THUMBABLE.has(kind)) return null
    const url = client.mediaUrl(unroot(o.key), bucketId)
    return kind === 'video'
      ? <video src={`${url}#t=0.1`} preload="metadata" muted playsInline className="w-full h-full object-cover" />
      : <img src={url} alt="" loading="lazy" decoding="async" className="w-full h-full object-cover" />
  }

  /* THE FILE VERBS, wired to the fixture. `move` is `rename` with a new parent. */
  const fileActions = {
    createFolder: async (path) => { await client.createFolder(path, bucketId); touched() },
    createFile: async (key) => { await client.createFile(key, bucketId); touched() },
    rename: async (from, to) => { await client.renameObject(from, to, bucketId); touched() },
    move: async (path, destFolder) => {
      const name = path.replace(/\/$/, '').split('/').pop()
      await client.renameObject(path, `${destFolder}${name}${path.endsWith('/') ? '/' : ''}`, bucketId)
      touched()
    },
    remove: async (path) => { await client.deleteObject(path, bucketId); touched() },
    /* A CONSUMER VERB: Duplicate, Finder's naming — `photo copy.jpg`, then `photo copy 2.jpg`. */
    items: [
      {
        label: 'Duplicate',
        icon: 'copy',
        when: (t) => t.type === 'file',
        run: async (t) => {
          const taken = new Set((await client.listMedia('', { bucket: bucketId })).map((o) => o.key))
          for (const key of (t.targets ?? [t.path]).filter((k) => !k.endsWith('/'))) {
            const dot = key.lastIndexOf('.')
            const [base, ext] = dot > key.lastIndexOf('/') + 1 ? [key.slice(0, dot), key.slice(dot)] : [key, '']
            let next = `${base} copy${ext}`
            for (let n = 2; taken.has(next); n++) next = `${base} copy ${n}${ext}`
            taken.add(next)
            await client.copyObject(key, next, bucketId)
          }
          touched()
        },
      },
    ],
  }

  /* DESKTOP FILES DROPPED ON A FOLDER — the fixture's upload, so a dropped photo previews as itself. */
  const onDropFiles = async (files, folder) => {
    for (const f of Array.from(files)) await client.uploadFile(f, `${folder}${f.name}`, bucketId)
    touched()
  }

  const props = {
    client,
    title,
    fileActions: bucket.writable ? fileActions : undefined,
    onDropFiles,
    trash: bucket.writable ? {
      items: client.trashList(bucketId),
      restore: async (id) => { await client.restore(id); touched() },
      purge: async (id) => { await client.purge(id); touched() },
      empty: async () => { await client.emptyTrash(bucketId); touched() },
    } : undefined,
    bucket: bucketId,
    onBucketChange: switchBucket,
    ...(defaults && { defaults }),
    refreshKey,
    folderMeta,
    thumbnailFor,
    formatDate,
    folderTree,
  }

  return { props, bucket, bucketId, buckets: Object.values(BUCKETS), switchBucket, touched, clearChanges, fileActions, refreshKey }
}
