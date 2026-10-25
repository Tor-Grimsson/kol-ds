import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { downloadBlob } from '@kolkrabbi/kol-component'
import { patches } from '../../../rack/src/data/patches'
import { Illustration } from '../walkthrough'
import { HubHome } from '@kolkrabbi/kol-shell'

/**
 * HomePage — the front door, at `/`, on kol-shell's `HubHome` (the data contract, 2026-10-23; was `CatalogPage`)
 * (ShellHomeSystem, kol-shell 0.8.0 — this page was one of its three sources;
 * adopted 2026-08-27 on kol-fxr's wiring). Semantics stay the consumer's:
 * the files are the presets, a click opens the rack.
 *
 * EVERY VERB, OVER THIS APP'S OWN STATE (user 2026-10-24: *"why isnt there a trash icon in cards in library? how can
 * you manage your library?"* — Monitor passed no handlers, so the card had no cog or trash and the rail no pencil).
 * The presets are read-only data, so the files live here as state seeded from them: Rename, Duplicate, Delete, tags
 * and the note write this state, the way studio-hub's do; the cover's download is the preset's JSON. `fileCard` is
 * the one card Home and Library draw, studio-hub's shape.
 */

const WALKTHROUGH_STEPS = [
  {
    title: '1. Build',
    svg: 'build',
    text: ['Add rows to your case and pick modules from the workbench. Use the icons in the bottom-right corner to add 1U/3U rows and set HP width.', 'Filter and search modules by category, or name your case with the edit button.'],
  },
  {
    title: '2. Patch',
    svg: 'patch',
    text: ['Click an output jack, then click an input jack — a cable connects them and signals flow.', 'Press C to lock cables, O to toggle cable visibility, D to clear the display.'],
  },
  {
    title: '3. Modulate',
    svg: 'modulate',
    text: ['Patch an LFO or envelope into any CV jack to animate parameters.', 'Sync modules to a shared Clock source for internal rhythm.'],
  },
  {
    title: '4. Watch',
    svg: 'watch',
    text: ['Your signal appears on display modules — Monitor, Scope, Console, Output.', 'Patch a Pen module into the pen input to control stroke, dash, and opacity of the signal vector.'],
  },
  {
    title: '5. Record & Save',
    svg: 'record',
    text: [
      'The Recorder module captures .webm video. Set resolution (720p–4K), frame rate (30/60fps), aspect ratio (1:1, 16:9, 9:16, and more), and duration before recording.',
      <>Convert with <a href="https://formulae.brew.sh/formula/ffmpeg" target="_blank" rel="noopener noreferrer" className="underline hover:text-yellow-400">ffmpeg</a>: ffmpeg -i render.webm output.mp4 — or use a transcoder app like <a href="https://handbrake.fr" target="_blank" rel="noopener noreferrer" className="underline hover:text-yellow-400">HandBrake</a>.</>,
      'Export your patch as a JSON file from the Patch module or the sidebar. Import it later to restore your rack, modules, connections, and settings.',
    ],
  },
  {
    title: 'Get Started',
    actions: true,
  },
]

const PRESET_NAMES = Object.keys(patches).filter(k => k !== 'ref' && k !== 'empty')

const allPresets = PRESET_NAMES.map(name => {
  const p = patches[name]
  return {
    name,
    title: name.replace(/([A-Z])/g, ' $1').replace(/[-_]/g, ' ').trim(),
    // ponytail: no preset carries a type yet — all read 'patches' until `type: 'envelope' | 'effects'` is set on one in patches.js
    type: p.type ?? 'patches',
    tags: p.tags || [],
  }
})

const TAGS = [...new Set(PRESET_NAMES.flatMap(n => patches[n].tags || []))]
/* TYPE stacks as a narrow column (`stack`), TAGS wraps beside it — the DS's own group shapes; Type is exclusive */
export const FILTER_GROUPS = [
  { label: 'Type', key: 'type', values: ['envelope', 'effects', 'patches'], stack: true, exclusive: true },
  { label: 'Tags', key: 'tags', values: TAGS },
]

