// Per-bucket display settings. Ported from kol-r2b2 with its rulings intact —
// only the bucket roster changed (the fixture has two stores, not three).
//
// Every one of these is a DEFAULT, never a gate. Anything a setting hides is
// reachable by flipping it — the browser must never make a file unreachable,
// only unobtrusive by default.

// The kind vocabulary is the DS's since MediaLibraryPages (component 0.118.0 promoted lib/media.js).
import { KINDS, DEFAULT_KINDS } from '@kolkrabbi/kol-component/utilities/mediaKinds'

// v2 (2026-09-21): `videoPreview` default 'poster' → 'autoload' and `layout` no longer forced off.
// Both are read from saved settings, so a bump is the only way an existing session sees either.
const STORE_KEY = 'kol-media:settings:v2'

export const ALL_KINDS = [...KINDS, 'segments', 'system']

/* ONE height, everywhere, every reload (user 2026-08-27: "JUST ONE HEIGHT for all … always one
 * height always on reload"). Deliberately NOT a setting: it was stored per bucket, so each bucket
 * came back at whatever it was last dragged to and switching buckets made the pane jump. The drag
 * still works — App holds the dragged value for the session and throws it away on reload. */
export const COLUMN_HEIGHT = 800 // on the 8px grid

// Shared floor. Per-bucket blocks below override only what genuinely differs.
const BASE = {
  kinds: [...DEFAULT_KINDS], // audio · video · images · markdown · JSON · YAML · text · code (user 2026-08-27); the rest one tick away
  flat: false,
  groupVariants: true,
  foldSegments: true,
  pageSize: 200,
  /* 'autoload', not kol-r2b2's 'poster'. On 'poster' the wall looks for a sibling still beside the
   * video and prints the word "video" when there is none — which is every video here. r2b2 avoids
   * 'autoload' because its videos are up to 400 MB on a live bucket; the fixture's are local files
   * of a few hundred KB, so the wall mounts the real element and shows a frame. */
  videoPreview: 'autoload', // 'poster' | 'none' | 'autoload'
  layout: 'list', // 'off' | 'grid' | 'list' — the wall is visible here; see loadSettings
  folderView: 'columns', // 'rows' | 'columns' — the folder navigator above the files (columns by default, user 2026-08-27)
  /* `stackView` is the MOBILE half of `folderView` — below `md` the column browser renders as one
   * list, and this says list or grid (ColumnBrowserMobileViews, component 0.204.0). It is separate
   * from `layout` because that governs the files WALL; this governs the browser. Desktop ignores it. */
  stackView: 'list', // 'list' | 'grid'
  sortBy: 'name',
  sortDir: 'asc',
  uploadOpen: false, // the drop pool is not a permanent banner
  // The column browser's drags (ColumnBrowserResize, component 0.113.0), persisted per bucket.
  columnHeight: COLUMN_HEIGHT,
  columnWidths: {},
}

export const DEFAULTS = {
  r2: {
    ...BASE,
    // No variant sets and no segments in this store — grouping would be a no-op
    // toggle pretending to do something.
    groupVariants: false,
    foldSegments: false,
    pageSize: 500,
    // It's the bucket you upload to, so newest-first is the useful order.
    sortBy: 'date',
    sortDir: 'desc',
  },
  b2: {
    ...BASE,
    groupVariants: true,
    foldSegments: true,
  },
}

function readStore() {
  try {
    return JSON.parse(localStorage.getItem(STORE_KEY)) || {}
  } catch {
    return {}
  }
}

export function loadSettings(bucketId) {
  const base = DEFAULTS[bucketId] || BASE
  const saved = readStore()[bucketId]
  /* Spread over the defaults so a setting added later arrives with its default instead of
   * `undefined`. `columnHeight` is FORCED: settings are per bucket, so each one used to return at
   * whatever height it was last dragged to and the pane jumped on every switch.
   *
   * `layout` is NOT forced off here, and that is a deliberate difference from kol-r2b2. Its ruling
   * (user 2026-08-27, cards off on every load) was made because the wall sits UNDER the column
   * browser against a live bucket, where showing cards duplicated the columns and pulled thumbnails
   * for a surface you were not looking at. Neither cost exists here — the fixture has no network
   * and the whole point is to SEE the files — and an empty FILES bar reads as a broken app. */
  return { ...base, ...(saved || {}), columnHeight: COLUMN_HEIGHT }
}

export function saveSettings(bucketId, settings) {
  const store = readStore()
  store[bucketId] = settings
  try {
    localStorage.setItem(STORE_KEY, JSON.stringify(store))
  } catch {
    // Private mode / quota. Settings stay for the session; not worth surfacing.
  }
}

export function resetSettings(bucketId) {
  const store = readStore()
  delete store[bucketId]
  try {
    localStorage.setItem(STORE_KEY, JSON.stringify(store))
  } catch { /* see above */ }
  return { ...(DEFAULTS[bucketId] || BASE) }
}
