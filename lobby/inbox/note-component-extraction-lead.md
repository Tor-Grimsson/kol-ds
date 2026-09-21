# kol-noter has the notes system — DS to lead on how its 51 components should land

**Staged:** 2026-09-04 · from a kol-noter session
**Change:** a sequencing + spec-format call before any spec is written. No component work asked for yet.

---

## Why this is being asked, in the user's framing

kol-noter (`~/dev/projects/kol-docs/kol-noter`) was pulled back off the shelf for one reason: **it has the notes.** The note-taking and content surfaces — the editors' chrome, the overview tables, the metadata sidebar, the explorer tree, the card/tab vocabulary — were built out there and nowhere else, and they are now wanted **across multiple repos**, not just in that app.

So the repo needs decompartmentalising: the views, the tables, the sidebars, all of it logged and shipped through to the design system. The user's instruction was explicit that DS should **take the lead on how best to proceed**, rather than kol-noter deciding the shape and flinging 51 specs over the wall.

This is directly adjacent to work already in this queue: **`content-card-needs-no-cover`** (kol-client-olina, 2026-09-04) is about listing *markdown documents* as cards. Same content class, different consumer. If a notes vocabulary is forming in the DS, kol-noter is the repo that already has it built.

## What kol-noter has, measured not guessed

51 non-shadcn components. `src/components/ui/` (49 files) is stock shadcn and is out of scope — already portable, nothing to ship.

Every one was scored by what it imports. `@/lib/utils` is only `cn()`, so it counts as no coupling; the real signals are `store/NotesContext`, `@/lib/persistence/*` and `@/lib/tauri-bridge`.

| | count | meaning |
|---|---|---|
| **Pure** | 31 | no app imports — lifts as-is |
| **Props** | 16 | reads `NotesContext`; needs its data passed in. Mechanical, not a rewrite |
| **App** | 4 | bound to vault/filesystem/Tauri — not DS material |

Full per-component register, with LOC and notes: `~/dev/projects/kol-docs/kol-noter/docs/documentation/03-extraction/INDEX.md`

### The four groups, as kol-noter sees them

1. **Atoms & molecules (13)** — `Badge` `Button` `Avatar` `DateDisplay` `Hyperlink` `LabeledInput` `SectionHeader` `Tag` `DropdownSelect` `MetricCell` `MetricSelector` `MediaItem` `NoteTypeDropdown`. Mostly pure. `LabeledInput` and `DropdownSelect` carry a `default | table | filter` variant triple that the table pattern below is built on. Several (`Button`, `Avatar`, and the `LoadingStates` skeletons) are thin shadcn wrappers the DS very likely already owns — **kol-noter's assumption is those should NOT ship**, and DS should say so.

2. **The inline-edit table pattern (3 files, ~2,070 LOC)** — `OverviewRoot` (systems) / `OverviewSystem` (projects) / `OverviewProject` (notes). Three near-identical tables unified onto one pattern on 2026-02-09. The *pattern* is the asset, not the three files: inline cells via the atom variants · no row-hover highlight · click container to deselect · row click `stopPropagation` · clickable icon navigates down a level · dates as `MMM d, yyyy` · filter input in the header.

3. **Metadata sidebar (13 files)** — a shell (`MetadataSidebar`, 28 LOC) plus interchangeable `Section*` panels: `Title` `CoverImage` `Contacts` `Delete` `Metadata` `Metrics` `Connections` `Media`. The composition model is the reusable part; the per-level assemblies (`MetadataRoot/System/Project`) are probably app-only.

4. **App shell & navigation (10)** — `ExplorerSidebar` (1,099 LOC: hierarchy tree, resizable 56–480px, search — the biggest file in the repo), `Breadcrumbs`, `StatusBar`, `UserProfile`, `LoadingStates`, `ConflictResolutionDialog`, `HierarchyContent`, `NoteCard` (flip card), `NoteTabs`, `NotesList`.

Out of scope and listed only so nobody re-audits them: `vault-system/*`, the four editors' internals (TipTap, @dnd-kit blocks, the flowchart canvas), `ExternalChangeNotification`. Two possible exceptions inside that set — `note-editor/standard/Toolbar` (223, pure but TipTap-command shaped) and `VoiceRecorder` (215, pure but a feature not a primitive) — flagged rather than assumed.

## What kol-noter is asking DS to decide

1. **Sequencing.** kol-noter's instinct is atoms first, since tiers 2–4 compose from them. If the DS already owns most of that vocabulary, that order is wrong and the table pattern should go first. **DS's call.**
2. **Granularity.** One spec per component (51 tickets), or one spec per *pattern* (4 tickets: table, metadata sidebar, explorer, card/tab vocabulary)? The table pattern in particular is one idea in three files — three `/lobby-ds` specs would triple-count it.
3. **Which of the 31 pure ones the DS actually wants.** Extractability was measured; desirability was not. The register has a deliberately empty `Ship?` column waiting on that call.
4. **Spec format for the `Props` group.** For a component that reads `NotesContext`, does the spec list the context reads as the props the DS version takes, or does DS want kol-noter to props-ify in place first and spec the clean version?
5. **Naming.** kol-noter has its own `Badge`/`Button`/`Tag`/`Avatar` next to shadcn's. Whatever lands in the DS needs names that don't collide with what's already there — DS owns that vocabulary.

## Rejected alternative

Writing 51 `/lobby-ds` specs and letting the DS triage them. Rejected: it moves the whole triage cost into this queue, half of them would be duplicates of things the DS already ships, and the table pattern would arrive as three unrelated tickets. Asking first is one ticket instead of 51.

## Definition of done

- [ ] DS answers 1–5 above, or says "just send them and we'll sort it"
- [ ] kol-noter marks the register's `Ship?` column against that answer (the user's call per component)
- [ ] The agreed number of specs is staged via `/lobby-ds`, in the agreed order
- [ ] Receipt returned to `~/dev/projects/kol-docs/kol-noter/lobby/outbox/note-component-extraction-lead.md`