/* HOME IS THE USER'S SAVES (user 2026-10-24: *"home only has to show 3-4 files in monitor … home now would only show
 * USER saved patches, which are different from LIBRARY saves"*): four saves stand in here, each made from a shipped
 * preset (kol-monitor's are its library store's entries). The shipped presets themselves are the Library's
 * (`shipped.jsx`). The Hub draws the cards (title, date, size), the cog opens the rail. The blank start is New Rack,
 * the action button. */
const DAY = 86400000
export const FILES = allPresets.slice(0, 4).map((p, i) => {
  const src = patches[p.name]
  return {
    id: `save-${p.name}`,
    name: `${p.title} (mine)`,
    updatedAt: Date.parse('2026-10-23T12:00:00Z') - i * DAY,
    bytes: new Blob([JSON.stringify(src)]).size,
    cover: `/previews/patches/${p.name}.png`,
    back: `/previews/racks/${p.name}.png`,
    images: [{ id: 'output', src: `/previews/patches/${p.name}.png`, label: 'Output' }, { id: 'rack', src: `/previews/racks/${p.name}.png`, label: 'Rack' }],
    type: p.type,
    tags: p.tags,
    details: [{ label: 'Modules', value: src.rows?.reduce((n, r) => n + (r.modules?.length || 0), 0) || 0 }, { label: 'Connections', value: src.connections?.length || 0 }],
    seedOf: p.name,
  }
})

/* ON THE STUDIO (2026-10-23): Home's data, its tour and the one file card, read by App.jsx's `AppStudio` — HubHome draws the page there */
export function useHome() {
  const navigate = useNavigate()
  const [files, setFiles] = useState(FILES)
  const edit = (id, patch) => setFiles((fs) => fs.map((x) => (x.id === id ? { ...x, ...patch } : x)))

  /* the Get started actions as DATA (2026-10-24): the Hub draws the buttons (Monitor drew its own, not the DS's) and
   * closes the walkthrough before each handler; the SVG illustrations stay a drawing */
  const walkthrough = WALKTHROUGH_STEPS.map(s => s.actions
    ? { ...s, actions: [{ label: 'Create Rack', onClick: () => navigate('/create') }, { label: 'Browse Library', onClick: () => navigate('/library') }] }
    : {
        title: s.title,
        text: Array.isArray(s.text) ? s.text : [s.text],
        illustration: (
          <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }} className="text-fg-48">
            <Illustration name={s.svg} />
          </div>
        ),
      })

  const home = {
    files,
    /* a save opens in the rack — it is the user's own file; a shipped patch in the Library opens its page (3.2) */
    onOpen: (f) => navigate(`/rack/preset/${f.seedOf ?? f.id}`),
    onDownload: (f) => { const { cover: _c, ...data } = patches[f.seedOf] ?? f; downloadBlob(new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' }), `${f.name}.json`) },
    onRename: (f, name) => edit(f.id, { name, updatedAt: Date.now() }),
    onDuplicate: (f) => setFiles((fs) => [{ ...f, id: `${f.id}-${Date.now().toString(36)}`, name: `${f.name} copy`, updatedAt: Date.now() }, ...fs]),
    onRemove: (f) => setFiles((fs) => fs.filter((x) => x.id !== f.id)),
    onTags: (f, tags) => edit(f.id, { tags }),
    onNote: (f, note) => edit(f.id, { note }),
    /* the rail's Files section (FileRailImages): the cover and back are picked from the save's images (`null` when the
     * image that was it is removed); upload and × hand the whole list back */
    onCover: (f, src) => edit(f.id, { cover: src }),
    onBack: (f, src) => edit(f.id, { back: src }),
    onImages: (f, next) => edit(f.id, { images: next }),
    filterGroups: FILTER_GROUPS,
    action: { label: 'New Rack', onClick: () => navigate('/create') },
  }
  return { home, walkthrough }
}

/* the page alone, outside the Studio */
export default function HomePage() {
  const { home, walkthrough } = useHome()
  return <HubHome app={{ name: 'Monitor', subtitle: 'Video synthesis workstation' }} {...home} walkthrough={walkthrough} />
}
