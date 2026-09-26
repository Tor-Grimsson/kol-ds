/* THE IMAGINED OLINA SETUP'S DISPLAY DEFAULTS, per bucket (2026-09-26). Lived in apps/media's own
 * settings module, so the same tool in apps/media-shell opened on the DS base instead — a 528px
 * browser, poster previews, no wall (user: "media in shell is just media in shell.. so there
 * shouldnt really be a reason to diff"). Both apps read these now, through `useFixtureMedia`.
 *
 * Ported from kol-r2b2 with its rulings intact. Every one is a DEFAULT, never a gate. */

import { KINDS, DEFAULT_KINDS } from '@kolkrabbi/kol-component/utilities/mediaKinds'

export const ALL_KINDS = [...KINDS, 'segments', 'system']

// Shared floor. Per-bucket blocks below override only what genuinely differs.
export const BASE = {
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
  // The column browser's drags (ColumnBrowserResize, component 0.113.0), persisted per bucket.
  /* what is left of the window (the DS measures it) — replaced apps/media's hand-counted
   * `calc(100dvh - 212px)`, which only fit apps/media's own header and padding */
  columnHeight: 'fill',
  columnWidths: {},
}

export const DEFAULTS = {
  r2: {
    ...BASE,
    // No variant sets in this store — grouping would be a no-op toggle pretending
    // to do something. Segments ARE here now (video/softforms-stream), and a chunk
    // that cannot play alone is hidden behind its stream by default.
    groupVariants: false,
    foldSegments: true,
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
