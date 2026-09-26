/* THE NOTES AND DECKS WIRING, shared by the tool-alone apps (apps/notes, apps/presentation) and
 * apps/media-shell's tabs (2026-09-27) — `useMediaTool`'s idea for the two new tools. The COMPONENTS
 * are the packages' (kol-notes `Notes`, kol-deck `Decks`), so there is nothing to upstream: every app
 * renders the same source. What could still drift is the wiring around them — which files Attach
 * offers, where an uploaded picture goes, which layouts a slide is picked from — so it lives here,
 * once. Each app keeps only its routing (which note / deck is open, and how that reaches the URL).
 *
 *   const notes = useNotesTool({ client })
 *   <Notes {...notes.props} open={slug} onOpenChange={setSlug} />
 */
import { useEffect, useMemo, useState } from 'react'
import { SEED_LAYOUTS } from './deckSeed.js'

/* the product keeps media in the writable bucket; both tools read and write there */
const BUCKET = 'r2'
const nameOf = (key) => key.split('/').pop() || key

/** kol-notes' `Notes` props: the client, and every bucket file as something Attach can insert. */
export function useNotesTool({ client, bucket = BUCKET, refreshKey }) {
  const [objects, setObjects] = useState([])
  useEffect(() => {
    let live = true
    client.listMedia('', { bucket }).then((all) => live && setObjects(all))
    return () => { live = false }
  }, [client, bucket, refreshKey])
  const assets = useMemo(() => objects.map((o) => ({ key: o.key, name: nameOf(o.key), url: client.mediaUrl(o.key, bucket), contentType: o.contentType })), [client, bucket, objects])
  return { props: { client, assets } }
}

/** kol-deck's `Decks` props: the client, olina's layouts, the bucket as picker and upload target. */
export function useDecksTool({ client, bucket = BUCKET }) {
  const props = useMemo(() => ({
    client,
    layouts: SEED_LAYOUTS,
    mediaClient: client,
    /* a picture from disk goes where the product keeps media, and the slide holds its URL */
    onUpload: async (file) => {
      const key = `decks/${Date.now().toString(36)}-${file.name}`
      await client.uploadFile(file, key, bucket)
      return client.mediaUrl(key, bucket)
    },
  }), [client, bucket])
  return { props }
}
