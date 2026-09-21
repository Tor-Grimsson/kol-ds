# An `apps/*` tier in this repo, so a product is proved by USE before it is published — media first

**Staged:** 2026-09-21 · from a kol-r2b2 session
**Change:** repo structure (a third tier beside `packages/*`), plus one app built into it
**Concept doc — the source of truth:** `~/.dotfiles/docs/operations/systems/apps-tier/INDEX.md`
**Read that file first.** This ticket is the build order; the doc is the reasoning, and it is
the one place the concept is written. Do not restate it in this repo — link to it.

---

## The problem, in one case

The mobile media browser took **six published component versions** (0.209 → 0.215) to land one
screen. Every round was the same loop: guess, publish, version, bump, install, look, find the piece
that was missing, publish again. Two of those six existed only because a prop was documented on one
page and not forwarded to its sibling — something a person clicking through the app would have seen
in five seconds, and that no amount of reading the source surfaced.

That is not a media problem. It is the shape of every UI change this repo ships, and the user's
words for it:

> *"1000 round trips to kol-ds-ui npm package bullshit... every time comes with uncertainty of the
> publish is missing a piece because we couldn't proof it before publish."*

> *"These mini tools have their validity as products, but no home to reference — I always have to
> find the latest iteration and upstream that to sync with older models. The latest version should
> always be before its consumed."*

**There is nowhere in this repo to USE a product.** `showcase/` is presentation — its own
package.json says so, a set page lists its member components and links each to a component page, and
`/sets/preview/:slug` is described in the source as an iframe src. `workbench/` is Ladle: one
component, blank stage, 90 stories. Both are correct at what they do. Neither lets anyone click
through a working tool and find out whether the design holds while it is being used.

The consequence is that the only place a product can be exercised is a consumer repo holding real
credentials and real data — so concept ownership has drifted into consumers, and changes now route
through one consumer's specific use case into repos that were never consulted.

**Concrete evidence of the cost.** The media upload surface exists twice: `src/UploadZone.jsx` in
kol-r2b2, and a fork in kol-client-olina where the client added a folder-creation field and
browser-side image conversion — because this repo had nowhere to put them and they could not reach
this repo. Two copies of one product's upload, diverging, neither canonical.

## The fix

### 1. The tier

Three tiers, not two:

| tier | what it is | published |
|---|---|---|
| `packages/*` | the design system — what other repos install | **yes** |
| `apps/*` | the products, run as real programs over fake data | **never** |
| consumer repos | the same products wired to real providers, auth and data | n/a |

`showcase` and `workbench` move under `apps/` — `apps/showcase`, `apps/workbench` — and
`pnpm-workspace.yaml` gains `apps/*`. **`packages/*` does not move.** Packages are what you publish;
apps are what you run. That distinction is the whole point of the split and collapsing it loses it.

Moving the two existing workspaces is a rename plus a workspace-glob edit; their deps are
`workspace:*` and resolve by name, so nothing in their imports changes.

### 2. The first app — `apps/media`

**One app. Not a sweep.** The estate has many candidates — the 2D editor, effect tools, 3D tools,
vector tools, libraries, markdown/note parsers, the shared home-and-settings shell that fxr, mirror
and monitor all use, the per-client brand setup. **Do not pull them in now.** The tier must be
*designed* for any number of tools and *populated* one at a time; several half-built apps prove
nothing. Media is first because it is furthest along, has three live consumers, and its missing half
is costing real work today.

`apps/media` is a Vite app with its own `pnpm dev`, importing `@kolkrabbi/kol-*` by name exactly as a
consumer does. It renders the media product and nothing else.

### 3. The data rule

The app runs on **fake, mutable, in-memory data** with a **Clear changes** button that resets it.

- Content does not matter. Any plausible fixture tree will do.
- **Every operation the product offers must actually execute against it** — that is the entire
  purpose. An operation that cannot be performed has not been proved.
- Session-lifetime browser memory. Nothing persisted, nothing fetched, no credentials.
- The reset button is required so destructive operations can be exercised repeatedly.

