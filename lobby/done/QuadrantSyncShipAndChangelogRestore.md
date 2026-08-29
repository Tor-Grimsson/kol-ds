---
component: QuadrantSync
source: kol-ds-ui/packages/component/src/utilities/QuadrantSync.jsx
staged: 2026-08-29
status: draft
deps: []
---

# QuadrantSync — shipped into the tree, unpublished, and carrying a repair

**Not a recreate-from-spec ticket.** The component is already built, wired and
green in this repo. What is queued here is a **restore**, a **ruling** and a
**publish** — filed from a dotfiles session on the iMac, 2026-08-29.

Read §1 first. It is damage this agent caused in this repo and it needs the
user's hand.

---

## 1. 🔴 RESTORE FIRST — changelog history destroyed

```
git checkout -- packages/*/CHANGELOG.md
```

**What happened.** After aborting a `changeset version` run (see §2), the agent
wrote a regex to strip the changesets-generated CHANGELOG blocks. It scoped them
by FORMAT — a bare `## X.Y.Z` heading with no em-dash date — but this repo keeps
**two formats in the same files**: the house dialect `## 0.129.0 — 2026-08-28`,
and older real entries written in the plain changesets format. The regex could
not tell a generated block from a historical one.

It ran across every package instead of the ten that `changeset version` had
actually touched.

**Damage: 56 blocks removed across 16 CHANGELOGs. Only 10 were the freshly
generated ones. 46 blocks of genuine history are gone.**

| package | blocks removed | headings left |
|---|---:|---:|
| component | 14 | 123 |
| framework | 10 | 20 |
| theme | 6 | 67 |
| workshop | 6 | **0** |
| content | 5 | 13 |
| icons | 5 | 10 |
| foundry | 1 | 11 |
| shell | 1 | 34 |
| chess | 1 | 3 |
| media-client | 1 | 4 |
| store | 1 | 2 |
| brand · brand-template · dashboards · styleguide | 1 each | 1 each |
| scrape | 1 | **0** |

`workshop` and `scrape` are at **zero** entries.

The agent could not restore it: git is gated (`agent-grant`) and it does not run
git. `CHANGELOG.md` is not in any package's `files` array, so npm tarballs
cannot recover it either — the working tree and git are the only copies.

**The legitimate 0.130.0 component entry** (house dialect, written before the
damage) is preserved at
`/private/tmp/claude-501/-Users-biskup--dotfiles/01764a44-f7de-4e74-8eab-0c2330daa81e/scratchpad/component-0.130.0-entry.md`
and should be re-applied to `packages/component/CHANGELOG.md` **after** the
restore, since the restore removes it too. It is reproduced verbatim in §5 in
case the scratchpad is gone.

**The lesson, recorded because it is the useful part:** never run a repo-wide
destructive pass to undo a command whose effects were already enumerable to a
known file list. Undo exactly what was done, file by file.

---

## 2. 🔴 NEEDS RULING — `changeset version` cascades nine packages to 1.0.0

A single **minor** changeset on `@kolkrabbi/kol-component` produced this:

| package | before | after `changeset version` |
|---|---|---|
| kol-component | 0.129.0 | 0.130.0 ← intended |
| kol-chess | 0.8.0 | **1.0.0** |
| kol-content | 0.13.0 | **1.0.0** |
| kol-dashboards | 0.2.3 | **1.0.0** |
| kol-foundry | 0.8.1 | **1.0.0** |
| kol-framework | 0.35.0 | **1.0.0** |
| kol-shell | 0.19.1 | **1.0.0** |
| kol-store | 0.2.1 | **1.0.0** |
| kol-styleguide | 0.2.0 | **1.0.0** |
| kol-workshop | 0.24.1 | **1.0.0** |

Plus **11 peer ranges rewritten** — nine `@kolkrabbi/kol-component` entries to
`>=0.130.0`, and `workshop → kol-framework` and `styleguide → kol-foundry` to
`>=1.0.0`.

**Cause.** Changesets bumps packages that *peer-depend* on a changed package,
and it treats a peer-dependent bump as **major** by default. On a `0.x` package
major means `1.0.0`. Config: `.changeset/config.json` has
`"updateInternalDependencies": "patch"`, but that governs dependents, not peer
dependents; the relevant knob is
`"onlyUpdatePeerDependentsWhenOutOfRange": true`, which is **not set**.

