import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { downloadBlob } from '@kolkrabbi/kol-component'
import { useLibrary, addToLibrary, removeFromLibrary, exportEntry } from '../../../mixer/src/hooks/useLibraryStore.js'
import { PatchThumb } from '../components/PatchThumb.jsx'
import { cover, title } from '../../../studio-hub/src/covers.js'

/**
 * ON THE HUB (apps/mixer-hub, 2026-10-03): this file is Mirror's Home as DATA — `useHome()` returns
 * `HubHome`'s props, the walkthrough and the one file card, and kol-shell's `AppStudio` draws the page.
 *
 * HOME IS A DATA CONTRACT (HubHomeContract, 2026-10-23): the Hub draws every card. The files are the
 * saved patches (useLibraryStore, kind `patch`, the shipped presets excluded — those live in Library),
 * or the review seed when none is saved; a click opens the studio; Enter Studio is the action button.
 * The memory slots are not files and left Home for the Library (fxr's ruling of plan 39).
 *
 * EVERY VERB, OVER THIS APP'S OWN STATE (user 2026-10-24: *"why isnt there a trash icon in cards in
 * library? how can you manage your library?"* — Mirror passed no rename, tags or note, so the card had
 * no cog and the rail no pencil). The files live here, seeded from the store and re-read when its
 * patches change; Rename, tags and the note write this state (the store has no write for them),
 * Duplicate and Delete write the store when the file is a saved patch, and the cover's download is the
 * store's export. `fileCard` is the one card Home and Library draw, studio-hub's shape.
 */

const WALKTHROUGH_STEPS = [
  {
    title: '1. Distort',
    text: [
      'Three halls of distortion — Displacement (SVG turbulence), Movement (GSAP transforms), Copies (WebGL slicing, glitch, kaleidoscope).',
      'Pick a variant, drop in an image or vector, and shape it with the per-variant controls.',
    ],
  },
  {
    title: '2. Mix',
    text: [
      'The Symphony mixer layers three channels with independent FX chains, blend modes, and opacity — plus procedural generators (Noise, Gradient, Pattern, Color Field) as channel sources.',
      'Six send/return buses composite shared processing on top.',
    ],
  },
  {
    title: '3. Route',
    text: [
      'The routing matrix patches any output to any input — channel to channel, bus to channel, bus to bus.',
      'Loops are legal: a cycle reads last frame’s buffer, the classic video-synth feedback trick.',
    ],
  },
  {
    title: '4. Feed back',
    text: [
      'Per-channel feedback accumulates trails — decay sets how fast new frames take over (high decay = short trails), freeze holds the buffer.',
      'Drive any knob with an expression — click its value and type wave(t), rand(), ease(t).',
    ],
  },
  {
    title: '5. Record',
    text: [
      'Arm a channel and capture loops as .webm — trim with I/O marks, frame-step with arrows, freeze a take onto the channel as a video source.',
      'Save favourite states to the 9 memory slots; they persist across sessions.',
    ],
  },
  { title: 'Get started', actions: true },
]

/* a saved patch as Home's file — its live channel count and description as the rail's details */
const patchFile = (e) => ({
  id: e.id,
  name: e.name,
  tags: e.tags ?? [],
  note: e.description ?? '',
  details: [{ label: 'Channels', value: (e.data?.channels || []).filter((c) => c.variantId).length }],
  updatedAt: e.savedAt,
  bytes: new Blob([JSON.stringify(e)]).size,
  cover: <PatchThumb patch={e} />,
})

/* THE REVIEW SEED (user 2026-10-23, the hubs beside studio-hub): a fresh browser has no saved patches, so Home drew
 * nothing. With none saved, twelve dummy patches stand in — studio-hub's covers — and leave with the first real save. */
const DAY = 86400000
const SEED_NAMES = ['mirror-ball', 'tunnel', 'kaleido', 'ripple-tank', 'strobe', 'feedback-loop', 'chroma-split', 'warp-field', 'tiles', 'scan-fold', 'prism', 'slit-scan']
const SEED = SEED_NAMES.map((slug, i) => ({
  id: `seed-${slug}`,
  name: title(slug),
  tags: [['loop', 'poster', 'social', 'test'][i % 4]],
  details: [{ label: 'Channels', value: 1 + (i % 4) }],
  updatedAt: Date.parse('2026-10-23T12:00:00Z') - i * DAY,
  bytes: 2400 + i * 760,
  cover: cover(i + 60),
  note: i % 2 ? '' : `Patched for the ${['Mengi', 'Iðnó', 'Harpa', 'Gaukurinn'][i % 4]} show.`,
}))

const filesOf = (patches) => (patches.length ? patches.map(patchFile) : SEED)

export function useHome() {
  const navigate = useNavigate()
  const patches = useLibrary('patch').filter((e) => !e.preset)
  const key = patches.map((e) => e.id).join()
  const [files, setFiles] = useState(() => filesOf(patches))
  useEffect(() => { setFiles(filesOf(patches)) }, [key]) // eslint-disable-line react-hooks/exhaustive-deps
  const entry = (id) => patches.find((e) => e.id === id)
  const edit = (id, patch) => setFiles((fs) => fs.map((x) => (x.id === id ? { ...x, ...patch } : x)))

  /* the walkthrough as DATA (2026-10-24): the cover the Hub draws, and the Get started actions as `{ label, onClick }` —
   * the Hub draws the buttons (Mirror drew its own, not the DS's) and closes the walkthrough before each handler */
  const walkthrough = WALKTHROUGH_STEPS.map((s) => s.actions
    ? { ...s, actions: [{ label: 'Enter Studio', onClick: () => navigate('/studio') }, { label: 'Browse Library', onClick: () => navigate('/library') }] }
    : { ...s, cover: '/images/stack-hero-800.jpg' })

  const home = {
    files,
    onOpen: () => navigate('/studio'),
    onDownload: (f) => { const e = entry(f.id); if (e) { exportEntry(e); return } const { cover: _c, ...data } = f; downloadBlob(new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' }), `${f.name}.json`) },
    onRename: (f, name) => edit(f.id, { name, updatedAt: Date.now() }),
    onDuplicate: (f) => { const e = entry(f.id); if (e) addToLibrary({ ...e, name: `${e.name} copy` }); else setFiles((fs) => [{ ...f, id: `${f.id}-${Date.now().toString(36)}`, name: `${f.name} copy`, updatedAt: Date.now() }, ...fs]) },
    onRemove: (f) => { if (entry(f.id)) removeFromLibrary(f.id); else setFiles((fs) => fs.filter((x) => x.id !== f.id)) },
    onTags: (f, tags) => edit(f.id, { tags }),
    onNote: (f, note) => edit(f.id, { note }),
    /* the rail's Upload image (2.2) — the picked picture becomes the save's cover (kol-mirror's writes `setThumb`) */
    onCover: (f, src) => edit(f.id, { cover: <img src={src} alt="" className="size-full object-cover" /> }),
    action: { label: 'Enter Studio', onClick: () => navigate('/studio') },
  }

  return { walkthrough, home }
}