**No provider.** Pages, Vercel, Supabase, R2, a client's own bucket — that is the consumer's choice,
not this repo's. This repo supplies a functional system. An app in this tier has no backend at all.

The existing `showcase/src/sets/record-manager-cms.jsx` already proves this works: `useState(SEED)`,
165 lines, rows you can actually edit. The pattern is not new, it just has no mandate and lives in
the presentation tier.

### 4. What media has to become

Today the media product has no file management worth the name. A folder is not a thing that can be
created, renamed, moved or deleted — it is derived from object keys, so none of those verbs exist
anywhere in the stack.

**The reference is ordinary: Finder, Dropbox, iCloud Drive, Google Drive.** Create / rename / move /
delete folders. Right-click context menus (there is currently no `onContextMenu` anywhere in
`packages/component`). Drag to move. Multi-select. Search. Tags. Smart folders. View modes that
switch without scrolling past a full-height browser to reach them.

Treat that list as the direction, **not as a specification to be implemented literally**. The user's
framing, verbatim:

> *"it's a fucking file browser system with operations, like Dropbox or Apple Cloud or Google Drive
> — we are just doing it within our system and means... we might want a search system, a better way
> to change mode, rearrange files, tag folders, make a smart system. Don't get hung up on details
> when generally talking about a concept."*

Design it as a file-management product. Build the fake tree first, then design against it.

### 5. A note on the current component surface

`MediaLibraryPages.jsx` calls exactly four things on the injected client — `buckets`, `listMedia`,
`deleteObject`, `renameObject` — and upload is not in this repo at all. That is a description of
*today*, offered so the fake is quick to write; it is **not** the target surface. The target is the
product above, and the client shape should follow it rather than constrain it.

Also worth fixing while the app exists to show it: the header and the column browser are one
component (`LibraryHeader` renders inside both `MediaLibraryBrowse` and `MediaLibraryLibrary`), and
the browser and the grid/list wall are two separate pages both always rendered rather than two views
of one surface. That is why uploading means pressing Upload and then scrolling past a full-height
browser to reach the drop zone.

## Rejected alternatives

- **Another showcase page / set.** Tried in this conversation and wrong. `sets/media-library.jsx`
  already renders both media pages — but bound to the live bucket, read-only, because the write verbs
  are deliberately not in the browser-shipped client. A set proves composition; it cannot prove
  operations.
- **One shared sandbox app hosting every tool.** That is showcase again under a new name. The point
  is to use *one product*, not to view many.
- **Putting `packages/` under `apps/`.** Published and runnable are different things and the folder
  split is what keeps them distinguishable.
- **Doing it per-consumer with `kol-link`.** kol-link removes the publish from the loop, and should
  keep being used, but it still requires a consumer with real data and credentials to be the place
  design happens. That is the thing being fixed.
- **Copying the concept doc into this repo.** One file in dotfiles, linked from here. Variants of the
  same explanation drifting apart is the failure being avoided.

## Definition of done

- [ ] `pnpm-workspace.yaml` carries `apps/*`; `showcase` and `workbench` live at `apps/showcase` and `apps/workbench`; `packages/*` unmoved; both still run.
- [ ] `apps/media` exists, runs on its own `pnpm dev`, imports `@kolkrabbi/kol-*` by name, and is excluded from publishing.
- [ ] It runs on an in-memory fixture tree with **no** network, provider or credentials.
- [ ] Every file/folder operation the UI offers executes against that tree — at minimum create, rename, move, delete, for both files and folders.
- [ ] A **Clear changes** control resets the tree to its seed.
- [ ] `docs/` in this repo carries a pointer to `~/.dotfiles/docs/operations/systems/apps-tier/INDEX.md` — a link, not a restatement.
- [ ] No second app is started until media is built and has been clicked through.

## What is explicitly NOT asked for here

- No published version is required to close this. Nothing in this ticket needs to reach a consumer.
- No change to kol-r2b2. The consumer adopts later, once the product is proved.
- No decision about hosting, providers or persistence.