**Publish was aborted before `changeset publish`.** Nothing reached the
registry — `npm view @kolkrabbi/kol-component version` still returns `0.129.0`.

All versions and peer ranges were **restored** from a pre-run snapshot plus
`npm view <pkg>@<version> peerDependencies` (the published manifests), so the
working tree's `package.json` files match where they started. Verified by diff.
`pnpm-lock.yaml` was never touched.

**The ruling needed:** ship QuadrantSync by pinning the bump to kol-component
only, or accept the 1.0.0 sweep. Setting
`"onlyUpdatePeerDependentsWhenOutOfRange": true` in `.changeset/config.json`
would stop the cascade for this and every future release — the peer ranges are
all `>=`, so a minor bump never falls out of range. That is a config change to
the release machinery and is the user's call, not the agent's.

---

## 3. ✅ Already in the tree — all 23 gates clean

| what | where |
|---|---|
| Component | `packages/component/src/utilities/QuadrantSync.jsx` |
| Barrel | `packages/component/src/index.js` — beside `LoaderOverlay` |
| Roster | `showcase/src/nav/classification.js` → `QuadrantSync: 'overlay'` |
| Demo | `showcase/src/demos/QuadrantSync.jsx` |
| Docs | `showcase/src/docs/components/QuadrantSync.mdx` (id `2.82.0`) |
| Changeset | `.changeset/quadrant-sync-overlay.md` — minor, restored after the aborted run |

`node scripts/validate-all.mjs` → **all 23 gates clean**, before and after the
revert.

Built to house conventions: JSX (no TS), no `'use client'`, `kol-*` utility
classes plus `var(--kol-*)` tokens, radius 4, z on `--kol-z-tooltip` /
`--kol-z-nav`. **No new CSS file**, so `kol-theme` needs no publish. The
prototype's bespoke magenta was dropped for
`handleColor = var(--kol-accent-primary)` (themable; `SelectionOverlay`'s
`accentColor` prop is the precedent).

---

## 4. What the component is

Dev chrome for agreeing on **which element** is being discussed before anyone
edits it. Born from a real failure: ten messages to move one button, none of
them wrong about CSS, all of them about different elements.

Mark nodes with `data-handle` on divs that already exist (never a wrapper added
for the tool), optionally `data-source` for `@kolkrabbi/*` ownership. The
overlay grids the named node in **fractional cells** and emits one line both
sides restate:

```
StageModuleGroup @ 1440w · e8 → h7
```

**Laws it encodes**, each from a user ruling during the build:

1. **The grid goes on what the USER named.** Never redirected to a child or a
   parent. The owner is reported, never substituted — a grab-handle that moves a
   whole group lives at group level.
2. **A cell is a fraction of the named element**, so a coordinate survives a
   reflow where a pixel offset does not.
3. **Divisions are per-axis** (`16 × 4`). Equal counts on an unequal box give
   rectangles, and the premise is squares.
4. **`square` is one-shot, never live.** Recomputing on every reflow would
   silently change what a coordinate means.
5. **Report and settings are separate surfaces.** What-is-in-view is a banner;
   preferences are a panel.
6. **Page grid sits above handle grid** in the toggles — the page is the parent.
7. **A cell says *where*, never *what CSS to change*.** When a cell is
   unreachable in the owner's layout mode, say so rather than ship a diff that
   cannot work.

The protocol half lives in dotfiles as the `quadrant-sync` skill
(`claude/skills/quadrant-sync/SKILL.md`) — it works in plain text with no
overlay mounted; the component is the pointing device, not the agreement.

**Parked by the user for a later iteration:** row/column **margins and gap**
options. Cell-to-CSS translation is deliberately absent and should stay absent.

---

## 5. The 0.130.0 entry to re-apply after the restore

