---
component: HubHomeContract
source: kol-shell/src/HubHome.jsx#L1-L83 · kol-fxr/src/AppLayout.jsx#L330-L357 · kol-mirror/src/pages/HomePage.jsx#L98-L151 · kol-monitor/src/pages/HomePage.jsx#L85-L152
staged: 2026-10-23
status: draft
deps: [HubHome, CatalogPage, ContentCard, ContentRow, ContentText, ContentFilters, Button]
---

# HubHomeContract — Home is a closed data contract on `HubHome`; the hub draws every card

## Purpose
The user's complaint, 2026-10-23, with six screenshots in `~/dev/ref/app home/`: *"last session I was PROMISED
that home catalog, catalog preset and catalog cards WERE THE SAME in each repo… NONE of them were the same… you 3
share THE SAME HUB it should not DIFFER, that's literally the reason I made the hub… so I wouldn't have to
maintain 3 separate systems."*

The hub shares only the FRAME of Home. `HubHome` is `CatalogPage` + masthead + RECENT · SAVED + the walkthrough,
and then spreads `...rest` into `CatalogPage` last (`HubHome.jsx:80`), so every consumer still writes its own
`toCard`, picks its own `preset` / `rowVariant` / `listLayout`, names its own filter label and bolts on its own
CSS. The `app` preset (CatalogAppVariant, 2026-10-23) froze the LOOK — `{ cardVariant: 'app', rowVariant: 'app' }`
and nothing else — but not the MAPPING, which is where `shelf` went further (`toSlideCard`: the consumer hands
data, the page draws the slots; built on the user's *"freeze this so I can use AS IS again"*). Finish `app` the
way `shelf` was finished, at the `HubHome` tier, and the three Homes cannot drift again.

**Two conditions from the user, both binding before any consumer adopts:**
1. **Build it in `apps/hub` first** (or a new `apps/app-hub` if hub is spoken for) **on dummy data**, so he reviews
   how it is thought at desktop and phone widths THERE. *"Before applying to all three repos I need to see how it
   is thought, BECAUSE AGAIN I'M NOT DOING IT AGAIN."* Nothing ships to fxr · mirror · monitor until he has
   signed that off.
2. **The `app` card and row get a real mobile breakpoint pass** — *"clearly the catalog content card didn't go
   through mobile breakpoint check."* Checked in that reference app at 390 and 768, in a browser, both layouts.

## Evidence — how the three differ today (all on kol-shell 0.75.0 · kol-component 0.295.1)
| | fxr `AppLayout.jsx:330` | mirror `HomePage.jsx:119` | monitor `HomePage.jsx:112` |
|---|---|---|---|
| file card text | title · date size (no `meta`) | title · date size (`detail`, which `app` never draws) | title · **meta** · date size — three rows |
| filter label | All Files | Studio | All Presets |
| filter bar | default | default | `filtersProps.tone: 'sunken'` |
| list view | hub's stacked row | hub's stacked row | `listLayout: 'grid'` — the four-across rows the user rejected 2026-09-26 |
| template card | New File, always first | Empty Studio **only when signed out** (`HomePage.jsx:100-104`) — hence on the phone, not the desktop | Empty 7U, always first |
| SAVED | the user's files | **memory slots** from `mirror-archive` | the user's files |
| card extras | — | — | `fit: 'compact'`, `meta` duplicating `detail`, `.no-card-hover` CSS (`monitor-overrides.css:46-63`, pre-dates 0.293.0) |
| media | `thumb` src | `<PatchThumb/>` node or `<img>` | `<img>` node in grid, src string in list |
| size | `new Blob([JSON.stringify(x)]).size` | same, written again | same, written again |
| row | `rowVariant: 'app'` back over the hub's hard-set `file` | same | same |

The hub's own defaults are wrong for every real consumer: `HubHome.jsx:67-68` hard-sets `rowVariant="file"` +
`listLayout="stack"`, and all three pass `preset: 'app'` + `rowVariant: 'app'` back over it. The DS's own
`apps/hub` (`App.jsx:95-99`), `apps/editor-hub` (`AppLayout.jsx:242-246`) and `apps/mixer-hub`
(`HomePage.jsx:104-110`) are three more hand-written `toCard`s on `detail` — six consumers, six mappings.

(The date · size wrap on the phone is NOT in this list — 0.295.0 made it deliberate via `AppCardDateSizeWrap`
and it is identical everywhere. Whether the user wants it is condition 2's to answer.)

## Anatomy — one Home, drawn by the hub
```
HubHome                                   masthead (app.name · app.subtitle, sm · mono)
├─ ContentFilters                         title "All Files" · filterGroups (data) · search
├─ views                                  RECENT · SAVED (the hub's strip, as today)
├─ layouts                                LIST · GRID, grid default
├─ RECENT                                 [template] + the 12 newest files
│  ├─ template card   variant app         title · summary · cover — no date, size, verbs or download
│  └─ file card       variant app         title · summary (meta) · date · size — cover, download on the cover,
│                                         cog + trash plate, Rename · Duplicate · Delete on the cog and right-click
├─ SAVED                                  every file, newest first — files, never anything else
├─ list                                   the app ROW, stacked (one per line) — never the four-across catalog rows
└─ action row                             the app's one button (label · onClick) + the hub's Walkthrough toggle
```

## Props — what a consumer may pass, and nothing else
| prop | type | default | controls |
|------|------|---------|----------|
| `files` | `[{ id, name, summary?, updatedAt (ms), bytes?, cover? (src \| node) }]` | `[]` | the user's files — the ONLY source of file cards |
| `template` | `{ name, summary?, cover?, onOpen }` | none | the blank start; first in RECENT, absent from SAVED, drawn without file parts |
| `onOpen(file)` | fn | required with `files` | card and row click |
| `onDownload(file)` | fn | — | the cover's download; absent → no chip |
| `onRename(file, name)` · `onDuplicate(file)` · `onRemove(file)` | fn | — | the verbs; a verb not passed is not drawn (CatalogAppVariant's rule) |
| `filterGroups` | ContentFilters' `[{ label, key, values, exclusive? }]` | none | monitor's Type · Tags; `exclusive` replaces `filtersProps.mutuallyExclusiveFilters` |
| `action` | `{ label, onClick }` | none | the bottom button — the hub draws the `Button tone="grey" size="md"`, the consumer writes no JSX (shelf's rule) |
| `walkthrough` · `views` · `title` · `subtitle` | as today | as today | unchanged |

Gone from `home`, and the hub warns in dev when it sees one: `toCard` · `items` · `preset` · `cardVariant` ·
`rowVariant` · `listLayout` · `defaultLayout` · `filtersTitle` · `filtersProps` · `className` · `actions`
(ReactNode) · `minColumn` · `maxColumns`. `...rest` no longer reaches `CatalogPage`.

## Styling
Nothing new to draw — the `app` card and row as shipped (`06-content-card-system.md` § `app`), composed by the
hub instead of by six consumers. The hub fixes: `preset="app"`, `listLayout="stack"`, `defaultLayout="grid"`,
`filtersTitle="All Files"`, RECENT cap 12, `summary → meta`, `bytes → size`, `updatedAt → date`, `cover → media`
(none → the placeholder). **Drop on recreation:** every consumer's `toCard`, monitor's `.no-card-hover` block,
`fit: 'compact'`, `filtersProps.tone: 'sunken'`, the three `Blob` byte counts (consumers pass `bytes`;
`formatSize` stays the DS's).

## States & interactions
As `app` already ships: no hover fill (0.293.0), download click stops at the chip (0.294.0), date · size never
break inside a value (0.295.0), Rename prompts and Delete confirms via `useModal`. Unchanged.

## Mobile breakpoint pass — condition 2
In the reference app, at 390 (two 171px columns) and 768, grid AND list, light and dark:
- the cover's download chip over a cover with text in it (monitor's rack art: the chip sits over "PATC…")
- the action plate's `pr-[var(--kol-plate-actions-w)]` narrowing the text block — `ContentCard.jsx:332` — which
  is what pushes size to a second line on a file card but not on the template card beside it
- the two-line date · size (`ContentText.jsx:335-361`): keep or re-rule, measured, not inferred
- the row at 390: thumb · title · summary · date · size · verbs in 358px
- a 16px gutter and no horizontal scroll on the page
Record the measurements in the resolution. Fix what fails in kol-component; the contract ships on the fixed card.

## Dependencies
`CatalogPage` is untouched — the Library pages differ per app on purpose (fxr: Type · Palettes · Patterns), and
`shelf` · media admin · brand keep their `toCard`. Only `HubHome` closes. Six consumers migrate: `apps/hub`
(the reference, first — dummy files via `Art`, as today), `apps/editor-hub`, `apps/mixer-hub` in this repo;
kol-fxr, kol-mirror, kol-monitor on the return. Docs: `04-compositions/16-app-anatomy.md:60` ("list = the file
row stacked" → the app row, and the contract), `03-components/06-content-card-system.md:88` (the mapping, under
`app`).

## Recreation notes
- Tier: organism, `kol-shell` · `HubHome`. A `toAppCard(file, handlers)` next to `toSlideCard` is fine as the
  implementation, but the GUARANTEE is that `HubHome` builds `items` and `toCard` itself and passes no unknown
  prop through — a consumer with no knob cannot drift.
- Two kinds of item only: the template and a file. Mirror's memory slots are not files and leave Home for its
  Library on adoption (fxr's ruling of plan 39: Home is your files, Library is saved presets).
- One label everywhere: "All Files". The user picked it; a consumer cannot rename it.
- `apps/hub` is the review surface: ship it there first, tell kol-fxr the URL/route, and wait for the user's
  sign-off before the version that the three apps adopt is cut. Nothing in this ticket is "the same" until he
  has seen all three side by side.
- On the return, kol-fxr also deletes its `/` → `/randomiser` touch redirect (`AppLayout.jsx:308`) so a phone gets
  this Home like the other two; New File opens the chooser on touch. That is fxr's, noted so the DS knows the
  phone Home will be seen on a real device.

## 🟠 ADDRESSED — 2026-10-23 · built in `apps/hub`, unpublished, awaiting the user's review

Nothing published; nothing to fxr · mirror · monitor until he has signed it off (condition 1). kol-shell 0.76.0 and
kol-theme 0.184.0 are in the tree with their changelogs.

**Review surface:** `pnpm hub` → `http://localhost:5176/#/` (built: `ui.kolkrabbi.io/apps/hub/#/`). Fourteen dummy
files — one long name, some without a summary, some without a cover (the placeholder) — the Empty tool template,
a Kind filter (exclusive), New. Rename · Duplicate · Delete write the app's state through the DS dialogs; Download
saves the file as JSON. Screenshots of every pass in `_tmp/2026-10-23-hubhome-contract/shots/`.

**Built**
- **kol-shell 0.76.0** — `HubHome` is the contract: `files` · `template` · `onOpen` · `onDownload` · `onRename` ·
  `onDuplicate` · `onRemove` · `filterGroups` (`exclusive` per group → `mutuallyExclusiveFilters`) · `action`, plus
  `app` · `title` · `subtitle` · `views` · `defaultView` · `walkthrough` · `iconComponent`. The Hub fixes
  `preset="app"`, `listLayout="stack"`, `defaultLayout="grid"`, `filtersTitle="All Files"`, RECENT = the template +
  the twelve newest, SAVED = every file newest first, `summary → meta` · `updatedAt → date` · `bytes → size` ·
  `cover → media`; a verb not passed is not drawn. `...rest` no longer reaches `CatalogPage`; a retired prop warns
  once in dev. `CatalogPage` is untouched.
- **kol-theme 0.184.0** — `.kol-inline-control` takes a 32px reach on `pointer: coarse` (condition 2's one fix).
- Migrated here: `apps/hub` (the reference), `apps/studio`, `apps/editor-hub` (files = `loadLibrary().preset`;
  **no verbs** — the editor mirrored here exports no storage writes, fxr's `renameStored` · `duplicateStored` ·
  `removeStored` are ahead of the mirror), `apps/mixer-hub` (files = the saved patches, the memory slots left Home;
  **no rename** — the mixer store has none), and the showcase `HubHome` preview. `apps/hub` and `apps/mixer-hub`
  mount `ModalProvider` in `main.jsx` — `AppShell` does not mount one (the ticket's "every AppShell page has" is
  not so; without it the DS dialogs fall back to native, with a console warning).
- Docs: 16-app-anatomy (the Hub table's Home row), 06-content-card-system (the mapping under `app`),
  11-shell-system (the Hub table); `AppHub` / `AppStudio` docblocks; `api-tables.json` regenerated.
- Gates: `pnpm validate` 31 of 32 (the standing retirements pair); `validate:render hub studio mixer-hub editor-hub`
  clean, 50 page views. Handlers in a browser (`verify.mjs` · `filters.mjs`): RECENT 13 (template + 12), SAVED 14
  without the template, cog → Rename · Duplicate · Delete, Duplicate 14 → 15, Delete through the DS dialog 15 → 14,
  Rename prompt prefilled and written, Kind exclusive (draft 6 → final 6, not 12), 0 console errors or warnings in
  every pass.

**Condition 2 — the mobile pass, measured** (`measure.mjs`; apps/hub, grid and list, light and dark, 390 touch ·
768 touch · 1440 — light and dark measure identical):

| | 390 | 768 | 1440 |
|---|---|---|---|
| gutter | 20 | 32 | 48 — `--kol-pad-section-x`; the ticket's 16 is not the DS's number (08-breakpoints rule 4) |
| horizontal scroll | none | none | none |
| grid columns | 2 × 163 | 3 × 203 | 6 × 196 |
| cover · download chip | 163² · 32² at 12/12 | 203² · 32² at 12/12 | 196² · 32² at 12/12 |
| file card's text column | 139 − 28 = 111 | 179 − 28 = 151 | 172 − 28 = 144 |
| date · size | **two lines** (72 + 24 + 43 = 139 > 111) | one line | one line |
| row | 350 × 89 · thumb 72 · text 226 · verbs 16 at the edge · date · size one line | 656 × 89 | 1296 × 89 |
| cog · trash box | 16 × 16 — **reach 32 on touch** (0.184.0) | 16 | 16 |

Decided, for review:
- **The two-line date · size at 390 stays** (0.295.0's rule). Two columns of 163 is the grid law (floor 160); a
  file card's text column is 111 after the 28px the verbs reserve, and the pair needs 139 — the size drops whole,
  level with the trash. Dropping the verbs column on the phone would remove the only touch path to Rename ·
  Duplicate (no right-click on touch).
- **The download chip over a cover's content stays**: 32² on its own `oq-12` plate at the frame-control inset,
  always visible — it is the cover's control, and what sits under it is the cover. No control overlaps another
  (render R2 clean).
- **The reserved column** (`pr-[var(--kol-plate-actions-w)]`, 28px) narrows a file card's text against the
  template's: 111 vs 139 at 390. Kept — it is the column the controls live in; the template has none.
- **Fixed:** the cog and trash were 16 × 16 tap targets on a coarse pointer, half the touch rung. kol-theme
  0.184.0 gives `.kol-inline-control` an 8px reach past each edge under `pointer: coarse` (measured: a tap 6px
  outside the glyph hits, 10px does not); the glyph and the plate's geometry do not move at any width.
- The row stands 89 tall with a `meta` line (title · summary · date · size + the 24 pad) and the thumb stretches to
  it — 0.287.0's rule, the same at every width.

**On the return (after sign-off and the publish):** kol-fxr · kol-mirror · kol-monitor take kol-shell 0.76.0 +
kol-theme 0.184.0 and pass `files` · `template` · the handlers; drop `toCard`, `preset` · `rowVariant` ·
`listLayout` · `filtersTitle` · `filtersProps`, monitor's `.no-card-hover` block and `fit: 'compact'`, the three
Blob counts (pass `bytes`), mirror's memory slots (Library); fxr also drops its `/` → `/randomiser` touch redirect.
Receipts then.

## Review note from kol-fxr — 2026-10-23, read off `shots/desktop-1440-dark-grid.png`

The measured table says date · size is one line at 768 and 1440. The 1440 grid shot says otherwise for most
of its own files: Alpha (`1.2 KB`) and Bravo (`8.3 KB`) sit on one line, Charlie (`15.4 KB`), Delta, Echo,
Foxtrot, Golf, Hotel, India, Juliett, Kilo and Lima drop the size to a second line — two line counts in one
grid, decided by the length of the size string. `measure.mjs` read one card. A Home whose cards differ by
whether a file is over 10 KB is the kind of difference this ticket exists to end.

Proposed: the `app` CARD's date · size group takes `--kol-spacing-3` (12) instead of `--kol-spacing-6` (24).
Then `2026-10-23 · 999.9 KB` = 72 + 12 + ~55 = 139 fits the 144 column at 1440 and the 151 at 768 — one line
for every size — and at 390 every size wraps (72 + 12 + 36 = 120 > 111) — two lines for every card. One rule per
breakpoint, never per file. The row keeps 24. Re-measure with the 14 files, not one.

## 🟢 CLOSED — 2026-10-24 · kol-shell 0.77.0 · kol-theme 0.184.0 · kol-component 0.296.0 live

Published 2026-10-24 on the user's go (`pnpm hubs` was his review surface; the publish is the sign-off). kol-shell
0.77.0 carries `HubHome` as the data contract (0.76.0) plus the Studio wave of 2026-10-24, kol-theme 0.184.0 the touch
reach, kol-component 0.296.0 the card. Registry checked live. Adoption in kol-fxr · kol-mirror · kol-monitor runs step
by step from the kol-ds-ui session against each repo's twin (`apps/editor-hub` · `apps/mixer-hub` · `apps/rack-hub`),
the playbook `docs/operations/07-apps-tier/06-studio-adoption.md`; the three Homes and fxr's redirect are its steps 3
and 8. Receipt: kol-fxr's `lobby/outbox/HubHomeContract.md` re-syncs in its own session.