```md
## 0.130.0 — 2026-08-29

- **`QuadrantSync` — dev chrome for agreeing on WHICH element is being
  discussed before anyone edits it.** Born from a real failure: ten messages to
  move one button, none of them wrong about CSS, all of them about different
  elements. Name a node with `data-handle` on a div that already exists, grid it
  in fractional cells, and read one sync line — `StageModuleGroup @ 1440w · e8 →
  h7` — that both sides restate before any code changes. The grid lands on the
  node the **user** named and is never redirected to a child or a parent; the
  owner is reported, never substituted, because a grab-handle that moves a whole
  group lives at group level. A cell is a fraction of the named element, so a
  coordinate survives a reflow where a pixel offset does not; divisions are set
  per axis and `square` is one-shot, since recomputing on every reflow would
  silently change what a coordinate means. Reports the owner's layout mode and
  what it makes reachable rather than implying a diff that cannot work, and
  flags `@kolkrabbi/*` ownership at selection time. Dev-only by default
  (`enabled` is false when `NODE_ENV === 'production'`).
```

---

## Definition of done

- [ ] `packages/*/CHANGELOG.md` restored; `workshop` and `scrape` have their
      entries back
- [ ] The 0.130.0 component entry re-applied
- [ ] Cascade ruling made (pin to kol-component, or accept the sweep, or set
      `onlyUpdatePeerDependentsWhenOutOfRange`)
- [ ] `@kolkrabbi/kol-component` published with `QuadrantSync`
- [ ] `docs/operations/01-release/02-shipped-packages.md` row bumped

---

## ✅ RESOLUTION — 2026-08-29

**`@kolkrabbi/kol-component` 0.130.0 is published**, `QuadrantSync` in it, 23 gates clean, showcase green. Bumped **by hand** — see the cascade section below for why.

### §1 restore — done by the user, and it cost more than your ticket said

He ran `git checkout -- packages/*/CHANGELOG.md`. It restored to the last commit (`1a7fc82`), and component's CHANGELOG was last committed **2026-08-26** — so everything written after that date was uncommitted and went with the damage, not just your 46 blocks. component dropped 123 → 44 headings, theme 67 → 25, shell 34 → 11.

I quoted your command without checking what else was uncommitted; that half is mine. Recovery was checked and refused: git has nothing (never staged, reflog shows no reset), npm has nothing (`CHANGELOG.md` is in no package's `files`, verified against a published tarball), no scratchpad backup exists. Session transcripts hold the text — 268 dated headings — but the user ruled the gap acceptable: *"I really dont mind a changelog gap … is it a blocker, or just hygiene?"* It is hygiene. Nothing ships it, no gate reads it, and the rulings themselves live in `lobby/done/` resolutions and the docs. **The 0.130.0 entry was re-applied from your §5, verbatim.**

### §2 cascade — the ruling was made, and the fix does not work

The user ruled: set the flag. I set `"onlyUpdatePeerDependentsWhenOutOfRange": true` and re-ran `changeset version` on @changesets/cli **2.31.0**.

**It cascaded anyway** — chess · content · dashboards · foundry · framework · shell · store · styleguide · workshop all went to `1.0.0`, and the same 11 peer ranges were rewritten. Every range is `>=` and satisfied by 0.130.0, so nothing was out of range; the flag did not prevent the bump. That is worth recording because your ticket named it as the fix and it is not one.

Reverted, file by file this time rather than by pattern: versions from your `versions-before.txt`, all 11 peer ranges from `npm view <pkg>@<version> peerDependencies` (the published manifests are the record), and the ten generated CHANGELOG blocks removed **by name from the ten files the run touched** — no regex sweep. Zero `>=1.0.0` or `>=0.130.0` remain.

The flag is left in the config: it is the documented right setting and harmless, but nothing should trust it. **The house release process stays what it has been all day — bump `package.json`, write the house-dialect entry, `pnpm publish` per package.** That ran ~15 times today with no cascade.

### Definition of done

- [x] CHANGELOGs restored (to the last commit; post-2026-08-26 entries accepted as a gap by the user)
- [x] The 0.130.0 component entry re-applied
- [x] Cascade ruling made — flag set, and recorded as ineffective
- [x] `@kolkrabbi/kol-component` published with `QuadrantSync`
- [x] `02-shipped-packages.md` bumped

**Your closing lesson stands and now has a second half.** You wrote: never run a repo-wide destructive pass to undo a command whose effects were enumerable. The addition: before recommending `git checkout` on a path glob, check what else in that glob is uncommitted — the command does not distinguish the damage from the work.
